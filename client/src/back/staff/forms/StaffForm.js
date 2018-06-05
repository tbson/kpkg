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

export default class StaffForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;
    renderPreview: Function;

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

    renderPreview = () => {
        if (!this.state.formValues.image) return null;
        return (
            <div className="row">
                <div className="col col-lg-4">
                    <img src={this.state.formValues.image} width="100%" />
                </div>
            </div>
        );
    };

    render() {
        return (
            <form id={this.props.formId} onSubmit={this.props.handleSubmit}>
                <input defaultValue={this.state.formValues.id} name="id" type="hidden" />
                <div className="row">
                    <div className="col-md-3">
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
                    </div>
                    <div className="col-md-9">
                        <div className="form-group">
                            <label htmlFor="fullname">Fullname</label>
                            <input
                                defaultValue={this.state.formValues.fullname}
                                id="fullname"
                                name="fullname"
                                type="text"
                                className={this.setClassName('fullname')}
                                required
                                placeholder="Fullname..."
                            />
                            <div className="invalid-feedback">{this.setErrorMessage('fullname')}</div>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        defaultValue={this.state.formValues.email}
                        id="email"
                        name="email"
                        type="email"
                        className={this.setClassName('email')}
                        required
                        placeholder="Email..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('email')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        defaultValue={this.state.formValues.description}
                        id="description"
                        name="description"
                        type="text"
                        className={this.setClassName('description')}
                        placeholder="Description..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('description')}</div>
                </div>

                <div className="form-group">
                    {this.renderPreview()}
                    <label htmlFor="image" style={{display: this.state.formValues.image ? 'none' : 'block'}}>
                        Image
                    </label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        className={this.setClassName('image')}
                        placeholder="Image..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('image')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="order">Order</label>
                    <input
                        defaultValue={this.state.formValues.order}
                        id="order"
                        name="order"
                        type="number"
                        className={this.setClassName('order')}
                        placeholder="Order..."
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('order')}</div>
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
