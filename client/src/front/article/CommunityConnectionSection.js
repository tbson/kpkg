// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Link} from 'react-router-dom';

import {apiUrls} from '../common/_data';
import Wrapper from '../common/Wrapper';
import ArticleList from './ArticleList';

type Props = {};
type State = {};

class CommunityConnectionSection extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {};
    constructor(props: Props) {
        super(props);
    }

    componentDidMount () {
        document.title = 'Kết nối cộng đồng';
    }

    render() {
        return (
            <Wrapper>
                <div className="row">
                    <div className="col-lg-8 no-padding-right" style={{paddingTop: 10}}>
                        <div className="content-container">
                            <h1>Kết nối cộng đồng</h1>
                        </div>
                        <ArticleList resourceUrl={apiUrls.article} resourceParams={{category__uid: 'ket-noi-cong-ong'}} />
                    </div>
                    <div className="col-lg-4" style={{paddingTop: 10}}>
                        <div className="content-container">
                            <h1>Tin Hoạt Động</h1>
                        </div>
                        <ArticleList
                            alwaysFirst={true}
                            resourceUrl={apiUrls.article}
                            resourceParams={{category__uid: 'tin-hoat-ong'}}
                        />
                    </div>
                </div>
            </Wrapper>
        );
    }
}

export default withRouter(CommunityConnectionSection);
