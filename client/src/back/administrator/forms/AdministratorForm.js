// @flow
import * as React from 'react';
import SelectInput from 'src/utils/components/SelectInput';

type Props = {
    handleSubmit: Function,
    children?: React.Node,
    formId: string,
    submitTitle: string,
    defaultValues: {
        id: ?number,
        email: ?string,
        username: ?string,
        first_name: ?string,
        last_name: ?string,
        password: ?string,
        groups: ?number,
    },
    groupList: Array<Object>,
    errorMessages: Object,
};
type States = {};

export default class AdministratorForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;

    static defaultProps = {
        submitTitle: 'Submit',
        defaultValues: {
            id: null,
            email: null,
            username: null,
            first_name: null,
            last_name: null,
            password: null,
            groups: null,
        },
        groupList: [],
        errorMessages: {},
    };

    state = {};
    constructor(props: Props) {
        super(props);
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
                <input defaultValue={this.props.defaultValues.id} name="id" type="hidden" />
                <div className="row">
                    <div className="col-sm">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                defaultValue={this.props.defaultValues.email}
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
                                defaultValue={this.props.defaultValues.username}
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
                                defaultValue={this.props.defaultValues.first_name}
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
                                defaultValue={this.props.defaultValues.last_name}
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
                        defaultValue={this.props.defaultValues.password}
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
                        defaultValue={this.props.defaultValues.groups}
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
