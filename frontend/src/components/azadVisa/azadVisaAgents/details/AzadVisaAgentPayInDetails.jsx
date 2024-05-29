
import React, { useEffect, useState } from 'react'
import AzadVisaHook from '../../../../hooks/azadVisaHooks/AzadVisaHooks'
import { useSelector, useDispatch } from 'react-redux';
import { useAuthContext } from '../../../../hooks/userHooks/UserAuthHook';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import CategoryHook from '../../../../hooks/settingHooks/CategoryHook'
import PaymentViaHook from '../../../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../../../hooks/settingHooks/PaymentTypeHook'
import CurrencyHook from '../../../../hooks/settingHooks/CurrencyHook'
import EntryMoodHook from '../../../../hooks/settingHooks/EntryMoodHook'
import FinalStatusHook from '../../../../hooks/settingHooks/FinalStatusHook'
import TradeHook from '../../../../hooks/settingHooks/TradeHook'
import CompanyHook from '../../../../hooks/settingHooks/CompanyHook'
import CountryHook from '../../../../hooks/settingHooks/CountryHook'
import SyncLoader from 'react-spinners/SyncLoader'
import { Link } from 'react-router-dom'

export default function AzadVisaAgentPayInDetails() {
    const [isLoading, setIsLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [loading3, setLoading3] = useState(false)
    const [loading4, setLoading4] = useState(false)
    const [loading5, setLoading5] = useState(false)
    const [show, setShow] = useState(false)
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)

    const apiUrl = process.env.REACT_APP_API_URL;


    const [, setNewMessage] = useState('')
    const { getAzadAgentPaymentsIn } = AzadVisaHook()
    const { getCurrencyData } = CurrencyHook()
    const { getCategoryData } = CategoryHook()
    const { getPaymentViaData } = PaymentViaHook()
    const { getPaymentTypeData } = PaymentTypeHook()
    const { getComapnyData } = CompanyHook()
    const { getCountryData } = CountryHook()
    const { getEntryMoodData } = EntryMoodHook()
    const { getFinalStatusData } = FinalStatusHook()
    const { getTradeData } = TradeHook()


    const { user } = useAuthContext()
    const dispatch = useDispatch()


    const fetchData = async () => {

        try {
            setIsLoading(true)
            getAzadAgentPaymentsIn();
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

    const azadAgent_Payments_In = useSelector((state) => state.azadVisa.azadAgent_Payments_In);

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
    };


    const deletePaymentIn = async (payment) => {
    if (window.confirm('Are you sure you want to delete this record?')){
        setLoading1(true)
        let paymentId = payment._id
        try {
            const response = await fetch(`${apiUrl}/auth/azadVisa/agents/delete/single/payment_in`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({ paymentId, supplierName: selectedSupplier, payment_In: payment.payment_In, payment_Via: payment.payment_Via, cash_Out: payment.cash_Out, curr_Amount: payment.curr_Amount })
            })

            const json = await response.json()

            if (!response.ok) {
                setNewMessage(toast.error(json.message));
                setLoading1(false)
            }
            if (response.ok) {
                fetchData()
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


    const deletePerson = async (person) => {
    if (window.confirm('Are you sure you want to delete this record?')){
        setLoading2(true)
        let personId = person._id
        try {
            const response = await fetch(`${apiUrl}/auth/azadVisa/agents/delete/person/payment_in`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({ personId, supplierName: selectedSupplier, azad_Visa_Price_In_PKR: person.azad_Visa_Price_In_PKR, azad_Visa_Price_In_Curr: person.azad_Visa_Price_In_Curr })
            })

            const json = await response.json()

            if (!response.ok) {
                setNewMessage(toast.error(json.message));
                setLoading2(false)
            }
            if (response.ok) {
                fetchData()
                setNewMessage(toast.success(json.message));
                setLoading2(false)
                setEditMode(!editMode)
            }
        }
        catch (error) {
            setNewMessage(toast.error('Server is not responding...'))
            setLoading2(false)
        }
    }
       
    }



    //Editing for Azad Agent Person 
    const [editMode2, setEditMode2] = useState(false);
    const [editedEntry2, setEditedEntry2] = useState({});
    const [editedRowIndex2, setEditedRowIndex2] = useState(null);

    const handlePersonEditClick = (person, index) => {
        setEditMode2(!editMode2);
        setEditedEntry2(person);
        setEditedRowIndex2(index);
    };


    const handlePersonInputChange = (e, field) => {
        setEditedEntry2({
            ...editedEntry2,
            [field]: e.target.value,
        });

    };

    const handleUpdatePerson = async () => {
        setLoading5(true)
        try {
            const response = await fetch(`${apiUrl}/auth/azadVisa/agents/payment_in/update/single/person`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({supplierName: selectedSupplier,personId:editedEntry2._id, name: editedEntry2.name, pp_No: editedEntry2.pp_No, contact: editedEntry2.contact, company: editedEntry2.company, country: editedEntry2.country, entry_Mode: editedEntry2.entry_Mode, final_Status: editedEntry2.final_Status, trade: editedEntry2.trade, flight_Date: editedEntry2.flight_Date,status: editedEntry2.status })
            })
            const json = await response.json()


            if (!response.ok) {
                setNewMessage(toast.error(json.message));
                setLoading5(false)
            }
            if (response.ok) {
                fetchData();
                setNewMessage(toast.success(json.message));
                setLoading5(null)
                setEditMode2(!editMode2)
            }
        }
        catch (error) {
            setNewMessage(toast.error(error))
            setLoading5(false)
        }
    }


    const handleUpdate = async () => {
        setLoading3(true)

        let paymentId = editedEntry._id
        try {
            const response = await fetch(`${apiUrl}/auth/azadVisa/agents/update/single/payment_in`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({ paymentId, supplierName: selectedSupplier, category: editedEntry.category, payment_Via: editedEntry.payment_Via, payment_Type: editedEntry.payment_Type, slip_No: editedEntry.slip_No, details: editedEntry.details, payment_In: editedEntry.payment_In, cash_Out: editedEntry.cash_Out, curr_Country: editedEntry.payment_In_Curr, curr_Amount: editedEntry.curr_Amount,curr_Rate:editedEntry.curr_Rate, slip_Pic: editedEntry.slip_Pic, date: editedEntry.date })
            })

            const json = await response.json()

            if (!response.ok) {
                setNewMessage(toast.error(json.message));
                setLoading3(false)
            }
            if (response.ok) {
                fetchData()
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


    const deleteTotalpayment = async (person) => {
    if (window.confirm('Are you sure you want to delete this record?')){
        setLoading5(true)
        
        try {
            const response = await fetch(`${apiUrl}/auth/azadVisa/agents/delete/all/payment_in`, {
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

            }
        }
        catch (error) {
            setNewMessage(toast.error('Server is not responding...'))
            setLoading5(false)
        }
    }
        
    }



    const [date1, setDate1] = useState('')
    const [supplier1, setSupplier1] = useState('')
    const [status, setStatus] = useState('')
    const filteredTotalPaymentIn = azadAgent_Payments_In.filter(payment => {
        return (
            payment.createdAt.toLowerCase().includes(date1.toLowerCase()) &&
            payment.supplierName.toLowerCase().includes(supplier1.toLowerCase()) &&
            payment.status.toLowerCase().includes(status.toLowerCase())
        )
    })


    // individual payments filters
    const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')

  const filteredIndividualPayments = azadAgent_Payments_In
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
   
    const [date3, setDate3] = useState('')
    const [name, setName] = useState('')
    const [pp_No, setPP_NO] = useState('')
    const [entry_Mode, setEntry_Mode] = useState('')
    const [company, setCompany] = useState('')
    const [country, setCountry] = useState('')
    const [trade, setTrade] = useState('')
    const [final_Status, setFinal_Status] = useState('')
    const [flight_Date, setFlight_Date] = useState('')
    const [status1, setStatus1] = useState("")


    const filteredPersons = azadAgent_Payments_In
        .filter((data) => data.supplierName === selectedSupplier)
        .map((filteredData) => ({
            ...filteredData,
            persons: filteredData.persons
                .filter((persons) =>
                    persons.entry_Date?.toLowerCase().includes(date3.toLowerCase()) &&
                    persons.name?.toLowerCase().includes(name.toLowerCase()) &&
                    persons.pp_No?.toLowerCase().includes(pp_No.toLowerCase()) &&
                    persons.entry_Mode?.toLowerCase().includes(entry_Mode.toLowerCase()) &&
                    persons.company?.toLowerCase().includes(company.toLowerCase()) &&
                    persons.country?.toLowerCase().includes(country.toLowerCase()) &&
                    persons.trade?.toLowerCase().includes(trade.toLowerCase()) &&
                    persons.final_Status?.toLowerCase().includes(final_Status.toLowerCase()) &&
                    persons.flight_Date?.toLowerCase().includes(flight_Date.toLowerCase())&&
                    persons.status?.toLowerCase().includes(status1.toLowerCase())

                ),
        }))

   

    
  const downloadExcel = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredTotalPaymentIn.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Agents:payments.supplierName,
        Total_Visa_Price_In_PKR:payments.total_Azad_Visa_Price_In_PKR,
        Total_Payment_In:payments.total_Payment_In,
        Total_Cash_Out:payments.total_Cash_Out,
        Remaining_PKR: payments.total_Azad_Visa_Price_In_PKR-payments.total_Payment_In+payments.total_Cash_Out,
        Total_Visa_Price_In_Curr:payments.total_Azad_Visa_Price_In_Curr,
        Total_Payment_In_Curr:payments.total_Payment_In_Curr,
        Remaining_Curr:payments.total_Azad_Visa_Price_In_Curr-payments.total_Payment_In_Curr,
        Status:payments.status,
        
        
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Agent_Payments_Details.xlsx');
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
        payment_In:payments.payment_In,
        cash_Out:payments.cash_Out,
        invoice:payments.invoice,
        payment_In_Curr:payments.payment_In_Curr,
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

  
  const downloadPersons = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredPersons.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Entry_Date:payments.entry_Date,
        Name:payments.name,
        PP_No:payments.pp_No,
        Entry_Mode: payments.entry_Mode,
        Company:payments.company,
        Trade:payments.trade,
        Country:payments.country,
        Final_Status:payments.final_Status,
        Flight_Date:payments.flight_Date,
        Visa_Price_In_PKR:payments.azad_Visa_Price_In_PKR,
        Visa_Price_In_Curr:payments.azad_Visa_Price_In_Curr,
        Status:payments.status,
        
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${selectedSupplier} Persons Details.xlsx`);
  }


  const downloadCombinedPayments = () => {
    const combinedData = [];
    const anotherData=[]

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
            Payment_In: payment.payment_In,
            Cash_Out: payment.cash_Out,
            Invoice: payment.invoice,
            Payment_In_Curr: payment.payment_In_Curr,
            Curr_Rate: payment.curr_Rate,
            Curr_Amount: payment.curr_Amount
        };
        combinedData.push(rowData);
    });
    const individualPerons = filteredPersons.flatMap(payment => payment.persons);
    

    // Iterate over individual payments and push all fields
    individualPerons.forEach((payment, index) => {
        const rowData = {
           SN: index + 1,
        Entry_Date:payment.entry_Date,
        Name:payment.name,
        PP_No:payment.pp_No,
        Entry_Mode: payment.entry_Mode,
        Company:payment.company,
        Trade:payment.trade,
        Country:payment.country,
        Final_Status:payment.final_Status,
        Flight_Date:payment.flight_Date,
        Visa_Price_In_PKR:payment.azad_Visa_Price_In_PKR,
        Visa_Price_In_Curr:payment.azad_Visa_Price_In_Curr,
        Status:payment.status,
        };

        anotherData.push(rowData);
    });
    const ws1 = XLSX.utils.json_to_sheet(combinedData);
    const ws2 = XLSX.utils.json_to_sheet(anotherData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Payments Details');
    XLSX.utils.book_append_sheet(wb, ws2, 'Persons Details'); // Add the second sheet
    XLSX.writeFile(wb, `${selectedSupplier} Details.xlsx`);
}

// Changing Status

const changeStatus = async (myStatus) => {
    if (window.confirm(`Are you sure you want to Change the Status of ${selectedSupplier}?`)) {
      setLoading5(true)
      let newStatus=myStatus

      try {
        const response = await fetch(`${apiUrl}/auth/azadVisa/agents/update/payment_in/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ supplierName: selectedSupplier,newStatus })
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
          
        }
      }
      catch (error) {
        setNewMessage(toast.error('Server is not responding...'))
        setLoading5(false)
      }
    }
  }

  const printMainTable = () => {
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
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Agents Payment In Details</h1>
      </div>
      <hr/>
      <table class='print-table'>
        <thead>
          <tr>
            <th>SN</th>
            <th>Agents</th>
            <th>TVPI PKR</th>
            <th>TPI PKR</th>
            <th>Total Cash Out</th>
            <th>RPI PKR</th>
            <th>TVPI Oth Curr</th>
            <th>TPI Curr</th>
            <th>RPI Curr</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        ${filteredTotalPaymentIn.map((entry, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${String(entry.supplierName)}</td>
            <td>${String(entry.total_Azad_Visa_Price_In_PKR)}</td>
            <td>${String(entry.total_Payment_In)}</td>
            <td>${String(entry.total_Cash_Out)}</td>
            <td>${String(entry.total_Azad_Visa_Price_In_PKR - entry.total_Payment_In + entry.total_Cash_Out)}</td>
            <td>${String(entry.total_Azad_Visa_Price_In_Curr)}</td>
            <td>${String(entry.total_Payment_In_Curr)}</td>
            <td>${String(entry.total_Azad_Visa_Price_In_Curr - entry.total_Payment_In_Curr)}</td>
            <td>${String(entry.status)}</td>           
          </tr>
        `).join('')}
        <tr>
          <td colspan="1"></td>
          <td>Total</td>
          <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Azad_Visa_Price_In_PKR, 0))}</td>
          <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Payment_In, 0))}</td>
          <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Cash_Out, 0))}</td>
          <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + (entry.total_Azad_Visa_Price_In_PKR - entry.total_Payment_In + entry.total_Cash_Out), 0))}</td>
          <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Azad_Visa_Price_In_Curr, 0))}</td>
          <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Payment_In_Curr, 0))}</td>
          <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + (entry.total_Azad_Visa_Price_In_Curr - entry.total_Payment_In_Curr), 0))}</td>
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
          text-transform: capitalize;
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
            <title>Agents Payment In Details</title>
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
      <p class="invoice">Agent: ${selectedSupplier}</p>
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Azad Agent Payment Invoices</h1>
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
                <td>${String(paymentItem?.payment_In)}</td>
                <td>${String(paymentItem?.cash_Out)}</td>
                <td>${String(paymentItem?.curr_Rate)}</td>
                <td>${String(paymentItem?.curr_Amount)}</td>
                <td>${String(paymentItem?.invoice)}</td>
                <td>${String(paymentItem?.payment_In_Curr)}</td>
              </tr>
            `).join('')
          ).join('')}
          <tr>
            <td colspan="6"></td>
            <td>Total</td>
            <td>${String(filteredIndividualPayments.reduce((total, entry) => total + entry.payment.reduce((acc, paymentItem) => acc + paymentItem.payment_In, 0), 0))}</td>
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
  
  const printPersonsTable = () => {
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
      <p class="invoice">Agent: ${selectedSupplier}</p>
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Azad Agent Persons Details</h1>
      </div>
      <hr/>
      <table class='print-table'>
        <thead>
          <tr>
            <th>SN</th>
            <th>Date</th>
            <th>Name</th>
            <th>PP#</th>
            <th>Entry Mode</th>
            <th>Company</th>
            <th>Trade</th>
            <th>Country</th>
            <th>Final Status</th>
            <th>Flight Date</th>
            <th>VPI PKR</th>
            <th>VPI Oth Curr</th>
            <th>Paid PKR</th>
            <th>Remaining PKR</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${filteredPersons.map((entry, index) =>
            entry.persons.map((person, personIndex) => `
              <tr key="${person?._id}">
                <td>${index * entry.persons.length + personIndex + 1}</td>
                <td>${String(person?.entry_Date)}</td>
                <td>${String(person?.name)}</td>
                <td>${String(person?.pp_No)}</td>
                <td>${String(person?.entry_Mode)}</td>
                <td>${String(person?.company)}</td>
                <td>${String(person?.trade)}</td>
                <td>${String(person?.country)}</td>
                <td>${String(person?.final_Status)}</td>
                <td>${String(person?.flight_Date)}</td>
                <td>${String(person?.azad_Visa_Price_In_PKR)}</td>
                <td>${String(person?.azad_Visa_Price_In_Curr)}</td>
                <td>${String(person?.total_In)}</td>
                <td>${String(person?.remaining_Price)}</td>
                <td>${String(person?.status)}</td>
              </tr>
            `).join('')
          ).join('')}
          <tr>
            <td colspan="9"></td>
            <td>Total</td>
            <td>${String(filteredPersons.reduce((total, entry) => total + entry.persons.reduce((acc, paymentItem) => acc + paymentItem.azad_Visa_Price_In_PKR, 0), 0))}</td>
            <td>${String(filteredPersons.reduce((total, entry) => total + entry.persons.reduce((acc, paymentItem) => acc + paymentItem.azad_Visa_Price_In_Curr, 0), 0))}</td>
            <td>${String(filteredPersons.reduce((total, entry) => total + entry.persons.reduce((acc, paymentItem) => acc + paymentItem.total_In, 0), 0))}</td>
            <td>${String(filteredPersons.reduce((total, entry) => total + entry.persons.reduce((acc, paymentItem) => acc + paymentItem.remaining_Price, 0), 0))}</td>
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
      </style>
    `;
  
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Write the print content to the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedSupplier}'s Persons Details</title>
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
        <h1 class="title">Azad Agent Payment Invoice</h1>
      </div>
      <hr/>
      <table class='print-table'>
        <thead>
          <tr>
            <th>SN</th>
            <th>Date</th>
            <th>Azad Agent Name</th>
            <th>Category</th>
            <th>Payment Via</th>
            <th>Payment Type</th>
            <th>Slip No</th>
            <th>Details</th>
            <th>Payment In</th>
            <th>Cash Out</th>
            <th>Curr Rate</th>
            <th>Curr Amount</th>
            <th>Payment In Curr</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>${String(paymentItem?.date)}</td>
            <td>${String(selectedSupplier)}</td>
            <td>${String(paymentItem?.category)}</td>
            <td>${String(paymentItem?.payment_Via)}</td>
            <td>${String(paymentItem?.payment_Type)}</td>
            <td>${String(paymentItem?.slip_No)}</td>
            <td>${String(paymentItem?.details)}</td>
            <td>${String(paymentItem?.payment_In)}</td>
            <td>${String(paymentItem?.cash_Out)}</td>
            <td>${String(paymentItem?.curr_Rate)}</td>
            <td>${String(paymentItem?.curr_Amount)}</td>
            <td>${String(paymentItem?.payment_In_Curr)}</td>
          </tr>
        </tbody>
      </table>
      <style>
        body {
          background-color: #fff;
        }
        .print-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          max-width: 100px;
        }
        .title {
          flex-grow: 1;
          text-align: center;
          margin: 0;
          font-size: 24px;
        }
        .invoice {
          flex-grow: 0;
          text-align: left;
          font-size: 20px;
        }
        .date{
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
          text-transform: capitalize;
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
  }
  
  const printPerson = (person) => {
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
      <p class="invoice">Agent: ${selectedSupplier}</p>
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Azad Agent Person Details</h1>
      </div>
      <hr/>
      <table class='print-table'>
        <thead>
          <tr>
            <th>SN</th>
            <th>Date</th>
            <th>Name</th>
            <th>PP#</th>
            <th>Entry Mode</th>
            <th>Company</th>
            <th>Trade</th>
            <th>Country</th>
            <th>Final Status</th>
            <th>Flight Date</th>
            <th>VPI PKR</th>
            <th>VPI Oth Curr</th>
            <th>Paid PKR</th>
            <th>Remaining PKR</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>${String(person?.entry_Date)}</td>
            <td>${String(person?.name)}</td>
            <td>${String(person?.pp_No)}</td>
            <td>${String(person?.entry_Mode)}</td>
            <td>${String(person?.company)}</td>
            <td>${String(person?.trade)}</td>
            <td>${String(person?.country)}</td>
            <td>${String(person?.final_Status)}</td>
            <td>${String(person?.flight_Date)}</td>
            <td>${String(person?.azad_Visa_Price_In_PKR)}</td>
            <td>${String(person?.azad_Visa_Price_In_Curr)}</td>
            <td>${String(person?.total_In)}</td>
            <td>${String(person?.remaining_Price)}</td>
            <td>${String(person?.status)}</td>
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
        .logo {
          max-width: 100px;
        }
        .title {
          flex-grow: 1;
          text-align: center;
          margin: 0;
          font-size: 24px;
        }
        .invoice {
          flex-grow: 0;
          text-align: left;
          font-size: 20px;
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
          text-transform: capitalize;
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
            <title>${selectedSupplier}'s Persons Details</title>
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
  

  const downloadPaymentInvoice = (payment) => {
    const data = [];
    // Flatten the array of objects to get an array of individual payments
    // Iterate over individual payments and push all fields
      const rowData = {
        Agent:selectedSupplier,
        Date: payment.date,
        Category: payment.category,
        Payment_Via: payment.payment_Via,
        Payment_Type: payment.payment_Type,
        Slip_No: payment.slip_No,
        Details: payment.details,
        Payment_In: payment.payment_In,
        Cash_Out: payment.cash_Out,
        Invoice: payment.invoice,
        Payment_In_Curr: payment.payment_In_Curr,
        Curr_Rate: payment.curr_Rate,
        Curr_Amount: payment.curr_Amount
      };

      data.push(rowData);

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${selectedSupplier} Payment Details.xlsx`);
  }

  const downloadPersonDetails = (payment) => {
    const data = [];
      const rowData = {
        Agent:selectedSupplier,
        Entry_Date: payment.entry_Date,
        Name: payment.name,
        PP_No: payment.pp_No,
        Entry_Mode: payment.entry_Mode,
        Company: payment.company,
        Trade: payment.trade,
        Country: payment.country,
        Final_Status: payment.final_Status,
        Flight_Date: payment.flight_Date,
        Visa_Price_In_PKR: payment.azad_Visa_Price_In_PKR,
        Total_In: payment.total_In,
        Total_Cash_Out: payment.cash_Out,
        Remaining_PKR: payment.azad_Visa_Price_In_PKR - payment.total_In + payment.cash_Out,
        Visa_Price_In_Curr: payment.azad_Visa_Price_In_Curr,
        Remaining_Curr: payment.remaining_Curr,
        Status: payment.status
      };

    data.push(rowData);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${selectedSupplier} Persons Details.xlsx`);
  }


    return (
        <>
            {!option &&
                <>
                    <div className='col-md-12 '>
                        <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                            <div className="left d-flex">

                            </div>
                            <div className="right d-flex">
                                {azadAgent_Payments_In.length > 0 &&
                                    <>
                                        <button className='btn btn-sm m-1 bg-info text-white shadow' onClick={() => setShow1(!show1)}>{show1 === false ? "Show" : "Hide"}</button>
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
                                        {[...new Set(azadAgent_Payments_In.map(data => data.createdAt))].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Agents:</label>
                                    <select value={supplier1} onChange={(e) => setSupplier1(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {azadAgent_Payments_In && azadAgent_Payments_In.map((data) => (
                                            <option value={data.supplierName} key={data._id}>{data.supplierName} </option>
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
                                <TableContainer sx={{ maxHeight: 600 }}>
                                    <Table stickyHeader>
                                        <TableHead>

                                            <TableRow>
                                                <TableCell className='label border'>SN</TableCell>
                                                <TableCell className='label border'>Date</TableCell>
                                                <TableCell className='label border'>Agents</TableCell>
                                                <TableCell className='label border'>TAVPriceIn_PKR</TableCell>
                                                <TableCell className='label border'>TAVPayIn_PKR</TableCell>
                                                <TableCell className='label border'>Total_Cash_Out</TableCell>
                                                <TableCell className='label border'>RPayIn_PKR</TableCell>
                                                {show1 && <>
                                                    <TableCell className='label border' style={{ width: '18.28%' }}>TVPI_Oth_Curr</TableCell>
                                                    <TableCell className='label border' style={{ width: '18.28%' }}>TPI_Curr</TableCell>
                                                    <TableCell className='label border' style={{ width: '18.28%' }}>RPI_Curr</TableCell>
                                                    </>}
                                                <TableCell className='label border'>Status</TableCell>
                                                
                                                <TableCell align='left' className='edw_label border' colSpan={1}> Actions</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {filteredTotalPaymentIn.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry, index) => (
                                                <TableRow key={entry._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'} onClick={() => handleRowClick(entry.supplierName)}>

                                                    <TableCell className='border data_td text-center'>{index + 1}</TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.createdAt}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.supplierName}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.total_Azad_Visa_Price_In_PKR}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        <i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i> {entry.total_Payment_In}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        <i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{entry.total_Cash_Out}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.total_Azad_Visa_Price_In_PKR - entry.total_Payment_In + entry.total_Cash_Out}
                                                    </TableCell>
                                                   {show1 && <>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.total_Azad_Visa_Price_In_Curr}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.total_Payment_In_Curr}
                                                    </TableCell>
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.total_Azad_Visa_Price_In_Curr - entry.total_Payment_In_Curr}
                                                    </TableCell>
                                                   </>}
                                                    <TableCell className='border data_td text-center'>
                                                        {entry.status}
                                                    </TableCell>
                                                    <TableCell className='border data_td p-1 '>
                                                        <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                            {/* <button onClick={() => handleTotalPaymentEditClick(entry, outerIndex)} className='btn edit_btn'>Edit</button> */}
                                                            <button className='btn bg-danger text-white btn-sm' onClick={() => deleteTotalpayment(entry)} disabled={loading5}><i className="fa-solid fa-trash-can"></i></button>
                                                        </div>
                                                       
                                                    </TableCell>


                                                </TableRow>
                                            ))}
                                              <TableRow>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
    <TableCell className='border data_td text-center bg-info text-white'>
        {/* Calculate the total sum of payment_In */}
        {filteredTotalPaymentIn.reduce((total, paymentItem) => {
            const paymentIn = parseFloat(paymentItem.total_Azad_Visa_Price_In_PKR);
            return isNaN(paymentIn) ? total : total + paymentIn;
        }, 0)}
    </TableCell>
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
            const cashOut = parseFloat(paymentItem.total_Cash_Out);
            return isNaN(cashOut) ? total : total + cashOut;
        }, 0)}
    </TableCell>
    <TableCell className='border data_td text-center bg-warning text-white'>
    {/* Calculate the total sum of cash_Out */}
    {filteredTotalPaymentIn.reduce((total, paymentItem) => {
        const paymentIn = parseFloat(paymentItem.total_Azad_Visa_Price_In_PKR);
        const cashOut = parseFloat(paymentItem.total_Cash_Out);
        const paymentOut = parseFloat(paymentItem.total_Payment_In);
        
        // Add the difference between total_Azad_Visa_Price_In_PKR and total_Payment_In, then add total_Cash_Out
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
                                <h4 className='d-inline '>Azad Agent Name: <span>{selectedSupplier}</span></h4>

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
                                        {[...new Set(azadAgent_Payments_In
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
                                        {[...new Set(azadAgent_Payments_In
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
                        <h6>Payment In Details</h6>
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
                                        <TableCell className='label border'>Payment_In</TableCell>
                                        <TableCell className='label border'>Cash_Out</TableCell>
                                        <TableCell className='label border'>Invoice</TableCell>
                                        {show2 &&  <>
                                        <TableCell className='label border' style={{ width: '18.28%' }}>Payment_In_Curr</TableCell>
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
                                    {filteredIndividualPayments
                                        .map((filteredData) => (
                                            // Map through the payment array
                                            <>
                                                {filteredData.payment && filteredData.payment?.map((paymentItem, index) => (
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
                                                                    <input type='text' value={editedEntry.cash_Out} onChange={(e) => handleInputChange(e, 'cash_Out')} />
                                                                </TableCell>
                                                                <TableCell className='border data_td p-1 '>
                                                                    <input type='text' value={editedEntry.invoice} readonly />
                                                                </TableCell>
                                                                {show2 && <>
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
                                                                <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.cash_Out}</TableCell>
                                                                <TableCell className='border data_td text-center'>{paymentItem?.invoice}</TableCell>
                                                                {show2 && <>
                                                                <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_In_Curr}</TableCell>
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

                    <div className="col-md-12 filters">
                        <Paper className='py-1 mb-2 px-3'>
                            <div className="row">
                            <div className="col-auto px-1">
                            <label htmlFor="">Khata:</label>
                            <select value={status1} onChange={(e) => setStatus1(e.target.value)} className='m-0 p-1'>
                                <option value="" >All</option>
                                <option value="Open" >Open</option>
                                <option value="Closed" >Closed</option>
                            </select>
                            </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Entry Date:</label>
                                    <select value={date3} onChange={(e) => setDate3(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(azadAgent_Payments_In
                                            .filter(data => data.supplierName === selectedSupplier)
                                            .flatMap(data => data.persons)
                                            .map(data => data.entry_Date)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Name:</label>
                                    <select value={name} onChange={(e) => setName(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(azadAgent_Payments_In
                                            .filter(data => data.supplierName === selectedSupplier)
                                            .flatMap(data => data.persons)
                                            .map(data => data.name)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">PP#:</label>
                                    <select value={pp_No} onChange={(e) => setPP_NO(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(azadAgent_Payments_In
                                            .filter(data => data.supplierName === selectedSupplier)
                                            .flatMap(data => data.persons)
                                            .map(data => data.pp_No)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Entry Mode:</label>
                                    <select value={entry_Mode} onChange={(e) => setEntry_Mode(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(azadAgent_Payments_In
                                            .filter(data => data.supplierName === selectedSupplier)
                                            .flatMap(data => data.persons)
                                            .map(data => data.entry_Mode)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Comapny:</label>
                                    <select value={company} onChange={(e) => setCompany(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(azadAgent_Payments_In
                                            .filter(data => data.supplierName === selectedSupplier)
                                            .flatMap(data => data.persons)
                                            .map(data => data.company)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Country:</label>
                                    <select value={country} onChange={(e) => setCountry(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(azadAgent_Payments_In
                                            .filter(data => data.supplierName === selectedSupplier)
                                            .flatMap(data => data.persons)
                                            .map(data => data.country)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Trade:</label>
                                    <select value={trade} onChange={(e) => setTrade(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(azadAgent_Payments_In
                                            .filter(data => data.supplierName === selectedSupplier)
                                            .flatMap(data => data.persons)
                                            .map(data => data.trade)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Final Status:</label>
                                    <select value={final_Status} onChange={(e) => setFinal_Status(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(azadAgent_Payments_In
                                            .filter(data => data.supplierName === selectedSupplier)
                                            .flatMap(data => data.persons)
                                            .map(data => data.final_Status)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto px-1">
                                    <label htmlFor="">Flight Date:</label>
                                    <select value={flight_Date} onChange={(e) => setFlight_Date(e.target.value)} className='m-0 p-1'>
                                        <option value="">All</option>
                                        {[...new Set(azadAgent_Payments_In
                                            .filter(data => data.supplierName === selectedSupplier)
                                            .flatMap(data => data.persons)
                                            .map(data => data.flight_Date)
                                        )].map(dateValue => (
                                            <option value={dateValue} key={dateValue}>{dateValue}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </Paper>
                    </div>
                    {/* Display Table for payment array */}
                    <div className="col-md-12 detail_table my-2">
                    <div className="d-flex justify-content-between">
              <div className="left d-flex">
                <h6>Persons Details</h6>
              </div>
              <div className="right">
              <button className='btn btn-sm m-1 bg-info text-white shadow' onClick={() => setShow(!show)}>{show === false ? "Show" : "Hide"}</button>
                <button className='btn excel_btn m-1 btn-sm' onClick={downloadPersons}>Download </button>
                <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printPersonsTable}>Print </button>
              </div>
            </div>
                        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead className="thead">
                                    <TableRow>
                                        <TableCell className='label border'>SN</TableCell>
                                        <TableCell className='label border'>Date</TableCell>
                                        <TableCell className='label border'>Name</TableCell>
                                        <TableCell className='label border'>PP#</TableCell>
                                        <TableCell className='label border'>Entry_Mode</TableCell>
                                        <TableCell className='label border'>Company</TableCell>
                                        <TableCell className='label border'>Trade</TableCell>
                                        <TableCell className='label border'>Country</TableCell>
                                        <TableCell className='label border'>Final_Status</TableCell>
                                        <TableCell className='label border'>Flight_Date</TableCell>
                                        <TableCell className='label border'>AVPI_PKR</TableCell>
                                        {show === true && <TableCell className='label border' style={{ width: '18.28%' }}>VPI_Oth_Curr</TableCell>}
                                        <TableCell className='label border'>Status</TableCell>
                                        <TableCell className='label border'>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPersons.map((filteredData) => (
                                        <>
                                            {filteredData.persons.map((person, index) => (

                                                <TableRow key={person?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                                                    {editMode2 && editedRowIndex2 === index ? (
                                                        <>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='text' value={index + 1} readonly />
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='date' value={editedEntry2.entry_Date} onChange={(e) => handlePersonInputChange(e, 'entry_Date')} />
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='text' value={editedEntry2.name} readonly />
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='text' value={editedEntry2.pp_No} readonly />
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <select value={editedEntry2.entry_Mode} onChange={(e) => handlePersonInputChange(e, 'entry_Mode')} required>
                                                                    <option value="">Choose</option>
                                                                    {entryMode && entryMode.map((data) => (
                                                                        <option key={data._id} value={data.entry_Mode}>{data.entry_Mode}</option>
                                                                    ))}
                                                                </select>
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <select value={editedEntry2.company} onChange={(e) => handlePersonInputChange(e, 'company')} required>
                                                                    <option value="">Choose</option>
                                                                    {companies && companies.map((data) => (
                                                                        <option key={data._id} value={data.company}>{data.company}</option>
                                                                    ))}
                                                                </select>
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <select value={editedEntry2.trade} onChange={(e) => handlePersonInputChange(e, 'trade')} required>
                                                                    <option value="">Choose</option>
                                                                    {trades && trades.map((data) => (
                                                                        <option key={data._id} value={data.trade}>{data.trade}</option>
                                                                    ))}
                                                                </select>
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <select value={editedEntry2.country} onChange={(e) => handlePersonInputChange(e, 'country')} required>
                                                                    <option value="">Choose</option>
                                                                    {countries && countries.map((data) => (
                                                                        <option key={data._id} value={data.country}>{data.country}</option>
                                                                    ))}
                                                                </select>
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <select value={editedEntry2.final_Status} onChange={(e) => handlePersonInputChange(e, 'final_Status')} required>
                                                                    <option value="">Choose</option>
                                                                    {finalStatus && finalStatus.map((data) => (
                                                                        <option key={data._id} value={data.final_Status}>{data.final_Status}</option>
                                                                    ))}
                                                                </select>
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='date' value={editedEntry2.flight_Date} onChange={(e) => handlePersonInputChange(e, 'flight_Date')} />
                                                            </TableCell>
                                                            <TableCell className='border data_td p-1 '>
                                                                <input type='number' value={editedEntry2.azad_Visa_Price_In_PKR} readonly />
                                                            </TableCell>
                                                            {show && <TableCell className='border data_td p-1 '>
                                                                <input type='number' value={editedEntry2.azad_Visa_Price_In_Curr} readonly />
                                                            </TableCell>}
                                                            <TableCell className='border data_td p-1 '>
                                                                <select name="" id="" value={editedEntry2.status} onChange={(e) => handlePersonInputChange(e, 'status')}>
                                                                    <option value="Open">Open</option>
                                                                    <option value="Closed">Closed</option>
                                                                </select>
                                                            
                                                            </TableCell>

                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell className='border data_td text-center'>{index + 1}</TableCell>
                                                            <TableCell className='border data_td text-center'>{person?.entry_Date}</TableCell>
                                                            <TableCell className='border data_td text-center'>{person?.name}</TableCell>
                                                            <TableCell className='border data_td text-center'>{person?.pp_No}</TableCell>
                                                            <TableCell className='border data_td text-center'>{person?.entry_Mode}</TableCell>
                                                            <TableCell className='border data_td text-center'>{person?.company}</TableCell>
                                                            <TableCell className='border data_td text-center'>{person?.trade}</TableCell>
                                                            <TableCell className='border data_td text-center'>{person?.country}</TableCell>
                                                            <TableCell className='border data_td text-center'>{person?.final_Status}</TableCell>
                                                            <TableCell className='border data_td text-center'>{person?.flight_Date}</TableCell>
                                                            <TableCell className='border data_td text-center'>{person?.azad_Visa_Price_In_PKR}</TableCell>
                                                           {show &&  <TableCell className='border data_td text-center'>{person?.azad_Visa_Price_In_Curr}</TableCell>}
                                                            <TableCell className='border data_td text-center'>{person?.status}</TableCell>


                                                        </>
                                                    )}
                                                      <TableCell className='border data_td p-1 text-center'>
                            {editMode2 && editedRowIndex2 === index ? (
                              // Render Save button when in edit mode for the specific row
                              <>
                                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                  <button onClick={() => setEditMode2(!editMode2)} className='btn delete_btn btn-sm'><i className="fa-solid fa-xmark"></i></button>
                                  <button onClick={() => handleUpdatePerson()} className='btn save_btn btn-sm' disabled={loading4}><i className="fa-solid fa-check"></i></button>

                                </div>

                              </>

                            ) : (
                              
                              <>
                                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                  <button onClick={() => handlePersonEditClick(person, index)} className='btn edit_btn btn-sm'><i className="fa-solid fa-pen-to-square"></i></button>
                                  <button onClick={() => printPerson(person)} className='btn bg-success text-white btn-sm'><i className="fa-solid fa-print"></i></button>
                                  <button onClick={() => downloadPersonDetails(person)} className='btn bg-warning text-white btn-sm'><i className="fa-solid fa-download"></i></button>
                                  <button className='btn bg-danger text-white btn-sm' onClick={() => deletePerson(person)} disabled={loading2}><i className="fa-solid fa-trash-can"></i></button>
                                </div>

                              </>
                            )}
                          </TableCell>

                                                </TableRow>
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
                            <TableCell className='border data_td text-center bg-success text-white'>Total</TableCell>
                            <TableCell className='border data_td text-center bg-warning text-white'>
          {/* Calculate the total sum of payment_In */}
          {filteredPersons.reduce((total, filteredData) => {
            return total + filteredData.persons.reduce((sum, paymentItem) => {
              const paymentIn = parseFloat(paymentItem.azad_Visa_Price_In_PKR);
              return isNaN(paymentIn) ? sum : sum + paymentIn;
            }, 0);
          }, 0)}
        </TableCell>
      
                            
                          </TableRow>
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </>
            )}

        </>
    )
}
