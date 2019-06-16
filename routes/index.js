const express = require('express');
const router = express.Router();

router.use('/dev', require('./dev'));
router.use('/auth', require('./auth'));
router.use('/api', require('./api'))

module.exports = router;