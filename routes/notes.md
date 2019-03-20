# Look Into
- documentation model (how to go about splitting up the data)

# Fix in the future
- ./routes/apiRoutes.js - update the redirect path after logout
- ./index.js - create new data base and create credentials
- ./services/passport.js - create new google auth tokens and api

# APIs
- /current_user - sends current user info

Example:

``{
"_id": "5c9192a1e7d2ee1694aef066",
"slackId": "UDBGQCE3X",
"name": "Gareth Lau",
"__v": 0
}``

- /logout - logs out current user


# Models
#### user
users will either have slackId or googleId depending on their authentication

user model: 

``{
    "_id": String,
    "slackId": String,
    "googleId": String,
    "name": String,
    "__v": 0
}``