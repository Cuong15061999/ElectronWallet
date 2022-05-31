var express = require('express');
var router = express.Router();
var User = require('../models/user');
var AtmHistory = require('../models/AtmHistory')
var AtmCard = require('../models/AtmCard')
var PhoneCard = require('../models/PhoneCard')
var phoneCHistory = require('../models/PhoneCHistory');
var UserOTP = require('../models/userOTP')
var transferHistory = require('../models/tranferHistory')
const nodemailer = require("nodemailer");

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
      html: `<p>Here is your OTP to Send Your Transfer Money Request: <b>${otp}</b> </p>
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

const sendReceiverEmail = async (email, moneyReceive, moneyNow, note, sender, res) => {
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
      html: `<p>${sender} Have send you <b>${moneyReceive}</b> with note: ${note},and your money in bank: <b>${moneyNow}</b> </p>`
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
/* GET users listing. */
//DASHBOARD Chua co phan trang, (allmost done)
router.get('/', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  User.findOne({ username: req.session.user }, function (err, users) {
    if (err) {
      throw err;
    } else {
      var tempMoney = users.Money
      moneyFormated = tempMoney.toLocaleString()
      transferHistory.find({$or: [{idSender: req.session.user} , {idReceiver: req.session.user}]}, function(err, transferHs){
        AtmHistory.find({idUser: req.session.user}, function(err, atmHs){
          phoneCHistory.find({idUser: req.session.user}, function(err, phoneHs){
            return res.render('index', { users, moneyFormated, phoneHs, atmHs, transferHs})
          }).sort({createdAt: -1})
        }).sort({createdAt: -1})
      }).sort({createdAt: -1})
    }
  });
});

//THONG TIN CHI TIET (done)
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
      return res.render('profile',{title: "Profile",user:users,dob: convert(users.birthDay),CreateAt: convert(users.CreateAt),money: users.Money.toLocaleString(),img1:users.Photos[0],img2:users.Photos[1]})
    }
  });
});
//done
router.post('/profile',function (req,res) {
  User.findByIdAndUpdate(req.body.user_id,{Photos:[req.body.photo1,req.body.photo2]},null,function (err,user) {
    if(err){
      throw err
    }else{
      res.redirect('/index/profile')
    }
  });
});

//Nap & Rut TIEN* Phan get chua gui duoc mess error stop nguoi dung` vao` trang (almost Done)
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
        return res.render('depositeAndWithdraw',{title: "Deposit & Withdraw", user: users, money: users.Money.toLocaleString()})
      } else {
        //chua hien ra flash message
        req.session.flash = {
          info: "Error",
          message: "Chua duoc phep dung` tinh nang nay`"
        }
        // tim` cach gui flash message ve trang index
        return res.redirect('/index')
      }
    }
  });

});


//Moi Ngay chi dc rut 2 lan* (almost Done)
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
        if (req.body.depositAndwithdraw === "Out" && (parseInt(req.body.money) % 50000) != 0) {
          return res.render('depositeAndWithdraw', { msg: 'So Tien Ban Rut Phai Chia Het Cho 50k' })
        }
        //the 222222 chi nap rut 1tr/lan
        if (req.body.cardID === "222222" && parseInt(req.body.money) > 1000000) {
          return res.render('depositeAndWithdraw', { msg: 'The Nay` Chi Dc 1tr 1 lan` giao dich' })
        }
        //the 333333 het tien
        if (req.body.depositAndwithdraw === "In" && req.body.cardID === "333333") {
          return res.render('depositeAndWithdraw', { msg: 'The Het Tien' })
        }
        if (req.body.depositAndwithdraw === "In") {//Deposit Money
          new AtmHistory({
            idUser: req.session.user,
            idCard: req.body.cardID,
            money: req.body.money,
            Status: "Nạp Tiền",
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
                      return res.render('depositeAndWithdraw', { msg1: 'Deposit SuccessFully' ,user: users, money: money.toLocaleString()})
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
              Status: "Rút Tiền",
              StatusSuccess: "cho phe duyet",
              createdAt: Date.now(),
            }).save()
              .then(() => {
                return res.render('depositeAndWithdraw', { msg1: 'WithDraw Waiting'})
              });
          } else {// tien` be hon 5tr
            new AtmHistory({
              idUser: req.session.user,
              idCard: req.body.cardID,
              money: finalmoney,
              Status: "Rút Tiền",
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
                        return res.render('depositeAndWithdraw', { msg1: 'WithDraw SuccessFully and your fee: ' + fee ,user: users, money: money.toLocaleString()  })
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

//Mua the dt. Phan get chua gui duoc mess error stop nguoi dung` vao` trang (almost Done)
router.get('/buyCard', function (req, res, next) {
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
        return res.render('buyCard',{title: "Buy Phone Card", user: users, money: users.Money.toLocaleString()})
      } else {
        //chua hien ra flash message
        req.session.flash = {
          info: "Error",
          message: "Chua duoc phep dung` tinh nang nay`"
        }
        // tim` cach gui flash message ve trang index
        return res.redirect('/index')
      }
    }
  });
});
//done
router.post('/buyCard', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  //caculate totalMoney thay user have to pay
  let totalMoney = parseInt(req.body.typeOfMoney) * parseInt(req.body.amount)
  User.findOne({ username: req.session.user }, function (err, users) {
    //Neu Khong Du Tien` thì se~ ko mua dc
    if (users.Money < totalMoney) {
      return res.render('buyCard', { msg: "Ban Khong Du Tien De Mua" })
    } else {//Neu du tien. Tao ra cardSeri
      PhoneCard.findOne({ cardName: req.body.Company }, function (err, phoneCards) {
        const random = Math.floor(10000 + Math.random() * 90000);
        let cardSeri = phoneCards.cardNumber + random.toString();
        new phoneCHistory({
          idUser: req.session.user,
          idPhoneCard: req.body.Company,
          totalMoney: totalMoney,

          cardSeri: cardSeri,
          fee: 0,
          createdAt: Date.now(),
        }).save()
          .then(() => {
            //update user money
            let money = parseInt(users.Money) - parseInt(totalMoney)
            User.updateOne({ username: req.session.user },
              { Money: money },
              function (err, docs) {
                if (err) {
                  console.log(err)
                }
                else {
                  return res.render('buyCard', { msg1: 'Success CardSeri: ' + cardSeri + ' Total Money: ' + totalMoney + ' fee: 0',user: users, money: money.toLocaleString() })
                }
              });

          });

      })
    }
  })
});

//Chuyen tien`(done)
router.get('/transfer', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }
  User.findOne({ username: req.session.user }, function (err, users) {
    if (err) {
      throw err;
    } else {
      if (users.actStatus === "Xac Minh") {
        return res.render('transfers',{title: "Transaction Money", user: users, money: users.Money.toLocaleString()})
      } else {
        //chua hien ra flash message
        req.session.flash = {
          info: "Error",
          message: "Chua duoc phep dung` tinh nang nay`"
        }
        // tim` cach gui flash message ve trang index
        return res.redirect('/index')
      }
    }
  });
});
//(done)
router.post('/transfer', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  if (!req.session.user) {
    return res.render('login', { msg: "Pls Login Before Enter This Page" })
  }

  console.log(req.body)
  User.findOne({ phone: req.body.Phone, fullname: req.body.name }, function (err, users) {
    //console.log(users)
    if (!users) {
      return res.render('transfers', { msg: "Nhan Sai Thong Tin. OR Ng dung ko ton` tai." })
    } else {
      User.findOne({ username: req.session.user }, function (err, user2) {
        sendOtpVerificationEmail(user2.email, res)
      })
      let noteSend = req.body.note
      console.log(noteSend)
      return res.render('OtpSendMoney', { email: users.email, money: req.body.money, note: noteSend })
    }
  })
});

//OTP Send Money (Done)
router.get('/OtpSendMoney', function (req, res, next) {
  //Check User are Login or Not
  console.log('email user is: ' + req.session.user)
  return res.render('OtpSendMoney')
});
//(done)
router.post('/OtpSendMoney', function (req, res, next) {
  //Check User are Login or Not
  console.log(' username is: ' + req.session.user)
  console.log(req.body)

  User.findOne({ username: req.session.user }, function (err, users) {
    console.log(users.email)
    UserOTP.findOne({ idUser: users.email }, function (err, otps) {
      if (!otps) {
        return res.render('transfers', { msg: "fail to send mail" })
      } else {
        console.log('Da gui mail')
        if (Date.parse(Date.parse(otps.expiredAt) < Date.parse(Date.now()))) {
          console.log('you OTP already expried Please send request again')
          UserOTP.deleteMany({ idUser: users.email },
            function (err, docs) {
              if (err) {
                console.log(err)
              }
              else {
                console.log("Updated Docs : ", docs);
              }
            })
          return res.render('transfers')
        } else {//neu chua het han va` otp dung
          if (req.body.otp === otps.OTP) {
            console.log('OTP DUNG')
            //delete OTP
            UserOTP.deleteMany({ idUser: users.email },
              function (err, docs) {
                if (err) {
                  console.log(err)
                }
                else {
                  console.log("Updated Docs : ", docs);
                }
              })
            //tru tien User Gui
            let newMoney = parseInt(users.Money) - parseInt(req.body.money)
            User.updateOne({ username: req.session.user }, { Money: newMoney },
              function (err, docs) {
                if (err) {
                  console.log(err)
                }
                else {
                  console.log("Updated Sender Docs : ", docs);
                }
              });
            //Cong tien User Nhan
            User.findOne({ email: req.body.email }, function (err, receiver) {
              let recMoney = parseInt(receiver.Money) + parseInt(req.body.money)
              User.updateOne({ username: receiver.username }, { Money: recMoney },
                function (err, docs) {
                  if (err) {
                    console.log(err)
                  }
                  else {
                    console.log("Updated Receiver Docs : ", docs);
                    //send mail tien cho ng nhan
                    sendReceiverEmail(receiver.email, req.body.money, recMoney, req.body.note, users.fullname, res)
                    new transferHistory({
                      idSender: users.username,
                      idReceiver: receiver.username,
                      money: req.body.money,
                      createdAt: Date.now(),
                      Status:"Thanh Cong",
                    }).save()
                      .then(() => {
                        return res.render('transfers', { msg1: 'SEND MONEY SUCCESSFULLY',user: users })
                      });
                  }
                });
            })
          } else {
            return res.render('OtpSendMoney', { msg: "Nhap Sai OTP" })
          }
        }
      }
    })
  })
});

//logout (done)
router.get('/logout', function (req, res, next) {
  //Check User are Login or Not
  req.session.destroy();
  res.render('login');
});
module.exports = router;

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}