import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

// import actions
import {fetchPage} from '../actions';

// import components
import Loader from './Loader';
import Page from './Page';

class PageDriver extends Component {
    state = {
        isLoaded: false
    };

    componentDidMount() {
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
	                    <button onClick={() => {this.props.fetchPage(pageId)}}>
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

	render() {
        return(
            <div>
                <Page/>
	            {this.renderPageTitles()}
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
