var mongoose = require('mongoose')
var phoneCHistorySchema =new mongoose.Schema({

    idUser: String,
    idPhoneCard: String,
    totalMoney: Number[10],
    NumberPC: Number,// 0 la` nap , 1 la` rut
    createdAt: Date,//ngay` tao.
})
var phoneCHistory = mongoose.model('PhoneCHistory', phoneCHistorySchema)
module.exports = phoneCHistory;