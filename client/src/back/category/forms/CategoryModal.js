// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import CategoryForm from './CategoryForm';

type PropTypes = {
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    defaultValues?: Object,
    errorMessages: Object,
    typeList: Array<Object>,
};
export default class CategoryModal extends React.Component<PropTypes> {
    static defaultProps = {
        open: false,
    };

    render() {
        if (!this.props.open) return null;
        return (
            <CustomModal open={true} close={this.props.handleClose} title="Update category" size="md">
                <div>
                    <CategoryForm
                        formId="categoryForm"
                        submitTitle="Update"
                        defaultValues={this.props.defaultValues}
                        errorMessages={this.props.errorMessages}
                        handleSubmit={this.props.handleSubmit}
                        typeList={this.props.typeList}>
                        <button type="button" onClick={this.props.handleClose} className="btn btn-warning">
                            <span className="oi oi-x" />&nbsp; Cancel
                        </button>
                    </CategoryForm>
                </div>
            </CustomModal>
        );
    }
}
