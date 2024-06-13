import {useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getAgent_Payments_In, getAgent_Payments_Out } from '../../redux/reducers/agentSlice'

export default function AgentHook() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const abortCont = useRef(new AbortController());
    
    const dispatch = useDispatch()
    const { user } = useAuthContext()
    const getPaymentsIn = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/agents/get/payment_in_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,

                },
                signal: abortCont.current.signal
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getAgent_Payments_In(json.data)); // Dispatch the action with received data
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
            const response = await fetch(`${apiUrl}/auth/agents/get/payment_out_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getAgent_Payments_Out(json.data)); // Dispatch the action with received data
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

    const getAgentPaymentsIn = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/agents/get/payment_in_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,

                },
                signal: abortCont.current.signal
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getAgent_Payments_In(json.data)); // Dispatch the action with received data
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

    const getAgentPaymentsOut = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/agents/get/payment_out_details`, {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getAgent_Payments_Out(json.data)); // Dispatch the action with received data
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


    return { getPaymentsIn, getPaymentsOut ,getAgentPaymentsIn, getAgentPaymentsOut}
}
