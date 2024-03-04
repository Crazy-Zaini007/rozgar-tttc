const mongoose = require('mongoose')


// Final Status
const finalStatus = new mongoose.Schema({
    final_Status: {
        type: String,
        required: true
    }
}, { timestamps: true })


const FinalStatus=mongoose.model('FinalStatus',finalStatus)

module.exports=FinalStatus