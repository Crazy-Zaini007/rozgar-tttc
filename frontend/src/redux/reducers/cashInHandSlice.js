import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cashInHand: []
}

export const cashInHandSlice = createSlice({
    name: 'cashInHandSlice',
    initialState,
    reducers: {
        //1- Expenses Reducers
        // a- getting getExpense
        getCashInHand: (state, action) => {
            state.cashInHand = action.payload
        },

        //b- adding Expense
        addCashInHand: (state, action) => {
            state.cashInHand.push(action.payload);
        },

    },
})


// Action creators are generated for each case reducer function
export const { getCashInHand, addCashInHand} = cashInHandSlice.actions

export default cashInHandSlice.reducer