// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import {apiUrls} from './_data';
import NavWrapper from 'src/utils/components/NavWrapper';
import CCalendarTable from './tables/CCalendarTable';

type Props = {};
type States = {};

class CCalendar extends React.Component<Props, States> {
    state = {};

    constructor(props: Props) {
        super(props);
    }

    componentDidMount () {
        document.title = 'CCalendar manager';
    }

    render() {
        return (
            <NavWrapper>
                <CCalendarTable />
            </NavWrapper>
        );
    }
}

const styles = {};

export default withRouter(CCalendar);
