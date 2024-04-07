const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const {getNotification,deleteNotification}=require('../../controllers/notifications/notify_Controller')

const router = express.Router()
router.use(userAuth)

router.get('/get/notifications', getNotification)
router.delete('/delete/notification', deleteNotification)

module.exports = router
