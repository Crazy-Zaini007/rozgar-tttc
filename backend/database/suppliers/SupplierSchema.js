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
    total_Visa_Price_In_PKR: {
      type: Number,
      default: 0,
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
      default: 0,
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
    persons: [
      {
        name: {
          type: String,
        },
        pp_No: {
          type: String,
        },
        entry_Mode: {
          type: String,
        },
        trade: {
          type: String,

        },
        contact: {
          type: String,
        },
        visa_Price_In_PKR: {
          type: Number,
          default: 0,
        },
        total_In:{
          type: Number,
          default: 0,
        },
        remaining_Price: {
          type: Number,
          default: 0,
        },
        visa_Price_In_Curr: {
          type: Number,
          default: 0,
        },
        remaining_Curr: {
          type: Number,
          default: 0,
        },
        cash_Out:{
          type: Number,
          default: 0,
        },
        company: {
          type: String,
        },
        country: {
          type: String
        },
        final_Status: {
          type: String,
        },
        flight_Date: {
          type: String,
        },
        entry_Date: {},
      },
    ],
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
        cand_Name: {
          type: String,
        },
      },
    ],
    open: {
      type: Boolean,
      default: true,
    },
    close: {
      type: Boolean,
      default: false,
    },
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
    total_Visa_Price_Out_PKR: {
      type: Number,
      default: 0,
    },
    total_Cash_Out: {
      type: Number,
      default: 0,
    },
    total_Payment_Out: {
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
    persons: [
      {
        name: {
          type: String,
        },
        pp_No: {
          type: String,
        },
        entry_Mode: {
          type: String,
        },
        contact: {
          type: String,
        },
        visa_Price_Out_PKR: {
          type: Number,
          default: 0,
        },
        total_In:{
          type: Number,
          default: 0,
        },
        remaining_Price: {
          type: Number,
          default: 0,
        },
        visa_Price_Out_Curr: {
          type: Number,
          default: 0,
        },
        remaining_Curr: {
          type: Number,
          default: 0,
        },
        cash_Out:{
          type: Number,
          default: 0,
        },
        trade: {
          type: String,

        },
        country: {
          type: String
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
        entry_Date: {

        },
      },
    ],
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
        cand_Name: {
          type: String,
        },
      },
    ],
    open: {
      type: Boolean,
      default: true,
    },
    close: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//  Suppliers Schema

const SupplierSchema = new mongoose.Schema(
  {
    payment_In_Schema: Payment_InSchema,
    payment_Out_Schema: Payment_OutSchema,
  },
  { timestamps: true }
);

const Suppliers = mongoose.model("suppliers", SupplierSchema);
module.exports = Suppliers;
