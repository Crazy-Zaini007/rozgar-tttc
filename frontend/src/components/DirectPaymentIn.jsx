import React, { useState, useEffect,useRef } from "react";
import { useAuthContext } from "../hooks/userHooks/UserAuthHook";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import CategoryHook from "../hooks/settingHooks/CategoryHook";
import PaymentViaHook from "../hooks/settingHooks/PaymentViaHook";
import PaymentTypeHook from "../hooks/settingHooks/PaymentTypeHook";
import CurrCountryHook from "../hooks/settingHooks/CurrCountryHook";
import CashInHandHook from '../hooks/cashInHandHooks/CashInHandHook'
import AgentHook from '../hooks/agentHooks/AgentHook';
import SupplierHook from '../hooks/supplierHooks/SupplierHook';
import CandidateHook from '../hooks/candidateHooks/CandidateHook';
import AzadVisaHook from '../hooks/azadVisaHooks/AzadVisaHooks';
import TicketHook from '../hooks/ticketHooks/TicketHook';
import VisitHook from '../hooks/visitsHooks/VisitHook';
import CDWCHook from '../hooks/creditsDebitsWCHooks/CDWCHook'
import CPPHook from '../hooks/settingHooks/CPPHook';

import CreditorSupplierHook from '../hooks/settingHooks/CreditorSupplierHook';
import CDWOCHook from '../hooks/creditsDebitsWOCHooks/CDWOCHook'
import NewAssetsHook from '../hooks/settingHooks/NewAssetsHook';

export default function DirectPaymentIn() {
const myDate = new Date(); myDate .setHours(0, 0, 0, 0);const currentDate = myDate.toLocaleDateString('en-CA');
const [show, setShow] = useState(false)

  const dispatch = useDispatch();
  // getting data from redux store
  const currCountries = useSelector((state) => state.setting.currCountries);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);

  const agent_Payments_In = useSelector((state) => state.agents.agent_Payments_In);
  const supp_Payments_In = useSelector((state) => state.suppliers.supp_Payments_In);
  const candidate_Payments_In = useSelector((state) => state.candidates.candidate_Payments_In);

//   AzadVisa
  const azadAgent_Payments_In = useSelector((state) => state.azadVisa.azadAgent_Payments_In);
  const azadSupplier_Payments_In = useSelector((state) => state.azadVisa.azadSupplier_Payments_In);
  const azadCand_Payments_In = useSelector((state) => state.azadVisa.azadCand_Payments_In);

//   Ticket Visa
const ticketAgent_Payments_In = useSelector((state) => state.tickets.ticketAgent_Payments_In);
const ticketSupplier_Payments_In = useSelector((state) => state.tickets.ticketSupplier_Payments_In);
const ticketCand_Payments_In = useSelector((state) => state.tickets.ticketCand_Payments_In);

// Visit Visa
const visitAgent_Payments_In = useSelector((state) => state.visits.visitAgent_Payments_In);
const visitSupplier_Payments_In = useSelector((state) => state.visits.visitSupplier_Payments_In);
const visitCand_Payments_In = useSelector((state) => state.visits.visitCand_Payments_In);

const crediterPurchaseParties = useSelector((state) => state.setting.crediterPurchaseParties)
const crediterSuppliers = useSelector((state) => state.setting.crediterSuppliers);


const apiUrl = process.env.REACT_APP_API_URL;
  const { getCurrCountryData } = CurrCountryHook();
  const { getCategoryData } = CategoryHook();
  const { getPaymentViaData } = PaymentViaHook();
  const { getPaymentTypeData } = PaymentTypeHook();

  const { getPaymentsIn } = AgentHook();
  const { getAzadAgentPaymentsIn,getAzadSupplierPaymentsIn,getAzadCandPaymentsIn } = AzadVisaHook();
  const {getCandPaymentsIn } = CandidateHook();
  const { getSupplierPaymentsIn } = SupplierHook();
  const { getTicketAgentPaymentsIn,getTicketSupplierPaymentsIn,getTicketCandPaymentsIn } = TicketHook();
  const { getVisitAgentPaymentsIn,getVisitSupplierPaymentsIn,getVisitCandPaymentsIn } = VisitHook()
  const { getCDWCPaymentsIn } = CDWCHook()
  const { getCDWOCPaymentsIn } = CDWOCHook()
  const { getCPPData } = CPPHook()
  const { getAssetsData } = NewAssetsHook()
  const { getOverAllPayments, overAllPayments } = CashInHandHook()
  const { getCreditoSupplierData } = CreditorSupplierHook()
  
  const [option, setOption] = useState(false);
  // Form input States
  const [ref, setRef] = useState("");

  const [supplierName, setSupplierName] = useState("");
  const [category, setCategory] = useState("");
  const [payment_Via, setPayment_Via] = useState("");
  const [payment_Type, setPayment_Type] = useState("");
  const [slip_No, setSlip_No] = useState("");
  const [payment_In, setPayment_In] = useState();
  const [slip_Pic, setSlip_Pic] = useState("");
  const [details, setDetails] = useState("");
  const [curr_Country, setCurr_Country] = useState("");
  const [curr_Rate, setCurr_Rate] = useState('')
  const [cand_Name, setCand_Name] = useState("");
  const [date, setDate] = useState("");
  let curr_Amount = (payment_In / curr_Rate).toFixed(2);

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [supplierNames, setSupplierNames] = useState([]);
  const [selectedPersonDetails, setSelectedPersonDetails] = useState({});
  // getting Data from DB
  const { user } = useAuthContext();
  const fetchData = async () => {
    try {
      
      getOverAllPayments()
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
      getCreditoSupplierData()
      getAssetsData()
      getCDWCPaymentsIn()
      getCDWOCPaymentsIn()
    
    } catch (error) { }
  };

  const abortCont = useRef(new AbortController());

  useEffect(() => {
    fetchData();
    return () => {
      if (abortCont.current) {
        abortCont.current.abort(); 
      }
    }
  }, [user, dispatch,selectedSupplier,supplierNames,selectedPersonDetails,cand_Name]);

  useEffect(() => {
    // Reset the cand_Name state when the ref value changes
    setCand_Name("");
  }, [ref]);


  const printPersonsTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>Date</th>
        <th>Name</th>
        <th>PP#</th>
        <th>Entry_Mode</th>
        <th>Company</th>
        <th>Trade</th>
        <th>Country</th>
        <th>Final tatus</th>
        <th>Flight Date</th>
        <th>VPI PKR</th>
        <th>Total In PKR</th>
        <th>Remaining PKR</th>
        <th>VPI Oth Curr</th>
        <th>Remaining Curr</th>
        </tr>
      </thead>
      <tbody>
     
          <tr>
            <td>${String(selectedPersonDetails?.entry_Date)}</td>
            <td>${String(selectedPersonDetails?.name)}</td>
            <td>${String(selectedPersonDetails?.pp_No)}</td>
            <td>${String(selectedPersonDetails?.entry_Mode)}</td>
            <td>${String(selectedPersonDetails?.company)}</td>
            <td>${String(selectedPersonDetails?.trade)}</td>
            <td>${String(selectedPersonDetails?.country)}</td>
            <td>${String(selectedPersonDetails?.final_Status)}</td>
            <td>${String(selectedPersonDetails?.flight_Date)}</td>
            <td>${String(selectedPersonDetails?.visa_Price_In_PKR)}</td>
            <td>${String(selectedPersonDetails?.total_In)}</td>
            <td>${String(
      (selectedPersonDetails?.visa_Price_In_PKR - selectedPersonDetails?.total_In) +
      selectedPersonDetails?.cash_In
    )}</td>
            <td>${String(selectedPersonDetails?.visa_Price_In_Curr)}</td>
            <td>${String(selectedPersonDetails?.remaining_Curr)}</td>

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
          <title>${selectedPersonDetails.name} Details</title>
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
  }
  const handleOpen = () => {
    setOption(!option);
  };

  // handle Picture

  const handleImage = (e) => {
    const file = e.target.files[0];
    TransformFile(file);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds the 5MB limit. Please select a smaller file.");
      } else {
        TransformFile(file);
      }
    } else {
      alert("No file selected.");
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
      setSlip_Pic("");
    }
  };

  // Submitting Form Data
  const [loading, setLoading] = useState(null);
  const [, setNewMessage] = useState("");
  

  // Update the state when the cand_Name value changes
  const handlePersonChange = (selectedPersonName) => {
    // Find the selected person in the persons array of the selected supplier
    if(ref==="Agent Cand-Vise"){
      const selectedAgentData = agent_Payments_In.find(
        (data) => data.supplierName === selectedSupplier
      )
      
      if (selectedAgentData) {
        const selectedPerson = selectedAgentData.persons.find(
          (person) => person.name === selectedPersonName
        )
        // Update the state with the details of the selected person
        setSelectedPersonDetails(selectedPerson || {});
      } 
      else {
        // If selectedSupplierData is not found, reset the person details state
        setSelectedPersonDetails({});
      }
    }
    if(ref==="Supplier Cand-Vise"){
      const selectedSupplierData = supp_Payments_In.find(
        (data) => data.supplierName === selectedSupplier
      )
      
      if (selectedSupplierData) {
        const selectedPerson = selectedSupplierData.persons.find(
          (person) => person.name === selectedPersonName
        )
        // Update the state with the details of the selected person
        setSelectedPersonDetails(selectedPerson || {});
      } 
      else {
        // If selectedSupplierData is not found, reset the person details state
        setSelectedPersonDetails({});
      }
    }
  }


// Filtering the Enteries
const [mySearch, setMySearch] = useState('')
const [reference_Out, setReference_Out] = useState('')

const todayPayments = overAllPayments && overAllPayments.filter(payment => payment.date === currentDate )

const filteredPayments =todayPayments && todayPayments.filter(entry => {
  return (
   (entry?.supplierName?.trim().toLowerCase().includes(mySearch.trim().toLowerCase()) ||
    entry?.category?.trim().toLowerCase().includes(mySearch.trim().toLowerCase()) ||
    entry?.payment_Via?.trim().toLowerCase().includes(mySearch.trim().toLowerCase()) ||
    entry?.payment_Type?.trim().toLowerCase().includes(mySearch.trim().toLowerCase())) &&
    entry?.supplierName?.trim().toLowerCase().includes(reference_Out.trim().toLowerCase()) 
  )
})




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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
   
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
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
      
      getOverAllPayments()
      
    }

  } catch (error) {
    console.error('Fetch error:', error);
    setNewMessage(toast.error('Server is not Responding...'));
    setLoading(false);
  }
};


  return (
    <>
  
<div className="col-auto py-3 mb-1 detail_table p-0 m-0">
  <div className="row p-0 m-0">
  <div className="col-12 p-0 m-0">
  {!option && (
         
         <form className="py-3 px-2" onSubmit={(ref==='Agent'?handleAgentForm:ref==="Supplier"?handleSupplierForm:ref==="Candidate"?handleCandidateForm: ref === "Azad Agent" ? handleAzadAgentForm: ref === "Azad Supplier" ? handleAzadSupplierForm: ref === "Azad Candidate" ? handleAzadCandForm: ref === "Ticket Agent" ? handleTicketAgentForm: ref === "Ticket Supplier" ? handleTicketSupplierForm: ref === "Ticket Candidate" ? handleTicketCandForm: ref === "Visit Agent" ? handleVisitAgentForm: ref === "Visit Supplier" ? handleVisitSupplierForm: ref === "Visit Candidate" ? handleVisitCandForm: ref === "Credit/Debit WC" ? handleCDWCForm: ref === "Credit/Debit WOC" ? handleCDWOCForm:ref === "Assets"&& handleAssetForm)}>
              <div className="d-flex justify-content-between">
                <div className="left">
              <h4 className='text-sm d-inline'>Payment In</h4>
                </div>
                <div className="right">
                  <div className="text-end ">
                  <span className="btn btn-sm submit_btn bg-info m-1 px-2 border-0">
                  Yesterday Balance : {Math.round((
                    (overAllPayments && overAllPayments.length > 0
                      ? overAllPayments
                          .filter(entry => entry.date !== currentDate)
                          .reduce((total, entry) => {
                            return total + (entry.payment_In || 0);
                          }, 0)
                      : 0)-(overAllPayments && overAllPayments.length > 0
                        ? overAllPayments
                            .filter(entry => entry.date !== currentDate)
                            .reduce((total, entry) => {
                              return total + (entry.payment_Out || 0);
                            }, 0)
                        : 0)
                      
                  ).toFixed(2))}
                </span>
                    <span className="btn btn-sm submit_btn m-1  px-3 border-0">Today : <i className="fas fa-arrow-down me-1 ms-2"></i>
                    {Math.round((
                    (overAllPayments && overAllPayments.length > 0
                      ? overAllPayments
                          .filter(entry => entry.date === currentDate)
                          .reduce((total, entry) => {
                            return total + (entry.payment_In || 0);
                          }, 0)
                      : 0)+(overAllPayments && overAllPayments.length > 0
                        ? overAllPayments
                            .filter(entry => entry.date === currentDate)
                            .reduce((total, entry) => {
                              return total + ((entry.payment_In ||entry.payment_In<1 || entry.type.toLowerCase().includes('in')?entry.cash_Out:0) || 0);
                            }, 0)
                        : 0)
                      
                  ).toFixed(2))}
                    </span>
                <button className="btn btn-sm submit_btn m-1 " disabled={loading}>
                  {loading ? "Adding..." : "Add Payment"}
                </button>
              </div>
                </div>
              </div>
              <TableContainer>
              <Table >
                <TableHead>
                  <TableRow>
                    <TableCell className="label border">Reference_Type</TableCell>
                    <TableCell className="label border">Name</TableCell>
                    <TableCell className="label border">Category</TableCell>
                    <TableCell className="label border">Payment_Via</TableCell>
                    <TableCell className="label border">Payment_Type</TableCell>
                    <TableCell className="label border">Slip_No</TableCell>
                    <TableCell className="label border">Payment_In </TableCell>
                    <TableCell className="label border">Date</TableCell>
                    {(ref==="Agent Cand-Vise" || ref==="Supplier Cand-Vise") &&  <TableCell className="label border">Candidate</TableCell>}
                    <TableCell className="label border">Details</TableCell>
                    <TableCell className="label border">Curr_Country</TableCell>
                    <TableCell className="label border">Curr_Rate</TableCell>
                    <TableCell className="label border">Curr_Amount</TableCell>
                    <TableCell className="label border">Upload_Slip</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className="border data_td p-0">
                  <select name="" id="" value={ref} onChange={(e)=>setRef(e.target.value)}>
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
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <select className="p-0"
                    required
                    value={supplierName}

                    onChange={(e) => {
                      const selectedSupplierValue = e.target.value;

                      if (selectedSupplierValue === "") {
                        // User selected "Choose Supplier", reset both values
                        setSelectedSupplier("");
                        setSupplierName("");
                        setSupplierNames([]); 
                      } else {
                        // User selected an actual supplier
                        setSelectedSupplier(selectedSupplierValue);
                        setSupplierName(selectedSupplierValue);

                       if(ref==="Agent Cand-Vise"){
                         
                        const selectedAgentData = agent_Payments_In.find(
                          (data) => data.supplierName === selectedSupplierValue
                        );

                        // Update the supplierNames state with the names of persons array of the selected supplier
                        if (selectedAgentData) {
                          const namesOfPersons =
                          selectedAgentData.persons || [];
                          setSupplierNames(namesOfPersons);
                        }
                       }
                       if(ref==="Supplier Cand-Vise"){
                         
                        const selectedSupplierData = supp_Payments_In.find(
                          (data) => data.supplierName === selectedSupplierValue
                        );

                        // Update the supplierNames state with the names of persons array of the selected supplier
                        if (selectedSupplierData) {
                          const namesOfPersons =
                          selectedSupplierData.persons || [];
                          setSupplierNames(namesOfPersons);
                        }
                       }
                      }
                    }}
                  >
                   {ref==="Agent" &&
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
                  
                   {ref==="Supplier" &&
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
                  {ref==="Candidate" &&
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
                 {ref==="Azad Agent" &&
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
                  {ref==="Azad Supplier" &&
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
                  {ref==="Azad Candidate" &&
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

                {ref==="Ticket Agent" &&
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
                  {ref==="Ticket Supplier" &&
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
                  {ref==="Ticket Candidate" &&
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

               {ref==="Visit Agent" &&
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
                  {ref==="Visit Supplier" &&
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
                  {ref==="Visit Candidate" &&
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

                  {ref==="Credit/Debit WC" &&
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
                  {ref==="Credit/Debit WOC" &&
                 <>
                 <option value="">Choose Credit/Debit WOC</option>
                  {crediterSuppliers &&
                    crediterSuppliers.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                 </>
                 }   
                  </select>
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <select className="p-0"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Choose</option>
                    {categories &&
                      categories.map((data) => (
                        <option key={data._id} value={data.category}>
                          {data.category}
                        </option>
                      ))}
                  </select>
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <select className="p-0"
                    value={payment_Via}
                    onChange={(e) => setPayment_Via(e.target.value)}
                    required
                  >
                    <option value="">Choose</option>
                    {paymentVia &&
                      paymentVia.map((data) => (
                        <option key={data._id} value={data.payment_Via}>
                          {data.payment_Via}
                        </option>
                      ))}
                  </select>
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <select className="p-0"
                    value={payment_Type}
                    onChange={(e) => setPayment_Type(e.target.value)}
                    required
                  >
                    <option value="">Choose</option>
                    {paymentType &&
                      paymentType.map((data) => (
                        <option key={data._id} value={data.payment_Type}>
                          {data.payment_Type}
                        </option>
                      ))}
                  </select>
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <input className="p-0"
                    type="text"
                    value={slip_No}
                    onChange={(e) => setSlip_No(e.target.value)}
                  />
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <input className="p-0"
                    type="number"
                    min="0"
                    value={payment_In}
                    onChange={(e) => setPayment_In(e.target.value)}
                    required
                  />
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <input className="p-0"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    
                  />
                    </TableCell>
                    {(ref==="Agent Cand-Vise" || ref==="Supplier Cand-Vise") && <>
                    <TableCell className="border data_td p-0">
                    <select className="p-0"
                    value={cand_Name}
                    onChange={(e) => {
                      const selectedPersonName = e.target.value;
                      setCand_Name(selectedPersonName);
                      // If the selected option is "Choose," reset selectedPersonDetails and supplierNames
                      if (selectedPersonName === "") {
                        setSelectedPersonDetails({});
                      } else {
                        handlePersonChange(selectedPersonName);
                      }
                    }}
                    required
                  >
                    <option value="">Choose</option>
                    {supplierNames.map((person) => (
                      <option key={person.name} value={person.name}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                    </TableCell>
                   
                    </>}
                    <TableCell className="border data_td p-1">
                    <textarea className="p-0"
                    
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <select className="p-0"
                      value={curr_Country}
                      onChange={(e) => setCurr_Country(e.target.value)}
                    >
                      <option value="">choose</option>
                      {currCountries &&
                        currCountries.map((data) => (
                          <option key={data._id} value={data.currCountry}>
                            {data.currCountry}
                          </option>
                        ))}
                    </select>
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <input className="p-0"
                      type="text"
                      value={curr_Rate}
                      onChange={(e) => setCurr_Rate(parseFloat(e.target.value))}
                    />
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <input className="p-0" type="number" value={curr_Amount} readOnly />
                    </TableCell>
                    <TableCell className="border data_td p-1">
                  <input className="p-0" type="file" accept="image/*" onChange={handleImage} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </TableContainer>
              <div className="row p-0 m-0 my-1">
                {slip_Pic && (
                  <div className="col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                    <div className="image">
                      <img src={slip_Pic} alt="" className="rounded" />
                    </div>
                  </div>
                )}
              </div>
             
            </form>
          
        )}
    </div>
    <div className="col-md-12 filters">
                <div className='py-1 mb-2'>
                  <div className="row">
                  <div className="col-auto px-1">
                      <label htmlFor="">Search:</label>
                      <input type="search"  value={mySearch} onChange={(e)=>setMySearch(e.target.value)}/>
                    </div>
                    <div className="col-auto px-1 ">
                      <label htmlFor="">Agent/Supp/Cand:</label>
                      <select value={reference_Out} onChange={(e) => setReference_Out(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      {[...new Set(todayPayments.filter(entry => entry.type.toLowerCase().includes('in')))].map(name => (
      <option key={name.supplierName} value={name.supplierName}>{name.supplierName}</option>
    ))}
                      
                    </select>
                    </div>

                  </div>
                </div>
              </div>
    <div className="col-md-12 today_Payments_Table p-0">
    <div className="text-end">
    <button className='btn btn-sm m-1 bg-info text-white shadow border-0' onClick={() => setShow(!show)}>{show === false ? "Show" : "Hide"}</button>
    </div>

      <TableContainer sx={{ maxHeight: 150 }}>
        <Table stickyHeader>
        <TableHead>
          <TableRow>
                              <TableCell className='label border  p-1'>SN</TableCell>
                              <TableCell className='label border p-1'>Date</TableCell>
                              <TableCell className='label border p-1'>Name/PP#</TableCell>
                              <TableCell className='label border p-1'>Type</TableCell>
                              <TableCell className='label border p-1'>Category</TableCell>
                              <TableCell className='label border  p-1'>Payment_Via</TableCell>
                              <TableCell className='label border p-1'>Payment_Type</TableCell>
                              <TableCell className='label border p-1'>Slip_No</TableCell>
                              <TableCell className='label border p-1'>Cash_In</TableCell>
                              <TableCell className='label border p-1'>Cash_Return</TableCell>
                              {show && 
                              <>
                              <TableCell className='label border  p-1'>Curr_Rate</TableCell>
                            <TableCell className='label border  p-1' >Curr_Amount</TableCell>
                            <TableCell className='label border p-1' >Payment_In_Curr</TableCell>
                              </>
                              }
                              <TableCell className='label border  p-1'>Details</TableCell>
                              <TableCell className='label border  p-1'>Invoice</TableCell>
                              <TableCell className='label border p-1'>Slip_Pic</TableCell>
                            </TableRow>
        </TableHead>
        <TableBody>
                            {filteredPayments && filteredPayments.length > 0 ? filteredPayments.filter(cash => (cash?.payment_In || cash?.payment_In>0 ||cash?.type.toLowerCase().includes('in'))&&!cash.payments ).map((cash, outerIndex) => (
                              // Map through the payment array

                              <>
                                <TableRow key={cash?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                                  <>
                                    <TableCell className='border text-center data_td p-1'>{outerIndex + 1}</TableCell>
                                    <TableCell className='border text-center data_td p-1'>{cash.date}</TableCell>
                                    <TableCell className='border data_td text-center p-1'>{cash.supplierName}/{cash?.pp_No}</TableCell>
                                    <TableCell className='border text-center data_td p-1'>{cash.type}</TableCell>
                                    <TableCell className='border text-center data_td p-1'>{cash.category}</TableCell>
                                    <TableCell className='border text-center data_td p-1'>{cash.payment_Via}</TableCell>
                                    <TableCell className='border text-center data_td p-1'>{cash.payment_Type}</TableCell>
                                    <TableCell className='border text-center data_td p-1'>{cash?.slip_No}</TableCell>
                                    <TableCell className='border text-center data_td p-1'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{cash.payment_In}</TableCell>
                                    <TableCell className='border text-center data_td p-1'><i className="fa-solid fa-arrow-up text-warning text-bold"></i><i className="fa-solid fa-arrow-down me-2 text-warning text-bold"></i>{cash.cash_Out}</TableCell>
                                    
                                    {show &&
                                       <>
                                        <TableCell className='border text-center data_td p-1'>{(cash?.curr_Rate||0).toFixed(2)}</TableCell>
                                      <TableCell className='border text-center data_td  p-1'>{(cash?.curr_Amount||0).toFixed(2)}</TableCell>
                                      <TableCell className='border text-center data_td  p-1'>{cash?.payment_In_curr}</TableCell>
                                       </>
                                       }
                                    <TableCell className='border text-center data_td  p-1'>{cash?.details}</TableCell>
                                    <TableCell className='border text-center data_td p-1'>{cash?.invoice}</TableCell>
                                    <TableCell className='border text-center data_td  p-1'>{cash.slip_Pic ? <a href={cash.slip_Pic} target="_blank" rel="noopener noreferrer"> <img src={cash.slip_Pic} alt='Images' className='rounded ' /></a>  : "No Picture"}</TableCell>
                                  </>

                                </TableRow>


                              </>

                            )) : <TableRow>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell className='data_td text-center'>Not_found</TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                            </TableRow>}
                            <TableRow>
                              <TableCell colSpan={7}></TableCell>
                              <TableCell className='border data_td text-center bg-secondary text-white p-1'>Total</TableCell>
                              <TableCell className='border data_td text-center bg-success text-white  p-1'>
                            {/* Calculate the total sum of payment_In */}
                            {filteredPayments && filteredPayments.length > 0 &&
                              filteredPayments
                                .filter(entry => entry?.payment_In>0)
                                .reduce((total, entry) => {
                                  return total + (Math.round(entry.payment_In || 0&&!entry.payments));
                                }, 0)}
                          </TableCell>
                          <TableCell className='border data_td text-center bg-warning text-white  p-1'>
                            {/* Calculate the total sum of cash_Out */}
                            {filteredPayments && filteredPayments.length > 0 &&
                              filteredPayments
                                .filter(entry => (entry?.payment_In||entry?.type.toLowerCase().includes('in')&&!entry.payments))
                                .reduce((total, entry) => {
                                  return total + (Math.round(entry.cash_Out || 0));
                                }, 0)}
                          </TableCell>
                          {show &&
                         <>
                          <TableCell className='border data_td text-center bg-info text-white p-1'>
                            {/* Calculate the total sum of payment_Out */}
                             {filteredPayments && filteredPayments.length > 0 &&
                              filteredPayments
                                .filter(entry => (entry?.payment_In&&!entry.payments))
                                .reduce((total, entry) => {
                                  return total + ((entry.curr_Rate || 0).toFixed(2));
                                }, 0)}
                          </TableCell>
                          <TableCell className='border data_td text-center bg-warning text-white p-1'>
                            {/* Calculate the total sum of cash_Out */}
                            {filteredPayments && filteredPayments.length > 0 &&
                              filteredPayments
                                .filter(entry =>(entry?.payment_In&&!entry.payments))
                                .reduce((total, entry) => {
                                  return total + ((entry.curr_Amount || 0).toFixed(2));
                                }, 0)}
                          </TableCell>
                         </>
                         }
                         <TableCell className='border data_td text-center bg-secondary text-white'>
Remaining PKR= 
{(filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In>0||entry.type.toLowerCase().includes('in')?entry.payment_In:0) || 0)); 
  }, 0))+(filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In<1||entry.type.toLowerCase().includes('in')?entry.cash_Out:0) || 0)); 
  }, 0))-(filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out>0||entry.type.toLowerCase().includes('out')?entry.payment_Out:0) || 0)); 
  }, 0))-(filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out<1||entry.type.toLowerCase().includes('out')?entry.cash_Out:0) || 0)); 
  }, 0))}
</TableCell>
<TableCell className='border data_td text-center bg-secondary text-white'>
Remaining Curr= 
{(filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In>0||entry.type.toLowerCase().includes('in')?entry.curr_Amount:0) || 0)); 
  }, 0))+(filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In<1||entry.type.toLowerCase().includes('in')?entry.curr_Amount:0) || 0)); 
  }, 0))-(filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out>0||entry.type.toLowerCase().includes('out')?entry.curr_Amount:0) || 0)); 
  }, 0))-(filteredPayments && filteredPayments.length > 0 && filteredPayments.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out<1||entry.type.toLowerCase().includes('out')?entry.curr_Amount:0) || 0)); 
  }, 0))}
</TableCell>

                            </TableRow>
                          </TableBody>
        </Table>
      </TableContainer>
    </div>
  </div>
 
        
      </div>
   

      
    </>
  );
}
