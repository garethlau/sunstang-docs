import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchUser} from '../actions';


class Header extends Component {
    render() {
        return(
            <>
                Header
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, {fetchUser})(Header);
