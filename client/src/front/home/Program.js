// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {Link} from 'react-router-dom';
import Carousel from 'src/utils/components/Carousel';
import Wrapper from '../common/Wrapper';
import Tools from 'src/utils/helpers/Tools';
import {apiUrls} from '../common/_data';

type Props = {};
type State = {
    homeProgram: Object,
    dataLoaded: boolean,
};

export default class Program extends React.Component<Props, State> {
    getArticleFromCategoryUid: Function;
    renderBanner: Function;

    static defaultProps = {};
    state: State = {
        homeProgram: {},
        dataLoaded: false,
    };
    constructor(props: Props) {
        super(props);
        this.getArticleFromCategoryUid = this.getArticleFromCategoryUid.bind(this);
        this.renderBanner = this.renderBanner.bind(this);
    }

    componentDidMount() {
        const homeProgram = Tools.getGlobalState('home_program');

        if (homeProgram) {
            return this.setState({
                homeProgram,
                dataLoaded: true,
            });
        }
        this.getArticleFromCategoryUid('chuong-trinh-tham-quan');
    }

    async getArticleFromCategoryUid(uid: string) {
        const params = {
            category__uid: uid,
        };
        const result = await Tools.apiCall(apiUrls.articleSingle, 'GET', params, false, false);
        if (result.success) {
            this.setState({
                homeProgram: result.data.items[0],
                dataLoaded: true,
            });
            console.log(result.data.items);
            Tools.setGlobalState('home_program', result.data.items[0]);
        }
    }

    renderBanner(article: Object) {
        const {attaches} = article;
        if (article.use_slide && attaches.length) {
            return (
                <div>
                    <Carousel listItem={attaches} imageKey="attachment" /><br />
                </div>
            );
        } else {
            return (
                <div className="center">
                    <img
                        src={article.image}
                        width="100%"
                        className="img-thumbnail"
                        title={article.title}
                        alt={article.title}
                    />
                </div>
            );
        }
    }

    render() {
        const item = this.state.homeProgram;
        if (!item.image) return null;
        return (
            <div className="content-container">
                <div className="row">
                    <div className="col-lg-6">
                        {this.renderBanner(item)}
                    </div>
                    <div className="col-lg-6">
                        <h1>{item.title}</h1>
                        <div dangerouslySetInnerHTML={{__html: item.description}} />
                        <div className="center">
                            <Link to={`/bai-viet/${item.id}/${item.uid}`} className="btn btn-primary">
                                <em>Xem chi tiết</em>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
