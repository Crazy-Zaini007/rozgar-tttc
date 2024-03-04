import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
export default function SignupHook() {
    const navigate=useNavigate()
    const [isLoading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [success,setSuccess]=useState(null)
    const[emptyFields,setEmptyFields]=useState([])
    
    // fetching api end-point to register a new user
    const userSignup=async(userName,role,companyCode,password)=>{
        
        setLoading(true)
        setSuccess(false)
            try {
                const response=await fetch('https://api-rozgar-tttc.onrender.com/auth/user/register',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({userName,role,companyCode,password})
                })
        
                const json=await response.json()
                if(!response.ok){
                    setLoading(false)
                    setError(json.message)
                    setEmptyFields(json.emptyFields)
                    setSuccess(false)
                }
                if(response.ok){
                    setLoading(false)
                    setError(null)
                    setEmptyFields([' '])
                    setSuccess(json.message)
                    console.log(success)
                    setTimeout(() => {
                navigate('rozgar/login')
                        
                    }, 2000);
                }
               } catch (error) {
                setError('Server is not responding')
            setLoading(false)

               }
    
    }
  return {isLoading,error,success,emptyFields,userSignup}
}
