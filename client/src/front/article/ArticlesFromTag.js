// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Link} from 'react-router-dom';

import {apiUrls} from '../common/_data';
import Wrapper from '../common/Wrapper';
import ArticleList from './ArticleList';

type Props = {
    match: Object
};
type State = {};

class ArticlesFromTag extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {};
    constructor(props: Props) {
        super(props);
    }

    componentDidMount () {
        document.title = 'Tag';
    }

    render() {
        const {id} = this.props.match.params;
        return (
            <Wrapper>
                <div className="row">
                    <div className="col-lg-12" style={{paddingTop: 10}}>
                        <div className="content-container">
                            <h1>Tag</h1>
                        </div>
                        <ArticleList resourceUrl={apiUrls.article} resourceParams={{tags: id}} />
                    </div>
                </div>
            </Wrapper>
        );
    }
}

export default withRouter(ArticlesFromTag);
