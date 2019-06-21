const express = require('express');
const router = express.Router();

router.get('/current-user', (req, res) => {
    req.user ? console.log("=== CURRENT USER === > " +  req.user.name + " : " + req.user._id + " : isAdmin? = " + req.user.admin) : console.log("=== NO USER LOGGED IN ===");
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    console.log("user logged out");
    // make this redirect something useful
    res.redirect('/')
});

module.exports = router;