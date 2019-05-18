import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {fetchAllPages} from '../actions';

// components
import Login from './Login';
import Loader from './Loader';

class EditPagesDriver extends Component {

    componentDidMount() {
        this.props.fetchAllPages();
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
        console.log(this.props.allPages);
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

    render() {
        return (
            <div>
                {this.gateKeeper()}
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
