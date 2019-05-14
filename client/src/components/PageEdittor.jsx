import React, {Component} from 'react';
import {Editor, EditorState, convertFromRaw, convertToRaw, RichUtils} from 'draft-js';
import {connect} from 'react-redux';
import {fetchPage} from '../actions';
import axios from 'axios';

import BlockStyleToolbar, {getBlockStyle} from './blockStyles/BlockStyleToolbar';


class PageEdittor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            isLoaded: false
        }
    }
    componentDidMount() {
        this.setState({
            data: "helloooooo"
        })
    }

    onChange = (editorState) => {
        console.log("in th onchange", editorState)
        this.setState({
            editorState
        });
        this.getContentStateInJSON(editorState);

    }
    toggleBlockType = (blockType) => {
        console.log("Block type is", blockType);
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
     };
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
         let page = {
             title: this.state.title,
             data: this.state.data,
         }

         console.log("content in save", page);
         const path = "/api/update-page?pageId=" + this.state.pageId;
         axios.post(path, page);
     }

    componentDidMount() {
        const pageId = (this.props.location.pathname).split('/')[3];
        console.log(pageId);
        const path = "/api/get-page/" + pageId;
        axios.get(path).then(res => {
            console.log(res.data.content);
            //const rawJson = JSON.parse(res.data.content);

            //const savedEditorState = convertFromRaw(res.data.content);
            this.setState({
                editorState: EditorState.push(this.state.editorState, convertFromRaw(JSON.parse(res.data.content))),
                title: res.data.title,
                pageId: res.data._id,
                isLoaded: true
            })
        })
    }

    render() {
        if (!this.state.isLoaded) {
            return(
                <div>
                    Loading...
                </div>
            )
        }
        else {
            const title = this.state.title;
            return(
                <div className="editor-container">
                    <input className="page-title" value={title} onChange={this.handleTitle}/>
                    <div className="button-container">
                        <button className="style-button" onClick={this.onUnderlineClick}>U</button>
                        <button className="style-button" onClick={this.onBoldClick}><b>B</b></button>
                        <button className="style-button" onClick={this.onItalicClick}><em>I</em></button>
                        <BlockStyleToolbar editorState={this.state.editorState} onToggle={this.toggleBlockType}/>
                    </div>
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
                  </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return({pages: state.pages});
}

export default connect(mapStateToProps, {fetchPage})(PageEdittor);