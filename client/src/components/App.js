import React, {Component, lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Redirect, Link} from 'react-router-dom';

import '../app.css';

// redux
import * as actions from '../actions';
import {connect} from 'react-redux';

import axios from 'axios';

// routing components
import Login from './Login';
import PrivateRoute from './PrivateRoute'
import NavBar from './NavBar';
import Loader from './Loader';

// doc viewer components
import PageDriver from './PageDriver';

// doc edditor components
import EditPagesDriver from './EditPagesDriver';
import PageEditor from './PageEditor';
import Placeholder from './Placeholder';

import Test from './Test';

const Landing = () => <h2>Landing</h2>;
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
                    <NavBar/>
                    <>
                        <Route exact path="/" component={Placeholder}/>
                        <Route path="/about" component={Placeholder}/>
                        <Route path="/the-races" component={Placeholder}/>
                        <Route path="/blog" component={Placeholder}/>
                        <Route path="/sponsors" component={Placeholder}/>
                        <Route exact={true} path="/login" component={Login}/>

                        <Route path="/public" component={Public}/>
                        <PrivateRoute path="/protected" component={Protected}/>

                        <Route exact={true}  path="/docs" component={PageDriver} />
                        <PrivateRoute exact={true} path="/edit" component={EditPagesDriver}/>
                        <PrivateRoute path="/edit/page" component={PageEditor}/>

                        <Route exact={true} path="/test" component={Test}/>
                        <Suspense fallback={<Loader/>}>
                            
                        </Suspense>
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
