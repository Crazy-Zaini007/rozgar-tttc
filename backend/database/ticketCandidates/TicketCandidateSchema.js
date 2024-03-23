const mongoose = require("mongoose");

//Payment_In Schema
const Candidate_Payment_InSchema = new mongoose.Schema(
  {
    supplier_Id: {
      type: String,
    },
    supplierName: {
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
          type: String

        },
        slip_Pic: {
          type: String

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
const Candidate_Payment_OutSchema = new mongoose.Schema(
  {
    supplier_Id: {
      type: String,
    },
    supplierName: {
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
        type: String

        },
        slip_Pic: {
        type: String

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

const TicketCandidateSchema = new mongoose.Schema(
  {
    Candidate_Payment_In_Schema: Candidate_Payment_InSchema,
    Candidate_Payment_Out_Schema: Candidate_Payment_OutSchema,
  },
  { timestamps: true }
);

const TicketCandidate = mongoose.model("ticketCandidate", TicketCandidateSchema);
module.exports = TicketCandidate;
