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

export default class StaffForm extends React.Component<Props, States> {
    static defaultProps = {};
    name = 'staff';

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
        window.document.querySelector('form[name=${this.form}]').reset();
        window.document.querySelector('form[name=${this.form}] [name=title]').focus();
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
        const {handleSubmit, children} = this.props;
        const {formValues, actionName} = this.state;
        return (
            <form name={this.name} onSubmit={handleSubmit}>
                <input defaultValue={formValues.id} name="id" id="${this.form}-id" type="hidden" />
                <div className="row">
                    <div className="col-md-3">
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
                    </div>
                    <div className="col-md-9">
                        <div className="form-group fullname-field">
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

                <div className="form-group email-field">
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

                <div className="form-group description-field">
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

                <div className="form-group image-field">
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

                <div className="form-group order-field">
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
