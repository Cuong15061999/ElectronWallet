var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin', { title: 'Express' });
});

/* GET activatedAccount page. */
router.get('/activatedAccount', function(req, res, next) {
  res.render('activatedAccount');
});

/* GET waitActiveAccount page. */
router.get('/waitActive', function(req, res, next) {
  res.render('waitActiveAccount');
});

/* GET waitActiveAccount page. */
router.get('/waitUpdateAccount', function(req, res, next) {
  res.render('waitUpdateAccount');
});

/* GET waitActiveAccount page. */
router.get('/disableAccount', function(req, res, next) {
  res.render('disableAccount');
});

module.exports = router;