import { React, useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import { useSelector } from 'react-redux';
import CashInHandHook from '../../hooks/cashInHandHooks/CashInHandHook'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import SyncLoader from 'react-spinners/SyncLoader'
import * as XLSX from 'xlsx';
import ExpenseHook from '../../hooks/expenseHooks/ExpenseHook'

export default function DayBook() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const { user } = useAuthContext()
  const [option, setOption] = useState(0)
  const { getOverAllPayments, overAllPayments } = CashInHandHook()
  const { getExpenses } = ExpenseHook()

  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const [loading4, setLoading4] = useState(false)
  const [protector, setProtector] = useState()
  const [employees, setEmployees] = useState()
  const getProtectors = async () => {

    try {
      const response = await fetch(`${apiUrl}/auth/reports/get/all/protector/payments`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      })

      const json = await response.json();
      if (response.ok) {

        setProtector(json.data); // Dispatch the action with received data
      }
    }
    catch (error) {

    }
  }

  const getEmployees = async () => {

    try {
      const response = await fetch(`${apiUrl}/auth/reports/get/all/employees/payments`, {

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      })

      const json = await response.json();
      if (response.ok) {

        setEmployees(json.data); // Dispatch the action with received data
      }
    }
    catch (error) {
      console.log(error)
    }
  }



  // fteching Data from DB
  const fetchData = async () => {
    try {
      setLoading1(true)
      setLoading2(true)
      setLoading3(true)
      setLoading4(true)
      await getOverAllPayments();
      setLoading1(false)
      await getExpenses()
      setLoading2(false)
      await getProtectors()
      setLoading3(false)
      await getEmployees()
      setLoading4(false)


    } catch (error) {
      setLoading1(false)
      setLoading2(false)
      setLoading3(false)
      setLoading4(false)
    }
  };


  useEffect(() => {
    fetchData()

  }, []);



  const currentDate = new Date().toISOString().split('T')[0];
  // Filter payments based on the current date
  const todayPayments = overAllPayments && overAllPayments.filter(payment => payment.date === currentDate )

  const printPaymenInMainTable = () => {
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const formattedDate = formatDate(new Date());
  
    const printContentString = `
    <div class="print-header">
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Today Payments In Details</h1>
      </div>
      <hr/>
  <table class='print-table'>
    <thead>
      <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Supplier</th>
        <th>Reference Type</th>
        <th>Category</th>
        <th>Payment Via</th>
        <th>Payment Type</th>
        <th>Slip No</th>
        <th>Cash In</th>
        <th>Cash Retrun</th>
        <th>Details</th>
        <th>Invoice</th>
        
      </tr>
    </thead>
    <tbody>
      ${todayPayments
        .filter(entry => entry.type.toLowerCase().includes('in'))
        .map((entry, index) => `
        <tr key="${entry?._id}">
          <td>${index + 1}</td>
          <td>${String(entry.date)}</td>       
          <td>${String(entry.supplierName)}</td>
          <td>${String(entry.type)}</td>
          <td>${String(entry.category)}</td>
          <td>${String(entry.payment_Via)}</td>
          <td>${String(entry.payment_Type)}</td>
          <td>${String(entry.slip_No)}</td>
          <td>${String(entry.payment_In)}</td>
          <td>${String(entry.cash_Out)}</td>
          <td>${String(entry.details)}</td>
          <td>${String(entry.invoice)}</td>   
        </tr>
      `).join('')}
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
        <title>Today's Payment In Details</title>
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


  const downloadPaymenInExcel = () => {
    const filteredPaymentsIn = todayPayments.filter(payment => payment.type?.toLowerCase().includes('in'));
    const data = [];
    // Iterate over entries and push all fields
    filteredPaymentsIn.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date: payments.date,
        Supplier: payments.supplierName,
        Reference_Type: payments.type,
        Category: payments.category,
        Payment_Via: payments.payment_Via,
        Payment_Type: payments.payment_Type,
        Slip_No: payments.slip_No,
        Cash_In: payments.payment_In,
        Payment_Out: payments.payment_Out,
        Cash_Out: payments.cash_Out,
        Details: payments.details,
        Invoice: payments.invoice,
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Today_Payments_In_Details.xlsx');
  }


  
  const printPaymenOutMainTable = () => {
    // Convert JSX to HTML string
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const formattedDate = formatDate(new Date());
  
    const printContentString = `
    <div class="print-header">
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Today Payments Out Details</h1>
      </div>
      <hr/>
  <table class='print-table'>
    <thead>
      <tr>
        <th>SN</th>
        <th>Date</th>
        <th>Supplier</th>
        <th>Reference Type</th>
        <th>Category</th>
        <th>Payment Via</th>
        <th>Payment Type</th>
        <th>Slip No</th>
        <th>Cash Out</th>
        <th>Cash Retrun</th>
        <th>Details</th>
        <th>Invoice</th>
        
      </tr>
    </thead>
    <tbody>
      ${todayPayments
        .filter(entry => entry.type?.toLowerCase().includes('out'))
        .map((entry, index) => `
        <tr key="${entry?._id}">
          <td>${index + 1}</td>
          <td>${String(entry.date)}</td>       
          <td>${String(entry.supplierName)}</td>
          <td>${String(entry.type)}</td>
          <td>${String(entry.category)}</td>
          <td>${String(entry.payment_Via)}</td>
          <td>${String(entry.payment_Type)}</td>
          <td>${String(entry.slip_No)}</td>
          <td>${String(entry.payment_Out)}</td>
          <td>${String(entry.cash_Out)}</td>
          <td>${String(entry.details)}</td>
          <td>${String(entry.invoice)}</td>   
        </tr>
      `).join('')}
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
        <title>Today's Payment_Out Details</title>
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


  const downloadPaymenOutExcel = () => {
    const filteredPaymentsOut = todayPayments.filter(payment => payment.type?.toLowerCase().includes('out'));

    const data = [];
    // Iterate over entries and push all fields
    filteredPaymentsOut.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date: payments.date,
        Supplier: payments.supplierName,
        Reference_Type: payments.type,
        Category: payments.category,
        Payment_Via: payments.payment_Via,
        Payment_Type: payments.payment_Type,
        Slip_No: payments.slip_No,
        Cash_In: payments.payment_In,
        Payment_Out: payments.payment_Out,
        Cash_Out: payments.cash_Out,
        Details: payments.details,
        Invoice: payments.invoice,
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Today_Payments_Out_Details.xlsx');
  }



  const expenses = useSelector((state) => state.expenses.expenses);

  const todayExpenses = expenses && expenses.filter(payment => payment.date === currentDate);
  const [cash_Type,setCash_Type]=useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [name, setName] = useState('')
  const [expe_Category, setExpe_Category] = useState('')
  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')

  const filteredExpenses =todayExpenses && todayExpenses.filter(expense => {
    let isDateInRange = true;
  
    // Check if the expense date is within the selected date range
    if (dateFrom && dateTo) {
      isDateInRange = expense.date >= dateFrom && expense.date <= dateTo;
    }
  
    // Filter payment_Via based on the selected cash_Type
    let filteredPaymentVia = true;
    if (cash_Type === 'cash') {
      filteredPaymentVia = expense.payment_Via?.toLowerCase().includes('cash');
    } else if (cash_Type === 'banks') {
      filteredPaymentVia = !expense.payment_Via?.toLowerCase().includes('cash');
    }
  
    return (
      isDateInRange &&
      expense.name?.toLowerCase().includes(name.toLowerCase()) &&
      expense.expCategory?.toLowerCase().includes(expe_Category.toLowerCase()) &&
      expense.payment_Via?.toLowerCase().includes(payment_Via.toLowerCase()) &&
      expense.payment_Type?.toLowerCase().includes(payment_Type.toLowerCase()) &&
      filteredPaymentVia
    )
  })
  

  const downloadExpenesExcel = () => {
    const data = [];
    // Iterate over entries and push all fields
    filteredExpenses.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        date: payments.date,
        person_Name: payments.name,
        expCategory: payments.expCategory,
        ExpAmount: payments.payment_Out,
        payment_Via: payments.payment_Via,
        payment_Type: payments.payment_Type,
        slip_No: payments.slip_No,
        details: payments.details,
        invoice: payments.invoice,
        curr_Country: payments.curr_Country,
        curr_Rate: payments.curr_Rate,
        curr_Amount: payments.curr_Amount,
      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Today Expenses.xlsx');
  };


  const printExpenseTable = () => {
    // Convert JSX to HTML string
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const formattedDate = formatDate(new Date());
  
    const printContentString = `
    <div class="print-header">
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Expenses Details</h1>
      </div>
      <hr/>
  <table class='print-table'>
    <thead>
      <tr>
      <th>SN</th>
      <th>Date</th>
      <th>Person</th>
      <th>E_Category</th>
      <th>E_Amount</th>
      <th>Payment_Via</th>
      <th>Payment_Type</th>
      <th>Slip_No</th>
      <th>Details</th>
      <th>Invoice</th>
      <th>CUR_Country</th>
      <th>CUR_Rate</th>
      <th>CUR_Amount</th>
      </tr>
    </thead>
    <tbody>
    ${filteredExpenses.map((entry, index) => `
        <tr key="${entry?._id}">
          <td>${index + 1}</td>
          <td>${String(entry?.date)}</td>
          <td>${String(entry?.name)}</td>
          <td>${String(entry?.expCategory)}</td>
          <td>${String(entry?.payment_Out)}</td>
          <td>${String(entry?.payment_Via)}</td>
          <td>${String(entry?.payment_Type)}</td>
          <td>${String(entry?.slip_No)}</td>
          <td>${String(entry?.details)}</td>
          <td>${String(entry?.invoice)}</td>
          <td>${String(entry?.curr_Country,'')}</td>
          <td>${String(entry?.curr_Rate,0)}</td>
          <td>${String(entry?.curr_Amount,'0')}</td>
        </tr>
      `).join('')
      }
      <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>Total</td>
      <td>${String(filteredExpenses.reduce((total, expense) => total + expense.payment_Out, 0))}</td>
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
        <title>Expenses Details</title>
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


  const todayProtectors = protector && protector.filter(payment => payment.date === currentDate);



  const printProtectorTable = () => {
    // Convert JSX to HTML string
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const formattedDate = formatDate(new Date());
  
    const printContentString = `
    <div class="print-header">
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Today Protector Payments Details</h1>
      </div>
      <hr/>
<table class='print-table'>
  <thead>
    <tr>
      <th>SN</th>
      <th>Date</th>
      <th>Protector</th>
      <th>Category</th>
      <th>Payment Via</th>
      <th>Payment Type</th>
      <th>Slip No</th>
      <th>Cash Out</th>
      <th>Details</th>
      <th>Invoice</th>
    </tr>
  </thead>
  <tbody>
    ${todayProtectors.map((entry, index) => `
      <tr key="${entry?._id}">
        <td>${index + 1}</td>
        <td>${String(entry.date)}</td>       
        <td>${String(entry.supplierName)}</td>
        <td>${String(entry.category)}</td>
        <td>${String(entry.payment_Via)}</td>
        <td>${String(entry.payment_Type)}</td>
        <td>${String(entry.slip_No)}</td>
        <td>${String(entry.payment_Out)}</td>
        <td>${String(entry.details)}</td>
        <td>${String(entry.invoice)}</td>   
      </tr>
    `).join('')}
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
      <title>Today's Protector Payment Details</title>
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


  const downloadProtectorExcel = () => {
    const data = [];
    // Iterate over entries and push all fields
    todayProtectors.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date: payments.date,
        Protector: payments.supplierName,
        Category: payments.category,
        Payment_Via: payments.payment_Via,
        Payment_Type: payments.payment_Type,
        Slip_No: payments.slip_No,
        Cash_Out: payments.payment_Out,
        Details: payments.details,
        Invoice: payments.invoice,
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Today_Protector_Payments_Details.xlsx');
  }


  const todayEmployees = employees && employees.filter(payment => payment.date === currentDate);



  const printEmployeeTable = () => {
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const formattedDate = formatDate(new Date());
  
    const printContentString = `
    <div class="print-header">
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title">Employees Today Payments Details</h1>
      </div>
      <hr/>
<table class='print-table'>
<thead>
  <tr>
  <th>SN</th>
  <th>Date</th>
  <th>Employee Name</th>
  <th>Category</th>
  <th>Payment_Via</th>
  <th>Payment_Type</th>
  <th>Slip_No</th>
  <th>Details</th>
  <th>Payment_Out</th>
  <th>Invoice</th>
  <th>Payment_In_Curr</th>
  <th>CUR_Rate</th>
  <th>CUR_Amount</th>
  </tr>
</thead>
<tbody>
${todayEmployees.map((entry, index) =>
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
      <td>${String(paymentItem?.payment_Out_Curr)}</td>
      <td>${String(paymentItem?.curr_Rate)}</td>
      <td>${String(paymentItem?.curr_Amount)}</td>
    </tr>
  `).join('')
    )}
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
    <title>Today Employee Payment Details</title>
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


  const downloadEmployeesPayments = () => {
    const data = [];
    // Iterate over entries and push all fields
    todayEmployees.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,
        Date: payments.date,
        Date: payments.employeeName,
        Category: payments.category,
        payment_Via: payments.payment_Via,
        payment_Type: payments.payment_Type,
        slip_No: payments.slip_No,
        details: payments.details,
        payment_In: payments.payment_Out,
        invoice: payments.invoice,
        payment_In_Curr: payments.payment_Out_Curr,
        curr_Rate: payments.curr_Rate,
        curr_Amount: payments.curr_Amount
      }

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Today Employees Payment Details.xlsx`);
  }

  const collapsed = useSelector((state) => state.collapsed.collapsed);


  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid payment_details">
          <div className="row">
            <div className="col-md-12">
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Day Book</h4>
                </div>
                <div className="right d-flex">
                  {todayPayments.length > 0 &&
                    <>
                      <button className='btn m-1 btn-sm shadow border' style={option === 0 ? { background: 'var(--accent-stonger-blue)', color: 'var(--white' } : {}} onClick={() => setOption(0)}>Payment In</button>
                      <button className='btn m-1 btn-sm shadow border' style={option === 1 ? { background: 'var(--accent-stonger-blue)', color: 'var(--white' } : {}} onClick={() => setOption(1)}>Payment Out</button>
                     {option===0 &&
                     <>
                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadPaymenInExcel}>Download </button>
                      <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printPaymenInMainTable}>Print </button>
                     </>
                     }
                      {option===1 &&
                     <>
                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadPaymenOutExcel}>Download </button>
                      <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printPaymenOutMainTable}>Print </button>
                     </>
                     }
                    </>
                  }

                </div>
              </Paper>
            </div>


            {loading1 &&
              <div className='col-md-12 text-center my-4'>
                <SyncLoader color="#2C64C3" className='mx-auto' />
              </div>
            }

            {!loading1 &&
              <>
                {option === 0 &&
                  <div className='col-md-12'>
                    <Paper className='py-3 mb-1 px-2 detail_table'>
                      <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader >
                          <TableHead className="thead" >
                            <TableRow>
                              <TableCell className='label border'>SN</TableCell>
                              <TableCell className='label border'>Date</TableCell>
                              <TableCell className='label border'>Supp/Agent/Cand</TableCell>
                              <TableCell className='label border'>Reference_Type</TableCell>
                              <TableCell className='label border'>Category</TableCell>
                              <TableCell className='label border'>Payment_Via</TableCell>
                              <TableCell className='label border'>Payment_Type</TableCell>
                              <TableCell className='label border'>Slip_No</TableCell>
                              <TableCell className='label border'>Cash_In</TableCell>
                              <TableCell className='label border'>Cash_Return</TableCell>
                              <TableCell className='label border'>Details</TableCell>
                              <TableCell className='label border'>Invoice</TableCell>
                              <TableCell className='label border'>Slip_Pic</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {todayPayments && todayPayments.length > 0 ? todayPayments.filter(cash => cash.type.toLowerCase().includes('in')).map((cash, outerIndex) => (
                              // Map through the payment array

                              <>
                                <TableRow key={cash?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                                  <>
                                    <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.date}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.supplierName}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.type}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.category}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.payment_Via}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.payment_Type}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash?.slip_No}</TableCell>
                                    <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{cash.payment_In}</TableCell>
                                    <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up text-warning text-bold"></i><i className="fa-solid fa-arrow-down me-2 text-warning text-bold"></i>{cash.cash_Out}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash?.details}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash?.invoice}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.slip_Pic ? <img src={cash.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>
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
                              <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                              <TableCell className='border data_td text-center bg-success text-white'>
                            {/* Calculate the total sum of payment_In */}
                            {todayPayments && todayPayments.length > 0 &&
                              todayPayments
                                .filter(entry => entry.type.toLowerCase().includes('in'))
                                .reduce((total, entry) => {
                                  return total + (entry.payment_In || 0);
                                }, 0)}
                          </TableCell>
                          <TableCell className='border data_td text-center bg-warning text-white'>
                            {/* Calculate the total sum of cash_Out */}
                            {todayPayments && todayPayments.length > 0 &&
                              todayPayments
                                .filter(entry => entry.type.toLowerCase().includes('in'))
                                .reduce((total, entry) => {
                                  return total + (entry.cash_Out || 0);
                                }, 0)}
                          </TableCell>


                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </div>
                }


                {option === 1 &&
                  <div className='col-md-12'>
                    <Paper className='py-3 mb-1 px-2 detail_table'>
                      <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader >
                          <TableHead className="thead" >
                            <TableRow>
                              <TableCell className='label border'>SN</TableCell>
                              <TableCell className='label border'>Date</TableCell>
                              <TableCell className='label border'>Supp/Agent/Cand</TableCell>
                              <TableCell className='label border'>Reference_Type</TableCell>
                              <TableCell className='label border'>Category</TableCell>
                              <TableCell className='label border'>Payment_Via</TableCell>
                              <TableCell className='label border'>Payment_Type</TableCell>
                              <TableCell className='label border'>Slip_No</TableCell>
                              <TableCell className='label border'>Cash_Out</TableCell>
                              <TableCell className='label border'>Cash_Return</TableCell>
                              <TableCell className='label border'>Details</TableCell>
                              <TableCell className='label border'>Invoice</TableCell>
                              <TableCell className='label border'>Slip_Pic</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {todayPayments && todayPayments.length > 0 ? todayPayments.filter(cash => cash.type.toLowerCase().includes('out')).map((cash, outerIndex) => (
                              // Map through the payment array

                              <>
                                <TableRow key={cash?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                                  <>
                                    <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.date}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.supplierName}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.type}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.category}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.payment_Via}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.payment_Type}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash?.slip_No}</TableCell>
                                    <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{cash.payment_Out}</TableCell>
                                    <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up text-warning text-bold"></i><i className="fa-solid fa-arrow-down me-2 text-warning text-bold"></i>{cash.cash_Out}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash?.details}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash?.invoice}</TableCell>
                                    <TableCell className='border data_td text-center'>{cash.slip_Pic ? <img src={cash.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>
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
                              <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>

                              <TableCell className='border data_td text-center bg-danger text-white'>
                            
                            {todayPayments && todayPayments.length > 0 &&
                              todayPayments
                                .filter(entry => entry.type.toLowerCase().includes('out'))
                                .reduce((total, entry) => {
                                  return total + (entry.payment_Out || 0);
                                }, 0)}
                          </TableCell>
                          <TableCell className='border data_td text-center bg-warning text-white'>
                            {/* Calculate the total sum of cash_Out */}
                            {todayPayments && todayPayments.length > 0 &&
                              todayPayments
                                .filter(entry => entry.type.toLowerCase().includes('out'))
                                .reduce((total, entry) => {
                                  return total + (entry.cash_Out || 0);
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


            <div className="col-md-12">
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Expenses</h4>
                </div>
                <div className="right d-flex">
                  {todayExpenses.length > 0 &&
                    <>

                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadExpenesExcel}>Download </button>
                      <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printExpenseTable}>Print </button>
                    </>
                  }

                </div>
              </Paper>
            </div>
            {loading2 &&
              <div className='col-md-12 text-center my-4'>
                <SyncLoader color="#2C64C3" className='mx-auto' />
              </div>
            }
 <div className="col-md-12 filters">
              <Paper className='py-1 mb-2 px-3'>
                <div className="row">
                
                <div className="col-auto px-1">
                    <label htmlFor="">Name:</label>
                    <select value={name} onChange={(e) => setName(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      {[...new Set(todayExpenses && todayExpenses.map(data => data.name))].map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      
                    </select>
                  </div>
                  <div className="col-auto px-1">
                    <label htmlFor="">Expense Category:</label>
                    <select value={expe_Category} onChange={(e) => setExpe_Category(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      {[...new Set(todayExpenses && todayExpenses.map(data => data.expCategory))].map(expCategory => (
                          <option key={expCategory} value={expCategory}>{expCategory}</option>
                        ))}
                    
                    </select>
                  </div>
                  <div className="col-auto px-1">
                    <label htmlFor="">Payment Via:</label>
                    <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      {[...new Set(todayExpenses && todayExpenses.map(data => data.payment_Via))].map(payment_Via => (
                          <option key={payment_Via} value={payment_Via}>{payment_Via}</option>
                        ))}
                     
                    </select>
                  </div>
                  <div className="col-auto px-1">
                    <label htmlFor="">Payment Type:</label>
                    <select value={payment_Type} onChange={(e) => setPayment_Type(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      {[...new Set(todayExpenses && todayExpenses.map(data => data.payment_Type))].map(payment_Type => (
                          <option key={payment_Type} value={payment_Type}>{payment_Type}</option>
                        ))}
                      
                    </select>
                  </div>
                  <div className="col-auto px-1">
                    <label htmlFor="">Cash Type:</label>
                    <select value={cash_Type} onChange={(e) => setCash_Type(e.target.value)} className='m-0 p-1'>
                      <option value="">All</option>
                      <option value="cash">Cash</option>
                      <option value="banks">Banks</option>
                    </select>
                  </div>
                </div>
              </Paper>
            </div>
            {!loading2 &&
              <div className='col-md-12'>
                <Paper className='py-3 mb-1 px-2 detail_table'>
                  <TableContainer >
                    <Table stickyHeader sx={{ maxHeight: 600 }}>
                      <TableHead className="thead" >
                        <TableRow>
                          <TableCell className='label border'>SN</TableCell>
                          <TableCell className='label border'>Date</TableCell>
                          <TableCell className='label border'>Person</TableCell>
                          <TableCell className='label border'>E_Category</TableCell>
                          <TableCell className='label border'>E_Amount</TableCell>
                          <TableCell className='label border'>Payment_Via</TableCell>
                          <TableCell className='label border'>Payment_Type</TableCell>
                          <TableCell className='label border'>Slip_No</TableCell>
                          <TableCell className='label border'>Details</TableCell>
                          <TableCell className='label border'>Invoice</TableCell>
                          <TableCell className='label border'>CUR_Country</TableCell>
                          <TableCell className='label border'>CUR_Rate</TableCell>
                          <TableCell className='label border'>CUR_Amount</TableCell>
                          <TableCell className='label border'>Slip_Pic</TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredExpenses && filteredExpenses.length > 0 ? filteredExpenses.map((expense, outerIndex) => (
                          // Map through the payment array

                          <>
                            <TableRow key={expense?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                              <>
                                <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                <TableCell className='border data_td text-center'>{expense.date}</TableCell>
                                <TableCell className='border data_td text-center'>{expense.name}</TableCell>
                                <TableCell className='border data_td text-center'>{expense.expCategory}</TableCell>
                                <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{expense.payment_Out}</TableCell>
                                <TableCell className='border data_td text-center'>{expense.payment_Via}</TableCell>
                                <TableCell className='border data_td text-center'>{expense.payment_Type}</TableCell>
                                <TableCell className='border data_td text-center'>{expense?.slip_No}</TableCell>
                                <TableCell className='border data_td text-center'>{expense?.details}</TableCell>
                                <TableCell className='border data_td text-center'>{expense?.invoice}</TableCell>
                                <TableCell className='border data_td text-center'>{expense?.curr_Country}</TableCell>
                                <TableCell className='border data_td text-center'>{expense?.curr_Rate}</TableCell>
                                <TableCell className='border data_td text-center'>{expense?.curr_Amount}</TableCell>
                                <TableCell className='border data_td text-center'>{expense.slip_Pic ? <img src={expense.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>

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

                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                          <TableCell className='border data_td text-center bg-danger text-white text-bold'>{filteredExpenses.reduce((total, payment) => total + payment.payment_Out, 0)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            }

            <div className="col-md-12">
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Protectors</h4>
                </div>
                <div className="right d-flex">
                  {todayProtectors && todayProtectors.length > 0 &&
                    <>

                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadProtectorExcel}>Download </button>
                      <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printProtectorTable}>Print </button>
                    </>
                  }

                </div>
              </Paper>
            </div>
            {loading3 &&
              <div className='col-md-12 text-center my-4'>
                <SyncLoader color="#2C64C3" className='mx-auto' />
              </div>
            }

            {!loading3 &&
              <div className='col-md-12'>
                <Paper className='py-3 mb-1 px-2 detail_table'>
                  <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader  >
                      <TableHead className="thead" >
                        <TableRow>
                          <TableCell className='label border'>SN</TableCell>
                          <TableCell className='label border'>Date</TableCell>
                          <TableCell className='label border'>Protector</TableCell>
                          <TableCell className='label border'>Category</TableCell>
                          <TableCell className='label border'>Payment_Via</TableCell>
                          <TableCell className='label border'>Payment_Type</TableCell>
                          <TableCell className='label border'>Slip_No</TableCell>
                          <TableCell className='label border'>Cash_Out</TableCell>
                          <TableCell className='label border'>Details</TableCell>
                          <TableCell className='label border'>Invoice</TableCell>
                          <TableCell className='label border'>Slip_Pic</TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {todayProtectors && todayProtectors.length > 0 ? todayProtectors.map((cash, outerIndex) => (
                          // Map through the payment array

                          <>
                            <TableRow key={cash?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                              <>
                                <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                <TableCell className='border data_td text-center'>{cash.date}</TableCell>
                                <TableCell className='border data_td text-center'>{cash.supplierName}</TableCell>
                                <TableCell className='border data_td text-center'>{cash.category}</TableCell>
                                <TableCell className='border data_td text-center'>{cash.payment_Via}</TableCell>
                                <TableCell className='border data_td text-center'>{cash.payment_Type}</TableCell>
                                <TableCell className='border data_td text-center'>{cash?.slip_No}</TableCell>
                                <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{cash.payment_Out}</TableCell>
                                <TableCell className='border data_td text-center'>{cash?.details}</TableCell>
                                <TableCell className='border data_td text-center'>{cash?.invoice}</TableCell>
                                <TableCell className='border data_td text-center'>{cash.slip_Pic ? <img src={cash.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>

                              </>

                            </TableRow>


                          </>

                        )) : <TableRow>
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
                          <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                          <TableCell className='border data_td text-center bg-danger text-white text-bold'>{todayProtectors && todayProtectors.reduce((total, payment) => total + payment.payment_Out, 0)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            }


            <div className="col-md-12">
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <h4>Employees</h4>
                </div>
                <div className="right d-flex">
                  {todayEmployees && todayEmployees.length > 0 &&
                    <>

                      <button className='btn excel_btn m-1 btn-sm' onClick={downloadEmployeesPayments}>Download </button>
                      <button className='btn excel_btn m-1 btn-sm bg-success border-0' onClick={printEmployeeTable}>Print </button>
                    </>
                  }

                </div>
              </Paper>
            </div>
            {loading4 &&
              <div className='col-md-12 text-center my-4'>
                <SyncLoader color="#2C64C3" className='mx-auto' />
              </div>
            }

            {!loading4 &&
              <div className='col-md-12'>
                <Paper className='py-3 mb-1 px-2 detail_table'>
                  <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader  >
                      <TableHead className="thead" >
                        <TableRow>
                          <TableCell className='label border'>SN</TableCell>
                          <TableCell className='label border'>Date</TableCell>
                          <TableCell className='label border'>Employee_Name</TableCell>
                          <TableCell className='label border'>Category</TableCell>
                          <TableCell className='label border'>Payment_Via</TableCell>
                          <TableCell className='label border'>Payment_Type</TableCell>
                          <TableCell className='label border'>Slip_No</TableCell>
                          <TableCell className='label border'>Details</TableCell>
                          <TableCell className='label border'>Cash_Out</TableCell>
                          <TableCell className='label border'>Invoice</TableCell>
                          <TableCell className='label border'>Payment_In_Curr</TableCell>
                          <TableCell className='label border'>CUR_Rate</TableCell>
                          <TableCell className='label border'>CUR_Amount</TableCell>
                          <TableCell className='label border'>Slip_Pic</TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {todayEmployees && todayEmployees.length > 0 ? todayEmployees.map((paymentItem, outerIndex) => (
                          // Map through the payment array

                          <>
                            <TableRow key={paymentItem?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                              <>
                                <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.date}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.employeeName}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.category}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.payment_Via}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.payment_Type}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.slip_No}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.details}</TableCell>
                                <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.payment_Out}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.invoice}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.payment_Out_Curr}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.curr_Rate}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.curr_Amount}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem.slip_Pic ? <img src={paymentItem.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>

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

                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                          <TableCell className='border data_td text-center bg-danger text-white text-bold'>{todayEmployees && todayEmployees.reduce((total, payment) => total + payment.payment_Out, 0)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            }
          </div>
        </div>
      </div>

    </>
  )
}
