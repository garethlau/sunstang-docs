import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import '../app.css';

// redux
import {connect} from 'react-redux';
import * as actions from '../actions';

// components for edditting
import EditPagesDriver from './EditPagesDriver';
import PageCreator from './PageCreator';
import PageEdittor from './PageEdittor';


import Page from './Page';
const Header = () => <h2>Header</h2>
const Landing = () => <h2>Landing</h2>

class App extends Component {
    render() {
        return(
            <>
                <BrowserRouter>
                    <>
                        <Route path="/" component={Header}/>
                        <Route exact={true} path="/" component={Landing}/>
                        <Route path="/docs" component={Page} />


                        <Route exact={true} path="/edit" component={EditPagesDriver}/>
                        <Route path="/edit/new-page" component={PageCreator}/>
                        <Route path="/edit/page" component={PageEdittor} />
                    </>
                </BrowserRouter>
            </>
        )
    }
}

export default connect(null, actions)(App);
