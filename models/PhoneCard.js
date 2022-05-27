var mongoose = require('mongoose')
var phoneCardSchema =new mongoose.Schema({
    
    STT: Number,//enter wrong number mes'the ko duoc ho tro.'
    cardName: String,
    cardNumber: String,
 
})
var phoneCard = mongoose.model('PhoneCard', phoneCardSchema)
module.exports = phoneCard;