import React, { useState, useEffect,useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import SyncLoader from 'react-spinners/SyncLoader'
import EntryHook from '../../hooks/entryHooks/EntryHook';
import { useSelector } from 'react-redux';

const OverAllVisaProfitReports = () => {

  const enteries = useSelector((state) => state.enteries.enteries);
  const { getEntries } = EntryHook();

const [loading1, setLoading1] = useState(false)
const[show,setShow]=useState(false)

  // fteching Data from DB
  const fetchData = async () => {
    try {
      setLoading1(true);

      await getEntries();
      
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
  
  const filteredEntries =enteries && enteries.filter(entry => {
    return (
      entry.entry_Date?.toLowerCase().includes(date.toLowerCase()) &&
      entry.trade?.toLowerCase().includes(trade.toLowerCase()) &&
      entry.company?.toLowerCase().includes(company.toLowerCase()) &&
      entry.country?.toLowerCase().includes(country.toLowerCase()) &&
      entry.final_Status?.toLowerCase().includes(final_Status.toLowerCase()) &&
      entry.flight_Date?.toLowerCase().includes(flight_Date.toLowerCase()) &&
      entry.entry_Mode?.toLowerCase().includes(entry_Mode.toLowerCase()) &&
      entry.reference_Out_Name?.toLowerCase().includes(reference_Out.toLowerCase()) &&
      entry.reference_In_Name?.toLowerCase().includes(reference_In.toLowerCase()) &&
      entry.reference_Out?.toLowerCase().includes(reference_Out_Type.toLowerCase()) &&
      entry.reference_In?.toLowerCase().includes(reference_In_Type.toLowerCase()) &&
      ( entry.trade?.trim().toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.company?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.pp_No?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.name?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.country?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.final_Status?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.flight_Date?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.reference_Out_Name?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.reference_In_Name?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.reference_In?.toLowerCase().startsWith(search1.trim().toLowerCase()) ||
      entry.reference_Out?.toLowerCase().startsWith(search1.trim().toLowerCase()))
    )
  })

  useEffect(() => {
    fetchData()
  
}, []);

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
        Visa_Profit: entry.visa_Sales_Rate_PKR-entry.visa_Purchase_Rate_PKR,

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
        Visit_Profit: entry.visit_Sales_PKR-entry.visit_Purchase_Rate_PKR,

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
        Ticket_Profit: entry.ticket_Sales_PKR-entry.ticket_Purchase_PKR,


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
        Azad_Profit: entry.azad_Visa_Sales_PKR-entry.azad_Visa_Purchase_PKR,

        // Add other fields for Section 3

        Protector_Price_In: entry.protector_Price_In,
        Protector_Price_In_Oth_Cur: entry.protector_Price_In_Oth_Cur,
        Protector_Price_Out: entry.protector_Price_Out,
        protector_Reference_In: entry.protector_Reference_In,
        Protector_Reference_In_Name: entry.protector_Reference_In_Name,
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
                  <h4>Overall Visa Profit Reports</h4>
                </div>
                <div className="right d-flex">
                  {enteries.length > 0 &&
                    <>
                      <button className='btn btn-info m-1 btn-sm shadow text-white' onClick={()=>setShow(!show)}>{show ?"Hide":"Show"} </button>
                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}><i className="fa-solid fa-file-excel me-1"></i>Download Excel </button>
                    </>
                  }

                  <div className="dropdown d-inline m-1">
                    <button className="btn btn-sm" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                      View More
                    </button>
                    <ul className="dropdown-menu shadow border-0" aria-labelledby="dropdownMenuLink">
                      <li className='my-1 py-1' onClick={() => setSection1(!section1)}>{!section1 ? "Show" : "Hide"} Visit Section</li>
                      <li className='my-1 py-1' onClick={() => setSection2(!section2)}>{!section2 ? "Show" : "Hide"} Ticket Section</li>
                      <li className='my-1 py-1' onClick={() => setSection3(!section3)}>{!section3 ? "Show" : "Hide"} Azad Section</li>
                      <li className='my-1 py-1' onClick={() => setSection4(!section4)}>{!section4 ? "Show" : "Hide"} Protectors</li>
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
            {enteries && enteries.length > 0 &&
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
                        {[...new Set(enteries.map(data => data.entry_Date))].map(dateValue => (
                          <option value={dateValue} key={dateValue}>{dateValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1">
                      <label htmlFor="">Trade:</label>
                      <select value={trade} onChange={(e) => setTrade(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.trade))].map(tradeValue => (
                          <option key={tradeValue} value={tradeValue}>{tradeValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Company:</label>
                      <select value={company} onChange={(e) => setCompany(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.company))].map(companyValue => (
                          <option key={companyValue} value={companyValue}>{companyValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Country:</label>
                      <select value={country} onChange={(e) => setCountry(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.country))].map(countryValue => (
                          <option key={countryValue} value={countryValue}>{countryValue}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-auto px-1 ">
                      <label htmlFor="">Final Status:</label>
                      <select value={final_Status} onChange={(e) => setFinal_Status(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.final_Status))].map(final_StatusValue => (
                          <option key={final_StatusValue} value={final_StatusValue}>{final_StatusValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Flight Date:</label>
                      <select value={flight_Date} onChange={(e) => setFlight_Date(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.flight_Date))].map(flight_DateValue => (
                          <option key={flight_DateValue} value={flight_DateValue}>{flight_DateValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Entry Mode:</label>
                      <select value={entry_Mode} onChange={(e) => setEntry_Mode(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.entry_Mode))].map(entry_ModeValue => (
                          <option key={entry_ModeValue} value={entry_ModeValue}>{entry_ModeValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference Out:</label>
                      <select value={reference_Out} onChange={(e) => setReference_Out(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.reference_Out_Name))].map(reference_Out_NameValue => (
                          <option key={reference_Out_NameValue} value={reference_Out_NameValue}>{reference_Out_NameValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference In:</label>
                      <select value={reference_In} onChange={(e) => setReference_In(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.reference_In_Name))].map(reference_In_NameValue => (
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
                          <TableCell align="left" className='personel_label border py-2' colSpan={show ?22:21}>
                            Personel Details
                          </TableCell>
                          
                        
                          {section1 &&
                            <TableCell align="left" className='visit_label border py-2' colSpan={10}>
                              Visit Sales Purchase Details
                            </TableCell>
                          }
                          {section2 &&

                            <TableCell align="left" className='ticket_label border py-2' colSpan={10}>
                              Ticket Sales Purchase Details
                            </TableCell>
                          }
                          {section3 &&
                            <TableCell align="left" className='azad_label border py-2' colSpan={10}>
                              Azad Visa Sales Purchase Details
                            </TableCell>
                          }
                          {section4 &&
                            <TableCell align="left" className='protector_label border py-2' colSpan={6}>
                              Protector Details
                            </TableCell>
                          }
                            <TableCell align="left" className='personel_label border py-2' colSpan={1}>
                              Net_Profit
                            </TableCell>
                           
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
                         
                          {show &&
                           <>
                          <TableCell className='label border'>Visa_Profit</TableCell>
                         
                           </>
                           }
                           
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
                            <TableCell className='label border'>Visit_Visa_Profit</TableCell>

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
                            <TableCell className='label border'>Ticket_Visa_Profit</TableCell>


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
                            <TableCell className='label border'>Azad_Visa_Profit</TableCell>


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
                            <TableCell className='label border'>Protector_Profit</TableCell>



                            </>
                          }
                            <TableCell className='label border bg-warning text-white'>Total_Profit</TableCell>

                          
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
                                {show &&
                                <>
                                 <TableCell className='border data_td bg-success text-white'>{entry.visa_Sales_Rate_PKR-entry.visa_Purchase_Rate_PKR}</TableCell>
                                   
                                </>
                                }
                                 
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
                                    <TableCell className='border data_td bg-success text-white'>{entry.visit_Sales_PKR-entry.visit_Purchase_Rate_PKR}</TableCell>
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
                                    <TableCell className='border data_td bg-success text-white'>{entry.ticket_Sales_PKR-entry.ticket_Purchase_PKR}</TableCell>
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
                                    <TableCell className='border data_td bg-success text-white'>{entry.azad_Visa_Sales_PKR-entry.azad_Visa_Purchase_PKR}</TableCell>


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
                                    <TableCell className='border data_td bg-success text-white'>{entry.protector_Price_In-entry.protector_Price_Out}</TableCell>
                                  </>
                                }
                                    <TableCell className='border data_td bg-warning text-white'>{(entry.visa_Sales_Rate_PKR+entry.visit_Sales_PKR+entry.ticket_Sales_PKR+entry.azad_Visa_Sales_PKR+entry.protector_Price_In)-(entry.visa_Purchase_Rate_PKR+entry.visit_Purchase_Rate_PKR+entry.ticket_Purchase_PKR+entry.azad_Visa_Purchase_PKR+entry.protector_Price_Out)}</TableCell>

                               
                          </TableRow>
                        )) :
                        <TableRow>
                        <TableCell className='border data_td'>No_Entry_Found</TableCell>

                        </TableRow>
                        }
                        <TableRow>
                          <TableCell colSpan={20}></TableCell>
                          <TableCell className='border data_td bg-secondary text-white'>Total</TableCell>
                          {show &&
                          <TableCell className='border data_td text-center bg-success text-white'>
                          {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
                            return total + (entry.visa_Sales_Rate_PKR || 0) +(entry.visa_Purchase_Rate_PKR || 0); 
                          }, 0)}
                        </TableCell>
                          }
                         {section1 && <>
                            <TableCell colSpan={9}></TableCell>
                            <TableCell className='border data_td text-center bg-success text-white'>
                          {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
                            return total + (entry.visit_Sales_PKR || 0) +(entry.visit_Purchase_Rate_PKR || 0); 
                          }, 0)}
                        </TableCell>
                         </>}
                         {section2 && <>
                            <TableCell colSpan={9}></TableCell>
                            <TableCell className='border data_td text-center bg-success text-white'>
                          {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
                            return total + (entry.ticket_Sales_PKR || 0) +(entry.ticket_Purchase_PKR || 0); 
                          }, 0)}
                        </TableCell>
                         </>}
                         {section3 && <>
                            <TableCell colSpan={9}></TableCell>
                            <TableCell className='border data_td text-center bg-success text-white'>
                          {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
                            return total + (entry.azad_Visa_Sales_PKR || 0) +(entry.azad_Visa_Purchase_PKR || 0); 
                          }, 0)}
                        </TableCell>
                         </>}
                         {section4 && <>
                            <TableCell colSpan={5}></TableCell>
                            <TableCell className='border data_td text-center bg-success text-white'>
                          {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
                            return total + (entry.protector_Price_In || 0) +(entry.protector_Price_Out || 0); 
                          }, 0)}
                        </TableCell>
                         </>}
                        
                            <TableCell className='border data_td text-center bg-warning text-white'>
                          {filteredEntries && filteredEntries.length > 0 && filteredEntries.reduce((total, entry) => {
                            return total + (entry.visa_Sales_Rate_PKR+entry.visit_Sales_PKR+entry.ticket_Sales_PKR+entry.azad_Visa_Sales_PKR+entry.protector_Price_In || 0) -(entry.visa_Purchase_Rate_PKR+entry.visit_Purchase_Rate_PKR+entry.ticket_Purchase_PKR+entry.azad_Visa_Purchase_PKR+entry.protector_Price_Out || 0); 
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

export default OverAllVisaProfitReports;
