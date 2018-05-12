// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import TagForm from './TagForm';

type PropTypes = {
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    formData: Object,
    errorMessages: Object,
};
export default class TagModal extends React.Component<PropTypes> {
    static defaultProps = {
        open: false,
    };

    render() {
        if (!this.props.open) return null;
        return (
            <CustomModal open={true} close={this.props.handleClose} title="Update tag" size="md">
                <div>
                    <TagForm
                        formId="tagForm"
                        submitTitle="Update"
                        formData={this.props.formData}
                        errorMessages={this.props.errorMessages}
                        handleSubmit={this.props.handleSubmit}>
                        <button type="button" onClick={this.props.handleClose} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </TagForm>
                </div>
            </CustomModal>
        );
    }
}
