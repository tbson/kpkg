// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {Link} from 'react-router-dom';
// $FlowFixMe: do not complain about importing node_modules
import LazyLoad from 'react-lazyload';
import Wrapper from '../common/Wrapper';
import Tools from 'src/utils/helpers/Tools';
import {apiUrls} from '../common/_data';

import type {FormValues as ArticleType} from 'src/back/article/_data';

type Props = {};
type State = {
    homeNews: Array<ArticleType>,
    dataLoaded: boolean,
};

export default class News extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {
        homeNews: [],
        dataLoaded: false,
    };
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        const homeNews = Tools.getGlobalState('home_news');

        if (homeNews) {
            return this.setState({
                homeNews,
                dataLoaded: true,
            });
        }
        this.getNews();
    }

    getNews = async () => {
        const result = await Tools.apiCall(apiUrls.homeArticle + '?limit=4', 'GET', {}, false, false);
        if (result.success) {
            this.setState({
                homeNews: result.data.items,
                dataLoaded: true,
            });
            Tools.setGlobalState('home_news', result.data.items);
        }
    };

    renderFirstItem = (item: ArticleType) => {
        if (!item.id || !item.slug) return null;
        const detailUrl = ['/bai-viet', item.id, item.slug].join('/');
        return (
            <div className="content-container" key={item.id}>
                <div className="col-xl-12" key={item.id}>
                    {this.renderThumbnail(item)}
                    <h2>
                        <Link to={detailUrl}>{item.title}</Link>
                    </h2>
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
        if (!item.id || !item.slug) return null;
        const detailUrl = ['/bai-viet', item.id, item.slug].join('/');
        return (
            <LazyLoad height={200} key={item.id}>
                <div className="content-container">
                    <div className="col-xl-12">
                        <div className="row">
                            <div className={item.image ? "col-md-4" : ""}>
                                {this.renderThumbnail(item)}
                            </div>
                            <div className={(item.image ? "col-md-8" : "col-md-12") + " article-description"}>
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
            </LazyLoad>
        );
    };

    renderThumbnail = (item: ArticleType) => {
        if (!item.image) return null;
        return <img src={item.image} className="img-thumbnail" width="100%" title={item.title} alt={item.title} />;
    };

    render() {
        const listItem = this.state.homeNews;
        if (!listItem.length) return null;
        return (
            <div>
                <div className="content-container">
                    <h1>Bài Viết Mới</h1>
                </div>
                {listItem.map((item, index) => {
                    if (!index) return this.renderFirstItem(item);
                    return this.renderOtherItem(item);
                })}
            </div>
        );
    }
}
