import React, {Component} from 'react';
import {Editor, EditorState, convertToRaw, RichUtils} from 'draft-js';
import BlockStyleToolbar, {getBlockStyle} from './blockStyles/BlockStyleToolbar';
import axios from 'axios';


class MyEditor extends Component {
    constructor(props) {
        super(props);
      this.state = {editorState: EditorState.createEmpty()};
  }

  toggleBlockType = (blockType) => {
      console.log("Block type is", blockType);
      this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
   };
    onChange = (editorState) => {
        this.setState({editorState});
        console.log("editor state is:", editorState);

        this.getContentStateInJSON(editorState);
    }

    componentDidMount() {
        this.setState({
            data: ""
        })
    }

    getContentStateInJSON = (editorState) => {
        const rawJson = convertToRaw( editorState.getCurrentContent() );
        const jsonStr = JSON.stringify(rawJson, null, 1);

        this.setState({ data: jsonStr });
        console.log("in get content state", convertToRaw(editorState.getCurrentContent()));

    };

    handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    onUnderlineClick = () => {
      this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    }

    onBoldClick = () => {
      this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
    }

    onItalicClick = () => {
      this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'))
    }

     handleTitle = (event) => {
         this.setState({
             title: event.target.value
         });
     };

     save = () => {
         console.log("editor state in save is:", this.state.editorState);
         let page = {
             title: this.state.title,
             data: this.state.data,
         }

         console.log("content in save", page);
         axios.post('/api/update-page', page);
     }

    render() {
        return(
            <div className="editor-container">
                <div className="button-container">
                    <div>
                    <button className="style-button" onClick={this.onUnderlineClick}>U</button>
                    </div>
                    <div>
                    <button className="style-button" onClick={this.onBoldClick}><b>B</b></button>
                    </div>
                    <div>
                    <button className="style-button" onClick={this.onItalicClick}><em>I</em></button>
                    </div>
                    <BlockStyleToolbar editorState={this.state.editorState} onToggle={this.toggleBlockType}/>
                </div>
                <div className="edit-area">
                    <input className="page-title" placeholder={"Title"} onChange={this.handleTitle}/>
                    <Editor
                      editorState={this.state.editorState}
                      handleKeyCommand={this.handleKeyCommand}
                      onChange={this.onChange}
                      blockStyleFn={getBlockStyle}
                      onTab={this.onTab}
                      ref="editor"
                      spellCheck={true}
                    />
                </div>

                <button className="btn primary" onClick={this.save}>Save</button>
              </div>
        );
    }
}

export default MyEditor;
