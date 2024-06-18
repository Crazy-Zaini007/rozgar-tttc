import {React,useState,useEffect,useRef} from 'react'
import { useAuthContext } from '../hooks/userHooks/UserAuthHook'
import EntryHook from '../hooks/entryHooks/EntryHook';
import { useSelector } from 'react-redux';
import CashInHandHook from '../hooks/cashInHandHooks/CashInHandHook'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import CircularProgress from '@mui/material/CircularProgress';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { green, pink,deepOrange,purple,red   } from '@mui/material/colors';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import EmployeeHook from '../hooks/employeeHooks/EmployeeHook';
import ExpenseHook from '../hooks/expenseHooks/ExpenseHook'

export default function AdminDashboard() {

  const { user } = useAuthContext()
  const { getEntries } = EntryHook()
  const [show, setShow] = useState(false)

  const {getCashInHandData,getOverAllPayments,overAllPayments}=CashInHandHook()
  const { getEmployees } = EmployeeHook()
  const { getExpenses } = ExpenseHook()

  const enteries = useSelector((state) => state.enteries.enteries);
  const cashInHand = useSelector((state) => state.cashInHand.cashInHand);
  const employees = useSelector((state) => state.employees.employees)
  const expenses = useSelector((state) => state.expenses.expenses);


const today = new Date();
today.setHours(23, 59, 59, 999);

// Calculate the start of the current month
const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

// Calculate the date three months ago
const lastThreeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);

let totalEmployeeExpense = 0;
let currentMonthEmployeeExpense = 0;
let threeMonthsEmployeeExpense = 0;

// Iterate over all employees
employees && employees.forEach(employee => {
  if (employee.payments) {
    employee.payments.forEach(month => {
      if (month.payment && month.payment.length > 0) {
        month.payment.forEach(payment => {
          const paymentDate = new Date(payment.date); // Assuming payment.date is the date of the payment
          totalEmployeeExpense += payment.payment_Out;

          // Check if the payment is within the current month
          if (paymentDate >= currentMonthStart && paymentDate <= today) {
            currentMonthEmployeeExpense += payment.payment_Out;
          }

          // Check if the payment is within the last three months
          if (paymentDate >= lastThreeMonthsAgo && paymentDate <= today) {
            threeMonthsEmployeeExpense += payment.payment_Out;
          }
        });
      }
    });
  }
});


// Calculating Expenses

let totalExpense = 0;
let currentMonthExpense = 0;
let threeMonthsExpense = 0;

// Iterate over all expenses
expenses && expenses.forEach(expense => {
  const expenseDate = new Date(expense.date); // Assuming expense.date is the date of the expense
  totalExpense += expense.payment_Out; // Assuming the amount of the expense is stored in expense.amount

  // Check if the expense is within the current month
  if (expenseDate >= currentMonthStart && expenseDate <= today) {
    currentMonthExpense += expense.payment_Out;
  }

  // Check if the expense is within the last three months
  if (expenseDate >= lastThreeMonthsAgo && expenseDate <= today) {
    threeMonthsExpense += expense.payment_Out;
  }
});


  const[totalAdvancePaymentIn,setTotalAdvancePaymentIn]=useState()
  const[totalAdvancePaymentOut,setTotalAdvancePaymentOut]=useState()
  const[todayAdvancePaymentIn,setTodayAdvancePaymentIn]=useState()
  const[todayAdvancePaymentOut,setTodayAdvancePaymentOut]=useState()
  const[todayTotalCashIn,setTodayTotalCashIn]=useState()
  const[todayTotalCashOut,setTodayTotalCashOut]=useState()
const[loading1,setLoading1]=useState(false)
const[loading2,setLoading2]=useState(false)
const[loading3,setLoading3]=useState(false)
const[loading4,setLoading4]=useState(false)
const[loading5,setLoading5]=useState(false)


const apiUrl = process.env.REACT_APP_API_URL;


  const getCash = async () => {
  
    try {
      const response = await fetch(`${apiUrl}/auth/reports/get/all/advance_payments`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      })

      const json = await response.json();
     
      if (response.ok) {
        setTotalAdvancePaymentIn(json.totalAdvancePaymentIn)
        setTotalAdvancePaymentOut(json.totalAdvancePaymentOut)
        setTodayAdvancePaymentIn(json.todayAdvancePaymentIn)
        setTodayAdvancePaymentOut(json.todayAdvancePaymentOut)
        setTodayTotalCashIn(json.todayCashIn)
        setTodayTotalCashOut(json.todayCashOut)
      }
    }
    catch (error) {
      
      
    }
  }


// fteching Data from DB
const fetchData = async () => {
  try {
    setLoading1(true)
    setLoading2(true)
    setLoading3(true)
    setLoading4(true)
    setLoading5(true)
    await getEntries();
    setLoading1(false)
    await getEmployees();
    await getExpenses()
    setLoading2(false)
    await getOverAllPayments();
    setLoading3(false)
    await getCash()
    setLoading4(false)

    
  } catch (error) {
    setLoading1(false)
    setLoading2(false)
    setLoading3(false)
    setLoading4(false)
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
}, []);



const aggregatedPayments = {};
let totalPaymentIn = 0;
let totalCashOutIn = 0;
let totalPaymentOut = 0;
let totalCashOutOut = 0;

// Iterate through all payments
overAllPayments.forEach(payment => {
  const paymentVia = payment.payment_Via;

  // Initialize the entry for this payment_Via if it doesn't exist
  if (!aggregatedPayments[paymentVia]) {
    aggregatedPayments[paymentVia] = {
      totalPaymentIn: 0,
      totalCashOutIn: 0,
      totalPaymentOut: 0,
      totalCashOutOut: 0,
    };
  }

  // Update the sums based on payment type
  if (payment.payment_In > 0 || payment.type.toLowerCase().includes('in')) {
    aggregatedPayments[paymentVia].totalPaymentIn += payment.payment_In || 0;
    aggregatedPayments[paymentVia].totalCashOutIn += payment.cash_Out || 0;

    totalPaymentIn += payment.payment_In || 0;
    totalCashOutIn += payment.cash_Out || 0;
  }
  if (payment.payment_Out > 0 || payment.type.toLowerCase().includes('out')) {
    aggregatedPayments[paymentVia].totalPaymentOut += payment.payment_Out || 0;
    aggregatedPayments[paymentVia].totalCashOutOut += payment.cash_Out || 0;

    totalPaymentOut += payment.payment_Out || 0;
    totalCashOutOut += payment.cash_Out || 0;
  }
});


// Calculate the combined total
const combinedTotal = (totalPaymentIn + totalCashOutIn) - (totalPaymentOut + totalCashOutOut);




  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const flightsThisMonth = enteries ? enteries.filter(entry => {
    if (entry.flight_Date.toLowerCase() === "no fly" || entry.flight_Date.toLowerCase() === "not fly") {
      return false;
    }
    
    const flightDate = new Date(entry.flight_Date);
    return flightDate >= firstDayOfMonth && flightDate < today;
  }).length : 0;


  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
  const flightsLastThreeMonths = enteries ? enteries.filter(entry => {
    if (entry.flight_Date.toLowerCase() === "no fly" || entry.flight_Date.toLowerCase() === "not fly") {
      return false;
    }

    const flightDate = new Date(entry.flight_Date);
    // Exclude today's date
    return flightDate >= threeMonthsAgo && flightDate < today;
  }).length : 0;





const myDate = new Date(); myDate .setHours(0, 0, 0, 0);const currentDate = myDate.toLocaleDateString('en-CA');
// Filter payments based on the current date
const todayPayments =overAllPayments && overAllPayments.filter(payment => payment.date === currentDate);

const collapsed = useSelector((state) => state.collapsed.collapsed);
const [date2, setDate2] = useState('')
  const [date3, setDate3] = useState('')
const [supplierName, setSupplierName] = useState('')
const [type, setType] = useState('')
const [category2, setCategory2] = useState('')
const [payment_Via2, setPayment_Via2] = useState('')
const [payment_Type2, setPayment_Type2] = useState('')
const [search, setSearch] = useState('')

const filteredPayment = (date2 && date3 ? overAllPayments : todayPayments)
    ? (date2 && date3 ? overAllPayments : todayPayments).filter((paymentItem) => {
      let isDateInRange = true;
      if (date2 && date3) {
        isDateInRange = paymentItem.date >= date2 && paymentItem.date <= date3;
      }

      return (
        paymentItem.category?.toLowerCase().includes(category2.toLowerCase()) &&
        isDateInRange &&
        paymentItem.supplierName?.toLowerCase().includes(supplierName.toLowerCase()) &&
        paymentItem.type?.toLowerCase().includes(type.toLowerCase()) &&
        paymentItem.payment_Via?.toLowerCase().includes(payment_Via2.toLowerCase()) &&
        paymentItem.payment_Type?.toLowerCase().includes(payment_Type2.toLowerCase()) &&
        (
          paymentItem.supplierName?.trim().toLowerCase().startsWith(search.trim().toLowerCase()) ||
          paymentItem.type?.trim().toLowerCase().startsWith(search.trim().toLowerCase()) ||
          paymentItem.pp_No?.trim().toLowerCase().startsWith(search.trim().toLowerCase()) ||
          paymentItem.payment_Via?.trim().toLowerCase().startsWith(search.trim().toLowerCase()) ||
          paymentItem.slip_No?.trim().toLowerCase().startsWith(search.trim().toLowerCase()) ||
          paymentItem.payment_Type?.trim().toLowerCase().startsWith(search.trim().toLowerCase())
        )
      );
    })
    : [];

const sortedPayments=filteredPayment&&filteredPayment.sort((a,b)=>new Date(b.date)-new Date(a.date))


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
    <h1 class="title">Payment Invoice</h1>
  </div>
  <hr/>
  <table class='print-table'>
    <thead>
      <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Name/PP#</th>
        <th>Reference</th>
        <th>Category</th>
        <th>Payment Via</th>
        <th>Payment Type</th>
        <th>Slip No</th>
        <th>Details</th>
         <th>Cash In</th>
        <th>Cash Out</th>
        <th>Cash In Return</th>
        <th>Cash Out Return</th>
        <th>Remaining In</th>
        <th>Remaining Out</th>
        <th>Curr Rate</th>
        <th>Curr Amount</th>
        <th>Payment In Curr</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>${String(paymentItem?.date)}</td>
        <td>${String(paymentItem.supplierName)}/${String(paymentItem?.pp_No)}</td>
        <td>${String(paymentItem.type)}</td>
        <td>${String(paymentItem?.category)}</td>
        <td>${String(paymentItem?.payment_Via)}</td>
        <td>${String(paymentItem?.payment_Type)}</td>
        <td>${String(paymentItem?.slip_No)}</td>
        <td>${String(paymentItem?.details)}</td>
        <td>${String(paymentItem?.payment_In || paymentItem?.payment_In > 0 ? paymentItem.cash_Out : 0)}</td>
        <td>${String(paymentItem?.payment_Out || paymentItem?.payment_Out > 0 ? paymentItem.cash_Out : 0)}</td>
        <td>${String(paymentItem?.payment_In || paymentItem?.payment_In > 0 ? paymentItem.remaining : 0)}</td>
        <td>${String(paymentItem?.payment_Out || paymentItem?.payment_Out > 0 ? paymentItem.remaining : 0)}</td>
        <td>${String(paymentItem?.curr_Rate||0)}</td>
        <td>${String(paymentItem?.curr_Amount||0)}</td>
        <td>${String(paymentItem?.payment_In_curr?paymentItem?.payment_In_curr:paymentItem?.payment_Out_curr||'NIL')}</td>
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
        <title>Print Invoice</title>
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


const printPayments = () => {
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
    <h1 class="title">Payment Invoices</h1>
  </div>
  <hr/>
  <table class='print-table'>
    <thead>
      <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Name/PP#</th>
        <th>Reference</th>
        <th>Category</th>
        <th>Payment Via</th>
        <th>Payment Type</th>
        <th>Slip No</th>
        <th>Details</th>
        <th>Cash In</th>
        <th>Cash Out</th>
        <th>Cash In Return</th>
        <th>Cash Out Return</th>
         <th>Remaining In</th>
        <th>Remaining Out</th>
        <th>Curr Rate</th>
        <th>Curr Amount</th>
        <th>Payment In Curr</th>
      </tr>
    </thead>
    <tbody>
    ${sortedPayments.map((paymentItem, index) => `
      <tr key="${paymentItem?._id}">
        <td>${index + 1}</td>
        <td>${String(paymentItem?.date)}</td>
        <td>${String(paymentItem.supplierName)}/${String(paymentItem?.pp_No)}</td>
        <td>${String(paymentItem.type)}</td>
        <td>${String(paymentItem?.category)}</td>
        <td>${String(paymentItem?.payment_Via)}</td>
        <td>${String(paymentItem?.payment_Type)}</td>
        <td>${String(paymentItem?.slip_No)}</td>
        <td>${String(paymentItem?.details)}</td>
        <td>${String(paymentItem?.payment_In || paymentItem?.payment_In > 0 ? paymentItem.cash_Out : 0)}</td>
        <td>${String(paymentItem?.payment_Out || paymentItem?.payment_Out > 0 ? paymentItem.cash_Out : 0)}</td>
        <td>${String(paymentItem?.payment_In || paymentItem?.payment_In > 0 ? paymentItem.remaining : 0)}</td>
        <td>${String(paymentItem?.payment_Out || paymentItem?.payment_Out > 0 ? paymentItem.remaining : 0)}</td>
        <td>${String(paymentItem?.payment_Out||0)}</td>
        <td>${String(paymentItem?.cash_Out||0)}</td>
        <td>${String(paymentItem?.curr_Rate||0)}</td>
        <td>${String(paymentItem?.curr_Amount||0)}</td>
        <td>${String(paymentItem?.payment_In_curr?paymentItem?.payment_In_curr:paymentItem?.payment_Out_curr||'NIL')}</td>
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
      <td></td>
      <td></td>
      <td>Total</td>
    <td>${String(sortedPayments.reduce((total, paymentItem) => total + (paymentItem?.payment_In || 0), 0))}</td>
    <td>${String(sortedPayments.reduce((total, paymentItem) => total + (paymentItem?.payment_Out || 0), 0))}</td>
     <td>${String(sortedPayments.reduce((total, paymentItem) => total + (paymentItem?.type.toLowerCase().includes('in')? paymentItem.cash_Out : 0), 0))}</td>
    <td>${String(sortedPayments.reduce((total, paymentItem) => total + (paymentItem?.type.toLowerCase().includes('out') ? paymentItem.cash_Out : 0), 0))}</td>
    <td>${String(sortedPayments.reduce((total, paymentItem) => total + ((paymentItem?.payment_In || paymentItem?.payment_In > 0) ? paymentItem.remaining : 0), 0))}</td>
    <td>${String(sortedPayments.reduce((total, paymentItem) => total + ((paymentItem?.payment_Out || paymentItem?.payment_Out > 0) ? paymentItem.remaining : 0), 0))}</td>
    <td>${String(sortedPayments.reduce((total, paymentItem) => total + (paymentItem?.curr_Rate || 0), 0))}</td>
    <td>${String(sortedPayments.reduce((total, paymentItem) => total + (paymentItem?.curr_Amount || 0), 0))}</td>

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
        <title>Print Invoice</title>
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

const downloadExcel = () => {
  const data = [];
  // Iterate over entries and push all fields
  sortedPayments.forEach((payments, index) => {
    const rowData = {
      SN: index + 1,
      Name:payments.supplierName,
      PP_No:payments?.pp_No,
      Type:payments.type,
      Date:payments.date,
      Category:payments.category,
      Payment_Via:payments.payment_Via,
      Payment_Type:payments.payment_Type,
      Slip_No:payments.slip_No,
      Details:payments.details,
      Payment_In:payments.payment_In,
      Payment_Out:payments.payment_Out,
      Cash_In_Return:(payments.payment_In ||payments.payment_In>0)?payments.cash_Out:0,
      Cash_Out_Return:(payments.payment_Out ||payments.payment_Out>0)?payments.cash_Out:0,
      Remaining_In:(payments.payment_In ||payments.payment_In>0)?payments.remaining:0,
      Remaining_Out:(payments.payment_Out ||payments.payment_Out>0)?payments.remaining:0,
      Curr_Rate:payments.curr_Rate,
      Curr_Amount:payments.curr_Amount,
      Payment_In_curr:payments.payment_In_curr?payments.payment_In_curr:payments.payment_Out_curr,
      Invoice:payments.invoice,
    };

    data.push(rowData);
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'Daybook.xlsx');
};



const downloadPaymentExcel = (payments) => {
  const data = [];
  // Iterate over entries and push all fields
    const rowData = {
      Name:payments.supplierName,
      PP_No:payments?.pp_No,
      Type:payments.type,
      Date:payments.date,
      Category:payments.category,
      Payment_Via:payments.payment_Via,
      Payment_Type:payments.payment_Type,
      Slip_No:payments.slip_No,
      Details:payments.details,
      Payment_In:payments.payment_In,
      Payment_Out:payments.payment_Out,
      Cash_In_Return:(payments.payment_In ||payments.payment_In>0)?payments.cash_Out:0,
      Cash_Out_Return:(payments.payment_Out ||payments.payment_Out>0)?payments.cash_Out:0,
      Remaining_In:(payments.payment_In ||payments.payment_In>0)?payments.remaining:0,
      Remaining_Out:(payments.payment_Out ||payments.payment_Out>0)?payments.remaining:0,
      Curr_Rate:payments.curr_Rate,
      Curr_Amount:payments.curr_Amount,
      Payment_In_curr:payments.payment_In_curr?payments.payment_In_curr:payments.payment_Out_curr,
      Invoice:payments.invoice,
    }

    data.push(rowData);


  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'Daybook.xlsx');
};




const topButtons=[
  {text:'Add New Entry',navigate:'/rozgar/enteries/add_new_entry'},
  {text:'Add Expense',navigate:'/rozgar/expenses/add_new_expense'},
  {text:'Candidate Payment In',navigate:'/rozgar/candidates/payment_in'},
  {text:'Agent Payment In',navigate:'/rozgar/agents/payment_in'},
  {text:'Agent Cand-Vise Payment Out',navigate:'/rozgar/agents/cand_vise_payment_out'},
  {text:'Supplier Payment Out',navigate:'/rozgar/suppliers/payment_out'},
  {text:'Supplier Cand-Vise Payment Out',navigate:'/rozgar/suppliers/cand_vise_payment_out'},


]
const navigationButtons=[
  {text:'Direct Payment',navigate:'/rozgar/direct/payment_in_out'},
  {text:'Agent Payment Out',navigate:'/rozgar/agents/payment_out'},
  {text:'Agent Payment Return',navigate:'/rozgar/agents/payment_return'},
  {text:'Agent Cand-Vise Payment In',navigate:'/rozgar/agents/cand_vise_payment_in'},
  {text:'Supplier Payment In',navigate:'/rozgar/suppliers/payment_in'},
  {text:'Supplier Payment Return',navigate:'/rozgar/suppliers/payment_return'},
  {text:'Supplier Cand-Vise Payment In',navigate:'/rozgar/suppliers/cand_vise_payment_in'},
  {text:'Candidate Payment Out',navigate:'/rozgar/candidates/payment_out'},
  {text:'Candidate Payment Return',navigate:'/rozgar/candidates/payment_return'},
  {text:'Protector Payment Out',navigate:'/rozgar/protector/payment_out'},
  {text:'Azad Visa Payment In',navigate:'/rozgar/azad/payment_in'},
  {text:'Azad Visa Payment Out',navigate:'/rozgar/azad/payment_out'},
  {text:'Azad Visa Payment Return',navigate:'/rozgar/azad/payment_return'},
  {text:'Ticket Payment In',navigate:'/rozgar/tickets/payment_in'},
  {text:'Ticket Payment Out',navigate:'/rozgar/tickets/payment_out'},
  {text:'Ticket Payment Return',navigate:'/rozgar/tickets/payment_return'},
  {text:'Visit Payment In',navigate:'/rozgar/visits/payment_in'},
  {text:'Visit Payment Out',navigate:'/rozgar/visits/payment_out'},
  {text:'Visit Payment Return',navigate:'/rozgar/visits/payment_return'},
  {text:'CDWC Payment In',navigate:'/rozgar/credites&debits/payment_in/with_cash_in_hand'},
  {text:'CDWC Payment Out',navigate:'/rozgar/credites&debits/payment_out/with_cash_in_hand'},
  {text:'CDWOC Payment In',navigate:'/rozgar/credites&debits/payment_in/without_cash_in_hand'},
  {text:'CDWOC Payment Out',navigate:'/rozgar/credites&debits/payment_out/without_cash_in_hand'},
  {text:'Asset Payment In',navigate:'/rozgar/assets/payment_in'},
  {text:'Asset Payment Out',navigate:'/rozgar/assets/payment_out'},
  {text:'Add Employee',navigate:'/rozgar/employees/add'},
  {text:'Add Employee Payment',navigate:'/rozgar/employees/add_payment'},

]

const[option,setOption]=useState(false)

  return (
    <div className={`${collapsed ?"collapsed":"main"}`}>
    <div className="container-fluid admin-dashboard mt-3">
     <div className="row px-3 ">
      <div className="col-md-12 p-0">
      <h4>Admin Dashboard</h4>
      </div>
      <div className="col-md-12 top_buttons p-0">
       
          {topButtons.map((data)=>(
            <Link key={data.navigate} className='btn m-1 px-2 py-1 rounded' to={data.navigate}>{data.text}</Link>
          ))}
        
      </div>
        <div className="col-md-12 admin-main p-0">
          <div className="row">
            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1">
             <Paper className="data px-3 py-0 rounded border m-0 ">
           <Link to='/rozgar/enteries/reports_details'>
           <div className="d-flex justify-content-between py-1 mt-1">
            <div className=" ">
              <div className="side">
                <Avatar  sx={{ width: 35, height: 35, bgcolor: green[400]  }}><LocalActivityIcon/></Avatar>
        
              </div>
            </div>
            <div className="side text-end">
            {loading1 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{enteries ? enteries.filter(entry => (entry.final_Status.toLowerCase() === "visa issued") ||(entry.final_Status.toLowerCase() === "visa issue") ).length:0 }</h5> }
                <h6 className='ml-2'>Total Visa Issued</h6>
            </div>
          </div> 
           </Link>
        
             </Paper>
            </div>


            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1">
             <Paper className="data px-3 py-0 rounded border m-0 ">
           <Link to='/rozgar/enteries/reports_details'>
           <div className="d-flex justify-content-between py-1 mt-1">
            <div className=" ">
              <div className="side">
                <Avatar  sx={{ width: 35, height: 35, bgcolor: green[400]  }}><LocalActivityIcon/></Avatar>
        
              </div>
            </div>
            <div className="side text-end">
            {loading1 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{enteries ? enteries.filter(entry => (entry.final_Status.toLowerCase() === "visa expired") ||(entry.final_Status.toLowerCase() === "visa expire")||(entry.final_Status.toLowerCase() === "visa expired") ).length:0 }</h5> }
                <h6 className='ml-2'>Total Visa Expired</h6>
            </div>
          </div> 
           </Link>
        
             </Paper>
            </div>
            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1">
             <Paper className="data px-3 py-0 rounded border m-0 ">
           <Link to='/rozgar/enteries/reports_details'>
           <div className="d-flex justify-content-between py-1 mt-1">
            <div className=" ">
              <div className="side">
                <Avatar  sx={{ width: 35, height: 35, bgcolor: green[400]  }}><LocalActivityIcon/></Avatar>
              </div>
            </div>
            <div className="side text-end">
            {loading1 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{enteries ? enteries.filter(entry => (entry.final_Status.toLowerCase() === "visa loss") ||(entry.final_Status.toLowerCase() === "visa los")||(entry.final_Status.toLowerCase() === "visa lost") ).length:0 }</h5> }
                <h6 className='ml-2'>Total Visa Loss</h6>
            </div>
          </div> 
           </Link>
        
             </Paper>
            </div>


            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1  ">
            <Paper className="data px-3 py-0 rounded border m-0 ">
            <Link to='/rozgar/enteries/reports_details'>
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{width: 35, height: 35, bgcolor: purple [400]  }}><AirplaneTicketIcon/></Avatar>
             
              </div>
            </div>
            <div className="side text-end ">
            {loading1 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{enteries ? enteries.filter(entry => !(entry.flight_Date.toLowerCase() === "no fly" || entry.flight_Date.toLowerCase() === "not fly")).length:0 }</h5> }
                <h6 className='ml-2'>Total Flights <br /> </h6>
            </div>
          </div> 
            </Link>
          
            </Paper>
           
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1  ">
            <Paper className="data px-3 py-0 rounded border m-0 ">
            <Link to='/rozgar/enteries/reports_details'>
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{width: 35, height: 35, bgcolor: purple [400]  }}><AirplaneTicketIcon/></Avatar>
             
              </div>
            </div>
            <div className="side text-end ">
            {loading1 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{enteries ? flightsThisMonth:0 }</h5> }
                <h6 className='ml-2'>This Month Flights <br /> </h6>
            </div>
          </div> 
            </Link>
          
            </Paper>
           
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1  ">
            <Paper className="data px-3 py-0 rounded border m-0 ">
            <Link to='/rozgar/enteries/reports_details'>
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{width: 35, height: 35, bgcolor: purple [400]  }}><AirplaneTicketIcon/></Avatar>
             
              </div>
            </div>
            <div className="side text-end ">
            {loading1 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{enteries ? flightsLastThreeMonths:0 }</h5> }
                <h6 className='ml-2'>Last 3 Months Flights <br /> </h6>
            </div>
          </div> 
            </Link>
          
            </Paper>
           
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1  ">
            <Paper className="data px-3 py-0 rounded border m-0 ">
            <Link to='/rozgar/enteries/reports_details'>
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{width: 35, height: 35, bgcolor: deepOrange [400]  }}><ConfirmationNumberIcon/></Avatar>
             
              </div>
            </div>
            <div className="side text-end ">
            {loading1 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{enteries ? enteries.filter(entry => (entry.final_Status.toLowerCase() === "ticket" || entry.final_Status.toLowerCase() === "tickets")||entry.final_Status.toLowerCase() === "tkt").length:0 }</h5> }
                <h6 className='ml-2'>Total Tickets <br /> </h6>
            </div>
          </div> 
            </Link>
          
            </Paper>
           
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1  ">
            <Paper className="data px-3 py-0 rounded border m-0 ">
            <Link to='/rozgar/enteries/reports_details'>
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{width: 35, height: 35, bgcolor: pink [400]  }}><AttachMoneyIcon/></Avatar>
              </div>
            </div>
            <div className="side text-end ">
            {loading5 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{(employees ? totalEmployeeExpense:0)+(expenses?totalExpense:0) }</h5> }
                <h6 className='ml-2'>Total Expenses with Employess <br /> </h6>
            </div>
          </div> 
            </Link>
          
            </Paper>
           
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1  ">
            <Paper className="data px-3 py-0 rounded border m-0 ">
            <Link to='/rozgar/enteries/reports_details'>
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{width: 35, height: 35, bgcolor: pink [400]  }}><AttachMoneyIcon/></Avatar>

             
              </div>
            </div>
            <div className="side text-end ">
            {loading5 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{(employees ? currentMonthEmployeeExpense:0)+(expenses? currentMonthExpense:0) }</h5> }
                <h6 className='ml-2'> Current Month Expenses with Employess<br /> </h6>
            </div>
          </div> 
            </Link>
          
            </Paper>
           
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1  ">
            <Paper className="data px-3 py-0 rounded border m-0 ">
            <Link to='/rozgar/enteries/reports_details'>
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{width: 35, height: 35, bgcolor: pink [400]  }}><AttachMoneyIcon/></Avatar>
              </div>
            </div>
            <div className="side text-end ">
            {loading5 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{(employees ? threeMonthsEmployeeExpense:0)+(expenses ?threeMonthsExpense:0)}</h5> }
                <h6 className='ml-2'>Last 3 Month Expenses with Employess<br /> </h6>
            </div>
          </div> 
            </Link>
          
            </Paper>
           
            </div>

             <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1 ">
           
            <Paper className="data px-3 py-0 rounded border m-0">
            <Link to='/rozgar/cash_in_hand'>
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{width: 35, height: 35, bgcolor: green [500]  }}><MonetizationOnIcon/></Avatar>
           
              </div>
            </div>
            <div className="side text-end">
            {loading3 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{( overAllPayments ? combinedTotal:0).toFixed(2)}</h5> }
            <h6 className='ml-2'>Cash In Hand</h6>
            </div>
          </div> 
            </Link>
          
            </Paper>
            </div>
            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1">          
            <Paper className="data px-3 py-0 rounded border m-0">
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side">
              <Avatar   sx={{width: 35, height: 35, bgcolor: green [500]  }}><AddCardIcon/></Avatar>

            
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{ Math.round(todayTotalCashIn && todayTotalCashIn>0 ?todayTotalCashIn :0)}</h5> }

<h6 className='ml-2'>Today Cash In</h6>
            </div>
          </div> 
          
            </Paper>
            </div>
         
            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1">
             <Paper className="data px-3 py-0 rounded border m-0">
             <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side">
              <Avatar   sx={{width: 35, height: 35, bgcolor: red [500]  }}><CreditCardIcon/></Avatar>
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{ Math.round(todayTotalCashOut && todayTotalCashOut>0 ? todayTotalCashOut:0)}</h5> }

                <h6 className='ml-2'>Today Cash Out</h6>
            </div>
          </div> 
          

             </Paper>
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1">          
            <Paper className="data px-3 py-0 rounded border m-0">
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side">
              <Avatar   sx={{width: 35, height: 35, bgcolor: green [500]  }}><KeyboardReturnIcon/></Avatar>

            
              </div>
            </div>
            <div className="side text-end">
            {loading3 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{overAllPayments
      ? Math.round(
          overAllPayments.reduce((total, payment) => {
            const cashOut = isNaN(payment.cash_Out) ? 0 : payment.cash_Out;
            return total + (payment.type.toLowerCase().includes('in') ? cashOut : 0);
          }, 0)
        )
      : 0}</h5> }
<h6 className='ml-2'>Cash Retrun</h6>
            </div>
          </div> 
          
            </Paper>
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1 ">
            <Paper className="data px-3 py-0 rounded border m-0">
          <Link to='/rozgar/reports/advance_payments'>
          <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{ width: 35, height: 35, bgcolor: green [500]  }}><ArrowDownwardIcon/></Avatar>

             
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{ Math.round(todayAdvancePaymentIn && todayAdvancePaymentIn>0 ?todayAdvancePaymentIn:0)}</h5> }
                
                <h6 className='ml-2'>Today Advance In</h6>
            </div>
          </div> 
          </Link>
          

            </Paper>


            </div>
            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1 ">
           
            <Paper className="data px-3 py-0 rounded border m-0">
            <Link to='/rozgar/reports/advance_payments'>
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{ width: 35, height: 35, bgcolor: red [500]  }}><ArrowUpwardIcon/></Avatar>

              
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{ Math.round(todayAdvancePaymentOut && todayAdvancePaymentOut>0 ?todayAdvancePaymentOut :0)}</h5> }

<h6 className='ml-2'>Today Advance Out</h6>
            
            </div>
          </div> </Link>
          
            </Paper>
            </div>
            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1 ">          
            <Paper className="data px-3 py-0 rounded border m-0">
            <Link to='/rozgar/reports/advance_payments'>
            <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side">
              <Avatar   sx={{width: 35, height: 35, bgcolor: green [500]  }}><CreditScoreIcon/></Avatar>

              
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{ Math.round(totalAdvancePaymentIn && totalAdvancePaymentIn>0?totalAdvancePaymentIn:0)}</h5> }
                <h6 className='ml-2'>Total Advance In</h6>
            
            </div>
          </div> </Link>
          
            </Paper>
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-0 p-1 ">          
            <Paper className="data px-3 py-0 rounded border m-0">
           <Link to='/rozgar/reports/advance_payments'>
           <div className="d-flex justify-content-between py-1 mt-2">
            <div className=" ">
              <div className="side">
              <Avatar   sx={{ width: 35, height: 35, bgcolor: red [500]  }}><TrendingDownIcon/></Avatar>

              
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <i className="fa-solid fa-spinner fa-spin"></i>:<h5>{ Math.round(totalAdvancePaymentOut && totalAdvancePaymentOut>0 ? totalAdvancePaymentOut:0)}</h5> }
                
                <h6 className='ml-2'>Total Advance Out</h6>
            
            </div>
          </div> 
           </Link>
          
            </Paper>
            </div>
          </div>
        </div>
        <div className="col-md-12 navigate_buttons p-0 mt-2">
       <h4><button className="btn link_btn shadow" onClick={()=>setOption(!option)}>{option?"Hide":"Show"} Quick Links</button></h4>
       {option && navigationButtons.map((data)=>(
         <Link key={data.navigate} className='btn m-1 px-2 py-1 rounded' to={data.navigate}>{data.text}</Link>
       ))}
     
   </div>
        <div className="col-md-12 payment_details p-0 my-2">
          <div className="row ">
          <h3 className="text-center my-2"><strong>Day Book</strong> </h3>
          <div className="col-md-12 filters">
                      <div className='py-1 mb-2'>
                        <div className="row">
                        <div className="col-auto px-1">
                            <label htmlFor="">Search Here:</label>
                           <input type="search" value={search} onChange={(e)=>setSearch(e.target.value)} />
                          </div>
                          <div className="col-auto px-1">
                  <label htmlFor="">Date From:</label>
                  <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className='m-0 p-1'/>
                </div>
                <div className="col-auto px-1">
                  <label htmlFor="">Date To:</label>
                  <input type="date" value={date3} onChange={(e) => setDate3(e.target.value)} className='m-0 p-1'/>
                 
                </div>
                          
                          <div className="col-auto px-1">
                            <label htmlFor="">Supp/Agent/Cand:</label>
                            <select value={supplierName} onChange={(e) => setSupplierName(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.supplierName))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-auto px-1">
                            <label htmlFor="">Reference Type:</label>
                            <select value={type} onChange={(e) => setType(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.type))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-auto px-1">
                            <label htmlFor="">Category:</label>
                            <select value={category2} onChange={(e) => setCategory2(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.category))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-auto px-1">
                            <label htmlFor="">Payment Via:</label>
                            <select value={payment_Via2} onChange={(e) => setPayment_Via2(e.target.value)} className='m-0 p-1'>
                              <option value="">All</option>
                              {[...new Set(overAllPayments && overAllPayments.map(data => data.payment_Via))].map(dateValue => (
                                <option value={dateValue} key={dateValue}>{dateValue}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-auto px-1">
                            <label htmlFor="">Payment Type:</label>
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
          </div>
          <div className="text-end">
    <button className='btn btn-sm m-1 bg-info text-white shadow border-0' onClick={() => setShow(!show)}>{show === false ? "Show" : "Hide"}</button>
    <button className= 'btn btn-sm  excel_btn m-1 btn btn-sm -sm' onClick={downloadExcel}>Download </button>
                        <button className= 'btn btn-sm  excel_btn m-1 btn btn-sm -sm bg-success border-0' onClick={printPayments}>Print </button>
    </div>
         {loading3 && 
          <div className="image text-center">
<CircularProgress  sx={{ width: 25, height: 25  }}  disableShrink />
          </div>
         }
                      {!loading3 &&
                      <TableContainer className='detail_table'>
                      <Table stickyHeader  sx={{ maxHeight: 100 }}>
                        <TableHead className="thead" >
                          <TableRow>
                            <TableCell className='label border'>SN</TableCell>
                            <TableCell className='label border'>Date</TableCell>
                            <TableCell className='label border'>Name/PP#</TableCell>
                            <TableCell className='label border'>Type</TableCell>
                            <TableCell className='label border'>Category</TableCell>
                            <TableCell className='label border'>Payment_Via</TableCell>
                            <TableCell className='label border'>Payment_Type</TableCell>
                            <TableCell className='label border'>Slip_No</TableCell>
                            <TableCell className='label border'>Cash_In</TableCell>
                            <TableCell className='label border'>Cash_Out</TableCell>
                            <TableCell className='label border'>Cash_In_Return</TableCell>
                            <TableCell className='label border'>Cash_Out_Return</TableCell>
                          

                           {show && 
                           <>
                            <TableCell className='label border'>Curr_Rate</TableCell>
                            <TableCell className='label border'>Curr_Amount</TableCell>
                            <TableCell className='label border'>Payment_In_Curr</TableCell>
                           </>
                           }
                            <TableCell className='label border'>Details</TableCell>
                            <TableCell className='label border'>Invoice</TableCell>
                            <TableCell className='label border'>Slip_Pic</TableCell>
                            <TableCell className='label border'>Actions</TableCell>

                        
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sortedPayments && sortedPayments.length>0 ? sortedPayments.map((cash, outerIndex) => (
                              // Map through the payment array
                             
                               <>
                                <TableRow key={cash?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >  
                                    <>
                                      <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash.date}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash.supplierName}/{cash?.pp_No}</TableCell>
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
                                      <TableCell className='border data_td text-center'>{cash.slip_Pic ? <a href={cash.slip_Pic} target="_blank" rel="noopener noreferrer"> <img src={cash.slip_Pic} alt='Images' className='rounded' /></a>  : "No Picture"}</TableCell>
                                      <TableCell className='border data_td text-center'> <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                              
                                  <button  className='btn bg-success text-white btn-sm' onClick={()=>printPaymentInvoice(cash)}><i className="fa-solid fa-print"></i></button>
                                  <button  className='btn bg-warning text-white btn-sm' onClick={()=>downloadPaymentExcel(cash)}><i className="fa-solid fa-download"></i></button>
                                
                                </div></TableCell>

                                      
                                    </>
                                  
                                </TableRow>
                                

                               </>
                            
                            )):<TableRow>
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
    return total + (Math.round(entry.payment_In || 0)); 
  }, 0)}
</TableCell>
<TableCell className='border data_td text-center bg-danger text-white'>
  {/* Calculate the total sum of payment_Out */}
  {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round(entry.payment_Out || 0)); 
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
    {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
      return total + (Math.round(entry.curr_Amount || 0)); // Use proper conditional check
    }, 0)}
  </TableCell>
 </>
 }
 <TableCell className='border data_td text-center bg-secondary text-white'>
 Total Remaining In PKR= 
  {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round(entry.type.toLowerCase().includes('in') ? entry.remaining || 0 : 0)); 
  }, 0)}
</TableCell>
<TableCell className='border data_td text-center bg-secondary text-white'>
 Total Remaining In Curr= 
  {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round(entry.type.toLowerCase().includes('in') ? entry.remaining_Curr || 0 : 0)); 
  }, 0)}
</TableCell>
<TableCell className='border data_td text-center bg-secondary text-white'>
 Total Remaining Out In PKR= 
  {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round(entry.type.toLowerCase().includes('out') ? entry.remaining || 0 : 0)); 
  }, 0)}
</TableCell>
<TableCell className='border data_td text-center bg-secondary text-white'>
 Total Remaining Out In Curr= 
  {filteredPayment && filteredPayment.length > 0 && filteredPayment.reduce((total, entry) => {
    return total + (Math.round(entry.type.toLowerCase().includes('out') ? entry.remaining_Curr || 0 : 0)); 
  }, 0)}
</TableCell>

                        </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                      }
                     
                    </div>
     </div>
    </div>


    </div>
  )
}
