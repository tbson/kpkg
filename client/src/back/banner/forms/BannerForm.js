// @flow
import * as React from 'react';

type Props = {
    handleSubmit: Function,
    children?: React.Node,
    uuid: string,
    formId: string,
    submitTitle: string,
    defaultValues: {
        id: ?number,
        title: ?string,
        description: ?string,
        image: ?string,
        order: ?number,
    },
    errorMessages: Object,
};
type States = {};

export default class BannerForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;
    renderPreview: Function;

    static defaultProps = {
        submitTitle: 'Submit',
        defaultValues: {
            id: null,
            title: null,
            description: null,
            image: null,
            order: null,
        },
        errorMessages: {},
    };

    state = {};
    constructor(props: Props) {
        super(props);
        this.resetForm = this.resetForm.bind(this);
        this.setClassName = this.setClassName.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
        this.renderPreview = this.renderPreview.bind(this);
    }

    resetForm() {
        window.document.getElementById(this.props.formId).reset();
        window.document.querySelector('#' + this.props.formId + ' [name=title]').focus();
    }

    setClassName(name: string) {
        return this.props.errorMessages[name] ? 'form-control is-invalid' : 'form-control';
    }

    setErrorMessage(name: string) {
        return this.props.errorMessages[name];
    }

    renderPreview () {
        if (!this.props.defaultValues.image) return null;
        return (
            <div className="row">
                <div className="col col-lg-4">
                    <img src={this.props.defaultValues.image} width="100%"/>
                </div>
            </div>
        );
    }

    render() {
        return (
            <form id={this.props.formId} onSubmit={this.props.handleSubmit}>
                <input defaultValue={this.props.defaultValues.id} name="id" type="hidden" />
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        defaultValue={this.props.defaultValues.title}
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
                        defaultValue={this.props.defaultValues.description}
                        id="description"
                        name="description"
                        type="text"
                        className={this.setClassName('description')}
                        placeholder="Description..."
                    ></textarea>
                    <div className="invalid-feedback">{this.setErrorMessage('description')}</div>
                </div>

                <div className="form-group">
                    {this.renderPreview()}
                    <label htmlFor="image" style={{display: this.props.defaultValues.image?'none':'block'}}>Image</label>
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
                        defaultValue={this.props.defaultValues.order}
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

