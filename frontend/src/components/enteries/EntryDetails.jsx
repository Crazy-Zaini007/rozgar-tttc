import React, { useState, useEffect,useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import EntryHook from '../../hooks/entryHooks/EntryHook';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateEntry } from '../../redux/reducers/entrySlice';
import AVPPHook from '../../hooks/settingHooks/AVPPHook'
import AVSPHook from '../../hooks/settingHooks/AVSPHook'
import CompanyHook from '../../hooks/settingHooks/CompanyHook'
import CountryHook from '../../hooks/settingHooks/CountryHook'
import CurrCountryHook from '../../hooks/settingHooks/CurrCountryHook'
import CurrencyHook from '../../hooks/settingHooks/CurrencyHook'
import EntryMoodHook from '../../hooks/settingHooks/EntryMoodHook'
import FinalStatusHook from '../../hooks/settingHooks/FinalStatusHook'
import TradeHook from '../../hooks/settingHooks/TradeHook'
import TPPHook from '../../hooks/settingHooks/TPPHook'
import TSPHook from '../../hooks/settingHooks/TSPHook'
import VIPPHook from '../../hooks/settingHooks/VIPPHook'
import VISPHook from '../../hooks/settingHooks/VISPHook'
import VPPHook from '../../hooks/settingHooks/VPPHook'
import VSPHook from '../../hooks/settingHooks/VSPHook'
import ProtectorHook from '../../hooks/settingHooks/ProtectorHook';

import * as XLSX from 'xlsx';
import SyncLoader from 'react-spinners/SyncLoader'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const rowsPerPageOptions = [10, 15, 30];

const EntryDetails = () => {
  const { getEntries } = EntryHook();
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [editMode, setEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState({});
  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const [loading1, setLoading1] = useState(false)

  // Calling data from Hooks
  const { getAVPPData } = AVPPHook()
  const { getAVSPData } = AVSPHook()
  const { getComapnyData } = CompanyHook()
  const { getCountryData } = CountryHook()
  const { getCurrCountryData } = CurrCountryHook()
  const { getCurrencyData } = CurrencyHook()
  const { getEntryMoodData } = EntryMoodHook()
  const { getFinalStatusData } = FinalStatusHook()
  const { getTradeData } = TradeHook()
  const { getTPPData } = TPPHook()
  const { getTSPData } = TSPHook()
  const { getVIPPData } = VIPPHook()
  const { getVISPData } = VISPHook()
  const { getVPPData } = VPPHook()
  const { getVSPData } = VSPHook()
  const { getProtector } = ProtectorHook()

  // fteching Data from DB
  const fetchData = async () => {
    try {
      setLoading1(true);
  
      // Fetch getEntries() separately to wait for its completion
      await getEntries();
      
      // Set loading to false right after getEntries() is completed
      setLoading1(false);
  
      // Use Promise.all to execute other promises concurrently
      await Promise.all([
        getAVPPData(),
        getAVSPData(),
        getTPPData(),
        getTSPData(),
        getVIPPData(),
        getVISPData(),
        getVPPData(),
        getVSPData(),
        getComapnyData(),
        getCountryData(),
        getCurrCountryData(),
        getCurrencyData(),
        getEntryMoodData(),
        getFinalStatusData(),
        getTradeData(),
        getProtector()

      ]);
    } catch (error) {
      setLoading1(false);
      // Handle errors if needed
    }
  };
  

  useEffect(() => {
  
      fetchData()
    
  }, []);

  const enteries = useSelector((state) => state.enteries.enteries);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [delLoading, setDelLoading] = useState(false)
  const deleteEntry = async (entry) => {
    if (window.confirm('Are you sure you want to delete this record?')){
      setDelLoading(true)
   
      const entryId = entry._id;
      try {
        const response = await fetch(`${apiUrl}/auth/entries/delete/entry`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ entryId })
        });
  
        const json = await response.json();
        if (response.ok) {
          fetchData()
          setDelLoading(false)
          setNewMessage(toast.success(json.message))
        
        }
        if (!response.ok) {
          
          setDelLoading(false)
          setNewMessage(toast.error(json.message))
        }
      }
      catch (err) {
        setDelLoading(false)
      }
    }
   
  };

  const handleEditClick = (entry, index) => {
    setEditMode(!editMode);
    setEditedEntry(entry);

    setEditedRowIndex(index); // Set the index of the row being edited
  };

  const handleImageChange = (e, field) => {
    if (field === 'picture' || field === 'visit_Section_Picture' || field === 'ticket_Section_Picture' || field === 'azad_Visa_Section_Picture') {
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

  // ...

  const handleInputChange = (e, field) => {
    if (field !== 'picture' && field !== 'visit_Section_Picture' && field !== 'ticket_Section_Picture' && field !== 'azad_Visa_Section_Picture') {
      setEditedEntry({
        ...editedEntry,
        [field]: e.target.value,
      });
    }
  };



  // Fetching Setting Data from Redux
  // getting data from redux store 
  const visaSalesParty = useSelector((state) => state.setting.visaSalesParty);
  const visaPurchaseParty = useSelector((state) => state.setting.visaPurchaseParty);
  const ticketSalesParties = useSelector((state) => state.setting.ticketSalesParties);
  const ticketPurchaseParties = useSelector((state) => state.setting.ticketPurchaseParties);
  const visitSalesParties = useSelector((state) => state.setting.visitSalesParties);
  const visitPurchaseParties = useSelector((state) => state.setting.visitPurchaseParties);
  const azadVisaSalesParties = useSelector((state) => state.setting.azadVisaSalesParties);
  const azadVisaPurchaseParties = useSelector((state) => state.setting.azadVisaPurchaseParties);
  const companies = useSelector((state) => state.setting.companies);
  const trades = useSelector((state) => state.setting.trades);
  const protectors = useSelector((state) => state.setting.protectors);

  // const currCountries = useSelector((state) => state.setting.currCountries);
  const entryMode = useSelector((state) => state.setting.entryMode);
  const finalStatus = useSelector((state) => state.setting.finalStatus);
  const countries = useSelector((state) => state.setting.countries);
  const currencies = useSelector((state) => state.setting.currencies);


  const [updateLoading, setUpdateLoading] = useState(false)
  const [, setNewMessage] = useState('')

  const handleUpdate = async () => {
    setUpdateLoading(true)
    let entryId = editedEntry._id
    try {
      const response = await fetch(`${apiUrl}/auth/entries/update/single_entry/${entryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: editedEntry.name, pp_No: editedEntry.pp_No, trade: editedEntry.trade, company: editedEntry.company, contact: editedEntry.contact, country: editedEntry.country, flight_Date: editedEntry.flight_Date, final_Status: editedEntry.final_Status, remarks: editedEntry.remarks, entry_Mode: editedEntry.entry_Mode,reference_Out:editedEntry.reference_Out, reference_Out_Name: editedEntry.reference_Out_Name, visa_Sales_Rate_PKR: editedEntry.visa_Sales_Rate_PKR, visa_Sale_Rate_Oth_Cur: editedEntry.visa_Sale_Rate_Oth_Cur, cur_Country_One: editedEntry.cur_Country_One,reference_In:editedEntry.reference_In, reference_In_Name: editedEntry.reference_In_Name, visa_Purchase_Rate_PKR: editedEntry.visa_Purchase_Rate_PKR, visa_Purchase_Rate_Oth_Cur: editedEntry.visa_Purchase_Rate_Oth_Cur, cur_Country_Two: editedEntry.cur_Country_Two, picture: editedEntry.picture,  visit_Sales_PKR: editedEntry.visit_Sales_PKR, visit_Sales_Rate_Oth_Curr: editedEntry.visit_Sales_Rate_Oth_Curr,  visit_Purchase_Rate_PKR: editedEntry.visit_Purchase_Rate_PKR, visit_Purchase_Rate_Oth_Cur: editedEntry.visit_Purchase_Rate_Oth_Cur,visit_Reference_In:editedEntry.visit_Reference_In, visit_Reference_In_Name: editedEntry.visit_Reference_In_Name,visit_Reference_Out:editedEntry.visit_Reference_Out, visit_Reference_Out_Name: editedEntry.visit_Reference_Out_Name, visit_Section_Picture: editedEntry.visit_Section_Picture, ticket_Sales_PKR: editedEntry.ticket_Sales_PKR, ticket_Sales_Rate_Oth_Cur: editedEntry.ticket_Sales_Rate_Oth_Cur,  ticket_Purchase_PKR: editedEntry.ticket_Purchase_PKR, ticket_Purchase_Rate_Oth_Cur: editedEntry.ticket_Purchase_Rate_Oth_Cur,ticket_Reference_In:editedEntry.ticket_Reference_In, ticket_Reference_In_Name: editedEntry.ticket_Reference_In_Name,ticket_Reference_Out_Name:editedEntry.ticket_Reference_Out_Name, ticket_Section_Picture: editedEntry.ticket_Section_Picture, azad_Visa_Sales_PKR: editedEntry.azad_Visa_Sales_PKR, azad_Visa_Sales_Rate_Oth_Cur: editedEntry.azad_Visa_Sales_Rate_Oth_Cur, azad_Visa_Purchase_PKR: editedEntry.azad_Visa_Purchase_PKR, azad_Visa_Purchase_Rate_Oth_Cur: editedEntry.azad_Visa_Purchase_Rate_Oth_Cur,azad_Visa_Reference_In:editedEntry.azad_Visa_Reference_In, azad_Visa_Reference_In_Name: editedEntry.azad_Visa_Reference_In_Name,azad_Visa_Reference_Out:editedEntry.azad_Visa_Reference_Out, azad_Visa_Reference_Out_Name: editedEntry.azad_Visa_Reference_Out_Name, azad_Visa_Section_Picture: editedEntry.azad_Visa_Section_Picture, protector_Price_In: editedEntry.protector_Price_In,protector_Price_In_Oth_Cur:editedEntry.protector_Price_In_Oth_Cur,protector_Reference_In:editedEntry.protector_Reference_In,protector_Reference_In_Name:editedEntry.protector_Reference_In_Name, protector_Price_Out: editedEntry.protector_Price_Out  })
      })

      const json = await response.json()

      if (!response.ok) {
        setNewMessage(toast.error(json.message));

        setUpdateLoading(false)
      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        setUpdateLoading(null)
        dispatch(updateEntry(json.data))
        setEditMode(!editMode)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setUpdateLoading(null)

    }
  };

  const [section1, setSection1] = useState(false)
  const [section2, setSection2] = useState(false)
  const [section3, setSection3] = useState(false)
  const [section4, setSection4] = useState(false)


  const downloadExcel = () => {
    const data = [];

    // Iterate over entries and push all fields
    enteries.forEach((entry, index) => {
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

      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Entries.xlsx');
  };



  return (
    <>
      <div className='main'>
        <div className='container-fluid entry_details'>
          <div className='row'>
            <div className='col-md-12 '>
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Enteries Details</h4>
                </div>
                <div className="right d-flex">
                  {enteries.length > 0 &&
                    <>
                      {/* <button className='btn pdf_btn m-1 btn-sm' onClick={downloadPDF}><i className="fa-solid fa-file-pdf me-1 "></i>Download PDF </button> */}
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


            {!loading1 &&
              <div className='col-md-12'>
                <Paper className='py-3 mb-1 px-2 detail_table'>
                  <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                    <TableHead>
                        <TableRow className='p-0 m-0'>
                          <TableCell align="left" className='personel_label border py-2' colSpan={20}>
                            Personel Details
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


                          <TableCell align="left" className='edw_label border py-2' colSpan={1}>
                            Edit/Delete
                          </TableCell>
                        </TableRow>
                        <TableRow>
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


                          {/* Add more table header cells for other fields */}
                          <TableCell align='left' className='edw_label border' colSpan={1}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>


                      <TableBody>
                        {enteries && enteries.length > 0 ? enteries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry, index) => (
                          <TableRow key={entry._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                            {/* ... (previous cells) */}
                            {editMode && editedRowIndex === index ? (
                              // Render input fields or editable elements when in edit mode for the specific row
                              <>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.entry_Date} readOnly />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.name} onChange={(e) => handleInputChange(e, 'name')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.pp_No} onChange={(e) => handleInputChange(e, 'pp_No')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>

                                <select value={editedEntry.trade} onChange={(e) => handleInputChange(e, 'trade')} >
                                  <option value={editedEntry.trade}>{editedEntry.trade}</option>
                                  {trades && trades.map((data) => (
                                    <option key={data._id} value={data.trade}>{data.trade}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <select value={editedEntry.company} onChange={(e) => handleInputChange(e, 'company')} >
                                  <option value={editedEntry.company}>{editedEntry.company}</option>
                                  {companies && companies.map((data) => (
                                    <option key={data._id} value={data.company}>{data.company}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.remarks} onChange={(e) => handleInputChange(e, 'remarks')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='number' min='0' value={editedEntry.contact} onChange={(e) => handleInputChange(e, 'contact')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <select value={editedEntry.final_Status} onChange={(e) => handleInputChange(e, 'final_Status')} >
                                  <option value={editedEntry.final_Status}>{editedEntry.final_Status}</option>
                                  {finalStatus && finalStatus.map((data) => (
                                    <option key={data._id} value={data.final_Status}>{data.final_Status}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-1  '>
                                <input type='date' onChange={(e) => handleInputChange(e, 'flight_Date')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <select value={editedEntry.country} onChange={(e) => handleInputChange(e, 'country')} >
                                  <option value={editedEntry.country}>{editedEntry.country}</option>
                                  {countries && countries.map((data) => (
                                    <option key={data._id} value={data.country}>{data.country}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <select value={editedEntry.entry_Mode} onChange={(e) => handleInputChange(e, 'entry_Mode')} >
                                  <option value={editedEntry.entry_Mode}>{editedEntry.entry_Mode}</option>
                                  {entryMode && entryMode.map((data) => (
                                    <option key={data._id} value={data.entry_Mode}>{data.entry_Mode}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='number' min='0' value={editedEntry.visa_Sales_Rate_PKR} onChange={(e) => handleInputChange(e, 'visa_Sales_Rate_PKR')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='number' min='0' value={editedEntry.visa_Sale_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'visa_Sale_Rate_Oth_Cur')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='number' min='0' value={editedEntry.visa_Purchase_Rate_PKR} onChange={(e) => handleInputChange(e, 'visa_Purchase_Rate_PKR')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='number' min='0' value={editedEntry.visa_Purchase_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'visa_Purchase_Rate_Oth_Cur')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <select required value={editedEntry.reference_Out} onChange={(e) => handleInputChange(e, 'reference_Out')} >
                                  
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                </select>

                              </TableCell>

                              <TableCell className='border data_td p-1 '>
                              
                                  
                                  {(editedEntry.reference_Out.toLowerCase() === "candidate" || editedEntry.reference_Out.toLowerCase() === "candidates")  ? (
                                  <input
                                    type="text"
                                    placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                                    value={editedEntry.name}

                                    readOnly />
                                ) : (

                                  <select required value={editedEntry.reference_Out_Name} onChange={(e) => handleInputChange(e, 'reference_Out_Name')} >
                                    {(editedEntry.reference_Out === "agent" || editedEntry.reference_Out === "agents") && (
                                      <>
                                        <option value="">Choose Agents</option>
                                        {/* Options for Agents */}
                                        {visaSalesParty &&
                                          visaSalesParty.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {ticketSalesParties &&
                                          ticketSalesParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {visitSalesParties &&
                                          visitSalesParties.map((data, index) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {azadVisaSalesParties &&
                                          azadVisaSalesParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                      </>
                                    )}
                                    {(editedEntry.reference_Out.toLowerCase() === "supplier" || editedEntry.reference_Out.toLowerCase() === "suppliers") && (
                                      <>
                                        <option value="">Choose Supplier</option>

                                        {/* Options for Suppliers */}
                                        {visaPurchaseParty &&
                                          visaPurchaseParty.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {ticketPurchaseParties &&
                                          ticketPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {visitPurchaseParties &&
                                          visitPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {azadVisaPurchaseParties &&
                                          azadVisaPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                      </>
                                    )}

                                  </select>

                               
                                
                                )
                                    
                                }
                                
                              </TableCell>

                              <TableCell className='border data_td p-1 '>
                                <select required value={editedEntry.reference_In} onChange={(e) => handleInputChange(e, 'reference_In')} >
                           
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agent</option>
                                  <option className="my-1 py-2" value="supplier">Supplier</option>
                                </select>

                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                            
                                    {(editedEntry.reference_In.toLowerCase() === "candidate" || editedEntry.reference_In.toLowerCase() === "candidates") ? (
                <input
                  type="text"
                  placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                  value={editedEntry.name}

                  readOnly
                />
              ) : (
                <select
                  required
                  value={editedEntry.reference_In_Name}
                  onChange={(e) => handleInputChange(e, 'reference_In_Name')}
                >
                  {(editedEntry.reference_In.toLowerCase() === "agent" || editedEntry.reference_In.toLowerCase() === "agents") && (
                    <>
                      <option value="">Choose Agent</option>
                      {visaSalesParty && visaSalesParty.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {ticketSalesParties && ticketSalesParties.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {visitSalesParties && visitSalesParties.map((data, index) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {azadVisaSalesParties && azadVisaSalesParties.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                    </>
                  )
                  }
                  {(editedEntry.reference_In.toLowerCase() === "supplier" || editedEntry.reference_In.toLowerCase() === "suppliers") && (
                    <>
                      <option value="">Choose Supplier</option>
                      {visaPurchaseParty && visaPurchaseParty.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {ticketPurchaseParties && ticketPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {visitPurchaseParties && visitPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {azadVisaPurchaseParties && azadVisaPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                    </>
                  )}

                </select>
              )}
                               
                          
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'picture')} />
                              </TableCell>

                              {section1 &&
                                <>
                                  {/* Visit Section */}

       
                                 
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' value={editedEntry.visit_Sales_PKR} onChange={(e) => handleInputChange(e, 'visit_Sales_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <input type='number' value={editedEntry.visit_Sales_Rate_Oth_Curr} onChange={(e) => handleInputChange(e, 'visit_Sales_Rate_Oth_Curr')} />

                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' value={editedEntry.visit_Purchase_Rate_PKR} onChange={(e) => handleInputChange(e, 'visit_Purchase_Rate_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <input type='number' value={editedEntry.visit_Purchase_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'visit_Purchase_Rate_Oth_Cur')} />

                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <select required value={editedEntry.visit_Reference_Out} onChange={(e) => handleInputChange(e, 'visit_Reference_Out')} >
                               
                                    <option className="my-1 py-2" value="candidate">Candidate</option>
                                    <option className="my-1 py-2" value="agent">Agent</option>
                                    <option className="my-1 py-2" value="supplier">Supplier</option>
                                  </select>
                                  </TableCell>


                                  <TableCell className='border data_td p-1 '>
                             
                                  {editedEntry.visit_Reference_Out &&(editedEntry.visit_Reference_Out.toLowerCase() === "candidate" || editedEntry.visit_Reference_Out.toLowerCase() === "candidates")  ? (
                                  <input
                                    type="text"
                                    placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                                    value={editedEntry.name}

                                    readOnly />
                                ) : (

                                  <select required value={editedEntry.visit_Reference_Out_Name} onChange={(e) => handleInputChange(e, 'visit_Reference_Out_Name')} >
                                    {editedEntry.visit_Reference_Out &&(editedEntry.visit_Reference_Out === "agent" || editedEntry.visit_Reference_Out === "agents") && (
                                      <>
                                        <option value="">Choose Agents</option>
                                        {/* Options for Agents */}
                                        {visaSalesParty &&
                                          visaSalesParty.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {ticketSalesParties &&
                                          ticketSalesParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {visitSalesParties &&
                                          visitSalesParties.map((data, index) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {azadVisaSalesParties &&
                                          azadVisaSalesParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                      </>
                                    )}
                                    {editedEntry.visit_Reference_Out &&(editedEntry.visit_Reference_Out.toLowerCase() === "supplier" || editedEntry.visit_Reference_Out.toLowerCase() === "suppliers") && (
                                      <>
                                        <option value="">Choose Supplier</option>

                                        {/* Options for Suppliers */}
                                        {visaPurchaseParty &&
                                          visaPurchaseParty.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {ticketPurchaseParties &&
                                          ticketPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {visitPurchaseParties &&
                                          visitPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {azadVisaPurchaseParties &&
                                          azadVisaPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                      </>
                                    )}

                                  </select>

                                )
                                }
                                
                                
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <select required value={editedEntry.visit_Reference_In} onChange={(e) => handleInputChange(e, 'visit_Reference_In')} >
                             
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agent</option>
                                  <option className="my-1 py-2" value="supplier">Supplier</option>
                                </select>

                              </TableCell>
                              <TableCell className='border data_td p-1 '>
           
                                    {editedEntry.visit_Reference_In &&(editedEntry.visit_Reference_In.toLowerCase() === "candidate" || editedEntry.visit_Reference_In.toLowerCase() === "candidates") ? (
                <input
                  type="text"
                  placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                  value={editedEntry.name}

                  readOnly
                />
              ) : (
                <select
                  required
                  value={editedEntry.visit_Reference_In_Name}
                  onChange={(e) => handleInputChange(e, 'visit_Reference_In_Name')}
                >
                  {editedEntry.visit_Reference_In &&(editedEntry.visit_Reference_In.toLowerCase() === "agent" || editedEntry.visit_Reference_In.toLowerCase() === "agents") && (
                    <>
                      <option value="">Choose Agent</option>
                      {visaSalesParty && visaSalesParty.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {ticketSalesParties && ticketSalesParties.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {visitSalesParties && visitSalesParties.map((data, index) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {azadVisaSalesParties && azadVisaSalesParties.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                    </>
                  )
                  }
                  {editedEntry.visit_Reference_In &&(editedEntry.visit_Reference_In.toLowerCase() === "supplier" || editedEntry.visit_Reference_In.toLowerCase() === "suppliers") && (
                    <>
                      <option value="">Choose Supplier</option>
                      {visaPurchaseParty && visaPurchaseParty.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {ticketPurchaseParties && ticketPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {visitPurchaseParties && visitPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {azadVisaPurchaseParties && azadVisaPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                    </>
                  )}

                </select>
              )}
                             
                          
                              </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'visit_Section_Picture')} />
                                  </TableCell>
                                </>
                              }

                              {section2 &&
                                <>

                                  {/* Ticket Section */}
                                  
                                  

                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry.ticket_Sales_PKR} onChange={(e) => handleInputChange(e, 'ticket_Sales_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <input type='number' value={editedEntry.ticket_Sales_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'ticket_Sales_Rate_Oth_Cur')} />

                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' value={editedEntry.ticket_Purchase_PKR} onChange={(e) => handleInputChange(e, 'ticket_Purchase_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>

                                  <input type='number' value={editedEntry.ticket_Purchase_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'ticket_Purchase_Rate_Oth_Cur')} />
                                    
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <select required value={editedEntry.ticket_Reference_Out} onChange={(e) => handleInputChange(e, 'ticket_Reference_Out')} >
                                
                                    <option className="my-1 py-2" value="candidate">Candidate</option>
                                    <option className="my-1 py-2" value="agent">Agent</option>
                                    <option className="my-1 py-2" value="supplier">Supplier</option>
                                  </select>
                                  </TableCell>


                                  <TableCell className='border data_td p-1 '>
                               
                                  {editedEntry.ticket_Reference_Out &&(editedEntry.ticket_Reference_Out.toLowerCase() === "candidate" || editedEntry.ticket_Reference_Out.toLowerCase() === "candidates")  ? (
                                  <input
                                    type="text"
                                    placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                                    value={editedEntry.name}

                                    readOnly />
                                ) : (

                                  <select required value={editedEntry.ticket_Reference_Out_Name} onChange={(e) => handleInputChange(e, 'ticket_Reference_Out_Name')} >
                                    {editedEntry.ticket_Reference_Out &&(editedEntry.ticket_Reference_Out === "agent" || editedEntry.ticket_Reference_Out === "agents") && (
                                      <>
                                        <option value="">Choose Agents</option>
                                        {/* Options for Agents */}
                                        {visaSalesParty &&
                                          visaSalesParty.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {ticketSalesParties &&
                                          ticketSalesParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {visitSalesParties &&
                                          visitSalesParties.map((data, index) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {azadVisaSalesParties &&
                                          azadVisaSalesParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                      </>
                                    )}
                                    {editedEntry.ticket_Reference_Out &&(editedEntry.ticket_Reference_Out.toLowerCase() === "supplier" || editedEntry.ticket_Reference_Out.toLowerCase() === "suppliers") && (
                                      <>
                                        <option value="">Choose Supplier</option>

                                        {/* Options for Suppliers */}
                                        {visaPurchaseParty &&
                                          visaPurchaseParty.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {ticketPurchaseParties &&
                                          ticketPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {visitPurchaseParties &&
                                          visitPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {azadVisaPurchaseParties &&
                                          azadVisaPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                      </>
                                    )}

                                  </select>

                                )
                                }
                                
                                
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <select required value={editedEntry.ticket_Reference_In} onChange={(e) => handleInputChange(e, 'ticket_Reference_In')} >
                                  
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agent</option>
                                  <option className="my-1 py-2" value="supplier">Supplier</option>
                                </select>

                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                             
                                    {editedEntry.ticket_Reference_In &&(editedEntry.ticket_Reference_In.toLowerCase() === "candidate" || editedEntry.ticket_Reference_In.toLowerCase() === "candidates") ? (
                <input
                  type="text"
                  placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                  value={editedEntry.name}

                  readOnly
                />
              ) : (
                <select
                  required
                  value={editedEntry.ticket_Reference_In_Name}
                  onChange={(e) => handleInputChange(e, 'ticket_Reference_In_Name')}
                >
                  {editedEntry.ticket_Reference_In &&(editedEntry.ticket_Reference_In.toLowerCase() === "agent" || editedEntry.ticket_Reference_In.toLowerCase() === "agents") && (
                    <>
                      <option value="">Choose Agent</option>
                      {visaSalesParty && visaSalesParty.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {ticketSalesParties && ticketSalesParties.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {visitSalesParties && visitSalesParties.map((data, index) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {azadVisaSalesParties && azadVisaSalesParties.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                    </>
                  )
                  }
                  {editedEntry.ticket_Reference_In &&(editedEntry.ticket_Reference_In.toLowerCase() === "supplier" || editedEntry.ticket_Reference_In.toLowerCase() === "suppliers") && (
                    <>
                      <option value="">Choose Supplier</option>
                      {visaPurchaseParty && visaPurchaseParty.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {ticketPurchaseParties && ticketPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {visitPurchaseParties && visitPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {azadVisaPurchaseParties && azadVisaPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                    </>
                  )}

                </select>
              )}
                              
                          
                              </TableCell>
                                   <TableCell className='border data_td p-1 '>
                                    <input type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'ticket_Section_Picture')} />
                                  </TableCell>
                                </>
                              }

                              {section3 &&
                                <>
                                  {/* Azad Visa Sales Purchase Section Data */}

                                   <TableCell className='border data_td p-1 '>
                                    <input type='number' value={editedEntry.azad_Visa_Sales_PKR} onChange={(e) => handleInputChange(e, 'azad_Visa_Sales_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>

                                  <input type='number' value={editedEntry.azad_Visa_Sales_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'azad_Visa_Sales_Rate_Oth_Cur')} />

                                  </TableCell>

                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' value={editedEntry.azad_Visa_Purchase_PKR} onChange={(e) => handleInputChange(e, 'azad_Visa_Purchase_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>

                                  <input type='number' value={editedEntry.azad_Visa_Purchase_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'azad_Visa_Purchase_Rate_Oth_Cur')} />

                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <select required value={editedEntry.azad_Reference_Out} onChange={(e) => handleInputChange(e, 'azad_Reference_Out')} >
                               
                                    <option className="my-1 py-2" value="candidate">Candidate</option>
                                    <option className="my-1 py-2" value="agent">Agent</option>
                                    <option className="my-1 py-2" value="supplier">Supplier</option>
                                  </select>
                                  </TableCell>


                                  <TableCell className='border data_td p-1 '>
                              
                                  {editedEntry.azad_Reference_Out &&(editedEntry.azad_Reference_Out.toLowerCase() === "candidate" || editedEntry.azad_Reference_Out.toLowerCase() === "candidates")  ? (
                                  <input
                                    type="text"
                                    placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                                    value={editedEntry.name}

                                    readOnly />
                                ) : (

                                  <select required value={editedEntry.azad_Reference_Out_Name} onChange={(e) => handleInputChange(e, 'azad_Reference_Out_Name')} >
                                    {editedEntry.azad_Reference_Out &&(editedEntry.azad_Reference_Out === "agent" || editedEntry.azad_Reference_Out === "agents") && (
                                      <>
                                        <option value="">Choose Agents</option>
                                        {/* Options for Agents */}
                                        {visaSalesParty &&
                                          visaSalesParty.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {ticketSalesParties &&
                                          ticketSalesParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {visitSalesParties &&
                                          visitSalesParties.map((data, index) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {azadVisaSalesParties &&
                                          azadVisaSalesParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                      </>
                                    )}
                                    {editedEntry.azad_Reference_Out &&(editedEntry.azad_Reference_Out.toLowerCase() === "supplier" || editedEntry.azad_Reference_Out.toLowerCase() === "suppliers") && (
                                      <>
                                        <option value="">Choose Supplier</option>

                                        {/* Options for Suppliers */}
                                        {visaPurchaseParty &&
                                          visaPurchaseParty.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {ticketPurchaseParties &&
                                          ticketPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {visitPurchaseParties &&
                                          visitPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                        {azadVisaPurchaseParties &&
                                          azadVisaPurchaseParties.map((data) => (
                                            <option
                                              className="my-1 py-2"
                                              key={data._id}
                                              value={data.supplierName}
                                            >
                                              {data.supplierName}
                                            </option>
                                          ))}
                                      </>
                                    )}

                                  </select>

                                )
                                }
                                
                                
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <select required value={editedEntry.azad_Reference_In} onChange={(e) => handleInputChange(e, 'azad_Reference_In')} >
                                
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agent</option>
                                  <option className="my-1 py-2" value="supplier">Supplier</option>
                                </select>

                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                             
                                    {editedEntry.azad_Reference_In &&(editedEntry.azad_Reference_In.toLowerCase() === "candidate" || editedEntry.azad_Reference_In.toLowerCase() === "candidates") ? (
                <input
                  type="text"
                  placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                  value={editedEntry.name}

                  readOnly
                />
              ) : (
                <select
                  required
                  value={editedEntry.azad_Reference_In_Name}
                  onChange={(e) => handleInputChange(e, 'azad_Reference_In_Name')}
                >
                  {editedEntry.azad_Reference_In &&(editedEntry.azad_Reference_In.toLowerCase() === "agent" || editedEntry.azad_Reference_In.toLowerCase() === "agents") && (
                    <>
                      <option value="">Choose Agent</option>
                      {visaSalesParty && visaSalesParty.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {ticketSalesParties && ticketSalesParties.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {visitSalesParties && visitSalesParties.map((data, index) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                      {azadVisaSalesParties && azadVisaSalesParties.map((data) => (

                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                      ))}
                    </>
                  )
                  }
                  {editedEntry.azad_Reference_In &&(editedEntry.azad_Reference_In.toLowerCase() === "supplier" || editedEntry.azad_Reference_In.toLowerCase() === "suppliers") && (
                    <>
                      <option value="">Choose Supplier</option>
                      {visaPurchaseParty && visaPurchaseParty.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {ticketPurchaseParties && ticketPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {visitPurchaseParties && visitPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                      {azadVisaPurchaseParties && azadVisaPurchaseParties.map((data) => (
                        <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>
                      ))}
                    </>
                  )}

                </select>
              )}
                         
                          
                              </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'azad_Visa_Section_Picture')} />
                                  </TableCell>
                                </>
                              }

                              {section4 &&
                                <>
                                  {/* Protector Section*/}
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' value={editedEntry.protector_Price_In} onChange={(e) => handleInputChange(e, 'protector_Price_In')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' value={editedEntry.protector_Price_In_Oth_Cur} onChange={(e) => handleInputChange(e, 'protector_Price_In_Oth_Cur')} />
                                  </TableCell>

                                  <TableCell className='border data_td p-1 '>
                                <select required value={editedEntry.protector_Reference_In} onChange={(e) => handleInputChange(e, 'protector_Reference_In')} >
                                  
                                  <option className="my-1 py-2" value="protector">Protector</option>
                                
                                </select>

                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                              
                                  <select required value={editedEntry.protector_Reference_In_Name} onChange={(e) => handleInputChange(e, 'protector_Reference_In_Name')} >
                               
                                  {editedEntry.protector_Reference_In &&(editedEntry.protector_Reference_In.toLowerCase()==="protector" || editedEntry.protector_Reference_In.toLowerCase()==="protectors") &&(
                                    <>
              
                                    <option value="">choose Protector</option>
                                    {protectors && protectors.map((data)=>(
                                     <option
                                     className="my-1 py-2"
                                     key={data._id}
                                     value={data.supplierName}
                                   >
                                     {data.supplierName}
                                   </option>
                                    ))}
                                    </>
                                  ) 
              
                                  }
              
                                </select>
                             
                          
                              </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' value={editedEntry.protector_Price_Out} onChange={(e) => handleInputChange(e, 'protector_Price_Out')} />
                                  </TableCell>
                                </>
                              }



                            </>
                            ) : (
                              // Render plain text or non-editable elements when not in edit mode or for other rows
                              <>
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

                                {section1 &&
                                  <>

                                    {/* Visit Sales Purchase Section Data */}
                                   
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

                                {/* Repeat similar blocks for other non-editable fields */}
                              </>
                            )}
                            <TableCell className='border data_td p-1 '>
                              {editMode && editedRowIndex === index ? (
                                // Render Save button when in edit mode for the specific row
                                <>
                                  <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button onClick={() => setEditMode(!editMode)} className='btn delete_btn'>Cancel</button>
                                    <button onClick={() => handleUpdate()} className='btn save_btn' disabled={updateLoading}>{updateLoading ? "Saving..." : "Save"}</button>

                                  </div>

                                </>

                              ) : (
                                // Render Edit button when not in edit mode or for other rows
                                <>
                                  <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button onClick={() => handleEditClick(entry, index)} className='btn edit_btn'>Edit</button>
                                    <button className='btn delete_btn' onClick={() => deleteEntry(entry)} disabled={delLoading}>{delLoading ? "Deleting..." : "Delete"}</button>
                                  </div>
                                  {/* Deleting Modal  */}
                                  <div className="modal fade delete_Modal p-0" data-bs-backdrop="static" id="deleteModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog p-0">
                                      <div className="modal-content p-0">
                                        <div className="modal-header border-0">
                                          <h5 className="modal-title" id="exampleModalLabel">Attention!</h5>
                                          {/* <button type="button" className="btn-close shadow rounded" data-bs-dismiss="modal" aria-label="Close" /> */}
                                        </div>
                                        <div className="modal-body text-center p-0">

                                          <p>Do you want to Delete the Record?</p>
                                        </div>
                                        <div className="text-end m-2">
                                          <button type="button " className="btn rounded m-1 cancel_btn" data-bs-dismiss="modal" >Cancel</button>
                                          <button type="button" className="btn m-1 confirm_btn rounded" data-bs-dismiss="modal" >Confirm</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        )) :
                          <TableRow className='text-center'>
                            <p className='py-2 mx-auto'>No_Record_Found</p>
                          </TableRow>
                        }
                      </TableBody>

                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component='div'
                    count={enteries.length}
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
      </div >
    </>
  );
};

export default EntryDetails;
