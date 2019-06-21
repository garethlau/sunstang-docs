const devAuthConfig = require('./devAuthConfig');

devAuthConfig ? 
    module.exports = {
        adminEmails: devAuthConfig.adminEmails,
        slackTeamId: devAuthConfig.slackTeamId
    } :
    module.exports = {
        adminEmails: process.env.ADMIN_EMAILS.split(','),
        slackTeamId: process.env.SLACK_TEAM_ID
    }


