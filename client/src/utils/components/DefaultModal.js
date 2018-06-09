// @flow
import * as React from 'react';
import CustomModal from 'src/utils/components/CustomModal';

type Props = {
    open: boolean,
    title: string,
    handleClose: Function,
    children: React.Node,
};

type States = {
    modalTitle: string,
};

export default class DefaultModal extends React.Component<Props, States> {
    static defaultProps = {
        open: false,
        title: ''
    };

    render() {
        if (!this.props.open) return null;
        const {handleClose, children, title} = this.props;
        return (
            <CustomModal open={true} close={handleClose} title={title} size="md">
                <div className="modal-inner">
                    {children}
                </div>
            </CustomModal>
        );
    }
}
