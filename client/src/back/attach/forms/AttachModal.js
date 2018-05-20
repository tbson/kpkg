// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import AttachForm from './AttachForm';
import type {FormData} from '../_data';

type PropTypes = {
    uuid: string,
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    formData: FormData,
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
                        formData={this.props.formData}
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
