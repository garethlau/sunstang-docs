const mongoose = require('mongoose');
const Page = mongoose.model('pages');

const statusCodes = require('./statusCodes');

module.exports = app => {

    app.get('/api/current-user', (req, res) => {
        console.log("current user is: ", req.user);
        res.send(req.user);
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        console.log("user logged out");
        // make this redirect something useful
        res.redirect('/')
    });

    app.get('/api/page/', (req, res) => {
        const pageId = req.query.pageId;
        Page.findById(pageId).then((page, err) => {
            if (err) {
                res.status(statusCodes.INTERNAL_SERVER_ERROR);
            }
            else {
                console.log("api got page", page);
                res.status(statusCodes.OK).send(page);
            }
        }).catch((err) => {
            console.log(err);
            res.status(statusCodes.NOT_FOUND);
        })
    });

    app.post('/api/page/', (req, res) => {
        const pageId = req.query.pageId;
        const page = req.body;
        console.log("Page id is:", pageId);
        console.log("page is", page);
        if (pageId === undefined) {
            // this is a new page
            new Page({
                authorId: req.user._id,
                title: page.title,
                content: page.blocks,
                inEdit: false
            }).save().then((newPage) => {
                console.log("Page saved...", page);
                res.status(statusCodes.CREATED).send(newPage);
            }).catch(err => {
                console.log(err);
                res.status(statusCodes.INTERNAL_SERVER_ERROR);
            });
        }
        else {
            // this page already exists
            console.log("page already exists");
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
        };
    });

    app.delete('/api/page', (req, res) => {
        const pageId = req.query.pageId;
        Page.findByIdAndDelete(pageId).then((deletedPage) => {
            res.status(statusCodes.OK).send(deletedPage);
        }).catch(err => {
            console.log(err);
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send(err);
        });
    });

    // get all pages
    app.get('/api/pages', (req, res) => {
        Page.find({}).then((pages) => {
            res.status(statusCodes.OK).send(pages);
        }).catch(err => {
            console.log(err);
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send(err);
        });
    });

    app.post('/api/pages', (req, res) => {
        //console.log("IN axios.post req is", req.body.data.length);
        Page.deleteMany({}).then((mongoInfo) => {
            const pagesArray = req.body.data;
            for (i = 0; i < pagesArray.length; i++) {
                new Page(pagesArray[i]).save().then(savedPage => {
                    console.log("Page" + (i+1) + "saved: ", savedPage)
                }).catch(err => {
                    console.log(err)
                    res.status(statusCodes.INTERNAL_SERVER_ERROR).send(err);
                });
            }
            res.status(statusCodes.OK).send(mongoInfo);
        });
    });
}
