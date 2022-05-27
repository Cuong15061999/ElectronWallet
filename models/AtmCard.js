var mongoose = require('mongoose')
var AtmCardSchema =new mongoose.Schema({
    
    STT: Number,//enter wrong number mes'the ko duoc ho tro.'
    cardNumber: String,
    expiredAt: Date,//tg het han.
    CVV: String,
    Note: String,
 
})
var AtmCard = mongoose.model('AtmCard', AtmCardSchema)
module.exports = AtmCard;