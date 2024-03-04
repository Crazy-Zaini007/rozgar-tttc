import { useAuthContext } from '../userHooks/UserAuthHook';
import { getCountry } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function CountryHook() {


  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const getCountryData = async () => {
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/setting/entry/get_country', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getCountry(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      
      
    }
  };

  return {getCountryData };
}
