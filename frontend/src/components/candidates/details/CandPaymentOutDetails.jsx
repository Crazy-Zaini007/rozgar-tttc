
import React, { useEffect, useState } from 'react'
import CandidateHook from '../../../hooks/candidateHooks/CandidateHook'
import { useSelector, useDispatch } from 'react-redux';
import { useAuthContext } from '../../../hooks/userHooks/UserAuthHook';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import CategoryHook from '../../../hooks/settingHooks/CategoryHook'
import PaymentViaHook from '../../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../../hooks/settingHooks/PaymentTypeHook'
import CurrencyHook from '../../../hooks/settingHooks/CurrencyHook'
import CompanyHook from '../../../hooks/settingHooks/CompanyHook'
import CountryHook from '../../../hooks/settingHooks/CountryHook'
import EntryMoodHook from '../../../hooks/settingHooks/EntryMoodHook'
import FinalStatusHook from '../../../hooks/settingHooks/FinalStatusHook'
import TradeHook from '../../../hooks/settingHooks/TradeHook'
import { toast } from 'react-toastify';
import SyncLoader from 'react-spinners/SyncLoader'
import { Link } from 'react-router-dom'

export default function CandPaymentOutDetails() {
  const [isLoading, setIsLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const [loading5, setLoading5] = useState(false)
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)

  const [, setNewMessage] = useState('')

  const { getCurrencyData } = CurrencyHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const { getComapnyData } = CompanyHook()
  const { getCountryData } = CountryHook()
  const { getEntryMoodData } = EntryMoodHook()
  const { getFinalStatusData } = FinalStatusHook()
  const { getTradeData } = TradeHook()

  const { getPaymentsOut } = CandidateHook()
  const { user } = useAuthContext()
  const dispatch = useDispatch()

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchData = async () => {

    try {
      setIsLoading(true)
      await getPaymentsOut();
      setIsLoading(false);

      await Promise.all([
        getCategoryData(),
        getPaymentViaData(),
        getPaymentTypeData(),
        getCurrencyData(),
        getComapnyData(),
        getCountryData(),
        getEntryMoodData(),
        getFinalStatusData(),
        getTradeData()
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
  const companies = useSelector((state) => state.setting.companies);
  const countries = useSelector((state) => state.setting.countries);
  const entryMode = useSelector((state) => state.setting.entryMode);
  const finalStatus = useSelector((state) => state.setting.finalStatus);
  const trades = useSelector((state) => state.setting.trades);

  const candidate_Payments_Out = useSelector((state) => state.candidates.candidate_Payments_Out);


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


  // Editing for single Payment In 
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
  };


  const deletePaymentIn = async (payment) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setLoading1(true)
      let paymentId = payment._id
      try {
        const response = await fetch(`${apiUrl}/auth/candidates/delete/single/payment_out`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ paymentId, supplierName: selectedSupplier, payment_Via: payment.payment_Via, payment_Out: payment.payment_Out, cash_Out: payment.cash_Out, curr_Amount: payment.curr_Amount })
        })

        const json = await response.json()

        if (!response.ok) {
          setNewMessage(toast.error(json.message));
          setLoading1(false)
        }
        if (response.ok) {
          fetchData();
          setNewMessage(toast.success(json.message));
          setLoading1(false)
          setEditMode(!editMode)
        }
      }
      catch (error) {
        setNewMessage(toast.error('Server is not responding...'))
        setLoading1(false)
      }
    }

  }


  //updating single payment in
  const handleUpdate = async () => {
    setLoading3(true)
    let paymentId = editedEntry._id
    try {
      const response = await fetch(`${apiUrl}/auth/candidates/update/single/payment_out`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ paymentId, supplierName: selectedSupplier, category: editedEntry.category, payment_Via: editedEntry.payment_Via, payment_Type: editedEntry.payment_Type, slip_No: editedEntry.slip_No, details: editedEntry.details, payment_Out: editedEntry.payment_Out, cash_Out: editedEntry.cash_Out, curr_Country: editedEntry.payment_Out_Curr, curr_Amount: editedEntry.curr_Amount, curr_Rate: editedEntry.curr_Rate, slip_Pic: editedEntry.slip_Pic, date: editedEntry.date })
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading3(false)
      }
      if (response.ok) {
        fetchData();

        setNewMessage(toast.success(json.message));
        setLoading3(null)
        setEditMode(!editMode)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setLoading3(false)
    }
  }

  //Editing for Agent Total Payment in
  const [editMode1, setEditMode1] = useState(false);
  const [editedEntry1, setEditedEntry1] = useState({});
  const [editedRowIndex1, setEditedRowIndex1] = useState(null);

  const handleTotalPaymentEditClick = (paymentItem, index) => {
    setEditMode1(!editMode1);
    setEditedEntry1(paymentItem);
    setEditedRowIndex1(index); // Set the index of the row being edited
  };


  const handleTotalPaymentInputChange = (e, field) => {
    setEditedEntry1({
      ...editedEntry1,
      [field]: e.target.value,
    });

  };


  const handleTotalPaymentUpdate = async () => {
    setLoading3(true)
    try {
      const response = await fetch(`${apiUrl}/auth/candidates/update/all/payment_out`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: editedEntry1.supplierName, pp_No: editedEntry1.pp_No, contact: editedEntry1.contact, entry_Mode: editedEntry1.entry_Mode, company: editedEntry1.company, country: editedEntry1.country, trade: editedEntry1.trade, final_Status: editedEntry1.final_Status, flight_Date: editedEntry1.flight_Date, total_Payment_Out: editedEntry1.total_Payment_Out, total_Cash_Out: editedEntry1.total_Cash_Out, total_Visa_Price_Out_Curr: editedEntry1.total_Payment_Out_Curr, status: editedEntry1.status })
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading3(false)
      }
      if (response.ok) {
        fetchData();
        setNewMessage(toast.success(json.message));
        setLoading3(null)
        setEditMode1(!editMode1)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setLoading3(false)
    }
  }


  const deleteTotalpayment = async (person) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setLoading5(true)
      try {
        const response = await fetch(`${apiUrl}/auth/candidates/delete/all/payment_out`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ supplierName: person.supplierName })
        })

        const json = await response.json()

        if (!response.ok) {
          setNewMessage(toast.error(json.message));
          setLoading5(false)
        }
        if (response.ok) {
          fetchData();
          setNewMessage(toast.success(json.message));
          setLoading5(false)
          setEditMode1(!editMode1)
        }
      }
      catch (error) {
        setNewMessage(toast.error('Server is not responding...'))
        setLoading5(false)
      }
    }

  }


  const [date1, setDate1] = useState('')
  const [name, setName] = useState('')
  const [pp_No, setPP_NO] = useState('')
  const [entry_Mode, setEntry_Mode] = useState('')
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('')
  const [trade, setTrade] = useState('')
  const [final_Status, setFinal_Status] = useState('')
  const [flight_Date, setFlight_Date] = useState('')
  const [status, setStatus] = useState('')

  const filteredTotalPaymentOut = candidate_Payments_Out.filter(payment => {
    // Check if supplierName exists and matches the provided name
    if (payment?.supplierName && payment.supplierName.trim().toLowerCase().startsWith(name.trim().toLowerCase())) {
      return (
        payment.createdAt.toLowerCase().includes(date1.toLowerCase()) &&
        payment.pp_No.toLowerCase().includes(pp_No.toLowerCase()) &&
        payment.entry_Mode.toLowerCase().includes(entry_Mode.toLowerCase()) &&
        payment.company.toLowerCase().includes(company.toLowerCase()) &&
        payment.country.toLowerCase().includes(country.toLowerCase()) &&
        payment.trade.toLowerCase().includes(trade.toLowerCase()) &&
        payment.final_Status.toLowerCase().includes(final_Status.toLowerCase()) &&
        payment.flight_Date.toLowerCase().includes(flight_Date.toLowerCase()) &&
        payment.status.toLowerCase().includes(status.toLowerCase())
      );
    }
    // If supplierName doesn't exist or doesn't match, exclude the payment
    return false;
  })

  const [details, setDetails] = useState("")

  const handleCandidate = (candidate) => {
    setDetails(candidate)

  }
  

  // individual payments filters
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search1, setSearch1] = useState('')

  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')

  const filteredIndividualPayments = candidate_Payments_Out
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

 


  // Changing Status

  const changeStatus = async (myStatus) => {
    if (window.confirm(`Are you sure you want to Change the Status of ${selectedSupplier}?`)) {
      setLoading5(true)
      let newStatus = myStatus

      try {
        const response = await fetch(`${apiUrl}/auth/candidates/update/payment_out/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ supplierName: selectedSupplier, newStatus })
        })

        const json = await response.json()

        if (!response.ok) {
          setNewMessage(toast.error(json.message));
          setLoading5(false)
        }
        if (response.ok) {
          fetchData()
          setNewMessage(toast.success(json.message));
          setLoading5(false)
          setEditMode1(!editMode1)
        }
      }
      catch (error) {
        setNewMessage(toast.error('Server is not responding...'))
        setLoading5(false)
      }
    }
  }

  const printMainTable = () => {
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const formattedDate = formatDate(new Date());
  
    let printContentString = '';
    printContentString += `
    <div class="print-header">
    <h1 class="title">ROZGAR TTTC</h1>
    <p class="date">Date: ${formattedDate}</p>
  </div>
  <div class="print-header">
    <h1 class="title">Candidates Payment Out Details</h1>
  </div>
  <hr/>
        <table class='print-table'>
            <thead>
                <tr>
                    <th>SN</th>
                    <th>Date</th>
                    <th>Candidates</th>
                    <th>PP#</th>
                    <th>EM</th>
                    <th>Company</th>
                    <th>Country</th>
                    <th>Trade</th>
                    <th>FS</th>
                    <th>FD</th>
                    <th>TVPI_PKR</th>
                    <th>TPI_PKR</th>
                    <th>Total_Cash_Out</th>
                    <th>RPI_PKR</th>
                    <th>Status</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
                ${filteredTotalPaymentOut.map((entry, index) => `
                    <tr key="${entry?._id}">
                        <td>${index + 1}</td>
                        <td>${String(entry.createdAt)}</td>
                        <td>${String(entry.supplierName)}</td>
                        <td>${String(entry.pp_No)}</td>
                        <td>${String(entry.entry_Mode)}</td>
                        <td>${String(entry.company)}</td>
                        <td>${String(entry.country)}</td>
                        <td>${String(entry.trade)}</td>
                        <td>${String(entry.final_Status)}</td>
                        <td>${String(entry.flight_Date)}</td>
                        <td>${String(entry.total_Visa_Price_Out_PKR)}</td>
                        <td>${String(entry.total_Payment_Out)}</td>
                        <td>${String(entry.total_Cash_Out)}</td>
                        <td>${String(entry.remaining_Balance)}</td>
                        <td>${String(entry.status)}</td>
                        <td>
                        ${entry.picture ? `<img src="${entry.picture}" alt="Person Picture" />` : "No Picture"}
                      </td>
                    </tr>
                `).join('')}
                <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>Total</td>
          <td>${String(filteredTotalPaymentOut.reduce((total, entry) => total + entry.total_Visa_Price_Out_PKR, 0))}</td>
          <td>${String(filteredTotalPaymentOut.reduce((total, entry) => total + entry.total_Payment_Out, 0))}</td>
          <td>${String(filteredTotalPaymentOut.reduce((total, entry) => total + entry.total_Cash_Out, 0))}</td>
          <td>${String(filteredTotalPaymentOut.reduce((total, entry) => total + (entry.total_Visa_Price_Out_PKR - entry.total_Payment_Out + entry.total_Cash_Out), 0))}</td>
          <td></td>
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
              margin-bottom: 20px;
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
            .print-table td img{
              height:40px;
              width:40px;
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
                    <title>Candidates Payment Out Details</title>
                    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>${printContentString}</body>
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


  const printCandidateDetails = (entry) => {
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const formattedDate = formatDate(new Date());
  
    let printContentString = '';
    printContentString += `
    <div class="print-header">
    <h1 class="title">ROZGAR TTTC</h1>
    <p class="date">Date: ${formattedDate}</p>
  </div>
  <div class="print-header">
    <h1 class="title">Candidate Details</h1>
  </div>
  <hr/>
        <table class='print-table'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Candidate</th>
                    <th>PP#</th>
                    <th>EM</th>
                    <th>Company</th>
                    <th>Country</th>
                    <th>Trade</th>
                    <th>FS</th>
                    <th>FD</th>
                    <th>TVPO PKR</th>
                    <th>TPI PKR</th>
                    <th>Total Cash Out</th>
                    <th>Remaining PKR</th>
                    <th>Status</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
                    <tr> 
                        <td>${String(entry.createdAt)}</td>
                        <td>${String(entry.supplierName)}</td>
                        <td>${String(entry.pp_No)}</td>
                        <td>${String(entry.entry_Mode)}</td>
                        <td>${String(entry.company)}</td>
                        <td>${String(entry.country)}</td>
                        <td>${String(entry.trade)}</td>
                        <td>${String(entry.final_Status)}</td>
                        <td>${String(entry.flight_Date)}</td>
                        <td>${String(entry.total_Visa_Price_Out_PKR)}</td>
                        <td>${String(entry.total_Payment_Out)}</td>
                        <td>${String(entry.total_Cash_Out)}</td>
                        <td>${String(entry.remaining_Balance)}</td>
                        <td>${String(entry.status)}</td>
                        <td>
                        ${entry.picture ? `<img src="${entry.picture}" alt="Person Picture" />` : "No Picture"}
                      </td>
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
              margin-bottom: 20px;
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
            .print-table td img{
              height:40px;
              width:40px;
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
                    <title>Candidates Payment Out Details</title>
                    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>${printContentString}</body>
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
        <p class="invoice">Candidate: ${selectedSupplier}</p>
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Candidate Payment Invoices</h1>
      </div>
      <hr/>
      <div class="container">
        <div class="row">
          <div class="col border m-0">
            <div class="mb-3">
              <p>Candidate Name: <b>${details.supplierName}</b></p>
              <p>Country: <b>${details.country}</b></p>
              <p>Fly: <b>${details.flight_Date}</b></p>
            </div>
          </div>
          <div class="col border m-0">
            <div class="mb-3">
              <p>Contact: <b>${details.contact}</b></p>
              <p>Company: <b>${details.company}</b></p>
              <p>Trade: <b>${details.trade}</b></p>
            </div>
          </div>
          <div class="col border m-0">
            <div class="mb-3">
              <p>Passport No: <b>${details.pp_No}</b></p>
              <p>Rozgar Visa Price: <b>${details.total_Visa_Price_Out_PKR}</b></p>
              <p>Total Out: <b>${details.total_Payment_Out}</b></p>
              <p>Remaining: <b>${details.total_Visa_Price_Out_PKR - details.total_Payment_Out + details.total_Cash_Out}</b></p>
            </div>
          </div>
        </div>
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
            <th>Payment Out</th>
            <th>Cash Out</th>
            <th>Curr Rate</th>
            <th>Curr Amount</th>
            <th>Invoice</th>
            <th>Payment In Curr</th>
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
                <td>${String(paymentItem?.payment_Out)}</td>
                <td>${String(paymentItem?.cash_Out)}</td>
                <td>${String(paymentItem?.curr_Rate)}</td>
                <td>${String(paymentItem?.curr_Amount)}</td>
                <td>${String(paymentItem?.invoice)}</td>
                <td>${String(paymentItem?.payment_Out_Curr)}</td>
              </tr>
            `).join('')
          ).join('')}
          <tr>
            <td colspan="6"></td>
            <td>Total</td>
            <td>${String(filteredIndividualPayments.reduce((total, entry) => total + entry.payment.reduce((acc, paymentItem) => acc + paymentItem.payment_Out, 0), 0))}</td>
            <td>${String(filteredIndividualPayments.reduce((total, entry) => total + entry.payment.reduce((acc, paymentItem) => acc + paymentItem.cash_Out, 0), 0))}</td>
            <td>${String(filteredIndividualPayments.reduce((total, entry) => total + entry.payment.reduce((acc, paymentItem) => acc + paymentItem.curr_Rate, 0), 0))}</td>
            <td>${String(filteredIndividualPayments.reduce((total, entry) => total + entry.payment.reduce((acc, paymentItem) => acc + paymentItem.curr_Amount, 0), 0))}</td>
            <td></td>
            <td></td>
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
        .container {
          margin-top: 20px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .col {
          flex: 1;
          padding: 10px;
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
          text-transform: capitalize;
        }
        .print-table th {
          background-color: #f2f2f2;
        }
        .mb-3 {
          margin-bottom: 1rem;
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
            <title>${selectedSupplier} Payment In Details</title>
          </head>
          <body>${printContentString}</body>
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
        <p class="invoice">Invoice: ${paymentItem.invoice}</p>
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Candidate Payment Invoice</h1>
      </div>
      <hr/>
      <div class="container">
        <div class="row">
          <div class="col border m-0">
            <div class="mb-3">
              <p>Candidate Name: <b>${details.supplierName}</b></p>
              <p>Country: <b>${details.country}</b></p>
              <p>Fly: <b>${details.flight_Date}</b></p>
            </div>
          </div>
          <div class="col border m-0">
            <div class="mb-3">
              <p>Contact: <b>${details.contact}</b></p>
              <p>Company: <b>${details.company}</b></p>
              <p>Trade: <b>${details.trade}</b></p>
            </div>
          </div>
          <div class="col border m-0">
            <div class="mb-3">
              <p>Passport No: <b>${details.pp_No}</b></p>
              <p>Rozgar Visa Price: <b>${details.total_Visa_Price_Out_PKR}</b></p>
              <p>Total In: <b>${details.total_Payment_Out}</b></p>
              <p>Remaining: <b>${details.total_Visa_Price_Out_PKR - details.total_Payment_Out + details.total_Cash_Out}</b></p>
            </div>
          </div>
        </div>
      </div>
      <hr/>
      <table class='print-table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Candidate</th>
            <th>Category</th>
            <th>Payment Via</th>
            <th>Payment Type</th>
            <th>Slip No</th>
            <th>Details</th>
            <th>Payment Out</th>
            <th>Cash Out</th>
            <th>Curr Rate</th>
            <th>Curr Amount</th>
            <th>Payment In Curr</th>
          </tr>
        </thead>
        <tbody>
              <tr>
                <td>${String(paymentItem?.date)}</td>
                <td>${selectedSupplier}</td>
                <td>${String(paymentItem?.category)}</td>
                <td>${String(paymentItem?.payment_Via)}</td>
                <td>${String(paymentItem?.payment_Type)}</td>
                <td>${String(paymentItem?.slip_No)}</td>
                <td>${String(paymentItem?.details)}</td>
                <td>${String(paymentItem?.payment_Out)}</td>
                <td>${String(paymentItem?.cash_Out)}</td>
                <td>${String(paymentItem?.curr_Rate)}</td>
                <td>${String(paymentItem?.curr_Amount)}</td>
                <td>${String(paymentItem?.payment_Out_Curr)}</td>
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
        .container {
          margin-top: 20px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .col {
          flex: 1;
          padding: 10px;
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
          text-transform: capitalize;
        }
        .print-table th {
          background-color: #f2f2f2;
        }
        .mb-3 {
          margin-bottom: 1rem;
        }
      </style>
    `
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Write the print content to the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedSupplier} Payment In Details</title>
          </head>
          <body>${printContentString}</body>
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
    filteredTotalPaymentOut.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date: payments.createdAt,
        Candidates: payments.supplierName,
        PP_No: payments.pp_No,
        Entry_Mode: payments.entry_Mode,
        Company: payments.company,
        Country: payments.country,
        Trade: payments.trade,
        Final_Status: payments.final_Status,
        Flight_Date: payments.flight_Date,
        Total_Visa_Price_Out_PKR: payments.total_Visa_Price_Out_PKR,
        Total_Payment_In: payments.total_Payment_Out,
        Total_Cash_Out: payments.total_Cash_Out,
        Remaining_PKR: payments.remaining_Balance,
        Total_Visa_Price_Out_Curr: payments.total_Visa_Price_Out_Curr,
        Total_Payment_Out_Curr: payments.total_Payment_Out_Curr,
        Remaining_Curr: payments.remaining_Curr,
        Status: payments.status,
      }

      data.push(rowData);
    })

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Candidates Payments Details.xlsx');
  }

  const downloadCandidateDetails = (payments) => {
    const data = [];
    // Iterate over entries and push all fields
      const rowData = {
        Date: payments.createdAt,
        Candidate: payments.supplierName,
        PP_No: payments.pp_No,
        Entry_Mode: payments.entry_Mode,
        Company: payments.company,
        Country: payments.country,
        Trade: payments.trade,
        Final_Status: payments.final_Status,
        Flight_Date: payments.flight_Date,
        Total_Visa_Price_Out_PKR: payments.total_Visa_Price_Out_PKR,
        Total_Payment_In: payments.total_Payment_Out,
        Total_Cash_Out: payments.total_Cash_Out,
        Remaining_PKR: payments.remaining_Balance,
        Status: payments.status,
      }

      data.push(rowData);
   

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Candidates_Payments_Details.xlsx');
  }


  const downloadIndividualPayments = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredIndividualPayments.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date: payments.date,
        Category: payments.category,
        payment_Via: payments.payment_Via,
        payment_Type: payments.payment_Type,
        slip_No: payments.slip_No,
        details: payments.details,
        payment_In: payments.payment_Out,
        cash_Out: payments.cash_Out,
        invoice: payments.invoice,
        payment_Out_Curr: payments.payment_Out_Curr,
        curr_Rate: payments.curr_Rate,
        curr_Amount: payments.curr_Amount
      }
      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${selectedSupplier} Payment Details.xlsx`);
  }


  const downloadPaymentInvoice = (payment) => {
    const data = [];
  
      const rowData = {
        Candidate:selectedSupplier,
        Date: payment.date,
        Category: payment.category,
        Payment_Via: payment.payment_Via,
        Payment_Type: payment.payment_Type,
        Slip_No: payment.slip_No,
        Details: payment.details,
        Payment_In: payment.payment_Out,
        Cash_Out: payment.cash_Out,
        Invoice: payment.invoice,
        Payment_Out_Curr: payment.payment_Out_Curr,
        Curr_Rate: payment.curr_Rate,
        Curr_Amount: payment.curr_Amount
      };

      data.push(rowData);

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${selectedSupplier} Payment Details.xlsx`);
  }



  const downloadCombinedPayments = () => {
    const combinedData = [];
    const anotherData = []

    const individualPayments = filteredIndividualPayments.flatMap(payment => payment.payment);
    // Iterate over individual payments and push all fields
    individualPayments.forEach((payment, index) => {
      const rowData = {
        SN: index + 1,
        Date: payment.date,
        Category: payment.category,
        Payment_Via: payment.payment_Via,
        Payment_Type: payment.payment_Type,
        Slip_No: payment.slip_No,
        Details: payment.details,
        Payment_In: payment.payment_Out,
        Cash_Out: payment.cash_Out,
        Invoice: payment.invoice,
        Payment_Out_Curr: payment.payment_Out_Curr,
        Curr_Rate: payment.curr_Rate,
        Curr_Amount: payment.curr_Amount
      };

      combinedData.push(rowData);
    });

    const rowData = {
      Date: details.createdAt,
      Candidate: details.supplierName,
      PP_No: details.pp_No,
      Entry_Mode: details.entry_Mode,
      CCountry: details.country,
      Trade: details.trade,
      Final_Status: details.final_Status,
      Flight_Date: details.flight_Date,
      Total_Visa_Price_Out_PKR: details.total_Visa_Price_Out_PKR,
      Total_Payment_In: details.total_Payment_Out,
      Total_Cash_Out: details.total_Cash_Out,
      Remaining_PKR: details.remaining_Balance,
      Total_Visa_Price_Out_Curr: details.total_Visa_Price_Out_Curr,
      Total_Payment_Out_Curr: details.total_Payment_Out_Curr,
      Remaining_Curr: details.remaining_Curr,
      Status: details.status,
    }

    anotherData.push(rowData);

    const ws1 = XLSX.utils.json_to_sheet(combinedData);
    const ws2 = XLSX.utils.json_to_sheet(anotherData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Payments Details');
    XLSX.utils.book_append_sheet(wb, ws2, 'Visa Price Details');
    XLSX.writeFile(wb, `${selectedSupplier} Details.xlsx`);
  }

  const[rowsValue,setRowsValue]=useState("")
  const[rowsValue1,setRowsValue1]=useState("")



  return (
    <>
      {!option &&
        <>
          <div className='col-md-12 '>
            <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
              <div className="left d-flex">
                <h4>PaymentOut Details</h4>
              </div>
              <div className="right d-flex">
              <label htmlFor="" className='mx-1 mt-2'>Show Entries: </label>
                  <select name="" className='mt-1 mx-1' value={rowsValue1} onChange={(e)=>setRowsValue1(e.target.value)} id="" style={{height:'30px',zIndex:'999',width:'auto'}}>
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
                {candidate_Payments_Out.length > 0 &&
                  <>
                    <button className='btn btn-sm m-1 bg-info text-white shadow' onClick={() => setShow(!show)}>{show === false ? "Show" : "Hide"}</button>
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
                      <label htmlFor="">Search by Name:</label>
                     <input type="search"value={name} onChange={(e)=>setName(e.target.value)} />
                    </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Date:</label>
                  <select value={date1} onChange={(e) => setDate1(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {[...new Set(candidate_Payments_Out.map(data => data.createdAt))].map(dateValue => (
                      <option value={dateValue} key={dateValue}>{dateValue}</option>
                    ))}
                  </select>
                </div>
              

                <div className="col-auto px-1">
                  <label htmlFor="">PP#:</label>
                  <select value={pp_No} onChange={(e) => setPP_NO(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {candidate_Payments_Out && candidate_Payments_Out.map((data) => (
                      <option value={data.pp_No} key={data._id}>{data.pp_No} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Entry Mode:</label>
                  <select value={entry_Mode} onChange={(e) => setEntry_Mode(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {candidate_Payments_Out && candidate_Payments_Out.map((data) => (
                      <option value={data.entry_Mode} key={data._id}>{data.entry_Mode} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Company:</label>
                  <select value={company} onChange={(e) => setCompany(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {candidate_Payments_Out && candidate_Payments_Out.map((data) => (
                      <option value={data.company} key={data._id}>{data.company} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Country:</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {candidate_Payments_Out && candidate_Payments_Out.map((data) => (
                      <option value={data.country} key={data._id}>{data.country} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Trade:</label>
                  <select value={trade} onChange={(e) => setTrade(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {candidate_Payments_Out && candidate_Payments_Out.map((data) => (
                      <option value={data.trade} key={data._id}>{data.trade} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Final Status:</label>
                  <select value={final_Status} onChange={(e) => setFinal_Status(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {candidate_Payments_Out && candidate_Payments_Out.map((data) => (
                      <option value={data.final_Status} key={data._id}>{data.final_Status} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Flight Date:</label>
                  <select value={flight_Date} onChange={(e) => setFlight_Date(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {candidate_Payments_Out && candidate_Payments_Out.map((data) => (
                      <option value={data.flight_Date} key={data._id}>{data.flight_Date} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Khata:</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className='m-0 p-1'>
                    <option value="" >All</option>
                    <option value="Open" >Open</option>
                    <option value="Closed" >Closed</option>
                  </select>

                </div>
              </div>
            </Paper>
          </div>

          {!isLoading &&
            <div className='col-md-12'>
              <Paper className='py-3 mb-1 px-2 detail_table'>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>

                      <TableRow>
                        <TableCell className='label border'>SN</TableCell>
                        <TableCell className='label border'>Date</TableCell>
                        <TableCell className='label border'>Candidates</TableCell>
                        <TableCell className='label border'>PP#</TableCell>
                        <TableCell className='label border'>EM</TableCell>
                        <TableCell className='label border'>Company</TableCell>
                        <TableCell className='label border'>Country</TableCell>
                        <TableCell className='label border'>Trade</TableCell>
                        <TableCell className='label border'>FS</TableCell>
                        <TableCell className='label border'>FD</TableCell>
                        <TableCell className='label border'>TVPO_PKR</TableCell>
                        <TableCell className='label border'>TPO_PKR</TableCell>
                        <TableCell className='label border'>Total_Cash_Out</TableCell>
                        <TableCell className='label border'>RPO_PKR</TableCell>
                        {show && <>
                          <TableCell className='label border'>TVPI_Oth_Curr</TableCell>
                          <TableCell className='label border'>TPO_Curr</TableCell>
                          <TableCell className='label border'>RPO_Curr</TableCell>
                        </>}
                        <TableCell className='label border'>Status</TableCell>

                        <TableCell align='left' className='edw_label border' colSpan={1}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredTotalPaymentOut
                        .slice(0,rowsValue1 ? rowsValue1 : undefined).map((entry, outerIndex) => (
                          // Map through the payment array
                          <React.Fragment key={outerIndex}>

                            <TableRow key={entry?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                              {editMode1 && editedRowIndex1 === outerIndex ? (
                                // Edit Mode
                                <>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' value={outerIndex + 1} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='date' value={editedEntry1.createdAt} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='text' value={editedEntry1.supplierName} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='text' min='0' value={editedEntry1.pp_No} onChange={(e) => handleTotalPaymentInputChange(e, 'pp_No')} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <select value={editedEntry1.entry_Mode} onChange={(e) => handleTotalPaymentInputChange(e, 'entry_Mode')} required>
                                      <option value="">Choose</option>
                                      {entryMode && entryMode.map((data) => (
                                        <option key={data._id} value={data.entry_Mode}>{data.entry_Mode}</option>
                                      ))}
                                    </select>
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <select value={editedEntry1.company} onChange={(e) => handleTotalPaymentInputChange(e, 'company')} required>
                                      <option value="">Choose</option>
                                      {companies && companies.map((data) => (
                                        <option key={data._id} value={data.company}>{data.company}</option>
                                      ))}
                                    </select>
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <select value={editedEntry1.country} onChange={(e) => handleTotalPaymentInputChange(e, 'country')} required>
                                      <option value="">Choose</option>
                                      {countries && countries.map((data) => (
                                        <option key={data._id} value={data.country}>{data.country}</option>
                                      ))}
                                    </select>

                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <select value={editedEntry1.trade} onChange={(e) => handleTotalPaymentInputChange(e, 'trade')} required>
                                      <option value="">Choose</option>
                                      {trades && trades.map((data) => (
                                        <option key={data._id} value={data.trade}>{data.trade}</option>
                                      ))}
                                    </select>

                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <select value={editedEntry1.final_Status} onChange={(e) => handleTotalPaymentInputChange(e, 'final_Status')} required>
                                      <option value="">Choose</option>
                                      {finalStatus && finalStatus.map((data) => (
                                        <option key={data._id} value={data.final_Status}>{data.final_Status}</option>
                                      ))}
                                    </select>
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='date' value={editedEntry1.flight_Date} onChange={(e) => handleTotalPaymentInputChange(e, 'flight_Date')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry1.total_Visa_Price_Out_PKR} onChange={(e) => handleTotalPaymentInputChange(e, 'total_Visa_Price_Out_PKR')} readonly />
                                  </TableCell>

                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry1.total_Payment_Out} onChange={(e) => handleTotalPaymentInputChange(e, 'total_Payment_Out')} required />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry1.total_Cash_Out} onChange={(e) => handleTotalPaymentInputChange(e, 'total_Cash_Out')} required />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' value={editedEntry1.remaining_Balance} readonly />
                                  </TableCell>
                                  {show && <>
                                    <TableCell className='border data_td p-1 '>
                                      <input type='number' min='0' value={editedEntry1.total_Visa_Price_Out_Curr} onChange={(e) => handleTotalPaymentInputChange(e, 'total_Visa_Price_Out_Curr')} readonly />
                                    </TableCell>
                                    <TableCell className='border data_td p-1 '>
                                      <input type='number' min='0' value={editedEntry1.total_Payment_Out_Curr} onChange={(e) => handleTotalPaymentInputChange(e, 'total_Payment_Out_Curr')} />
                                    </TableCell>
                                    <TableCell className='border data_td p-1 '>
                                      <input type='number' min='0' value={editedEntry1.remaining_Curr} onChange={(e) => handleTotalPaymentInputChange(e, 'remaining_Curr')} readonly />
                                    </TableCell>
                                  </>}

                                  <TableCell className='border data_td p-1 '>
                                    <select name="" id="" value={editedEntry1.status} onChange={(e) => handleTotalPaymentInputChange(e, 'status')}>
                                      <option value="Open">Open</option>
                                      <option value="Closed">Closed</option>
                                    </select>

                                  </TableCell>

                                  {/* ... Other cells in edit mode */}
                                  <TableCell className='border data_td p-1 '>
                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button onClick={() => setEditMode1(false)} className='btn delete_btn  btn-sm'><i className="fa-solid fa-xmark"></i></button>
                                      <button onClick={() => handleTotalPaymentUpdate()} className='btn save_btn btn-sm' disabled={loading3}><i className="fa-solid fa-check"></i></button>
                                    </div>
                                  </TableCell>
                                </>
                              ) : (
                                // Non-Edit Mode
                                <>
                                  <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.createdAt}
                                  </TableCell>
                                  <TableCell className='border data_td text-center' onClick={() => handleRowClick(entry.supplierName)}>
                                    {entry.supplierName}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.pp_No}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.entry_Mode}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.company}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.country}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.trade}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.final_Status}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.flight_Date}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.total_Visa_Price_Out_PKR}
                                  </TableCell>

                                  <TableCell className='border data_td text-center'>
                                    <i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{entry.total_Payment_Out}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    <i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{entry.total_Cash_Out}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.remaining_Balance}
                                  </TableCell>
                                  {show && <>
                                    <TableCell className='border data_td text-center'>
                                      {entry.total_Visa_Price_Out_Curr}
                                    </TableCell>
                                    <TableCell className='border data_td text-center'>
                                      {entry.total_Payment_Out_Curr}
                                    </TableCell>
                                    <TableCell className='border data_td text-center'>
                                      {entry.remaining_Curr}
                                    </TableCell>
                                  </>}
                                  <TableCell className='border data_td text-center'>
                                    <span>{entry.status}</span>
                                  </TableCell>
                                  {/* ... Other cells in non-edit mode */}
                                  <TableCell className='border data_td p-1 '>
                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <div className="btn-group" role="group" aria-label="Basic">
                                    <button onClick={() => handleTotalPaymentEditClick(entry, outerIndex)} className='btn edit_btn'><i className="fa-solid fa-pen-to-square"></i></button>
                                  <button onClick={() => printCandidateDetails(entry)} className='btn bg-success text-white btn-sm'><i className="fa-solid fa-print"></i></button>
                                  <button onClick={() => downloadCandidateDetails(entry)} className='btn bg-warning text-white btn-sm'><i className="fa-solid fa-download"></i></button>
                                    {/* <button className='btn delete_btn btn-sm' onClick={() => deleteTotalpayment(entry)} disabled={loading5}><i className="fa-solid fa-trash-can"></i></button> */}
                                    </div>
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
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                        <TableCell className='border data_td text-center bg-info text-white'>
                          {/* Calculate the total sum of payment_In */}
                          {filteredTotalPaymentOut.slice(0,rowsValue1 ? rowsValue1 : undefined).reduce((total, paymentItem) => {
                            const paymentIn = parseFloat(paymentItem.total_Visa_Price_Out_PKR);
                            return isNaN(paymentIn) ? total : total + paymentIn;
                          }, 0)}
                        </TableCell>
                        <TableCell className='border data_td text-center bg-success text-white'>
                          {/* Calculate the total sum of cash_Out */}
                          {filteredTotalPaymentOut.slice(0,rowsValue1 ? rowsValue1 : undefined).reduce((total, paymentItem) => {
                            const cashOut = parseFloat(paymentItem.total_Payment_Out);
                            return isNaN(cashOut) ? total : total + cashOut;
                          }, 0)}
                        </TableCell>
                        <TableCell className='border data_td text-center bg-danger text-white'>
                          {/* Calculate the total sum of cash_Out */}
                          {filteredTotalPaymentOut.slice(0,rowsValue1 ? rowsValue1 : undefined).reduce((total, paymentItem) => {
                            const cashOut = parseFloat(paymentItem.total_Cash_Out);
                            return isNaN(cashOut) ? total : total + cashOut;
                          }, 0)}
                        </TableCell>
                        <TableCell className='border data_td text-center bg-warning text-white'>
                          {/* Calculate the total sum of cash_Out */}
                          {filteredTotalPaymentOut.slice(0,rowsValue1 ? rowsValue1 : undefined).reduce((total, paymentItem) => {
                            const paymentIn = parseFloat(paymentItem.total_Visa_Price_Out_PKR);
                            const cashOut = parseFloat(paymentItem.total_Cash_Out);
                            const paymentOut = parseFloat(paymentItem.total_Payment_Out);

                            // Add the difference between total_Visa_Price_Out_PKR and total_Payment_Out, then add total_Cash_Out
                            const netCashOut = isNaN(paymentIn) || isNaN(paymentOut) ? 0 : paymentIn - paymentOut + cashOut;
                            return total + netCashOut;
                          }, 0)}
                        </TableCell>
                      </TableRow>
                    </TableBody>

                  </Table>
                </TableContainer>
                
              </Paper>
            </div>
          }
        </>
      }

      {option && selectedSupplier && (
        <>
          {/* Display Table for selectedSupplier's payment details array */}
          <div className="col-md-12 my-2">
            <div className="row candidate_Details">

              <h4 className='text-center my-2'>Candidate Payment Details</h4>
              <hr />
              <div className="col-md-4">
                <p>Candidate: <b>{details.supplierName}</b></p>
                <p>Country: <b>{details.country}</b></p>
                <p>Fly: <b>{details.flight_Date}</b></p>
                <p>Trade: <b>{details.trade}</b></p>

              </div>
              <div className="col-md-4">
                <p>Passport: <b>{details.pp_No}</b></p>
                <p>Contact: <b>{details.contact}</b></p>
                <p>Company: <b>{details.company}</b></p>
              </div>
              <div className="col-md-4">
                <p>Rozgar Visa Price: <b>{details.total_Visa_Price_Out_PKR}</b></p>
                <p>Total In: <b>{details.total_Payment_Out}</b></p>
                <p>Remaning: <b>{details.total_Visa_Price_Out_PKR - details.total_Payment_Out + details.total_Cash_Out}</b></p>
              </div>
            </div>
            <div className="d-flex justify-content-between supplier_Name">
              <div className="left d-flex">


              </div>
              <div className="right">
                <div className="dropdown d-inline ">
                  <button className="btn btn-secondary dropdown-toggle m-1 btn-sm" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    {loading5 ? "Updating" : "Change Status"}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><Link className="dropdown-item" onClick={() => changeStatus("Open")}>Khata Open</Link></li>
                    <li><Link className="dropdown-item" onClick={() => changeStatus("Closed")}>Khata Close</Link></li>

                  </ul>
                </div>
                <button className='btn btn-sm m-1 bg-info text-white shadow' onClick={() => setShow2(!show2)}>{show2 === false ? "Show" : "Hide"}</button>
                <button className='btn excel_btn m-1 btn-sm' onClick={downloadCombinedPayments}>Download All</button>
                <button className='btn excel_btn m-1 btn-sm' onClick={downloadIndividualPayments}>Download </button>
                <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printPaymentsTable}>Print </button>
                {selectedSupplier && <button className='btn detail_btn  btn-sm ' onClick={handleOption}><i className="fas fa-times"></i></button>}

              </div>
            </div>
          </div>


          <div className="col-md-12 filters">
            <Paper className='py-1 mb-2 px-3'>
              <div className="row">
              <div className="col-auto px-1">
                  <label htmlFor="">Serach Here:</label>
                  <input type="search" value={search1} onChange={(e) => setSearch1(e.target.value)} className='m-0 p-1' />
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Date From:</label>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className='m-0 p-1' />
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Date To:</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className='m-0 p-1' />

                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Payment Via:</label>
                  <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {[...new Set(candidate_Payments_Out
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
                    {[...new Set(candidate_Payments_Out
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
          <div className="d-flex justify-content-between">
              <div className="left d-flex">
              <h6>Payment Out Details</h6>
              </div>
              <div className="right d-flex">
              <label htmlFor="" className='mb-2 mt-3 mx-1'>Show Entries: </label>
                  <select name="" className='my-2 mx-1' value={rowsValue} onChange={(e)=>setRowsValue(e.target.value)} id="" style={{height:'30px',zIndex:'999',width:'auto'}}>
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
            </div>
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead className="thead">
                  <TableRow>
                    <TableCell className='label border'>SN</TableCell>
                    <TableCell className='label border'>Date</TableCell>
                    <TableCell className='label border'>Category</TableCell>
                    <TableCell className='label border'>Payment_Via</TableCell>
                    <TableCell className='label border'>Payment_Type</TableCell>
                    <TableCell className='label border'>Slip_No</TableCell>
                    <TableCell className='label border'>Details</TableCell>
                    <TableCell className='label border'>Payment_Out</TableCell>
                    <TableCell className='label border'>Cash_Out</TableCell>
                    <TableCell className='label border'>Invoice</TableCell>
                    {show2 && <>
                      <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Out_Curr</TableCell>
                      <TableCell className='label border' style={{ width: '18.28%' }}>CUR_Rate</TableCell>
                      <TableCell className='label border' style={{ width: '18.28%' }}>CUR_Amount</TableCell>
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
                      {filteredData.payment.slice(0,rowsValue ? rowsValue : undefined).map((paymentItem, index) => (
                        <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                          {editMode && editedRowIndex === index ? (
                            <>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={index + 1} readonly />
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
                                <input type='text' value={editedEntry.payment_Out} onChange={(e) => handleInputChange(e, 'payment_Out')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.cash_Out} onChange={(e) => handleInputChange(e, 'cash_Out')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.invoice} readonly />
                              </TableCell>
                              {show2 && <>
                                <TableCell className='border data_td p-1 '>
                                  <select required value={editedEntry.payment_Out_Curr} onChange={(e) => handleInputChange(e, 'payment_Out_Curr')}>
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
                              <TableCell className='border data_td text-center'>{index + 1}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.date}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.category}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.payment_Via}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.payment_Type}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.slip_No}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.details}</TableCell>
                              <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{paymentItem?.payment_Out}</TableCell>
                              <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.cash_Out}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.invoice}</TableCell>
                              {show2 && <>
                                <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_Out_Curr}</TableCell>
                                <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.curr_Rate}</TableCell>
                                <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.curr_Amount}</TableCell>
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
                                  <button onClick={() => handleUpdate()} className='btn save_btn btn-sm' disabled={loading3}><i className="fa-solid fa-check"></i></button>

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
                      {filteredIndividualPayments.slice(0,rowsValue ? rowsValue : filteredIndividualPayments.length).reduce((total, filteredData) => {
                        return total + filteredData.payment.reduce((sum, paymentItem) => {
                          const paymentIn = parseFloat(paymentItem.payment_Out);
                          return isNaN(paymentIn) ? sum : sum + paymentIn;
                        }, 0);
                      }, 0)}
                    </TableCell>
                    <TableCell className='border data_td text-center bg-info text-white'>
                      {/* Calculate the total sum of cash_Out */}
                      {filteredIndividualPayments.slice(0,rowsValue ? rowsValue : filteredIndividualPayments.length).reduce((total, filteredData) => {
                        return total + filteredData.payment.reduce((sum, paymentItem) => {
                          const cashOut = parseFloat(paymentItem.cash_Out);
                          return isNaN(cashOut) ? sum : sum + cashOut;
                        }, 0);
                      }, 0)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    {show2 && <>
                      <TableCell className='border data_td text-center bg-warning text-white'>
                      
                      {filteredIndividualPayments.slice(0,rowsValue ? rowsValue : filteredIndividualPayments.length).reduce((total, filteredData) => {
                        return total + filteredData.payment.reduce((sum, paymentItem) => {
                          const paymentIn = parseFloat(paymentItem.payment_Out_Curr);
                          return isNaN(paymentIn) ? sum : sum + paymentIn;
                        }, 0);
                      }, 0)}
                    </TableCell>
                    <TableCell className='border data_td text-center bg-info text-white'>
                      {/* Calculate the total sum of cash_Out */}
                      {filteredIndividualPayments.slice(0,rowsValue ? rowsValue : filteredIndividualPayments.length).reduce((total, filteredData) => {
                        return total + filteredData.payment.reduce((sum, paymentItem) => {
                          const cashOut = parseFloat(paymentItem.curr_Rate);
                          return isNaN(cashOut) ? sum : sum + cashOut;
                        }, 0);
                      }, 0)}
                    </TableCell>
                    <TableCell className='border data_td text-center bg-primary text-white'>
                      {/* Calculate the total sum of cash_Out */}
                      {filteredIndividualPayments.reduce((total, filteredData) => {
                        return total + filteredData.payment.slice(0,rowsValue ? rowsValue : filteredIndividualPayments.length).reduce((sum, paymentItem) => {
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
