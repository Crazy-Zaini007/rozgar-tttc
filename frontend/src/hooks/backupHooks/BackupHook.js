import { useAuthContext } from '../userHooks/UserAuthHook';
import { useState } from 'react';
export default function BackupHook() {
    const[backup,setBackup]=useState('')
    const { user } = useAuthContext();
    const apiUrl = process.env.REACT_APP_API_URL;
    const getBackup = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/backup/get/backup`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                setBackup(json.data); // Dispatch the action with received data
            }
        } catch (error) {

        }
    }


    return { getBackup,backup }
}
