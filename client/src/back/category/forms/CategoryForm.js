// @flow
import * as React from 'react';
import SelectInput from 'src/utils/components/SelectInput';

type Props = {
    handleSubmit: Function,
    children?: React.Node,
    formId: string,
    submitTitle: string,
    defaultValues: {
        id: ?number,
        title: ?string,
        image_ratio: ?number,
        width_ratio: ?number,
        type: ?string,
        single: boolean,
    },
    errorMessages: Object,
    typeList: Array<Object>,
};
type States = {};

export default class CategoryForm extends React.Component<Props, States> {
    resetForm: Function;
    setClassName: Function;
    setErrorMessage: Function;

    static defaultProps = {
        submitTitle: 'Submit',
        defaultValues: {
            id: null,
            title: null,
            image_ratio: null,
            width_ratio: 100,
            type: null,
            single: false,
        },
        errorMessages: {},
        typeList: [],
    };

    state = {};

    constructor(props: Props) {
        super(props);
    }

    resetForm = () => {
        window.document.getElementById(this.props.formId).reset();
        window.document.querySelector('#' + this.props.formId + ' [name=uid]').focus();
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
                <input defaultValue={this.props.defaultValues.id} name="id" type="hidden" />
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        defaultValue={this.props.defaultValues.title}
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
                    <label htmlFor="image_ratio">Image ratio</label>
                    <input
                        defaultValue={this.props.defaultValues.image_ratio}
                        id="image_ratio"
                        name="image_ratio"
                        type="number"
                        step="0.001"
                        className={this.setClassName('image_ratio')}
                        placeholder="Image ratio (width / height). e.g: 1.618"
                    />
                    <div className="invalid-feedback">{this.setErrorMessage('image_ratio')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="width_ratio">Width ratio</label>
                    <div className="input-group">
                        <input
                            defaultValue={this.props.defaultValues.width_ratio}
                            id="width_ratio"
                            name="width_ratio"
                            type="number"
                            step="1"
                            min="1"
                            max="100"
                            className={this.setClassName('width_ratio')}
                            placeholder="1 to 100"
                        />
                        <div className="input-group-append">
                            <span className="input-group-text" id="basic-addon2">
                                %
                            </span>
                        </div>
                    </div>
                    <div className="invalid-feedback">{this.setErrorMessage('width_ratio')}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <SelectInput
                        defaultValue={this.props.defaultValues.type}
                        name="type"
                        options={this.props.typeList}
                    />
                    <input type="hidden" />
                    <div className="invalid-feedback">{this.setErrorMessage('type')}</div>
                </div>

                <div className="form-check">
                    <input
                        id="single"
                        name="single"
                        type="checkbox"
                        defaultChecked={this.props.defaultValues.single}
                        className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor="single">
                        Single
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
