import React, {Component} from 'react';

// import draft plugins
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import {HeadlineOneButton, HeadlineTwoButton, BlockquoteButton, CodeBlockButton} from 'draft-js-buttons';

// styles
import editorStyles from '../styles/editorStyles.module.css';
import buttonStyles from '../styles/buttonStyles.module.css';
import toolbarStyles from '../styles/toolbarStyles.module.css';
import blockTypeSelectStyles from '../styles/blockTypeSelectStyles.module.css';

// create instance of sidebar toolbar plugin
const sideToolbarPlugin = createSideToolbarPlugin({
	position: 'right', // default is left
	theme: {buttonStyles: buttonStyles, toolbarStyles: toolbarStyles, blockTypeSelectStyles: blockTypeSelectStyles}
});
const { SideToolbar } = sideToolbarPlugin;
const plugins = [sideToolbarPlugin];

// the default text that is shown
const text = 'Once you click into the text field the sidebar plugin will show up …';

class PageCreator extends Component {
	state = {
		editorState: createEditorStateWithText(text)
	};
	onChange = (editorState) => {
		this.setState({editorState})
	};
	focus = () => {
		this.editor.focus();
	};
	render() {
		return(
			<div onClick={this.focus} className={editorStyles.editor}>
				<Editor
					editorState={this.state.editorState}
					onChange={this.onChange}
					plugins={plugins}
					ref={(element) => {this.editor = element}}
				/>
				<SideToolbar>
					{(externalProps) => (
						<div>
			                <HeadlineOneButton {...externalProps} />
						    <HeadlineTwoButton {...externalProps} />
						    <BlockquoteButton {...externalProps} />
						    <CodeBlockButton {...externalProps} />
						</div>
					)}
				</SideToolbar>
			</div>
		);
	}
}

export default PageCreator;