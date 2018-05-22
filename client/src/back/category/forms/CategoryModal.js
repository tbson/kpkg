// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';
import CategoryForm from './CategoryForm';
import type {FormValues, CatType} from '../_data';

type PropTypes = {
    open: boolean,
    handleClose: Function,
    handleSubmit: Function,
    formValues: FormValues,
    formErrors: Object,
    typeList: Array<CatType>,
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
                        formValues={this.props.formValues}
                        formErrors={this.props.formErrors}
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
