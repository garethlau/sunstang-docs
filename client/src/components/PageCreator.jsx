import React, {Component} from 'react';

// import draft plugins
import { AtomicBlockUtils, convertFromRaw, convertToRaw, EditorState } from "draft-js";
import Editor, { createEditorStateWithText, composeDecorators } from 'draft-js-plugins-editor';
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
//import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import {
	ItalicButton,
	BoldButton,
	UnderlineButton,
	CodeButton,
	HeadlineOneButton,
	HeadlineTwoButton,
	HeadlineThreeButton,
	UnorderedListButton,
	OrderedListButton,
	BlockquoteButton,
	CodeBlockButton,
} from 'draft-js-buttons';

import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';

// styles
import editorStyles from '../styles/editorStyles.module.css';
import buttonStyles from '../styles/buttonStyles.module.css';
import toolbarStyles from '../styles/toolbarStyles.module.css';
import 'draft-js-alignment-plugin/lib/plugin.css';

// plugin config
const toolbarPlugin = createToolbarPlugin({
	theme: {buttonStyles, toolbarStyles}
});

const {Toolbar} = toolbarPlugin;
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
	toolbarPlugin,
	blockDndPlugin,
	focusPlugin,
	alignmentPlugin,
	resizeablePlugin,
	imagePlugin
];
// the default text that is shown
const text = 'Once you click into the text field the sidebar plugin will show up …';
const initialState = {
    "entityMap": {
        "0": {
            "type": "IMAGE",
            "mutability": "IMMUTABLE",
            "data": {
                "src": "/rooster.jpg"
            }
        }
    },
    "blocks": [{
        "key": "9gm3s",
        "text": "You can have images in your text field. This is a very rudimentary example, but you can enhance the image plugin with resizing, focus or alignment plugins.",
        "type": "unstyled",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
    }, {
        "key": "ov7r",
        "text": " ",
        "type": "atomic",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [{
            "offset": 0,
            "length": 1,
            "key": 0
        }],
        "data": {}
    }, {
        "key": "e23a8",
        "text": "See advanced examples further down …",
        "type": "unstyled",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
    }]
};
class PageCreator extends Component {
	state = {
		//editorState: createEditorStateWithText(text)
		editorState: EditorState.createWithContent(convertFromRaw(initialState))
	};
	onChange = (editorState) => {
		this.setState({editorState})
	};
	focus = () => {
		this.editor.focus();
	};
	fileHandler = (event) => {
		let file = event.target.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			console.log(reader.result);
			let base64 = reader.result;
		    const newEditorState = this.insertImage(this.state.editorState, base64);
			this.setState({editorState: newEditorState});
		};
		reader.onerror = (error) => {
			console.log("Error reading the file: ", error);
		};
	};
	insertImage = (editorState, base64) => {
		const contentState = editorState.getCurrentContent();
		const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', {src: base64});
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
		const newEditorState = EditorState.set(editorState, {
			currentContent: contentStateWithEntity
		});
		return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
	};
	getCurrentContent = () => {
		// logic for saving
		let raw = convertToRaw(this.state.editorState.getCurrentContent());
		console.log(raw);
	}
	render() {
		return(
			<div onClick={this.focus} className={editorStyles.editor}>
				<Editor
					editorState={this.state.editorState}
					onChange={this.onChange}
					plugins={plugins}
					ref={(element) => {this.editor = element}}
				/>
				<AlignmentTool/>
				<Toolbar>
					{
						// may be use React.Fragment instead of div to improve perfomance after React 16
						(externalProps) => (
							<div>
								<BoldButton {...externalProps} />
								<ItalicButton {...externalProps} />
								<UnderlineButton {...externalProps} />
								<HeadlineOneButton {...externalProps} />
								<UnorderedListButton {...externalProps} />
								<OrderedListButton {...externalProps} />
								<BlockquoteButton {...externalProps} />
								<CodeBlockButton {...externalProps} />
							</div>
						)
					}
				</Toolbar>
				<input type="file" name="file" onChange={this.fileHandler} data-multiple-caption="some message"/>
				<button value="nice" onClick={this.getCurrentContent}/>
			</div>
		);
	}
}

export default PageCreator;