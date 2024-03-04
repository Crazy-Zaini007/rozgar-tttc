const userAuth = require('../../middleware/userMiddleware/userAuth')
const { addEntry, getEntry, delEntry, updateEntry, addMultipleEnteries } = require('../../controllers/enteries/EntryController')
const express = require('express');
const router = express.Router()

router.use(userAuth)

// adding a single Entry

router.post('/add/single_entry', addEntry)

//adding multiple Entries
router.post('/add/multiple_enteries', addMultipleEnteries)

// getting all enteries

router.get('/get/enteries', getEntry)

// deleting a single Entry
router.delete('/delete/entry', delEntry)


// updating a single entry
router.patch('/update/single_entry/:entryId', updateEntry)

module.exports = router
