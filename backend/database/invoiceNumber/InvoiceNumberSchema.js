const mongoose = require('mongoose')

const InvoiceNumberSchema = new mongoose.Schema({

    invoice_Number: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


const InvoiceNumber = mongoose.model('invoiceNumber', InvoiceNumberSchema)

module.exports = InvoiceNumber