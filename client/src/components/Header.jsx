import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchUser} from '../actions';

const headerStyles = {
    height: "50px",
    backgroundColor: "#373737",
    color: "white",
};
const searchStyles = {
    border: "2px solid black",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "3px",
    paddingBottom: "3px",
    fontSize: "16px",
}
class Header extends Component {
    render() {
        return(
            <nav style={headerStyles}>
                <ul style={{listStyleType: "none", margin: "0"}}>
                    <li style={{float: "left", paddingTop: "13px"}}>LOGO</li>
                    <li style={{float: "right", paddingTop: "13px", marginRight: "20px"}}>LOGO</li>
                    <li style={{float: "right", paddingTop: "13px", marginRight: "20px"}}>LOGO</li>

                    <li style={{float: "right", padding: "10px", marginRight: "20px"}}>
                        <input type="text" placeholder="Search" style={searchStyles}></input>
                    </li>

                </ul>
            </nav>
        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, {fetchUser})(Header);
