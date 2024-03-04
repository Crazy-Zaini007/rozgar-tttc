const mongoose = require('mongoose')


// Visa Sales Parties

const visaSalesParty = new mongoose.Schema({
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



const VSP=mongoose.model('VSP',visaSalesParty)
module.exports=VSP
