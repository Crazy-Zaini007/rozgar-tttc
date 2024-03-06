import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getCDWOC_Payments_In, getCDWOC_Payments_Out } from '../../redux/reducers/creditsDebitsWOCSlice'

export default function CDWOCHook() {
    const dispatch = useDispatch()
    const { user } = useAuthContext()
    const getPaymentsIn = async () => {
        try {
            const response = await fetch('/auth/credits&debits/without_cash_in_hand/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getCDWOC_Payments_In(json.data)); // Dispatch the action with received data
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
            const response = await fetch('/auth/credits&debits/without_cash_in_hand/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getCDWOC_Payments_Out(json.data)); // Dispatch the action with received data
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
