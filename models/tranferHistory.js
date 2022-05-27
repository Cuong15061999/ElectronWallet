var mongoose = require('mongoose')
var tranferHistorySchema =new mongoose.Schema({

    idSender: String,
    idReceiver: String,
    money: Number[10],
    createdAt: Date,//ngay` tao.
})
var tranferHistory = mongoose.model('TranferHistory', tranferHistorySchema)
module.exports = tranferHistory;