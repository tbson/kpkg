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

import 'src/utils/styles/main.css';
import Spinner from 'src/utils/components/Spinner';
import Tools from 'src/utils/helpers/Tools';
import NavWrapper from 'src/utils/components/NavWrapper';
import PrivateRoute from 'src/utils/components/PrivateRoute';
import Login from './auth/Login';
import Profile from './auth/Profile';
import Administrator from './administrator/Administrator';
import ResetPassword from './auth/ResetPassword';
import Config from './config/Config';
import Group from './group/Group';
import Permission from './permission/Permission';
import Category from './category/Category';
import Banner from './banner/Banner';
import Article from './article/Article';
import ArticleEdit from './article/ArticleEdit';


type Props = {};

class App extends React.Component<Props> {
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
                    <Route path="/category/:type?" component={Category} />
                    <Route path="/banners/:category_id" component={Banner} />
                    <Route path="/articles/:category_id" component={Article} />
                    <Route path="/article/:category_id/:id?" component={ArticleEdit} />
                </Switch>
            </div>
        );
    }
}

export default withRouter(App);
