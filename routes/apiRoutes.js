module.exports = app => {

    app.get('/api/current_user', (req, res) => {
        console.log("current user is: ", req.user);
        res.send(req.user);
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        console.log("user logged out");
        // make this redirect something useful
        res.redirect('/')
    })
}
