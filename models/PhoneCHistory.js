var mongoose = require('mongoose')
var phoneCHistorySchema =new mongoose.Schema({

    idUser: String,
    idPhoneCard: String,
    totalMoney: Number,
    
    cardSeri: String,// day~ 10 so 5 so dau` la` cardNumber
    fee: Number,//thue, hien tai, = 0
    createdAt: Date,//ngay` tao.
})
var phoneCHistory = mongoose.model('PhoneCHistory', phoneCHistorySchema)
module.exports = phoneCHistory;