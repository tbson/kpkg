import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import {shallow, mount, render} from 'enzyme';
import 'src/__mocks__/FormValues';
import {Row, ArticleTable} from '../tables/ArticleTable';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import Tools from 'src/utils/helpers/Tools';

Enzyme.articleure({adapter: new Adapter()});

function seeding(numberOfItems, single = false) {
    let result = [];
    for (let i = 1; i <= numberOfItems; i++) {
        result.push({
            id: i,
            uid: 'key' + String(i),
            value: 'value ' + String(i),
            checked: false,
        });
    }
    if (!single) return result;
    return result[result.length - 1];
}

describe('ArticleTable Row component', () => {
    let wrapper;
    const props = {
        _key: 0,
        data: {
            id: 1,
            uid: 'key1',
            value: 'value 1',
        },
        toggleModal: jest.fn(),
        handleRemove: jest.fn(),
        action: jest.fn(),
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
        expect(props.action.mock.calls.length).toEqual(1);
        expect(props.action.mock.calls[0][0]).toEqual('edit');
        expect(props.action.mock.calls[0][1]).toEqual({
            data: {checked: true},
            id: 1,
        });
    });

    it('Toggle modal', () => {
        wrapper
            .find('.editBtn')
            .first()
            .simulate('click');
        expect(props.toggleModal.mock.calls.length).toEqual(1);
        expect(props.toggleModal.mock.calls[0][0]).toEqual('mainModal');
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

describe('ArticleTable component', () => {
    beforeAll(() => {
        const response = {
            status: 200,
            success: true,
            data: {
                count: 1,
                pages: 1,
                page_size: 10,
                links: {next: 'nextUrl', previous: 'prevUrl'},
                items: seeding(10),
            },
        };
        Tools.apiCall = async (url, method, params = {}, popMessage = true, usingLoading = true) => response;
    });

    it('Get list', done => {
        const props = {
            articleState: {
                pages: 1,
                obj: {},
                err: {},
                list: seeding(10),
            },
            action: jest.fn(),
        };

        const wrapper = shallow(<ArticleTable {...props} />);

        // Data not loaded -> show waiting
        expect(wrapper.contains(<LoadingLabel />)).toEqual(true);

        setTimeout(() => {
            // After loading data done
            wrapper.update();
            expect(wrapper.find('.table-row')).toHaveLength(10);

            // Update list action trigger
            expect(props.action.mock.calls.length).toEqual(1);
            expect(props.action.mock.calls[0][0]).toEqual('list');
            expect(props.action.mock.calls[0][1]).toEqual({
                data: props.articleState.list,
                pages: props.articleState.pages,
            });

            // Check states
            expect(wrapper.state().dataLoaded).toBe(true);
            expect(wrapper.state().nextUrl).toEqual('nextUrl');
            expect(wrapper.state().prevUrl).toEqual('prevUrl');
            done();
        }, 100);
    });

    it('Check all', done => {
        const props = {
            articleState: {
                pages: 1,
                obj: {},
                err: {},
                list: seeding(10),
            },
            action: jest.fn(),
        };

        const wrapper = shallow(<ArticleTable {...props} />);
        setTimeout(() => {
            // After loading data done
            wrapper.update();
            wrapper
                .find('.check-all-button')
                .first()
                .simulate('click');
            // First one is update list reducer
            expect(props.action.mock.calls.length).toEqual(2);
            expect(props.action.mock.calls[1][0]).toEqual('toggleCheckAll');
            done();
        }, 100);
    });

    it('Add', done => {
        const props = {
            articleState: {
                pages: 1,
                obj: {},
                err: {},
                list: seeding(10),
            },
            action: jest.fn(),
        };

        const toggleModalSpy = jest.spyOn(ArticleTable.prototype, 'toggleModal');

        const wrapper = shallow(<ArticleTable {...props} />);
        setTimeout(() => {
            // After loading data done
            wrapper.update();
            wrapper
                .find('.add-button')
                .first()
                .simulate('click');

            expect(toggleModalSpy).toHaveBeenCalled();
            expect(toggleModalSpy.mock.calls[0][0]).toEqual('mainModal');
            done();
        }, 100);
    });

    describe('Bulk remove', () => {
        const props = {
            articleState: {
                pages: 1,
                obj: {},
                err: {},
                list: seeding(10),
            },
            action: jest.fn(),
        };

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('No check', done => {
            const handleRemoveSpy = jest.spyOn(ArticleTable.prototype, 'handleRemove').mockImplementation(() => null);

            const wrapper = shallow(<ArticleTable {...props} />);
            setTimeout(() => {
                // After loading data done
                wrapper.update();
                wrapper
                    .find('.bulk-remove-button')
                    .first()
                    .simulate('click');

                expect(handleRemoveSpy).toHaveBeenCalled();
                expect(handleRemoveSpy.mock.calls[0][0]).toEqual('');
                done();
            }, 100);
        });

        it('Check 1', done => {
            props.articleState.list[0].checked = true;

            const handleRemoveSpy = jest.spyOn(ArticleTable.prototype, 'handleRemove').mockImplementation(() => null);

            const wrapper = shallow(<ArticleTable {...props} />);
            setTimeout(() => {
                // After loading data done
                wrapper.update();
                wrapper
                    .find('.bulk-remove-button')
                    .first()
                    .simulate('click');

                expect(handleRemoveSpy).toHaveBeenCalled();
                expect(handleRemoveSpy.mock.calls[0][0]).toEqual('1');
                done();
            }, 100);
        });

        it('Check 3', done => {
            props.articleState.list[0].checked = true;
            props.articleState.list[1].checked = true;
            props.articleState.list[2].checked = true;

            const handleRemoveSpy = jest.spyOn(ArticleTable.prototype, 'handleRemove').mockImplementation(() => null);

            const wrapper = shallow(<ArticleTable {...props} />);
            setTimeout(() => {
                // After loading data done
                wrapper.update();
                wrapper
                    .find('.bulk-remove-button')
                    .first()
                    .simulate('click');

                expect(handleRemoveSpy).toHaveBeenCalled();
                expect(handleRemoveSpy.mock.calls[0][0]).toEqual('1,2,3');
                done();
            }, 100);
        });
    });

    describe('ArticleTable methods', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('list', async () => {
            // Mock apiCall function
            const response = {
                status: 200,
                success: true,
                data: {
                    count: 1,
                    pages: 1,
                    page_size: 10,
                    links: {next: 'nextUrl', previous: 'prevUrl'},
                    items: seeding(10),
                },
            };

            const apiCallSpy = jest
                .spyOn(Tools, 'apiCall')
                .mockImplementation(
                    async (url, method, params = {}, popMessage = true, usingLoading = true) => response,
                );

            // Spy setInitData function
            const setInitDataSpy = jest.spyOn(ArticleTable.prototype, 'setInitData');

            // Init component
            const props = {
                articleState: {
                    pages: 1,
                    obj: {},
                    err: {},
                    list: seeding(10),
                },
                action: jest.fn(),
            };
            const wrapper = shallow(<ArticleTable {...props} />);

            // setInitData will call after ArticleTable mount
            expect(apiCallSpy).toHaveBeenCalled();
            expect(apiCallSpy.mock.calls[0][0]).toEqual('about:///api/v1/article/');
            expect(apiCallSpy.mock.calls[0][1]).toEqual('GET');
            expect(apiCallSpy.mock.calls[0][2]).toEqual({});

            const params = {
                key1: 'value 1',
                key2: 'value 2',
            };

            // Execute 1st time
            const result = await wrapper.instance().list(params);
            expect(result).toEqual(response);

            // Default URL
            expect(apiCallSpy).toHaveBeenCalled();
            expect(apiCallSpy.mock.calls[1][0]).toEqual('about:///api/v1/article/');
            expect(apiCallSpy.mock.calls[1][1]).toEqual('GET');
            expect(apiCallSpy.mock.calls[1][2]).toEqual(params);
            expect(setInitDataSpy).toHaveBeenCalled();

            // Execute 2nd time
            // Custome URL
            await wrapper.instance().list({}, 'someUrl');
            expect(apiCallSpy).toHaveBeenCalled();
            expect(apiCallSpy.mock.calls[2][0]).toEqual('someUrl');
            expect(apiCallSpy.mock.calls[2][1]).toEqual('GET');
            expect(apiCallSpy.mock.calls[2][2]).toEqual({});
        });

        describe('toggleModal', () => {
            it('Not defined modalName or null ID', async () => {
                // Mock apiCall function
                const response = {
                    status: 200,
                    success: true,
                    data: seeding(1, true),
                };
                const apiCallSpy = jest
                    .spyOn(Tools, 'apiCall')
                    .mockImplementation(
                        async (url, method, params = {}, popMessage = true, usingLoading = true) => response,
                    );

                // Mock componentDidMount
                jest.spyOn(ArticleTable.prototype, 'componentDidMount').mockImplementation(() => {});

                // Init component
                const props = {
                    articleState: {
                        pages: 1,
                        obj: {},
                        err: {},
                        list: seeding(10),
                    },
                    action: jest.fn(),
                };
                let wrapper = shallow(<ArticleTable {...props} />);

                // State not pre-defined
                let modalName = 'newThing';
                let result = wrapper.instance().toggleModal(modalName);
                expect(result).toEqual({});

                // State not pre-defined
                modalName = null;
                result = wrapper.instance().toggleModal(modalName);
                expect(result).toEqual({});

                // State not pre-defined
                result = wrapper.instance().toggleModal();
                expect(result).toEqual({});

                // State defined
                modalName = 'mainModal';
                result = wrapper.instance().toggleModal(modalName);
                expect(result).toEqual({
                    id: null,
                    mainModal: true,
                });

                // No id -> add new or close -> reset obj
                expect(props.action.mock.calls[0][0]).toEqual('obj');
                expect(props.action.mock.calls[0][1]).toEqual({});

                // No id -> add new or close -> reset err
                expect(props.action.mock.calls[1][0]).toEqual('err');
                expect(props.action.mock.calls[1][1]).toEqual({});

                expect(props.action.mock.calls.length).toEqual(2);
            });

            it('Not null ID', async done => {
                // Mock apiCall function
                const response = {
                    status: 200,
                    success: true,
                    data: seeding(1, true),
                };
                const apiCallSpy = jest
                    .spyOn(Tools, 'apiCall')
                    .mockImplementation(
                        async (url, method, params = {}, popMessage = true, usingLoading = true) => response,
                    );

                // Mock componentDidMount
                jest.spyOn(ArticleTable.prototype, 'componentDidMount').mockImplementation(() => {});

                // Init component
                const props = {
                    articleState: {
                        pages: 1,
                        obj: {},
                        err: {},
                        list: seeding(10),
                    },
                    action: jest.fn(),
                };

                // Init component again
                const wrapper = shallow(<ArticleTable {...props} />);

                // State defined
                const modalName = 'mainModal';
                const id = 1;
                const result = wrapper.instance().toggleModal(modalName, 1);
                expect(result).toEqual({
                    id: 1,
                    mainModal: true,
                });
                setTimeout(() => {
                    // Has id -> set obj
                    expect(props.action.mock.calls.length).toEqual(1);
                    expect(props.action.mock.calls[0][0]).toEqual('obj');
                    expect(props.action.mock.calls[0][1]).toEqual({data: response.data});
                    done();
                });
            });
        });

        it('handleSubmit', async () => {
            const event = {
                preventDefault: () => {},
                target: null
            };
            const preventDefault = jest.spyOn(event, 'preventDefault');
            const toggleModal = jest.spyOn(ArticleTable.prototype, 'toggleModal')
                .mockImplementation(
                    () => ({}),
                );
            jest.spyOn(ArticleTable.prototype, 'componentDidMount').mockImplementation(() => {});

            // Init component
            const props = {
                articleState: {
                    pages: 1,
                    obj: {},
                    err: {},
                    list: seeding(10),
                },
                action: jest.fn(),
            };

            const handleAddSuccess = jest.spyOn(ArticleTable.prototype, 'handleAdd')
                .mockImplementation(
                    async params => null
                );
            const handleEditSuccess = jest.spyOn(ArticleTable.prototype, 'handleEdit')
                .mockImplementation(
                    async params => null
                );

            // Init component again
            const wrapper = shallow(<ArticleTable {...props} />);

            // Add success
            // Edit fail
            jest.spyOn(Tools, 'formDataToObj')
                .mockImplementation(
                    () => ({
                        uid: 'uid1',
                        value: 'value1',
                    }),
                );
            const addSuccess = await wrapper.instance().handleSubmit(event);
            expect(addSuccess).toEqual(true);
            expect(handleAddSuccess.mock.calls.length).toEqual(1);
            expect(toggleModal.mock.calls.length).toEqual(1);

            // Edit success
            jest.spyOn(Tools, 'formDataToObj')
                .mockImplementation(
                    () => ({
                        id: 1,
                        uid: 'uid1',
                        value: 'value1',
                    }),
                );
            const editSuccess = await wrapper.instance().handleSubmit(event);
            expect(editSuccess).toEqual(true);
            expect(handleEditSuccess.mock.calls.length).toEqual(1);
            expect(toggleModal.mock.calls.length).toEqual(2)

            /*
            // Add fail
            jest.spyOn(Tools, 'formDataToObj')
                .mockImplementation(
                    () => ({
                        uid: 'uid1',
                        value: 'value1',
                    }),
                );
            const addFalse = await wrapper.instance().handleSubmit(event);
            expect(addFalse).toEqual(false);
            expect(handleAdd.mock.calls.length).toEqual(1);
            expect(toggleModal.mock.calls.length).toEqual(1);
            */
        });
    });
});
