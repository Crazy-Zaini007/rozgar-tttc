import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    visitAgent_Payments_In: [],
    visitAgent_Payments_Out: [],

    visitSupplier_Payments_In: [],
    visitSupplier_Payments_Out: [],

    visitCand_Payments_In: [],
    visitCand_Payments_Out: [],
}

export const visitSlice = createSlice({
    name: 'visitSlice',
    initialState,
    reducers: {

        getVisitAgent_Payments_In: (state, action) => {
            state.visitAgent_Payments_In = action.payload
        },

        getVisitAgent_Payments_Out: (state, action) => {
            state.visitAgent_Payments_Out = action.payload
        },

        getVisitSupplier_Payments_In: (state, action) => {
            state.visitSupplier_Payments_In = action.payload
        },

        getVisitSupplier_Payments_Out: (state, action) => {
            state.visitSupplier_Payments_Out = action.payload
        },


        getVisitCand_Payments_In: (state, action) => {
            state.visitCand_Payments_In = action.payload
        },

        getVisitCand_Payments_Out: (state, action) => {
            state.visitCand_Payments_Out = action.payload
        },


    },
})


// Action creators are generated for each case reducer function
export const {
    getVisitAgent_Payments_In,
    getVisitAgent_Payments_Out,
    getVisitSupplier_Payments_In,
    getVisitSupplier_Payments_Out,
    getVisitCand_Payments_In,
    getVisitCand_Payments_Out
} = visitSlice.actions

export default visitSlice.reducer