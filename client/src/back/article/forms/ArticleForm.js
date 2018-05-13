// @flow
import * as React from 'react';
import RichTextInput from 'src/utils/components/RichTextInput';
import SelectInput from 'src/utils/components/SelectInput';
import Tools from 'src/utils/helpers/Tools';
export type formData = {
    id: ?number,
    title: string,
    description: string,
    content: string,
    image: string,
    use_slide: boolean,
    order: ?number,
    tags: ?string,
};
type Props = {
    handleSubmit: Function,
    children?: React.Node,
    parent_uuid: string,
    formId: string,
    submitTitle: string,
    formData: formData,
    tagSource: Array<Object>,
    errorMessages: Object,
};
type States = {
    formData: formData,
};

export default class ArticleForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;
    renderPreview: Function;
    defaultFormData: formData;

    static defaultProps = {
        submitTitle: 'Submit',
    };

    constructor(props: Props) {
        super(props);
        this.resetForm = this.resetForm.bind(this);
        this.setClassName = this.setClassName.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
        this.renderPreview = this.renderPreview.bind(this);
        this.defaultFormData = {
            id: null,
            title: '',
            description: '',
            content: '',
            image: '',
            use_slide: false,
            order: 0,
        };
        this.state = {
            formData: !Tools.emptyObj(this.props.formData) ? this.props.formData : this.defaultFormData,
        };
    }

    resetForm() {
        this.setState({formData: this.defaultFormData}, () => {
            window.document.getElementById(this.props.formId).reset();
            window.document.querySelector('#' + this.props.formId + ' [name=title]').focus();
        });
    }

    setClassName(name: string) {
        return this.props.errorMessages[name] ? 'form-control is-invalid' : 'form-control';
    }

    setErrorMessage(name: string) {
        const result = this.props.errorMessages[name];
        return result;
    }

    renderPreview() {
        if (!this.state.formData.image) return null;
        return (
            <div className="row">
                <div className="col col-lg-4">
                    <img src={this.state.formData.image} width="100%" />
                </div>
            </div>
        );
    }

    render() {
        return (
            <form id={this.props.formId} onSubmit={this.props.handleSubmit}>
                <input defaultValue={this.state.formData.id} name="id" type="hidden" />
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        defaultValue={this.state.formData.title}
                        id="title"
                        name="title"
                        type="text"
                        className={this.setClassName('title')}
                        required
                        autoFocus
                        placeholder="Title..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('title')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <RichTextInput
                        parent_uuid={this.props.parent_uuid}
                        defaultValue={this.state.formData.description}
                        name="description"
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('description')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <RichTextInput
                        parent_uuid={this.props.parent_uuid}
                        defaultValue={this.state.formData.content}
                        name="content"
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('content')}</div>
                </div>

                <div className="form-group">
                    {this.renderPreview()}
                    <label htmlFor="image" style={{display: this.state.formData.image ? 'none' : 'block'}}>
                        Image
                    </label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        className={this.setClassName('image')}
                        placeholder="Image..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('image')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="order">Order</label>
                    <input
                        defaultValue={this.state.formData.order}
                        id="order"
                        name="order"
                        type="number"
                        className={this.setClassName('order')}
                        placeholder="Order..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('order')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="groups">Tags</label>
                    <SelectInput
                        multi={true}
                        name="tags"
                        options={this.props.tagSource}
                        defaultValue={this.props.formData.tags}
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('groups')}</div>
                </div>

                <div className="form-check">
                    <input
                        id="use_slide"
                        name="use_slide"
                        type="checkbox"
                        defaultChecked={this.state.formData.use_slide}
                        className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor="use_slide">
                        Use slide
                    </label>
                </div>

                <div className="right">
                    {this.props.children}
                    <button className="btn btn-primary">
                        <span className="oi oi-check" />&nbsp;
                        {this.props.submitTitle}
                    </button>
                </div>
            </form>
        );
    }
}
