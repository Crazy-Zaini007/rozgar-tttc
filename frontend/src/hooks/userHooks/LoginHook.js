import {useState} from 'react'
import { useAuthContext } from "./UserAuthHook";
import {useNavigate} from 'react-router-dom'

export default function LoginHook() {
    const {dispatch}=useAuthContext()
    const [isLoading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [success,setSuccess]=useState(null)
    const[emptyFields,setEmptyFields]=useState([])

    const navigate=useNavigate()
    
    // fetching api end-point to register a new user
    const userLogin=async(userName,password)=>{
    
        setLoading(true)
        setSuccess(false)
            try {
                const response=await fetch('/auth/user/login',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({userName,password})
                })
        
                const json=await response.json()
                if(!response.ok){
                    setLoading(false)
                    setError(json.message)
                    setEmptyFields(json.emptyFields)
                    setSuccess(false)
                }
                if(response.ok){
                    setTimeout(() => {
                    localStorage.setItem('user', JSON.stringify(json))
                        dispatch({type: 'USER_LOGIN', payload:json})
                         navigate('/rozgar/dashboard')
                   
                    }, 1500);
                    setLoading(false)
                    setError(null)
                    setEmptyFields([' '])
                    setSuccess(json.message)
                }

               } catch (error) {
                setError('Server is not responding')
            setLoading(false)

               }
    
    }
  return {isLoading,error,success,emptyFields,userLogin}
}
