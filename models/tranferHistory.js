var mongoose = require('mongoose')
var tranferHistorySchema =new mongoose.Schema({

    idSender: String,
    idReceiver: String,
    money: Number,
    createdAt: Date,//ngay` tao.
    Status: String //'Thanh Cong', 'That Bai'
})
var tranferHistory = mongoose.model('TranferHistory', tranferHistorySchema)
module.exports = tranferHistory;