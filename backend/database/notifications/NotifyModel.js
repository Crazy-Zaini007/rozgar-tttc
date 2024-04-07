const mongoose = require('mongoose')

// Notifications Schema
const NotifySchema=new mongoose.Schema({
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

const Notifications = mongoose.model('notifications', NotifySchema)
module.exports = Notifications
