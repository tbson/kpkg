// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {Link} from 'react-router-dom';
import Wrapper from '../common/Wrapper';
import Tools from 'src/utils/helpers/Tools';
import {apiUrls} from '../common/_data';


type Props = {};
type State = {
    homeProgram: Object,
    dataLoaded: boolean
};

export default class Program extends React.Component<Props, State> {
    getArticleFromCategoryUid: Function;

    static defaultProps = {};
    state: State = {
        homeProgram: {},
        dataLoaded: false
    };
    constructor(props: Props) {
        super(props);
        this.getArticleFromCategoryUid = this.getArticleFromCategoryUid.bind(this);
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
            Tools.setGlobalState('home_program', result.data.items[0]);
        }
    }

    render() {
        const item = this.state.homeProgram;
        if (!item.image) return null;
        return (
            <div className="content-container">
                <div className="row">
                    <div className="col-lg-6">
                        <img src={item.image} width="100%" className="img-thumbnail"/>
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
