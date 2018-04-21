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

import 'src/utils/styles/main-front.css';
import mainBg from 'src/assets/images/main-bg.jpg'

import Spinner from 'src/utils/components/Spinner';

import Home from './home/Home';
import ArticleDetail from './article_detail/ArticleDetail';

type Props = {};

class App extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
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
                    <Route exact path="/bai-viet/:uid" component={ArticleDetail} />
                    <Route exact path="/bai-viet/:id/:uid" component={ArticleDetail} />
                </Switch>
            </div>
        );
    }
}

const styles = {};

export default withRouter(App);
