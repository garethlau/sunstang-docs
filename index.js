// import dependencies
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// method overdride? 

// import files
const keys = require('./config/keys');  // keys
require('./models/user.js');    // schema
require('./models/page.js');    // schema
require('./services/passport.js');  // passport

// initialize the app
const app = express();

// configure express app
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(methodOverride('_method'));
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

// require in the different routes
app.use(require('./routes'));

// connect to database
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    keepAlive: 1,
    reconnectTries: 30, // keep an eye open for performance and security
    })
    .then(() => {
        console.log("=== SUCCESSFULLY CONNECTED TO MONGO ===")
    })
    .catch((err) => console.log("=== ERROR CONNECTING TO MONGO ===", err));






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
