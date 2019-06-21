if (process.env.NODE_ENV) {
    const devAuth = require('./devAuthConfig');
    module.exports = {
        adminEmails: devAuthConfig.adminEmails,
        slackTeamId: devAuthConfig.slackTeamId
    }
}
else {
    module.exports = {
        adminEmails: process.env.ADMIN_EMAILS.split(','),
        slackTeamId: process.env.SLACK_TEAM_ID
    }
}