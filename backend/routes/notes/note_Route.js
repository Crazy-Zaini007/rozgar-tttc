const express = require('express');
const userAuth = require('../../middleware/userMiddleware/userAuth')
const {addNote,getNotes,deleteNote,updateNote}=require('../../controllers/notes/noteController')

const router = express.Router()
router.use(userAuth)

router.post('/add/note', addNote)
router.get('/get/note', getNotes)

router.delete('/delete/note', deleteNote)
router.patch('/update/note', updateNote)

module.exports = router
