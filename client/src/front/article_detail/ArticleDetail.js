// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Link} from 'react-router-dom';
import {apiUrls} from '../common/_data';
import Wrapper from '../common/Wrapper';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    match: Object,
    location: Object,
};
type State = { article: Object,
    dataLoaded: boolean,
    pathname: ?string
};

class ArticleDetail extends React.Component<Props, State> {
    getArticleFromId: Function;
    getArticleFromCategoryUid: Function;

    static defaultProps = {};
    state: State = {
        pathname: null,
        article: {},
        dataLoaded: false,
    };
    constructor(props: Props) {
        super(props);
        this.getArticleFromId = this.getArticleFromId.bind(this);
        this.getArticleFromCategoryUid = this.getArticleFromCategoryUid.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log(prevState.pathname);
        console.log(nextProps.location.pathname);
        return null;
    }

    componentDidUpdate (prevProps, prevState) {
        const {pathname} = this.props.location;
    }

    async componentDidMount() {
        /*
        const gioiThieu = Tools.getGlobalState('gioiThieu');
        if (gioiThieu) {
            return this.setState({
                article: gioiThieu,
                dataLoaded: true
            });
        }
        */
        const {id, uid} = this.props.match.params;
        if (typeof id != 'undefined' && typeof uid != 'undefined') {
            this.getArticleFromId(id);
        } else {
            this.getArticleFromCategoryUid(uid);
        }
    }

    async getArticleFromId(id: number) {
        const result = await Tools.apiCall(apiUrls.article + id.toString(), 'GET', {}, false, false);
        if (result.success) {
            this.setState({
                article: result.data,
                dataLoaded: true,
            });
            Tools.setGlobalState('gioiThieu', result.data);
        }
    }

    async getArticleFromCategoryUid(uid: string) {
        const params = {
            category__uid: uid,
        };
        const result = await Tools.apiCall(apiUrls.article, 'GET', params, false, false);
        if (result.success) {
            this.setState({
                article: result.data.items[0],
                dataLoaded: true,
            });
            Tools.setGlobalState('gioiThieu', result.data.items[0]);
        }
    }

    render() {
        const {article} = this.state;
        return (
            <Wrapper>
                <div className="content-container">
                    <h1>{article.title}</h1>
                    <hr />
                    <img src={article.image} className="img-thumbnail" width="100%" />
                    <div dangerouslySetInnerHTML={{__html: article.content}} />
                </div>
                <div className="row">
                    {article.related_articles &&
                        article.related_articles.map(item => (
                            <div className="col-xl-6" key={item.id}>
                                <div className="content-container">
                                    <h2>
                                        <Link to={`/bai-viet/${item.id}/${item.uid}`}>
                                            {item.title}
                                        </Link>
                                    </h2>
                                    <hr />
                                    <div className="row">
                                        <div className="col-md-4">
                                            <img src={item.image} className="img-thumbnail" width="100%" />
                                        </div>
                                        <div className="col-md-8 article-description">
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </Wrapper>
        );
    }
}

export default withRouter(ArticleDetail);
