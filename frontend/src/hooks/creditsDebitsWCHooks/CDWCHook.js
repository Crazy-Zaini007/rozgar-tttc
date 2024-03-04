import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getCDWC_Payments_In, getCDWC_Payments_Out } from '../../redux/reducers/creditsDebitsWCSlice'

export default function CDWCHook() {
    const dispatch = useDispatch()
    const { user } = useAuthContext()
    const getPaymentsIn = async () => {
        try {
            const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/credits&debits/with_cash_in_hand/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getCDWC_Payments_In(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getPaymentsOut = async () => {
        try {
            const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/credits&debits/with_cash_in_hand/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getCDWC_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }


    return { getPaymentsIn, getPaymentsOut }
}
