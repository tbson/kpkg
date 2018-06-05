// @flow
import * as React from 'react';
import Tools from 'src/utils/helpers/Tools';
import type {FormValues} from '../_data';
import {defaultFormValues} from '../_data';

type Props = {
    handleSubmit: Function,
    children?: React.Node,
    formId: string,
    submitTitle: string,
    formValues: FormValues,
    formErrors: Object,
};
type States = {
    formValues: FormValues,
};

export default class CCalendarForm extends React.Component<Props, States> {
    static defaultProps = {
        submitTitle: 'Submit',
    };

    state = {
        formValues: defaultFormValues,
    };

    constructor(props: Props) {
        super(props);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: States) {
        return {formValues: !Tools.isEmpty(nextProps.formValues) ? nextProps.formValues : defaultFormValues};
    }

    resetForm = () => {
        window.document.getElementById(this.props.formId).reset();
        window.document.querySelector('#' + this.props.formId + ' [name=title]').focus();
    };

    setClassName = (name: string) => {
        return this.props.formErrors[name] ? 'form-control is-invalid' : 'form-control';
    };

    setErrorMessage = (name: string) => {
        return this.props.formErrors[name];
    };

    render() {
        return (
            <form id={this.props.formId} onSubmit={this.props.handleSubmit}>
                <input defaultValue={this.state.formValues.id} name="id" type="hidden" />
                <div className="form-group">
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
                        <div className="form-group">
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
                        <div className="form-group">
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

                <div className="form-group">
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
                    {this.props.children}
                    <button className="btn btn-primary">
                        <span className="oi oi-check" />&nbsp;
                        {this.props.submitTitle}
                    </button>
                </div>
            </form>
        );
    }
}
