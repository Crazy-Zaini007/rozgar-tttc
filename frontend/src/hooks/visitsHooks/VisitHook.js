import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import {
    getVisitAgent_Payments_In,
    getVisitAgent_Payments_Out,

    getVisitSupplier_Payments_In,
    getVisitSupplier_Payments_Out,

    getVisitCand_Payments_In,
    getVisitCand_Payments_Out
} from '../../redux/reducers/visitSlice'

export default function VisitHook() {
    const dispatch = useDispatch()
    const { user } = useAuthContext()
    const getVisitAgentPaymentsIn = async () => {
        try {
            const response = await fetch('/auth/visit/agents/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getVisitAgent_Payments_In(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getVisitAgentPaymentsOut = async () => {
        try {
            const response = await fetch('/auth/visit/agents/get/payment_out_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getVisitAgent_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }


    const getVisitSupplierPaymentsIn = async () => {
        try {
            const response = await fetch('/auth/visit/suppliers/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getVisitSupplier_Payments_In(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getVisitSupplierPaymentsOut = async () => {
        try {
            const response = await fetch('/auth/visit/suppliers/get/payment_out_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getVisitSupplier_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getVisitCandPaymentsIn = async () => {
        try {
            const response = await fetch('/auth/visit/candidates/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getVisitCand_Payments_In(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getVisitCandPaymentsOut = async () => {
        try {
            const response = await fetch('/auth/visit/candidates/get/payment_out_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getVisitCand_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }


    return { getVisitAgentPaymentsIn, getVisitAgentPaymentsOut, getVisitSupplierPaymentsIn, getVisitSupplierPaymentsOut, getVisitCandPaymentsIn, getVisitCandPaymentsOut }
}
