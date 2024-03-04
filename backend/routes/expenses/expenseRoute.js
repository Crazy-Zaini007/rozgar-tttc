const userAuth = require('../../middleware/userMiddleware/userAuth')
const { addExpense, getExpenses, delExpense, updateExpense } = require('../../controllers/expenses/ExpenseController')
const express = require('express');
const router = express.Router()
router.use(userAuth)

// adding a single Expense
router.post('/add/expense', addExpense)

// Geting Expenses
router.get('/get/expenses', getExpenses)

// deleting a single Expense
router.delete('/delete/expense', delExpense)

// deleting a single Expense
router.patch('/update/expense', updateExpense)

module.exports = router


