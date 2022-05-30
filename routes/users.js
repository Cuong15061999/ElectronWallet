var express = require('express');
const { render } = require('express/lib/response');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
//DASHBOARD ** Chua do thong tin vao` bang Lich su Giao Dich
router.get('/', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  //insert info in to the page
  User.findOne({ username: req.session.user }, function(err, users){
    if(err) {
      //xu ly error o day
      throw err;
    }else{
      var tempMoney = users.Money
      moneyFormated = tempMoney.toLocaleString()
      //console.log(moneyFormated)
      return res.render('index', {users, moneyFormated})
    }
  });

  //insert info to the table
});

//THONG TIN CHI TIET
router.get('/profile',  function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }

  User.findOne({ username: req.session.user }, function(err, users){
    if(err){
      throw err
    }else{
      return res.render('profile',{user:users,dob: convert(users.birthDay),CreateAt: convert(users.CreateAt),money: users.Money.toLocaleString(),img1:users.Photos[0],img2:users.Photos[1]})
    }
  });
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

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}