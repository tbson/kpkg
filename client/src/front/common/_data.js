import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'landing',
        endpoints: {
            banner: 'banner',
            article: 'article',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);
