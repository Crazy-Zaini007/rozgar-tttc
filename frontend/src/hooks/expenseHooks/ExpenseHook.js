import {useRef } from 'react';
import { getExpense } from '../../redux/reducers/expenseSlice'
import { useAuthContext } from '../userHooks/UserAuthHook';
import { useDispatch } from 'react-redux';

export default function EntryHook() {
    const dispatch = useDispatch();
    const { user } = useAuthContext();
    const apiUrl = process.env.REACT_APP_API_URL;
    const abortCont = useRef(new AbortController());

    const getExpenses = async () => {

        try {
            const response = await fetch(`${apiUrl}/auth/expenses/get/expenses`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal
            });

            const json = await response.json();
            if (response.ok) {

                dispatch(getExpense(json.data)); // Dispatch the action with received data
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                
            } else {
              console.log(error);
            }

        }
    }


    return { getExpenses }
}
