import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import {
    getTicketAgent_Payments_In,
    getTicketAgent_Payments_Out,
    getTicketSupplier_Payments_In,
    getTicketSupplier_Payments_Out,
    getTicketCand_Payments_In,
    getTicketCand_Payments_Out
} from '../../redux/reducers/ticketSlice'

export default function TicketHook() {
    const dispatch = useDispatch()
    const { user } = useAuthContext()

    const getTicketAgentPaymentsIn = async () => {
        try {
            const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/ticket/agents/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getTicketAgent_Payments_In(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getTicketAgentPaymentsOut = async () => {
        try {
            const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/ticket/agents/get/payment_out_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getTicketAgent_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }


    const getTicketSupplierPaymentsIn = async () => {
        try {
            const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/ticket/suppliers/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getTicketSupplier_Payments_In(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getTicketSupplierPaymentsOut = async () => {
        try {
            const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/ticket/suppliers/get/payment_out_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getTicketSupplier_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getTicketCandPaymentsIn = async () => {
        try {
            const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/ticket/candidates/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getTicketCand_Payments_In(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getTicketCandPaymentsOut = async () => {
        try {
            const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/ticket/candidates/get/payment_out_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getTicketCand_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }


    return { getTicketAgentPaymentsIn, getTicketAgentPaymentsOut, getTicketSupplierPaymentsIn, getTicketSupplierPaymentsOut, getTicketCandPaymentsIn, getTicketCandPaymentsOut }
}
