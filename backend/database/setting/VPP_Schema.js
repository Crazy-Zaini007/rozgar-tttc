const mongoose = require('mongoose')

// Visa Purchase Parties

const visaPurchaseParty = new mongoose.Schema({
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

const VPP=mongoose.model('VPP',visaPurchaseParty)
module.exports=VPP
