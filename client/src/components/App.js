import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import '../app.css';

// redux
import * as actions from '../actions';
import {connect} from 'react-redux';

// doc viewer components
import PageDriver from './PageDriver';

// doc edditor components
import EditPagesDriver from './EditPagesDriver';
import PageEditor from './PageEditor';

// routing components
import Login from './Login';
import PrivateRoute from './PrivateRoute';  // not being used, ran into issue of repeated action calls


const Header = () => <h2>Header</h2>;
const Landing = () => <h2>Landing</h2>;


class App extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }

	render() {
        return(
            <div className="app">
                <BrowserRouter>
                    <>
                        <Route exact={true} path="/" component={Header}/>
                        <Route exact={true} path="/" component={Landing}/>

                        <Route exact={true} path="/login" component={Login}/>

                        <Route exact={true}  path="/docs" component={PageDriver} />
                        
                        <Route exact path="/edit" component={EditPagesDriver}/>
                        <Route path="/edit/page" component={PageEditor}/>
                    </>
                </BrowserRouter>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return ({
        auth: state.auth
    })
}

export default connect(mapStateToProps, actions)(App);
