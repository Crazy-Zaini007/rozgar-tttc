const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const {getBackup}=require('../../controllers/backup/backupController')
const router = express.Router()
router.use(userAuth)

router.get('/get/backup',getBackup)

module.exports = router
