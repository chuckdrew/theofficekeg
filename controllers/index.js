var express = require('express');
var router = express.Router();

//router.use('/payments', require('./payments'))
router.use('/users', require('./users'));

module.exports = router;