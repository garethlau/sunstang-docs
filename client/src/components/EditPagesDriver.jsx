import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import axios from 'axios';

import {fetchAllPages} from '../actions';

// components
import Login from './Login';
import Loader from './Loader';
import PageList from './PageList';

class EditPagesDriver extends Component {

    state = {
        isLoaded: false
    }

    componentDidMount() {
        axios.get('/api/pages').then(res => {
            console.log("res in editpages driver", res);
            const pages = res.data;     // array of pages
            this.setState({
                pages: pages,
                isLoaded: true,
            });
        })
    }

    // enforce login
    // todo see if we can make this a reusable thing
    gateKeeper = () => {
        if (this.props.auth) {
            // user is logged in
            return (
                <>
                    {this.renderContent()}
                </>
            )
        }
        else if (this.props.auth === null) {
            // not loaded
            return (
                <>
                    <Loader/>
                </>
            )
        }
        else {
            return (
                <Login/>
            )
        }
    };

    renderContent = () => {

        const titlesArray = this.props.allPages.map(page => {
            let pagePath = "/edit/page/" + page._id;
            return(
                <Link key={page._id} to={pagePath}>
                    <div>
                        {page.title}
                    </div>
                </Link>
            )
        });



        return(
            <>
                <h1>Editor Mode</h1>
                {titlesArray}
                <Link to="/edit/page">Create new page</Link>
            </>
        )
    };

    renderPageList = () => {
        // is the data loaded?
        if (this.state.isLoaded) {
            return (
                <PageList pages={this.state.pages}/>
            )
        }
        else {
            return (
                <div>
                    <Loader/>
                </div>
            )
        }     
    }

    render() {
        return (
            <div>
                {this.gateKeeper()}
                {this.renderPageList()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    // this component has access to the global piece of state that includes auth
    return({
        auth: state.auth,
        allPages: state.allPages
    })
}

export default connect(mapStateToProps, {fetchAllPages})(EditPagesDriver);
