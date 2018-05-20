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

export type MainFormData = {
    id?: number,
    parent_uuid: string,
    title: string,
    image: ?Blob,
    richtext_image: boolean,
    order: ?number,
};

export type MainFormDataEdit = MainFormData & {
    checked: boolean,
};
