// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {Link} from 'react-router-dom';
import Carousel from 'src/utils/components/Carousel';
import Wrapper from '../common/Wrapper';
import Tools from 'src/utils/helpers/Tools';
import {apiUrls} from '../common/_data';
import type {FormValues as ArticleType} from 'src/back/article/_data';
import {defaultFormValues as defaultProgram} from 'src/back/article/_data';

type Props = {};
type State = {
    homeProgram: ArticleType,
    dataLoaded: boolean,
};

export default class Program extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {
        homeProgram: defaultProgram,
        dataLoaded: false,
    };
    constructor(props: Props) {
        super(props);
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

    getArticleFromCategoryUid = async (uid: string) => {
        const params = {
            category__uid: uid,
        };
        const result = await Tools.apiCall(apiUrls.articleSingle, 'GET', params, false, false);
        if (result.success) {
            this.setState({
                homeProgram: result.data.items[0],
                dataLoaded: true,
            });
            Tools.setGlobalState('home_program', result.data.items[0]);
        }
    };

    renderBanner = (article: ArticleType) => {
        let {attaches} = article;
        if (!attaches) attaches = [];
        if (article.use_slide && attaches.length) {
            return (
                <div>
                    <Carousel listItem={attaches} imageKey="attachment" />
                    <br />
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
    };

    render() {
        if (!this.state.dataLoaded) return null;

        const item = this.state.homeProgram;
        if (!item.image || !item.id || !item.uid) return null;
        const detailUrl = ['bai-viet', item.id, item.uid].join('/');
        return (
            <div className="content-container">
                <div className="row">
                    <div className="col-lg-6">{this.renderBanner(item)}</div>
                    <div className="col-lg-6">
                        <h1>{item.title}</h1>
                        <div dangerouslySetInnerHTML={{__html: item.description}} />
                        <div className="center">
                            <Link to={detailUrl} className="btn btn-primary">
                                <em>Xem chi tiết</em>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
