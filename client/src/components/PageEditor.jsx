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
import Loader from './Loader';

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
	_isMounted = false;     // prevent the setting of state when the component is not mounted
	state = {
		//editorState: createEditorStateWithText(text)
		editorState: createEditorStateWithText(text),
		pageTitle: " ",
		pageId: null
	};
	componentDidMount() {
		this._isMounted = true;
		if (this.props.location.pathname.split('/').length === 4) {
			// a page id was provided in the url
			const pageId = (this.props.location.pathname).split('/')[3];
			console.log("Page id was provided: ", pageId);
	        const path = "/api/page?pageId=" + pageId;
	        axios.get(path).then((res) => {
	        	console.log("res is", res);
	        	console.log("res.data.content is", res.data.content);
	        	if (this._isMounted) {      // only set state if component is mounted
			        this.setState({
				        pageTitle: res.data.title,
				        authorId: res.data.authorId,
				        editorState: EditorState.push(this.state.editorState, convertFromRaw(JSON.parse(res.data.content)), 'change-block-data'),
				        pageId: res.data._id
			        })
				}
				// DELETE THIS
				console.log("state.editorstate", this.state.editorState);
			})

		}
		else {
			// new page
			axios.get('/api/current-user').then((res) => {
				console.log("res is", res);
				const authorId = res.data._id;
				console.log("Author ID is: ", authorId);
				if (this._isMounted) {
					this.setState({
						authorId: authorId,
					})
				}

			})
		}

	}
	componentWillUnmount() {
		this._isMounted = false;
	}

	onChange = (editorState) => {
		if (this._isMounted) {
			this.setState({editorState})
		}
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
		    if (this._isMounted) {
                this.setState({editorState: newEditorState});
		    }
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
		if (this._isMounted) {
			this.setState({pageTitle: event.target.value})
		}
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
		console.log("Page id is ", this.state.pageId);
		// add a .then() here to notify that the page has been saved
		// or redirect
		let pageId = this.state.pageId;
		let path;
		if (pageId !== null) {
			// no page id, this is a new page
			path = "/api/page?pageId=" + pageId;
		}
		else {
			// page already exists
			path = "/api/page"
		}
		axios.post(path, page).then(res => {
			console.log("res after axios.post", res);
			this.props.history.push('/edit');
		}).catch(err => {
			console.log("err", err);
		});
	};

	deletePage = () => {
		const pageId = this.state.pageId;
		let path = '/api/page?pageId=' + pageId;
		axios.delete(path).then(res => {
			console.log("page deleted, response is ", res);
			this.props.history.push('/edit');
		}).catch(err => {
			// todo should probably have an alert message
			console.log("err", err);
		})
	}

	// enforce login
	gateKeeper = () => {
        if (this.props.auth) {
            // user is logged in
            return (
                <>
                    {this.renderContent()}
                </>
            )
        }
        else if (this.props.auth === null) {
            // not loaded
            return (
                <>
                    <Loader/>
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
				<div className={editorStyles.titleContainer}>
					<input type={"text"} placeholder={"Page Title"} value={this.state.pageTitle} onChange={this.onTitleChange} className={`${editorStyles.title} ${editorStyles.editTitle}`}/>
				</div>
				<div onClick={this.focus} className={`${editorStyles.editor} ${editorStyles.scroll}`}>
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
				<button onClick={this.deletePage}>Delete this page</button>
			</div>
		);
	};

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