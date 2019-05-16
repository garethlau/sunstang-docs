import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
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

// components
import Login from './Login';

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

class PageEditor extends Component {
	state = {
		//editorState: createEditorStateWithText(text)
		editorState: createEditorStateWithText(text),
		pageTitle: " ",
		pageId: null
	};
	componentDidMount() {
		if (this.props.location.pathname.split('/').length === 4) {
			// a page id was provided in the url
			const pageId = (this.props.location.pathname).split('/')[3];
			console.log("Page id was provided: ", pageId);
	        const path = "/api/get-page/" + pageId;
	        axios.get(path).then((res) => {
	        	console.log("res is", res);
	        	console.log("res.data.content is", res.data.content);
	            this.setState({
			        pageTitle: res.data.title,
			        authorId: res.data.authorId,
		            editorState: EditorState.push(this.state.editorState, convertFromRaw(JSON.parse(res.data.content)), 'change-block-data'),
		            pageId: res.data._id
		        })
	        })
		}
		else {
			// new page
			axios.get('/api/current-user').then((res) => {
				console.log("res is", res);
				const authorId = res.data._id;
				console.log("Author ID is: ", authorId);
				this.setState({
					authorId: authorId,
				})
			})
		}

	}
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
	onTitleChange = (event) => {
		this.setState({pageTitle: event.target.value})
	};
	savePage = () => {
		// logic for saving
		let pageTitle = this.state.pageTitle;
		console.log("Page title is", pageTitle);
		let JsonPageContent = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
		let page = {
			title: pageTitle,
			blocks: JsonPageContent
		};
		console.log("Page is: ", page);
		// add a .then() here to notify that the page has been saved
		// or redirect
		let path;
		if (this.state.pageId === null) {
			// no page id, this is a new page
			path = "/api/update-page";
		}
		else {
			// page already exists
			// todo
			// this route is showing up as localhost:3000/api/update-page
			// 413 error, payload to large
			path = "/api/update-page/" + this.state.pageId;
		}
		axios.post(path, page);

	};
	// enforce login
	gateKeeper = () => {
		if (this.props.auth) {
			return (
				<>
					{this.renderContent()}
				</>
			)
		}
		else {
			return (
				<Login/>
			)
		}
	};

	renderContent = () => {
		return(
			<div className={editorStyles.editorContainer}>
				<input type={"text"} placeholder={"Page Title"} value={this.state.pageTitle} onChange={this.onTitleChange}/>
				<div onClick={this.focus} className={editorStyles.editor}>
					<Editor
						editorState={this.state.editorState}
						onChange={this.onChange}
						plugins={plugins}
						ref={(element) => {this.editor = element}}
					/>
				</div>
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
				<input type="file" name="file" onChange={this.fileHandler}/>
				<button onClick={this.savePage}>Save</button>
			</div>
		);
	}

	render() {
		return (
			<div>
				{this.gateKeeper()}
			</div>
		)
	}
}
function mapStateToProps(state) {
	return ({
		auth: state.auth
	})
}
export default connect(mapStateToProps)(PageEditor);