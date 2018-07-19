// @flow
import * as React from 'react';
import RichTextInputMedium from 'src/utils/components/RichTextInputMedium';
import SelectInput from 'src/utils/components/SelectInput';
import Tools from 'src/utils/helpers/Tools';
import type {FormValues} from '../_data';
import {defaultFormValues} from '../_data';
import type {DropdownItemType} from 'src/utils/types/CommonTypes';

type Props = {
    handleSubmit: Function,
    children?: React.Node,
    parent_uuid?: string,
    formId: string,
    submitTitle: string,
    formValues: FormValues,
    tagSource?: Array<DropdownItemType>,
    formErrors: Object,
};
type States = {
    formValues: FormValues,
};

export default class ArticleForm extends React.Component<Props, States> {
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
        const formValues = !Tools.isEmpty(nextProps.formValues) ? nextProps.formValues : defaultFormValues;
        return {formValues};
    }

    componentDidUpdate(prevProps: Props, prevState: States) {
        this.resetForm();
    }

    resetForm = () => {
        const {formId} = this.props;
        const firstInputSelector = ['#', formId, ' [name=title]'].join('');
        window.document.getElementById(formId).reset();
        window.document.querySelector(firstInputSelector).focus();
    };

    setClassName = (name: string) => {
        return this.props.formErrors[name] ? 'form-control is-invalid' : 'form-control';
    };

    setErrorMessage = (name: string) => {
        const result = this.props.formErrors[name];
        return result;
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

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <RichTextInputMedium
                        parent_uuid={this.props.parent_uuid}
                        defaultValue={this.state.formValues.description}
                        name="description"
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('description')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <RichTextInputMedium
                        parent_uuid={this.props.parent_uuid}
                        defaultValue={this.state.formValues.content}
                        name="content"
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('content')}</div>
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

                <div className="form-group">
                    <label htmlFor="groups">Tags</label>
                    <SelectInput
                        multi={true}
                        name="tags"
                        options={this.props.tagSource}
                        defaultValue={this.state.formValues.tags}
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('groups')}</div>
                </div>

                <div className="form-check">
                    <input
                        id="use_slide"
                        name="use_slide"
                        type="checkbox"
                        defaultChecked={this.state.formValues.use_slide}
                        className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor="use_slide">
                        Use slide
                    </label>
                </div>

                <div className="form-check">
                    <input
                        id="thumbnail_in_content"
                        name="thumbnail_in_content"
                        type="checkbox"
                        defaultChecked={this.state.formValues.thumbnail_in_content}
                        className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor="thumbnail_in_content">
                        Thumbnail in content
                    </label>
                </div>

                <div className="form-check">
                    <input
                        id="pin"
                        name="pin"
                        type="checkbox"
                        defaultChecked={this.state.formValues.pin}
                        className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor="pin">
                        Pin
                    </label>
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
