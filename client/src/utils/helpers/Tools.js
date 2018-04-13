// @flow
import React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import Fingerprint2 from 'fingerprintjs2';
// $FlowFixMe: do not complain about importing node_modules
import kebabCase from 'lodash/kebabCase';
// $FlowFixMe: do not complain about importing node_modules
import {toast} from 'react-toastify';
// $FlowFixMe: do not complain about importing node_modules
import camelCase from 'lodash/camelCase';
// $FlowFixMe: do not complain about importing node_modules
import EventEmitter from 'fbemitter';

import {
    LOCAL_STORAGE_PREFIX,
    URL_PREFIX,
    API_PREFIX,
    PROTOCOL,
    DOMAIN,
    FIELD_TYPE,
    URL_PREFIX_STRIP,
    BASE_URL,
} from 'src/constants';
let fingerprint = null;

type rawApiUrlsType = [
    {
        controller: string,
        endpoints: {},
    },
];

export default class Tools {
    static emitter = new EventEmitter();

    static checkDevMode(): boolean {
        const domainArr = window.location.host.split('.');
        const suffix = domainArr[domainArr.length - 1];
        return ['dev'].indexOf(suffix) === -1 ? false : true;
    }

    static cap(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static formDataToObj(formData: FormData, checkboxes: Array<string> = []): Object {
        let data = {};
        for (let pair of formData.entries()) {
            if (typeof data[pair[0]] == 'undefined') {
                // console.log(pair[1] instanceof Blob);
                data[pair[0]] = pair[1] === 'null' ? null : pair[1];
            }
        }
        for (let checkbox of checkboxes) {
            if (!data[checkbox]) {
                data[checkbox] = false;
            } else {
                data[checkbox] = true;
            }
        }
        return data;
    }

    static navigateTo(history: Object, url: string = '/', params: Array<mixed> = []) {
        return history.push([url, ...params].join('/'));
    }

    static parseJson(input: any): string {
        try {
            return JSON.parse(input);
        } catch (error) {
            return String(input);
        }
    }

    static emptyObj(obj: Object): boolean {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    static setStorage(key: string, value: any): void {
        try {
            let newValue = value;
            if (key === 'authData') {
                newValue = {...this.getStorageObj(key), ...value};
            }
            newValue = JSON.stringify(newValue);
            localStorage.setItem(LOCAL_STORAGE_PREFIX + '_' + key, newValue);
        } catch (error) {
            console.error(error);
        }
    }

    static getStorageObj(key: string): Object {
        try {
            let value = this.parseJson(localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + key));
            if (value && typeof value === 'object') {
                return value;
            }
            return {};
        } catch (error) {
            return {};
        }
    }

    static getStorageStr(key: string): string {
        try {
            let value = this.parseJson(localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + key));
            if (!value || typeof value === 'object') {
                return '';
            }
            return String(value);
        } catch (error) {
            return '';
        }
    }

    static removeStorage(key: string): void {
        localStorage.removeItem(LOCAL_STORAGE_PREFIX + '_' + key);
    }

    static getToken(): string {
        const token = this.getStorageObj('authData').token;
        return token ? token : '';
    }

    static getApiBaseUrl(): String {
        return PROTOCOL + DOMAIN + API_PREFIX;
    }

    static getApiUrls(rawApiUrls: Array<Object>): Object {
        let result = {};
        const API_BASE_URL = this.getApiBaseUrl();
        Object.entries(rawApiUrls).forEach(([index, apiUrl]) => {
            // $FlowFixMe: Still have no idea why it happen
            Object.entries(apiUrl.endpoints).forEach(([key, url]) => {
                url = kebabCase(url);
                result[
                    // $FlowFixMe: Still have no idea why it happen
                    parseInt(index) === 0 ? key : camelCase(apiUrl.controller) + this.cap(key)
                    // $FlowFixMe: Still have no idea why it happen
                ] = API_BASE_URL + kebabCase(apiUrl.controller) + '/' + url + (url ? '/' : '');
            });
        });
        return result;
    }

    static async getFingerPrint(): Promise<string> {
        const result = await new Promise(function(resolve, reject) {
            new Fingerprint2().get(fingerprint => {
                resolve(fingerprint);
            });
        });
        return result;
    }

    static paramsProcessing(data: Object = {}): Object {
        try {
            if (Object.values(data).filter(item => item instanceof Blob).length) {
                let formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    // $FlowFixMe: Still have no idea why it happen
                    formData.set(key, value);
                });
                return {
                    data: formData,
                    contentType: null,
                };
            } else {
                return {
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                };
            }
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    static urlDataEncode(obj: Object): string {
        let str = [];
        for (let p in obj) {
            var value = obj[p];
            if (typeof value == 'undefined' || value === null) {
                value = '';
            }
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(value));
        }
        return str.join('&');
    }

    static urlDataDecode(str: string): Object {
        // str = abc=def&ghi=aaa&ubuntu=debian
        let result = {};
        let arr = str.split('&');
        if (!str) {
            return result;
        }
        arr.forEach((value, key) => {
            let arrValue = value.split('=');
            if (arrValue.length === 2) {
                result[arrValue[0]] = arrValue[1];
            }
        });
        return result;
    }

    static errorMessageProcessing(input: string | Object): string {
        if (typeof input === 'string') {
            // If message is STRING
            return String(input);
        } else if (Array.isArray(input)) {
            // If message is ARRAY
            return String(input.join('<br/>'));
        } else if (typeof input === 'object') {
            // If detail key exist with string style
            if (typeof input.detail === 'string') {
                return input.detail;
            }
            // If detail key exist with list style
            if (Array.isArray(input.detail)) {
                return String(input.detail.join('<br/>'));
            }
            return '';
        } else {
            return '';
        }
    }

    static logout(history: Object) {
        this.removeStorage('authData');
        this.navigateTo(history, 'login');
    }

    static popMessage(description: string | Object, type: string = 'success'): void {
        const toastConfig = {
            position: toast.POSITION.BOTTOM_RIGHT,
        };
        const messages = this.errorMessageProcessing(description);
        if (!messages) return;

        if (type === 'success') {
            toast.success(messages ? messages : 'Success!', toastConfig);
        } else {
            toast.error(messages ? messages : 'Error!', toastConfig);
        }
    }

    static toggleGlobalLoading(spinning: boolean = true): void {
        this.emitter.emit('TOGGLE_SPINNER', spinning);
    }

    static async apiCall(
        url: string,
        method: string,
        params: Object = {},
        popMessage: boolean = true,
        usingLoading: boolean = true,
    ): Promise<{status: number, success: boolean, data: Object}> {
        try {
            if (usingLoading) {
                this.toggleGlobalLoading();
            }
            let requestConfig: Object = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    fingerprint: await this.getFingerPrint(),
                },
                credentials: 'same-origin',
            };
            if (this.getToken()) {
                requestConfig.headers.Authorization = 'JWT ' + this.getToken()
            }
            if (['POST', 'PUT'].indexOf(method) !== -1) {
                // Have payload
                params = this.paramsProcessing(params);
                requestConfig.body = params.data;
                if (!params.contentType) {
                    delete requestConfig.headers['Content-Type'];
                }
            } else {
                // No payload but url encode
                if (url.indexOf('?') === -1) {
                    url += '?' + this.urlDataEncode(params);
                }
            }
            let response = await fetch(url, requestConfig);
            let data = {};
            try {
                if ([204, 502].indexOf(response.status) === -1) {
                    data = await response.json();
                }
            } catch (error) {
                console.error(error);
            }
            if (usingLoading) {
                this.toggleGlobalLoading(false);
            }
            if (Array.isArray(data)) {
                data = {
                    count: data.length,
                    items: data,
                    links: {
                        next: null,
                        previous: null,
                    },
                    page_size: data.length,
                    pages: 1,
                };
            }
            let result = {
                status: response.status,
                success: [200, 201, 204].indexOf(response.status) === -1 ? false : true,
                data,
            };
            if ([200, 201, 204].indexOf(result.status) === -1) {
                this.popMessage(result.data, 'error');
            }
            if (result.status === 401) {
                this.removeStorage('authData');
                window.location = BASE_URL + 'login';
            }
            return result;
        } catch (error) {
            console.error(error);
            if (usingLoading) {
                this.toggleGlobalLoading(false);
            }
            return {
                status: 400,
                success: false,
                data: error,
            };
        }
    }

    static getCheckedId(listItem: Array<Object>): string {
        const result = listItem.filter(item => !!item.checked).map(item => item.id);
        return result.join(',');
    }

    static matchPrefix(prefix: string, url: string): boolean {
        if (!prefix || !url) {
            return false;
        }
        if (url.indexOf(prefix) === 0) {
            return true;
        }
        return false;
    }

    static activeWhen(prefix: string): string {
        const url = window.location.href;
        console.log(url);
        if (!prefix || !url) {
            return '';
        }
        if (url.indexOf(prefix) === 0) {
            return 'active';
        }
        return '';
    }

    static uuid4(): string {
        let cryptoObj = window.crypto || window.msCrypto;
        // $FlowFixMe: allow bitwise operations
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ (cryptoObj.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
        );
    }
}
