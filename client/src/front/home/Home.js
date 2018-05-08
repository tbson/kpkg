// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import 'react-big-calendar/lib/css/react-big-calendar.css';
// $FlowFixMe: do not complain about importing node_modules
import BigCalendar from 'react-big-calendar';
// $FlowFixMe: do not complain about importing node_modules
import moment from 'moment';
import Wrapper from '../common/Wrapper';
import Gallery from '../common/Gallery';
import Program from './Program';
import News from './News';

type Props = {
    children?: React.Node,
};
type State = {};

export default class Home extends React.Component<Props, State> {
    selectDateHandle: Function;
    static defaultProps = {};
    state: State = {};
    constructor(props: Props) {
        super(props);
        this.selectDateHandle = this.selectDateHandle.bind(this);
    }

    componentDidMount() {
        document.title = 'Trang chủ';
    }

    selectDateHandle(event: Object) {
        window.open(event.url, '_blank');
    }

    render() {
        const events = [
            {
                id: 0,
                title: 'All Day Event very long title',
                allDay: true,
                start: new Date(2018, 4, 1),
                end: new Date(2018, 4, 1),
                url: 'https://google.com',
            },
            {
                id: 1,
                title: 'Long Event',
                start: new Date(2018, 4, 3),
                end: new Date(2018, 4, 5),
                url: 'https://google.com.vn',
            },
        ];
        BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
        return (
            <Wrapper>
                <Program />
                <div className="row">
                    <div className="col-lg-7">
                        <News />
                        <Gallery />
                    </div>
                    <div className="col-lg-5">
                        <div style={{height: 400}}>
                            <BigCalendar
                                selectable
                                toolbar={true}
                                defaultView="month"
                                events={events}
                                onSelectEvent={this.selectDateHandle}
                            />
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }
}
