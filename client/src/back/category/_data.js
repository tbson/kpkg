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
    id?: number,
    title: string,
    type: string,
    image_ratio: ?number,
    width_ratio: ?number,
    single: boolean,
};

export type FormValuesEdit = FormValues & {
    checked: boolean,
};
