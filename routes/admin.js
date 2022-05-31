var express = require('express');
var router = express.Router();
var User = require('../models/user')
/* GET home page. (DONE)*/
router.get('/', function (req, res, next) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  //
  User.find({}, function (err, users) {
    if (err) {
      throw err
    } else {
      //console.log(users)
      let userInAdminPage = []
      users.forEach((u) => {
        userInAdminPage.push({
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
      console.log(userInAdminPage)
      return res.render('admin',{userInAdminPage})
    }
  }).sort({ CreateAt: -1 });
});

/* GET activatedAccount page. */
router.get('/activatedAccount', function (req, res, next) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }

  User.find({ actStatus: 'Xac Minh' }, function (err, users) {
    if (err) {
      throw err
    } else {
      let confirmUsers = []
      users.forEach((u) => {
        confirmUsers.push({
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
      return res.render('activatedAccount', { user: confirmUsers })
    }
  }).sort({ CreateAt: -1 });
});
router.post('/updateStatus7', function (req, res) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  console.log(req.body.user_id)
  User.findByIdAndUpdate(req.body.user_id, { actStatus: 'Cho Cap Nhap' }, function (err, user) {
    if (err) {
      throw err;
    } else {
      res.redirect('/admin/activatedAccount');
    }
  });
});
router.post('/updateStatus8', function (req, res) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  console.log(req.body.user_id)
  User.findByIdAndUpdate(req.body.user_id, { actStatus: 'Vo Hieu Hoa' }, function (err, user) {
    if (err) {
      throw err;
    } else {
      res.redirect('/admin/activatedAccount');
    }
  });
});

/* GET waitActiveAccount page. */
//waitActiveAccount (done)
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

router.post('/updateStatus', function (req, res) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  console.log(req.body.user_id)
  User.findByIdAndUpdate(req.body.user_id, { actStatus: 'Xac Minh' }, function (err, user) {
    if (err) {
      throw err;
    } else {
      res.redirect('/admin/waitActiveAccount');
    }
  });
});

router.post('/updateStatus2', function (req, res) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  console.log(req.body.user_id)
  User.findByIdAndUpdate(req.body.user_id, { actStatus: 'Cho Cap Nhap' }, function (err, user) {
    if (err) {
      throw err;
    } else {
      res.redirect('/admin/waitActiveAccount');
    }
  });
});

router.get('/user/:id', function (req, res, next) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  User.findById(req.params.id, function (err, users) {
    if (err) {
      throw err
    } else {
      return res.render('viewprofile', { user: users, dob: convert(users.birthDay), CreateAt: convert(users.CreateAt), money: users.Money.toLocaleString(), img1: users.Photos[0], img2: users.Photos[1] })
    }
  });
});

/* GET waitUpdateAccount page. (done)*/
router.get('/waitUpdateAccount', function (req, res, next) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  //
  User.find({actStatus: "Cho Cap Nhap"}, function (err, users) {
    if (err) {
      throw err
    } else {
      //console.log(users)
      let waitUpdate = []
      users.forEach((u) => {
        waitUpdate.push({
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
      console.log(waitUpdate)
      return res.render('waitUpdateAccount',{waitUpdate})
    }
  }).sort({ CreateAt: -1 });
});
router.post('/updateStatus4', function (req, res) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  console.log(req.body.user_id)
  User.findByIdAndUpdate(req.body.user_id, { actStatus: 'Xac Minh' }, function (err, user) {
    if (err) {
      throw err;
    } else {
      res.redirect('/admin/waitUpdateAccount');
    }
  });
});
router.post('/updateStatus5', function (req, res) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  console.log(req.body.user_id)
  User.findByIdAndUpdate(req.body.user_id, { actStatus: 'Vo Hieu Hoa' }, function (err, user) {
    if (err) {
      throw err;
    } else {
      res.redirect('/admin/waitUpdateAccount');
    }
  });
});

/* GET disableAccount page. (done)*/
router.get('/disableAccount', function (req, res, next) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  //
  User.find({actStatus: "Vo Hieu Hoa"}, function (err, users) {
    if (err) {
      throw err
    } else {
      //console.log(users)
      let disableUser = []
      users.forEach((u) => {
        disableUser.push({
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
      console.log(disableUser)
      return res.render('disableAccount',{disableUser})
    }
  }).sort({ CreateAt: -1 });
});
router.post('/updateStatus3', function (req, res) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  console.log(req.body.user_id)
  User.findByIdAndUpdate(req.body.user_id, { actStatus: 'Cho Xac Minh' }, function (err, user) {
    if (err) {
      throw err;
    } else {
      res.redirect('/admin/disableAccount');
    }
  });
});
router.post('/updateStatus6', function (req, res) {
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  console.log(req.body.user_id)
  User.findByIdAndUpdate(req.body.user_id, { actStatus: 'Cho Cap Nhap' }, function (err, user) {
    if (err) {
      throw err;
    } else {
      res.redirect('/admin/disableAccount');
    }
  });
});

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}
module.exports = router;