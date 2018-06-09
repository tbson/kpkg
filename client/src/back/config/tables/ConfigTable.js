/* @flow */
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import CustomModal from 'src/utils/components/CustomModal';
import {apiUrls, defaultFormValues} from '../_data';
import type {FormValues, FormValuesWithCheck} from '../_data';
import ConfigForm from '../forms/ConfigForm';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import DefaultModal from 'src/utils/components/DefaultModal';
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
        const dataLoaded = true;
        if (list) return {list, dataLoaded};
        return null;
    }

    toggleModal = async (modalName: string, formValues: Object = {}) => {
        const formErrors = {};
        const modalState = this.state[modalName];
        if (!modalName || modalState === undefined) return;

        const state = {
            [modalName]: !modalState,
            formValues,
            formErrors,
        };
        this.setState(state);
    };

    setInitData = (initData: Object) => {
        this.nextUrl = initData.links.next;
        this.prevUrl = initData.links.previous;
        this.setState({
            dataLoaded: true,
            list: [...initData.items],
        });
    };

    getList = async (url: string = '', params: Object = {}) => {
        const result = await Tools.getList(url ? url : apiUrls.crud, params);
        if (result) {
            this.setInitData(result);
        }
    };

    handleSearch = async (event: Object) => {
        event.preventDefault();
        const {search} = Tools.formDataToObj(new FormData(event.target));
        if (search.length > 2) {
            await this.getList('', {search});
        } else if (!search.length) {
            await this.getList();
        }
    };

    handleSubmit = async (event: Object) => {
        event.preventDefault();

        const params = Tools.formDataToObj(new FormData(event.target));
        const isEdit = params.id ? true : false;
        let url = apiUrls.crud;
        if (isEdit) url += String(params.id);

        const {data, error} = await Tools.handleSubmit(url, params);
        const isSuccess = Tools.isEmpty(error);
        isSuccess ? this.onSuccessSubmit(isEdit, data) : this.setState({formErrors: error});
    };

    onSuccessSubmit = (isEdit: boolean, data: FormValues) => {
        const list = isEdit ? this.onSuccessEditing(data) : this.onSuccessAdding(data);
        this.setState({list});
        this.toggleModal('modal');
    };

    onSuccessAdding = (data: FormValues): Array<FormValuesWithCheck> => {
        const {list} = this.state;
        const newItem = {...data, checked: false};
        list.unshift(newItem);
        return list;
    };

    onSuccessEditing = (data: FormValues): Array<FormValuesWithCheck> => {
        const {id} = data;
        const {list} = this.state;
        const index = list.findIndex(item => item.id === id);
        const oldItem = list[index];
        const newItem = {...data, checked: oldItem.checked};
        list[index] = newItem;
        return list;
    };

    handleRemove = async (id: string) => {
        let {list} = this.state;
        const url = apiUrls.crud;
        const deletedIds = await Tools.handleRemove(url, id);
        if (deletedIds && deletedIds.length) {
            list = list.filter(item => !deletedIds.includes(item.id));
            this.setState({list});
        }
    };

    handleCheck = (event: Object) => {
        const {id, checked} = event.target;
        const {list} = this.state;
        const index = list.findIndex(item => item.id === parseInt(id));
        list[index].checked = checked;
        this.setState({list});
    };

    handleToggleCheckAll = () => {
        let {list} = this.state;
        const checked = Tools.checkOrUncheckAll(list);
        list = list.map(value => ({...value, checked}));
        this.setState({list});
    };

    render() {
        if (!this.state.dataLoaded) return <LoadingLabel />;
        const {list} = this.state;
        const formValues = this.state.formValues ? this.state.formValues : defaultFormValues;
        const formErrors = this.state.formErrors ? this.state.formErrors : {};
        const modalTitle = formValues.id ? 'Update config' : 'Add new config';
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
                                    onNavigate={url => this.getList(url)}
                                />
                            </th>
                        </tr>
                    </tfoot>
                </table>
                <DefaultModal open={this.state.modal} title={modalTitle} handleClose={() => this.toggleModal('modal')}>
                    <ConfigForm
                        formName="config"
                        formValues={formValues}
                        formErrors={formErrors}
                        handleSubmit={this.handleSubmit}>
                        <button type="button" onClick={() => this.toggleModal('modal')} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </ConfigForm>
                </DefaultModal>
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

    getItem = async (id: number) => {
        const result = await Tools.getItem(apiUrls.crud, id);
        if (result) {
            this.props.toggleModal('modal', result);
        }
    }

    render() {
        const {data, toggleModal, handleRemove, onCheck} = this.props;
        return (
            <tr>
                <th className="row25">
                    <input id={data.id} className="check" type="checkbox" checked={data.checked} onChange={onCheck} />
                </th>
                <td className="uid">{data.uid}</td>
                <td className="value">{data.value}</td>
                <td className="center">
                    <a className="editBtn" onClick={() => this.getItem(parseInt(data.id))}>
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
