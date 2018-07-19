// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import {apiUrls, defaultFormValues} from './_data';
import type {FormValues, FormValuesWithCheck, ParentType} from './_data';
import type {DropdownItemType} from 'src/utils/types/CommonTypes';
import NavWrapper from 'src/utils/components/NavWrapper';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import AttachTable from 'src/back/attach/tables/AttachTable';
import ArticleForm from './forms/ArticleForm';
import ArticleTable from './tables/ArticleTable';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    history: Object,
    parent: ParentType,
    id: number
};
type States = {
    dataLoaded: boolean,
    url: ?string,
    formValues: FormValues,
    formErrors: Object,
    uuid: string,
    categoryId: ?number,
    tagSource: Array<DropdownItemType>
};

class ArticleEdit extends React.Component<Props, States> {
    navigateTo: Function;

    state = {
        dataLoaded: false,
        url: null,
        formValues: defaultFormValues,
        formErrors: {},
        uuid: Tools.uuid4(),
        categoryId: null,
        tagSource: []
    };

    constructor(props: Props) {
        super(props);
        this.navigateTo = Tools.navigateTo.bind(undefined, this.props.history);
    }

    componentDidMount() {
        const {id} = this.props;
        this.setInitData();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {id} = nextProps;
        if (id !== prevState.id) {
            return {id};
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const {id} = this.props;
        if (prevProps.id !== id) {
            this.setInitData();
        }
    }

    setInitData = async () => {
        const {parent, id} = this.props;
        const {uuid} = this.state;
        const initData = {...defaultFormValues, uuid};
        let state = await this.prepareFormValues(id, initData);
        let categoryId;
        if (parent.type == 'article') {
            categoryId = await this.getCategoryId(parent.id);
        } else {
            categoryId = parent.id;
        }
        state = {...state, categoryId};
        const tagSource = await this.getTagSource();
        if (tagSource) {
            state = {...state, tagSource};
        }
        this.setState(state);
    };

    getCategoryId = async id => {
        const result = await Tools.getItem(apiUrls.crud, id);
        if (result) {
            return result.category.id;
        }
        return null;
    };

    getItem = async (id): Promise<?FormValues> => {
        if (!id) return null;
        const result = await Tools.getItem(apiUrls.crud, id);
        if (result) {
            return result;
        }
        return null;
    };

    prepareFormValues = async (id: number, formValues: FormValues): Promise<Object> => {
        let result = await this.getItem(id);
        if (!result) {
            result = {...formValues};
        }
        return {
            formValues: result,
            uuid: result.uuid,
            dataLoaded: true
        };
    };

    getTagSource = async (): Promise<Array<DropdownItemType>> => {
        const result = await Tools.apiCall(apiUrls.tagCrud + '?limit=20', 'GET');
        if (result.success) {
            return result.data.items.map(item => ({value: item.id, label: item.title}));
        }
        return [];
    };

    handleSubmit = async (event: Object) => {
        event.preventDefault();

        const {parent} = this.props;

        const params = Tools.formDataToObj(new FormData(event.target));
        const isEdit = params.id ? true : false;
        let url = apiUrls.crud;
        if (isEdit) url += String(params.id);

        if (!params.order) {
            params.order = 0;
        }
        params[parent.type] = parent.id;

        const {data, error} = await Tools.handleSubmit(url, params);
        const isSuccess = Tools.isEmpty(error);
        if (isSuccess) {
            this.onSubmitSuccess(isEdit, data);
        } else {
            this.onSubmitFail(error);
        }
    };

    onSubmitSuccess = (isEdit: boolean, data: FormValues) => {
        const {parent} = this.props;
        const {categoryId} = this.state;

        if (parent.type == 'category') {
            // Back to parent list
            this.navigateTo('/articles', [parent.id]);
        } else {
            // Back to parent item
            this.navigateTo('/article/category', [categoryId, parent.id]);
        }
    };

    onSubmitFail = (formErrors: Object) => {
        this.setState({formErrors});
    };

    renderRelatedArticle = () => {
        const {parent, id} = this.props;
        const nearestParent = {
            type: 'article',
            id
        };
        if (!id) return null; // No related article when adding
        if (parent.type != 'category') return null; // No related article of related article
        return <ArticleTable searchForm={false} parent={nearestParent} />;
    };

    render() {
        const {dataLoaded, formValues, formErrors, tagSource, categoryId, uuid} = this.state;
        const {parent} = this.props;
        if (!dataLoaded)
            return (
                <NavWrapper>
                    <LoadingLabel />
                </NavWrapper>
            );
        return (
            <NavWrapper>
                <ArticleForm
                    parent_uuid={uuid}
                    formId="articleForm"
                    submitTitle="Update"
                    formValues={formValues}
                    formErrors={formErrors}
                    tagSource={tagSource}
                    handleSubmit={this.handleSubmit}>
                    <button
                        type="button"
                        onClick={() => {
                            if (!categoryId) {
                                this.navigateTo('/articles', [parent.id]);
                            } else {
                                this.navigateTo('/article/category', [categoryId, parent.id]);
                            }
                        }}
                        className="btn btn-warning">
                        <span className="oi oi-x" />&nbsp; Cancel
                    </button>
                </ArticleForm>
                <hr />
                <AttachTable parent_uuid={uuid} />
                {this.renderRelatedArticle()}
            </NavWrapper>
        );
    }
}

const styles = {};

export default withRouter(ArticleEdit);
