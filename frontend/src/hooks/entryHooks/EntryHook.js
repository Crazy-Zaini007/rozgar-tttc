import { useState } from 'react'
import { getEntry, deleteEntry } from '../../redux/reducers/entrySlice'
import { useAuthContext } from '../userHooks/UserAuthHook';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function EntryHook() {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false)
  const [, setNewMessage] = useState('')

  const getEntries = async () => {
    setLoading(true)
    try {
      const response = await fetch('/auth/entries/get/enteries', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        setLoading(false)
        dispatch(getEntry(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      setLoading(false)

    }
  }


  // Deleting a single entry Hook
  const delEntry = async (entryId) => {
    try {
      const response = await fetch('/auth/entries/delete/entry', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ entryId })
      });

      const json = await response.json();
      if (response.ok) {
        setLoading(false)
        setNewMessage(toast.success(json.message))
        dispatch(deleteEntry(json.data)); // Dispatch the action with received data
      }
      if (!response.ok) {
        setLoading(false)
        setNewMessage(toast.error(json.message))
      }
    }
    catch (err) {
      setLoading(false)
      setNewMessage(toast.error("Server is Not Responding"))
    }
  }



  return { getEntries, loading, delEntry }
}
