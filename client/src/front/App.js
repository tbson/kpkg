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
import Spinner from 'src/utils/components/Spinner';

type Props = {};

class App extends React.Component<Props> {
    render() {
        return (
            <div>
                <Spinner />
                <ToastContainer autoClose={5000} />
                <h1>
                    Under construction
                </h1>
            </div>
        );
    }
}

export default withRouter(App);
