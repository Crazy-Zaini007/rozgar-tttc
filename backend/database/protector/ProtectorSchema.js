const mongoose = require('mongoose');

//Payment_Out Schema
const Payment_OutSchema = new mongoose.Schema({
    supplier_Id: {
        type: String

    },
    supplierName: {
        type: String

    },
    total_Protector_Price_Out_PKR: {
        type: Number,
        default: 0

    },
    total_Payment_Out: {
        type: Number,
        default: 0
    },
    remaining_Balance: {
        type: Number,
        default: 0
    },
    total_Protector_Price_Out_Curr: {
        type: Number,
        default: 0

    },
    total_Payment_Out_Curr: {
        type: Number,
        default: 0
    },
    remaining_Curr: {
        type: Number,
        default: 0
    },
    curr_Country: {
        type: String

    },
    status:{
        type:String,
        default:"Open"
            },
    persons: [
        {
            name: {
                type: String
            },
            picture:{
                type: String
            },
            pp_No: {
                type: String

            },
            entry_Mode: {
                type: String

            },
            protector_Out_PKR: {
                type: Number,
                default: 0
            },
            protector_Out_Curr: {
                type: Number,
                default: 0

            },
            company: {
                type: String

            },
            final_Status: {
                type: String

            },
            flight_Date: {
                type: String
            },
            entry_Date: {
                type: String,
    
            },
            status:{
                type:String,
                default:"Open"
                    },
        }
    ],
    payment: [
        {
            category: {
                type: String,
                required: true,
            },
            payment_Via: {
                type: String,
                required: true,
            },
            payment_Type: {
                type: String,
                required: true,
            },
            slip_No: {
                type: String

            },
            payment_Out: {
                type: Number,
                default: 0
            },
            payment_Out_Curr: {
                type: String


            },
            slip_Pic: {
                type: String

            },
            details: {
                type: String,
               
            },
            date: {

            },
            curr_Rate: {
                type: Number,
                default: 0
            },
            curr_Amount: {
                type: Number,
                default: 0

            },
            invoice: {
                type: Number
            }
        }
    ],
}, { timestamps: true })

//  Protector Schema

const ProtectorSchema = new mongoose.Schema({
    payment_Out_Schema: Payment_OutSchema

}, { timestamps: true })

const Protector = mongoose.model('protector', ProtectorSchema);
module.exports = Protector