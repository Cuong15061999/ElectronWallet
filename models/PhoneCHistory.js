var mongoose = require('mongoose')
var phoneCHistorySchema =new mongoose.Schema({

    idUser: String,
    idPhoneCard: String,
    totalMoney: Number[10],
    NumberPC: Number,// the mang menh gia gi`
    createdAt: Date,//ngay` tao.
})
var phoneCHistory = mongoose.model('PhoneCHistory', phoneCHistorySchema)
module.exports = phoneCHistory;