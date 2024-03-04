const mongoose = require('mongoose')

// Companies
const companies = new mongoose.Schema({
    company: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Companies=mongoose.model('Companies',companies)

module.exports=Companies