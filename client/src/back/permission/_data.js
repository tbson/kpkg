/* @flow */

import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'permission',
        endpoints: {
            crud: '',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export type FormValues = {
    id: ?number,
    name: string,
    content_type: string,
    codename: string,
};

export const defaultFormValues: FormValues = {
    id: null,
    name: '',
    content_type: '',
    codename: '',
};

export type FormValuesEdit = FormValues & {
    checked: boolean,
};

export type RowValues = FormValuesEdit & {
    content_type: string,
    codename: string,
};
