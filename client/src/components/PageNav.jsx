import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchPage} from '../actions';
import pageViewerStyles from '../styles/pageViewerStyles.module.css';

class PageNav extends Component {

    switchPage = (pageId) => {
        
    };

    render() {
        let renderedTitles = [];
        return this.props.pages.map((page) => {
            // let path = '/docs/page/' + page._id;
            const pageId = page._id;
            if (!renderedTitles.includes(page.category) && page.category !== undefined) {  // the title of it hasnt been rendered yet, so we need to render it on the first time
                renderedTitles.push(page.category);

                return (
                    <div key={pageId}>
                    <div>{page.category.toUpperCase()}</div>
                    <div>
                        <button className={pageViewerStyles.titlesButton} onClick={() => {this.props.fetchPage(pageId)}}>
                            <p className={pageViewerStyles.pageTitles}>{page.title}</p>
                        </button>
                    </div>
                    </div>
                )
            }
            else {
                return (
                    <div key={pageId}>
                        <button className={pageViewerStyles.titlesButton} onClick={() => {this.props.fetchPage(pageId)}}>
                            <p className={pageViewerStyles.pageTitles}>{page.title}</p>
                        </button>
                    </div>
                )
            }
        })
    }
}


export default connect(null, {fetchPage})(PageNav);