// @flow
import * as React from 'react';
// $FlowFixMe: do not complain about importing node_modules
import {EditorState, convertToRaw, ContentState} from 'draft-js';
// $FlowFixMe: do not complain about importing node_modules
import {Editor} from 'react-draft-wysiwyg';
// $FlowFixMe: do not complain about importing node_modules
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// $FlowFixMe: do not complain about importing node_modules
import draftToHtml from 'draftjs-to-html';
// $FlowFixMe: do not complain about importing node_modules
import htmlToDraft from 'html-to-draftjs';

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
    parent_uuid?: string,
    name: string,
    defaultValue: string,
};

type States = {
    value: string,
    editorState: Object,
};

class RichTextInput extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);

        const blocksFromHtml = htmlToDraft(this.props.defaultValue);
        const {contentBlocks, entityMap} = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);

        this.state = {
            value: '',
            editorState,
        };
    }

    onChange = (editorState: Object) => {
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const value = draftToHtml(rawContentState);
        this.setState({
            editorState,
            value,
        });
    };

    uploadImageCallBack = async (file: Blob): Promise<*> => {
        const response = {
            data: {
                link: '',
            },
        };
        if (file.type.indexOf('image/') === 0) {
            const params = {
                attachment: file,
                parent_uuid: this.props.parent_uuid,
                richtext_image: true,
            };
            const result = await Tools.apiCall(apiUrls.crud, 'POST', params);
            if (result.success) {
                response.data.link = result.data.attachment;
                return new Promise((resolve, reject) => resolve(response));
            }
            return new Promise((resolve, reject) => reject(''));
        }
        return new Promise((resolve, reject) => reject(''));
    };

    render() {
        return (
            <div style={{position: 'relative'}}>
                <input type="hidden" name={this.props.name} defaultValue={this.state.value} />
                <Editor
                    editorState={this.state.editorState}
                    onEditorStateChange={this.onChange}
                    toolbar={{
                        image: {
                            previewImage: true,
                            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg,image/webp',
                            uploadCallback: this.uploadImageCallBack,
                            alt: {present: true, mandatory: false},
                        },
                    }}
                />
            </div>
        );
    }
}

const styles = {};
export default RichTextInput;
