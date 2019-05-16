import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchPages} from '../actions';

// components
import Login from './Login';

class EditPagesDriver extends Component {

    componentDidMount() {
        this.props.fetchPages();
    }

    // enforce login
    gateKeeper = () => {
        if (this.props.auth) {
            // user is logged in
            return (
                <>
                    {this.renderContent()}
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
        console.log(this.props.pages);
        const titlesArray = this.props.pages.map(page => {
            let pagePath = "/edit/page/" + page._id;
            return(
                <Link to={pagePath}>
                    <div>
                        {page.title}
                    </div>
                </Link>
            )
        });

        return(
            <>
                hi from document driver
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
        pages: state.pages
    })
}

export default connect(mapStateToProps, {fetchPages})(EditPagesDriver);
