// @flow
import * as React from 'react';
import PermissionsInput from './PermissionsInput';

type Props = {
    handleSubmit: Function,
    children?: React.Node,
    formId: string,
    submitTitle: string,
    formValues: {
        id: ?number,
        name: ?string,
        permissions: ?string,
    },
    permissionList: Object,
    formErrors: Object,
};
type States = {};

export default class GroupForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;

    static defaultProps = {
        submitTitle: 'Submit',
        formValues: {
            id: null,
            name: null,
            permissions: null,
        },
        permissionList: {},
        formErrors: {},
    };

    state = {};
    constructor(props: Props) {
        super(props);
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
                <input defaultValue={this.props.formValues.id} name="id" type="hidden" />
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        defaultValue={this.props.formValues.name}
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
