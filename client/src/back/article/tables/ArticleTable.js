// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Link} from 'react-router-dom';
import CustomModal from 'src/utils/components/CustomModal';
import {apiUrls} from '../_data';
import type {FormValuesEdit} from '../_data';
import ArticleForm from '../forms/ArticleForm';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import {Pagination, SearchInput} from 'src/utils/components/TableUtils';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    search_form: boolean,
    match: Object,
    parent: string,
    parent_id: number,
};
type States = {
    dataLoaded: boolean,
    modal: boolean,
    list: Array<FormValuesEdit>,
    formValues: Object,
    formErrors: Object,
};

export class ArticleTable extends React.Component<Props, States> {
    list: Function;
    setInitData: Function;
    handleToggleCheckAll: Function;
    handleCheck: Function;
    handleRemove: Function;
    handleSearch: Function;

    nextUrl: ?string;
    prevUrl: ?string;

    uuid: string;

    static defaultProps = {
        parent: 'category',
        search_form: true,
    };

    state = {
        dataLoaded: false,
        modal: false,
        list: [],
        formValues: {},
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
            [this.props.parent]: this.props.parent_id,
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

    handleCheck = (data: Object, event: Object) => {
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
        const parent = this.props.parent;
        const parentId = this.props.parent_id;
        return (
            <div>
                <SearchInput show={this.props.search_form} onSearch={this.handleSearch} />
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th className="row25">
                                <span
                                    className="oi oi-check text-info pointer check-all-button"
                                    onClick={() => this.handleToggleCheckAll()}
                                />
                            </th>
                            <th scope="col">Article Title</th>
                            <th scope="col">Category</th>
                            <th scope="col">Slide</th>
                            <th scope="col">Pin</th>
                            <th scope="col">Order</th>
                            <th scope="col" style={{padding: 8}} className="row80">
                                <Link
                                    className="btn btn-primary btn-sm btn-block add-button"
                                    to={`/article/${parent}/${parentId}/`}>
                                    <span className="oi oi-plus" />&nbsp; Add
                                </Link>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {list.map((data, key) => (
                            <Row
                                className="table-row"
                                parent={parent}
                                parent_id={parentId}
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
            </div>
        );
    }
}
export default withRouter(ArticleTable);

type RowPropTypes = {
    parent: string,
    parent_id: number,
    data: FormValuesEdit,
    _key: number,
    handleRemove: Function,
    onCheck: Function,
};
export class Row extends React.Component<RowPropTypes> {
    render() {
        const data = this.props.data;
        const parentId = this.props.parent_id;
        const parent = this.props.parent;
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
                    <Link to={`/article/${parent}/${parentId}/${data.id}`}>{data.title}</Link>
                </td>
                <td className="category_id">{data.category_title}</td>
                <td className="use_slide">
                    {data.use_slide ? <span className="oi oi-check green" /> : <span className="oi oi-x red" />}
                </td>
                <td className="pin">
                    {data.pin ? <span className="oi oi-check green" /> : <span className="oi oi-x red" />}
                </td>
                <td className="order">{data.order}</td>
                <td className="center">
                    <Link to={`/article/${parent}/${parentId}/${data.id}`}>
                        <span className="editBtn oi oi-pencil text-info pointer" />
                    </Link>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <a onClick={() => this.props.handleRemove(String(data.id))}>
                        <span className="removeBtn oi oi-x text-danger pointer" />
                    </a>
                </td>
            </tr>
        );
    }
}
