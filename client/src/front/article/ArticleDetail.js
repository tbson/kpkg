// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Link} from 'react-router-dom';

import {apiUrls} from '../common/_data';
import Wrapper from '../common/Wrapper';
import Carousel from 'src/utils/components/Carousel';
import Tools from 'src/utils/helpers/Tools';

type Props = {
    match: Object,
    location: Object,
};
type State = {
    article: Object,
    dataLoaded: boolean,
    pathname: ?string,
    listStaff: Array<Object>,
};

class ArticleDetail extends React.Component<Props, State> {
    getArticleFromId: Function;
    getArticleFromCategoryUid: Function;
    setInitData: Function;
    renderBanner: Function;
    renderStaff: Function;
    getListStaff: Function;
    setTitle: Function;

    static defaultProps = {};
    state: State = {
        pathname: null,
        article: {},
        dataLoaded: false,
        listStaff: [],
    };
    constructor(props: Props) {
        super(props);
        this.getArticleFromId = this.getArticleFromId.bind(this);
        this.getArticleFromCategoryUid = this.getArticleFromCategoryUid.bind(this);
        this.renderBanner = this.renderBanner.bind(this);
        this.renderStaff = this.renderStaff.bind(this);
        this.getListStaff = this.getListStaff.bind(this);
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
        const {article} = this.state;
        const widthRatio = article.category ? article.category.width_ratio : 100;
        const figures = document.querySelector('.content-container figure');
        const imgs = document.querySelector('.content-container figure img');
        if (figures) {
            figures.className += ' center';
        }
        if (imgs) {
            imgs.style.width = widthRatio + '%';
        }
    }

    async componentDidMount() {
        this.setInitData();
        if (this.props.match.url == '/bai-viet/ai-thien-van') {
            this.getListStaff();
        }
    }

    setTitle(uid) {
        switch (uid) {
            case 'gioi-thieu':
                document.title = 'Giới thiệu';
                break;
            case 'ai-thien-van':
                document.title = 'Đài thiên văn';
                break;
            case 'nha-chieu-hinh':
                document.title = 'Nhà chiếu hình';
                break;
            case 'chuong-trinh-tham-quan':
                document.title = 'Chương trình tham quan';
                break;
            default:
                document.title = uid;
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

    async getListStaff(uid: string) {
        const params = {};
        const result = await Tools.apiCall(apiUrls.staff, 'GET', params, false, false);
        if (result.success) {
            this.setState({
                listStaff: result.data.items,
            });
            Tools.setGlobalState('listStaff', result.data.items);
        }
    }

    renderBanner(article: Object) {
        if (!article.thumbnail_in_content) return null;
        const {attaches} = article;
        const widthRatio = article.category ? article.category.width_ratio : 100;
        if (article.use_slide && attaches.length) {
            return (
                <div>
                    <Carousel listItem={attaches} imageKey="attachment" />
                    <br />
                </div>
            );
        } else {
            if (!article.image) return null;
            return (
                <div className="center">
                    <img
                        src={article.image}
                        className={'img-thumbnail'}
                        width={widthRatio + '%'}
                        title={article.title}
                        alt={article.title}
                    />
                </div>
            );
        }
    }

    renderStaff() {
        if (this.props.match.url != '/bai-viet/ai-thien-van') return null;
        return (
            <div className="row">
                {this.state.listStaff.map(staff => (
                    <div className="col-lg-6" key={staff.id}>
                        <div className="content-container">
                            <div className="row">
                                <div className="col-lg-4">
                                    <img src={staff.image} width="100%" />
                                </div>
                                <div className="col-lg-8">
                                    <p>
                                        <strong>
                                            {staff.title} {staff.fullname}
                                        </strong>
                                    </p>
                                    <div>{staff.description}</div>
                                    <div>
                                        <a href={'email:' + staff.email}>{staff.email}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    render() {
        const {article} = this.state;
        return (
            <Wrapper>
                <div className="content-container">
                    <h1>{article.title}</h1>
                    <hr />
                    {this.renderBanner(article)}
                    <div dangerouslySetInnerHTML={{__html: Tools.addAlt(article.content, article.title)}} />
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
                                            <p>{Tools.getText(item.description)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                {this.renderStaff()}
            </Wrapper>
        );
    }
}

export default withRouter(ArticleDetail);
