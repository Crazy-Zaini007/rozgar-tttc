import { useAuthContext } from '../userHooks/UserAuthHook';
import { getCurrency } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function CurrencyHook() {


  const dispatch = useDispatch();
  const apiUrl = process.env.REACT_APP_API_URL;

  const { user } = useAuthContext();

  const getCurrencyData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/get_currency`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getCurrency(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
    
      
    }
  };

  return {getCurrencyData};
}
