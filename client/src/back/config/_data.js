/* @flow */

import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'config',
        endpoints: {
            crud: '',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export function seeding(numberOfItems: number, single:boolean = false): Array<FormValuesEdit> {
    let result = [];
    for (let i = 1; i <= numberOfItems; i++) {
        result.push({
            id: i,
            uid: 'key' + String(i),
            value: 'value ' + String(i),
            checked: false,
        });
    }
    if (!single) return result;
    return [result[numberOfItems - 1]];
}

export type FormValues = {
    id?: number,
    uid: string,
    value: string,
};

export const defaultFormValues: FormValues = {
    id: 0,
    uid: '',
    value: '',
};

export type FormValuesEdit = FormValues & {
    checked: boolean,
};
