// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import {apiUrls} from './_data';
import type {FormValues, FormValuesEdit} from './_data';
import NavWrapper from 'src/utils/components/NavWrapper';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import AttachTable from 'src/back/attach/tables/AttachTable';
import ArticleForm from './forms/ArticleForm';
import ArticleTable from './tables/ArticleTable';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    history: Object,
    match: Object,
    parent: string,
    parent_id: number,
    category_id: ?number,
};
type States = {
    dataLoaded: boolean,
    mainFormValues: Object,
    mainFormErr: Object,
    uuid: string,
    categoryId: ?number,
    tagSource: Array<Object>,
};

class ArticleEdit extends React.Component<Props, States> {
    handleSubmit: Function;
    handleAdd: Function;
    handleEdit: Function;
    renderRelatedArticle: Function;
    getItem: Function;
    getTags: Function;

    static defaultProps = {
        parent: 'category',
        category_id: null,
    };

    state = {
        dataLoaded: false,
        mainFormValues: {},
        mainFormErr: {},
        uuid: Tools.uuid4(),
        categoryId: null,
        tagSource: [],
    };

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.getItem();
        this.getTags();
    }

    getItem = async () => {
        const id = this.props.match.params.id;
        const {parent, parent_id} = this.props;
        if (parent == 'article') {
            const parentArticle = await Tools.apiCall(apiUrls.crud + parent_id.toString(), 'GET');
            this.setState({
                categoryId: parentArticle.data.category,
            });
        }
        if (!id) {
            this.setState({dataLoaded: true});
        } else {
            const result = await Tools.apiCall(apiUrls.crud + id.toString(), 'GET');
            delete result.data.tag_source;
            if (result.success) {
                this.setState({
                    mainFormValues: result.data,
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
        let result: ?Object = null;
        const params = Tools.formDataToObj(new FormValues(event.target));
        if (!params.order) {
            params.order = 0;
        }
        params[this.props.parent] = this.props.match.params.parent_id;
        if (!params.id) {
            result = await this.handleAdd(params);
        } else {
            result = await this.handleEdit(params);
        }

        if (result.success) {
            if (this.props.parent == 'category') {
                // Back to parent list
                Tools.navigateTo(this.props.history, '/articles', [this.props.match.params.parent_id]);
            } else {
                // Back to parent item
                Tools.navigateTo(this.props.history, '/article/category', [
                    this.state.categoryId,
                    this.props.match.params.parent_id,
                ]);
            }
            return true;
        } else {
            // Have error -> update err object
            this.setState({mainFormErr: result.data ? result.data : result});
            return false;
        }
    };

    handleAdd = async (params: FormValues) => {
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
        if (!this.props.match.params.id || this.props.parent != 'category') return null;
        return <ArticleTable search_form={false} parent="article" parent_id={this.props.match.params.id} />;
    };

    render() {
        if (!this.state.dataLoaded)
            return (
                <NavWrapper>
                    <LoadingLabel />
                </NavWrapper>
            );
        return (
            <NavWrapper>
                <ArticleForm
                    parent_uuid={this.state.uuid}
                    formId="articleForm"
                    submitTitle="Update"
                    formData={this.state.mainFormValues}
                    tagSource={this.state.tagSource}
                    errorMessages={this.state.mainFormErr}
                    handleSubmit={this.handleSubmit}>
                    <button
                        type="button"
                        onClick={() => {
                            if (!this.state.categoryId) {
                                Tools.navigateTo(this.props.history, '/articles', [this.props.match.params.parent_id]);
                            } else {
                                Tools.navigateTo(this.props.history, '/article/category', [
                                    this.state.categoryId,
                                    this.props.match.params.parent_id,
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
