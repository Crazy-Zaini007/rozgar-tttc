import { useAuthContext } from '../userHooks/UserAuthHook';
import { getCurrCountry } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function CurrCountryHook() {

  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const getCurrCountryData = async () => {
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/setting/entry/get_curr_country', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getCurrCountry(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
     
      
    }
  };

  return {getCurrCountryData };
}
