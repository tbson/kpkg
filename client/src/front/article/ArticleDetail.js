// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Link} from 'react-router-dom';

import {apiUrls} from '../common/_data';
import Wrapper from '../common/Wrapper';
import Tags from '../common/Tags';
import Carousel from 'src/utils/components/Carousel';
import Tools from 'src/utils/helpers/Tools';
import type {FormValues as ArticleType} from 'src/back/article/_data';

type Props = {
    match: Object,
    location: Object
};
type State = {
    article: Object,
    dataLoaded: boolean,
    listStaff: Array<Object>
};

class ArticleDetail extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {
        article: {},
        dataLoaded: false,
        listStaff: []
    };
    constructor(props: Props) {
        super(props);
    }

    async componentDidMount() {
        this.setInitData();
        const {article} = this.state;
        if (article) {
            const widthRatio = article.category ? article.category.width_ratio : 100;
            const imgs = document.querySelectorAll('.content-container figure img');

            if (imgs.length) {
                for (let i = 0; i < imgs.length; i++) {
                    const img = imgs[i];
                    img.style.width = widthRatio + '%';
                }
            }
        }
        if (this.props.match.url == '/bai-viet/ket-noi-cong-dong') {
            this.getListStaff();
        }

        if (['/bai-viet/nha-chieu-hinh', '/bai-viet/chuong-trinh-tham-quan'].includes(this.props.match.url)) {
            Tools.emitEmitter('SHOW_BANNER', false);
        }
    }

    setTitle = (slug: string) => {
        switch (slug) {
            case 'gioi-thieu':
                document.title = 'Giới thiệu';
                break;
            case 'ket-noi-cong-dong':
                document.title = 'Kết nối cộng đồng';
                break;
            case 'nha-chieu-hinh':
                document.title = 'Nhà chiếu hình';
                break;
            case 'chuong-trinh-tham-quan':
                document.title = 'Chương trình tham quan';
                break;
            default:
                document.title = slug;
        }
    };

    setInitData = () => {
        const {id, slug, uid} = this.props.match.params;
        const {pathname} = this.props.location;
        const article = Tools.getGlobalState(pathname);
        if (id === undefined) {
            this.setTitle(uid);
        }
        if (article) {
            if (id !== undefined) {
                this.setTitle(article.title);
            }
            return this.setState({
                article,
                dataLoaded: true
            });
        }

        if (id !== undefined && slug !== undefined) {
            this.getArticleFromId(id);
        } else {
            this.getArticleFromCategoryUid(uid);
        }
    };

    getArticleFromId = async (id: number) => {
        const {pathname} = this.props.location;
        const result = await Tools.apiCall(apiUrls.article + id.toString(), 'GET', {}, false, false);
        if (result.success) {
            this.setTitle(result.data.title);
            this.setState({
                article: result.data,
                dataLoaded: true
            });
            Tools.setGlobalState(pathname, result.data);
        }
    };

    getArticleFromCategoryUid = async (uid: string) => {
        const {pathname} = this.props.location;
        const params = {
            category__uid: uid
        };
        const result = await Tools.apiCall(apiUrls.articleSingle, 'GET', params, false, false);
        if (result.success) {
            this.setState({
                article: result.data.items[0],
                dataLoaded: true
            });
            Tools.setGlobalState(pathname, result.data.items[0]);
        }
    };

    getListStaff = async () => {
        const params = {};
        const result = await Tools.apiCall(apiUrls.staff, 'GET', params, false, false);
        if (result.success) {
            this.setState({
                listStaff: result.data.items
            });
            Tools.setGlobalState('listStaff', result.data.items);
        }
    };

    renderBanner = (article: Object) => {
        if (!article.thumbnail_in_content) return null;
        const {attaches} = article;
        const widthRatio = article.category ? article.category.width_ratio : 100;
        if (article.use_slide && attaches.length) {
            return (
                <div className="center">
                    <div style={{width: widthRatio + '%', margin: 'auto'}}>
                        <Carousel listItem={attaches} imageKey="attachment" />
                        <br />
                    </div>
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
    };

    renderStaff = () => {
        if (this.props.match.url != '/bai-viet/ket-noi-cong-dong') return null;
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
    };

    renderThumbnail = (item: ArticleType) => {
        if (!item.image) return null;
        return <img src={item.image} className="img-thumbnail" width="100%" title={item.title} alt={item.title} />;
    };

    renderFirstItem = (item: ArticleType) => {
        const detailUrl = ['/bai-viet', item.id, item.slug].join('/');
        return (
            <div className="col-xl-6" key={item.id}>
                <div className="content-container">
                    <h2>
                        <Link to={detailUrl}>{item.title}</Link>
                    </h2>
                    {this.renderThumbnail(item)}
                    <div className="date-time">
                        <em>Ngày đăng: {Tools.dateFormat(item.created_at)}</em>
                    </div>
                    <div className="row">
                        <div className="col-md-12 article-description">
                            <p>{Tools.getText(item.description)}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    renderOtherItem = (item: ArticleType) => {
        if (!item.image) return this.renderFirstItem(item);
        const detailUrl = ['/bai-viet', item.id, item.slug].join('/');
        return (
            <div className="col-xl-6" key={item.id}>
                <div className="content-container">
                    <div className="row">
                        <div className="col-md-4">{this.renderThumbnail(item)}</div>
                        <div className="col-md-8 article-description">
                            <h2>
                                <Link to={detailUrl}>{item.title}</Link>
                            </h2>
                            <div className="date-time">
                                <em>Ngày đăng: {Tools.dateFormat(item.created_at)}</em>
                            </div>
                            <p>{Tools.getText(item.description)}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    renderRelatedArticle = (article: ArticleType) => {
        let listItem = article.same_tag_articles || [];
        let relatedArticles = article.related_articles || [];
        if (relatedArticles.length) {
            listItem = relatedArticles;
        }
        return listItem.map(this.renderOtherItem);
    };

    renderTags = (article: ArticleType) => {
        if (!article || !article.category) return null;
        if (!['tin-tuc', 'kien-thuc'].includes(article.category.uid)) return null;
        const tagList = article.tag_list || [];
        const usedTags = article.tags || [];
        return <Tags list={tagList.filter(tag => usedTags.includes(tag.id))} />;
    };

    renderContent = (article: ArticleType) => {
        if (!article) {
            return (
                <div className="content-container">
                    <h2>Không tìm thấy bài viết</h2>
                </div>
            );
        }
        return (
            <div>
                <div className="content-container">
                    <h1 className="article-title">{article.title}</h1>
                    <hr />
                    {this.renderBanner(article)}
                    <div
                        className="article-content"
                        dangerouslySetInnerHTML={{__html: Tools.addAlt(article.content, article.title)}}
                    />
                    {this.renderTags(article)}
                </div>
                <div className="row">{this.renderRelatedArticle(article)}</div>
                {this.renderStaff()}
            </div>
        );
    };

    render() {
        const {article} = this.state;
        return <Wrapper>{this.renderContent(article)}</Wrapper>;
    }
}

export default withRouter(ArticleDetail);
