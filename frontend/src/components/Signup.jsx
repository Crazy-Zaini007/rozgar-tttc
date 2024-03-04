import React,{useState} from 'react'
import Paper  from '@mui/material/Paper';
import {Link} from 'react-router-dom'
import SignupHook from '../hooks/userHooks/SignupHook';
import RiseLoader from "react-spinners/RiseLoader";
import Alert from '@mui/material/Alert';
export default function Signup() {

    // Show and hide password
const [showPassword, setShowPassword] = useState(false);

const handleClickShowPassword = () => setShowPassword((show) => !show);



    const [userName,setUserName]=useState('')
    const [role,setRole]=useState('')
    const [companyCode,setCompanyCode]=useState('')
    const [password,setPassword]=useState('')

const {isLoading,error,success,userSignup}=SignupHook()


const handleSignup=async(e)=>{
        e.preventDefault()
        userSignup(userName,role,companyCode, password)
        
    }
   

    return (
        <>

            <div className="container register_form py-2 my-2">
                <div className="row justify-content-center px-2">
                    <Paper className="col-lg-6 col-md-7 col-sm-9 pt-4 my-1 signup_form rounded  px-sm-3">
                        <div>
                        <form className='py-3' onSubmit={handleSignup}>
                        <h4 className='my-1 text-left'>Create an Account</h4>
                            <p className='text-left'>Stay connected with us by creating your account</p>
                            {success && <Alert severity="success">{success}</Alert> }
                                        {error && <Alert severity="error">{error}</Alert>}
                            <div className="mb-2">
                                <label className="form-label">User name:</label>
                                <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Role:</label>
                                <select  value={role} onChange={(e)=>setRole(e.target.value)}>
                                    <option value="">choose role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Accountant">Accountant</option>
                                    <option value="Manager">Entry</option>

                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Company Code:</label>
                                <input type="text"  value={companyCode} onChange={(e)=>setCompanyCode(e.target.value)}/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Password:</label>
                                <input type={showPassword ? 'text' : 'password'}  value={password} onChange={(e)=>setPassword(e.target.value)} />
                                <Link onClick={handleClickShowPassword} className='mt-4 password_btn'>
                             {showPassword ?<span>Hide Password</span>: <span>Show Password</span>  }
                           </Link>
                            </div>
                            <div className="mt-4">
                                <button className='btn submit_btn px-3' disabled={isLoading}>{isLoading ? <RiseLoader  color="#FFFFFF" size={6} /> : <>Create account</>}</button>
                            <p className='text-center pt-2'>Already have an account? <Link to='/rozgar/login' className='border rounded px-2 py-1'>Login</Link></p>

                            </div>
                        </form>
                        </div>

                    </Paper>
                </div>
            </div>

        </>
    )
}
