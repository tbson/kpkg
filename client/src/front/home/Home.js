// @flow
import * as React from 'react';
import Tools from 'src/utils/helpers/Tools';
import Wrapper from '../common/Wrapper';
import Gallery from '../common/Gallery';
import Program from './Program';
import News from './News';
import Calendar from './Calendar';

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

    componentDidMount() {
        document.title = 'Trang chủ';
    }

    render() {
        return (
            <Wrapper>
                <Program />
                <div className="row">
                    <div className="col-lg-8">
                        <News />
                        <Gallery />
                    </div>
                    <div className="col-lg-4">
                        <Calendar />
                    </div>
                </div>
            </Wrapper>
        );
    }
}
