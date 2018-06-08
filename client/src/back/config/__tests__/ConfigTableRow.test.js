import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {seeding} from '../_data';
import {Row} from '../tables/ConfigTable';

Enzyme.configure({adapter: new Adapter()});

describe('ConfigTable Row component', () => {
    let wrapper;
    const props = {
        _key: 0,
        data: seeding(1, true)[0],
        toggleModal: jest.fn(),
        handleRemove: jest.fn(),
        onCheck: jest.fn(),
    };

    beforeAll(() => {
        wrapper = shallow(<Row {...props} />);
    });

    it('Check output value', () => {
        expect(wrapper.contains(<td className="uid">key1</td>)).toEqual(true);
        expect(wrapper.contains(<td className="value">value 1</td>)).toEqual(true);
    });

    it('Check', () => {
        wrapper
            .find('.check')
            .first()
            .simulate('change', {target: {checked: true}});
        expect(props.onCheck.mock.calls.length).toEqual(1);
    });

    it('Toggle modal', () => {
        wrapper
            .find('.editBtn')
            .first()
            .simulate('click');
        expect(props.toggleModal.mock.calls.length).toEqual(1);
        expect(props.toggleModal.mock.calls[0][0]).toEqual('modal');
        expect(props.toggleModal.mock.calls[0][1]).toEqual(1);
    });

    it('Remove', () => {
        wrapper
            .find('.removeBtn')
            .first()
            .simulate('click');
        expect(props.handleRemove.mock.calls.length).toEqual(1);
        expect(props.handleRemove.mock.calls[0][0]).toEqual('1');
    });
});
