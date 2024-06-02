const userAuth = require("../../middleware/userMiddleware/userAuth");
const {
  getAllPayments,
  getPersons,
  getTotalPayments,
  getTotalAdvancePayments,
  getAllPaymentsByDate,
  getEmployeesPayments,
  getProtectorPayments,
  getAllBanksPayments,
  getTodayAllPayments,
  getNormalPayments,
  getAdvancePayments,
  getAgentsPayments,
  getSuppliersPayments,
  getCandidatesPayments,
  getAzadSuppPayments,
  getAzadAgentPayments,
  getAzadCandPayments,
  getTicketSuppPayments,
  getTicketAgentPayments,
  getTicketCandPayments,
  getVisitSuppPayments,
  getVisitAgentPayments,
  getVisitCandPayments,
  getNetVisaReports,
  getTotalReceivable,
  getTotalPayable,
} = require("../../controllers/allReports/AllReportsController");
const express = require("express");
const router = express.Router();
router.use(userAuth);

// Geting AllPayments
router.get("/get/all/payments", getAllPayments)
router.get("/get/all/protector/payments", getProtectorPayments);
router.get("/get/all/employees/payments", getEmployeesPayments);

router.get("/get/all/normal/payments", getNormalPayments);
router.get("/get/all/advance/payments", getAdvancePayments);

router.get("/get/visa_net_reports", getNetVisaReports);
router.get("/get/net_receivable_reports", getTotalReceivable);
router.get("/get/net_payable_reports", getTotalPayable);

// Geting AllPersons
router.get("/get/all/persons", getPersons);

router.get("/get/all/total_payments", getTotalPayments);

router.get("/get/all/advance_payments", getTotalAdvancePayments);

router.get("/get/all/payments/date", getAllPaymentsByDate);
router.get("/get/all/banks/payments", getAllBanksPayments);
router.get("/get/all/today/payments", getTodayAllPayments);


//Agents/Suppliers and Candidates Payments reports
router.get("/get/agents/reports", getAgentsPayments);
router.get("/get/suppliers/reports", getSuppliersPayments);
router.get("/get/candidates/reports", getCandidatesPayments);

// Azad Reports
router.get("/get/azad/agents/reports", getAzadAgentPayments);
router.get("/get/azad/suppliers/reports", getAzadSuppPayments);
router.get("/get/azad/candidates/reports", getAzadCandPayments);

// Ticket Reports
router.get("/get/ticket/agents/reports", getTicketAgentPayments);
router.get("/get/ticket/suppliers/reports", getTicketSuppPayments);
router.get("/get/ticket/candidates/reports", getTicketCandPayments);

// Visit Reports
router.get("/get/visit/agents/reports", getVisitAgentPayments);
router.get("/get/visit/suppliers/reports", getVisitSuppPayments);
router.get("/get/visit/candidates/reports", getVisitCandPayments);
module.exports = router;
