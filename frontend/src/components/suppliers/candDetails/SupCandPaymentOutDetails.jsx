
import React, { useEffect, useState,useRef } from 'react'
import SupplierHook from '../../../hooks/supplierHooks/SupplierHook'
import { useSelector, useDispatch } from 'react-redux';
import { saveAs } from 'file-saver';
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
export default function SupCandPaymentOutDetails() {
  const [isLoading, setIsLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const [loading4, setLoading4] = useState(false)
  const [loading5, setLoading5] = useState(false)
  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
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

  const { getPaymentsOut } = SupplierHook()
  const { user } = useAuthContext()
  const apiUrl = process.env.REACT_APP_API_URL;


  const[details,setDetails]=useState()
  const handleDetails=(paymentDetails)=>{
    setDetails(paymentDetails)
  }

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
  const companies = useSelector((state) => state.setting.companies);
  const countries = useSelector((state) => state.setting.countries);
  const entryMode = useSelector((state) => state.setting.entryMode);
  const finalStatus = useSelector((state) => state.setting.finalStatus);
  const trades = useSelector((state) => state.setting.trades);

  const supp_Payments_Out = useSelector((state) => state.suppliers.supp_Payments_Out);

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
        const response = await fetch(`${apiUrl}/auth/suppliers/delete/cand_vise/payment_out`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ paymentId, supplierName: selectedSupplier})
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
       
        }
      }
      catch (error) {
        setNewMessage(toast.error('Server is not responding...'))
        setLoading1(false)
      }
    }

  }

  const deleteSinglePaymentIn = async (payment) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setLoading1(true)
      
      let paymentId = details._id
      let myPaymentId=payment._id
      try {
        const response = await fetch(`${apiUrl}/auth/suppliers/delete/cand_vise/single/payment_out`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ paymentId, supplierName: selectedSupplier,myPaymentId})
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
         
        }
      }
      catch (error) {
        setNewMessage(toast.error('Server is not responding...'))
        setLoading1(false)
      }
    }

  }


  const deletePerson = async (person) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setLoading2(true)

      let personId = person._id
      try {
        const response = await fetch(`${apiUrl}/auth/suppliers/delete/person/payment_out`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ personId, supplierName: selectedSupplier, visa_Price_Out_PKR: person.visa_Price_Out_PKR, visa_Price_Out_Curr: person.visa_Price_Out_Curr })
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


  //Editing for Supplier Person 
  const [editMode2, setEditMode2] = useState(false);
  const [editedEntry2, setEditedEntry2] = useState({});
  const [editedRowIndex2, setEditedRowIndex2] = useState(null);

  const handlePersonEditClick = (person, index) => {
    setEditMode2(!editMode2);
    setEditedEntry2(person);
    setEditedRowIndex2(index); // Set the index of the row being edited
  };


  const handlePersonInputChange = (e, field) => {
    setEditedEntry2({
      ...editedEntry2,
      [field]: e.target.value,
    });

  };


  const handleUpdatePerson = async () => {
    setLoading4(true)
    try {
      const response = await fetch(`${apiUrl}/auth/suppliers/payment_out/update/single/person`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ supplierName: selectedSupplier, personId: editedEntry2._id, name: editedEntry2.name, pp_No: editedEntry2.pp_No, contact: editedEntry2.contact, company: editedEntry2.company, country: editedEntry2.country, entry_Mode: editedEntry2.entry_Mode, final_Status: editedEntry2.final_Status, trade: editedEntry2.trade, flight_Date: editedEntry2.flight_Date,status: editedEntry2.status })
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading4(false)
      }
      if (response.ok) {
        fetchData()
        setNewMessage(toast.success(json.message));
        setLoading4(null)
        setEditMode2(!editMode2)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setLoading4(false)
    }
  }

  //updating single payment in
  const handleUpdate = async () => {
    setLoading3(true)
    let paymentId = details._id
    try {
      const response = await fetch(`${apiUrl}/auth/suppliers/update/cand_vise/single/payment_out`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ paymentId, supplierName: selectedSupplier, myPaymentId: editedEntry._id,new_Payment: editedEntry.new_Payment,new_Curr_Payment: editedEntry.new_Curr_Payment })
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

  //Editing for Supplier Total Payment in
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
      const response = await fetch(`${apiUrl}/auth/suppliers/update/all/payment_out`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ supplierName: editedEntry1.supplierName, total_Payment_Out: editedEntry1.total_Payment_Out, total_Cash_Out: editedEntry1.total_Cash_Out, total_Visa_Price_Out_Curr: editedEntry1.total_Payment_Out_Curr, open: editedEntry1.open, close: editedEntry1.close })
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
        const response = await fetch(`${apiUrl}/auth/suppliers/delete/all/payment_out`, {
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

  const [date1, setDate1] = useState('')
  const [supplier1, setSupplier1] = useState('')
  const [status, setStatus] = useState('')


  const filteredTotalPaymentIn = supp_Payments_Out.filter(payment => {
    return (
      payment.createdAt.toLowerCase().includes(date1.toLowerCase()) &&
      payment.supplierName.toLowerCase().includes(supplier1.toLowerCase()) &&
      payment.status.toLowerCase().includes(status.toLowerCase())
    )
  })


  // individual payments filters

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search1, setSearch1] = useState('')

  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')
  const filteredIndividualPayments = supp_Payments_Out
    .filter((data) => data.supplierName === selectedSupplier)
    .map((filteredData) => ({
      ...filteredData,
      payment: filteredData?.candPayments
        .filter((paymentItem) => {
          let isDateInRange = true
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
  const [search2, setSearch2] = useState('')

  const filteredPersons = supp_Payments_Out
    .filter((data) => data.supplierName === selectedSupplier)
    .map((filteredData) => ({
      ...filteredData,
      persons: filteredData.persons
        .filter((persons) =>
          persons.entry_Date?.toLowerCase().includes(date3.toLowerCase()) &&
          persons.name?.trim().toLowerCase().startsWith(name.trim().toLowerCase()) &&
          persons.pp_No?.toLowerCase().includes(pp_No.toLowerCase()) &&
          persons.entry_Mode?.toLowerCase().includes(entry_Mode.toLowerCase()) &&
          persons.company?.toLowerCase().includes(company.toLowerCase()) &&
          persons.country?.toLowerCase().includes(country.toLowerCase()) &&
          persons.trade?.toLowerCase().includes(trade.toLowerCase()) &&
          persons.final_Status?.toLowerCase().includes(final_Status.toLowerCase()) &&
          persons.flight_Date?.toLowerCase().includes(flight_Date.toLowerCase()) &&
          persons.status?.toLowerCase().includes(status1.toLowerCase()) &&
          (persons.name?.trim().toLowerCase().startsWith(search2.trim().toLowerCase()) ||
          persons.pp_No?.trim().toLowerCase().startsWith(search2.trim().toLowerCase()) ||
          persons.entry_Mode?.trim().toLowerCase().startsWith(search2.trim().toLowerCase()) ||
          persons.company?.trim().toLowerCase().startsWith(search2.trim().toLowerCase()) ||
          persons.country?.trim().toLowerCase().startsWith(search2.trim().toLowerCase()) ||
          persons.trade?.trim().toLowerCase().startsWith(search2.trim().toLowerCase()) ||
          persons.final_Status?.trim().toLowerCase().startsWith(search2.trim().toLowerCase()) ||
          persons.flight_Date?.trim().toLowerCase().startsWith(search2.trim().toLowerCase()) ||
          persons.status?.trim().toLowerCase().startsWith(search2.trim().toLowerCase()))
        )
    }))

  // Changing Status
  const [multipleIds, setMultipleIds] = useState([]);
  const handleEntryId = (id, isChecked) => {
    if (isChecked) {
    
      setMultipleIds((prevIds) => [...prevIds, id]);
    } else {
     
      setMultipleIds((prevIds) => prevIds.filter((entryId) => entryId !== id));
    }
   
  }
  const changeStatus = async (myStatus) => {
    if (window.confirm(`Are you sure you want to Change the Status of ${selectedSupplier}?`)) {
      setLoading5(true)
      let newStatus = myStatus

      try {
        const response = await fetch(`${apiUrl}/auth/suppliers/update/payment_out/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ supplierName: selectedSupplier, newStatus,multipleIds })
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



// Editing for single Payment In 
const [editMode3, setEditMode3] = useState(false);
const [editedEntry3, setEditedEntry3] = useState({});
const [editedRowIndex3, setEditedRowIndex3] = useState(null);

const handleEditClick3 = (paymentItem, index) => {
  setEditMode3(!editMode3);
  setEditedEntry3(paymentItem);
  setEditedRowIndex3(index); // Set the index of the row being edited
};


const handleInputChange3 = (e, field) => {
  setEditedEntry3({
    ...editedEntry3,
    [field]: e.target.value,
  });

};

const handleImageChange3 = (e, field) => {
  if (field === 'slip_Pic') {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedEntry3({
          ...editedEntry3,
          [field]: reader.result, // Use reader.result as the image data URL
        });
      };
      reader.readAsDataURL(file);
    }
  }
};

//updating payment in
const handleUpdatePayment = async () => {
setLoading3(true)
let paymentId = editedEntry3._id
try {
 const response = await fetch(`${apiUrl}/auth/suppliers/update/cand_vise/payment_out`, {
   method: 'PATCH',
   headers: {
     'Content-Type': 'application/json',
     "Authorization": `Bearer ${user.token}`,
   },
   body: JSON.stringify({ paymentId, supplierName: selectedSupplier, category: editedEntry3.category, payment_Via: editedEntry3.payment_Via, payment_Type: editedEntry3.payment_Type, slip_No: editedEntry3.slip_No, details: editedEntry3.details, payment_Out: editedEntry3.payment_Out, curr_Country: editedEntry3.payment_Out_Curr, curr_Amount: editedEntry3.curr_Amount, slip_Pic: editedEntry3.slip_Pic, date: editedEntry3.date })
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
   setEditMode3(!editMode3)
 }
}
catch (error) {
 setNewMessage(toast.error('Server is not responding...'))
 setLoading3(false)
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
      <h1 class="title">Suppliers Payment Out Details</h1>
    </div>
    <hr/>
    <table class='print-table'>
      <thead>
        <tr>
          <th>SN</th>
          <th>Suppliers</th>
          <th>TVPO PKR</th>
          <th>TPI PKR</th>
          <th>Total Cash Out</th>
          <th>RPI PKR</th>
          <th>TVPO Oth Curr</th>
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
          <td>${String(entry.total_Visa_Price_Out_PKR)}</td>
          <td>${String(entry.total_Payment_Out)}</td>
          <td>${String(entry.total_Cash_Out)}</td>
          <td>${String(entry.total_Visa_Price_Out_PKR - entry.total_Payment_Out + entry.total_Cash_Out)}</td>
          <td>${String(entry.total_Visa_Price_Out_Curr)}</td>
          <td>${String(entry.total_Payment_Out_Curr)}</td>
          <td>${String(entry.total_Visa_Price_Out_Curr - entry.total_Payment_Out_Curr)}</td>
          <td>${String(entry.status)}</td>           
        </tr>
      `).join('')}
      <tr>
        <td colspan="1"></td>
        <td>Total</td>
        <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Visa_Price_Out_PKR, 0))}</td>
        <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Payment_Out, 0))}</td>
        <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Cash_Out, 0))}</td>
        <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + (entry.total_Visa_Price_Out_PKR - entry.total_Payment_Out + entry.total_Cash_Out), 0))}</td>
        <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Visa_Price_Out_Curr, 0))}</td>
        <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + entry.total_Payment_Out_Curr, 0))}</td>
        <td>${String(filteredTotalPaymentIn.reduce((total, entry) => total + (entry.total_Visa_Price_Out_Curr - entry.total_Payment_Out_Curr), 0))}</td>
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
          <title>Suppliers Payment Out Details</title>
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
  // Convert JSX to HTML string
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const formattedDate = formatDate(new Date());

  const printContentString = `
  <div class="print-header">
      <p class="invoice">Supplier: ${selectedSupplier}</p>
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Supplier Payment Invoices</h1>
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
      <th>Invoice</th>
      <th>Candidates</th>
      <th>Total Visa Price In PKR</th>
      <th>Remaining PKR</th>
      <th>CUR Amount</th>
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
          <td>${String(paymentItem?.invoice)}</td>
          <td>${String(paymentItem?.payments.length)}</td>
          <td>${String(paymentItem?.payments.reduce((total, payment) => total + payment.visa_Amount_PKR, 0))}</td>
          <td>${String(paymentItem?.payments.reduce((total, payment) => total + payment.new_Remain_PKR, 0))}</td>
          <td>${String(paymentItem?.curr_Amount)}</td>
          <td>${String(paymentItem?.payment_Out_Curr)}</td>

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
  <td></td>
  <td></td>
  <td>
    ${
      String(
        filteredIndividualPayments.reduce(
          (total, entry) =>
            total +
            entry.payment.reduce(
              (acc, paymentItem) =>
                acc +
                paymentItem.payments.reduce(
                  (subTotal, payment) => subTotal + payment.visa_Amount_PKR,
                  0
                ),
              0
            ),
          0
        )
      )
    }
  </td>
  <td>
    ${
      String(
        filteredIndividualPayments.reduce(
          (total, entry) =>
            total +
            entry.payment.reduce(
              (acc, paymentItem) =>
                acc +
                paymentItem.payments.reduce(
                  (subTotal, payment) => subTotal + payment.new_Remain_PKR,
                  0
                ),
              0
            ),
          0
        )
      )
    }
    </td>
  <td>${String(filteredIndividualPayments.reduce((total, entry) => total + entry.payment.reduce((acc, paymentItem) => acc + paymentItem.curr_Amount, 0), 0))}</td>

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
    <p class="invoice">Supplier: ${selectedSupplier}</p>
      <h1 class="title">ROZGAR TTTC</h1>
      <p class="date">Date: ${formattedDate}</p>
    </div>
    <div class="print-header">
      <h1 class="title">Supplier Persons Details</h1>
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
          <th>Image</th>
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
              <td>${String(person?.visa_Price_Out_PKR)}</td>
              <td>${String(person?.visa_Price_Out_Curr)}</td>
              <td>${String(person?.total_In)}</td>
              <td>${String(person?.remaining_Price)}</td>
              <td>${String(person?.status)}</td>
              <td>
              ${person.picture ? `<img src="${person.picture}" alt="Person Picture" />` : "No Picture"}
            </td>
            </tr>
          `).join('')
        ).join('')}
        <tr>
          <td colspan="9"></td>
          <td>Total</td>
          <td>${String(filteredPersons.reduce((total, entry) => total + entry.persons.reduce((acc, paymentItem) => acc + paymentItem.visa_Price_Out_PKR, 0), 0))}</td>
          <td>${String(filteredPersons.reduce((total, entry) => total + entry.persons.reduce((acc, paymentItem) => acc + paymentItem.visa_Price_Out_Curr, 0), 0))}</td>
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
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formattedDate = formatDate(new Date());
  const paymentDetailsString = paymentItem.payments.map(payment => `
    <tr>
      <td>${String(payment.cand_Name)}</td>
      <td>${String(payment?.pp_No,'')}</td>
      <td>${String(payment?.entry_Mode,'')}</td>
      <td>${String(payment?.company,'')}</td>
      <td>${String(payment?.trade,'')}</td>
      <td>${String(payment?.country,'')}</td>
      <td>${String(payment?.final_Status,'')}</td>
      <td>${String(payment?.flight_Date,'')}</td>
      <td>${String(payment?.visa_Amount_PKR)}</td>
      <td>${String(payment?.past_Paid_PKR)}</td>
      <td>${String(payment?.past_Remain_PKR)}</td>
      <td>${String(payment?.new_Payment)}</td>
      <td>${String(payment?.new_Remain_PKR)}</td>
      <td>${String(payment?.curr_Amount,0)}</td>
      <td>${String(payment?.curr_Rate,0)}</td>
    </tr>
  `).join('');

  const printContentString = `
    <div class="print-header">
      <p class="invoice">Invoice No: ${paymentItem.invoice}</p>
      <h1 class="title">ROZGAR TTTC</h1>
      <p class="date">Date: ${formattedDate}</p>
    </div>
    <div class="print-header">
      <h1 class="title">Supplier Payment Invoice</h1>
    </div>
    <hr/>
    <table class='print-table'>
      <thead>
        <tr>
          <th>Date</th>
          <th>Supplier Name</th>
          <th>Category</th>
          <th>Payment Via</th>
          <th>Payment Type</th>
          <th>Slip No</th>
          <th>Details</th>
          <th>Payment In</th>
          <th>Invoice</th>
          <th>Candidates</th>
          <th>Total Visa Price In PKR</th>
          <th>Remaining PKR</th>
          <th>CUR Amount</th>
          <th>Payment In Curr</th>
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
          <td>${String(paymentItem?.payment_Out)}</td>
          <td>${String(paymentItem?.invoice)}</td>
          <td>${String(paymentItem?.payments.length)}</td>
          <td>${String(paymentItem?.payments.reduce((total, payment) => total + payment.visa_Amount_PKR, 0))}</td>
          <td>${String(paymentItem?.payments.reduce((total, payment) => total + payment.new_Remain_PKR, 0))}</td>
          <td>${String(paymentItem?.curr_Amount)}</td>
          <td>${String(paymentItem?.payment_Out_Curr)}</td>
        </tr>
      </tbody>
    </table>
    <hr/>
    <h2 class="subtitle">Candidate Vise Details</h2>
    <table class='print-table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>PP#</th>
          <th>Entry Mode</th>
          <th>Company</th>
          <th>Trade</th>
          <th>Country</th>
          <th>Final Status</th>
          <th>Flight Date</th>
          <th>Visa Amount (PKR)</th>
          <th>Past Paid (PKR)</th>
          <th>Past Remaining (PKR)</th>
          <th>New Payment In (PKR)</th>
          <th>New Remaining (PKR)</th>
          <th>Currency Amount</th>
          <th>Currency Rate</th>
        </tr>
      </thead>
      <tbody>
        ${paymentDetailsString}
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
        margin-bottom: 20px;
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
      .subtitle {
        margin: 20px 0;
        text-align: center;
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
          <title>${selectedSupplier} Payment Out Details</title>
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


const downloadExcel = () => {
  const data = [];
  // Iterate over entries and push all fields
  filteredTotalPaymentIn.forEach((payments, index) => {
    const rowData = {
      SN: index + 1,
      Suppliers: payments.supplierName,
      Total_Visa_Price_Out_PKR: payments.total_Visa_Price_Out_PKR,
      Total_Payment_In: payments.total_Payment_Out,
      Total_Cash_Out: payments.total_Cash_Out,
      Remaining_PKR: payments.total_Visa_Price_Out_PKR - payments.total_Payment_Out + payments.total_Cash_Out,
      Total_Visa_Price_Out_Curr: payments.total_Visa_Price_Out_Curr,
      Total_Payment_Out_Curr: payments.total_Payment_Out_Curr,
      Remaining_Curr: payments.total_Visa_Price_Out_Curr - payments.total_Payment_Out_Curr,
      Status: payments.status
    }

    data.push(rowData);
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'Suppliers Payments Details.xlsx');
}

const downloadIndividualPayments = () => {
  const data = [];
  // Flatten the array of objects to get an array of individual payments
  const individualPayments = filteredIndividualPayments.flatMap(payment => payment.candPayments);

  // Iterate over individual payments and push all fields
  individualPayments.forEach((payment, index) => {
    const rowData = {
      SN: index + 1,
      Date: payment.date,
      Category: payment.category,
      payment_Via: payment.payment_Via,
      payment_Type: payment.payment_Type,
      slip_No: payment.slip_No,
      details: payment.details,
      payment_Out: payment.payment_Out,
      Invoice: payment.invoice,
      Candidates: payment.payments.length,
      Payment_In_Curr: payment.payment_Out_Curr,
      Curr_Amount: payment.curr_Amount
    };

    data.push(rowData);
  })

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${selectedSupplier} Payment Details.xlsx`);
}


const downloadPaymentInvoice = (payment) => {
  const data = [];
    const rowData = {
      Date: payment.date,
      Category: payment.category,
      Payment_Via: payment.payment_Via,
      Payment_Type: payment.payment_Type,
      Slip_No: payment.slip_No,
      Details: payment.details,
      Payment_Out: payment.payment_Out,
      Invoice: payment.invoice,
      Candidates: payment.payments.length,
      Payment_In_Curr: payment.payment_Out_Curr,
      Curr_Amount: payment.curr_Amount,
    }

    data.push(rowData);

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${selectedSupplier} Payment Details.xlsx`);
}


const downloadPersons = () => {
  const data = [];
  // Flatten the array of objects to get an array of individual payments
  const individualPayments = filteredPersons.flatMap(payment => payment.persons);

  // Iterate over individual payments and push all fields
  individualPayments.forEach((payment, index) => {
    const rowData = {
      SN: index + 1,
      Entry_Date: payment.entry_Date,
      Name: payment.name,
      PP_No: payment.pp_No,
      Entry_Mode: payment.entry_Mode,
      Company: payment.company,
      Trade: payment.trade,
      Country: payment.country,
      Final_Status: payment.final_Status,
      Flight_Date: payment.flight_Date,
      Visa_Price_Out_PKR: payment.visa_Price_Out_PKR,
      Total_In: payment.total_In,
      Total_Cash_Out: payment.cash_Out,
      Remaining_PKR: payment.visa_Price_Out_PKR - payment.total_In + payment.cash_Out,
      Visa_Price_Out_Curr: payment.visa_Price_Out_Curr,
      Remaining_Curr: payment.remaining_Curr,
      Status: payment.status
    };

    data.push(rowData);
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${selectedSupplier} Persons Details.xlsx`);
}

const downloadCombinedPayments = () => {
  const combinedData = [];
  const anotherData = []

  const individualPayments = filteredIndividualPayments.flatMap(payment => payment.candPayments);

  // Iterate over individual payments and push all fields
  individualPayments.forEach((payment, index) => {
    const rowData = {
      SN: index + 1,
      Date: payment.date,
      Category: payment.category,
      payment_Via: payment.payment_Via,
      payment_Type: payment.payment_Type,
      slip_No: payment.slip_No,
      details: payment.details,
      payment_Out: payment.payment_Out,
      Invoice: payment.invoice,
      Candidates: payment.payments.length,
      Payment_Out_Curr: payment.payment_Out_Curr,
      Curr_Amount: payment.curr_Amount,
      Curr_Rate: payment.curr_Rate
    };
    combinedData.push(rowData);
  })
  const individualPerons = filteredPersons.flatMap(payment => payment.persons);

  // Iterate over individual payments and push all fields
  individualPerons.forEach((payment, index) => {
    const rowData = {
      SN: index + 1,
      Entry_Date: payment.entry_Date,
      Name: payment.name,
      PP_No: payment.pp_No,
      Entry_Mode: payment.entry_Mode,
      Company: payment.company,
      Trade: payment.trade,
      Country: payment.country,
      Final_Status: payment.final_Status,
      Flight_Date: payment.flight_Date,
      Visa_Price_Out_PKR: payment.visa_Price_Out_PKR,
      Total_In: payment.total_In,
      Total_Cash_Out: payment.cash_Out,
      Remaining_PKR: payment.visa_Price_Out_PKR - payment.total_In + payment.cash_Out,
      Visa_Price_Out_Curr: payment.visa_Price_Out_Curr,
      Remaining_Curr: payment.remaining_Curr,
      Status: payment.status
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
    <p class="invoice">Supplier: ${selectedSupplier}</p>
      <h1 class="title">ROZGAR TTTC</h1>
      <p class="date">Date: ${formattedDate}</p>
    </div>
    <div class="print-header">
      <h1 class="title">Supplier Person Details</h1>
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
          <th>Image</th>
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
          <td>${String(person?.visa_Price_Out_PKR)}</td>
          <td>${String(person?.visa_Price_Out_Curr)}</td>
          <td>${String(person?.total_In)}</td>
          <td>${String(person?.remaining_Price)}</td>
          <td>${String(person?.status)}</td>
          <td>
          ${person.picture ? `<img src="${person.picture}" alt="Person Picture" />` : "No Picture"}
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

const downloadPersonDetails = (payment) => {
  const data = []
    const rowData = {
      Supplier:selectedSupplier,
      Entry_Date: payment.entry_Date,
      Name: payment.name,
      PP_No: payment.pp_No,
      Entry_Mode: payment.entry_Mode,
      Company: payment.company,
      Trade: payment.trade,
      Country: payment.country,
      Final_Status: payment.final_Status,
      Flight_Date: payment.flight_Date,
      Visa_Price_Out_PKR: payment.visa_Price_Out_PKR,
      Total_In: payment.total_In,
      Total_Cash_Out: payment.cash_Out,
      Remaining_PKR: payment.visa_Price_Out_PKR - payment.total_In + payment.cash_Out,
      Visa_Price_Out_Curr: payment.visa_Price_Out_Curr,
      Remaining_Curr: payment.remaining_Curr,
      Status: payment.status
    };

  data.push(rowData);
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${selectedSupplier} Persons Details.xlsx`);
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
                <h4>Cand-Vise PaymentOut Details</h4>
              </div>
              <div className="right d-flex">
                {supp_Payments_Out.length > 0 &&
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
                    {[...new Set(supp_Payments_Out.map(data => data.createdAt))].map(dateValue => (
                      <option value={dateValue} key={dateValue}>{dateValue}</option>
                    ))}
                  </select>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Suppliers:</label>
                  <select value={supplier1} onChange={(e) => setSupplier1(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {supp_Payments_Out && supp_Payments_Out.map((data) => (
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
                        <TableCell className='label border' style={{ width: '18.28%' }}>SN</TableCell>
                        <TableCell className='label border' style={{ width: '18.28%' }}>Date</TableCell>
                        <TableCell className='label border' style={{ width: '18.28%' }}>Suppliers</TableCell>
                        <TableCell className='label border' style={{ width: '18.28%' }}>TVPI_PKR</TableCell>
                        <TableCell className='label border' style={{ width: '18.28%' }}>TPI_PKR</TableCell>
                        <TableCell className='label border' style={{ width: '18.28%' }}>Total_Cash_Out</TableCell>
                        <TableCell className='label border' style={{ width: '18.28%' }}>RPI_PKR</TableCell>
                        {show1 && <>
                          <TableCell className='label border' style={{ width: '18.28%' }}>TVPI_Oth_Curr</TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>TPI_Curr</TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>RPI_Curr</TableCell>
                        </>}
                        <TableCell className='label border' style={{ width: '18.28%' }}>Status</TableCell>
                        <TableCell className='label border ' style={{ width: '18.28%' }}>Opening</TableCell>
                        <TableCell className='label border ' style={{ width: '18.28%' }}>Closing</TableCell>
                        {/* <TableCell align='left' className='edw_label border' style={{ width: '18.28%' }} colSpan={1}>
                          Actions
                        </TableCell> */}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredTotalPaymentIn
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry, outerIndex) => (
                          // Map through the payment array
                          <React.Fragment key={outerIndex}>

                            <TableRow key={entry?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                              {editMode1 && editedRowIndex1 === outerIndex ? (
                                // Edit Mode
                                <>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='text' value={outerIndex + 1} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='date' value={editedEntry1.createdAt} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='text' value={editedEntry1.supplierName} readonly />
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
                                    <input type='number' value={editedEntry1.total_Visa_Price_Out_PKR - editedEntry1.total_Payment_Out + editedEntry1.total_Cash_Out} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry1.total_Visa_Price_Out_Curr} onChange={(e) => handleTotalPaymentInputChange(e, 'total_Visa_Price_Out_Curr')} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry1.total_Payment_Out_Curr} onChange={(e) => handleTotalPaymentInputChange(e, 'total_Payment_Out_Curr')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry1.total_Visa_Price_Out_Curr - editedEntry1.total_Payment_Out_Curr} onChange={(e) => handleTotalPaymentInputChange(e, 'remaining_Curr')} readonly />
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
                                  <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{outerIndex + 1}</TableCell>
                                  <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                    {entry.createdAt}
                                  </TableCell>
                                  <TableCell className='border data_td text-center' style={{ width: '18.28%' }} onClick={() => handleRowClick(entry.supplierName)}>
                                    {entry.supplierName}
                                  </TableCell>
                                  <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                    {entry.total_Visa_Price_Out_PKR}
                                  </TableCell>

                                  <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                    <i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{entry.total_Payment_Out}
                                  </TableCell>
                                  <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                    <i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{entry.total_Cash_Out}
                                  </TableCell>
                                  <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                    {entry.total_Visa_Price_Out_PKR - entry.total_Payment_Out + entry.total_Cash_Out}
                                  </TableCell>
                                  {show1 && <>
                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                      {entry.total_Visa_Price_Out_Curr}
                                    </TableCell>
                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                      {entry.total_Payment_Out_Curr}
                                    </TableCell>
                                    <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                      {entry.total_Visa_Price_Out_Curr - entry.total_Payment_Out_Curr}
                                    </TableCell>
                                  </>}
                                  <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                    <span>{entry.status}</span>
                                  </TableCell>
                                  <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                    <span>{entry.opening}</span>
                                  </TableCell>
                                  <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>
                                    <span>{entry.closing}</span>
                                  </TableCell>
                                  {/* ... Other cells in non-edit mode */}
                                  {/* <TableCell className='border data_td p-1 text-center'>
                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                      <button className='btn bg-danger text-white btn-sm' onClick={() => deleteTotalpayment(entry)} disabled={loading5}><i className="fa-solid fa-trash-can"></i></button>
                                    </div>
                                  </TableCell> */}
                                </>
                              )}
                            </TableRow>

                          </React.Fragment>
                        ))}
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                        <TableCell className='border data_td text-center bg-info text-white'>
                          {/* Calculate the total sum of payment_Out */}
                          {filteredTotalPaymentIn.reduce((total, paymentItem) => {
                            const paymentIn = parseFloat(paymentItem.total_Visa_Price_Out_PKR);
                            return isNaN(paymentIn) ? total : total + paymentIn;
                          }, 0)}
                        </TableCell>
                        <TableCell className='border data_td text-center bg-success text-white'>
                          {/* Calculate the total sum of cash_Out */}
                          {filteredTotalPaymentIn.reduce((total, paymentItem) => {
                            const cashOut = parseFloat(paymentItem.total_Payment_Out);
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
         {!details &&
              <div className="dropdown d-inline ">
                <button className="btn btn-secondary dropdown-toggle m-1 btn-sm" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  {loading5 ? "Updating" : "Change Status"}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li ><button className="dropdown-item"  data-bs-toggle="modal" data-bs-target="#exampleModal" >Khata Close</button></li>
                  </ul>
              </div>
         }
              <button className='btn btn-sm m-1 bg-info text-white shadow' onClick={() => setShow2(!show2)}>{show2 === false ? "Show" : "Hide"}</button>
              {!details && <>
              <button className='btn excel_btn m-1 btn-sm' onClick={downloadCombinedPayments}>Download All</button>
              <button className='btn excel_btn m-1 btn-sm' onClick={downloadIndividualPayments}>Download</button>
              <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printPaymentsTable}>Print </button>
              {selectedSupplier && <button className='btn detail_btn btn-sm' onClick={handleOption}><i className="fas fa-times"></i></button>}
              </>}
              {details && <button className='btn detail_btn btn-sm' onClick={()=>setDetails('')}><i className="fas fa-times"></i></button>}


            </div>
             
            </div>
          </div>


          {/* All Details */}
         {!details &&
         <>
          <div className="col-md-12 filters">
            <Paper className='py-1 mb-2 px-3'>
              <div className="row">
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
                    {[...new Set(supp_Payments_Out
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
                    {[...new Set(supp_Payments_Out
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
                    <TableCell className='label border' style={{ width: '18.28%' }}>SN</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Date</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Category</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Via</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Type</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Slip_No</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Details</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Out</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Candidates</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Total_Visa_Price_PKR</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Total_Remaining_Price_PKR</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Invoice</TableCell>
                    {show2 && <>
                      <TableCell className='label border' style={{ width: '18.28%' }}>Payment_In_Curr</TableCell>
                      <TableCell className='label border' style={{ width: '18.28%' }}>CUR_Amount</TableCell>
                    </>}
                    <TableCell className='label border' style={{ width: '18.28%' }}>Slip_Pic</TableCell>
                    <TableCell align='left' className='edw_label border' style={{ width: '18.28%' }} colSpan={1}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIndividualPayments.map((filteredData) => (
                    <>
                      {filteredData.payment.slice(0,rowsValue ? rowsValue : undefined).map((paymentItem, index) => (
                        <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                          {editMode3 && editedRowIndex3 === index ?(
                            <>
                            <TableCell className='border data_td p-1 '>
                                <input type='text' value={index + 1} readonly />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='date' value={editedEntry3.date} onChange={(e) => handleInputChange3(e, 'date')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <select value={editedEntry3.category} onChange={(e) => handleInputChange3(e, 'category')} required>
                                  <option value="">Choose</option>
                                  {categories && categories.map((data) => (
                                    <option key={data._id} value={data.category}>{data.category}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <select value={editedEntry3.payment_Via} onChange={(e) => handleInputChange3(e, 'payment_Via')} required>
                                  <option value="">Choose</option>
                                  {paymentVia && paymentVia.map((data) => (
                                    <option key={data._id} value={data.payment_Via}>{data.payment_Via}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <select value={editedEntry3.payment_Type} onChange={(e) => handleInputChange3(e, 'payment_Type')} required>
                                  <option value="">Choose</option>
                                  {paymentType && paymentType.map((data) => (
                                    <option key={data._id} value={data.payment_Type}>{data.payment_Type}</option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry3.slip_No} onChange={(e) => handleInputChange3(e, 'slip_No')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry3.details} onChange={(e) => handleInputChange3(e, 'details')} />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry3.payment_Out} disabled />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry3.payments.length} disabled />
                              </TableCell>
                              
                              <TableCell className='border data_td p-1 '>
                                <input type='text' readonly disabled/>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' readonly disabled/>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry3.invoice} readonly disabled/>
                              </TableCell>
                              {show2 && <>
                                <TableCell className='border data_td p-1 '>
                                  <select required value={editedEntry3.payment_Out_Curr} onChange={(e) => handleInputChange3(e, 'payment_Out_Curr')}>
                                    <option className="my-1 py-2" value="">choose</option>
                                    {currencies && currencies.map((data) => (
                                      <option className="my-1 py-2" key={data._id} value={data.currency}>{data.currency}</option>
                                    ))}
                                  </select>
                                </TableCell>
                               
                                <TableCell className='border data_td p-1 '>
                                  <input type='number' value={editedEntry3.curr_Amount} onChange={(e) => handleInputChange3(e, 'curr_Amount')} />
                                </TableCell>
                              </>}
                              <TableCell className='border data_td p-1 '>
                                <input type='file' accept='image/*' onChange={(e) => handleImageChange3(e, 'slip_Pic')} />
                              </TableCell>
                              <TableCell>
                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                            <button onClick={() => setEditMode3(!editMode3)} className='btn delete_btn btn-sm'><i className="fa-solid fa-xmark"></i></button>
                                  <button onClick={() => handleUpdatePayment()} className='btn save_btn btn-sm' disabled={loading3}><i className="fa-solid fa-check"></i></button>

                                </div>
                            </TableCell>
</>
                          ):
                          <>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{index + 1}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.date}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.category}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_Via}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_Type}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.slip_No}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.details}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.payment_Out}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payments.length}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payments.reduce((total, payment) => total + payment.visa_Amount_PKR, 0)} </TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payments.reduce((total, payment) => total + payment.new_Remain_PKR, 0)} </TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.invoice}</TableCell>
                              {show2 && <>
                                <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_Out_Curr}</TableCell>
                                <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.curr_Amount}</TableCell>
                              </>}
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem.slip_Pic ? <a href={paymentItem.slip_Pic} target="_blank" rel="noopener noreferrer"> <img src={paymentItem.slip_Pic} alt='Images' className='rounded' /></a>  : "No Picture"}</TableCell>
                              <TableCell className='border data_td p-1 '>
                              <>
                              <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                  <button className='btn btn-info btn-sm' onClick={()=>handleDetails(paymentItem)}><i className="fas fa-eye"></i></button>
                                <button onClick={() => handleEditClick3(paymentItem, index)} className='btn edit_btn btn-sm'><i className="fas fa-edit"></i></button>
                                <button onClick={() => printPaymentInvoice(paymentItem)} className='btn bg-success text-white btn-sm'><i className="fa-solid fa-print"></i></button>
                                <button onClick={() => downloadPaymentInvoice(paymentItem)} className='btn bg-warning text-white btn-sm'><i className="fa-solid fa-download"></i></button>
                                  <button className='btn delete_btn btn-sm' onClick={() => deletePaymentIn(paymentItem)} disabled={loading1}><i className="fas fa-trash-alt"></i></button>
                                </div>
                               
                              </>
                          
                          </TableCell>
                          </>
                          }
                           
                          
                          
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
                      {/* Calculate the total sum of payment_Out */}
                      {filteredIndividualPayments.reduce((total, filteredData) => {
                        return total + filteredData.payment.slice(0,rowsValue ? rowsValue : undefined).reduce((sum, paymentItem) => {
                          const paymentIn = parseFloat(paymentItem.payment_Out);
                          return isNaN(paymentIn) ? sum : sum + paymentIn;
                        }, 0);
                      }, 0)}
                    </TableCell>
                    
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    {show2 && <>
                    <TableCell className='border data_td text-center bg-primary text-white'>
                      {/* Calculate the total sum of cash_Out */}
                      {filteredIndividualPayments.reduce((total, filteredData) => {
                        return total + filteredData.payment.slice(0,rowsValue ? rowsValue : undefined).reduce((sum, paymentItem) => {
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
                  <label htmlFor="">Search Here:</label>
                  <input type="search" value={search2} onChange={(e)=>setSearch2(e.target.value)} />
                </div>
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
                    {[...new Set(supp_Payments_Out
                      .filter(data => data.supplierName === selectedSupplier)
                      .flatMap(data => data.persons)
                      .map(data => data.entry_Date)
                    )].map(dateValue => (
                      <option value={dateValue} key={dateValue}>{dateValue}</option>
                    ))}
                  </select>
                </div>
               
                <div className="col-auto px-1">
                  <label htmlFor="">PP#:</label>
                  <select value={pp_No} onChange={(e) => setPP_NO(e.target.value)} className='m-0 p-1'>
                    <option value="">All</option>
                    {[...new Set(supp_Payments_Out
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
                    {[...new Set(supp_Payments_Out
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
                    {[...new Set(supp_Payments_Out
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
                    {[...new Set(supp_Payments_Out
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
                    {[...new Set(supp_Payments_Out
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
                    {[...new Set(supp_Payments_Out
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
                    {[...new Set(supp_Payments_Out
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
          <div className="col-md-12 detail_table my-2">
            <div className="d-flex justify-content-between">
              <div className="left d-flex">
                <h6>Persons Details</h6>
              </div>
              <div className="right">
              <label htmlFor="" className='mb-2 mt-3 mx-1'>Show Entries: </label>
                  <select name="" className='my-2 mx-1' value={rowsValue1} onChange={(e)=>setRowsValue1(e.target.value)} id="" style={{height:'30px',zIndex:'999',width:'auto'}}>
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
                <button className='btn shadow btn-sm m-1 bg-info text-white' onClick={() => setShow(!show)}>{show === false ? "Show" : "Hide"}</button>
                <button className='btn excel_btn m-1 btn-sm' onClick={downloadPersons}>Download </button>
                <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printPersonsTable}>Print </button>

              </div>
            </div>
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead className="thead">
                  <TableRow>
                    <TableCell className='label border' style={{ width: '18.28%' }}>SN</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Date</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Name</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>PP#</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Entry_Mode</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Company</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Trade</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Country</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Final_Status</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Flight_Date</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>VPI_PKR</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Total_In_PKR</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Total_Cash_Out</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Remaining</TableCell>
                    {show === true && <>
                      <TableCell className='label border' style={{ width: '18.28%' }}>VPI_Oth_Curr</TableCell>
                      <TableCell className='label border' style={{ width: '18.28%' }}>Remaining_Oth_Curr</TableCell>
                    </>}
                    <TableCell className='label border' style={{ width: '18.28%' }}>Status</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPersons.map((filteredData) => (
                    <>
                      {filteredData.persons.slice(0,rowsValue1 ? rowsValue1 : undefined).map((person, index) => (

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
                                <input type='number' value={editedEntry2.visa_Price_Out_PKR} readonly />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='number' value={editedEntry2.total_In} readonly />
                              </TableCell>

                              <TableCell className='border data_td p-1 '>
                                <input type='number' value={editedEntry2.cash_Out} readonly />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='number' value={editedEntry2.visa_Price_Out_PKR - editedEntry2.total_In + editedEntry2.cash_Out} readonly />
                              </TableCell>
                              {show && <>
                                <TableCell className='border data_td p-1 '>
                                  <input type='number' value={editedEntry2.visa_Price_Out_Curr} readonly />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='number' value={editedEntry2.remaining_Curr} readonly />
                                </TableCell>
                              </>}
                              <TableCell className='border data_td p-1 '>
                                <select name="" id="" value={editedEntry2.status} onChange={(e) => handlePersonInputChange(e, 'status')}>
                                  <option value="Open">Open</option>
                                  <option value="Closed">Closed</option>
                                </select>

                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{index + 1}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.entry_Date}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.name}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.pp_No}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.entry_Mode}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.company}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.trade}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.country}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.final_Status}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.flight_Date}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.visa_Price_Out_PKR}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.total_In}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.cash_Out}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.visa_Price_Out_PKR - person?.total_In + person?.cash_Out}</TableCell>
                              {show && <>
                                <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.visa_Price_Out_Curr}</TableCell>
                                <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.remaining_Curr}</TableCell>
                              </>}
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.status}</TableCell>



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
                          {/* Calculate the total sum of payment_Out */}
                          {filteredPersons.reduce((total, filteredData) => {
                            return total + filteredData.persons.slice(0,rowsValue1 ? rowsValue1 : undefined).reduce((sum, paymentItem) => {
                              const paymentIn = parseFloat(paymentItem.visa_Price_Out_PKR);
                              return isNaN(paymentIn) ? sum : sum + paymentIn;
                            }, 0);
                          }, 0)}
                        </TableCell>
                        <TableCell className='border data_td text-center bg-info text-white'>
                          
                          {filteredIndividualPayments.reduce((total, filteredData) => {
                            return total + filteredData.persons.slice(0,rowsValue1 ? rowsValue1 : undefined).reduce((sum, paymentItem) => {
                              const cashOut = parseFloat(paymentItem.total_In);
                              return isNaN(cashOut) ? sum : sum + cashOut;
                            }, 0);
                          }, 0)}
                        </TableCell>
                        <TableCell className='border data_td text-center bg-danger text-white'>
                          {/* Calculate the total sum of cash_Out */}
                          {filteredIndividualPayments.reduce((total, filteredData) => {
                            return total + filteredData.persons.slice(0,rowsValue1 ? rowsValue1 : undefined).reduce((sum, paymentItem) => {
                              const cashOut = parseFloat(paymentItem.cash_Out);
                              return isNaN(cashOut) ? sum : sum + cashOut;
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
         }
        </>
      )}


{/* Indicidual Payments details */}
{details &&
<>
<div className="col-md-12 detail_table my-2">
            <h6>Individual Payment Details</h6>
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead className="thead">
                  <TableRow>
                    <TableCell className='label border'>SN</TableCell>
                    <TableCell className='label border'>Candidate</TableCell>
                    <TableCell className='label border'>PP_NO</TableCell>
                    <TableCell className='label border'>Entry_Mode</TableCell>
                    <TableCell className='label border'>Company</TableCell>
                    <TableCell className='label border'>Trade</TableCell>
                    <TableCell className='label border'>Country</TableCell>
                    <TableCell className='label border'>Final_Status</TableCell>
                    <TableCell className='label border'>Flight_Date</TableCell>
                    <TableCell className='label border'>Visa_Amount_PKR</TableCell>
                    <TableCell className='label border'>Past_Paid_PKR</TableCell>
                    <TableCell className='label border'>Past_Remaining_PKR</TableCell>
                    <TableCell className='label border'>New_Remaining_PKR</TableCell>
                    <TableCell className='label border'>New_Payment_In_PKR</TableCell>
                    {show2 && 
                       <>
                    <TableCell className='label border'>Visa_Amount_Curr</TableCell>
                    <TableCell className='label border'>Past_Paid_Curr</TableCell>
                    <TableCell className='label border'>Past_Remaining_Curr</TableCell>
                    <TableCell className='label border'>New_Remaining_Curr</TableCell>
                    <TableCell className='label border'>New_Payment_In_Curr</TableCell>
                    <TableCell className='label border'>Curr_Rate</TableCell>
                    </>
                    }
                 
                    
                    <TableCell align='left' className='edw_label border' colSpan={1}>
                      Actions
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.payments && details.payments.map((paymentItem,index) => (
                    <>
                        <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                          {editMode && editedRowIndex === index ? (
                            <>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={index + 1} readonly />
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.cand_Name} readonly />
                              </TableCell>
                               <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.pp_No} readonly />
                              </TableCell>
                               <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.entry_Mode}  readonly/>
                              </TableCell>
                               <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.company}  readonly/>
                              </TableCell>
                               <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.trade}  readonly/>
                              </TableCell>
                               <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.country}  readonly/>
                              </TableCell>
                               <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.final_Status} readonly/>
                              </TableCell>
                               <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.flight_Date} readonly/>
                              </TableCell>
                               <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.visa_Amount_PKR} readonly/>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.past_Paid_PKR} readonly/>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.past_Remain_PKR} readonly/>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.new_Remain_PKR} readonly/>
                              </TableCell>
                               <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.new_Payment} onChange={(e) => handleInputChange(e, 'new_Payment')} required/>
                              </TableCell>

                              {show2 &&
                              <>
                               <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.visa_Curr_Amount} readonly/>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.past_Paid_Curr} readonly/>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.past_Remain_Curr} readonly/>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.new_Remain_Curr} readonly/>
                              </TableCell>
                               <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.new_Curr_Payment} onChange={(e) => handleInputChange(e, 'new_Curr_Payment')} required/>
                              </TableCell>
                              <TableCell className='border data_td p-1 '>
                                <input type='text' value={editedEntry.curr_Rate}  disabled/>
                              </TableCell>
                              </>
                              }

                            </>
                          ) : (
                            <>
                              <TableCell className='border data_td text-center'>{index + 1}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.cand_Name}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.pp_No}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.entry_Mode}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.company}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.trade}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.country}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.final_Status}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.flight_Date}</TableCell>
                              <TableCell className='border data_td text-center bg-info text-white'>{paymentItem?.visa_Amount_PKR}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.past_Paid_PKR}</TableCell>
                              <TableCell className='border data_td text-center bg-warning text-white'>{paymentItem?.past_Remain_PKR}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.new_Remain_PKR}</TableCell>
                              <TableCell className='border data_td text-center bg-danger text-white'><i className="fa-solid fa-arrow-down me-2 text-bold"></i>{paymentItem?.new_Payment}</TableCell>

                             {show2 &&
                             <>
                              <TableCell className='border data_td text-center bg-info text-white'>{paymentItem?.visa_Curr_Amount}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.past_Paid_Curr}</TableCell>
                              <TableCell className='border data_td text-center bg-warning text-white'>{paymentItem?.past_Remain_Curr}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.new_Remain_Curr}</TableCell>
                              <TableCell className='border data_td text-center bg-danger text-white'><i className="fa-solid fa-arrow-up me-2 text-bold"></i>{paymentItem?.new_Curr_Payment}</TableCell>
                              <TableCell className='border data_td text-center bg-danger text-white'>{paymentItem?.curr_Rate}</TableCell>
                             </>
                             }
                      
                            
                            </>
                          )}
                           <TableCell className='border data_td p-1 '>
                            {editMode && editedRowIndex === index ? (
                              // Render Save button when in edit mode for the specific row
                              <>
                                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                  <button onClick={() => setEditMode(!editMode)} className='btn delete_btn btn-sm '><i className="fa-solid fa-xmark"></i></button>
                                  <button onClick={() => handleUpdate()} className='btn save_btn btn-sm' disabled={loading3}><i className="fa-solid fa-check"></i></button>

                                </div>

                              </>

                            ) : (
                              // Render Edit button when not in edit mode or for other rows
                              <>
                                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                  <button onClick={() => handleEditClick(paymentItem, index)} className='btn edit_btn btn-sm'><i className="fas fa-edit"></i></button>
                                  <button className='btn delete_btn btn-sm' onClick={() => deleteSinglePaymentIn(paymentItem)} disabled={loading1}><i className="fas fa-trash-alt"></i></button>
                                </div>
                               
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      
                    </>
                  ))}
                  <TableRow>
                    <TableCell colSpan={8}></TableCell>
                    
                    <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                 
                    <TableCell className='border data_td text-center bg-info text-white'>  
                      {details.payments.reduce((total, paymentItem) => {
                          const newTotal = parseFloat(paymentItem.visa_Amount_PKR);
                          return isNaN(newTotal) ? total : total + newTotal;
                        }, 0)}

                    </TableCell>
                     <TableCell className='border data_td text-center'>  
                      {details.payments.reduce((total, paymentItem) => {
                          const newTotal = parseFloat(paymentItem.past_Paid_PKR);
                          return isNaN(newTotal) ? total : total + newTotal;
                        }, 0)}

                    </TableCell>
                          <TableCell className='border data_td text-center  bg-warning text-white'>  
                      {details.payments.reduce((total, paymentItem) => {
                          const newTotal = parseFloat(paymentItem.past_Remain_PKR);
                          return isNaN(newTotal) ? total : total + newTotal;
                        }, 0)}

                    </TableCell>
                          <TableCell className='border data_td text-center'>  
                      {details.payments.reduce((total, paymentItem) => {
                          const newTotal = parseFloat(paymentItem.new_Remain_PKR);
                          return isNaN(newTotal) ? total : total + newTotal;
                        }, 0)}

                    </TableCell>
                          <TableCell className='border data_td text-center bg-danger text-white'>  
                      {details.payments.reduce((total, paymentItem) => {
                          const newTotal = parseFloat(paymentItem.new_Payment);
                          return isNaN(newTotal) ? total : total + newTotal;
                        }, 0)}

                    </TableCell>
                     {show2 && 
                     <>
                          <TableCell className='border data_td text-center bg-info text-white'>  
                      {details.payments.reduce((total, paymentItem) => {
                          const newTotal = parseFloat(paymentItem.visa_Curr_Amount);
                          return isNaN(newTotal) ? total : total + newTotal;
                        }, 0)}

                    </TableCell>
                          <TableCell className='border data_td text-center'>  
                      {details.payments.reduce((total, paymentItem) => {
                          const newTotal = parseFloat(paymentItem.past_Paid_Curr);
                          return isNaN(newTotal) ? total : total + newTotal;
                        }, 0)}

                    </TableCell>
                     <TableCell className='border data_td text-center bg-warning text-white'>  
                      {details.payments.reduce((total, paymentItem) => {
                          const newTotal = parseFloat(paymentItem.past_Remain_Curr);
                          return isNaN(newTotal) ? total : total + newTotal;
                        }, 0)}

                    </TableCell>
                     <TableCell className='border data_td text-center'>  
                      {details.payments.reduce((total, paymentItem) => {
                          const newTotal = parseFloat(paymentItem.new_Remain_Curr);
                          return isNaN(newTotal) ? total : total + newTotal;
                        }, 0)}

                    </TableCell>
                     <TableCell className='border data_td text-center bg-danger text-white'>  
                      {details.payments.reduce((total, paymentItem) => {
                          const newTotal = parseFloat(paymentItem.new_Curr_Payment);
                          return isNaN(newTotal) ? total : total + newTotal;
                        }, 0)}

                    </TableCell>
                    <TableCell className='border data_td text-center bg-danger text-white'>  
                      {details.payments.reduce((total, paymentItem) => {
                          const newTotal = parseFloat(paymentItem.curr_Rate);
                          return isNaN(newTotal) ? total : total + newTotal;
                        }, 0)}

                    </TableCell>
                     </>
                     }
                       
                  </TableRow>
                </TableBody>

              </Table>
            </TableContainer>
          </div>
</>
}
{/* Modal for closing the status of  persons*/}

<div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h4 className="modal-title" id="exampleModalLabel">Select Persons to closed</h4>
        <button type="button" className="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" onClick={()=>setMultipleIds([])}/>
      </div>
      <div className="modal-body detail_table">
      <TableContainer component={Paper} >
              <Table stickyHeader>
                <TableHead className="thead">
                  <TableRow>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Select</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>SN</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Date</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Name</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>PP#</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Entry_Mode</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Company</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Trade</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Country</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Final_Status</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Flight_Date</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>VPI_PKR</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Total In</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Remaining_PKR</TableCell>
                    {show === true && <TableCell className='label border' style={{ width: '18.28%' }}>VPI_Oth_Curr</TableCell>}
                    <TableCell className='label border'>Status</TableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPersons.map((filteredData) => (
                    <>
                      {filteredData.persons.slice(0,rowsValue1 ? rowsValue1 : undefined).map((person, index) => (

                        <TableRow key={person?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                          {editMode2 && editedRowIndex2 === index ? (
                            <>
                             
                            </>
                          ) : (
                            <>
                             <TableCell className='border data_td p-0 text-center' style={{ width: 'auto' }}>
                                <input type='checkbox' className='p-0' onChange={(e) => handleEntryId(person._id, e.target.checked)} />
                              </TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{index + 1}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.entry_Date}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.name}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.pp_No}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.entry_Mode}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.company}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.trade}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.country}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.final_Status}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.flight_Date}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.visa_Price_Out_PKR}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.total_In}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.remaining_Price}</TableCell>
                              {show && <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.visa_Price_Out_Curr}</TableCell>}
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{person?.status}</TableCell>
                            </>
                          )}
                         

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
                          
                          {filteredPersons.reduce((total, filteredData) => {
                            return total + filteredData.persons.slice(0,rowsValue1 ? rowsValue1 : undefined).reduce((sum, paymentItem) => {
                              const paymentIn = parseFloat(paymentItem.visa_Price_Out_PKR);
                              return isNaN(paymentIn) ? sum : sum + paymentIn;
                            }, 0);
                          }, 0)}
                        </TableCell>
                        <TableCell className='border data_td text-center bg-success text-white'>
                          
                          {filteredPersons.reduce((total, filteredData) => {
                            return total + filteredData.persons.slice(0,rowsValue1 ? rowsValue1 : undefined).reduce((sum, paymentItem) => {
                              const paymentIn = parseFloat(paymentItem.total_In);
                              return isNaN(paymentIn) ? sum : sum + paymentIn;
                            }, 0);
                          }, 0)}
                        </TableCell>
                        <TableCell className='border data_td text-center bg-danger text-white'>
                          
                          {filteredPersons.reduce((total, filteredData) => {
                            return total + filteredData.persons.slice(0,rowsValue1 ? rowsValue1 : undefined).reduce((sum, paymentItem) => {
                              const paymentIn = parseFloat(paymentItem.remaining_Price);
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
      <div className="modal-footer">
        <button type="button" className="btn btn-danger btn-sm shadow" data-bs-dismiss="modal" disabled={loading5}>Cancel</button>
        <button type="button" className="btn btn-success btn-sm shadow" onClick={() => changeStatus("Closed")} disabled={loading5}>{loading5 ?"Saving":"Save changes"}</button>
      </div>
    </div>
  </div>
</div>
    </>
  )
}
