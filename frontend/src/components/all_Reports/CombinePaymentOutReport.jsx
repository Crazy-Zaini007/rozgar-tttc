import { React, useState, useEffect,useRef } from 'react'
import CashInHandHook from '../../hooks/cashInHandHooks/CashInHandHook'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import SyncLoader from 'react-spinners/SyncLoader'
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';

export default function CombinePaymentOutReports() {
  const [option, setOption] = useState(0)
  const [loading1, setLoading1] = useState(false)
  const { getOverAllPayments, overAllPayments } = CashInHandHook()

   // fteching Data from DB
   const fetchData = async () => {
    try {
      setLoading1(true)
      await getOverAllPayments();
      setLoading1(false)
    } catch (error) {
      setLoading1(false)
   
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


 
  const printPaymenOutMainTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
  <table class='print-table'>
    <thead>
      <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Name/PP#</th>
        <th>Type</th>
        <th>Category</th>
        <th>Payment Via</th>
        <th>Payment Type</th>
        <th>Slip No</th>
        <th>Cash Out</th>
        <th>Cash Retrun</th>
        <th>Details</th>
        <th>Invoice</th>
        
      </tr>
    </thead>
    <tbody>
      ${overAllPayments && overAllPayments 
        .filter(entry =>(entry.payment_Out>0 || entry.type.toLowerCase().includes('out')))
        .map((entry, index) => `
        <tr key="${entry?._id}">
          <td>${index + 1}</td>
          <td>${String(entry.date)}</td>       
          <td>${String(entry.supplierName)}/${String(entry?.pp_No)}</td>
          <td>${String(entry.type)}</td>
          <td>${String(entry.category)}</td>
          <td>${String(entry.payment_Via)}</td>
          <td>${String(entry.payment_Type)}</td>
          <td>${String(entry.slip_No)}</td>
          <td>${String(entry.payment_Out)}</td>
          <td>${String(entry.cash_Out)}</td>
          <td>${String(entry.details)}</td>
          <td>${String(entry.invoice)}</td>   
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
        <title>Payment_Out Details</title>
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


  const downloadPaymenOutExcel = () => {
    const filteredPaymentsOut = overAllPayments && overAllPayments .filter(payment => (payment.payment_Out>0 || payment.type.toLowerCase().includes('out')));

    const data = [];
    // Iterate over entries and push all fields
    filteredPaymentsOut.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date: payments.date,
        Supplier: (payments.supplierName) / (payments?.pp_No),
        Reference_Type: payments.type,
        Category: payments.category,
        Payment_Via: payments.payment_Via,
        Payment_Type: payments.payment_Type,
        Slip_No: payments.slip_No,
        Payment_Out: payments.payment_Out,
        Cash_Return: payments.cash_Out,
        Details: payments.details,
        Invoice: payments.invoice,
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Candidate Vise Payments Out Details.xlsx');
  }

  const [show, setShow] = useState(false)

  const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <div>
         <div className={`${collapsed ?"collapsed":"main"}`}>

        <div className="container-fluid payment_details mt-3">
            <div className="row">
                <div className="col-md-12 p-0 border-0 border-bottom">
                <div className='py-2 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Combined Payment Out Report</h4>
                </div>
                <div className="right d-flex">
              
                  {overAllPayments && overAllPayments.length > 0 &&
                    <>
                      {option===0 &&
                     <>
                     <button className='btn btn-sm m-1 bg-info text-white shadow border-0' onClick={() => setShow(!show)}>{show === false ? "Show" : "Hide"}</button>
                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadPaymenOutExcel}>Download </button>
                      <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printPaymenOutMainTable}>Print </button>
                     </>
                     }
                    </>
                  }

                </div>
              </div>
                </div>
                {loading1 &&
              <div className='col-md-12 text-center my-4'>
                <SyncLoader color="#2C64C3" className='mx-auto' />
              </div>
            }

{!loading1 &&
              <>
            
                {option === 0 &&
                  <div className='col-md-12 p-0'>
                    <div className='py-3 mb-1 px-1 detail_table'>
                      <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader >
                          <TableHead className="thead" >
                            <TableRow>
                              <TableCell className='label border'>SN</TableCell>
                              <TableCell className='label border'>Date</TableCell>
                              <TableCell className='label border'>Name/PP#</TableCell>
                              <TableCell className='label border'>Type</TableCell>
                              <TableCell className='label border'>Category</TableCell>
                              <TableCell className='label border'>Payment_Via</TableCell>
                              <TableCell className='label border'>Payment_Type</TableCell>
                              <TableCell className='label border'>Slip_No</TableCell>
                              <TableCell className='label border'>Cash_Out</TableCell>
                              <TableCell className='label border'>Cash_Return</TableCell>
                              {show && 
                           <>
                            <TableCell className='label border'>Curr_Rate</TableCell>
                            <TableCell className='label border'>Curr_Amount</TableCell>
                            <TableCell className='label border'>Payment_In_Curr</TableCell>
                           </>
                           }
                              <TableCell className='label border'>Details</TableCell>
                              <TableCell className='label border'>Invoice</TableCell>
                              <TableCell className='label border'>Slip_Pic</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {overAllPayments && overAllPayments.length > 0 ? overAllPayments.filter(cash => (cash.payment_Out>0 || cash.type.toLowerCase().includes('out'))).map((cash, outerIndex) => (
                              // Map through the payment array

                              <>
                                <TableRow key={cash?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                                  <>
                                    <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.date}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.supplierName}/{cash?.pp_No}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.type}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.category}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.payment_Via}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.payment_Type}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash?.slip_No}</TableCell>
                                    <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{cash.payment_Out}</TableCell>
                                    <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up text-warning text-bold"></i><i className="fa-solid fa-arrow-down me-2 text-warning text-bold"></i>{cash.cash_Out}</TableCell>
                                    {show &&
                                     <>
                                      <TableCell className='border data_td text-center'>{Math.round(cash?.curr_Rate||0)}</TableCell>
                                      <TableCell className='border data_td text-center'>{Math.round(cash?.curr_Amount||0)}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash?.payment_In_curr?cash?.payment_In_curr:cash?.payment_Out_curr}</TableCell>
                                     </>
                                     }
                                    <TableCell className='border data_td text-center'>{cash?.details}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash?.invoice}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.slip_Pic ? <img src={cash.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>
                                  </>

                                </TableRow>


                              </>

                            )) : <TableRow>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell className='data_td text-center'>Not_found</TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                            </TableRow>}

                            <TableRow>
                              <TableCell colSpan={7}></TableCell>
                              <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>

                              <TableCell className='border data_td text-center bg-danger text-white'>
                            
                            { overAllPayments && overAllPayments.length > 0 &&
                              overAllPayments
                                .filter(entry =>(entry.payment_Out||entry.payment_Out>0 || entry.type.toLowerCase().includes('out')))
                                .reduce((total, entry) => {
                                  return total + (entry.payment_Out || 0);
                                }, 0)}
                          </TableCell>
                          <TableCell className='border data_td text-center bg-warning text-white'>
                            {/* Calculate the total sum of cash_Out */}
                            { overAllPayments && overAllPayments.length > 0 &&
                              overAllPayments
                                .filter(entry =>(entry.payment_Out||entry.payment_Out>0 || entry.type.toLowerCase().includes('out')))
                                .reduce((total, entry) => {
                                  return total + (entry.cash_Out || 0);
                                }, 0)}
                          </TableCell>
                          {show &&
 <> 
 <TableCell className='border data_td text-center bg-info text-white'>
                            
 { overAllPayments && overAllPayments.length > 0 &&
   overAllPayments
     .filter(entry => (entry.payment_Out||entry.payment_Out>0 || entry.type.toLowerCase().includes('out')))
     .reduce((total, entry) => {
       return total + (entry.curr_Rate || 0);
     }, 0)}
</TableCell>
<TableCell className='border data_td text-center bg-info text-white'>
                            
 { overAllPayments && overAllPayments.length > 0 &&
   overAllPayments
     .filter(entry => (entry.payment_Out||entry.payment_Out>0 || entry.type.toLowerCase().includes('out')))
     .reduce((total, entry) => {
       return total + (entry.curr_Amount || 0);
     }, 0)}
</TableCell>
 
 </>
 }
 <TableCell className='border data_td text-center bg-secondary text-white'>
Remaining PKR= 
{(overAllPayments && overAllPayments.length > 0 && overAllPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In>0||entry.type.toLowerCase().includes('in')?entry.payment_In:0) || 0)); 
  }, 0))+(overAllPayments && overAllPayments.length > 0 && overAllPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In<1||entry.type.toLowerCase().includes('in')?entry.cash_Out:0) || 0)); 
  }, 0))-(overAllPayments && overAllPayments.length > 0 && overAllPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out>0||entry.type.toLowerCase().includes('out')?entry.payment_Out:0) || 0)); 
  }, 0))-(overAllPayments && overAllPayments.length > 0 && overAllPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out<1||entry.type.toLowerCase().includes('out')?entry.cash_Out:0) || 0)); 
  }, 0))}
</TableCell>
<TableCell className='border data_td text-center bg-secondary text-white'>
Remaining Curr= 
{(overAllPayments && overAllPayments.length > 0 && overAllPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In>0||entry.type.toLowerCase().includes('in')?entry.curr_Amount:0) || 0)); 
  }, 0))+(overAllPayments && overAllPayments.length > 0 && overAllPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In<1||entry.type.toLowerCase().includes('in')?entry.curr_Amount:0) || 0)); 
  }, 0))-(overAllPayments && overAllPayments.length > 0 && overAllPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out>0||entry.type.toLowerCase().includes('out')?entry.curr_Amount:0) || 0)); 
  }, 0))-(overAllPayments && overAllPayments.length > 0 && overAllPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out<1||entry.type.toLowerCase().includes('out')?entry.curr_Amount:0) || 0)); 
  }, 0))}
</TableCell>

                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                }
              </>
            }

            </div>
        </div>
      </div>
    </div>
  )
}
