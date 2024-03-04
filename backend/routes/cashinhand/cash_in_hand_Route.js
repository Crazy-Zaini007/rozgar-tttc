const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const {addCash,getCash,delCash,updateCash}=require('../../controllers/cashinhand/Cash_In_Hand_Controller.js')
const router = express.Router()


router.use(userAuth)
// adding cash in/out

router.post('/add/cash',addCash)

// getting cash in/out
router.get('/get/cash',getCash)

// deleting cash in/out
router.delete('/delete/cash',delCash)

// deleting cash in/out
router.patch('/update/cash',updateCash)
module.exports = router
