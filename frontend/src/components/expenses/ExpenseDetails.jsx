import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import ExpeCategoryHook from '../../hooks/settingHooks/ExpeCategoryHook'
import PaymentViaHook from '../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../hooks/settingHooks/PaymentTypeHook'
import CurrCountryHook from '../../hooks/settingHooks/CurrCountryHook'
import { deleteExpense, updateExpense } from '../../redux/reducers/expenseSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import ExpenseHook from '../../hooks/expenseHooks/ExpenseHook'
// import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function ExpenseDetails() {
  const dispatch = useDispatch();
  // getting data from redux store 
  const currCountries = useSelector((state) => state.setting.currCountries);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const expenseCategories = useSelector((state) => state.setting.expenseCategories);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [show, setShow] = useState(false)

  
  const { getCurrCountryData } = CurrCountryHook()
  const { getExpenseCategoryData } = ExpeCategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const { getExpenses } = ExpenseHook()


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


  const expenses = useSelector((state) => state.expenses.expenses);
  

  // Editing Mode 
  const [editMode, setEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState({});
  const [editedRowIndex, setEditedRowIndex] = useState(null);

  const handleEditClick = (expense, index) => {
    setEditMode(!editMode);
    setEditedEntry(expense);
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



  // getting Data from DB
  const { user } = useAuthContext()
  const fetchData = async () => {
    try {
      // Use Promise.all to execute all promises concurrently
      await Promise.all([
        getCurrCountryData(),
        getExpenseCategoryData(),
        getPaymentViaData(),
        getPaymentTypeData(),
        getExpenses()

      ]);

    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData()
  }, [user, dispatch])


  // Submitting Form Data
  const [loading, setLoading] = useState(null)
  const [, setNewMessage] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateFrom = async () => {
    setIsLoading(true)

    let expenseId = editedEntry._id
    try {
      const response = await fetch(`${apiUrl}/auth/expenses/update/expense`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ expenseId, name: editedEntry.name, expCategory: editedEntry.expCategory, payment_Out: editedEntry.payment_Out, payment_Via: editedEntry.payment_Via, payment_Type: editedEntry.payment_Type, slip_No: editedEntry.slip_No, slip_Pic: editedEntry.slip_Pic, details: editedEntry.details, curr_Country: editedEntry.curr_Country, curr_Rate: editedEntry.curr_Rate, curr_Amount: editedEntry.curr_Amount, date: editedEntry.date })
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setIsLoading(false)
      }
      if (response.ok) {
        dispatch(updateExpense(json.data))
        setNewMessage(toast.success(json.message));
        setIsLoading(null)
        setEditMode(!editMode)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setIsLoading(false)
    }
  };


  const deleteExpense = async (expense) => {
    if (window.confirm('Are you sure you want to delete this record?')){
      setIsLoading(true)
      let expenseId = expense._id
      try {
        const response = await fetch(`${apiUrl}/auth/expenses/delete/expense`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ expenseId })
        })
  
        const json = await response.json()
  
        if (!response.ok) {
          setNewMessage(toast.error(json.message));
          setIsLoading(false)
        }
        if (response.ok) {
          getExpenses()
          setNewMessage(toast.success(json.message));
          setIsLoading(false)
        }
      }
      catch (error) {
        setNewMessage(toast.error('Server is not responding...'))
        setIsLoading(false)
      }
    }
   
  }


            
  // individual payments filters
  const [cash_Type,setCash_Type]=useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [name, setName] = useState('')
  const [expe_Category, setExpe_Category] = useState('')
  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')
  const filteredExpenses = expenses.filter(expense => {
    let isDateInRange = true;
  
    // Check if the expense date is within the selected date range
    if (dateFrom && dateTo) {
      isDateInRange = expense.date >= dateFrom && expense.date <= dateTo;
    }
  
    // Filter payment_Via based on the selected cash_Type
    let filteredPaymentVia = true;
    if (cash_Type === 'cash') {
      filteredPaymentVia = expense.payment_Via.toLowerCase().includes('cash');
    } else if (cash_Type === 'banks') {
      filteredPaymentVia = !expense.payment_Via.toLowerCase().includes('cash');
    }
  
    return (
      isDateInRange &&
      expense.name.toLowerCase().includes(name.toLowerCase()) &&
      expense.expCategory.toLowerCase().includes(expe_Category.toLowerCase()) &&
      expense.payment_Via.toLowerCase().includes(payment_Via.toLowerCase()) &&
      expense.payment_Type.toLowerCase().includes(payment_Type.toLowerCase()) &&
      filteredPaymentVia
    )
  })
  

  const downloadExcel = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredExpenses.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        date:payments.date,
        person_Name:payments.name,
        expCategory:payments.expCategory,
        ExpAmount:payments.payment_Out,
        payment_Via:payments.payment_Via,
        payment_Type:payments.payment_Type,
        slip_No:payments.slip_No,
        details:payments.details,
        invoice:payments.invoice,
        Total:filteredExpenses.reduce((total, expense) => total + expense.payment_Out, 0)
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'expenses.xlsx');
  }

{/* <td>${String(entry?.curr_Country)}</td>
            <td>${String(entry?.curr_Rate)}</td>
            <td>${String(entry?.curr_Amount)}</td> */}
  const printExpenseTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Person</th>
        <th>E_Category</th>
        <th>E_Amount</th>
        <th>Payment_Via</th>
        <th>Payment_Type</th>
        <th>Slip_No</th>
        <th>Details</th>
        <th>Invoice</th>
        </tr>
      </thead>
      <tbody>
      ${filteredExpenses.map((entry, index) => `
          <tr key="${entry?._id}">
            <td>${index + 1}</td>
            <td>${String(entry?.date)}</td>
            <td>${String(entry?.name)}</td>
            <td>${String(entry?.expCategory)}</td>
            <td>${String(entry?.payment_Out)}</td>
            <td>${String(entry?.payment_Via)}</td>
            <td>${String(entry?.payment_Type)}</td>
            <td>${String(entry?.slip_No)}</td>
            <td>${String(entry?.details)}</td>
            <td>${String(entry?.invoice)}</td>
          </tr>
        `).join('')
      }
      <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>Total</td>
      <td>${String(filteredExpenses.reduce((total, expense) => total + expense.payment_Out, 0))}</td>
      </tr>
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
          <title>Expenses Details</title>
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


  const collapsed = useSelector((state) => state.collapsed.collapsed);
  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid payment_details">
          <div className="row">
            <div className="col-md-12">
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Expenses Details</h4>
                </div>
                <div className="right d-flex">
                  {filteredExpenses.length > 0 &&
                    <>
                      <button className='btn btn-sm m-1 bg-info text-white shadow' onClick={() => setShow(!show)}>{show === false ? "Show" : "Hide"}</button>
                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}>Download </button>
                      <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printExpenseTable}>Print </button>
                    </>
                  }
                </div>
              </Paper>
            </div>

            <div className="col-md-12 filters">
              <Paper className='py-1 mb-2 px-3'>
                <div className="row">
                <div className="col-auto px-1">
                  <label htmlFor="">Date From:</label>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className='m-0 p-1'/>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Date To:</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className='m-0 p-1'/>
                 
                </div>
                  <div className="col-auto px-1">
                    <label htmlFor="">Name:</label>
                    <select value={name} onChange={(e) => setName(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      {[...new Set(expenses && expenses.map(data => data.name))].map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      
                    </select>
                  </div>
                  <div className="col-auto px-1">
                    <label htmlFor="">Expense Category:</label>
                    <select value={expe_Category} onChange={(e) => setExpe_Category(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      {[...new Set(expenses && expenses.map(data => data.expCategory))].map(expCategory => (
                          <option key={expCategory} value={expCategory}>{expCategory}</option>
                        ))}
                    
                    </select>
                  </div>
                  <div className="col-auto px-1">
                    <label htmlFor="">Payment Via:</label>
                    <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      {[...new Set(expenses && expenses.map(data => data.payment_Via))].map(payment_Via => (
                          <option key={payment_Via} value={payment_Via}>{payment_Via}</option>
                        ))}
                     
                    </select>
                  </div>
                  <div className="col-auto px-1">
                    <label htmlFor="">Payment Type:</label>
                    <select value={payment_Type} onChange={(e) => setPayment_Type(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      {[...new Set(expenses && expenses.map(data => data.payment_Type))].map(payment_Type => (
                          <option key={payment_Type} value={payment_Type}>{payment_Type}</option>
                        ))}
                      
                    </select>
                  </div>
                  <div className="col-auto px-1">
                    <label htmlFor="">Cash Type:</label>
                    <select value={cash_Type} onChange={(e) => setCash_Type(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      <option value="cash">Cash</option>
                      <option value="banks">Banks</option>
                    </select>
                  </div>
                </div>
              </Paper>
            </div>

            <div className="col-md-12 detail_table my-2">

              <TableContainer component={Paper}  sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead className="thead">
                    <TableRow>
                      <TableCell className='label border'>SN</TableCell>
                      <TableCell className='label border'>Date</TableCell>
                      <TableCell className='label border'>Person</TableCell>
                      <TableCell className='label border'>E_Category</TableCell>
                      <TableCell className='label border'>E_Amount</TableCell>
                      <TableCell className='label border'>Payment_Via</TableCell>
                      <TableCell className='label border'>Payment_Type</TableCell>
                      <TableCell className='label border'>Slip_No</TableCell>
                      <TableCell className='label border'>Details</TableCell>
                      <TableCell className='label border'>Invoice</TableCell>
                    {show && <>
                      <TableCell className='label border'>CUR_Country</TableCell>
                      <TableCell className='label border'>CUR_Rate</TableCell>
                      <TableCell className='label border'>CUR_Amount</TableCell>
                    </>}
                      <TableCell className='label border'>Slip_Pic</TableCell>
                      <TableCell align='left' className='edw_label border' colSpan={1}>
                        Actions
                      </TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredExpenses
                      .map((expense, outerIndex) => (
                        // Map through the payment array
                        <React.Fragment key={outerIndex}>
                          <TableRow key={expense?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                            {editMode && editedRowIndex === outerIndex ? (
                              // Edit Mode
                              <>
                                <TableCell className='border data_td p-1 '>
                                  <input type='number' value={outerIndex + 1} readOnly />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='dateFrom' value={editedEntry.date} onChange={(e) => handleInputChange(e, 'dateFrom')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.name} onChange={(e) => handleInputChange(e, 'name')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <select value={editedEntry.expCategory} onChange={(e) => handleInputChange(e, 'expCategory')} required>
                                    <option value="">Choose</option>
                                    {expenseCategories && expenseCategories.map((data) => (
                                      <option key={data._id} value={data.category}>{data.category}</option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='number' min='0' value={editedEntry.payment_Out} onChange={(e) => handleInputChange(e, 'payment_Out')} />
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
                                  <input type='text' value={editedEntry.invoice} readonly />
                                </TableCell>
                                {show && <>
                                  <TableCell className='border data_td p-1 '>
                                  <select value={editedEntry.curr_Country} onChange={(e) => handleInputChange(e, 'curr_Country')} >
                                    <option value="">choose</option>
                                    {currCountries && currCountries.map((data) => (
                                      <option key={data._id} value={data.currCountry}>{data.currCountry}</option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='number' min='0' value={editedEntry.curr_Rate} onChange={(e) => handleInputChange(e, 'curr_Rate')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='number' min='0' value={editedEntry.curr_Amount} onChange={(e) => handleInputChange(e, 'curr_Amount')} />
                                </TableCell>
                                </>}
                                <TableCell className='border data_td p-1 '>
                                  <input type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'slip_Pic')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>



                                  <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button onClick={() => setEditMode(!editMode)} className='btn delete_btn'>Cancel</button>
                                    <button onClick={() => handleUpdateFrom()} className='btn save_btn' disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</button>

                                  </div>

                                </TableCell>
                              </>
                            ) : (
                              // Non-Edit Mode
                              <>
                                <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                <TableCell className='border data_td text-center'>{expense.date}</TableCell>
                                <TableCell className='border data_td text-center'>{expense.name}</TableCell>
                                <TableCell className='border data_td text-center'>{expense.expCategory}</TableCell>
                                <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{expense.payment_Out}</TableCell>
                                <TableCell className='border data_td text-center'>{expense.payment_Via}</TableCell>
                                <TableCell className='border data_td text-center'>{expense.payment_Type}</TableCell>
                                <TableCell className='border data_td text-center'>{expense?.slip_No}</TableCell>
                                <TableCell className='border data_td text-center'>{expense?.details}</TableCell>
                                <TableCell className='border data_td text-center'>{expense?.invoice}</TableCell>
                                {show &&
                                <>
                                <TableCell className='border data_td text-center'>{expense?.curr_Country}</TableCell>
                                <TableCell className='border data_td text-center'>{expense?.curr_Rate}</TableCell>
                                <TableCell className='border data_td text-center'>{expense?.curr_Amount}</TableCell>
                                </>
                                }
                                <TableCell className='border data_td text-center'>{expense.slip_Pic ? <img src={expense.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>
                                <TableCell className='border data_td text-center'>
                                  <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button onClick={() => handleEditClick(expense, outerIndex)} className='btn edit_btn'>Edit</button>
                                    <button className='btn delete_btn' onClick={() => deleteExpense(expense)} disabled={isLoading}>{isLoading ? "Deleting..." : "Delete"}</button>
                                  </div>
                                  
                                </TableCell>
                              </>
                            )}
                          </TableRow>

                       

                        </React.Fragment>
                      ))}
                         <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                            <TableCell className='border data_td text-center bg-success text-white'> {filteredExpenses.reduce((total, expense) => total + expense.payment_Out, 0)}</TableCell>    
                          </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
             
            </div>

          </div>
        </div>
      </div >
    </>
  )
}
