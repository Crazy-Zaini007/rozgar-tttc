const mongoose = require('mongoose')


// Countries
const countries = new mongoose.Schema({
    country: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Countries=mongoose.model('Countries',countries)

module.exports=Countries