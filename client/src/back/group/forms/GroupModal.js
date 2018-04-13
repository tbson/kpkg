// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import GroupForm from './GroupForm';

type PropTypes = {
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    defaultValues: Object,
    permissionList: Object,
    errorMessages: Object,
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
                        defaultValues={this.props.defaultValues}
                        permissionList={this.props.permissionList}
                        errorMessages={this.props.errorMessages}
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
