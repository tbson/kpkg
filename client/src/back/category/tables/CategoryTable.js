// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Link} from 'react-router-dom';
import {apiUrls, defaultFormValues} from '../_data';
import type {FormValues, FormValuesWithCheck, CatType} from '../_data';
import type {GetListResponseData} from 'src/utils/helpers/Tools';
import CategoryForm from '../forms/CategoryForm';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import DefaultModal from 'src/utils/components/DefaultModal';
import {Pagination, SearchInput} from 'src/utils/components/TableUtils';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    match: Object,
    list?: Array<FormValuesWithCheck>
};
type States = {
    dataLoaded: boolean,
    modal: boolean,
    list: Array<Object>,
    formValues: FormValues,
    formErrors: Object
};

export class CategoryTable extends React.Component<Props, States> {
    nextUrl: ?string;
    prevUrl: ?string;

    state = {
        dataLoaded: false,
        modal: false,
        list: [],
        formValues: defaultFormValues,
        formErrors: {}
    };

    typeList: Array<CatType> = [
        {value: 'article', label: 'Article'},
        {value: 'banner', label: 'Banner'},
        {value: 'gallery', label: 'Gallery'}
    ];

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        const {type} = this.props.match.params;
        this.getList('', {type});
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: States) {
        const {list} = nextProps;
        const dataLoaded = true;
        if (prevState.dataLoaded) return null;
        if (list) return {list, dataLoaded};
        return null;
    }

    componentDidUpdate = (prevProps: Props, prevState: States) => {
        const {type} = this.props.match.params;
        if (prevProps.match.params.type != type) {
            this.getList('', {type});
        }
    };

    setInitData = (initData: Object) => {
        this.nextUrl = initData.links.next;
        this.prevUrl = initData.links.previous;
        const list = initData.items.map(item => {
            item.checked = !!item.checked;
            return item;
        });
        this.setState({
            dataLoaded: true,
            list
        });
    };

    toggleModal = (modalName: string, formValues: Object = {}) => {
        this.setState(Tools.toggleModal(this.state, modalName, formValues));
    };

    getList = async (url: string = '', params: Object = {}) => {
        const result = await Tools.getList(url ? url : apiUrls.crud, params);
        if (result) {
            this.setInitData(result);
        }
    };

    searchList = async (event: Object) => {
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

        const params = Tools.formDataToObj(new FormData(event.target), ['single']);
        const isEdit = params.id ? true : false;
        let url = apiUrls.crud;
        if (isEdit) url += String(params.id);

        const {data, error} = await Tools.handleSubmit(url, params);
        const isSuccess = Tools.isEmpty(error);
        if (isSuccess) {
            this.onSubmitSuccess(isEdit, data);
        } else {
            this.onSubmitFail(error);
        }
    };

    onSubmitSuccess = (isEdit: boolean, data: FormValues) => {
        let {list} = this.state;
        const args = [list, data];
        if (isEdit) {
            list = Tools.updateListOnSuccessEditing(...args);
        } else {
            list = Tools.updateListOnSuccessAdding(...args);
        }
        this.setState({list});
        this.toggleModal('modal');
    };

    onSubmitFail = (formErrors: Object) => {
        this.setState({formErrors});
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

    getTypeList = (type: string, typeList: Array<CatType>): Array<CatType> => {
        if (!type) return typeList;
        return typeList.filter(item => item.value === type);
    };

    render() {
        if (!this.state.dataLoaded) return <LoadingLabel />;
        const {list} = this.state;
        const {type} = this.props.match.params;
        const formValues = this.state.formValues ? this.state.formValues : defaultFormValues;
        const formErrors = this.state.formErrors ? this.state.formErrors : {};
        const modalTitle = formValues.id ? 'Update category' : 'Add new category';

        return (
            <div>
                <SearchInput onSearch={this.searchList} />
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
                            <th scope="col">UID</th>
                            <th scope="col">Type</th>
                            <th scope="col">Image ratio (width / height)</th>
                            <th scope="col">Width ratio</th>
                            <th scope="col">Single</th>
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
                                    onClick={() => this.handleRemove(Tools.getCheckedId(this.state.list))}
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
                    <CategoryForm
                        formValues={formValues}
                        formErrors={formErrors}
                        typeList={this.getTypeList(type, this.typeList)}
                        handleSubmit={this.handleSubmit}>
                        <button type="button" onClick={() => this.toggleModal('modal')} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </CategoryForm>
                </DefaultModal>
            </div>
        );
    }
}
export default withRouter(CategoryTable);

type RowPropTypes = {
    data: FormValuesWithCheck,
    toggleModal: Function,
    handleRemove: Function,
    onCheck: Function
};
export class Row extends React.Component<RowPropTypes> {
    getItemToEdit = async (id: number) => {
        const result = await Tools.getItem(apiUrls.crud, id);
        if (result) {
            this.props.toggleModal('modal', result);
        }
    };

    render() {
        const {data, toggleModal, handleRemove, onCheck} = this.props;
        const id = data.id ? data.id : '';
        return (
            <tr>
                <th className="row25">
                    <input
                        id={data.id}
                        className="check"
                        type="checkbox"
                        checked={data.checked}
                        onChange={this.props.onCheck}
                    />
                </th>
                <td className="title">
                    <Link to={`/${data.type}s/${id}`}>
                        <span>{data.title}</span>
                    </Link>
                </td>
                <td className="uid">{data.uid}</td>
                <td className="type">{data.type}</td>
                <td className="image_ratio">{data.image_ratio}</td>
                <td className="width_ratio">{data.width_ratio}%</td>
                <td className="single">
                    {data.single ? <span className="oi oi-check green" /> : <span className="oi oi-x red" />}
                </td>
                <td className="center">
                    <a className="editBtn" onClick={() => this.getItemToEdit(parseInt(data.id))}>
                        <span className="editBtn oi oi-pencil text-info pointer" />
                    </a>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <a className="removeBtn" onClick={() => this.props.handleRemove(String(data.id))}>
                        <span className="oi oi-x text-danger pointer" />
                    </a>
                </td>
            </tr>
        );
    }
}
