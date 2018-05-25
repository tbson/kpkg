// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import {apiUrls, defaultFormValues} from './_data';
import type {FormValues, FormValuesEdit, UrlParms} from './_data';
import type {DropdownItemType} from 'src/utils/types/CommonTypes';
import NavWrapper from 'src/utils/components/NavWrapper';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import AttachTable from 'src/back/attach/tables/AttachTable';
import ArticleForm from './forms/ArticleForm';
import ArticleTable from './tables/ArticleTable';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    history: Object,
    match: {
        params: UrlParms,
        url: string,
    },
};
type States = {
    dataLoaded: boolean,
    url: ?string,
    formValues: FormValues,
    formErrors: Object,
    uuid: string,
    categoryId: ?number,
    tagSource: Array<DropdownItemType>,
};

class ArticleEdit extends React.Component<Props, States> {
    static defaultProps = {};

    state = {
        dataLoaded: false,
        url: null,
        formValues: defaultFormValues,
        formErrors: {},
        uuid: Tools.uuid4(),
        categoryId: null,
        tagSource: [],
    };

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.setInitData();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {url} = nextProps.match;
        if (url !== prevState.url) {
            return {url};
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const {url} = this.props.match;
        if (prevProps.match.url !== url) {
            this.setInitData();
        }
    }

    setInitData = () => {
        this.getItem();
        this.getTags();
    };

    getItem = async () => {
        const {parent, parent_id, id} = this.props.match.params;
        if (parent == 'article') {
            const parentArticle = await Tools.apiCall(apiUrls.crud + parent_id.toString(), 'GET');
            this.setState({
                categoryId: parentArticle.data.category.id,
            });
        }
        if (!id) {
            this.setState({
                dataLoaded: true,
                formValues: defaultFormValues,
            });
        } else {
            const result = await Tools.apiCall(apiUrls.crud + id.toString(), 'GET');
            delete result.data.tag_source;
            if (result.success) {
                this.setState({
                    formValues: result.data,
                    uuid: result.data.uuid,
                    dataLoaded: true,
                });
            }
        }
    };

    getTags = async () => {
        const result = await Tools.apiCall(apiUrls.tagCrud + '?limit=20', 'GET');
        if (result.success) {
            this.setState({tagSource: result.data.items.map(item => ({value: item.id, label: item.title}))});
        }
    };

    handleSubmit = async (event: Object): Promise<boolean> => {
        event.preventDefault();
        const {parent, parent_id} = this.props.match.params;
        let result: ?Object = null;
        const params = Tools.formDataToObj(new FormData(event.target));
        params.id = parseInt(params.id);
        if (!params.order) {
            params.order = 0;
        }
        params[parent] = parent_id;
        if (!params.id) {
            result = await this.handleAdd(params);
        } else {
            result = await this.handleEdit(params);
        }

        if (result.success) {
            if (parent == 'category') {
                // Back to parent list
                Tools.navigateTo(this.props.history, '/articles', [parent_id]);
            } else {
                // Back to parent item
                Tools.navigateTo(this.props.history, '/article/category', [this.state.categoryId, parent_id]);
            }
            return true;
        } else {
            // Have error -> update err object
            this.setState({formErrors: result.data ? result.data : result});
            return false;
        }
    };

    handleAdd = async (params: FormValues) => {
        delete params.id;
        params.uuid = this.state.uuid;
        const result = await Tools.apiCall(apiUrls.crud, 'POST', params);
        return result;
    };

    handleEdit = async (params: FormValuesEdit) => {
        const id = String(params.id);
        const result = await Tools.apiCall(apiUrls.crud + id, 'PUT', params);
        return result;
    };

    renderRelatedArticle = () => {
        const {id, parent} = this.props.match.params;
        if (!id || parent != 'category') return null;
        return <ArticleTable search_form={false} parent="article" parent_id={id} />;
    };

    render() {
        if (!this.state.dataLoaded)
            return (
                <NavWrapper>
                    <LoadingLabel />
                </NavWrapper>
            );
        const {parent_id} = this.props.match.params;
        return (
            <NavWrapper>
                <ArticleForm
                    parent_uuid={this.state.uuid}
                    formId="articleForm"
                    submitTitle="Update"
                    formValues={this.state.formValues}
                    formErrors={this.state.formErrors}
                    tagSource={this.state.tagSource}
                    handleSubmit={this.handleSubmit}>
                    <button
                        type="button"
                        onClick={() => {
                            if (!this.state.categoryId) {
                                Tools.navigateTo(this.props.history, '/articles', [parent_id]);
                            } else {
                                Tools.navigateTo(this.props.history, '/article/category', [
                                    this.state.categoryId,
                                    parent_id,
                                ]);
                            }
                        }}
                        className="btn btn-warning">
                        <span className="oi oi-x" />&nbsp; Cancel
                    </button>
                </ArticleForm>
                <hr />
                <AttachTable parent_uuid={this.state.uuid} />
                {this.renderRelatedArticle()}
            </NavWrapper>
        );
    }
}

const styles = {};

export default withRouter(ArticleEdit);
