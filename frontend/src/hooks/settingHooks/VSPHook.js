import { useAuthContext } from '../userHooks/UserAuthHook';
import { getVisaSalesParty } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function VSPHook() {


  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const getVSPData = async () => {
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/setting/entry/get_vsp', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getVisaSalesParty(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
     
      
    }
  };

  return {getVSPData };
}
