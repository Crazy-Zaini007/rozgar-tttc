import { getEmployee } from '../../redux/reducers/employeeSlice'
import { useAuthContext } from '../userHooks/UserAuthHook';
import { useDispatch } from 'react-redux';

export default function EmployeeHook() {
    const dispatch = useDispatch();
    const { user } = useAuthContext();
    const apiUrl = process.env.REACT_APP_API_URL;

    const getEmployees = async () => {

        try {
            const response = await fetch(`${apiUrl}/auth/employees/get/employees`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {

                dispatch(getEmployee(json.data)); // Dispatch the action with received data
            }
        } catch (error) {


        }
    }


    return { getEmployees }
}
