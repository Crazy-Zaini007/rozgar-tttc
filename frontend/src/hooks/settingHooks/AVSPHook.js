import { useAuthContext } from '../userHooks/UserAuthHook';
import { getAzadVisaSalesParty } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function AVSPHook() {

  const dispatch = useDispatch();

  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

  const getAVSPData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/get_avsp`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getAzadVisaSalesParty(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      
    }
  };

  return {getAVSPData };
}
