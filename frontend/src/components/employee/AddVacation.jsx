import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import EmployeeHook from '../../hooks/employeeHooks/EmployeeHook';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function AddVacation() {
  const dispatch = useDispatch();
  // getting data from redux store 

 
  const employees = useSelector((state) => state.employees.employees)
  const [selectedEmployee, setSelectedEmployee] = useState('');


  const { getEmployees } = EmployeeHook()

  // getting Data from DB
  const { user } = useAuthContext()
  const fetchData = async () => {
    try {
      // Use Promise.all to execute all promises concurrently
      await Promise.all([

        getEmployees()

      ]);


    } catch (error) {
    }
  };

  const [option, setOption] = useState(false)
  

  const handleOpen = () => {
    setOption(!option)
  }


  // Form input States
  const [employeeName,setEmployeeName]=useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [days, setDays] = useState('')
  const [timeIn, setTimeIn] = useState()
  const [timeOut, setTimeOut] = useState('')
  const [date, setDate] = useState('')
  

  useEffect(() => {
    fetchData()
     // handle employeeId
  if(employeeName){
    const employee = employees.find(emp => emp.employeeName === employeeName); // Find the employee object based on the selected name
  if (employee) {
    setEmployeeId(employee._id); // Set the employeeId as the _id of the selected employee
  console.log('employeeId',employeeId)
  }
  }
  }, [user, dispatch,employeeName])

 

  // Submitting Form Data
  const [loading, setLoading] = useState(null)
  const [, setNewMessage] = useState('')
  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/employees/add/employee/vacation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          employeeId,
          date,
          dateFrom,
          dateTo,
          days,
          timeIn,
          timeOut

        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)
      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getEmployees();
        setLoading(false);
        setEmployeeId('')
        setEmployeeName('')
        setDateFrom('');
        setDateTo('');
        setDays('');
        setTimeIn('');
        setTimeOut('');
        setDate('')
       
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };


  return (
    <>
      <div className="main">
        <div className="container-fluid payment_form">
          <div className="row">
          <div className="col-md-12">
              <Paper className='py-3 mb-1 px-2'>
                <h4>Employee Vacations</h4>
              </Paper>
            </div>
          <div className="col-md-12 ">
        {!option && <TableContainer component={Paper}>
          <form className='py-3 px-2' onSubmit={handleForm}>
            <div className="text-end ">
             

              <button className='btn submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Vacation"}</button>
              {/* <span className='btn submit_btn m-1 bg-primary border-0'><AddRoundedIcon fontSize='small'/></span> */}
            </div>
            <div className="row p-0 m-0 my-1">

            <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
  <label>Name</label>
  <select required value={employeeName} onChange={(e) => {
                  setEmployeeName(e.target.value)
                  setSelectedEmployee(e.target.value)
                }}>
    <option value="">Choose Employee</option>
    {employees &&
      employees.map((data) => (
        <option key={data._id} value={data.employeeName}>
          {data.employeeName}
        </option>
      ))
    }
  </select>
</div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Date From </label>
               <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Date To </label>
               <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Days </label>
               <input type="number" min='0' value={days} onChange={(e)=>setDays(e.target.value)} />
              </div>
             

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Time In </label>
                <input type="time"  value={timeIn} onChange={(e) => setTimeIn(e.target.value)} required />
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Time Out </label>
                <input type="time"  value={timeOut} onChange={(e) => setTimeOut(e.target.value)} required />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Date </label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

            
             
            </div>
           
          
          </form>
        </TableContainer>}
      </div>


      {/* Details */}
      <div className="row payment_details mt-0">
        <div className="col-md-12 my-2">
          {selectedEmployee && <button className='btn detail_btn' onClick={handleOpen}>{option ? 'Hide Details' : "Show Details"}</button>}
        </div>
        {option && (
          <div className="col-md-12 detail_table">
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead className="thead">
                  <TableRow>
                    <TableCell className='label border text-center'>Date</TableCell>
                    <TableCell className='label border text-center'>Date_From</TableCell>
                    <TableCell className='label border text-center'>Date_To</TableCell>
                    <TableCell className='label border text-center'>Days</TableCell>
                    <TableCell className='label border text-center'>Time_In</TableCell>
                    <TableCell className='label border text-center'>Time_Out</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees
                    .filter((data) => data.employeeName === selectedEmployee)
                    .map((filteredData) => (
                      // Map through the payment array
                      <>
                        {filteredData.vacation && filteredData.vacation?.map((vacation, index) => (
                          <TableRow key={vacation?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                            <TableCell className='border data_td text-center'>{vacation?.date}</TableCell>
                            <TableCell className='border data_td text-center'>{vacation?.dateFrom}</TableCell>
                            <TableCell className='border data_td text-center'>{vacation?.dateTo}</TableCell>
                            <TableCell className='border data_td text-center'>{vacation?.days}</TableCell>
                            <TableCell className='border data_td text-center'>{vacation?.timeIn}</TableCell>
                            <TableCell className='border data_td text-center'>{vacation?.timeOut}</TableCell>
                          </TableRow>
                        ))}
                    

                      
                      </>
                    ))}

                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

      </div>
          </div>
        </div>
      </div>
   
    </>
  )
}
