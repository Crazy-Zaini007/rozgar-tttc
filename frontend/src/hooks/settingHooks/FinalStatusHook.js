import { useAuthContext } from '../userHooks/UserAuthHook';
import { getFinalStatus } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function FinalStatusHook() {


  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const getFinalStatusData = async () => {
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/setting/entry/get_final_status', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getFinalStatus(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
     
      
    }
  };

  return {getFinalStatusData };
}
