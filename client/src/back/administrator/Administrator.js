// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import {apiUrls} from './_data';
import NavWrapper from 'src/utils/components/NavWrapper';
import AdministratorTable from './tables/AdministratorTable';

type Props = {};
type States = {};

class Administrator extends React.Component<Props, States> {
    state = {};

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        document.title = 'Administrator manager';
    }

    render() {
        return (
            <NavWrapper>
                <AdministratorTable />
            </NavWrapper>
        );
    }
}

const styles = {};

export default withRouter(Administrator);
