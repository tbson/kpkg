import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Tools from  '../Tools';
import 'src/__mocks__/localStorage';
import { LOCAL_STORAGE_PREFIX, API_URL } from 'src/constants';

Enzyme.configure({ adapter: new Adapter() });

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

    /*------------------------------------*/

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


test('emptyObj', () => {
    let input = {};
    let eput = true;
    let output = Tools.emptyObj(input);
    expect(output).toBe(eput);

    input = {key: 'value'};
    eput = false;
    output = Tools.emptyObj(input);
    expect(output).toBe(eput);

    input = {key: null};
    eput = false;
    output = Tools.emptyObj(input);
    expect(output).toBe(eput);
});

test('setStorage', () => {
    let input = 'abc';
    Tools.setStorage("key", input);
    let output = localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + 'key');
    output = Tools.parseJson(output);
    expect(output).toBe(input);

    input = null;
    Tools.setStorage("key", input);
    output = localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + 'key');
    output = Tools.parseJson(output);
    expect(output).toBe(input);

    input = 123;
    Tools.setStorage("key", input);
    output = localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + 'key');
    output = Tools.parseJson(output);
    expect(output).toBe(input);

    input = {key: 'value'};
    Tools.setStorage("key", input);
    output = localStorage.getItem(LOCAL_STORAGE_PREFIX + '_' + 'key');
    output = Tools.parseJson(output);
    expect(output).toEqual(input);

    input = {key: null};
    Tools.setStorage("key", input);
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
                enpointSecond: 'kebabCase2'
            }
        },
        {
            controller: 'controller2',
            endpoints: {
                enpointFirst: 'kebabCase1',
                enpointSecond: 'kebabCase2'
            }
        }
    ];
    let output = Tools.getApiUrls(input);
    let eput = {
        enpointFirst: API_URL + 'controller-1/kebab-case-1/',
        enpointSecond: API_URL + 'controller-1/kebab-case-2/',
        controller2EnpointFirst: API_URL + 'controller-2/kebab-case-1/',
        controller2EnpointSecond: API_URL + 'controller-2/kebab-case-2/'
    };
    expect(output).toEqual(eput);
});


test('paramsProcessing', () => {
    let input = {
        key1: 'value1',
        key2: 'value2'
    };
    let output = Tools.paramsProcessing(input);
    let eput = JSON.stringify(input);
    expect(output).toEqual({
        data: eput,
        contentType: 'application/json'
    });

    input = {
        key1: 'value1',
        key2: 'value2'
    };
    output = Tools.paramsProcessing(input, {});
    output.data = Tools.formDataToObj(output.data);
    eput = input;
    expect(output).toEqual({
        data: eput,
        contentType: null
    });
});

test('urlDataEncode', () => {
    let input = {
        key1: 'value1',
        key2: 'value2',
        key3: null,
        key4: '',
        key5: 0,
        key6: 5
    };
    let output = Tools.urlDataEncode(input);
    let eput = "key1=value1&key2=value2&key3=&key4=&key5=0&key6=5";
    expect(output).toEqual(eput);
});

test('urlDataDecode', () => {
    let input = "key1=value1&key2=value2&key3=&key4=&key5=0&key6=5"; 
    let output = Tools.urlDataDecode(input);
    let eput = {
        key1: 'value1',
        key2: 'value2',
        key3: '',
        key4: '',
        key5: '0',
        key6: '5'
    };
    expect(output).toEqual(eput);
});

test('getCheckedId', () => {
    let input = [
        {id: 1},
        {id: 2},
        {id: 3}
    ]; 
    let output = Tools.getCheckedId(input);
    let eput = '';
    expect(output).toEqual(eput);

    input = [
        {id: 1},
        {id: 2, checked: true},
        {id: 3}
    ]; 
    output = Tools.getCheckedId(input);
    eput = '2';
    expect(output).toEqual(eput);

    input = [
        {id: 1, checked: true},
        {id: 2},
        {id: 3, checked: true}
    ]; 
    output = Tools.getCheckedId(input);
    eput = '1,3';
    expect(output).toEqual(eput);

    input = [
        {id: 1, checked: true},
        {id: 2, checked: true},
        {id: 3, checked: true}
    ]; 
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
