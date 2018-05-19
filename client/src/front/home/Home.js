// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import 'react-big-calendar/lib/css/react-big-calendar.css';
// $FlowFixMe: do not complain about importing node_modules
import BigCalendar from 'react-big-calendar';
// $FlowFixMe: do not complain about importing node_modules
import moment from 'moment';
import Tools from 'src/utils/helpers/Tools';
import {apiUrls} from '../common/_data';
import Wrapper from '../common/Wrapper';
import Gallery from '../common/Gallery';
import Program from './Program';
import News from './News';

type Props = {
    children?: React.Node,
};
type State = {
    events: Array<Object>
};

export default class Home extends React.Component<Props, State> {
    selectDateHandle: Function;
    getCalendar: Function;
    static defaultProps = {};
    state: State = {
        events: []
    }
    constructor(props: Props) {
        super(props);
        this.selectDateHandle = this.selectDateHandle.bind(this);
    }

    componentDidMount() {
        document.title = 'Trang chủ';

        const events = Tools.getGlobalState('events');

        if (events) {
            return this.setState({
                events
            });
        }
        this.getCalendar();
    }

    async getCalendar(uid: string) {
        const result = await Tools.apiCall(apiUrls.ccalendar, 'GET', {}, false, false);
        if (result.success) {
            this.setState({
                events: result.data.items,
            });
            Tools.setGlobalState('events', result.data.items);
        }
    }

    selectDateHandle(event: Object) {
        if (!event.url) return;
        window.open(event.url, '_blank');
    }

    render() {
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
                        <div className="content-container"><h1>Lịch Thiên Văn</h1></div>
                        <div style={{height: 400, paddingTop: 15}}>
                            <BigCalendar
                                selectable
                                toolbar={false}
                                defaultView="month"
                                events={this.state.events}
                                onSelectEvent={this.selectDateHandle}
                            />
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }
}
