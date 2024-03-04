const mongoose = require('mongoose')

//Currency Country
const currCountries = new mongoose.Schema({
    currCountry: {
        type: String,
        required: true
    }
}, { timestamps: true })


const CurrCountries=mongoose.model('CurrCountries',currCountries)

module.exports=CurrCountries