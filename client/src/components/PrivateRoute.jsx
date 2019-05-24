// not being used
// ran into issue of infinite action calls

import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';

import axios from 'axios';

import Loader from './Loader'
import {fetchUser} from '../actions';

class PrivateRoute extends Component { 
	state = {
		auth: null
	}
	componentDidMount() {
		axios.get('/api/current-user').then(res => {
			console.log(res.data);
			if (res.data._id !== undefined) {
				// logged in
				this.setState({auth: true})
			}
			else {
				this.setState({auth: false})
			}
			console.log("auth is", this.state.auth);
		})
	}	

	render() {
		if (this.state.auth != null) {
			if (this.state.auth) {
				return (<div>logged in</div>)
			}
			else {
				return (<Redirect to="/login"/>);
			}
		}
		else {
			return (<div>loading</div>)
		}
	}
}
export default PrivateRoute;
