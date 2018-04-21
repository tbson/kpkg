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
    listItem: Array<Object>,
    dataLoaded: boolean,
    pathname: ?string,
};

class ArticleList extends React.Component<Props, State> {
    setInitData: Function;
    renderFirstItem: Function;
    renderOtherItem: Function;

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

    async setInitData() {
        const {pathname} = this.props.location;
        const listItem = Tools.getGlobalState(pathname);
        if (listItem) {
            return this.setState({
                listItem,
                dataLoaded: true,
            });
        }

        const params = {
            category__uid: this.props.match.params.uid
        };
        const result = await Tools.apiCall(apiUrls.article, 'GET', params, false, false);
        if (result.success) {
            this.setState({
                listItem: result.data.items,
                dataLoaded: true,
            });
            Tools.setGlobalState(pathname, result.data.items);
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
                                <p>{item.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderOtherItem (item: Object) {
        return (
            <div className="content-container" key={item.id}>
                <div className="col-xl-12" key={item.id}>
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
                                <p>{item.description}</p>
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
            </Wrapper>
        );
    }
}

export default withRouter(ArticleList);
