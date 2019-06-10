import React, {Component} from 'react';

class Login extends Component {

	render() {
		return (
			<div style={{backgroundColor: "white", width: "100vw", height: "100vh", display: "table-cell"}}>
				<div style={{
					marginRight: "auto",
					marginLeft: "auto", 
					marginTop: "30vh", 
					width: "400px", 
					backgroundColor: "#E9E9E9",
					padding: "20px",
					borderRadius: "10px",
					textAlign: "center"
				}}>
					<h2>You need to log in to see the content.</h2>
					<div style={{
						width: "100%"
					}}>
						<a href="/auth/slack"><img style={{width: "172px", objectFit: "contain"}} src="https://api.slack.com/img/sign_in_with_slack.png" alt="sign in with slack"/></a>
					</div>
				</div>

			</div>
		)
	}
}

export default Login;