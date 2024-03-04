import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  enteries:[]
}

export const entrySlice = createSlice({
  name: 'entrySlice',
  initialState,
  reducers: {

    //1- Entries Reducers
    // a- getting Entries
    getEntry: (state, action) => {
      state.enteries = action.payload
    },

    //b- adding Entries
    addEntry: (state, action) => {
      state.enteries.push(action.payload);
    },

    // c- deleting a single entry
    deleteEntry: (state, action) => { 
       state.enteries = state.enteries.filter((e) => e._id !== action.payload._id);
    },

    // d- Updating a single Entry
   updateEntry: (state, action) => {
  state.enteries = state.enteries.map((entry) => {
    if (entry._id === action.payload._id) {
      // If the entry ID matches the payload ID, update the entry
      return action.payload;
    } else {
      // Otherwise, return the entry unchanged
      return entry;
    }
  });
    },
    //  d- adding multiple Enteries
    addMulEnteries: (state, action) => {
     // Assuming action.payload is an array of entries
    state.enteries.push(...action.payload);

   }

  },
})


// Action creators are generated for each case reducer function
export const {getEntry,addEntry,deleteEntry,updateEntry,addMulEnteries } = entrySlice.actions

export default entrySlice.reducer