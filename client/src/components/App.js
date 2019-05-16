import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import '../app.css';

// redux
import * as actions from '../actions';
import {connect} from 'react-redux';

// components for edditting
import EditPagesDriver from './EditPagesDriver';
import PageEditor from './PageEditor';
import PageDriver from './PageDriver';
import Page from './Page';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
const Header = () => <h2>Header</h2>;
const Landing = () => <h2>Landing</h2>;


class App extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }

	render() {
        return(
            <>
                <BrowserRouter>
                    <>
                        <Route exact={true} path="/" component={Header}/>
                        <Route exact={true} path="/" component={Landing}/>

                        <Route exact={true} path="/login" component={Login}/>

                        <Route exact={true}  path="/docs" component={PageDriver} />
                        <Route path="/docs/page" component={Page}/>

                        <Route exact path="/edit" component={EditPagesDriver}/>
                        <Route path="/edit/page" component={PageEditor}/>
                    </>
                </BrowserRouter>
            </>
        )
    }
}

function mapStateToProps(state) {
    return ({
        auth: state.auth
    })
}

export default connect(mapStateToProps, actions)(App);
