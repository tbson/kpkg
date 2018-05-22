// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import BannerForm from './BannerForm';
import type {FormValues} from '../_data';

type PropTypes = {
    uuid: string,
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    formValues: FormValues,
    formErrors: Object,
};
export default class BannerModal extends React.Component<PropTypes> {
    static defaultProps = {
        open: false,
    };

    render() {
        if (!this.props.open) return null;
        return (
            <CustomModal open={true} close={this.props.handleClose} title="Update banner" size="md">
                <div>
                    <BannerForm
                        formId="bannerForm"
                        submitTitle="Update"
                        uuid={this.props.uuid}
                        formValues={this.props.formValues}
                        formErrors={this.props.formErrors}
                        handleSubmit={this.props.handleSubmit}>
                        <button type="button" onClick={this.props.handleClose} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </BannerForm>
                </div>
            </CustomModal>
        );
    }
}
