import {useRef } from 'react';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getPaymentVia } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function PaymentViaHook() {

  const dispatch = useDispatch();
  const apiUrl = process.env.REACT_APP_API_URL;
  const abortCont = useRef(new AbortController());

  const { user } = useAuthContext();

  const getPaymentViaData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/get_payment_via`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        signal: abortCont.current.signal

      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getPaymentVia(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      if (error.name === 'AbortError') {
                
      } else {
        console.log(error);
      }
      
    }
  };

  return {getPaymentViaData };
}
