// import dependencies
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

// import files
const keys = require('./config/keys');
require('./models/user.js');
require('./models/page.js');
require('./services/passport.js');

// connect to database
mongoose.connect(keys.mongoURI, {
    auth: {
        user: keys.mongoUser,
        password: keys.mongoPassword
    }, useNewUrlParser:true
})
    .then(() => console.log("Successfully connected to mongo"))
    .catch((err) => console.log("There was an error connecting to mongo", err));

/*
For local connection
mongoose.connect('mongodb://localhost/nodekb', {
    useNewUrlParser: true
});
let db = mongoose.connection;

// check connection
db.on('open', () => console.log("successfully connected to mongo"));

// check for issues
db.on('error', (err) => {
    console.log("err connecting to mongo", err)
})
*/

// initialize the app
const app = express();

// configure express app
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

// require in the different routes
require('./routes/authRoutes')(app);
require('./routes/apiRoutes')(app);
require('./routes/devRoutes')(app);


// set dynamic ports
const PORT =  process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'dev';

if (environment === "dev"){
    console.log("\x1b[31m", "ENVIRONMENT IS DEV - ENSURE THAT THIS IS NOT SHOWING WHEN DEPLOYED", "\x1b[0m");
} else if (environment === "production") {
    console.log("\x1b[34m", "RUNNING IN PRODUCTION", "\x1b[0m");
    app.use(express.static('client/build'));    // make sure express serves production assets
    // make sure express serves index.html if it doesn't know the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT);   // tell express to listen to the port
