var express = require('express');
var router = express.Router();

/* GET home page. */
//Login 
router.get('/login', function(req, res, next) {
  
  return res.render('login')
});

// Register
router.get('/register', function(req, res, next) {
  
  return res.render('register')
});

//forgot pass
router.get('/forgotpass', function(req, res, next) {
  
  return res.render('forgotpass')
});

//Opt Page
router.get('/OtpPage', function(req, res, next) {
  
  return res.render('OtpPage')
});

//Change pass
router.get('/ChangePass', function(req, res, next) {
  
  return res.render('ChangePass')
});

module.exports = router;
