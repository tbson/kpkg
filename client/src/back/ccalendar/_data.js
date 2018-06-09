/* @flow */

import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'ccalendar',
        endpoints: {
            crud: ''
        }
    }
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export type FormValues = {
    id: number,
    title: string,
    url: string,
    start: ?Date,
    end: ?Date,
};

export const defaultFormValues: FormValues = {
    id: 0,
    title: '',
    url: '',
    start: null,
    end: null,
};

export type FormValuesWithCheck = FormValues & {
    checked: boolean,
};
