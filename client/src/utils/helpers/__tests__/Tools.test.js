import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Tools from '../Tools';
import 'src/__mocks__/localStorage';
import {LOCAL_STORAGE_PREFIX, API_URL} from 'src/constants';

Enzyme.configure({adapter: new Adapter()});

beforeEach(() => {
    jest.restoreAllMocks();
});

test('cap', () => {
    let input = 'test';
    let eput = 'Test';
    let output = Tools.cap(input);
    expect(output).toBe(eput);

    input = 't';
    eput = 'T';
    output = Tools.cap(input);
    expect(output).toBe(eput);
});

test('formDataToObj', () => {
    let input = new FormData();
    input.set('key1', 'value1');
    input.set('key2', 'value2');
    input.set('key3', 123);

    let eput = {
        key1: 'value1',
        key2: 'value2',
        key3: '123',
    };
    let output = Tools.formDataToObj(input);
    expect(output).toEqual(eput);

    input = new FormData();
    input.set('key1', 'value1');
    input.set('key2', 'value2');
    input.set('key3', null);

    eput = {
        key1: 'value1',
        key2: 'value2',
        key3: null,
    };
    output = Tools.formDataToObj(input);
    expect(output).toEqual(eput);
});

test('isEmpty', () => {
    let input = {};
    let eput = true;
    let output = Tools.isEmpty(input);
    expect(output).toBe(eput);

    input = {key: 'value'};
    eput = false;
    output = Tools.isEmpty(input);
    expect(output).toBe(eput);

    input = {key: null};
    eput = false;
    output = Tools.isEmpty(input);
    expect(output).toBe(eput);
});

test('setStorage', () => {
    let input = 'abc';
    Tools.setStorage('key', input);
    let output = localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + 'key');
    output = Tools.parseJson(output);
    expect(output).toBe(input);

    input = null;
    Tools.setStorage('key', input);
    output = localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + 'key');
    output = Tools.parseJson(output);
    expect(output).toBe(input);

    input = 123;
    Tools.setStorage('key', input);
    output = localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + 'key');
    output = Tools.parseJson(output);
    expect(output).toBe(input);

    input = {key: 'value'};
    Tools.setStorage('key', input);
    output = localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + 'key');
    output = Tools.parseJson(output);
    expect(output).toEqual(input);

    input = {key: null};
    Tools.setStorage('key', input);
    output = localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + 'key');
    output = Tools.parseJson(output);
    expect(output).toEqual(input);
});

test('getStorageObj', () => {
    let input = {key: 'value'};
    Tools.setStorage('key', input);
    let output = Tools.getStorageObj('key');
    expect(output).toEqual(input);

    input = 'abc';
    Tools.setStorage('key', input);
    output = Tools.getStorageObj('key');
    expect(output).toEqual({});

    input = 123;
    Tools.setStorage('key', input);
    output = Tools.getStorageObj('key');
    expect(output).toEqual({});

    input = null;
    Tools.setStorage('key', input);
    output = Tools.getStorageObj('key');
    expect(output).toEqual({});
});

test('getStorageStr', () => {
    let input = {key: 'value'};
    Tools.setStorage('key', input);
    let output = Tools.getStorageStr('key');
    expect(output).toEqual('');

    input = 'abc';
    Tools.setStorage('key', input);
    output = Tools.getStorageStr('key');
    expect(output).toEqual(input);

    input = 123;
    Tools.setStorage('key', input);
    output = Tools.getStorageStr('key');
    expect(output).toEqual('123');

    input = null;
    Tools.setStorage('key', input);
    output = Tools.getStorageStr('key');
    expect(output).toEqual('');
});

test('removeStorage', () => {
    Tools.setStorage('key', 'value');
    Tools.setStorage('key1', 'value1');
    Tools.removeStorage('key');
    let output = Tools.getStorageStr('key');
    let output1 = Tools.getStorageStr('key1');
    expect(output).toEqual('');
    expect(output1).toEqual('value1');
});

test('getToken', () => {
    Tools.setStorage('authData', {token: 'token'});
    let output = Tools.getToken();
    expect(output).toEqual('token');

    Tools.removeStorage('authData');
    output = Tools.getToken();
    expect(output).toEqual('');
});

test('getApiUrls', () => {
    let input = [
        {
            controller: 'controller1',
            endpoints: {
                enpointFirst: 'kebabCase1',
                enpointSecond: 'kebabCase2',
            },
        },
        {
            controller: 'controller2',
            endpoints: {
                enpointFirst: 'kebabCase1',
                enpointSecond: 'kebabCase2',
            },
        },
    ];
    let output = Tools.getApiUrls(input);
    let eput = {
        enpointFirst: API_URL + 'controller-1/kebab-case-1/',
        enpointSecond: API_URL + 'controller-1/kebab-case-2/',
        controller2EnpointFirst: API_URL + 'controller-2/kebab-case-1/',
        controller2EnpointSecond: API_URL + 'controller-2/kebab-case-2/',
    };
    expect(output).toEqual(eput);
});

test('payloadFromObject', () => {
    let input = {
        key1: 'value1',
        key2: 'value2',
    };
    let output = Tools.payloadFromObject(input);
    let eput = JSON.stringify(input);
    expect(output).toEqual({
        data: eput,
        contentType: 'application/json',
    });

    input = {
        key1: 'value1',
        key2: 'value2',
    };
    output = Tools.payloadFromObject({...input, key0: new Blob()}); // Create formFata
    output.data = Tools.formDataToObj(output.data);
    delete output.data.key0;
    eput = input;
    expect(output).toEqual({
        data: eput,
        contentType: null,
    });
});

test('urlDataEncode', () => {
    let input = {
        key1: 'value1',
        key2: 'value2',
        key3: null,
        key4: '',
        key5: 0,
        key6: 5,
    };
    let output = Tools.urlDataEncode(input);
    let eput = 'key1=value1&key2=value2&key3=&key4=&key5=0&key6=5';
    expect(output).toEqual(eput);
});

test('urlDataDecode', () => {
    let input = 'key1=value1&key2=value2&key3=&key4=&key5=0&key6=5';
    let output = Tools.urlDataDecode(input);
    let eput = {
        key1: 'value1',
        key2: 'value2',
        key3: '',
        key4: '',
        key5: '0',
        key6: '5',
    };
    expect(output).toEqual(eput);
});

test('getCheckedId', () => {
    let input = [{id: 1}, {id: 2}, {id: 3}];
    let output = Tools.getCheckedId(input);
    let eput = '';
    expect(output).toEqual(eput);

    input = [{id: 1}, {id: 2, checked: true}, {id: 3}];
    output = Tools.getCheckedId(input);
    eput = '2';
    expect(output).toEqual(eput);

    input = [{id: 1, checked: true}, {id: 2}, {id: 3, checked: true}];
    output = Tools.getCheckedId(input);
    eput = '1,3';
    expect(output).toEqual(eput);

    input = [{id: 1, checked: true}, {id: 2, checked: true}, {id: 3, checked: true}];
    output = Tools.getCheckedId(input);
    eput = '1,2,3';
    expect(output).toEqual(eput);
});

test('errorMessageProcessing', () => {
    let input = '';
    let output = Tools.errorMessageProcessing(input);
    let eput = '';
    expect(output).toEqual(eput);

    input = 'hello';
    output = Tools.errorMessageProcessing(input);
    eput = 'hello';
    expect(output).toEqual(eput);

    input = ['hello', 'world'];
    output = Tools.errorMessageProcessing(input);
    eput = 'hello<br/>world';
    expect(output).toEqual(eput);

    input = {detail: 'hello'};
    output = Tools.errorMessageProcessing(input);
    eput = 'hello';
    expect(output).toEqual(eput);

    input = {detail: ['hello', 'world']};
    output = Tools.errorMessageProcessing(input);
    eput = 'hello<br/>world';
    expect(output).toEqual(eput);

    input = {detail: 2};
    output = Tools.errorMessageProcessing(input);
    eput = '';
    expect(output).toEqual(eput);

    input = {detail: {}};
    output = Tools.errorMessageProcessing(input);
    eput = '';
    expect(output).toEqual(eput);

    input = {detail: []};
    output = Tools.errorMessageProcessing(input);
    eput = '';
    expect(output).toEqual(eput);

    input = 2;
    output = Tools.errorMessageProcessing(input);
    eput = '';
    expect(output).toEqual(eput);

    input = {};
    output = Tools.errorMessageProcessing(input);
    eput = '';
    expect(output).toEqual(eput);

    input = [];
    output = Tools.errorMessageProcessing(input);
    eput = '';
    expect(output).toEqual(eput);
});

test('getCheckedId', () => {
    let input = [
        {id: 1, checked: false},
        {id: 2, checked: true},
        {id: 3, checked: false},
        {id: 4, checked: true},
        {id: 5, checked: true},
    ];
    let output = Tools.getCheckedId(input);
    let eput = '2,4,5';
    expect(output).toEqual(eput);

    input = [];
    output = Tools.getCheckedId(input);
    eput = '';
    expect(output).toEqual(eput);

    input = [
        {id: 1, checked: false},
        {id: 2, checked: false},
        {id: 3, checked: false},
        {id: 4, checked: false},
        {id: 5, checked: false},
    ];
    output = Tools.getCheckedId(input);
    eput = '';
    expect(output).toEqual(eput);
});

test('matchPrefix', () => {
    let prefix = 'hello';
    let url = 'hellotthere';
    let output = Tools.matchPrefix(prefix, url);
    let eput = true;
    expect(output).toEqual(eput);

    output = Tools.matchPrefix();
    eput = false;
    expect(output).toEqual(eput);

    output = Tools.matchPrefix('', 'hello');
    eput = false;
    expect(output).toEqual(eput);

    output = Tools.matchPrefix('', '');
    eput = false;
    expect(output).toEqual(eput);

    output = Tools.matchPrefix('hello', 'ahello');
    eput = false;
    expect(output).toEqual(eput);
});

test('dateFormat', () => {
    let input = new Date('2008-9-13');

    let output = Tools.dateFormat(input);
    let eput = '13/09/2008';
    expect(output).toEqual(eput);

    output = Tools.dateFormat(input, 'dd/mm/yyyy');
    eput = '13/09/2008';
    expect(output).toEqual(eput);

    output = Tools.dateFormat(input, 'mm/dd/yyyy');
    eput = '09/13/2008';
    expect(output).toEqual(eput);

    output = Tools.dateFormat(input, 'yyyy/mm/dd');
    eput = '2008/09/13';
    expect(output).toEqual(eput);

    output = Tools.dateFormat(input, 'yy/mm/dd');
    eput = '08/09/13';
    expect(output).toEqual(eput);
});

test('getText', () => {
    let input = '<div>hello</div>';
    let output = Tools.getText(input);
    let eput = 'hello';
    expect(output).toEqual(eput);

    input = '<div>hello<span>world</span></div>';
    output = Tools.getText(input);
    eput = 'helloworld';
    expect(output).toEqual(eput);

    input = '<div>hello<br/><span>world</span></div>';
    output = Tools.getText(input);
    eput = 'helloworld';
    expect(output).toEqual(eput);
});

test('addAlt', () => {
    let alt = 'hello';

    let input = '<img src=""/>';
    let output = Tools.addAlt(input, alt);
    let eput = '<img alt="hello" title="hello" src=""/>';
    expect(output).toEqual(eput);

    input = `<div><p><img src=""/></p><p><img src=""/></p></div>`;
    output = Tools.addAlt(input, alt);
    eput = `<div><p><img alt="hello" title="hello" src=""/></p><p><img alt="hello" title="hello" src=""/></p></div>`;
    expect(output).toEqual(eput);
});

describe('commonErrorResponse', () => {
    test('Fail', () => {
        const input = {
            test: 'hello',
        };
        const output = Tools.commonErrorResponse(input);
        const eput = {
            success: false,
            data: {
                detail: 'Undefined error',
            },
        };
        expect(output).toEqual(eput);
    });

    test('Success', () => {
        const input = {
            message: 'hello',
        };
        const output = Tools.commonErrorResponse(input);
        const eput = {
            success: false,
            data: {
                detail: 'hello',
            },
        };
        expect(output).toEqual(eput);
    });
});

describe('parseDataError', () => {
    test('Fail', () => {
        const input = {
            success: false,
            data: {
                content: 'hello',
            },
        };
        const output = Tools.parseDataError(input);
        const eput = {
            data: {},
            error: input.data,
        };
        expect(output).toEqual(eput);
    });

    test('Success', () => {
        const input = {
            success: true,
            data: {
                content: 'hello',
            },
        };
        const output = Tools.parseDataError(input);
        const eput = {
            data: input.data,
            error: {},
        };
        expect(output).toEqual(eput);
    });
});

describe('getItem', () => {
    test('Fail', async () => {
        const response = {
            status: 400,
            success: false,
            data: {
                detail: 'error',
            },
        };
        const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);
        const output = await Tools.getItem('someUrl', 1);
        const eput = null;
        expect(output).toEqual(eput);
    });

    test('Success', async () => {
        const response = {
            status: 200,
            success: true,
            data: {
                detail: 'success',
            },
        };
        const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);
        const output = await Tools.getItem('someUrl', 1);
        const eput = response.data;
        expect(output).toEqual(eput);
    });
});

describe('getList', () => {
    test('Fail', async () => {
        const response = {
            status: 400,
            success: false,
            data: {
                detail: 'error',
            },
        };
        const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);
        const output = await Tools.getList('someUrl', 1);
        const eput = null;
        expect(output).toEqual(eput);
    });

    test('Success', async () => {
        const response = {
            status: 200,
            success: true,
            data: {
                items: [],
                links: {},
                meta: {},
            },
        };
        const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);
        const output = await Tools.getList('someUrl', 1);
        const eput = {links: response.data.links, items: response.data.items};
        expect(output).toEqual(eput);
    });
});

describe('handleRemove', () => {
    test('Reject', async () => {
        jest.spyOn(window, 'confirm').mockImplementation(() => false);
        const ids = '1,2,3';
        const response = {
            status: 200,
            success: true,
            data: {
                detail: 'hello',
            },
        };

        const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);
        const output = await Tools.handleRemove('someUrl', ids);
        const eput = null;
        expect(output).toEqual(eput);
    });

    test('Fail', async () => {
        jest.spyOn(window, 'confirm').mockImplementation(() => true);
        const ids = '1,2,3';
        const response = {
            status: 400,
            success: false,
            data: {
                detail: 'error',
            },
        };

        const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);
        const output = await Tools.handleRemove('someUrl', ids);
        const eput = null;
        expect(output).toEqual(eput);
    });

    test('Success', async () => {
        jest.spyOn(window, 'confirm').mockImplementation(() => true);
        const ids = '1,2,3';
        const response = {
            status: 200,
            success: true,
            data: {
                detail: 'hello',
            },
        };

        const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);
        const output = await Tools.handleRemove('someUrl', ids);
        const eput = [1, 2, 3];
        expect(output).toEqual(eput);
    });
});

describe('checkOrUncheckAll', () => {
    test('Full', () => {
        const input = [{id: 1, checked: true}, {id: 2, checked: true}, {id: 3, checked: true}, {id: 4, checked: true}];

        const eput = false;
        const output = Tools.checkOrUncheckAll(input);
        expect(output).toEqual(eput);
    });

    test('Empty', () => {
        const input = [
            {id: 1, checked: false},
            {id: 2, checked: false},
            {id: 3, checked: false},
            {id: 4, checked: false},
        ];

        const eput = true;
        const output = Tools.checkOrUncheckAll(input);
        expect(output).toEqual(eput);
    });

    test('Half full', () => {
        const input = [
            {id: 1, checked: true},
            {id: 2, checked: false},
            {id: 3, checked: false},
            {id: 4, checked: false},
        ];

        const eput = true;
        const output = Tools.checkOrUncheckAll(input);
        expect(output).toEqual(eput);
    });
});
