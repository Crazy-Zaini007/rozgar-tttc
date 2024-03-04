const mongoose = require('mongoose')

//Expenses Schema

const ExpenseSchema = new mongoose.Schema({
    date: {

    },
    name: {
        type: String

    },
    payment_Out: {
        type: Number,
        default: 0
    },
    expCategory: {
        type: String

    },
    payment_Via: {
        type: String

    },
    payment_Type: {
        type: String

    },
    slip_No: {
        type: String

    },
    slip_Pic: {
        type: String

    },
    details: {
        type: String

    },
    curr_Country: {
        type: String

    },
    curr_Rate: {
type:Number,
default:0
    },
    curr_Amount: {
        type:Number,
        default:0
    },
    invoice: {
        type: Number,
        default: 0
    }
})


const Expenses = mongoose.model('expenses', ExpenseSchema)
module.exports = Expenses