import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    agent_Payments_In: [],
    agent_Payments_Out: []
}

export const agentSlice = createSlice({
    name: 'agentSlice',
    initialState,
    reducers: {
        //1- Suppliers Payment In Reducers
        // a- getting all agent_Payments_In
        getAgent_Payments_In: (state, action) => {
            state.agent_Payments_In = action.payload
        },

        //1- Agent Payment Out Reducers
        // a- getting agent_Payments_Out
        getAgent_Payments_Out: (state, action) => {
            state.agent_Payments_Out = action.payload
        },


    },
})


// Action creators are generated for each case reducer function
export const { getAgent_Payments_In, getAgent_Payments_Out } = agentSlice.actions

export default agentSlice.reducer