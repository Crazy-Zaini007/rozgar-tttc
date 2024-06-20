const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const { addVSP, updateVSP, deleteVSP, getVSP, addVPP, updateVPP, deleteVPP, getVPP, addTSP, updateTSP, deleteTSP, getTSP, addTPP, updateTPP, deleteTPP, getTPP, addAVSP, updateAVSP, deleteAVSP, getAVSP, addAVPP, updateAVPP, deleteAVPP, getAVPP, addVISP, updateVISP, deleteVISP, getVISP, addVIPP, updateVIPP, deleteVIPP, getVIPP, addCompany, updateCompany, deleteCompany, getCompany, addTrade, updateTrade, deleteTrade, getTrade, addCurrCountry, updateCurrCountry, deleteCurrCountry, getCurrCountry, addPaymentVia, updatePaymentVia, deletePaymentVia, getPaymentVia, addPaymentType, updatePaymentType, deletePaymentType, getPaymentType, addEntryMode, updateEntryMode, deleteEntryMode, getEntryMode, addFinalStatus, updateFinalStatus, deleteFinalStatus, getFinalStatus, addCountry, updateCountry, deleteCountry, getCountry, addCategory, updateCategory, deleteCategory, getCategory, addExpeCategory, updateExpenseCategory, deleteExpenseCategory, getExpeCategory, addCurrency, updateCurrency, deleteCurrency, getCurrency, addCPP, updateCPP, deleteCPP, getCPP, addProtector, updateProtector, deleteProtector, getProtector,addAssets,updateAssets,deleteAssets,getAssets,addCreditorSupplier,updateCreditorSupplier,deleteCreditorSupplier,getCreditorSupplier} = require('../../controllers/setting/EntrySettingController')

const router = express.Router()

router.use(userAuth)

//1- Visa Sales Parties Routes
// a- adding VSP route
router.post('/add_vsp', addVSP)
// b- getting VSP route
router.get('/get_vsp', getVSP)
router.patch('/update_vsp', updateVSP)
router.delete('/delete_vsp', deleteVSP)

// 2- Visa Purchase Parties Routes
// a- adding VPP route
router.post('/add_vpp', addVPP)
// b- getting VPP route
router.get('/get_vpp', getVPP)
router.patch('/update_vpp', updateVPP)
router.delete('/delete_vpp', deleteVPP)

//3- Ticket Sales Parties Routes
// a- adding TSP  route
router.post('/add_tsp', addTSP)
// b- getting TPP  route
router.get('/get_tsp', getTSP)
router.patch('/update_tsp', updateTSP)
router.delete('/delete_tsp', deleteTSP)



//4- Ticket Purchase Parties Routes

// a- adding TPP  route
router.post('/add_tpp', addTPP)
// b- getting TPP  route
router.get('/get_tpp', getTPP)
router.patch('/update_tpp', updateTPP)
router.delete('/delete_tpp', deleteTPP)



//5- Azad Visa Sales Party Routes
// a- adding AVSP  route
router.post('/add_avsp', addAVSP)
// b- getting AVSP  route
router.get('/get_avsp', getAVSP)
router.patch('/update_avsp', updateAVSP)
router.delete('/delete_avsp', deleteAVSP)


//6- Azad Visa Purchase Party Routes
// a- adding AVPP  route
router.post('/add_avpp', addAVPP)
// b- getting AVPP  route
router.get('/get_avpp', getAVPP)
router.patch('/update_avpp', updateAVPP)
router.delete('/delete_avpp', deleteAVPP)



//7- Visit Sales Parties Routes
// a- adding VISP  route
router.post('/add_visp', addVISP)
// b- getting VISP  route
router.get('/get_visp', getVISP)
router.patch('/update_visp', updateVISP)
router.delete('/delete_visp', deleteVISP)


//8-  Visit Purchase Parties Routes
// a- adding VIPP   route
router.post('/add_vipp', addVIPP)
// b- getting VIPP   route
router.get('/get_vipp', getVIPP)
router.patch('/update_vipp', updateVIPP)
router.delete('/delete_vipp', deleteVIPP)


//9- Companies Routes
// a- adding Company route
router.post('/add_company', addCompany)
// b- getting Company route
router.get('/get_company', getCompany)
router.patch('/update_company', updateCompany)
router.delete('/delete_company', deleteCompany)



//10- Trades Routes
// a- adding Trades route
router.post('/add_trade', addTrade)
// b- getting Tradess route
router.get('/get_trade', getTrade)
router.patch('/update_trade', updateTrade)
router.delete('/delete_trade', deleteTrade)


//11- Currency Countries Routes
// a- adding Currency Countries route
router.post('/add_curr_country', addCurrCountry)
// b- getting Currency Countries route
router.get('/get_curr_country', getCurrCountry)
router.patch('/update_curr_country', updateCurrCountry)
router.delete('/delete_curr_country', deleteCurrCountry)



//12- Payment Via Routes
// a- adding Payment Via route
router.post('/add_payment_via', addPaymentVia)
// b- getting Payment Via route
router.get('/get_payment_via', getPaymentVia)
router.patch('/update_payment_via', updatePaymentVia)
router.delete('/delete_payment_via', deletePaymentVia)


//13- Payment Type Routes
// a- adding Payment Type route
router.post('/add_payment_type', addPaymentType)
// b- getting Payment Type route
router.get('/get_payment_type', getPaymentType)
router.patch('/update_payment_type', updatePaymentType)
router.delete('/delete_payment_type', deletePaymentType)


//14- Entry Mode Routes
// a- adding Entry Mode route
router.post('/add_entry_mode', addEntryMode)
// b- getting Entry Mode route
router.get('/get_entry_mode', getEntryMode)
router.patch('/update_entry_mode', updateEntryMode)
router.delete('/delete_entry_mode', deleteEntryMode)


//15- Final Status Routes
// a- adding Final Status route
router.post('/add_final_status', addFinalStatus)
// b- getting Final Status route
router.get('/get_final_status', getFinalStatus)
router.patch('/update_final_status', updateFinalStatus)
router.delete('/delete_final_status', deleteFinalStatus)


//16- Countries Routes
// a- adding Countries route
router.post('/add_country', addCountry)
// b- getting Countries route
router.get('/get_country', getCountry)
router.patch('/update_country', updateCountry)
router.delete('/delete_country', deleteCountry)


//17- Categories Routes
// a- adding Categories route
router.post('/add_category', addCategory)
// b- getting Categories route
router.get('/get_category', getCategory)
router.patch('/update_category', updateCategory)
router.delete('/delete_category', deleteCategory)


//18- Expense Categories Routes
// a- adding Expense Categories route
router.post('/add_expense_category', addExpeCategory)
// b- getting Expense Categories route
router.get('/get_expense_category', getExpeCategory)
router.patch('/update_expense_category', updateExpenseCategory)
router.delete('/delete_expense_category', deleteExpenseCategory)


//19 Currencies Routes
// a- adding Currency  route
router.post('/add_currency', addCurrency)
// b- getting Currency route
router.get('/get_currency', getCurrency)
router.patch('/update_currency', updateCurrency)
router.delete('/delete_currency', deleteCurrency)


//20 - Crediter Purchase Parties Routes
// a- adding Crediter Purchase Parties  route
router.post('/add_cpp', addCPP)
// b- getting Crediter Purchase Parties route
router.get('/get_cpp', getCPP)
router.patch('/update_cpp', updateCPP)
router.delete('/delete_cpp', deleteCPP)


//20 - Crediter  Suppliers Routes
// a- adding Crediter Suppliers route
router.post('/add_creditor_supplier', addCreditorSupplier)
// b- getting Crediter Suppliers route
router.get('/get_creditor_supplier', getCreditorSupplier)
router.patch('/update_creditor_supplier', updateCreditorSupplier)
router.delete('/delete_creditor_supplier', deleteCreditorSupplier)

//20 - Protector Parties Routes
// a- adding Protector Parties  route
router.post('/add_protector', addProtector)
router.get('/get_protector', getProtector)
router.patch('/update_protector', updateProtector)
router.delete('/delete_protector', deleteProtector)


// Assets Routes
router.post('/add_asset', addAssets)
router.get('/get_asset', getAssets)
router.patch('/update_asset', updateAssets)
router.delete('/delete_asset', deleteAssets)
module.exports = router



