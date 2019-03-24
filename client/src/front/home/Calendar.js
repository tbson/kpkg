// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {withRouter, Link} from 'react-router-dom';
// $FlowFixMe: do not complain about importing node_modules
import 'react-big-calendar/lib/css/react-big-calendar.css';
// $FlowFixMe: do not complain about importing node_modules
import BigCalendar from 'react-big-calendar';
// $FlowFixMe: do not complain about importing node_modules
import LazyLoad from 'react-lazyload';
// $FlowFixMe: do not complain about importing node_modules
import moment from 'moment';
import Carousel from 'src/utils/components/Carousel';
import Tools from 'src/utils/helpers/Tools';
import {apiUrls} from '../common/_data';
import type {FormValues as EventType} from 'src/back/ccalendar/_data';
import type {FormValues as ArticleType} from 'src/back/article/_data';

type Props = {
    location: Object
};
type State = {
    events: Array<EventType>,
    otherEvents: Array<ArticleType>,
    calendarLoaded: boolean,
    otherEventsLoaded: boolean,
    pathname: ?string
};

const localizer = BigCalendar.momentLocalizer(moment);

class Calendar extends React.Component<Props, State> {
    static defaultProps = {};
    state: State = {
        events: [],
        otherEvents: [],
        calendarLoaded: false,
        otherEventsLoaded: false,
        pathname: null
    };
    constructor(props: Props) {
        super(props);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.location.pathname !== prevState.pathname) {
            return {pathname: nextProps.location.pathname};
        }
        return null;
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const {pathname} = this.props.location;
        if (prevProps.location.pathname != pathname) {
            this.initData();
        }
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        const events = Tools.getGlobalState('events');
        const otherEvents = Tools.getGlobalState('other_events');
        if (events) {
            this.setState({
                events,
                calendarLoaded: true
            });
        } else {
            this.getCalendar();
        }

        if (otherEvents) {
            this.setState({
                otherEvents,
                otherEventsLoaded: true
            });
        } else {
            this.getOtherEvents();
        }
    };

    getCalendar = async () => {
        const result = await Tools.apiCall(apiUrls.ccalendar, 'GET', {}, false, false);
        if (result.success) {
            this.setState({
                events: result.data.items,
                calendarLoaded: true
            });
            Tools.setGlobalState('events', result.data.items);
        }
    };

    getOtherEvents = async () => {
        const result = await Tools.apiCall(
            apiUrls.homeArticle + '?category__uid=su-kien-thien-van&limit=5',
            'GET',
            {},
            false,
            false
        );
        if (result.success) {
            this.setState({
                otherEvents: result.data.items,
                otherEventsLoaded: true
            });
            Tools.setGlobalState('other_events', result.data.items);
        }
    };

    selectDateHandle = (event: Object) => {
        if (!event.url) return;
        window.open(event.url, '_blank');
    };

    renderCalendar = () => {
        if (!this.state.calendarLoaded) return null;
        return (
            <div>
                <div className="content-container">
                    <h1>Sự Kiện Thiên Văn</h1>
                </div>
                <div className="content-container">
                    <div style={{height: 400, paddingTop: 15}}>
                        <BigCalendar
                            selectable
                            localizer={localizer}
                            views={['month']}
                            toolbar={true}
                            defaultView="month"
                            events={this.state.events}
                            onSelectEvent={this.selectDateHandle}
                        />
                    </div>
                </div>
            </div>
        );
    };

    renderOtherEvents = () => {
        if (!this.state.otherEventsLoaded) return null;
        const listItem = this.state.otherEvents;
        return listItem.map((item, index) => {
            if (!item.id || !item.slug) return null;
            return (
                <div className="content-container" key={index}>
                    <div className="col-xl-12">
                        <h2>
                            <Link to={`/bai-viet/${item.id}/${item.slug}`}>{item.title}</Link>
                        </h2>
                        <div className="date-time">
                            <em>Ngày đăng: {Tools.dateFormat(item.created_at)}</em>
                        </div>
                        <div className="article-description">
                            <p>{Tools.getText(item.description)}</p>
                        </div>
                    </div>
                </div>
            );
        });
    };

    render() {
        return (
            <React.Fragment>
                <div className="content-container">
                    <h1>Sự kiện thiên văn</h1>
                </div>
                <div>{this.renderOtherEvents()}</div>
            </React.Fragment>
        );
    }
}

export default withRouter(Calendar);
