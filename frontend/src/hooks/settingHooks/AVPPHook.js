import { useAuthContext } from '../userHooks/UserAuthHook';
import { getAzadVisaPurchaseParty } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function AVPPHook() {

  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const getAVPPData = async () => {
    try {
      const response = await fetch('/auth/setting/entry/get_avpp', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getAzadVisaPurchaseParty(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      
    }
  };

  return {getAVPPData };
}
