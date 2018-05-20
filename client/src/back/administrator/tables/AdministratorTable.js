// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import CustomModal from 'src/utils/components/CustomModal';
import {apiUrls} from '../_data';
import AdministratorForm from '../forms/AdministratorForm';
import AdministratorModal from '../forms/AdministratorModal';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import {Pagination, SearchInput} from 'src/utils/components/TableUtils';
import Tools from 'src/utils/helpers/Tools';

type Props = {};
type States = {
    dataLoaded: boolean,
    mainModal: boolean,
    mainList: Array<Object>,
    groupList: Array<Object>,
    mainFormData: Object,
    mainFormErr: Object,
};

export class AdministratorTable extends React.Component<Props, States> {
    list: Function;
    setInitData: Function;
    toggleModal: Function;
    handleSubmit: Function;
    handleAdd: Function;
    handleEdit: Function;
    handleToggleCheckAll: Function;
    handleCheck: Function;
    handleRemove: Function;
    handleSearch: Function;

    nextUrl: ?string;
    prevUrl: ?string;

    state = {
        dataLoaded: false,
        mainModal: false,
        mainList: [],
        groupList: [],
        mainFormData: {},
        mainFormErr: {},
    };

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.list();
        this.groupList();
    }

    setInitData(initData: Object) {
        this.nextUrl = initData.links.next;
        this.prevUrl = initData.links.previous;
        const newData = initData.items.map(item => {
            item.checked = !!item.checked;
            return item;
        });
        this.setState({
            dataLoaded: true,
            mainList: [...newData],
        });
    }

    list = async (outerParams: Object = {}, url: ?string = null) => {
        let params = {};
        let result = {};

        if (!Tools.emptyObj(outerParams)) {
            params = {...params, ...outerParams};
        }

        result = await Tools.apiCall(url ? url : apiUrls.crud, 'GET', params);
        if (result.success) {
            this.setInitData(result.data);
            return result;
        }
        return result;
    };

    groupList = async () => {
        const result = await Tools.apiCall(apiUrls.groupCrud, 'GET');
        if (result.success) {
            this.setState({
                groupList: result.data.items.map(item => ({value: item.id, label: item.name})),
            });
            return result;
        }
        return result;
    };

    toggleModal = (modalName: string, id: ?number = null): Object => {
        // If modalName not defined -> exit here
        if (typeof this.state[modalName] == 'undefined') return {};

        const state = {
            [modalName]: !this.state[modalName],
            mainFormData: {},
            mainFormErr: {},
        };

        if (id) {
            switch (modalName) {
                case 'mainModal':
                    Tools.apiCall(apiUrls.crud + id.toString(), 'GET').then(result => {
                        if (result.success) {
                            state.mainFormData = result.data;
                        }
                        this.setState(state);
                    });
                    return state;
            }
        } else {
            this.setState(state);
        }
        return state;
    };

    handleSubmit = async (event: Object): Promise<boolean> => {
        event.preventDefault();
        let error: ?Object = null;
        const params = Tools.formDataToObj(new FormData(event.target));
        if (!params.id) {
            error = await this.handleAdd(params);
        } else {
            error = await this.handleEdit(params);
        }

        if (!error) {
            // No error -> close current modal
            this.toggleModal('mainModal');
            return true;
        } else {
            // Have error -> update err object
            this.setState({mainFormErr: error});
            return false;
        }
    };

    handleAdd = async (params: {
        email: string,
        username: string,
        first_name: string,
        last_name: string,
        groups: string,
    }) => {
        const result = await Tools.apiCall(apiUrls.crud, 'POST', params);
        if (result.success) {
            this.setState({mainList: [{...result.data, checked: false}, ...this.state.mainList]});
            return null;
        }
        return result.data;
    };

    handleEdit = async (params: {
        id: number,
        email: string,
        username: string,
        first_name: string,
        last_name: string,
        groups: string,
        checked: boolean,
    }) => {
        const id = String(params.id);
        const result = await Tools.apiCall(apiUrls.crud + id, 'PUT', params);
        if (result.success) {
            const index = this.state.mainList.findIndex(item => item.id === parseInt(id));
            const {checked} = this.state.mainList[index];
            this.state.mainList[index] = {...result.data, checked};
            this.setState({mainList: this.state.mainList});
            return null;
        }
        return result.data;
    };

    handleToggleCheckAll = () => {
        var newList = [];
        const checkedItem = this.state.mainList.filter(item => item.checked);
        const result = (checked: boolean) => {
            const mainList = this.state.mainList.map(value => {
                return {...value, checked};
            });
            this.setState({mainList});
        };

        if (checkedItem) {
            if (checkedItem.length === this.state.mainList.length) {
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

    handleCheck = (data: Object, event: Object) => {
        data.checked = event.target.checked;
        const index = this.state.mainList.findIndex(item => item.id === parseInt(data.id));
        this.state.mainList[index] = {...data};
        this.setState({mainList: this.state.mainList});
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
            const mainList = this.state.mainList.filter(item => listId.indexOf(item.id) === -1);
            this.setState({mainList});
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
        const list = this.state.mainList;
        const mainFormData = this.state.mainFormData;
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
                            <th scope="col">Email</th>
                            <th scope="col">Username</th>
                            <th scope="col">Fullname</th>
                            <th scope="col" style={{padding: 8}} className="row80">
                                <button
                                    className="btn btn-primary btn-sm btn-block add-button"
                                    onClick={() => this.toggleModal('mainModal')}>
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
                                    onClick={() => this.handleRemove(Tools.getCheckedId(this.state.mainList))}
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
                <AdministratorModal
                    open={this.state.mainModal}
                    defaultValues={Object.keys(mainFormData).length ? mainFormData : undefined}
                    groupList={this.state.groupList}
                    errorMessages={this.state.mainFormErr}
                    handleClose={() => this.setState({mainModal: false})}
                    handleSubmit={this.handleSubmit}
                />
            </div>
        );
    }
}
export default withRouter(AdministratorTable);

type DataType = {
    id: number,
    email: string,
    username: string,
    fullname: string,
    checked: ?boolean,
};
type RowPropTypes = {
    data: DataType,
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
                <td className="email">{data.email}</td>
                <td className="username">{data.username}</td>
                <td className="fullname">{data.fullname}</td>
                <td className="center">
                    <span
                        className="editBtn oi oi-pencil text-info pointer"
                        onClick={() => this.props.toggleModal('mainModal', data.id)}
                    />
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <span
                        className="removeBtn oi oi-x text-danger pointer"
                        onClick={() => this.props.handleRemove(String(data.id))}
                    />
                </td>
            </tr>
        );
    }
}
