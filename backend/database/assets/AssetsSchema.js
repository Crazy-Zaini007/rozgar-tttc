const mongoose = require("mongoose");

const payment_In_Schema = new mongoose.Schema(
  {
    assetName: {
      type: String,
    },
    total_Payment_In: {
      type: Number,
      default: 0,
    },
    total_Payment_Out: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    payment: [
      {
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
        payment_Out: {
          type: Number,
          default: 0,
        },
        payment_In_Curr: {
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
        invoice: {
          type: Number,
        },
      },
    ],
   
  },
  { timestamps: true }
);

const AssetsSchema = new mongoose.Schema({
  payment_In_Schema: payment_In_Schema,
})

const Assets = mongoose.model("assets", AssetsSchema);
module.exports = Assets
