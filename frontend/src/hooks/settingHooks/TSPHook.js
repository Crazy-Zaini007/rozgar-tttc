
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getTicketSalesParty } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function TSPHook() {
  const dispatch = useDispatch();

  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;
  
  const getTSPData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/get_tsp`,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getTicketSalesParty(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      
      
    }
  };

  return {getTSPData };
}
