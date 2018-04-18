// @flow
import * as React from 'react';

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
                    <div className="col-lg-2" />
                    <div className="col-lg-8" style={styles.wrapperStyle}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    wrapperStyle: {
        backgroundColor: 'white',
        margin: '30px 0',
    },
};
