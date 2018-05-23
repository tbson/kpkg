// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {Link} from 'react-router-dom';
// $FlowFixMe: do not complain about importing node_modules
import 'react-big-calendar/lib/css/react-big-calendar.css';
// $FlowFixMe: do not complain about importing node_modules
import BigCalendar from 'react-big-calendar';
// $FlowFixMe: do not complain about importing node_modules
import moment from 'moment';
import Carousel from 'src/utils/components/Carousel';
import Tools from 'src/utils/helpers/Tools';
import {apiUrls} from '../common/_data';
import type {FormValues as EventType} from 'src/back/ccalendar/_data';

type Props = {};
type State = {
    events: Array<EventType>,
    dataLoaded: boolean,
};

export default class Calendar extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {
        events: [],
        dataLoaded: false,
    };
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        const events = Tools.getGlobalState('events');

        if (events) {
            return this.setState({
                events,
                dataLoaded: true,
            });
        }
        this.getCalendar();
    }

    getCalendar = async () => {
        const result = await Tools.apiCall(apiUrls.ccalendar, 'GET', {}, false, false);
        if (result.success) {
            this.setState({
                events: result.data.items,
                dataLoaded: true,
            });
            Tools.setGlobalState('events', result.data.items);
        }
    };

    selectDateHandle = (event: Object) => {
        if (!event.url) return;
        window.open(event.url, '_blank');
    };

    render() {
        if (!this.state.dataLoaded) return null;
        BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
        return (
            <React.Fragment>
                <div className="content-container">
                    <h1>Lịch Thiên Văn</h1>
                </div>
                <div className="content-container">
                    <div style={{height: 400, paddingTop: 15}}>
                        <BigCalendar
                            selectable
                            views={['month']}
                            toolbar={false}
                            defaultView="month"
                            events={this.state.events}
                            onSelectEvent={this.selectDateHandle}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
