import React, { useState, useEffect,useRef } from 'react';
import { useAuthContext } from '../../../hooks/userHooks/UserAuthHook';
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ClipLoader from 'react-spinners/ClipLoader'
import { useSelector } from 'react-redux';

export default function AzadAgentReports() {
  const { user } = useAuthContext();
  const [loading1, setLoading1] = useState(false)
  const[payments,setPayments]=useState('')
  const [show, setShow] = useState(false)
  const apiUrl = process.env.REACT_APP_API_URL;
  const getData = async () => {

    try {
      const response = await fetch(`${apiUrl}/auth/reports/get/azad/agents/reports`, {
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

  
  // Filtering the Enteries
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [type, setType] = useState('')
  const [supplier, setSupplier] = useState('')
  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')
  const [category, setCategory] = useState('')
  const [search1, setSearch1] = useState('')

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
    paymentItem.supplierName.toLowerCase().includes(supplier.toLowerCase()) &&
    paymentItem.payment_Via.toLowerCase().includes(payment_Via.toLowerCase()) &&
    paymentItem.payment_Type.toLowerCase().includes(payment_Type.toLowerCase()) &&
    paymentItem.category.toLowerCase().includes(category.toLowerCase()) &&
    (paymentItem.type.trim().toLowerCase().startsWith(search1.trim().toLowerCase())||
    paymentItem.slip_No?.trim().toLowerCase().startsWith(search1.trim().toLowerCase())||
    paymentItem.supplierName.trim().toLowerCase().startsWith(search1.trim().toLowerCase())||
    paymentItem.payment_Via?.trim().toLowerCase().startsWith(search1.trim().toLowerCase())||
    paymentItem.payment_Type?.trim().toLowerCase().startsWith(search1.trim().toLowerCase())||
    paymentItem.category?.trim().toLowerCase().startsWith(search1.trim().toLowerCase())||
    paymentItem.payment_Via?.trim().toLowerCase().startsWith(search1.trim().toLowerCase())||
    paymentItem.payment_Type?.trim().toLowerCase().startsWith(search1.trim().toLowerCase()))

  })

  const printExpenseTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Agents</th>
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
          <title>Agents Reports</title>
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
            Agents: payments.supplierName,
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
    XLSX.writeFile(wb, 'Azad Agents Reports.xlsx');
  };

  const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid payment_details mt-3">
            <div className="row">
            <div className='col-md-12 p-0 border-0 border-bottom'>
              <div className='py-2 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Azad Agents Payments Reports</h4>
                </div>
                <div className="right d-flex">
                  {filteredPayments.length > 0 &&
                    <>
                      <button className='btn btn-sm m-1 bg-info text-white shadow border-0' onClick={() => setShow(!show)}>{show === false ? "Show" : "Hide"}</button>
                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}><i className="fa-solid fa-file-excel me-1"></i>Download </button>
                      <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printExpenseTable}>Print </button>

                    </>
                  }
                </div>
              </div>
            </div>
            {loading1 &&
              <div className='col-md-12 text-center my-4'>
                <ClipLoader color="#2C64C3" className='mx-auto' />
              </div>
            }
         {payments && payments.length > 0 &&
              <div className="col-md-12 filters">
                <div className='py-1 mb-2 '>
                  <div className="row">
                  <div className="col-auto px-1">
                  <label htmlFor="">Serach Here:</label><br/>
                  <input type="search" value={search1} onChange={(e) => setSearch1(e.target.value)} className='m-0 p-1' />
                </div>
                  <div className="col-auto px-1">
                      <label htmlFor="">Date From:</label><br/>
                      <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Date To:</label><br/>
                      <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Payment Via:</label><br/>
                      <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.payment_Via))].map(typeValue => (
                          <option key={typeValue} value={typeValue}>{typeValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Payment Type:</label><br/>
                      <select value={payment_Type} onChange={(e) => setPayment_Type(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.payment_Type))].map(typeValue => (
                          <option key={typeValue} value={typeValue}>{typeValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Category:</label><br/>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.category))].map(typeValue => (
                          <option key={typeValue} value={typeValue}>{typeValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Agent Name:</label><br/>
                      <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.supplierName))].map(supplier => (
                          <option key={supplier} value={supplier}>{supplier}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Payment:</label><br/>
                      <select value={type} onChange={(e) => setType(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        <option value="in">Payment In</option>
                        <option value="out">Payment Out</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            }

            {!loading1 &&
            <div className='col-md-12 p-0'>
              <div className='py-3 mb-1 px-1 detail_table'>
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                  <TableHead>
                        <TableRow>
                          <TableCell className='label border '>SN</TableCell>
                          <TableCell className='label border'>Date</TableCell>
                          <TableCell className='label border'>Agents</TableCell>
                          <TableCell className='label border'>Type</TableCell>
                          <TableCell className='label border'>Category</TableCell>
                          <TableCell className='label border'>Payment Via</TableCell>
                          <TableCell className='label border'>Payment Type</TableCell>
                          <TableCell className='label border'>Slip No</TableCell>
                          <TableCell className='label border '>Cash In</TableCell>
                          <TableCell className='label border '>Cash Out</TableCell>
                          <TableCell className='label border '>Cash In Return</TableCell>
                          <TableCell className='label border '>Cash Out Return</TableCell>
                          {show &&
                            <>
                              <TableCell className='label border'>Curr Rate</TableCell>
                              <TableCell className='label border'>Curr Amount</TableCell>
                              <TableCell className='label border'>Payment In Curr</TableCell>
                            </>
                          }
                          <TableCell className='label border '>Candidates</TableCell>
                          <TableCell className='label border '>Details</TableCell>
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
                                <TableCell className='border data_td bg-warning text-white'>{entry?.type.toLowerCase().includes('in') && entry?.cash_Out}</TableCell>
                                <TableCell className='border data_td bg-warning text-white'>{entry?.type.toLowerCase().includes('out') && entry?.cash_Out}</TableCell>
                                {show &&
                              <>
                                <TableCell className='border data_td text-center'>{Math.round(entry?.curr_Rate || 0)}</TableCell>
                                <TableCell className='border data_td text-center'>{Math.round(entry?.curr_Amount || 0)}</TableCell>
                                <TableCell className='border data_td text-center'>{entry?.payment_In_curr ? entry?.payment_In_curr : entry?.payment_Out_curr}</TableCell>
                              </>
                            }
                                <TableCell className='border data_td text-center'>{entry?.payments&& entry.payments.map((data)=>(
                                      <span>{data.cand_Name}<br/></span>
                                    ))}
                                </TableCell>
                                <TableCell className='border data_td text-center'>{entry?.details}</TableCell>
                                    
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
                              return total + (entry.type.toLowerCase().includes('in') && entry.cash_Out || 0); // Use proper conditional check
                            }, 0)}
                          </TableCell>
                          <TableCell className='border data_td text-center bg-warning text-white'>
                            {/* Calculate the total sum of cash_Out */}
                            {filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
                              return total + (entry.type.toLowerCase().includes('out') && entry.cash_Out || 0); // Use proper conditional check
                            }, 0)}
                          </TableCell>
                          {show &&
                            <>
                              <TableCell className='border data_td text-center bg-info text-white'>

                                {filteredPayments && filteredPayments.length > 0 &&
                                  (filteredPayments
                                    .filter(entry => (entry.type.toLowerCase().includes('in')))
                                    .reduce((total, entry) => {
                                      return total + (entry.curr_Rate || 0);
                                    }, 0)) - (filteredPayments
                                      .filter(entry => (entry.type.toLowerCase().includes('out')))
                                      .reduce((total, entry) => {
                                        return total + (entry.curr_Rate || 0);
                                      }, 0))}
                              </TableCell>
                              <TableCell className='border data_td text-center bg-info text-white'>

                                {filteredPayments && filteredPayments.length > 0 &&
                                  (filteredPayments
                                    .filter(entry => (entry.type.toLowerCase().includes('in')))
                                    .reduce((total, entry) => {
                                      return total + (entry.curr_Amount || 0);
                                    }, 0)) - (filteredPayments
                                      .filter(entry => (entry.type.toLowerCase().includes('out')))
                                      .reduce((total, entry) => {
                                        return total + (entry.curr_Amount || 0);
                                      }, 0))}
                              </TableCell>

                            </>
                          }
</TableRow>

                      </TableBody>
                  </Table>
                </TableContainer>
                
              </div>
            </div>
            }
            </div>
        </div>
      </div>
    </>
  )
}
