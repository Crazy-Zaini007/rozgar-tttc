const express = require('express');
require('dotenv').config();

const CDWOCSchema=require('./database/creditsDebitsWOC/CDWOCSchema')
const CDWCSchema=require('./database/creditsDebitsWC/CDWCSchema')

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

async function updateCDWOCSchema() {
    try {
      // Add status, opening, and closing to payment_In_Schema if they don't exist
    await CDWOCSchema.updateMany(
      { 'payment_In_Schema.status': { $exists: false } },
      {
        $set: {
          'payment_In_Schema.status': 'Open',
          'payment_In_Schema.opening': 0,
          'payment_In_Schema.closing': 0,
        },
      }
    );
  
      console.log('cash_Out fields updated successfully.');
    } catch (err) {
      console.error('Error updating cash_Out:', err);
    }
  }
  
  
async function updateCDWCSchema() {
    try {
     // Add status, opening, and closing to payment_In_Schema if they don't exist
    await CDWCSchema.updateMany(
      { 'payment_In_Schema.status': { $exists: false } },
      {
        $set: {
          'payment_In_Schema.status': 'Open',
          'payment_In_Schema.opening': 0,
          'payment_In_Schema.closing': 0,
        },
      }
    );

      console.log('fields updated successfully.');
    } catch (err) {
      console.error('Error updating cash_Out:', err);
    }
  }

//connect to mongoDB
mongoose.set('strictQuery', true)
mongoose
    .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 50000 })
    .then(async () => {
        // Run the update script once after connection is established
    
//  await updateCDWOCSchema();
//  await updateCDWCSchema();

        server.listen(PORT, () => {
            console.log(`Connected on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })

