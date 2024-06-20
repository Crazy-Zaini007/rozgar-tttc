import {useRef } from 'react';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getCrediterSupplierParty } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function CreditorSupplierHook() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const dispatch = useDispatch();
  const abortCont = useRef(new AbortController());

  const { user } = useAuthContext();
  // b- getting visa Supplier Purchase Parties
  const getCreditoSupplierData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/get_creditor_supplier`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        signal: abortCont.current.signal

      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getCrediterSupplierParty(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      if (error.name === 'AbortError') {
      } else {
        console.log(error);
      }
    }
  };

  return {getCreditoSupplierData};
}
