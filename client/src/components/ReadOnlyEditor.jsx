import React, {Component} from 'react';
import {Editor, EditorState, convertFromRaw} from 'draft-js';



class ReadOnlyEditor extends Component {
    state = {
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.storedState)))
    }
    componentWillReceiveProps (newProps) {
        this.setState({
            editorState: EditorState.push(this.state.editorState, convertFromRaw(JSON.parse(newProps.storedState)))
        })
    }
    render () {
        console.log(this.props.storedState)
        return (
            <div>
                <h1>{this.props.title}</h1>
                <Editor editorState={this.state.editorState} readOnly={true}/>
            </div>
        )
    }
}
export default ReadOnlyEditor;
