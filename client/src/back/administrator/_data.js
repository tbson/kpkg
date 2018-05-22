/* @flow */
import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'admin',
        endpoints: {
            crud: '',
        },
    },
    {
        controller: 'group',
        endpoints: {
            crud: '',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export type FormValues = {
    id: ?number,
    email: string,
    username: string,
    first_name: string,
    last_name: string,
    fullname?: string,
    password?: string,
    groups: ?number,
};

export const defaultFormValues: FormValues = {
    id: null,
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    groups: null,
};

export type FormValuesEdit = FormValues & {
    checked: boolean,
};
