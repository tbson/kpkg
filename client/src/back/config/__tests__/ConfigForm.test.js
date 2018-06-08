import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {seeding} from '../_data';
import ConfigForm from '../forms/ConfigForm';

Enzyme.configure({adapter: new Adapter()});

describe('ConfigForm', () => {
    const formName = 'config';

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('Enough fields', () => {
        const props = {
            formName,
            formValues: {},
            formErrors: {},
            handleSubmit: jest.fn(),
        };
        const wrapper = shallow(<ConfigForm {...props} />);

        expect(wrapper.find('[name="id"]').exists()).toEqual(true);
        expect(wrapper.find('[name="uid"]').exists()).toEqual(true);

        // Labels
        expect(wrapper.find('.uid-field label').text()).toEqual("Key");
        expect(wrapper.find('.value-field label').text()).toEqual("Value");

        // Error messages
        expect(wrapper.find('.uid-field .invalid-feedback').text()).toEqual("");
        expect(wrapper.find('.value-field .invalid-feedback').text()).toEqual("");
    });

    it('Empty form', () => {
        const props = {
            formName,
            formValues: {},
            formErrors: {},
            handleSubmit: jest.fn(),
        };
        const wrapper = shallow(<ConfigForm {...props} />);

        expect(wrapper.find('[name="id"]').props().defaultValue).toEqual(0);
        expect(wrapper.find('[name="uid"]').props().defaultValue).toEqual("");
        expect(wrapper.find('[name="value"]').props().defaultValue).toEqual("");
    });

    it('Editing form', () => {
        const props = {
            formName,
            formValues: seeding(1, true)[0],
            formErrors: {},
            handleSubmit: jest.fn(),
        };

        const wrapper = shallow(<ConfigForm {...props} />);

        expect(wrapper.find('[name="id"]').props().defaultValue).toEqual(props.formValues.id);
        expect(wrapper.find('[name="uid"]').props().defaultValue).toEqual(props.formValues.uid);
        expect(wrapper.find('[name="value"]').props().defaultValue).toEqual(props.formValues.value);
        expect(wrapper.find('.main-action .label').text()).toEqual("Update");
    });

    it('Adding form', () => {
        const formValues = seeding(1, true)[0];
        formValues.id = 0;
        const props = {
            formName,
            formValues,
            formErrors: {},
            handleSubmit: jest.fn(),
        };

        const wrapper = shallow(<ConfigForm {...props} />);

        expect(wrapper.find('[name="id"]').props().defaultValue).toEqual(0);
        expect(wrapper.find('[name="uid"]').props().defaultValue).toEqual(props.formValues.uid);
        expect(wrapper.find('[name="value"]').props().defaultValue).toEqual(props.formValues.value);
        expect(wrapper.find('.main-action .label').text()).toEqual("Add new");
    });

    it('Error form', () => {
        const props = {
            formName,
            formValues: {},
            formErrors: {
                uid: 'error 1',
                value: 'error 2',
            },
            handleSubmit: jest.fn(),
        };

        const wrapper = shallow(<ConfigForm {...props} />);

        // Error messages
        expect(wrapper.find('.uid-field .invalid-feedback').text()).toEqual(props.formErrors.uid);
        expect(wrapper.find('.value-field .invalid-feedback').text()).toEqual(props.formErrors.value);
    });
});
