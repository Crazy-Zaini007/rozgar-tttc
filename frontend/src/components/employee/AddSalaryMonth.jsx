import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import EmployeeHook from '../../hooks/employeeHooks/EmployeeHook';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function AddSalaryMonth() {
    const dispatch = useDispatch();
    // getting data from redux store 

    const apiUrl = process.env.REACT_APP_API_URL;

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



    // Form input States
    const [employeeName, setEmployeeName] = useState('')
    const [employeeId, setEmployeeId] = useState('')
    const [salary, setSalary] = useState('')
    const [month, setMonth] = useState('')

    useEffect(() => {
        fetchData()
        // handle employeeId
        if (employeeName) {
            const employee = employees.find(emp => emp.employeeName === employeeName); // Find the employee object based on the selected name
            if (employee) {
                setEmployeeId(employee._id); // Set the employeeId as the _id of the selected employee

            }
        }
    }, [user, dispatch, employeeName])



    // Submitting Form Data
    const [loading, setLoading] = useState(null)
    const [, setNewMessage] = useState('')
    const handleForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/auth/employees/add/salary_month`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    employeeId,
                    salary,
                    month,
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
                setSalary('');
                setMonth('');
                
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setNewMessage(toast.error('Server is not Responding...'));
            setLoading(false);
        }
    }


    return (
        <>
            <div className="main">
                <div className="container-fluid payment_form">
                    <div className="row">
                        <div className="col-md-12">
                            <Paper className='py-3 mb-1 px-2'>
                                <h4>Add Employee Salary Month</h4>
                            </Paper>
                        </div>
                        <div className="col-md-12 ">
                            <TableContainer component={Paper}>
                                <form className='py-3 px-2' onSubmit={handleForm}>
                                    <div className="text-end ">
                                        <button className='btn submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Salary Month"}</button>
                                        {/* <span className='btn submit_btn m-1 bg-primary border-0'><AddRoundedIcon fontSize='small'/></span> */}
                                    </div>
                                    <div className="row p-0 m-0 my-1">
                                        <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                                            <label>Employee Name</label>
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
                                            <label >Salary </label>
                                            <input type="number" min='0' value={salary} onChange={(e) => setSalary(e.target.value)} />
                                        </div>
                                        <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                                            <label >Salary Month / Year </label>
                                            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                                        </div>
                                      
                                    </div>


                                </form>
                            </TableContainer>
                        </div>


                        {/* Details */}
                        {/* <div className="row payment_details mt-0">
        <div className="col-md-12 my-2">
          {selectedEmployee && <button className='btn detail_btn' onClick={handleOpen}>{option ? 'Hide Details' : "Show Details"}</button>}
        </div>
        {option && (
          <div className="col-md-12 detail_table">
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead className="thead">
                  <TableRow>
                    <TableCell className='label border text-center' style={{ width: '18.28%' }}>Date</TableCell>
                    <TableCell className='label border text-center' style={{ width: '18.28%' }}>Date_From</TableCell>
                    <TableCell className='label border text-center' style={{ width: '18.28%' }}>Date_To</TableCell>
                    <TableCell className='label border text-center' style={{ width: '18.28%' }}>Days</TableCell>
                    <TableCell className='label border text-center' style={{ width: '18.28%' }}>Time_In</TableCell>
                    <TableCell className='label border text-center' style={{ width: '18.28%' }}>Time_Out</TableCell>
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
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{vacation?.date}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{vacation?.dateFrom}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{vacation?.dateTo}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{vacation?.days}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{vacation?.timeIn}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{vacation?.timeOut}</TableCell>
                          </TableRow>
                        ))}
                    

                      
                      </>
                    ))}

                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

      </div> */}
                    </div>
                </div>
            </div>

        </>
    )
}
