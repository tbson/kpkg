/* @flow */

import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'staff',
        endpoints: {
            crud: ''
        }
    }
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export type FormValues = {
    id: ?number,
    title: string,
    fullname: string,
    email: string,
    description: string,
    image: ?Blob,
    order: ?number,
};

export const defaultFormValues: FormValues = {
    id: null,
    title: '',
    fullname: '',
    email: '',
    description: '',
    image: null,
    order: null,
};

export type FormValuesEdit = FormValues & {
    checked: boolean,
};
