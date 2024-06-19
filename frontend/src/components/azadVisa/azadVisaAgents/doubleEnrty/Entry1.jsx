import React, { useState, useEffect,useRef } from 'react'
import { useAuthContext } from '../../../../hooks/userHooks/UserAuthHook'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import CategoryHook from '../../../../hooks/settingHooks/CategoryHook'
import PaymentViaHook from '../../../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../../../hooks/settingHooks/PaymentTypeHook'
import CurrCountryHook from '../../../../hooks/settingHooks/CurrCountryHook'
import AgentHook from '../../../../hooks/agentHooks/AgentHook';
import SupplierHook from '../../../../hooks/supplierHooks/SupplierHook';
import CandidateHook from '../../../../hooks/candidateHooks/CandidateHook';
import AzadVisaHook from '../../../../hooks/azadVisaHooks/AzadVisaHooks';
import TicketHook from '../../../../hooks/ticketHooks/TicketHook';
import VisitHook from '../../../../hooks/visitsHooks/VisitHook';
import CDWCHook from '../../../../hooks/creditsDebitsWCHooks/CDWCHook'
import CPPHook from '../../../../hooks/settingHooks/CPPHook';
import CDWOCHook from '../../../../hooks/creditsDebitsWOCHooks/CDWOCHook'
import NewAssetsHook from '../../../../hooks/settingHooks/NewAssetsHook';
import AssetsHook from '../../../../hooks/assetsHooks/AssetsHook'
import Entry2 from './Entry2'
// import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function Entry1() {
  const dispatch = useDispatch();
  // getting data from redux store 
  const currCountries = useSelector((state) => state.setting.currCountries);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const agent_Payments_In = useSelector((state) => state.agents.agent_Payments_In)
  const candidate_Payments_In = useSelector((state) => state.candidates.candidate_Payments_In)
  const supp_Payments_In = useSelector((state) => state.suppliers.supp_Payments_In)
  const azadAgent_Payments_In = useSelector((state) => state.azadVisa.azadAgent_Payments_In)
  const azadCand_Payments_In = useSelector((state) => state.azadVisa.azadCand_Payments_In)
  const azadSupplier_Payments_In = useSelector((state) => state.azadVisa.azadSupplier_Payments_In)
  const ticketAgent_Payments_In = useSelector((state) => state.tickets.ticketAgent_Payments_In)
  const ticketCand_Payments_In = useSelector((state) => state.tickets.ticketCand_Payments_In)
  const ticketSupplier_Payments_In = useSelector((state) => state.tickets.ticketSupplier_Payments_In)
  const visitAgent_Payments_In = useSelector((state) => state.visits.visitAgent_Payments_In)
  const visitCand_Payments_In = useSelector((state) => state.visits.visitCand_Payments_In)
  const visitSupplier_Payments_In = useSelector((state) => state.visits.visitSupplier_Payments_In)


  const CDWC_Payments_In = useSelector((state) => state.creditsDebitsWC.CDWC_Payments_In);
  const CDWOC_Payments_In = useSelector((state) => state.creditsDebitsWOC.CDWOC_Payments_In);
  const assets = useSelector((state) => state.setting.assets)
  const assetsPayments = useSelector((state) => state.assetsPayments.assetsPayments);

  const crediterPurchaseParties = useSelector((state) => state.setting.crediterPurchaseParties)
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  const { getCurrCountryData } = CurrCountryHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const { getPaymentsIn } = AgentHook()
  const { getSupplierPaymentsIn } = SupplierHook()
  const { getCandPaymentsIn } = CandidateHook()
  const { getAzadAgentPaymentsIn,getAzadCandPaymentsIn,getAzadSupplierPaymentsIn } = AzadVisaHook()
  const { getTicketAgentPaymentsIn,getTicketCandPaymentsIn,getTicketSupplierPaymentsIn } = TicketHook()
  const { getVisitAgentPaymentsIn,getVisitCandPaymentsIn,getVisitSupplierPaymentsIn } = VisitHook()
  const { getCDWCPaymentsIn } = CDWCHook()
  const { getCDWOCPaymentsIn } = CDWOCHook()
  const { getCPPData } = CPPHook()
  const { getAssetsData } = NewAssetsHook()
  const { getPayments } = AssetsHook()

  // getting Data from DB

  const abortCont = useRef(new AbortController());

  const { user } = useAuthContext()
  const fetchData = async () => {
    try {
        getCurrCountryData()
        getCategoryData()
        getPaymentViaData()
        getPaymentTypeData()
        getPaymentsIn()
        getSupplierPaymentsIn()
        getCandPaymentsIn()
        getAzadAgentPaymentsIn()
        getAzadCandPaymentsIn()
        getAzadSupplierPaymentsIn()
        getTicketAgentPaymentsIn()
        getTicketCandPaymentsIn()
        getTicketSupplierPaymentsIn()
        getVisitAgentPaymentsIn()
        getVisitCandPaymentsIn()
        getVisitSupplierPaymentsIn()
        getCPPData()
        getAssetsData()
        getPayments()
        getCDWCPaymentsIn()
        getCDWOCPaymentsIn()

    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData()
    return () => {
      if (abortCont.current) {
        abortCont.current.abort(); 
      }
    }
  }, [user, dispatch])


  const [option, setOption] = useState(false)
  const [type, setType] = useState(false)

  // Form input States
  const [supplierName, setSupplierName] = useState('')
  const [category, setCategory] = useState('')
  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')
  const [slip_No, setSlip_No] = useState('')
  const [payment_In, setPayment_In] = useState()
  const [slip_Pic, setSlip_Pic] = useState('')
  const [details, setDetails] = useState('')
  const [curr_Country, setCurr_Country] = useState('')
  const [curr_Rate, setCurr_Rate] = useState(0)
  const [date, setDate] = useState('')
  
  useEffect(() => {
  }, [type,supplierName,selectedSupplier])

  
  let curr_Amount = (payment_In / curr_Rate).toFixed(2)
  const handleOpen = () => {
    setOption(!option)
  }

  const [section, setSection] = useState(false)


  const handleSection = () => {
    setSection(!section)
    setCurr_Country('')
    setCurr_Rate('')

  }

  // handle Picture 


  const handleImage = (e) => {
    const file = e.target.files[0];
    TransformFile(file)
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit. Please select a smaller file.');
      } else {
        TransformFile(file);
      }
    } else {
      alert('No file selected.');
    }
  };

  const TransformFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSlip_Pic(reader.result);
      };
    } else {
      setSlip_Pic('');
    }
  };


  // Submitting Form Data
  const [loading, setLoading] = useState(null)
  const [, setNewMessage] = useState('')
  
  const handleAgentForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/agents/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)
      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
        // setOpen(true)
        // setClose(false);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };

  const handleCandidateForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/candidates/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
     
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  }

  const handleSupplierForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/suppliers/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
      
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  }

  const handleAzadAgentForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/azadVisa/agents/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          // open,
          // close,
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getAzadAgentPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
        // setOpen(true)
        // setClose(false);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };


  const handleAzadCandForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/azadVisa/candidates/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getAzadCandPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
      
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };


  const handleAzadSupplierForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/azadVisa/suppliers/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
         
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getAzadSupplierPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
     
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };


  const handleTicketAgentForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/ticket/agents/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
       
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getTicketAgentPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
       
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };


const handleTicketCandForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/ticket/candidates/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
        
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getTicketCandPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
    
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };


  const handleTicketSupplierForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/ticket/suppliers/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getTicketSupplierPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
     
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };


  const handleVisitAgentForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/visit/agents/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
      
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getVisitAgentPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
    
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };


  const handleVisitCandForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/visit/candidates/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
         
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getVisitCandPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
       
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };



  const handleVisitSupplierForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/visit/suppliers/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
       
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getVisitSupplierPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
     
      }

    } catch (error) {
     
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };

  const handleCDWCForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/credits&debits/with_cash_in_hand/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
    
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
 
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };

  const handleCDWOCForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/credits&debits/without_cash_in_hand/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
       
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
    
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };


  const handleAssetForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/assets/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          assetName:supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
      
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };



  return (
    <>
      <div className="col-md-12 ">
        {!option && <TableContainer component={Paper}>
          <form className='py-3 px-2' onSubmit={(type==='Agent'?handleAgentForm:type==="Supplier"?handleSupplierForm:type==="Candidate"?handleCandidateForm: type === "Azad Agent" ? handleAzadAgentForm: type === "Azad Supplier" ? handleAzadSupplierForm: type === "Azad Candidate" ? handleAzadCandForm: type === "Ticket Agent" ? handleTicketAgentForm: type === "Ticket Supplier" ? handleTicketSupplierForm: type === "Ticket Candidate" ? handleTicketCandForm: type === "Visit Agent" ? handleVisitAgentForm: type === "Visit Supplier" ? handleVisitSupplierForm: type === "Visit Candidate" ? handleVisitCandForm: type === "Credit/Debit WC" ? handleCDWCForm: type === "Credit/Debit WOC" ? handleCDWOCForm:type === "Assets"&& handleAssetForm)}>
            <div className="text-end ">
             
              <button className='btn btn-sm  submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Payment In"}</button>
              {/* <span className='btn btn-sm  submit_btn m-1 bg-primary border-0'><AddRoundedIcon fontSize='small'/></span> */}
            </div>
            <div className="row p-0 m-0 my-1">
            <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Choose Type </label>
                <select value={type} onChange={(e) => setType(e.target.value)} required>
                  <option value="">Choose</option>
                 <option value="Agent">Agent</option>
                 <option value="Supplier">Supplier</option>
                 <option value="Candidate">Candidate</option>
                 <option value="Azad Agent">Azad Agent</option>
                 <option value="Azad Supplier">Azad Supplier</option>
                 <option value="Azad Candidate">Azad Candidate</option>
                 <option value="Ticket Agent">Ticket Agent</option>
                 <option value="Ticket Supplier">Ticket Supplier</option>
                 <option value="Ticket Candidate">Ticket Candidate</option>
                 <option value="Visit Agent">Visit Agent</option>
                 <option value="Visit Supplier">Visit Supplier</option>
                 <option value="Visit Candidate">Visit Candidate</option>
                 <option value="Credit/Debit WC">Credit/Debit WC</option>
                 <option value="Credit/Debit WOC">Credit/Debit WOC</option>
                 <option value="Assets">Assets</option>
                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Name</label>
                <select required value={supplierName} onChange={(e) => {
                  setSelectedSupplier(e.target.value);
                  setSupplierName(e.target.value)
                }}>
                  
                 {type==="Agent" &&
                 <>
                 <option value="">Choose Agent</option>
                  {agent_Payments_In &&
                    agent_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                  {type==="Supplier" &&
                 <>
                 <option value="">Choose Supplier</option>
                  {supp_Payments_In &&
                    supp_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                  {type==="Candidate" &&
                 <>
                 <option value="">Choose Candidate</option>
                  {candidate_Payments_In &&
                    candidate_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                 {type==="Azad Agent" &&
                 <>
                 <option value="">Choose Azad Agent</option>
                  {azadAgent_Payments_In &&
                    azadAgent_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                  {type==="Azad Supplier" &&
                 <>
                 <option value="">Choose Azad Supplier</option>
                  {azadSupplier_Payments_In &&
                    azadSupplier_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                  {type==="Azad Candidate" &&
                 <>
                 <option value="">Choose Azad Candidate</option>
                  {azadCand_Payments_In &&
                    azadCand_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }

                {type==="Ticket Agent" &&
                 <>
                 <option value="">Choose Ticket Agent</option>
                  {ticketAgent_Payments_In &&
                    ticketAgent_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                  {type==="Ticket Supplier" &&
                 <>
                 <option value="">Choose Ticket Supplier</option>
                  {ticketSupplier_Payments_In &&
                    ticketSupplier_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                  {type==="Ticket Candidate" &&
                 <>
                 <option value="">Choose Ticket Candidate</option>
                  {ticketCand_Payments_In &&
                    ticketCand_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }

               {type==="Visit Agent" &&
                 <>
                 <option value="">Choose Visit Agent</option>
                  {visitAgent_Payments_In &&
                    visitAgent_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                  {type==="Visit Supplier" &&
                 <>
                 <option value="">Choose Visit Supplier</option>
                  {visitSupplier_Payments_In &&
                    visitSupplier_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                  {type==="Visit Candidate" &&
                 <>
                 <option value="">Choose Visit Candidate</option>
                  {visitCand_Payments_In &&
                    visitCand_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }

                  {type==="Credit/Debit WC" &&
                 <>
                 <option value="">Choose Credit/Debit WC</option>
                  {crediterPurchaseParties &&
                    crediterPurchaseParties.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                  {type==="Credit/Debit WOC" &&
                 <>
                 <option value="">Choose Credit/Debit WOC</option>
                  {crediterPurchaseParties &&
                    crediterPurchaseParties.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                 {type==="Assets" &&
                 <>
                 <option value="">Choose Asset</option>
                  {assets &&
                    assets.map((data) => (
                      <option key={data._id} value={data.assetName}>
                        {data.assetName}
                      </option>
                    ))
                  }
                 </>
                 }
                </select>

              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Category </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Choose</option>
                  {categories && categories.map((data) => (
                    <option key={data._id} value={data.category}>{data.category}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Payment Via </label>
                <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} required>
                  <option value="">Choose</option>
                  {paymentVia && paymentVia.map((data) => (
                    <option key={data._id} value={data.payment_Via}>{data.payment_Via}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Payment Type </label>
                <select value={payment_Type} onChange={(e) => setPayment_Type(e.target.value)} required>
                  <option value="">Choose</option>
                  {paymentType && paymentType.map((data) => (
                    <option key={data._id} value={data.payment_Type}>{data.payment_Type}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Slip No </label>
                <input type="text" value={slip_No} onChange={(e) => setSlip_No(e.target.value)} />
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Payment In </label>
                <input type="number" min="0" value={payment_In} onChange={(e) => setPayment_In(e.target.value)} required />
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Upload Slip </label>
                <input type="file" accept='image/*' onChange={handleImage} />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Date </label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                <label >Details </label>
                <textarea className='pt-2' value={details} onChange={(e) => setDetails(e.target.value)} />
              </div>
              {slip_Pic && <div className="col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                <div className="image">
                  <img src={slip_Pic} alt="" className='rounded' />
                </div>
              </div>}
            </div>
            <span className='btn btn-sm  add_section_btn' style={!section ? { backgroundColor: 'var(--accent-lighter-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={handleSection}>{!section ? <AddIcon fontSize='small'></AddIcon> : <RemoveIcon fontSize='small'></RemoveIcon>}{!section ? "Add Currency" : "Remove"}</span>
            {/* Add Crrency section */}
            {section &&
              <div className="row p-0 m-0 mt-5">
                <hr />
                <div className="col-xl-1 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >CUR Country </label>
                  <select value={curr_Country} onChange={(e) => setCurr_Country(e.target.value)}>
                    <option value="">choose</option>
                    {currCountries && currCountries.map((data) => (
                      <option key={data._id} value={data.currCountry}>{data.currCountry}</option>
                    ))}
                  </select>
                </div>
                <div className="col-xl-1 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >CUR Rate </label>
                  <input type="number" min="0" value={curr_Rate} onChange={(e) => setCurr_Rate(parseFloat(e.target.value))} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >Currency Amount </label>
                  <input type="number" value={curr_Amount} readOnly />
                </div>
              </div>}
          </form>
        </TableContainer>}
      </div>


      {/* Details */}
      <div className="row payment_details mt-0">
        <div className="col-md-12 my-2">
          {selectedSupplier && <button className='btn btn-sm  detail_btn' onClick={handleOpen}>{option ? 'Hide Details' : "Show Details"}</button>}
        </div>
        {option && (
          <div className="col-md-12 detail_table">
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead className="thead">
                  <TableRow>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Date</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Category</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Via</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Type</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Slip_No</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Details</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_In</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Cash_Out</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Invoice</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_In_Curr</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>CUR_Rate</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>CUR_Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(type === "Agent" ? agent_Payments_In : type === "Supplier" ? supp_Payments_In : type === "Candidate" ? candidate_Payments_In: type === "Azad Agent" ? azadAgent_Payments_In: type === "Azad Supplier" ? azadSupplier_Payments_In: type === "Azad Candidate" ? azadCand_Payments_In: type === "Ticket Agent" ? ticketAgent_Payments_In: type === "Ticket Supplier" ? ticketSupplier_Payments_In: type === "Ticket Candidate" ? ticketCand_Payments_In: type === "Visit Agent" ? visitAgent_Payments_In: type === "Visit Supplier" ? visitSupplier_Payments_In: type === "Visit Candidate" ? visitCand_Payments_In: type === "Credit/Debit WC" ? CDWC_Payments_In: type === "Credit/Debit WOC" ? CDWOC_Payments_In:type === "Assets" ? assetsPayments: [])
                    .filter((data) =>type === "Assets"? data.assetName:data.supplierName === selectedSupplier)
                    .map((filteredData) => (
                      // Map through the payment array
                      <>
                        {filteredData.payment && filteredData.payment?.map((paymentItem, index) => (
                          <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.date}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.category}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_Via}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_Type}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.slip_No}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.details}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{paymentItem?.payment_In}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.cash_Out}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.invoice}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_In_Curr}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.curr_Rate}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.curr_Amount}</TableCell>

                          </TableRow>
                        ))}

                        {/* <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Payment_In</TableCell>
                          <TableCell className=' data_td text-center  bg-info text-white text-bold'>{filteredData.total_Payment_In}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Payment_In_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Payment_In_Curr}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Visa_Price_In_PKR</TableCell>
                          <TableCell className=' data_td text-center  bg-info text-white text-bold'>{(type === "Agent" ||type === "Supplier"||type === "Candidate"||type === "Azad Candidate"||type === "Ticket Candidate"||type === "Visit Candidate")?filteredData.total_Visa_Price_In_PKR:(type === "Credit/Debit WC" ||type === "Credit/Debit WOC")?filteredData.total_Visa_Price_In_PKR:filteredData.total_Azad_Visa_Price_In_PKR}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Visa_Price_In_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Visa_Price_In_Curr}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Remaining PKR</TableCell>
                          <TableCell className=' data_td text-center  bg-success text-white text-bold'>{filteredData.total_Visa_Price_In_PKR-filteredData.total_Payment_In+filteredData.total_Cash_Out}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Remaining Total_Payment_In_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Visa_Price_In_Curr-filteredData.total_Payment_In_Curr}</TableCell>
                        </TableRow> */}
                      </>
                    ))}

                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

      </div>
      <Entry2></Entry2>
    </>
  )
}
