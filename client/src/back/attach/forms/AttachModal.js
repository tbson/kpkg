// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import AttachForm from './AttachForm';

type PropTypes = {
    uuid: string,
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    defaultValues: Object,
    errorMessages: Object,
};
export default class AttachModal extends React.Component<PropTypes> {
    static defaultProps = {
        open: false,
    };

    render() {
        if (!this.props.open) return null;
        return (
            <CustomModal open={true} close={this.props.handleClose} title="Update attach" size="md">
                <div>
                    <AttachForm
                        formId="attachForm"
                        submitTitle="Update"
                        uuid={this.props.uuid}
                        defaultValues={this.props.defaultValues}
                        errorMessages={this.props.errorMessages}
                        handleSubmit={this.props.handleSubmit}>
                        <button type="button" onClick={this.props.handleClose} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </AttachForm>
                </div>
            </CustomModal>
        );
    }
}
