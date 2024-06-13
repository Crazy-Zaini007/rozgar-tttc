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
import Navbar from './components/Navbar.jsx';


// Enteries Section

import NewEntry from './components/enteries/NewEntry';
import Dashboard from './components/Dashboard';
import CashinHand from './components/CashinHand';
import BankCash from './components/BankCash.jsx'
import DirectInOut from './components/DirectIn&Out.jsx'




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

// Assets
import AssetsPaymentIn from './components/assets/AssetsPaymentIn.jsx'
import AssetsPaymentOut from './components/assets/AssetsPaymentOut.jsx'
import AssetsDetails from './components/assets/AssetsDetails.jsx'

// Setting Section
import VisaSection from './components/setting/sections/VisaSection';
import TicketSection from './components/setting/sections/TicketSection';
import VisitSection from './components/setting/sections/VisitSection';
import AzadSection from './components/setting/sections/AzadSection';
import CrediterDebiterSection from './components/setting/sections/Crediter_Debiter_Section';
import ProtectorSection from './components/setting/sections/ProtectorSection.jsx'
import AssetsSection from './components/setting/sections/AssetSection.jsx'

import OtherSection from './components/setting/sections/OtherSection';

// Protector
import ProtectorPaymentOut from './components/protectors/ProtectorPaymentOut.jsx'
import ProtectorDetails from './components/protectors/ProtectorDetails.jsx'



//Expenses Section
import AddExpense from './components/expenses/AddExpense.jsx'
import AddMulExpenses from './components/expenses/AddMulExpenses.jsx'
import ExpenseDetails from './components/expenses/ExpenseDetails.jsx'

// All Reports

import OverAllVisaWise from './components/all_Reports/OverAllVisaWise.jsx'
import OverAllVisaPayment from './components/all_Reports/OverAllVisaPayment.jsx'
import ReceivableReports from './components/all_Reports/ReceivableReports.jsx'
import PayableReports from './components/all_Reports/PayableReports.jsx'
import Invoice from './components/all_Reports/Invoice.jsx'
import ExpenseOverAllReport from './components/all_Reports/ExpenseOverAllReport'
import CashInHandWOE from './components/all_Reports/CashInHandWOE.jsx';
import SummerizeProfitLose from './components/all_Reports/SummerizeProfitLose.jsx'
import ProfitReport from './components/all_Reports/ProfiteReport.jsx'
import LossReport from './components/all_Reports/LossReport.jsx'
import ProfitLossReport from './components/all_Reports/ProfitLoseReport.jsx'
import NormalPayments from './components/all_Reports/NormalPayments.jsx'
import AdvancePayments from './components/all_Reports/AdvancePayments.jsx'
import AgentsReports from './components/all_Reports/AgentsReports.jsx'
import SuppliersReports from './components/all_Reports/SuppliersReports.jsx'
import CandidatesReports from './components/all_Reports/CandidatesReports.jsx'
import AzadReports from './components/all_Reports/azadReports/AzadReoprts.jsx'
import TicketReports from './components/all_Reports/ticketReports/TicketReoprts.jsx'
import VisitReports from './components/all_Reports/visitReports/VisitReports.jsx'
import EmployeeReports from './components/all_Reports/EmployeeReports.jsx'
import NetVisaReports from './components/all_Reports/NetVisaReports.jsx'
import OverAllVisaProfitReports from './components/all_Reports/OverAllVisaProfitReports.jsx'
import CandVisaPaymentReports from './components/all_Reports/CandWisePaymentReports.jsx'
import OverAllSystemPaymentReport from './components/all_Reports/OverAllSystemPaymentReport.jsx'
import CombinePaymentReports from './components/all_Reports/CombinePaymentReport.jsx'


import DayBook from './components/all_Reports/DayBook.jsx'
import User from './components/user/User.jsx'

// Employees Section
import AddEmployee from './components/employee/AddEmployee.jsx'
import AddPayment from './components/employee/AddPayment.jsx'
import AddVacation from './components/employee/AddVacation.jsx'
import EmployeeDetails from './components/employee/EmployeeDetails.jsx'
import AddSalaryMonth from './components/employee/AddSalaryMonth.jsx'


// Reminders
import Reminders from './components/Reminders.jsx'
//Notes
import Notifications from './components/Notifications.jsx'

//Recycle Bin
import RecycleBin from './components/RecycleBin.jsx'
//Notes
import Notes from './components/Notes.jsx'

// Backup
import Backup from './components/Backup.jsx'


function App() {
  // user Info
  const { user } = useAuthContext()


  return (
    <div className="App">
      <BrowserRouter>
      {user && <Navbar />}

        {user && <Sidebar />}
        {/* <Navbar/> */}
        <Routes>

          {/* User Signup/Login Routes */}
          <Route path='/' element={!user ? <Signup></Signup> : <Dashboard></Dashboard>}></Route>
          <Route path='/rozgar/login' element={!user ? <Login></Login> : <Navigate to='/'></Navigate>}></Route>
          {/* When user is Logged in */}
          <Route exact path='/rozgar/cash_in_hand' element={user && <CashinHand></CashinHand>}></Route>
          <Route exact path='/rozgar/bank_cash' element={user && <BankCash></BankCash>}></Route>
          <Route exact path='/rozgar/direct/payment_in_out' element={user && <DirectInOut></DirectInOut>}></Route>
        

          {/* Enteries Routes */}
          <Route exact path='/rozgar/enteries/add_new_entry' element={user && <NewEntry></NewEntry>}></Route>
          <Route exact path='/rozgar/enteries/entry_details' element={user && <EntryDetails></EntryDetails>}></Route>
          <Route exact path='/rozgar/enteries/reports_details' element={user && <EntryReports></EntryReports>}></Route>

          {/* Supplier Routes */}
          <Route path='/rozgar/supplier/payment_in' element={user && <SupPaymentIn></SupPaymentIn>}></Route>
          <Route path='/rozgar/supplier/payment_out' element={user && <SupPaymentOut></SupPaymentOut>}></Route>
          <Route path='/rozgar/supplier/details' element={user && <SupDetails></SupDetails>}></Route>
          <Route path='/rozgar/supplier/payment_return' element={user && <SupPayReturn></SupPayReturn>}></Route>
          <Route path='/rozgar/supplier/cand_vise_payment_in' element={user && <SupCandPaymentIn></SupCandPaymentIn>}></Route>
          <Route path='/rozgar/supplier/cand_vise_payment_out' element={user && <SupCandPaymentOut></SupCandPaymentOut>}></Route>
          <Route path='/rozgar/supplier/cand_vise_payment_details' element={user && <SupCandDetails></SupCandDetails>}></Route>
          <Route path='/rozgar/supplier/cand_vise_payment_return' element={user && <SupCandPayReturn></SupCandPayReturn>}></Route>
          {/* Agents Routes */}
          <Route path='/rozgar/agents/payment_in' element={user && <AgentPaymentIn></AgentPaymentIn>}></Route>
          <Route path='/rozgar/agents/payment_out' element={user && <AgentPaymentOut></AgentPaymentOut>}></Route>
          <Route path='/rozgar/agents/details' element={user && <AgentDetails></AgentDetails>}></Route>
          <Route path='/rozgar/agents/payment_return' element={user && <AgentPayReturn></AgentPayReturn>}></Route>
          <Route path='/rozgar/agents/cand_vise_payment_in' element={user && <AgentCandPaymentIn></AgentCandPaymentIn>}></Route>
          <Route path='/rozgar/agents/cand_vise_payment_out' element={user && <AgentCandPaymentOut></AgentCandPaymentOut>}></Route>
          <Route path='/rozgar/agents/cand_vise_payment_details' element={user && <AgentCandDetails></AgentCandDetails>}></Route>
          <Route path='/rozgar/agents/cand_vise_payment_return' element={user && <AgentCandPayReturn></AgentCandPayReturn>}></Route>

          {/* Ticket Routes */}
          <Route path='/rozgar/tickets/payment_in' element={user && <TicketPayIn></TicketPayIn>}></Route>
          <Route path='/rozgar/tickets/payment_out' element={user && <TicketPayOut></TicketPayOut>}></Route>
          <Route path='/rozgar/tickets/payment_return' element={user && <TicketPayReturn></TicketPayReturn>}></Route>
          <Route path='/rozgar/tickets/details' element={user && <TicketDetails></TicketDetails>}></Route>

          {/* Candidates Routes */}
          <Route path='/rozgar/candidates/payment_in' element={user && <CandPaymentIn></CandPaymentIn>}></Route>
          <Route path='/rozgar/candidates/payment_out' element={user && <CandPaymentOut></CandPaymentOut>}></Route>
          <Route path='/rozgar/candidates/details' element={user && <CandDetails></CandDetails>}></Route>
          <Route path='/rozgar/candidates/payment_return' element={user && <CandPayReturn></CandPayReturn>}></Route>

          {/* AzadVisa Routes */}
          <Route path='/rozgar/azad/payment_in' element={user && <AzadVisaPayIn></AzadVisaPayIn>}></Route>
          <Route path='/rozgar/azad/payment_out' element={user && <AzadVisaPayOut></AzadVisaPayOut>}></Route>
          <Route path='/rozgar/azad/details' element={user && <AzadVisaDetails></AzadVisaDetails>}></Route>
          <Route path='/rozgar/azad/payment_return' element={user && <AzadVisaPayReturn></AzadVisaPayReturn>}></Route>

          {/* VisitVisa Routes */}
          <Route path='/rozgar/visits/payment_in' element={user && <VisitPayIn></VisitPayIn>}></Route>
          <Route path='/rozgar/visits/payment_out' element={user && <VisitPayOut></VisitPayOut>}></Route>
          <Route path='/rozgar/visits/details' element={user && <VisitDetails></VisitDetails>}></Route>
          <Route path='/rozgar/visits/payment_return' element={user && <VisitPayReturn></VisitPayReturn>}></Route>


          {/* Protector Routes  */}
          <Route path='/rozgar/protector/payment_out' element={user && <ProtectorPaymentOut></ProtectorPaymentOut>}></Route>
          <Route path='/rozgar/protector/details' element={user && <ProtectorDetails></ProtectorDetails>}></Route>


          {/* Credits Debits With Cash IN hand Routes */}
          <Route path='/rozgar/credites&debits/payment_in/with_cash_in_hand' element={user && <CDWCPaymentIn></CDWCPaymentIn>}></Route>
          <Route path='/rozgar/credites&debits/payment_out/with_cash_in_hand' element={user && <CDWCPaymentOut></CDWCPaymentOut>}></Route>
          <Route path='/rozgar/credites&debits/details/with_cash_in_hand' element={user && <CDWCDetails></CDWCDetails>}></Route>


          {/* Credits Debits WithOut Cash IN hand Routes */}
          <Route path='/rozgar/credites&debits/payment_in/without_cash_in_hand' element={user && <CDWOCPaymentIn></CDWOCPaymentIn>}></Route>
          <Route path='/rozgar/credites&debits/payment_out/without_cash_in_hand' element={user && <CDWOCPaymentOut></CDWOCPaymentOut>}></Route>
          <Route path='/rozgar/credites&debits/details/without_cash_in_hand' element={user && <CDWOCDetails></CDWOCDetails>}></Route>

    {/* Assets Routes */}
         <Route path='/rozgar/assets/payment_in' element={user && <AssetsPaymentIn></AssetsPaymentIn>}></Route>
          <Route path='/rozgar/assets/payment_out' element={user && <AssetsPaymentOut></AssetsPaymentOut>}></Route>
          <Route path='/rozgar/assets/details' element={user && <AssetsDetails></AssetsDetails>}></Route>


          {/* Setting Routes */}
          <Route path='/rozgar/setting/visa_section' element={user && <VisaSection></VisaSection>}></Route>
          <Route path='/rozgar/setting/ticket_section' element={user && <TicketSection></TicketSection>}></Route>
          <Route path='/rozgar/setting/visit_section' element={user && <VisitSection></VisitSection>}></Route>
          <Route path='/rozgar/setting/azad_section' element={user && <AzadSection></AzadSection>}></Route>
          <Route path='/rozgar/setting/crediter_debiter_section' element={user && <CrediterDebiterSection></CrediterDebiterSection>}></Route>
          <Route path='/rozgar/setting/protector_section' element={user && <ProtectorSection></ProtectorSection>}></Route>
          <Route path='/rozgar/setting/assets_section' element={user && <AssetsSection></AssetsSection>}></Route>

          <Route path='/rozgar/setting/other_section' element={user && <OtherSection></OtherSection>}></Route>


          {/* Expense Routes */}
          <Route path='/rozgar/expenses/add_new_expense' element={user && <AddExpense></AddExpense>}></Route>
          <Route path='/rozgar/expenses/add/mul_expense' element={user && <AddMulExpenses></AddMulExpenses>}></Route>
          <Route path='/rozgar/expenses/expenses_details' element={user && <ExpenseDetails></ExpenseDetails>}></Route>

          {/* Reports */}
          <Route path='/rozgar/reports/overall_visa_wise' element={user && <OverAllVisaWise></OverAllVisaWise>}></Route>
          <Route path='/rozgar/reports/overall_payment_visa_wise' element={user && <OverAllVisaPayment></OverAllVisaPayment>}></Route>
          <Route path='/rozgar/reports/receivable_reports' element={user && <ReceivableReports></ReceivableReports>}></Route>
          <Route path='/rozgar/reports/payable_reports' element={user && <PayableReports></PayableReports>}></Route>
          <Route path='/rozgar/reports/invoice' element={user && <Invoice></Invoice>}></Route>
          <Route path='/rozgar/reports/expenses_reports' element={user && <ExpenseOverAllReport></ExpenseOverAllReport>}></Route>
          <Route path='/rozgar/reports/agents_reports' element={user && <AgentsReports></AgentsReports>}></Route>
          <Route path='/rozgar/reports/candidates_reports' element={user && <CandidatesReports></CandidatesReports>}></Route>
          <Route path='/rozgar/reports/suppliers_reports' element={user && <SuppliersReports></SuppliersReports>}></Route>
          <Route path='/rozgar/reports/cash_in_hand/with_out_expenses' element={user && <CashInHandWOE></CashInHandWOE>}></Route>
          <Route path='/rozgar/reports/summerize_profit_lose' element={user && <SummerizeProfitLose></SummerizeProfitLose>}></Route>
          <Route path='/rozgar/reports/profit_lose_report' element={user && <ProfitLossReport></ProfitLossReport>}></Route>
          <Route path='/rozgar/reports/profit_report' element={user && <ProfitReport></ProfitReport>}></Route>
          <Route path='/rozgar/reports/lose_report' element={user && <LossReport></LossReport>}></Route>
          <Route path='/rozgar/reports/normal_payments' element={user && <NormalPayments></NormalPayments>}></Route>
          <Route path='/rozgar/reports/advance_payments' element={user && <AdvancePayments></AdvancePayments>}></Route>
          <Route path='/rozgar/reports/azadVisa_reports' element={user && <AzadReports></AzadReports>}></Route>
          <Route path='/rozgar/reports/ticket_reports' element={user && <TicketReports></TicketReports>}></Route>
          <Route path='/rozgar/reports/visitVisa_reports' element={user && <VisitReports></VisitReports>}></Route>
          <Route path='/rozgar/reports/payroll_reports' element={user && <EmployeeReports></EmployeeReports>}></Route>
          <Route path='/rozgar/reports/day_book' element={user && <DayBook></DayBook>}></Route>
          <Route path='/rozgar/reports/net_visa_reports' element={user && <NetVisaReports></NetVisaReports>}></Route>
          <Route path='/rozgar/reports/overall_visa_profit_reports' element={user && <OverAllVisaProfitReports></OverAllVisaProfitReports>}></Route>
          <Route path='/rozgar/reports/cand_visa_payment_reports' element={user && <CandVisaPaymentReports></CandVisaPaymentReports>}></Route>
          <Route path='/rozgar/reports/overall_system_payment_reports' element={user && <OverAllSystemPaymentReport></OverAllSystemPaymentReport>}></Route>
          <Route path='/rozgar/reports/overall_combine_payment_reports' element={user && <CombinePaymentReports></CombinePaymentReports>}></Route>


          {/* Employee Routes */}
          <Route path='/rozgar/employees/add' element={user && <AddEmployee></AddEmployee>}></Route>
          <Route path='/rozgar/employees/add_payment' element={user && <AddPayment></AddPayment>}></Route>
          <Route path='/rozgar/employees/add_leave' element={user && <AddVacation></AddVacation>}></Route>
          <Route path='/rozgar/employees/employees_details' element={user && <EmployeeDetails></EmployeeDetails>}></Route>
          <Route path='/rozgar/employees/salary_month' element={user && <AddSalaryMonth></AddSalaryMonth>}></Route>


          {/* Reminders */}
          <Route path='/rozgar/reminders' element={user && <Reminders></Reminders>}></Route>
          {/* Notifications */}

          <Route path='/rozgar/notifications' element={user && <Notifications></Notifications>}></Route>
{/* Recycle Bin */}

<Route path='/rozgar/recyclebin' element={user && <RecycleBin></RecycleBin>}></Route>
          {/* Notes */}
          <Route path='/rozgar/notes' element={user && <Notes></Notes>}></Route>

          {/* Backup */}
          <Route path='/rozgar/backup' element={user && <Backup></Backup>}></Route>
          {/* User */}
          <Route path='/rozgar/user/account' element={user && <User></User>}></Route>

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
