const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const {
    addPaymentOut,
    deleteSinglePaymentOut,
    updateSinglePaymentOut,
    addMultiplePaymentsOut,
    deletePaymentOutPerson,
    updatePaymentOutPerson,
    deleteAgentPaymentOutSchema,
    getAllPaymentsOut
} = require('../../controllers/protectors/ProtectorController')
const router = express.Router()

router.use(userAuth)

// Adding a new Payment Out
router.post('/add/payment_out', addPaymentOut)
// Deleting a single payments Out
router.delete('/delete/single/payment_out', deleteSinglePaymentOut)
// Updating a single payment Out
router.patch('/update/single/payment_out', updateSinglePaymentOut)
// Adding multiple payments Out
router.post('/add/multiple/payment_out', addMultiplePaymentsOut)
// Deleting a single payments In Person
router.delete('/delete/person/payment_out', deletePaymentOutPerson)
router.patch('/payment_out/update/single/person', updatePaymentOutPerson)

// getting all suppliers Payments Out Details
router.get('/get/payment_out_details', getAllPaymentsOut)

router.delete('/delete/all/payment_out', deleteAgentPaymentOutSchema)
module.exports = router
