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

import 'src/utils/styles/main-back.css';
import Spinner from 'src/utils/components/Spinner';
import Tools from 'src/utils/helpers/Tools';
import PrivateRoute from 'src/utils/components/PrivateRoute';
import Login from './auth/Login';
import Profile from './auth/Profile';
import Administrator from './administrator/Administrator';
import ResetPassword from './auth/ResetPassword';
import Config from './config/Config';
import Group from './group/Group';
import Permission from './permission/Permission';
import CCalendar from './ccalendar/CCalendar';
import Tag from './tag/Tag';
import Staff from './staff/Staff';
import Category from './category/Category';
import Banner from './banner/Banner';
import Article from './article/Article';
import ArticleEdit from './article/ArticleEdit';
import ArticleEditRelated from './article/ArticleEditRelated';

type Props = {};

class App extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        const body = window.document.body;
        body.style.backgroundImage = 'none';
    }

    render() {
        return (
            <div>
                <Spinner />
                <ToastContainer autoClose={5000} />
                <Switch>
                    <Route exact path="/" component={Profile} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset-password/:token" component={ResetPassword} />
                    <Route path="/administrator" component={Administrator} />
                    <Route path="/config" component={Config} />
                    <Route path="/group" component={Group} />
                    <Route path="/permission" component={Permission} />
                    <Route path="/ccalendar" component={CCalendar} />
                    <Route path="/tag" component={Tag} />
                    <Route path="/staff" component={Staff} />
                    <Route path="/category/:type?" component={Category} />
                    <Route path="/banners/:category_id" component={Banner} />
                    <Route path="/gallerys/:category_id" component={Banner} />
                    <Route path="/articles/:parent_id" component={Article} />
                    <Route path="/article/category/:parent_id/:id?" component={ArticleEdit} />
                    <Route path="/article/article/:parent_id/:id?" component={ArticleEditRelated} />
                </Switch>
            </div>
        );
    }
}

export default withRouter(App);
