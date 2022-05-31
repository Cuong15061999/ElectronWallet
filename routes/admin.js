var express = require('express');
var router = express.Router();
var User = require('../models/user')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('admin', { title: 'Express' });
});

/* GET activatedAccount page. */
router.get('/activatedAccount', function (req, res, next) {
  res.render('activatedAccount');
});

/* GET waitActiveAccount page. */
router.get('/waitActiveAccount', function (req, res, next) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }

  User.find({ actStatus: 'Cho Xac Minh' }, function (err, users) {
    if (err) {
      throw err
    } else {
      let newuser = []
      users.forEach((u) => {
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
      return res.render('waitActiveAccount', { user: newuser })
    }
  }).sort({ CreateAt: -1 });
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
      res.redirect('/admin/waitActiveAccount');
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

/* GET waitActiveAccount page. */
router.get('/waitUpdateAccount', function (req, res, next) {
  res.render('waitUpdateAccount');
});

/* GET waitActiveAccount page. */
router.get('/disableAccount', function (req, res, next) {
  res.render('disableAccount');
});

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}
module.exports = router;