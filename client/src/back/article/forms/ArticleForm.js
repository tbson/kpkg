// @flow
import * as React from 'react';
import RichTextInput from 'src/utils/components/RichTextInput';
import Tools from 'src/utils/helpers/Tools';
export type defaultValues = {
    id: ?number,
    title: ?string,
    description: ?string,
    content: ?string,
    image: ?string,
    order: ?number,
};
type Props = {
    handleSubmit: Function,
    children?: React.Node,
    parent_uuid: string,
    formId: string,
    submitTitle: string,
    defaultValues: defaultValues,
    errorMessages: Object,
};
type States = {
    defaultValues: defaultValues,
};

export default class ArticleForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;
    renderPreview: Function;
    defaultValues: defaultValues;

    static defaultProps = {
        submitTitle: 'Submit',
        defaultValues: {
            id: null,
            title: '',
            description: '',
            content: '',
            image: null,
            order: null,
        },
        errorMessages: {},
    };

    state = {
        defaultValues: this.props.defaultValues,
    };

    constructor(props: Props) {
        super(props);
        this.resetForm = this.resetForm.bind(this);
        this.setClassName = this.setClassName.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
        this.renderPreview = this.renderPreview.bind(this);
        this.defaultValues = {
            id: null,
            title: '',
            description: '',
            content: '',
            image: '',
            order: 0,
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        if (Tools.emptyObj(nextProps.defaultValues)) {
            this.resetForm();
        }
    }

    resetForm() {
        this.setState({defaultValues: this.defaultValues}, () => {
            window.document.getElementById(this.props.formId).reset();
            window.document.querySelector('#' + this.props.formId + ' [name=title]').focus();
        });
    }

    setClassName(name: string) {
        return this.props.errorMessages[name] ? 'form-control is-invalid' : 'form-control';
    }

    setErrorMessage(name: string) {
        return this.props.errorMessages[name];
    }

    renderPreview() {
        if (!this.props.defaultValues.image) return null;
        return (
            <div className="row">
                <div className="col col-lg-4">
                    <img src={this.props.defaultValues.image} width="100%" />
                </div>
            </div>
        );
    }

    render() {
        return (
            <form id={this.props.formId} onSubmit={this.props.handleSubmit}>
                <input defaultValue={this.state.defaultValues.id} name="id" type="hidden" />
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        defaultValue={this.state.defaultValues.title}
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
                    <textarea
                        defaultValue={this.state.defaultValues.description}
                        id="description"
                        name="description"
                        type="text"
                        className={this.setClassName('description')}
                        placeholder="Description..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('description')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <RichTextInput
                        parent_uuid={this.props.parent_uuid}
                        defaultValue={this.state.defaultValues.content}
                        name="content"
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('content')}</div>
                </div>

                <div className="form-group">
                    {this.renderPreview()}
                    <label htmlFor="image" style={{display: this.state.defaultValues.image ? 'none' : 'block'}}>
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
                        defaultValue={this.state.defaultValues.order}
                        id="order"
                        name="order"
                        type="number"
                        className={this.setClassName('order')}
                        placeholder="Order..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('order')}</div>
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
