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
            <div style={{position: "relative"}}>
                <img src={this.state.banner.image} width="100%"/>
                <div style={styles.titleBackground}>{this.state.banner.title}</div>
            </div>
        );
    }
}

const styles = {
    titleBackground: {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        color: "white",
        fontSize: 55,
        fontWeight: "bold",
        fontFamily: "Times New Roman",
        textAlign: "center",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
};
