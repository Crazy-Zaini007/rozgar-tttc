import React from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from './components/Sidebar';
import { useAuthContext } from './hooks/userHooks/UserAuthHook'
// User Login/Signup Section
import Signup from './components/Signup';
import Login from './components/Login';

// Enteries Section
import NewEntry from './components/enteries/NewEntry';
import Dashboard from './components/Dashboard';
import CashinHand from './components/CashinHand';
import EntryDetails from './components/enteries/EntryDetails';
import EntryReports from './components/enteries/EntryReports';
// Supplier Section
import SupPaymentIn from './components/suppliers/SupPaymentIn';
import SupDetails from './components/suppliers/SupDetails';
import SupPaymentOut from './components/suppliers/SupPaymentOut'
import SupPayReturn from './components/suppliers/SupPayReturn.jsx';
import SupCandPaymentIn from './components/suppliers/SupCandPaymentIn'
import SupCandPaymentOut from './components/suppliers/SupCandPaymentOut'
import SupCandPayReturn from './components/suppliers/SupCandPayReturn.jsx';
import SupCandDetails from './components/suppliers/SupCandDetails';

//Agent Section
import AgentPaymentIn from './components/agents/AgentPaymentIn'
import AgentDetails from './components/agents/AgentDetails.jsx'
import AgentPaymentOut from './components/agents/AgentPaymentOut.jsx'
import AgentPayReturn from './components/agents/AgentPayReturn.jsx'
import AgentCandPaymentIn from './components/agents/AgentCandPaymentIn'
import AgentCandDetails from './components/agents/AgentCandDetails.jsx'
import AgentCandPaymentOut from './components/agents/AgentCandPaymentOut.jsx'
import AgentCandPayReturn from './components/agents/AgentCandPayReturn.jsx'
//Candidates Section
import CandPaymentIn from './components/candidates/CandPaymentIn'
import CandDetails from './components/candidates/CandDetails.jsx'
import CandPaymentOut from './components/candidates/CandPaymentOut.jsx'
import CandPayReturn from './components/candidates/CandPayReturn.jsx'

// Ticket Section 
import TicketPayIn from './components/tickets/TicketPayIn.jsx';
import TicketPayOut from './components/tickets/TicketPayOut'
import TicketPayReturn from './components/tickets/TicketPayReturn.jsx';
import TicketDetails from './components/tickets/TicketDetails.jsx';

// Azad Visa section
import AzadVisaPayIn from './components/azadVisa/AzadVisaPayIn';
import AzadVisaPayOut from './components/azadVisa/AzadVisaPayOut'
import AzadVisaPayReturn from './components/azadVisa/AzadVisaPayReturn.jsx';
import AzadVisaDetails from './components/azadVisa/AzadVisaDetails.jsx';

// Visit Visa section
import VisitPayIn from './components/visitVisa/VisitPayIn';
import VisitPayOut from './components/visitVisa/VisitPayOut'
import VisitPayReturn from './components/visitVisa/VisitPayReturn.jsx';
import VisitDetails from './components/visitVisa/VisitDetails.jsx';

// Credits Debits With Cash in hand
import CDWCPaymentIn from './components/creditsDebitsWC/CDWCPaymentIn.jsx'
import CDWCPaymentOut from './components/creditsDebitsWC/CDWCPaymentOut.jsx'
import CDWCDetails from './components/creditsDebitsWC/CDWCDetails.jsx'


// Credits Debits WithOut Cash in hand
import CDWOCPaymentIn from './components/creditsDebitsWOC/CDWOCPaymentIn.jsx'
import CDWOCPaymentOut from './components/creditsDebitsWOC/CDWOCPaymentOut.jsx'
import CDWOCDetails from './components/creditsDebitsWOC/CDWOCDetails.jsx'


// Setting Section
import VisaSection from './components/setting/sections/VisaSection';
import TicketSection from './components/setting/sections/TicketSection';
import VisitSection from './components/setting/sections/VisitSection';
import AzadSection from './components/setting/sections/AzadSection';
import CrediterDebiterSection from './components/setting/sections/Crediter_Debiter_Section';
import ProtectorSection from './components/setting/sections/ProtectorSection.jsx'
import OtherSection from './components/setting/sections/OtherSection';

// Protector
import ProtectorPaymentOut from './components/protectors/ProtectorPaymentOut.jsx'
import ProtectorDetails from './components/protectors/ProtectorDetails.jsx'



//Expenses Section
import AddExpense from './components/expenses/AddExpense.jsx'
import ExpenseDetails from './components/expenses/ExpenseDetails.jsx'

// All Reports

import OverAllVisaWise from './components/all_Reports/OverAllVisaWise.jsx'
import OverAllVisaPayment from './components/all_Reports/OverAllVisaPayment.jsx'
import ReceivableReports from './components/all_Reports/ReceivableReports.jsx'
import PayableReports from './components/all_Reports/PayableReports.jsx'
import Invoice from './components/all_Reports/Invoice.jsx'
import ExpenseOverAllReport from './components/all_Reports/ExpenseOverAllReport'
import OverAllAgentReport from './components/all_Reports/agentDetails/OverAllAgentDetails'
import OverAllCandReport from './components/all_Reports/candidateDetails/OverAllCandDetails'
import OverAllSupReport from './components/all_Reports/supplierDetails/OverAllSupDetails'
import CashInHandWOE from './components/all_Reports/CashInHandWOE.jsx';
import ProfitLose from './components/all_Reports/ProfitLose.jsx'
import DayBook from './components/all_Reports/DayBook.jsx'
import User from './components/user/User.jsx'

// Employees Section
import AddEmployee from './components/employee/AddEmployee.jsx'
import AddPayment from './components/employee/AddPayment.jsx'
import AddVacation from './components/employee/AddVacation.jsx'
import EmployeeDetails from './components/employee/EmployeeDetails.jsx'


function App() {
  // user Info
  const { user } = useAuthContext()
  
  return (
    <div className="App">
      <BrowserRouter>
        {user && <Sidebar></Sidebar>}
        {/* <Navbar/> */}
        <Routes>

          {/* User Signup/Login Routes */}
          <Route path='/' element={!user && <Signup></Signup>}></Route>
          <Route path='/rozgar/login' element={!user && <Login></Login>}></Route>

          {/* When user is Logged in */}


          <Route exact path='/rozgar/dashboard' element={user && <Dashboard></Dashboard> }></Route>
          <Route exact path='/rozgar/cash_in_hand' element={user && <CashinHand></CashinHand> }></Route>

          {/* Enteries Routes */}
          <Route exact path='/rozgar/enteries/add_new_entry' element={user && <NewEntry></NewEntry> }></Route>
          <Route exact path='/rozgar/enteries/entry_details' element={user && <EntryDetails></EntryDetails> }></Route>
          <Route exact path='/rozgar/enteries/reports_details' element={user && <EntryReports></EntryReports> }></Route>

          {/* Supplier Routes */}
          <Route exact path='/rozgar/supplier/payment_in' element={user && <SupPaymentIn></SupPaymentIn> }></Route>
          <Route exact path='/rozgar/supplier/payment_out' element={user && <SupPaymentOut></SupPaymentOut> }></Route>
          <Route exact path='/rozgar/supplier/details' element={user && <SupDetails></SupDetails> }></Route>
          <Route exact path='/rozgar/supplier/payment_return' element={user && <SupPayReturn></SupPayReturn> }></Route>
          <Route exact path='/rozgar/supplier/cand_vise_payment_in' element={user && <SupCandPaymentIn></SupCandPaymentIn> }></Route>
          <Route exact path='/rozgar/supplier/cand_vise_payment_out' element={user && <SupCandPaymentOut></SupCandPaymentOut> }></Route>
          <Route exact path='/rozgar/supplier/cand_vise_payment_details' element={user && <SupCandDetails></SupCandDetails> }></Route>
          <Route exact path='/rozgar/supplier/cand_vise_payment_return' element={user && <SupCandPayReturn></SupCandPayReturn> }></Route>
          {/* Agents Routes */}
          <Route exact path='/rozgar/agents/payment_in' element={user && <AgentPaymentIn></AgentPaymentIn> }></Route>
          <Route exact path='/rozgar/agents/payment_out' element={user && <AgentPaymentOut></AgentPaymentOut> }></Route>
          <Route exact path='/rozgar/agents/details' element={user && <AgentDetails></AgentDetails> }></Route>
          <Route exact path='/rozgar/agents/payment_return' element={user && <AgentPayReturn></AgentPayReturn> }></Route>
          <Route exact path='/rozgar/agents/cand_vise_payment_in' element={user && <AgentCandPaymentIn></AgentCandPaymentIn> }></Route>
          <Route exact path='/rozgar/agents/cand_vise_payment_out' element={user && <AgentCandPaymentOut></AgentCandPaymentOut> }></Route>
          <Route exact path='/rozgar/agents/cand_vise_payment_details' element={user && <AgentCandDetails></AgentCandDetails> }></Route>
          <Route exact path='/rozgar/agents/cand_vise_payment_return' element={user && <AgentCandPayReturn></AgentCandPayReturn> }></Route>

          {/* Ticket Routes */}
          <Route exact path='/rozgar/tickets/payment_in' element={user && <TicketPayIn></TicketPayIn> }></Route>
          <Route exact path='/rozgar/tickets/payment_out' element={user && <TicketPayOut></TicketPayOut> }></Route>
          <Route exact path='/rozgar/tickets/payment_return' element={user && <TicketPayReturn></TicketPayReturn> }></Route>
          <Route exact path='/rozgar/tickets/details' element={user && <TicketDetails></TicketDetails> }></Route>

          {/* Candidates Routes */}
          <Route exact path='/rozgar/candidates/payment_in' element={user && <CandPaymentIn></CandPaymentIn> }></Route>
          <Route exact path='/rozgar/candidates/payment_out' element={user && <CandPaymentOut></CandPaymentOut> }></Route>
          <Route exact path='/rozgar/candidates/details' element={user && <CandDetails></CandDetails> }></Route>
          <Route exact path='/rozgar/candidates/payment_return' element={user && <CandPayReturn></CandPayReturn> }></Route>
          
          {/* AzadVisa Routes */}
          <Route exact path='/rozgar/azad/payment_in' element={user && <AzadVisaPayIn></AzadVisaPayIn> }></Route>
          <Route exact path='/rozgar/azad/payment_out' element={user && <AzadVisaPayOut></AzadVisaPayOut> }></Route>
          <Route exact path='/rozgar/azad/details' element={user && <AzadVisaDetails></AzadVisaDetails> }></Route>
          <Route exact path='/rozgar/azad/payment_return' element={user && <AzadVisaPayReturn></AzadVisaPayReturn> }></Route>

          {/* VisitVisa Routes */}
          <Route exact path='/rozgar/visits/payment_in' element={user && <VisitPayIn></VisitPayIn> }></Route>
          <Route exact path='/rozgar/visits/payment_out' element={user && <VisitPayOut></VisitPayOut> }></Route>
          <Route exact path='/rozgar/visits/details' element={user && <VisitDetails></VisitDetails> }></Route>
          <Route exact path='/rozgar/visits/payment_return' element={user && <VisitPayReturn></VisitPayReturn> }></Route>


          {/* Protector Routes  */}
          <Route exact path='/rozgar/protector/payment_out' element={user && <ProtectorPaymentOut></ProtectorPaymentOut> }></Route>
          <Route exact path='/rozgar/protector/details' element={user && <ProtectorDetails></ProtectorDetails> }></Route>


          {/* Credits Debits With Cash IN hand Routes */}
          <Route exact path='/rozgar/credites&debits/payment_in/with_cash_in_hand' element={user && <CDWCPaymentIn></CDWCPaymentIn> }></Route>
          <Route exact path='/rozgar/credites&debits/payment_out/with_cash_in_hand' element={user && <CDWCPaymentOut></CDWCPaymentOut> }></Route>
          <Route exact path='/rozgar/credites&debits/details/with_cash_in_hand' element={user && <CDWCDetails></CDWCDetails> }></Route>


          {/* Credits Debits WithOut Cash IN hand Routes */}
          <Route exact path='/rozgar/credites&debits/payment_in/without_cash_in_hand' element={user && <CDWOCPaymentIn></CDWOCPaymentIn> }></Route>
          <Route exact path='/rozgar/credites&debits/payment_out/without_cash_in_hand' element={user && <CDWOCPaymentOut></CDWOCPaymentOut> }></Route>
          <Route exact path='/rozgar/credites&debits/details/without_cash_in_hand' element={user && <CDWOCDetails></CDWOCDetails> }></Route>


          {/* Setting Routes */}
          <Route exact path='/rozgar/setting/visa_section' element={user && <VisaSection></VisaSection> }></Route>
          <Route exact path='/rozgar/setting/ticket_section' element={user && <TicketSection></TicketSection> }></Route>
          <Route exact path='/rozgar/setting/visit_section' element={user && <VisitSection></VisitSection> }></Route>
          <Route exact path='/rozgar/setting/azad_section' element={user && <AzadSection></AzadSection> }></Route>
          <Route exact path='/rozgar/setting/crediter_debiter_section' element={user && <CrediterDebiterSection></CrediterDebiterSection> }></Route>
          <Route exact path='/rozgar/setting/protector_section' element={user && <ProtectorSection></ProtectorSection> }></Route>
          <Route exact path='/rozgar/setting/other_section' element={user && <OtherSection></OtherSection> }></Route>


          {/* Expense Routes */}
          <Route exact path='/rozgar/expenses/add_new_expense' element={user && <AddExpense></AddExpense> }></Route>
          <Route exact path='/rozgar/expenses/expenses_details' element={user && <ExpenseDetails></ExpenseDetails> }></Route>
          
          {/* Reports */}
          <Route exact path='/rozgar/reports/overall_visa_wise' element={user && <OverAllVisaWise></OverAllVisaWise> }></Route>
          <Route exact path='/rozgar/reports/overall_payment_visa_wise' element={user && <OverAllVisaPayment></OverAllVisaPayment> }></Route>
          <Route exact path='/rozgar/reports/receivable_reports' element={user && <ReceivableReports></ReceivableReports> }></Route>
          <Route exact path='/rozgar/reports/payable_reports' element={user && <PayableReports></PayableReports> }></Route>
          <Route exact path='/rozgar/reports/invoice' element={user && <Invoice></Invoice> }></Route>
          <Route exact path='/rozgar/reports/expenses_reports' element={user && <ExpenseOverAllReport></ExpenseOverAllReport> }></Route>
          <Route exact path='/rozgar/reports/agents_reports' element={user && <OverAllAgentReport></OverAllAgentReport> }></Route>
          <Route exact path='/rozgar/reports/candidates_reports' element={user && <OverAllCandReport></OverAllCandReport> }></Route>
          <Route exact path='/rozgar/reports/suppliers_reports' element={user && <OverAllSupReport></OverAllSupReport> }></Route>
          <Route exact path='/rozgar/reports/cash_in_hand/with_out_expenses' element={user && <CashInHandWOE></CashInHandWOE> }></Route>
          <Route exact path='/rozgar/reports/profit_lose' element={user && <ProfitLose></ProfitLose> }></Route>
          <Route exact path='/rozgar/reports/payroll_reports' element={user && <EmployeeDetails></EmployeeDetails> }></Route>

          <Route exact path='/rozgar/reports/day_book' element={user && <DayBook></DayBook> }></Route>
          <Route exact path='/rozgar/user/account' element={user && <User></User> }></Route>

          {/* Employee Routes */}
          <Route exact path='/rozgar/employees/add' element={user && <AddEmployee></AddEmployee> }></Route>
          <Route exact path='/rozgar/employees/add_payment' element={user && <AddPayment></AddPayment> }></Route>
          <Route exact path='/rozgar/employees/add_leave' element={user && <AddVacation></AddVacation> }></Route>
          <Route exact path='/rozgar/employees/employees_details' element={user && <EmployeeDetails></EmployeeDetails> }></Route>


        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="custom-toast-container"
      />
    </div>
  );
}

export default App;
