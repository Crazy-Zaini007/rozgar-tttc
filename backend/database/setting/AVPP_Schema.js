const mongoose = require('mongoose')

// Azad Visa Purchase Parties
const addAzadVisaPurchaseParty = new mongoose.Schema({
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

const AVPP=mongoose.model('AVPP',addAzadVisaPurchaseParty)

module.exports=AVPP