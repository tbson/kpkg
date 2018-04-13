// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import AdministratorForm from './AdministratorForm';

type PropTypes = {
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    defaultValues: Object,
    groupList: Array<Object>,
    errorMessages: Object,
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
                        defaultValues={this.props.defaultValues}
                        groupList={this.props.groupList}
                        errorMessages={this.props.errorMessages}
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
