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

export type MainFormData = {
    id: ?number,
    title: string,
    description: string,
    content: string,
    image: string,
    use_slide: boolean,
    pin: boolean,
    order: ?number,
    tags?: ?string,
};

export type MainFormDataEdit = MainFormData & {
    checked: boolean,
};
