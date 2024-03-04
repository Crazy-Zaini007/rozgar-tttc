import { getExpense } from '../../redux/reducers/expenseSlice'
import { useAuthContext } from '../userHooks/UserAuthHook';
import { useDispatch } from 'react-redux';

export default function EntryHook() {
    const dispatch = useDispatch();
    const { user } = useAuthContext();

    const getExpenses = async () => {

        try {
            const response = await fetch('/auth/expenses/get/expenses', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {

                dispatch(getExpense(json.data)); // Dispatch the action with received data
            }
        } catch (error) {


        }
    }


    return { getExpenses }
}
