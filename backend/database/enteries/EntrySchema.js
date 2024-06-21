const mongoose = require('mongoose')

const EntrySchema = new mongoose.Schema({
    entry_Date:{
        type: String
    },
    name: {
        type: String,
        
    },
    pp_No: {
        type: String,
        required: true
    },
    trade: {
        type: String,
        default: '',

    },
    company: {
        type: String,
        default: '',

    },
    contact: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',

    },
    flight_Date: {
        type: String,
        default: "No Fly",
    },
    final_Status: {
        type: String,
        default: '',

    },
    remarks: {
        type: String,
        default: '',

    },
    entry_Mode: {
        type: String,
        default: '',

    },
    reference_Out: {
        type: String,
        default: '',

    },
    reference_Out_Name: {
        type: String,
        default: '',
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
        default: '',

    },
    reference_In: {
        type: String,
        default: '',
    },
    reference_In_Name: {
        type: String,
        default: '',

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
        default: '',

    },
    picture: {
        type: String,
        default: '',
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
        default: '',

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
        default: '',
    },

    visit_Section_Picture: {
        type: String,
        default: '',

    },
    visit_Reference_In: {
        type: String,
        default: '',
    },
    visit_Reference_In_Name: {
        type: String,
        default: '',
    },
    visit_Reference_Out: {
        type: String,
        default: '',
    },
    visit_Reference_Out_Name: {
        type: String,
        default: '',
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
        default: '',
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
        default: '',

    },

    ticket_Section_Picture: {
        type: String,
        default: '',

    },
    ticket_Reference_In: {
        type: String,
        default: '',
    },
    ticket_Reference_In_Name: {
        type: String,
        default: '',

    },
    ticket_Reference_Out: {
        type: String,
        default: '',

    },
    ticket_Reference_Out_Name: {
        type: String,
        default: '',
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
        default: '',
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
        default: '',

    },
    azad_Visa_Section_Picture: {
        type: String,
        default: '',

    },
    azad_Visa_Reference_In: {
        type: String,
        default: '',

    },
    azad_Visa_Reference_In_Name: {
        type: String,
        default: '',

    },
    azad_Visa_Reference_Out: {
        type: String,
        default: '',

    },
    azad_Visa_Reference_Out_Name: {
        type: String,
        default: '',
    },

    // Protector Section
    protector_Reference_In: {
        type: String,
        default: '',
    },
    protector_Reference_In_Name: {
        type: String,
        default: '',

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