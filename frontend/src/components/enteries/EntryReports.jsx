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
import {useNavigate} from 'react-router-dom'
import * as XLSX from 'xlsx';

const rowsPerPageOptions = [50, 75, 100,200];

const EntryReports = () => {
  const navigate=useNavigate()
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

  const abortCont = useRef(new AbortController());

  useEffect(() => {

    fetchData()
    return () => {
      if (abortCont.current) {
        abortCont.current.abort(); 
      }
    }
  }, []);

  
  const enteries = useSelector((state) => state.enteries.enteries);

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
          if(json.redirect){
            if (window.confirm(json.message)){
            
              navigate(json.redirect)
              setDelLoading(false)

            }
          }
          else{
          setNewMessage(toast.error(json.message))
          setDelLoading(false)

          }
        }
      }
      catch (err) {
        setDelLoading(false)
      }
    }
   
  }

  
  // Deleting Multiple Enteries
  const [multipleIds, setMultipleIds] = useState([]);

  const handleEntryId = (id, isChecked) => {
    if (isChecked) {
      // Add the ID if the checkbox is checked
      setMultipleIds((prevIds) => [...prevIds, id]);
    } else {
      // Remove the ID if the checkbox is unchecked
      setMultipleIds((prevIds) => prevIds.filter((entryId) => entryId !== id));
    }
   
  }

  const deleteMultipleEntries = async (entry) => {
    if (window.confirm(`Are you sure you want to delete ${multipleIds.length} Entries Record?`)){
      setDelLoading(true)
      try {
        const response = await fetch(`${apiUrl}/auth/entries/delete/multiple/entries`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ entries:multipleIds })
        });
  
        const json = await response.json();
        if (response.ok) {
          fetchData()
          setDelLoading(false)
          setNewMessage(toast.success(json.message))
          setMultipleIds([])
        }
        if (!response.ok) {
          if(json.redirect){
            if (window.confirm(json.message)){
              navigate(json.redirect)
             setDelLoading(false)

            }
          }
          else{
          setNewMessage(toast.error(json.message))
          setDelLoading(false)

          }
        }
      }
      catch (err) {
        setDelLoading(false)
      }
    }
   
  }

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
        body: JSON.stringify({ name: editedEntry.name, pp_No: editedEntry.pp_No, trade: editedEntry.trade, company: editedEntry.company, contact: editedEntry.contact, country: editedEntry.country, flight_Date: editedEntry.flight_Date, final_Status: editedEntry.final_Status, remarks: editedEntry.remarks, entry_Mode: editedEntry.entry_Mode,reference_Out:editedEntry.reference_Out, reference_Out_Name: editedEntry.reference_Out_Name, visa_Sales_Rate_PKR: editedEntry.visa_Sales_Rate_PKR, visa_Sale_Rate_Oth_Cur: editedEntry.visa_Sale_Rate_Oth_Cur, cur_Country_One: editedEntry.cur_Country_One,reference_In:editedEntry.reference_In, reference_In_Name: editedEntry.reference_In_Name, visa_Purchase_Rate_PKR: editedEntry.visa_Purchase_Rate_PKR, visa_Purchase_Rate_Oth_Cur: editedEntry.visa_Purchase_Rate_Oth_Cur, cur_Country_Two: editedEntry.cur_Country_Two, picture: editedEntry.picture,  visit_Sales_PKR: editedEntry.visit_Sales_PKR, visit_Sales_Rate_Oth_Curr: editedEntry.visit_Sales_Rate_Oth_Curr,  visit_Purchase_Rate_PKR: editedEntry.visit_Purchase_Rate_PKR, visit_Purchase_Rate_Oth_Cur: editedEntry.visit_Purchase_Rate_Oth_Cur,visit_Reference_In:editedEntry.visit_Reference_In, visit_Reference_In_Name: editedEntry.visit_Reference_In_Name,visit_Reference_Out:editedEntry.visit_Reference_Out, visit_Reference_Out_Name: editedEntry.visit_Reference_Out_Name, visit_Section_Picture: editedEntry.visit_Section_Picture, ticket_Sales_PKR: editedEntry.ticket_Sales_PKR, ticket_Sales_Rate_Oth_Cur: editedEntry.ticket_Sales_Rate_Oth_Cur,  ticket_Purchase_PKR: editedEntry.ticket_Purchase_PKR, ticket_Purchase_Rate_Oth_Cur: editedEntry.ticket_Purchase_Rate_Oth_Cur,ticket_Reference_In:editedEntry.ticket_Reference_In, ticket_Reference_In_Name: editedEntry.ticket_Reference_In_Name,ticket_Reference_Out:editedEntry.ticket_Reference_Out, ticket_Reference_Out_Name: editedEntry.ticket_Reference_Out_Name, ticket_Section_Picture: editedEntry.ticket_Section_Picture, azad_Visa_Sales_PKR: editedEntry.azad_Visa_Sales_PKR, azad_Visa_Sales_Rate_Oth_Cur: editedEntry.azad_Visa_Sales_Rate_Oth_Cur, azad_Visa_Purchase_PKR: editedEntry.azad_Visa_Purchase_PKR, azad_Visa_Purchase_Rate_Oth_Cur: editedEntry.azad_Visa_Purchase_Rate_Oth_Cur,azad_Visa_Reference_In:editedEntry.azad_Visa_Reference_In, azad_Visa_Reference_In_Name: editedEntry.azad_Visa_Reference_In_Name,azad_Visa_Reference_Out:editedEntry.azad_Visa_Reference_Out, azad_Visa_Reference_Out_Name: editedEntry.azad_Visa_Reference_Out_Name, azad_Visa_Section_Picture: editedEntry.azad_Visa_Section_Picture, protector_Price_In: editedEntry.protector_Price_In,protector_Price_In_Oth_Cur:editedEntry.protector_Price_In_Oth_Cur,protector_Reference_In:editedEntry.protector_Reference_In,protector_Reference_In_Name:editedEntry.protector_Reference_In_Name, protector_Price_Out: editedEntry.protector_Price_Out })
      })

      const json = await response.json()

      if (!response.ok) {
        if(json.redirect){
          if (window.confirm(json.message)){
            navigate(json.redirect)
        setDelLoading(false)

          }
        }
        else{
        setNewMessage(toast.error(json.message))
        setDelLoading(false)
        }
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

  // Filtering the Enteries
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [name, setName] = useState('')


  const [date, setDate] = useState('')
  const [trade, setTrade] = useState('')
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('')
  // const [flight_Date,, setFlight_Date] = useState('')
  const [final_Status, setFinal_Status] = useState('')
  const [entry_Mode, setEntry_Mode] = useState('')
  const [reference_Out, setReference_Out] = useState('')
  const [reference_In, setReference_In] = useState('')
  const [reference_Out_Type, setReference_Out_Type] = useState('')
  const [reference_In_Type, setReference_In_Type] = useState('')
  const [flight_Date, setFlight_Date] = useState('')

  const filteredEntries = enteries.filter(entry => {
    let isDateInRange = true;
    if (dateFrom && dateTo) {
      isDateInRange =
      entry.entry_Date && entry.entry_Date >= dateFrom && entry.entry_Date&& entry.entry_Date <= dateTo;
    }
    return (
      isDateInRange &&
      (entry.name && entry.name.trim().toLowerCase().startsWith(name.trim().toLowerCase()) ||
      entry.pp_No && entry.pp_No.trim().toLowerCase().startsWith(name.trim().toLowerCase()) ||
      entry.pp_No && entry.company.trim().toLowerCase().startsWith(name.trim().toLowerCase()) ||
      entry.pp_No && entry.country.trim().toLowerCase().startsWith(name.trim().toLowerCase()) ||
      entry.pp_No && entry.trade.trim().toLowerCase().startsWith(name.trim().toLowerCase()) ||
      entry.pp_No && entry.final_Status.trim().toLowerCase().startsWith(name.trim().toLowerCase()) ||
      entry.pp_No && entry.entry_Mode.trim().toLowerCase().startsWith(name.trim().toLowerCase())

    )&&
      entry.entry_Date && entry.entry_Date.toLowerCase().includes(date.toLowerCase()) &&
      entry.trade?.toLowerCase().includes(trade.toLowerCase()) &&
      entry.company?.toLowerCase().includes(company.toLowerCase()) &&
      entry.country?.toLowerCase().includes(country.toLowerCase()) &&
      entry.final_Status?.toLowerCase().includes(final_Status.toLowerCase()) &&
      entry.flight_Date?.toLowerCase().includes(flight_Date.toLowerCase()) &&
      entry.entry_Mode?.toLowerCase().includes(entry_Mode.toLowerCase()) &&
      entry.reference_Out_Name?.toLowerCase().includes(reference_Out.toLowerCase()) &&
      entry.reference_In_Name?.toLowerCase().includes(reference_In.toLowerCase()) &&
      entry.reference_Out?.toLowerCase().includes(reference_Out_Type.toLowerCase()) &&
      entry.reference_In?.toLowerCase().includes(reference_In_Type.toLowerCase())


    );
  })

  const[rowsValue,setRowsValue]=useState("")


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
          <div className='row shadow border-0'>
            <div className='col-md-12 p-0'>
              <div className='py-3 mb-2 px-2 d-flex justify-content-between border-bottom'>
                <div className="left d-flex">
                  <h4>Entries Details Report</h4>
                </div>
                <div className="right d-flex">
                  {enteries.length > 0 &&
                    <>
                      {/* <button className='btn pdf_btn m-1 btn-sm' onClick={downloadPDF}><i className="fa-solid fa-file-pdf me-1 "></i>Download PDF </button> */}
                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}><i className="fa-solid fa-file-excel me-1"></i>Download </button>
                    </>
                  }

                  <div className="dropdown d-inline m-1">
                    <button className="btn btn-sm" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                      More
                    </button>
                    <ul className="dropdown-menu shadow border-0" aria-labelledby="dropdownMenuLink">
                      <li className='my-1 py-1' onClick={() => setSection1(!section1)}>{!section1 ? "Show" : "Hide"} Visit Section</li>
                      <li className='my-1 py-1' onClick={() => setSection2(!section2)}>{!section2 ? "Show" : "Hide"} Ticket Section</li>
                      <li className='my-1 py-1' onClick={() => setSection3(!section3)}>{!section3 ? "Show" : "Hide"} Azad Section</li>
                      <li className='my-1 py-1' onClick={() => setSection4(!section4)}>{!section4 ? "Show" : "Hide"} Protectors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
           

            {/* Filters */}
            {enteries && enteries.length > 0 &&
              <div className="col-md-12 filters ">
                <div className='py-1 mb-2 '>
                  <div className="row">
                  <div className="col-auto px-1">
                      <label htmlFor="">Search by Name:</label><br/>
                     <input  type="search"value={name} onChange={(e)=>setName(e.target.value)} />
                    </div>
                  <div className="col-auto px-1">
                      <label htmlFor="">Date:</label><br/>
                      <select value={date} onChange={(e) => setDate(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.entry_Date))].map(dateValue => (
                          <option value={dateValue} key={dateValue}>{dateValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1">
                      <label htmlFor="">Date From:</label><br/>
                     <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
                    </div>
                    <div className="col-auto px-1">
                      <label htmlFor="">Date To:</label><br/>
                     <input  type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
                    </div>
                    <div className="col-auto px-1">
                      <label htmlFor="">Trade:</label><br/>
                      <select  value={trade} onChange={(e) => setTrade(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.trade))].map(tradeValue => (
                          <option key={tradeValue} value={tradeValue}>{tradeValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Company:</label><br/>
                      <select value={company} onChange={(e) => setCompany(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.company))].map(companyValue => (
                          <option key={companyValue} value={companyValue}>{companyValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Country:</label><br/>
                      <select value={country} onChange={(e) => setCountry(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.country))].map(countryValue => (
                          <option key={countryValue} value={countryValue}>{countryValue}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-auto px-1 ">
                      <label htmlFor="">Final Status:</label><br/>
                      <select  value={final_Status} onChange={(e) => setFinal_Status(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.final_Status))].map(final_StatusValue => (
                          <option key={final_StatusValue} value={final_StatusValue}>{final_StatusValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Flight Date:</label><br/>
                      <select  value={flight_Date} onChange={(e) => setFlight_Date(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.flight_Date))].map(flight_DateValue => (
                          <option key={flight_DateValue} value={flight_DateValue}>{flight_DateValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Entry Mode:</label><br/>
                      <select value={entry_Mode} onChange={(e) => setEntry_Mode(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.entry_Mode))].map(entry_ModeValue => (
                          <option key={entry_ModeValue} value={entry_ModeValue}>{entry_ModeValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference Out Type:</label><br/>
                      <select  value={reference_Out_Type} onChange={(e) => setReference_Out_Type(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        <option value="agent">Agents</option>
                        <option value="supplier">Suppliers</option>
                        <option value="candidate">Candidates</option>

                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference Out:</label><br/>
                      <select  value={reference_Out} onChange={(e) => setReference_Out(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.reference_Out_Name))].map(reference_Out_NameValue => (
                          <option key={reference_Out_NameValue} value={reference_Out_NameValue}>{reference_Out_NameValue}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference In Type:</label><br/>
                      <select  value={reference_In_Type} onChange={(e) => setReference_In_Type(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        <option value="agent">Agents</option>
                        <option value="supplier">Suppliers</option>
                        <option value="candidate">Candidates</option>
                      </select>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Reference In:</label><br/>
                      <select  value={reference_In} onChange={(e) => setReference_In(e.target.value)} className='m-0 p-1'>
                        <option value="">All</option>
                        {[...new Set(enteries.map(data => data.reference_In_Name))].map(reference_In_NameValue => (
                          <option key={reference_In_NameValue} value={reference_In_NameValue}>{reference_In_NameValue}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>
              </div>
            }
            
              <div className='col-md-12 p-0'>
                <div className='py-3 mb-1 detail_table'>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex left">
                    <label htmlFor="" className='my-2 mx-1'>Show Entries: </label><br/>
                  <select  name="" className='my-2 mx-1' value={rowsValue} onChange={(e)=>setRowsValue(e.target.value)} id="" style={{height:'25px',zIndex:'999'}}>
                    <option value="">All</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                    <option value="120">120</option>
                    <option value="150">150</option>
                    <option value="200">200</option>
                    <option value="250">250</option>
                    <option value="300">300</option>
                  </select>
                    </div>
                    <div className="d-flex right">
                     {multipleIds.length>0 &&  <button className='btn btn-danger btn-sm rounded text-white shadow' onClick={()=>deleteMultipleEntries()} style={{height:'30px',fontWeight:'600'}} disabled={delLoading}>Delete</button>}
                    </div>

                  </div>
                  
                  <TableContainer>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow className='p-0 m-0'>
                          <TableCell align="left" className='personel_label border py-2' colSpan={22}>
                            Personel Details
                          </TableCell>
                          {section1 &&
                            <TableCell align="left" className='visit_label border  py-2' colSpan={9}>
                              Visit Sales Purchase Details
                            </TableCell>
                          }
                          {section2 &&

                            <TableCell align="left" className='ticket_label border  py-2' colSpan={9}>
                              Ticket Sales Purchase Details
                            </TableCell>
                          }
                          {section3 &&
                            <TableCell align="left" className='azad_label border  py-2' colSpan={9}>
                              Azad Visa Sales Purchase Details
                            </TableCell>
                          }
                          {section4 &&
                            <TableCell align="left" className='protector_label border  py-2' colSpan={5}>
                              Protector Details
                            </TableCell>
                          }


                          <TableCell align="left" className='edw_label border py-2' colSpan={1}>
                            Edit/Delete
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='label border text-center px-1'>Select</TableCell>
                          <TableCell className='label border text-center px-1'>SN</TableCell>
                          <TableCell className='label border text-center px-1'>Date</TableCell>
                          <TableCell className='label border text-center px-1'>Name</TableCell>
                          <TableCell className='label border text-center px-1'>PP#</TableCell>
                          <TableCell className='label border text-center px-1'>Trade</TableCell>
                          <TableCell className='label border text-center px-1'>Company</TableCell>
                          <TableCell className='label border text-center px-1'>Remarks</TableCell>
                          <TableCell className='label border text-center px-1'>Contact</TableCell>
                          <TableCell className='label border text-center px-1'>FS</TableCell>
                          <TableCell className='label border text-center px-1'>FD</TableCell>
                          <TableCell className='label border text-center px-1'>Country</TableCell>
                          <TableCell className='label border text-center px-1'>EM</TableCell>
                          <TableCell className='label border text-center px-1'>VSR_PKR</TableCell>
                          <TableCell className='label border text-center px-1'>VSR_Oth_Curr</TableCell>
                          <TableCell className='label border text-center px-1'>RO</TableCell>
                          <TableCell className='label border text-center px-1'>RO_Name</TableCell>
                          <TableCell className='label border text-center px-1'>RI</TableCell>
                          <TableCell className='label border text-center px-1'>RI_Name</TableCell>
                          <TableCell className='label border text-center px-1'>VPR_PKR</TableCell>
                          <TableCell className='label border text-center px-1'>VPR_Oth_Curr</TableCell>
                          <TableCell className='label border text-center px-1'>Picture</TableCell>
                          {section1 &&
                            <>
                              {/* Visit Sales Purchase Parties Section*/}
                              <TableCell className='label border text-center px-1'>VSR_PKR</TableCell>
                              <TableCell className='label border text-center px-1'>VSR_Cur</TableCell>
                              <TableCell className='label border text-center px-1'>RO</TableCell>
                              <TableCell className='label border text-center px-1'>RO_Name</TableCell>
                              <TableCell className='label border text-center px-1'>RI</TableCell>
                              <TableCell className='label border text-center px-1'>RI_Name</TableCell>
                              <TableCell className='label border text-center px-1'>VPR_PKR</TableCell>
                              <TableCell className='label border text-center px-1'>VPR_Curr</TableCell>
                              <TableCell className='label border text-center px-1'>Picture</TableCell>
                            </>
                          }

                          {section2 &&
                            <>
                              {/* Ticket Sales Purchase Parties Section*/}

                              <TableCell className='label border text-center px-1'>TSR_PKR</TableCell>
                              <TableCell className='label border text-center px-1'>TSR_Curr</TableCell>
                           
                              <TableCell className='label border text-center px-1'>RO</TableCell>
                              <TableCell className='label border text-center px-1'>RO_Name</TableCell>
                              <TableCell className='label border text-center px-1'>RI</TableCell>
                              <TableCell className='label border text-center px-1'>RI_Name</TableCell>
                              <TableCell className='label border text-center px-1'>TPR_PKR</TableCell>
                              <TableCell className='label border text-center px-1'>TPR_Curr</TableCell>
                              <TableCell className='label border text-center px-1'>Picture</TableCell>

                            </>
                          }

                          {section3 &&
                            <>
                              {/* Azad Visa Sales Purchase Parties Section*/}
                              <TableCell className='label border text-center px-1'>AVSR_PKR</TableCell>
                              <TableCell className='label border text-center px-1'>AVSR_Curr</TableCell>
                             
                              <TableCell className='label border text-center px-1'>RO</TableCell>
                              <TableCell className='label border text-center px-1'>RO_Name</TableCell>
                              <TableCell className='label border text-center px-1'>RI</TableCell>
                              <TableCell className='label border text-center px-1'>RI_Name</TableCell>
                              <TableCell className='label border text-center px-1'>AVPR_PKR</TableCell>
                              <TableCell className='label border text-center px-1'>AVPR_Curr</TableCell>
                              <TableCell className='label border text-center px-1'>Picture</TableCell>

                            </>
                          }


                          {section4 &&
                            <>
                              {/* Protector Section*/}
                              <TableCell className='label border text-center px-1'>PP_In</TableCell>
                              <TableCell className='label border text-center px-1'>PP_In_Curr</TableCell>
                              <TableCell className='label border text-center px-1'>RI</TableCell>
                              <TableCell className='label border text-center px-1'>RI_Name</TableCell>
                              <TableCell className='label border text-center px-1'>PP_Out</TableCell>

                            </>
                          }


                          {/* Add more table header cells for other fields */}
                          <TableCell align='left' className='edw_label border text-center px-1' colSpan={1}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>


                      <TableBody>
                        {filteredEntries && filteredEntries.length > 0 ? filteredEntries.slice(0,rowsValue ? rowsValue : undefined).map((entry, index) => (
                          <TableRow key={entry._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                            {editMode && editedRowIndex === index ? (
                              // Render input fields or editable elements when in edit mode for the specific row
                              <>
                               <TableCell className='border data_td p-0 text-center'>
                                <input className='p-0' type='checkbox'  onChange={(e) => handleEntryId(entry._id, e.target.checked)} />
                              </TableCell>
                               <TableCell className='border data_td p-0 '>
                                <input className='p-0' type='text' value={index+1} readOnly />
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <input className='p-0' type='text' value={editedEntry.entry_Date} readOnly />
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <input className='p-0' type='text' value={editedEntry.name} onChange={(e) => handleInputChange(e, 'name')} />
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <input className='p-0' type='text' value={editedEntry.pp_No} onChange={(e) => handleInputChange(e, 'pp_No')} />
                              </TableCell>
                              <TableCell className='border data_td p-0 '>

                                <select className='p-0' value={editedEntry.trade} onChange={(e) => handleInputChange(e, 'trade')} >
                                  <option value={editedEntry.trade}>{editedEntry.trade}</option>
                                  {trades && trades.map((data) => (
                                    <option key={data._id} value={data.trade}>{data.trade}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <select className='p-0' value={editedEntry.company} onChange={(e) => handleInputChange(e, 'company')} >
                                  <option value={editedEntry.company}>{editedEntry.company}</option>
                                  {companies && companies.map((data) => (
                                    <option key={data._id} value={data.company}>{data.company}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <input className='p-0' type='text' value={editedEntry.remarks} onChange={(e) => handleInputChange(e, 'remarks')} />
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <input className='p-0' type='number' min='0' value={editedEntry.contact} onChange={(e) => handleInputChange(e, 'contact')} />
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <select className='p-0' value={editedEntry.final_Status} onChange={(e) => handleInputChange(e, 'final_Status')} >
                                  <option value={editedEntry.final_Status}>{editedEntry.final_Status}</option>
                                  {finalStatus && finalStatus.map((data) => (
                                    <option key={data._id} value={data.final_Status}>{data.final_Status}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-0  '>
                                <input className='p-0' type='date' onChange={(e) => handleInputChange(e, 'flight_Date')} />
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <select className='p-0' value={editedEntry.country} onChange={(e) => handleInputChange(e, 'country')} >
                                  <option value={editedEntry.country}>{editedEntry.country}</option>
                                  {countries && countries.map((data) => (
                                    <option key={data._id} value={data.country}>{data.country}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <select className='p-0' value={editedEntry.entry_Mode} onChange={(e) => handleInputChange(e, 'entry_Mode')} >
                                  <option value={editedEntry.entry_Mode}>{editedEntry.entry_Mode}</option>
                                  {entryMode && entryMode.map((data) => (
                                    <option key={data._id} value={data.entry_Mode}>{data.entry_Mode}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <input className='p-0' type='number' min='0' value={editedEntry.visa_Sales_Rate_PKR} onChange={(e) => handleInputChange(e, 'visa_Sales_Rate_PKR')} />
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <input className='p-0' type='number' min='0' value={editedEntry.visa_Sale_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'visa_Sale_Rate_Oth_Cur')} />
                              </TableCell>
                             
                              <TableCell className='border data_td p-0 '>
                                <select className='p-0' required value={editedEntry.reference_Out} onChange={(e) => handleInputChange(e, 'reference_Out')} >
                                {(editedEntry.reference_Out&&(editedEntry.reference_Out?.toLowerCase()===''||editedEntry.reference_Out?.toLowerCase()===null||editedEntry.reference_Out?.toLowerCase()===undefined)) &&
                                  <>
                                  <option className="my-1 py-2" value="">Choose Reference</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                  {(editedEntry.reference_Out?.toLowerCase().includes('candidate')||editedEntry.reference_Out?.toLowerCase().includes('direct')) &&
                                  <>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                   {(editedEntry.reference_Out?.toLowerCase().includes('supplier')||editedEntry.reference_Out?.toLowerCase().includes('suplier')) &&
                                  <>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                    {(editedEntry.reference_Out?.toLowerCase().includes('agent')||editedEntry.reference_Out?.toLowerCase().includes('agnet')) &&
                                  <>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                 
                                </select>

                              </TableCell>

                              <TableCell className='border data_td p-0 '>
                              
                                  
                                  {(editedEntry.reference_Out?.toLowerCase() === "candidate" || editedEntry.reference_Out?.toLowerCase() === "candidates")  ? (
                                  <input className='p-0'
                                    type="text"
                                    placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                                    value={editedEntry.name}

                                    readOnly />
                                ) : (

                                  <select className='p-0' required value={editedEntry.reference_Out_Name} onChange={(e) => handleInputChange(e, 'reference_Out_Name')} >
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

                              <TableCell className='border data_td p-0 '>
                                <select className='p-0' required value={editedEntry.reference_In} onChange={(e) => handleInputChange(e, 'reference_In')} >
                                {(editedEntry.reference_In&&(editedEntry.reference_In?.toLowerCase()===''||editedEntry.reference_In?.toLowerCase()===null||editedEntry.reference_In?.toLowerCase()===undefined)) &&
                                  <>
                                  <option className="my-1 py-2" value="">Choose Reference</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                {(editedEntry.reference_In?.toLowerCase().includes('candidate')||editedEntry.reference_In?.toLowerCase().includes('direct')) &&
                                  <>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                   {(editedEntry.reference_In?.toLowerCase().includes('supplier')||editedEntry.reference_In?.toLowerCase().includes('suplier')) &&
                                  <>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                    {(editedEntry.reference_In?.toLowerCase().includes('agent')||editedEntry.reference_In?.toLowerCase().includes('agnet')) &&
                                  <>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                </select>

                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                            
                                    {(editedEntry.reference_In.toLowerCase() === "candidate" || editedEntry.reference_In.toLowerCase() === "candidates") ? (
                <input className='p-0'
                  type="text"
                  placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                  value={editedEntry.name}

                  readOnly
                />
              ) : (
                <select className='p-0'
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
                              <TableCell className='border data_td p-0 '>
                                <input className='p-0' type='number' min='0' value={editedEntry.visa_Purchase_Rate_PKR} onChange={(e) => handleInputChange(e, 'visa_Purchase_Rate_PKR')} />
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <input className='p-0' type='number' min='0' value={editedEntry.visa_Purchase_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'visa_Purchase_Rate_Oth_Cur')} />
                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                                <input className='p-0' type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'picture')} />
                              </TableCell>

                              {section1 &&
                                <>
                                  {/* Visit Section */}

       
                                 
                                  <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='number' value={editedEntry.visit_Sales_PKR} onChange={(e) => handleInputChange(e, 'visit_Sales_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-0 '>
                                  <input className='p-0' type='number' value={editedEntry.visit_Sales_Rate_Oth_Curr} onChange={(e) => handleInputChange(e, 'visit_Sales_Rate_Oth_Curr')} />

                                  </TableCell>
                                 
                                  <TableCell className='border data_td p-0 '>
                                  <select className='p-0' required value={editedEntry.visit_Reference_Out} onChange={(e) => handleInputChange(e, 'visit_Reference_Out')} >
                                  {(editedEntry.visit_Reference_Out &&(editedEntry.visit_Reference_Out?.toLowerCase()===''||editedEntry.visit_Reference_Out?.toLowerCase()===null||editedEntry?.visit_Reference_Out.toLowerCase()===undefined)) &&
                                  <>
                                  <option className="my-1 py-2" value="">Choose Reference</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                  {(editedEntry.visit_Reference_Out?.toLowerCase().includes('candidate')||editedEntry.visit_Reference_Out?.toLowerCase().includes('direct')) &&
                                  <>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                   {(editedEntry.visit_Reference_Out?.toLowerCase().includes('supplier')||editedEntry.visit_Reference_Out?.toLowerCase().includes('suplier')) &&
                                  <>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                    {(editedEntry.visit_Reference_Out?.toLowerCase().includes('agent')||editedEntry.visit_Reference_Out?.toLowerCase().includes('agnet')) &&
                                  <>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                  </select>
                                  </TableCell>


                                  <TableCell className='border data_td p-0 '>
                             
                                  {editedEntry.visit_Reference_Out &&(editedEntry.visit_Reference_Out.toLowerCase() === "candidate" || editedEntry.visit_Reference_Out.toLowerCase() === "candidates")  ? (
                                  <input className='p-0'
                                    type="text"
                                    placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                                    value={editedEntry.name}

                                    readOnly />
                                ) : (

                                  <select className='p-0' required value={editedEntry.visit_Reference_Out_Name} onChange={(e) => handleInputChange(e, 'visit_Reference_Out_Name')} >
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
                              <TableCell className='border data_td p-0 '>
                                <select className='p-0' required value={editedEntry.visit_Reference_In} onChange={(e) => handleInputChange(e, 'visit_Reference_In')} >
                                {(editedEntry.visit_Reference_In&&(editedEntry.visit_Reference_In?.toLowerCase()===''||editedEntry.visit_Reference_In?.toLowerCase()===null||editedEntry.visit_Reference_In?.toLowerCase()===undefined)) &&
                                  <>
                                  <option className="my-1 py-2" value="">Choose Reference</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                {(editedEntry.visit_Reference_In?.toLowerCase().includes('candidate')||editedEntry.visit_Reference_In?.toLowerCase().includes('direct')) &&
                                  <>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                   {(editedEntry.visit_Reference_In?.toLowerCase().includes('supplier')||editedEntry.visit_Reference_In?.toLowerCase().includes('suplier')) &&
                                  <>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                    {(editedEntry.visit_Reference_In?.toLowerCase().includes('agent')||editedEntry.visit_Reference_In?.toLowerCase().includes('agnet')) &&
                                  <>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                </select>

                              </TableCell>
                              <TableCell className='border data_td p-0 '>
           
                                    {editedEntry.visit_Reference_In &&(editedEntry.visit_Reference_In.toLowerCase() === "candidate" || editedEntry.visit_Reference_In.toLowerCase() === "candidates") ? (
                <input className='p-0'
                  type="text"
                  placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                  value={editedEntry.name}

                  readOnly
                />
              ) : (
                <select className='p-0'
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
                              <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='number' value={editedEntry.visit_Purchase_Rate_PKR} onChange={(e) => handleInputChange(e, 'visit_Purchase_Rate_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-0 '>
                                  <input className='p-0' type='number' value={editedEntry.visit_Purchase_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'visit_Purchase_Rate_Oth_Cur')} />

                                  </TableCell>
                                  <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'visit_Section_Picture')} />
                                  </TableCell>
                                </>
                              }

                              {section2 &&
                                <>

                                  {/* Ticket Section */}
                                  
                                  

                                  <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='number' min='0' value={editedEntry.ticket_Sales_PKR} onChange={(e) => handleInputChange(e, 'ticket_Sales_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-0 '>
                                  <input className='p-0' type='number' value={editedEntry.ticket_Sales_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'ticket_Sales_Rate_Oth_Cur')} />

                                  </TableCell>
                                  
                                  <TableCell className='border data_td p-0 '>
                                  <select className='p-0' required value={editedEntry.ticket_Reference_Out} onChange={(e) => handleInputChange(e, 'ticket_Reference_Out')} >
                                  {(editedEntry.ticket_Reference_Out&&(editedEntry.ticket_Reference_Out?.toLowerCase()===''||editedEntry.ticket_Reference_Out?.toLowerCase()===null||editedEntry.ticket_Reference_Out?.toLowerCase()===undefined)) &&
                                  <>
                                  <option className="my-1 py-2" value="">Choose Reference</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                  {(editedEntry.ticket_Reference_Out?.toLowerCase().includes('candidate')||editedEntry.ticket_Reference_Out?.toLowerCase().includes('direct')) &&
                                  <>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                   {(editedEntry.ticket_Reference_Out?.toLowerCase().includes('supplier')||editedEntry.ticket_Reference_Out?.toLowerCase().includes('suplier')) &&
                                  <>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                    {(editedEntry.ticket_Reference_Out?.toLowerCase().includes('agent')||editedEntry.ticket_Reference_Out?.toLowerCase().includes('agnet')) &&
                                  <>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                  </select>
                                  </TableCell>


                                  <TableCell className='border data_td p-0 '>
                               
                                  {editedEntry.ticket_Reference_Out &&(editedEntry.ticket_Reference_Out.toLowerCase() === "candidate" || editedEntry.ticket_Reference_Out.toLowerCase() === "candidates")  ? (
                                  <input className='p-0'
                                    type="text"
                                    placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                                    value={editedEntry.name}

                                    readOnly />
                                ) : (

                                  <select className='p-0' required value={editedEntry.ticket_Reference_Out_Name} onChange={(e) => handleInputChange(e, 'ticket_Reference_Out_Name')} >
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
                              <TableCell className='border data_td p-0 '>
                                <select className='p-0' required value={editedEntry.ticket_Reference_In} onChange={(e) => handleInputChange(e, 'ticket_Reference_In')} >
                                {(editedEntry.ticket_Reference_In&&(editedEntry.ticket_Reference_In?.toLowerCase()===''||editedEntry.ticket_Reference_In?.toLowerCase()===null||editedEntry.ticket_Reference_In?.toLowerCase()===undefined)) &&
                                  <>
                                  <option className="my-1 py-2" value="">Choose Reference</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                {(editedEntry.ticket_Reference_In?.toLowerCase().includes('candidate')||editedEntry.ticket_Reference_In?.toLowerCase().includes('direct')) &&
                                  <>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                   {(editedEntry.ticket_Reference_In?.toLowerCase().includes('supplier')||editedEntry.ticket_Reference_In?.toLowerCase().includes('suplier')) &&
                                  <>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                    {(editedEntry.ticket_Reference_In?.toLowerCase().includes('agent')||editedEntry.ticket_Reference_In?.toLowerCase().includes('agnet')) &&
                                  <>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                </select>

                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                             
                                    {editedEntry.ticket_Reference_In &&(editedEntry.ticket_Reference_In.toLowerCase() === "candidate" || editedEntry.ticket_Reference_In.toLowerCase() === "candidates") ? (
                <input className='p-0'
                  type="text"
                  placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                  value={editedEntry.name}

                  readOnly
                />
              ) : (
                <select className='p-0'
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
                              <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='number' value={editedEntry.ticket_Purchase_PKR} onChange={(e) => handleInputChange(e, 'ticket_Purchase_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-0 '>

                                  <input className='p-0' type='number' value={editedEntry.ticket_Purchase_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'ticket_Purchase_Rate_Oth_Cur')} />
                                    
                                  </TableCell>
                                   <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'ticket_Section_Picture')} />
                                  </TableCell>
                                </>
                              }

                              {section3 &&
                                <>
                                  {/* Azad Visa Sales Purchase Section Data */}

                                   <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='number' value={editedEntry.azad_Visa_Sales_PKR} onChange={(e) => handleInputChange(e, 'azad_Visa_Sales_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-0 '>

                                  <input className='p-0' type='number' value={editedEntry.azad_Visa_Sales_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'azad_Visa_Sales_Rate_Oth_Cur')} />

                                  </TableCell>

                                 
                                  <TableCell className='border data_td p-0 '>
                                  <select className='p-0' required value={editedEntry.azad_Reference_Out} onChange={(e) => handleInputChange(e, 'azad_Reference_Out')} >
                                  {(editedEntry.azad_Reference_Out&&(editedEntry.azad_Reference_Out?.toLowerCase()===''||editedEntry.azad_Reference_Out?.toLowerCase()===null||editedEntry.azad_Reference_Out?.toLowerCase()===undefined)) &&
                                  <>
                                  <option className="my-1 py-2" value="">Choose Reference</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                  {(editedEntry.azad_Reference_Out?.toLowerCase().includes('candidate')||editedEntry.azad_Reference_Out?.toLowerCase().includes('direct')) &&
                                  <>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                   {(editedEntry.azad_Reference_Out?.toLowerCase().includes('supplier')||editedEntry.azad_Reference_Out?.toLowerCase().includes('suplier')) &&
                                  <>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                    {(editedEntry.azad_Reference_Out?.toLowerCase().includes('agent')||editedEntry.azad_Reference_Out?.toLowerCase().includes('agnet')) &&
                                  <>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                  </select>
                                  </TableCell>


                                  <TableCell className='border data_td p-0 '>
                              
                                  {editedEntry.azad_Reference_Out &&(editedEntry.azad_Reference_Out.toLowerCase() === "candidate" || editedEntry.azad_Reference_Out.toLowerCase() === "candidates")  ? (
                                  <input className='p-0'
                                    type="text"
                                    placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                                    value={editedEntry.name}

                                    readOnly />
                                ) : (

                                  <select className='p-0' required value={editedEntry.azad_Reference_Out_Name} onChange={(e) => handleInputChange(e, 'azad_Reference_Out_Name')} >
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
                              <TableCell className='border data_td p-0 '>
                                <select className='p-0' required value={editedEntry.azad_Reference_In} onChange={(e) => handleInputChange(e, 'azad_Reference_In')} >
                                {(editedEntry.azad_Reference_In&&(editedEntry.azad_Reference_In?.toLowerCase()===''||editedEntry.azad_Reference_In?.toLowerCase()===null||editedEntry.azad_Reference_In?.toLowerCase()===undefined)) &&
                                  <>
                                  <option className="my-1 py-2" value="">Choose Reference</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                {(editedEntry.azad_Reference_In?.toLowerCase().includes('candidate')||editedEntry.azad_Reference_In?.toLowerCase().includes('direct')) &&
                                  <>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  </>
                                  }
                                   {(editedEntry.azad_Reference_In?.toLowerCase().includes('supplier')||editedEntry.azad_Reference_In?.toLowerCase().includes('suplier')) &&
                                  <>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                    {(editedEntry.azad_Reference_In?.toLowerCase().includes('agent')||editedEntry.azad_Reference_In?.toLowerCase().includes('agnet')) &&
                                  <>
                                  <option className="my-1 py-2" value="agent">Agents</option>
                                  <option className="my-1 py-2" value="supplier">Suppliers</option>
                                  <option className="my-1 py-2" value="candidate">Candidate</option>
                                  </>
                                  }
                                </select>

                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                             
                                    {editedEntry.azad_Reference_In &&(editedEntry.azad_Reference_In.toLowerCase() === "candidate" || editedEntry.azad_Reference_In.toLowerCase() === "candidates") ? (
                <input className='p-0'
                  type="text"
                  placeholder={`${editedEntry.name} / ${editedEntry.pp_No}`}
                  value={editedEntry.name}

                  readOnly
                />
              ) : (
                <select className='p-0'
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
                              <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='number' value={editedEntry.azad_Visa_Purchase_PKR} onChange={(e) => handleInputChange(e, 'azad_Visa_Purchase_PKR')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-0 '>

                                  <input className='p-0' type='number' value={editedEntry.azad_Visa_Purchase_Rate_Oth_Cur} onChange={(e) => handleInputChange(e, 'azad_Visa_Purchase_Rate_Oth_Cur')} />

                                  </TableCell>
                                  <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'azad_Visa_Section_Picture')} />
                                  </TableCell>
                                </>
                              }

                              {section4 &&
                                <>
                                  {/* Protector Section*/}
                                  <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='number' value={editedEntry.protector_Price_In} onChange={(e) => handleInputChange(e, 'protector_Price_In')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='number' value={editedEntry.protector_Price_In_Oth_Cur} onChange={(e) => handleInputChange(e, 'protector_Price_In_Oth_Cur')} />
                                  </TableCell>

                                  <TableCell className='border data_td p-0 '>
                                <select className='p-0' required value={editedEntry.protector_Reference_In} onChange={(e) => handleInputChange(e, 'protector_Reference_In')} >
                                  
                                  <option className="my-1 py-2" value="protector">Protector</option>
                                
                                </select>

                              </TableCell>
                              <TableCell className='border data_td p-0 '>
                              
                                  <select className='p-0' required value={editedEntry.protector_Reference_In_Name} onChange={(e) => handleInputChange(e, 'protector_Reference_In_Name')} >
                               
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
                                  
                                </select>
                             
                          
                              </TableCell>
                              
                                  <TableCell className='border data_td p-0 '>
                                    <input className='p-0' type='number' value={editedEntry.protector_Price_Out} onChange={(e) => handleInputChange(e, 'protector_Price_Out')} />
                                  </TableCell>
                                </>
                              }



                            </>
                            ) : (
                              // Render plain text or non-editable elements when not in edit mode or for other rows
                              <>
                              <TableCell className='border data_td px-1 py-0 text-center'>
                                <input className='p-0' type='checkbox'  onChange={(e) => handleEntryId(entry._id, e.target.checked)} />
                              </TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{index+1}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.entry_Date}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.name}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.pp_No}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.trade}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.company}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.remarks}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.contact}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.final_Status}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.flight_Date}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.country}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.entry_Mode}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.visa_Sales_Rate_PKR}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.visa_Sale_Rate_Oth_Cur}</TableCell>
                              
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.reference_Out}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.reference_Out_Name}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.reference_In}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.reference_In_Name}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.visa_Purchase_Rate_PKR}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.visa_Purchase_Rate_Oth_Cur}</TableCell>
                                <TableCell className='border data_td px-1 py-0 text-center'>{entry.picture ? <a href={entry.picture} target="_blank" rel="noopener noreferrer"> <img src={entry.picture} alt='Images' className='rounded text-center mx-auto' /></a>  : "No Picture"}</TableCell>

                                {section1 &&
                                  <>

                                    {/* Visit Sales Purchase Section Data */}
                                   
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.visit_Sales_PKR}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.visit_Sales_Rate_Oth_Curr}</TableCell>
                                   
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.visit_Reference_Out}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.visit_Reference_Out_Name}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.visit_Reference_In}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.visit_Reference_In_Name}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.visit_Purchase_Rate_PKR}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.visit_Purchase_Rate_Oth_Cur}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.visit_Section_Picture ? <a href={entry.visit_Section_Picture} target="_blank" rel="noopener noreferrer"> <img src={entry.visit_Section_Picture} alt='Images' className='rounded text-center mx-auto' /></a>  : "No Picture"}</TableCell>

                                  </>
                                }

                                {section2 &&
                                  <>
                                    {/* Ticket Sales Purchase Section Data */}
                                   
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.ticket_Sales_PKR}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.ticket_Sales_Rate_Oth_Cur}</TableCell>
                                   
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.ticket_Reference_Out}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.ticket_Reference_Out_Name}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.ticket_Reference_In}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.ticket_Reference_In_Name}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.ticket_Purchase_PKR}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.ticket_Purchase_Rate_Oth_Cur}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.ticket_Section_Picture ? <a href={entry.ticket_Section_Picture} target="_blank" rel="noopener noreferrer"> <img src={entry.ticket_Section_Picture} alt='Images' className='rounded text-center mx-auto' /></a>  : "No Picture"}</TableCell>

                                  </>
                                }

                                {section3 &&
                                  <>
                                    {/* Azad Visa Sales Purchase Section Data */}
                                  
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.azad_Visa_Sales_PKR}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.azad_Visa_Sales_Rate_Oth_Cur}</TableCell>
                                  
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.azad_Visa_Reference_Out}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.azad_Visa_Reference_Out_Name}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.azad_Visa_Reference_In}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.azad_Visa_Reference_In_Name}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.azad_Visa_Purchase_PKR}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.azad_Visa_Purchase_Rate_Oth_Cur}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.azad_Visa_Section_Picture ? <a href={entry.azad_Visa_Section_Picture} target="_blank" rel="noopener noreferrer"> <img src={entry.azad_Visa_Section_Picture} alt='Images' className='rounded text-center mx-auto' /></a>  : "No Picture"}</TableCell>

                                  </>
                                }

                                {section4 &&
                                  <>
                                    {/* Protector Section Data */}
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.protector_Price_In}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.protector_Price_In_Oth_Cur}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.protector_Reference_In}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.protector_Reference_In_Name}</TableCell>
                                    <TableCell className='border data_td px-1 py-0 text-center'>{entry.protector_Price_Out}</TableCell>
                                  </>
                                }

                                {/* Repeat similar blocks for other non-editable fields */}
                              </>
                            )}
                            <TableCell className='border data_td px-1 py-0 text-center'>
                              {editMode && editedRowIndex === index ? (
                                // Render Save button when in edit mode for the specific row
                                <>
                                  <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button onClick={() => setEditMode(!editMode)} className='btn delete_btn btn-sm'><i className="fa-solid fa-xmark"></i></button>
                                    <button onClick={() => handleUpdate()} className='btn save_btn btn-sm' disabled={updateLoading}><i className="fa-solid fa-check"></i></button>

                                  </div>

                                </>

                              ) : (
                                // Render Edit button when not in edit mode or for other rows
                                <>
                                  <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button onClick={() => handleEditClick(entry, index)} className='btn edit_btn btn-sm'><i className="fa-solid fa-pen-to-square"></i></button>
                                    <button className='btn delete_btn btn-sm' onClick={() => deleteEntry(entry)} disabled={delLoading}><i className="fa-solid fa-trash-can"></i></button>
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
                 
                </div>
              </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default EntryReports;
