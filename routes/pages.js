const mongoose = require('mongoose');
const Page = mongoose.model('pages');
const express = require('express');
const router = express.Router();

const statusCodes = require('./statusCodes');


router.get('/page/:pageId', (req, res) => {
    const pageId = req.params.pageId;
    console.log("=== GETTING PAGE === > " + pageId);
    Page.findById(pageId).then((page, err) => {
        if (err) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR);
        }
        else {
            console.log("=== FOUND PAGE === > " + page._id + " : " + page.title);
            res.status(statusCodes.OK).send(page);
        }
    }).catch((err) => {
        console.log(err);
        res.status(statusCodes.NOT_FOUND);
    });
});

// update an existing page
router.post('/page/:pageId', (req, res) => {
    const pageId = req.params.pageId;
    const page = req.body;
    Page.findById(pageId).then((newPage) => {
        console.log("newPage", newPage);
        newPage.title = page.title;
        newPage.content = page.blocks;
        newPage.save().then(() => {
            res.status(statusCodes.CREATED).send(newPage);
        }).catch(err => {
            console.log(err);
            res.status(statusCodes.INTERNAL_SERVER_ERROR);
        });
    }).catch(err => {
        console.log(err);
        res.status(statusCodes.NOT_FOUND);
    });
})

// create a new page
router.post('/page', (req, res) => {
    // get number of documents
    Page.countDocuments({}).then(count => {
        let pageIndex = count + 1;
        console.log("=== CREATING PAGE WITH INDEX === > " + pageIndex);
        new Page({
            authorId: req.user._id,
            title: page.title,
            content: page.blocks,
            index: pageIndex,
            inEdit: false
        }).save().then((newPage) => {
            console.log("=== SAVED PAGE === > ", page.title + " : " + page._id);
            res.status(statusCodes.CREATED).send(newPage);
        }).catch(err => {
            console.log(err);
            res.status(statusCodes.INTERNAL_SERVER_ERROR);
        });
    }).catch(err => {
        console.log(err);
    })
});

router.delete('/page/:pageId', (req, res) => {
    const pageId = req.params.pageId;
    Page.findByIdAndDelete(pageId).then((deletedPage) => {
        res.status(statusCodes.OK).send(deletedPage);
    }).catch(err => {
        console.log(err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).send(err);
    });
});

// get all pages
router.get('/', (req, res) => {
    Page.find({}).sort({category: "asc", index: 1}).then((pages) => {
        res.status(statusCodes.OK).send(pages);
    }).catch(err => {
        console.log(err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).send(err);
    });
});

// reorder pages
// the array in the body of the request is in the right order
// for each item in the array, lets find the document and then change its index to match the arrays
router.post('/reorder', (req, res) => {
    const pagesArray = req.body.data;
    let pageIndex = 0
    pagesArray.forEach(page => {
        pageIndex = pageIndex + 1;
        Page.findOneAndUpdate({title: page.title}, {index: pageIndex}).then(updatedDoc => {
            console.log("  === UPDATE === > " + updatedDoc.title + " : " + updatedDoc._id + " ===> WITH INDEX: " + updatedDoc.index);
        }).catch(err => console.log(err));
        if (pageIndex == pagesArray.length) {
            res.send("All pages saved");
        }
    });
});

module.exports = router;
