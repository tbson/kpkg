// @flow
import * as React from 'react';
import Wrapper from '../common/Wrapper';
import Gallery from '../common/Gallery';
import Program from './Program';


type Props = {
    children?: React.Node,
};
type State = {};

export default class Home extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {};
    constructor(props: Props) {
        super(props);
    }

    componentDidMount () {
        document.title = 'Trang chủ';
    }

    render() {
        return (
            <Wrapper>
                <Program/>
                <Gallery/>
            </Wrapper>
        );
    }
}
