import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getCandidate_Payments_In, getCandidate_Payments_Out } from '../../redux/reducers/candidateSlice'

export default function CandidateHook() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const dispatch = useDispatch()
    const { user } = useAuthContext()
    const getPaymentsIn = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/candidates/get/payment_in_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getCandidate_Payments_In(json.data)); // Dispatch the action with received data
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
            const response = await fetch(`${apiUrl}/auth/candidates/get/payment_out_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getCandidate_Payments_Out(json.data)); // Dispatch the action with received data
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
