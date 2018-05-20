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

export type MainFormData = {
    id: number,
    email: string,
    username: string,
    first_name: string,
    last_name: string,
    groups?: string,
};

export type MainFormDataEdit = MainFormData & {
    checked: boolean,
};
