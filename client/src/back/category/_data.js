/* @flow */

import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'category',
        endpoints: {
            crud: '',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export type CatType = {
    value: string,
    label: string,
};

export type FormValues = {
    id: number,
    title: string,
    type: string,
    image_ratio: ?number,
    width_ratio: ?number,
    single: boolean,
};

export const defaultFormValues: FormValues = {
    id: 0,
    title: '',
    type: '',
    image_ratio: 1.618,
    width_ratio: 100,
    single: false

};

export type FormValuesEdit = FormValues & {
    checked: boolean,
};
