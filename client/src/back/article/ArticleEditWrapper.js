// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter} from 'react-router-dom';
import {apiUrls} from './_data';
import type {ParamsType} from './_data';
import NavWrapper from 'src/utils/components/NavWrapper';
import ArticleEdit from './ArticleEdit';

type Props = {
    match: {
        params: ParamsType
    }
};

type States = {};

export default class ArticleEditWrapper extends React.Component<Props, States> {
    state = {};

    render() {
        const {parentType, parentId, id} = this.props.match.params;
        const parent = {type: parentType, id: parentId};
        if (!parent.id) {
            parent.id = 0;
        }
        return <ArticleEdit parent={parent} id={id} />;
    }
}
