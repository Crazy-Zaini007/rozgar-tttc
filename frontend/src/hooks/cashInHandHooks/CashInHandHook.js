import React,{useState,useRef} from 'react'
import { getCashInHand } from '../../redux/reducers/cashInHandSlice'
import { useAuthContext } from '../userHooks/UserAuthHook';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function CashInHandHook() {
    const dispatch = useDispatch();
  const[overAllPayments,setOverAllPayments]=useState([])
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(null)
    const [, setNewMessage] = useState('')

const abortCont = useRef(new AbortController());
const apiUrl = process.env.REACT_APP_API_URL;
   
    const getCashInHandData = async () => {
      setLoading(true)
      
      try {
        const response = await fetch(`${apiUrl}/auth/cash_in_hand/get/cash`, {
         
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          signal: abortCont.current.signal

        })
  
        const json = await response.json();
        if (!response.ok) {
          setLoading(false)
          setNewMessage(toast.error(json.message));
        }
        if (response.ok) {
          setNewMessage(toast.success(json.message));
          dispatch(getCashInHand(json.data)); // Dispatch the action with received data

        }
      }
      catch (error) {
        if (error.name === 'AbortError') {
                
        } else {
          console.log(error);
        }
        setLoading(false);
      }
    }

    
    const getOverAllPayments = async () => {
      setLoading(true)
      
      try {
        const response = await fetch(`${apiUrl}/auth/reports/get/all/payments`, {
         
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          signal: abortCont.current.signal

        })
  
        const json = await response.json();
        if (!response.ok) {
          setLoading(false)
          setNewMessage(toast.error(json.message));
        }
        if (response.ok) {
          setNewMessage(toast.success(json.message));
          setOverAllPayments(json.data)

        }
      }
      catch (error) {
        if (error.name === 'AbortError') {
                
        } else {
          console.log(error);
        }
        setLoading(false);
      }
    }
  return {getCashInHandData,getOverAllPayments,overAllPayments}
}
