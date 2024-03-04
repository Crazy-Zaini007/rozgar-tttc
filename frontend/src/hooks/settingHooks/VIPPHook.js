import { useAuthContext } from '../userHooks/UserAuthHook';
import { getVisitPurchaseParty } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function VIPPHook() {

  const dispatch = useDispatch();

  const { user } = useAuthContext();
  // b- getting visa Supplier Purchase Parties
  const getVIPPData = async () => {
    try {
      const response = await fetch('/auth/setting/entry/get_vipp', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getVisitPurchaseParty(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      
    }
  };

  return {getVIPPData };
}
