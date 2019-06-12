module.exports = [
    "fakeemail@email.com"
]

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prodAdminEmails');
}
else {
    module.exports = require('./devAdminEmails');
}