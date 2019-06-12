import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import axios from 'axios';

import {fetchAllPages} from '../actions';

// components
import Login from './Login';
import Loader from './Loader';
import PageList from './PageList';
import Header from './Header';

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

    renderPageList = () => {
        // is the data loaded?
        if (this.state.isLoaded) {
            return (
                <>
                    <PageList pages={this.state.pages}/>
                </>
            )
        }
        else {
            return (
                <div>
                    <Loader paddingTop={150}/>
                </div>
            )
        }     
    }

    render() {
        return (
            <div>
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
