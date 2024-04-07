const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const {getReminders,deleteReminders}=require('../../controllers/reminders/reminderController')

const router = express.Router()
router.use(userAuth)

router.get('/get/reminders', getReminders)
router.delete('/delete/reminder', deleteReminders)

module.exports = router
