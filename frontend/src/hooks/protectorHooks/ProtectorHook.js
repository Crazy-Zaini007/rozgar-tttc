import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getProtctor_Payments_Out } from '../../redux/reducers/protectorSlice'

export default function ProtectorHook() {
    const dispatch = useDispatch()
    const { user } = useAuthContext()
    const apiUrl = process.env.REACT_APP_API_URL;
   
    const getPaymentsOut = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/protectors/get/payment_out_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getProtctor_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }


    return { getPaymentsOut }
}
