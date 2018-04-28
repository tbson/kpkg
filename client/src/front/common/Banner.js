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
        const mainBanner = Tools.getGlobalState('mainBanner');
        if (mainBanner) {
            return this.setState({
                banner: mainBanner,
                dataLoaded: true
            });
        }

        const params = {
            category__uid: 'main-banner',
        };
        const result = await Tools.apiCall(apiUrls.banner, 'GET', params, false, false);
        if (result.success) {
            this.setState({
                banner: result.data.items[0],
                dataLoaded: true
            });
            Tools.setGlobalState('mainBanner', result.data.items[0]);
        }
    }

    render() {
        if (!this.state.dataLoaded) return null;
        const {banner} = this.state;
        return (
            <div style={{position: "relative"}} className="d-none d-lg-block">
                <img src={banner.image} width="100%" alt={banner.title} title={banner.title}/>
                <div style={styles.titleBackground}>{banner.title}</div>
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
