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

//Moi Ngay chi dc rut 2 lan***
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
        //Rut tien Boi so cua 50k
        if(req.body.depositAndwithdraw === "Out" && (parseInt(req.body.money)%50000) != 0){
          return res.render('depositeAndWithdraw', { msg: 'So Tien Ban Rut Phai Chia Het Cho 50k' })
        }
        //the 222222 chi nap rut 1tr/lan
        if(req.body.cardID === "222222" && parseInt(req.body.money) > 1000000){
          return res.render('depositeAndWithdraw', { msg: 'The Nay` Chi Dc 1tr 1 lan` giao dich' })
        }
        //the 333333 het tien
        if(req.body.depositAndwithdraw === "In" && req.body.cardID === "333333"){
          return res.render('depositeAndWithdraw', { msg: 'The Het Tien' })
        }
        if (req.body.depositAndwithdraw === "In") {//Deposit Money
          new AtmHistory({
            idUser: req.session.user,
            idCard: req.body.cardID,
            money: req.body.money,
            Status: 0,
            StatusSuccess: "thanh cong",
            createdAt: Date.now(),
          }).save()
            .then(() => {
              //update user money
              User.findOne({ username: req.session.user }, function (err, users) {
                let money = parseInt(users.Money) + parseInt(req.body.money)
                User.updateOne({ username: req.session.user },
                  { Money: money },
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
        } else {//WithDraw Money
          let fee = parseInt(req.body.money) * 5 / 100
          let finalmoney = parseInt(req.body.money) + fee
          if (req.body.money >= 5000000) {//cho phe duyet khi tien` lon hon 5tr
            new AtmHistory({
              idUser: req.session.user,
              idCard: req.body.cardID,
              money: finalmoney,
              Status: 1,
              StatusSuccess: "cho phe duyet",
              createdAt: Date.now(),
            }).save()
              .then(() => {
                return res.render('depositeAndWithdraw', { msg1: 'WithDraw Waiting' })
              });
          } else {// tien` be hon 5tr
            new AtmHistory({
              idUser: req.session.user,
              idCard: req.body.cardID,
              money: finalmoney,
              Status: 1,
              StatusSuccess: "thanh cong",
              createdAt: Date.now(),
            }).save()
              .then(() => {
                //update user money
                User.findOne({ username: req.session.user }, function (err, users) {
                  let money = users.Money - finalmoney
                  User.updateOne({ username: req.session.user },
                    { Money: money },
                    function (err, docs) {
                      if (err) {
                        console.log(err)
                      }
                      else {
                        return res.render('depositeAndWithdraw', { msg1: 'WithDraw SuccessFully and your fee: '+fee })
                      }
                    });
                })

              });
          }
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
