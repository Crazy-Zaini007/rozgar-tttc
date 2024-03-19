const mongoose = require('mongoose')

//Expenses Schema

const BackupSchema = new mongoose.Schema({
    name: {
        type: String,
      },
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
        type: String,
      },
      payment_In: {
        type: Number,
        default: 0,
      },
      payment_In_Curr: {
        type: String,
      },
      payment_Out: {
        type: Number,
        default: 0,
      },
      payment_Out_Curr: {
        type: String,
        
      },
      slip_Pic: {
        type: String,

      },
      details: {
        type: String,
      },
      date: {
        type: String,

      },
      curr_Rate: {
        type: Number,
        default: 0,
      },
      curr_Amount: {
        type: Number,
        default: 0,
      },
      cash_Out: {
        type: Number,
        default: 0,
      },
      invoice: {
        type: Number,
      },
      cand_Name: {
        type: String,
      }
})


const Backup = mongoose.model('backup', BackupSchema)
module.exports = Backup