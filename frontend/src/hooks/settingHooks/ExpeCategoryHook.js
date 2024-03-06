import { useAuthContext } from '../userHooks/UserAuthHook';
import { getExpeCategory } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function ExpeCategoryHook() {


  const dispatch = useDispatch();

  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

  const getExpenseCategoryData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/get_expense_category`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getExpeCategory(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      
    }
  };

  return {getExpenseCategoryData };
}
