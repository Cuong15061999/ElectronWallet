var express = require('express');
const { render } = require('express/lib/response');
var router = express.Router();
var User = require('../models/user');
var AtmHistory = require('../models/AtmHistory')
var AtmCard = require('../models/AtmCard')

/* GET users listing. */
//DASHBOARD ** Chua do thong tin vao` bang Lich su Giao Dich
router.get('/', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  //insert info in to the page
  User.findOne({ username: req.session.user }, function (err, users) {
    if (err) {
      //xu ly error o day
      throw err;
    } else {
      var tempMoney = users.Money
      moneyFormated = tempMoney.toLocaleString()
      //console.log(moneyFormated)
      return res.render('index', { users, moneyFormated })
    }
  });

  //insert info to the table
});

//THONG TIN CHI TIET** Duy lam`
router.get('/profile', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }


  return res.render('profile')
});

//Nap & Rut TIEN** Phan get chua gui duoc mess error can nguoi dung` vao` trang
router.get('/depositeAndWithdraw', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  //take user info mation
  User.findOne({ username: req.session.user }, function (err, users) {
    if (err) {
      throw err;
    } else {
      if (users.actStatus === "Xac Minh") {
        return res.render('depositeAndWithdraw')
      } else {
        //chua hien ra flash message
        req.session.flash = {
          info: "Error",
          message: "Sai email hoac mat khau"
        }
        // tim` cach gui flash message ve trang index
        return res.redirect('/index')
      }
    }
  });

});

//Moi ng duoc rut toi da 2 lan`, boi so 50k, phi rut 5% if rut >5tr status dang cho duyet
//nap tien , chua xet dk nhưng the khac
router.post('/depositeAndWithdraw', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  //take Atm Info
  AtmCard.findOne({ cardNumber: req.body.cardID }, function (err, AtmCards) {
    if (!AtmCards) {
      return res.render('depositeAndWithdraw', { msg: "We not supper this card" })
    } else {
      if (AtmCards.CVV === req.body.CVV) {
        if (req.body.depositAndwithdraw === "In") {
          //Deposit Money
          new AtmHistory({
            idUser: req.session.user,
            idCard: req.body.cardID,
            money: req.body.money,
            Status: 0,
            createdAt: Date.now(),
          }).save()
            .then(() => {
              //update user money
              User.findOne({username: req.session.user}, function(err, users){
                let money = parseInt(users.Money) + parseInt(req.body.money)
                User.updateOne({ username: req.session.user },
                  { Money: money},
                  function (err, docs) {
                    if (err) {
                      console.log(err)
                    }
                    else {
                      return res.render('depositeAndWithdraw', { msg1: 'Deposit SuccessFully' })
                    }
                  });
              })
            });
        } else {
          //WithDraw Money
          new AtmHistory({
            idUser: req.session.user,
            idCard: req.body.cardID,
            money: req.body.money,
            Status: 1,
            createdAt: Date.now(),
          }).save()
            .then(() => {
              //update user money
              User.findOne({username: req.session.user}, function(err, users){
                let money = users.Money - req.body.money
                User.updateOne({ username: req.session.user },
                  { Money: money},
                  function (err, docs) {
                    if (err) {
                      console.log(err)
                    }
                    else {
                      return res.render('depositeAndWithdraw', { msg1: 'WithDraw SuccessFully' })
                    }
                  });
              })
              
            });
        }
      } else {
        return res.render('depositeAndWithdraw', { msg: "CVV Code Is Wrong" })
      }
    }
  })

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
