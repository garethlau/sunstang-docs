import React, {Component} from 'react';
import {Editor, EditorState, convertToRaw, RichUtils} from 'draft-js';
import BlockStyleToolbar, {getBlockStyle} from './blockStyles/BlockStyleToolbar';
import axios from 'axios';

class MyEditor extends Component {
    constructor(props) {
      super(props);
      this.state = {editorState: EditorState.createEmpty()};
      this.onChange = (editorState) => {
          this.getContentStateInJSON();
          this.setState({editorState});
          console.log("editor state is:", editorState);
      }
    }

    componentDidMount() {
        this.setState({
            data: "helloooooo"
        })
    }

    getContentStateInJSON = () => {
        const rawJson = convertToRaw( this.state.editorState.getCurrentContent() );
        const jsonStr = JSON.stringify(rawJson, null, 1);

        this.setState({ data: jsonStr });
        console.log(this.state.data);

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

    toggleBlockType = (blockType) => {
        console.log("Block type is", blockType);
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
        this.onChange();
     };

     handleTitle = (event) => {
         this.setState({
             title: event.target.value
         });
     };

     save = () => {
         let page = {
             title: this.state.title,
             data: this.state.data,
         }

         console.log("content in save", page);
         axios.post('/api/update-page', page);
     }

    render() {
        return(
            <>
                <input placeholder={"Title"} onChange={this.handleTitle}/>
                <button onClick={this.onUnderlineClick}>U</button>
                <button onClick={this.onBoldClick}><b>B</b></button>
                <button onClick={this.onItalicClick}><em>I</em></button>
                <BlockStyleToolbar editorState={this.state.editorState} onToggle={this.toggleBlockType}/>
                <Editor
                  editorState={this.state.editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.onChange}
                  blockStyleFn={getBlockStyle}
                  onTab={this.onTab}
                  placeholder="tell me something"
                  ref="editor"
                  spellCheck={true}
                />
                <button onClick={this.save}>Save</button>
              </>
        );
    }
}

export default MyEditor;
