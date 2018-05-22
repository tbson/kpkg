// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import AdministratorForm from './AdministratorForm';
import type {FormValues} from '../_data';

type PropTypes = {
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    formValues?: FormValues,
    groupList: Array<Object>,
    formErrors: Object,
};
export default class AdministratorModal extends React.Component<PropTypes> {
    static defaultProps = {
        open: false,
        groupList: [],
    };

    render() {
        if (!this.props.open) return null;
        return (
            <CustomModal open={true} close={this.props.handleClose} title="Update administrator" size="md">
                <div>
                    <AdministratorForm
                        formId="administratorForm"
                        submitTitle="Update"
                        formValues={this.props.formValues}
                        groupList={this.props.groupList}
                        formErrors={this.props.formErrors}
                        handleSubmit={this.props.handleSubmit}>
                        <button type="button" onClick={this.props.handleClose} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </AdministratorForm>
                </div>
            </CustomModal>
        );
    }
}
