// @flow
import * as React from 'react';
import Tools from 'src/utils/helpers/Tools';
import type {FormValues} from '../_data';
import {defaultFormValues} from '../_data';

type Props = {
    formValues: FormValues,
    formErrors: Object,
    handleSubmit: Function,
    children?: React.Node
};
type States = {
    formValues: FormValues,
    actionName: string
};

export default class CCalendarForm extends React.Component<Props, States> {
    static defaultProps = {};
    name = 'config';

    state = {
        formValues: defaultFormValues,
        actionName: ''
    };

    constructor(props: Props) {
        super(props);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: States) {
        const formValues = !Tools.isEmpty(nextProps.formValues) ? nextProps.formValues : defaultFormValues;
        return {
            formValues,
            actionName: formValues.id ? 'Update' : 'Add new'
        };
    }

    resetForm = () => {
        window.document.querySelector(`form[name=${this.name}]`).reset();
        window.document.querySelector(`form[name=${this.name}] [name=title]`).focus();
    };

    setClassName = (name: string) => {
        return this.props.formErrors[name] ? 'form-control is-invalid' : 'form-control';
    };

    setErrorMessage = (name: string) => {
        return this.props.formErrors[name];
    };

    render() {
        const {handleSubmit, children} = this.props;
        const {formValues, actionName} = this.state;
        return (
            <form name={this.name} onSubmit={handleSubmit}>
                <input defaultValue={formValues.id} name="id" id={`${this.name}-id`} type="hidden" />
                <div className="form-group title-field">
                    <label htmlFor="title">Title</label>
                    <input
                        defaultValue={this.state.formValues.title}
                        id="title"
                        name="title"
                        type="text"
                        className={this.setClassName('title')}
                        required
                        autoFocus
                        placeholder="Title..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('title')}</div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group start-field">
                            <label htmlFor="start">Start date</label>
                            <input
                                defaultValue={this.state.formValues.start}
                                id="start"
                                name="start"
                                type="date"
                                className={this.setClassName('start')}
                                required
                                placeholder="Start date..."
                            />
                            <div className="invalid-feedback">{this.setErrorMessage('start')}</div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group end-field">
                            <label htmlFor="end">End date</label>
                            <input
                                defaultValue={this.state.formValues.end}
                                id="end"
                                name="end"
                                type="date"
                                className={this.setClassName('end')}
                                required
                                placeholder="End date..."
                            />
                            <div className="invalid-feedback">{this.setErrorMessage('end')}</div>
                        </div>
                    </div>
                </div>

                <div className="form-group url-field">
                    <label htmlFor="url">URL</label>
                    <input
                        defaultValue={this.state.formValues.url}
                        id="url"
                        name="url"
                        type="text"
                        className={this.setClassName('url')}
                        placeholder="URL..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('url')}</div>
                </div>

                <div className="right">
                    {children}
                    <button className="btn btn-primary main-action">
                        <span className="oi oi-check" />&nbsp;
                        <span className="label">{actionName}</span>
                    </button>
                </div>
            </form>
        );
    }
}
