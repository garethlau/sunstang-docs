if (process.env.NODE_ENV === 'production') {
    module.exports = {
        adminEmails: process.env.ADMIN_EMAILS.split(','),
        slackTeamId: process.env.SLACK_TEAM_ID
    }
}
else {
    const devAuth = require('./devAuthConfig');
    module.exports = {
        adminEmails: devAuth.adminEmails,
        slackTeamId: devAuth.slackTeamId
    }
}