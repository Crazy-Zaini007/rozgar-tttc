const mongoose = require("mongoose");

//Ticket Supplier Payment_In Schema
const Payment_InSchema = new mongoose.Schema(
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
        total_In:{
          type: Number,
          default: 0,
        },
        remaining_Price: {
          type: Number,
          default: 0,
        },
        azad_Visa_Price_In_Curr: {
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
        cand_Name:{
          type: String,

        }
      },
    ],
    candPayments:[
      {
        date:{
          type:String
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
        curr_Amount:{
          type: Number,
          default: 0,
        },
        curr_Rate:{
          type: Number,
          default: 0,
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
        payments:[
          {
            cand_Name: {
              type: String,
            },
            pp_No: {
              type: String,
            },
            entry_Mode: {
              type: String,
            },
            company: {
              type: String,
            },
            trade: {
              type: String,
            },
            final_Status: {
              type: String,
            },
            flight_Date: {
              type: String,
    
            },
            visa_Amount_PKR: {
              type: Number
            },
            past_Paid_PKR: {
              type: Number
            },
            new_Payment:{
              type: Number
            },
            past_Remain_PKR: {
              type: Number
            },
            new_Remain_PKR: {
              type: Number,
              default: 0,
            },

            visa_Curr_Amount: {
              type: Number,
            },
            past_Paid_Curr: {
              type: Number
            },
            new_Curr_Payment:{
              type: Number
            },

            past_Remain_Curr: {
              type: Number
            },
            new_Remain_Curr: {
              type: Number,
              default: 0,
            },
            curr_Rate: {
              type: Number,
              default: 0,
            },
        
          }
        ]
      }       
    ]
  },
  { timestamps: true }
);

//Ticket Supplier Payment Out Schema
const Payment_OutSchema = new mongoose.Schema(
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
        total_In:{
          type: Number,
          default: 0,
        },
        remaining_Price: {
          type: Number,
          default: 0,
        },
        azad_Visa_Price_Out_Curr: {
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
        cand_Name:{
          type: String,

        }
      },
    ],
    candPayments:[
      {
        date:{
          type:String
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
        curr_Amount:{
          type: Number,
          default: 0,
        },
        curr_Rate:{
          type: Number,
          default: 0,
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
        payments:[
          {
            cand_Name: {
              type: String,
            },
            pp_No: {
              type: String,
            },
            entry_Mode: {
              type: String,
            },
            company: {
              type: String,
            },
            trade: {
              type: String,
            },
            final_Status: {
              type: String,
            },
            flight_Date: {
              type: String,
    
            },
            visa_Amount_PKR: {
              type: Number
            },
            new_Payment:{
              type: Number
            },
            past_Paid_PKR: {
              type: Number
            },
            past_Remain_PKR: {
              type: Number
            },
            new_Remain_PKR: {
              type: Number,
              default: 0,
            },

            visa_Curr_Amount: {
              type: Number,
            },
            new_Curr_Payment:{
              type: Number
            },
            past_Paid_Curr: {
              type: Number
            },
            past_Remain_Curr: {
              type: Number
            },
            new_Remain_Curr: {
              type: Number,
              default: 0,
            },
            curr_Rate: {
              type: Number,
              default: 0,
            },
          }
        ]
      }       
    ]
  },
  { timestamps: true}
)

//  Azad Supplier Schema

const TicketSupplierSchema = new mongoose.Schema(
  {
    payment_In_Schema: Payment_InSchema,
    payment_Out_Schema: Payment_OutSchema
  },
  { timestamps: true }
)

const TicketSuppliers = mongoose.model("ticketSuppliers", TicketSupplierSchema);
module.exports = TicketSuppliers;
