import { useAuthContext } from '../userHooks/UserAuthHook';
import { getCategory } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function CategoryHook() {


  const dispatch = useDispatch();

  const { user } = useAuthContext();
  
  const getCategoryData = async () => {
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/setting/entry/get_category', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getCategory(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
    
      
    }
  };

  return {getCategoryData };
}
