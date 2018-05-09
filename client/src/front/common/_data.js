import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'landing',
        endpoints: {
            banner: 'banner',
            ccalendar: 'ccalendar',
            article: 'article',
            articleSingle: 'article-single',
            articleNews: 'article-news',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);
