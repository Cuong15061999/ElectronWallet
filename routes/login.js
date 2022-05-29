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

/* GET home page. */
//Login
router.get('/login', async(req, res, )=>{ 

  return res.render('login')
});

//sai qua nhieu`******
router.post('/login', async(req, res, )=>{
  let login= await User.findOne({username : req.body.username,password : req.body.password});
  let newuser= await User.findOne({username : req.body.username,password : req.body.password,newUser:1})//0 la` user moi, 1 la` user cu~
  console.log(login)
  console.log(newuser)
  if (login){
    if (newuser){
      return res.render('index')}
    else{
      return res.render('ChangePass')
    }
  }
  else{
    return res.render('ChangePass',{username: req.body.username, msg:'sai tk mk'})
  }
});
// Register
router.get('/register', function (req, res, next) {

  return res.render('register')
});

router.post('/register', async(req, res, )=>{
  let phone= await User.findOne({phone : req.body.phone});
  let email= await User.findOne({email : req.body.email});
  let username1 = req.body.phone;
  let password = Math.floor(100000 + Math.random() * 900000)
  if (phone || email){
    return res.render('register',{username: req.body.username, msg:'Số điện Thoại hoặc Email đã dùng'})
  }
  else {
    new User({
      phone: req.body.phone,
      email: req.body.email,
      fullname: req.body.name,
      birthDay: req.body.date,
      address: req.body.address,
      Photos:[req.body.image, req.body.image2],

      username: username1,
      password: password,
      CreateAt: Date.now(),
      Money: 10000000,

      role: 'user',
      newUser: 0,
      failCount: 0,
      actStatus: 'Cho Xac Minh',
      loginStatus: '0',
    }).save().then(()=>res.redirect('login'));
}});

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
router.get('/OtpPage', function (req, res, next){
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
            else{
              console.log('2 password must be the same')
              return res.render('OtpPage',{ emailinfo: email })
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
router.post('/ChangePass', async(req, res)=>{
  console.log(req.body.username)
  // let login= await User.findByIdAndUpdate({password: req.body.oldpassword},{username:usernmae},{new:true});
  
  // if(login){
  //   User.updateMany(
  //     {newUser:'0'},{$set:{passsword:req.body.newpassword,newUser:'1'}
  //     }
  //   )
  // }else{
    //return res.render('ChangePass',{username: req.body.username, msg:'Sai mật khẩu'})}
});

router.get('/ChangePass', function(req, res, next) {
  return res.render('ChangePass')
});


module.exports = router;
