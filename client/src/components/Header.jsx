import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchUser} from '../actions';

import headerStyles from '../styles/headerStyles.module.css';

const headerStyle = {
    height: "50px",
    backgroundColor: "#373737",
    color: "white",
};
const searchStyle = {
    border: "2px solid black",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "3px",
    paddingBottom: "3px",
    fontSize: "20px",
    borderRadius: "5px"
}
class Header extends Component {
    render() {
        return(
            <nav style={headerStyle}>
                <ul style={{listStyleType: "none", margin: "0"}}>
                    <li style={{float: "left", paddingTop: "13px"}}>LOGO</li>
                    <li style={{float: "right", paddingTop: "13px", marginRight: "20px"}}><a class={headerStyles.link} href="/api/logout">LOGOUT</a></li>
                    <li style={{float: "right", paddingTop: "13px", marginRight: "20px"}}><a class={headerStyles.link} href="https://github.com/garethlau/sunstang-website">GITHUB</a></li>
                    <li style={{float: "right", paddingTop: "13px", marginRight: "20px"}}><a class={headerStyles.link} href="/edit">EDIT</a></li>

                    <li style={{float: "right", padding: "10px", marginRight: "20px"}}>
                        <input type="text" placeholder="Search" style={searchStyle}></input>
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
