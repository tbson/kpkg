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
        const {handleClose, formValues, formErrors, handleSubmit} = this.props;
        return (
            <CustomModal open={true} close={handleClose} title={this.state.modalTitle} size="md">
                <div className="modal-inner">
                    <ConfigForm
                        formName="config"
                        formValues={formValues}
                        formErrors={formErrors}
                        handleSubmit={handleSubmit}>
                        <button type="button" onClick={handleClose} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </ConfigForm>
                </div>
            </CustomModal>
        );
    }
}
