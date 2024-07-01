const mongoose = require('mongoose')

const CashInHandSchema = new mongoose.Schema({

    bank_Cash: {
        type: Number,
        default: 0
    },
    cash: {
        type: Number,
        default: 0
    },
    total_Cash: {
        type: Number,
        default: 0
    },
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
            type: String,
          },
          payment_In: {
            type: Number,
            default: 0,
          },
          payment_Out: {
            type: Number,
            default: 0,
          },
          payment_In_Curr: {
            type: String,
            default:''
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
          invoice: {
            type: Number,
          },
          curr_Rate: {
            type: Number,
            default: 0,
          },
          curr_Amount: {
            type: Number,
            default: 0,
          },
          
        },
      ],
}, { timestamps: true })

const CashInHand = mongoose.model('cashinhand', CashInHandSchema)

module.exports = CashInHand