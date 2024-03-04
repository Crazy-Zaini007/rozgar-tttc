import React,{useState} from 'react'
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
   
    const getCashInHandData = async () => {
      setLoading(true)
      
      try {
        const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/cash_in_hand/get/cash', {
         
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
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
        setLoading(false);
      }
    }

    
    const getOverAllPayments = async () => {
      setLoading(true)
      
      try {
        const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/reports/get/all/payments', {
         
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
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
        setLoading(false);
      }
    }
  return {getCashInHandData,getOverAllPayments,overAllPayments}
}
