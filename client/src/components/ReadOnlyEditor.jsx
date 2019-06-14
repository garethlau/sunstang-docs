import React, {Component} from 'react';
import {EditorState, convertFromRaw} from 'draft-js';
import Editor, {composeDecorators } from 'draft-js-plugins-editor';

import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';

// styles
import pageStyles from '../styles/pageStyles.module.css';
import editorStyles from '../styles/editorStyles.module.css';
import 'draft-js-alignment-plugin/lib/plugin.css';

// plugin config

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;
const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({decorator: decorator});
const plugins = [
	blockDndPlugin,
	focusPlugin,
	alignmentPlugin,
	resizeablePlugin,
	imagePlugin
];

class ReadOnlyEditor extends Component {
    state = {
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.storedState)))
    }
    componentWillReceiveProps (newProps) {
        this.setState({
            editorState: EditorState.push(this.state.editorState, convertFromRaw(JSON.parse(newProps.storedState)))
        })
    }

    onChange = () => {
        // only here to stop the warning
    }

    render () {
        // console.log("props.storedState", this.props.storedState)
        // console.log("state editorstate", this.state.editorState);
        
        return (
            <div className={editorStyles.editorContainer} style={{overflow: "scroll"}}>
                <div className={editorStyles.titleContainer}>
                    <p className={editorStyles.title}>{this.props.title}</p>
                </div>
                <div className={editorStyles.editor}>
                    <Editor
                        editorState={this.state.editorState}
                        plugins={plugins}
                        onChange={this.onChange}
                        readOnly={true}
                    />
                </div>
            </div>
        )
    }
}
export default ReadOnlyEditor;
