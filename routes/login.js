var express = require('express');
const { redirect } = require('express/lib/response');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
//Login
router.get('/login', async(req, res, )=>{
  return res.render('login')
});
router.post('/login', async(req, res, )=>{
  let login= await User.findOne({username : req.body.username,password : req.body.password});
  let newuser= await User.findOne({username : req.body.username,password : req.body.password,newUser:1})//0 la` user moi, 1 la` user cu~
  if (login){
    if (newuser){
      return res.render('index')}
    else{
      return res.render('ChangePass')
    }
  }
  else{
    return res.render('login',{username: req.body.username, msg:'sai tk mk'})
  }
});
// Register
router.get('/register', function(req, res, next) {
  
  return res.render('register')
});

router.post('/register', async(req, res, )=>{
  let phone= await User.findOne({phone : req.body.phone});
  let email= await User.findOne({email : req.body.email});
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
      Photos:[],

      username: req.body.phone,
      password: Math.floor(100000 + Math.random() * 900000),
      CreateAt: Date.now(),

      role: 'user',
      newUser: 0,
      failCount: 0,
      actStatus: 'Cho Xac Minh',
      loginStatus: '0',
    }).save().then(()=>res.redirect('login',{msg:username,passsword}));
}});
//forgot pass
router.get('/forgotpass', function(req, res, next) {
  
  return res.render('forgotpass')
});

//Opt Page
router.get('/OtpPage', function(req, res, next) {
  
  return res.render('OtpPage')
});

//Change pass
router.post('/ChangePass', async(req, res)=>{
  let login= await User.findByIdAndUpdate({password: req.body.oldpassword},{username:usernmae},{new:true});
  
  if(login){
    User.updateMany(
      {newUser:'0'},{$set:{passsword:req.body.newpassword,newUser:'1'}
      }
    )
  }else{
    return res.render('ChangePass',{username: req.body.username, msg:'Sai mật khẩu'})}
});
router.get('/ChangePass', function(req, res, next) {
  return res.render('ChangePass')
});
//index
router.get('/index', function(req, res, next) {
  return res.render('index')
});
module.exports = router;
