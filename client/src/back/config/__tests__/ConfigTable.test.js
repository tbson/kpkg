import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import {shallow, mount, render} from 'enzyme';
import 'src/__mocks__/FormData';
import {ConfigTable} from '../tables/ConfigTable';
import {seeding, emptySeed} from '../_data';
import LoadingLabel from 'src/utils/components/LoadingLabel';
import Tools from 'src/utils/helpers/Tools';

Enzyme.configure({adapter: new Adapter()});

describe('ConfigTable component', () => {
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
        Tools.apiCall = async (url, method, params = {}) => response;
    });

    it('Init data', done => {
        const wrapper = shallow(<ConfigTable />);
        const instance = wrapper.instance();
        const setInitData = jest.spyOn(instance, 'setInitData');

        // Data not loaded -> show waiting
        expect(wrapper.contains(<LoadingLabel />)).toEqual(true);

        setTimeout(() => {
            // After loading data done
            wrapper.update();
            expect(wrapper.find('.table-row')).toHaveLength(10);

            expect(setInitData).toHaveBeenCalled();
            done();
        }, 100);
    });

    it('Check all', () => {
        // Spy/mock static methods
        jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});

        const wrapper = shallow(<ConfigTable list={seeding(10)}/>);
        const instance = wrapper.instance();
        const handleToggleCheckAll = jest.spyOn(instance, 'handleToggleCheckAll');

        wrapper
            .find('.check-all-button')
            .first()
            .simulate('click');

        expect(handleToggleCheckAll).toHaveBeenCalled();
    });

    it('Add', () => {
        // Spy/mock static methods
        jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});

        const wrapper = shallow(<ConfigTable list={seeding(10)}/>);
        const instance = wrapper.instance();
        const toggleModal = jest.spyOn(instance, 'toggleModal');

        wrapper
            .find('.add-button')
            .first()
            .simulate('click');

        expect(toggleModal).toHaveBeenCalled();
        expect(toggleModal.mock.calls[0][0]).toEqual('modal');
    });

    describe('Bulk remove', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('No check', () => {
            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});

            const wrapper = shallow(<ConfigTable list={seeding(10)}/>);
            const instance = wrapper.instance();
            const handleRemove = jest.spyOn(instance, 'handleRemove').mockImplementation(() => null);

            wrapper
                .find('.bulk-remove-button')
                .first()
                .simulate('click');

            expect(handleRemove).toHaveBeenCalled();
            expect(handleRemove.mock.calls[0][0]).toEqual('');
        });

        it('Check all', () => {
            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});

            const wrapper = shallow(<ConfigTable list={seeding(10)}/>);
            const instance = wrapper.instance();
            const handleRemove = jest.spyOn(instance, 'handleRemove').mockImplementation(() => null);

            wrapper
                .find('.check-all-button')
                .first()
                .simulate('click');

            wrapper
                .find('.bulk-remove-button')
                .first()
                .simulate('click');

            expect(handleRemove).toHaveBeenCalled();
            expect(handleRemove.mock.calls[0][0]).toEqual('1,2,3,4,5,6,7,8,9,10');
        });
    });
});

describe('ConfigTable methods', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getList', () => {
        it('fail', async () => {
            const response = {
                status: 400,
                success: false,
                data: {
                    detail: 'error',
                },
            };
            const params = {
                key1: 'value 1',
                key2: 'value 2',
            };

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            let apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

            // Init component
            const wrapper = shallow(<ConfigTable />);
            const instance = wrapper.instance();

            // Spy setInitData function
            const setInitData = jest.spyOn(instance, 'setInitData');

            // Execute
            const result = await wrapper.instance().getList(params);

            // setInitData will call after ConfigTable mount
            expect(apiCall.mock.calls[0][0]).toEqual('about:///api/v1/config/');
            expect(apiCall.mock.calls[0][1]).toEqual('GET');
            expect(apiCall.mock.calls[0][2]).toEqual(params);
            expect(setInitData).not.toHaveBeenCalled();
            expect(result).toEqual(null);
        });

        it('success', async () => {
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
            const params = {
                key1: 'value 1',
                key2: 'value 2',
            };

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            let apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

            // Init component
            const wrapper = shallow(<ConfigTable />);
            const instance = wrapper.instance();

            // Spy setInitData function
            const setInitData = jest.spyOn(instance, 'setInitData');

            // Execute
            const result = await wrapper.instance().getList(params);

            // setInitData will call after ConfigTable mount
            expect(apiCall.mock.calls[0][0]).toEqual('about:///api/v1/config/');
            expect(apiCall.mock.calls[0][1]).toEqual('GET');
            expect(apiCall.mock.calls[0][2]).toEqual(params);
            expect(setInitData).toHaveBeenCalled();
            expect(result).toEqual(response.data.items);
        });
    });

    describe('toggleModal', () => {
        it('Not defined modalName or null ID', async () => {
            // Mock apiCall function
            const response = {
                status: 200,
                success: true,
                data: seeding(1, true)[0],
            };

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

            // Init component
            let wrapper = shallow(<ConfigTable />);
            let instance = wrapper.instance();

            // State not pre-defined
            let modalName = 'newThing';
            let result = await instance.toggleModal(modalName);
            expect(result).toEqual({});

            // State not pre-defined
            modalName = null;
            result = await instance.toggleModal(modalName);
            expect(result).toEqual({});

            // State not pre-defined
            result = await instance.toggleModal();
            expect(result).toEqual({});

            // State defined
            modalName = 'modal';
            result = await instance.toggleModal(modalName);
            expect(result).toEqual({
                formErrors: {},
                formValues: emptySeed,
                modal: true,
            });
        });

        it('Not null ID', async () => {
            // Mock apiCall function
            const response = {
                status: 200,
                success: true,
                data: seeding(1, true),
            };

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

            // Init component again
            const wrapper = shallow(<ConfigTable />);
            const instance = wrapper.instance();

            // State defined
            const modalName = 'modal';
            const id = 1;
            const result = await instance.toggleModal(modalName, id);
            expect(result).toEqual({
                formErrors: {},
                formValues: seeding(id, true),
                modal: true,
            });
        });
    });

    describe('handleAdd', () => {
        it('Fail', async () => {
            // Prepare data
            const data = seeding(1, true)[0];
            const formValues = {...data};
            delete formValues.id;
            const error = {
                status: 400,
                success: false,
                data: {
                    uid: 'Duplicate',
                },
            };

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => error);

            // Init component
            const wrapper = shallow(<ConfigTable />);
            const instance = wrapper.instance();

            // Spy/mock instance methods
            const handleAdd = jest.spyOn(instance, 'handleAdd');

            // Execute tested method
            const result = await instance.handleAdd(formValues);

            // Compare result
            expect(result).toEqual(error);
        });

        it('Success', async () => {
            // Prepare data
            const data = seeding(1, true)[0];
            const formValues = {...data};
            delete formValues.id;
            const response = {
                status: 200,
                success: true,
                data: data,
            };

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

            // Init component
            const wrapper = shallow(<ConfigTable />);
            const instance = wrapper.instance();

            // Spy/mock instance methods
            const handleAdd = jest.spyOn(instance, 'handleAdd');

            // Execute tested method
            const result = await instance.handleAdd(formValues);

            // Compare result
            expect(result).toEqual(response);
        });
    });

    describe('handleEdit', () => {
        it('Fail', async () => {
            // Prepare data
            const data = seeding(1, true)[0];
            const formValues = {...data};
            const error = {
                status: 400,
                success: false,
                data: {
                    uid: 'Duplicate',
                },
            };

            // Spy/mock static methods
            const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => error);

            // Init component
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            const wrapper = shallow(<ConfigTable />);
            const instance = wrapper.instance();

            // Spy/mock instance methods
            const handleEdit = jest.spyOn(instance, 'handleEdit');

            // Execute tested method
            const result = await instance.handleEdit(formValues);

            // Compare result
            expect(result).toEqual(error);
        });

        it('Success', async () => {
            // Prepare data
            const data = seeding(1, true)[0];
            const formValues = {...data};
            const response = {
                status: 200,
                success: true,
                data: data,
            };

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

            // Init component
            const wrapper = shallow(<ConfigTable />);
            const instance = wrapper.instance();

            // Spy/mock instance methods
            const handleEdit = jest.spyOn(instance, 'handleEdit');

            // Execute tested method
            const result = await instance.handleEdit(formValues);

            // Compare result
            expect(result).toEqual(response);
        });
    });

    describe('handleSubmit', () => {
        const event = {
            preventDefault: () => {},
            target: null,
        };

        describe('Adding', () => {
            it('Fail', async () => {
                // Prepare data
                const data = seeding(1, true)[0];
                delete data.id;
                const formValues = {...data};
                const response = {
                    success: false,
                    data: {
                        detail: 'error',
                    },
                };
                const event = {
                    preventDefault: () => {},
                };

                // Spy/mock static methods
                jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
                jest.spyOn(Tools, 'formDataToObj').mockImplementation(() => data);
                const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

                // Init component
                const wrapper = shallow(<ConfigTable />);
                const instance = wrapper.instance();

                // Spy/mock instance methods
                const handleAdd = jest.spyOn(instance, 'handleAdd').mockImplementation(() => response);
                const handleEdit = jest.spyOn(instance, 'handleEdit').mockImplementation(() => response);

                // Execute tested method
                const result = await instance.handleSubmit(event);

                // Compare result
                expect(result).toEqual(response.data);
                expect(handleAdd).toHaveBeenCalled();
                expect(handleEdit).not.toHaveBeenCalled();
                expect(wrapper.state().list.length).toEqual(0);
            });

            it('Success', async () => {
                // Prepare data
                const data = seeding(1, true)[0];
                delete data.id;
                const formValues = {...data};
                const response = {
                    success: true,
                    data: data,
                };
                const event = {
                    preventDefault: () => {},
                };

                // Spy/mock static methods
                jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
                jest.spyOn(Tools, 'formDataToObj').mockImplementation(() => data);
                const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

                // Init component
                const wrapper = shallow(<ConfigTable />);
                const instance = wrapper.instance();

                // Spy/mock instance methods
                const handleAdd = jest.spyOn(instance, 'handleAdd').mockImplementation(() => response);
                const handleEdit = jest.spyOn(instance, 'handleEdit').mockImplementation(() => response);

                // Execute tested method
                const result = await instance.handleSubmit(event);

                // Compare result
                expect(result).toEqual(response.data);
                expect(handleAdd).toHaveBeenCalled();
                expect(handleEdit).not.toHaveBeenCalled();
                expect(wrapper.state().list.length).toEqual(1);
            });
        });

        describe('Editing', () => {
            it('Fail', async () => {
                // Prepare data
                const originalData = seeding(1, true)[0];
                const data = {...seeding(2, true)[0], id: originalData.id};
                const formValues = {...data};
                const response = {
                    success: false,
                    data: {
                        detail: 'error',
                    },
                };
                const event = {
                    preventDefault: () => {},
                };

                // Spy/mock static methods
                jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
                jest.spyOn(Tools, 'formDataToObj').mockImplementation(() => data);
                const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

                // Init component
                const wrapper = shallow(<ConfigTable list={seeding(10)} />);
                const instance = wrapper.instance();

                // Spy/mock instance methods
                const handleAdd = jest.spyOn(instance, 'handleAdd').mockImplementation(() => response);
                const handleEdit = jest.spyOn(instance, 'handleEdit').mockImplementation(() => response);

                // Execute tested method
                const result = await instance.handleSubmit(event);

                // Compare result
                expect(result).toEqual(response.data);
                expect(handleEdit).toHaveBeenCalled();
                expect(handleAdd).not.toHaveBeenCalled();
                expect(wrapper.state().list.length).toEqual(10);
                expect(wrapper.state().list[0]).toEqual(originalData);
            });

            it('Success', async () => {
                // Prepare data
                const originalData = seeding(1, true)[0];
                const data = {...seeding(2, true)[0], id: originalData.id};
                const formValues = {...data};
                const response = {
                    success: true,
                    data: data,
                };
                const event = {
                    preventDefault: () => {},
                };

                // Spy/mock static methods
                jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
                jest.spyOn(Tools, 'formDataToObj').mockImplementation(() => data);
                const apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

                // Init component
                const wrapper = shallow(<ConfigTable list={seeding(10)} />);
                const instance = wrapper.instance();

                // Spy/mock instance methods
                const handleAdd = jest.spyOn(instance, 'handleAdd').mockImplementation(() => response);
                const handleEdit = jest.spyOn(instance, 'handleEdit').mockImplementation(() => response);

                // Execute tested method
                const result = await instance.handleSubmit(event);

                // Compare result
                expect(result).toEqual(response.data);
                expect(handleEdit).toHaveBeenCalled();
                expect(handleAdd).not.toHaveBeenCalled();
                expect(wrapper.state().list.length).toEqual(10);
                expect(wrapper.state().list[0]).toEqual(data);
            });
        });
    });

    describe('handleToggleCheckAll', () => {
        it('Empty list', () => {
            const list = seeding(10);

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});

            // Init component
            const wrapper = shallow(<ConfigTable list={list} />);
            const instance = wrapper.instance();

            // Execute tested method
            const result = instance.handleToggleCheckAll();
            expect(result).toEqual(list.map(item => ({...item, checked: true})));
        });
        it('Half empty list', () => {
            const list = seeding(10);
            list[0].checked = true;

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});

            // Init component
            const wrapper = shallow(<ConfigTable list={list} />);
            const instance = wrapper.instance();

            // Execute tested method
            const result = instance.handleToggleCheckAll();
            expect(result).toEqual(list.map(item => ({...item, checked: true})));
        });
        it('Full list', () => {
            const list = seeding(10).map(item => ({...item, checked: true}));

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});

            // Init component
            const wrapper = shallow(<ConfigTable list={list} />);
            const instance = wrapper.instance();

            // Execute tested method
            const result = instance.handleToggleCheckAll();
            expect(result).toEqual(seeding(10));
        });
    });
    describe('handleCheck', () => {
        it('False to True', () => {
            const list = seeding(1);
            const event = {
                target: {id: 1, checked: true},
            };

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});

            // Init component
            const wrapper = shallow(<ConfigTable list={list} />);
            const instance = wrapper.instance();

            // Execute tested method
            const result = instance.handleCheck(event);
            expect(result).toEqual({...list[0], checked: true});
        });
        it('True to False', () => {
            const list = seeding(1);
            list[0].checked = true;
            const event = {
                target: {id: 1, checked: false},
            };

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});

            // Init component
            const wrapper = shallow(<ConfigTable list={list} />);
            const instance = wrapper.instance();

            // Execute tested method
            const result = instance.handleCheck(event);
            expect(result).toEqual({...list[0], checked: false});
        });
    });
    describe('handleRemove', () => {
        it('No confirm', async () => {
            jest.spyOn(window, 'confirm').mockImplementation(() => false);

            // Init component
            const wrapper = shallow(<ConfigTable />);
            const instance = wrapper.instance();

            // Execute tested method
            const result = await instance.handleRemove('1');

            // Checking result
            expect(result).toEqual([]);
        });
        it('Single ID', async () => {
            const list = seeding(3);
            const response = {
                success: true,
            };
            const eput = seeding(2);

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            jest.spyOn(window, 'confirm').mockImplementation(() => true);
            let apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

            // Init component
            const wrapper = shallow(<ConfigTable list={list} />);
            const instance = wrapper.instance();

            // Execute tested method
            const output = await instance.handleRemove('3');

            // Checking result
            expect(output).toEqual(eput);
        });
        it('List ID', async () => {
            const list = seeding(3);
            const response = {
                success: true,
            };
            const eput = seeding(1);

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            jest.spyOn(window, 'confirm').mockImplementation(() => true);
            let apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

            // Init component
            const wrapper = shallow(<ConfigTable list={list} />);
            const instance = wrapper.instance();

            // Execute tested method
            const output = await instance.handleRemove('2,3');

            // Checking result
            expect(output).toEqual(eput);
        });
        it('Fail', async () => {
            const list = seeding(3);
            const response = {
                success: false,
            };
            const eput = [];

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            jest.spyOn(window, 'confirm').mockImplementation(() => true);
            let apiCall = jest.spyOn(Tools, 'apiCall').mockImplementation(async () => response);

            // Init component
            const wrapper = shallow(<ConfigTable list={list} />);
            const instance = wrapper.instance();

            // Execute tested method
            const output = await instance.handleRemove('1');

            // Checking result
            expect(output).toEqual(eput);
        });
    });

    describe('handleSearch', () => {
        it('Empty string', async () => {
            const data = {searchStr: ''};
            const list = seeding(10);
            const event = {
                preventDefault: () => {},
                target: {},
            };
            const eput = list;

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            jest.spyOn(Tools, 'formDataToObj').mockImplementation(() => data);

            // Init component
            const wrapper = shallow(<ConfigTable />);
            const instance = wrapper.instance();
            const getList = jest.spyOn(instance, 'getList').mockImplementation(() => list);

            // Execute tested method
            const output = await instance.handleSearch(event);

            // Checking result
            expect(output).toEqual(list);
            expect(getList.mock.calls[0][0]).toBe(undefined);
        });
        it('2 character', async () => {
            const data = {searchStr: 'ab'};
            const list = seeding(10);
            const event = {
                preventDefault: () => {},
                target: {},
            };
            const eput = [];

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            jest.spyOn(Tools, 'formDataToObj').mockImplementation(() => data);

            // Init component
            const wrapper = shallow(<ConfigTable />);
            const instance = wrapper.instance();
            const getList = jest.spyOn(instance, 'getList').mockImplementation(() => list);

            // Execute tested method
            const output = await instance.handleSearch(event);

            // Checking result
            expect(output).toEqual(null);
            expect(getList).not.toHaveBeenCalled();
        });
        it('3 characters', async () => {
            const data = {searchStr: 'abc'};
            const list = seeding(10);
            const event = {
                preventDefault: () => {},
                target: {},
            };
            const eput = list;

            // Spy/mock static methods
            jest.spyOn(ConfigTable.prototype, 'componentDidMount').mockImplementation(() => {});
            jest.spyOn(Tools, 'formDataToObj').mockImplementation(() => data);

            // Init component
            const wrapper = shallow(<ConfigTable />);
            const instance = wrapper.instance();
            const getList = jest.spyOn(instance, 'getList').mockImplementation(() => list);

            // Execute tested method
            const output = await instance.handleSearch(event);

            // Checking result
            expect(output).toEqual(list);
            expect(getList.mock.calls[0][0]).toEqual({search: data.searchStr});
        });
    });
});
