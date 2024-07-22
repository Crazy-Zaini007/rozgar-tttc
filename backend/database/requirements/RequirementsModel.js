const mongoose = require('mongoose')

const Comments=new mongoose.Schema({
    description:{
        type:String
    },
    image:{
        type:String
    },
    commentBy:{
        type:String
    }
})

const RequirementsSchema=new mongoose.Schema({
    title:{
        type:String
    },
    content:{
        type:String
    },
    date:{
        type:String
    },
    updatingDate:{
        type:String
    },
    picture:{
        type:String
    },
    status:{
        type:String,
        default:'Pending'
    },
    comments:[Comments]
    
},{timestamps:true})

const Requirements = mongoose.model('requirements', RequirementsSchema)
module.exports = Requirements
