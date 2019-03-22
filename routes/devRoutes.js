let User = require('./models/user');

module.exports = app => {
    // get all documents in user database
    app.get('/mongo', (req, res) => {
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

}
