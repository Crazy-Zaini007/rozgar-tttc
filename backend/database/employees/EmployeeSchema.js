const mongoose = require("mongoose");


const EmployeeSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
    },
    fatherName:  {
      type:String
    },
    address:  {
      type:String
    },
    email: {
      type: String,
      unique: true,
      required: true,
     
    },
    phone:  {
      type:String
    },
    emergencyPhone:  {
      type:String
    },
    dob:  {
      type:String
    },
    cnic:  {
      type:String
    },
    salaryType:  {
      type:String
    },
    remaining: {
      type: Number,
      default: 0,
    },
    entry_Date:  {
      type:String
    },
    open: {
      type: Boolean,
      default: true,
    },
    close: {
      type: Boolean,
      default: false,
    },
    vacation: [
      {
        date: {
          type:String,
          default: new Date().toISOString().split("T")[0],
        },
        dateFrom:  {
          type:String
        },
        dateTo:  {
          type:String
        },
        days: {
          type: Number,
          default: 0,
        },
        timeIn:  {
          type:String
        },
        timeOut:  {
          type:String
        },
      },
    ],
    payments:[{
      month:{
        type:String
      },
      salary:{
        type:Number
      },
      remain:{
        type:Number
      },
      
    }],
    employeePayments: {
      type: [
        {
          category: {
            type: String,
          },
          payment_Via: {
            type: String,
          },
          payment_Type: {
            type: String,
          },
          slip_No: {
            type: String,
          },
          payment_Out: {
            type: Number,
            default: 0,
          },
          cash_Out: {
            type: Number,
            default: 0,
          },
          payment_Out_Curr: {
            type: String,
          },
          slip_Pic: {
            type: String,
          },
          date: {
            type: String,
          },
          curr_Rate: {
            type: Number,
          },
          curr_Amount: {
            type: Number,
          },
          invoice: {
            type: Number,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);


const Employees = mongoose.model("employee", EmployeeSchema);
module.exports = Employees;
