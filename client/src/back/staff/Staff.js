// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import {actions, apiUrls} from './_data';
import NavWrapper from 'src/utils/components/NavWrapper';
import StaffTable from './tables/StaffTable';

type Props = {};
type States = {};

class Staff extends React.Component<Props, States> {
    state = {};

    constructor(props: Props) {
        super(props);
    }

    componentDidMount () {
        document.title = 'Staff/Gallery manager';
    }

    render() {
        return (
            <NavWrapper>
                <StaffTable />
            </NavWrapper>
        );
    }
}

const styles = {};

export default withRouter(Staff);
