
import React, { useEffect, useState } from 'react'
import EmployeeHook from '../../hooks/employeeHooks/EmployeeHook';
import { useSelector, useDispatch } from 'react-redux';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import CategoryHook from '../../hooks/settingHooks/CategoryHook'
import PaymentViaHook from '../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../hooks/settingHooks/PaymentTypeHook'
import CurrencyHook from '../../hooks/settingHooks/CurrencyHook'
import SyncLoader from 'react-spinners/SyncLoader'
import {  useLocation } from 'react-router-dom'

export default function EmployeeDetails() {
    const [isLoading, setIsLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [loading3, setLoading3] = useState(false)
    const [loading4, setLoading4] = useState(false)
    const [loading5, setLoading5] = useState(false)
    const [employeeId, setEmployeeId] = useState('')
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;


    const [, setNewMessage] = useState('')
  const { getEmployees } = EmployeeHook()
    const { getCurrencyData } = CurrencyHook()
    const { getCategoryData } = CategoryHook()
    const { getPaymentViaData } = PaymentViaHook()
    const { getPaymentTypeData } = PaymentTypeHook()
    const employees = useSelector((state) => state.employees.employees)


    const { user } = useAuthContext()
    const dispatch = useDispatch()


    const fetchData = async () => {

        try {
            setIsLoading(true)
            getEmployees();
            setIsLoading(false);

            await Promise.all([
                getCategoryData(),
                getPaymentViaData(),
                getPaymentTypeData(),
                getCurrencyData(),
            ])

        } catch (error) {
            setIsLoading(false);
        }
    }


  const location = useLocation();
const route=location.pathname;;
    useEffect(() => {
        if (user) {
            fetchData();

        }
         // handle employeeId
  if(selectedEmployee){
    const employee = employees.find(emp => emp.employeeName === selectedEmployee); // Find the employee object based on the selected name
  if (employee) {
    setEmployeeId(employee._id); // Set the employeeId as the _id of the selected employee
    
  }
  }
    }, [selectedEmployee])

    const currencies = useSelector((state) => state.setting.currencies);
    const paymentVia = useSelector((state) => state.setting.paymentVia);
    const paymentType = useSelector((state) => state.setting.paymentType);
    const categories = useSelector((state) => state.setting.categories);


    const rowsPerPageOptions = [10, 15, 30];

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const [option, setOption] = useState(false)

    const handleRowClick = (employeeName) => {
        setSelectedEmployee(employeeName);
        setOption(!option)
    };

    const handleOption = () => {
        setOption(!option)

    }


    // Editing Mode 
    const [editMode, setEditMode] = useState(false);
    const [editedEntry, setEditedEntry] = useState({});
    const [editedRowIndex, setEditedRowIndex] = useState(null);

    const handleEditClick = (paymentItem, index) => {
        setEditMode(!editMode);
        setEditedEntry(paymentItem);
        setEditedRowIndex(index); // Set the index of the row being edited
    };


    const handleInputChange = (e, field) => {
        setEditedEntry({
            ...editedEntry,
            [field]: e.target.value,
        });

    };

    const handleImageChange = (e, field) => {
        if (field === 'slip_Pic') {
            const file = e.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setEditedEntry({
                        ...editedEntry,
                        [field]: reader.result, // Use reader.result as the image data URL
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    };


    const deletePaymentOut = async (payment) => {
        if (window.confirm('Are you sure you want to delete this record?')){
            setLoading1(true)
            let paymentId = payment._id
            try {
                const response = await fetch(`${apiUrl}/auth/employees/delete/employee/payment`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ paymentId, employeeId })
                })
    
                const json = await response.json()
    
                if (!response.ok) {
                    setNewMessage(toast.error(json.message));
                    setLoading1(false)
                }
                if (response.ok) {
                    fetchData()
                    setNewMessage(toast.success(json.message));
                    setLoading1(false)
                    
                }
            }
            catch (error) {
                setNewMessage(toast.error('Server is not responding...'))
                setLoading1(false)
            }
        }
       
    }


    const deleteVacation = async (vacation) => {
        if (window.confirm('Are you sure you want to delete this record?')){
            setLoading2(true)
        
            let vacationId = vacation._id
            try {
                const response = await fetch(`${apiUrl}/auth/employees/delete/employee/vacation`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ vacationId, employeeId})
                })
    
                const json = await response.json()
    
                if (!response.ok) {
                    setNewMessage(toast.error(json.message));
                    setLoading2(false)
                }
                if (response.ok) {
                    fetchData()
                    setNewMessage(toast.success(json.message));
                    setLoading2(false)
                   
                }
            }
            catch (error) {
                setNewMessage(toast.error('Server is not responding...'))
                setLoading2(false)
            }
        }
       
    }



    //Editing for Agent Person 
    const [editMode2, setEditMode2] = useState(false);
    const [editedEntry2, setEditedEntry2] = useState({});
    const [editedRowIndex2, setEditedRowIndex2] = useState(null);

    const handlePersonEditClick = (person, index) => {
        setEditMode2(!editMode2);
        setEditedEntry2(person);
        setEditedRowIndex2(index);
    };


    const handlePersonInputChange = (e, field) => {
        setEditedEntry2({
            ...editedEntry2,
            [field]: e.target.value,
        });

    };

    const handleUpdateVacation = async () => {
        setLoading5(true)
        try {
            const response = await fetch(`${apiUrl}/auth/employees/update/employee/vacation`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({ employeeId,vacationId:editedEntry2._id, date: editedEntry2.date, dateFrom: editedEntry2.dateFrom, dateTo: editedEntry2.dateTo, days: editedEntry2.days, timeIn: editedEntry2.timeIn, timeOut: editedEntry2.timeOut})
            })

            const json = await response.json()


            if (!response.ok) {
                setNewMessage(toast.error(json.message));
                setLoading5(false)
            }
            if (response.ok) {
                fetchData();
                setNewMessage(toast.success(json.message));
                setLoading5(null)
                setEditMode2(!editMode2)
            }
        }
        catch (error) {
            setNewMessage(toast.error('Server is not responding...'))
            setLoading5(false)
        }
    }


    const handleUpdate = async () => {
        setLoading3(true)

        let paymentId = editedEntry._id
        try {
            const response = await fetch(`${apiUrl}/auth/employees/update/employee/payment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({ paymentId, employeeId, category: editedEntry.category, payment_Via: editedEntry.payment_Via, payment_Type: editedEntry.payment_Type, slip_No: editedEntry.slip_No, details: editedEntry.details, payment_Out: editedEntry.payment_Out, curr_Country: editedEntry.payment_Out_Curr, curr_Amount: editedEntry.curr_Amount,curr_Rate:editedEntry.curr_Rate, slip_Pic: editedEntry.slip_Pic, date: editedEntry.date })
            })

            const json = await response.json()

            if (!response.ok) {
                setNewMessage(toast.error(json.message));
                setLoading3(false)
            }
            if (response.ok) {
                fetchData()
                setNewMessage(toast.success(json.message));
                setLoading3(null)
                setEditMode(!editMode)
            }
        }
        catch (error) {
            setNewMessage(toast.error('Server is not responding...'))
            setLoading3(false)
        }
    }


    const deleteEmployee = async (employee) => {
        if (window.confirm('Are you sure you want to delete this record?')){
            setLoading5(true)
            try {
                const response = await fetch(`${apiUrl}/auth/employees/delete/employee`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ employeeId: employee._id })
                })
    
                const json = await response.json()
    
                if (!response.ok) {
                    setNewMessage(toast.error(json.message));
                    setLoading5(false)
                }
                if (response.ok) {
                    fetchData();
                    setNewMessage(toast.success(json.message));
                    setLoading5(false)
    
                }
            }
            catch (error) {
                setNewMessage(toast.error('Server is not responding...'))
                setLoading5(false)
            }
        }
       
    }


    // Editing Mode for Employee
    const [editMode3, setEditMode3] = useState(false);
    const [editedEntry3, setEditedEntry3] = useState({});
    const [editedRowIndex3, setEditedRowIndex3] = useState(null);

    const handleEmployeeEditClick = (employee, index) => {
        setEditMode3(!editMode3);
        setEditedEntry3(employee);
        setEditedRowIndex3(index); // Set the index of the row being edited
    };


    const handleEmployeeInputChange = (e, field) => {
        setEditedEntry3({
            ...editedEntry3,
            [field]: e.target.value,
        });

    };

    const handleEmployeeUpdate = async () => {
        setLoading3(true)

        let employeeId = editedEntry3._id
        try {
            const response = await fetch(`${apiUrl}/auth/employees/update/employee`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({ employeeId,entry_Date:editedEntry3.entry_Date, employeeName: editedEntry3.employeeName, fatherName: editedEntry3.fatherName, address: editedEntry3.address, email: editedEntry3.email, phone: editedEntry3.phone, emergencyPhone: editedEntry3.emergencyPhone, dob: editedEntry3.dob, cnic: editedEntry3.cnic,salaryType:editedEntry3.salaryType, salary: editedEntry3.salary })
            })

            const json = await response.json()

            if (!response.ok) {
                setNewMessage(toast.error(json.message));
                setLoading3(false)
            }
            if (response.ok) {
                fetchData()
                setNewMessage(toast.success(json.message));
                setLoading3(null)
                setEditMode3(!editMode3)
            }
        }
        catch (error) {
            setNewMessage(toast.error('Server is not responding...'))
            setLoading3(false)
        }
    }


    const [date1, setDate1] = useState('')
    const [supplier1, setSupplier1] = useState('')

    const filteredTotalEmployee = employees.filter(employee => {
        return (
            employee.entry_Date.toLowerCase().includes(date1.toLowerCase()) &&
            employee.employeeName.toLowerCase().includes(supplier1.toLowerCase())
        )
    })

    const printMainTable = () => {
        // Convert JSX to HTML string
        const printContentString = `
      <table class='print-table'>
        <thead>
          <tr>
            <th>SN</th>
            <th>Entry Date</th>
            <th>Employee</th>
            <th>Fahter Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Emergency Phone</th>
            <th>DOB</th>
            <th>CNIC</th>
            <th>Salary Type</th>
            <th>Salary</th>
            <th>Address</th>
            <th>Open</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          ${filteredTotalEmployee.map((entry, index) => `
            <tr key="${entry?._id}">
              <td>${index + 1}</td>
              <td>${String(entry.entry_Date)}</td>       
              <td>${String(entry.employeeName)}</td>
              <td>${String(entry.fatherName)}</td>
              <td>${String(entry.email)}</td>
              <td>${String(entry.phone)}</td>
              <td>${String(entry.emergencyPhone)}</td>
              <td>${String(entry.dob)}</td>
              <td>${String(entry.cnic)}</td>
              <td>${String(entry.salaryType)}</td>
              <td>${String(entry.salary)}</td>
              <td>${String(entry.address)}</td>
              <td>${String(entry.open)}</td>
              <td>${String(entry.close)}</td>       
            </tr>
          `).join('')}
        </tbody>
      </table>
      <style>
      /* Add your custom print styles here */
      body {
        background-color: #fff;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .print-table th, .print-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .print-table th {
        background-color: #f2f2f2;
      }
    </style>
    `;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            // Write the print content to the new window
            printWindow.document.write(`
        <html>
          <head>
            <title>Employees Payment Details</title>
          </head>
          <body class='bg-dark'>${printContentString}</body>
        </html>
      `);

            // Trigger print dialog
            printWindow.print();
            // Close the new window after printing
            printWindow.onafterprint = function () {
                printWindow.close();
            };
        } else {
            // Handle if the new window cannot be opened
            alert('Could not open print window. Please check your browser settings.');
        }
    };


    // individual payments filters
    const [date2, setDate2] = useState('')
    const [payment_Via, setPayment_Via] = useState('')
    const [payment_Type, setPayment_Type] = useState('')

    const filteredIndividualPayments = employees
        .filter((data) => data.employeeName === selectedEmployee)
        .map((filteredData) => ({
            ...filteredData,
            payment: filteredData.payment
                .filter((paymentItem) =>
                    paymentItem.date.toLowerCase().includes(date2.toLowerCase()) &&
                    paymentItem.payment_Via.toLowerCase().includes(payment_Via.toLowerCase()) &&
                    paymentItem.payment_Type.toLowerCase().includes(payment_Type.toLowerCase())

                ),

        }))

    const printPaymentsTable = () => {
        // Convert JSX to HTML string
        const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Category</th>
        <th>Payment_Via</th>
        <th>Payment_Type</th>
        <th>Slip_No</th>
        <th>Details</th>
        <th>Payment_Out</th>
        <th>Invoice</th>
        <th>Payment_In_Curr</th>
        <th>CUR_Rate</th>
        <th>CUR_Amount</th>
        </tr>
      </thead>
      <tbody>
      ${filteredIndividualPayments.map((entry, index) =>
            entry.payment.map((paymentItem, paymentIndex) => `
          <tr key="${entry?._id}-${paymentIndex}">
            <td>${index * entry.payment.length + paymentIndex + 1}</td>
            <td>${String(paymentItem?.date)}</td>
            <td>${String(paymentItem?.category)}</td>
            <td>${String(paymentItem?.payment_Via)}</td>
            <td>${String(paymentItem?.payment_Type)}</td>
            <td>${String(paymentItem?.slip_No)}</td>
            <td>${String(paymentItem?.details)}</td>
            <td>${String(paymentItem?.payment_Out)}</td>
            <td>${String(paymentItem?.invoice)}</td>
            <td>${String(paymentItem?.payment_Out_Curr)}</td>
            <td>${String(paymentItem?.curr_Rate)}</td>
            <td>${String(paymentItem?.curr_Amount)}</td>
          </tr>
        `).join('')
        )}
    </tbody>
    </table>
    <style>
      /* Add your custom print styles here */
      body {
        background-color: #fff;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .print-table th, .print-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .print-table th {
        background-color: #f2f2f2;
      }
    </style>
  `;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            // Write the print content to the new window
            printWindow.document.write(`
      <html>
        <head>
          <title>${selectedEmployee} Payment Details</title>
        </head>
        <body class='bg-dark'>${printContentString}</body>
      </html>
    `);

            // Trigger print dialog
            printWindow.print();
            // Close the new window after printing
            printWindow.onafterprint = function () {
                printWindow.close();
            };
        } else {
            // Handle if the new window cannot be opened
            alert('Could not open print window. Please check your browser settings.');
        }
    };

    const [date3, setDate3] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
  


    const filteredVacations = employees
        .filter((data) => data.employeeName === selectedEmployee)
        .map((filteredData) => ({
            ...filteredData,
            vacation: filteredData.vacation
                .filter((vacation) =>
                vacation.date.toLowerCase().includes(date3.toLowerCase()) &&
                vacation.dateFrom.toLowerCase().includes(dateFrom.toLowerCase()) &&
                vacation.dateTo.toLowerCase().includes(dateTo.toLowerCase()) 

                ),
        }))

    const printVacationsTable = () => {
        // Convert JSX to HTML string
        const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Date From</th>
        <th>Date To</th>
        <th>Days</th>
        <th>Time In</th>
        <th>Time Out</th>
      
        
        </tr>
      </thead>
      <tbody>
      ${filteredVacations.map((entry, index) =>
            entry.vacation.map((vacation, personIndex) => `
          <tr key="${vacation?._id}">
            <td>${index * entry.vacation.length + personIndex + 1}</td>
            <td>${String(vacation?.date)}</td>
            <td>${String(vacation?.dateFrom)}</td>
            <td>${String(vacation?.dateTo)}</td>
            <td>${String(vacation?.days)}</td>
            <td>${String(vacation?.timeIn)}</td>
            <td>${String(vacation?.timeOut)}</td>
           
          </tr>
        `).join('')
        )}
    </tbody>
    </table>
    <style>
      /* Add your custom print styles here */
      body {
        background-color: #fff;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .print-table th, .print-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .print-table th {
        background-color: #f2f2f2;
      }
    </style>
  `;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            // Write the print content to the new window
            printWindow.document.write(`
      <html>
        <head>
          <title>${selectedEmployee}'s Vacations Details</title>
        </head>
        <body class='bg-dark'>${printContentString}</body>
      </html>
    `);

            // Trigger print dialog
            printWindow.print();
            // Close the new window after printing
            printWindow.onafterprint = function () {
                printWindow.close();
            };
        } else {
            // Handle if the new window cannot be opened
            alert('Could not open print window. Please check your browser settings.');
        }
    };

    
  const downloadExcel = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredTotalEmployee.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Employees:payments.employeeName,
        FatherName:payments.fatherName,
        Email:payments.email,
        Phone:payments.phone,
        EmergencyPhone: payments.emergencyPhone,
        Dob:payments.dob,
        Cnic:payments.cnic,
        SalaryType:payments.salaryType,
        Salary:payments.salary,
        Address:payments.address,
        Close:payments.close,
        Open:payments.open
        
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Employees_Payments_Details.xlsx');
  }


  const downloadIndividualPayments = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredIndividualPayments.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date:payments.date,
        Category:payments.category,
        payment_Via:payments.payment_Via,
        payment_Type:payments.payment_Type,
        slip_No: payments.slip_No,
        details:payments.details,
        payment_In:payments.payment_Out,
        invoice:payments.invoice,
        payment_In_Curr:payments.payment_Out_Curr,
        curr_Rate:payments.curr_Rate,
        curr_Amount:payments.curr_Amount
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${selectedEmployee} Payment Details.xlsx`);
  }

  
  const downloadVacations = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredVacations.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date:payments.date,
        DateFrom:payments.dateFrom,
        DateTo:payments.dateTo,
        Days:payments.days,
        TimeIn: payments.timeIn,
        TimeOut:payments.timeOut,
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${selectedEmployee} Vacations Details.xlsx`);
  }





    return (
        <>
           <div className="main">
            <div className="container-fluid py-2 payment_details">
                <div className="row">
                <div className='col-md-12 '>
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                 <h4>Employee Details</h4>
                </div>
                
              </Paper>
            </div>
                {!option &&
                <>
                    <div className='col-md-12 '>
                        <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                            <div className="left d-flex">

                            </div>
                            <div className="right d-flex">
                                {employees.length > 0 &&
                                    <>
                                        {/* <button className='btn pdf_btn m-1 btn-sm' onClick={downloadPDF}><i className="fa-solid fa-file-pdf me-1 "></i>Download PDF </button> */}
                                        <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}>Download </button>
                                        <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printMainTable}>Print </button>

                                    </>
                                }


                            </div>
                        </Paper>
                    </div>

                    {isLoading &&
                        <div className='col-md-12 text-center my-4'>
                            <SyncLoader color="#2C64C3" className='mx-auto' />
                        </div>
                    }

                    <div className="col-md-12 filters">
                        <Paper className='py-1 mb-2 px-3'>
                            <div className="row">
                                <div className="col-auto px-1">
                                    <label htmlFor="">Date:</label>
                                    <select value={date1} onChange={(e) => setDate1(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(employees.map(data => data.entry_Date))].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Employee:</label>
                                    <select value={supplier1} onChange={(e) => setSupplier1(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {employees && employees.map((data) => (
                                            <option value={data.employeeName} key={data._id}>{data.employeeName} </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </Paper>
                    </div>

                    {!isLoading &&
                        <div className='col-md-12'>
                            <Paper className='py-3 mb-1 px-2 detail_table'>
                                <TableContainer sx={{ maxHeight: 600 }}>
                                    <Table stickyHeader>
                                        <TableHead>

                                            <TableRow>
                                                <TableCell className='label border'>SN</TableCell>
                                                <TableCell className='label border'>Date</TableCell>
                                                <TableCell className='label border'>Employee</TableCell>
                                                <TableCell className='label border'>Father_Name</TableCell>
                                                <TableCell className='label border'>Email</TableCell>
                                                <TableCell className='label border'>Phone</TableCell>
                                                <TableCell className='label border'>Emergency_Phone</TableCell>
                                                <TableCell className='label border'>DOB</TableCell>
                                                <TableCell className='label border'>CNIC</TableCell>
                                                <TableCell className='label border'>Salary_Type</TableCell>
                                                <TableCell className='label border'>Salary</TableCell>
                                                <TableCell className='label border'>Address</TableCell>
                                                <TableCell className='label border'>Open</TableCell>
                                                <TableCell className='label border'>Close</TableCell>
                                                {route !=="/rozgar/reports/payroll_reports" &&
                                                <TableCell align='left' className='edw_label border' colSpan={1}> Actions</TableCell>
                                                }
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {filteredTotalEmployee.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry, index) => (

                                                <TableRow key={entry._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                                                   {editMode3 && editedRowIndex3=== index ? 
                                                   (
                                                    <>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='number' value={index} readonly />

                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='date' value={editedEntry3.entry_Date}  readonly />
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='text' value={editedEntry3.employeeName}  onChange={(e) => handleEmployeeInputChange(e, 'employeeName')} />
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='text' value={editedEntry3.fatherName}  onChange={(e) => handleEmployeeInputChange(e, 'fatherName')} />
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='email' value={editedEntry3.email}  onChange={(e) => handleEmployeeInputChange(e, 'email')} />
                                                    </TableCell>
                                                 
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='text' value={editedEntry3.phone}  onChange={(e) => handleEmployeeInputChange(e, 'phone')} />
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='text' value={editedEntry3.emergencyPhone}  onChange={(e) => handleEmployeeInputChange(e, 'emergencyPhone')} />
                                                        
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='date' value={editedEntry3.dob}  onChange={(e) => handleEmployeeInputChange(e, 'dob')} />
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='text' value={editedEntry3.cnic}  onChange={(e) => handleEmployeeInputChange(e, 'cnic')} />
                                                       
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='text' value={editedEntry3.salaryType}  onChange={(e) => handleEmployeeInputChange(e, 'salaryType')} />
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='number' value={editedEntry3.salary}  onChange={(e) => handleEmployeeInputChange(e, 'salary')} />
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='text' value={editedEntry3.address}  onChange={(e) => handleEmployeeInputChange(e, 'address')} />
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='checkbox' value={editedEntry3.open}  disabled />
                                                       
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                    <input type='checkbox' value={editedEntry3.close}  disabled />
                                                    </TableCell>
                                                    {route !=="/rozgar/reports/payroll_reports" && 
                                                     <TableCell className='border data_td p-1 '>
                                                                                                      <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                        <button onClick={() => setEditMode3(!editMode3)} className='btn delete_btn'>Cancel</button>
                                                                        <button onClick={() => handleEmployeeUpdate()} className='btn save_btn' disabled={loading3}>{loading3 ? "Saving..." : "Save"}</button>

                                                                    </div>
                                                   
                                                 </TableCell>
                                                    }
                                                    </>
                                                   ):(
                                                    <>
                                                    <TableCell className='border data_td text-center'>{index + 1}</TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.entry_Date}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center' onClick={() => handleRowClick(entry.employeeName)}>
                                                        {entry.employeeName}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.fatherName}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.email}
                                                    </TableCell>
                                                 
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.phone}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.emergencyPhone}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.dob}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.cnic}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.salaryType}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.salary}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.address}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        <span>{entry.open === true ? "Opened" : "Not Opened"}</span>
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.close === false ? "Not Closed" : "Closed"}
                                                    </TableCell>
                                                    {route !=="/rozgar/reports/payroll_reports" && 
                                                     <TableCell className='border data_td p-1 '>
                                                     <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                         <button onClick={() => handleEmployeeEditClick(entry, index)} className='btn edit_btn'>Edit</button>
                                                         <button className='btn delete_btn' onClick={() => deleteEmployee(entry)} disabled={loading5}>{loading5 ? "Deleting..." : "Delete"}</button>
                                                     </div>
                                                     <div className="modal fade delete_Modal p-0" data-bs-backdrop="static" id="deleteModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                         <div className="modal-dialog p-0">
                                                             <div className="modal-content p-0">
                                                                 <div className="modal-header border-0">
                                                                     <h5 className="modal-title" id="exampleModalLabel">Attention!</h5>
                                                                     {/* <button type="button" className="btn-close shadow rounded" data-bs-dismiss="modal" aria-label="Close" /> */}
                                                                 </div>
                                                                 <div className="modal-body text-center p-0">

                                                                     <p>Do you want to Delete the Employee Record?</p>
                                                                 </div>
                                                                 <div className="text-end m-2">
                                                                     <button type="button " className="btn rounded m-1 cancel_btn" data-bs-dismiss="modal" >Cancel</button>
                                                                     <button type="button" className="btn m-1 confirm_btn rounded" data-bs-dismiss="modal" >Confirm</button>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </TableCell>
                                                    }
                                                    </>
                                                   )
                                                   }
                                                    
                                                  
                                                   


                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    component='div'
                                    count={employees.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    style={{
                                        color: 'blue',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        textTransform: 'capitalize',
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </div>
                    }
                </>
            }

            {option && selectedEmployee && (
                <>
                    {/* Display Table for selectedEmployee's payment details array */}
                    <div className="col-md-12 my-2">
                        <div className="d-flex justify-content-between supplier_Name">
                            <div className="left d-flex">
                                <h4 className='d-inline '>Employee Name: <span>{selectedEmployee}</span></h4>

                            </div>
                            <div className="right">
                            <button className='btn excel_btn m-1 btn-sm' onClick={downloadIndividualPayments}>Download </button>
                             <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printPaymentsTable}>Print </button>
                                {selectedEmployee && <button className='btn detail_btn' onClick={handleOption}><i className="fas fa-times"></i></button>}

                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 filters">
                        <Paper className='py-1 mb-2 px-3'>
                            <div className="row">
                                <div className="col-auto px-1">
                                    <label htmlFor="">Date:</label>
                                    <select value={date2} onChange={(e) => setDate2(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(employees
                                            .filter(data => data.employeeName === selectedEmployee)
                                            .flatMap(data => data.payment)
                                            .map(data => data.date)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Payment Via:</label>
                                    <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(employees
                                            .filter(data => data.employeeName === selectedEmployee)
                                            .flatMap(data => data.payment)

                                            .map(data => data.payment_Via)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Payment Type:</label>
                                    <select value={payment_Type} onChange={(e) => setPayment_Type(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(employees
                                            .filter(data => data.employeeName === selectedEmployee)
                                            .flatMap(data => data.payment)

                                            .map(data => data.payment_Type)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </Paper>
                    </div>
                    <div className="col-md-12 detail_table my-2">
                        <h6>Payment In Details</h6>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead className="thead">
                                    <TableRow>
                                        <TableCell className='label border'>Date</TableCell>
                                        <TableCell className='label border'>Category</TableCell>
                                        <TableCell className='label border'>Payment_Via</TableCell>
                                        <TableCell className='label border'>Payment_Type</TableCell>
                                        <TableCell className='label border'>Slip_No</TableCell>
                                        <TableCell className='label border'>Details</TableCell>
                                        <TableCell className='label border'>Payment_Out</TableCell>
                                        <TableCell className='label border'>Invoice</TableCell>
                                        <TableCell className='label border'>Payment_In_Curr</TableCell>
                                        <TableCell className='label border'>CUR_Rate</TableCell>
                                        <TableCell className='label border'>CUR_Amount</TableCell>
                                        <TableCell className='label border'>Slip_Pic</TableCell>
                                        {route !=="/rozgar/reports/payroll_reports" && <TableCell align='left' className='edw_label border' colSpan={1}>
                                            Actions
                                        </TableCell>}
                                        
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredIndividualPayments
                                        .map((filteredData) => (
                                            // Map through the payment array
                                            <>
                                                {filteredData.payment && filteredData.payment?.map((paymentItem, index) => (
                                                    <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                                                        {editMode && editedRowIndex === index ? (
                                                            <>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <input type='date' value={editedEntry.date} onChange={(e) => handleInputChange(e, 'date')} />
                                                                </TableCell>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <select value={editedEntry.category} onChange={(e) => handleInputChange(e, 'category')} required>
                                                                        <option value="">Choose</option>
                                                                        {categories && categories.map((data) => (
                                                                            <option key={data._id} value={data.category}>{data.category}</option>
                                                                        ))}
                                                                    </select>
                                                                </TableCell>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <select value={editedEntry.payment_Via} onChange={(e) => handleInputChange(e, 'payment_Via')} required>
                                                                        <option value="">Choose</option>
                                                                        {paymentVia && paymentVia.map((data) => (
                                                                            <option key={data._id} value={data.payment_Via}>{data.payment_Via}</option>
                                                                        ))}
                                                                    </select>
                                                                </TableCell>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <select value={editedEntry.payment_Type} onChange={(e) => handleInputChange(e, 'payment_Type')} required>
                                                                        <option value="">Choose</option>
                                                                        {paymentType && paymentType.map((data) => (
                                                                            <option key={data._id} value={data.payment_Type}>{data.payment_Type}</option>
                                                                        ))}
                                                                    </select>

                                                                </TableCell>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <input type='text' value={editedEntry.slip_No} onChange={(e) => handleInputChange(e, 'slip_No')} />
                                                                </TableCell>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <input type='text' value={editedEntry.details} onChange={(e) => handleInputChange(e, 'details')} />
                                                                </TableCell>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <input type='text' value={editedEntry.payment_Out} onChange={(e) => handleInputChange(e, 'payment_Out')} />
                                                                </TableCell>
                                                             
                                                                <TableCell className='border data_td p-1 '>
                                                                    <input type='text' value={editedEntry.invoice} readonly />
                                                                </TableCell>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <select required value={editedEntry.payment_Out_Curr} onChange={(e) => handleInputChange(e, 'payment_Out_Curr')}>
                                                                        <option className="my-1 py-2" value="">choose</option>
                                                                        {currencies && currencies.map((data) => (
                                                                            <option className="my-1 py-2" key={data._id} value={data.currency}>{data.currency}</option>
                                                                        ))}
                                                                    </select>
                                                                </TableCell>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <input type='number' value={editedEntry.curr_Rate} onChange={(e) => handleInputChange(e, 'curr_Rate')} />
                                                                </TableCell>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <input type='text' value={editedEntry.curr_Amount} onChange={(e) => handleInputChange(e, 'curr_Amount')} />
                                                                </TableCell>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <input type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'slip_Pic')} />
                                                                </TableCell>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <TableCell className='border data_td text-center'>{paymentItem?.date}</TableCell>
                                                                <TableCell className='border data_td text-center'>{paymentItem?.category}</TableCell>
                                                                <TableCell className='border data_td text-center'>{paymentItem?.payment_Via}</TableCell>
                                                                <TableCell className='border data_td text-center'>{paymentItem?.payment_Type}</TableCell>
                                                                <TableCell className='border data_td text-center'>{paymentItem?.slip_No}</TableCell>
                                                                <TableCell className='border data_td text-center'>{paymentItem?.details}</TableCell>
                                                                <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.payment_Out}</TableCell>
                                                                <TableCell className='border data_td text-center'>{paymentItem?.invoice}</TableCell>
                                                                <TableCell className='border data_td text-center'>{paymentItem?.payment_Out_Curr}</TableCell>
                                                                <TableCell className='border data_td text-center'>{paymentItem?.curr_Rate}</TableCell>
                                                                <TableCell className='border data_td text-center'>{paymentItem?.curr_Amount}</TableCell>
                                                                <TableCell className='border data_td text-center'>{paymentItem.slip_Pic ? <img src={paymentItem.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>


                                                            </>
                                                        )}
                                                          {route !=="/rozgar/reports/payroll_reports" && 
                                                            <TableCell className='border data_td p-1 '>
                                                            {editMode && editedRowIndex === index ? (
                                                                // Render Save button when in edit mode for the specific row
                                                                <>
                                                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                        <button onClick={() => setEditMode(!editMode)} className='btn delete_btn'>Cancel</button>
                                                                        <button onClick={() => handleUpdate()} className='btn save_btn' disabled={loading3}>{loading3 ? "Saving..." : "Save"}</button>

                                                                    </div>

                                                                </>

                                                            ) : (
                                                                // Render Edit button when not in edit mode or for other rows
                                                                <>
                                                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                        <button onClick={() => handleEditClick(paymentItem, index)} className='btn edit_btn'>Edit</button>
                                                                        <button className='btn delete_btn' onClick={() => deletePaymentOut(paymentItem)} disabled={loading1}>{loading1 ? "Deleting..." : "Delete"}</button>
                                                                    </div>
                                                                    {/* Deleting Modal  */}
                                                                    <div className="modal fade delete_Modal p-0" data-bs-backdrop="static" id="pDeleteModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                        <div className="modal-dialog p-0">
                                                                            <div className="modal-content p-0">
                                                                                <div className="modal-header border-0">
                                                                                    <h5 className="modal-title" id="exampleModalLabel">Attention!</h5>
                                                                                    {/* <button type="button" className="btn-close shadow rounded" data-bs-dismiss="modal" aria-label="Close" /> */}
                                                                                </div>
                                                                                <div className="modal-body text-center p-0">

                                                                                    <p>Do you want to Delete the Record?</p>
                                                                                </div>
                                                                                <div className="text-end m-2">
                                                                                    <button type="button " className="btn rounded m-1 cancel_btn" data-bs-dismiss="modal" >Cancel</button>
                                                                                    <button type="button" className="btn m-1 confirm_btn rounded" data-bs-dismiss="modal" >Confirm</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </TableCell>
                                                          }
                                                      
                                                    </TableRow>
                                                ))}


                                            </>
                                        ))}
                                         <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className='border data_td text-center bg-success text-white'>Total</TableCell>
                            <TableCell className='border data_td text-center bg-danger text-white'>
          {/* Calculate the total sum of payment_In */}
          {filteredIndividualPayments.reduce((total, filteredData) => {
            return total + filteredData.payment.reduce((sum, paymentItem) => {
              const paymentOut = parseFloat(paymentItem.payment_Out);
              return isNaN(paymentOut) ? sum : sum + paymentOut;
            }, 0);
          }, 0)}
        </TableCell>
       
                            
                          </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    <div className="col-md-12 filters">
                        <Paper className='py-1 mb-2 px-3'>
                            <div className="row">
                             
                                <div className="col-auto px-1">
                                    <label htmlFor="">Date:</label>
                                    <select value={date3} onChange={(e) => setDate3(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(employees
                                            .filter(data => data.employeeName === selectedEmployee)
                                            .flatMap(data => data.vacation)
                                            .map(data => data.date)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Date From:</label>
                                    <select value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(employees
                                            .filter(data => data.employeeName === selectedEmployee)
                                            .flatMap(data => data.vacation)
                                            .map(data => data.dateFrom)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Date To:</label>
                                    <select value={dateTo} onChange={(e) => setDateTo(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(employees
                                            .filter(data => data.employeeName === selectedEmployee)
                                            .flatMap(data => data.vacation)
                                            .map(data => data.dateTo)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                
                            </div>
                        </Paper>
                    </div>
                    {/* Display Table for payment array */}
                    <div className="col-md-12 detail_table my-2">
                    <div className="d-flex justify-content-between">
              <div className="left d-flex">
                <h6>Vacation Details</h6>
              </div>
              <div className="right">
                <button className='btn excel_btn m-1 btn-sm' onClick={downloadVacations}>Download </button>
                <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printVacationsTable}>Print </button>
              </div>
            </div>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead className="thead">
                                    <TableRow>
                                        <TableCell className='label border'>SN</TableCell>
                                        <TableCell className='label border'>Date</TableCell>
                                        <TableCell className='label border'>Date_From</TableCell>
                                        <TableCell className='label border'>Date_To</TableCell>
                                        <TableCell className='label border'>Days</TableCell>
                                        <TableCell className='label border'>Time_In</TableCell>
                                        <TableCell className='label border'>Time_Out</TableCell>
                                        {route!=="/rozgar/reports/payroll_reports" &&
                                        <TableCell className='label border'>Action</TableCell>
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredVacations.map((filteredData) => (
                                        <>
                                            {filteredData.vacation.map((vacation, index) => (

                                                <TableRow key={vacation?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                                                    {editMode2 && editedRowIndex2 === index ? (
                                                        <>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='text' value={index + 1} readonly />
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='date' value={editedEntry2.date} onChange={(e) => handlePersonInputChange(e, 'date')}  />
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='date' value={editedEntry2.dateFrom} onChange={(e) => handlePersonInputChange(e, 'dateFrom')}  />
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='date' value={editedEntry2.dateTo} onChange={(e) => handlePersonInputChange(e, 'dateTo')}  />
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='number' min='0' value={editedEntry2.days} onChange={(e) => handlePersonInputChange(e, 'days')}  />
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='time' value={editedEntry2.timeIn} onChange={(e) => handlePersonInputChange(e, 'timeIn')}  />
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='time' value={editedEntry2.timeOut} onChange={(e) => handlePersonInputChange(e, 'timeOut')}  />
                                                            </TableCell>
                                                            
                                                           


                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell className='border data_td text-center'>{index + 1}</TableCell>
                                                            <TableCell className='border data_td text-center'>{vacation?.date}</TableCell>
                                                            <TableCell className='border data_td text-center'>{vacation?.dateFrom}</TableCell>
                                                            <TableCell className='border data_td text-center'>{vacation?.dateTo}</TableCell>
                                                            <TableCell className='border data_td text-center'>{vacation?.days}</TableCell>
                                                            <TableCell className='border data_td text-center'>{vacation?.timeIn}</TableCell>
                                                            <TableCell className='border data_td text-center'>{vacation?.timeOut}</TableCell>
                                                        


                                                        </>
                                                    )}
                                                     {route!=="/rozgar/reports/payroll_reports" &&
                                         <TableCell className='border data_td p-1 '>
                                         {editMode2 && editedRowIndex2 === index ? (
                                             // Render Save button when in edit mode for the specific row
                                             <>
                                                 <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                     <button onClick={() => setEditMode2(!editMode2)} className='btn delete_btn'>Cancel</button>
                                                     <button onClick={() => handleUpdateVacation()} className='btn save_btn' disabled={loading5}>{loading5 ? "Saving..." : "Save"}</button>

                                                 </div>

                                             </>

                                         ) : (
                                             // Render Edit button when not in edit mode or for other rows
                                             <>
                                                 <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                     <button onClick={() => handlePersonEditClick(vacation, index)} className='btn edit_btn'>Edit</button>
                                                     <button className='btn delete_btn' onClick={() => deleteVacation(vacation)} disabled={loading2}>{loading2 ? "Deleting..." : "Delete"}</button>
                                                 </div>
                                                 {/* Deleting Modal  */}
                                                 <div className="modal fade delete_Modal p-0" data-bs-backdrop="static" id="deleteVacationModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                     <div className="modal-dialog p-0">
                                                         <div className="modal-content p-0">
                                                             <div className="modal-header border-0">
                                                                 <h5 className="modal-title" id="exampleModalLabel">Attention!</h5>
                                                                 {/* <button type="button" className="btn-close shadow rounded" data-bs-dismiss="modal" aria-label="Close" /> */}
                                                             </div>
                                                             <div className="modal-body text-center p-0">

                                                                 <p>Do you want to Delete the Vacation?</p>
                                                             </div>
                                                             <div className="text-end m-2">
                                                                 <button type="button " className="btn rounded m-1 cancel_btn" data-bs-dismiss="modal" >Cancel</button>
                                                                 <button type="button" className="btn m-1 confirm_btn rounded" data-bs-dismiss="modal" >Confirm</button>
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </>
                                         )}
                                     </TableCell>
                                        }
                                                   
                                                </TableRow>
                                            ))}
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </>
            )}

                </div>
            </div>
           </div>
        </>
    )
}
