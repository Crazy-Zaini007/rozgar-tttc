import React, { useState, useEffect,useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import CategoryHook from '../hooks/settingHooks/CategoryHook'
import PaymentViaHook from '../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../hooks/settingHooks/PaymentTypeHook'
import CashInHandHook from '../hooks/cashInHandHooks/CashInHandHook'
import CurrCountryHook from '../hooks/settingHooks/CurrCountryHook'

import { useAuthContext } from '../hooks/userHooks/UserAuthHook'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import * as XLSX from 'xlsx';
import CircularProgress from '@mui/material/CircularProgress';

export default function BankCash() {
  const { user } = useAuthContext()
  const [single,setSingle]=useState(0)

const apiUrl = process.env.REACT_APP_API_URL;
const [show, setShow] = useState(false)
const [show1, setShow1] = useState(false)
const [show2, setShow2] = useState(false)


  const [category, setCategory] = useState('')
  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')
  const [slip_No, setSlip_No] = useState('')
  const [payment_In, setPayment_In] = useState()
  const [payment_Out, setPayment_Out] = useState()
  const [slip_Pic, setSlip_Pic] = useState('')
  const [details, setDetails] = useState('')
  const [date, setDate] = useState('')
  const [curr_Country, setCurr_Country] = useState('')
  const [curr_Rate, setCurr_Rate] = useState(0)

  let curr_Amount = (payment_In / curr_Rate).toFixed(2)


  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const cashInHand = useSelector((state) => state.cashInHand.cashInHand);
  const currCountries = useSelector((state) => state.setting.currCountries);

  const[loading2,setLoading2]=useState(false)

  const { getCurrCountryData } = CurrCountryHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const {getCashInHandData,getOverAllPayments,overAllPayments}=CashInHandHook()

  const aggregatedPayments = {};
let totalBankPaymentIn = 0;
let totalBankCashOutIn = 0;
let totalBankPaymentOut = 0;
let totalBankCashOutOut = 0;

// Iterate through all payments
overAllPayments.forEach(payment => {
  const paymentVia = payment.payment_Via.toLowerCase();

  // Initialize the entry for this payment_Via if it doesn't exist
  if (!aggregatedPayments[paymentVia]) {
    aggregatedPayments[paymentVia] = {
      totalBankPaymentIn: 0,
      totalBankCashOutIn: 0,
      totalBankPaymentOut: 0,
      totalBankCashOutOut: 0,
    };
  }

  // Update the sums based on payment type
  if ((payment.payment_In > 0 || payment.type.toLowerCase().includes('in'))) {
    aggregatedPayments[paymentVia].totalBankPaymentIn += payment.payment_In || 0;
    aggregatedPayments[paymentVia].totalBankCashOutIn += payment.cash_Out || 0;

    totalBankPaymentIn += payment.payment_In || 0;
    totalBankCashOutIn += payment.cash_Out || 0;
  }

  if ((payment.payment_Out > 0 || payment.type.toLowerCase().includes('out'))) {
    aggregatedPayments[paymentVia].totalBankPaymentOut += payment.payment_Out || 0;
    aggregatedPayments[paymentVia].totalBankCashOutOut += payment.cash_Out || 0;

    totalBankPaymentOut += payment.payment_Out || 0;
    totalBankCashOutOut += payment.cash_Out || 0;
  }
});

// Calculate the combined total for each payment_Via
const paymentViaTotals = Object.entries(aggregatedPayments).map(([paymentVia, totals]) => {
  return {
    paymentVia,
    total: (totals.totalBankPaymentIn + totals.totalBankCashOutIn) - (totals.totalBankPaymentOut + totals.totalBankCashOutOut),
  };
});

// Output the results

  const combinedTotalBankCash = (totalBankPaymentIn + totalBankCashOutIn) - (totalBankPaymentOut + totalBankCashOutOut);
  // getting Data from DB


  const [loading, setLoading] = useState(null)
  const [, setNewMessage] = useState('')



  const fetchData = async () => {
    try {
      setLoading2(true)
       
      await getCurrCountryData()
    await getPaymentViaData()
      await getCashInHandData();
      await getOverAllPayments()
      setLoading2(false)

    await getCategoryData()
    await getPaymentTypeData()



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
  }, [])



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


  const handleCashIn = async (e) => {
    setLoading(true)
    e.preventDefault()
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setPayment_Out('');
    setSlip_Pic('');
    setDetails('');
    setDate('');
    setCurr_Country('');
    setCurr_Rate('');
    try {
      const response = await fetch(`${apiUrl}/auth/cash_in_hand/add/cash`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          payment_Out,
          slip_Pic,
          details,
          date,
          curr_Country,
          curr_Rate,
          curr_Amount
        }),
      })

      const json = await response.json();
      if (!response.ok) {
        setLoading(false)
        setNewMessage(toast.error(json.message));

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        fetchData()
        setLoading(false);
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setPayment_Out('');
        setSlip_Pic('');
        setDetails('');
        setDate('');
        setCurr_Country('');
        setCurr_Rate('');
      }
    }
    catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  }

  const [option, setOption] = useState(0)
  const [current, setCurrent] = useState(0)
  // Editing Mode 
  const [editMode, setEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState({});
  const [editedRowIndex, setEditedRowIndex] = useState(null);

  const handleEditClick = (cash, index) => {
    setEditMode(!editMode);
    setEditedEntry(cash);
    setEditedRowIndex(index); // Set the index of the row being edited
  };


  const handleInputChange = (e, field) => {
    setEditedEntry({
      ...editedEntry,
      [field]: e.target.value,
    });

  };

  const handleImageChange = (e, field) => {
    if (field === 'slip_Pic') {
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




  const [loading1, setLoading1] = useState(false)
  const handleUpdate = async () => {
    setLoading1(true)
    try {
      const response = await fetch(`${apiUrl}/auth/cash_in_hand/update/cash`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          cashId: editedEntry._id,
          category: editedEntry.category,
          payment_Via: editedEntry.payment_Via,
          payment_Type: editedEntry.payment_Type,
          slip_No: editedEntry.slip_No,
          payment_In: editedEntry.payment_In,
          payment_Out: editedEntry.payment_Out,
          slip_Pic: editedEntry.slip_Pic,
          details: editedEntry.details,
          date: editedEntry.date,
          curr_Country: editedEntry.payment_In_Curr,
          curr_Amount: editedEntry.curr_Amount,
          curr_Rate: editedEntry.curr_Rate
        }),
      })

      const json = await response.json();
      if (!response.ok) {
        setLoading1(false)
        setNewMessage(toast.error(json.message));

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        fetchData()
        setLoading1(false);
        setEditMode(!editMode);

      }
    }
    catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading1(false);
    }
  }

  //Deleting Cash In/Out
  const deleteCash = async (cash) => {
    if (window.confirm('Are you sure you want to delete this record?')){
      setLoading(true)
      try {
        const response = await fetch(`${apiUrl}/auth/cash_in_hand/delete/cash`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            cashId: cash._id,
            payment_In:cash.payment_In,
            payment_Out:cash.payment_Out,
            payment_Via:cash.payment_Via,
  
  
          }),
        })
  
        const json = await response.json();
        if (!response.ok) {
          setLoading(false)
          setNewMessage(toast.error(json.message));
  
        }
        if (response.ok) {
          setNewMessage(toast.success(json.message));
          fetchData()
          setLoading(false);
  
        }
      }
      catch (error) {
        
        setNewMessage(toast.error('Server is not Responding...'));
        setLoading(false);
      }
    }
    
  }

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [slip, setSlip] = useState('')
  const [category1, setCategory1] = useState('')
  const [payment_Via1, setPayment_Via1] = useState('')
  const [payment_Type1, setPayment_Type1] = useState('')

  const filteredCash = cashInHand.payment
  ? cashInHand.payment.filter((paymentItem) => {
   
      let isDateInRange = true;
      // Check if the payment item's date is within the selected date range
      if (dateFrom && dateTo) {
        isDateInRange =
          paymentItem.date >= dateFrom && paymentItem.date <= dateTo;
      }
    
      return (
        paymentItem.category?.toLowerCase().includes(category1.toLowerCase()) &&
        isDateInRange &&
        paymentItem.payment_Via?.toLowerCase().includes(payment_Via1.toLowerCase()) &&
        paymentItem.payment_Type?.toLowerCase().includes(payment_Type1.toLowerCase())&&
        (paymentItem.slip_No?.trim().toLowerCase().startsWith(slip.trim().toLowerCase()) ||
        paymentItem.payment_Via?.trim().toLowerCase().startsWith(slip.trim().toLowerCase())||
        paymentItem.payment_Type?.trim().toLowerCase().startsWith(slip.trim().toLowerCase())
       )
      );
    })
  : [];



  const printCashTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Category</th>
        <th>Payment_Via</th>
        <th>Payment_Type</th>
        <th>Slip_No</th>
        <th>Details</th>
        <th>Cash_In</th>
        <th>Cash_Out</th>
        <th>Invoice</th>
        </tr>
      </thead>
      <tbody>
      ${filteredCash.map((entry, index) => `
          <tr key="${entry?._id}">
            <td>${index + 1}</td>
            <td>${String(entry?.date)}</td>
            <td>${String(entry?.category)}</td>
            <td>${String(entry?.payment_Via)}</td>
            <td>${String(entry?.payment_Type)}</td>
            <td>${String(entry?.slip_No)}</td>
            <td>${String(entry?.details)}</td>
            <td>${String(entry?.payment_In||0)}</td>
            <td>${String(entry?.payment_Out||0)}</td>
            <td>${String(entry?.invoice)}</td>
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
      <td>Total</td>
      <td>${String(filteredCash.reduce((total, expense) => total + expense?.payment_In||0, 0))}</td>
      <td>${String(filteredCash.reduce((total, expense) => total + expense?.payment_Out||0, 0))}</td>

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
          <title>CashIn Hand Details</title>
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
    filteredCash.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date:payments.date,
        Category:payments.category,
        Payment_Via:payments.payment_Via,
        Payment_Type:payments.payment_Type,
        Slip_No:payments.slip_No,
        Details:payments.details,
        Payment_In:payments?.payment_In||0,
        Payment_Out:payments?.payment_Out||0,
        Invoice:payments.invoice,


      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'cashInHand.xlsx');
  };
  



  const printBanksCashTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Category</th>
        <th>Payment_Via</th>
        <th>Payment_Type</th>
        <th>Slip_No</th>
        <th>Details</th>
        <th>Cash_In</th>
        <th>Cash_Out</th>
        <th>Invoice</th>
        </tr>
      </thead>
      <tbody>
      ${filteredBanksPayments.map((entry, index) => `
          <tr key="${entry?._id}">
            <td>${index + 1}</td>
            <td>${String(entry?.date)}</td>
            <td>${String(entry?.category)}</td>
            <td>${String(entry?.payment_Via)}</td>
            <td>${String(entry?.payment_Type)}</td>
            <td>${String(entry?.slip_No)}</td>
            <td>${String(entry?.details)}</td>
            <td>${String(entry?.payment_In||0)}</td>
            <td>${String(entry?.payment_Out||0)}</td>
            <td>${String(entry?.invoice)}</td>
          </tr>
        `).join('')
      }
     
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
          <title>Banks Details</title>
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
  const downloadBanksExcel = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredBanksPayments.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date:payments.date,
        Category:payments.category,
        Payment_Via:payments.payment_Via,
        Payment_Type:payments.payment_Type,
        Slip_No:payments.slip_No,
        Details:payments.details,
        Payment_In:payments?.payment_In||0,
        Payment_Out:payments?.payment_Out||0,
        Invoice:payments.invoice,


      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Banks.xlsx');
  };

  const [date2, setDate2] = useState('')
  const [date3, setDate3] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [type, setType] = useState('')
  const [category2, setCategory2] = useState('')
  const [payment_Via2, setPayment_Via2] = useState('')
  const [payment_Type2, setPayment_Type2] = useState('')
  const [search, setSearch] = useState('')

  const filteredPayment = overAllPayments
  ? overAllPayments.filter((paymentItem) => {
      let isDateInRange = true;

      // Check if the payment item's date is within the selected date range
      if (date2 && date3) {
        isDateInRange =
          paymentItem.date >= date2 && paymentItem.date <= date3;
      }

      return (
        paymentItem.category?.toLowerCase().includes(category2.toLowerCase()) &&
        isDateInRange &&
        paymentItem.supplierName?.toLowerCase().includes(supplierName.toLowerCase()) &&
        paymentItem.type?.toLowerCase().includes(type.toLowerCase()) &&
        paymentItem.payment_Via?.toLowerCase().includes(payment_Via2.toLowerCase()) &&
        paymentItem.payment_Type?.toLowerCase().includes(payment_Type2.toLowerCase())&&
        (paymentItem.supplierName?.trim().toLowerCase().startsWith(search.trim().toLowerCase()) ||
        paymentItem.pp_No?.trim().toLowerCase().startsWith(search.trim().toLowerCase()) ||
        paymentItem.type?.trim().toLowerCase().startsWith(search.trim().toLowerCase())||
        paymentItem.payment_Via?.trim().toLowerCase().startsWith(search.trim().toLowerCase())||
        paymentItem.payment_Type?.trim().toLowerCase().startsWith(search.trim().toLowerCase())
       )
      );
    })
  : [];

  const printOverAllCashTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Supp/Agent/Cand</th>
        <th>Reference Type</th>
        <th>Category</th>
        <th>Payment_Via</th>
        <th>Payment_Type</th>
        <th>Slip_No</th>
        <th>Details</th>
        <th>Cash_In</th>
        <th>Cash_Out</th>
        <th>Invoice</th>
        </tr>
      </thead>
      <tbody>
      ${filteredPayment.map((entry, index) => `
          <tr key="${entry?._id}">
            <td>${index + 1}</td>
            <td>${String(entry?.date)}</td>
            <td>${String(entry?.supplierName)}</td>
            <td>${String(entry?.type)}</td>
            <td>${String(entry?.category)}</td>
            <td>${String(entry?.payment_Via)}</td>
            <td>${String(entry?.payment_Type)}</td>
            <td>${String(entry?.slip_No)}</td>
            <td>${String(entry?.details)}</td>
            <td>${String(entry?.payment_In||0)}</td>
            <td>${String(entry?.cash_Out||0)}</td>
            <td>${String(entry?.invoice)}</td>
          </tr>
        `).join('')
      }
    
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
          <title>OverAll Payments Details</title>
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
      
      alert('Could not open print window. Please check your browser settings.');
    }
  };
  const downloadOverAllExcel = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredPayment.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date:payments.date,
        SupplierName:payments.supplierName,
        Reference:payments.type,
        Category:payments.category,
        Payment_Via:payments.payment_Via,
        Payment_Type:payments.payment_Type,
        Slip_No:payments.slip_No,
        Details:payments.details,
        Payment_In:payments.payment_In,
        Cash_Out:payments.cash_Out,
        Invoice:payments.invoice       
      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'cashInHand.xlsx');
  };


  const [bankName, setBankName] = useState('')

  const filteredBanksPayments = overAllPayments
  ? overAllPayments.filter((paymentItem) => {
      return (
        paymentItem.payment_Via?.toLowerCase().includes(bankName.toLowerCase()) 
      );
    })
  : [];

  const collapsed = useSelector((state) => state.collapsed.collapsed);
  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid py-2 cash_in_hand">
          <div className="row payment_details">
              <div className='col-md-12 p-0 border-0 border-bottom'>
              <div className='py-2 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <button className= 'btn btn-sm  m-1 show_btn' style={single===0 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setSingle(0)}>Bank Cash</button>
                  <button className= 'btn btn-sm  m-1 show_btn' style={single===1 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setSingle(1)}>All Banks</button>
                </div>
              </div>
            </div>
          </div>
         {single===0 &&
         <>
          {current === 0 &&single===0  &&
            <div className="row justify-content-center mt-3">
              <div className="col-lg-6 col-12  mt-md-4 mt-3  shadow px-0 pb-md-4 pb-3 rounded">
                <div className="account_details py-md-5 py-4 rounded px-0 m-0">
                  <h4 className='text-center'>Bank Account Details</h4>
                </div>
                <div className="account-text mt-md-4 mt-3 text-center">
                  <h6 className='my-2' onClick={() => setCurrent(1)}>{loading2 ? <CircularProgress></CircularProgress>: Math.round(combinedTotalBankCash && combinedTotalBankCash)}</h6>
                  <h5 className='my-2'>Bank Cash </h5>
                  <Link className="cash_in_btn m-1 btn btn-sm shadow " data-bs-toggle="modal" data-bs-target="#cashinModal">Cash In</Link>
                  <Link className="cash_out_btn m-1 btn btn-sm shadow " data-bs-toggle="modal" data-bs-target="#cashoutModal">Cash Out</Link>
                </div>
              </div>
              <div className="col-md-12 payment_details my-2 text-center ">
           {loading2 && <CircularProgress></CircularProgress>}
           {!loading2 &&
           <TableContainer className='detail_table' sx={{ maxHeight: 600 }}>
           <Table stickyHeader>
             <TableHead className="thead">
               <TableRow>
                 {paymentViaTotals && paymentViaTotals.map((data)=>(
                   <>
                   <TableCell className='label border text-center' >{data.paymentVia}</TableCell>
                   </>
                 ))}
               <TableCell className='label border text-center' >TOTAL</TableCell>

               </TableRow>
             </TableHead>
             <TableBody>
             {paymentViaTotals && paymentViaTotals.map((data,index)=>(
                   <>
                   <TableCell className='border data_td text-center ' key={index} >{Math.round(data.total)}</TableCell>
                   </>
                 ))}
                    <TableCell className='border data_td text-center text-white bg-success' >
      {Math.round(paymentViaTotals ? paymentViaTotals.reduce((total, data) => total + data.total, 0) : 0)}
    </TableCell>
             </TableBody>
           </Table>
          </TableContainer>
           }
        </div>
            </div>
          }
         </>
         }

         {single===1 && 
       <div className='row'>
           <div className='col-md-12 payment_details '>
              <div className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left ">
                  <h4>Each Bank Details</h4> <br />
                </div>
                <div className="right">
                <button className='btn btn-sm m-1 bg-info text-white shadow border-0' onClick={() => setShow1(!show1)}>{show1 === false ? "Show" : "Hide"}</button>
                     <button className= 'btn btn-sm  excel_btn m-1 btn-sm' onClick={downloadBanksExcel}>Download </button>
                      <button className= 'btn btn-sm  excel_btn m-1 btn-sm bg-success border-0' onClick={printBanksCashTable}>Print </button>
                </div>
              </div>
            </div>
         <div className="col-md-12 payment_details my-2">
           <div className="row justify-content-start">
<div className="col-md-12 tex-start mb-3">
  <button className='btn btn-sm me-1 mb-1 shadow'style={!bankName?{background:'var(--accent-stonger-blue)',color:'white',border:'1px solid var(--accent-stonger-blue)',fontSize:'12px'}:{color:'var(--accent-stonger-blue)',border:'1px solid var(--accent-stonger-blue)',fontSize:'12px'}} onClick={()=>setBankName('')}>All</button>
{[...new Set(paymentVia && paymentVia.map(data => data.payment_Via))].map(dateValue => (
                                <button className='btn btn-sm me-1 shadow' style={bankName===dateValue?{background:'var(--accent-stonger-blue)',color:'white',fontSize:'12px'}:{color:'var(--accent-stonger-blue)',border:'1px solid var(--accent-stonger-blue)',fontSize:'12px'}} onClick={()=>setBankName(dateValue)} value={dateValue} key={dateValue}>{dateValue}</button>
                              ))}
</div>
<TableContainer className='detail_table' sx={{ maxHeight: 600 }}>
           <Table stickyHeader>
           <TableHead className="thead">
                            <TableRow>
                              <TableCell className='label border text-center' >SN</TableCell>
                              <TableCell className='label border text-center'>Date</TableCell>
                              <TableCell className='label border text-center'>Name/PP#</TableCell>
                              <TableCell className='label border'>Company</TableCell>
                              <TableCell className='label border'>Trade</TableCell>
                              <TableCell className='label border'>Flight Date</TableCell>
                              <TableCell className='label border'>Final Status</TableCell>
                              <TableCell className='label border'>Entry Mode</TableCell>
                              <TableCell className='label border text-center'>Type</TableCell>
                              <TableCell className='label border text-center'>Category</TableCell>
                              <TableCell className='label border text-center'>Payment Via</TableCell>
                              <TableCell className='label border text-center'>Payment Type</TableCell>
                              <TableCell className='label border text-center'>Slip No</TableCell>
                              <TableCell className='label border'>Cash In</TableCell>
                            <TableCell className='label border'>Cash Out</TableCell>
                            <TableCell className='label border'>Cash In_Return</TableCell>
                            <TableCell className='label border'>Cash Out Return</TableCell>
                            {show1 && 
                           <>
                            <TableCell className='label border'>Curr Rate</TableCell>
                            <TableCell className='label border'>Curr Amount</TableCell>
                            <TableCell className='label border'>Payment In Curr</TableCell>
                           </>
                           }
                              <TableCell className='label border text-center'>Details</TableCell>
                              <TableCell className='label border text-center'>Invoice</TableCell>
                              <TableCell className='label border text-center'>Slip Pic</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredBanksPayments && filteredBanksPayments
                              .map((cash, outerIndex) => (
                                // Map through the payment array
                                <React.Fragment key={outerIndex}>
                                  <TableRow key={cash?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                                   
                                      <>
                                        <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.date}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.supplierName}/{cash.pp_No}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.company}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.trade}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.flight_Date}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.final_Status}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.entry_Mode}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.type}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.category}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.payment_Via}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.payment_Type}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash?.slip_No}</TableCell>
                                        <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{cash?.payment_In||0}</TableCell>
                                      <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{cash?.payment_Out||0}</TableCell>
                                      <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up text-warning text-bold"></i><i className="fa-solid fa-arrow-down me-2 text-warning text-bold"></i>{cash.type.toLowerCase().includes('in')&&cash.cash_Out||0}</TableCell>
                                      <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up text-warning text-bold"></i><i className="fa-solid fa-arrow-down me-2 text-warning text-bold"></i>{cash.type.toLowerCase().includes('out')&&cash.cash_Out||0}</TableCell>
                                     
                                        {show1 &&
                                       <>
                                        <TableCell className='border data_td text-center'>{Math.round(cash?.curr_Rate||0)}</TableCell>
                                      <TableCell className='border data_td text-center'>{Math.round(cash?.curr_Amount||0)}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash?.payment_In_curr?cash?.payment_In_curr:cash?.payment_Out_curr}</TableCell>
                                       </>
                                       }
                                        <TableCell className='border data_td text-center'>{cash?.details}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash?.invoice}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.slip_Pic ? <img src={cash.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>
                                       
                                      </>
                                  
                                  </TableRow>

                                </React.Fragment>
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
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className='border data_td text-center bg-secondary text-white'>Total {bankName?`In ${bankName}`:""}={
  filteredBanksPayments&&
  (
    filteredBanksPayments.filter(data => data.payment_Via === bankName)
      .reduce((total, entry) => total + (Math.round(entry.payment_In || 0)), 0)
    -
    filteredBanksPayments.filter(data => data.payment_Via === bankName).reduce((total, entry) => total + (Math.round(entry.payment_Out || 0)), 0)
  )
}

    </TableCell>
        <TableCell className='border data_td text-center bg-success text-white'>
    
    {filteredBanksPayments  && filteredBanksPayments.reduce((total, entry) => {
      return total + (Math.round(entry.payment_In || 0)); 
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-danger text-white'>
    
    {filteredBanksPayments && filteredBanksPayments.length > 0 && filteredBanksPayments.reduce((total, entry) => {
      return total + (Math.round(entry.payment_Out || 0)); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-warning text-white'>
  {/* Calculate the total sum of cash_Out based on payment_In */}
  {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round(entry.type.toLowerCase().includes('in') ? entry.cash_Out || 0 : 0)); 
  }, 0)}
</TableCell>
<TableCell className='border data_td text-center bg-warning text-white'>
  {/* Calculate the total sum of cash_Out based on payment_Out */}
  {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round(entry.type.toLowerCase().includes('out') ? entry.cash_Out || 0 : 0)); 
  }, 0)}
</TableCell>
{show1&&
 <>
  <TableCell className='border data_td text-center bg-info text-white'>
    {/* Calculate the total sum of payment_Out */}
    {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
      return total + (Math.round(entry.curr_Rate || 0)); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-warning text-white'>
    {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
      return total + (Math.round(entry.curr_Amount || 0));
    }, 0)}
  </TableCell>
 </>
 }
<TableCell className='border data_td text-center bg-secondary text-white'>
Remaining PKR= 
{(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In>0||entry.type.toLowerCase().includes('in')?entry.payment_In:0) || 0)); 
  }, 0))+(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In<1||entry.type.toLowerCase().includes('in')?entry.cash_Out:0) || 0)); 
  }, 0))-(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out>0||entry.type.toLowerCase().includes('out')?entry.payment_Out:0) || 0)); 
  }, 0))-(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out<1||entry.type.toLowerCase().includes('out')?entry.cash_Out:0) || 0)); 
  }, 0))}
</TableCell>
</TableRow>
</TableBody>
           </Table>
          </TableContainer>
           </div>
          
           
        </div>
       </div>
         }


          {current === 1 &&
            <div className="row">

              {(option===0 || option===1) && single===0 &&
              <div className='col-md-12 payment_details p-0'>
              <div className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left ">
                  <h4>Banks Cash Details</h4> <br />
                  <button className= 'btn btn-sm  m-1 show_btn' style={option === 0 ? { background: 'var(--accent-stonger-blue)', color: 'var(--white' } : {}} onClick={() => setOption(0)}>Direct IN/OUT</button>
                  <button className= 'btn btn-sm  m-1 show_btn' style={option === 1 ? { background: 'var(--accent-stonger-blue)', color: 'var(--white' } : {}} onClick={() => setOption(1)}>Overall Payments</button>

                </div>
                <div className="right">
                  {option === 0 &&
                    <>
                  <button className='btn btn-sm m-1 bg-info text-white shadow' onClick={() => setShow2(!show2)}>{show2 === false ? "Show" : "Hide"}</button>
                      <button className= 'btn btn-sm  excel_btn m-1 btn-sm' onClick={downloadExcel}>Download </button>
                      <button className= 'btn btn-sm  excel_btn m-1 btn-sm bg-success border-0' onClick={printCashTable}>Print </button>
                    </>
                  }
                    {option === 1 &&
                    <>
                  <button className='btn btn-sm m-1 bg-info text-white shadow border-0' onClick={() => setShow(!show)}>{show === false ? "Show" : "Hide"}</button>
                      <button className= 'btn btn-sm  excel_btn m-1 btn-sm' onClick={downloadOverAllExcel}>Download </button>
                      <button className= 'btn btn-sm  excel_btn m-1 btn-sm bg-success border-0' onClick={printOverAllCashTable}>Print </button>
                    </>
                  }
                  <button className= 'btn btn-sm  detail_btn' onClick={() => setCurrent(0)}><i className="fas fa-times"></i></button>

                </div>
              </div>
            </div>
              }

              {option === 0 && single===0 &&
                <div className="col-md-12 payment_details">
                  <div className="row">
                    <div className="col-md-12 filters">
                      <div className='py-1 mb-2 '>
                        <div className="row">
                        <div className="col-auto px-1">
                            <label htmlFor="">Search Here:</label><br/>
                           <input type="search" value={slip} onChange={(e)=>setSlip(e.target.value)} />
                          </div>
                        <div className="col-auto px-1">
                  <label htmlFor="">Date From:</label><br/>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className='m-0 p-1'/>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Date To:</label><br/>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className='m-0 p-1'/>
                 
                </div>
                         

                          <div className="col-auto px-1">
                            <label htmlFor="">Category:</label><br/>
                            <select value={category1} onChange={(e) => setCategory1(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(cashInHand.payment &&  cashInHand.payment.map(data => data.category))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-auto px-1">
                            <label htmlFor="">Payment Via:</label><br/>
                            <select value={payment_Via1} onChange={(e) => setPayment_Via1(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(cashInHand.payment && cashInHand.payment.map(data => data.payment_Via))]
                                    .filter(dateValue => dateValue.toLowerCase() !== 'cash')
                                    .map(dateValue => (
                                        <option value={dateValue} key={dateValue}>{dateValue}</option>
                                    ))}

                            </select>
                          </div>
                          <div className="col-auto px-1">
                            <label htmlFor="">Payment Type:</label><br/>
                            <select value={payment_Type1} onChange={(e) => setPayment_Type1(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(cashInHand.payment && cashInHand.payment.map(data => data.payment_Type))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                        
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12 detail_table my-2 p-0">

                      <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                          <TableHead className="thead">
                            <TableRow>
                              <TableCell className='label border' >SN</TableCell>
                              <TableCell className='label border' >Date</TableCell>
                              <TableCell className='label border' >Category</TableCell>
                              <TableCell className='label border' >Payment Via</TableCell>
                              <TableCell className='label border' >Payment Type</TableCell>
                              <TableCell className='label border' >Slip No</TableCell>
                              <TableCell className='label border' >Cash In</TableCell>
                              <TableCell className='label border' >Cash Out</TableCell>
                              <TableCell className='label border' >Details</TableCell>
                              <TableCell className='label border' >Invoice</TableCell>
                              {show2 && <>
                              <TableCell className='label border' >Payment_In_Curr</TableCell>
                              <TableCell className='label border' >CUR_Rate</TableCell>
                              <TableCell className='label border' >CUR_Amount</TableCell>
                            </>}
                              <TableCell className='label border' >Slip Pic</TableCell>
                              <TableCell align='left' className='edw_label border'  colSpan={1}>
                                Actions
                              </TableCell>

                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredCash
                              .map((cash, outerIndex) => (
                                // Map through the payment array
                                <React.Fragment key={cash._id}>
                                  <TableRow key={cash._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                                    {editMode && editedRowIndex === outerIndex ? (
                                      // Edit Mode
                                      <>
                                        <TableCell className='border data_td p-1 '>
                                          <input type='text' value={outerIndex + 1} readOnly />
                                        </TableCell>
                                        <TableCell className='border data_td p-1 '>
                                          <input type='date' value={editedEntry.date} onChange={(e) => handleInputChange(e, 'date')} />
                                        </TableCell>

                                        <TableCell className='border data_td p-1 '>
                                          <select value={editedEntry.category} onChange={(e) => handleInputChange(e, 'category')} required>
                                            <option value="">Choose</option>
                                            {categories && categories.map((data) => (
                                              <option key={data._id} value={data.category}>{data.category}</option>
                                            ))}
                                          </select>
                                        </TableCell>
                                        <TableCell className='border data_td p-1 '>
                                          <select value={editedEntry.payment_Via} onChange={(e) => handleInputChange(e, 'payment_Via')} required>
                                            <option value="">Choose</option>
                                            {paymentVia && paymentVia.map((data) => (
                                              <option key={data._id} value={data.payment_Via}>{data.payment_Via}</option>
                                            ))}
                                          </select>
                                        </TableCell>
                                        <TableCell className='border data_td p-1 '>
                                          <select value={editedEntry.payment_Type} onChange={(e) => handleInputChange(e, 'payment_Type')} required>
                                            <option value="">Choose</option>
                                            {paymentType && paymentType.map((data) => (
                                              <option key={data._id} value={data.payment_Type}>{data.payment_Type}</option>
                                            ))}
                                          </select>
                                        </TableCell>
                                        <TableCell className='border data_td p-1 '>
                                          <input type='text' value={editedEntry.slip_No} onChange={(e) => handleInputChange(e, 'slip_No')} />
                                        </TableCell>
                                        <TableCell className='border data_td p-1 '>
                                          <input type='number' min='0' value={editedEntry.payment_In} onChange={(e) => handleInputChange(e, 'payment_In')} />
                                        </TableCell>
                                        <TableCell className='border data_td p-1 '>
                                          <input type='number' min='0' value={editedEntry.payment_Out} onChange={(e) => handleInputChange(e, 'payment_Out')} />
                                        </TableCell>
                                        <TableCell className='border data_td p-1 '>
                                          <input type='text' value={editedEntry.details} onChange={(e) => handleInputChange(e, 'details')} />
                                        </TableCell>
                                        <TableCell className='border data_td p-1 '>
                                          <input type='text' value={editedEntry.invoice} readonly />
                                        </TableCell>
                                        {show2 && <>
                                        <TableCell className='border data_td p-1 '>
                                          <select required value={editedEntry.payment_In_Curr} onChange={(e) => handleInputChange(e, 'payment_In_Curr')}>
                                            <option className="my-1 py-2" value="">choose</option>
                                            {currCountries && currCountries.map((data) => (
                                              <option className="my-1 py-2" key={data._id} value={data.currCountry}>{data.currCountry}</option>
                                            ))}
                                          </select>
                                        </TableCell>
                                        <TableCell className='border data_td p-1 '>
                                          <input type='number' value={editedEntry.curr_Rate} onChange={(e) => handleInputChange(e, 'curr_Rate')} />
                                        </TableCell>
                                        <TableCell className='border data_td p-1 '>
                                          <input type='number' value={editedEntry.curr_Amount} onChange={(e) => handleInputChange(e, 'curr_Amount')} />
                                        </TableCell>
                                      </>}
                                        <TableCell className='border data_td p-1 '>
                                          <input type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'slip_Pic')} />
                                        </TableCell>
                                        <TableCell className='border data_td p-1 '>
                                        <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                            <button onClick={() => setEditMode(!editMode)} className= 'btn btn-sm  delete_btn'><i className="fa-solid fa-xmark"></i></button>
                                            <button onClick={() => handleUpdate()} className= 'btn btn-sm  save_btn' disabled={loading1}><i className="fa-solid fa-check"></i></button>

                                          </div>
                                        </TableCell>
                                      </>
                                    ) : (
                                      // Non-Edit Mode
                                      <>
                                        <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.date}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.category}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.payment_Via}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.payment_Type}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash?.slip_No}</TableCell>
                                        <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{cash.payment_In}</TableCell>
                                        <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{cash.payment_Out}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash?.details}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash?.invoice}</TableCell>
                                        {show2 && <>
                                        <TableCell className='border data_td text-center' >{cash?.payment_In_Curr}</TableCell>
                                        <TableCell className='border data_td text-center' >{cash?.curr_Rate}</TableCell>
                                        <TableCell className='border data_td text-center' >{cash?.curr_Amount}</TableCell>
                                      </>}
                                        <TableCell className='border data_td text-center'>{cash.slip_Pic ? <img src={cash.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>
                                        <TableCell className='border data_td text-center'>
                                        <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                            <button onClick={() => handleEditClick(cash, outerIndex)} className= 'btn btn-sm edit_btn'><i className="fa-solid fa-pen-to-square"></i></button>
                                            <button className= 'btn btn-sm  delete_btn' onClick={() => deleteCash(cash)} disabled={loading}><i className="fa-solid fa-trash-can"></i></button>
                                          </div>
                                         
                                        </TableCell>
                                      </>
                                    )}
                                  </TableRow>

                                </React.Fragment>
                              ))}
                               <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                            <TableCell className='border data_td text-center bg-success text-white'>
                      {/* Calculate the total sum of payment_In */}
                      {filteredCash.reduce((total, cash) => total + cash.payment_In, 0)}
                    </TableCell>
                    <TableCell className='border data_td text-center bg-danger text-white'>
                      {/* Calculate the total sum of payment_Out */}
                      {filteredCash.reduce((total, cash) => total + cash.payment_Out, 0)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    {show2 && <>
                      <TableCell className='border data_td text-center bg-success text-white'>
                      {/* Calculate the total sum of payment_In */}
                      {filteredCash.reduce((total, cash) => total + cash.curr_Rate, 0)}
                    </TableCell>
                    <TableCell className='border data_td text-center bg-success text-white'>
                      {/* Calculate the total sum of payment_In */}
                      {filteredCash.reduce((total, cash) => total + cash.curr_Amount, 0)}
                    </TableCell>
                  
                    </>}
                            
                          </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                    </div>

                  </div>
                </div>
              }
  {option === 1 && single===0 &&
                <div className="col-md-12 payment_details">
                  <div className='row'>
                  <div className="col-md-12 filters">
                      <div className='py-1 mb-2'>
                        <div className="row">
                        <div className="col-auto px-1">
                            <label htmlFor="">Search Here:</label><br/>
                           <input type="search" value={search} onChange={(e)=>setSearch(e.target.value)} />
                          </div>
                        <div className="col-auto px-1">
                  <label htmlFor="">Date From:</label><br/>
                  <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className='m-0 p-1'/>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Date To:</label><br/>
                  <input type="date" value={date3} onChange={(e) => setDate3(e.target.value)} className='m-0 p-1'/>
                 
                </div>
                          
                          <div className="col-auto px-1">
                            <label htmlFor="">Name:</label><br/>
                            <select value={supplierName} onChange={(e) => setSupplierName(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.supplierName))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-auto px-1">
                            <label htmlFor="">Reference Type:</label><br/>
                            <select value={type} onChange={(e) => setType(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.type))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-auto px-1">
                            <label htmlFor="">Category:</label><br/>
                            <select value={category2} onChange={(e) => setCategory2(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.category))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-auto px-1">
                            <label htmlFor="">Payment Via:</label><br/>
                            <select value={payment_Via2} onChange={(e) => setPayment_Via2(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.payment_Via))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-auto px-1">
                            <label htmlFor="">Payment Type:</label><br/>
                            <select value={payment_Type2} onChange={(e) => setPayment_Type2(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.payment_Type))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="col-md-12 detail_table my-2 p-0">

                      <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                          <TableHead className="thead">
                            <TableRow>
                              <TableCell className='label border ' >SN</TableCell>
                              <TableCell className='label border '>Date</TableCell>
                              <TableCell className='label border '>Name/PP#</TableCell>
                              <TableCell className='label border'>Company</TableCell>
                              <TableCell className='label border'>Trade</TableCell>
                              <TableCell className='label border'>Flight Date</TableCell>
                              <TableCell className='label border'>Final Status</TableCell>
                              <TableCell className='label border'>Entry Mode</TableCell>
                              <TableCell className='label border'>Type</TableCell>
                              <TableCell className='label border'>Category</TableCell>
                              <TableCell className='label border'>Payment Via</TableCell>
                              <TableCell className='label border'>Payment Type</TableCell>
                              <TableCell className='label border'>Slip No</TableCell>
                              <TableCell className='label border'>Cash In</TableCell>
                            <TableCell className='label border'>Cash Out</TableCell>
                            <TableCell className='label border'>Cash In Return</TableCell>
                            <TableCell className='label border '>Cash Out Return</TableCell>
                           
                              {show && 
                              <>
                              <TableCell className='label border ' >Curr Rate</TableCell>
                            <TableCell className='label border ' >Curr Amount</TableCell>
                            <TableCell className='label border' >Payment In Curr</TableCell>
                              </>
                              }
                              <TableCell className='label border '>Details</TableCell>
                              <TableCell className='label border'>Invoice</TableCell>
                              <TableCell className='label border'>Slip_Pic</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredPayment
                              .map((cash, outerIndex) => (
                                // Map through the payment array
                                <React.Fragment key={outerIndex}>
                                  <TableRow key={cash?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                                   
                                      <>
                                        <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.date}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.supplierName}/{cash?.pp_No}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.company}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.trade}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.flight_Date}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.final_Status}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.entry_Mode}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.type}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.category}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.payment_Via}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.payment_Type}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash?.slip_No}</TableCell>
                                        <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{cash?.payment_In||0}</TableCell>
                                      <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{cash?.payment_Out||0}</TableCell>
                                      <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up text-warning text-bold"></i><i className="fa-solid fa-arrow-down me-2 text-warning text-bold"></i>{cash.type.toLowerCase().includes('in')&&cash.cash_Out||0}</TableCell>
                                      <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up text-warning text-bold"></i><i className="fa-solid fa-arrow-down me-2 text-warning text-bold"></i>{cash.type.toLowerCase().includes('out')&&cash.cash_Out||0}</TableCell>
                                  
                                        {show &&
                                       <>
                                        <TableCell className='border data_td text-center'>{Math.round(cash?.curr_Rate||0)}</TableCell>
                                      <TableCell className='border data_td text-center'>{Math.round(cash?.curr_Amount||0)}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash?.payment_In_curr?cash?.payment_In_curr:cash?.payment_Out_curr}</TableCell>
                                       </>
                                       }
                                        <TableCell className='border data_td text-center'>{cash?.details}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash?.invoice}</TableCell>
                                        <TableCell className='border data_td text-center'>{cash.slip_Pic ? <img src={cash.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>
                                       
                                      </>
                                  
                                  </TableRow>

                                </React.Fragment>
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
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                            <TableCell className='border data_td text-center bg-success text-white'>
    {/* Calculate the total sum of payment_In */}
    {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
      return total + (Math.round(entry.payment_In || 0)); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-danger text-white'>
    {/* Calculate the total sum of payment_Out */}
    {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
      return total + (Math.round(entry.payment_Out || 0)); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-warning text-white'>
  {/* Calculate the total sum of cash_Out based on payment_In */}
  {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round(entry.type.toLowerCase().includes('in') ? entry.cash_Out || 0 : 0)); 
  }, 0)}
</TableCell>
<TableCell className='border data_td text-center bg-warning text-white'>
  {/* Calculate the total sum of cash_Out based on payment_Out */}
  {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round(entry.type.toLowerCase().includes('out') ? entry.cash_Out || 0 : 0)); 
  }, 0)}
</TableCell>
  {show && 
  <>
  <TableCell className='border data_td text-center bg-info text-white'>
    {/* Calculate the total sum of payment_Out */}
    {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
      return total + (Math.round(entry.curr_Rate || 0)); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-warning text-white'>
    {/* Calculate the total sum of cash_Out */}
    {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
      return total + (Math.round(entry.curr_Amount || 0)); // Use proper conditional check
    }, 0)}
  </TableCell>
  </>
  }
   <TableCell className='border data_td text-center bg-secondary text-white'>
Remaining PKR= 
{(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In>0||entry.type.toLowerCase().includes('in')?entry.payment_In:0) || 0)); 
  }, 0))+(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In<1||entry.type.toLowerCase().includes('in')?entry.cash_Out:0) || 0)); 
  }, 0))-(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out>0||entry.type.toLowerCase().includes('out')?entry.payment_Out:0) || 0)); 
  }, 0))-(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out<1||entry.type.toLowerCase().includes('out')?entry.cash_Out:0) || 0)); 
  }, 0))}
</TableCell>
{/* <TableCell className='border data_td text-center bg-secondary text-white'>
Remaining Curr= 
{(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In>0||entry.type.toLowerCase().includes('in')?entry.curr_Amount:0) || 0)); 
  }, 0))+(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_In||entry.payment_In<1||entry.type.toLowerCase().includes('in')?entry.curr_Amount:0) || 0)); 
  }, 0))-(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out>0||entry.type.toLowerCase().includes('out')?entry.curr_Amount:0) || 0)); 
  }, 0))-(filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round((entry.payment_Out||entry.payment_Out<1||entry.type.toLowerCase().includes('out')?entry.curr_Amount:0) || 0)); 
  }, 0))}
</TableCell> */}
                            
                          </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                    </div>
                  </div>
                </div>
              }



            </div>
          }

          {/* Cash in Modal */}
          <div className="modal fade payment_form border-0" id="cashinModal" tabIndex={-1} aria-labelledby="exampleModalLabel" data-bs-backdrop="static" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg border-0">
              <div className="modal-content border-0">
                <div className="modal-header bg-success border-0">
                  <h5 className="modal-title text-white " id="exampleModalLabel"><strong>CASH IN</strong></h5>
                  <button type="button" className="btn-close shadow btn-sm text-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => (
                    setCategory(''),
                    setPayment_Via(''),
                    setPayment_Type(''),
                    setSlip_No(''),
                    setPayment_In(''),
                    setPayment_Out(''),
                    setSlip_Pic(''),
                    setDetails(''),
                    setDate('')
                  )
                  } />
                </div>
                <div className="modal-body border-0">
                  <form className='py-1 px-2' onSubmit={handleCashIn}>

                    <div className="row p-0 m-0 my-1">
                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Date </label><br/>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                      </div>
                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Category </label><br/>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                          <option value="">Choose</option>
                          {categories && categories.map((data) => (
                            <option key={data._id} value={data.category}>{data.category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Payment Via </label><br/>
                        <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} required>
                          <option value="">Choose</option>
                          {paymentVia && paymentVia.map((data) => (
                            
                                <option key={data._id} value={data.payment_Via}>{data.payment_Via}</option>
                            
                            ))}
                        </select>
                      </div>
                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Payment Type </label><br/>
                        <select value={payment_Type} onChange={(e) => setPayment_Type(e.target.value)} required>
                          <option value="">Choose</option>
                          {paymentType && paymentType.map((data) => (
                            <option key={data._id} value={data.payment_Type}>{data.payment_Type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Slip No </label><br/>
                        <input type="text" value={slip_No} onChange={(e) => setSlip_No(e.target.value)} />
                      </div>

                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Cash In </label><br/>
                        <input type="number" min="0" value={payment_In} onChange={(e) => setPayment_In(e.target.value)} required />
                      </div>

                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Upload Slip </label><br/>
                        <input type="file" accept='image/*' onChange={handleImage} />
                      </div>

                      <div className="col-xl-6 col-12 p-1 my-1">
                      <label >CUR Country </label>
                  <select value={curr_Country} onChange={(e) => setCurr_Country(e.target.value)}>
                    <option value="">choose</option>
                    {currCountries && currCountries.map((data) => (
                      <option key={data._id} value={data.currCountry}>{data.currCountry}</option>
                    ))}
                  </select>
                      </div>
                      <div className="col-xl-6 col-12 p-1 my-1">
                      <label >CUR Rate </label>
                      <input type="number" value={curr_Rate} onChange={(e) => setCurr_Rate(parseFloat(e.target.value))} />
                      </div>
                      <div className="col-xl-6 col-12 p-1 my-1">
                      <label >Currency Amount </label>
                      <input type="number" value={curr_Amount} readOnly />
                      </div>

                      <div className="col-xl-6 col-12   p-1 my-1">
                        <label >Details </label><br />
                        <textarea className='pt-2' value={details} onChange={(e) => setDetails(e.target.value)} />
                      </div>


                      
                    </div>
                    <div className="text-center">

                      <button className="btn btn-success shadow" disabled={loading}><strong>{loading ? "Adding" : "Cash In"}</strong></button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>


          {/* Cash Out Modal */}
          <div className="modal fade payment_form border-0" id="cashoutModal" tabIndex={-1} aria-labelledby="exampleModalLabel" data-bs-backdrop="static" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg border-0">
              <div className="modal-content border-0">
                <div className="modal-header bg-danger border-0">
                  <h5 className="modal-title text-white " id="exampleModalLabel"><strong>CASH OUT</strong></h5>
                  <button type="button" className="btn-close shadow btn-sm text-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => (
                    setCategory(''),
                    setPayment_Via(''),
                    setPayment_Type(''),
                    setSlip_No(''),
                    setPayment_In(''),
                    setPayment_Out(''),
                    setSlip_Pic(''),
                    setDetails(''),
                    setDate('')

                  )
                  } />
                </div>
                <div className="modal-body border-0">
                  <form className='py-1 px-2' onSubmit={handleCashIn} >

                    <div className="row p-0 m-0 my-1">
                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Date </label><br/>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                      </div>
                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Category </label><br/>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                          <option value="">Choose</option>
                          {categories && categories.map((data) => (
                            <option key={data._id} value={data.category}>{data.category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Payment Via </label><br/>
                        <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} required>
                          <option value="">Choose</option>
                          {paymentVia && paymentVia.map((data) => (
                          
                                <option key={data._id} value={data.payment_Via}>{data.payment_Via}</option>
                            
                            ))}
                        </select>
                      </div>
                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Payment Type </label><br/>
                        <select value={payment_Type} onChange={(e) => setPayment_Type(e.target.value)} required>
                          <option value="">Choose</option>
                          {paymentType && paymentType.map((data) => (
                            <option key={data._id} value={data.payment_Type}>{data.payment_Type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Slip No </label><br/>
                        <input type="text" value={slip_No} onChange={(e) => setSlip_No(e.target.value)} />
                      </div>

                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Cash Out </label><br/>
                        <input type="number" min="0" value={payment_Out} onChange={(e) => setPayment_Out(e.target.value)} required />
                      </div>

                      <div className="col-xl-6  col-12 p-1 my-1">
                        <label >Upload Slip </label><br/>
                        <input type="file" accept='image/*' onChange={handleImage} />
                      </div>


                      <div className="col-xl-6 col-12 p-1 my-1">
                      <label >CUR Country </label>
                  <select value={curr_Country} onChange={(e) => setCurr_Country(e.target.value)}>
                    <option value="">choose</option>
                    {currCountries && currCountries.map((data) => (
                      <option key={data._id} value={data.currCountry}>{data.currCountry}</option>
                    ))}
                  </select>
                      </div>
                      <div className="col-xl-6 col-12 p-1 my-1">
                      <label >CUR Rate </label>
                      <input type="number" value={curr_Rate} onChange={(e) => setCurr_Rate(parseFloat(e.target.value))} />
                      </div>
                      <div className="col-xl-6 col-12 p-1 my-1">
                      <label >Currency Amount </label>
                      <input type="number" value={curr_Amount} readOnly />
                      </div>

                      <div className="col-xl-6 col-12   p-1 my-1">
                        <label >Details </label><br />
                        <textarea className='pt-2' value={details} onChange={(e) => setDetails(e.target.value)} />
                      </div>

                      <div className="col-xl-6 col-12   p-1 my-1">
                        <label >Details </label><br/>
                        <textarea className='pt-2' value={details} onChange={(e) => setDetails(e.target.value)} />
                      </div>
                    </div>
                    <div className="text-center">

                      <button className="btn btn-danger shadow" disabled={loading}><strong>{loading ? "Adding" : "Cash Out"}</strong></button>

                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>



        </div>
      </div>

    </>
  )
}
