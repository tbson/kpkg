/* @flow */

import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'attach',
        endpoints: {
            crud: '',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export type FormValues = {
    id: ?number,
    parent_uuid: string,
    title: string,
    attachment: ?Blob,
    filetype: ?string,
    richtext_image: boolean,
    order: ?number,
};

export const defaultFormValues: FormValues = {
    id: null,
    parent_uuid: '',
    title: '',
    attachment: null,
    filetype: null,
    richtext_image: false,
    order: null,
};

export type FormValuesEdit = FormValues & {
    checked: boolean,
};
