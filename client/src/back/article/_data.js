/* @flow */
import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'article',
        endpoints: {
            crud: ''
        }
    },
    {
        controller: 'category',
        endpoints: {
            crud: ''
        }
    },
    {
        controller: 'tag',
        endpoints: {
            crud: ''
        }
    }
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export type FormValues = {
    id: ?number,
    category_title?: ?string,
    uuid: ?string,
    title: string,
    description: string,
    content: string,
    image: ?Blob,
    use_slide: boolean,
    pin: boolean,
    order: ?number,
    tags?: ?string,
};

export const defaultFormValues: FormValues = {
    id: null,
    uuid: '',
    title: '',
    description: '',
    content: '',
    image: null,
    use_slide: false,
    pin: false,
    order: 0,
};

export type FormValuesEdit = FormValues & {
    checked: boolean,
};
