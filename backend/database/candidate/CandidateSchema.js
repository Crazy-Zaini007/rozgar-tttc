const mongoose = require("mongoose");

//Payment_In Schema
const Payment_InSchema = new mongoose.Schema(
  {
    supplier_Id: {
      type: String,
    },
    supplierName: {
      type: String,
    },
    picture:{
      type: String,
    },
    pp_No: {
      type: String,
    },
    entry_Mode: {
      type: String,
    },
    trade:{
      type: String,

    },
    country:{
      type:String
              },
    contact:{
      type: String,
    },
    company: {
      type: String,
    },
    final_Status: {
      type: String,
    },
    flight_Date: {
      type: String,
    },
    total_Visa_Price_In_PKR: {
      type: Number,
    },
    total_Payment_In: {
      type: Number,
      default: 0,
    },
    total_Cash_Out: {
      type: Number,
      default: 0,
    },
    remaining_Balance: {
      type: Number,
      default: 0,
    },

    total_Visa_Price_In_Curr: {
      type: Number,
    },
    total_Payment_In_Curr: {
      type: Number,
      default: 0,
    },
    remaining_Curr: {
      type: Number,
      default: 0,
    },
    curr_Country: {
      type: String,
    },
    status:{
      type:String,
      default:"Open"
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
        payment_In_Curr: {
          type: String,

        },
        slip_Pic: {
          type: String,

        },
        details: {
          type: String,

        },
        date: {},
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
 
      },
    ],

  },
  { timestamps: true }
);

//Payment_Out Schema
const Payment_OutSchema = new mongoose.Schema(
  {
    supplier_Id: {
      type: String,
    },
    supplierName: {
      type: String,
    },
    picture:{
      type: String,
    },
    pp_No: {
      type: String,
    },
    entry_Mode: {
      type: String,
    },
    trade:{
      type: String,
    },
    country:{
      type:String
              },
    contact:{
      type: String,
    },
    company: {
      type: String,
    },
    final_Status: {
      type: String,
    },
    flight_Date: {
      type: String,
    },
    total_Visa_Price_Out_PKR: {
      type: Number,
      default: 0,
    },
    total_Payment_Out: {
      type: Number,
      default: 0,
    },
    total_Cash_Out: {
      type: Number,
      default: 0,
    },
    remaining_Balance: {
      type: Number,
      default: 0,
    },
    
    total_Visa_Price_Out_Curr: {
      type: Number,
      default: 0,
    },
    total_Payment_Out_Curr: {
      type: Number,
      default: 0,
    },
    remaining_Curr: {
      type: Number,
      default: 0,
    },
    curr_Country: {
      type: String,
    },
    status:{
      type:String,
      default:"Open"
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
        date: {},
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

      },
    ],
   
  },
  { timestamps: true }
);

//  Candidate Schema

const CandidateSchema = new mongoose.Schema(
  {
    payment_In_Schema: Payment_InSchema,
    payment_Out_Schema: Payment_OutSchema,
  },
  { timestamps: true }
);

const Candidate = mongoose.model("candidates", CandidateSchema);
module.exports = Candidate;
