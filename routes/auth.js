const express = require('express');
const router = express.Router();
const passport = require('passport');

// successful auth route for testing
router.get('/success', (req, res) => {
    res.send("auth successful");
});

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    immediate: true
}));

// google oauth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure"
  })
);

router.get("/slack", passport.authorize('Slack'));

router.get('/slack/callback',
  passport.authenticate('Slack', { failureRedirect: '/login', successRedirect: '/' }),
  (req, res) => res.redirect('/') // Successful authentication, redirect home.
);

module.exports = router;
