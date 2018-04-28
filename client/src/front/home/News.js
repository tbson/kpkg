// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {Link} from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Wrapper from '../common/Wrapper';
import Tools from 'src/utils/helpers/Tools';
import {apiUrls} from '../common/_data';


type Props = {};
type State = {
    homeNews: Array<Object>,
    dataLoaded: boolean
};

export default class News extends React.Component<Props, State> {
    getNews: Function;

    static defaultProps = {};
    state: State = {
        homeNews: [],
        dataLoaded: false
    };
    constructor(props: Props) {
        super(props);
        this.getNews = this.getNews.bind(this);
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

    async getNews() {
        const result = await Tools.apiCall(apiUrls.articleNews, 'GET', {}, false, false);
        if (result.success) {
            this.setState({
                homeNews: result.data.items,
                dataLoaded: true,
            });
            Tools.setGlobalState('home_news', result.data.items);
        }
    }

    renderFirstItem (item: Object) {
        return (
            <div className="content-container" key={item.id}>
                <div className="col-xl-12" key={item.id}>
                    <div className="content-container">
                        <img src={item.image} className="img-thumbnail" width="100%" />
                        <h2>
                            <Link to={`/bai-viet/${item.id}/${item.uid}`}>{item.title}</Link>
                        </h2>
                        <div className="date-time"><em>Ngày đăng: {Tools.dateFormat(item.created_at)}</em></div>
                        <div className="row">
                            <div className="col-md-12 article-description">
                                <p>{Tools.getText(item.description)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderOtherItem (item: Object) {
        return (
            <LazyLoad height={200}  key={item.id}>
                <div className="content-container">
                    <div className="col-xl-12">
                        <div className="content-container">
                            <div className="row">
                                <div className="col-md-4">
                                    <img src={item.image} className="img-thumbnail" width="100%" />
                                </div>
                                <div className="col-md-8 article-description">
                                    <h2>
                                        <Link to={`/bai-viet/${item.id}/${item.uid}`}>{item.title}</Link>
                                    </h2>
                                    <div className="date-time"><em>Ngày đăng: {Tools.dateFormat(item.created_at)}</em></div>
                                    <p>{Tools.getText(item.description)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LazyLoad>
        );
    }

    render() {
        const listItem = this.state.homeNews;
        if (!listItem.length) return null;
        return (
            <div>
                <div className="content-container"><h1>Bài Viết Mới</h1></div>
                {listItem.map((item, index) => {
                    if (!index) return this.renderFirstItem(item);
                    return this.renderOtherItem(item);
                })}
            </div>
        );
    }
}
