# Sunstang website
Online rich text editing and document managing solution built for Sunstang. Built with the MERN stack.

# Dependencies
- [create-react-app](https://github.com/facebook/create-react-app "https://github.com/facebook/create-react-app")
- [redux](https://redux.js.org/ "https://redux.js.org/")
- [react-beautiful-dnd](https://www.npmjs.com/package/react-beautiful-dnd "https://www.npmjs.com/package/react-beautiful-dnd")
- [draft-js](https://draftjs.org/ "https://draftjs.org/") (and many plugins for draft-js)

# Running the Project
In development, this project runs a backend and frontend server on localhost:5000 and localhost:3000 respectively. 

## Backend
Backend server start script: ```npm run server```. The entry point for this script is ```index.js```

## Frontend
Frontend server (client side) start script: ``` npm run client ```. The client server has its own set of dependencies that may or may not need to be installed once pulled. If you are missing dependencies for the client server, cd into ``` sunstang-website/client``` and run ``` npm install```.


To start both the frontend and backend, use ``` npm run dev ```.

