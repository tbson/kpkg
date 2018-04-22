// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Route, Link} from 'react-router-dom';
// $FlowFixMe: do not complain about importing node_modules
import {NavLink} from 'react-router-dom';
import Tools from 'src/utils/helpers/Tools';
import './NavWrapper.css';

type Props = Object;

type State = Object;

class App extends React.Component<Props, State> {
    toggleAll: Function;
    mediaQueryChanged: Function;

    constructor(props) {
        super(props);
        this.state = {
            toggled: true,
        };
        this.toggleAll = this.toggleAll.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    }

    componentDidMount() {
        const mql = window.matchMedia(`(min-width: 800px)`);
        mql.addListener(this.mediaQueryChanged);
        this.setState({mql: mql});

        this.setState({
            toggled: window.innerWidth >= 800 ? true : false,
        });
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
    }

    mediaQueryChanged() {
        console.log('media change');
        this.setState({
            toggled: !this.state.toggled,
        });
    }

    toggleAll(e) {
        this.setState({
            toggled: !this.state.toggled,
        });
    }

    render() {
        return (
            <div id="wrapper" className={this.state.toggled ? 'toggled' : ''}>
                <div id="sidebar-wrapper">
                    <ul className="sidebar-nav">
                        <li className="sidebar-brand">KPKG</li>

                        <li>
                            <NavLink exact to="/">
                                <span className="oi oi-person" />&nbsp;&nbsp;
                                <span>Profile</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink exact to="/administrator">
                                <span className="oi oi-person" />&nbsp;&nbsp;
                                <span>Administrator</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink exact to="/config">
                                <span className="oi oi-cog" />&nbsp;&nbsp;
                                <span>Config</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink exact to="/group">
                                <span className="oi oi-people" />&nbsp;&nbsp;
                                <span>Group</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink exact to="/permission">
                                <span className="oi oi-lock-unlocked" />&nbsp;&nbsp;
                                <span>Permission</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink exact to="/category/">
                                <span className="oi oi-layers" />&nbsp;&nbsp;
                                <span>Category</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                exact
                                to="/category/banner"
                                className={
                                    Tools.matchPrefix('/banner', this.props.location.pathname) ? ' active' : ''
                                }>
                                <span className="oi oi-image" />&nbsp;&nbsp;
                                <span>Banner</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                exact
                                to="/category/gallery"
                                className={
                                    Tools.matchPrefix('/gallery', this.props.location.pathname) ? ' active' : ''
                                }>
                                <span className="oi oi-aperture"></span>&nbsp;&nbsp;
                                <span>Gallery</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                exact
                                to="/category/article"
                                className={
                                    Tools.matchPrefix('/article', this.props.location.pathname) ? ' active' : ''
                                }>
                                <span className="oi oi-document" />&nbsp;&nbsp;
                                <span>Article</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div id="page-content-wrapper">
                    <div id="main-heading">
                        <span id="nav-toggler" onClick={() => this.toggleAll()}>
                            &#9776;
                        </span>
                        <span>Tran Bac Son</span>
                        &nbsp;&nbsp;
                        <span
                            className="oi oi-account-logout pointer"
                            onClick={() => Tools.logout(this.props.history)}
                        />
                    </div>

                    <div className="container-fluid">{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export default withRouter(App);
