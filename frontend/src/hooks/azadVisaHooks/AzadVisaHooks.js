import { useDispatch } from 'react-redux';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getAzadAgent_Payments_In, getAzadAgent_Payments_Out, getAzadSupplier_Payments_In, getAzadSupplier_Payments_Out, getAzadCand_Payments_In, getAzadCand_Payments_Out } from '../../redux/reducers/azadVisaSlice'

export default function AzadVisaHook() {
    const dispatch = useDispatch()
    const { user } = useAuthContext()
    const getAzadAgentPaymentsIn = async () => {
        try {
            const response = await fetch('/auth/azadvisa/agents/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getAzadAgent_Payments_In(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getAzadAgentPaymentsOut = async () => {
        try {
            const response = await fetch('/auth/azadvisa/agents/get/payment_out_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getAzadAgent_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }


    const getAzadSupplierPaymentsIn = async () => {
        try {
            const response = await fetch('/auth/azadvisa/suppliers/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getAzadSupplier_Payments_In(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getAzadSupplierPaymentsOut = async () => {
        try {
            const response = await fetch('/auth/azadvisa/suppliers/get/payment_out_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getAzadSupplier_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getAzadCandPaymentsIn = async () => {
        try {
            const response = await fetch('/auth/azadvisa/candidates/get/payment_in_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getAzadCand_Payments_In(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getAzadCandPaymentsOut = async () => {
        try {
            const response = await fetch('/auth/azadvisa/candidates/get/payment_out_details', {
                headers: {

                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                dispatch(getAzadCand_Payments_Out(json.data)); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }


    return { getAzadAgentPaymentsIn, getAzadAgentPaymentsOut, getAzadSupplierPaymentsIn, getAzadSupplierPaymentsOut, getAzadCandPaymentsIn, getAzadCandPaymentsOut }
}
