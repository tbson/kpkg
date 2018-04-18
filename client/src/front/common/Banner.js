// @flow
import * as React from 'react';
import {apiUrls} from './_data';
import Tools from 'src/utils/helpers/Tools';

type Props = {
};
type State = {};

export default class Banner extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {};
    constructor(props: Props) {
        super(props);
    }

    async componentDidMount () {
        const params = {
        
        };
        const result = await Tools.apiCall(apiUrls.crud, 'GET', params);
    }

    render() {
        return (
            <div>
                Banner
            </div>
        );
    }
}

const styles = {
};
