// @flow
import * as React from 'react';
import Banner from './Banner';
import MainMenu from './MainMenu';
import Footer from './Footer';

type Props = {
    children?: React.Node,
};
type State = {};

export default class Wrapper extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {};
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-1" />
                    <div className="col-xl-10 col-lg-12" style={styles.wrapperStyle}>
                        <Banner />
                        <MainMenu />
                        {this.props.children}
                        <Footer />
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    wrapperStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 10,
        margin: '30px 0',
    },
};
