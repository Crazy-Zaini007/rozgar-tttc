const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const {addAzadSupplierPaymentIn, addAzadSupplierMultiplePaymentsIn, addAzadSupplierPaymentInReturn, deleteSingleAzadSupplierPaymentIn, updateSingleAzadSupplierPaymentIn, deleteAzadSupplierPaymentInPerson,deleteAzadSupplierPaymentInSchema, getAllAzadSupplierPaymentsIn, addAzadSupplierPaymentOut, addAzadSupplierMultiplePaymentsOut, addAzadSupplierPaymentOutReturn, deleteAzadSupplierSinglePaymentOut, updateAzadSupplierSinglePaymentOut, deleteAzadSupplierPaymentOutPerson,deleteAzadSupplierPaymentOutSchema, getAllAzadSupplierPaymentsOut, addAzadAgentPaymentIn, addAzadAgentMultiplePaymentsIn, addAzadAgentPaymentInReturn, deleteSingleAgentPaymentIn, updateSingleAzadAgentPaymentIn, deleteAzadAgentPaymentInPerson,deleteAzadAgentPaymentInSchema, getAllAzadAgentPaymentsIn, addAzadAgentPaymentOut, addAzadAgentMultiplePaymentsOut, addAzadAgentPaymentOutReturn, deleteAzadAgentSinglePaymentOut, updateAzadAgentSinglePaymentOut, deleteAzadAgentPaymentOutPerson,deleteAzadAgentPaymentOutSchema, getAllAzadAgentPaymentsOut  } = require('../../controllers/ticketSupplier/TicketSupplierController')
const {addAzadCandPaymentIn, addAzadCandMultiplePaymentsIn, addAzadCandPaymentInReturn, deleteSingleAzadCandPaymentIn, updateSingleAzadCandPaymentIn,deleteAzadCandPaymentInSchema, getAzadCandAllPaymentsIn, addAzadCandPaymentOut, addAzadCandPaymentOutReturn, deleteAzadCandSinglePaymentOut, updateAzadCandSinglePaymentOut, addAzadCandMultiplePaymentsOut,deleteAzadCandPaymentOutSchema, getAzadCandAllPaymentsOut   } = require('../../controllers/ticketCandidate/TicketCandidateController')

const router = express.Router()

router.use(userAuth)

// Azad Suppliers Section
// Adding a new payment in 
router.post('/suppliers/add/payment_in', addAzadSupplierPaymentIn)
// Deleting a single payments In
router.delete('/suppliers/delete/single/payment_in', deleteSingleAzadSupplierPaymentIn)
// Adding a new payment in Cash out
router.post('/suppliers/payment_in/cash_out', addAzadSupplierPaymentInReturn)
// Updating a single payment In
router.patch('/suppliers/update/single/payment_in', updateSingleAzadSupplierPaymentIn)
// Adding multiple payments in
router.post('/suppliers/add/multiple/payment_in', addAzadSupplierMultiplePaymentsIn)
// Deleting a single payments In Person
router.delete('/suppliers/delete/person/payment_in', deleteAzadSupplierPaymentInPerson)
// getting all suppliers Payments In Details
router.delete('/suppliers/delete/all/payment_in', deleteAzadSupplierPaymentInSchema)
// Deleting All PaymentIn of a suppliers
router.get('/suppliers/get/payment_in_details', getAllAzadSupplierPaymentsIn)


// Adding a new Payment Out
router.post('/suppliers/add/payment_out', addAzadSupplierPaymentOut)
// Deleting a single payments Out
router.delete('/suppliers/delete/single/payment_out', deleteAzadSupplierSinglePaymentOut)
// Adding a new payment Out Cash out
router.post('/suppliers/payment_out/cash_out', addAzadSupplierPaymentOutReturn)
// Updating a single payment Out
router.patch('/suppliers/update/single/payment_out', updateAzadSupplierSinglePaymentOut)
// Adding multiple payments Out
router.post('/suppliers/add/multiple/payment_out', addAzadSupplierMultiplePaymentsOut)
// Deleting a single payments In Person
router.delete('/suppliers/delete/person/payment_out', deleteAzadSupplierPaymentOutPerson)

router.delete('/suppliers/delete/all/payment_out', deleteAzadSupplierPaymentOutSchema)
// getting all suppliers Payments Out Details
router.get('/suppliers/get/payment_out_details', getAllAzadSupplierPaymentsOut)


// Azad Agetns Section
// Adding a new payment in 
router.post('/agents/add/payment_in', addAzadAgentPaymentIn)
// Deleting a single payments In
router.delete('/agents/delete/single/payment_in', deleteSingleAgentPaymentIn)
// Adding a new payment in Cash out
router.post('/agents/payment_in/cash_out', addAzadAgentPaymentInReturn)
// Updating a single payment In
router.patch('/agents/update/single/payment_in', updateSingleAzadAgentPaymentIn)
// Adding multiple payments in
router.post('/agents/add/multiple/payment_in', addAzadAgentMultiplePaymentsIn)
// Deleting a single payments In Person
router.delete('/agents/delete/person/payment_in', deleteAzadAgentPaymentInPerson)
router.delete('/agents/delete/all/payment_in', deleteAzadAgentPaymentInSchema)
// getting all suppliers Payments In Details
router.get('/agents/get/payment_in_details', getAllAzadAgentPaymentsIn)


// Adding a new Payment Out
router.post('/agents/add/payment_out', addAzadAgentPaymentOut)
// Deleting a single payments Out
router.delete('/agents/delete/single/payment_out', deleteAzadAgentSinglePaymentOut)
// Adding a new payment Out Cash out
router.post('/agents/payment_out/cash_out', addAzadAgentPaymentOutReturn)
// Updating a single payment Out
router.patch('/agents/update/single/payment_out', updateAzadAgentSinglePaymentOut)
// Adding multiple payments Out
router.post('/agents/add/multiple/payment_out', addAzadAgentMultiplePaymentsOut)
// Deleting a single payments In Person
router.delete('/agents/delete/person/payment_out', deleteAzadAgentPaymentOutPerson)
// getting all suppliers Payments Out Details
router.get('/agents/get/payment_out_details', getAllAzadAgentPaymentsOut)

router.delete('/agents/delete/all/payment_out', deleteAzadAgentPaymentOutSchema)





// Azad Candidate Section
// Adding a new payment in 
router.post('/candidates/add/payment_in', addAzadCandPaymentIn)
// Deleting a single payments In
router.delete('/candidates/delete/single/payment_in', deleteSingleAzadCandPaymentIn)
// Adding a new payment in Cash out
router.post('/candidates/payment_in/cash_out', addAzadCandPaymentInReturn)
// Updating a single payment In
router.patch('/candidates/update/single/payment_in', updateSingleAzadCandPaymentIn)
// Adding multiple payments in
router.post('/candidates/add/multiple/payment_in', addAzadCandMultiplePaymentsIn)
// getting all suppliers Payments In Details
router.delete('/candidates/delete/all/payment_in', deleteAzadCandPaymentInSchema)

router.get('/candidates/get/payment_in_details', getAzadCandAllPaymentsIn)


// Adding a new Payment Out
router.post('/candidates/add/payment_out', addAzadCandPaymentOut)
// Deleting a single payments Out
router.delete('/candidates/delete/single/payment_out', deleteAzadCandSinglePaymentOut)
// Adding a new payment Out Cash out
router.post('/candidates/payment_out/cash_out', addAzadCandPaymentOutReturn)
// Updating a single payment Out
router.patch('/candidates/update/single/payment_out', updateAzadCandSinglePaymentOut)
// Adding multiple payments Out
router.post('/candidates/add/multiple/payment_out', addAzadCandMultiplePaymentsOut)
router.delete('/candidates/delete/all/payment_out', deleteAzadCandPaymentOutSchema)

// getting all suppliers Payments Out Details
router.get('/candidates/get/payment_out_details', getAzadCandAllPaymentsOut)

module.exports = router
