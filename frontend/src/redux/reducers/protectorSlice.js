import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    protector_Payments_Out: []
}

export const protectorSlice = createSlice({
    name: 'protectorSlice',
    initialState,
    reducers: {
      
        //1- Agent Payment Out Reducers
        // a- getting agent_Payments_Out
          getProtctor_Payments_Out: (state, action) => {
            state.protector_Payments_Out = action.payload
        },


    },
})


// Action creators are generated for each case reducer function
export const { getProtctor_Payments_Out } = protectorSlice.actions

export default protectorSlice.reducer