// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Link} from 'react-router-dom';
import CustomModal from 'src/utils/components/CustomModal';
import {apiUrls} from '../_data';
import ArticleForm from '../forms/ArticleForm';
import ArticleModal from '../forms/ArticleModal';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import {Pagination, SearchInput} from 'src/utils/components/TableUtils';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    match: Object,
};
type States = {
    dataLoaded: boolean,
    mainModal: boolean,
    mainList: Array<Object>,
    mainFormData: Object,
    mainFormErr: Object,
};

export class ArticleTable extends React.Component<Props, States> {
    list: Function;
    setInitData: Function;
    handleToggleCheckAll: Function;
    handleCheck: Function;
    handleRemove: Function;
    handleSearch: Function;

    filterTimeout: ?TimeoutID = null;
    nextUrl: ?string;
    prevUrl: ?string;

    uuid: string;

    state = {
        dataLoaded: false,
        mainModal: false,
        mainList: [],
        mainFormData: {},
        mainFormErr: {},
    };

    constructor(props: Props) {
        super(props);
        this.list = this.list.bind(this);
        this.setInitData = this.setInitData.bind(this);
        this.handleToggleCheckAll = this.handleToggleCheckAll.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        this.list();
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

    async list(outerParams: Object = {}, url: ?string = null) {
        let params = {
            category: this.props.match.params.category_id
        };
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
    }

    handleToggleCheckAll() {
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
    }

    handleCheck(data: Object, event: Object) {
        data.checked = event.target.checked;
        const index = this.state.mainList.findIndex(item => item.id === parseInt(data.id));
        this.state.mainList[index] = {...data};
        this.setState({mainList: this.state.mainList});
    }

    async handleRemove(id: string) {
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
    }

    handleSearch(event: Object) {
        event.preventDefault();
        const {searchStr} = Tools.formDataToObj(new FormData(event.target));
        if (searchStr.length > 2) {
            this.list({search: searchStr});
        } else if (!searchStr.length) {
            this.list();
        }
    }

    render() {
        if (!this.state.dataLoaded) return <LoadingLabel />;
        const list = this.state.mainList;
        const categoryId = this.props.match.params.category_id;
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
                            <th scope="col">Title</th>
                            <th scope="col">Category</th>
                            <th scope="col">Order</th>
                            <th scope="col" style={{padding: 8}} className="row80">
                                <Link
                                    className="btn btn-primary btn-sm btn-block add-button"
                                    to={`/article/${categoryId}/`}>
                                    <span className="oi oi-plus" />&nbsp; Add
                                </Link>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {list.map((data, key) => (
                            <Row
                                className="table-row"
                                match={this.props.match}
                                data={data}
                                key={key}
                                _key={key}
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
            </div>
        );
    }
}
export default withRouter(ArticleTable);

type DataType = {
    id: number,
    category_title: string,
    title: string,
    order: number,
    checked: ?boolean,
};
type RowPropTypes = {
    match: Object,
    data: DataType,
    _key: number,
    handleRemove: Function,
    onCheck: Function,
};
export class Row extends React.Component<RowPropTypes> {
    render() {
        const data = this.props.data;
        const categoryId = this.props.match.params.category_id;
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
                <td className="title">
                    <Link to={`/article/${categoryId}/${data.id}`}>
                        {data.title}
                    </Link>
                </td>
                <td className="category_id">{data.category_title}</td>
                <td className="order">{data.order}</td>
                <td className="center">
                    <Link to={`/article/${categoryId}/${data.id}`}>
                        <span className="editBtn oi oi-pencil text-info pointer"/>
                    </Link>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <a onClick={() => this.props.handleRemove(String(data.id))}>
                        <span
                            className="removeBtn oi oi-x text-danger pointer" 
                        />
                    </a>
                </td>
            </tr>
        );
    }
}

