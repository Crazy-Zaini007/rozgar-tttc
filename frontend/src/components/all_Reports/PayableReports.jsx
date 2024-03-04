import React, { useState, useEffect,useRef } from 'react';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook';
import { useSelector, useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import SyncLoader from 'react-spinners/SyncLoader'

export default function PayableReports() {
  const { user } = useAuthContext();
  const [loading1, setLoading1] = useState(false)
  const[payments,setPayments]=useState('')
  const getData = async () => {
    
    try {
      const response = await fetch('/auth/reports/get/all/persons', {
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
  

  useEffect(() => {

      fetchData()
    
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
  const [trade, setTrade] = useState('')
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('')
  // const [flight_Date,, setFlight_Date] = useState('')
  const [final_Status, setFinal_Status] = useState('')
  const [reference_Out, setReference_Out] = useState('')
  const[flight_Date,setFlight_Date]=useState('')
  const filteredEntries =payments && payments.filter(entry => {
    return (
      entry.trade.toLowerCase().includes(trade.toLowerCase()) &&
      entry.company.toLowerCase().includes(company.toLowerCase()) &&
      entry.country.toLowerCase().includes(country.toLowerCase()) &&
      entry.final_Status.toLowerCase().includes(final_Status.toLowerCase()) &&
      entry.type.toLowerCase().includes(reference_Out.toLowerCase()) &&
      entry.flight_Date.toLowerCase().includes(flight_Date.toLowerCase()) 
    );
  });

  
  const printExpenseTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Reference</th>
        <th>Name</th>
        <th>PPNo</th>
        <th>Visa Amount PKR</th>
        <th>Paid PKR</th>
        <th>Payable PKR</th>
        <th>Visa Amount Currency</th>
        <th>Paid Currency</th>
        <th>Payable Currency</th>
        </tr>
      </thead>
      <tbody>
      ${filteredEntries.map((entry, index) => `
          <tr key="${entry?._id}">
            <td>${index + 1}</td>
            <td>${String(entry?.type)}</td>
            <td>${String(entry?.name)}</td>
            <td>${String(entry?.pp_No)}</td>
            <td>${String(entry?.visa_Price_In_PKR)}</td>
            <td>${String(entry?.total_In)}</td>
            <td>${String(entry.visa_Price_In_PKR-entry.total_In)}</td>
            <td>${String(entry.visa_Price_In_Curr)}</td>
            <td>${String(entry.visa_Price_In_Curr-entry.remaining_Curr)}</td>
            <td>${String(entry.remaining_Curr)}</td>
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
          <title>Overall Payment Visa Wise Report</title>
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
    filteredEntries.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        date:payments.date,
        Reference:payments.type,
        name:payments.name,
        pp_No:payments.pp_No,
        visa_Price_In_PKR:payments.visa_Price_In_PKR,
        Paid_PKR:payments.total_In,
        Payable_PKR:payments.visa_Price_In_PKR-payments.total_In,
        Visa_Amount_Curr:payments.visa_Price_In_Curr,
        Paid_Curr:payments.visa_Price_In_Curr-payments.remaining_Curr,
        Payable_Curr:payments.remaining_Curr
      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Payable Reports.xlsx');
  };


  return (
    <>
      <div className="main">
        <div className="container-fluid entry_details">
            <div className="row">
            <div className='col-md-12 '>
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Payable Reports</h4>
                </div>
                <div className="right d-flex">
                  {filteredEntries.length > 0 &&
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
                      <label htmlFor="">Trade:</label>
                      <select value={trade} onChange={(e) => setTrade(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.trade))].map(tradeValue => (
                          <option key={tradeValue} value={tradeValue}>{tradeValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Company:</label>
                      <select value={company} onChange={(e) => setCompany(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.company))].map(companyValue => (
                          <option key={companyValue} value={companyValue}>{companyValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Country:</label>
                      <select value={country} onChange={(e) => setCountry(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.country))].map(countryValue => (
                          <option key={countryValue} value={countryValue}>{countryValue}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-auto px-1 ">
                      <label htmlFor="">Final Status:</label>
                      <select value={final_Status} onChange={(e) => setFinal_Status(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.final_Status))].map(final_StatusValue => (
                          <option key={final_StatusValue} value={final_StatusValue}>{final_StatusValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Flight Date:</label>
                      <select value={flight_Date} onChange={(e) => setFlight_Date(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.flight_Date))].map(flight_DateValue => (
                          <option key={flight_DateValue} value={flight_DateValue}>{flight_DateValue}</option>
                        ))}
                      </select>
                    </div>
                 
                    
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference:</label>
                      <select value={reference_Out} onChange={(e) => setReference_Out(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        <option value="Candidate">Direct/Candidate</option>
                        <option value="Agent">Agents</option>
                        <option value="Supplier">Suppliers</option>
                        
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
                          <TableCell className='label border'>SN</TableCell>
                          <TableCell className='label border'>Reference</TableCell>
                          <TableCell className='label border'>Name/PP#</TableCell>
                          <TableCell className='label border'>Visa_Amount_PKR</TableCell>
                          <TableCell className='label border'>Paid_PKR</TableCell>
                          <TableCell className='label border'>Payable_PKR</TableCell>
                          <TableCell className='label border '>Visa_Amount_Curr</TableCell>
                          <TableCell className='label border '>Paid_Curr</TableCell>
                          <TableCell className='label border '>Payable_Curr</TableCell>



                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredEntries && filteredEntries.length>0 && filteredEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry,index)=>(
                          <TableRow>
                                <TableCell className='border data_td  '>{index+1}</TableCell>
                                <TableCell className='border data_td  '>{entry.type}</TableCell>
                                <TableCell className='border data_td  '>{entry.name}/{entry.pp_No}</TableCell>
                                <TableCell className='border data_td '>{entry.visa_Price_In_PKR}</TableCell>
                                <TableCell className='border data_td bg-success text-white'>{entry.total_In}</TableCell>
                                <TableCell className='border data_td bg-danger text-white'>{entry.visa_Price_In_PKR-entry.total_In}</TableCell>
                                <TableCell className='border data_td bg-warning text-white'>{entry.visa_Price_In_Curr}</TableCell>
                                <TableCell className='border data_td bg-warning text-white'>{entry.visa_Price_In_Curr-entry.remaining_Curr}</TableCell>
                                <TableCell className='border data_td bg-warning text-white'>{entry.remaining_Curr}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component='div'
                    count={filteredEntries.length}
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
            </div>
        </div>
      </div>
    </>
  )
}
