// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import CustomModal from 'src/utils/components/CustomModal';
// import FormLogin from './forms/FormLogin';
import {apiUrls} from './_data';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    history: Object,
    match: Object,
};

type States = {
    message: string,
};

class ResetPassword extends React.Component<Props, States> {

    constructor(props) {
        super(props);
        this.state = {
            message: 'Resetting password...',
        };
    }

    async componentDidMount() {
        const result = await Tools.apiCall(apiUrls.resetPassword, 'GET', this.props.match.params);
        if (result.success) {
            Tools.logout(this.props.history);
        } else {
            const message = ['Wrong token or token expired', 'Login page comming in 4 seconds.'].join('. ');
            this.setState({
                message,
            });
            setTimeout(() => {
                Tools.navigateTo(this.props.history, '/login');
            }, 4000);
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">{this.state.message}</div>
                </div>
            </div>
        );
    }
}

export default withRouter(ResetPassword);
