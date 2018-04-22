// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import {actions, apiUrls} from './_data';
import NavWrapper from 'src/utils/components/NavWrapper';
import CategoryTable from './tables/CategoryTable';

type Props = {};
type States = {};

class Category extends React.Component<Props, States> {
    state = {};

    constructor(props: Props) {
        super(props);
    }

    componentDidMount () {
        document.title = 'Category manager';
    }

    render() {
        return (
            <NavWrapper>
                <CategoryTable />
            </NavWrapper>
        );
    }
}

const styles = {};

export default withRouter(Category);
