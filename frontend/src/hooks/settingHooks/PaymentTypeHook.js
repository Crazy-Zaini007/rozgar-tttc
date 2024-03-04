import { useAuthContext } from '../userHooks/UserAuthHook';
import { getPaymentType } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function PaymentTypeHook() {


  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const getPaymentTypeData = async () => {
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/setting/entry/get_payment_type', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getPaymentType(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      
    }
  };

  return {getPaymentTypeData };
}
