const mongoose = require('mongoose')


// assetsSchema

const assetsSchema = new mongoose.Schema({
    assetName: {
        type: String,
        required: true
    },
    // supplierCompany: {
    //     type: String,
    //     required: true
    // },
    // country: {
    //     type: String,
    // },
    // contact: {
    //     type: String,
    //     required: true
    // },
    // address: {
    //     type: String,
    // },
    picture: {
        type: String,
       
    }
}, { timestamps: true })


const MyAssets=mongoose.model('myassets',assetsSchema)

module.exports=MyAssets