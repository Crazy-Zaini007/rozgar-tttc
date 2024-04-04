import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getAssets_Payments_In} from '../../redux/reducers/assetsSlice'

export default function AssetsHook() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const dispatch = useDispatch()
    const { user } = useAuthContext()
    const getPayments = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/assets/get/payment_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getAssets_Payments_In(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }
    return { getPayments }
}
