// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import CustomModal from 'src/utils/components/CustomModal';
import {apiUrls, defaultFormValues} from '../_data';
import type {FormValues, FormValuesWithCheck} from '../_data';
import type {GetListResponseData} from 'src/utils/helpers/Tools';
import BannerForm from '../forms/BannerForm';
import DefaultModal from 'src/utils/components/DefaultModal';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import {Pagination, SearchInput} from 'src/utils/components/TableUtils';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    match: Object,
    list?: Array<FormValuesWithCheck>
};
type States = {
    dataLoaded: boolean,
    modal: boolean,
    list: Array<FormValuesWithCheck>,
    uuid: string,
    formValues: FormValues,
    formErrors: Object
};

export class BannerTable extends React.Component<Props, States> {
    static defaultProps = {};
    getList: Function;
    nextUrl: ?string;
    prevUrl: ?string;

    state = {
        dataLoaded: false,
        modal: false,
        list: [],
        uuid: '',
        formValues: defaultFormValues,
        formErrors: {}
    };

    constructor(props: Props) {
        super(props);
        const defaultParams = {category: this.props.match.params.category_id};
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

    toggleModal = (modalName: string, formValues: Object = {}, uuid: string = '') => {
        let state = {...Tools.toggleModal(this.state, modalName, formValues)};
        if (uuid) {
            state = {...state, uuid};
        }
        this.setState(state);
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

    handleSubmit = async (event: Object) => {
        event.preventDefault();

        const params = Tools.formDataToObj(new FormData(event.target));
        params.uuid = this.state.uuid;
        params.category = this.props.match.params.category_id;
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

    render() {
        if (!this.state.dataLoaded) return <LoadingLabel />;
        const {list} = this.state;
        const categoryId = this.props.match.params.category_id;
        const formValues = this.state.formValues ? this.state.formValues : defaultFormValues;
        const formErrors = this.state.formErrors ? this.state.formErrors : {};
        const modalTitle = formValues.id ? 'Update banner' : 'Add new banner';

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
                            <th scope="col">Category</th>
                            <th scope="col">Order</th>
                            <th scope="col" style={{padding: 8}} className="row80">
                                <button
                                    className="btn btn-primary btn-sm btn-block add-button"
                                    onClick={() => this.toggleModal('modal', {}, Tools.uuid4())}>
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
                    <BannerForm
                        formValues={formValues}
                        formErrors={formErrors}
                        handleSubmit={this.handleSubmit}>
                        <button type="button" onClick={() => this.toggleModal('modal')} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </BannerForm>
                </DefaultModal>
            </div>
        );
    }
}
export default withRouter(BannerTable);

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
            const {uuid} = result;
            this.props.toggleModal('modal', result, uuid);
        }
    };

    render() {
        const {data, toggleModal, handleRemove, onCheck} = this.props;
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
                <td className="title">{data.title}</td>
                <td className="category_title">{data.category_title}</td>
                <td className="order">{data.order}</td>
                <td className="center">
                    <a className="editBtn" onClick={() => this.getItemToEdit(parseInt(data.id))}>
                        <span className="editBtn oi oi-pencil text-info pointer" />
                    </a>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <a className="removeBtn" onClick={() => handleRemove(String(data.id))}>
                        <span className="oi oi-x text-danger pointer" />
                    </a>
                </td>
            </tr>
        );
    }
}
