import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

// import draft plugins
import { AtomicBlockUtils, convertFromRaw, convertToRaw, EditorState, RichUtils } from "draft-js";
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
import Header from './Header';
import PopupBanner from './PopupBanner';
import FileDropZone from './FileDropZone';

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
const text = 'Edit me!';

class PageEditor extends Component {
	_isMounted = false;     // prevent the setting of state when the component is not mounted
	state = {
		editorState: createEditorStateWithText(text),
		pageTitle: "",
		pageId: null,
        isLoaded: false,
        filenames: [],  // filenames for this page
		isDisconnected: false
	};
	componentDidMount() {
		this._isMounted = true;
		if (this.props.location.pathname.split('/').length === 4) {
			// a page id was provided in the url
			const pageId = (this.props.location.pathname).split('/')[3];
			console.log("Page id was provided: ", pageId);
	        const path = "/api/pages/page/" + pageId;
	        axios.get(path).then((res) => {
	        	console.log("res is", res);
	        	console.log("res.data.content is", res.data.content);
	        	if (this._isMounted) {      // only set state if component is mounted
			        this.setState({
				        pageTitle: res.data.title,
				        authorId: res.data.authorId,
				        editorState: EditorState.push(this.state.editorState, convertFromRaw(JSON.parse(res.data.content)), 'change-block-data'),
                        pageId: res.data._id,
                        filenames: res.data.files,
						isLoaded: true,
			        });
				}
				// console.log("state.editorstate", this.state.editorState);
			})
		}
		else {
			// new page
			axios.get('/api/user/current-user').then((res) => {
				console.log("res is", res);
				const authorId = res.data._id;
				console.log("Author ID is: ", authorId);
				if (this._isMounted) {
					this.setState({
						authorId: authorId,
						isLoaded: true,
					})
				}
            })
		}
		this.handleConnectionChange();	// check the connection once on load
		// subscribe to connection change events
		window.addEventListener('online', this.handleConnectionChange);
		window.addEventListener('offline', this.handleConnectionChange);
	}

    handleConnectionChange = () => {
        const condition = navigator.onLine ? 'online' : 'offline';
        if (condition === "online") {
            this.setState({
                isDisconnected: false,
                showConnectionPopup: true
            });
            setTimeout(() => {
                this.setState({
                    showConnectionPopup: false
                })
            }, 3000)
        }   
        if (condition === "offline") {
            this.setState({
                isDisconnected: true,
                showConnectionPopup: true,
            })
            setTimeout(() => {
                this.setState({
                    showConnectionPopup: false
                }, 3000);
            })
        } 
	}
	
	componentWillUnmount() {
		this._isMounted = false;
	}
	handleKeyCommand = (command) => {
		const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
		if (newState) {
			this.onChange(newState);
			return "handled";
		}
		else {
			return "not-handled"
		}
	}
	onChange = (editorState) => {	// handle editor state changes
		if (this._isMounted) {
			this.setState({editorState})
		}
	};
	focus = () => {
		this.editor.focus();
	};
	fileHandler = (event) => {
        let file = event.target.files[0];
        // check if an image needs to be uppploaded
        if (file == null || file === undefined ) {
            return;
        }
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
        
        // we have a page id
        if (pageId !== null) {
            path = "/api/pages/page/" + pageId;
        }
        else {
            path = "/api/pages/page"
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
		let path = "/api/pages/" + pageId;
		axios.delete(path).then(res => {
			console.log("page deleted, response is ", res);
			this.props.history.push('/edit');
		}).catch(err => {
			// todo should probably have an alert message
			console.log("err", err);
		})
	}

	blockStyle = (contentBlock) => {
		const type = contentBlock.getType();
		if (type === 'blockquote') {
			return 'blockQuoteStyle'
		}
		else if (type === 'code-block') {
			return 'codeBlockStyle'
		}
	}

	renderPopup = () => {
        if (this.state.showConnectionPopup) {
            if (!this.state.isDisconnected) {
                return (
                    <PopupBanner message={"You're connection looks good."} status={"success"}/>
                )
            }
            else {
                return (
                    <PopupBanner message={"Looks like there's a problem with your connection."} status={"fail"}/>
                )
            }
        }
    }
	renderContent = () => {
		if (this.state.isLoaded) {
			return(
				<div className={editorStyles.editorContainer}>
					<div onClick={this.focus} className={`${editorStyles.editor} ${editorStyles.scroll}`}>
                        <div className={editorStyles.titleContainer}>
                            <input type={"text"} placeholder={"Page Title"} value={this.state.pageTitle} onChange={this.onTitleChange} className={`${editorStyles.title} ${editorStyles.editTitle}`}/>
                        </div>
						<Editor
							editorState={this.state.editorState}
							onChange={this.onChange}
							plugins={plugins}
							ref={(element) => {this.editor = element}}
							blockStlyeFn={this.blockStyle}
							handleKeyCommand={this.handleKeyCommand}
						/>
                        <AlignmentTool/>
					</div>

                    <div className={editorStyles.toolbarContainer}>
                        <div className={editorStyles.fileZone}>
                            <FileDropZone pageId={this.state.pageId} filenames={this.state.filenames}/>
                        </div>
                        <div className={editorStyles.toolbar}>
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
                            <div className={editorStyles.uploadBtnWrapper}>
                                    <button class={editorStyles.uploadBtn}>Upload an Image</button>
                                    <input type="file" name="file" accept="image" onChange={this.fileHandler}/>
                            </div>
                            <button className={editorStyles.commitBtn} onClick={this.savePage}>Save</button>
                            <button className={editorStyles.commitBtn} style={{float: "right"}} onClick={this.deletePage}>Delete this page</button>
                        </div>

                    </div>


					
				</div>
			);
		}
		else {
			return (
				<div>
					<Loader/>
				</div>
			)
		}
	};

	render() {
		return (
			<div>
				{this.renderPopup()}
				{this.renderContent()}
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