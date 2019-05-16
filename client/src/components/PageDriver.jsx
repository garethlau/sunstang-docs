import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

// import components
import Loader from './Loader';

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
            	let path = '/docs/page/' + page._id;
                return(
                    <div>
	                    <Link to={path}>
                            <p>{page.title}</p>
	                    </Link>
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
	            {this.renderPageTitles()}
            </div>
        )
    }
}


export default PageDriver;
