const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const {addRequirement,deleteRequirement,updateRequirement,addComment,deleteComment,getAllRequirements}=require('../../controllers/requirements/RequirementsController')

const router = express.Router()
router.use(userAuth)

router.post('/add/requirement', addRequirement)
router.delete('/delete/requirement', deleteRequirement)
router.patch('/update/requirement', updateRequirement)
router.post('/add/requirement/comment', addComment)
router.delete('/delete/requirement/comment', deleteComment)
router.get('/get/requirement', getAllRequirements)

module.exports = router