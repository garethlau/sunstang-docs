const mongoose = require('mongoose');
const Page = mongoose.model('pages');

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
                console.log("err", err);
            }
            else {
                console.log("api got page", page);
                res.send(page);
            }
        }).catch((err) => {
            console.log("Error getting page", err);
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
                res.send(newPage);
            }).catch(err => console.log("err", err));
        }
        else {
            // this page already exists
            console.log("page already exists");
            Page.findById(pageId).then((newPage) => {
                console.log("newPage", newPage);
                newPage.title = page.title;
                newPage.content = page.blocks;
                newPage.save().then(() => {
                    res.send(newPage);
                }).catch(err => console.log("err", err));
            });
        };
    });

    app.delete('/api/page', (req, res) => {
        const pageId = req.query.pageId;
        Page.findByIdAndDelete(pageId).then((deletedPage) => {
            res.send(deletedPage)
        }).catch(err => console.log("err", err));
    });


    // get all pages
    app.get('/api/pages', (req, res) => {
        Page.find({}).then((pages) => {
            res.send(pages);
        })
    })
}
