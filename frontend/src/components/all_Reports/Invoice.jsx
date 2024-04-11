import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import CashInHandHook from '../../hooks/cashInHandHooks/CashInHandHook'
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import SyncLoader from 'react-spinners/SyncLoader'
import { useSelector } from 'react-redux';

export default function Invoice() {
  

  const {getOverAllPayments,overAllPayments}=CashInHandHook()

  // getting Data from DB

  const [loading, setLoading] = useState(null)
  const [, setNewMessage] = useState('')



  const { user } = useAuthContext()
  const fetchData = async () => {
    try {
        setLoading(true)
    await getOverAllPayments()
    setLoading(false)
        

    } catch (error) {
    setLoading(false)

    }
  };

  useEffect(() => {
    fetchData()
  }, [])


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


  const [option, setOption] = useState(0)
  const [current, setCurrent] = useState(0)




  const [date2, setDate2] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [category2, setCategory2] = useState('')
  const [payment_Via2, setPayment_Via2] = useState('')
  const [payment_Type2, setPayment_Type2] = useState('')

  const filteredPayment = overAllPayments
  ? overAllPayments.filter((paymentItem) =>
      paymentItem.category.toLowerCase().includes(category2.toLowerCase()) &&
      paymentItem.date.toLowerCase().includes(date2.toLowerCase()) &&
      paymentItem.supplierName.toLowerCase().includes(supplierName.toLowerCase()) &&
      paymentItem.payment_Via.toLowerCase().includes(payment_Via2.toLowerCase()) &&
      paymentItem.payment_Type.toLowerCase().includes(payment_Type2.toLowerCase())
    )
  : [];



  const printOverAllCashTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Supp/Agent/Cand</th>
        <th>Type</th>
        <th>Category</th>
        <th>Payment_Via</th>
        <th>Payment_Type</th>
        <th>Slip_No</th>
        <th>Details</th>
        <th>Cash_In</th>
        <th>Cash_Out</th>
        <th>Cash_Return</th>
        <th>Invoice</th>
        </tr>
      </thead>
      <tbody>
      ${filteredPayment.map((entry, index) => `
          <tr key="${entry?._id}">
            <td>${index + 1}</td>
            <td>${String(entry?.date)}</td>
            <td>${String(entry?.supplierName)}</td>
            <td>${String(entry?.type)}</td>
            <td>${String(entry?.category)}</td>
            <td>${String(entry?.payment_Via)}</td>
            <td>${String(entry?.payment_Type)}</td>
            <td>${String(entry?.slip_No)}</td>
            <td>${String(entry?.details)}</td>
            <td>${String(entry?.payment_In)}</td>
            <td>${String(entry?.payment_Out)}</td>
            <td>${String(entry?.cash_Out)}</td>
            <td>${String(entry?.invoice)}</td>
          </tr>
        `).join('')
      }
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
          <title>Invoice Details</title>
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
  const downloadOverAllExcel = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredPayment.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        date:payments.date,
        supplierName:payments.supplierName,
        Reference_Type:payments.type,
        category:payments.category,
        payment_Via:payments.payment_Via,
        payment_Type:payments.payment_Type,
        slip_No:payments.slip_No,
        Cash_In:payments.payment_In,
        Cash_Out:payments.payment_Out,
        Cash_Return:payments.cash_Out,
        details:payments.details,
        invoice:payments.invoice,
      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'cashInHand.xlsx');
  };

  const collapsed = useSelector((state) => state.collapsed.collapsed);


  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid py-2 cash_in_hand">
          


          {/* Showing Data for Cash in hand */}
          {current === 0 &&
            <div className="row">

              <div className='col-md-12 payment_details'>
                <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                  <div className="left d-flex">
                    <h4>Search Invoice</h4>
                  </div>
                  <div className="right">
                  
                      {option === 0 &&
                      <>
                        <button className='btn excel_btn m-1 btn-sm' onClick={downloadOverAllExcel}>Download </button>
                        <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printOverAllCashTable}>Print </button>
                      </>
                    }
                   

                  </div>
                </Paper>
              </div>

              {loading &&
            <div className='col-md-12 text-center my-4'>
              <SyncLoader color="#2C64C3" className='mx-auto' />
            </div>
          }
              {option === 0 &&
                <div className="col-md-12 payment_details">
                  <div className='row'>
                  <div className="col-md-12 filters">
                      <Paper className='py-1 mb-2 px-3'>
                        <div className="row">
                          <div className="col-auto px-1">
                            <label htmlFor="">Date:</label>
                            <select value={date2} onChange={(e) => setDate2(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.date))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="col-auto px-1">
                            <label htmlFor="">Supp/Agent/Cand:</label>
                            <select value={supplierName} onChange={(e) => setSupplierName(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.supplierName))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-auto px-1">
                            <label htmlFor="">Category:</label>
                            <select value={category2} onChange={(e) => setCategory2(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.category))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-auto px-1">
                            <label htmlFor="">Payment Via:</label>
                            <select value={payment_Via2} onChange={(e) => setPayment_Via2(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.payment_Via))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-auto px-1">
                            <label htmlFor="">Payment Type:</label>
                            <select value={payment_Type2} onChange={(e) => setPayment_Type2(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.payment_Type))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </Paper>
                    </div>


                    <div className="col-md-12 detail_table my-2">

                      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                          <TableHead className="thead">
                            <TableRow>
                              <TableCell className='label border'>SN</TableCell>
                              <TableCell className='label border'>Date</TableCell>
                              <TableCell className='label border'>Supp/Agent/Cand</TableCell>
                              <TableCell className='label border'>Type</TableCell>
                              <TableCell className='label border'>Category</TableCell>
                              <TableCell className='label border'>Payment_Via</TableCell>
                              <TableCell className='label border'>Payment_Type</TableCell>
                              <TableCell className='label border'>Slip_No</TableCell>
                              <TableCell className='label border'>Cash_In</TableCell>
                              <TableCell className='label border'>Cash_Out</TableCell>
                              <TableCell className='label border'>Cash_Return</TableCell>
                              <TableCell className='label border'>Details</TableCell>
                              <TableCell className='label border'>Invoice</TableCell>
                              <TableCell className='label border'>Slip_Pic</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredPayment
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cash, outerIndex) => (
                                // Map through the payment array
                                <React.Fragment key={outerIndex}>
                                  <TableRow key={cash?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                                   
                                      <>
                                        <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.date}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.supplierName}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.type}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.category}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.payment_Via}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.payment_Type}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash?.slip_No}</TableCell>
                                        <TableCell className='border data_td text-center bg-success  text-white'><i className="fa-solid fa-arrow-down me-2 text-white text-bold"></i>{cash.payment_In}</TableCell>
                                        <TableCell className='border data_td text-center bg-danger  text-white'><i className="fa-solid fa-arrow-up me-2 text-white text-bold"></i>{cash.payment_Out}</TableCell>
                                        <TableCell className='border data_td text-center bg-warning  text-white'><i className="fa-solid fa-arrow-up me-2 text-white text-bold"></i><i className="fa-solid fa-arrow-down me-2 text-white text-bold"></i>{cash.cash_Out}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash?.details}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash?.invoice}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.slip_Pic ? <img src={cash.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>
                                       
                                      </>
                                  
                                  </TableRow>

                                </React.Fragment>
                              ))}
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
    {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
      return total + (entry.payment_In || 0); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-danger text-white'>
    {/* Calculate the total sum of payment_Out */}
    {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
      return total + (entry.payment_Out || 0); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-warning text-white'>
    {/* Calculate the total sum of cash_Out */}
    {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
      return total + (entry.cash_Out || 0); // Use proper conditional check
    }, 0)}
  </TableCell>
                            
                          </TableRow>
                          
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={rowsPerPageOptions}
                        component='div'
                        count={filteredPayment.length}
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
                    </div>
                  </div>
                </div>
              }

            </div>
          }

        
        </div>
      </div>

    </>
  )
}
