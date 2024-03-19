const mongoose = require('mongoose')

const NotesSchema=new mongoose.Schema({
    title:{
        type:String
    },
    content:{
        type:String
    },
    date:{
        type:String
    }
},{timestamps:true})

const Notes = mongoose.model('notes', NotesSchema)
module.exports = Notes
