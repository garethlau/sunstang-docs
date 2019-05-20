const mongoose = require('mongoose');
const {Schema} = mongoose;

const pageSchema = new Schema({
	authorId: String,
    title: String,
    content: Object,
    inEdit: Boolean,
});

module.exports = mongoose.model('pages', pageSchema);
