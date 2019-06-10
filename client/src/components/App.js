import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect, Link} from 'react-router-dom';

import '../app.css';

// redux
import * as actions from '../actions';
import {connect} from 'react-redux';

import axios from 'axios';

// doc viewer components
import PageDriver from './PageDriver';

// doc edditor components
import EditPagesDriver from './EditPagesDriver';
import PageEditor from './PageEditor';

// routing components
import Login from './Login';
import PrivateRoute from './PrivateRoute'


const Header = () => <h2>Header</h2>;
const Landing = () => <h2>Landing</h2>;
const AuthPlaceholder = () => <></>;        // saves the state between pages
const Protected = () => <h1>Protected</h1>
const Public = () => <h1>Public</h1>
const Log = () => <h1>Log</h1>


class App extends Component {
    
    componentDidMount() {
        this.props.fetchUser();
    }

	render() {
        console.log(this.props.user);
        return(
            <div className="app">

                <Router>
                <ul>
                    <li><Link to="/protected">protected</Link></li>
                </ul>
                    <>
                        <Route path="/" component={AuthPlaceholder}/>
                        <Route exact={true} path="/" component={Header}/>
                        <Route exact path="/" component={Landing}/>

                        <Route exact={true} path="/login" component={Login}/>

                        <Route exact={true}  path="/docs" component={PageDriver} />
                        
                        <Route exact path="/edit" component={EditPagesDriver}/>
                        <Route path="/edit/page" component={PageEditor}/>

                        <Route path="/public" component={Public}/>
                        <Route path="/log" component={Log}/>
                        <PrivateRoute path="/protected" component={Protected}/>
                    </>
                </Router>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return ({
        user: state.user
    })
}

export default connect(mapStateToProps, actions)(App);
