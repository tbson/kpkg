import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'config',
        endpoints: {
            crud: '',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export type FormData = {
    id?: number,
    uid: string,
    value: string,
};

export type FormDataEdit = FormData & {
    checked: boolean,
};
