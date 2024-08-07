
import React, { useEffect, useState ,useRef} from 'react'
import AssetsHook from '../../../hooks/assetsHooks/AssetsHook'
import CategoryHook from '../../../hooks/settingHooks/CategoryHook'
import PaymentViaHook from '../../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../../hooks/settingHooks/PaymentTypeHook'
import CurrencyHook from '../../../hooks/settingHooks/CurrencyHook'
import { useSelector, useDispatch } from 'react-redux';
import { useAuthContext } from '../../../hooks/userHooks/UserAuthHook';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader'

export default function AssetsPaymentsDetails() {
  const [isLoading, setIsLoading] = useState(false)
  const [loading1,setLoading1]=useState(false)
  const [show, setShow] = useState(false)

  const { getCurrencyData } = CurrencyHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const [, setNewMessage] = useState('')
  const { getPayments } = AssetsHook()
  const { user } = useAuthContext()
  const dispatch = useDispatch()
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    try {
      setIsLoading(true)
      await getPayments();
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
  const abortCont = useRef(new AbortController());

  useEffect(() => {
    if (user) {
      fetchData();
    }
    return () => {
      if (abortCont.current) {
        abortCont.current.abort(); 
      }
    }
  }, [])
  

  const currencies = useSelector((state) => state.setting.currencies);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const assetsPayments = useSelector((state) => state.assetsPayments.assetsPayments);
 

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
  const handleRowClick = (assetName) => {
    setSelectedSupplier(assetName);
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
        const response = await fetch(`${apiUrl}/auth/assets/delete/single/payment_in`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ paymentId, assetName: selectedSupplier, payment_Via: payment.payment_Via, payment_In: payment.payment_In, payment_Out: payment.payment_Out, curr_Amount: payment.curr_Amount })
        })
  
        const json = await response.json()
  
        if (!response.ok) {
          setNewMessage(toast.error(json.message));
          setIsLoading(false)
        }
        if (response.ok) {
          getPayments();
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
        const response = await fetch(`${apiUrl}/auth/assets/delete/total/payment`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({assetName:entry.assetName })
        })
  
        const json = await response.json()
  
        if (!response.ok) {
          setNewMessage(toast.error(json.message));
          setIsLoading(false)
        }
        if (response.ok) {
          getPayments();
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
      const response = await fetch(`${apiUrl}/auth/assets/update/single/payment_in`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ paymentId, assetName: selectedSupplier, category: editedEntry.category, payment_Via: editedEntry.payment_Via, payment_Type: editedEntry.payment_Type, slip_No: editedEntry.slip_No, details: editedEntry.details, payment_In: editedEntry.payment_In, payment_Out: editedEntry.payment_Out, curr_Country: editedEntry.payment_In_Curr, curr_Amount: editedEntry.curr_Amount, slip_Pic: editedEntry.slip_Pic, date: editedEntry.date,curr_Rate:editedEntry.curr_Rate })
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading1(false)
      }
      if (response.ok) {

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

  const filteredTotalPaymentIn = assetsPayments.filter(payment => {
    return (
      payment.createdAt.toLowerCase().includes(date1.toLowerCase()) &&
      payment.assetName.toLowerCase().includes(supplier1.toLowerCase())
    )
  })

  // individual payments filters
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')
  const [search1, setSearch1] = useState('')

  const filteredIndividualPayments = assetsPayments
  .filter((data) => data.assetName === selectedSupplier)
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
           paymentItem.payment_Via?.toLowerCase().includes(payment_Via.toLowerCase()) &&
           paymentItem.payment_Type?.toLowerCase().includes(payment_Type.toLowerCase())&&
           (paymentItem.category?.trim().toLowerCase().startsWith(search1.trim().toLowerCase())||
            paymentItem.payment_Via?.trim().toLowerCase().startsWith(search1.trim().toLowerCase())||
            paymentItem.slip_No?.trim().toLowerCase().startsWith(search1.trim().toLowerCase())||
            paymentItem.payment_Type?.trim().toLowerCase().startsWith(search1.trim().toLowerCase())
       )
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
        <h1 class="title">Assets Details (WCIH)</h1>
      </div>
      <hr/>
      <table class='print-table'>
        <thead>
          <tr>
            <th>SN</th>
            <th>Date</th>
            <th>Assets</th>
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
              <td>${String(entry.assetName)}</td>
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
            <title>Assets Payment Details</title>
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
        <h1 class="title">Asset Details (WCIH)</h1>
      </div>
      <hr/>
      <table class='print-table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Assets</th>
            <th>Total Payment In PKR</th>
            <th>Total Payment Out PKR</th>
            <th>Total Balance</th>
          </tr>
        </thead>
        <tbody>
          
            <tr">
             
              <td>${String(entry.createdAt)}</td>
              <td>${String(entry.assetName)}</td>
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
            <title>Assets Payment Details</title>
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
        <h1 class="title">Assets Payments Details</h1>
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
      <h1 class="title">Asset Payment Invoice</h1>
    </div>
    <hr/>
    <table class='print-table'>
      <thead>
        <tr>
        <th>Date</th>
        <th>Asset</th>
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
        Asset:payments.assetName,
        total_Payment_In:payments.total_Payment_In,
        total_Payment_Out:payments.total_Payment_Out,
        Balance:payments.balance,

      };
      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CDWC_Payments_In.xlsx');
  };


  const downloadDetails = (payments) => {
    const data = [];
    // Iterate over entries and push all fields
  
      const rowData = {
        Date:payments.createdAt,
        Asset:payments.assetName,
        Total_Payment_In:payments.total_Payment_In,
        Total_Payment_Out:payments.total_Payment_Out,
        Balance:payments.balance,
    

      };
      data.push(rowData);

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CDWC_Payments_In.xlsx');
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
        Asset: selectedSupplier,
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
          <div className='col-md-12 p-0 border-0 border-bottom'>
            <div className='py-3 mb-2 px-2 d-flex justify-content-between'>
              <div className="left d-flex">
                <h4>Assets Payment Details</h4>
              </div>
              <div className="right d-flex">
                {filteredTotalPaymentIn.length > 0 &&
                  <>
                    <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}>Download </button>
                    <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printMainTable}>Print </button>

                  </>
                }
              </div>
            </div>
          </div>
          {isLoading &&
            <div className='col-md-12 text-center my-4'>
              <ClipLoader color="#2C64C3" className='mx-auto' />
            </div>
          }
          <div className="col-md-12 filters">
            <div className='py-1 mb-2 '>
              <div className="row">
                <div className="col-auto px-1">
                  <label htmlFor="">Date:</label><br/>
                  <select value={date1} onChange={(e) => setDate1(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {[...new Set(assetsPayments.map(data => data.createdAt))].map(dateValue => (
                      <option value={dateValue} key={dateValue}>{dateValue}</option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Assets:</label><br/>
                  <select value={supplier1} onChange={(e) => setSupplier1(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {assetsPayments && assetsPayments.map((data) => (
                      <option value={data.assetName} key={data._id}>{data.assetName} </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
         {!isLoading && 
          <div className='col-md-12 p-0'>
          <div className='py-3 mb-1 px-1 detail_table'>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className='label border' >SN</TableCell>
                    <TableCell className='label border' >Date</TableCell>
                    <TableCell className='label border' >Suppliers</TableCell>
                    <TableCell className='label border' >Total Payment In PKR</TableCell>
                    <TableCell className='label border' >Total Payment Out PKR</TableCell>
                    <TableCell className='label border' >Balance</TableCell>
                   
                    <TableCell align='left' className='edw_label border'  colSpan={1}>
                        Actions
                      </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredTotalPaymentIn.map((entry, index) => (
                    <TableRow key={entry._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                      <TableCell className='border data_td text-center' >{index + 1}</TableCell>
                      <TableCell className='border data_td text-center' >
                        {entry.createdAt}
                      </TableCell>
                      <TableCell className='border data_td text-center'  onClick={() => handleRowClick(entry.assetName)}>
                        {entry.assetName}
                      </TableCell>
                      <TableCell className='border data_td text-center' >
                        <i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{entry.total_Payment_In}
                      </TableCell>
                      <TableCell className='border data_td text-center' >
                        <i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{entry.total_Payment_Out}
                      </TableCell>
                      <TableCell className='border data_td text-center' >
                        {entry.balance}
                      </TableCell>
                      
                      <TableCell className='border data_td text-center' >
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
          </div>
        </div>
         }
        </>
      }

      {option && selectedSupplier && (
        <>
          {/* Display Table for selectedSupplier's payment details array */}
          <div className="col-md-12 my-2 p-0">
            <div className="d-flex justify-content-between supplier_Name">
              <div className="left d-flex">
                <h4 className='d-inline '>Asset Name: <span>{selectedSupplier}</span></h4>

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
            <div className='py-1 mb-2'>
              <div className="row">
              <div className="col-auto px-1">
                  <label htmlFor="">Serach Here:</label><br/>
                  <input type="search" value={search1} onChange={(e) => setSearch1(e.target.value)} className='m-0 p-1' />
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
                  <label htmlFor="">Payment Via:</label><br/>
                  <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {[...new Set(assetsPayments
                      .filter(data => data.assetName === selectedSupplier)
                      .flatMap(data => data.payment)
                     
                      .map(data => data.payment_Via)
                    )].map(dateValue => (
                      <option value={dateValue} key={dateValue}>{dateValue}</option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Payment Type:</label><br/>
                  <select value={payment_Type} onChange={(e) => setPayment_Type(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {[...new Set(assetsPayments
                      .filter(data => data.assetName === selectedSupplier)
                      .flatMap(data => data.payment)
                     
                      .map(data => data.payment_Type)
                    )].map(dateValue => (
                      <option value={dateValue} key={dateValue}>{dateValue}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 detail_table my-2">
            <h6>Payment In/Out Details</h6>
            <TableContainer>
              <Table>
                <TableHead className="thead">
                  <TableRow>
                  <TableCell className='label border'>SN</TableCell>
                    <TableCell className='label border'>Date</TableCell>
                    <TableCell className='label border'>Category</TableCell>
                    <TableCell className='label border'>Payment Via</TableCell>
                    <TableCell className='label border'>Payment Type</TableCell>
                    <TableCell className='label border'>Slip No</TableCell>
                    <TableCell className='label border'>Details</TableCell>
                    <TableCell className='label border'>Payment In</TableCell>
                    <TableCell className='label border'>Payment Out</TableCell>
                    <TableCell className='label border'>Invoice</TableCell>
                    {show && <>
                      <TableCell className='label border'>Payment In Curr</TableCell>
                    <TableCell className='label border'>Curr Rate</TableCell>
                    <TableCell className='label border'>Curr Amount</TableCell>
                    </>}
                    <TableCell className='label border'>Slip Pic</TableCell>
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
                              <TableCell className='border data_td text-center'>{paymentItem.slip_Pic ? <a href={paymentItem.slip_Pic} target="_blank" rel="noopener noreferrer"> <img src={paymentItem.slip_Pic} alt='Images' className='rounded' /></a>  : "No Picture"}</TableCell>
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
