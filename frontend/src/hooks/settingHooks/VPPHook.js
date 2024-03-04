import { useAuthContext } from '../userHooks/UserAuthHook';
import { getVisaPurchaseParty } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function VPPHook() {

  const dispatch = useDispatch();

  const { user } = useAuthContext();

  
  const getVPPData = async () => {
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/setting/entry/get_vpp', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getVisaPurchaseParty(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
     
      
    }
  };

  return {getVPPData };
}
