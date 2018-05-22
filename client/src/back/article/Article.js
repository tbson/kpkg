// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import {apiUrls} from './_data';
import NavWrapper from 'src/utils/components/NavWrapper';
import ArticleTable from './tables/ArticleTable';

type Props = {
    match: Object
};
type States = {};

class Article extends React.Component<Props, States> {
    state = {};

    constructor(props: Props) {
        super(props);
    }

    componentDidMount () {
        document.title = 'Article manager';
    }

    render() {
        return (
            <NavWrapper>
                <ArticleTable parent="category" parent_id={this.props.match.params.parent_id}/>
            </NavWrapper>
        );
    }
}

const styles = {};

export default withRouter(Article);
