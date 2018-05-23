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
import type {FormValues as ArticleType} from 'src/back/article/_data';

type Props = {};
type State = {
    events: Array<EventType>,
    otherEvents: Array<ArticleType>,
    calendarLoaded: boolean,
    otherEventsLoaded: boolean,
};

export default class Calendar extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {
        events: [],
        otherEvents: [],
        calendarLoaded: false,
        otherEventsLoaded: false,
    };
    constructor(props: Props) {
        super(props);
        BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
    }

    componentDidMount() {
        const events = Tools.getGlobalState('events');
        const otherEvents = Tools.getGlobalState('events');

        if (events) {
            return this.setState({
                events,
                calendarLoaded: true,
            });
        } else {
            this.getCalendar();
        }

        if (otherEvents) {
            return this.setState({
                otherEvents,
                otherEventsLoaded: true,
            });
        } else {
            this.getOtherEvents();
        }
    }

    getCalendar = async () => {
        const result = await Tools.apiCall(apiUrls.ccalendar, 'GET', {}, false, false);
        if (result.success) {
            this.setState({
                events: result.data.items,
                calendarLoaded: true,
            });
            Tools.setGlobalState('events', result.data.items);
        }
    };

    getOtherEvents = async () => {
        const result = await Tools.apiCall(
            apiUrls.homeArticle + 'category__uid=su-kien-thien-van?limit=5', 'GET',
            {}, false, false
        );
        if (result.success) {
            this.setState({
                otherEvents: result.data.items,
                otherEventsLoaded: true,
            });
            Tools.setGlobalState('other_events', result.data.items);
        }
    }

    selectDateHandle = (event: Object) => {
        if (!event.url) return;
        window.open(event.url, '_blank');
    };

    renderCalendar = () => {
        if (!this.state.calendarLoaded) return null;
        return (
            <div>
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
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderCalendar()}
            </React.Fragment>
        );
    }
}
