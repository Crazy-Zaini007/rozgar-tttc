const mongoose = require('mongoose')

const ReminderSchema=new mongoose.Schema({
    type:{
        type:String
    },
    content:{
        type:String
    },
    date:{
        type:String
    }
},{timestamps:true})

const Reminders = mongoose.model('reminders', ReminderSchema)
module.exports = Reminders
