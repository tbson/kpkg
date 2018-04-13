import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {Pagination, SearchInput} from '../TableUtils';
import Tools from 'src/utils/helpers/Tools';

Enzyme.configure({adapter: new Adapter()});

describe('Pagination component', () => {
    it('No page', () => {
        const props = {
            next: null,
            prev: null,
            onNavigate: jest.fn(),
        };
        const wrapper = shallow(<Pagination {...props} />);
        expect(wrapper.find('button')).toHaveLength(0);
    });

    it('Can next only', () => {
        const props = {
            next: 'http://localhost/?page=2',
            prev: null,
            onNavigate: jest.fn(),
        };
        const wrapper = shallow(<Pagination {...props} />);
        expect(wrapper.find('button')).toHaveLength(1);
        const elem = wrapper.find('button').first();
        expect(elem.text()).toMatch(/Next/);
        elem.simulate('click');
        expect(props.onNavigate.mock.calls.length).toEqual(1);
        expect(props.onNavigate.mock.calls[0][0]).toEqual('http://localhost/?page=2');
    });

    it('Can prev only', () => {
        const props = {
            next: null,
            prev: 'http://localhost/?page=1',
            onNavigate: jest.fn(),
        };
        const wrapper = shallow(<Pagination {...props} />);
        expect(wrapper.find('button')).toHaveLength(1);
        const elem = wrapper.find('button').first();
        expect(elem.text()).toMatch(/Prev/);
        elem.simulate('click');
        expect(props.onNavigate.mock.calls.length).toEqual(1);
        expect(props.onNavigate.mock.calls[0][0]).toEqual('http://localhost/?page=1');
    });

    it('Can navigate both side', () => {
        const props = {
            next: 'http://localhost/?page=3',
            prev: 'http://localhost/?page=1',
            onNavigate: jest.fn(),
        };
        const wrapper = shallow(<Pagination {...props} />);
        expect(wrapper.find('button')).toHaveLength(2);
    });
});

describe('SearchInput component', () => {
    it('Empty input str with change', () => {
        let props = {
            searchStr: '',
            onSearch: jest.fn(),
        };
        let wrapper = shallow(<SearchInput {...props} />);
        let elem = wrapper.find('input').first();
        elem.simulate('change', 'abc');

        expect(props.onSearch.mock.calls.length).toEqual(1);
        expect(props.onSearch.mock.calls[0][0]).toEqual('abc');
        expect(elem.props().value).toEqual('');
    });
    it('Not empty input str', () => {
        let props = {
            searchStr: 'abc',
            onSearch: jest.fn(),
        };
        let wrapper = shallow(<SearchInput {...props} />);
        let elem = wrapper.find('input').first();
        expect(elem.props().value).toEqual('abc');
    });
});
