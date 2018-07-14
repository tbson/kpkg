/* @flow */

import Tools from 'src/utils/helpers/Tools';
import {FIELD_TYPE, APP} from 'src/constants';

const rawApiUrls = [
    {
        controller: 'staff',
        endpoints: {
            crud: ''
        }
    }
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

export function seeding(numberOfItems: number, single: boolean = false): any {
    let result = [];
    for (let i = 1; i <= numberOfItems; i++) {
        result.push({
            id: i,
            title: `title ${i}`,
            fullname: `fullname ${i}`,
            email: `email${i}@gmail.com`,
            description: `description ${i}`,
            image: null,
            order: i,
            checked: false
        });
    }
    if (!single) return result;
    return result[numberOfItems - 1];
}

export type FormValues = {
    id: number,
    title: string,
    fullname: string,
    email: string,
    description: string,
    image: ?Blob,
    order: ?number
};

export const defaultFormValues: FormValues = {
    id: 0,
    title: '',
    fullname: '',
    email: '',
    description: '',
    image: null,
    order: null
};

export type FormValuesWithCheck = FormValues & {
    checked: boolean
};
