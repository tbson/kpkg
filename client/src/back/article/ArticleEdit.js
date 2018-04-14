// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import {apiUrls} from './_data';
import NavWrapper from 'src/utils/components/NavWrapper';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import AttachTable from 'src/back/attach/tables/AttachTable';
import ArticleForm from './forms/ArticleForm';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    history: Object,
    match: Object,
};
type States = {
    dataLoaded: boolean,
    mainFormData: Object,
    mainFormErr: Object,
    uuid: string,
};

class ArticleEdit extends React.Component<Props, States> {
    handleSubmit: Function;
    handleAdd: Function;
    handleEdit: Function;

    state = {
        dataLoaded: false,
        mainFormData: {},
        mainFormErr: {},
        uuid: Tools.uuid4(),
    };

    constructor(props: Props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        if (!id) {
            this.setState({dataLoaded: true});
        } else {
            Tools.apiCall(apiUrls.crud + id.toString(), 'GET').then(result => {
                if (result.success) {
                    this.setState({
                        mainFormData: result.data,
                        uuid: result.data.uuid,
                        dataLoaded: true,
                    });
                }
            });
        }
    }

    async handleSubmit(event: Object): Promise<boolean> {
        event.preventDefault();
        let error: ?Object = null;
        const params = Tools.formDataToObj(new FormData(event.target));
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
            // this.toggleModal('mainModal');
            return true;
        } else {
            // Have error -> update err object
            this.setState({mainFormErr: error});
            return false;
        }
    }

    async handleAdd(params: {
        category: number,
        uuid: string,
        title: string,
        description: ?string,
        image: Object,
        order: number,
    }) {
        params.uuid = this.state.uuid;
        const result = await Tools.apiCall(apiUrls.crud, 'POST', params);
        if (result.success) {
            // Go back
            Tools.navigateTo(this.props.history, '/articles', [this.props.match.params.category_id]);
            return null;
        }
        return result.data;
    }

    async handleEdit(params: {
        id: number,
        category: number,
        title: string,
        description: ?string,
        image: Object,
        order: number,
        checked: boolean,
    }) {
        const id = String(params.id);
        const result = await Tools.apiCall(apiUrls.crud + id, 'PUT', params);
        if (result.success) {
            // Go back
            Tools.navigateTo(this.props.history, '/articles', [this.props.match.params.category_id]);
            return null;
        }
        return result.data;
    }

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
                    defaultValues={this.state.mainFormData}
                    errorMessages={this.state.mainFormErr}
                    handleSubmit={this.handleSubmit}>
                    <button
                        type="button"
                        onClick={() => {
                            Tools.navigateTo(this.props.history, '/articles', [this.props.match.params.category_id]);
                        }}
                        className="btn btn-warning">
                        <span className="oi oi-x" />&nbsp; Cancel
                    </button>
                </ArticleForm>
                <hr />
                <AttachTable parent_uuid={this.state.uuid} />
            </NavWrapper>
        );
    }
}

const styles = {};

export default withRouter(ArticleEdit);
