// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import CCalendarForm from './CCalendarForm';

type PropTypes = {
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    formValues: Object,
    formErrors: Object,
};
export default class CCalendarModal extends React.Component<PropTypes> {
    static defaultProps = {
        open: false,
    };

    render() {
        if (!this.props.open) return null;
        return (
            <CustomModal open={true} close={this.props.handleClose} title="Update ccalendar" size="md">
                <div>
                    <CCalendarForm
                        formId="ccalendarForm"
                        submitTitle="Update"
                        formValues={this.props.formValues}
                        formErrors={this.props.formErrors}
                        handleSubmit={this.props.handleSubmit}>
                        <button type="button" onClick={this.props.handleClose} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </CCalendarForm>
                </div>
            </CustomModal>
        );
    }
}
