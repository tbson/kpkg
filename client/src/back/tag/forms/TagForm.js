// @flow
import * as React from 'react';
import Tools from 'src/utils/helpers/Tools';

type formData = {
    id: ?number,
    title: ?string,
};
type Props = {
    handleSubmit: Function,
    children?: React.Node,
    formId: string,
    submitTitle: string,
    formData: formData,
    errorMessages: Object,
};
type States = {
    formData: formData,
};

export default class TagForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;

    static defaultProps = {
        submitTitle: 'Submit',
    };

    state = {
        formData: this.props.formData,
    };

    constructor(props: Props) {
        super(props);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: States) {
        const defaultFormData: formData = {
            id: null,
            title: null,
        };
        return {formData: !Tools.emptyObj(nextProps.formData) ? nextProps.formData : defaultFormData};
    }

    resetForm = () => {
        window.document.getElementById(this.props.formId).reset();
        window.document.querySelector('#' + this.props.formId + ' [name=title]').focus();
    };

    setClassName = (name: string) => {
        return this.props.errorMessages[name] ? 'form-control is-invalid' : 'form-control';
    };

    setErrorMessage = (name: string) => {
        return this.props.errorMessages[name];
    };

    render() {
        return (
            <form id={this.props.formId} onSubmit={this.props.handleSubmit}>
                <input defaultValue={this.state.formData.id} name="id" type="hidden" />
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        defaultValue={this.state.formData.title}
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
