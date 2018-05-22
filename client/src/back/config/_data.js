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

export type FormValues = {
    id?: ?number,
    uid: string,
    value: string,
};

export const defaultFormValues: FormValues = {
    id: null,
    uid: '',
    value: '',
};

export function ensureFormValues(input:Object): FormValues {
    let result = defaultFormValues;
    for (let key in defaultFormValues) {
        if (typeof input[key] != 'undefined') {
            result[key] = input[key];
        }
    }
    return result;
}

export type FormValuesEdit = FormValues & {
    checked: boolean,
};
