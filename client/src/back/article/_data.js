/* @flow */
import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';
import type {FormValues as AttachType} from 'src/back/attach/_data';

const rawApiUrls = [
    {
        controller: 'article',
        endpoints: {
            crud: '',
        },
    },
    {
        controller: 'category',
        endpoints: {
            crud: '',
        },
    },
    {
        controller: 'tag',
        endpoints: {
            crud: '',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export type FormValues = {
    id: number,
    category_title?: ?string,
    uuid: ?string,
    uid: ?string,
    title: string,
    description: string,
    content: string,
    image: ?Blob,
    use_slide: boolean,
    pin: boolean,
    thumbnail_in_content: boolean,
    order: ?number,
    tags?: ?string,
    created_at?: ??Date,
    attaches?: Array<AttachType>,
};

export const defaultFormValues: FormValues = {
    id: 0,
    uuid: '',
    uid: '',
    title: '',
    description: '',
    content: '',
    image: null,
    use_slide: false,
    pin: false,
    thumbnail_in_content: false,
    order: 0,
};

export type FormValuesWithCheck = FormValues & {
    checked: boolean,
};

export type UrlParms = {
    parent: string,
    parent_id: number,
    id: number,
};
