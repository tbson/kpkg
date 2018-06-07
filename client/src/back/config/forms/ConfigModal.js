// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import ConfigForm from './ConfigForm';
import type {FormValues} from '../_data';

type Props = {
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    formValues: FormValues,
    formErrors: Object,
};

type States = {
    modalTitle: string,
};

export default class ConfigModal extends React.Component<Props, States> {
    static defaultProps = {
        open: false,
    };

    state = {
        modalTitle: '',
    };

    static getDerivedStateFromProps(nextProps: Props, prevState: States) {
        return {
            modalTitle: nextProps.formValues.id ? 'Update config' : 'Add new config',
        };
    }

    render() {
        if (!this.props.open) return null;
        return (
            <CustomModal open={true} close={this.props.handleClose} title={this.state.modalTitle} size="md">
                <div>
                    <ConfigForm
                        formId="configForm"
                        submitTitle="Update"
                        formValues={this.props.formValues}
                        formErrors={this.props.formErrors}
                        handleSubmit={this.props.handleSubmit}>
                        <button type="button" onClick={this.props.handleClose} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </ConfigForm>
                </div>
            </CustomModal>
        );
    }
}
