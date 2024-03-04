const mongoose = require('mongoose')

// Ticket Purchase Parties
const ticketPurchaseParties = new mongoose.Schema({
    supplierName: {
        type: String,
        required: true
    },

    supplierCompany: {
        type: String,
        required: true
    },
    country: {
        type: String,
    },
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    picture: {
        type: String,
       
    }
}, { timestamps: true })


const TPP=mongoose.model('TPP',ticketPurchaseParties)

module.exports=TPP

