import React, {Component, Suspense} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

// import actions
import {fetchPage} from '../actions';


// import styling
import pageViewerStyles from '../styles/pageViewerStyles.module.css';

// import components
import Loader from './Loader';
import Header from './Header';  // not being used
import PageNav from './PageNav';
import ReadOnlyEditor from './ReadOnlyEditor';

class PageDriver extends Component {
    state = {
        isLoaded: false
    }

    componentDidMount() {
        this.props.fetchPage("5ce28e5ba59c404a0cf2bd6c");
        // load the links to the buttons
        axios.get('/api/pages').then((res) => {
            console.log(res);
            this.setState({
                isLoaded: true,
                pages: res.data
            });
        })
    }

    renderPageNav = () => {
        if (!this.state.isLoaded) {
            return (
                <Loader size={40}/>
            )
        }
        else {
            // got the page titles
            return (
                <PageNav pages={this.state.pages}/>
            )
        }
    };

    renderEditor = () => {
        if (this.props.page.content === undefined) {
            return (
                <Loader/>
            )
        }
        else {
            const {title, content, authorId} = this.props.page;
            return (
                <ReadOnlyEditor title={title} authorId={authorId} storedState={content}/>
            )
        }
    }

	render() {
        console.log("=== RECEIVED AS PROPS ===");
        console.log(this.props);

        return (
            <div className={pageViewerStyles.container}>
                {this.renderEditor()}
                {this.renderPageNav()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return ({
        page: state.page
    })
}
export default connect(mapStateToProps, {fetchPage})(PageDriver);
