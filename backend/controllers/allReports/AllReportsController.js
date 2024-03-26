const User = require("../../database/userdb/UserSchema");
const Agents = require('../../database/agents/AgentSchema');  // Adjust the path based on your project structure
const Suppliers = require('../../database/suppliers/SupplierSchema');
const Candidates = require('../../database/candidate/CandidateSchema');
const AzadSuppliers = require('../../database/azadSuppliers/AzadSupplierSchema');
const TicketSuppliers = require('../../database/ticketSuppliers/TicketSupplierSchema');
const VisitSuppliers = require('../../database/visitSuppliers/VisitSupplierSchema');
const AzadCandidates = require('../../database/azadCandidates/AzadCandidateSchema');
const TicketCandidates = require('../../database/ticketCandidates/TicketCandidateSchema');
const VisitCandidates = require('../../database/visitCandidates/VisitCandidateSchema');
const CashInHand=require('../../database/cashInHand/CashInHandSchema')
const Expenses=require('../../database/expenses/ExpenseSchema')
const Employees=require('../../database/employees/EmployeeSchema')
const Protector=require('../../database/protector/ProtectorSchema')
const CDWC=require('../../database/creditsDebitsWC/CDWCSchema')
const CDWOC=require('../../database/creditsDebitsWOC/CDWOCSchema')
// Controller to get all payments with supplierName
const getAllPayments = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (!user.role==="Admin") {
            res.status(404).json({ message: "you are not Admin" });
            return;
        }

        // Find all agents
        const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
        const azadAgents = await AzadSuppliers.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketSuppliers.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitSuppliers.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()

        // Initialize an empty array to store merged payments
        let mergedPayments = [];

        // Iterate through agents
        agents.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.payment_In_Schema && agent.payment_In_Schema.payment) {
                const paymentInDetails = agent.payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.payment_In_Schema.supplierName,
                    type: 'Agent_Payment_In',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(paymentInDetails);
            }
            if (agent.payment_Out_Schema && agent.payment_Out_Schema.payment) {
                const paymentOutDetails = agent.payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.payment_Out_Schema.supplierName,
                    type: 'Agent_Payment_Out',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(paymentOutDetails);
            }

        })

        // Iterate through agents
        suppliers.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.payment_In_Schema && agent.payment_In_Schema.payment) {
                const supplierPaymentInDetails = agent.payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.payment_In_Schema.supplierName,
                    type: 'Supplier_Payment_In',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(supplierPaymentInDetails);
            }
            if (agent.payment_Out_Schema && agent.payment_Out_Schema.payment) {
                const supplierPaymentOutDetails = agent.payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.payment_Out_Schema.supplierName,
                    type: 'Supplier_Payment_Out',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(supplierPaymentOutDetails);
            }
        })

        // Iterate through agents
        candidates.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.payment_In_Schema && agent.payment_In_Schema.payment) {
                const candPaymentInDetails = agent.payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.payment_In_Schema.supplierName,
                    type: 'Candidate_Payment_In',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(candPaymentInDetails);
            }
            if (agent.payment_Out_Schema && agent.payment_Out_Schema.payment) {
                const candPaymentOutDetails = agent.payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.payment_Out_Schema.supplierName,
                    type: 'Candidate_Payment_Out',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(candPaymentOutDetails);
            }

        })

        // Iterate through agents
        azadAgents.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.Agent_Payment_In_Schema && agent.Agent_Payment_In_Schema.payment) {
                const azadAgentsPaymentInDetails = agent.Agent_Payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.Agent_Payment_In_Schema.supplierName,
                    type: 'Azad_Agent_In',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(azadAgentsPaymentInDetails);
            }
            if (agent.Agent_Payment_Out_Schema && agent.Agent_Payment_Out_Schema.payment) {
                const azadAgentsPaymentOutDetails = agent.Agent_Payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.Agent_Payment_Out_Schema.supplierName,
                    type: 'Azad_Agent_Out',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(azadAgentsPaymentOutDetails);
            }

        })

        // Iterate through agents
        ticketAgents.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.Agent_Payment_In_Schema && agent.Agent_Payment_In_Schema.payment) {
                const ticketAgentsPaymentInDetails = agent.Agent_Payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.Agent_Payment_In_Schema.supplierName,
                    type: 'Ticket_Agent_In',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(ticketAgentsPaymentInDetails);
            }
            if (agent.Agent_Payment_Out_Schema && agent.Agent_Payment_Out_Schema.payment) {
                const ticketAgentsPaymentOutDetails = agent.Agent_Payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.Agent_Payment_Out_Schema.supplierName,
                    type: 'Ticket_Agent_Out',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(ticketAgentsPaymentOutDetails);
            }

        })

        // Iterate through agents
        visitAgents.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.Agent_Payment_In_Schema && agent.Agent_Payment_In_Schema.payment) {
                const visitAgentsPaymentInDetails = agent.Agent_Payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.Agent_Payment_In_Schema.supplierName,
                    type: 'Visit_Agent_In',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(visitAgentsPaymentInDetails);
            }
            if (agent.Agent_Payment_Out_Schema && agent.Agent_Payment_Out_Schema.payment) {
                const visitAgentsPaymentOutDetails = agent.Agent_Payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.Agent_Payment_Out_Schema.supplierName,
                    type: 'Visit_Agent_Out',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(visitAgentsPaymentOutDetails);
            }
        })

        // Iterate through agents
        azadSuppliers.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.Supplier_Payment_In_Schema && agent.Supplier_Payment_In_Schema.payment) {
                const azadSuppliersPaymentInDetails = agent.Supplier_Payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.Supplier_Payment_In_Schema.supplierName,
                    type: 'Azad_Supplier_In',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(azadSuppliersPaymentInDetails);
            }
            if (agent.Supplier_Payment_Out_Schema && agent.Supplier_Payment_Out_Schema.payment) {
                const azadSuppliersPaymentOutDetails = agent.Supplier_Payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.Supplier_Payment_Out_Schema.supplierName,
                    type: 'Azad_Supplier_Out',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(azadSuppliersPaymentOutDetails);
            }
        })

        // Iterate through agents
        ticketSuppliers.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.Supplier_Payment_In_Schema && agent.Supplier_Payment_In_Schema.payment) {
                const ticketSuppliersPaymentInDetails = agent.Supplier_Payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.Supplier_Payment_In_Schema.supplierName,
                    type: 'Ticket_Supplier_In',

                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(ticketSuppliersPaymentInDetails);
            }
            if (agent.Supplier_Payment_Out_Schema && agent.Supplier_Payment_Out_Schema.payment) {
                const ticketSuppliersPaymentOutDetails = agent.Supplier_Payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.Supplier_Payment_Out_Schema.supplierName,
                    type: 'Ticket_Supplier_Out',

                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(ticketSuppliersPaymentOutDetails);
            }
        })


        // Iterate through agents
        visitSuppliers.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.Supplier_Payment_In_Schema && agent.Supplier_Payment_In_Schema.payment) {
                const visitSuppliersPaymentInDetails = agent.Supplier_Payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.Supplier_Payment_In_Schema.supplierName,
                    type: 'Visit_Supplier_In',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(visitSuppliersPaymentInDetails);
            }
            if (agent.Supplier_Payment_Out_Schema && agent.Supplier_Payment_Out_Schema.payment) {
                const visitSuppliersPaymentOutDetails = agent.Supplier_Payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.Supplier_Payment_Out_Schema.supplierName,
                    type: 'Visit_Supplier_Out',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(visitSuppliersPaymentOutDetails);
            }

        })
        // Iterate through agents
        azadCandidates.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.Candidate_Payment_In_Schema && agent.Candidate_Payment_In_Schema.payment) {
                const azadCandPaymentInDetails = agent.Candidate_Payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.Candidate_Payment_In_Schema.supplierName,
                    type: 'Azad_Candidate_In',

                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(azadCandPaymentInDetails);
            }
            if (agent.Candidate_Payment_Out_Schema && agent.Candidate_Payment_Out_Schema.payment) {
                const azadCandPaymentOutDetails = agent.Candidate_Payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.Candidate_Payment_Out_Schema.supplierName,
                    type: 'Azad_Candidate_Out',

                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(azadCandPaymentOutDetails);
            }

        })

        // Iterate through agents
        ticketCandidates.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.Candidate_Payment_In_Schema && agent.Candidate_Payment_In_Schema.payment) {
                const ticketCandPaymentInDetails = agent.Candidate_Payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.Candidate_Payment_In_Schema.supplierName,
                    type: 'Ticket_Candidate_In',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(ticketCandPaymentInDetails);
            }
            if (agent.Candidate_Payment_Out_Schema && agent.Candidate_Payment_Out_Schema.payment) {
                const ticketCandPaymentOutDetails = agent.Candidate_Payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.Candidate_Payment_Out_Schema.supplierName,
                    type: 'Ticket_Candidate_Out',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(ticketCandPaymentOutDetails);
            }

        })

        // Iterate through agents
        visitCandidates.forEach(agent => {
            // Check if payment_In_Schema exists and has the expected structure
            if (agent.Candidate_Payment_In_Schema && agent.Candidate_Payment_In_Schema.payment) {
                const visitCandPaymentInDetails = agent.Candidate_Payment_In_Schema.payment.map(payment => ({
                    supplierName: agent.Candidate_Payment_In_Schema.supplierName,
                    type: 'Visit_Candidate_In',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(visitCandPaymentInDetails);
            }
            if (agent.Candidate_Payment_Out_Schema && agent.Candidate_Payment_Out_Schema.payment) {
                const visitCandPaymentOutDetails = agent.Candidate_Payment_Out_Schema.payment.map(payment => ({
                    supplierName: agent.Candidate_Payment_Out_Schema.supplierName,
                    type: 'Visit_Candidate_Out',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(visitCandPaymentOutDetails);
            }

        })

        // Send the resulting mergedPayments array in the response
        res.status(200).json({ data: mergedPayments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// getting the protectors payments
const getProtectorPayments = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (!user.role==="Admin") {
            res.status(404).json({ message: "you are not Admin" });
            return;
        }

        // Find all agents
        const protectors = await Protector.find();

        // Initialize an empty array to store merged payments
        let mergedPayments = [];

        // Iterate through agents
        protectors.forEach(protectors => {
            // Check if payment_In_Schema exists and has the expected structure
            if (protectors.payment_Out_Schema && protectors.payment_Out_Schema.payment) {
                const paymentOutDetails = protectors.payment_Out_Schema.payment.map(payment => ({
                    supplierName: protectors.payment_Out_Schema.supplierName,
                     type: 'Protector',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(paymentOutDetails);
            }

        })


        // Send the resulting mergedPayments array in the response
        res.status(200).json({ data: mergedPayments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



// getting the protectors payments
const getEmployeesPayments = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (!user.role==="Admin") {
            res.status(404).json({ message: "you are not Admin" });
            return;
        }

        // Find all agents
        const employees = await Employees.find();
        

        // Initialize an empty array to store merged payments
        let mergedPayments = [];

        employees.forEach(employee => {
            if (employee.payment && employee.payment.length > 0) {
                const employeePayments = employee.payment.map(payment => ({
                    employeeName: employee.employeeName,
                    type: 'Employee',
                    ...payment.toObject(),
                }));
                mergedPayments = mergedPayments.concat(employeePayments);
            }
        });


        // Send the resulting mergedPayments array in the response
        res.status(200).json({ data: mergedPayments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Controller to get persons array with supplierName and curr_Country
const getPersons = async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      if (user.role !== "Admin") {
        res.status(404).json({ message: "You are not Admin" });
        return;
      }
  
      // Find all agents
      const agents = await Agents.find();
  
      // Find all suppliers
      const suppliers = await Suppliers.find();
  
      // Find all candidates
      const candidates = await Candidates.find();
  
      // Initialize an empty array to store persons data
      let personsData = [];
  
      // Iterate through agents
      agents.forEach(agent => {
        // Check if payment_In_Schema exists and has the expected structure
        if (agent.payment_In_Schema && agent.payment_In_Schema.persons) {
          const personsArray = agent.payment_In_Schema.persons.map(person => ({
            supplierName: agent.payment_In_Schema.supplierName,
            curr_Country: agent.payment_In_Schema.curr_Country,
            type: "Agent",
            ...person.toObject(),
          }));
          personsData = personsData.concat(personsArray);
        }
      });
  
      // Iterate through suppliers
      suppliers.forEach(supplier => {
        // Check if payment_In_Schema exists and has the expected structure
        if (supplier.payment_In_Schema && supplier.payment_In_Schema.persons) {
          const personsArray = supplier.payment_In_Schema.persons.map(person => ({
            supplierName: supplier.payment_In_Schema.supplierName,
            curr_Country: supplier.payment_In_Schema.curr_Country,
            type: "Supplier",
            ...person.toObject(),
          }));
          personsData = personsData.concat(personsArray);
        }
      });
  
      // Iterate through candidates
      candidates.forEach(candidate => {
        const { payment_In_Schema } = candidate;
  
        // Modify payment_In_Schema
        if (payment_In_Schema) {
          const modifiedPaymentInSchema = {
            ...payment_In_Schema.toObject(),
            total_In: payment_In_Schema.total_Payment_In,
            cash_Out: payment_In_Schema.total_Cash_Out,
            visa_Price_In_PKR:payment_In_Schema.total_Visa_Price_In_PKR,
            visa_Price_In_Curr:payment_In_Schema.total_Visa_Price_In_Curr,
            name:payment_In_Schema.supplierName
          };
  
          personsData.push({
            supplierName: payment_In_Schema.supplierName,
            curr_Country: payment_In_Schema.curr_Country,
            type: "Candidate",
            ...modifiedPaymentInSchema,
          });
        }
      });
  
      // Send the resulting personsData array in the response
      res.status(200).json({ data: personsData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


// Controller to get total payment in and total payment out
const getTotalPayments = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "Admin") {
            return res.status(404).json({ message: "You are not an Admin" });
        }

        // Array of collections to query
        const inCollections = [
            { model: Agents, schemaType: 'payment_In_Schema' },
            { model: Suppliers, schemaType: 'payment_In_Schema' },
            { model: Candidates, schemaType: 'payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_In_Schema' },
        ];

        const outCollections = [
            { model: Agents, schemaType: 'payment_Out_Schema' },
            { model: Suppliers, schemaType: 'payment_Out_Schema' },
            { model: Candidates, schemaType: 'payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: Protector, schemaType: 'payment_Out_Schema' },
        ];

        const employees=await Employees.find()
        const expenses=await Expenses.find()
        const cdwcs=await CDWC.find()
        const cdwocs=await CDWOC.find()
        // Initialize variables to store total payments
        let totalPaymentIn = 0;
        let totalPaymentOut = 0;

        // Iterate through collections
        for (const { model, schemaType } of inCollections) {
            const items = await model.find();

            items.forEach(item => {
                // Check if payment_In_Schema exists and has the expected structure
                if (item[schemaType] && item[schemaType].supplierName) {
                    // Add to total payments
                    totalPaymentIn += item[schemaType].total_Payment_In || 0;
                    totalPaymentOut += item[schemaType].total_Cash_Out || 0;
                }
            });
        }
        for(const cdwc of cdwcs){
            if(cdwc.payment_In_Schema && cdwc.payment_In_Schema.payment){
                const payments=cdwc.payment_In_Schema.payment
                if(payments){
                    for(const payment of payments){
                        totalPaymentIn+=payment.payment_In
                    }
                }
            }
        }

        for(const cdwoc of cdwocs){
            if(cdwoc.payment_In_Schema && cdwoc.payment_In_Schema.payment){
                const payments=cdwoc.payment_In_Schema.payment
                if(payments){
                    for(const payment of payments){
                        totalPaymentIn+=payment.payment_In
                    }
                }
            }
        }

       

           // Iterate through collections
           for (const { model, schemaType } of outCollections) {
            const items = await model.find();

            items.forEach(item => {
                // Check if payment_In_Schema exists and has the expected structure
                if (item[schemaType] && item[schemaType].supplierName) {
                    // Add to total payments
                    totalPaymentOut += item[schemaType].total_Payment_Out || 0;
                    totalPaymentIn += item[schemaType].total_Cash_Out || 0;
                    
                }
            });
        }

        for(const cdwc of cdwcs){
            if(cdwc.payment_In_Schema && cdwc.payment_In_Schema.payment){
                const payments=cdwc.payment_In_Schema.payment
                if(payments){
                    for(const payment of payments){
                        totalPaymentOut+=payment.payment_Out
                    }
                }
            }
        }

        for(const cdwoc of cdwocs){
            if(cdwoc.payment_In_Schema && cdwoc.payment_In_Schema.payment){
                const payments=cdwoc.payment_In_Schema.payment
                if(payments){
                    for(const payment of payments){
                        totalPaymentOut+=payment.payment_Out
                    }
                }
            }
        }



        for(const employee of employees){
            if(employee.payment){
                const payments=employee.payment
                if(payments){
                    for(const payment of payments){
                        totalPaymentOut+=payment.payment_Out
                    }
                }
            }
        }

        for(const expense of expenses){
            if(expense){
          totalPaymentOut+=expense.payment_Out
            }
        }

        // Send the resulting total payments in the response
        res.status(200).json({ totalPaymentIn,totalPaymentOut})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Controller to get total advance payments
const getTotalAdvancePayments = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.role !== "Admin") {
            res.status(404).json({ message: "You are not an Admin" });
            return;
        }

const currentDate = new Date().toISOString().split('T')[0];
let todayCashIn=0
let todayCashOut=0
let totalAdvancePaymentIn = 0
let todayAdvancePaymentIn = 0
let todayAdvancePaymentOut = 0
let totalAdvancePaymentOut = 0



        // Array of collections to query for payment_In
        const inCollections = [
            { model: Agents, schemaType: 'payment_In_Schema' },
            { model: Suppliers, schemaType: 'payment_In_Schema' },
            { model: Candidates, schemaType: 'payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: CDWC, schemaType: 'payment_In_Schema' }, 
            { model: CDWOC, schemaType: 'payment_In_Schema' }, 
        ];

        // Initialize total advance payment for payment_In

        // Process payments for each schema for payment_In
        for (const { model, schemaType } of inCollections) {
            const items = await model.find();

            for (const item of items) {
                // Check if the payment schema exists and has the expected structure
                if (item[schemaType] && item[schemaType].payment) {
                    for (const payment of item[schemaType].payment) {
                        // Check if payment type is "Advance"
                        if (payment.payment_Type.toLowerCase() === "advance") {
                            // Add payment_In to totalAdvancePaymentIn
                            totalAdvancePaymentIn += payment.payment_In || 0;
                            totalAdvancePaymentOut += payment.cash_Out || 0;

                        }
                    }
                }
            }
        }

          // Initialize total advance payment for payment_In

          // Process payments for each schema for payment_In
          for (const { model, schemaType } of inCollections) {
              const items = await model.find();
  
              for (const item of items) {
                  // Check if the payment schema exists and has the expected structure
                  if (item[schemaType] && item[schemaType].payment) {
                      for (const payment of item[schemaType].payment) {
                          // Check if payment type is "Advance"
                          if (payment.payment_Type.toLowerCase() === "advance" && payment.date===currentDate) {
                              // Add payment_In to totalAdvancePaymentIn
                              todayAdvancePaymentIn += payment.payment_In || 0;
                              todayAdvancePaymentOut += payment.cash_Out || 0;

                          }
                      }
                  }
              }
          }

          
          // Process payments for each schema for payment_In
          for (const { model, schemaType } of inCollections) {
            const items = await model.find();

            for (const item of items) {
                // Check if the payment schema exists and has the expected structure
                if (item[schemaType] && item[schemaType].payment) {
                    for (const payment of item[schemaType].payment) {
                        // Check if payment type is "Advance"
                        if (payment.date===currentDate) {
                            // Add payment_In to totalAdvancePaymentIn
                            todayCashIn += payment.payment_In || 0;
                            todayCashOut += payment.cash_Out || 0;

                        }
                    }
                }
            }
        }


        // Array of collections to query for payment_Out
        const outCollections = [
            { model: Agents, schemaType: 'payment_Out_Schema' },
            { model: Suppliers, schemaType: 'payment_Out_Schema' },
            { model: Candidates, schemaType: 'payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: Protector, schemaType: 'payment_Out_Schema' },
            { model: CDWC, schemaType: 'payment_In_Schema' }, 
            { model: CDWOC, schemaType: 'payment_In_Schema' }, 
        ];

        
        const employees=await Employees.find()
        const expenses=await Expenses.find()

        // Initialize total advance payment for payment_Out

        // Process payments for each schema for payment_Out
        for (const { model, schemaType } of outCollections) {
            const items = await model.find();

            for (const item of items) {
                // Check if the payment schema exists and has the expected structure
                if (item[schemaType] && item[schemaType].payment) {
                    for (const payment of item[schemaType].payment) {
                        // Check if payment type is "Advance"
                        if (payment.payment_Type.toLowerCase() === "advance") {
                            // Add payment_In to totalAdvancePaymentOut
                            totalAdvancePaymentOut += payment.payment_Out || 0;
                            totalAdvancePaymentIn += payment.cash_Out || 0;
                        }
                    }
                }
            }
        }

        
        for(const employee of employees){
            if(employee.payment){
                const payments=employee.payment
                if(payments){
                    for(const payment of payments){
                        if(payment.payment_Type.toLowerCase() === "advance"){
                            totalAdvancePaymentOut+=payment.payment_Out
                        }
                    }
                }
            }
        }

        for(const expense of expenses){
            if(expense){
                if(expense){
                  
                        if(expense.payment_Type.toLowerCase() === "advance"){
                            totalAdvancePaymentOut+=expense.payment_Out
                        }
                    
                }
            }
        }

          // Initialize total advance payment for payment_In

          // Process payments for each schema for payment_In
          for (const { model, schemaType } of outCollections) {
              const items = await model.find();
  
              for (const item of items) {
                  // Check if the payment schema exists and has the expected structure
                  if (item[schemaType] && item[schemaType].payment) {
                      for (const payment of item[schemaType].payment) {
                          // Check if payment type is "Advance"
                          if (payment.payment_Type.toLowerCase() === "advance" && payment.date===currentDate) {
                              // Add payment_In to totalAdvancePaymentIn
                              todayAdvancePaymentOut += payment.payment_Out || 0;
                              todayAdvancePaymentIn += payment.cash_Out || 0;
                          }
                      }
                  }
              }
          }

          for(const employee of employees){
            if(employee.payment){
                const payments=employee.payment
                if(payments){
                    for(const payment of payments){
                        if(payment.payment_Type.toLowerCase() === "advance"  && payment.date===currentDate){
                            todayAdvancePaymentOut+=payment.payment_Out
                        }
                    }
                }
            }
        }

        for(const expense of expenses){
            if(expense){
                if(expense){
                  
                        if(expense.payment_Type.toLowerCase() === "advance"  && expense.date===currentDate){
                            todayAdvancePaymentOut+=expense.payment_Out
                        }
                    
                }
            }
        }

            // Process payments for each schema for payment_In
            for (const { model, schemaType } of outCollections) {
                const items = await model.find();
    
                for (const item of items) {
                    // Check if the payment schema exists and has the expected structure
                    if (item[schemaType] && item[schemaType].payment) {
                        for (const payment of item[schemaType].payment) {
                            // Check if payment type is "Advance"
                            if (payment.date===currentDate) {
                                // Add payment_In to totalAdvancePaymentIn
                                todayCashOut += payment.payment_Out || 0;
                                todayCashIn += payment.cash_Out || 0;

                            }
                        }
                    }
                }
            }

            for(const employee of employees){
                if(employee.payment){
                    const payments=employee.payment
                    if(payments){
                        for(const payment of payments){
                            if( payment.date===currentDate){
                                todayCashOut+=payment.payment_Out
                            }
                        }
                    }
                }
            }
    
            for(const expense of expenses){
                if(expense){
                    if(expense){
                      
                            if(expense.date===currentDate){
                                todayCashOut+=expense.payment_Out
                            }
                        
                    }
                }
            }



        // Send the resulting total advance payments in the response
        res.status(200).json({ totalAdvancePaymentIn, totalAdvancePaymentOut,todayAdvancePaymentIn,todayAdvancePaymentOut,todayCashIn,todayCashOut });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Controller to get payments of the same date and combine payment_In and payment_Out
const getAllPaymentsByDate = async (req, res) =>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "Admin") {
            return res.status(404).json({ message: "You are not an Admin" });
        }

        // Array of collections to query for payment_In
        const inCollections = [
            { model: Agents, schemaType: 'payment_In_Schema' },
            { model: Suppliers, schemaType: 'payment_In_Schema' },
            { model: Candidates, schemaType: 'payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: CashInHand, schemaType: 'CashInHandSchema' },
            { model: CDWC, schemaType: 'payment_In_Schema' }, 
            { model: CDWOC, schemaType: 'payment_In_Schema' }, 

        ];

        // Array of collections to query for payment_Out
        const outCollections = [
            { model: Agents, schemaType: 'payment_Out_Schema' },
            { model: Suppliers, schemaType: 'payment_Out_Schema' },
            { model: Candidates, schemaType: 'payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: CashInHand, schemaType: 'CashInHandSchema' }, // Including CashInHand schema for payment_Out
            { model: Protector, schemaType: 'payment_Out_Schema' },
            { model: CDWC, schemaType: 'payment_In_Schema' }, 
            { model: CDWOC, schemaType: 'payment_In_Schema' }, 
        ]

        // Initialize object to store payments grouped by the same date
        const paymentsByDate = {};

        // Process payments for each schema for payment_In
        for (const { model, schemaType } of inCollections) {
            const items = await model.find();

            for (const item of items) {
                if (item[schemaType] && item[schemaType].payment) {
                    for (const payment of item[schemaType].payment) {
                        const paymentDate = payment.date;
                        if (!paymentsByDate[paymentDate]) {
                            paymentsByDate[paymentDate] = { date: paymentDate, total_payment_in: 0, total_payment_out: 0 };
                        }
                        paymentsByDate[paymentDate].total_payment_in += payment.payment_In || 0;
                        paymentsByDate[paymentDate].total_payment_out += payment.cash_Out || 0;

                    }
                }
            }
        }

        // Process payments for each schema for payment_Out
        for (const { model, schemaType } of outCollections) {
            const items = await model.find();

            for (const item of items) {
                if (item[schemaType] && item[schemaType].payment) {
                    for (const payment of item[schemaType].payment) {
                        const paymentDate = payment.date;
                        if (!paymentsByDate[paymentDate]) {
                            paymentsByDate[paymentDate] = { date: paymentDate, total_payment_in: 0, total_payment_out: 0 };
                        }
                            paymentsByDate[paymentDate].total_payment_out += payment.payment_Out || 0;
                            paymentsByDate[paymentDate].total_payment_in += payment.cash_Out || 0;
                    }
                }
            }
        }

        // Process payments for CashInHand schema
        const cashInHandPayments = await CashInHand.find();
        for (const cash of cashInHandPayments) {
            if (cash.payment) {
                for (const payment of cash.payment) {
                    const paymentDate = payment.date;
                    if (!paymentsByDate[paymentDate]) {
                        paymentsByDate[paymentDate] = { date: paymentDate, total_payment_in: 0, total_payment_out: 0 };
                    }
                    paymentsByDate[paymentDate].total_payment_in += payment.payment_In || 0;
                    paymentsByDate[paymentDate].total_payment_out += payment.payment_Out || 0;
                }
            }
        }

        // Process payments for Expenses schema
        const expensesPayments = await Expenses.find();
        for (const expense of expensesPayments) {
            const paymentDate = expense.date;
            if (!paymentsByDate[paymentDate]) {
                paymentsByDate[paymentDate] = { date: paymentDate, total_payment_in: 0, total_payment_out: 0 };
            }
            paymentsByDate[paymentDate].total_payment_out += expense.payment_Out || 0;
        }

// Process payments for Expenses schema
        const employeesPayments = await Employees.find();
       for (const employee of employeesPayments) {
            if (employee.payment) {
                for (const payment of employee.payment) {
                    const paymentDate = payment.date;
                    if (!paymentsByDate[paymentDate]) {
                        paymentsByDate[paymentDate] = { date: paymentDate, total_payment_in: 0, total_payment_out: 0 };
                    }
                    paymentsByDate[paymentDate].total_payment_out += payment.payment_Out || 0;
                }
            }
        }
        // Convert object to array
        const paymentsArray = Object.values(paymentsByDate);

        // Sort payments array by date in ascending order
        paymentsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Send the resulting payments grouped by the same date in ascending order in the response
        res.status(200).json({ data: paymentsArray });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllBanksPayments = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "Admin") {
            return res.status(404).json({ message: "You are not an Admin" });
        }

        // Array of collections to query for payment_In
        const inCollections = [
            { model: Agents, schemaType: 'payment_In_Schema' },
            { model: Suppliers, schemaType: 'payment_In_Schema' },
            { model: Candidates, schemaType: 'payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: CashInHand, schemaType: 'CashInHandSchema' },
            { model: CDWC, schemaType: 'payment_In_Schema' }, 
            { model: CDWOC, schemaType: 'payment_In_Schema' }, 
        ];

        // Array of collections to query for payment_Out
        const outCollections = [
            { model: Agents, schemaType: 'payment_Out_Schema' },
            { model: Suppliers, schemaType: 'payment_Out_Schema' },
            { model: Candidates, schemaType: 'payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: CashInHand, schemaType: 'CashInHandSchema' }, // Including CashInHand schema for payment_Out
            { model: Protector, schemaType: 'payment_Out_Schema' },
            { model: CDWC, schemaType: 'payment_In_Schema' }, 
            { model: CDWOC, schemaType: 'payment_In_Schema' }, 
        ];

        // Initialize objects to store combined payments in and out separately
        const combinedPaymentsIn = {};
        const combinedPaymentsOut = {};

        // Process payments for payment_In
        for (const { model, schemaType } of inCollections) {
            const items = await model.find();

            for (const item of items) {
                if (item[schemaType] && item[schemaType].payment) {
                    for (const payment of item[schemaType].payment) {
                        const paymentVia = payment.payment_Via;
                        if (paymentVia.toLowerCase() !== 'cash') { 
                            
                            if (!combinedPaymentsIn[paymentVia]) {
                                combinedPaymentsIn[paymentVia] = 0;
                            }
                            combinedPaymentsIn[paymentVia] += payment.payment_In || 0;
                        }
                    }
                }
            }
        }

        // Process payments for payment_Out
        for (const { model, schemaType } of outCollections) {
            const items = await model.find();

            for (const item of items) {
                if (item[schemaType] && item[schemaType].payment) {
                    for (const payment of item[schemaType].payment) {
                        const paymentVia = payment.payment_Via;
                        if (paymentVia.toLowerCase() !== 'cash') { // Ignore cash payments
                          
                            if (!combinedPaymentsOut[paymentVia]) {
                                combinedPaymentsOut[paymentVia] = 0;
                            }
                            combinedPaymentsOut[paymentVia] += payment.payment_Out || 0;
                        }
                    }
                }
            }
        }
        
  // Process payments for CashInHand schema
  const cashInHandPayments = await CashInHand.find();
  for (const cash of cashInHandPayments) {
      if (cash.payment) {
          for (const payment of cash.payment) {
              const paymentVia = payment.payment_Via;
              if (paymentVia.toLowerCase() !== 'cash') {
                
                  if (!combinedPaymentsOut[paymentVia]) {
                      combinedPaymentsOut[paymentVia] = 0;
                  }
                  combinedPaymentsOut[paymentVia] += payment.payment_Out || 0
              }
              if (paymentVia.toLowerCase() !== 'cash') {
                
                if (!combinedPaymentsIn[paymentVia]) {
                    combinedPaymentsIn[paymentVia] = 0;
                }
                combinedPaymentsIn[paymentVia] += payment.payment_In || 0
            }
          }
      }
  }

  // Process payments for Expenses schema
  const expensesPayments = await Expenses.find();
  for (const expense of expensesPayments) {
    const paymentVia = expense.payment_Via;
    if (paymentVia.toLowerCase() !== 'cash') { // Ignore cash payments
      
        if (!combinedPaymentsOut[paymentVia]) {
            combinedPaymentsOut[paymentVia] = 0;
        }
        combinedPaymentsOut[paymentVia] += expense.payment_Out || 0;
    }
  }

// Process payments for Expenses schema
  const employeesPayments = await Employees.find();
 for (const employee of employeesPayments) {
      if (employee.payment) {
          for (const payment of employee.payment) {
            const paymentVia = payment.payment_Via;
            if (paymentVia.toLowerCase() !== 'cash') { // Ignore cash payments
              
                if (!combinedPaymentsOut[paymentVia]) {
                    combinedPaymentsOut[paymentVia] = 0;
                }
                combinedPaymentsOut[paymentVia] += payment.payment_Out || 0;
            }
          }
      }
  }
        // Combine payments in and out separately for each payment_via and subtract payment_Out from payment_In
      // Combine payments in and out separately for each payment_via
const combinedArray = [];
const allPaymentMethods = new Set([...Object.keys(combinedPaymentsIn), ...Object.keys(combinedPaymentsOut)]);

for (const paymentVia of allPaymentMethods) {
    const totalPaymentIn = combinedPaymentsIn[paymentVia] || 0;
    const totalPaymentOut = combinedPaymentsOut[paymentVia] || 0;
    const totalPayment = totalPaymentIn - totalPaymentOut;
    combinedArray.push({ payment_Via: paymentVia, total_payment: totalPayment });
}
const totalPaymentAcrossBanks = combinedArray.reduce((total, cash) => total + cash.total_payment, 0);

// Send the resulting combined payments in the response
res.status(200).json({ data: combinedArray,bank_Cash:totalPaymentAcrossBanks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Getting all noram payments

const getNormalPayments = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.role !== "Admin") {
            res.status(404).json({ message: "You are not an Admin" });
            return;
        }

       const normalPayments=[]
        // Array of collections to query for payment_In
        const inCollections = [
            { model: Agents, schemaType: 'payment_In_Schema' },
            { model: Suppliers, schemaType: 'payment_In_Schema' },
            { model: Candidates, schemaType: 'payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: CDWC, schemaType: 'payment_In_Schema' }, 
            { model: CDWOC, schemaType: 'payment_In_Schema' }, 
        ];

        // Initialize total advance payment for payment_In

        // Process payments for each schema for payment_In
        for (const { model, schemaType } of inCollections) {
            const items = await model.find();

            for (const item of items) {
                // Check if the payment schema exists and has the expected structure
                if (item[schemaType] && item[schemaType].payment) {
                    for (const payment of item[schemaType].payment) {
                        // Check if payment type is "Advance"
                        if (payment.payment_Type.toLowerCase() === "normal") {
                            normalPayments.push(payment)

                        }
                    }
                }
            }
        }

          


        // Array of collections to query for payment_Out
        const outCollections = [
            { model: Agents, schemaType: 'payment_Out_Schema' },
            { model: Suppliers, schemaType: 'payment_Out_Schema' },
            { model: Candidates, schemaType: 'payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: Protector, schemaType: 'payment_Out_Schema' },
            { model: CDWC, schemaType: 'payment_In_Schema' }, 
            { model: CDWOC, schemaType: 'payment_In_Schema' }, 
        ];

        
        const employees=await Employees.find()
        const expenses=await Expenses.find()

        // Initialize total advance payment for payment_Out

        // Process payments for each schema for payment_Out
        for (const { model, schemaType } of outCollections) {
            const items = await model.find();

            for (const item of items) {
                // Check if the payment schema exists and has the expected structure
                if (item[schemaType] && item[schemaType].payment) {
                    for (const payment of item[schemaType].payment) {
                        // Check if payment type is "Advance"
                        if (payment.payment_Type.toLowerCase() === "normal") {
                            normalPayments.push(payment)
                           
                        }
                    }
                }
            }
        }

        
        // for(const employee of employees){
        //     if(employee.payment){
        //         const payments=employee.payment
        //         if(payments){
        //             for(const payment of payments){
        //                 if(payment.payment_Type.toLowerCase() === "normal"){
        //                     normalPayments.push(payment)
        //                 }
        //             }
        //         }
        //     }
        // }

        // for(const expense of expenses){
        //     if(expense){
        //         if(expense){
                  
        //                 if(expense.payment_Type.toLowerCase() === "normal"){
        //                     normalPayments.push(payment)
                           
        //                 }
                    
        //         }
        //     }
        // }

          // Initialize total advance payment for payment_In

          // Process payments for each schema for payment_In
          for (const { model, schemaType } of outCollections) {
              const items = await model.find();
  
              for (const item of items) {
                  // Check if the payment schema exists and has the expected structure
                  if (item[schemaType] && item[schemaType].payment) {
                      for (const payment of item[schemaType].payment) {
                          // Check if payment type is "Advance"
                          if (payment.payment_Type.toLowerCase() === "normal" ) {
                            normalPayments.push(payment)
                             
                          }
                      }
                  }
              }
          }
        // Send the resulting total advance payments in the response
        res.status(200).json({data:normalPayments});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Getting all Advance payments

const getAdvancePayments = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.role !== "Admin") {
            res.status(404).json({ message: "You are not an Admin" });
            return;
        }

       const advancePayments=[]
        // Array of collections to query for payment_In
        const inCollections = [
            { model: Agents, schemaType: 'payment_In_Schema' },
            { model: Suppliers, schemaType: 'payment_In_Schema' },
            { model: Candidates, schemaType: 'payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_In_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_In_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_In_Schema' },
            { model: CDWC, schemaType: 'payment_In_Schema' }, 
            { model: CDWOC, schemaType: 'payment_In_Schema' }, 
        ];

        // Initialize total advance payment for payment_In

        // Process payments for each schema for payment_In
        for (const { model, schemaType } of inCollections) {
            const items = await model.find();

            for (const item of items) {
                // Check if the payment schema exists and has the expected structure
                if (item[schemaType] && item[schemaType].payment) {
                    for (const payment of item[schemaType].payment) {
                        // Check if payment type is "Advance"
                        if (payment.payment_Type.toLowerCase() === "advance") {
                            
                            advancePayments.push(payment)

                        }
                    }
                }
            }
        }

          


        // Array of collections to query for payment_Out
        const outCollections = [
            { model: Agents, schemaType: 'payment_Out_Schema' },
            { model: Suppliers, schemaType: 'payment_Out_Schema' },
            { model: Candidates, schemaType: 'payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Agent_Payment_Out_Schema' },
            { model: AzadSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: TicketSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: VisitSuppliers, schemaType: 'Supplier_Payment_Out_Schema' },
            { model: AzadCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: TicketCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: VisitCandidates, schemaType: 'Candidate_Payment_Out_Schema' },
            { model: Protector, schemaType: 'payment_Out_Schema' },
            { model: CDWC, schemaType: 'payment_In_Schema' }, 
            { model: CDWOC, schemaType: 'payment_In_Schema' }, 
        ];

        
        const employees=await Employees.find()
        const expenses=await Expenses.find()

        // Initialize total advance payment for payment_Out

        // Process payments for each schema for payment_Out
        for (const { model, schemaType } of outCollections) {
            const items = await model.find();

            for (const item of items) {
                // Check if the payment schema exists and has the expected structure
                if (item[schemaType] && item[schemaType].payment) {
                    for (const payment of item[schemaType].payment) {
                        // Check if payment type is "Advance"
                        if (payment.payment_Type.toLowerCase() === "advance") {
                            advancePayments.push(payment)

                        }
                    }
                }
            }
        }

        
        // for(const employee of employees){
        //     if(employee.payment){
        //         const payments=employee.payment
        //         if(payments){
        //             for(const payment of payments){
        //                 if(payment.payment_Type.toLowerCase() === "advance"){
        //                     advancePayments.push(payment)
                           

        //                 }
        //             }
        //         }
        //     }
        // }

        // for(const expense of expenses){
        //     if(expense){
        //         if(expense){
                  
        //                 if(expense.payment_Type.toLowerCase() === "advance"){
        //                     advancePayments.push(payment)
                           
        //                 }
                    
        //         }
        //     }
        // }

          // Initialize total advance payment for payment_In

          // Process payments for each schema for payment_In
          for (const { model, schemaType } of outCollections) {
              const items = await model.find();
  
              for (const item of items) {
                  // Check if the payment schema exists and has the expected structure
                  if (item[schemaType] && item[schemaType].payment) {
                      for (const payment of item[schemaType].payment) {
                          // Check if payment type is "Advance"
                          if (payment.payment_Type.toLowerCase() === "advance" ) {
                            advancePayments.push(payment)
                             
                          }
                      }
                  }
              }
          }
        // Send the resulting total advance payments in the response
        res.status(200).json({data:advancePayments} );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllPayments,getPersons,getTotalPayments,getTotalAdvancePayments,getAllPaymentsByDate,getEmployeesPayments,getProtectorPayments,getAllBanksPayments,getNormalPayments,getAdvancePayments
}
