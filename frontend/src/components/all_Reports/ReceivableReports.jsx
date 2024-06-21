import React, { useState, useEffect,useRef } from 'react';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook';
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import ClipLoader from 'react-spinners/ClipLoader'
import { useSelector } from 'react-redux';

export default function ReceivableReports() {
  const { user } = useAuthContext();
  const [loading1, setLoading1] = useState(false)
  const [loading, setLoading] = useState(false)

  const[payments,setPayments]=useState('')
  const[receivable,setReceivable]=useState('')
  const [option,setOption]=useState(0)

  const apiUrl = process.env.REACT_APP_API_URL;

  const getData = async () => {
    
    try {
      const response = await fetch(`${apiUrl}/auth/reports/get/all/persons`, {
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

  const getReceivableData = async () => {
    
    try {
      const response = await fetch(`${apiUrl}/auth/reports/get/net_receivable_reports`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        setReceivable(json.data)
     
      }
    } catch (error) {
     

    }
  }

  // fteching Data from DB
  const fetchData = async () => {
    try {
      setLoading1(true);
      setLoading(true);
      await getData();
      setLoading1(false);
     await getReceivableData()
     setLoading(false);

  
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
  const [trade, setTrade] = useState('')
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('')
  const [search1, setSearch1] = useState('')

  const [final_Status, setFinal_Status] = useState('')
  const [reference_Out, setReference_Out] = useState('')
  const[flight_Date,setFlight_Date]=useState('')
  const filteredEntries =payments && payments.filter(entry => {
    return (
      entry.trade?.toLowerCase().includes(trade.toLowerCase()) &&
      entry.company?.toLowerCase().includes(company.toLowerCase()) &&
      entry.country?.toLowerCase().includes(country.toLowerCase()) &&
      entry.final_Status?.toLowerCase().includes(final_Status.toLowerCase()) &&
      entry.type?.toLowerCase().includes(reference_Out.toLowerCase()) &&
      entry.flight_Date?.toLowerCase().includes(flight_Date.toLowerCase()) &&
      ( entry.trade?.trim().toLowerCase().startsWith(search1.toLowerCase()) ||
      entry.name?.trim().toLowerCase().startsWith(search1.toLowerCase()) ||
      entry.company?.trim().toLowerCase().startsWith(search1.toLowerCase()) ||
      entry.country?.trim().toLowerCase().startsWith(search1.toLowerCase()) ||
      entry.final_Status?.trim().toLowerCase().startsWith(search1.toLowerCase()) ||
      entry.type?.trim().toLowerCase().startsWith(search1.toLowerCase()) ||
      entry.flight_Date?.trim().toLowerCase().startsWith(search1.toLowerCase()) )
    )
  });

  
  const printExpenseTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Name</th>
        <th>PP No</th>
        <th>Country</th>
        <th>Company</th>
        <th>Trade</th>
        <th>Fly</th>
        <th>Final Status</th>
        <th>Reference Type</th>
        <th>Reference Name</th>
        <th>Rozgar Visa Price</th>
        <th>Cash In</th>
        <th>Receivable</th>

        </tr>
      </thead>
      <tbody>
      ${filteredEntries.map((entry, index) => `
          <tr key="${entry?._id}">
            <td>${index + 1}</td>
            <td>${String(entry?.name)}</td>
            <td>${String(entry?.pp_No)}</td>
            <td>${String(entry?.country)}</td>
            <td>${String(entry?.company)}</td>
            <td>${String(entry?.trade)}</td>
            <td>${String(entry?.flight_Date)}</td>
            <td>${String(entry?.final_Status)}</td>
            <td>${String(entry?.type)}</td>
            <td>${String(entry.supplierName===entry.name ? "/":entry.supplierName)}</td>
            <td>${String(entry?.visa_Price_In_PKR)}</td>
            <td>${String(entry?.total_In)}</td>
            <td>${String(entry.visa_Price_In_PKR-entry.total_In)}</td>
          </tr>
        `).join('')
      }
      <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>Total</td>
      <td>${String(filteredEntries.reduce((total, expense) => total + expense.visa_Price_In_PKR, 0))}</td>
      <td>${String(filteredEntries.reduce((total, expense) => total + expense.total_In, 0))}</td>
      
      <td>${filteredEntries && filteredEntries.length > 0 && 
        filteredEntries.reduce((total, entry) => {
          return total + parseFloat(entry.visa_Price_In_PKR) - parseFloat(entry.total_In)
        }, 0).toFixed(2)}
      </td>
    
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
          <title>Receivable Reports</title>
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
        name:payments.name,
        pp_No:payments.pp_No,
        Country:payments.country,
        Company:payments.company,
        Trade:payments.trade,
        Fly:payments.flight_Date,
        Final_Status:payments.final_Status,
        Reference_Type:payments.type,
        Reference_Name:payments.supplierName===payments.name ? "/":payments.supplierName,
        Rozgar_Visa_Price:payments.visa_Price_In_PKR,
        Total_Cash_In:payments.total_In,
        Receivable:payments.visa_Price_In_PKR-payments.total_In

      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Candidates Receivable Reports.xlsx');
  }

// Filtering Summerize Receivable

const[supplierName,setSupplierName]=useState('')
const[ref,setRef]=useState('')

const filteredSummerizePayments =receivable && receivable.filter(entry => {
  return (
    entry.supplierName.trim().toLowerCase().startsWith(supplierName.trim().toLowerCase()) &&
    entry.type.toLowerCase().includes(ref.toLowerCase())
  );
});


const printSummerizeTable = () => {
  // Convert JSX to HTML string
  const printContentString = `
  <table class='print-table'>
    <thead>
      <tr>
      <th>SN</th>
      <th>Name</th>
      <th>Ref Type</th>
      <th>Total Price</th>
      <th>Total Payment In</th>
      <th>Remaining PKR</th>
      </tr>
    </thead>
    <tbody>
    ${filteredSummerizePayments.map((entry, index) => `
        <tr key="${entry?._id}">
          <td>${index + 1}</td>
          <td>${String(entry?.supplierName)}</td>
          <td>${String(entry?.type)}</td>
          <td>${String(entry?.total_Price)}</td>
          <td>${String(entry?.total_Payment_In)}</td>
          <td>${String(entry?.remaining)}</td>
        </tr>
      `).join('')
    }
    <tr>
    <td></td>
    <td></td>
    <td>Total</td>
    <td>${String(filteredSummerizePayments.reduce((total, expense) => total + expense.total_Price, 0))}</td>
    <td>${String(filteredSummerizePayments.reduce((total, expense) => total + expense.total_Payment_In, 0))}</td>
    
    <td>${filteredSummerizePayments && filteredSummerizePayments.length > 0 && 
      filteredSummerizePayments.reduce((total, entry) => {
        return total + parseFloat(entry.remaining)
      }, 0).toFixed(2)}
    </td>
  
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
        <title>Receivable Summerize Reports</title>
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

const downloadSummerizeExcel = () => {
  const data = [];
  // Iterate over entries and push all fields
  filteredSummerizePayments.forEach((payments, index) => {
    const rowData = {
      SN: index + 1,
      Name:payments.supplierName,
      Ref_Type:payments.type,
      Total_Price:payments.total_Price,
      Total_Payment_In:payments.total_Payment_In,
      Remaining:payments.remaining,
    };

    data.push(rowData);
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'Receivable Summerize Reports.xlsx');
}


const collapsed = useSelector((state) => state.collapsed.collapsed);


return (
  <>
  <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid entry_details mt-3">
            <div className="row">
            <div className='col-md-12 p-0 border-0 border-bottom'>
              <div className='py-2 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Receivable Reports</h4> 
                  
                </div>
                <div className="right d-flex">
                <button className='btn m-1 btn-sm shadow border' style={option===0 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(0)}>Candidates</button>
                  <button className='btn m-1 btn-sm shadow border' style={option===1 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(1)}>All</button>
                  {filteredEntries.length > 0 &&
                    <>
                     {option===0 && <>
                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}><i className="fa-solid fa-file-excel me-1"></i>Download </button>
                      <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printExpenseTable}>Print </button>
                     </>}
                     

                    </>
                  }
                  {filteredSummerizePayments.length>0 &&
                  <>
                  {option===1 && <>
                    <button className='btn excel_btn m-1 btn-sm' onClick={downloadSummerizeExcel}><i className="fa-solid fa-file-excel me-1"></i>Download </button>
                    <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printSummerizeTable}>Print </button>
                   </>}
                  </>
                  }
                </div>
              </div>
            </div>
            
        {option===0 && 
        <>
        {loading1 &&
              <div className='col-md-12 text-center my-4'>
                <ClipLoader color="#2C64C3" className='mx-auto' />
              </div>
            }
         {payments && payments.length > 0 &&
              <div className="col-md-12 filters">
                <div className='py-1 mb-2'>
                  <div className="row">
                  <div className="col-auto px-1">
                  <label htmlFor="">Serach Here:</label>
                  <input type="search" value={search1} onChange={(e) => setSearch1(e.target.value)} className='m-0 p-1' />
                </div>
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
                          <TableCell className='label border'>SN</TableCell>
                          <TableCell className='label border'>Name</TableCell>
                          <TableCell className='label border'>PP#</TableCell>
                          <TableCell className='label border'>Country</TableCell>
                          <TableCell className='label border'>Company</TableCell>
                          <TableCell className='label border'>Trade</TableCell>
                          <TableCell className='label border'>Fly</TableCell>
                          <TableCell className='label border'>Final_Status</TableCell>
                          <TableCell className='label border'>Reference_Type</TableCell>
                          <TableCell className='label border'>Reference_Name</TableCell>
                          <TableCell className='label border'>Rozgar_Visa_Price</TableCell>
                          <TableCell className='label border'>Total_Cash_In</TableCell>
                          <TableCell className='label border '>Receivable</TableCell>



                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredEntries && filteredEntries.length>0 && filteredEntries.map((entry,index)=>(
                          <TableRow>
                                <TableCell className='border data_td  '>{index+1}</TableCell>
                                <TableCell className='border data_td  '>{entry.name}</TableCell>
                                <TableCell className='border data_td '>{entry.pp_No}</TableCell>
                                <TableCell className='border data_td '>{entry.country}</TableCell>
                                <TableCell className='border data_td  '>{entry.company}</TableCell>
                                <TableCell className='border data_td '>{entry.trade}</TableCell>
                                <TableCell className='border data_td  '>{entry.flight_Date}</TableCell>
                                <TableCell className='border data_td  '>{entry.final_Status}</TableCell>
                                <TableCell className='border data_td  '>{entry.type}</TableCell>
                                <TableCell className='border data_td text-center'>{entry.supplierName===entry.name ? "/":entry.supplierName}</TableCell>
                                <TableCell className='border data_td bg-primary text-white'>{entry.visa_Price_In_PKR}</TableCell>
                                <TableCell className='border data_td bg-success text-white'>{entry.total_In}</TableCell>
                                <TableCell className='border data_td bg-warning text-white'>{entry.visa_Price_In_PKR-entry.total_In}</TableCell>
                          </TableRow>
                        ))}
                         <TableRow>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
    <TableCell className='border data_td text-center bg-primary text-white'>
      {/* Calculate the total sum of visa_Price_In_PKR */}
      {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
        return total + parseFloat(entry.visa_Price_In_PKR);
      }, 0)}
    </TableCell>
    <TableCell className='border data_td text-center bg-success text-white'>
      {/* Calculate the total sum of visa_Price_In_PKR */}
      {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
        return total + parseFloat(entry.total_In);
      }, 0)}
    </TableCell>
   
    <TableCell className='border data_td text-center bg-warning text-white'>
      {/* Calculate the total sum of visa_Price_In_PKR */}
      {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
        return total + parseFloat(entry.visa_Price_In_PKR) - parseFloat(entry.total_In) 
      }, 0)}
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

        {option===1 && 
        <>
        {loading &&
              <div className='col-md-12 text-center my-4'>
                <ClipLoader color="#2C64C3" className='mx-auto' />
              </div>
            }
         {receivable && receivable.length > 0 &&
              <div className="col-md-12 filters">
                <Paper className='py-1 mb-2 px-3'>
                  <div className="row">
                    <div className="col-auto px-1">
                      <label htmlFor="">Search By Name:</label>
                      <input type="search" value={supplierName} onChange={(e) => setSupplierName(e.target.value)}/>
                      
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference:</label>
                      <select value={ref} onChange={(e) => setRef(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(receivable && receivable.map(data => data.type))].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Paper>
              </div>
            }

            {!loading &&
            <div className='col-md-12'>
              <Paper className='py-3 mb-1 px-2 detail_table'>
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                  <TableHead>
                        <TableRow>
                          <TableCell className='label border'>SN</TableCell>
                          <TableCell className='label border'>Name</TableCell>
                          <TableCell className='label border'>Ref_Type</TableCell>
                          <TableCell className='label border'>Total_Price</TableCell>
                          <TableCell className='label border'>Total_Payment_In</TableCell>
                          <TableCell className='label border'>Remaining_PKR</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredSummerizePayments && filteredSummerizePayments.length>0 && filteredSummerizePayments.map((entry,index)=>(
                          <TableRow>
                                <TableCell className='border data_td  '>{index+1}</TableCell>
                                <TableCell className='border data_td  '>{entry.supplierName}</TableCell>
                                <TableCell className='border data_td '>{entry.type}</TableCell>
                                <TableCell className='border data_td bg-primary text-white'>{entry.total_Price}</TableCell>
                                <TableCell className='border data_td  bg-success text-white'>{entry.total_Payment_In}</TableCell>
                                <TableCell className='border data_td bg-warning text-white'>{entry.remaining}</TableCell>
                                
                          </TableRow>
                        ))}
                         <TableRow>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
    <TableCell className='border data_td text-center bg-primary text-white'>
      {/* Calculate the total sum of visa_Price_In_PKR */}
      {filteredSummerizePayments && filteredSummerizePayments.length > 0 && filteredSummerizePayments.reduce((total, entry) => {
        return total + parseFloat(entry.total_Price);
      }, 0)}
    </TableCell>
    <TableCell className='border data_td text-center bg-success text-white'>
      {/* Calculate the total sum of visa_Price_In_PKR */}
      {filteredSummerizePayments && filteredSummerizePayments.length > 0 && filteredSummerizePayments.reduce((total, entry) => {
        return total + parseFloat(entry.total_Payment_In);
      }, 0)}
    </TableCell>
   
    <TableCell className='border data_td text-center bg-warning text-white'>
      {/* Calculate the total sum of visa_Price_In_PKR */}
      {filteredSummerizePayments && filteredSummerizePayments.length > 0 && filteredSummerizePayments.reduce((total, entry) => {
        return total + parseFloat(entry.remaining)
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
        }

            </div>
        </div>
      </div>
    </>
  )
}
