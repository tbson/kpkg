import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {seeding} from '../_data';
import {Login} from '../Login';
import Tools from 'src/utils/helpers/Tools';

Enzyme.configure({adapter: new Adapter()});

describe('Login', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe('Checking for redirect on init', () => {
        it('Not log in', () => {
            const getStorageObj = jest.spyOn(Tools, 'getStorageObj').mockImplementation(() => ({}));
            const navigateTo = jest.spyOn(Tools, 'navigateTo').mockImplementation(() => {});

            const wrapper = shallow(<Login />);
            const instance = wrapper.instance();
            const _navigateTo = jest.spyOn(instance, 'navigateTo');

            expect(getStorageObj.mock.calls[0][0]).toEqual('authData');
            expect(_navigateTo).not.toHaveBeenCalled();
        });

        it('Logged in', () => {
            const getStorageObj = jest.spyOn(Tools, 'getStorageObj').mockImplementation(() => ({email: 'test@gmail.com'}));
            const navigateTo = jest.spyOn(Tools, 'navigateTo').mockImplementation(() => {});

            const wrapper = shallow(<Login />);
            const instance = wrapper.instance();
            const _navigateTo = jest.spyOn(instance, 'navigateTo');

            expect(getStorageObj.mock.calls[0][0]).toEqual('authData');
            expect(navigateTo).toHaveBeenCalled();
        });
    });
});
