import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // 1- Visa Section
  //a- Visa Sales Parties
  visaSalesParty: [],
  //b- Visa Purchase Parties
  visaPurchaseParty: [],
  // 2- Ticket Section
  // a- Ticket Sales Parties
  ticketSalesParties: [],
  // b- Ticket Purchase Parties
  ticketPurchaseParties: [],

  // 3- Visit Section
  // a- Visit Sales Parties
  visitSalesParties: [],
  // b- Visit Purchase Parties
  visitPurchaseParties: [],

  // 4-Azad Visa Section
  // a- Azad Visa Sales Parties
  azadVisaSalesParties: [], //
  // b- Azad Visa Purchase Parties
  azadVisaPurchaseParties: [],

  // 5- Crediter / Debiter Section
  crediterPurchaseParties: [],


  // 6- Other Section
  companies: [],
  trades: [],
  currCountries: [],
  paymentVia: [],
  paymentType: [],
  entryMode: [],
  finalStatus: [],
  countries: [],
  categories: [],
  expenseCategories: [],
  currencies: [],
  protectors:[]
}

export const settingSlice = createSlice({
  name: 'settingSlice',
  initialState,
  reducers: {

    //1- Visa Section Reducers

    // a- getting visa Salese Parties
    getVisaSalesParty: (state, action) => {
      state.visaSalesParty = action.payload
    },

    //b- adding visa Salese Parties
    addVisaSalesParty: (state, action) => {
      state.visaSalesParty.push(action.payload);
    },

    //c- getting Visa Purchase Parties
    getVisaPurchaseParty: (state, action) => {
      state.visaPurchaseParty = action.payload;
    },

    //d- adding Visa Purchase Parties 
    addVisaPurchaseParty: (state, action) => {
      state.visaPurchaseParty.push(action.payload);
    },



    //2- Ticket Section Reducers

    // a- getting Ticket Sales Parties
    getTicketSalesParty: (state, action) => {
      state.ticketSalesParties = action.payload
    },

    //b- adding Ticket Sales Parties
    addTicketSalesParty: (state, action) => {
      state.ticketSalesParties.push(action.payload);
    },

    // c- getting Ticket Purchase Parties
    getTicketPurchaseParty: (state, action) => {
      state.ticketPurchaseParties = action.payload;
    },

    // d- adding Ticket Purchase Parties
    addTicketPurchaseParty: (state, action) => {
      state.ticketPurchaseParties.push(action.payload);
    },


    // 3- Visit Section Reducers

    //  a- getting  Visit Sales Parties
    getVisitSalesParty: (state, action) => {
      state.visitSalesParties = action.payload
    },

    // b- adding  Visit Sales Parties
    addVisitSalesParty: (state, action) => {
      state.visitSalesParties.push(action.payload)
    },

    // c- getting  Visit Purchase Parties
    getVisitPurchaseParty: (state, action) => {
      state.visitPurchaseParties = action.payload
    },

    // d- adding Visit Purchase Parties
    addVisitPurchaseParty: (state, action) => {
      state.visitPurchaseParties.push(action.payload)
    },



    // 4- Azad Visa Section Reducers

    // a- getting Azad Visa Sales Parties
    getAzadVisaSalesParty: (state, action) => {
      state.azadVisaSalesParties = action.payload
    },

    //b- adding Azad Visa Sales Parties
    addAzadVisaSalesParty: (state, action) => {
      state.azadVisaSalesParties.push(action.payload);
    },

    // c- getting Azad Visa Purchase Parties

    getAzadVisaPurchaseParty: (state, action) => {
      state.azadVisaPurchaseParties = action.payload
    },

    //d- adding Azad Visa Purchase Parties
    addAzadVisaPurchaseParty: (state, action) => {
      state.azadVisaPurchaseParties.push(action.payload);
    },

    // 5- Crediter / Debiter Section Reducers

    // a- getting Crediter Purchase Parties
    getCrediterPurchaseParty: (state, action) => {
      state.crediterPurchaseParties = action.payload
    },
    // b- adding Crediter Purchase Parties
    addCrediterPurchaseParty: (state, action) => {
      state.crediterPurchaseParties.push(action.payload);
    },


    //  6- Other Sections Reducers
    // Companies 
    // a- getting companies

    getCompany: (state, action) => {
      state.companies = action.payload
    },

    //b- adding companies
    addCompany: (state, action) => {
      state.companies.push(action.payload);
    },


    // Trades
    // a- getting Trades

    getTrades: (state, action) => {
      state.trades = action.payload
    },

    //b- adding Trades
    addTrade: (state, action) => {
      state.trades.push(action.payload);
    },

    // Currency Countries
    // a- getting Currency Countries

    getCurrCountry: (state, action) => {
      state.currCountries = action.payload
    },

    //b- adding Currency Countries
    addCurrCountry: (state, action) => {
      state.currCountries.push(action.payload);
    },


    // Payment Via
    // a- getting PaymentVia

    getPaymentVia: (state, action) => {
      state.paymentVia = action.payload
    },

    //b- adding PaymentVia
    addPaymentVia: (state, action) => {
      state.paymentVia.push(action.payload);
    },

    // Payment Type
    // a- getting paymentType
    getPaymentType: (state, action) => {
      state.paymentType = action.payload
    },

    //b- adding paymentType
    addPaymentType: (state, action) => {
      state.paymentType.push(action.payload);
    },

    // Entry Mode
    // a- getting Entry Mode
    getEntryMode: (state, action) => {
      state.entryMode = action.payload
    },

    //b- adding Entry Mode
    addEntryMode: (state, action) => {
      state.entryMode.push(action.payload);
    },

    // Final Status 

    // a- getting Final Status
    getFinalStatus: (state, action) => {
      state.finalStatus = action.payload
    },

    //b- adding Final Status
    addFinalStatus: (state, action) => {
      state.finalStatus.push(action.payload);
    },

    // Countries
    // a- getting countries
    getCountry: (state, action) => {
      state.countries = action.payload
    },

    //b- adding countries
    addCountry: (state, action) => {
      state.countries.push(action.payload);
    },

    // Categories 
    // a- getting Category
    getCategory: (state, action) => {
      state.categories = action.payload
    },

    //b- adding countries
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },

    // Expense Categories

    // a- getting Expense Categories
    getExpeCategory: (state, action) => {
      state.expenseCategories = action.payload
    },

    //b- adding Expense Categories
    addExpeCategory: (state, action) => {
      state.expenseCategories.push(action.payload);
    },

    // Currencies

    // a- getting Currencies
    getCurrency: (state, action) => {
      state.currencies = action.payload
    },

    //b- adding Currencies
    addCurrency: (state, action) => {
      state.currencies.push(action.payload);
    },
 // Protectors Suppliers

    // a- getting Currencies
    getProtector: (state, action) => {
      state.protectors = action.payload
    },

    //b- adding Currencies
    addProtector: (state, action) => {
      state.protectors.push(action.payload);
    },


  },
})


// Action creators are generated for each case reducer function
export const { getVisaSalesParty, addVisaSalesParty, getVisaPurchaseParty, addVisaPurchaseParty, getTicketSalesParty, addTicketSalesParty, getTicketPurchaseParty, addTicketPurchaseParty, getVisitSalesParty, addVisitSalesParty, getVisitPurchaseParty, addVisitPurchaseParty, getAzadVisaSalesParty, addAzadVisaSalesParty, getAzadVisaPurchaseParty, addAzadVisaPurchaseParty, getCrediterPurchaseParty, addCrediterPurchaseParty, getCompany, addCompany, getTrades, addTrade, getCurrCountry, addCurrCountry, getPaymentVia, addPaymentVia, getPaymentType, addPaymentType, getEntryMode, addEntryMode, getFinalStatus, addFinalStatus, getCountry, addCountry, getCategory, addCategory, getExpeCategory, addExpeCategory, getCurrency, addCurrency,getProtector,addProtector } = settingSlice.actions

export default settingSlice.reducer