import React, {Component, Suspense} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

// import actions
import {fetchPage} from '../actions';


// import styling
import pageViewerStyles from '../styles/pageViewerStyles.module.css';
import ReadOnlyEditor from './ReadOnlyEditor';

// import components
import Loader from './Loader';
import Header from './Header';  // not being used
const PageNav = React.lazy(() => import('./PageNav'));  // lazy import

class PageDriver extends Component {
    state = {
        isLoaded: false
    };

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
        if (this.state.isLoaded) {
            // got the page titles
            return (
                <div class={pageViewerStyles.navContainer}>
                    <h1>Pages</h1>
                    <PageNav pages={this.state.pages}/>
                </div>
            )
        }
        else {
            return (
                <Loader size={40}/>
            )
        }
    };

    renderEditor = () => {
        if (this.props.page.content === undefined) {
            return (
                <div style={{width: "65%"}}>
                    <Loader/>
                </div>
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
        return(
            <div>
                <div className={pageViewerStyles.viewerContainer}>
                    <div className={pageViewerStyles.pageContainer} >
                        {this.renderEditor()}
                    </div>
                    <div className={pageViewerStyles.titlesContainer}>
                        <Suspense fallback={<Loader/>}>
                            {this.renderPageNav()}
                        </Suspense>
                    </div>
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
