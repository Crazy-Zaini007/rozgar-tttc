const mongoose = require("mongoose");

//Supplier Payment_In Schema
const Supplier_Payment_InSchema = new mongoose.Schema(
  {
    supplier_Id: {
      type: String,
    },
    supplierName: {
      type: String,
    },
    total_Azad_Visa_Price_In_PKR: {
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


    total_Azad_Visa_Price_In_Curr: {
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
    status:{
      type:String,
      default:"Open"
          },
    persons: [
      {
        name: {
          type: String,
        },
        pp_No: {
          type: String,
        },
        trade:{
          type: String,

        },
        contact:{
          type: String,
        },
        entry_Mode: {
          type: String,
        },
        azad_Visa_Price_In_PKR: {
          type: Number,
          default: 0,
        },
        azad_Visa_Price_In_Curr: {
          type: Number,
          default: 0,
        },
         country:{
         type:String
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
          type: String,

        },
        status:{
          type:String,
          default:"Open"
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

//Supplier Payment_Out Schema
const Supplier_Payment_OutSchema = new mongoose.Schema(
  {
    supplier_Id: {
      type: String,
    },
    supplierName: {
      type: String,
    },
    total_Azad_Visa_Price_Out_PKR: {
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
    total_Azad_Visa_Price_Out_Curr: {
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
    persons: [
      {
        name: {
          type: String,
        },
        pp_No: {
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
        entry_Mode: {
          type: String,
        },
        azad_Visa_Price_Out_PKR: {
          type: Number,
          default: 0,
        },
        azad_Visa_Price_Out_Curr: {
          type: Number,
          default: 0,
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
          type: String,

        },
        status:{
          type:String,
          default:"Open"
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
  { timestamps: true}
)
//Agent Payment_In Schema
const Agent_Payment_InSchema = new mongoose.Schema(
  {
    supplier_Id: {
      type: String,
    },
    supplierName: {
      type: String,
    },
    total_Azad_Visa_Price_In_PKR: {
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

    total_Azad_Visa_Price_In_Curr: {
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
    status:{
      type:String,
      default:"Open"
          },
    persons: [
      {
        name: {
          type: String,
        },
        pp_No: {
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
        entry_Mode: {
          type: String,
        },
        azad_Visa_Price_In_PKR: {
          type: Number,
          default: 0,
        },
        azad_Visa_Price_In_Curr: {
          type: Number,
          default: 0,
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
          type: String,
        },
        status:{
          type:String,
          default:"Open"
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

//Agent Payment_Out Schema
const Agent_Payment_OutSchema = new mongoose.Schema(
  {
    supplier_Id: {
      type: String,
    },
    supplierName: {
      type: String,
    },
    total_Azad_Visa_Price_Out_PKR: {
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

    total_Azad_Visa_Price_Out_Curr: {
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
    curr_Country: {},
    status:{
      type:String,
      default:"Open"
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
        trade:{
          type: String,

        },
        country:{
          type:String
                  },
        contact:{
          type: String,
        },
        azad_Visa_Price_Out_PKR: {
          type: Number,
          default: 0,
        },
        azad_Visa_Price_Out_Curr: {
          type: Number,
          default: 0,
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
          type: String,
        },
        status:{
          type:String,
          default:"Open"
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

//  Azad Supplier Schema

const AzadSupplierSchema = new mongoose.Schema(
  {
    Supplier_Payment_In_Schema: Supplier_Payment_InSchema,
    Supplier_Payment_Out_Schema: Supplier_Payment_OutSchema,
    Agent_Payment_In_Schema: Agent_Payment_InSchema,
    Agent_Payment_Out_Schema: Agent_Payment_OutSchema,
  },
  { timestamps: true }
)



const AzadSuppliers = mongoose.model("azadSuppliers", AzadSupplierSchema);
module.exports = AzadSuppliers;
