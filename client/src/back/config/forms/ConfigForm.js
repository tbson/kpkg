// @flow
import * as React from 'react';
import Tools from 'src/utils/helpers/Tools';
import type {FormValues} from '../_data';
import {defaultFormValues} from '../_data';

type Props = {
    formName: string,
    formValues: FormValues,
    formErrors: Object,
    children?: React.Node,
    handleSubmit: Function,
};
type States = {
    formValues: FormValues,
    actionName: string,
};

export default class ConfigForm extends React.Component<Props, States> {
    static defaultProps = {};
    name = 'config';

    state = {
        formValues: defaultFormValues,
        actionName: '',
    };

    constructor(props: Props) {
        super(props);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: States) {
        return {
            formValues: !Tools.isEmpty(nextProps.formValues) ? nextProps.formValues : defaultFormValues,
            actionName: nextProps.formValues.id ? 'Update' : 'Add new',
        };
    }

    resetForm = () => {
        const {formName} = this.props;
        window.document.querySelector("form[name=${formName}]").reset();
        window.document.querySelector("form[name=${formName}] [name=uid]").focus();
    };

    setClassName = (name: string) => {
        return this.props.formErrors[name] ? 'form-control is-invalid' : 'form-control';
    };

    setErrorMessage = (name: string) => {
        return this.props.formErrors[name];
    };

    render() {
        const {formName} = this.props;
        return (
            <form name={formName} onSubmit={this.props.handleSubmit}>
                <input defaultValue={this.state.formValues.id} name="id" id="${formName}-id" type="hidden" />
                <div className="form-group uid-field">
                    <label htmlFor="${name}-uid">Key</label>
                    <input
                        defaultValue={this.state.formValues.uid}
                        id="${name}-uid"
                        name="uid"
                        type="text"
                        className={this.setClassName('uid')}
                        required
                        autoFocus
                        placeholder="Key..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('uid')}</div>
                </div>

                <div className="form-group value-field">
                    <label htmlFor="${name}-value">Value</label>
                    <input
                        defaultValue={this.state.formValues.value}
                        id="${name}-value"
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
                    <button className="btn btn-primary main-action">
                        <span className="oi oi-check" />&nbsp;
                        <span className="label">
                            {this.state.actionName}
                        </span>
                    </button>
                </div>
            </form>
        );
    }
}
