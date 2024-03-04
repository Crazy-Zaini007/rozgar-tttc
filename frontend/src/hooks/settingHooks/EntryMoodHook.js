import { useAuthContext } from '../userHooks/UserAuthHook';
import { getEntryMode } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function EntryMoodHook() {

  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const getEntryMoodData = async () => {
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/setting/entry/get_entry_mode', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getEntryMode(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      
      
    }
  };

  return {getEntryMoodData };
}
