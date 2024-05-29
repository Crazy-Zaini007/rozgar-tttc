
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
import { useLocation } from 'react-router-dom'

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

    const [single,setSingle]=useState(0)

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
    const route = location.pathname;;
    useEffect(() => {
        if (user) {
            fetchData();

        }
        // handle employeeId
        if (selectedEmployee) {
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
let sr_No=0;
    const handleEditClick = (paymentItem, index) => {
        setEditMode(!editMode);
        setEditedEntry(paymentItem);
        setEditedRowIndex(index);
    }


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
        if (window.confirm('Are you sure you want to delete this record?')) {
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
        if (window.confirm('Are you sure you want to delete this record?')) {
            setLoading2(true)

            let vacationId = vacation._id
            try {
                const response = await fetch(`${apiUrl}/auth/employees/delete/employee/vacation`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ vacationId, employeeId })
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
                body: JSON.stringify({ employeeId, vacationId: editedEntry2._id, date: editedEntry2.date, dateFrom: editedEntry2.dateFrom, dateTo: editedEntry2.dateTo, days: editedEntry2.days, timeIn: editedEntry2.timeIn, timeOut: editedEntry2.timeOut })
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
                body: JSON.stringify({ paymentId, employeeId, category: editedEntry.category, payment_Via: editedEntry.payment_Via, payment_Type: editedEntry.payment_Type, slip_No: editedEntry.slip_No, details: editedEntry.details, payment_Out: editedEntry.payment_Out, curr_Country: editedEntry.payment_Out_Curr, curr_Amount: editedEntry.curr_Amount, curr_Rate: editedEntry.curr_Rate, slip_Pic: editedEntry.slip_Pic, date: editedEntry.date })
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
        if (window.confirm('Are you sure you want to delete this record?')) {
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
                body: JSON.stringify({ employeeId, entry_Date: editedEntry3.entry_Date, employeeName: editedEntry3.employeeName, fatherName: editedEntry3.fatherName, address: editedEntry3.address, email: editedEntry3.email, phone: editedEntry3.phone, emergencyPhone: editedEntry3.emergencyPhone, dob: editedEntry3.dob, cnic: editedEntry3.cnic, salaryType: editedEntry3.salaryType })
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


    // Editing Mode for Employee
    const [editMode4, setEditMode4] = useState(false);
    const [editedEntry4, setEditedEntry4] = useState({});
    const [editedRowIndex4, setEditedRowIndex4] = useState(null);

    const handleSalaryMonthEditClick = (salaryMonth, index) => {
        setEditMode4(!editMode4);
        setEditedEntry4(salaryMonth);
        setEditedRowIndex4(index); // Set the index of the row being edited
    };


    const handleSalaryMonthInputChange = (e, field) => {
        setEditedEntry4({
            ...editedEntry4,
            [field]: e.target.value,
        });

    };

    const handleSalaryMonthUpdate = async () => {
        setLoading3(true)

        let monthId = editedEntry4._id
        try {
            const response = await fetch(`${apiUrl}/auth/employees/update/salary_month`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({ employeeId,monthId,month: editedEntry4.month, salary: editedEntry4.salary})
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
                setEditMode4(!editMode4)
            }
        }
        catch (error) {
            setNewMessage(toast.error('Server is not responding...'))
            setLoading3(false)
        }
    }

    
    const deleteSalaryMonth = async (payment) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            setLoading5(true)
            try {
                const response = await fetch(`${apiUrl}/auth/employees/delete/salary_month`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ employeeId,monthId:payment._id,salary:payment.salary})
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
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
          };
        
          const formattedDate = formatDate(new Date());
        
        const printContentString = `
        <div class="print-header">
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Employees Details</h1>
      </div>
      <hr/>
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
            <th>Remaining</th>
            <th>Address</th>
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
              <td>${String(entry.remaining)}</td>
              <td>${String(entry.address)}</td>      
            </tr>
          `).join('')}
          <tr>
          <td colspan="9"></td>
          <td>Total</td>
          <td>${String(filteredTotalEmployee.reduce((total, entry) => total + entry.remaining, 0))}</td>          
          <td></td>
        </tr>
        </tbody>
      </table>
      <style>
      /* Add your custom print styles here */
      body {
        background-color: #fff;
      }
      .print-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .title {
        flex-grow: 1;
        text-align: center;
        margin: 0;
        font-size: 24px;
      }
      .date {
        flex-grow: 0;
        text-align: right;
        font-size: 20px;
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
          <body>${printContentString}</body>
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
    }


    const printEmployeeDetails = (entry) => {
        // Convert JSX to HTML string
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
          };
        
          const formattedDate = formatDate(new Date());
        
        const printContentString = `
        <div class="print-header">
      <p class="invoice">Employee: ${entry.employeeName}</p>
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Employee Details</h1>
      </div>
      <hr/>
      <table class='print-table'>
        <thead>
          <tr>
            <th>Entry Date</th>
            <th>Employee</th>
            <th>Fahter Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Emergency Phone</th>
            <th>DOB</th>
            <th>CNIC</th>
            <th>Salary Type</th>
            <th>Remaining</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          
            <tr key="${entry?._id}">
              <td>${String(entry.entry_Date)}</td>       
              <td>${String(entry.employeeName)}</td>
              <td>${String(entry.fatherName)}</td>
              <td>${String(entry.email)}</td>
              <td>${String(entry.phone)}</td>
              <td>${String(entry.emergencyPhone)}</td>
              <td>${String(entry.dob)}</td>
              <td>${String(entry.cnic)}</td>
              <td>${String(entry.salaryType)}</td>
              <td>${String(entry.remaining)}</td>
              <td>${String(entry.address)}</td>      
            </tr>
        </tbody>
      </table>
      <style>
      /* Add your custom print styles here */
      body {
        background-color: #fff;
      }
      .print-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .title {
        flex-grow: 1;
        text-align: center;
        margin: 0;
        font-size: 24px;
      }
      .date {
        flex-grow: 0;
        text-align: right;
        font-size: 20px;
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
          <body>${printContentString}</body>
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
    }


    // individual payments filters
    const [newDateFrom, setNewDateFrom] = useState('')
    const [newDateTo, setNewDateTo] = useState('')

    const [payment_Via, setPayment_Via] = useState('')
    const [payment_Type, setPayment_Type] = useState('')
    
    const filteredIndividualPayments = employees
        .filter((data) => data.employeeName === selectedEmployee)
        .map((filteredData) => ({
            ...filteredData,
            payments: filteredData.payments.map((paymentItem) => ({
                ...paymentItem,
                payment: paymentItem.payment.filter((payment) => {
                    let isDateInRange = true;
                    // Check if the payment item's date is within the selected date range
                    if (newDateFrom && newDateTo) {
                        isDateInRange =
                            payment.date >= newDateFrom && payment.date <= newDateTo;
                    }
                    // Check if the payment object exists and has the expected structure
                    if (payment && payment.payment_Via && payment.payment_Type) {
                        return (
                            isDateInRange &&
                            payment.payment_Via?.toLowerCase().includes(payment_Via.toLowerCase()) &&
                            payment.payment_Type?.toLowerCase().includes(payment_Type.toLowerCase())
                        );
                    } else {
                        return false;
                    }
                })
            }))
        }));


        const printPaymentsTable = () => {
            const formatDate = (date) => {
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
              };
            
              const formattedDate = formatDate(new Date());
            // Convert JSX to HTML string
            const printContentString = `
            <div class="print-header">
            <p class="invoice">Employee: ${selectedEmployee}</p>
              <h1 class="title">ROZGAR TTTC</h1>
            <p class="date">Date: ${formattedDate}</p>
            </div>
            <div class="print-header">
              <h1 class="title">Emloyee Payment Invoices</h1>
            </div>
            <hr/>
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
                        <th>Paid Payment</th>
                        <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredIndividualPayments.map((entry, index) =>
                        entry.payments.map((paymentData, paymentIndex) =>
                            paymentData.payment.map((paymentItem, innerIndex) => `
                                <tr key="${entry?._id}-${paymentIndex}-${innerIndex}">
                                    <td>${index * entry.payments.length * paymentData.payment.length + paymentIndex * paymentData.payment.length + innerIndex + 1}</td>
                                    <td>${String(paymentItem?.date)}</td>
                                    <td>${String(paymentItem?.category)}</td>
                                    <td>${String(paymentItem?.payment_Via)}</td>
                                    <td>${String(paymentItem?.payment_Type)}</td>
                                    <td>${String(paymentItem?.slip_No)}</td>
                                    <td>${String(paymentItem?.details,"")}</td>
                                    <td>${String(paymentItem?.payment_Out)}</td>
                                    <td>${String(paymentItem?.invoice)}</td>
                                </tr>
                            `).join('')
                        ).join('')
                    )}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Total</td>
                        <td>${filteredIndividualPayments.reduce((total, entry) => total + entry.payments.reduce((acc, paymentData) => acc + paymentData.payment.reduce((innerAcc, paymentItem) => innerAcc + parseFloat(paymentItem.payment_Out), 0), 0), 0)}</td>
                        <td></td>
                    </tr>
                  </tbody>
                </table>
                <style>
                  /* Add your custom print styles here */
                  body {
                    background-color: #fff;
                  }
                  .print-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  }
                 
                  .title {
                    flex-grow: 1;
                    text-align: center;
                    margin: 0;
                    font-size: 24px;
                  }
                  .invoice {
                    flex-grow: 0;
                    text-align: left;
                    font-size: 20px;
                  }
                  .date{
                    flex-grow: 0;
                    text-align: right;
                    font-size: 20px;
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
        }
        
        const printPaymentInvoice = (paymentItem) => {
            const formatDate = (date) => {
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
              };
            
              const formattedDate = formatDate(new Date());
            // Convert JSX to HTML string
            const printContentString = `
            <div class="print-header">
            <p class="invoice">Invoice: ${paymentItem.invoice}</p>
              <h1 class="title">ROZGAR TTTC</h1>
            <p class="date">Date: ${formattedDate}</p>
            </div>
            <div class="print-header">
              <h1 class="title">Emloyee Payment Invoice</h1>
            </div>
            <hr/>
                <table class='print-table'>
                  <thead>
                    <tr>
                    <th>Date</th>
                        <th>Employee</th>
                        <th>Category</th>
                        <th>Payment_Via</th>
                        <th>Payment_Type</th>
                        <th>Slip_No</th>
                        <th>Details</th>
                        <th>Paid Payment</th>
                        <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                                <tr>
                                    <td>${String(paymentItem?.date)}</td>
                                    <td>${String(selectedEmployee)}</td>
                                    <td>${String(paymentItem?.category)}</td>
                                    <td>${String(paymentItem?.payment_Via)}</td>
                                    <td>${String(paymentItem?.payment_Type)}</td>
                                    <td>${String(paymentItem?.slip_No)}</td>
                                    <td>${String(paymentItem?.details,"")}</td>
                                    <td>${String(paymentItem?.payment_Out)}</td>
                                    <td>${String(paymentItem?.invoice)}</td>
                                </tr>
                  </tbody>
                </table>
                <style>
                  /* Add your custom print styles here */
                  body {
                    background-color: #fff;
                  }
                  .print-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  }
                 
                  .title {
                    flex-grow: 1;
                    text-align: center;
                    margin: 0;
                    font-size: 24px;
                  }
                  .invoice {
                    flex-grow: 0;
                    text-align: left;
                    font-size: 20px;
                  }
                  .date{
                    flex-grow: 0;
                    text-align: right;
                    font-size: 20px;
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
        }

    const [date3, setDate3] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')

    const filteredVacations = employees
        .filter((data) => data.employeeName === selectedEmployee)
        .map((filteredData) => ({
            ...filteredData,
            vacation: filteredData.vacation
                .filter((vacation) =>
                    vacation.date?.toLowerCase().includes(date3.toLowerCase()) &&
                    vacation.dateFrom?.toLowerCase().includes(dateFrom.toLowerCase()) &&
                    vacation.dateTo?.toLowerCase().includes(dateTo.toLowerCase())

                ),
        }))

        const printVacationsTable = () => {
            // Calculate total days
            const totalDays = filteredVacations.reduce((total, entry) => total + entry.vacation.reduce((acc, vacation) => acc + parseFloat(vacation.days), 0), 0);
        
            const formatDate = (date) => {
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
              };
            
              const formattedDate = formatDate(new Date());
            // Convert JSX to HTML string
            const printContentString = `
            <div class="print-header">
            <p class="invoice">Employee: ${selectedEmployee}</p>
              <h1 class="title">ROZGAR TTTC</h1>
            <p class="date">Date: ${formattedDate}</p>
            </div>
            <div class="print-header">
              <h1 class="title">Emloyee Vacations Details</h1>
            </div>
            <hr/>
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
                        <tr>
                            <td colspan="4"></td>
                            <td>Total: ${totalDays}</td>
                            <td colspan="2"></td>
                        </tr>
                    </tbody>
                </table>
                <style>
                    /* Add your custom print styles here */
                    body {
                        background-color: #fff;
                    }
                    .print-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                      }
                     
                      .title {
                        flex-grow: 1;
                        text-align: center;
                        margin: 0;
                        font-size: 24px;
                      }
                      .invoice {
                        flex-grow: 0;
                        text-align: left;
                        font-size: 20px;
                      }
                      .date{
                        flex-grow: 0;
                        text-align: right;
                        font-size: 20px;
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
        
        const printVacation = (vacation) => {
            // Calculate total days
            const totalDays = filteredVacations.reduce((total, entry) => total + entry.vacation.reduce((acc, vacation) => acc + parseFloat(vacation.days), 0), 0);
        
            const formatDate = (date) => {
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
              };
            
              const formattedDate = formatDate(new Date());
            // Convert JSX to HTML string
            const printContentString = `
            <div class="print-header">
            <p class="invoice">Employee: ${selectedEmployee}</p>
              <h1 class="title">ROZGAR TTTC</h1>
            <p class="date">Date: ${formattedDate}</p>
            </div>
            <div class="print-header">
              <h1 class="title">Emloyee Vacation Details</h1>
            </div>
            <hr/>
                <table class='print-table'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Date From</th>
                            <th>Date To</th>
                            <th>Days</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                        </tr>
                    </thead>
                    <tbody>
                      
                                <tr >
                                    <td>${String(vacation?.date)}</td>
                                    <td>${String(vacation?.dateFrom)}</td>
                                    <td>${String(vacation?.dateTo)}</td>
                                    <td>${String(vacation?.days)}</td>
                                    <td>${String(vacation?.timeIn)}</td>
                                    <td>${String(vacation?.timeOut)}</td>
                                </tr>
                           
                    </tbody>
                </table>
                <style>
                    /* Add your custom print styles here */
                    body {
                        background-color: #fff;
                    }
                    .print-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                      }
                     
                      .title {
                        flex-grow: 1;
                        text-align: center;
                        margin: 0;
                        font-size: 24px;
                      }
                      .invoice {
                        flex-grow: 0;
                        text-align: left;
                        font-size: 20px;
                      }
                      .date{
                        flex-grow: 0;
                        text-align: right;
                        font-size: 20px;
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


        const [month, setMonth] = useState('');
// Filter and map over the employees array
const filteredSalaryMonths = employees
    .filter((data) => data.employeeName.trim().toLowerCase() === selectedEmployee.trim().toLowerCase())
    .map((filteredData) => {
        // Filter and sort the payments array within each employee object
        const filteredPayments = filteredData.payments
            .filter((payment) => payment.month.trim().toLowerCase().includes(month.trim().toLowerCase()))
            filteredPayments.sort((a, b) => (b.createdAt) - (a.createdAt));
        return {
            ...filteredData,
            payments: filteredPayments,
        };
    });

        const printSalaryMonthsTable = () => {
            // Calculate total days
             const totalPaid = filteredSalaryMonths.reduce((total, entry) => total + entry.payments.reduce((acc, payment) => acc + parseFloat(payment.salary - payment.remain), 0), 0);
             const totalRemain = filteredSalaryMonths.reduce((total, entry) => total + entry.payments.reduce((acc, payment) => acc + parseFloat(payment.remain), 0), 0);

             const formatDate = (date) => {
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
              };
            
              const formattedDate = formatDate(new Date());
            // Convert JSX to HTML string
            const printContentString = `
            <div class="print-header">
            <p class="invoice">Employee: ${selectedEmployee}</p>
              <h1 class="title">ROZGAR TTTC</h1>
            <p class="date">Date: ${formattedDate}</p>
            </div>
            <div class="print-header">
              <h1 class="title">Employee Salary Months Record</h1>
            </div>
            <hr/>
                <table class='print-table'>
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Month</th>
                            <th>Salary</th>
                            <th>Paid</th>
                            <th>Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredSalaryMonths.map((entry, index) =>
                            entry.payments.map((payment) => `
                                <tr key="${payment?._id}">
                                    <td>${index+1}</td>
                                    <td>${String(payment?.month)}</td>
                                    <td>${String(payment?.salary)}</td>
                                    <td>${payment?.salary-payment?.remain}</td>
                                    <td>${String(payment?.remain)}</td>
                                   
                                </tr>
                            `).join('')
                        )}
                        <tr>
                            <td colspan="3"></td>
                            <td>Total: ${totalPaid}</td>
                            <td>Total: ${totalRemain}</td>
                            
                        </tr>
                    </tbody>
                </table>
                <style>
                    /* Add your custom print styles here */
                    body {
                        background-color: #fff;
                    }
                    .print-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                      }
                     
                      .title {
                        flex-grow: 1;
                        text-align: center;
                        margin: 0;
                        font-size: 24px;
                      }
                      .invoice {
                        flex-grow: 0;
                        text-align: left;
                        font-size: 20px;
                      }
                      .date{
                        flex-grow: 0;
                        text-align: right;
                        font-size: 20px;
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

        const printSalaryMonth = (payment) => {
           

             const formatDate = (date) => {
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
              };
            
              const formattedDate = formatDate(new Date());
            // Convert JSX to HTML string
            const printContentString = `
            <div class="print-header">
            <p class="invoice">Employee: ${selectedEmployee}</p>
              <h1 class="title">ROZGAR TTTC</h1>
            <p class="date">Date: ${formattedDate}</p>
            </div>
            <div class="print-header">
              <h1 class="title">Employee Salary Month Details</h1>
            </div>
            <hr/>
                <table class='print-table'>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Salary</th>
                            <th>Paid</th>
                            <th>Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                      
                                <tr>
                                    <td>${String(payment?.month)}</td>
                                    <td>${String(payment?.salary)}</td>
                                    <td>${payment?.salary-payment?.remain}</td>
                                    <td>${String(payment?.remain)}</td>
                                   
                                </tr>
                           
                       
                    </tbody>
                </table>
                <style>
                    /* Add your custom print styles here */
                    body {
                        background-color: #fff;
                    }
                    .print-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                      }
                     
                      .title {
                        flex-grow: 1;
                        text-align: center;
                        margin: 0;
                        font-size: 24px;
                      }
                      .invoice {
                        flex-grow: 0;
                        text-align: left;
                        font-size: 20px;
                      }
                      .date{
                        flex-grow: 0;
                        text-align: right;
                        font-size: 20px;
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
                Employees: payments.employeeName,
                FatherName: payments.fatherName,
                Email: payments.email,
                Phone: payments.phone,
                EmergencyPhone: payments.emergencyPhone,
                Dob: payments.dob,
                Cnic: payments.cnic,
                SalaryType: payments.salaryType,
                Remaining: payments.remaining,
                Address: payments.address,
            }

            data.push(rowData);
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'Employees Details.xlsx');
    }


    const downloadEmployeeDetails = (payments) => {
        const data = [];
        // Iterate over entries and push all fields
       
            const rowData = {
                Employee: payments.employeeName,
                FatherName: payments.fatherName,
                Email: payments.email,
                Phone: payments.phone,
                EmergencyPhone: payments.emergencyPhone,
                Dob: payments.dob,
                Cnic: payments.cnic,
                SalaryType: payments.salaryType,
                Remaining: payments.remaining,
                Address: payments.address,
            }

            data.push(rowData);
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'Employee Details.xlsx');
    }


    const downloadIndividualPayments = () => {
        const data = [];
        // Iterate over filteredIndividualPayments
        filteredIndividualPayments.forEach((filteredData, index) => {
            // Check if payments exist in filteredData and it's an array
            if (filteredData.payments && Array.isArray(filteredData.payments)) {
                // Iterate over each payment object
                filteredData.payments.forEach((paymentData, paymentIndex) => {
                    // Check if payment array exists in paymentData
                    if (paymentData.payment && Array.isArray(paymentData.payment)) {
                        // Iterate over the payment array
                        paymentData.payment.forEach((paymentItem, index) => {
                            const rowData = {
                                SN: index + 1,
                                Date: paymentItem.date,
                                Category: paymentItem.category,
                                Payment_Via: paymentItem.payment_Via,
                                Payment_Type: paymentItem.payment_Type,
                                Slip_No: paymentItem.slip_No,
                                Details: paymentItem.details,
                                Payment_Out: paymentItem.payment_Out,
                                Invoice: paymentItem.invoice,
                            };
                            data.push(rowData);
                        });
                    }
                });
            }
        });
    
        if (data.length > 0) {
            // Create worksheet and workbook using XLSX utils
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            // Download the workbook as an Excel file
            XLSX.writeFile(wb, `${selectedEmployee} Payment Details.xlsx`);
        } else {
            console.log("No payment data found.");
        }
    };

    const downloadPaymentInvoice = (paymentItem) => {
        const data = [];
                            const rowData = {
                                Employee:selectedEmployee,
                                Date: paymentItem.date,
                                Category: paymentItem.category,
                                Payment_Via: paymentItem.payment_Via,
                                Payment_Type: paymentItem.payment_Type,
                                Slip_No: paymentItem.slip_No,
                                Details: paymentItem.details,
                                Payment_Out: paymentItem.payment_Out,
                                Invoice: paymentItem.invoice,
                            };
                            data.push(rowData);
    
        if (data.length > 0) {
            // Create worksheet and workbook using XLSX utils
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            // Download the workbook as an Excel file
            XLSX.writeFile(wb, `${selectedEmployee} Payment Invoice.xlsx`);
        } else {
            console.log("No payment data found.");
        }
    };

    const downloadVacations = () => {
        const data = [];
       
        filteredVacations.forEach((employee, index) => {
            employee.vacation.forEach((payment) =>{
                const rowData = {
                    SN: index + 1,
                    Date: payment.date,
                    DateFrom: payment.dateFrom,
                    DateTo: payment.dateTo,
                    Days: payment.days,
                    TimeIn: payment.timeIn,
                    TimeOut: payment.timeOut,
                }
    
                data.push(rowData);
            })
            
        })

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${selectedEmployee} Vacations Details.xlsx`);
    }
    
    const downloadSalaryMonths = () => {
        const data = [];
        // Iterate over filteredSalaryMonths and access the payments array within each employee object
        filteredSalaryMonths.forEach((employee, index) => {
            employee.payments.forEach((payment) => {
                const rowData = {
                    SN: data.length + 1,
                    Month: payment.month,
                    Salary: payment.salary,
                    Paid: payment.salary - payment.remain,
                    Remaining: payment.remain,
                };
                data.push(rowData);
            });
        });
    
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${selectedEmployee} Salary Months Details.xlsx`);
    }
    
    const collapsed = useSelector((state) => state.collapsed.collapsed);
    return (
      <>
      <div className={`${collapsed ?"collapsed":"main"}`}>
                <div className="container-fluid py-2 payment_details">
                    <div className="row">
                        <div className='col-md-12 '>
                            <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                                <div className="left d-flex">
                                    <h4>Employees Details</h4>
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
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>SN</TableCell>
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>Date</TableCell>
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>Employee</TableCell>
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>Father_Name</TableCell>
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>Email</TableCell>
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>Phone</TableCell>
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>Emergency_Phone</TableCell>
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>DOB</TableCell>
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>CNIC</TableCell>
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>Salary_Type</TableCell>
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>Remaining</TableCell>
                                                            <TableCell className='label border' style={{ width: '18.28%' }}>Address</TableCell>
                                                            {route !== "/rozgar/reports/payroll_reports" &&
                                                                <TableCell align='left' className='edw_label border' style={{ width: '18.28%' }} colSpan={1}> Actions</TableCell>
                                                            }
                                                        </TableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        {filteredTotalEmployee.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry, index) => (

                                                            <TableRow key={entry._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                                                                {editMode3 && editedRowIndex3 === index ?
                                                                    (
                                                                        <>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='number' value={index} readonly />

                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='date' value={editedEntry3.entry_Date} readonly />
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='text' value={editedEntry3.employeeName} onChange={(e) => handleEmployeeInputChange(e, 'employeeName')} />
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='text' value={editedEntry3.fatherName} onChange={(e) => handleEmployeeInputChange(e, 'fatherName')} />
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='email' value={editedEntry3.email} onChange={(e) => handleEmployeeInputChange(e, 'email')} />
                                                                            </TableCell>

                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='text' value={editedEntry3.phone} onChange={(e) => handleEmployeeInputChange(e, 'phone')} />
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='text' value={editedEntry3.emergencyPhone} onChange={(e) => handleEmployeeInputChange(e, 'emergencyPhone')} />

                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='date' value={editedEntry3.dob} onChange={(e) => handleEmployeeInputChange(e, 'dob')} />
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='text' value={editedEntry3.cnic} onChange={(e) => handleEmployeeInputChange(e, 'cnic')} />

                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='text' value={editedEntry3.salaryType} onChange={(e) => handleEmployeeInputChange(e, 'salaryType')} />
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='number' value={editedEntry3.remaining} readonly onChange={(e) => handleEmployeeInputChange(e, 'remaining')} />
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                <input type='text' value={editedEntry3.address} onChange={(e) => handleEmployeeInputChange(e, 'address')} />
                                                                            </TableCell>
                                                                           
                                                                            {route !== "/rozgar/reports/payroll_reports" &&
                                                                                <TableCell className='border data_td p-1 text-center'>
                                                                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                                        <button onClick={() => setEditMode3(!editMode3)} className='btn delete_btn btn-sm'><i className="fa-solid fa-xmark"></i></button>
                                                                                        <button onClick={() => handleEmployeeUpdate()} className='btn save_btn btn-sm' disabled={loading3}><i className="fa-solid fa-check"></i></button>

                                                                                    </div>

                                                                                </TableCell>
                                                                            }
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{index + 1}</TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                {entry.entry_Date}
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }} onClick={() => handleRowClick(entry.employeeName)}>
                                                                                {entry.employeeName}
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                {entry.fatherName}
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                {entry.email}
                                                                            </TableCell>

                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                {entry.phone}
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                {entry.emergencyPhone}
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                {entry.dob}
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                {entry.cnic}
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                {entry.salaryType}
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                {entry.remaining}
                                                                            </TableCell>
                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                                                                {entry.address}
                                                                            </TableCell>
                                                                          
                                                                            {route !== "/rozgar/reports/payroll_reports" &&
                                                                                <TableCell className='border data_td p-1 text-center'>
                                                                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                                        <button onClick={() => handleEmployeeEditClick(entry, index)} className='btn edit_btn btn-sm'><i className="fa-solid fa-pen-to-square"></i></button>
                                                                                        <button onClick={() => printEmployeeDetails(entry)} className='btn bg-success text-white btn-sm'><i className="fa-solid fa-print"></i></button>
                                                                                        <button onClick={() => downloadEmployeeDetails(entry)} className='btn bg-warning text-white btn-sm'><i className="fa-solid fa-download"></i></button>
                                                                                        <button className='btn delete_btn btn-sm' onClick={() => deleteEmployee(entry)} disabled={loading5}><i className="fa-solid fa-trash-can"></i></button>
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
                                                count={filteredTotalEmployee.length}
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
                                            <button className='btn btn-sm show_btn mx-1' style={single===0 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setSingle(0)}>Salary Sheet</button>
                                            <button className='btn btn-sm show_btn mx-1' style={single===1 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}}  onClick={()=>setSingle(1)}>Salary Months</button>
                                            <button className='btn btn-sm show_btn mx-1' style={single===2 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}}  onClick={()=>setSingle(2)}>Vacations</button>
                                            {selectedEmployee && <button className='btn detail_btn' onClick={handleOption}><i className="fas fa-times"></i></button>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                   {single===0 &&
                                   <>
                                    <div className="col-md-12">
                                        <div className="row border">
                                            <div className="col-md-12 filters">
                                                <Paper className='py-1 mb-2 px-3'>
                                                    <div className="row">
                                                        <div className="col-auto px-1">
                                                            <label htmlFor="">Date From:</label>
                                                            <input type="date" value={newDateFrom} onChange={(e) => setNewDateFrom(e.target.value)} className='m-0 p-1' />
                                                        </div>
                                                        <div className="col-auto px-1">
                                                            <label htmlFor="">Date To:</label>
                                                            <input type="date" value={newDateTo} onChange={(e) => setNewDateTo(e.target.value)} className='m-0 p-1' />

                                                        </div>
                                                        <div className="col-auto px-1">
                                                            <label htmlFor="">Payment Via:</label>
                                                            <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} className='m-0 p-1'>
                                                                <option value="">All</option>
                                                                {[...new Set(filteredIndividualPayments
                                                                    .flatMap(data => data.payments.flatMap(paymentItem => paymentItem.payment))
                                                                    .map(payment => payment.payment_Via)
                                                                )].map(paymentVia => (
                                                                    <option value={paymentVia} key={paymentVia}>{paymentVia}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="col-auto px-1">
                                                            <label htmlFor="">Payment Type:</label>
                                                            <select value={payment_Type} onChange={(e) => setPayment_Type(e.target.value)} className='m-0 p-1'>
                                                                <option value="">All</option>
                                                                {[...new Set(filteredIndividualPayments
                                                                    .flatMap(data => data.payments.flatMap(paymentItem => paymentItem.payment))
                                                                    .map(payment => payment.payment_Type)
                                                                )].map(paymentType => (
                                                                    <option value={paymentType} key={paymentType}>{paymentType}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                    </div>
                                                </Paper>
                                            </div>

                                            <div className="col-md-12 detail_table my-2">
                                                <div className="d-flex justify-content-between">
                                                    <div className="left d-flex">
                                                        <h6>Payments Details</h6>
                                                    </div>
                                                    <div className="right">
                                                        <button className='btn excel_btn m-1 btn-sm' onClick={downloadIndividualPayments}>Download </button>
                                                        <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printPaymentsTable}>Print </button>
                                                    </div>
                                                </div>
                                                <h6></h6>
                                                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                                                    <Table stickyHeader>
                                                        <TableHead className="thead">
                                                            <TableRow>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Date</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Category</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Via</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Type</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Slip_No</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Details</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Out</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Invoice</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Payment_In_Curr</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>CUR_Rate</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>CUR_Amount</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Slip_Pic</TableCell>
                                                                {route !== "/rozgar/reports/payroll_reports" && <TableCell align='left' className='edw_label border' style={{ width: '18.28%' }} colSpan={1}>
                                                                    Actions
                                                                </TableCell>}

                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {filteredIndividualPayments.map((filteredData) => (
                                                                <React.Fragment key={filteredData._id}>
                                                                    {filteredData.payments && filteredData.payments.map((paymentData, paymentIndex) => (
                                                                        <React.Fragment key={paymentIndex}>
                                                                            {paymentData.payment && paymentData.payment.map((paymentItem, index) => (
                                                                                <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                                                                                 
                                                                                    {editMode && editedRowIndex === paymentItem._id ? (
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

                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.date}</TableCell>
                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.category}</TableCell>
                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_Via}</TableCell>
                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_Type}</TableCell>
                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.slip_No}</TableCell>
                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.details}</TableCell>
                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.payment_Out}</TableCell>
                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.invoice}</TableCell>
                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_Out_Curr}</TableCell>
                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.curr_Rate}</TableCell>
                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.curr_Amount}</TableCell>
                                                                                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem.slip_Pic ? <a href={paymentItem.slip_Pic} target="_blank" rel="noopener noreferrer"> <img src={paymentItem.slip_Pic} alt='Images' className='rounded' /></a>  : "No Picture"}</TableCell>
                                                                                        </>
                                                                                    )}
                                                                                    {/* Actions */}
                                                                                    {route !== "/rozgar/reports/payroll_reports" &&
                                                                                        <TableCell className='border data_td p-1 text-center'>
                                                                                            {editMode && editedRowIndex === paymentItem._id ? (
                                                                                                // Render Save button when in edit mode for the specific row
                                                                                                <>
                                                                                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                                                        <button onClick={() => setEditMode(!editMode)} className='btn delete_btn btn-sm'><i className="fa-solid fa-xmark"></i></button>
                                                                                                        <button onClick={() => handleUpdate()} className='btn save_btn btn-sm' disabled={loading3}><i className="fa-solid fa-check"></i></button>

                                                                                                    </div>

                                                                                                </>

                                                                                            ) : (
                                                                                                
                                                                                                <>
                                                                                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                                                        <button onClick={() => handleEditClick(paymentItem, paymentItem._id)} className='btn edit_btn btn-sm'><i className="fa-solid fa-pen-to-square"></i></button>
                                                                                                        <button onClick={() => printPaymentInvoice(paymentItem)} className='btn bg-success text-white btn-sm'><i className="fa-solid fa-print"></i></button>
                                                                                                        <button onClick={() => downloadPaymentInvoice(paymentItem)} className='btn bg-warning text-white btn-sm'><i className="fa-solid fa-download"></i></button>
                                                                                                        <button className='btn delete_btn btn-sm' onClick={() => deletePaymentOut(paymentItem)} disabled={loading1}><i className="fa-solid fa-trash-can"></i></button>
                                                                                                    </div>
                                                                                                   
                                                                                                </>
                                                                                            )}
                                                                                        </TableCell>
                                                                                    }
                                                                                </TableRow>
                                                                            ))}
                                                                        </React.Fragment>
                                                                    ))}
                                                                </React.Fragment>
                                                            ))}

                                                            <TableRow>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                
                                                                <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                                                                <TableCell className='border data_td text-center bg-danger text-white'>
                                                                    {/* Calculate the total sum of payment_Out */}
                                                                    {filteredIndividualPayments.reduce((total, filteredData) => {
                                                                        return total + filteredData.payments.reduce((sum, paymentItem) => {
                                                                            return sum + paymentItem.payment.reduce((paymentSum, payment) => {
                                                                                const paymentOut = parseFloat(payment.payment_Out);
                                                                                return isNaN(paymentOut) ? paymentSum : paymentSum + paymentOut;
                                                                            }, 0);
                                                                        }, 0);
                                                                    }, 0)}
                                                                </TableCell>



                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        </div>
                                    </div>
                                   </>
                                   }
                                    {single===2 &&
                                    <>
                                    <div className="col-md-12">
                                        <div className="row border p-0">
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
                                                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                                                    <Table stickyHeader>
                                                        <TableHead className="thead">
                                                            <TableRow>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>SN</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Date</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Date_From</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Date_To</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Days</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Time_In</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Time_Out</TableCell>
                                                                {route !== "/rozgar/reports/payroll_reports" &&
                                                                    <TableCell className='label border' style={{ width: '18.28%' }}>Action</TableCell>
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
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='text' value={index + 1} readonly />
                                                                                    </TableCell>
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='date' value={editedEntry2.date} onChange={(e) => handlePersonInputChange(e, 'date')} />
                                                                                    </TableCell>
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='date' value={editedEntry2.dateFrom} onChange={(e) => handlePersonInputChange(e, 'dateFrom')} />
                                                                                    </TableCell>
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='date' value={editedEntry2.dateTo} onChange={(e) => handlePersonInputChange(e, 'dateTo')} />
                                                                                    </TableCell>
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='number' min='0' value={editedEntry2.days} onChange={(e) => handlePersonInputChange(e, 'days')} />
                                                                                    </TableCell>
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='time' value={editedEntry2.timeIn} onChange={(e) => handlePersonInputChange(e, 'timeIn')} />
                                                                                    </TableCell>
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='time' value={editedEntry2.timeOut} onChange={(e) => handlePersonInputChange(e, 'timeOut')} />
                                                                                    </TableCell>




                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{index + 1}</TableCell>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{vacation?.date}</TableCell>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{vacation?.dateFrom}</TableCell>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{vacation?.dateTo}</TableCell>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }} >{vacation?.days}</TableCell>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }} >{vacation?.timeIn}</TableCell>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{vacation?.timeOut}</TableCell>



                                                                                </>
                                                                            )}
                                                                            {route !== "/rozgar/reports/payroll_reports" &&
                                                                                <TableCell className='border data_td p-1 text-center' style={{ width: '18.28%' }}>
                                                                                    {editMode2 && editedRowIndex2 === index ? (
                                                                                        // Render Save button when in edit mode for the specific row
                                                                                        <>
                                                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                                                <button onClick={() => setEditMode2(!editMode2)} className='btn delete_btn btn-sm'><i className="fa-solid fa-xmark"></i></button>
                                                                                                <button onClick={() => handleUpdateVacation()} className='btn save_btn btn-sm' disabled={loading5}><i className="fa-solid fa-check"></i></button>

                                                                                            </div>

                                                                                        </>

                                                                                    ) : (
                                                                                        // Render Edit button when not in edit mode or for other rows
                                                                                        <>
                                                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                                                <button onClick={() => handlePersonEditClick(vacation, index)} className='btn edit_btn btn-sm'><i className="fa-solid fa-pen-to-square"></i></button>
                                                                                        <button onClick={() => printVacation(vacation)} className='btn bg-success text-white btn-sm'><i className="fa-solid fa-print"></i></button>
                                                                                                <button className='btn delete_btn btn-sm' onClick={() => deleteVacation(vacation)} disabled={loading2}><i className="fa-solid fa-trash-can"></i></button>
                                                                                            </div>
                                                                                           
                                                                                        </>
                                                                                    )}
                                                                                </TableCell>
                                                                            }

                                                                        </TableRow>
                                                                    ))}
                                                                    <TableRow>
                                                                        <TableCell></TableCell>
                                                                        <TableCell></TableCell>
                                                                        <TableCell></TableCell>
                                                                        <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                                                                        <TableCell className='border data_td text-center bg-warning text-white'>
                                                                            {/* Calculate the total sum of vacation days */}
                                                                            {filteredVacations.reduce((total, filteredData) => {
                                                                                return total + filteredData.vacation.reduce((sum, vacation) => {
                                                                                    const totalDays = parseFloat(vacation.days);
                                                                                    return isNaN(totalDays) ? sum : sum + totalDays;
                                                                                }, 0);
                                                                            }, 0)}
                                                                        </TableCell>




                                                                    </TableRow>
                                                                </>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                    }


                                {single===1 &&
                                    <>
                                    <div className="col-md-12">
                                        <div className="row border p-0">
                                            <div className="col-md-12 filters">
                                                <Paper className='py-1 mb-2 px-3'>
                                                    <div className="row">

                                                        <div className="col-auto px-1">
                                                            <label htmlFor="">Select Month:</label>
                                                            <select value={month} onChange={(e) => setMonth(e.target.value)} className='m-0 p-1'>
                                                                <option value="">All</option>
                                                                {[...new Set(employees
                                                                    .filter(data => data.employeeName === selectedEmployee)
                                                                    .flatMap(data => data.payments)
                                                                    .map(data => data.month)
                                                                )].map(dateValue => (
                                                                    <option value={dateValue} key={dateValue}>{dateValue}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        

                                                    </div>
                                                </Paper>
                                            </div>
                                            <div className="col-md-12 detail_table my-2">
                                                <div className="d-flex justify-content-between">
                                                    <div className="left d-flex">
                                                        <h6>Salary Months</h6>
                                                    </div>
                                                    <div className="right">
                                                        <button className='btn excel_btn m-1 btn-sm' onClick={downloadSalaryMonths}>Download </button>
                                                        <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printSalaryMonthsTable}>Print </button>
                                                    </div>
                                                </div>
                                                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                                                    <Table stickyHeader>
                                                        <TableHead className="thead">
                                                            <TableRow>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>SN</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Month</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Salary</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Paid</TableCell>
                                                                <TableCell className='label border' style={{ width: '18.28%' }}>Remaining</TableCell>
                                                                {route !== "/rozgar/reports/payroll_reports" &&
                                                                    <TableCell className='label border' style={{ width: '18.28%' }}>Action</TableCell>
                                                                }
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {filteredSalaryMonths.map((filteredData) => (
                                                                <>
                                                                    {filteredData.payments.map((payment, index) => (

                                                                        <TableRow key={payment?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                                                                            {editMode4 && editedRowIndex4 === index ? (
                                                                                <>
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='text' value={index + 1} readonly />
                                                                                    </TableCell>
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='month' value={editedEntry4.month} onChange={(e) => handleSalaryMonthInputChange(e, 'month')} />
                                                                                    </TableCell>
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='number' min='0' value={editedEntry4.salary} onChange={(e) => handleSalaryMonthInputChange(e, 'salary')} />
                                                                                    </TableCell>
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='number' min='0' value={editedEntry4.salary-editedEntry4.remain} readonly />
                                                                                    </TableCell>
                                                                                    <TableCell className='border data_td p-1 ' style={{ width: '18.28%' }}>
                                                                                        <input type='number' min='0' value={editedEntry4.remain} readonly/>
                                                                                    </TableCell>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{index + 1}</TableCell>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{payment?.month}</TableCell>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{payment?.salary}</TableCell>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{payment?.salary-payment?.remain}</TableCell>
                                                                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{payment?.remain}</TableCell>
                                                                                </>
                                                                            )}
                                                                            {route !== "/rozgar/reports/payroll_reports" &&
                                                                                <TableCell className='border data_td p-1 text-center' style={{ width: '18.28%' }}>
                                                                                    {editMode4 && editedRowIndex4 === index ? (
                                                                                        // Render Save button when in edit mode for the specific row
                                                                                        <>
                                                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                                                <button onClick={() => setEditMode4(!editMode4)} className='btn delete_btn btn-sm'><i className="fa-solid fa-xmark"></i></button>
                                                                                                <button onClick={() => handleSalaryMonthUpdate()} className='btn save_btn btn-sm' disabled={loading3}><i className="fa-solid fa-check"></i></button>

                                                                                            </div>

                                                                                        </>

                                                                                    ) : (
                                                                                        // Render Edit button when not in edit mode or for other rows
                                                                                        <>
                                                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                                                <button onClick={() => handleSalaryMonthEditClick(payment, index)} className='btn edit_btn btn-sm'><i className="fa-solid fa-pen-to-square"></i></button>
                                                                                        <button onClick={() => printSalaryMonth(payment)} className='btn bg-success text-white btn-sm'><i className="fa-solid fa-print"></i></button>
                                                                                                <button className='btn delete_btn btn-sm' onClick={() => deleteSalaryMonth(payment)} disabled={loading5}><i className="fa-solid fa-trash-can"></i></button>
                                                                                            </div>
                                                                                           
                                                                                        </>
                                                                                    )}
                                                                                </TableCell>
                                                                            }

                                                                        </TableRow>
                                                                    ))}
                                                                    <TableRow>
                                                                        <TableCell></TableCell>
                                                                        <TableCell></TableCell>
                                                                        <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                                                                        <TableCell className='border data_td text-center bg-success text-white'>
                                                                            {/* Calculate the total sum of vacation days */}
                                                                            {filteredSalaryMonths.reduce((total, filteredData) => {
                                                                                return total + filteredData.payments.reduce((sum, payment) => {
                                                                                    const totalRemaining = parseFloat(payment.salary-payment.remain);
                                                                                    return isNaN(totalRemaining) ? sum : sum + totalRemaining;
                                                                                }, 0);
                                                                            }, 0)}
                                                                        </TableCell>
                                                                        <TableCell className='border data_td text-center bg-danger text-white'>
                                                                            {/* Calculate the total sum of vacation days */}
                                                                            {filteredSalaryMonths.reduce((total, filteredData) => {
                                                                                return total + filteredData.payments.reduce((sum, payment) => {
                                                                                    const totalRemaining = parseFloat(payment.remain);
                                                                                    return isNaN(totalRemaining) ? sum : sum + totalRemaining;
                                                                                }, 0);
                                                                            }, 0)}
                                                                        </TableCell>




                                                                    </TableRow>
                                                                </>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                    }
                                </div>




                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}
