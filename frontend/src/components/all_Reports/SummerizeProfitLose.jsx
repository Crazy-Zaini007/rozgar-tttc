import React, { useState, useEffect,useRef } from 'react'
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import { toast } from 'react-toastify';
import {useDispatch,useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SyncLoader from 'react-spinners/SyncLoader'

export default function SummerizeProfitLose() {
  const dispatch = useDispatch();
  // getting data from redux store 

 // Submitting Form Data
 const apiUrl = process.env.REACT_APP_API_URL;
  
   const [, setNewMessage] = useState('')
 
   const [isLoading, setIsLoading] = useState(false)
 const [data,setData]=useState()
   const getData = async (expense) => {
     setIsLoading(true)
     try {
       const response = await fetch(`${apiUrl}/auth/reports/get/all/payments/date`, {
        
         headers: {
           'Content-Type': 'application/json',
           "Authorization": `Bearer ${user.token}`,
         }
       })
 
       const json = await response.json()
 
       if (!response.ok) {
         setNewMessage(toast.error(json.message));
         setIsLoading(false)
       }
       if (response.ok) {
         setData(json.data)
        console.log(data)
         setNewMessage(toast.success(json.message));
         setIsLoading(false)
        
       }
     }
     catch (error) {
       setIsLoading(false)
     }
   }

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

  // getting Data from DB
  const { user } = useAuthContext()
  const fetchData = async () => {
    try {
      // Use Promise.all to execute all promises concurrently
      await Promise.all([
        getData()

      ]);

    } catch (error) {
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
  }, [user, dispatch])


  
  // individual payments filters
  const [date, setDate] = useState('')
  const [date1, setDate1] = useState('')
  
  const filteredData =data && data.filter(data => {
    return (
      data.date.toLowerCase().includes(date.toLowerCase()) &&
      data.date.toLowerCase().includes(date1.toLowerCase())
 
    )
  })

  const printExpenseTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Total In</th>
        <th>Total out</th>
        <th>Profit</th>
        <th>Loss</th>
        </tr>
      </thead>
      <tbody>
      ${filteredData.map((entry, index) => `
          <tr key="${entry?._id}">
            <td>${index + 1}</td>
            <td>${String(entry?.date)}</td>
            <td>${String(entry?.total_payment_in)}</td>
            <td>${String(entry?.total_payment_out)}</td>
            <td>${String(entry?.total_payment_in)}</td>
            <td>${String(entry?.total_payment_out)}</td>
          </tr>
        `).join('')
      }
      <tr>
      
      <td></td>
      <td>Total</td>
      <td>${String(filteredData.reduce((total, entry) => total + entry.total_payment_in, 0))}</td>
      <td>${String(filteredData.reduce((total, entry) => total + entry.total_payment_out, 0))}</td>

      <td> Net Profit: ${filteredData && filteredData.length > 0 && 
        filteredData.reduce((total, entry) => {
          return total + parseFloat(entry.total_payment_in)
        }, 0).toFixed(2)}
      </td>
      <td> Net Loss: ${String(filteredData.reduce((total, expense) => total + expense.total_payment_out, 0))}</td>
      
    
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


  const downloadExcel = () => {
    const myData = [];
    // Iterate over entries and push all fields
    filteredData.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        date:payments.date,
        Total_In:payments.total_payment_in,
        Total_Out:payments.total_payment_out,
        Profit:payments.total_payment_in,
        Loss:payments.total_payment_out,

       
      };

      myData.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(myData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Profit/Lose.xlsx');
  };

 
  const collapsed = useSelector((state) => state.collapsed.collapsed);


  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid payment_details mt-3">
          <div className="row">
            <div className="col-md-12 p-0 border-0 border-bottom">
              <div className='py-2 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Summerize Profit/Loss Report</h4>
                </div>
                <div className="right d-flex">
                  {filteredData && filteredData.length > 0 &&
                    <>
                      {/* <button className='btn pdf_btn m-1 btn-sm' onClick={downloadPDF}><i className="fa-solid fa-file-pdf me-1 "></i>Download PDF </button> */}
                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}>Download </button>
                      <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printExpenseTable}>Print </button>
                    </>
                  }

                </div>
              </div>
            </div>

            <div className="col-md-12 filters">
              <div className='py-1 mb-2 '>
                <div className="row">
                  <div className="col-auto px-1">
                    <label htmlFor="">Date:</label>
                    <select value={date} onChange={(e) => setDate(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      {[...new Set(data && data.map(data => data.date))].map(dateValue => (
                        <option value={dateValue} key={dateValue}>{dateValue}</option>
                      ))}
                    </select>
                  </div>
                  {/* <div className="col-auto px-1">
                    <label htmlFor="">To Date:</label>
                    <select value={date1} onChange={(e) => setDate1(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      {[...new Set(data && data.map(data => data.date))].map(dateValue => (
                        <option value={dateValue} key={dateValue}>{dateValue}</option>
                      ))}
                    </select>
                  </div> */}
                 
                </div>
              </div>
            </div>
            {isLoading &&
            <div className='col-md-12 text-center my-4'>
              <SyncLoader color="#2C64C3" className='mx-auto' />
            </div>
          }
          {!isLoading && 
          <div className="col-sm-12 detail_table my-2 p-0">
          <TableContainer >
            <Table stickyHeader>
              <TableHead className="thead">
                <TableRow>
                  <TableCell className='label border text-center' style={{ width: '18.28%' }}>SN</TableCell>
                  <TableCell className='label border text-center' style={{ width: '18.28%' }}>Date</TableCell>
                  <TableCell className='label border text-center' style={{ width: '18.28%' }}>Total_IN</TableCell>
                  <TableCell className='label border text-center' style={{ width: '18.28%' }}>Total_OUT</TableCell>
                  <TableCell className='label border text-center' style={{ width: '18.28%' }}>PROFIT</TableCell>
                  <TableCell className='label border text-center' style={{ width: '18.28%' }}>LOSE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData && filteredData.map((data, outerIndex) => (
                  <TableRow key={data?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{outerIndex + 1}</TableCell>
                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{data.date}</TableCell>
                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                      <i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{data.total_payment_in}
                    </TableCell>
                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                      <i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{data.total_payment_out}
                    </TableCell>
                    <TableCell className='border data_td text-center text-white profit' style={{ width: '18.28%' }}>
                      <i className="fa-solid fa-arrow-down me-2 text-white text-bold "></i>{data.total_payment_in}
                    </TableCell>
                    <TableCell className='border data_td text-center text-white loss' style={{ width: '18.28%' }}>
                      <i className="fa-solid fa-arrow-up me-2 text-white text-bold "></i>{data.total_payment_out}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className='border data_td text-center bg-secondary text-white' style={{ width: '18.28%' }}></TableCell>
                  <TableCell className='border data_td text-center bg-secondary text-white' style={{ width: '18.28%' }}>Total</TableCell>
                  <TableCell className='border data_td text-center profit text-white' style={{ width: '18.28%' }}>
                    <i className="fa-solid fa-arrow-down me-2 text-white text-bold"></i>{filteredData && filteredData.reduce((total, data) => {
                      return total + data.total_payment_in;
                    }, 0)}
                  </TableCell>
                  <TableCell className='border data_td text-center loss text-white' style={{ width: '18.28%' }}>
                    <i className="fa-solid fa-arrow-up me-2 text-white text-bold"></i>{filteredData && filteredData.reduce((total, data) => {
                      return total + data.total_payment_out;
                    }, 0)}
                  </TableCell>
                  <TableCell className='border data_td text-center bg-success text-white' style={{ width: '18.28%' }}>
                    Net_Profit: 
                    {filteredData && filteredData.reduce((total, data) => {
                      return total + data.total_payment_in;
                    }, 0)}
                  </TableCell>
                  <TableCell className='border data_td text-center text-white bg-danger' style={{ width: '18.28%' }}>
                  Net_Loss: 
                    {filteredData && filteredData.reduce((total, data) => {
                      return total + data.total_payment_out;
                    }, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        
          }
           
            
          </div>
        </div>
      </div >
    </>
  )
}
