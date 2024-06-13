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
import ProtectorHook from '../../../../hooks/protectorHooks//ProtectorHook';
import ExpeCategoryHook from '../../../../hooks/settingHooks/ExpeCategoryHook'

// import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function Entry2() {
  const dispatch = useDispatch();
  // getting data from redux store 

  const currCountries = useSelector((state) => state.setting.currCountries);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const agent_Payments_Out = useSelector((state) => state.agents.agent_Payments_Out)
  const candidate_Payments_Out = useSelector((state) => state.candidates.candidate_Payments_Out)
  const supp_Payments_Out = useSelector((state) => state.suppliers.supp_Payments_Out)

  const azadAgent_Payments_Out = useSelector((state) => state.azadVisa.azadAgent_Payments_Out)
  const azadCand_Payments_Out = useSelector((state) => state.azadVisa.azadCand_Payments_Out)
  const azadSupplier_Payments_Out = useSelector((state) => state.azadVisa.azadSupplier_Payments_Out)
  const ticketAgent_Payments_Out = useSelector((state) => state.tickets.ticketAgent_Payments_Out)
  const ticketCand_Payments_Out = useSelector((state) => state.tickets.ticketCand_Payments_Out)
  const ticketSupplier_Payments_Out = useSelector((state) => state.tickets.ticketSupplier_Payments_Out)
  const visitAgent_Payments_Out = useSelector((state) => state.visits.visitAgent_Payments_Out)
  const visitCand_Payments_Out = useSelector((state) => state.visits.visitCand_Payments_Out)
  const visitSupplier_Payments_Out = useSelector((state) => state.visits.visitSupplier_Payments_Out)
  const protector_Payments_Out = useSelector((state) => state.protectors.protector_Payments_Out)

  const CDWC_Payments_In = useSelector((state) => state.creditsDebitsWC.CDWC_Payments_In);
  const CDWOC_Payments_In = useSelector((state) => state.creditsDebitsWOC.CDWOC_Payments_In);
  const crediterPurchaseParties = useSelector((state) => state.setting.crediterPurchaseParties)
  const assets = useSelector((state) => state.setting.assets)
  const assetsPayments = useSelector((state) => state.assetsPayments.assetsPayments);
  const expenseCategories = useSelector((state) => state.setting.expenseCategories);

  const [selectedSupplier, setSelectedSupplier] = useState('');

  const { getCurrCountryData } = CurrCountryHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const { getAgentPaymentsOut } = AgentHook()
  const { getSupplierPaymentsOut } = SupplierHook()
  const { getCandPaymentsOut } = CandidateHook()
  const { getAzadAgentPaymentsOut,getAzadCandPaymentsOut,getAzadSupplierPaymentsOut } = AzadVisaHook()
  const { getTicketAgentPaymentsOut,getTicketCandPaymentsOut,getTicketSupplierPaymentsOut } = TicketHook()
  const { getVisitAgentPaymentsOut,getVisitCandPaymentsOut,getVisitSupplierPaymentsOut } = VisitHook()
  const { getCDWCPaymentsOut } = CDWCHook()
  const { getCDWOCPaymentsOut } = CDWOCHook()
  const { getCPPData } = CPPHook()
  const { getAssetsData } = NewAssetsHook()
  const { getPayments } = AssetsHook()
  const { getPaymentsOut } = ProtectorHook()
  const { getExpenseCategoryData } = ExpeCategoryHook()

  // getting Data from DB
  const abortCont = useRef(new AbortController());

  const { user } = useAuthContext()
  const fetchData = async () => {
    try {
      // Use Promise.all to execute all promises concurrently
      getCurrCountryData()
        getCategoryData()
        getPaymentViaData()
        getPaymentTypeData()
        getExpenseCategoryData()
        getAgentPaymentsOut()
        getPaymentsOut()
        getSupplierPaymentsOut()
        getCandPaymentsOut()
        getAzadAgentPaymentsOut()
        getAzadCandPaymentsOut()
        getAzadSupplierPaymentsOut()
        getTicketAgentPaymentsOut()
        getTicketCandPaymentsOut()
        getTicketSupplierPaymentsOut()
        getVisitAgentPaymentsOut()
        getVisitCandPaymentsOut()
        getVisitSupplierPaymentsOut()
        getCPPData()
        getAssetsData()
        getPayments()
        getCDWCPaymentsOut()
        getCDWOCPaymentsOut()
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
  const apiUrl = process.env.REACT_APP_API_URL;

  const [type, setType] = useState(false)

  // Form input States

  const [supplierName, setSupplierName] = useState('')
  const [category, setCategory] = useState('')
  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')
  const [slip_No, setSlip_No] = useState('')
  const [payment_Out, setPayment_Out] = useState()
  const [slip_Pic, setSlip_Pic] = useState('')
  const [details, setDetails] = useState('')
  const [curr_Country, setCurr_Country] = useState('')
  const [curr_Rate, setCurr_Rate] = useState()
  const [date, setDate] = useState('')

  useEffect(() => {
  }, [type,supplierName,selectedSupplier])

  let curr_Amount = Math.round(payment_Out / curr_Rate);


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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/agents/add/payment_out`, {
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
          payment_Out,
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
        getPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    try {
      const response = await fetch(`${apiUrl}/auth/suppliers/add/payment_out`, {
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
          payment_Out,
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
        getPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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


  const handleCandidateForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/candidates/add/payment_out`, {
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
          payment_Out,
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
        getPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/azadVisa/agents/add/payment_out`, {
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
          payment_Out,
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
        getAzadAgentPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/azadVisa/candidates/add/payment_out`, {
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
          payment_Out,
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
        getAzadCandPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/azadVisa/suppliers/add/payment_out`, {
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
          payment_Out,
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
        getAzadSupplierPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/ticket/agents/add/payment_out`, {
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
          payment_Out,
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
        getTicketAgentPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/ticket/candidates/add/payment_out`, {
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
          payment_Out,
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
        getTicketCandPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/ticket/suppliers/add/payment_out`, {
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
          payment_Out,
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
        getTicketSupplierPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/visit/agents/add/payment_out`, {
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
          payment_Out,
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
        getVisitAgentPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/visit/candidates/add/payment_out`, {
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
          payment_Out,
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
        getVisitCandPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/visit/suppliers/add/payment_out`, {
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
          payment_Out,
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
        getVisitSupplierPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/credits&debits/with_cash_in_hand/add/payment_out`, {
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
          payment_Out,
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
        getPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/credits&debits/without_cash_in_hand/add/payment_out`, {
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
          payment_Out,
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
        getPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
    setPayment_Out('');
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
          payment_Out,
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
        getPayments();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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

  const handleProtectorForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/protectors/add/payment_out`, {
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
          payment_Out,
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
        getPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
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
  }
  const handleExpenseForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
    try {
        const response = await fetch(`${apiUrl}/auth/expenses/add/expense`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                name:supplierName,
                expCategory:category,
                payment_Out,
                payment_Via,
                payment_Type,
                slip_No,
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
            setPayment_Out('');
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
  return (
    <>
      <div className="col-md-12 ">
        {!option && <TableContainer component={Paper}>
          <form className='py-3 px-2' onSubmit={(type==='Agent'?handleAgentForm:type==="Supplier"?handleSupplierForm:type==="Candidate"?handleCandidateForm: type === "Azad Agent" ? handleAzadAgentForm: type === "Azad Supplier" ? handleAzadSupplierForm: type === "Azad Candidate" ? handleAzadCandForm: type === "Ticket Agent" ? handleTicketAgentForm: type === "Ticket Supplier" ? handleTicketSupplierForm: type === "Ticket Candidate" ? handleTicketCandForm: type === "Visit Agent" ? handleVisitAgentForm: type === "Visit Supplier" ? handleVisitSupplierForm: type === "Visit Candidate" ? handleVisitCandForm: type === "Credit/Debit WC" ? handleCDWCForm: type === "Credit/Debit WOC" ? handleCDWOCForm:type === "Assets"? handleAssetForm:type === "Protector"? handleProtectorForm:type === "Expense"&& handleExpenseForm)}>
            <div className="text-end ">
             
              <button className='btn btn-sm  submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Payment Out"}</button>
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
                 <option value="Protector">Protector</option>
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
                 <option value="Expense">Expense</option>


                </select>
              </div>
              
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Name</label>
                {(type!=='Expense' || type==='')  ?
                <select required value={supplierName} onChange={(e) => {
                  setSelectedSupplier(e.target.value);
                  setSupplierName(e.target.value)
                }}>
                  
                 {type==="Agent" &&
                 <>
                 <option value="">Choose Agent</option>
                  {agent_Payments_Out &&
                    agent_Payments_Out.map((data) => (
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
                  {supp_Payments_Out &&
                    supp_Payments_Out.map((data) => (
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
                  {candidate_Payments_Out &&
                    candidate_Payments_Out.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }
                   {type==="Protector" &&
                 <>
                 <option value="">Choose Protector</option>
                  {protector_Payments_Out &&
                    protector_Payments_Out.map((data) => (
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
                  {azadAgent_Payments_Out &&
                    azadAgent_Payments_Out.map((data) => (
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
                  {azadSupplier_Payments_Out &&
                    azadSupplier_Payments_Out.map((data) => (
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
                  {azadCand_Payments_Out &&
                    azadCand_Payments_Out.map((data) => (
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
                  {ticketAgent_Payments_Out &&
                    ticketAgent_Payments_Out.map((data) => (
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
                  {ticketSupplier_Payments_Out &&
                    ticketSupplier_Payments_Out.map((data) => (
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
                  {ticketCand_Payments_Out &&
                    ticketCand_Payments_Out.map((data) => (
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
                  {visitAgent_Payments_Out &&
                    visitAgent_Payments_Out.map((data) => (
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
                  {visitSupplier_Payments_Out &&
                    visitSupplier_Payments_Out.map((data) => (
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
                  {visitCand_Payments_Out &&
                    visitCand_Payments_Out.map((data) => (
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
                </select>:
                <input type="text" value={supplierName}  onChange={(e)=>setSupplierName(e.target.value)} />
                }

              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label>{type==="Expense"&&"Expense"} Category </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Choose</option>
                 {type !=="Expense" &&
                 <>
                  {categories && categories.map((data) => (
                    <option key={data._id} value={data.category}>{data.category}</option>
                  ))}
                 </>
                 }
                  {type ==="Expense" &&
                 <>
                  {expenseCategories && expenseCategories.map((data) => (
                    <option key={data._id} value={data.category}>{data.category}</option>
                  ))}
                 </>
                 }
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
                <label >Payment Out </label>
                <input type="number" min="0" value={payment_Out} onChange={(e) => setPayment_Out(e.target.value)} required />
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
                  <input type="number" min="0" value={curr_Rate} onChange={(e) => setCurr_Rate(e.target.value)} />
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
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Out</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Cash_Out</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Invoice</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Out_Curr</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>CUR_Rate</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>CUR_Amount</TableCell>


                  </TableRow>
                </TableHead>
                <TableBody>
                {(type === "Agent" ? agent_Payments_Out : type === "Supplier" ? supp_Payments_Out : type === "Candidate" ? candidate_Payments_Out: type === "Azad Agent" ? azadAgent_Payments_Out: type === "Azad Supplier" ? azadSupplier_Payments_Out: type === "Azad Candidate" ? azadCand_Payments_Out: type === "Ticket Agent" ? ticketAgent_Payments_Out: type === "Ticket Supplier" ? ticketSupplier_Payments_Out: type === "Ticket Candidate" ? ticketCand_Payments_Out: type === "Visit Agent" ? visitAgent_Payments_Out: type === "Visit Supplier" ? visitSupplier_Payments_Out: type === "Visit Candidate" ? visitCand_Payments_Out: type === "Credit/Debit WC" ? CDWC_Payments_In: type === "Credit/Debit WOC" ? CDWOC_Payments_In:type === "Assets" ? assetsPayments:type === "Protector" ? protector_Payments_Out: [])
                    .filter((data) => type === "Assets"? data.assetName:data.supplierName === selectedSupplier)
                    .map((filteredData) => (
                      // Map through the payment array
                      <>
                        {filteredData.payment.map((paymentItem, index) => (
                          <TableRow key={paymentItem._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem.date}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem.category}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem.payment_Via}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem.payment_Type}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem.slip_No}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem.details}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{paymentItem?.payment_Out}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.cash_Out}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.invoice}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem.payment_Out_Curr}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem.curr_Rate}</TableCell>
                            <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem.curr_Amount}</TableCell>

                          </TableRow>
                        ))}
                        {/* Move these cells inside the innermost map loop */}

                        {/* <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Payment_Out</TableCell>
                          <TableCell className=' data_td text-center  bg-info text-white text-bold'>{filteredData.total_Payment_Out}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Payment_Out_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Payment_Out_Curr}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Visa_Price_Out_PKR</TableCell>
                          <TableCell className=' data_td text-center  bg-info text-white text-bold'>{filteredData.total_Visa_Price_Out_PKR}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Visa_Price_Out_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Visa_Price_Out_Curr}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Remaining PKR</TableCell>
                          <TableCell className=' data_td text-center  bg-success text-white text-bold'>{filteredData.total_Visa_Price_Out_PKR-filteredData.total_Payment_Out+filteredData.total_Cash_Out}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Remaining Total_Payment_Out_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Visa_Price_Out_Curr-filteredData.total_Payment_Out_Curr}</TableCell>
                        </TableRow> */}
                      </>
                    ))}

                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

      </div>


    </>
  )
}
