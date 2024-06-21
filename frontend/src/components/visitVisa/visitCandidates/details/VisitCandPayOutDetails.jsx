
import React, { useEffect, useState } from 'react'
import VisitHook from '../../../../hooks/visitsHooks/VisitHook'
import { useSelector, useDispatch } from 'react-redux';
import { useAuthContext } from '../../../../hooks/userHooks/UserAuthHook';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import CategoryHook from '../../../../hooks/settingHooks/CategoryHook'
import PaymentViaHook from '../../../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../../../hooks/settingHooks/PaymentTypeHook'
import CurrencyHook from '../../../../hooks/settingHooks/CurrencyHook'
import CompanyHook from '../../../../hooks/settingHooks/CompanyHook'
import CountryHook from '../../../../hooks/settingHooks/CountryHook'
import EntryMoodHook from '../../../../hooks/settingHooks/EntryMoodHook'
import FinalStatusHook from '../../../../hooks/settingHooks/FinalStatusHook'
import TradeHook from '../../../../hooks/settingHooks/TradeHook'
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader'
import { Link } from 'react-router-dom'


export default function VisitCandPaymentOutDetails() {
  const [isLoading, setIsLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const [loading5, setLoading5] = useState(false)
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const apiUrl = process.env.REACT_APP_API_URL;

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

  const {  getVisitCandPaymentsOut } = VisitHook()
  const { user } = useAuthContext()
  const dispatch = useDispatch()


  const fetchData = async () => {

    try {
      setIsLoading(true)
      await getVisitCandPaymentsOut();
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

  const visitCand_Payments_Out = useSelector((state) => state.visits.visitCand_Payments_Out);
 


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
    if (window.confirm('Are you sure you want to delete this record?')){
      setLoading1(true)
      let paymentId = payment._id
      try {
        const response = await fetch(`${apiUrl}/auth/visit/candidates/delete/single/payment_out`, {
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
      const response = await fetch(`${apiUrl}/auth/visit/candidates/update/single/payment_out`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ paymentId, supplierName: selectedSupplier, category: editedEntry.category, payment_Via: editedEntry.payment_Via, payment_Type: editedEntry.payment_Type, slip_No: editedEntry.slip_No, details: editedEntry.details, payment_Out: editedEntry.payment_Out, cash_Out: editedEntry.cash_Out, curr_Country: editedEntry.payment_Out_Curr, curr_Amount: editedEntry.curr_Amount,curr_Rate:editedEntry.curr_Rate, slip_Pic: editedEntry.slip_Pic, date: editedEntry.date })
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
      const response = await fetch(`${apiUrl}/auth/visit/candidates/update/all/payment_out`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: editedEntry1.supplierName,pp_No:editedEntry1.pp_No,entry_Mode:editedEntry1.entry_Mode,contact:editedEntry1.contact,company:editedEntry1.company,country:editedEntry1.country,trade:editedEntry1.trade,final_Status:editedEntry1.final_Status,flight_Date:editedEntry1.flight_Date, total_Payment_Out: editedEntry1.total_Payment_Out, total_Cash_Out: editedEntry1.total_Cash_Out, total_Visa_Price_Out_Curr: editedEntry1.total_Payment_Out_Curr, status: editedEntry1.status  })
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
    if (window.confirm('Are you sure you want to delete this record?')){
      setLoading5(true)
      try {
        const response = await fetch(`${apiUrl}/auth/visit/candidates/delete/all/payment_out`, {
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

  const filteredTotalPaymentOut = visitCand_Payments_Out.filter(payment => {
    // Check if supplierName exists and matches the provided name
    if (payment?.supplierName && payment.supplierName.toLowerCase().includes(name.toLowerCase())) {
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
 return false;
   })

  const printMainTable = () => {
    // Convert JSX to HTML string
    let printContentString = '';

    if (filteredTotalPaymentOut.length === 1) {
        const { supplierName, contact, pp_No, trade, company, total_Visa_Price_Out_PKR,total_Cash_Out, country, flight_Date, total_Payment_Out } = filteredTotalPaymentOut[0];

        printContentString += `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <p>Candidate Name: <b>${supplierName}</b></p>
                            <p>Country: <b>${country}</b></p>
                            <p>Fly: <b>${flight_Date}</b></p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <p>Contact: <b>${contact}</b></p>
                            <p>Company: <b>${company}</b></p>
                            <p>Trade: <b>${trade}</b></p>
                          
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <p>Passport No: <b>${pp_No}</b></p>
                            <p>Rozgar Visa Price: <b>${total_Visa_Price_Out_PKR}</b></p>
                            <p>Total In: <b>${total_Payment_Out}</b></p>
                            <p>Remaining: <b>${total_Visa_Price_Out_PKR - total_Payment_Out + total_Cash_Out}</b></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    printContentString += `
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
                    <th>TVPO_PKR</th>
                    <th>TPO_PKR</th>
                    <th>Total_Cash_Out</th>
                    <th>RPO_PKR</th>
                    <th>Status</th>
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
                        <td>${String(entry.total_Visa_Price_out_PKR)}</td>
                        <td>${String(entry.total_Payment_Out)}</td>
                        <td>${String(entry.total_Cash_Out)}</td>
                        <td>${String(entry.remaining_Balance)}</td>
                        <td>${String(entry.status)}</td>
                    </tr>
                `).join('')}
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
                    <title>Candidates Payment Out Details</title>
                    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
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


  // individual payments filters
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')

  const filteredIndividualPayments = visitCand_Payments_Out
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
           paymentItem.payment_Type?.toLowerCase().includes(payment_Type.toLowerCase())
        );
      }),
  }))


  const printPaymentsTable = () => {
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
        <th>Payment_Out</th>
        <th>Cash_Out</th>
        <th>Invoice</th>
        <th>Payment_Out_Curr</th>
        <th>CUR_Rate</th>
        <th>CUR_Amount</th>
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
            <td>${String(paymentItem?.invoice)}</td>
            <td>${String(paymentItem?.payment_Out_Curr)}</td>
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
    <td>${String(filteredIndividualPayments.reduce((total, entry) => total + entry.payment.reduce((acc, paymentItem) => acc + paymentItem.payment_Out, 0), 0))}</td>
    <td>${String(filteredIndividualPayments.reduce((total, entry) => total + entry.payment.reduce((acc, paymentItem) => acc + paymentItem.cash_Out, 0), 0))}</td>
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
          <title>${selectedSupplier} Payment In Details</title>
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
    filteredTotalPaymentOut.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Candidates:payments.supplierName,
        pp_No:payments.pp_No,
        entry_Mode:payments.entry_Mode,
        company:payments.company,
        country:payments.country,
        trade:payments.trade,
        final_Status:payments.final_Status,
        flight_Date:payments.flight_Date,
        Total_Visa_Price_Out_PKR:payments.total_Visa_Price_Out_PKR,
        Total_Payment_Out:payments.total_Payment_Out,
        Total_Cash_Out:payments.total_Cash_Out,
        Remaining_PKR: payments.remaining_Balance,
        Total_Visa_Price_Out_Curr:payments.total_Visa_Price_Out_Curr,
        Total_Payment_Out_Curr:payments.total_Payment_Out_Curr,
        Remaining_Curr:payments.remaining_Curr,
        Status:payments.status
      }

      data.push(rowData);
    });

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
        Date:payments.date,
        Category:payments.category,
        payment_Via:payments.payment_Via,
        payment_Type:payments.payment_Type,
        slip_No: payments.slip_No,
        details:payments.details,
        payment_Out:payments.payment_Out,
        cash_Out:payments.cash_Out,
        invoice:payments.invoice,
        payment_Out_Curr:payments.payment_Out_Curr,
        curr_Rate:payments.curr_Rate,
        curr_Amount:payments.curr_Amount
      }

      data.push(rowData);
    });

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
                <h4>PaymentOut Details</h4>
              </div>
              <div className="right d-flex">
                {visitCand_Payments_Out.length > 0 &&
                  <>
                    <button className='btn btn-sm m-1 bg-info text-white shadow' onClick={() => setShow(!show)}>{show === false ? "Show" : "Hide"}</button>
                    <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}>Download </button>
                    <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printMainTable}>Print </button>

                  </>
                }
              </div>
            </Paper>
          </div>
          {(isLoading && visitCand_Payments_Out.length<1) &&
            <div className='col-md-12 text-center my-4'>
              <ClipLoader color="#2C64C3" className='mx-auto' />
            </div>
          }

            <div className="col-md-12 filters">
            <Paper className='py-1 mb-2 px-3'>
              <div className="row">
                <div className="col-auto px-1">
                  <label htmlFor="">Date:</label>
                  <select value={date1} onChange={(e) => setDate1(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {[...new Set(visitCand_Payments_Out.map(data => data.createdAt))].map(dateValue => (
                      <option value={dateValue} key={dateValue}>{dateValue}</option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Candidate:</label>
                  <select value={name} onChange={(e) => setName(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {visitCand_Payments_Out && visitCand_Payments_Out.map((data) => (
                      <option value={data.supplierName} key={data._id}>{data.supplierName} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">PP#:</label>
                  <select value={pp_No} onChange={(e) => setPP_NO(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {visitCand_Payments_Out && visitCand_Payments_Out.map((data) => (
                      <option value={data.pp_No} key={data._id}>{data.pp_No} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Entry Mode:</label>
                  <select value={entry_Mode} onChange={(e) => setEntry_Mode(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {visitCand_Payments_Out && visitCand_Payments_Out.map((data) => (
                      <option value={data.entry_Mode} key={data._id}>{data.entry_Mode} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Company:</label>
                  <select value={company} onChange={(e) => setCompany(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {visitCand_Payments_Out && visitCand_Payments_Out.map((data) => (
                      <option value={data.company} key={data._id}>{data.company} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Country:</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {visitCand_Payments_Out && visitCand_Payments_Out.map((data) => (
                      <option value={data.country} key={data._id}>{data.country} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Trade:</label>
                  <select value={trade} onChange={(e) => setTrade(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {visitCand_Payments_Out && visitCand_Payments_Out.map((data) => (
                      <option value={data.trade} key={data._id}>{data.trade} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Final Status:</label>
                  <select value={final_Status} onChange={(e) => setFinal_Status(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {visitCand_Payments_Out && visitCand_Payments_Out.map((data) => (
                      <option value={data.final_Status} key={data._id}>{data.final_Status} </option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Flight Date:</label>
                  <select value={flight_Date} onChange={(e) => setFlight_Date(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {visitCand_Payments_Out && visitCand_Payments_Out.map((data) => (
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

          {(!isLoading || visitCand_Payments_Out.length>0) &&
            <div className='col-md-12'>
              <Paper className='py-3 mb-1 px-2 detail_table'>
                <TableContainer sx={{ maxHeight: 600 }}>
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
                      <TableCell className='label border'>RPI_PKR</TableCell>
                      {show && <>
                          <TableCell className='label border'>TVPI_Oth_Curr</TableCell>
                          <TableCell className='label border'>TPI_Curr</TableCell>
                          <TableCell className='label border'>RPI_Curr</TableCell>
                        </>}
                      <TableCell className='label border'>Status</TableCell>
                    
                      <TableCell align='left' className='edw_label border' colSpan={1}>
                        Actions
                      </TableCell>
                    </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredTotalPaymentOut
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry, outerIndex) => (
                          // Map through the payment array
                          <React.Fragment key={outerIndex}>

                            <TableRow key={entry?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                              {editMode1 && editedRowIndex1 === outerIndex ? (
                                // Edit Mode
                                <>
                                 <TableCell className='border data_td p-1 '>
                                    <input type='date' value={outerIndex + 1} readonly />
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
                                      <button onClick={() => setEditMode1(false)} className='btn delete_btn'>Cancel</button>
                                      <button onClick={() => handleTotalPaymentUpdate()} className='btn save_btn' disabled={loading3}>{loading3 ? "Saving..." : "Save"}</button>
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
                                    {entry.status}
                                  </TableCell>
                                 
                                  {/* ... Other cells in non-edit mode */}
                                  <TableCell className='border data_td p-1 '>
                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                      <button onClick={() => handleTotalPaymentEditClick(entry, outerIndex)} className='btn edit_btn'>Edit</button>
                                      {/* <button className='btn delete_btn' onClick={() => deleteTotalpayment(entry)} disabled={loading5}>{loading5 ? "Deleting..." : "Delete"}</button> */}
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
        {filteredTotalPaymentOut.reduce((total, paymentItem) => {
            const paymentIn = parseFloat(paymentItem.total_Visa_Price_Out_PKR);
            return isNaN(paymentIn) ? total : total + paymentIn;
        }, 0)}
    </TableCell>
    <TableCell className='border data_td text-center bg-success text-white'>
        {/* Calculate the total sum of cash_Out */}
        {filteredTotalPaymentOut.reduce((total, paymentItem) => {
            const cashOut = parseFloat(paymentItem.total_Payment_Out);
            return isNaN(cashOut) ? total : total + cashOut;
        }, 0)}
    </TableCell>
    <TableCell className='border data_td text-center bg-danger text-white'>
        {/* Calculate the total sum of cash_Out */}
        {filteredTotalPaymentOut.reduce((total, paymentItem) => {
            const cashOut = parseFloat(paymentItem.total_Cash_Out);
            return isNaN(cashOut) ? total : total + cashOut;
        }, 0)}
    </TableCell>
    <TableCell className='border data_td text-center bg-warning text-white'>
    {/* Calculate the total sum of cash_Out */}
    {filteredTotalPaymentOut.reduce((total, paymentItem) => {
        const paymentIn = parseFloat(paymentItem.total_Visa_Price_Out_PKR);
        const cashOut = parseFloat(paymentItem.total_Cash_Out);
        const paymentOut = parseFloat(paymentItem.total_Payment_Out);
        
        // Add the difference between total_Visa_Price_In_PKR and total_Payment_In, then add total_Cash_Out
        const netCashOut = isNaN(paymentIn) || isNaN(paymentOut) ? 0 : paymentIn - paymentOut + cashOut;
        return total + netCashOut;
    }, 0)}
</TableCell>
</TableRow>
                        
                    </TableBody>

                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={rowsPerPageOptions}
                  component='div'
                  count={filteredTotalPaymentOut.length}
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
                <h4 className='d-inline '>Candidate Name: <span>{selectedSupplier}</span></h4>

              </div>
              <div className="right">
              <button className='btn btn-sm m-1 bg-info text-white shadow' onClick={() => setShow2(!show2)}>{show2 === false ? "Show" : "Hide"}</button>
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
                    {[...new Set(visitCand_Payments_Out
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
                    {[...new Set(visitCand_Payments_Out
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
            <h6>Payment Out Details</h6>
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
                      <TableCell className='label border' >Payment_Out_Curr</TableCell>
                      <TableCell className='label border' >CUR_Rate</TableCell>
                      <TableCell className='label border' >CUR_Amount</TableCell>
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
                              <TableCell className='border data_td text-center'>{index+1}</TableCell>
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
                                <TableCell className='border data_td text-center' >{paymentItem?.payment_Out_Curr}</TableCell>
                                <TableCell className='border data_td text-center' >{paymentItem?.curr_Rate}</TableCell>
                                <TableCell className='border data_td text-center' >{paymentItem?.curr_Amount}</TableCell>
                              </>}
                              <TableCell className='border data_td text-center'>{paymentItem.slip_Pic ? <a href={paymentItem.slip_Pic} target="_blank" rel="noopener noreferrer"> <img src={paymentItem.slip_Pic} alt='Images' className='rounded' /></a>  : "No Picture"}</TableCell>


                            </>
                          )}
                          <TableCell className='border data_td p-1 '>
                            {editMode && editedRowIndex === index ? (
                              // Render Save button when in edit mode for the specific row
                              <>
                                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                  <button onClick={() => setEditMode(!editMode)} className='btn delete_btn'>Cancel</button>
                                  <button onClick={() => handleUpdate()} className='btn save_btn' disabled={loading3}>{loading3 ? "Saving..." : "Save"}</button>

                                </div>

                              </>

                            ) : (
                              // Render Edit button when not in edit mode or for other rows
                              <>
                                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                  <button onClick={() => handleEditClick(paymentItem, index)} className='btn edit_btn'>Edit</button>
                                  <button className='btn delete_btn' onClick={() => deletePaymentIn(paymentItem)} disabled={loading1}>{loading1 ? "Deleting..." : "Delete"}</button>
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
              const paymentIn = parseFloat(paymentItem.payment_Out);
              return isNaN(paymentIn) ? sum : sum + paymentIn;
            }, 0);
          }, 0)}
        </TableCell>
        <TableCell className='border data_td text-center bg-info text-white'>
          {/* Calculate the total sum of cash_Out */}
          {filteredIndividualPayments.reduce((total, filteredData) => {
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
                      
                      {filteredIndividualPayments.reduce((total, filteredData) => {
                        return total + filteredData.payment.reduce((sum, paymentItem) => {
                          const paymentIn = parseFloat(paymentItem.payment_Out_Curr);
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
