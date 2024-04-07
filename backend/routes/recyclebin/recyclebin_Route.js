const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const {getRecycleBin,deleteRecycleBin}=require('../../controllers/recyclebin/recyclebin_Controller')

const router = express.Router()
router.use(userAuth)

router.get('/get/recyclebin', getRecycleBin)
router.delete('/delete/recyclebin', deleteRecycleBin)

module.exports = router
