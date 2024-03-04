import { useAuthContext } from '../userHooks/UserAuthHook';
import { getVisitSalesParty } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function VISPHook() {

  const dispatch = useDispatch();

  const { user } = useAuthContext();
  // b- getting visa Supplier Purchase Parties
  const getVISPData = async () => {
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/setting/entry/get_visp', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getVisitSalesParty(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      
    }
  };

  return {getVISPData };
}
