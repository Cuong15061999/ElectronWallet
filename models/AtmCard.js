var mongoose = require('mongoose')
var AtmCardSchema =new mongoose.Schema({
    
    STT: Number,
    cardNumber: String,//enter wrong number mes'the ko duoc ho tro.'
    expiredAt: Date,//tg het han.
    CVV: String,
    Note: String,
 
})
var AtmCard = mongoose.model('AtmCard', AtmCardSchema)
module.exports = AtmCard;