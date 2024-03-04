const mongoose = require('mongoose')

// Payment Type
const paymentType = new mongoose.Schema({
    payment_Type: {
        type: String,
        required: true
    }
}, { timestamps: true })


const PaymentType=mongoose.model('PaymentType',paymentType)

module.exports=PaymentType