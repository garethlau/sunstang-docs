import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

// import actions
import {fetchPage} from '../actions';

// import components
import Loader from './Loader';

// import styling
import pageViewerStyles from '../styles/pageViewerStyles.module.css';
import ReadOnlyEditor from './ReadOnlyEditor';

class PageDriver extends Component {
    state = {
        isLoaded: false
    };

    componentDidMount() {
        const DEFAULT_PAGE_ID = '5ce16d91f4b00a4af0eb5e22';
        this.props.fetchPage(DEFAULT_PAGE_ID);
        // load the links to the buttons
        axios.get('/api/pages').then((res) => {
            console.log(res);
            this.setState({
                isLoaded: true,
                pages: res.data
            });
        })
    }

    renderPageTitles = () => {
        if (this.state.isLoaded) {
            // got the page titles
            return this.state.pages.map((page) => {
            	// let path = '/docs/page/' + page._id;
            	const pageId = page._id;
                return (
                    <div key={pageId}>
	                    <button className={pageViewerStyles.titlesButton} onClick={() => {this.props.fetchPage(pageId)}}>
                            <p>{page.title}</p>
	                    </button>
                    </div>
                )
            })
        }
        else {
            return (
                <Loader/>
            )
        }
    };

    renderEditor = () => {
        console.log("props content", this.props.page.content);
        if (this.props.page.content === undefined) {
            return (
                <div>
                    <Loader/>
                </div>
            )
        }
        else {
            const {title, content, authorId} = this.props.page;
            return (
                <div>
                    <ReadOnlyEditor title={title} authorId={authorId} storedState={content}/>
                </div>
            )
        }
    }

	render() {
        console.log(this.props.page);
        return(
            <div className={pageViewerStyles.viewerContainer}>
                <div className={pageViewerStyles.pageContainer}>
                    {this.renderEditor()}
                </div>
                <div className={pageViewerStyles.titlesContainer}>
                    Pages
                    {this.renderPageTitles()}
                </div>
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
