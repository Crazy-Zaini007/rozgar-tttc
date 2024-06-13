import {useRef } from 'react';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getEntryMode } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function EntryMoodHook() {

  const dispatch = useDispatch();
  const apiUrl = process.env.REACT_APP_API_URL;
  const abortCont = useRef(new AbortController());

  const { user } = useAuthContext();

  const getEntryMoodData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/get_entry_mode`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        signal: abortCont.current.signal

      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getEntryMode(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      if (error.name === 'AbortError') {
                
      } else {
        console.log(error);
      }
    }
  };

  return {getEntryMoodData };
}
