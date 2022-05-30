var express = require('express');
const { render } = require('express/lib/response');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
//DASHBOARD
router.get('/', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }


  return res.render('index')
});

//THONG TIN CHI TIET
router.get('/profile', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }


  return res.render('profile')
});

//Nap & Rut TIEN
router.get('/depositeAndWithdraw', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  return res.render('depositeAndWithdraw')
});

router.post('/depositeAndWithdraw', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }

  console.log('post deposit and withdraw')
  //return res.render('depositeAndWithdraw')
});

//Mua the dt
router.get('/buyCard', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }

  return res.render('buyCard')
});

router.post('/buyCard', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }

  console.log('Buy Card')
});

//Chuyen tien`
router.get('/transfer', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  return res.render('transfers')
});

router.post('/transfer', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  console.log('transfer post ')
});

//login
router.get('/logout', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)

  return res.render('login')
});
module.exports = router;
