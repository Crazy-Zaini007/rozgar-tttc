import {useRef } from 'react';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { useState } from 'react';
export default function BackupHook() {
    const[backup,setBackup]=useState('')
    const { user } = useAuthContext();
    const apiUrl = process.env.REACT_APP_API_URL;
    const abortCont = useRef(new AbortController());

    const getBackup = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/backup/get/backup`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                setBackup(json.data); // Dispatch the action with received data
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                
            } else {
              console.log(error);
            }
        }
    }


    return { getBackup,backup }
}
