let User = require('../models/user');
const express = require('express');
const router = express.Router();

// get all documents in user database
router.get('/mongo', (req, res) => {
    User.find({}, (err, users) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(
                users
            )
        }
    } )
});

module.exports = router;


