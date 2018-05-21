// @flow
import * as React from 'react';
import Tools from 'src/utils/helpers/Tools';
import type {FormValues} from '../_data';

type Props = {
    handleSubmit: Function,
    children?: React.Node,
    uuid: string,
    formId: string,
    submitTitle: string,
    formValues: FormValues,
    errorMessages: Object,
};
type States = {
    formValues: FormValues,
};


const _defaultFormValues: FormValues = {}

export default class AttachForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;
    renderPreview: Function;

    static defaultProps = {
        submitTitle: 'Submit',
    };

    state = {
        formValues: _defaultFormValues,
    };
    constructor(props: Props) {
        super(props);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: States) {
        return {formValues: !Tools.emptyObj(nextProps.formValues) ? nextProps.formValues : _defaultFormValues};
    }

    resetForm = () => {
        window.document.getElementById(this.props.formId).reset();
        window.document.querySelector('#' + this.props.formId + ' [name=title]').focus();
    };

    setClassName = (name: string) => {
        return this.props.errorMessages[name] ? 'form-control is-invalid' : 'form-control';
    };

    setErrorMessage = (name: string) => {
        return this.props.errorMessages[name];
    };

    renderPreview = () => {
        const {attachment, filetype, title} = this.state.formValues;
        if (!attachment) return null;
        if (filetype != 'image')
            return (
                <a href={attachment} target="_blank">
                    {title}
                </a>
            );
        return (
            <div className="row">
                <div className="col col-lg-4">
                    <img src={attachment} width="100%" />
                </div>
            </div>
        );
    };

    render() {
        return (
            <form id={this.props.formId} onSubmit={this.props.handleSubmit}>
                <input defaultValue={this.state.formValues.id} name="id" type="hidden" />
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        defaultValue={this.state.formValues.title}
                        id="title"
                        name="title"
                        type="text"
                        className={this.setClassName('title')}
                        autoFocus
                        placeholder="Title..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('title')}</div>
                </div>

                <div className="form-group">
                    {this.renderPreview()}
                    <label
                        htmlFor="attachment"
                        style={{display: this.state.formValues.attachment ? 'none' : 'block'}}>
                        Attachment
                    </label>
                    <input
                        id="attachment"
                        name="attachment"
                        type="file"
                        className={this.setClassName('attachment')}
                        placeholder="Attachment..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('attachment')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="order">Order</label>
                    <input
                        defaultValue={this.state.formValues.order}
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
