import { useAuthContext } from '../userHooks/UserAuthHook';
import { getCrediterPurchaseParty } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function CPPHook() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const dispatch = useDispatch();

  const { user } = useAuthContext();
  // b- getting visa Supplier Purchase Parties
  const getCPPData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/get_cpp`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getCrediterPurchaseParty(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
     
      
    }
  };

  return {getCPPData };
}
