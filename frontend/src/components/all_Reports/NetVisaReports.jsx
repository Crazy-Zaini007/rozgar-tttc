import React, { useState, useEffect,useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import SyncLoader from 'react-spinners/SyncLoader'
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook';
import { useSelector } from 'react-redux';

const NetVisaReports = () => {

  const { user } = useAuthContext();

  const [loading1, setLoading1] = useState(false)
const[show,setShow]=useState(false)
const[payments,setPayments]=useState('')
  const apiUrl = process.env.REACT_APP_API_URL;

  const getData = async () => {

    try {
      const response = await fetch(`${apiUrl}/auth/reports/get/visa_net_reports`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        setPayments(json.data)
    
      }
    } catch (error) {
     
    }
  }
  // fteching Data from DB
  const fetchData = async () => {
    try {
      setLoading1(true);

      await getData();
      
      setLoading1(false)

    } catch (error) {
      setLoading1(false);
      // Handle errors if needed
    }
  };
  

  

  const [section1, setSection1] = useState(false)
  const [section2, setSection2] = useState(false)
  const [section3, setSection3] = useState(false)
  const [section4, setSection4] = useState(false)


  
  // Filtering the Enteries
  const [date, setDate] = useState('')
  const [trade, setTrade] = useState('')
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('')
  const [search1, setSearch1] = useState('')
  const [final_Status, setFinal_Status] = useState('')
  const [entry_Mode, setEntry_Mode] = useState('')
  const [reference_Out, setReference_Out] = useState('')
  const [reference_In, setReference_In] = useState('')
  const [reference_Out_Type, setReference_Out_Type] = useState('')
  const [reference_In_Type, setReference_In_Type] = useState('')
  const [flight_Date, setFlight_Date] = useState('')
  
  const filteredEntries =payments && payments.filter(entry => {
    return (
      entry.trade?.toLowerCase().includes(trade.toLowerCase()) &&
      entry.company?.toLowerCase().includes(company.toLowerCase()) &&
      entry.country?.toLowerCase().includes(country.toLowerCase()) &&
      entry.final_Status?.toLowerCase().includes(final_Status.toLowerCase()) &&
      entry.flight_Date?.toLowerCase().includes(flight_Date.toLowerCase()) &&
      entry.reference_Out?.toLowerCase().includes(reference_Out.toLowerCase()) &&
      ( entry.trade?.trim().toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.company?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.pp_No?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.name?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.country?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.final_Status?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.flight_Date?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.reference_Out?.toLowerCase().startsWith(search1.trim().toLowerCase()))
    )
  })

  useEffect(() => {
    fetchData()
  
}, [date,trade,company,country,final_Status,entry_Mode,reference_Out,reference_In,reference_Out_Type,reference_In_Type,flight_Date]);

  const downloadExcel = () => {
    const data = [];

    // Iterate over entries and push all fields
    filteredEntries.forEach((entry, index) => {
      const rowData = {
        SN: index + 1,
        Name: entry.name,
        PP_NO: entry.pp_No,
        Trade: entry.trade,
        Company: entry.company,
        Remarks: entry.remarks,
        Contact: entry.contact,
        Visit_Sale_Party: entry.visit_Sales_Party,
        Final_Status: entry.final_Status,
        Flight_Date: entry.flight_Date,
        Country: entry.country,
        Entry_Mode: entry.entry_Mode,
        Visa_Sales_Rate_PKR: entry.visa_Sales_Rate_PKR,
        Visa_Sale_Rate_Oth_Cur: entry.visa_Sale_Rate_Oth_Cur,
        Reference_Out: entry.reference_Out,
        Reference_Out_Name: entry.reference_Out_Name,
        Reference_In: entry.reference_In,
        Reference_In_Name: entry.reference_In_Name,
        // Visit  Section 
        Visit_Sales_Party: entry.visit_Sales_Party,
        Visit_Purchase_Party: entry.visit_Purchase_Party,
        Visit_Sales_PKR: entry.visit_Sales_PKR,
        Visit_Sales_Cur: entry.visit_Sales_Cur,
        Visit_Purchase_Rate_PKR: entry.visit_Purchase_Rate_PKR,
        Visit_Purchase_Cur: entry.visit_Purchase_Cur,
        Visit_Reference_Out: entry.visit_Reference_Out,
        Visit_Reference_Out_Name: entry.visit_Reference_Out_Name,
        Visit_Reference_In: entry.visit_Reference_In,
        Visit_Reference_In_Name: entry.visit_Reference_In_Name,

        // Ticket Section
        Ticket_Sale_Party: entry.ticket_Sales_Party,
        Ticket_Purchase_Party: entry.ticket_Purchase_Party,
        Ticket_Sale_Rate_PKR: entry.ticket_Sales_PKR,
        Ticket_Sales_Cur: entry.ticket_Sales_Cur,
        Ticket_Purchase_PKR: entry.ticket_Purchase_PKR,
        Ticket_Purchase_Cur: entry.ticket_Purchase_Cur,
        Ticket_Reference_Out: entry.ticket_Reference_Out,
        Ticket_Reference_Out_Name: entry.ticket_Reference_Out_Name,
        Ticket_Reference_In: entry.ticket_Reference_In,
        Ticket_Reference_In_Name: entry.ticket_Reference_In_Name,


        // Azad Visa Section 
        Azad_Visa_Sale_Party: entry.azad_Visa_Sales_Party,
        Azad_Visa_Purchase_Party: entry.azad_Visa_Purchase_Party,
        Azad_Visa_Sale_Rate_PKR: entry.azad_Visa_Sales_PKR,
        Azad_Visa_Sales_Cur: entry.azad_Visa_Sales_Cur,
        Azad_Visa_Purchase_PKR: entry.azad_Visa_Purchase_PKR,
        Azad_Visa_Purchase_Cur: entry.azad_Visa_Purchase_Cur,
        Azad_Visa_Reference_Out: entry.azad_Visa_Reference_Out,
        Azad_Visa_Reference_Out_Name: entry.azad_Visa_Reference_Out_Name,
        Azad_Visa_Reference_In: entry.azad_Visa_Reference_In,
        Azad_Visa_Reference_In_Name: entry.azad_Visa_Reference_In_Name,

        // Add other fields for Section 3

        Protector_Price_In: entry.protector_Price_In,
        Protector_Price_In_Oth_Cur: entry.protector_Price_In_Oth_Cur,
        Protector_Price_Out: entry.protector_Price_Out,
        protector_Reference_In: entry.protector_Reference_In,
        Protector_Reference_In_Name: entry.protector_Reference_In_Name,
        // Payments Reports
        Visa_Profit: entry.visa_Sales_Rate_PKR-entry.visa_Purchase_Rate_PKR,
        Reference_Type: entry.type,
        Cash_In: entry.cash_In,
        Cash_Out: entry.cash_Out,
        Total_In: entry.total_In,
        Remaining: entry.remaining,
        Total_Payment_In_Curr:entry.total_Curr_In,
        Remaining_Curr:entry.remain_Curr


      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Entries.xlsx');
  };


  const collapsed = useSelector((state) => state.collapsed.collapsed);


  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className='container-fluid entry_details'>
          <div className='row'>
            <div className='col-md-12 '>
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Net Visa Reports</h4>
                </div>
                <div className="right d-flex">
                  {payments.length > 0 &&
                    <>
                      <button className='btn btn-info m-1 btn-sm shadow text-white' onClick={()=>setShow(!show)}>{show ?"Hide":"Show"} </button>
                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}><i className="fa-solid fa-file-excel me-1"></i>Download Excel </button>
                    </>
                  }

                  <div className="dropdown d-inline m-1">
                    <button className="btn" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                      View More
                    </button>
                    <ul className="dropdown-menu shadow border-0" aria-labelledby="dropdownMenuLink">
                      <li className='my-2 py-2' onClick={() => setSection1(!section1)}>{!section1 ? "Show" : "Hide"} Visit Section</li>
                      <li className='my-2 py-2' onClick={() => setSection2(!section2)}>{!section2 ? "Show" : "Hide"} Ticket Section</li>
                      <li className='my-2 py-2' onClick={() => setSection3(!section3)}>{!section3 ? "Show" : "Hide"} Azad Section</li>
                      <li className='my-2 py-2' onClick={() => setSection4(!section4)}>{!section4 ? "Show" : "Hide"} Protectors</li>
                    </ul>
                  </div>
                </div>
              </Paper>
            </div>
            {loading1 &&
              <div className='col-md-12 text-center my-4'>
                <SyncLoader color="#2C64C3" className='mx-auto' />
              </div>
            }


            {/* Filters */}
            {payments && payments.length > 0 &&
              <div className="col-md-12 filters">
                <Paper className='py-1 mb-2 px-3'>
                  <div className="row">
                  <div className="col-auto px-1">
                  <label htmlFor="">Serach Here:</label>
                  <input type="search" value={search1} onChange={(e) => setSearch1(e.target.value)} className='m-0 p-1' />
                </div>
                    <div className="col-auto px-1">
                      <label htmlFor="">Date:</label>
                      <select value={date} onChange={(e) => setDate(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.entry_Date))].map(dateValue => (
                          <option value={dateValue} key={dateValue}>{dateValue}</option>
                        ))}
                      </select>
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
                      <label htmlFor="">Entry Mode:</label>
                      <select value={entry_Mode} onChange={(e) => setEntry_Mode(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.entry_Mode))].map(entry_ModeValue => (
                          <option key={entry_ModeValue} value={entry_ModeValue}>{entry_ModeValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference Out:</label>
                      <select value={reference_Out} onChange={(e) => setReference_Out(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.reference_Out_Name))].map(reference_Out_NameValue => (
                          <option key={reference_Out_NameValue} value={reference_Out_NameValue}>{reference_Out_NameValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference In:</label>
                      <select value={reference_In} onChange={(e) => setReference_In(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(payments.map(data => data.reference_In_Name))].map(reference_In_NameValue => (
                          <option key={reference_In_NameValue} value={reference_In_NameValue}>{reference_In_NameValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference In Type:</label>
                      <select value={reference_In_Type} onChange={(e) => setReference_In_Type(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        <option value="agent">Agents</option>
                        <option value="supplier">Suppliers</option>
                        <option value="candidate">Candidates</option>
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference Out Type:</label>
                      <select value={reference_Out_Type} onChange={(e) => setReference_Out_Type(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        <option value="agent">Agents</option>
                        <option value="supplier">Suppliers</option>
                        <option value="candidate">Candidates</option>


                        
                      </select>
                    </div>

                  </div>
                </Paper>
              </div>
            }

            {!loading1 &&
              <div className='col-md-12'>
                <Paper className='py-3 mb-1 px-2 detail_table'>
                  <TableContainer sx={{ maxHeight: 1000 }}>
                    <Table stickyHeader>
                    <TableHead>
                        <TableRow className='p-0 m-0'>
                          <TableCell align="left" className='personel_label border py-2' colSpan={21}>
                            Personel Details
                          </TableCell>
                          <TableCell align="left" className='personel_label border py-2' colSpan={show ?8 :7}>
                              Payments Details
                            </TableCell>
                        
                          {section1 &&
                            <TableCell align="left" className='visit_label border py-2' colSpan={9}>
                              Visit Sales Purchase Details
                            </TableCell>
                          }
                          {section2 &&

                            <TableCell align="left" className='ticket_label border py-2' colSpan={9}>
                              Ticket Sales Purchase Details
                            </TableCell>
                          }
                          {section3 &&
                            <TableCell align="left" className='azad_label border py-2' colSpan={9}>
                              Azad Visa Sales Purchase Details
                            </TableCell>
                          }
                          {section4 &&
                            <TableCell align="left" className='protector_label border py-2' colSpan={5}>
                              Protector Details
                            </TableCell>
                          }
                           
                           
                        </TableRow>
                        <TableRow>
                          <TableCell className='label border'>SN</TableCell>
                          <TableCell className='label border'>Date</TableCell>
                          <TableCell className='label border'>Name</TableCell>
                          <TableCell className='label border'>PP#</TableCell>
                          <TableCell className='label border'>Trade</TableCell>
                          <TableCell className='label border'>Company</TableCell>
                          <TableCell className='label border'>Remarks</TableCell>
                          <TableCell className='label border'>Contact</TableCell>
                          <TableCell className='label border'>FS</TableCell>
                          <TableCell className='label border'>FD</TableCell>
                          <TableCell className='label border'>Country</TableCell>
                          <TableCell className='label border'>EM</TableCell>
                          <TableCell className='label border'>VSR_PKR</TableCell>
                          <TableCell className='label border'>VSR_Oth_Curr</TableCell>
                          <TableCell className='label border'>VPR_PKR</TableCell>
                          <TableCell className='label border'>VPR_Oth_Curr</TableCell>
                          <TableCell className='label border'>RO</TableCell>
                          <TableCell className='label border'>RO_Name</TableCell>
                          <TableCell className='label border'>RI</TableCell>
                          <TableCell className='label border'>RI_Name</TableCell>
                          <TableCell className='label border'>Picture</TableCell>
                          <TableCell className='label border'>Reference_Type</TableCell>
                          {show &&
                           <>
                          <TableCell className='label border'>Visa_Profit</TableCell>
                         
                           </>
                           }
                            <TableCell className='label border'>Cash_In</TableCell>
                          <TableCell className='label border'>Cash_Out</TableCell>
                          <TableCell className='label border'>Total_In</TableCell>
                          <TableCell className='label border'>Remaining</TableCell>
                          <TableCell className='label border'>Total_Payment_In_Curr</TableCell>
                          <TableCell className='label border'>Remaining_Curr</TableCell>
                          {section1 &&
                            <>
                              {/* Visit Sales Purchase Parties Section*/}
                              <TableCell className='label border'>VSR_PKR</TableCell>
                              <TableCell className='label border'>VSR_Cur</TableCell>
                              <TableCell className='label border'>VPR_PKR</TableCell>
                              <TableCell className='label border'>VPR_Curr</TableCell>
                              <TableCell className='label border'>RO</TableCell>
                              <TableCell className='label border'>RO_Name</TableCell>
                              <TableCell className='label border'>RI</TableCell>
                              <TableCell className='label border'>RI_Name</TableCell>
                              <TableCell className='label border'>Picture</TableCell>
                            </>
                          }

                          {section2 &&
                            <>
                              {/* Ticket Sales Purchase Parties Section*/}

                              <TableCell className='label border'>TSR_PKR</TableCell>
                              <TableCell className='label border'>TSR_Curr</TableCell>
                              <TableCell className='label border'>TPR_PKR</TableCell>
                              <TableCell className='label border'>TPR_Curr</TableCell>
                              <TableCell className='label border'>RO</TableCell>
                              <TableCell className='label border'>RO_Name</TableCell>
                              <TableCell className='label border'>RI</TableCell>
                              <TableCell className='label border'>RI_Name</TableCell>
                              <TableCell className='label border'>Picture</TableCell>

                            </>
                          }

                          {section3 &&
                            <>
                              {/* Azad Visa Sales Purchase Parties Section*/}
                              <TableCell className='label border'>AVSR_PKR</TableCell>
                              <TableCell className='label border'>AVSR_Curr</TableCell>
                              <TableCell className='label border'>AVPR_PKR</TableCell>
                              <TableCell className='label border'>AVPR_Curr</TableCell>
                              <TableCell className='label border'>RO</TableCell>
                              <TableCell className='label border'>RO_Name</TableCell>
                              <TableCell className='label border'>RI</TableCell>
                              <TableCell className='label border'>RI_Name</TableCell>
                              <TableCell className='label border'>Picture</TableCell>

                            </>
                          }


                          {section4 &&
                            <>
                              {/* Protector Section*/}
                              <TableCell className='label border'>PP_In</TableCell>
                              <TableCell className='label border'>PP_In_Curr</TableCell>
                              <TableCell className='label border'>RI</TableCell>
                              <TableCell className='label border'>RI_Name</TableCell>
                              <TableCell className='label border'>PP_Out</TableCell>

                            </>
                          }
                          
                        </TableRow>
                      </TableHead>


                      <TableBody>
                        {filteredEntries && filteredEntries.length > 0 ? filteredEntries.map((entry, index) => (
                          <TableRow key={entry._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                                <TableCell className='border data_td  '>{index+1}</TableCell>
                                <TableCell className='border data_td  '>{entry.entry_Date}</TableCell>
                                <TableCell className='border data_td  '>{entry.name}</TableCell>
                                <TableCell className='border data_td '>{entry.pp_No}</TableCell>
                                <TableCell className='border data_td '>{entry.trade}</TableCell>
                                <TableCell className='border data_td  '>{entry.company}</TableCell>
                                <TableCell className='border data_td '>{entry.remarks}</TableCell>
                                <TableCell className='border data_td  '>{entry.contact}</TableCell>
                                <TableCell className='border data_td  '>{entry.final_Status}</TableCell>
                                <TableCell className='border data_td  '>{entry.flight_Date}</TableCell>
                                <TableCell className='border data_td '>{entry.country}</TableCell>
                                <TableCell className='border data_td '>{entry.entry_Mode}</TableCell>
                                <TableCell className='border data_td '>{entry.visa_Sales_Rate_PKR}</TableCell>
                                <TableCell className='border data_td '>{entry.visa_Sale_Rate_Oth_Cur}</TableCell>
                                <TableCell className='border data_td '>{entry.visa_Purchase_Rate_PKR}</TableCell>
                                <TableCell className='border data_td '>{entry.visa_Purchase_Rate_Oth_Cur}</TableCell>
                                <TableCell className='border data_td '>{entry.reference_Out}</TableCell>
                                <TableCell className='border data_td '>{entry.reference_Out_Name}</TableCell>
                                <TableCell className='border data_td  '>{entry.reference_In}</TableCell>
                                <TableCell className='border data_td  '>{entry.reference_In_Name}</TableCell>
                                <TableCell className='border data_td text-center'>{entry.picture ? <img src={entry.picture} alt='Images' className='rounded text-center mx-auto' /> : "No Picture"}</TableCell>


                                <TableCell className='border data_td bg-primary text-white'>{entry.type}</TableCell>
                                {show &&
                                <>
                                 <TableCell className='border data_td bg-success text-white'>{entry.visa_Sales_Rate_PKR-entry.visa_Purchase_Rate_PKR}</TableCell>
                                   
                                </>
                                }
                                 <TableCell className='border data_td bg-success text-white'>{entry.cash_In}</TableCell>
                                    <TableCell className='border data_td bg-danger text-white'>{entry.cash_Out}</TableCell>
                                    <TableCell className='border data_td bg-warning text-white'>{entry.total_In}</TableCell>
                                    <TableCell className='border data_td bg-info text-white'>{entry.remaining}</TableCell>
                                    <TableCell className='border data_td bg-warning text-white'>{entry.total_Curr_In}</TableCell>
                                    <TableCell className='border data_td bg-info text-white'>{entry.remain_Curr}</TableCell>
                                {section1 &&
                                  <>
                                    <TableCell className='border data_td'>{entry.visit_Sales_PKR}</TableCell>
                                    <TableCell className='border data_td'>{entry.visit_Sales_Rate_Oth_Curr}</TableCell>
                                    <TableCell className='border data_td'>{entry.visit_Purchase_Rate_PKR}</TableCell>
                                    <TableCell className='border data_td'>{entry.visit_Purchase_Rate_Oth_Cur}</TableCell>
                                    <TableCell className='border data_td'>{entry.visit_Reference_Out}</TableCell>
                                    <TableCell className='border data_td'>{entry.visit_Reference_Out_Name}</TableCell>
                                    <TableCell className='border data_td'>{entry.visit_Reference_In}</TableCell>
                                    <TableCell className='border data_td'>{entry.visit_Reference_In_Name}</TableCell>
                                    <TableCell className='border data_td'>{entry.visit_Section_Picture ? <img src={entry.visit_Section_Picture} alt='Images' className='rounded' /> : "No Picture"}</TableCell>

                                  </>
                                }

                                {section2 &&
                                  <>
                                    {/* Ticket Sales Purchase Section Data */}
                                   
                                    <TableCell className='border data_td'>{entry.ticket_Sales_PKR}</TableCell>
                                    <TableCell className='border data_td'>{entry.ticket_Sales_Rate_Oth_Cur}</TableCell>
                                    <TableCell className='border data_td'>{entry.ticket_Purchase_PKR}</TableCell>
                                    <TableCell className='border data_td'>{entry.ticket_Purchase_Rate_Oth_Cur}</TableCell>
                                    <TableCell className='border data_td'>{entry.ticket_Reference_Out}</TableCell>
                                    <TableCell className='border data_td'>{entry.ticket_Reference_Out_Name}</TableCell>
                                    <TableCell className='border data_td'>{entry.ticket_Reference_In}</TableCell>
                                    <TableCell className='border data_td'>{entry.ticket_Reference_In_Name}</TableCell>
                                    <TableCell className='border data_td'>{entry.ticket_Section_Picture ? <img src={entry.ticket_Section_Picture} alt='Images' className='rounded' /> : "No Picture"}</TableCell>

                                  </>
                                }

                                {section3 &&
                                  <>
                                    {/* Azad Visa Sales Purchase Section Data */}
                                  
                                    <TableCell className='border data_td'>{entry.azad_Visa_Sales_PKR}</TableCell>
                                    <TableCell className='border data_td'>{entry.azad_Visa_Sales_Rate_Oth_Cur}</TableCell>
                                    <TableCell className='border data_td'>{entry.azad_Visa_Purchase_PKR}</TableCell>
                                    <TableCell className='border data_td'>{entry.azad_Visa_Purchase_Rate_Oth_Cur}</TableCell>
                                    <TableCell className='border data_td'>{entry.azad_Visa_Reference_Out}</TableCell>
                                    <TableCell className='border data_td'>{entry.azad_Visa_Reference_Out_Name}</TableCell>
                                    <TableCell className='border data_td'>{entry.azad_Visa_Reference_In}</TableCell>
                                    <TableCell className='border data_td'>{entry.azad_Visa_Reference_In_Name}</TableCell>
                                    <TableCell className='border data_td'>{entry.azad_Visa_Section_Picture ? <img src={entry.azad_Visa_Section_Picture} alt='Images' className='rounded' /> : "No Picture"}</TableCell>

                                  </>
                                }

                                {section4 &&
                                  <>
                                    {/* Protector Section Data */}
                                    <TableCell className='border data_td'>{entry.protector_Price_In}</TableCell>
                                    <TableCell className='border data_td'>{entry.protector_Price_In_Oth_Cur}</TableCell>
                                    <TableCell className='border data_td'>{entry.protector_Reference_In}</TableCell>
                                    <TableCell className='border data_td'>{entry.protector_Reference_In_Name}</TableCell>
                                    <TableCell className='border data_td'>{entry.protector_Price_Out}</TableCell>
                                  </>
                                }
                               
                          </TableRow>
                        )) :
                        <TableRow>
                                    <TableCell className='border data_td'>No_Entry_Found</TableCell>

                        </TableRow>
                        }
                        <TableRow>
                          <TableCell colSpan={21}></TableCell>
                          <TableCell className='border data_td bg-secondary text-white'>Total</TableCell>
                          {show &&
                          <TableCell className='border data_td text-center bg-success text-white'>
                          {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
                            return total + (entry.visa_Sales_Rate_PKR || 0) +(entry.visa_Purchase_Rate_PKR || 0); 
                          }, 0)}
                        </TableCell>
                          }
                          <TableCell className='border data_td text-center bg-success text-white'>
    {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
      return total + (entry.cash_In || 0); 
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-danger text-white'>
    {/* Calculate the total sum of payment_Out */}
    {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
      return total + (entry.cash_Out || 0); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-warning text-white'>
    {/* Calculate the total sum of cash_Out */}
    {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
      return total + (entry.total_In || 0); 
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-info text-white'>
    {/* Calculate the total sum of cash_Out */}
    {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
      return total + (entry.remaining || 0); 
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-warning text-white'>
    {/* Calculate the total sum of cash_Out */}
    {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
      return total + (entry.total_Curr_In || 0); 
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-info text-white'>
    {/* Calculate the total sum of cash_Out */}
    {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
      return total + (entry.remain_Curr || 0); 
    }, 0)}
  </TableCell>
                        </TableRow>
                      </TableBody>

                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            }
          </div>
        </div>
      </div >
    </>
  );
};

export default NetVisaReports;
