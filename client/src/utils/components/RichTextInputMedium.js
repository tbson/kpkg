// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {convertToRaw} from 'draft-js';
// $FlowFixMe: do not complain about importing node_modules
import {Editor, createEditorState, addNewBlock, Block, ImageSideButton} from 'medium-draft';
// $FlowFixMe: do not complain about importing node_modules
import mediumDraftExporter from 'medium-draft/lib/exporter';
// $FlowFixMe: do not complain about importing node_modules
import mediumDraftImporter from 'medium-draft/lib/importer';
// $FlowFixMe: do not complain about importing node_modules
import 'medium-draft/lib/index.css';
import Tools from '../helpers/Tools';

const rawApiUrls: Array<Object> = [
    {
        controller: 'attach',
        endpoints: {
            crud: '',
        },
    },
];

export const apiUrls = Tools.getApiUrls(rawApiUrls);

type Props = {
    parentUUID: string,
    name: string,
    defaultValue: any,
};

type States = {
    value: string,
    editorState: Object,
};

class RichTextInput extends React.Component<Props, States> {
    onChange: Function;
    sideButtons: Array<Object>;

    state = {
        value: '',
        editorState: createEditorState(convertToRaw(mediumDraftImporter(this.props.defaultValue))),
    };
    static defaultProps = {
        options: [],
        multi: false,
        delimiter: ',',
        defaultValue: '',
        parentUUID: '',
        parent: null,
    };

    constructor(props: Props) {
        super(props);
        this.onChange = editorState => {
            this.setState({
                editorState,
                value: mediumDraftExporter(editorState.getCurrentContent()),
            });
        };
        this.sideButtons = [
            {
                title: 'Image',
                component: props => {
                    return <CustomImageSideButton {...props} {...this.props} />;
                },
            },
        ];
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            value: '',
            editorState: createEditorState(convertToRaw(mediumDraftImporter(nextProps.defaultValue))),
        });
    }

    render() {
        const {editorState} = this.state;
        const toolbarConfig = {
            block: ['ordered-list-item', 'unordered-list-item', 'blockquote', 'header-three', 'todo'],
            inline: ['BOLD', 'ITALIC', 'UNDERLINE', 'hyperlink', 'HIGHLIGHT'],
        };
        return (
            <div style={{position: 'relative'}}>
                <input type="hidden" name={this.props.name} defaultValue={this.state.value} />
                <Editor
                    ref="editor"
                    placeholder="Content..."
                    editorState={editorState}
                    onChange={this.onChange}
                    sideButtons={this.sideButtons}
                />
            </div>
        );
    }
}

const styles = {};
export default RichTextInput;

class CustomImageSideButton extends ImageSideButton {
    constructor(props) {
        super(props);
    }

    async onChange(e) {
        const file = e.target.files[0];
        if (file.type.indexOf('image/') === 0) {
            const params = {
                attachment: file,
                parentUUID: this.props.parentUUID,
                richtext_image: true,
            };
            const result = await Tools.apiCall(apiUrls.crud, 'POST', params);
            if (result.success) {
                this.props.setEditorState(
                    addNewBlock(this.props.getEditorState(), Block.IMAGE, {
                        className: 'full-width',
                        src: result.data.attachment,
                    }),
                );
            }
        }
        this.props.close();
    }

    render() {
        return (
            <button className="md-sb-button md-sb-img-button" type="button" onClick={this.onClick} title="Add an Image">
                <span className="oi oi-image" style={{fontSize: 15}}></span>
                <input
                    type="file"
                    accept="image/*"
                    ref={c => {
                        this.input = c;
                    }}
                    onChange={this.onChange}
                    style={{display: 'none'}}
                />
            </button>
        );
    }
}
