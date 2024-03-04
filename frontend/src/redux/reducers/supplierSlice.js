import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    supp_Payments_In: [],
    supp_Payments_Out: []
}

export const supplierSlice = createSlice({
    name: 'supplierSlice',
    initialState,
    reducers: {
        //1- Suppliers Payment In Reducers
        // a- getting all supp_Payments_In
        getSup_Payments_In: (state, action) => {
            state.supp_Payments_In = action.payload
        },

        //1- Suppliers Payment Out Reducers
        // a- getting supp_Payments_Out
        getSup_Payments_Out: (state, action) => {
            state.supp_Payments_Out = action.payload
        },


    },
})


// Action creators are generated for each case reducer function
export const { getSup_Payments_In, getSup_Payments_Out } = supplierSlice.actions

export default supplierSlice.reducer