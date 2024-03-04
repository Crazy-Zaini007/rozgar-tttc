const mongoose = require('mongoose')
const visaSupplierPurchaseParty=require('./VSPP_Schema')
const ticketSupplierPurchaseParty=require('./TSPP_Schema')
const visaPurchaseSupplier=require('./VPS_Schema')
const azadVisaSupplierPurchaseParty=require('./AVSPP_Schema')
const crediterPurchaseSupplier=require('./CPS_Schema')
const visitSupplierSalesParty=require('./VSSP_Schema')
const ticketSupplierSalesParty=require('./TSSP_Schema')
const visitSalesSupplier=require('./VSS_Schema')
const azadVisaSupplierSalesParty=require('./AVSSP_Schema')
const debiterSalesSupplier=require('./DSS_Schema')
const companies=require('./Company_Schema')
const trades=require('./Trade_Schmea')
const currCountries=require('./Curr_Country_Schema')
const paymentVia=require('./Paymeny_Via_Schema')
const paymentType=require('./Payment_Type_Schema')
const entryMode=require('./Entry_Mode_Schema')
const finalStatus=require('./Final_Status_Schema')
const countries=require('./Country_Schema')
const categories=require('./Category_Schema')
const expenseCategories=require('./Expe_Category_Schema')
const currencies=require('./Currency_Schema')


const SettingSchema=new mongoose.Schema({


    // visaSupplierPurchaseParty
    visaSupplierPurchaseParty:[visaSupplierPurchaseParty],

    // ticketSupplierPurchaseParty
    ticketSupplierPurchaseParty:[ticketSupplierPurchaseParty],

    // visaPurchaseSupplier
    visaPurchaseSupplier:[visaPurchaseSupplier],

    // azadVisaSupplierPurchaseParty
    azadVisaSupplierPurchaseParty:[azadVisaSupplierPurchaseParty],

    // crediterPurchaseSupplier
    crediterPurchaseSupplier:[crediterPurchaseSupplier],

    // visitSupplierSalesParty
    visitSupplierSalesParty:[visitSupplierSalesParty],

    // ticketSupplierSalesParty
    ticketSupplierSalesParty:[ticketSupplierSalesParty],

    // visitSalesSupplier
    visitSalesSupplier:[visitSalesSupplier],

    // azadVisaSupplierSalesParty
    azadVisaSupplierSalesParty:[azadVisaSupplierSalesParty],

    //debiterSalesSupplier
    debiterSalesSupplier:[debiterSalesSupplier],

    // companies
    companies:[companies],

    // trades
    trades:[trades],

    // currCountries

    currCountries:[currCountries],

    // paymentVia
    paymentVia:[paymentVia],

    // paymentType
    paymentType:[paymentType],

    // entryMode
    entryMode:[entryMode],

    // finalStatus
    finalStatus:[finalStatus],

    // countries
    countries:[countries],

    // categories
    categories:[categories],

    // expenseCategories
    expenseCategories:[expenseCategories],

    // currencies
    currencies:[currencies]

},{timestamps:true})

const Setting=mongoose.model('Setting',SettingSchema)
module.exports=Setting