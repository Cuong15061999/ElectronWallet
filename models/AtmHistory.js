var mongoose = require('mongoose')
var atmHistorySchema =new mongoose.Schema({
    idUser: String,
    idCard: String,
    money: Number[10],
    Status: Number,// 0 la` nap , 1 la` rut
    createdAt: Date,//ngay` tao.
})
var atmHistory = mongoose.model('AtmHistory', atmHistorySchema)
module.exports = atmHistory;