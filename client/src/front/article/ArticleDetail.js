// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Link} from 'react-router-dom';
// $FlowFixMe: do not complain about importing node_modules
import 'slick-carousel/slick/slick.css';
// $FlowFixMe: do not complain about importing node_modules
import 'slick-carousel/slick/slick-theme.css';
// $FlowFixMe: do not complain about importing node_modules
import Slider from 'react-slick';

import {apiUrls} from '../common/_data';
import Wrapper from '../common/Wrapper';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    match: Object,
    location: Object,
};
type State = {
    article: Object,
    dataLoaded: boolean,
    pathname: ?string,
};

class ArticleDetail extends React.Component<Props, State> {
    getArticleFromId: Function;
    getArticleFromCategoryUid: Function;
    setInitData: Function;
    renderBanner: Function;
    setTitle: Function;

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
        this.renderBanner = this.renderBanner.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.location.pathname !== prevState.pathname) {
            return {pathname: nextProps.location.pathname};
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const {pathname} = this.props.location;
        if (prevProps.location.pathname != pathname) {
            this.setInitData();
        }
    }

    async componentDidMount() {
        this.setInitData();
    }

    setTitle (uid) {
        switch (uid) {
            case 'gioi-thieu':
                document.title = 'Giới thiệu'
                break;
            case 'ai-thien-van':
                document.title = 'Đài thiên văn'
                break;
            case 'nha-chieu-hinh':
                document.title = 'Nhà chiếu hình'
                break;
            case 'chuong-trinh-tham-quan':
                document.title = 'Chương trình tham quan'
                break;
            default:
                document.title = uid
        }
    }

    setInitData() {
        const {id, uid} = this.props.match.params;
        const {pathname} = this.props.location;
        const article = Tools.getGlobalState(pathname);
        if (typeof id == 'undefined') {
            this.setTitle(uid);
        }
        if (article) {
            if (typeof id != 'undefined') {
                this.setTitle(article.title);
            }
            return this.setState({
                article,
                dataLoaded: true,
            });
        }

        if (typeof id != 'undefined' && typeof uid != 'undefined') {
            this.getArticleFromId(id);
        } else {
            this.getArticleFromCategoryUid(uid);
        }
    }

    async getArticleFromId(id: number) {
        const {pathname} = this.props.location;
        const result = await Tools.apiCall(apiUrls.article + id.toString(), 'GET', {}, false, false);
        if (result.success) {
            this.setTitle(result.data.title);
            this.setState({
                article: result.data,
                dataLoaded: true,
            });
            Tools.setGlobalState(pathname, result.data);
        }
    }

    async getArticleFromCategoryUid(uid: string) {
        const {pathname} = this.props.location;
        const params = {
            category__uid: uid,
        };
        const result = await Tools.apiCall(apiUrls.articleSingle, 'GET', params, false, false);
        if (result.success) {
            this.setState({
                article: result.data.items[0],
                dataLoaded: true,
            });
            Tools.setGlobalState(pathname, result.data.items[0]);
        }
    }

    renderBanner(article: Object) {
        const {attaches} = article;
        if (article.use_slide && attaches.length) {
            const settings = {
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
            };
            return (
                <Slider {...settings}>
                    {attaches.map(item => (
                        <div key={item.id}>
                            <img src={item.attachment} width="100%"/>
                        </div>
                    ))}
                </Slider>
            );
        } else {
            return <img src={article.image} className="img-thumbnail" width="100%" />;
        }
    }

    render() {
        const {article} = this.state;
        return (
            <Wrapper>
                <div className="content-container">
                    <h1>{article.title}</h1>
                    <hr />
                    {this.renderBanner(article)}
                    <div dangerouslySetInnerHTML={{__html: article.content}} />
                </div>
                <div className="row">
                    {article.related_articles &&
                        article.related_articles.map(item => (
                            <div className="col-xl-6" key={item.id}>
                                <div className="content-container">
                                    <h2>
                                        <Link to={`/bai-viet/${item.id}/${item.uid}`}>{item.title}</Link>
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
