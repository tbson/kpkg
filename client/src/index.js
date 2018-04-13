import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom';
import {APP, History} from 'src/constants';
import Back from './back/App';
import Front from './front/App';

function switchAPP () {
    if (APP) return <Back/>;
    return <Front/>;
}

ReactDOM.render(
    <Router history={History}>
        <div>
            {switchAPP()}
        </div>
    </Router>,
    document.getElementById('app'),
);
