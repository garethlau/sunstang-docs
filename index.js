// import dependencies
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

// import files
const keys = require('./config/keys');
require('./models/user');
require('./services/passport.js');

// initialize the app
const app = express();

// configure express app
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongoURI, {
	auth: {
		user: keys.mongoUser,
		password: keys.mongoPassword
	},
	useNewUrlParser: true
}).then(() => console.log("mongo connection successful")).catch((err) => console.log("err connecting to mongo", err));


// require in the different routes
require('./routes/authRoutes')(app);
require('./routes/apiRoutes')(app);

// set dynamic ports
const PORT =  process.env.PORT || 5000;
const environment = process.env.ENV || 'dev';

if (environment === "dev"){
    console.log("\x1b[31m", "ENVIRONMENT IS DEV - ENSURE THAT THIS IS NOT SHOWING WHEN DEPLOYED", "\x1b[0m");
} else if (environment === "prod") {
    console.log("\x1b[34m", "RUNNING IN PRODUCTION", "\x1b[0m")
}

// tell express to listen to the port
app.listen(PORT);
