import React from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';

import SearhBar from './SearchBar';

import navbarStyles from '../styles/navbarStyles.module.css';

const NavBar = (props) => {

    console.log("loca", props.location);

    const showSearchBar = () => {
        if (props.location.pathname.split('/').includes('docs')) {
            return (
                <SearhBar/>
            )
        }
    }

    

    return (
        <nav>
            <ul>
                <li class={navbarStyles.left}><Link to="">Sunstang</Link></li>
                <li><Link to="">Page 1</Link></li>
                <li><Link to="">Page 2</Link></li>
                <li><a href="https://github.com/garethlau/sunstang-docs">GITHUB</a></li>
                <li><Link to="/docs">Docs</Link></li>
                <li><Link to="/edit">Edit</Link></li>
                <li><Link to="/protected">Protected</Link></li>
                {showSearchBar()}
            </ul>
        </nav>
    )
}

export default withRouter(NavBar);