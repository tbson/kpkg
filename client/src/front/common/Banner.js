// @flow
import * as React from 'react';
import {apiUrls} from './_data';
import Tools from 'src/utils/helpers/Tools';

type Props = {};
type State = {
    banner: Object,
    dataLoaded: boolean
};

export default class Banner extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {
        banner: {},
        dataLoaded: false
    }
    constructor(props: Props) {
        super(props);
    }

    async componentDidMount() {
        const params = {
            category__uid: 'main-banner',
        };
        const result = await Tools.apiCall(apiUrls.crud, 'GET', params);
        console.log(result);
        if (result.success) {
            this.setState({
                banner: result.data.items[0],
                dataLoaded: true
            });
        }
    }

    render() {
        if (!this.state.dataLoaded) return null;
        return (
            <div>
                <img src={this.state.banner.image} width="100%"/>
            </div>
        );
    }
}

const styles = {};
