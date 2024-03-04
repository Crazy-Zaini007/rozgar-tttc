const mongoose = require('mongoose')

// Entry Mode
const entryMode = new mongoose.Schema({
    entry_Mode: {
        type: String,
        required: true
    }
}, { timestamps: true })

const EntryMode=mongoose.model('EntryMode',entryMode)

module.exports=EntryMode
