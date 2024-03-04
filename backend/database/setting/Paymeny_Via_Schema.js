const mongoose = require('mongoose')

// Payment Via
const paymentVia = new mongoose.Schema({
    payment_Via: {
        type: String,
        required: true
    }
}, { timestamps: true })

const PaymentVia=mongoose.model('PaymentVia',paymentVia)

module.exports=PaymentVia