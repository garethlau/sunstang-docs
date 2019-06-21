const express = require('express');
const router = express.Router();

router.use('/dev', require('./dev'));
router.use('/auth', require('./auth'));
router.use('/api/user', require('./user'));
router.use('/api/pages', require('./pages'));
router.use('/api/files', require('./files'));

module.exports = router;