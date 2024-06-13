import React, { useState, useEffect,useRef } from 'react';
import { useAuthContext } from '../../../hooks/userHooks/UserAuthHook';
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SyncLoader from 'react-spinners/SyncLoader'

export default function TicketCandReports() {
  const { user } = useAuthContext();
  const [loading1, setLoading1] = useState(false)
  const[payments,setPayments]=useState('')
  const apiUrl = process.env.REACT_APP_API_URL;
  
  const getData = async () => {

    try {
      const response = await fetch(`${apiUrl}/auth/reports/get/ticket/candidates/reports`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        setPayments(json.data)
      // Dispatch the action with received data
      }
    } catch (error) {
     
    }
  }


  // fteching Data from DB
  const fetchData = async () => {
    try {
      setLoading1(true);
      // Fetch getEntries() separately to wait for its completion
      await getData();
      // Set loading to false right after getEntries() is completed
      setLoading1(false);
  
    } catch (error) {
      setLoading1(false);
      // Handle errors if needed
    }
  };
  
  const abortCont = useRef(new AbortController());

  useEffect(() => {

      fetchData()
      return () => {
        if (abortCont.current) {
          abortCont.current.abort(); 
        }
      }
  }, []);

  
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

  // Filtering the Enteries
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [type, setType] = useState('')
  const [supplier, setSupplier] = useState('')

  const filteredPayments = payments && payments.filter(paymentItem => {
    let isDateInRange = true;
    if (dateFrom && dateTo) {
      const paymentDate = new Date(paymentItem.date);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      isDateInRange = paymentDate >= fromDate && paymentDate <= toDate;
    }
    return isDateInRange &&
    paymentItem.type.toLowerCase().includes(type.toLowerCase())&&
    paymentItem.supplierName.toLowerCase().includes(supplier.toLowerCase())

  })

  const printExpenseTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Candidates</th>
        <th>Type</th>
        <th>Category</th>
        <th>Payment Via</th>
        <th>Payment Type</th>
        <th>Slip No</th>
        <th>Details</th>
        <th>Cash In</th>
        <th>Cash Out</th>
        <th>Cash Return</th>
        <th>Invoice</th>
        </tr>
      </thead>
      <tbody>
      ${filteredPayments.map((entry, index) => `
  <tr key="${entry?._id}">
    <td>${index + 1}</td>
    <td>${String(entry?.date)}</td>
    <td>${String(entry?.supplierName)}</td>
    <td>${String(entry?.type)}</td>
    <td>${String(entry?.category)}</td>
    <td>${String(entry?.payment_Via)}</td>
    <td>${String(entry?.payment_Type)}</td>
    <td>${String(entry.slip_No)}</td>
    <td>${String(entry.details)}</td>
    <td>${String(entry.payment_In || 0)}</td>
    <td>${String(entry.payment_Out || 0)}</td> 
    <td>${String(entry.cash_Out || 0)}</td> 
    <td>${String(entry.invoice)}</td>
  </tr>
`).join('')}

      
      <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>Total</td>
      <td>${String(filteredPayments.reduce((total, entry) => total + (entry.payment_In || 0), 0))}</td>
      <td>${String(filteredPayments.reduce((total, entry) => total + (entry.payment_Out || 0), 0))}</td>
      <td>${String(filteredPayments.reduce((total, entry) => total + (entry.cash_Out || 0), 0))}</td>
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
          <title>Candidates Reports</title>
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
    filteredPayments.forEach((payments, index) => {
        const rowData = {
            SN: index + 1,
            Date: payments.date,
            Candidates: payments.supplierName,
            Type: payments.type,
            Category: payments.category,
            Payment_Via: payments.payment_Via,
            Payment_Type: payments.payment_Type,
            Slip_No: payments.slip_No,
            Details: payments.details,
            Cash_In: payments.payment_In || 0,
            Cash_Out: payments.payment_Out || 0,
            Cash_Return: payments.cash_Out || 0,
            Invoice: payments.Invoice,
        };
        

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Candidates Reports.xlsx');
  };


  return (
    <>
     
            <div className='col-md-12 '>
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Ticket Candidates Payments Reports</h4>
                </div>
                <div className="right d-flex">
                  {filteredPayments.length > 0 &&
                    <>
                     
                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}><i className="fa-solid fa-file-excel me-1"></i>Download </button>
                      <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printExpenseTable}>Print </button>

                    </>
                  }
                </div>
              </Paper>
            </div>
            {loading1 &&
              <div className='col-md-12 text-center my-4'>
                <SyncLoader color="#2C64C3" className='mx-auto' />
              </div>
            }
         {payments && payments.length > 0 &&
              <div className="col-md-12 filters">
                <Paper className='py-1 mb-2 px-3'>
                  <div className="row">
                  <div className="col-auto px-1">
                      <label htmlFor="">Date From:</label>
                      <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Date To:</label>
                      <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Candidate Name:</label>
                      <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.supplierName))].map(supplier => (
                          <option key={supplier} value={supplier}>{supplier}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Type:</label>
                      <select value={type} onChange={(e) => setType(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.type))].map(typeValue => (
                          <option key={typeValue} value={typeValue}>{typeValue}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Paper>
              </div>
            }

            {!loading1 &&
            <div className='col-md-12'>
              <Paper className='py-3 mb-1 px-2 detail_table'>
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                  <TableHead>
                        <TableRow>
                          <TableCell className='label border '>SN</TableCell>
                          <TableCell className='label border'>Date</TableCell>
                          <TableCell className='label border'>Candidates</TableCell>
                          <TableCell className='label border'>Type</TableCell>
                          <TableCell className='label border'>Category</TableCell>
                          <TableCell className='label border'>Payment_Via</TableCell>
                          <TableCell className='label border'>Payment_Type</TableCell>
                          <TableCell className='label border'>Slip_No</TableCell>
                          <TableCell className='label border '>Cash_In</TableCell>
                          <TableCell className='label border '>Cash_Out</TableCell>
                          <TableCell className='label border '>Cash_Return</TableCell>
                          <TableCell className='label border '>Invoice</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredPayments && filteredPayments.length>0 ? filteredPayments.map((entry,index)=>(
                          <TableRow>
                                <TableCell className='border data_td  '>{index+1}</TableCell>
                                <TableCell className='border data_td  '>{entry.date}</TableCell>
                                <TableCell className='border data_td  '>{entry.supplierName}</TableCell>
                                <TableCell className='border data_td  '>{entry.type}</TableCell>
                                
                                <TableCell className='border data_td  '>{entry.category}</TableCell>
                                <TableCell className='border data_td '>{entry.payment_Via}</TableCell>
                                <TableCell className='border data_td '>{entry.payment_Type}</TableCell>
                                <TableCell className='border data_td '>{entry.slip_No}</TableCell>
                                <TableCell className='border data_td bg-success text-white'>{entry.payment_In}</TableCell>
                                <TableCell className='border data_td bg-danger text-white'>{entry.payment_Out}</TableCell>
                                <TableCell className='border data_td bg-warning text-white'>{entry.cash_Out}</TableCell>
                                <TableCell className='border data_td '>{entry.invoice}</TableCell>
                          
                          </TableRow>
                        )):
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>No_Data_found</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        }
                        <TableRow>
  <TableCell></TableCell>
  <TableCell></TableCell>
  <TableCell></TableCell>
  <TableCell></TableCell>
  <TableCell></TableCell>
  <TableCell></TableCell>
  <TableCell></TableCell>        
  <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
    <TableCell className='border data_td text-center bg-success text-white'>
    {/* Calculate the total sum of payment_In */}
    {filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
      return total + (entry.payment_In || 0); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-danger text-white'>
    {/* Calculate the total sum of payment_Out */}
    {filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
      return total + (entry.payment_Out || 0); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-warning text-white'>
    {/* Calculate the total sum of cash_Out */}
    {filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
      return total + (entry.cash_Out || 0); // Use proper conditional check
    }, 0)}
  </TableCell>
</TableRow>

                      </TableBody>
                  </Table>
                </TableContainer>
                
              </Paper>
            </div>
            }
            
    </>
  )
}
