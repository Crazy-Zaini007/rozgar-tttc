import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    assetsPayments: [],  
}
export const assetsSlice = createSlice({
    name: 'assets',
    initialState,
    reducers: {
        //1- Suppliers Payment In Reducers
        // a- getting all CDWC_Payments_In
        getAssets_Payments_In: (state, action) => {
            state.assetsPayments = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { getAssets_Payments_In } = assetsSlice.actions

export default assetsSlice.reducer