/* @flow */

import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'group',
        endpoints: {
            crud: '',
        },
    },
    {
        controller: 'permission',
        endpoints: {
            crud: '',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export type FormValues = {
    id: number,
    name: string,
};

export const defaultFormValues: FormValues = {
    id: 0,
    name: '',
};

export type FormValuesEdit = FormValues & {
    checked: boolean,
};
