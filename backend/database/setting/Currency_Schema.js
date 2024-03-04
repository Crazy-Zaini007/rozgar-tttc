const mongoose = require('mongoose')

// Currencies

const currencies = new mongoose.Schema({
    currency: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Currencies=mongoose.model('Currencies',currencies)

module.exports=Currencies