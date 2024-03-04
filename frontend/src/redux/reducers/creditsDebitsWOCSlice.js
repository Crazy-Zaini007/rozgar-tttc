import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    CDWOC_Payments_In: [],
    CDWOC_Payments_Out: []
}

export const creditdDebitsWOCSlice = createSlice({
    name: 'creditdDebitsWOCSlice',
    initialState,
    reducers: {
        //1- Suppliers Payment In Reducers
        // a- getting all CDWC_Payments_In
        getCDWOC_Payments_In: (state, action) => {
            state.CDWOC_Payments_In = action.payload
        },

        //1- Agent Payment Out Reducers
        // a- getting CDWC_Payments_Out
        getCDWOC_Payments_Out: (state, action) => {
            state.CDWOC_Payments_Out = action.payload
        },


    },
})


// Action creators are generated for each case reducer function
export const { getCDWOC_Payments_In, getCDWOC_Payments_Out } = creditdDebitsWOCSlice.actions

export default creditdDebitsWOCSlice.reducer