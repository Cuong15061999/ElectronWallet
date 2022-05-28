var mongoose = require('mongoose')
var userSchema =new mongoose.Schema({
    phone: String,//only 1 phone number
    email: String,//only 1 email
    fullname: String,
    birthDay: Date,
    address: String,
    Photos: [String],

    username: String,//random 10 number (take phone number to be a username)
    password: String,//randme 6 word
    CreateAt: Date,
    Money: Number,//=10 000 000(khoi tao.)

    role: String, //admin and user
    newUser: Number,//0 la` user moi, 1 la` user cu~****
    failCount: Number,//0,Login that bai 3 lan` se~ bi 'Dang nhap bat thuong', 3 lan` sai nua se bi 'Vo Hieu Hoa' 
    actStatus: String, //'Xac Minh', *'Cho Xac Minh','Cho Cap Nhat','Vo Hieu Hoa'
    loginStatus: String,//'0', 'Dang nhap bat thuong'

    
})
var User = mongoose.model('User', userSchema)
module.exports = User;