const mongoose = require('mongoose')

// Azad Visa Sales Parties

const addAzadVisaSalesParty = new mongoose.Schema({
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

const AVSP=mongoose.model('AVSP',addAzadVisaSalesParty)

module.exports=AVSP
