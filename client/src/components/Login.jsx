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
					<h2>Sorry! You need to be logged in.</h2>
					<div style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gridColumnGap: "20px",
						width: "100%"
					}}>
						<a href="/auth/google"><img style={{width: "100%", objectFit: "contain"}} src={require("../assets/google_signin_buttons/btn_google_signin_light_normal_web@2x.png")} alt="sign in with google"/></a>
						<a href="/auth/slack"><img style={{width: "100%", objectFit: "contain"}} src="https://api.slack.com/img/sign_in_with_slack.png" alt="sign in with slack"/></a>
					</div>
				</div>

			</div>
		)
	}
}

export default Login;