import {useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getProtctor_Payments_Out } from '../../redux/reducers/protectorSlice'

export default function ProtectorHook() {
    const dispatch = useDispatch()
    const { user } = useAuthContext()
    const apiUrl = process.env.REACT_APP_API_URL;
    const abortCont = useRef(new AbortController());
   
    const getPaymentsOut = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/protectors/get/payment_out_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getProtctor_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                
            } else {
              console.log(error);
            }

        }
    }


    return { getPaymentsOut }
}
