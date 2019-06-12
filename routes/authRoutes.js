const passport = require('passport');

module.exports = app => {

    // successful auth route for testing
    app.get('/success', (req, res) => {
        res.send("auth successful");
    });


	app.get("/auth/google", passport.authenticate("google", {
			scope: ["profile", "email"],
			immediate: true
	}));

    // google oauth callback
    app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        successRedirect: "/auth/google/success",
        failureRedirect: "/auth/google/failure"
      })
    );

    app.get("/auth/slack", passport.authorize('Slack'));

    app.get('/auth/slack/callback',
      passport.authenticate('Slack', { failureRedirect: '/login', successRedirect: '/' }),
      (req, res) => res.redirect('/') // Successful authentication, redirect home.
    );

}
