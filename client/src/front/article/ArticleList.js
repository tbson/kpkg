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
import type {FormValues as ArticleType} from 'src/back/article/_data';
import Wrapper from '../common/Wrapper';
import Tools from 'src/utils/helpers/Tools';
import {FrontPagination} from 'src/utils/components/TableUtils';

type Props = {
    alwaysFirst: boolean,
    resourceUrl: string,
    resourceParams: Object,
    match: Object,
    location: Object,
};
type State = {
    listItem: Array<ArticleType>,
    dataLoaded: boolean,
    pathname: ?string,
};

class ArticleList extends React.Component<Props, State> {
    nextUrl: ?string;
    prevUrl: ?string;
    list: Function;

    static defaultProps = {
        alwaysFirst: false,
    };
    state: State = {
        pathname: null,
        listItem: [],
        dataLoaded: false,
    };
    constructor(props: Props) {
        super(props);
        this.list = this.list.bind(this);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.location.pathname !== prevState.pathname) {
            return {pathname: nextProps.location.pathname};
        }
        return null;
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const {pathname} = this.props.location;
        if (prevProps.location.pathname != pathname) {
            this.list();
        }
    }

    async componentDidMount() {
        this.list();
    }

    setTitle = (uid: string) => {
        switch (uid) {
            case 'tin-tuc':
                document.title = 'Tin tức';
                break;
            case 'kien-thuc':
                document.title = 'Kiến thức';
                break;
        }
    }

    async setInitData(initData, uid) {
        this.nextUrl = initData.links.next;
        this.prevUrl = initData.links.previous;

        const {pathname} = this.props.location;
        const listItemCached = Tools.getGlobalState(pathname);

        this.setTitle(uid);

        if (listItemCached) {
            return this.setState({
                listItem: listItemCached,
                dataLoaded: true,
            });
        }

        this.setState({
            listItem: initData.items,
            dataLoaded: true,
        });
        Tools.setGlobalState(pathname, initData.items);
    }

    async list(outerParams: Object = {}, url: ?string = null) {
        const {pathname} = this.props.location;
        const {uid} = this.props.match.params;
        let params = {
            category__uid: uid,
        };
        let result = {};

        if (!Tools.isEmpty(outerParams)) {
            params = {...params, ...outerParams};
        }

        result = await Tools.apiCall(url ? url : this.props.resourceUrl, 'GET', this.props.resourceParams);
        if (result.success) {
            Tools.setGlobalState(pathname, null);
            this.setInitData(result.data, uid);
            return result;
        }
        return result;
    }

    renderThumbnail = (item: ArticleType) => {
        if (!item.image) return null;
        return <img src={item.image} className="img-thumbnail" width="100%" title={item.title} alt={item.title} />;
    };

    renderFirstItem = (item: ArticleType) => {
        const detailUrl = ['/bai-viet', item.id, item.slug].join('/');
        return (
            <div className="content-container" key={item.id}>
                <div className="col-xl-12">
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
    }

    renderOtherItem = (item: ArticleType) => {
        if (this.props.alwaysFirst) return this.renderFirstItem(item);
        if (!item.image) return this.renderFirstItem(item);
        const detailUrl = ['/bai-viet', item.id, item.slug].join('/');
        return (
            <div className="content-container" key={item.id}>
                <div className="col-xl-12">
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
    }

    render() {
        const {listItem} = this.state;
        return (
            <div>
                {this.state.listItem.map((item, index) => {
                    if (!index) return this.renderFirstItem(item);
                    return this.renderOtherItem(item);
                })}
                <FrontPagination next={this.nextUrl} prev={this.prevUrl} onNavigate={url => this.list({}, url)} />
                <br />
            </div>
        );
    }
}

export default withRouter(ArticleList);
