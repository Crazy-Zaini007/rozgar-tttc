const mongoose = require("mongoose");

//EmployeeSchema 
const EmployeeSchema = new mongoose.Schema(
  {
    
    employeeName: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
     unique:true
    },

    phone: {
      type: String,
      
    },
    emergencyPhone: {
      type: String,
    },
    dob: {
      type: String,
    },
    cnic: {
      type: String,
    },
    salaryType: {
      type: String,
    },
    salary:{
        type:Number,
        default:0
    },
    entry_Date:{
      type:String,
    },
    open:{
type:Boolean,
default:true
    },
    close:{
      type:Boolean,
      default:true
    },
    vacation: [
      {
        date: {
          type: String,
        },
        dateFrom: {
          type: String,
        },
        dateTo: {
          type: String,
        },
        days: {
          type: Number,
          default:0

        },
        timeIn: {
          type: String,
        },
        timeOut: {
          type: String,
        }
      },
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
          type: String,
        },
        payment_Out: {
          type: Number,
          default: 0,
        },
        payment_Out_Curr: {
          type:String,
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
        }
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
)



const Employees = mongoose.model("employee", EmployeeSchema);
module.exports = Employees;