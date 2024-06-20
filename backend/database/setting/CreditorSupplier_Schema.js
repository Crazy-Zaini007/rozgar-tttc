const mongoose = require('mongoose')


// Crediter Supplier for Without Cash In Hand

const crediterSupplier = new mongoose.Schema({
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


const CreditorSupplier=mongoose.model('crediterSupplier',crediterSupplier)

module.exports=CreditorSupplier