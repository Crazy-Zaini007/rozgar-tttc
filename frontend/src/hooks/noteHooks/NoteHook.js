import {useRef } from 'react';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { useState } from 'react';
export default function NoteHook() {
    const[notes,setNotes]=useState('')
    const { user } = useAuthContext();
    const apiUrl = process.env.REACT_APP_API_URL;
    const abortCont = useRef(new AbortController());

    const getNotes = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/notes/get/note`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
                signal: abortCont.current.signal

            });

            const json = await response.json();
            if (response.ok) {
                setNotes(json.data); // Dispatch the action with received data
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                
            } else {
              console.log(error);
            }
        }
    }


    return { getNotes,notes }
}
