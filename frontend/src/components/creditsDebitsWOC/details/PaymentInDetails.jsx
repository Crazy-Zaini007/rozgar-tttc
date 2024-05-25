
import React, { useEffect, useState } from 'react'
import CDWOCHook from '../../../hooks/creditsDebitsWOCHooks/CDWOCHook'
import CategoryHook from '../../../hooks/settingHooks/CategoryHook'
import PaymentViaHook from '../../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../../hooks/settingHooks/PaymentTypeHook'
import CurrencyHook from '../../../hooks/settingHooks/CurrencyHook'
import { useSelector, useDispatch } from 'react-redux';
import { useAuthContext } from '../../../hooks/userHooks/UserAuthHook';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import SyncLoader from 'react-spinners/SyncLoader'

export default function PaymentInDetails() {
  const [isLoading, setIsLoading] = useState(false)
  const [loading1,setLoading1]=useState(false)
  const [show, setShow] = useState(false)

  const { getCurrencyData } = CurrencyHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const [, setNewMessage] = useState('')
  const { getPaymentsIn } = CDWOCHook()
  const { user } = useAuthContext()
  const dispatch = useDispatch()
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    try {
      setIsLoading(true)
      await getPaymentsIn();
      setIsLoading(false);

      await Promise.all([
        getCategoryData(),
        getPaymentViaData(),
        getPaymentTypeData(),
        getCurrencyData(),
        
      ])

    } catch (error) {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [])
  

  const currencies = useSelector((state) => state.setting.currencies);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const CDWOC_Payments_In = useSelector((state) => state.creditsDebitsWOC.CDWOC_Payments_In);
 

  const rowsPerPageOptions = [10, 15, 30];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [option, setOption] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const handleRowClick = (supplierName) => {
    setSelectedSupplier(supplierName);
    setOption(!option)
  };
  const handleOption = () => {
    setOption(!option)
  }
  // Editing Mode 
  const [editMode, setEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState({});
  const [editedRowIndex, setEditedRowIndex] = useState(null);

  const handleEditClick = (paymentItem, index) => {
    setEditMode(!editMode);
    setEditedEntry(paymentItem);
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
  }

  const deletePaymentIn = async (payment) => {
    if (window.confirm('Are you sure you want to delete this record?')){
      setIsLoading(true)
      let paymentId = payment._id
      try {
        const response = await fetch(`${apiUrl}/auth/credits&debits/without_cash_in_hand/delete/single/payment_in`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ paymentId, supplierName: selectedSupplier, payment_Via: payment.payment_Via, payment_In: payment.payment_In, payment_Out: payment.payment_Out, curr_Amount: payment.curr_Amount })
        })
  
        const json = await response.json()
  
        if (!response.ok) {
          setNewMessage(toast.error(json.message));
          setIsLoading(false)
        }
        if (response.ok) {
          fetchData()
          setNewMessage(toast.success(json.message));
          setIsLoading(false)
          setEditMode(!editMode)
        }
      }
      catch (error) {
        setNewMessage(toast.error('Server is not responding...'))
        setIsLoading(false)
      }
    }
   
  }

  
  const deleteTotalPayment = async (entry) => {
    if (window.confirm('Are you sure you want to delete this record?')){
      setIsLoading(true)
    
    
      try {
        const response = await fetch(`${apiUrl}/auth/credits&debits/without_cash_in_hand/delete/total/payment_in`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({supplierName:entry.supplierName })
        })
  
        const json = await response.json()
  
        if (!response.ok) {
          setNewMessage(toast.error(json.message));
          setIsLoading(false)
        }
        if (response.ok) {
          fetchData()
          setNewMessage(toast.success(json.message));
          setIsLoading(false)
          setEditMode(!editMode)
        }
      }
      catch (error) {
        setNewMessage(toast.error('Server is not responding...'))
        setIsLoading(false)
      }
    }
  
  }


  const handleUpdate = async () => {
    setLoading1(true)

    let paymentId = editedEntry._id
    try {
      const response = await fetch(`${apiUrl}/auth/credits&debits/without_cash_in_hand/update/single/payment_in`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ paymentId, supplierName: selectedSupplier, category: editedEntry.category, payment_Via: editedEntry.payment_Via, payment_Type: editedEntry.payment_Type, slip_No: editedEntry.slip_No, details: editedEntry.details, payment_In: editedEntry.payment_In, payment_Out: editedEntry.payment_Out, curr_Country: editedEntry.payment_In_Curr, curr_Amount: editedEntry.curr_Amount, slip_Pic: editedEntry.slip_Pic, date: editedEntry.date,curr_Rate:editedEntry.curr_Rate })
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading1(false)
      }
      if (response.ok) {
        fetchData()
        setNewMessage(toast.success(json.message));
        setLoading1(null)
        setEditMode(!editMode)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setLoading1(false)
    }
  }


  const [date1, setDate1] = useState('')
  const [supplier1, setSupplier1] = useState('')

  const filteredTotalPaymentIn = CDWOC_Payments_In.filter(payment => {
    return (
      payment.createdAt.toLowerCase().includes(date1.toLowerCase()) &&
      payment.supplierName.toLowerCase().includes(supplier1.toLowerCase())
    )
  })

  
  // individual payments filters
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')

  const filteredIndividualPayments = CDWOC_Payments_In
  .filter((data) => data.supplierName === selectedSupplier)
  .map((filteredData) => ({
    ...filteredData,
    payment: filteredData.payment
      .filter((paymentItem) => {
        let isDateInRange = true;
        // Check if the payment item's date is within the selected date range
        if (dateFrom && dateTo) {
          isDateInRange =
            paymentItem.date >= dateFrom && paymentItem.date <= dateTo;
        }

        return (
          isDateInRange &&
          paymentItem.payment_Via.toLowerCase().includes(payment_Via.toLowerCase()) &&
          paymentItem.payment_Type.toLowerCase().includes(payment_Type.toLowerCase())
        );
      }),
  }))

 



  const printMainTable = () => {
    // Convert JSX to HTML string
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const formattedDate = formatDate(new Date());

    // Convert JSX to HTML string
    const printContentString = `
      <div class="print-header">
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Creditor/Debitor Details (WOC)</h1>
      </div>
      <hr/>
      <table class='print-table'>
        <thead>
          <tr>
            <th>SN</th>
            <th>Date</th>
            <th>Suppliers</th>
            <th>Total Payment In PKR</th>
            <th>Total Payment Out PKR</th>
            <th>Total Balance</th>
          </tr>
        </thead>
        <tbody>
          ${filteredTotalPaymentIn.map((entry, index) => `
            <tr key="${entry?._id}">
              <td>${index + 1}</td>
              <td>${String(entry.createdAt)}</td>
              <td>${String(entry.supplierName)}</td>
              <td>${String(entry.total_Payment_In)}</td>
              <td>${String(entry.total_Payment_Out)}</td>
              <td>${String(entry.balance)}</td>
              
            </tr>
          `).join('')}
          <tr>
          <td></td>
          <td></td>
          <td>Total</td>
          <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Payment_In, 0))}</td>
          <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Payment_Out, 0))}</td>
          <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.balance, 0))}</td>
        </tr>
        </tbody>
      </table>
      <style>
      /* Add your custom print styles here */
      body {
        background-color: #fff;
      }
      .print-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .title {
        flex-grow: 1;
        text-align: center;
        margin: 0;
        font-size: 24px;
      }
      .date {
        flex-grow: 0;
        text-align: right;
        font-size: 20px;
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
            <title>Payment Details</title>
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


  const printDetails = (entry) => {
    // Convert JSX to HTML string
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const formattedDate = formatDate(new Date());
    // Convert JSX to HTML string
    const printContentString = `
      <div class="print-header">
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Creditor/Debitor Details (WOC)</h1>
      </div>
      <hr/>
      <table class='print-table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Supplier</th>
            <th>Total Payment In PKR</th>
            <th>Total Payment Out PKR</th>
            <th>Total Balance</th>
          </tr>
        </thead>
        <tbody>
          
            <tr">
             
              <td>${String(entry.createdAt)}</td>
              <td>${String(entry.supplierName)}</td>
              <td>${String(entry.total_Payment_In)}</td>
              <td>${String(entry.total_Payment_Out)}</td>
              <td>${String(entry.balance)}</td>
              
            </tr>
        </tbody>
      </table>
      <style>
      /* Add your custom print styles here */
      body {
        background-color: #fff;
      }
      .print-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .title {
        flex-grow: 1;
        text-align: center;
        margin: 0;
        font-size: 24px;
      }
      .date {
        flex-grow: 0;
        text-align: right;
        font-size: 20px;
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
            <title>Payment Details</title>
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
  const printPaymentsTable = () => {
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const formattedDate = formatDate(new Date());

    // Convert JSX to HTML string
    const printContentString = `
      <div class="print-header">
      <p class="invoice">Supplier: ${selectedSupplier}</p>
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Creditor/Debiter Payments Details (WOC)</h1>
      </div>
      <hr/>
    <table class='print-table'>
      <thead>
        <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Category</th>
        <th>Payment Via</th>
        <th>Payment Type</th>
        <th>Slip No</th>
        <th>Details</th>
        <th>Payment In</th>
        <th>Payment Out</th>
        <th>Invoice</th>
        <th>Payment In Curr</th>
        <th>Curr Rate</th>
        <th>Curr Amount</th>
        </tr>
      </thead>
      <tbody>
      ${filteredIndividualPayments.map((entry, index) =>
      entry.payment.map((paymentItem, paymentIndex) => `
          <tr key="${entry?._id}-${paymentIndex}">
            <td>${index * entry.payment.length + paymentIndex + 1}</td>
            <td>${String(paymentItem?.date)}</td>
            <td>${String(paymentItem?.category)}</td>
            <td>${String(paymentItem?.payment_Via)}</td>
            <td>${String(paymentItem?.payment_Type)}</td>
            <td>${String(paymentItem?.slip_No)}</td>
            <td>${String(paymentItem?.details)}</td>
            <td>${String(paymentItem?.payment_In)}</td>
            <td>${String(paymentItem?.payment_Out)}</td>
            <td>${String(paymentItem?.invoice)}</td>
            <td>${String(paymentItem?.payment_In_Curr)}</td>
            <td>${String(paymentItem?.curr_Rate)}</td>
            <td>${String(paymentItem?.curr_Amount)}</td>
          </tr>
        `).join('')
    )}
    <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>

    <td></td>
    <td>Total</td>
    <td>${String(filteredIndividualPayments.reduce((total, entry) => total + entry.payment.reduce((acc, paymentItem) => acc + paymentItem.payment_In, 0), 0))}</td>
    <td>${String(filteredIndividualPayments.reduce((total, entry) => total + entry.payment.reduce((acc, paymentItem) => acc + paymentItem.payment_Out, 0), 0))}</td>
    </tr>
    </tbody>
    </table>
    <style>
    /* Add your custom print styles here */
    body {
      background-color: #fff;
    }
    .print-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title {
      flex-grow: 1;
      text-align: center;
      margin: 0;
      font-size: 24px;
    }
    .date {
      flex-grow: 0;
      text-align: right;
      font-size: 20px;
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
          <title>${selectedSupplier} Payment Details</title>
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

  const printPaymentInvoice = (paymentItem) => {   
 // Function to format the date as dd-MM-yyyy
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formattedDate = formatDate(new Date());
  // Convert JSX to HTML string
  const printContentString = `
    <div class="print-header">
    <p class="invoice">Invoice No: ${paymentItem.invoice}</p>
      <h1 class="title">ROZGAR TTTC</h1>
    <p class="date">Date: ${formattedDate}</p>
    </div>
    <div class="print-header">
      <h1 class="title">Creditor/Debitor Payment Invoice</h1>
    </div>
    <hr/>
    <table class='print-table'>
      <thead>
        <tr>
        <th>Date</th>
        <th>Supplier</th>
        <th>Category</th>
        <th>Payment Via</th>
        <th>Payment Type</th>
        <th>Slip No</th>
        <th>Details</th>
        <th>Payment In</th>
        <th>Payment Out</th>
        <th>Payment In Curr</th>
        <th>Curr Rate</th>
        <th>Curr Amount</th>
        </tr>
      </thead>
      <tbody>
     
          <tr>
         
            <td>${String(paymentItem?.date)}</td>
            <td>${String(selectedSupplier)}</td>
            <td>${String(paymentItem?.category)}</td>
            <td>${String(paymentItem?.payment_Via)}</td>
            <td>${String(paymentItem?.payment_Type)}</td>
            <td>${String(paymentItem?.slip_No)}</td>
            <td>${String(paymentItem?.details)}</td>
            <td>${String(paymentItem?.payment_In)}</td>
            <td>${String(paymentItem?.payment_Out)}</td>
            <td>${String(paymentItem?.payment_In_Curr)}</td>
            <td>${String(paymentItem?.curr_Rate)}</td>
            <td>${String(paymentItem?.curr_Amount)}</td>
          </tr>
       
    
    </tbody>
    </table>
    <style>
    /* Add your custom print styles here */
    body {
      background-color: #fff;
    }
    .print-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title {
      flex-grow: 1;
      text-align: center;
      margin: 0;
      font-size: 24px;
    }
    .date {
      flex-grow: 0;
      text-align: right;
      font-size: 20px;
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
          <title>${selectedSupplier} Payment Details</title>
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
    filteredTotalPaymentIn.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date:payments.createdAt,
        SupplierName:payments.supplierName,
        total_Payment_In:payments.total_Payment_In,
        total_Payment_Out:payments.total_Payment_Out,
        Balance:payments.balance,

      };
      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CDWOC_Payments.xlsx');
  };


  const downloadDetails = (payments) => {
    const data = [];
    // Iterate over entries and push all fields
  
      const rowData = {
        Date:payments.createdAt,
        SupplierName:payments.supplierName,
        Total_Payment_In:payments.total_Payment_In,
        Total_Payment_Out:payments.total_Payment_Out,
        Balance:payments.balance,
    

      };
      data.push(rowData);

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CDWOC_Payments_In.xlsx');
  };



  const downloadIndividualPayments = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredIndividualPayments.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date:payments.date,
        Category:payments.category,
        Payment_Via:payments.payment_Via,
        Payment_Type:payments.payment_Type,
        Slip_No: payments.slip_No,
        Details:payments.details,
        Payment_In:payments.payment_In,
        Payment_Out:payments.payment_Out,
        Invoice:payments.invoice,
        Payment_In_Curr:payments.payment_In_Curr,
        Curr_Rate:payments.curr_Rate,
        Curr_Amount:payments.curr_Amount
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${selectedSupplier} Payment Details.xlsx`);
  }

  const downloadPaymentInvoice = (payments) => {
    const data = [];
   
      const rowData = {
        Supplier: selectedSupplier,
        Date:payments.date,
        Category:payments.category,
        Payment_Via:payments.payment_Via,
        Payment_Type:payments.payment_Type,
        Slip_No: payments.slip_No,
        Details:payments.details,
        Payment_In:payments.payment_In,
        Payment_Out:payments.payment_Out,
        Invoice:payments.invoice,
        Payment_In_Curr:payments.payment_In_Curr,
        Curr_Rate:payments.curr_Rate,
        Curr_Amount:payments.curr_Amount
      }

      data.push(rowData);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${selectedSupplier} Payment Details.xlsx`);
  }



  return (
    <>
      {!option &&
        <>
          <div className='col-md-12 '>
            <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
              <div className="left d-flex">
                <h4>Payment Details</h4>
              </div>
              <div className="right d-flex">
                {filteredTotalPaymentIn.length > 0 &&
                  <>
                    <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}>Download </button>
                    <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printMainTable}>Print </button>

                  </>
                }
              </div>
            </Paper>
          </div>
          {isLoading &&
            <div className='col-md-12 text-center my-4'>
              <SyncLoader color="#2C64C3" className='mx-auto' />
            </div>
          }
          <div className="col-md-12 filters">
            <Paper className='py-1 mb-2 px-3'>
              <div className="row">
                <div className="col-auto px-1">
                  <label htmlFor="">Date:</label>
                  <select value={date1} onChange={(e) => setDate1(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {[...new Set(CDWOC_Payments_In.map(data => data.createdAt))].map(dateValue => (
                      <option value={dateValue} key={dateValue}>{dateValue}</option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Suppliers:</label>
                  <select value={supplier1} onChange={(e) => setSupplier1(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {CDWOC_Payments_In && CDWOC_Payments_In.map((data) => (
                      <option value={data.supplierName} key={data._id}>{data.supplierName} </option>
                    ))}
                  </select>
                </div>
              </div>
            </Paper>
          </div>
         {!isLoading && 
          <div className='col-md-12'>
          <Paper className='py-3 mb-1 px-2 detail_table'>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className='label border ' style={{ width: '18.28%' }}>SN</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Date</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Suppliers</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>TPI_PKR</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>TPO_PKR</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Balance</TableCell>
                    {/* <TableCell className='label border' style={{ width: '18.28%' }}>Open</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Close</TableCell> */}
                    <TableCell align='left' className='edw_label border' colSpan={1}>
                        Actions
                      </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredTotalPaymentIn.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry, index) => (
                    <TableRow key={entry._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                      <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{index + 1}</TableCell>
                      <TableCell className='border data_td text-center'style={{ width: '18.28%' }}>
                        {entry.createdAt}
                      </TableCell>
                      <TableCell className='border data_td text-center' style={{ width: '18.28%' }} onClick={() => handleRowClick(entry.supplierName)}>
                        {entry.supplierName}
                      </TableCell>
                      <TableCell className='border data_td text-center'style={{ width: '18.28%' }}>
                        <i className="fa-solid fa-arrow-down me-2 text-success text-bold" style={{ width: '18.28%' }}></i>{entry.total_Payment_In}
                      </TableCell>
                      <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                        <i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{entry.total_Payment_Out}
                      </TableCell>
                      <TableCell className='border data_td text-center'style={{ width: '18.28%' }}>
                        {entry.balance}
                      </TableCell>
                      {/* <TableCell className='border data_td text-center'style={{ width: '18.28%' }}>
                        <span>{entry.open === true ? "Opened" : "Not Opened"}</span>
                      </TableCell>
                      <TableCell className='border data_td text-center'style={{ width: '18.28%' }}>
                        {entry.close === false ? "Not Closed" : "Closed"}
                      </TableCell> */}
                       <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                      <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                      <button onClick={() => printDetails(entry)} className='btn bg-success text-white btn-sm'><i className="fa-solid fa-print"></i></button>
                      <button onClick={() => downloadDetails(entry)} className='btn bg-warning text-white btn-sm'><i className="fa-solid fa-download"></i></button>
                      <button className='btn delete_btn btn-sm' onClick={() => deleteTotalPayment(entry)} disabled={isLoading}><i className="fa-solid fa-trash-can"></i></button>
                                </div>
                     
                     
                      </TableCell>
                    </TableRow>
                  ))}
                    <TableRow>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
  
    <TableCell className='border data_td text-center bg-success text-white'>
        {/* Calculate the total sum of cash_Out */}
        {filteredTotalPaymentIn.reduce((total, paymentItem) => {
            const cashOut = parseFloat(paymentItem.total_Payment_In);
            return isNaN(cashOut) ? total : total + cashOut;
        }, 0)}
    </TableCell>
    <TableCell className='border data_td text-center bg-danger text-white'>
        {/* Calculate the total sum of cash_Out */}
        {filteredTotalPaymentIn.reduce((total, paymentItem) => {
            const cashOut = parseFloat(paymentItem.total_Payment_Out);
            return isNaN(cashOut) ? total : total + cashOut;
        }, 0)}
    </TableCell>
    <TableCell className='border data_td text-center bg-warning text-white'>
        {/* Calculate the total sum of cash_Out */}
        {filteredTotalPaymentIn.reduce((total, paymentItem) => {
            const cashOut = parseFloat(paymentItem.balance);
            return isNaN(cashOut) ? total : total + cashOut;
        }, 0)}
    </TableCell>
    
</TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component='div'
              count={filteredTotalPaymentIn.length}
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
        </>
      }

      {option && selectedSupplier && (
        <>
          {/* Display Table for selectedSupplier's payment details array */}
          <div className="col-md-12 my-2">
            <div className="d-flex justify-content-between supplier_Name">
              <div className="left d-flex">
                <h4 className='d-inline '>Supplier Name: <span>{selectedSupplier}</span></h4>
              </div>
              <div className="right">
              <button className='btn btn-sm m-1 bg-info text-white shadow' onClick={() => setShow(!show)}>{show === false ? "Show" : "Hide"}</button>
                <button className='btn excel_btn m-1 btn-sm' onClick={downloadIndividualPayments}>Download </button>
                <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printPaymentsTable}>Print </button>
                {selectedSupplier && <button className='btn detail_btn' onClick={handleOption}><i className="fas fa-times"></i></button>}

              </div>
            </div>
          </div>
          <div className="col-md-12 filters">
            <Paper className='py-1 mb-2 px-3'>
              <div className="row">
              <div className="col-auto px-1">
                  <label htmlFor="">Date From:</label>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className='m-0 p-1'/>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Date To:</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className='m-0 p-1'/>
                 
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Payment Via:</label>
                  <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {[...new Set(CDWOC_Payments_In
                      .filter(data => data.supplierName === selectedSupplier)
                      .flatMap(data => data.payment)
                     
                      .map(data => data.payment_Via)
                    )].map(dateValue => (
                      <option value={dateValue} key={dateValue}>{dateValue}</option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Payment Type:</label>
                  <select value={payment_Type} onChange={(e) => setPayment_Type(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {[...new Set(CDWOC_Payments_In
                      .filter(data => data.supplierName === selectedSupplier)
                      .flatMap(data => data.payment)
                     
                      .map(data => data.payment_Type)
                    )].map(dateValue => (
                      <option value={dateValue} key={dateValue}>{dateValue}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Paper>
          </div>
          <div className="col-md-12 detail_table my-2">
            <h6>Payment In/Out Details</h6>
            <TableContainer component={Paper}>
              <Table>
                <TableHead className="thead">
                  <TableRow>
                  <TableCell className='label border'>SN</TableCell>
                    <TableCell className='label border'>Date</TableCell>
                    <TableCell className='label border'>Category</TableCell>
                    <TableCell className='label border'>Payment_Via</TableCell>
                    <TableCell className='label border'>Payment_Type</TableCell>
                    <TableCell className='label border'>Slip_No</TableCell>
                    <TableCell className='label border'>Details</TableCell>
                    <TableCell className='label border'>Payment_In</TableCell>
                    <TableCell className='label border'>Payment_Out</TableCell>
                    <TableCell className='label border'>Invoice</TableCell>
                    {show && <>
                    <TableCell className='label border'>Payment_In_Curr</TableCell>
                    <TableCell className='label border'>CUR_Rate</TableCell>
                    <TableCell className='label border'>CUR_Amount</TableCell>
                    </>}
                    <TableCell className='label border'>Slip_Pic</TableCell>
                    <TableCell align='left' className='edw_label border' colSpan={1}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIndividualPayments.map((filteredData) => (
                    <>
                      {filteredData.payment.map((paymentItem, index) => (
                        <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                          {editMode && editedRowIndex === index ? (
                            <>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={index+1} readonly />
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
                                <input type='text' value={editedEntry.details} onChange={(e) => handleInputChange(e, 'details')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.payment_In} onChange={(e) => handleInputChange(e, 'payment_In')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.payment_Out} onChange={(e) => handleInputChange(e, 'payment_Out')} />
                              </TableCell>
                              
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.invoice} readonly />
                              </TableCell>
                              {show &&<>
                                <TableCell className='border data_td p-1 '>
                                <select required value={editedEntry.payment_In_Curr} onChange={(e) => handleInputChange(e, 'payment_In_Curr')}>
                                  <option className="my-1 py-2" value="">choose</option>
                                  {currencies && currencies.map((data) => (
                                    <option className="my-1 py-2" key={data._id} value={data.currency}>{data.currency}</option>
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
                            </>
                          ) : (
                            <>
                              <TableCell className='border data_td text-center'>{index+1}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.date}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.category}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.payment_Via}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.payment_Type}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.slip_No}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.details}</TableCell>
                              <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{paymentItem?.payment_In}</TableCell>
                              <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.payment_Out}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.invoice}</TableCell>
                              {show &&<>
                                <TableCell className='border data_td text-center'>{paymentItem?.payment_In_Curr}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.curr_Rate}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.curr_Amount}</TableCell>
                              </>}
                              <TableCell className='border data_td text-center'>{paymentItem.slip_Pic ? <img src={paymentItem.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>
                            </>
                          )}
                          <TableCell className='border data_td p-1 text-center'>
                            {editMode && editedRowIndex === index ? (
                              // Render Save button when in edit mode for the specific row
                              <>
                                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                  <button onClick={() => setEditMode(!editMode)} className='btn delete_btn btn-sm'><i className="fa-solid fa-xmark"></i></button>
                                  <button onClick={() => handleUpdate()} className='btn save_btn btn-sm' disabled={loading1}><i className="fa-solid fa-check"></i></button>

                                </div>

                              </>

                            ) : (
                              // Render Edit button when not in edit mode or for other rows
                              <>
                                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                <button onClick={() => handleEditClick(paymentItem, index)} className='btn edit_btn btn-sm'><i className="fa-solid fa-pen-to-square"></i></button>
                                  <button onClick={() => printPaymentInvoice(paymentItem)} className='btn bg-success text-white btn-sm'><i className="fa-solid fa-print"></i></button>
                                  <button onClick={() => downloadPaymentInvoice(paymentItem)} className='btn bg-warning text-white btn-sm'><i className="fa-solid fa-download"></i></button>
                                  <button className='btn bg-danger text-white btn-sm' onClick={() => deletePaymentIn(paymentItem)} disabled={loading1}><i className="fa-solid fa-trash-can"></i></button>
                                </div>
                               
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ))}
                   <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className='border data_td text-center bg-success text-white'>Total</TableCell>
                            <TableCell className='border data_td text-center bg-warning text-white'>
          {/* Calculate the total sum of payment_In */}
          {filteredIndividualPayments.reduce((total, filteredData) => {
            return total + filteredData.payment.reduce((sum, paymentItem) => {
              const paymentIn = parseFloat(paymentItem.payment_In);
              return isNaN(paymentIn) ? sum : sum + paymentIn;
            }, 0);
          }, 0)}
        </TableCell>
        <TableCell className='border data_td text-center bg-info text-white'>
          {/* Calculate the total sum of cash_Out */}
          {filteredIndividualPayments.reduce((total, filteredData) => {
            return total + filteredData.payment.reduce((sum, paymentItem) => {
              const cashOut = parseFloat(paymentItem.payment_Out);
              return isNaN(cashOut) ? sum : sum + cashOut;
            }, 0);
          }, 0)}
        </TableCell>
        <TableCell></TableCell>
                    <TableCell></TableCell>
                    {show && <>
                      <TableCell className='border data_td text-center bg-warning text-white'>
                      
                      {filteredIndividualPayments.reduce((total, filteredData) => {
                        return total + filteredData.payment.reduce((sum, paymentItem) => {
                          const paymentIn = parseFloat(paymentItem.payment_In_Curr);
                          return isNaN(paymentIn) ? sum : sum + paymentIn;
                        }, 0);
                      }, 0)}
                    </TableCell>
                    <TableCell className='border data_td text-center bg-info text-white'>
                      {/* Calculate the total sum of cash_Out */}
                      {filteredIndividualPayments.reduce((total, filteredData) => {
                        return total + filteredData.payment.reduce((sum, paymentItem) => {
                          const cashOut = parseFloat(paymentItem.curr_Rate);
                          return isNaN(cashOut) ? sum : sum + cashOut;
                        }, 0);
                      }, 0)}
                    </TableCell>
                    <TableCell className='border data_td text-center bg-primary text-white'>
                      {/* Calculate the total sum of cash_Out */}
                      {filteredIndividualPayments.reduce((total, filteredData) => {
                        return total + filteredData.payment.reduce((sum, paymentItem) => {
                          const cashOut = parseFloat(paymentItem.curr_Amount);
                          return isNaN(cashOut) ? sum : sum + cashOut;
                        }, 0);
                      }, 0)}
                    </TableCell>
                    </>}
                            
                          </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}

    </>
  )
}
