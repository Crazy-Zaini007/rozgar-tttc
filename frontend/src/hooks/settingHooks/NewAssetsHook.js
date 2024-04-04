import { useAuthContext } from '../userHooks/UserAuthHook';
import { getAssets } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function NewAssetsHook() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const getAssetsData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/get_asset`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        }
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getAssets(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
    }
  };

  return {getAssetsData };
}
