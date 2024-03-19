const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const {getNotifications,deleteNotification}=require('../../controllers/notifications/notifyController')

const router = express.Router()
router.use(userAuth)

router.get('/get/notification', getNotifications)
router.delete('/delete/notification', deleteNotification)

module.exports = router
