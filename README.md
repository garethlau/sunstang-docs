# Sunstang Docs
Online rich text editing and document managing solution built for Sunstang. Built with the MERN stack.

# Dependencies
- [create-react-app](https://github.com/facebook/create-react-app "https://github.com/facebook/create-react-app")
- [redux](https://redux.js.org/ "https://redux.js.org/")
- [react-beautiful-dnd](https://www.npmjs.com/package/react-beautiful-dnd "https://www.npmjs.com/package/react-beautiful-dnd")
- [draft-js](https://draftjs.org/ "https://draftjs.org/") (and many plugins for draft-js)

# Contributing to the Project
There's a lot of stuff that can be worked on. Feel free to pull this project and add to it!

## Pulling the Project
In command terminal:
```
$ git clone https://github.com/garethlau/sunstang-website.git
$ cd sunstang-website/
```

## Running the Project
In development, this project runs a backend and frontend server on localhost:5000 and localhost:3000 respectively. 

To start both the frontend and backend, use ` npm run dev`.

Any changes commited to master will be automatically deployed to Heroku. Heroku executes a build step for the client side source files.

## Backend
Backend server start script: `npm run server`. The entry point for this script is `index.js`. 

## Frontend
Frontend server (client side) start script: `npm run client `. The client server has its own set of dependencies that need to be installed. If you are missing dependencies for the client server:
```
$ cd client
$ npm install
```

# Client Side Development
## Components
PageDriver.jsx drives the viewing process of the documents. Some notable components that PageDriver renders:
- ReadOnlyEditor: responsible for rendering the page content.
- PageList: List of ordered pages. When the link is clicked, ReadOnlyEditor changes its render data and displays the new content.

EditPagesDriver.jsx contains all the logic for editting <b>and creating</b> pages. Reodering of pages can be done in EditPagesDriver (drag and drop). When a page link is clicked, the app will redirect to a new path that will render PageEditor.jsx.

PageEditor is responsible for all the logic concerning the page content and persisting changse to the database.

<b>PrivateRoutes.jsx is broken.</b>

## State Management
This project uses [redux](https://redux.js.org/ "https://redux.js.org/") and [redux-thunk](https://github.com/reduxjs/redux-thunk "Redux-Thunk on Github") for state management. 

# Backend Development
## Authentication
Google and Slack oauth using [Passport.js](http://www.passportjs.org/ "http://www.passportjs.org/"). All authentication logic can be found in `/routes/authRoutes.js`. For Google or Slack oauth to work, you will need to obtain a clientID and clientSecret. <b>I will add more links later.</b>

## APIs
All found in `/routes/apiRoutes.js`. 

## Database
Mongo is being used as the database. For development, you can:
1) Host a local mongo database, connect it by creating a dev.js file in the config folder and exporting the config variables. 
2) Use [mlab](https://mlab.com/) and connect using the given config variables. (I would recomment this option.)

In either case, the variables have to be as follows:

In `/config/dev.js`:
``` javascript
module.exports = {
    googleClientID: '',
    googleClientSecret: '', 
    slackClientID: '',
    slackClientSecret: '',
    mongoURI: 'ENTERMONGOURI',
    mongoUser: 'ENTERMONGOUSERNAME',
    mongoPassword: 'ENTERMONGOPASSWORD',
    cookieKey: ''
};
```
<b>Some routes check for auth status. If you do not want to create a Google OAuth API, I think you should be able to hard code somewhere so that you are always authed. I will look into this.</b>

# What's left?
- Editting conflicts
- Edit history
- Protected pages
- Page deletion protection
- Code styling based on language
- Keyboard shortcuts for styles
- File hosting
- Mentions
- Hashtags
- Creating an effective search system
- Links and embedded content
- Lots and lots and lots of styling
- Code clean up and comments!

<b>There's still lots and lots to do!</b>
