const mongoose = require('mongoose')


// Crediter Purchase Parties

const protectorParties = new mongoose.Schema({
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


const ProtectorParties=mongoose.model('protectorParties',protectorParties)

module.exports=ProtectorParties