const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
	googleId: String,
	slackId: String,
	name: String,
	admin: Boolean
});

module.exports = mongoose.model('users', userSchema);
