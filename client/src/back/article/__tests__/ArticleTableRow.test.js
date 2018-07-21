import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {Link} from 'react-router-dom';
import Tools from 'src/utils/helpers/Tools';
import {seeding} from '../_data';
import {Row} from '../tables/ArticleTable';

Enzyme.configure({adapter: new Adapter()});

let wrapper;
let instance;
const data = seeding(1, true);
const parent = {
    id: 1,
    type: 'category'
};
const props = {
    data,
    parent,
    handleRemove: jest.fn(),
    onCheck: jest.fn()
};

beforeAll(() => {
    wrapper = shallow(<Row {...props} />);
    instance = wrapper.instance();
});

describe('ArticleTable Row component', () => {
    it('Check output value', () => {
        expect(
            wrapper.contains(
                <td className="title">
                    <Link to={`/article/${parent.type}/${parent.id}/${data.id}`}>{data.title}</Link>
                </td>
            )
        ).toEqual(true);
        expect(wrapper.contains(<td className="category_title">{data.category_title}</td>)).toEqual(true);
        expect(
            wrapper.contains(
                <td className="use_slide">
                    <span className="oi oi-check green" />
                </td>
            )
        ).toEqual(true);
        expect(
            wrapper.contains(
                <td className="pin">
                    <span className="oi oi-x red" />
                </td>
            )
        ).toEqual(true);
        expect(wrapper.contains(<td className="order">{data.order}</td>)).toEqual(true);
    });

    it('Check', () => {
        wrapper
            .find('.check')
            .first()
            .simulate('change', {target: {checked: true}});
        expect(props.onCheck.mock.calls.length).toEqual(1);
    });

    it('Open modal to edit', async () => {
        expect(wrapper.find('.editBtn').prop('to')).toEqual(`/article/${parent.type}/${parent.id}/${data.id}`);
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
