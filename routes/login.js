var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
const nodemailer = require("nodemailer");
var User = require('../models/user');
const UserOTP = require('../models/userOTP');
const sendOtpVerificationEmail = async (email, res) => {
  console.log(email)
  try {
    const otp = `${Math.floor(10000 + Math.random() * 90000)}`;
    new UserOTP({
      idUser: email,
      OTP: otp,
      createdAt: Date.now(),
      expiredAt: Date.now() + 300000,
    }).save(function (err) {
      if (err) throw err;
      console.log('Successfully saved new OTP.');
    });

    //transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      service: 'Gmail',
      auth: {
        user: 'phamvqcuong99@gmail.com', // generated ethereal user
        pass: 'Quoccuong_999', // generated ethereal password
      },
    });

    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    //mail options
    const mailOptions = {
      from: 'phamvqcuong99@gmail.com',
      to: email,
      subject: " Otp to Verify Your Email",
      html: `<p>Here is your OTP to refresh your password: <b>${otp}</b> </p>
      <p>This code expires in <b>5 min</b> </p>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    })
  }
};
const sendUserNamePassword = async (email, username, password, res) => {
  console.log(email + " " + username + " " + password)
  try {

    //transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      service: 'Gmail',
      auth: {
        user: 'phamvqcuong99@gmail.com', // generated ethereal user
        pass: 'Quoccuong_999', // generated ethereal password
      },
    });

    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    //mail options
    const mailOptions = {
      from: 'phamvqcuong99@gmail.com',
      to: email,
      subject: " Otp to Verify Your Email",
      html: `<p>Here is your UserName <b>${username}</b> and your Password: <b>${password}</b> </p>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    })
  }
};
/* GET home page. */
//Login
router.get('/login', async (req, res,) => {
  return res.render('login')
});

router.post('/login', async (req, res,) => {
  let login = await User.findOne({ username: req.body.username });
  if (!login) {
    return res.render('login', { msg: 'Invalid account. Pls Create One' })
  } else {
    if (req.body.password === login.password) {// if password right
      //save username in env
      req.session.user = login.username
      console.log('save username ' + req.session.user)

      //if account be disabled
      if (login.actStatus === "Vo Hieu Hoa") {
        return res.render('login', { msg: 'Your Account was Disable. Pls contact admin.' })
      } else if (login.newUser === 0) {

        //if you are new user. move to changepass page
        return res.redirect('ChangePass')
      } else if (login.newUser === 1) { // if user is old user
        if (login.role === "user") {
          //move to page index and update loginstatus, failcount
          User.updateOne({ username: req.body.username },
            { loginStatus: "0", failCount: 0 },
            function (err, docs) {
              if (err) {
                console.log(err.message)
              }
              else {
                return res.redirect('index')
              }
            });
        } else {
          //move to page admin
          return res.redirect('admin')
        }
      }
    } else {//if your password was wrong
      //bi trang thai vo hieu hoa va` dang nhap sai
      if (login.actStatus === "Vo Hieu Hoa") {
        return res.render('login', { msg: 'Your Account was Disable. Pls contact admin.' })
      }
      //sai 3 lan va` co trang thai bat thuong
      if (login.loginStatus === "Dang nhap bat thuong" && login.failCount === 3) {
        User.updateOne({ username: req.body.username }, { actStatus: "Vo Hieu Hoa" },
          function (err, docs) {
            if (err) {
              console.log(err)
            }
            else {
              return res.render('login', { msg: 'Your Account was disable.' })
            }
          });
        //sai 3 lan va` chua co trang thai bat thuong
      } else if (login.loginStatus === '0' && login.failCount === 3) {
        User.updateOne({ username: req.body.username }, { loginStatus: "Dang nhap bat thuong", failCount: 0 },
          function (err, docs) {
            if (err) {
              console.log(err)
            }
            else {
              return res.render('login', { msg: 'You already login failed 3 time. Be Careful' })
            }
          });
        //nhưng tl khac de lam` tang bien failcount
      } else {
        let Count = login.failCount + 1
        User.updateOne({ username: req.body.username }, { failCount: Count },
          function (err, docs) {
            if (err) {
              console.log(err)
            }
            else {
              return res.render('login', { msg: 'Wrong Password ' + Count + ' times' })
            }
          });
      }
    }
  }
});

// Register
router.get('/register', function (req, res, next) {

  return res.render('register')
});

router.post('/register', async (req, res,) => {
  let phone = await User.findOne({ phone: req.body.phone });
  let email = await User.findOne({ email: req.body.email });
  console.log(req.body.photo1 + " " + req.body.photo2)
  let userEmail = req.body.email
  let username1 = req.body.phone;
  let password = Math.floor(100000 + Math.random() * 900000)
  if (phone || email) {
    return res.render('register', { msg: 'Phone Or Email Already Used' })
  }
  else {
    new User({
      phone: req.body.phone,
      email: req.body.email,
      fullname: req.body.name,
      birthDay: req.body.date,
      address: req.body.address,
      Photos: [req.body.photo1, req.body.photo2],

      username: username1,
      password: password,
      CreateAt: Date.now(),
      Money: 10000000,

      role: 'user',
      newUser: 0,
      failCount: 0,
      actStatus: 'Cho Xac Minh',
      loginStatus: '0',
    }).save()
      .then(() => {
        sendUserNamePassword(userEmail, username1, password, res)
        return res.render('login', { msg1: 'UserName & Password sended to your email' })
      });
  }
});

//forgot pass
router.get('/forgotpass', function (req, res, next) {
  return res.render('forgotpass')
});
router.post('/forgotpass', function (req, res, next) {
  var emailUser = req.body.email

  User.find({ email: emailUser }, function (err, users) {
    //console.log(users.length)
    if (!users.length) {
      console.log('Your email not in the database. Pls create')
    } else {
      console.log('Your email in the database')
      sendOtpVerificationEmail(emailUser, res)
      return res.render('OtpPage', { emailinfo: emailUser });
    }
  })
});

//Opt Page
router.get('/OtpPage', function (req, res, next) {
  return res.render('OtpPage')
})
router.post('/OtpPage', function (req, res, next) {
  let { email, otp, password, password2 } = req.body;
  if (!email || !otp || !password || !password2) {
    console.log('pls enter all information')
  } else {
    UserOTP.find({ idUser: email }, function (err, UserOTPs) {
      console.log(UserOTPs)
      console.log(UserOTPs[0]._id)

      //check EMAIL
      if (!UserOTPs.length) {
        console.log('you haven not send mail to get OTP yet');
        return
      } else {
        console.log('expiredAt ' + UserOTPs[0].expiredAt)
        console.log('CreatedAt ' + UserOTPs[0].createdAt)
        let DateNow = new Date().toString()
        console.log('Now  ' + DateNow)

        //Check expired time
        if (Date.parse(UserOTPs[0].expiredAt) < Date.parse(DateNow)) {
          console.log('you OTP already expried Please send request again')
          UserOTP.deleteMany({ idUser: email },
            function (err, docs) {
              if (err) {
                console.log(err)
              }
              else {
                console.log("Updated Docs : ", docs);
              }
            })
          return res.render('forgotpass')
        } else {
          //CHECK OTP
          if (otp === UserOTPs[0].OTP) {
            console.log('Your OTP is correct')

            //CHECK BOTH PASSWORD
            if (password === password2) {
              User.updateOne({ email: email }, { password: password },
                function (err, docs) {
                  if (err) {
                    console.log(err)
                  }
                  else {
                    console.log("Updated Docs : ", docs);
                  }
                });
              UserOTP.deleteMany({ idUser: email },
                function (err, docs) {
                  if (err) {
                    console.log(err)
                  }
                  else {
                    console.log("Updated Docs : ", docs);
                  }
                });
              return res.render('login')
            }
            else {
              console.log('2 password must be the same')
              return res.render('OtpPage', { emailinfo: email })
            }

          } else {
            console.log('Your OTP is wrong')
          }
        }
      }
    })
  }

});

//Change pass
router.post('/ChangePass', async (req, res) => {
  console.log('username already saved: ' + req.session.user)
  let UserChange = await User.findOne({ username: req.session.user });
  if (!UserChange) {
    return res.render('ChangePass', { msg: "Can't find Username in Data" })
  } else {
    //compare old password
    if (UserChange.password === req.body.oldpassword) {
      //compare 2 new password
      if (req.body.newpassword === req.body.newpassword2) {
        //update if all was right
        User.updateOne({ username: req.session.user },
          { password: req.body.newpassword, newUser: 1, loginStatus: "0", failCount: 0 },
          function (err, docs) {
            if (err) {
              console.log(err)
            }
            else {
              return res.redirect('index')
            }
          });
      } else {
        //if 2 new password was wrong
        return res.render('ChangePass', { msg: "New Password & Confirm Password are different" })
      }
    } else {
      //if old password wrong
      return res.render('ChangePass', { msg: "Your old password is wrong" })
    }

  }
});

router.get('/ChangePass', function (req, res, next) {
  return res.render('ChangePass')
});


module.exports = router;
