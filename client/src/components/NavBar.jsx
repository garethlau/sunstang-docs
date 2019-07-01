import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';

import SearhBar from './SearchBar';

import navbarStyles from '../styles/navbarStyles.module.css';
import axios from 'axios';

const NavBar = (props) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //console.log("LOCATION === >", props.location);

    useEffect(() => {
        axios.get('/api/user/current-user').then(res => {
            let user = res.data;
            if (user) {
                // user is logged in
                setIsLoggedIn(true);
                if (user.admin) {
                    // user is an admin
                    setIsAdmin(true)
                }
                else {
                    // user is not an admin
                }
            }
            else {
                // not logged in
            }
        })
    })

    const showSearchBar = () => {
        if (props.location.pathname.split('/').includes('docs')) {
            return (
                <SearhBar/>
            )
        }
    }

    const logout = () => {
        console.log("LOGGING OUT");
        axios.get('/api/user/logout');
    }

    return (
        <nav>
            <ul>
                <li class={navbarStyles.left}><Link to="/">Sunstang</Link></li>

                {isLoggedIn && <li><a href="/" onClick={() => logout()}>Logout</a></li>}
                {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
                <li><a href="https://github.com/garethlau/sunstang-docs">GITHUB</a></li>
                {isAdmin && <li><Link to="/edit">Edit</Link></li>}
                <li><Link to="/protected">Protected</Link></li>
                <li><Link to="/docs">Docs</Link></li>
                <li><Link to="/sponsors">Sponsors</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/the-races">The Races</Link></li>
                <li><Link to="/about">About</Link></li>
                {showSearchBar()}
            </ul>
        </nav>
    )
}

export default withRouter(NavBar);