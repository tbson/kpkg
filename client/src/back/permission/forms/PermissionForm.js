// @flow
import * as React from 'react';

type Props = {
    handleSubmit: Function,
    children?: React.Node,
    formId: string,
    submitTitle: string,
    defaultValues: {
        id: ?number,
        content_type: ?string,
        name: ?string,
        codename: ?string
    },
    errorMessages: Object,
};
type States = {};

export default class PermissionForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;

    static defaultProps = {
        submitTitle: 'Submit',
        defaultValues: {
            id: null,
            content_type: null,
            name: null,
            codename: null,
        },
        errorMessages: {},
    };

    state = {};
    constructor(props: Props) {
        super(props);
        this.resetForm = this.resetForm.bind(this);
        this.setClassName = this.setClassName.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
    }

    resetForm() {
        window.document.getElementById(this.props.formId).reset();
        window.document.querySelector('#' + this.props.formId + ' [name=name]').focus();
    }

    setClassName(name: string) {
        return this.props.errorMessages[name] ? 'form-control is-invalid' : 'form-control';
    }

    setErrorMessage(name: string) {
        return this.props.errorMessages[name];
    }

    render() {
        return (
            <form id={this.props.formId} onSubmit={this.props.handleSubmit}>
                <input defaultValue={this.props.defaultValues.id} name="id" type="hidden" />
                <p>
                    Content type: <strong>{this.props.defaultValues.content_type}</strong>
                </p>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        defaultValue={this.props.defaultValues.name}
                        id="name"
                        name="name"
                        type="text"
                        className={this.setClassName('name')}
                        required
                        autoFocus
                        placeholder="Name..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('name')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="codename">Code name</label>
                    <input
                        defaultValue={this.props.defaultValues.codename}
                        id="codename"
                        name="codename"
                        type="text"
                        className={this.setClassName('codename')}
                        required
                        placeholder="Code name..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('codename')}</div>
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

