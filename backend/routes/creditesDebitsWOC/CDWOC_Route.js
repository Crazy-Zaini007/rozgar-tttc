const express = require('express');
const router = express.Router()
const userAuth = require('../../middleware/userMiddleware/userAuth')
const { addPaymentIn,addMultiplePaymentIn, deleteSinglePaymentIn, updateSinglePaymentIn, updateSinglePaymentOut, updateAgentTotalPaymentIn, deleteAgentPaymentInSchema, getAllPaymentsIn,changePaymentInStatus } = require('../../controllers/creditesDebitsWOC/CreditesDebitsWOC_Controller')

router.use(userAuth)
// Adding a new payment in 
router.post('/add/payment_in', addPaymentIn)
router.post("/add/multiple/payment_in", addMultiplePaymentIn);

// Deleting a single payments In
router.delete('/delete/single/payment_in', deleteSinglePaymentIn)
// Updating a single payment In
router.patch('/update/single/payment_in', updateSinglePaymentIn)
// Updating a single payment out
router.patch('/update/single/payment_out', updateSinglePaymentOut)
// getting all suppliers Payments Out Details
router.get('/get/payment_in_details', getAllPaymentsIn)
// Updating a Total payment In
router.patch('/update/total/payment_in', updateAgentTotalPaymentIn)
// Deleting a Total payment In
router.delete('/delete/total/payment_in', deleteAgentPaymentInSchema)

// Closing Khata
router.patch("/change/status", changePaymentInStatus);
module.exports = router
