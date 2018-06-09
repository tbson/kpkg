/* @flow */
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import CustomModal from 'src/utils/components/CustomModal';
import {apiUrls, defaultFormValues} from '../_data';
import type {FormValues, FormValuesWithCheck} from '../_data';
import ConfigForm from '../forms/ConfigForm';
import ConfigModal from '../forms/ConfigModal';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import {Pagination, SearchInput} from 'src/utils/components/TableUtils';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    list?: Array<FormValuesWithCheck>,
};
type States = {
    dataLoaded: boolean,
    modal: boolean,
    list: Array<FormValuesWithCheck>,
    formValues: FormValues,
    formErrors: Object,
};

export class ConfigTable extends React.Component<Props, States> {
    nextUrl: ?string;
    prevUrl: ?string;

    state = {
        dataLoaded: false,
        modal: false,
        list: [],
        formValues: defaultFormValues,
        formErrors: {},
    };

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.getList();
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: States) {
        const {list} = nextProps;
        if (nextProps.list) return {list};
        return null;
    }

    setInitData = (initData: Object) => {
        this.nextUrl = initData.links.next;
        this.prevUrl = initData.links.previous;
        this.setState({
            dataLoaded: true,
            list: [...initData.items],
        });
    };

    getList = async (params: Object = {}, url: ?string = null): Promise<?Array<FormValuesWithCheck>> => {
        const result = await Tools.apiCall(url ? url : apiUrls.crud, 'GET', params);
        if (result.success) {
            result.data.items = result.data.items.map(item => {
                item.checked = false;
                return item;
            });
            this.setInitData(result.data);
            return result.data.items ? result.data.items : [];
        }
        return null;
    };

    toggleModal = async (modalName: string, id: ?number = null): Promise<Object> => {
        // If modalName not defined -> exit here
        if (typeof this.state[modalName] == 'undefined') return {};

        const state = {
            [modalName]: !this.state[modalName],
            formValues: {},
            formValues: defaultFormValues,
            formErrors: {},
        };

        if (id) {
            switch (modalName) {
                case 'modal':
                    const result = await Tools.apiCall(apiUrls.crud + id.toString(), 'GET');
                    if (result.success) {
                        state.formValues = result.data;
                    }
                    this.setState(state);
                    return state;
            }
        }
        this.setState(state);
        return state;
    };

    handleSubmit = async (event: Object): Promise<Object> => {
        event.preventDefault();

        const params = Tools.formDataToObj(new FormData(event.target));
        const isAdding = params.id ? false : true;
        const result = isAdding ? await this.handleAdd(params) : await this.handleEdit(params);
        const {data, error} = Tools.parseDataError(result);
        const {list} = this.state;

        if (!Tools.isEmpty(error)) {
            // Have error -> update err object
            this.setState({formErrors: error});
            return error;
        }

        if (isAdding) {
            list.unshift({...data, checked: false});
        } else {
            const index = list.findIndex(item => item.id === params.id);
            const {checked} = list[index];
            list[index] = {...result.data, checked};
        }

        // No error -> close current modal
        this.setState({list});
        this.toggleModal('modal');
        return data;
    };

    handleAdd = async (params: FormValues): Promise<Object> => {
        try {
            return await Tools.apiCall(apiUrls.crud, 'POST', params);
        } catch (error) {
            return Tools.commonErrorResponse(error);
        }
    };

    handleEdit = async (params: FormValuesWithCheck): Promise<Object> => {
        try {
            const id = String(params.id);
            return await Tools.apiCall(apiUrls.crud + id, 'PUT', params);
        } catch (error) {
            return Tools.commonErrorResponse(error);
        }
    };

    handleToggleCheckAll = (): Array<FormValuesWithCheck> => {
        let {list} = this.state;
        let checked = false;
        const checkedItem = list.filter(item => item.checked);
        if (checkedItem.length) {
            checked = checkedItem.length === list.length ? false : true;
        } else {
            checked = true;
        }
        list = list.map(value => ({...value, checked}));
        this.setState({list});
        return list;
    };

    handleCheck = (event: Object): FormValuesWithCheck => {
        const id = parseInt(event.target.id);
        const {list} = this.state;
        const index = list.findIndex(item => item.id === id);
        list[index].checked = event.target.checked;
        this.setState({list});
        return list[index];
    };

    handleRemove = async (id: string): Promise<Array<FormValuesWithCheck>> => {
        const listId = id.split(',');
        if (!id || !listId.length) return [];
        let message = '';
        if (listId.length === 1) {
            message = 'Do you want to remove this item?';
        } else {
            message = 'Do you want to remove selected items?';
        }
        const decide = window.confirm(message);
        if (!decide) return [];
        const result = await Tools.apiCall(apiUrls.crud + (listId.length === 1 ? id : '?ids=' + id), 'DELETE');
        let list = this.state.list ? this.state.list : [];
        if (result.success) {
            const listId = id.split(',').map(item => parseInt(item));
            list = list.filter(item => !listId.includes(item.id));
            this.setState({list});
            return list;
        }
        return [];
    };

    handleSearch = async (event: Object): Promise<?Array<FormValuesWithCheck>> => {
        event.preventDefault();
        const {searchStr} = Tools.formDataToObj(new FormData(event.target));
        if (searchStr.length > 2) {
            return await this.getList({search: searchStr});
        } else if (!searchStr.length) {
            return await this.getList();
        }
        return null;
    };

    render() {
        if (!this.state.dataLoaded) return <LoadingLabel />;
        const {list} = this.state;
        const formValues = this.state.formValues ? this.state.formValues : defaultFormValues;
        const formErrors = this.state.formErrors ? this.state.formErrors : {};
        return (
            <div>
                <SearchInput onSearch={this.handleSearch} />
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th className="row25">
                                <span
                                    className="oi oi-check text-info pointer check-all-button"
                                    onClick={() => this.handleToggleCheckAll()}
                                />
                            </th>
                            <th scope="col">Key</th>
                            <th scope="col">Value</th>
                            <th scope="col" style={{padding: 8}} className="row80">
                                <button
                                    className="btn btn-primary btn-sm btn-block add-button"
                                    onClick={() => this.toggleModal('modal')}>
                                    <span className="oi oi-plus" />&nbsp; Add
                                </button>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {list.map((data, key) => (
                            <Row
                                className="table-row"
                                data={data}
                                key={key}
                                toggleModal={this.toggleModal}
                                handleRemove={this.handleRemove}
                                onCheck={this.handleCheck}
                            />
                        ))}
                    </tbody>

                    <tfoot className="thead-light">
                        <tr>
                            <th className="row25">
                                <span
                                    className="oi oi-x text-danger pointer bulk-remove-button"
                                    onClick={() => this.handleRemove(Tools.getCheckedId(list))}
                                />
                            </th>
                            <th className="row25 right" colSpan="99">
                                <Pagination
                                    next={this.nextUrl}
                                    prev={this.prevUrl}
                                    onNavigate={url => this.getList({}, url)}
                                />
                            </th>
                        </tr>
                    </tfoot>
                </table>
                <ConfigModal
                    open={this.state.modal}
                    formValues={formValues}
                    formErrors={formErrors}
                    handleClose={() => this.setState({modal: false})}
                    handleSubmit={this.handleSubmit}
                />
            </div>
        );
    }
}
export default withRouter(ConfigTable);

type RowPropTypes = {
    data: FormValuesWithCheck,
    toggleModal: Function,
    handleRemove: Function,
    onCheck: Function,
};

export class Row extends React.Component<RowPropTypes> {
    render() {
        const {data, toggleModal, handleRemove, onCheck} = this.props;
        return (
            <tr>
                <th className="row25">
                    <input className="check" type="checkbox" checked={data.checked} onChange={onCheck} />
                </th>
                <td className="uid">{data.uid}</td>
                <td className="value">{data.value}</td>
                <td className="center">
                    <a className="editBtn" onClick={() => toggleModal('modal', data.id)}>
                        <span className="editBtn oi oi-pencil text-info pointer" />
                    </a>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <a className="removeBtn" onClick={() => handleRemove(String(data.id))}>
                        <span className="removeBtn oi oi-x text-danger pointer" />
                    </a>
                </td>
            </tr>
        );
    }
}
