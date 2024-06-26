const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const { addPaymentIn, deleteSinglePaymentIn, addPaymentInReturn, updateSinglePaymentIn, addMultiplePaymentsIn,updateAgentTotalPaymentIn,deleteAgentPaymentInSchema, getAllPaymentsIn, addPaymentOut, addPaymentOutReturn, deleteSinglePaymentOut, updateSinglePaymentOut, addMultiplePaymentsOut,updateAgentTotalPaymentOut,deleteAgentPaymentOutSchema, getAllPaymentsOut,changePaymentInStatus,
    changePaymentOutStatus } = require('../../controllers/candidates/CandidateController')
const router = express.Router()

router.use(userAuth)
// Adding a new payment in 
router.post('/add/payment_in', addPaymentIn)
// Deleting a single payments In
router.delete('/delete/single/payment_in', deleteSinglePaymentIn)
// Adding a new payment in Cash out
router.post('/payment_in/cash_out', addPaymentInReturn)
// Updating a single payment In
router.patch('/update/single/payment_in', updateSinglePaymentIn)
// Adding multiple payments in
router.post('/add/multiple/payment_in', addMultiplePaymentsIn)
// getting all suppliers Payments In Details
router.get('/get/payment_in_details', getAllPaymentsIn)
// Deleting All PaymentIn of a suppliers
router.delete('/delete/all/payment_in', deleteAgentPaymentInSchema)
// Updating All PaymentIn of a suppliers
router.patch('/update/all/payment_in', updateAgentTotalPaymentIn)

// Adding a new Payment Out
router.post('/add/payment_out', addPaymentOut)
// Deleting a single payments Out
router.delete('/delete/single/payment_out', deleteSinglePaymentOut)
// Adding a new payment Out Cash out
router.post('/payment_out/cash_out', addPaymentOutReturn)
// Updating a single payment Out
router.patch('/update/single/payment_out', updateSinglePaymentOut)
// Adding multiple payments Out
router.post('/add/multiple/payment_out', addMultiplePaymentsOut)
// getting all suppliers Payments Out Details
router.get('/get/payment_out_details', getAllPaymentsOut)

router.delete('/delete/all/payment_out', deleteAgentPaymentOutSchema)
// Updating All PaymentOut of a suppliers
router.patch('/update/all/payment_out', updateAgentTotalPaymentOut)


router.patch('/update/payment_in/status', changePaymentInStatus)
router.patch('/update/payment_out/status', changePaymentOutStatus)
module.exports = router
