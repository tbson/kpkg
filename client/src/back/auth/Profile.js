// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import CustomModal from 'src/utils/components/CustomModal';
import {apiUrls} from './_data';
import Tools from 'src/utils/helpers/Tools';
import NavWrapper from 'src/utils/components/NavWrapper';
import UpdateProfileForm from './forms/UpdateProfileForm';
import ChangePasswordForm from './forms/ChangePasswordForm';

type Props = Object;
type States = {
    authData: Object,
    profileModal: boolean,
    profileDefaultValue: Object,
    profileErrorMessage: Object,
    changePasswordModal: boolean,
    changePasswordError: string,
};

class Profile extends React.Component<Props, States> {
    toggleModal: Function;
    renderErrorMessage: Function;
    renderProfileModal: Function;
    renderChangePasswordModal: Function;
    handleUpdateProfile: Function;
    handleChangePassword: Function;

    constructor(props) {
        super(props);
        this.state = {
            authData: Tools.getStorageObj('authData'),
            profileModal: false,
            profileDefaultValue: {},
            profileErrorMessage: {},
            changePasswordModal: false,
            changePasswordError: '',
        };
    }

    componentDidMount = () => {
        document.title = 'Profile';
        Tools.apiCall(apiUrls.profile, 'GET');
    };

    handleUpdateProfile = async event => {
        event.preventDefault();
        const data = Tools.formDataToObj(new FormData(event.target));

        const result = await Tools.apiCall(apiUrls.profile, 'POST', data);
        if (result.success) {
            Tools.setStorage('authData', result.data);
            this.setState({authData: Tools.getStorageObj('authData')});
            this.toggleModal('profileModal');
        } else {
            this.setState({profileErrorMessage: result.data});
        }
    };

    handleChangePassword = async event => {
        event.preventDefault();
        const data = Tools.formDataToObj(new FormData(event.target));

        const result = await Tools.apiCall(apiUrls.changePassword, 'POST', data);
        if (result.success) {
            this.toggleModal('changePasswordModal');
        } else {
            this.setState({
                changePasswordError: Tools.errorMessageProcessing(result.data),
            });
        }
    };

    toggleModal = (modalId: string) => {
        let state = {};
        state[modalId] = !this.state[modalId];
        switch (modalId) {
            case 'profileModal':
                if (state[modalId]) {
                    Tools.apiCall(apiUrls.profile, 'GET').then(result => {
                        state.profileDefaultValue = result.data;
                        this.setState(state);
                    });
                    return;
                }
                break;
            case 'changePasswordModal':
                state.changePasswordError = '';
                break;
        }
        this.setState(state);
    };

    renderErrorMessage = (message: ?string = '') => {
        if (!message) return null;
        return (
            <div className="alert alert-danger" role="alert" style={{marginTop: 16}}>
                {message}
            </div>
        );
    };

    renderProfileModal = (defaultValue, errorMessage) => {
        // const authData = Tools.getStorageObj('authData');
        const modalId = 'profileModal';
        return (
            <CustomModal
                open={this.state[modalId]}
                close={() => this.toggleModal(modalId)}
                title="Update profile"
                size="md">
                <div>
                    <UpdateProfileForm
                        formId="updateProfileForm"
                        defaultValue={defaultValue}
                        errorMessage={errorMessage}
                        submitTitle="Update profile"
                        handleSubmit={this.handleUpdateProfile}>
                        <button type="button" onClick={() => this.toggleModal(modalId)} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </UpdateProfileForm>
                </div>
            </CustomModal>
        );
    };

    renderChangePasswordModal = () => {
        const authData = Tools.getStorageObj('authData');
        const modalId = 'changePasswordModal';
        return (
            <CustomModal
                open={this.state[modalId]}
                close={() => this.toggleModal(modalId)}
                title="Change password"
                size="md">
                <div>
                    <ChangePasswordForm
                        formId="changePasswordForm"
                        submitTitle="Change password"
                        handleSubmit={this.handleChangePassword}>
                        <button type="button" onClick={() => this.toggleModal(modalId)} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </ChangePasswordForm>
                    {this.renderErrorMessage(this.state.changePasswordError)}
                </div>
            </CustomModal>
        );
    };

    render() {
        const authData = this.state.authData;
        return (
            <NavWrapper>
                <div>
                    <div>Email: {authData.email}</div>
                    <div>Username: {authData.username}</div>
                    <div>Fullname: {authData.fullname}</div>
                </div>
                <div>
                    <button onClick={() => this.toggleModal('profileModal')} className="btn btn-success">
                        Update profile
                    </button>
                    <button onClick={() => this.toggleModal('changePasswordModal')} className="btn btn-primary">
                        Change password
                    </button>
                </div>
                {this.renderProfileModal(this.state.profileDefaultValue, this.state.profileErrorMessage)}
                {this.renderChangePasswordModal()}
            </NavWrapper>
        );
    }
}

const styles = {};

export default withRouter(Profile);
