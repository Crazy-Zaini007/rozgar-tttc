const mongoose = require('mongoose')

// Expense Categories

const expenseCategories = new mongoose.Schema({
    category: {
        type: String,
        required: true
    }
}, { timestamps: true })


const ExpenseCategories=mongoose.model('ExpenseCategories',expenseCategories)

module.exports=ExpenseCategories