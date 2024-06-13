import {useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getSup_Payments_In, getSup_Payments_Out } from '../../redux/reducers/supplierSlice'

export default function SupplierHook() {
    const dispatch = useDispatch()
    const { user } = useAuthContext()
    const abortCont = useRef(new AbortController());

    const apiUrl = process.env.REACT_APP_API_URL;
    const getPaymentsIn = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/suppliers/get/payment_in_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getSup_Payments_In(json.data)); // Dispatch the action with received data
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
            const response = await fetch(`${apiUrl}/auth/suppliers/get/payment_out_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getSup_Payments_Out(json.data)); // Dispatch the action with received data
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

    const getSupplierPaymentsIn = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/suppliers/get/payment_in_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getSup_Payments_In(json.data)); // Dispatch the action with received data
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

    const getSupplierPaymentsOut = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/suppliers/get/payment_out_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getSup_Payments_Out(json.data)); // Dispatch the action with received data
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


    return { getPaymentsIn, getPaymentsOut,getSupplierPaymentsIn,getSupplierPaymentsOut }
}
