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

router.post('/profile',function (req,res) {
  User.findByIdAndUpdate(req.body.user_id,{Photos:[req.body.photo1,req.body.photo2]},null,function (err,user) {
    if(err){
      throw err
    }else{
      res.redirect('/index/profile')
    }
  });
});


//
router.get('/waitActiveAccount',function (req,res,next) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }

  User.find({actStatus:'Cho Xac Minh'},function(err, users){
    if(err){
      throw err
    }else{
      let newuser = []
      users.forEach((u)=>{
        newuser.push({
          _id: u._id,
          phone: u.phone,
          email: u.email,
          fullname: u.fullname,
          birthDay: convert(u.birthDay),
          address: u.address,
          Photos: u.Photos,

          username: u.username,
          password: u.password,
          CreateAt: convert(u.CreateAt),
          Money: u.Money,

          role: u.role,
          newUser: u.newUser,
          failCount: u.failCount,
          actStatus: u.actStatus,
          loginStatus: u.loginStatus
        })
      })

      return res.render('waitActiveAccount',{user:newuser})
    }
  });
});

router.post('/updateStatus',function (req,res) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  console.log(req.body.user_id)
  User.findByIdAndUpdate(req.body.user_id,{actStatus: 'Xac Minh'},function (err,user) {
    if (err){
      throw err;
    }else{
      res.redirect('/index/waitActiveAccount');
    }
  });
});

router.get('/user/:id',function (req,res,next) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  User.findById(req.params.id , function(err, users){
    if(err){
      throw err
    }else{
      return res.render('viewprofile',{user:users,dob: convert(users.birthDay),CreateAt: convert(users.CreateAt),money: users.Money.toLocaleString(),img1:users.Photos[0],img2:users.Photos[1]})
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