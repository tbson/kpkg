// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import {actions, apiUrls} from './_data';
import NavWrapper from 'src/utils/components/NavWrapper';
import ArticleEdit from './ArticleEdit';

type Props = {
    match: Object
};
type States = {};

class ArticleEditRelated extends React.Component<Props, States> {
    state = {};

    constructor(props: Props) {
        super(props);
    }

    render() {
        const {category_id, parent_id} = this.props.match.params;
        return (
            <ArticleEdit parent="article" category_id={category_id} parent_id={parent_id}/>
        );
    }
}

const styles = {};

export default withRouter(ArticleEditRelated);
