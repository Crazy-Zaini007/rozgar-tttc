import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    azadAgent_Payments_In: [],
    azadAgent_Payments_Out: [],

    azadSupplier_Payments_In: [],
    azadSupplier_Payments_Out: [],

    azadCand_Payments_In: [],
    azadCand_Payments_Out: [],
}

export const azadVisaSlice = createSlice({
    name: 'azadVisaSlice',
    initialState,
    reducers: {

        getAzadAgent_Payments_In: (state, action) => {
            state.azadAgent_Payments_In = action.payload
        },

        getAzadAgent_Payments_Out: (state, action) => {
            state.azadAgent_Payments_Out = action.payload
        },

        getAzadSupplier_Payments_In: (state, action) => {
            state.azadSupplier_Payments_In = action.payload
        },

        getAzadSupplier_Payments_Out: (state, action) => {
            state.azadSupplier_Payments_Out = action.payload
        },


        getAzadCand_Payments_In: (state, action) => {
            state.azadCand_Payments_In = action.payload
        },

        getAzadCand_Payments_Out: (state, action) => {
            state.azadCand_Payments_Out = action.payload
        },


    },
})


// Action creators are generated for each case reducer function
export const { getAzadAgent_Payments_In, getAzadAgent_Payments_Out, getAzadSupplier_Payments_In, getAzadSupplier_Payments_Out, getAzadCand_Payments_In, getAzadCand_Payments_Out } = azadVisaSlice.actions

export default azadVisaSlice.reducer