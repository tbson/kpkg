/* @flow */
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Link} from 'react-router-dom';
import CustomModal from 'src/utils/components/CustomModal';
import {apiUrls, defaultFormValues} from '../_data';
import type {FormValuesWithCheck, ParentType} from '../_data';
import type {GetListResponseData} from 'src/utils/helpers/Tools';
import ArticleForm from '../forms/ArticleForm';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import {Pagination, SearchInput} from 'src/utils/components/TableUtils';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    parent: ParentType,
    searchForm: boolean,
    list?: Array<FormValuesWithCheck>
};
type States = {
    dataLoaded: boolean,
    modal: boolean,
    list: Array<FormValuesWithCheck>,
    formErrors: Object
};

export class ArticleTable extends React.Component<Props, States> {
    getList: Function;
    static defaultProps = {
        searchForm: true
    };

    nextUrl: ?string;
    prevUrl: ?string;

    state = {
        dataLoaded: false,
        modal: false,
        list: [],
        formErrors: {}
    };

    constructor(props: Props) {
        super(props);
        const {parent} = this.props;
        const defaultParams = {
            [parent.type]: parent.id
        };
        this.getList = this.getList.bind(this, undefined, undefined, defaultParams);
    }

    componentDidMount() {
        this.getList();
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: States) {
        const {list} = nextProps;
        const dataLoaded = true;
        if (prevState.dataLoaded) return null;
        if (list) return {list, dataLoaded};
        return null;
    }

    setInitData = (initData: GetListResponseData) => {
        this.nextUrl = initData.links.next;
        this.prevUrl = initData.links.previous;
        const list = initData.items.map(item => {
            item.checked = false;
            return item;
        });
        this.setState({
            dataLoaded: true,
            list
        });
    };

    async getList(url: string = '', params: Object = {}, defaultParams: Object = {}) {
        params = {...params, ...defaultParams};
        const result = await Tools.getList(url ? url : apiUrls.crud, params);
        if (result) {
            this.setInitData(result);
        }
    }

    searchList = async (event: Object) => {
        event.preventDefault();
        const {search} = Tools.formDataToObj(new FormData(event.target));
        if (search.length > 2) {
            await this.getList('', {search});
        } else if (!search.length) {
            await this.getList();
        }
    };

    handleRemove = async (ids: string) => {
        let {list} = this.state;
        const url = apiUrls.crud;
        const deletedIds = await Tools.handleRemove(url, ids);
        if (deletedIds && deletedIds.length) {
            list = list.filter(item => !deletedIds.includes(item.id));
            this.setState({list});
        }
    };

    handleCheck = (event: Object) => {
        const {list} = this.state;
        const {id, checked} = event.target;
        const index = list.findIndex(item => item.id === parseInt(id));
        list[index].checked = checked;
        this.setState({list});
    };

    handleToggleCheckAll = () => {
        let {list} = this.state;
        list = Tools.checkOrUncheckAll(list);
        this.setState({list});
    };

    renderSearchForm = () => {
        const {searchForm} = this.props;
        if (!searchForm) return null;
        return <SearchInput onSearch={this.searchList} />
    }

    render() {
        const {dataLoaded, list} = this.state;
        const {parent} = this.props;
        if (!dataLoaded || !parent.id) return <LoadingLabel />;
        return (
            <div>
                {this.renderSearchForm()}
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
                                    to={`/article/${parent.type}/${parent.id}/`}>
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
                                data={data}
                                key={key}
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
                                <Pagination next={this.nextUrl} prev={this.prevUrl} onNavigate={this.getList} />
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
    data: FormValuesWithCheck,
    parent: ParentType,
    handleRemove: Function,
    onCheck: Function
};
export class Row extends React.Component<RowPropTypes> {
    render() {
        const {data, parent} = this.props;
        const id = data.id ? data.id : '';
        if (!parent.id) return null;
        return (
            <tr>
                <th className="row25">
                    <input
                        className="check"
                        type="checkbox"
                        checked={data.checked}
                        onChange={event => this.props.onCheck(data, event)}
                    />
                </th>
                <td className="title">
                    <Link to={`/article/${parent.type}/${parent.id}/${id}`}>{data.title}</Link>
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
                    <Link to={`/article/${parent.type}/${parent.id}/${id}`}>
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
