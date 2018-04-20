// @flow
import * as React from 'react';
import Wrapper from '../common/Wrapper';


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

    render() {
        return (
            <Wrapper>
                Home page
            </Wrapper>
        );
    }
}
