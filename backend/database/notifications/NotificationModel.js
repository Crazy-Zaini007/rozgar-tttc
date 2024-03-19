const mongoose = require('mongoose')

const NotificationSchema=new mongoose.Schema({
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

const Notifications = mongoose.model('notification', NotificationSchema)
module.exports = Notifications
