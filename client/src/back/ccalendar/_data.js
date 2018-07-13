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

export function seeding(numberOfItems: number, single: boolean = false): any {
    let result = [];
    for (let i = 1; i <= numberOfItems; i++) {
        result.push({
            id: i,
            title: `title ${i}`,
            url: `url${i}`,
            start: new Date(2018, 11, 24, 10, 33, 30, 0),
            end: new Date(2018, 11, 26, 10, 33, 30, 0),
            checked: false
        });
    }
    if (!single) return result;
    return result[numberOfItems - 1];
}

export type FormValues = {
    id: number,
    title: string,
    url: string,
    start: ?Date,
    end: ?Date
};

export const defaultFormValues: FormValues = {
    id: 0,
    title: '',
    url: '',
    start: null,
    end: null
};

export type FormValuesWithCheck = FormValues & {
    checked: boolean
};
