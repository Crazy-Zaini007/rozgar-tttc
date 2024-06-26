import {useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getCDWOC_Payments_In, getCDWOC_Payments_Out } from '../../redux/reducers/creditsDebitsWOCSlice'

export default function CDWOCHook() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const abortCont = useRef(new AbortController());

    const dispatch = useDispatch()
    const { user } = useAuthContext()
    const getPaymentsIn = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/credits&debits/without_cash_in_hand/get/payment_in_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getCDWOC_Payments_In(json.data)); // Dispatch the action with received data
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

    const getPaymentsOut = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/credits&debits/without_cash_in_hand/get/payment_in_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getCDWOC_Payments_Out(json.data)); // Dispatch the action with received data
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
    const getCDWOCPaymentsIn = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/credits&debits/without_cash_in_hand/get/payment_in_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getCDWOC_Payments_In(json.data)); // Dispatch the action with received data
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

    const getCDWOCPaymentsOut = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/credits&debits/without_cash_in_hand/get/payment_in_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getCDWOC_Payments_Out(json.data)); // Dispatch the action with received data
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

    return { getPaymentsIn, getPaymentsOut,getCDWOCPaymentsIn,getCDWOCPaymentsOut }
}
