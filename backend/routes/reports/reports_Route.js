const userAuth = require('../../middleware/userMiddleware/userAuth')
const { getAllPayments,getPersons,getTotalPayments,getTotalAdvancePayments,getAllPaymentsByDate,getEmployeesPayments,getProtectorPayments,getAllBanksPayments,getNormalPayments,getAdvancePayments,getAgentsPayments,getSuppliersPayments,getCandidatesPayments } = require('../../controllers/allReports/AllReportsController')
const express = require('express');
const router = express.Router()
router.use(userAuth)


// Geting AllPayments
router.get('/get/all/payments', getAllPayments)
router.get('/get/all/protector/payments', getProtectorPayments)
router.get('/get/all/employees/payments', getEmployeesPayments)
router.get('/get/all/normal/payments', getNormalPayments)
router.get('/get/all/advance/payments', getAdvancePayments)





// Geting AllPersons
router.get('/get/all/persons', getPersons)

router.get('/get/all/total_payments', getTotalPayments)

router.get('/get/all/advance_payments', getTotalAdvancePayments)

router.get('/get/all/payments/date', getAllPaymentsByDate)
router.get('/get/all/banks/payments', getAllBanksPayments)

//Agents/Suppliers and Candidates Payments reports
router.get('/get/agents/reports', getAgentsPayments)
router.get('/get/suppliers/reports', getSuppliersPayments)
router.get('/get/candidates/reports', getCandidatesPayments)

module.exports = router


