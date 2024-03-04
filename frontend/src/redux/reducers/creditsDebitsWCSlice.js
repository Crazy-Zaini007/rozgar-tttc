import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    CDWC_Payments_In: [],
    CDWC_Payments_Out: []
}

export const creditdDebitsWCSlice = createSlice({
    name: 'creditdDebitsWCSlice',
    initialState,
    reducers: {
        //1- Suppliers Payment In Reducers
        // a- getting all CDWC_Payments_In
        getCDWC_Payments_In: (state, action) => {
            state.CDWC_Payments_In = action.payload
        },

        //1- Agent Payment Out Reducers
        // a- getting CDWC_Payments_Out
        getCDWC_Payments_Out: (state, action) => {
            state.CDWC_Payments_Out = action.payload
        },


    },
})


// Action creators are generated for each case reducer function
export const { getCDWC_Payments_In, getCDWC_Payments_Out } = creditdDebitsWCSlice.actions

export default creditdDebitsWCSlice.reducer