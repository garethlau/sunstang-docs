const express = require('express');
const router = express.Router();

router.get('/current-user', (req, res) => {
    console.log("=== CURRENT USER === > " +  req.user.name + " : " + req.user._id + " : isAdmin? = " + req.user.admin);
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    console.log("user logged out");
    // make this redirect something useful
    res.redirect('/')
});

module.exports = router;