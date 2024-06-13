import {useRef } from 'react';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getVisitSalesParty } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function VISPHook() {

  const dispatch = useDispatch();
  const apiUrl = process.env.REACT_APP_API_URL;
  const abortCont = useRef(new AbortController());

  const { user } = useAuthContext();
  // b- getting visa Supplier Purchase Parties
  const getVISPData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/get_visp`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        signal: abortCont.current.signal

      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getVisitSalesParty(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      if (error.name === 'AbortError') {
                
      } else {
        console.log(error);
      }
    }
  };

  return {getVISPData };
}
