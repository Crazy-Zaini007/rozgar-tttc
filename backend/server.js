const express = require('express');
require('dotenv').config();

const AgentsSchema=require('./database/agents/AgentSchema')
const SuppliersSchema=require('./database/suppliers/SupplierSchema')

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const http = require('http');
const cors = require('cors');
//User Routes path
const JoinUSer = require('./routes/user/User_Regi_Route')
// Setting Route
const EntrySetting = require('./routes/setting/entrySettingRoute')
// Enteries Routes Path
const Enteries = require('./routes/enteries/entryRoute')
// Suppliers Route
const Suppliers = require('./routes/suppliers/supplierRoute')
// Agents Routes
const Agents = require('./routes/agents/agentRoute')
//  Azad Suppliers Routes
const AzadSuppliers = require('./routes/azadSupplier/azadSupplierRoute')
//  Candidates Routes
const Candidates = require('./routes/candidate/candidateRoute')

// Ticket Supplier Routes
const Tickets = require('./routes/ticketSupplier/ticketRoute')

// Vsist Suppliers Routes
const Visits = require('./routes/visitSupplier/visitRoute')

// Expense Routes
const Expenses = require('./routes/expenses/expenseRoute')


// Credits/Debits Without Cash in Hand
const CDWOC = require('./routes/creditesDebitsWOC/CDWOC_Route')
// Credits/Debits Without Cash in Hand
const CDWC = require('./routes/creditesDebitsWC/CDWC_Route')

// Cash In hand 
const CashInHand=require('./routes/cashinhand/cash_in_hand_Route')

// Reports
const Reports=require('./routes/reports/reports_Route')

// Protectors
const Protectors =require('./routes/protectors/protector_Route')

//Employees
const Employees =require('./routes/employees/employee_Route')


// Reminders
const Reminders=require('./routes/reminders/reminder_Route')

// Notifications
const Notifications=require('./routes/notification/notify_Route')

// RecycleBin
const RecycleBin=require('./routes/recyclebin/recyclebin_Route')
// Notes
const Notes =require('./routes/notes/note_Route')

// Assets
const Assets =require('./routes/assets/Assets_Route')
//Backup
const Backup=require('./routes/backup/backup_Route')
 
//Requirements
const Requirements=require('./routes/requirements/Requirement_Route')
//express app
const app = express()
const server = http.createServer(app)

app.use(cors());

//set the limit to 100MB for request
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

//middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Routing for User
app.use('/auth/user', JoinUSer)


// Routing for Setting
app.use('/auth/setting/entry', EntrySetting)

// Routing for Enteries

app.use('/auth/entries', Enteries)

// Routing for Suppliers

app.use('/auth/suppliers', Suppliers)

// Routing for Agents

app.use('/auth/agents', Agents)


// Routing for Azad Suppliers

app.use('/auth/azadvisa', AzadSuppliers)


// Routing for Candidates

app.use('/auth/candidates', Candidates)


// Routing for Ticket Suppliers

app.use('/auth/ticket', Tickets)


// Routing for Visit Suppliers

app.use('/auth/visit', Visits)

// Routing for Expenses
app.use('/auth/expenses', Expenses)

//Credits/Debits Without Cash in Hand Routing
app.use('/auth/credits&debits/without_cash_in_hand', CDWOC)

//Credits/Debits With Cash in Hand Routing
app.use('/auth/credits&debits/with_cash_in_hand', CDWC)

// CashInHand
app.use('/auth/cash_in_hand',CashInHand)


// Reports
app.use('/auth/reports',Reports)

// protectors
app.use('/auth/protectors',Protectors)

// Employees
app.use('/auth/employees',Employees)

// Reminders
app.use('/auth/reminders',Reminders)
// Notes
app.use('/auth/notes',Notes)

// Backup
app.use('/auth/backup',Backup)

// Notifications
app.use('/auth/notifications',Notifications)

// RecycleBin
app.use('/auth/recyclebin',RecycleBin)

// Assets
app.use('/auth/assets',Assets)

// Requirements
app.use('/auth/requirements',Requirements)

//PORT number
const PORT = process.env.PORT

async function updateAgentsCashOut() {
    try {
      // Update the payment_In_Schema candPayments
      await AgentsSchema.updateMany(
        { 'payment_In_Schema.candPayments': { $exists: true } },
        { $set: { 'payment_In_Schema.candPayments.$[elem].cash_Out': 0 } },
        { arrayFilters: [{ 'elem.cash_Out': { $exists: false } }] }
      );
  
      // Update the payment_Out_Schema candPayments
      await AgentsSchema.updateMany(
        { 'payment_Out_Schema.candPayments': { $exists: true } },
        { $set: { 'payment_Out_Schema.candPayments.$[elem].cash_Out': 0 } },
        { arrayFilters: [{ 'elem.cash_Out': { $exists: false } }] }
      );
  
      // Update the payment_In_Schema candPayments payments array
      await AgentsSchema.updateMany(
        { 'payment_In_Schema.candPayments': { $exists: true } },
        { $set: { 'payment_In_Schema.candPayments.$[elem].payments.$[subelem].cash_Out': 0 } },
        { arrayFilters: [{ 'elem.payments.cash_Out': { $exists: false } }, { 'subelem.cash_Out': { $exists: false } }] }
      );
  
      // Update the payment_Out_Schema candPayments payments array
      await AgentsSchema.updateMany(
        { 'payment_Out_Schema.candPayments': { $exists: true } },
        { $set: { 'payment_Out_Schema.candPayments.$[elem].payments.$[subelem].cash_Out': 0 } },
        { arrayFilters: [{ 'elem.payments.cash_Out': { $exists: false } }, { 'subelem.cash_Out': { $exists: false } }] }
      );
  
      console.log('cash_Out fields updated successfully.');
    } catch (err) {
      console.error('Error updating cash_Out:', err);
    }
  }
  
  
async function updateSuppliersCashOut() {
    try {
      // Update the payment_In_Schema candPayments
      await SuppliersSchema.updateMany(
        { 'payment_In_Schema.candPayments': { $exists: true } },
        { $set: { 'payment_In_Schema.candPayments.$[elem].cash_Out': 0 } },
        { arrayFilters: [{ 'elem.cash_Out': { $exists: false } }] }
      );
  
      // Update the payment_Out_Schema candPayments
      await SuppliersSchema.updateMany(
        { 'payment_Out_Schema.candPayments': { $exists: true } },
        { $set: { 'payment_Out_Schema.candPayments.$[elem].cash_Out': 0 } },
        { arrayFilters: [{ 'elem.cash_Out': { $exists: false } }] }
      );
  
      // Update the payment_In_Schema candPayments payments array
      await SuppliersSchema.updateMany(
        { 'payment_In_Schema.candPayments': { $exists: true } },
        { $set: { 'payment_In_Schema.candPayments.$[elem].payments.$[subelem].cash_Out': 0 } },
        { arrayFilters: [{ 'elem.payments.cash_Out': { $exists: false } }, { 'subelem.cash_Out': { $exists: false } }] }
      );
  
      // Update the payment_Out_Schema candPayments payments array
      await SuppliersSchema.updateMany(
        { 'payment_Out_Schema.candPayments': { $exists: true } },
        { $set: { 'payment_Out_Schema.candPayments.$[elem].payments.$[subelem].cash_Out': 0 } },
        { arrayFilters: [{ 'elem.payments.cash_Out': { $exists: false } }, { 'subelem.cash_Out': { $exists: false } }] }
      );
  
      console.log('cash_Out fields updated successfully.');
    } catch (err) {
      console.error('Error updating cash_Out:', err);
    }
  }


  async function updateCandPayments() {
    try {
      // Update payment_In in payment_In_Schema.candPayments
      await AgentsSchema.updateMany(
        { 'payment_In_Schema.candPayments.payment_In': { $exists: true } },
        { $set: { 'payment_In_Schema.candPayments.$[elem].payment_In': 0 } },
        { arrayFilters: [{ 'elem.payment_In': { $exists: false } }] }
      );
  
      // Update payment_Out in payment_Out_Schema.candPayments
      await AgentsSchema.updateMany(
        { 'payment_Out_Schema.candPayments.payment_Out': { $exists: true } },
        { $set: { 'payment_Out_Schema.candPayments.$[elem].payment_Out': 0 } },
        { arrayFilters: [{ 'elem.payment_Out': { $exists: false } }] }
      );
  
      // Update new_Payment in payment_In_Schema.candPayments.payments
      await AgentsSchema.updateMany(
        { 'payment_In_Schema.candPayments.payments.new_Payment': { $exists: true } },
        { $set: { 'payment_In_Schema.candPayments.$[elem].payments.$[subelem].new_Payment': 0 } },
        { arrayFilters: [{ 'elem.payments.new_Payment': { $exists: false } }, { 'subelem.new_Payment': { $exists: false } }] }
      );
  
      // Update new_Payment in payment_Out_Schema.candPayments.payments
      await AgentsSchema.updateMany(
        { 'payment_Out_Schema.candPayments.payments.new_Payment': { $exists: true } },
        { $set: { 'payment_Out_Schema.candPayments.$[elem].payments.$[subelem].new_Payment': 0 } },
        { arrayFilters: [{ 'elem.payments.new_Payment': { $exists: false } }, { 'subelem.new_Payment': { $exists: false } }] }
      );
  
      console.log('candPayments and payments fields updated successfully.');
    } catch (err) {
      console.error('Error updating candPayments and payments:', err);
    }
  }
  


  async function updateSuppCandPayments() {
    try {
      // Update payment_In in payment_In_Schema.candPayments
      await SuppliersSchema.updateMany(
        { 'payment_In_Schema.candPayments.payment_In': { $exists: true } },
        { $set: { 'payment_In_Schema.candPayments.$[elem].payment_In': 0 } },
        { arrayFilters: [{ 'elem.payment_In': { $exists: false } }] }
      );
  
      // Update payment_Out in payment_Out_Schema.candPayments
      await SuppliersSchema.updateMany(
        { 'payment_Out_Schema.candPayments.payment_Out': { $exists: true } },
        { $set: { 'payment_Out_Schema.candPayments.$[elem].payment_Out': 0 } },
        { arrayFilters: [{ 'elem.payment_Out': { $exists: false } }] }
      );
  
      // Update new_Payment in payment_In_Schema.candPayments.payments
      await SuppliersSchema.updateMany(
        { 'payment_In_Schema.candPayments.payments.new_Payment': { $exists: true } },
        { $set: { 'payment_In_Schema.candPayments.$[elem].payments.$[subelem].new_Payment': 0 } },
        { arrayFilters: [{ 'elem.payments.new_Payment': { $exists: false } }, { 'subelem.new_Payment': { $exists: false } }] }
      );
  
      // Update new_Payment in payment_Out_Schema.candPayments.payments
      await SuppliersSchema.updateMany(
        { 'payment_Out_Schema.candPayments.payments.new_Payment': { $exists: true } },
        { $set: { 'payment_Out_Schema.candPayments.$[elem].payments.$[subelem].new_Payment': 0 } },
        { arrayFilters: [{ 'elem.payments.new_Payment': { $exists: false } }, { 'subelem.new_Payment': { $exists: false } }] }
      );
  
      console.log('candPayments and payments fields updated successfully.');
    } catch (err) {
      console.error('Error updating candPayments and payments:', err);
    }
  }

//connect to mongoDB
mongoose.set('strictQuery', true)
mongoose
    .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 50000 })
    .then(async () => {
        // Run the update script once after connection is established
    
//     await updateAgentsCashOut();
// await updateSuppliersCashOut()
// await updateCandPayments()
// await updateSuppCandPayments()
        server.listen(PORT, () => {
            console.log(`Connected on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })

