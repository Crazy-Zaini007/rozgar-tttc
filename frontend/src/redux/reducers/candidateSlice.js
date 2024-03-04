import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    candidate_Payments_In: [],
    candidate_Payments_Out: []
}

export const candidateSlice = createSlice({
    name: 'candidateSlice',
    initialState,
    reducers: {
        //1- Candidates Payment In Reducers
        // a- getting all candidate_Payments_In
        getCandidate_Payments_In: (state, action) => {
            state.candidate_Payments_In = action.payload
        },

        //1- Agent Payment Out Reducers
        // a- getting candidate_Payments_Out
        getCandidate_Payments_Out: (state, action) => {
            state.candidate_Payments_Out = action.payload
        },


    },
})


// Action creators are generated for each case reducer function
export const { getCandidate_Payments_In, getCandidate_Payments_Out } = candidateSlice.actions

export default candidateSlice.reducer