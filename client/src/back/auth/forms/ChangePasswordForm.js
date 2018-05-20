// @flow
import * as React from 'react';

type Props = {
    children?: React.Node,
    handleSubmit: Function,
    formId: string,
    submitTitle: string,
};

type States = {};

class ChangePasswordForm extends React.Component<Props, States> {
    resetForm: Function;

    static defaultProps = {
        submitTitle: 'Submit',
    };

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    resetForm = () => {
        window.document.getElementById(this.props.formId).reset();
        window.document.querySelector('#' + this.props.formId + ' [name=oldPassword]').focus();
    };

    render() {
        return (
            <form id={this.props.formId} onSubmit={this.props.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="oldPassword">Old password</label>
                    <div className="input-group">
                        <span className="input-group-addon">
                            <span className="oi oi-lock-locked" />
                        </span>
                        <input
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            className="form-control"
                            required
                            autoFocus
                            placeholder="Old password..."
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <div className="input-group">
                        <span className="input-group-addon">
                            <span className="oi oi-lock-locked" />
                        </span>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            required
                            placeholder="New password..."
                        />
                    </div>
                </div>

                <div className="right">
                    {this.props.children}
                    <button type="submit" className="btn btn-primary">
                        <span className="oi oi-check" />&nbsp;
                        {this.props.submitTitle}
                    </button>
                </div>
            </form>
        );
    }
}

export default ChangePasswordForm;
