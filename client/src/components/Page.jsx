import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchPage} from '../actions';

class Page extends Component {

    componentDidMount() {
        const pageId = (this.props.location.pathname).split('/')[2];
        console.log(pageId);
        this.props.fetchPage(pageId);
        console.log(this.props.pages);

    }

    render() {

        const {title, content} = this.props.pages
        console.log(content);
        return(
            <div>
                {title}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({pages: state.pages})
}

export default connect(mapStateToProps, {fetchPage})(Page);
