var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin', { title: 'Express' });
});

/* GET home page. */
router.get('/waitActive', function(req, res, next) {
  res.render('waitActiveAccount');
});

module.exports = router;