// @flow
import * as React from 'react';
import PermissionsInput from './PermissionsInput';
import Tools from 'src/utils/helpers/Tools';
import type {FormValues} from '../_data';
import type {FormValues as PermissionType} from 'src/back/permission/_data';

type Props = {
    handleSubmit: Function,
    children?: React.Node,
    formId: string,
    submitTitle: string,
    formValues: FormValues,
    permissionList: {[string]: PermissionType},
    formErrors: Object,
};
type States = {
    formValues: FormValues,
};

const _defaultFormValues: FormValues = {};

export default class GroupForm extends React.Component<Props, States> {

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
        window.document.querySelector('#' + this.props.formId + ' [name=name]').focus();
    };

    setClassName = (name: string) => {
        return this.props.formErrors[name] ? 'form-control is-invalid' : 'form-control';
    };

    setErrorMessage = (name: string) => {
        return this.props.formErrors[name];
    };

    render() {
        return (
            <form id={this.props.formId} onSubmit={this.props.handleSubmit}>
                <input defaultValue={this.state.formValues.id} name="id" type="hidden" />
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        defaultValue={this.state.formValues.name}
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

                <PermissionsInput name="permissions" options={this.props.permissionList} />

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
