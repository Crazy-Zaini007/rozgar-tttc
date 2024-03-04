import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    employees: []
}

export const employeeSlice = createSlice({
    name: 'employeeSlice',
    initialState,
    reducers: {
        //1- employees Reducers
        // a- getting employees
        getEmployee: (state, action) => {
            state.employees = action.payload
        },

        //b- adding employees
        addEmployee: (state, action) => {
            state.employees.push(action.payload);
        },

        // c- deleting a single employee
        deleteEmployee: (state, action) => {
            state.employees = state.expenses.filter((e) => e._id !== action.payload._id);
        },

        // d- Updating a single employee
        updateEmployee: (state, action) => {
            state.employees = state.employees.map((employee) => {
                if (employee._id === action.payload._id) {
                    // If the expense ID matches the payload ID, update the expense
                    return action.payload;
                } else {
                    // Otherwise, return the expense unchanged
                    return employee;
                }
            });
        },

    },
})


// Action creators are generated for each case reducer function
export const { getEmployee, addEmployee, deleteEmployee, updateEmployee} = employeeSlice.actions

export default employeeSlice.reducer