/* @flow */

import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'banner',
        endpoints: {
            crud: '',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export type FormValues = {
    id: number,
    uuid: string,
    category: ?number,
    category_title: ?string,
    title: string,
    description: string,
    image: ?Blob,
    order: ?number,
};

export const defaultFormValues: FormValues = {
    id: 0,
    uuid: '',
    category: null,
    category_title: '',
    title: '',
    description: '',
    image: null,
    order: null

};

export type FormValuesEdit = FormValues & {
    checked: boolean,
};
