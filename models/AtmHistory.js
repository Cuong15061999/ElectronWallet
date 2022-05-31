var mongoose = require('mongoose')
var atmHistorySchema =new mongoose.Schema({
    idUser: String,
    idCard: String,
    money: Number,
    Status: String,// "nap" , "rut"
    StatusSuccess: String,// thanh cong, cho phe duyet
    createdAt: Date,//ngay` tao.
})
var atmHistory = mongoose.model('AtmHistory', atmHistorySchema)
module.exports = atmHistory;