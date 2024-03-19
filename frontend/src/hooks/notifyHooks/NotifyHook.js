import { useAuthContext } from '../userHooks/UserAuthHook';
import { useState } from 'react';
export default function NotifyHook() {
    const[notifications,setNotifications]=useState('')
    const { user } = useAuthContext();
    const apiUrl = process.env.REACT_APP_API_URL;
    const getNotifications = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/notifications/get/notification`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {

                setNotifications(json.data); // Dispatch the action with received data
            }
        } catch (error) {


        }
    }


    return { getNotifications,notifications }
}
