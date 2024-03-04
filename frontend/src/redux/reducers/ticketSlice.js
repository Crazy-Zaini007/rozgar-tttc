import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    ticketAgent_Payments_In: [],
    ticketAgent_Payments_Out: [],

    ticketSupplier_Payments_In: [],
    ticketSupplier_Payments_Out: [],

    ticketCand_Payments_In: [],
    ticketCand_Payments_Out: [],
}

export const ticketSlice = createSlice({
    name: 'ticketSlice',
    initialState,
    reducers: {

        getTicketAgent_Payments_In: (state, action) => {
            state.ticketAgent_Payments_In = action.payload
        },

        getTicketAgent_Payments_Out: (state, action) => {
            state.ticketAgent_Payments_Out = action.payload
        },

        getTicketSupplier_Payments_In: (state, action) => {
            state.ticketSupplier_Payments_In = action.payload
        },

        getTicketSupplier_Payments_Out: (state, action) => {
            state.ticketSupplier_Payments_Out = action.payload
        },


        getTicketCand_Payments_In: (state, action) => {
            state.ticketCand_Payments_In = action.payload
        },

        getTicketCand_Payments_Out: (state, action) => {
            state.ticketCand_Payments_Out = action.payload
        },


    },
})


// Action creators are generated for each case reducer function
export const {
    getTicketAgent_Payments_In,
    getTicketAgent_Payments_Out,
    getTicketSupplier_Payments_In,
    getTicketSupplier_Payments_Out,
    getTicketCand_Payments_In,
    getTicketCand_Payments_Out

} = ticketSlice.actions

export default ticketSlice.reducer