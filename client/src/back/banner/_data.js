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
    id?: number,
    uuid: string,
    category: number,
    title: string,
    description: ?string,
    image: ?Blob,
    order: number,
};

export type FormValuesEdit = FormValues & {
    checked: boolean,
};
