import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {seeding} from '../_data';
import ConfigModal from '../forms/ConfigModal';

Enzyme.configure({adapter: new Adapter()});

describe('ConfigModal', () => {
    const formName = 'config';

    beforeEach(() => {
        jest.restoreAllMocks();
    });


    it('Hide', () => {
        const props = {
            open: false,
            formValues: {},
            formErrors: {},
            handleClose: jest.fn(),
            handleSubmit: jest.fn(),
        };
        const wrapper = shallow(<ConfigModal {...props} />);
        expect(wrapper.find('.modal-inner').exists()).toEqual(false);
    });

    it('Open', () => {
        const props = {
            open: true,
            formValues: {},
            formErrors: {},
            handleClose: jest.fn(),
            handleSubmit: jest.fn(),
        };
        const wrapper = shallow(<ConfigModal {...props} />);
        expect(wrapper.find('.modal-inner').exists()).toEqual(true);
    });

    it('Adding title', () => {
        const formValues = seeding(1, true)[0];
        formValues.id = 0;
        const props = {
            open: true,
            formValues,
            formErrors: {},
            handleClose: jest.fn(),
            handleSubmit: jest.fn(),
        };
        const wrapper = shallow(<ConfigModal {...props} />).first().shallow();
        expect(wrapper.find('h4').text()).toEqual('Add new config');
    });

    it('Editing title', () => {
        const formValues = seeding(1, true)[0];
        const props = {
            open: true,
            formValues,
            formErrors: {},
            handleClose: jest.fn(),
            handleSubmit: jest.fn(),
        };
        const wrapper = shallow(<ConfigModal {...props} />).first().shallow();
        expect(wrapper.find('h4').text()).toEqual('Update config');
    });
});
