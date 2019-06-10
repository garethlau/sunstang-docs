// not being used
// ran into issue of infinite action calls

import React, {Component} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';

class PrivateRoute extends Component {
	render() {
		console.log("this.props.auth in private route is", this.props.user);
		const Component = this.props.component;
		return (
			<Route path={this.props.path} render={(props) => {
				if (this.props.user) {	// user is logged in
					if (this.props.user.admin) {	// user is admin
						return (<Component {...props}/>)
					}
					else {	// user isnt admin
						return (<div>ur not an admin</div>)
					}
				}
				else {	// user isn't logged in
					return (<Redirect to='/login' />)
				}
			}}/>
		)

	}
}
function mapStateToProps(state) {
	return({
		user: state.user
	});
}

export default connect(mapStateToProps)(PrivateRoute);
