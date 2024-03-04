const mongoose = require('mongoose')

// Categories
const categories = new mongoose.Schema({
    category: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Categories=mongoose.model('Categories',categories)

module.exports=Categories