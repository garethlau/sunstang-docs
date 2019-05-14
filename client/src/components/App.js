import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import '../app.css';

// redux
import {connect} from 'react-redux';
import * as actions from '../actions';

// components for edditting
import EditPagesDriver from './EditPagesDriver';
import PageEditor from './PageEditor';


import PageDriver from './PageDriver';
import Page from './Page';
const Header = () => <h2>Header</h2>;
const Landing = () => <h2>Landing</h2>;

class App extends Component {
    render() {
        return(
            <>
                <BrowserRouter>
                    <>
                        <Route exact={true} path="/" component={Header}/>
                        <Route exact={true} path="/" component={Landing}/>
                        <Route exact={true}  path="/docs" component={PageDriver} />
                        <Route path="/docs/page" component={Page}/>


                        <Route exact={true} path="/edit" component={EditPagesDriver}/>
                        <Route path="/edit/page" component={PageEditor}/>
                    </>
                </BrowserRouter>
            </>
        )
    }
}

export default connect(null, actions)(App);
