// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import CustomModal from 'src/utils/components/CustomModal';
import {apiUrls, defaultFormValues} from '../_data';
import type {FormValues, FormValuesEdit} from '../_data';
import AttachForm from '../forms/AttachForm';
import AttachModal from '../forms/AttachModal';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import {Pagination, SearchInput} from 'src/utils/components/TableUtils';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    match: Object,
    parent_uuid: string,
};
type States = {
    dataLoaded: boolean,
    modal: boolean,
    list: Array<FormValuesEdit>,
    formValues: FormValues,
    formErrors: Object,
};

export class AttachTable extends React.Component<Props, States> {
    nextUrl: ?string;
    prevUrl: ?string;

    uuid: string;

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
        this.list();
    }

    setInitData = (initData: Object) => {
        this.nextUrl = initData.links.next;
        this.prevUrl = initData.links.previous;
        const newData = initData.items.map(item => {
            item.checked = !!item.checked;
            return item;
        });
        this.setState({
            dataLoaded: true,
            list: [...newData],
        });
    };

    list = async (outerParams: Object = {}, url: ?string = null) => {
        let params = {
            parent_uuid: this.props.parent_uuid,
            richtext_image: false,
        };
        let result = {};

        if (!Tools.isEmpty(outerParams)) {
            params = {...params, ...outerParams};
        }

        result = await Tools.apiCall(url ? url : apiUrls.crud, 'GET', params);
        if (result.success) {
            this.setInitData(result.data);
            return result;
        }
        return result;
    };

    toggleModal = (modalName: string, id: ?number = null): Object => {
        // If modalName not defined -> exit here
        if (typeof this.state[modalName] == 'undefined') return {};

        const state = {
            [modalName]: !this.state[modalName],
            formValues: defaultFormValues,
            formErrors: {},
        };

        if (id) {
            switch (modalName) {
                case 'modal':
                    Tools.apiCall(apiUrls.crud + id.toString(), 'GET').then(result => {
                        if (result.success) {
                            state.formValues = result.data;
                        }
                        this.uuid = result.data.uuid;
                        this.setState(state);
                    });
                    return state;
            }
        } else {
            this.uuid = Tools.uuid4();
            this.setState(state);
        }
        return state;
    };

    handleSubmit = async (event: Object): Promise<boolean> => {
        event.preventDefault();
        let error: ?Object = null;
        const params = Tools.formDataToObj(new FormData(event.target));
        params.id = parseInt(params.id);
        if (!params.order) {
            params.order = 0;
        }
        params.category = this.props.match.params.category_id;
        if (!params.id) {
            error = await this.handleAdd(params);
        } else {
            error = await this.handleEdit(params);
        }

        if (!error) {
            // No error -> close current modal
            this.toggleModal('modal');
            return true;
        } else {
            // Have error -> update err object
            this.setState({formErrors: error});
            return false;
        }
    };

    handleAdd = async (params: FormValues) => {
        params.parent_uuid = this.props.parent_uuid;
        params.richtext_image = false;
        const result = await Tools.apiCall(apiUrls.crud, 'POST', params);
        if (result.success) {
            this.setState({list: [{...result.data, checked: false}, ...this.state.list]});
            return null;
        }
        return result.data;
    };

    handleEdit = async (params: FormValuesEdit) => {
        const id = String(params.id);
        const result = await Tools.apiCall(apiUrls.crud + id, 'PUT', params);
        if (result.success) {
            const index = this.state.list.findIndex(item => item.id === parseInt(id));
            const {checked} = this.state.list[index];
            this.state.list[index] = {...result.data, checked};
            this.setState({list: this.state.list});
            return null;
        }
        return result.data;
    };

    handleToggleCheckAll = () => {
        var newList = [];
        const checkedItem = this.state.list.filter(item => item.checked);
        const result = (checked: boolean) => {
            const list = this.state.list.map(value => {
                return {...value, checked};
            });
            this.setState({list});
        };

        if (checkedItem) {
            if (checkedItem.length === this.state.list.length) {
                // Checked all -> uncheck all
                return result(false);
            }
            // Some item checked -> checke all
            return result(true);
        } else {
            // Nothing checked -> check all
            return result(true);
        }
    };

    handleCheck = (data: FormValuesEdit, event: Object) => {
        data.checked = event.target.checked;
        const index = this.state.list.findIndex(item => item.id === parseInt(data.id));
        this.state.list[index] = {...data};
        this.setState({list: this.state.list});
    };

    handleRemove = async (id: string) => {
        const listId = id.split(',');
        if (!id || !listId.length) return;
        let message = '';
        if (listId.length === 1) {
            message = 'Do you want to remove this item?';
        } else {
            message = 'Do you want to remove selected items?';
        }
        const decide = confirm(message);
        if (!decide) return;
        const result = await Tools.apiCall(apiUrls.crud + (listId.length === 1 ? id : '?ids=' + id), 'DELETE');
        if (result.success) {
            const listId = id.split(',').map(item => parseInt(item));
            const list = this.state.list.filter(item => listId.indexOf(item.id) === -1);
            this.setState({list});
        } else {
            this.list();
        }
    };

    handleSearch = (event: Object) => {
        event.preventDefault();
        const {searchStr} = Tools.formDataToObj(new FormData(event.target));
        if (searchStr.length > 2) {
            this.list({search: searchStr});
        } else if (!searchStr.length) {
            this.list();
        }
    };

    render() {
        if (!this.state.dataLoaded) return <LoadingLabel />;
        const list = this.state.list;
        const categoryId = this.props.match.params.category_id;
        return (
            <div>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th className="row25">
                                <span
                                    className="oi oi-check text-info pointer check-all-button"
                                    onClick={() => this.handleToggleCheckAll()}
                                />
                            </th>
                            <th scope="col">Attach Title</th>
                            <th scope="col">Order</th>
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
                                _key={key}
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
                                    onClick={() => this.handleRemove(Tools.getCheckedId(this.state.list))}
                                />
                            </th>
                            <th className="row25 right" colSpan="99">
                                <Pagination
                                    next={this.nextUrl}
                                    prev={this.prevUrl}
                                    onNavigate={url => this.list({}, url)}
                                />
                            </th>
                        </tr>
                    </tfoot>
                </table>
                <AttachModal
                    uuid={this.uuid}
                    open={this.state.modal}
                    formValues={this.state.formValues}
                    formErrors={this.state.formErrors}
                    handleClose={() => this.setState({modal: false})}
                    handleSubmit={this.handleSubmit}
                />
            </div>
        );
    }
}
export default withRouter(AttachTable);

type RowPropTypes = {
    data: FormValuesEdit,
    _key: number,
    toggleModal: Function,
    handleRemove: Function,
    onCheck: Function,
};
export class Row extends React.Component<RowPropTypes> {
    render() {
        const data = this.props.data;
        return (
            <tr key={this.props._key}>
                <th className="row25">
                    <input
                        className="check"
                        type="checkbox"
                        checked={data.checked}
                        onChange={event => this.props.onCheck(data, event)}
                    />
                </th>
                <td className="title">{data.title}</td>
                <td className="title">{data.order}</td>
                <td className="center">
                    <a onClick={() => this.props.toggleModal('modal', data.id)}>
                        <span className="editBtn oi oi-pencil text-info pointer" />
                    </a>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <a onClick={() => this.props.handleRemove(String(data.id))}>
                        <span className="removeBtn oi oi-x text-danger pointer" />
                    </a>
                </td>
            </tr>
        );
    }
}
