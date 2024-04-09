const express = require("express");
const router = express.Router();
const userAuth = require("../../middleware/userMiddleware/userAuth");
const {directPaymentIn,directPaymentOut} = require("../../controllers/directPayments/directPayments_Controller");
  
  router.use(userAuth);
  
  // Adding a new payment in
  router.post("/payment_in", directPaymentIn);
  router.post("/payment_out", directPaymentOut);

module.exports = router;
