import {useRef } from 'react';
import { useAuthContext } from '../userHooks/UserAuthHook';
import { getVisaPurchaseParty } from '../../redux/reducers/settingSlice';
import { useDispatch } from 'react-redux';

export default function VPPHook() {

  const dispatch = useDispatch();
  const abortCont = useRef(new AbortController());

  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;
  
  const getVPPData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/get_vpp`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        signal: abortCont.current.signal

      });

      const json = await response.json();
      if (response.ok) {
        dispatch(getVisaPurchaseParty(json.data)); // Dispatch the action with received data
      }
    } catch (error) {
      if (error.name === 'AbortError') {
                
      } else {
        console.log(error);
      }
      
    }
  };

  return {getVPPData };
}
