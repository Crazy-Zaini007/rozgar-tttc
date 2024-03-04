const mongoose = require('mongoose')

const EntrySchema = new mongoose.Schema({
    name: {
        type: String,

    },
    pp_No: {
        type: String,
        required: true
    },
    trade: {
        type: String,

    },
    company: {
        type: String,

    },
    contact: {
        type: String,

    },
    country: {
        type: String,

    },
    flight_Date: {
        type: String,
        default: "No Fly",
        required: false,

    },
    final_Status: {
        type: String,

    },
    remarks: {
        type: String,

    },
    entry_Mode: {
        type: String,

    },
    reference_Out: {
        type: String,

    },
    reference_Out_Name: {
        type: String,

    },
    visa_Sales_Rate_PKR: {
        type: Number,
        default:0

    },
    visa_Sale_Rate_Oth_Cur: {
        type: Number,
        default:0


    },
    cur_Country_One: {
        type: String,

    },
    reference_In: {
        type: String,

    },
    reference_In_Name: {
        type: String,

    },
    visa_Purchase_Rate_PKR: {
        type: Number,
        default:0


    },
    visa_Purchase_Rate_Oth_Cur: {
        type: Number,
        default:0

    },
    cur_Country_Two: {
        type: String,

    },
    picture: {
        type: String,

    },

    // Visit Section

    visit_Sales_PKR: {
        type: Number,
        default:0


    },
    visit_Sales_Rate_Oth_Curr: {
        type: Number,
        default:0


    },

    visit_Sales_Cur: {
        type: String,

    },

    visit_Purchase_Rate_PKR: {
        type: Number,
        default:0


    },
    visit_Purchase_Rate_Oth_Cur: {
        type: Number,
        default:0


    },
    visit_Purchase_Cur: {
        type: String,
    },

    visit_Section_Picture: {
        type: String,

    },
    visit_Reference_In: {
        type: String,
    },
    visit_Reference_In_Name: {
        type: String,

    },
    visit_Reference_Out: {
        type: String,
    },
    visit_Reference_Out_Name: {
        type: String,
    },


    // Ticket Section

    ticket_Sales_PKR: {
        type: Number,
        default:0


    },
    ticket_Sales_Rate_Oth_Cur: {
        type: Number,
        default:0


    },

    ticket_Sales_Cur: {
        type: String,
    },

    ticket_Purchase_PKR: {
        type: Number,
        default:0


    },
    ticket_Purchase_Rate_Oth_Cur: {
        type: Number,
        default:0


    },
    ticket_Purchase_Cur: {
        type: String,

    },

    ticket_Section_Picture: {
        type: String,

    },
    ticket_Reference_In: {
        type: String,

    },
    ticket_Reference_In_Name: {
        type: String,

    },
    ticket_Reference_Out: {
        type: String,

    },
    ticket_Reference_Out_Name: {
        type: String,

    },
    // Azad Visa Section


    azad_Visa_Sales_PKR: {
        type: Number,
        default:0


    },
    azad_Visa_Sales_Rate_Oth_Cur: {
        type: Number,
        default:0


    },
    azad_Visa_Sales_Cur: {
        type: String,

    },
    azad_Visa_Purchase_PKR: {
        type: Number,
        default:0


    },
    azad_Visa_Purchase_Rate_Oth_Cur: {
        type: Number,
        default:0

    },
    azad_Visa_Purchase_Cur: {
        type: String,

    },
    azad_Visa_Section_Picture: {
        type: String,

    },
    azad_Visa_Reference_In: {
        type: String,

    },
    azad_Visa_Reference_In_Name: {
        type: String,

    },
    azad_Visa_Reference_Out: {
        type: String,
    },
    azad_Visa_Reference_Out_Name: {
        type: String,

    },

    // Protector Section
    protector_Reference_In: {
        type: String,

    },
    protector_Reference_In_Name: {
        type: String,

    },
    protector_Price_In: {
        type: Number,
        default: 0


    },
    protector_Price_In_Oth_Cur: {
        type: Number,
        default: 0
    },

    protector_Price_Out: {
        type: Number,
        default: 0

    },

}, { timestamps: true })

const Entries = mongoose.model('Enteries', EntrySchema)
module.exports = Entries