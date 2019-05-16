import React, {Component} from 'react';


class Login extends Component {

	render() {
		return (
			<div>
				<a href="/auth/google">
					<p>Login or Signup with Google</p>
				</a>
				<a href="/auth/slack">
					<p>Login or Signup with Slack</p>
				</a>
			</div>
		)
	}
}

export default Login;