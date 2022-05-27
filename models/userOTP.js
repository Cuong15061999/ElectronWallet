var mongoose = require('mongoose')
var userOTPSchema =new mongoose.Schema({
    idUser: String,
    OTP: String,
    createdAt: Date,//ngay` tao.
    expiredAt: Date,// tg het han. 1-5p ke tu luc tap.
 
})
var UserOTP = mongoose.model('UserOtp', userOTPSchema)
module.exports = UserOTP;