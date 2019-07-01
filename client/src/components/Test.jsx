// testing component
import React from 'react';
import {fetchPage} from '../actions';
import {connect} from 'react-redux';


class Test extends React.Component {
    componentDidMount() {
        this.props.fetchPage("");
    }
    render() {
        
        return (
            <></>
        )
    }
}
function mapStateToProps(state) {
    return ({
        page: state.page
    })
}
export default connect(mapStateToProps, {fetchPage})(Test);