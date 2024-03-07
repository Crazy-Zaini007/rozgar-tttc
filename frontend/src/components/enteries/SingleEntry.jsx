import React, { useState, useEffect } from 'react'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TourIcon from '@mui/icons-material/Tour';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import ShieldIcon from '@mui/icons-material/Shield';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { addEntry } from '../../redux/reducers/entrySlice';
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
import ProtectorHook from '../../hooks/settingHooks/ProtectorHook';

import VSPHook from '../../hooks/settingHooks/VSPHook'
export default function SingleEntry() {
  const [section1, setSection1] = useState(0)
  const [section2, setSection2] = useState(0)
  const [section3, setSection3] = useState(0)
  const [section4, setSection4] = useState(0)

  // form states
  // Main section states

  const [name, setName] = useState('')
  const [pp_No, setPP_No] = useState('')
  const [trade, setTrade] = useState('')
  const [company, setCompany] = useState('')
  const [contact, setContact] = useState('')
  const [country, setCountry] = useState('')
  const [flight_Date, setFlight_Date] = useState('')
  const [final_Status, setFinal_Status] = useState('')
  const [remarks, setRemarks] = useState('')
  const [entry_Mode, setEntry_Mode] = useState('')
  const [reference_Out, setReference_Out] = useState('')
  const [reference_Out_Name, setReference_Out_Name] = useState('')
  const [visa_Sales_Rate_PKR, setVisa_Sales_Rate_PKR] = useState('')
  const [visa_Sale_Rate_Oth_Cur, setVisa_Sale_Rate_Oth_Cur] = useState('')
  const [cur_Country_One, setCur_Country_One] = useState('')
  const [reference_In, setReference_In] = useState('')
  const [reference_In_Name, setReference_In_Name] = useState('')
  const [visa_Purchase_Rate_PKR, setVisa_Purchase_Rate_PKR] = useState('')
  const [visa_Purchase_Rate_Oth_Cur, setVisa_Purchase_Rate_Oth_Cur] = useState('')
  const [cur_Country_Two, setCur_Country_Two] = useState('')
  const [picture, setPicture] = useState('')

  //  Visit Sales Purchase Parties Section States
  const [visit_Sales_PKR, setVisit_Sales_PKR] = useState('')
  const [visit_Sales_Rate_Oth_Curr, setVisit_Sales_Rate_Oth_Curr] = useState('')
  const [visit_Sales_Cur, setVisit_Sales_Cur] = useState('')

  const [visit_Purchase_Rate_PKR, setVisit_Purchase_Rate_PKR] = useState('')
  const [visit_Purchase_Rate_Oth_Cur, setVisit_Purchase_Rate_Oth_Cur] = useState('')
  const [visit_Purchase_Cur, setVisit_Purchase_Cur] = useState('')

  const [visit_Section_Picture, setVisit_Section_Picture] = useState('')
  const [visit_Reference_In_Name, setVisit_Reference_In_Name] = useState('')
  const [visit_Reference_Out_Name, setVisit_Reference_Out_Name] = useState('')
  const [visit_Reference_In, setVisit_Reference_In] = useState('')
  const [visit_Reference_Out, setVisit_Reference_Out] = useState('')

  // Ticket Sales Purchase Parties Section States

  const [ticket_Sales_PKR, setTicket_Sales_PKR] = useState('')
  const [ticket_Sales_Rate_Oth_Cur, setTicket_Sales_Rate_Oth_Cur] = useState('')
  const [ticket_Sales_Cur, setTicket_Sales_Cur] = useState('')

  const [ticket_Purchase_PKR, setTicket_Purchase_PKR] = useState('')
  const [ticket_Purchase_Rate_Oth_Cur, setTicket_Purchase_Rate_Oth_Cur] = useState('')
  const [ticket_Purchase_Cur, setTicket_Purchase_Cur] = useState('')

  const [ticket_Section_Picture, setTicket_Section_Picture] = useState('')
  const [ticket_Reference_In_Name, setTicket_Reference_In_Name] = useState('')
  const [ticket_Reference_Out_Name, setTicket_Reference_Out_Name] = useState('')
  const [ticket_Reference_In, setTicket_Reference_In] = useState('')
  const [ticket_Reference_Out, setTicket_Reference_Out] = useState('')
  // Azad Visa Sales Purchase Section States

  const [azad_Visa_Sales_PKR, setAzad_Visa_Sales_PKR] = useState('')
  const [azad_Visa_Sales_Rate_Oth_Cur, setAzad_Visa_Sales_Rate_Oth_Cur] = useState('')
  const [azad_Visa_Sales_Cur, setAzad_Visa_Sales_Cur] = useState('')

  const [azad_Visa_Purchase_PKR, setAzad_Visa_Purchase_PKR] = useState('')
  const [azad_Visa_Purchase_Rate_Oth_Cur, setAzad_Visa_Purchase_Rate_Oth_Cur] = useState('')
  const [azad_Visa_Purchase_Cur, setAzad_Visa_Purchase_Cur] = useState('')

  const [azad_Visa_Section_Picture, setAzad_Visa_Section_Picture] = useState('')
  const [azad_Visa_Reference_In_Name, setAzad_Visa_Reference_In_Name] = useState('')
  const [azad_Visa_Reference_Out_Name, setAzad_Visa_Reference_Out_Name] = useState('')
  const [azad_Visa_Reference_In, setAzad_Visa_Reference_In] = useState('')
  const [azad_Visa_Reference_Out, setAzad_Visa_Reference_Out] = useState('')
  // Protector Section States
  const [protector_Price_In, setProtector_Price_In] = useState('')
  const [protector_Price_In_Oth_Cur, setProtector_Price_In_Oth_Cur] = useState('')
  const [protector_Reference_In, setProtector_Reference_In] = useState('')
  const [protector_Reference_In_Name, setProtector_Reference_In_Name] = useState('')
  const [protector_Price_Out, setProtector_Price_Out] = useState('')


  // handle main Picture 
  const handleMainPicture = (e) => {
    const file = e.target.files[0];
    TransformMainFile(file)
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit. Please select a smaller file.');
      } else {
        TransformMainFile(file);
      }
    } else {
      alert('No file selected.');
    }
  };

  const TransformMainFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPicture(reader.result);
      };
    } else {
      setPicture('');
    }
  };

  // Handle Visit Sales Parties Section Picture

  const handlePictureTwo = (e) => {
    const file = e.target.files[0];
    TransFormPictureTwoFile(file)
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit. Please select a smaller file.');
      } else {
        TransFormPictureTwoFile(file);
      }
    } else {
      alert('No file selected.');
    }
  };

  const TransFormPictureTwoFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setVisit_Section_Picture(reader.result);
      };
    } else {
      setPicture('');
    }
  };

  // Handle Ticket Sales Parties Section Picture

  const handlePictureThree = (e) => {
    const file = e.target.files[0];
    TransFormPictureThreeFile(file)
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit. Please select a smaller file.');
      } else {
        TransFormPictureThreeFile(file);
      }
    } else {
      alert('No file selected.');
    }
  };

  const TransFormPictureThreeFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setTicket_Section_Picture(reader.result);
      };
    } else {
      setPicture('');
    }
  };

  // Handle Azad Visa Section Picture

  const handlePictureFour = (e) => {
    const file = e.target.files[0];
    TransFormPictureFourFile(file)
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit. Please select a smaller file.');
      } else {
        TransFormPictureFourFile(file);
      }
    } else {
      alert('No file selected.');
    }
  };

  const TransFormPictureFourFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setAzad_Visa_Section_Picture(reader.result);
      };
    } else {
      setPicture('');
    }
  };
  // getting data from redux store 
  const visaSalesParty = useSelector((state) => state.setting.visaSalesParty);
  const visaPurchaseParty = useSelector((state) => state.setting.visaPurchaseParty);
  const ticketSalesParties = useSelector((state) => state.setting.ticketSalesParties);
  const ticketPurchaseParties = useSelector((state) => state.setting.ticketPurchaseParties);
  const visitSalesParties = useSelector((state) => state.setting.visitSalesParties);
  const visitPurchaseParties = useSelector((state) => state.setting.visitPurchaseParties);
  const azadVisaSalesParties = useSelector((state) => state.setting.azadVisaSalesParties);
  const azadVisaPurchaseParties = useSelector((state) => state.setting.azadVisaPurchaseParties);
  const protectors = useSelector((state) => state.setting.protectors);

  const companies = useSelector((state) => state.setting.companies);
  const trades = useSelector((state) => state.setting.trades);
  const currCountries = useSelector((state) => state.setting.currCountries);
  const entryMode = useSelector((state) => state.setting.entryMode);
  const finalStatus = useSelector((state) => state.setting.finalStatus);
  const countries = useSelector((state) => state.setting.countries);
  const currencies = useSelector((state) => state.setting.currencies);

  // Submitting Form to Store Data in Database
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const apiUrl = process.env.REACT_APP_API_URL;


  const [, setNewMessage] = useState('')
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${apiUrl}/auth/entries/add/single_entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ reference_Out, reference_In, name, pp_No, trade, company, contact, country, flight_Date, final_Status, remarks, entry_Mode, reference_Out_Name, visa_Sales_Rate_PKR, visa_Sale_Rate_Oth_Cur, cur_Country_One, reference_In_Name, visa_Purchase_Rate_PKR, visa_Purchase_Rate_Oth_Cur, cur_Country_Two, picture, visit_Sales_PKR, visit_Sales_Cur, visit_Purchase_Rate_PKR, visit_Purchase_Cur, visit_Reference_In_Name, visit_Reference_Out_Name, visit_Section_Picture, ticket_Sales_PKR, ticket_Sales_Cur, ticket_Purchase_PKR, ticket_Purchase_Cur, ticket_Reference_In_Name, ticket_Reference_Out_Name, ticket_Section_Picture, azad_Visa_Sales_PKR, azad_Visa_Sales_Cur, azad_Visa_Purchase_PKR, azad_Visa_Purchase_Cur, azad_Visa_Reference_In_Name, azad_Visa_Reference_Out_Name, azad_Visa_Section_Picture, protector_Reference_In, protector_Reference_In_Name, protector_Price_In, protector_Price_In_Oth_Cur, protector_Price_Out, visit_Reference_In, visit_Reference_Out, ticket_Reference_In, ticket_Reference_Out, azad_Visa_Reference_In, azad_Visa_Reference_Out, visit_Sales_Rate_Oth_Curr, visit_Purchase_Rate_Oth_Cur, ticket_Sales_Rate_Oth_Cur, ticket_Purchase_Rate_Oth_Cur, azad_Visa_Sales_Rate_Oth_Cur, azad_Visa_Purchase_Rate_Oth_Cur, section1, section2, section3, })
      })

      const json = await response.json()

      if (!response.ok) {
        setNewMessage(toast.error(json.message));

        setLoading(false)
      }
      if (response.ok) {

        setNewMessage(toast.success(json.message));
        setLoading(null)
        dispatch(addEntry(json.data))
        // Reset all state values to empty strings
        setName('');
        setPP_No('');
        setTrade('');
        setCompany('');
        setContact('');
        setCountry('');
        setFlight_Date('');
        setFinal_Status('');
        setRemarks('');
        setEntry_Mode('');
        setReference_Out_Name('');
        setVisa_Sales_Rate_PKR('');
        setVisa_Sale_Rate_Oth_Cur('');
        setCur_Country_One('');
        setReference_In_Name('');
        setVisa_Purchase_Rate_PKR('');
        setVisa_Purchase_Rate_Oth_Cur('');
        setCur_Country_Two('');
        setPicture('');
        setVisit_Sales_PKR('');
        setVisit_Sales_Cur('');

        setVisit_Purchase_Rate_PKR('');
        setVisit_Purchase_Cur('');
        setVisit_Reference_In_Name('');
        setVisit_Reference_Out_Name('');
        setVisit_Section_Picture('');

        setTicket_Sales_PKR('');
        setTicket_Sales_Cur('');

        setTicket_Purchase_PKR('');
        setTicket_Purchase_Cur('');
        setTicket_Reference_In_Name('');
        setTicket_Reference_Out_Name('');
        setTicket_Section_Picture('');

        setAzad_Visa_Sales_PKR('');
        setAzad_Visa_Sales_Cur('');

        setAzad_Visa_Purchase_PKR('');
        setAzad_Visa_Purchase_Cur('');
        setAzad_Visa_Reference_In_Name('');
        setAzad_Visa_Reference_Out_Name('');
        setAzad_Visa_Section_Picture('');
        setProtector_Price_In('');
        setProtector_Price_Out('');
        setVisit_Reference_In('')
        setVisit_Reference_Out('')
        setTicket_Reference_In('')
        setTicket_Reference_Out('')
        setAzad_Visa_Reference_In('')
        setAzad_Visa_Reference_Out('')
        setVisit_Sales_Rate_Oth_Curr('')
        setVisit_Purchase_Rate_Oth_Cur('')
        setTicket_Sales_Rate_Oth_Cur('')
        setTicket_Purchase_Rate_Oth_Cur('')
        setAzad_Visa_Sales_Rate_Oth_Cur('')
        setAzad_Visa_Purchase_Rate_Oth_Cur('')
        setProtector_Price_In_Oth_Cur('')
        setProtector_Reference_In('')
        setProtector_Reference_In_Name('')
      }
    }
    catch (error) {
      console.log(error)
      setNewMessage(toast.error('Server is not responding...'))
      setLoading(false)
    }
  }


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

      // Use Promise.all to execute all promises concurrently
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


    }
  };

  useEffect(() => {
    fetchData()
  }, [user, dispatch])


  return (
    <>
      <div className="col-md-12">

        <TableContainer component={Paper}>
          <form className='py-3 px-2' onSubmit={handleSubmit}>
            <div className="text-end ">
              <button className='btn submit_btn m-1' type='submit' disabled={loading}>{loading === true ? "Submitting" : "Add New Entry"}</button>
              <div className="dropdown d-inline m-1">
                <button className="btn" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  More Sections<AddRoundedIcon fontSize='small'></AddRoundedIcon>
                </button>
                <ul className="dropdown-menu shadow border-0" aria-labelledby="dropdownMenuLink">
                  {section1 === 0 && <li className='my-2 py-2' onClick={() => setSection1(1)}><TourIcon fontSize='small' className='me-1' /><span>Add Visit</span></li>}
                  {section2 === 0 && <li className='my-2 py-2' onClick={() => setSection2(1)}><LocalActivityIcon fontSize='small' className='me-1' /><span>Add Ticket</span></li>}
                  {section3 === 0 && <li className='my-2 py-2' onClick={() => setSection3(1)}><FlagCircleIcon fontSize='small' className='me-1' /><span>Add Azad</span></li>}
                  {section4 === 0 && <li className='my-2 py-2' onClick={() => setSection4(1)}><ShieldIcon fontSize='small' className='me-1' /><span>Add Protector </span></li>}
                </ul>
              </div>


            </div>
            <div className="row p-0 m-0 my-1">

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >PP NO</label>
                <input type="text" value={pp_No} onChange={(e) => setPP_No(e.target.value)} required />
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Trade</label>
                <select  value={trade} onChange={(e) => setTrade(e.target.value)} >
                  <option className="my-1 py-2" value="">choose</option>
                  {trades && trades.map((data) => (

                    <option className="my-1 py-2" key={data._id} value={data.trade}>{data.trade}</option>

                  ))}
                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Company</label>
                <select  value={company} onChange={(e) => setCompany(e.target.value)} >
                  <option className="my-1 py-2" value="">choose</option>
                  {companies && companies.map((data) => (

                    <option className="my-1 py-2" key={data._id} value={data.company} >{data.company}</option>

                  ))}
                </select>
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Contact</label>
                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)}  />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Country</label>
                <select  value={country} onChange={(e) => setCountry(e.target.value)} >
                  <option className="my-1 py-2" value="">choose</option>
                  {countries && countries.map((data) => (

                    <option className="my-1 py-2" key={data._id} value={data.country}>{data.country}</option>

                  ))}
                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Flight Date</label>
                <input type="date" value={flight_Date} onChange={(e) => setFlight_Date(e.target.value)} />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Final Status</label>
                <select  value={final_Status} onChange={(e) => setFinal_Status(e.target.value)} >
                  <option className="my-1 py-2" value="">choose</option>
                  {finalStatus && finalStatus.map((data) => (

                    <option className="my-1 py-2" key={data._id} value={data.final_Status}>{data.final_Status}</option>

                  ))}
                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Remarks</label>
                <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)}  />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Entry Mode</label>
                <select  value={entry_Mode} onChange={(e) => setEntry_Mode(e.target.value)} >
                  <option className="my-1 py-2" value="">choose</option>
                  {entryMode && entryMode.map((data) => (

                    <option className="my-1 py-2" key={data._id} value={data.entry_Mode}>{data.entry_Mode}</option>

                  ))}
                </select>
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Reference Out </label>
                <select  value={reference_Out} onChange={(e) => setReference_Out(e.target.value)} >
                  <option className="my-1 py-2" value="">choose</option>
                  <option className="my-1 py-2" value="Candidate">Candidate</option>
                  <option className="my-1 py-2" value="Agents">Agents</option>
                  <option className="my-1 py-2" value="Suppliers">Suppliers</option>
                </select>
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="">{reference_Out === "Candidate" ? "Candidate" : "Sales Parties "}</label>
                {reference_Out === "Candidate" ? (
                  <input
                    type="text"
                    placeholder={`${name} / ${pp_No}`}
                    value={name}

                    readOnly />
                ) : (

                  <select  value={reference_Out_Name} onChange={(e) => setReference_Out_Name(e.target.value)} >
                    {reference_Out === "Agents" && (
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
                    {reference_Out === "Suppliers" && (
                      <>
                        <option value="">Choose Suppliers</option>

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


              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Visa Sale Rate PKR </label>
                <input type="number" min='0'  value={visa_Sales_Rate_PKR} onChange={(e) => setVisa_Sales_Rate_PKR(e.target.value)} />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Visa Sale Rate(Oth Cur) </label>
                <input type="number" min='0'  value={visa_Sale_Rate_Oth_Cur} onChange={(e) => setVisa_Sale_Rate_Oth_Cur(e.target.value)} />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Cur Country </label>
                <select  value={cur_Country_One} onChange={(e) => setCur_Country_One(e.target.value)}>
                  <option className="my-1 py-2" value="">choose</option>
                  {currCountries && currCountries.map((data) => (
                    <option className="my-1 py-2" key={data._id} value={data.currCountry}>{data.currCountry}</option>
                  ))}

                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Reference In </label>
                <select  value={reference_In} onChange={(e) => setReference_In(e.target.value)}>
                  <option className="my-1 py-2" value="">choose</option>
                  <option className="my-1 py-2" value="Candidate">Candidate</option>
                  <option className="my-1 py-2" value="Agents">Agents</option>
                  <option className="my-1 py-2" value="Suppliers">Suppliers</option>
                </select>
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="">{reference_In === "Candidate" ? "Candidate" : "Purchase Parties "}</label>
                {reference_In === "Candidate" ? (
                  <input
                    type="text"
                    placeholder={`${name} / ${pp_No}`}
                    value={name}

                    readOnly
                  />
                ) : (
                  <select
                    
                    value={reference_In_Name}
                    onChange={(e) => setReference_In_Name(e.target.value)}
                  >
                    {reference_In === "Agents" && (
                      <>
                        <option value="">Choose Agents</option>
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
                    {reference_In === "Suppliers" && (
                      <>
                        <option value="">Choose Suppliers</option>
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
              </div>


              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Visa Purchase Rate PKR </label>
                <input type="number" min='0'  value={visa_Purchase_Rate_PKR} onChange={(e) => setVisa_Purchase_Rate_PKR(e.target.value)} />
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Visa Purch Rate (Oth Cur) </label>
                <input type="number" min='0'  value={visa_Purchase_Rate_Oth_Cur} onChange={(e) => setVisa_Purchase_Rate_Oth_Cur(e.target.value)} />
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Cur Country </label>
                <select  value={cur_Country_Two} onChange={(e) => setCur_Country_Two(e.target.value)}>
                  <option className="my-1 py-2" value="">choose</option>
                  {currCountries && currCountries.map((data) => (
                    <option className="my-1 py-2" key={data._id} value={data.currCountry}>{data.currCountry}</option>
                  ))}
                </select>
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Picture</label>
                <input type="file" accept='image/*' onChange={handleMainPicture} />
              </div>
              {picture && <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 mb-3">
                <div className="image">
                  <img src={picture} alt="" className='rounded' />
                </div>
              </div>}

            </div>
            {/* Visit Sales Purchase Parties section */}

            {section1 === 1 && <div className="row p-0 m-0 my-1">
              <hr />
              <div className="d-flex justify-content-between">
                <h6>Visit Sales Purchase Parties</h6>
                <span className='del_btn py-1 px-1 btn' onClick={() => setSection1(0)}><DeleteIcon fontSize='small'></DeleteIcon></span>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Reference Out </label>
                <select  value={visit_Reference_Out} onChange={(e) => setVisit_Reference_Out(e.target.value)} >
                  <option className="my-1 py-2" value="">choose</option>
                  <option className="my-1 py-2" value="Candidate">Candidate</option>
                  <option className="my-1 py-2" value="Agents">Agents</option>
                  <option className="my-1 py-2" value="Suppliers">Suppliers</option>


                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >{visit_Reference_Out === "Candidate" ? "Candidate" : "Sales Parties "} </label>
                {visit_Reference_Out === "Candidate" ? (
                  <input
                    type="text"
                    placeholder={`${name} / ${pp_No}`}
                    value={name}

                    readOnly
                  />
                ) :
                  <select value={visit_Reference_Out_Name} onChange={(e) => setVisit_Reference_Out_Name(e.target.value)} >

                    (
                    <>
                      {visit_Reference_Out === "Agents" && (
                        <>
                          <option value="">Choose Agents</option>
                          {visitSalesParties && visitSalesParties.map((data, index) => (

                            <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                          ))}
                        </>
                      )
                      }
                      {visit_Reference_Out === "Suppliers" && (
                        <>
                          <option value="">Choose Suppliers</option>
                          {visaPurchaseParty && visaPurchaseParty.map((data, index) => (

                            <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                          ))}
                        </>
                      )
                      }

                    </>
                    )
                  </select>

                }
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Visit Sale Rate PKR </label>
                <input type="number" min='0'  value={visit_Sales_PKR} onChange={(e) => setVisit_Sales_PKR(e.target.value)} />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Visit Sale Rate Oth Curr </label>
                <input type="number" min='0'  value={visit_Sales_Rate_Oth_Curr} onChange={(e) => setVisit_Sales_Rate_Oth_Curr(e.target.value)} />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Visit Sale Cur </label>
                <select  value={visit_Sales_Cur} onChange={(e) => setVisit_Sales_Cur(e.target.value)}>
                  <option className="my-1 py-2" value="">choose</option>
                  {currencies && currencies.map((data) => (
                    <option className="my-1 py-2" key={data._id} value={data.currency}>{data.currency}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Reference In </label>
                <select  value={visit_Reference_In} onChange={(e) => setVisit_Reference_In(e.target.value)} >
                  <option className="my-1 py-2" value="">choose</option>
                  <option className="my-1 py-2" value="Candidate">Candidate</option>
                  <option className="my-1 py-2" value="Agents">Agents</option>
                  <option className="my-1 py-2" value="Suppliers">Suppliers</option>


                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >{visit_Reference_In === "Candidate" ? "Candidate" : "Purchase Parties "} </label>
                {visit_Reference_In === "Candidate" ? (
                  <input
                    type="text"
                    placeholder={`${name} / ${pp_No}`}
                    value={name}

                    readOnly
                  />
                ) :
                  <select value={visit_Reference_In_Name} onChange={(e) => setVisit_Reference_In_Name(e.target.value)} >

                    (
                    <>
                      {visit_Reference_In === "Agents" && (
                        <>
                          <option value="">Choose Agents</option>
                          {visitSalesParties && visitSalesParties.map((data, index) => (

                            <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                          ))}
                        </>
                      )
                      }
                      {visit_Reference_In === "Suppliers" && (
                        <>
                          <option value="">Choose Suppliers</option>
                          {visaPurchaseParty && visaPurchaseParty.map((data, index) => (

                            <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                          ))}
                        </>
                      )
                      }

                    </>
                    )
                  </select>

                }
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Visit Purchase Rate PKR </label>
                <input type="number" min='0'  value={visit_Purchase_Rate_PKR} onChange={(e) => setVisit_Purchase_Rate_PKR(e.target.value)} />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Visit Purchase Rate Oth Curr </label>
                <input type="number" min='0'  value={visit_Purchase_Rate_Oth_Cur} onChange={(e) => setVisit_Purchase_Rate_Oth_Cur(e.target.value)} />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Visit Purchase Cur </label>
                <select  value={visit_Purchase_Cur} onChange={(e) => setVisit_Purchase_Cur(e.target.value)}>
                  <option className="my-1 py-2" value="">choose</option>
                  {currencies && currencies.map((data) => (
                    <option key={data._id} value={data.currency}>{data.currency}</option>
                  ))}
                </select>
              </div>





              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label htmlFor="" >Picture</label>
                <input type="file" accept='image/*' onChange={handlePictureTwo}  />
              </div>
              {visit_Section_Picture && <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 mb-3">
                <div className="image">
                  <img src={visit_Section_Picture} alt="" className='rounded' />
                </div>
              </div>}

            </div>}

            {/* Ticket Sales Purchase Parties Section */}

            {section2 === 1 &&
              <div className="row p-0 m-0 my-1">
                <hr />
                <div className="d-flex justify-content-between">
                  <h6>Ticket Sales Purchase Parties</h6>
                  <span className='del_btn py-1 px-1 btn' onClick={() => setSection2(0)}><DeleteIcon fontSize='small'></DeleteIcon></span>
                </div>

                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Reference Out </label>
                  <select  value={ticket_Reference_Out} onChange={(e) => setTicket_Reference_Out(e.target.value)} >
                    <option className="my-1 py-2" value="">choose</option>
                    <option className="my-1 py-2" value="Candidate">Candidate</option>
                    <option className="my-1 py-2" value="Agents">Agents</option>
                    <option className="my-1 py-2" value="Suppliers">Suppliers</option>


                  </select>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >{ticket_Reference_Out === "Candidate" ? "Candidate" : "Sales Parties "} </label>
                  {ticket_Reference_Out === "Candidate" ? (
                    <input
                      type="text"
                      placeholder={`${name} / ${pp_No}`}
                      value={name}

                      readOnly
                    />
                  ) :
                    <select value={ticket_Reference_Out_Name} onChange={(e) => setTicket_Reference_Out_Name(e.target.value)} >

                      (
                      <>
                        {ticket_Reference_Out === "Agents" && (
                          <>
                            <option value="">Choose Agents</option>
                            {ticketSalesParties && ticketSalesParties.map((data, index) => (

                              <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                            ))}
                          </>
                        )
                        }
                        {ticket_Reference_Out === "Suppliers" && (
                          <>
                            <option value="">Choose Suppliers</option>
                            {ticketPurchaseParties && ticketPurchaseParties.map((data, index) => (

                              <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                            ))}
                          </>
                        )
                        }

                      </>
                      )
                    </select>

                  }
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Ticket Sales PKR </label>
                  <input type="number" min='0'  value={ticket_Sales_PKR} onChange={(e) => setTicket_Sales_PKR(e.target.value)} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Ticket Sales Rate Oth Curr </label>
                  <input type="number" min='0'  value={ticket_Sales_Rate_Oth_Cur} onChange={(e) => setTicket_Sales_Rate_Oth_Cur(e.target.value)} />
                </div>

                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Ticket Sales Cur </label>
                  <select  value={ticket_Sales_Cur} onChange={(e) => setTicket_Sales_Cur(e.target.value)}>
                    <option className="my-1 py-2" value="">choose</option>
                    {currencies && currencies.map((data) => (
                      <option className="my-1 py-2" key={data._id} value={data.currency}>{data.currency}</option>
                    ))}
                  </select>
                </div>

                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Reference In </label>
                  <select  value={ticket_Reference_In} onChange={(e) => setTicket_Reference_In(e.target.value)} >
                    <option className="my-1 py-2" value="">choose</option>
                    <option className="my-1 py-2" value="Candidate">Candidate</option>
                    <option className="my-1 py-2" value="Agents">Agents</option>
                    <option className="my-1 py-2" value="Suppliers">Suppliers</option>


                  </select>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >{ticket_Reference_In === "Candidate" ? "Candidate" : "Purchase Parties "} </label>
                  {ticket_Reference_In === "Candidate" ? (
                    <input
                      type="text"
                      placeholder={`${name} / ${pp_No}`}
                      value={name}

                      readOnly
                    />
                  ) :
                    <select value={ticket_Reference_In_Name} onChange={(e) => setTicket_Reference_In_Name(e.target.value)} >

                      (
                      <>
                        {ticket_Reference_In === "Agents" && (
                          <>
                            <option value="">Choose Agents</option>
                            {ticketSalesParties && ticketSalesParties.map((data, index) => (

                              <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                            ))}
                          </>
                        )
                        }
                        {ticket_Reference_In === "Suppliers" && (
                          <>
                            <option value="">Choose Suppliers</option>
                            {ticketPurchaseParties && ticketPurchaseParties.map((data, index) => (

                              <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                            ))}
                          </>
                        )
                        }

                      </>
                      )
                    </select>

                  }
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Ticket Purchase PKR </label>
                  <input type="number" min='0' value={ticket_Purchase_PKR} onChange={(e) => setTicket_Purchase_PKR(e.target.value)}  />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Ticket Purchase Rate Oth Curr </label>
                  <input type="number" min='0' value={ticket_Purchase_Rate_Oth_Cur} onChange={(e) => setTicket_Purchase_Rate_Oth_Cur(e.target.value)}  />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Ticket Purchase Cur </label>
                  <select  value={ticket_Purchase_Cur} onChange={(e) => setTicket_Purchase_Cur(e.target.value)} >
                    <option className="my-1 py-2" value="">choose</option>
                    {currencies && currencies.map((data) => (
                      <option className="my-1 py-2" key={data._id} value={data.currency}>{data.currency}</option>
                    ))}
                  </select>
                </div>






                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Picture</label>
                  <input type="file" accept='image/*' onChange={handlePictureThree} />
                </div>
                {ticket_Section_Picture && <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 mb-3">
                  <div className="image">
                    <img src={ticket_Section_Picture} alt="" className='rounded' />
                  </div>
                </div>}
              </div>
            }


            {/* Azad Visa Sales Purchase Section */}
            {section3 === 1 &&
              <div className="row  p-0 m-0 my-1">
                <hr />
                <div className="d-flex justify-content-between">
                  <h6>Azad Visa Sales Purchase Section</h6>
                  <span className='del_btn py-1 px-1 btn' onClick={() => setSection3(0)}><DeleteIcon fontSize='small'></DeleteIcon></span>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Reference Out </label>
                  <select  value={azad_Visa_Reference_Out} onChange={(e) => setAzad_Visa_Reference_Out(e.target.value)} >
                    <option className="my-1 py-2" value="">choose</option>
                    <option className="my-1 py-2" value="Candidate">Candidate</option>
                    <option className="my-1 py-2" value="Agents">Agents</option>
                    <option className="my-1 py-2" value="Suppliers">Suppliers</option>


                  </select>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >{azad_Visa_Reference_Out === "Candidate" ? "Candidate" : "Sales Parties "} </label>
                  {azad_Visa_Reference_Out === "Candidate" ? (
                    <input
                      type="text"
                      placeholder={`${name} / ${pp_No}`}
                      value={name}

                      readOnly
                    />
                  ) :
                    <select value={azad_Visa_Reference_Out_Name} onChange={(e) => setAzad_Visa_Reference_Out_Name(e.target.value)} >

                      (
                      <>
                        {azad_Visa_Reference_Out === "Agents" && (
                          <>
                            <option value="">Choose Agents</option>
                            {azadVisaSalesParties && azadVisaSalesParties.map((data, index) => (

                              <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                            ))}
                          </>
                        )
                        }
                        {azad_Visa_Reference_Out === "Suppliers" && (
                          <>
                            <option value="">Choose Suppliers</option>
                            {azadVisaPurchaseParties && azadVisaPurchaseParties.map((data, index) => (

                              <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                            ))}
                          </>
                        )
                        }

                      </>
                      )
                    </select>

                  }
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Azad Visa Sale PKR </label>
                  <input type="number" min='0'  value={azad_Visa_Sales_PKR} onChange={(e) => setAzad_Visa_Sales_PKR(e.target.value)} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Azad Visa Sale Rate Oth Curr </label>
                  <input type="number" min='0'  value={azad_Visa_Sales_Rate_Oth_Cur} onChange={(e) => setAzad_Visa_Sales_Rate_Oth_Cur(e.target.value)} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Azad Visa Sale Cur </label>
                  <select  value={azad_Visa_Sales_Cur} onChange={(e) => setAzad_Visa_Sales_Cur(e.target.value)}>
                    <option className="my-1 py-2" value="">choose</option>
                    {currencies && currencies.map((data) => (
                      <option className="my-1 py-2" key={data._id} value={data.currency}>{data.currency}</option>
                    ))}
                  </select>
                </div>

                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Reference In </label>
                  <select  value={azad_Visa_Reference_In} onChange={(e) => setAzad_Visa_Reference_In(e.target.value)}  >
                    <option className="my-1 py-2" value="">choose</option>
                    <option className="my-1 py-2" value="Candidate">Candidate</option>
                    <option className="my-1 py-2" value="Agents">Agents</option>
                    <option className="my-1 py-2" value="Suppliers">Suppliers</option>


                  </select>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >{azad_Visa_Reference_In === "Candidate" ? "Candidate" : "Purchase Parties "} </label>
                  {azad_Visa_Reference_In === "Candidate" ? (
                    <input
                      type="text"

                      value={name}

                      readOnly
                    />
                  ) :
                    <select value={azad_Visa_Reference_In_Name} onChange={(e) => setAzad_Visa_Reference_In_Name(e.target.value)} >

                      (
                      <>
                        {azad_Visa_Reference_In === "Agents" && (
                          <>
                            <option value="">Choose Agents</option>
                            {azadVisaSalesParties && azadVisaSalesParties.map((data, index) => (

                              <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                            ))}
                          </>
                        )
                        }
                        {azad_Visa_Reference_In === "Suppliers" && (
                          <>
                            <option value="">Choose Suppliers</option>
                            {azadVisaPurchaseParties && azadVisaPurchaseParties.map((data, index) => (

                              <option className="my-1 py-2" key={data._id} value={data.supplierName}>{data.supplierName}</option>

                            ))}
                          </>
                        )
                        }

                      </>
                      )
                    </select>

                  }
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Azad Visa Purchase PKR </label>
                  <input type="number" min='0'  value={azad_Visa_Purchase_PKR} onChange={(e) => setAzad_Visa_Purchase_PKR(e.target.value)} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Azad Visa Purch Rate Oth Curr </label>
                  <input type="number" min='0'  value={azad_Visa_Purchase_Rate_Oth_Cur} onChange={(e) => setAzad_Visa_Purchase_Rate_Oth_Cur(e.target.value)} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Azad Visa Purchase Cur </label>
                  <select  value={azad_Visa_Purchase_Cur} onChange={(e) => setAzad_Visa_Purchase_Cur(e.target.value)}>
                    <option className="my-1 py-2" value="">choose</option>
                    {currencies && currencies.map((data) => (
                      <option className="my-1 py-2" key={data._id} value={data.currency}>{data.currency}</option>
                    ))}
                  </select>
                </div>





                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Picture</label>
                  <input type="file" accept='image/*' onChange={handlePictureFour} />
                </div>

                {azad_Visa_Section_Picture && <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 mb-3">
                  <div className="image">
                    <img src={azad_Visa_Section_Picture} alt="" className='rounded' />
                  </div>
                </div>}

              </div>
            }

            {/* Protector Section */}

            {section4 === 1 &&
              <div className="row row p-0 m-0 my-1">
                <hr />
                <div className="d-flex justify-content-between">
                  <h6>Protector Section</h6>
                  <span className='del_btn py-1 px-1 btn' onClick={() => setSection4(0)}><DeleteIcon fontSize='small'></DeleteIcon></span>
                </div>

                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Protector Price In </label>
                  <input type="number" min='0'  value={protector_Price_In} onChange={(e) => setProtector_Price_In(e.target.value)} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Protector Price In Oth Curr </label>
                  <input type="number" min='0'  value={azad_Visa_Sales_Rate_Oth_Cur} onChange={(e) => setAzad_Visa_Sales_Rate_Oth_Cur(e.target.value)} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Reference In </label>
                  <select  value={protector_Reference_In} onChange={(e) => setProtector_Reference_In(e.target.value)} >
                    <option className="my-1 py-2" value="">choose</option>
                    <option className="my-1 py-2" value="Protector">Protector</option>
                  </select>
                </div>

                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Reference In Name</label>
                  <select  value={protector_Reference_In_Name} onChange={(e) => setProtector_Reference_In_Name(e.target.value)} >
                    {protector_Reference_In==="Protector" &&(
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
                </div>
                
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label htmlFor="" >Protector Price Out </label>
                  <input type="number" min='0'  value={protector_Price_Out} onChange={(e) => setProtector_Price_Out(e.target.value)} />
                </div>
              </div>
            }

          </form>
        </TableContainer>
      </div>
    </>
  )
}
