// import dependencies
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const methodOverride = require('method-override');

// method overdride? 

// import files
const keys = require('./config/keys');  // keys
require('./models/user.js');    // schema
require('./models/page.js');    // schema
require('./services/passport.js');  // passport

// initialize the app
const app = express();

// configure express app
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(methodOverride('_method'));
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

// require in the different routes
app.use(require('./routes'));

// connect to database
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    keepAlive: 1,
    reconnectTries: 30, // keep an eye open for performance and security
    })
    .then(() => {
        console.log("Successfully connected to mongo")
    })
    .catch((err) => console.log("There was an error connecting to mongo", err));


/* Handle files */
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');

const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

const storage = new GridFsStorage({
    db: conn,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
              if (err) {
                return reject(err);
              }
              const filename = buf.toString('hex') + path.extname(file.originalname);
              const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
              };
              resolve(fileInfo);
            });
          });
    }
});

let upload = multer({storage: storage}).single("File");


app.get('/api/file/download/:filename', (req, res) => {
    // see if the files exists
    console.log("Looking for " + req.params.filename);
    gfs.findOne({filename: req.params.filename}, (err, file) => {
        if (err) {console.log(err)}
        else {
            if (file) {
                console.log("Found", file)
                // create read stream
                res.set('Content-Type', file.contentType);
                res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

                const readStream = gfs.createReadStream(file.filename);
                readStream.on("error", (err) => {
                    console.log("read stream error", err);
                    res.end();
                });
                readStream.pipe(res);
            }
            else {
                console.log("Not found")
                res.send({message: "File not found"});
            }
        }
    });
});

app.post('/api/file/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // error with multer
            console.log("Multer error uploading", err);
            res.json({err: err});
        }
        else if (err) {
            // uploading error
            console.log("Error uploading", err);
            res.json({err: err});
        }
        // good 
        console.log("req.file", req.file);
        res.json({file: req.file})
    })
})


app.delete('/api/file/delete/:fileId', (req, res) => {
    gfs.remove({_id: req.params.fileId, root: 'uploads'}, (err, gridStore) => {
        if (err) {
            return res.status(404).json({err: err});
        }
        else {
            res.json({message: "Deleted"})
        }
    })
})


// set dynamic ports
const PORT =  process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'dev';

if (environment === "dev"){
    console.log("\x1b[31m", "ENVIRONMENT IS DEV - ENSURE THAT THIS IS NOT SHOWING WHEN DEPLOYED", "\x1b[0m");
} else if (environment === "production") {
    console.log("\x1b[34m", "RUNNING IN PRODUCTION", "\x1b[0m");
    app.use(express.static('client/build'));    // make sure express serves production assets
    // make sure express serves index.html if it doesn't know the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT);   // tell express to listen to the port
