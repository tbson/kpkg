// @flow
import * as React from 'react';
import Tools from 'src/utils/helpers/Tools';
import SelectInput from 'src/utils/components/SelectInput';
import type {MainFormData} from '../_data';

type Props = {
    handleSubmit: Function,
    children?: React.Node,
    formId: string,
    submitTitle: string,
    formData: MainFormData,
    groupList: Array<Object>,
    errorMessages: Object,
};
type States = {
    formData: MainFormData,
};

const _defaultFormData: MainFormData = {
    id: null,
    email: null,
    username: null,
    first_name: null,
    last_name: null,
    password: null,
    groups: null,
}

export default class AdministratorForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;

    static defaultProps = {
        submitTitle: 'Submit'
    };

    state = {
        formData: _defaultFormData,
    };
    constructor(props: Props) {
        super(props);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: States) {
        return {formData: !Tools.emptyObj(nextProps.formData) ? nextProps.formData : _defaultFormData};
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
                <div className="row">
                    <div className="col-sm">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                defaultValue={this.state.formData.email}
                                id="email"
                                name="email"
                                type="email"
                                className={this.setClassName('email')}
                                required
                                autoFocus
                                placeholder="Email..."
                            />
                            <div className="invalid-feedback">{this.setErrorMessage('email')}</div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                defaultValue={this.state.formData.username}
                                id="username"
                                name="username"
                                type="text"
                                className={this.setClassName('username')}
                                required
                                placeholder="Username..."
                            />
                            <div className="invalid-feedback">{this.setErrorMessage('username')}</div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <div className="form-group">
                            <label htmlFor="first_name">First name</label>
                            <input
                                defaultValue={this.state.formData.first_name}
                                id="first_name"
                                name="first_name"
                                type="text"
                                className={this.setClassName('first_name')}
                                required
                                placeholder="First name..."
                            />
                            <div className="invalid-feedback">{this.setErrorMessage('first_name')}</div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="form-group">
                            <label htmlFor="last_name">Last name</label>
                            <input
                                defaultValue={this.state.formData.last_name}
                                id="last_name"
                                name="last_name"
                                type="text"
                                className={this.setClassName('last_name')}
                                required
                                placeholder="Last name..."
                            />
                            <div className="invalid-feedback">{this.setErrorMessage('last_name')}</div>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        defaultValue={this.state.formData.password}
                        id="password"
                        name="password"
                        type="password"
                        className={this.setClassName('password')}
                        placeholder="Password..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('password')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="groups">Groups</label>
                    <SelectInput
                        multi={true}
                        name="groups"
                        options={this.props.groupList}
                        defaultValue={this.state.formData.groups}
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('groups')}</div>
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
