// @flow
import * as React from 'react';

type Props = {
    handleSubmit: Function,
    children?: React.Node,
    formId: string,
    submitTitle: string,
    defaultValues: {
        id: ?number,
        uid: ?string,
        value: ?string,
    },
    errorMessages: Object,
};
type States = {};

export default class ConfigForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;

    static defaultProps = {
        submitTitle: 'Submit',
        defaultValues: {
            id: null,
            uid: null,
            value: null,
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
        window.document.querySelector('#' + this.props.formId + ' [name=uid]').focus();
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
                <div className="form-group">
                    <label htmlFor="uid">Key</label>
                    <input
                        defaultValue={this.props.defaultValues.uid}
                        id="uid"
                        name="uid"
                        type="text"
                        className={this.setClassName('uid')}
                        required
                        autoFocus
                        placeholder="Key..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('uid')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="value">Value</label>
                    <input
                        defaultValue={this.props.defaultValues.value}
                        id="value"
                        name="value"
                        type="text"
                        className={this.setClassName('value')}
                        required
                        placeholder="Value..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('value')}</div>
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

