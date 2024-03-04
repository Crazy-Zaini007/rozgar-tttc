const mongoose = require('mongoose')

// Visit Purchase Parties

const visitPurchaseParties = new mongoose.Schema({
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


const VIPP=mongoose.model('VIPP',visitPurchaseParties)
module.exports=VIPP
