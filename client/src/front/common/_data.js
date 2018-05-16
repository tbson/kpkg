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
            homeArticle: 'home-article',
            articleNews: 'article-news',
            staff: 'staff',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);
