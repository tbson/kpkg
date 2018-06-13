// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Switch, Route} from 'react-router-dom';
// $FlowFixMe: do not complain about importing node_modules
import 'bootstrap/dist/css/bootstrap.min.css';
// $FlowFixMe: do not complain about importing node_modules
import 'open-iconic/font/css/open-iconic-bootstrap.min.css';
// $FlowFixMe: do not complain about importing node_modules
import {ToastContainer} from 'react-toastify';

import {PUBLIC_URL} from 'src/constants';

import 'src/utils/styles/main-front.css';
// $FlowFixMe: webp import
// import mainBg from 'src/assets/images/main-bg.jpg';

import Spinner from 'src/utils/components/Spinner';

import Home from './home/Home';
import Contact from './contact/Contact';
import ArticleDetail from './article/ArticleDetail';
import ArticlesFromTag from './article/ArticlesFromTag';
import NewsSection from './article/NewsSection';
import KnowledgeSection from './article/KnowledgeSection';

type Props = {};

class App extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        const mainBg = PUBLIC_URL + 'clients/front/main-bg.jpg';
        const body = window.document.body;
        body.style.backgroundImage = `url('${mainBg}')`;
        body.style.backgroundAttachment = "fixed";
        body.style.backgroundSize = "cover";
    }
    render() {
        return (
            <div>
                <Spinner />
                <ToastContainer autoClose={5000} />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/lien-he" component={Contact} />
                    <Route exact path="/bai-viet/:uid" component={ArticleDetail} />
                    <Route exact path="/tag/:id/:uid" component={ArticlesFromTag} />
                    <Route exact path="/bai-viet/:id/:uid" component={ArticleDetail} />
                    <Route exact path="/tin-tuc" component={NewsSection} />
                    <Route exact path="/kien-thuc" component={KnowledgeSection} />
                </Switch>
            </div>
        );
    }
}

const styles = {};

export default withRouter(App);
