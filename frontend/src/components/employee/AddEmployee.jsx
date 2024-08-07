import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import {  useDispatch,useSelector } from "react-redux";
import { toast } from 'react-toastify';
export default function AVPP() {

  const [employeeName, setEmployeeName] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [email, setEmail] = useState('')
  const [cnic, setCnic] = useState('')
  const [phone, setPhone] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [dob, setDob] = useState('')
  const [salaryType, setSalaryType] = useState('')
  
  const [address, setAddress] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const [, setNewMessage] = useState('');
  const { user } = useAuthContext()
  const dispatch = useDispatch()

  // Submitting form 
  const apiUrl = process.env.REACT_APP_API_URL;

  const addEmployee = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/employees/add/employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ employeeName, fatherName, email, cnic, phone, emergencyPhone,dob,salaryType,address }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setNewMessage(toast.error(json.message));
      }
      if (response.ok) {
        setIsLoading(false);
        setNewMessage(toast.success(json.message));
        setEmployeeName('')
        setFatherName('')
        setEmail('')
        setCnic('')
        setPhone('')
        setEmergencyPhone('')
        setDob('')
        setSalaryType('')
        setAddress('')


      }
    } catch (error) {
      setNewMessage(toast.error('Server Error'));
      setIsLoading(false);
    }
  };

  const collapsed = useSelector((state) => state.collapsed.collapsed);
  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
      <div className="container-fluid entry_setting">
        <div className="row ">
        <div className="col-md-12 adding_form p-0 border-0 border-bottom">
        <div className='py-3 mb-1 px-2'>
        <h5>Add new Employee</h5>
                                
                        
                            </div>
                            </div>
          <div className="col-md-12 p-0 adding_form border-0 border-bottom">
        <form className='px-2 py-3 rounded' onSubmit={addEmployee}>
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Employee Name</label>
              <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required />

            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Father Name</label>
              <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required />

            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>CNIC</label>
              <input type="text" value={cnic} onChange={(e) => setCnic(e.target.value)} required />

            </div>
   
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Phone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Emergency Phone</label>
              <input type="text" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)}  />

            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>DOB</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Salary Type</label>
              <input type="text" value={salaryType} onChange={(e) => setSalaryType(e.target.value)} required />
            </div>
          
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Address</label>
              <textarea type="text" value={address} onChange={(e) => setAddress(e.target.value)}  />
            </div> 
          </div>
          <button className='btn btn-sm  submit_btn' disabled={isLoading}>{isLoading ? 'Adding' : 'Add New'}</button>
        </form>
      </div>
        </div>
      </div>
    </div>

    

    </>
  )
}
