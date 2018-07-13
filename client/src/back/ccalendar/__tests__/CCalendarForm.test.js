import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {seeding} from '../_data';
import CCalendarForm from '../forms/CCalendarForm';

Enzyme.configure({adapter: new Adapter()});

describe('CCalendarForm', () => {
    const formName = 'ccalendar';

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
        const wrapper = shallow(<CCalendarForm {...props} />);

        expect(wrapper.find('[name="id"]').exists()).toEqual(true);
        expect(wrapper.find('[name="title"]').exists()).toEqual(true);
        expect(wrapper.find('[name="start"]').exists()).toEqual(true);
        expect(wrapper.find('[name="end"]').exists()).toEqual(true);
        expect(wrapper.find('[name="url"]').exists()).toEqual(true);

        // Labels
        expect(wrapper.find('.title-field label').text()).toEqual("Title");
        expect(wrapper.find('.start-field label').text()).toEqual("Start date");
        expect(wrapper.find('.end-field label').text()).toEqual("End date");
        expect(wrapper.find('.url-field label').text()).toEqual("URL");

        // Error messages
        expect(wrapper.find('.title-field .invalid-feedback').text()).toEqual("");
        expect(wrapper.find('.start-field .invalid-feedback').text()).toEqual("");
        expect(wrapper.find('.end-field .invalid-feedback').text()).toEqual("");
        expect(wrapper.find('.url-field .invalid-feedback').text()).toEqual("");
    });

    it('Empty form', () => {
        const props = {
            formName,
            formValues: {},
            formErrors: {},
            handleSubmit: jest.fn(),
        };
        const wrapper = shallow(<CCalendarForm {...props} />);

        expect(wrapper.find('[name="id"]').props().defaultValue).toEqual(0);
        expect(wrapper.find('[name="title"]').props().defaultValue).toEqual("");
        expect(wrapper.find('[name="start"]').props().defaultValue).toEqual(null);
        expect(wrapper.find('[name="end"]').props().defaultValue).toEqual(null);
        expect(wrapper.find('[name="url"]').props().defaultValue).toEqual("");
    });

    it('Editing form', () => {
        let formValues = seeding(1, true);
        const props = {
            formName,
            formValues,
            formErrors: {},
            handleSubmit: jest.fn(),
        };

        const wrapper = shallow(<CCalendarForm {...props} />);
        formValues = wrapper.state('formValues');
        expect(wrapper.find('[name="id"]').props().defaultValue).toEqual(formValues.id);
        expect(wrapper.find('[name="title"]').props().defaultValue).toEqual(formValues.title);
        expect(wrapper.find('[name="start"]').props().defaultValue).toEqual(formValues.start);
        expect(wrapper.find('[name="end"]').props().defaultValue).toEqual(formValues.end);
        expect(wrapper.find('[name="url"]').props().defaultValue).toEqual(formValues.url);
        expect(wrapper.find('.main-action .label').text()).toEqual("Update");
    });

    it('Adding form', () => {
        let formValues = seeding(1, true);
        formValues.id = 0;
        const props = {
            formName,
            formValues,
            formErrors: {},
            handleSubmit: jest.fn(),
        };

        const wrapper = shallow(<CCalendarForm {...props} />);
        formValues = wrapper.state('formValues');
        expect(wrapper.find('[name="id"]').props().defaultValue).toEqual(0);
        expect(wrapper.find('[name="title"]').props().defaultValue).toEqual(formValues.title);
        expect(wrapper.find('[name="start"]').props().defaultValue).toEqual(formValues.start);
        expect(wrapper.find('[name="end"]').props().defaultValue).toEqual(formValues.end);
        expect(wrapper.find('[name="url"]').props().defaultValue).toEqual(formValues.url);
        expect(wrapper.find('.main-action .label').text()).toEqual("Add new");
    });

    it('Error form', () => {
        const props = {
            formName,
            formValues: {},
            formErrors: {
                title: 'error 1',
                start: 'error 2',
                end: 'error 3',
                url: 'error 4',
            },
            handleSubmit: jest.fn(),
        };

        const wrapper = shallow(<CCalendarForm {...props} />);
        // Error messages
        expect(wrapper.find('.title-field .invalid-feedback').text()).toEqual(props.formErrors.title);
        expect(wrapper.find('.start-field .invalid-feedback').text()).toEqual(props.formErrors.start);
        expect(wrapper.find('.end-field .invalid-feedback').text()).toEqual(props.formErrors.end);
        expect(wrapper.find('.url-field .invalid-feedback').text()).toEqual(props.formErrors.url);
    });
});
