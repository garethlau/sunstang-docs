// not being used
// ran into issue of infinite action calls

import React, {Component} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';

class PrivateRoute extends Component {
	render() {
		console.log("this.props.auth in private route is", this.props.auth);
		const Component = this.props.component;
		return (
			<Route path={this.props.path} render={(props) => (
				this.props.auth
				? <Component {...props}/>
				: <Redirect to='/log'/>
			)}/>
		)

	}
}
function mapStateToProps(state) {
	return({
		auth: state.auth
	});
}

export default connect(mapStateToProps)(PrivateRoute);
