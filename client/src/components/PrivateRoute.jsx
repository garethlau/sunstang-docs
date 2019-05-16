// not being used
// ran into issue of infinite action calls

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route, Redirect} from 'react-router-dom';

import axios from 'axios';

import Loader from './Loader'
import {fetchUser} from '../actions';


class PrivateRoute extends Component {
	componentDidMount() {
		console.log(this.props.auth);
	}
	renderContent = () => {
		console.log("auth is: ", this.props.auth);
		if (this.props.auth) {
			// logged in
			return (
				<this.props.component/>
			)
		}
		else {
			// not logged in
			return (
				<div>
					<Redirect to={{pathname: '/login', state: {from: this.props.location}}} />
				</div>
			)
		}
	}

	render() {
		console.log(this.props)
		return(
			<div>
				{this.renderContent()}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return ({
		auth: state.auth
	})
}

export default connect(mapStateToProps)(PrivateRoute);
