/* Handle files */
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);
const crypto = require('crypto');
const path = require('path');

const conn = mongoose.connection;
let gfs;
let storage;
let upload;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');

    storage = new GridFsStorage({
        db: conn.db,
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
    upload = multer({storage: storage}).single("File");
});


router.get('/:filename', (req, res) => {
    // see if the files exists
    console.log("=== LOOKING FOR ===> " + req.params.filename);
    gfs.findOne({filename: req.params.filename}, (err, file) => {
        if (err) {console.log(err)}
        else {
            if (file) {
                console.log("=== FOUND ===> ", file.filename)
                // create read stream
                console.log("=== CREATING READ STREAM === >");
                res.set('Content-Type', file.contentType);
                res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

                const readStream = gfs.createReadStream(file.filename);
                readStream.on("error", (err) => {
                    console.log("=== READ STREAM ERROR === >");
                    console.log(err);
                    res.end();
                });
                readStream.pipe(res);
            }
            else {
                console.log("=== FILE NOT FOUND ===");
                res.send({message: "File not found"});
            }
        }
    });
});

router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // error with multer
            console.log("=== ERROR UPLOADING (MULTER) === > ");
            console.log(err);
            res.json({err: err});
        }
        else if (err) {
            // uploading error
            console.log("=== ERROR UPLOADING === >");
            console.log(err);
            res.json({err: err});
        }
        // good 
        console.log("=== UPLOADED === > ", req.file.originalname);
        res.json({file: req.file})
    })
})

router.delete('/:fileId', (req, res) => {
    gfs.remove({_id: req.params.fileId, root: 'uploads'}, (err, gridStore) => {
        if (err) {
            return res.status(404).json({err: err});
        }
        else {
            res.json({message: "Deleted"})
        }
    })
})

module.exports = router;
