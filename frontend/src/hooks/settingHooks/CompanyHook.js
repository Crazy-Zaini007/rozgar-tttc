import { useAuthContext } from '../userHooks/UserAuthHook';
import { getCompany } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function CompanyHook() {

  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const getComapnyData = async () => {
    try {
      const response = await fetch('/auth/setting/entry/get_company', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getCompany(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      
    }
  };

  return {getComapnyData };
}
