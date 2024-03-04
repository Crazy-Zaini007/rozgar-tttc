import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    expenses: []
}

export const expenseSlice = createSlice({
    name: 'expenseSlice',
    initialState,
    reducers: {
        //1- Expenses Reducers
        // a- getting getExpense
        getExpense: (state, action) => {
            state.expenses = action.payload
        },

        //b- adding Expense
        addExpense: (state, action) => {
            state.expenses.push(action.payload);
        },

        // c- deleting a single Expense
        deleteExpense: (state, action) => {
            state.expenses = state.expenses.filter((e) => e._id !== action.payload._id);
        },

        // d- Updating a single Expense
        updateExpense: (state, action) => {
            state.expenses = state.expenses.map((expense) => {
                if (expense._id === action.payload._id) {
                    // If the expense ID matches the payload ID, update the expense
                    return action.payload;
                } else {
                    // Otherwise, return the expense unchanged
                    return expense;
                }
            });
        },
        //  d- adding multiple Expenses
        addMulExpenses: (state, action) => {
            // Assuming action.payload is an array of entries
            state.expenses.push(...action.payload);

        }

    },
})


// Action creators are generated for each case reducer function
export const { getExpense, addExpense, deleteExpense, updateExpense, addMulExpenses } = expenseSlice.actions

export default expenseSlice.reducer