import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  collapsed: false
};

export const collapseSlice = createSlice({
  name: 'collapseSlice',
  initialState,
  reducers: {
    toggleCollapse: state => {
      state.collapsed = !state.collapsed;
    }
  }
});

export const { toggleCollapse } = collapseSlice.actions;

export default collapseSlice.reducer;
