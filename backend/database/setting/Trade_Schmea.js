const mongoose = require('mongoose')

// Trades

const trades = new mongoose.Schema({
    trade: {
        type: String,
        required: true
    }
}, { timestamps: true })


const Trades=mongoose.model('Trades',trades)

module.exports=Trades