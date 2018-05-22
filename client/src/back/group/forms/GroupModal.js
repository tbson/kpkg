// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import GroupForm from './GroupForm';
import type {FormValues} from '../_data';
import type {FormValues as PermissionType} from 'src/back/permission/_data';

type PropTypes = {
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    formValues: FormValues,
    permissionList: {[string]: PermissionType},
    formErrors: Object,
};
export default class GroupModal extends React.Component<PropTypes> {
    static defaultProps = {
        open: false,
    };

    render() {
        if (!this.props.open) return null;
        return (
            <CustomModal open={true} close={this.props.handleClose} title="Update config" size="md">
                <div>
                    <GroupForm
                        formId="configForm"
                        submitTitle="Update"
                        formValues={this.props.formValues}
                        permissionList={this.props.permissionList}
                        formErrors={this.props.formErrors}
                        handleSubmit={this.props.handleSubmit}>
                        <button type="button" onClick={this.props.handleClose} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </GroupForm>
                </div>
            </CustomModal>
        );
    }
}
