const passport = require('passport');

module.exports = app => {

    app.get("/", (req, res) => {
		res.send("localhost5000home");
	});

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

    app.get("/auth/slack", passport.authenticate('Slack', {
        scope: ["identity.basic"]
    }));

    app.get('/auth/slack/callback',
      passport.authenticate('Slack', { failureRedirect: '/login' }),
      (req, res) => res.redirect('/success') // Successful authentication, redirect home.
    );

}
