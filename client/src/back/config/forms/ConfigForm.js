// @flow
import * as React from 'react';
import Tools from 'src/utils/helpers/Tools';

type formData = {
    id: ?number,
    uid: ?string,
    value: ?string,
};
type Props = {
    handleSubmit: Function,
    children?: React.Node,
    formId: string,
    submitTitle: string,
    formData: formData,
    errorMessages: Object,
};
type States = {
    formData: formData,
};

export default class ConfigForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;

    static defaultProps = {
        submitTitle: 'Submit',
    };

    state = {
        formData: this.props.formData,
    };

    constructor(props: Props) {
        super(props);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: States) {
        const defaultFormData: formData = {
            id: null,
            uid: null,
            value: null,
        };
        return {formData: !Tools.emptyObj(nextProps.formData) ? nextProps.formData : defaultFormData};
    }

    resetForm = () => {
        window.document.getElementById(this.props.formId).reset();
        window.document.querySelector('#' + this.props.formId + ' [name=uid]').focus();
    };

    setClassName = (name: string) => {
        return this.props.errorMessages[name] ? 'form-control is-invalid' : 'form-control';
    };

    setErrorMessage = (name: string) => {
        return this.props.errorMessages[name];
    };

    render() {
        return (
            <form id={this.props.formId} onSubmit={this.props.handleSubmit}>
                <input defaultValue={this.state.formData.id} name="id" type="hidden" />
                <div className="form-group">
                    <label htmlFor="uid">Key</label>
                    <input
                        defaultValue={this.state.formData.uid}
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
                        defaultValue={this.state.formData.value}
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
