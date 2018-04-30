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
import {Pagination} from 'src/utils/components/TableUtils';

type Props = {
    match: Object,
    location: Object,
};
type State = {
    listItem: Array<Object>,
    dataLoaded: boolean,
    pathname: ?string,
};

class ArticleList extends React.Component<Props, State> {
    setInitData: Function;
    renderFirstItem: Function;
    renderOtherItem: Function;
    list: Function;

    nextUrl: ?string;
    prevUrl: ?string;

    static defaultProps = {};
    state: State = {
        pathname: null,
        listItem: [],
        dataLoaded: false,
    };
    constructor(props: Props) {
        super(props);
        this.renderFirstItem = this.renderFirstItem.bind(this);
        this.renderOtherItem = this.renderOtherItem.bind(this);
        this.list = this.list.bind(this);
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
            this.list();
        }
    }

    async componentDidMount() {
        this.list();
    }

    setTitle(uid) {
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

        if (!Tools.emptyObj(outerParams)) {
            params = {...params, ...outerParams};
        }

        result = await Tools.apiCall(url ? url : apiUrls.article, 'GET', params);
        if (result.success) {
            Tools.setGlobalState(pathname, null);
            this.setInitData(result.data, uid);
            return result;
        }
        return result;
    }

    renderFirstItem(item: Object) {
        return (
            <div className="content-container" key={item.id}>
                <div className="col-xl-12" key={item.id}>
                    <div className="content-container">
                        <img
                            src={item.image}
                            className="img-thumbnail"
                            width="100%"
                            title={item.title}
                            alt={item.title}
                        />
                        <h2>
                            <Link to={`/bai-viet/${item.id}/${item.uid}`}>{item.title}</Link>
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
            </div>
        );
    }

    renderOtherItem(item: Object) {
        return (
            <div className="content-container" key={item.id}>
                <div className="col-xl-12" key={item.id}>
                    <div className="content-container">
                        <div className="row">
                            <div className="col-md-4">
                                <img
                                    src={item.image}
                                    className="img-thumbnail"
                                    width="100%"
                                    title={item.title}
                                    alt={item.title}
                                />
                            </div>
                            <div className="col-md-8 article-description">
                                <h2>
                                    <Link to={`/bai-viet/${item.id}/${item.uid}`}>{item.title}</Link>
                                </h2>
                                <div className="date-time">
                                    <em>Ngày đăng: {Tools.dateFormat(item.created_at)}</em>
                                </div>
                                <p>{Tools.getText(item.description)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {listItem} = this.state;
        return (
            <Wrapper>
                {this.state.listItem.map((item, index) => {
                    if (!index) return this.renderFirstItem(item);
                    return this.renderOtherItem(item);
                })}
                <div className="right">
                    {/*
                    <span className="oi oi-chevron-bottom"></span>
                    */}
                    <Pagination
                        next={this.nextUrl}
                        prev={this.prevUrl}
                        onNavigate={url => this.list({}, url)}
                    />
                </div>
            </Wrapper>
        );
    }
}

export default withRouter(ArticleList);
