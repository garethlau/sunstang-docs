// testing component
import React from 'react';
import {fetchPage} from '../actions';
import {connect} from 'react-redux';

import FileDropZone from './FileDropZone';

class Test extends React.Component {
    componentDidMount() {
        this.props.fetchPage("");
    }
    render() {
        
        return (
            <div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return ({
        page: state.page
    })
}
export default connect(mapStateToProps, {fetchPage})(Test);