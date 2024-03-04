import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import RiseLoader from "react-spinners/RiseLoader";
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import LoginHook from '../hooks/userHooks/LoginHook';
export default function Login() {
    const [userName,setUserName]=useState('')
    const [password,setPassword]=useState('')


    // fetching Login hook to Login a User
     const {isLoading,error,success,userLogin}=LoginHook()
    const handleLogin=async(e)=>{
        e.preventDefault()
        userLogin(userName,password)
    }




    
// Show and hide password
const [showPassword, setShowPassword] = useState(false);


const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <>
            <div className='container-fluid register_form py-2 my-5'>
                <div className="row justify-content-center px-2">
                    <Paper className='col-lg-4 col-md-7 col-sm-9 pt-4 my-1 rounded  px-sm-3'>
                        <div>
                        <form onSubmit={handleLogin}>
                         {/* <div className='mb-3 justify-content-center image mx-auto'>
                              <img src={logo} alt="" className='text-center mx-auto'/>
                            </div> */}
                            <h4 className='my-1 text-left'>Login to your Account</h4>
                            
                            <p className='text-left'>Enter your UserName & password to login </p>

                            <div className="images">
                              {/* <img src={logo} alt="" /> */}
                            </div>
                            {success && <Alert severity="success">{success}</Alert> }
                                        {error && <Alert severity="error">{error}</Alert>}

                                    <div className="mb-2">
                                        <label htmlFor="" >Username</label>
                                        <input type="text"   value={userName} onChange={(e)=>setUserName(e.target.value)}/>
                                    </div>
                                    
                                    
                                    <div className="mb-2">
                                       
                                       <label htmlFor="">Password</label>
                                       <input  type={showPassword ? 'text' : 'password'}   id='password-input' value={password} onChange={(e)=>setPassword(e.target.value)} />
                                       <Link onClick={handleClickShowPassword} className='mt-2 password_btn'>
                             {showPassword ?<span>Hide Password</span>: <span>Show Password</span>  }
                           </Link>
                           <p className='text-end forgot'> <Link>Forgot Password?</Link></p>
                                   </div>

                                   
                                   
                                     <div className='text-center'>
                                        <button type='submit'  className="btn px-3 submit_btn" >{isLoading ? <RiseLoader  color="#FFFFFF" size={6} /> : <>Login to your account</>}</button>
                                        
                                        </div>
                            <p className='text-center pt-2'>Not a member? <Link to='/' className='border rounded px-2 py-1'>Register Now</Link></p>
                                

                        </form>
                        </div>

                    </Paper>
                </div>
            </div>
        </>
    )
}
