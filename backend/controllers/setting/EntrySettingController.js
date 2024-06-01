const User = require('../../database/userdb/UserSchema')
const AVPP = require('../../database/setting/AVPP_Schema')
const AVSP = require('../../database/setting/AVSP_Schema')
const CPP = require('../../database/setting/CPP_Schema')
const TPP = require('../../database/setting/TPP_Schema')
const TSP = require('../../database/setting/TSP_Schema')
const VIPP = require('../../database/setting/VIPP_Schema')
const VISP = require('../../database/setting/VISP_Schema')
const VPP = require('../../database/setting/VPP_Schema')
const VSP = require('../../database/setting/VSP_Schema')
const Companies = require('../../database/setting/Company_Schema')
const Trades = require('../../database/setting/Trade_Schmea')
const CurrCountries = require('../../database/setting/Curr_Country_Schema')
const PaymentVia = require('../../database/setting/Paymeny_Via_Schema')
const PaymentType = require('../../database/setting/Payment_Type_Schema')
const EntryMode = require('../../database/setting/Entry_Mode_Schema')
const FinalStatus = require('../../database/setting/Final_Status_Schema')
const Countries = require('../../database/setting/Country_Schema')
const Categories = require('../../database/setting/Category_Schema')
const ExpenseCategories = require('../../database/setting/Expe_Category_Schema')
const Currencies = require('../../database/setting/Currency_Schema')
const ProtectorParties=require('../../database/setting/Protector_Schema')
const Suppliers = require("../../database/suppliers/SupplierSchema");
const Agents = require("../../database/agents/AgentSchema");
const Candidates = require("../../database/candidate/CandidateSchema");
const AzadSuppliers = require("../../database/azadSuppliers/AzadSupplierSchema");
const AzadCandidates = require("../../database/azadCandidates/AzadCandidateSchema");
const TicketSuppliers = require("../../database/ticketSuppliers/TicketSupplierSchema");
const TicketCandidates = require("../../database/ticketCandidates/TicketCandidateSchema");
const VisitSuppliers = require("../../database/visitSuppliers/VisitSupplierSchema");
const VisitCandidates = require("../../database/visitCandidates/VisitCandidateSchema");
const Protector = require("../../database/protector/ProtectorSchema");
const Entries = require("../../database/enteries/EntrySchema");
const CDWC=require('../../database/creditsDebitsWC/CDWCSchema')
const CDWOC=require('../../database/creditsDebitsWOC/CDWOCSchema')
const Expenses=require('../../database/expenses/ExpenseSchema')
const Employees =require('../../database/employees/EmployeeSchema')
const CashInHand=require('../../database/cashInHand/CashInHandSchema')
const Assets =require('../../database/assets/AssetsSchema')
const MyAssets =require('../../database/setting/MyAssetsModel')


const AzadAgents = require("../../database/azadAgent/AzadAgentSchema");
const TicketAgents = require("../../database/ticketAgent/TicketAgentSchema");
const VisitAgents = require("../../database/visitAgent/VisitAgentSchema");

const cloudinary = require('../cloudinary')

// 1- Visa Sales Parties Controllers

// adding a new Visa Sales Party

const addVSP = async (req, res) => {
    try {
        const { supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierName) {
            return res.status(400).json({ message: "Supplier Name is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a Supplier with the same name already exists

                const existingSupplier = await VSP.findOne({ supplierName });
                if (existingSupplier) {
                    return res.status(400).json({ message: "A Supplier with this Name already exists" });
                }

                if (!existingSupplier) {

                    // uploading picture to cloudinary
                    let uploadImage
                    if(picture){
                      uploadImage = await cloudinary.uploader.upload(picture, {
                        upload_preset: 'rozgar'
                    })
                    }
                  

                    const newSupplier = new VSP({
                        supplierName,
                        supplierCompany,
                        country,
                        contact,
                        address,
                        picture: uploadImage?.secure_url || ""
                    })

                    await newSupplier.save()
                    res.status(200).json({ data: newSupplier, message: `${supplierName} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const updateVSP = async (req, res) => {
    try {
        const { supplierId,supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierId) {
            return res.status(400).json({ message: "Supplier Id is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {
                // Check if a Supplier with the same name already exists

                const existingSupplier = await VSP.findById(supplierId);
                if (!existingSupplier) {
                    return res.status(400).json({ message: "Supplier not found!" });
                }
                if (existingSupplier) {
                   
                    //   Updating Agents
                      const existingAgentIn = await Agents.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentIn){
                        existingAgentIn.payment_In_Schema.supplierName=supplierName
                        await existingAgentIn.save()
                      }

                      const existingAgentOut = await Agents.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentOut){
                        existingAgentOut.payment_Out_Schema.supplierName=supplierName
                        await existingAgentOut.save()
                      }

                        //   Updating Suppliers
                      const existingSupplierIn = await Suppliers.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingSupplierIn){
                        existingSupplierIn.payment_In_Schema.supplierName=supplierName
                        await existingSupplierIn.save()
                      }

                      const existingSupplierOut = await Suppliers.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      })
                      if(existingSupplierOut){
                        existingSupplierOut.payment_Out_Schema.supplierName=supplierName
                        await existingSupplierOut.save()
                      }

                        //   Updating Candidates
                        const existingCandIn = await Candidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingCandIn){
                            existingCandIn.payment_In_Schema.supplierName=supplierName
                            await existingCandIn.save()
                          }
    
                          const existingCandOut = await Candidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingCandOut){
                            existingCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingCandOut.save()
                          }

                           //   Updating Azad Suppliers and Agents
                        const existingAzadSupIn = await AzadSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadSupIn){
                            existingAzadSupIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadSupIn.save()
                          }
    
                          const existingAzadSupOut = await AzadSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadSupOut){
                            existingAzadSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadSupOut.save()
                          }

                          const existingAzadAgentIn = await AzadAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadAgentIn){
                            existingAzadAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadAgentIn.save()
                          }
    
                          const existingAzadAgentOut = await AzadAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadAgentOut){
                            existingAzadAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadAgentOut.save()
                          }

                            //   Updating Ticket Suppliers and Agents
                        const existingTicketSupIn = await TicketSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketSupIn){
                            existingTicketSupIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketSupIn.save()
                          }
    
                          const existingTicketSupOut = await TicketSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketSupOut){
                            existingTicketSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketSupOut.save()
                          }

                          const existingTicketAgentIn = await TicketAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketAgentIn){
                            existingTicketAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketAgentIn.save()
                          }
    
                          const existingTicketAgentOut = await TicketAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketAgentOut){
                            existingTicketAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketAgentOut.save()
                          }
    
                           //   Updating Visit Suppliers and Agents
                        const existingVisitSupIn = await VisitSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitSupIn){
                            existingVisitSupIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitSupIn.save()
                          }
    
                          const existingVisitSupOut = await VisitSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitSupOut){
                            existingVisitSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitSupOut.save()
                          }

                          const existingVisitAgentIn = await VisitAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitAgentIn){
                            existingVisitAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitAgentIn.save()
                          }
    
                          const existingVisitAgentOut = await VisitAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitAgentOut){
                            existingVisitAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitAgentOut.save()
                          }

                        //   Updating Azad Candidate
                        const existingAzadCandIn = await AzadCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadCandIn){
                            existingAzadCandIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadCandIn.save()
                          }
    
                          const existingAzadCandOut = await AzadCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadCandOut){
                            existingAzadCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadCandOut.save()
                          }

                          //   Updating Ticket Candidate
                        const existingTicketCandIn = await TicketCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketCandIn){
                            existingTicketCandIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketCandIn.save()
                          }
    
                          const existingTicketCandOut = await TicketCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketCandOut){
                            existingTicketCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketCandOut.save()
                          }

                           //   Updating Visit Candidate
                        const existingVisitCandIn = await VisitCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitCandIn){
                            existingVisitCandIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitCandIn.save()
                          }
    
                          const existingVisitCandOut = await VisitCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitCandOut){
                            existingVisitCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitCandOut.save()
                          }

                                   
                          const entries = await Entries.find();

                          for (const entry of entries) {
                              if (entry.reference_In_Name === existingSupplier.supplierName) {
                                  entry.reference_In_Name = supplierName;
                              }
                              if (entry.reference_Out_Name === existingSupplier.supplierName) {
                                  entry.reference_Out_Name = supplierName;
                              }
                              if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_In_Name = supplierName;
                              }
                              if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_Out_Name = supplierName;
                              }
                              if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_In_Name = supplierName;
                              }
                              if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_Out_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_In_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_Out_Name = supplierName;
                              }
                              await entry.save(); // Save the updated entry
                          }

                        
                          let uploadImage
                          if(picture && !picture.startsWith("https://res.cloudinary.com")){
                              // uploading picture to cloudinary
                               uploadImage = await cloudinary.uploader.upload(picture, {
                                  upload_preset: 'rozgar'
                              })
                          }
                          existingSupplier.supplierName=supplierName
                          existingSupplier.supplierCompany=supplierCompany
                          existingSupplier.country=country
                          existingSupplier.contact=contact
                          existingSupplier.address=address
                          if (picture && uploadImage) {
                              existingSupplier.picture = uploadImage.secure_url;
                            }
      
      
                    await existingSupplier.save()
                    res.status(200).json({  message: `Supplier updated successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const deleteVSP = async (req, res) => {
  try {
    const { supplierId } = req.body
    if (!supplierId) {
      return res.status(400).json({ message: "Supplier Id is required" })
    }

    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    if (user) {
      // Checking User Role 
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" })
      }

      if (user.role === "Admin") {
        // Check if a Supplier with the same name already exists

        const existingSupplier = await VSP.findById(supplierId);
        if (!existingSupplier) {
          return res.status(400).json({ message: "Supplier not found!" });
        }
        if (existingSupplier) {

          //   Updating Agents
          const existingAgentIn = await Agents.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentIn) {

            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentIn.payment_In_Schema = null
            await existingAgentIn.save()
          }

          const existingAgentOut = await Agents.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentOut) {
            
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentOut.payment_Out_Schema = null
            await existingAgentOut.save()
          }

          //   Updating Suppliers
          const existingSupplierIn = await Suppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingSupplierIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierIn.payment_In_Schema = null
            await existingSupplierIn.save()
          }

          const existingSupplierOut = await Suppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingSupplierOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierOut.payment_Out_Schema = null
            await existingSupplierOut.save()
          }

          //   Updating Candidates
          const existingCandIn = await Candidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandIn.payment_In_Schema = null
            await existingCandIn.save()
          }

          const existingCandOut = await Candidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandOut.payment_Out_Schema = null
            await existingCandOut.save()
          }

          //   Updating Azad Suppliers and Agents
          const existingAzadSupIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupIn.payment_In_Schema = null
            await existingAzadSupIn.save()
          }

          const existingAzadSupOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };

            cashInHandUpdate.$inc.total_Cash = -existingAzadSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupOut.payment_Out_Schema = null
            await existingAzadSupOut.save()
          }

          const existingAzadAgentIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentIn.payment_In_Schema = null
            await existingAzadAgentIn.save()
          }

          const existingAzadAgentOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentOut.payment_Out_Schema = null
            await existingAzadAgentOut.save()
          }

          //   Updating Ticket Suppliers and Agents
          const existingTicketSupIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupIn.payment_In_Schema = null
            await existingTicketSupIn.save()
          }

          const existingTicketSupOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupOut.payment_Out_Schema = null
            await existingTicketSupOut.save()
          }

          const existingTicketAgentIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentIn.payment_In_Schema = null
            await existingTicketAgentIn.save()
          }

          const existingTicketAgentOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentOut.payment_Out_Schema = null
            await existingTicketAgentOut.save()
          }

          //   Updating Visit Suppliers and Agents
          const existingVisitSupIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupIn.payment_In_Schema = null
            await existingVisitSupIn.save()
          }

          const existingVisitSupOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupOut.payment_Out_Schema = null
            await existingVisitSupOut.save()
          }

          const existingVisitAgentIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentIn.payment_In_Schema = null
            await existingVisitAgentIn.save()
          }

          const existingVisitAgentOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentOut.payment_Out_Schema = null
            await existingVisitAgentOut.save()
          }

          //   Updating Azad Candidate
          const existingAzadCandIn = await AzadCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandIn.payment_In_Schema = null
            await existingAzadCandIn.save()
          }

          const existingAzadCandOut = await AzadCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandOut.payment_Out_Schema = null
            await existingAzadCandOut.save()
          }

          //   Updating Ticket Candidate
          const existingTicketCandIn = await TicketCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandIn.payment_In_Schema = null
            await existingTicketCandIn.save()
          }

          const existingTicketCandOut = await TicketCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandOut.payment_Out_Schema = null
            await existingTicketCandOut.save()
          }

          //   Updating Visit Candidate
          const existingVisitCandIn = await VisitCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandIn.payment_In_Schema = null
            await existingVisitCandIn.save()
          }

          const existingVisitCandOut = await VisitCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandOut.payment_Out_Schema = null
            await existingVisitCandOut.save()
          }


          const entries = await Entries.find();

          for (const entry of entries) {
            if (entry.reference_In_Name === existingSupplier.supplierName) {
              entry.reference_In_Name = "";
            }
            if (entry.reference_Out_Name === existingSupplier.supplierName) {
              entry.reference_Out_Name = "";
            }
            if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
              entry.visit_Reference_In_Name = "";
            }
            if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
              entry.visit_Reference_Out_Name = "";
            }
            if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_In_Name = "";
            }
            if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_Out_Name = "";
            }
            if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_In_Name = "";
            }
            if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_Out_Name = "";
            }
            await entry.save(); // Save the updated entry
          }
          const deleteSupplier = await VSP.findByIdAndDelete(supplierId);

          res.status(200).json({ message: `Supplier deleted successfully` })
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// getting Visa Sales Parties

const getVSP = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const visaSalesParties = await VSP.find({})
            res.status(200).json({ data: visaSalesParties })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}



//2- Visa Purchase Parties Controllers

//Adding a New Visa Purchase Party

const addVPP = async (req, res) => {
    try {
        const { supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierName) {
            return res.status(400).json({ message: "Supplier Name is required" })
        }
      
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a Supplier with the same name already exists

                const existingSupplier = await VPP.findOne({ supplierName });
                if (existingSupplier) {
                    return res.status(400).json({ message: "A Supplier with this Name already exists" });
                }

                if (!existingSupplier) {

                  let uploadImage 
                  if(picture){
                  // uploading picture to cloudinary
                   uploadImage = await cloudinary.uploader.upload(picture, {
                    upload_preset: 'rozgar'
                  })
                                    }
                    

                    const newSupplier = new VPP({
                        supplierName,
                        supplierCompany,
                        country,
                        contact,
                        address,
                        picture: uploadImage?.secure_url || ""
                    })

                    await newSupplier.save()
                    res.status(200).json({ data: newSupplier, message: `${supplierName} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const updateVPP = async (req, res) => {
    try {
        const { supplierId,supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierId) {
            return res.status(400).json({ message: "Supplier Id is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {
                // Check if a Supplier with the same name already exists

                const existingSupplier = await VPP.findById(supplierId);
                if (!existingSupplier) {
                    return res.status(400).json({ message: "Supplier not found!" });
                }
                if (existingSupplier) {
                  
                    //   Updating Agents
                      const existingAgentIn = await Agents.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentIn){
                        existingAgentIn.payment_In_Schema.supplierName=supplierName
                        await existingAgentIn.save()
                      }

                      const existingAgentOut = await Agents.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentOut){
                        existingAgentOut.payment_Out_Schema.supplierName=supplierName
                        await existingAgentOut.save()
                      }

                        //   Updating Suppliers
                      const existingSupplierIn = await Suppliers.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingSupplierIn){
                        existingSupplierIn.payment_In_Schema.supplierName=supplierName
                        await existingSupplierIn.save()
                      }

                      const existingSupplierOut = await Suppliers.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      })
                      if(existingSupplierOut){
                        existingSupplierOut.payment_Out_Schema.supplierName=supplierName
                        await existingSupplierOut.save()
                      }

                        //   Updating Candidates
                        const existingCandIn = await Candidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingCandIn){
                            existingCandIn.payment_In_Schema.supplierName=supplierName
                            await existingCandIn.save()
                          }
    
                          const existingCandOut = await Candidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingCandOut){
                            existingCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingCandOut.save()
                          }

                           //   Updating Azad Suppliers and Agents
                        const existingAzadSupIn = await AzadSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadSupIn){
                            existingAzadSupIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadSupIn.save()
                          }
    
                          const existingAzadSupOut = await AzadSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadSupOut){
                            existingAzadSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadSupOut.save()
                          }

                          const existingAzadAgentIn = await AzadAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadAgentIn){
                            existingAzadAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadAgentIn.save()
                          }
    
                          const existingAzadAgentOut = await AzadAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadAgentOut){
                            existingAzadAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadAgentOut.save()
                          }

                            //   Updating Ticket Suppliers and Agents
                        const existingTicketSupIn = await TicketSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketSupIn){
                            existingTicketSupIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketSupIn.save()
                          }
    
                          const existingTicketSupOut = await TicketSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketSupOut){
                            existingTicketSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketSupOut.save()
                          }

                          const existingTicketAgentIn = await TicketAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketAgentIn){
                            existingTicketAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketAgentIn.save()
                          }
    
                          const existingTicketAgentOut = await TicketAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketAgentOut){
                            existingTicketAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketAgentOut.save()
                          }
    
                           //   Updating Visit Suppliers and Agents
                        const existingVisitSupIn = await VisitSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitSupIn){
                            existingVisitSupIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitSupIn.save()
                          }
    
                          const existingVisitSupOut = await VisitSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitSupOut){
                            existingVisitSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitSupOut.save()
                          }

                          const existingVisitAgentIn = await VisitAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitAgentIn){
                            existingVisitAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitAgentIn.save()
                          }
    
                          const existingVisitAgentOut = await VisitAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitAgentOut){
                            existingVisitAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitAgentOut.save()
                          }

                        //   Updating Azad Candidate
                        const existingAzadCandIn = await AzadCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadCandIn){
                            existingAzadCandIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadCandIn.save()
                          }
    
                          const existingAzadCandOut = await AzadCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadCandOut){
                            existingAzadCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadCandOut.save()
                          }

                          //   Updating Ticket Candidate
                        const existingTicketCandIn = await TicketCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketCandIn){
                            existingTicketCandIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketCandIn.save()
                          }
    
                          const existingTicketCandOut = await TicketCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketCandOut){
                            existingTicketCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketCandOut.save()
                          }

                           //   Updating Visit Candidate
                        const existingVisitCandIn = await VisitCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitCandIn){
                            existingVisitCandIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitCandIn.save()
                          }
    
                          const existingVisitCandOut = await VisitCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitCandOut){
                            existingVisitCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitCandOut.save()
                          }

                            
                          const entries = await Entries.find();

                          for (const entry of entries) {
                              if (entry.reference_In_Name === existingSupplier.supplierName) {
                                  entry.reference_In_Name = supplierName;
                              }
                              if (entry.reference_Out_Name === existingSupplier.supplierName) {
                                  entry.reference_Out_Name = supplierName;
                              }
                              if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_In_Name = supplierName;
                              }
                              if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_Out_Name = supplierName;
                              }
                              if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_In_Name = supplierName;
                              }
                              if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_Out_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_In_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_Out_Name = supplierName;
                              }
                              await entry.save(); // Save the updated entry
                          }

                          let uploadImage
                    if(picture && !picture.startsWith("https://res.cloudinary.com")){
                    
                    
                         uploadImage = await cloudinary.uploader.upload(picture, {
                            upload_preset: 'rozgar'
                        })
                    }
                   
                    existingSupplier.supplierName=supplierName
                    existingSupplier.supplierCompany=supplierCompany
                    existingSupplier.country=country
                    existingSupplier.contact=contact
                    existingSupplier.address=address
                    if (picture && uploadImage) {
                        existingSupplier.picture = uploadImage.secure_url;
                      }


                    await existingSupplier.save()
                    res.status(200).json({  message: `Supplier updated successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// updating Visa Sales Parties

const deleteVPP = async (req, res) => {
  try {
    const { supplierId } = req.body
    if (!supplierId) {
      return res.status(400).json({ message: "Supplier Id is required" })
    }

    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    if (user) {
      // Checking User Role 
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" })
      }

      if (user.role === "Admin") {
        // Check if a Supplier with the same name already exists

        const existingSupplier = await VPP.findById(supplierId);
        if (!existingSupplier) {
          return res.status(400).json({ message: "Supplier not found!" });
        }
        if (existingSupplier) {

          //   Updating Agents
          const existingAgentIn = await Agents.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentIn) {

            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentIn.payment_In_Schema = null
            await existingAgentIn.save()
          }

          const existingAgentOut = await Agents.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentOut) {
            
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentOut.payment_Out_Schema = null
            await existingAgentOut.save()
          }

          //   Updating Suppliers
          const existingSupplierIn = await Suppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingSupplierIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierIn.payment_In_Schema = null
            await existingSupplierIn.save()
          }

          const existingSupplierOut = await Suppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingSupplierOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierOut.payment_Out_Schema = null
            await existingSupplierOut.save()
          }

          //   Updating Candidates
          const existingCandIn = await Candidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandIn.payment_In_Schema = null
            await existingCandIn.save()
          }

          const existingCandOut = await Candidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandOut.payment_Out_Schema = null
            await existingCandOut.save()
          }

          //   Updating Azad Suppliers and Agents
          const existingAzadSupIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupIn.payment_In_Schema = null
            await existingAzadSupIn.save()
          }

          const existingAzadSupOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupOut.payment_Out_Schema = null
            await existingAzadSupOut.save()
          }

          const existingAzadAgentIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentIn.payment_In_Schema = null
            await existingAzadAgentIn.save()
          }

          const existingAzadAgentOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentOut.payment_Out_Schema = null
            await existingAzadAgentOut.save()
          }

          //   Updating Ticket Suppliers and Agents
          const existingTicketSupIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupIn.payment_In_Schema = null
            await existingTicketSupIn.save()
          }

          const existingTicketSupOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupOut.payment_Out_Schema = null
            await existingTicketSupOut.save()
          }

          const existingTicketAgentIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentIn.payment_In_Schema = null
            await existingTicketAgentIn.save()
          }

          const existingTicketAgentOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentOut.payment_Out_Schema = null
            await existingTicketAgentOut.save()
          }

          //   Updating Visit Suppliers and Agents
          const existingVisitSupIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupIn.payment_In_Schema = null
            await existingVisitSupIn.save()
          }

          const existingVisitSupOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupOut.payment_Out_Schema = null
            await existingVisitSupOut.save()
          }

          const existingVisitAgentIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentIn.payment_In_Schema = null
            await existingVisitAgentIn.save()
          }

          const existingVisitAgentOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentOut.payment_Out_Schema = null
            await existingVisitAgentOut.save()
          }

          //   Updating Azad Candidate
          const existingAzadCandIn = await AzadCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandIn.payment_In_Schema = null
            await existingAzadCandIn.save()
          }

          const existingAzadCandOut = await AzadCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandOut.payment_Out_Schema = null
            await existingAzadCandOut.save()
          }

          //   Updating Ticket Candidate
          const existingTicketCandIn = await TicketCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandIn.payment_In_Schema = null
            await existingTicketCandIn.save()
          }

          const existingTicketCandOut = await TicketCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandOut.payment_Out_Schema = null
            await existingTicketCandOut.save()
          }

          //   Updating Visit Candidate
          const existingVisitCandIn = await VisitCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandIn.payment_In_Schema = null
            await existingVisitCandIn.save()
          }

          const existingVisitCandOut = await VisitCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandOut.payment_Out_Schema = null
            await existingVisitCandOut.save()
          }


          const entries = await Entries.find();

          for (const entry of entries) {
            if (entry.reference_In_Name === existingSupplier.supplierName) {
              entry.reference_In_Name = "";
            }
            if (entry.reference_Out_Name === existingSupplier.supplierName) {
              entry.reference_Out_Name = "";
            }
            if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
              entry.visit_Reference_In_Name = "";
            }
            if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
              entry.visit_Reference_Out_Name = "";
            }
            if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_In_Name = "";
            }
            if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_Out_Name = "";
            }
            if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_In_Name = "";
            }
            if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_Out_Name = "";
            }
            await entry.save(); // Save the updated entry
          }

          const deleteSupplier = await VPP.findByIdAndDelete(supplierId);

          res.status(200).json({ message: `Supplier deleted successfully` })
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// getting Visa Purchase Parties

const getVPP = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const visaPurchaseParties = await VPP.find({})
            res.status(200).json({ data: visaPurchaseParties })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


//3- Ticket Sales Parties Controllers

//Adding a New Ticket Sales Parties

const addTSP = async (req, res) => {
    try {
        const { supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierName) {
            return res.status(400).json({ message: "Supplier Name is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }
            if (user.role === "Admin") {

                // Check if a Supplier with the same name already exists

                const existingSupplier = await TSP.findOne({ supplierName });
                if (existingSupplier) {
                    return res.status(400).json({ message: "A Supplier with this Name already exists" });
                }

                if (!existingSupplier) {
                  let uploadImage
                  if(picture){
                    // uploading picture to cloudinary
                    uploadImage = await cloudinary.uploader.upload(picture, {
                      upload_preset: 'rozgar'
                    })
                  }
                    
                    const newSupplier = new TSP({
                        supplierName,
                        supplierCompany,
                        country,
                        contact,
                        address,
                        picture: uploadImage?.secure_url || ""
                    })

                    await newSupplier.save()
                    res.status(200).json({ data: newSupplier, message: `${supplierName} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const updateTSP = async (req, res) => {
    try {
        const { supplierId,supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierId) {
            return res.status(400).json({ message: "Supplier Id is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {
                // Check if a Supplier with the same name already exists

                const existingSupplier = await TSP.findById(supplierId);
                if (!existingSupplier) {
                    return res.status(400).json({ message: "Supplier not found!" });
                }
                if (existingSupplier) {
                  

                    //   Updating Agents
                      const existingAgentIn = await Agents.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentIn){
                        existingAgentIn.payment_In_Schema.supplierName=supplierName
                        await existingAgentIn.save()
                      }

                      const existingAgentOut = await Agents.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentOut){
                        existingAgentOut.payment_Out_Schema.supplierName=supplierName
                        await existingAgentOut.save()
                      }

                        //   Updating Suppliers
                      const existingSupplierIn = await Suppliers.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingSupplierIn){
                        existingSupplierIn.payment_In_Schema.supplierName=supplierName
                        await existingSupplierIn.save()
                      }

                      const existingSupplierOut = await Suppliers.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      })
                      if(existingSupplierOut){
                        existingSupplierOut.payment_Out_Schema.supplierName=supplierName
                        await existingSupplierOut.save()
                      }

                        //   Updating Candidates
                        const existingCandIn = await Candidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingCandIn){
                            existingCandIn.payment_In_Schema.supplierName=supplierName
                            await existingCandIn.save()
                          }
    
                          const existingCandOut = await Candidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingCandOut){
                            existingCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingCandOut.save()
                          }

                           //   Updating Azad Suppliers and Agents
                        const existingAzadSupIn = await AzadSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadSupIn){
                            existingAzadSupIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadSupIn.save()
                          }
    
                          const existingAzadSupOut = await AzadSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadSupOut){
                            existingAzadSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadSupOut.save()
                          }

                          const existingAzadAgentIn = await AzadAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadAgentIn){
                            existingAzadAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadAgentIn.save()
                          }
    
                          const existingAzadAgentOut = await AzadAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadAgentOut){
                            existingAzadAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadAgentOut.save()
                          }

                            //   Updating Ticket Suppliers and Agents
                        const existingTicketSupIn = await TicketSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketSupIn){
                            existingTicketSupIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketSupIn.save()
                          }
    
                          const existingTicketSupOut = await TicketSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketSupOut){
                            existingTicketSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketSupOut.save()
                          }

                          const existingTicketAgentIn = await TicketAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketAgentIn){
                            existingTicketAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketAgentIn.save()
                          }
    
                          const existingTicketAgentOut = await TicketAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketAgentOut){
                            existingTicketAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketAgentOut.save()
                          }
    
                           //   Updating Visit Suppliers and Agents
                        const existingVisitSupIn = await VisitSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitSupIn){
                            existingVisitSupIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitSupIn.save()
                          }
    
                          const existingVisitSupOut = await VisitSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitSupOut){
                            existingVisitSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitSupOut.save()
                          }

                          const existingVisitAgentIn = await VisitAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitAgentIn){
                            existingVisitAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitAgentIn.save()
                          }
    
                          const existingVisitAgentOut = await VisitAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitAgentOut){
                            existingVisitAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitAgentOut.save()
                          }

                        //   Updating Azad Candidate
                        const existingAzadCandIn = await AzadCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadCandIn){
                            existingAzadCandIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadCandIn.save()
                          }
    
                          const existingAzadCandOut = await AzadCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadCandOut){
                            existingAzadCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadCandOut.save()
                          }

                          //   Updating Ticket Candidate
                        const existingTicketCandIn = await TicketCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketCandIn){
                            existingTicketCandIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketCandIn.save()
                          }
    
                          const existingTicketCandOut = await TicketCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketCandOut){
                            existingTicketCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketCandOut.save()
                          }

                           //   Updating Visit Candidate
                        const existingVisitCandIn = await VisitCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitCandIn){
                            existingVisitCandIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitCandIn.save()
                          }
    
                          const existingVisitCandOut = await VisitCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitCandOut){
                            existingVisitCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitCandOut.save()
                          }

                              
                          const entries = await Entries.find();

                          for (const entry of entries) {
                              if (entry.reference_In_Name === existingSupplier.supplierName) {
                                  entry.reference_In_Name = supplierName;
                              }
                              if (entry.reference_Out_Name === existingSupplier.supplierName) {
                                  entry.reference_Out_Name = supplierName;
                              }
                              if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_In_Name = supplierName;
                              }
                              if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_Out_Name = supplierName;
                              }
                              if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_In_Name = supplierName;
                              }
                              if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_Out_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_In_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_Out_Name = supplierName;
                              }
                              await entry.save(); // Save the updated entry
                          }

                        
                          let uploadImage
                          if(picture && !picture.startsWith("https://res.cloudinary.com")){
                              // uploading picture to cloudinary
                               uploadImage = await cloudinary.uploader.upload(picture, {
                                  upload_preset: 'rozgar'
                              })
                          }
                          existingSupplier.supplierName=supplierName
                          existingSupplier.supplierCompany=supplierCompany
                          existingSupplier.country=country
                          existingSupplier.contact=contact
                          existingSupplier.address=address
                          if (picture && uploadImage) {
                              existingSupplier.picture = uploadImage.secure_url;
                            }
      
                    await existingSupplier.save()
                    res.status(200).json({  message: `Supplier updated successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const deleteTSP = async (req, res) => {
  try {
    const { supplierId } = req.body
    if (!supplierId) {
      return res.status(400).json({ message: "Supplier Id is required" })
    }

    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    if (user) {
      // Checking User Role 
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" })
      }

      if (user.role === "Admin") {
        // Check if a Supplier with the same name already exists

        const existingSupplier = await TSP.findById(supplierId);
        if (!existingSupplier) {
          return res.status(400).json({ message: "Supplier not found!" });
        }
        if (existingSupplier) {

          //   Updating Agents
          const existingAgentIn = await Agents.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentIn) {

            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentIn.payment_In_Schema = null
            await existingAgentIn.save()
          }

          const existingAgentOut = await Agents.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentOut) {
            
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentOut.payment_Out_Schema = null
            await existingAgentOut.save()
          }

          //   Updating Suppliers
          const existingSupplierIn = await Suppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingSupplierIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierIn.payment_In_Schema = null
            await existingSupplierIn.save()
          }

          const existingSupplierOut = await Suppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingSupplierOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierOut.payment_Out_Schema = null
            await existingSupplierOut.save()
          }

          //   Updating Candidates
          const existingCandIn = await Candidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandIn.payment_In_Schema = null
            await existingCandIn.save()
          }

          const existingCandOut = await Candidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandOut.payment_Out_Schema = null
            await existingCandOut.save()
          }

          //   Updating Azad Suppliers and Agents
          const existingAzadSupIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupIn.payment_In_Schema = null
            await existingAzadSupIn.save()
          }

          const existingAzadSupOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupOut.payment_Out_Schema = null
            await existingAzadSupOut.save()
          }

          const existingAzadAgentIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentIn.payment_In_Schema = null
            await existingAzadAgentIn.save()
          }

          const existingAzadAgentOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentOut.payment_Out_Schema = null
            await existingAzadAgentOut.save()
          }

          //   Updating Ticket Suppliers and Agents
          const existingTicketSupIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupIn.payment_In_Schema = null
            await existingTicketSupIn.save()
          }

          const existingTicketSupOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupOut.payment_Out_Schema = null
            await existingTicketSupOut.save()
          }

          const existingTicketAgentIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentIn.payment_In_Schema = null
            await existingTicketAgentIn.save()
          }

          const existingTicketAgentOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentOut.payment_Out_Schema = null
            await existingTicketAgentOut.save()
          }

          //   Updating Visit Suppliers and Agents
          const existingVisitSupIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupIn.payment_In_Schema = null
            await existingVisitSupIn.save()
          }

          const existingVisitSupOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupOut.payment_Out_Schema = null
            await existingVisitSupOut.save()
          }

          const existingVisitAgentIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentIn.payment_In_Schema = null
            await existingVisitAgentIn.save()
          }

          const existingVisitAgentOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentOut.payment_Out_Schema = null
            await existingVisitAgentOut.save()
          }

          //   Updating Azad Candidate
          const existingAzadCandIn = await AzadCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandIn.payment_In_Schema = null
            await existingAzadCandIn.save()
          }

          const existingAzadCandOut = await AzadCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandOut.payment_Out_Schema = null
            await existingAzadCandOut.save()
          }

          //   Updating Ticket Candidate
          const existingTicketCandIn = await TicketCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandIn.payment_In_Schema = null
            await existingTicketCandIn.save()
          }

          const existingTicketCandOut = await TicketCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandOut.payment_Out_Schema = null
            await existingTicketCandOut.save()
          }

          //   Updating Visit Candidate
          const existingVisitCandIn = await VisitCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandIn.payment_In_Schema = null
            await existingVisitCandIn.save()
          }

          const existingVisitCandOut = await VisitCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandOut.payment_Out_Schema = null
            await existingVisitCandOut.save()
          }


          const entries = await Entries.find();

          for (const entry of entries) {
            if (entry.reference_In_Name === existingSupplier.supplierName) {
              entry.reference_In_Name = "";
            }
            if (entry.reference_Out_Name === existingSupplier.supplierName) {
              entry.reference_Out_Name = "";
            }
            if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
              entry.visit_Reference_In_Name = "";
            }
            if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
              entry.visit_Reference_Out_Name = "";
            }
            if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_In_Name = "";
            }
            if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_Out_Name = "";
            }
            if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_In_Name = "";
            }
            if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_Out_Name = "";
            }
            await entry.save(); // Save the updated entry
          }

          const deleteSupplier = await TSP.findByIdAndDelete(supplierId);


          res.status(200).json({ message: `Supplier deleted successfully` })
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// getting  Ticket Sales parties

const getTSP = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const ticketSalesParties = await TSP.find({})
            res.status(200).json({ data: ticketSalesParties })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


//4- Ticket Purchase Parties Controllers

//Adding a New Ticket Purchase Party

const addTPP = async (req, res) => {
    try {
        const { supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierName) {
            return res.status(400).json({ message: "Supplier Name is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }
            if (user.role === "Admin") {

                // Check if a Supplier with the same name already exists

                const existingSupplier = await TPP.findOne({ supplierName });
                if (existingSupplier) {
                    return res.status(400).json({ message: "A Supplier with this Name already exists" });
                }

                if (!existingSupplier) {
                  let uploadImage
                  if(picture){
                    // uploading picture to cloudinary
                     uploadImage = await cloudinary.uploader.upload(picture, {
                      upload_preset: 'rozgar'
                  })
                  }


                    const newSupplier = new TPP({
                        supplierName,
                        supplierCompany,
                        country,
                        contact,
                        address,
                        picture: uploadImage?.secure_url || ""
                    })

                    await newSupplier.save()
                    res.status(200).json({ data: newSupplier, message: `${supplierName} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// updating Visa Sales Parties

const updateTPP = async (req, res) => {
    try {
        const { supplierId,supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierId) {
            return res.status(400).json({ message: "Supplier Id is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {
                // Check if a Supplier with the same name already exists

                const existingSupplier = await TPP.findById(supplierId);
                if (!existingSupplier) {
                    return res.status(400).json({ message: "Supplier not found!" });
                }
                if (existingSupplier) {
                    


                    //   Updating Agents
                      const existingAgentIn = await Agents.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentIn){
                        existingAgentIn.payment_In_Schema.supplierName=supplierName
                        await existingAgentIn.save()
                      }

                      const existingAgentOut = await Agents.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentOut){
                        existingAgentOut.payment_Out_Schema.supplierName=supplierName
                        await existingAgentOut.save()
                      }

                        //   Updating Suppliers
                      const existingSupplierIn = await Suppliers.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingSupplierIn){
                        existingSupplierIn.payment_In_Schema.supplierName=supplierName
                        await existingSupplierIn.save()
                      }

                      const existingSupplierOut = await Suppliers.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      })
                      if(existingSupplierOut){
                        existingSupplierOut.payment_Out_Schema.supplierName=supplierName
                        await existingSupplierOut.save()
                      }

                        //   Updating Candidates
                        const existingCandIn = await Candidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingCandIn){
                            existingCandIn.payment_In_Schema.supplierName=supplierName
                            await existingCandIn.save()
                          }
    
                          const existingCandOut = await Candidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingCandOut){
                            existingCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingCandOut.save()
                          }

                           //   Updating Azad Suppliers and Agents
                        const existingAzadSupIn = await AzadSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadSupIn){
                            existingAzadSupIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadSupIn.save()
                          }
    
                          const existingAzadSupOut = await AzadSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadSupOut){
                            existingAzadSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadSupOut.save()
                          }

                          const existingAzadAgentIn = await AzadAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadAgentIn){
                            existingAzadAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadAgentIn.save()
                          }
    
                          const existingAzadAgentOut = await AzadAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadAgentOut){
                            existingAzadAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadAgentOut.save()
                          }

                            //   Updating Ticket Suppliers and Agents
                        const existingTicketSupIn = await TicketSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketSupIn){
                            existingTicketSupIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketSupIn.save()
                          }
    
                          const existingTicketSupOut = await TicketSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketSupOut){
                            existingTicketSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketSupOut.save()
                          }

                          const existingTicketAgentIn = await TicketAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketAgentIn){
                            existingTicketAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketAgentIn.save()
                          }
    
                          const existingTicketAgentOut = await TicketAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketAgentOut){
                            existingTicketAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketAgentOut.save()
                          }
    
                           //   Updating Visit Suppliers and Agents
                        const existingVisitSupIn = await VisitSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitSupIn){
                            existingVisitSupIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitSupIn.save()
                          }
    
                          const existingVisitSupOut = await VisitSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitSupOut){
                            existingVisitSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitSupOut.save()
                          }

                          const existingVisitAgentIn = await VisitAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitAgentIn){
                            existingVisitAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitAgentIn.save()
                          }
    
                          const existingVisitAgentOut = await VisitAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitAgentOut){
                            existingVisitAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitAgentOut.save()
                          }

                        //   Updating Azad Candidate
                        const existingAzadCandIn = await AzadCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadCandIn){
                            existingAzadCandIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadCandIn.save()
                          }
    
                          const existingAzadCandOut = await AzadCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadCandOut){
                            existingAzadCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadCandOut.save()
                          }

                          //   Updating Ticket Candidate
                        const existingTicketCandIn = await TicketCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketCandIn){
                            existingTicketCandIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketCandIn.save()
                          }
    
                          const existingTicketCandOut = await TicketCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketCandOut){
                            existingTicketCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketCandOut.save()
                          }

                           //   Updating Visit Candidate
                        const existingVisitCandIn = await VisitCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitCandIn){
                            existingVisitCandIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitCandIn.save()
                          }
    
                          const existingVisitCandOut = await VisitCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitCandOut){
                            existingVisitCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitCandOut.save()
                          }
        
                          const entries = await Entries.find();

                          for (const entry of entries) {
                              if (entry.reference_In_Name === existingSupplier.supplierName) {
                                  entry.reference_In_Name = supplierName;
                              }
                              if (entry.reference_Out_Name === existingSupplier.supplierName) {
                                  entry.reference_Out_Name = supplierName;
                              }
                              if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_In_Name = supplierName;
                              }
                              if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_Out_Name = supplierName;
                              }
                              if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_In_Name = supplierName;
                              }
                              if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_Out_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_In_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_Out_Name = supplierName;
                              }
                              await entry.save(); // Save the updated entry
                          }

                          let uploadImage
                    if(picture && !picture.startsWith("https://res.cloudinary.com")){
                        // uploading picture to cloudinary
                         uploadImage = await cloudinary.uploader.upload(picture, {
                            upload_preset: 'rozgar'
                        })
                    }
                    existingSupplier.supplierName=supplierName
                    existingSupplier.supplierCompany=supplierCompany
                    existingSupplier.country=country
                    existingSupplier.contact=contact
                    existingSupplier.address=address
                    if (picture && uploadImage) {
                        existingSupplier.picture = uploadImage.secure_url;
                      }
                        
                    await existingSupplier.save()
                    res.status(200).json({  message: `Supplier updated successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const deleteTPP = async (req, res) => {
  try {
    const { supplierId } = req.body
    if (!supplierId) {
      return res.status(400).json({ message: "Supplier Id is required" })
    }

    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    if (user) {
      // Checking User Role 
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" })
      }

      if (user.role === "Admin") {
        // Check if a Supplier with the same name already exists

        const existingSupplier = await TPP.findById(supplierId);
        if (!existingSupplier) {
          return res.status(400).json({ message: "Supplier not found!" });
        }
        if (existingSupplier) {

          //   Updating Agents
          const existingAgentIn = await Agents.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentIn) {

            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentIn.payment_In_Schema = null
            await existingAgentIn.save()
          }

          const existingAgentOut = await Agents.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentOut) {
            
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentOut.payment_Out_Schema = null
            await existingAgentOut.save()
          }

          //   Updating Suppliers
          const existingSupplierIn = await Suppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingSupplierIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierIn.payment_In_Schema = null
            await existingSupplierIn.save()
          }

          const existingSupplierOut = await Suppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingSupplierOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierOut.payment_Out_Schema = null
            await existingSupplierOut.save()
          }

          //   Updating Candidates
          const existingCandIn = await Candidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandIn.payment_In_Schema = null
            await existingCandIn.save()
          }

          const existingCandOut = await Candidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandOut.payment_Out_Schema = null
            await existingCandOut.save()
          }

          //   Updating Azad Suppliers and Agents
          const existingAzadSupIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupIn.payment_In_Schema = null
            await existingAzadSupIn.save()
          }

          const existingAzadSupOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupOut.payment_Out_Schema = null
            await existingAzadSupOut.save()
          }

          const existingAzadAgentIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentIn.payment_In_Schema = null
            await existingAzadAgentIn.save()
          }

          const existingAzadAgentOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentOut.payment_Out_Schema = null
            await existingAzadAgentOut.save()
          }

          //   Updating Ticket Suppliers and Agents
          const existingTicketSupIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupIn.payment_In_Schema = null
            await existingTicketSupIn.save()
          }

          const existingTicketSupOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupOut.payment_Out_Schema = null
            await existingTicketSupOut.save()
          }

          const existingTicketAgentIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentIn.payment_In_Schema = null
            await existingTicketAgentIn.save()
          }

          const existingTicketAgentOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentOut.payment_Out_Schema = null
            await existingTicketAgentOut.save()
          }

          //   Updating Visit Suppliers and Agents
          const existingVisitSupIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupIn.payment_In_Schema = null
            await existingVisitSupIn.save()
          }

          const existingVisitSupOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupOut.payment_Out_Schema = null
            await existingVisitSupOut.save()
          }

          const existingVisitAgentIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentIn.payment_In_Schema = null
            await existingVisitAgentIn.save()
          }

          const existingVisitAgentOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentOut.payment_Out_Schema = null
            await existingVisitAgentOut.save()
          }

          //   Updating Azad Candidate
          const existingAzadCandIn = await AzadCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandIn.payment_In_Schema = null
            await existingAzadCandIn.save()
          }

          const existingAzadCandOut = await AzadCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandOut.payment_Out_Schema = null
            await existingAzadCandOut.save()
          }

          //   Updating Ticket Candidate
          const existingTicketCandIn = await TicketCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandIn.payment_In_Schema = null
            await existingTicketCandIn.save()
          }

          const existingTicketCandOut = await TicketCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandOut.payment_Out_Schema = null
            await existingTicketCandOut.save()
          }

          //   Updating Visit Candidate
          const existingVisitCandIn = await VisitCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandIn.payment_In_Schema = null
            await existingVisitCandIn.save()
          }

          const existingVisitCandOut = await VisitCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandOut.payment_Out_Schema = null
            await existingVisitCandOut.save()
          }


          const entries = await Entries.find();

          for (const entry of entries) {
            if (entry.reference_In_Name === existingSupplier.supplierName) {
              entry.reference_In_Name = "";
            }
            if (entry.reference_Out_Name === existingSupplier.supplierName) {
              entry.reference_Out_Name = "";
            }
            if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
              entry.visit_Reference_In_Name = "";
            }
            if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
              entry.visit_Reference_Out_Name = "";
            }
            if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_In_Name = "";
            }
            if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_Out_Name = "";
            }
            if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_In_Name = "";
            }
            if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_Out_Name = "";
            }
            await entry.save(); // Save the updated entry
          }

          const deleteSupplier = await TPP.findByIdAndDelete(supplierId);

          res.status(200).json({ message: `Supplier deleted successfully` })
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// getting Ticket Purchase Parties

const getTPP = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const ticketPurchaseParties = await TPP.find({})
            res.status(200).json({ data: ticketPurchaseParties })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


//5- Azad Visa Sales Parties Controllers


//Adding a New Azad Visa Sales Parties 

const addAVSP = async (req, res) => {
    try {
        const { supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierName) {
            return res.status(400).json({ message: "Supplier Name is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a Supplier with the same name already exists

                const existingSupplier = await AVSP.findOne({ supplierName });
                if (existingSupplier) {
                    return res.status(400).json({ message: "A Supplier with this Name already exists" });
                }

                if (!existingSupplier) {
                  let uploadImage 
                  if(picture){
                          // uploading picture to cloudinary
                        uploadImage = await cloudinary.uploader.upload(picture, {
                            upload_preset: 'rozgar'
                        })
                         }
                  

                    const newSupplier = new AVSP({
                        supplierName,
                        supplierCompany,
                        country,
                        contact,
                        address,
                        picture: uploadImage.secure_url
                    })

                    await newSupplier.save()
                    res.status(200).json({ data: newSupplier, message: `${supplierName} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const updateAVSP = async (req, res) => {
    try {
        const { supplierId,supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierId) {
            return res.status(400).json({ message: "Supplier Id is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {
                // Check if a Supplier with the same name already exists

                const existingSupplier = await AVSP.findById(supplierId);
                if (!existingSupplier) {
                    return res.status(400).json({ message: "Supplier not found!" });
                }
                if (existingSupplier) {
                   

                    //   Updating Agents
                      const existingAgentIn = await Agents.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentIn){
                        existingAgentIn.payment_In_Schema.supplierName=supplierName
                        await existingAgentIn.save()
                      }

                      const existingAgentOut = await Agents.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentOut){
                        existingAgentOut.payment_Out_Schema.supplierName=supplierName
                        await existingAgentOut.save()
                      }

                        //   Updating Suppliers
                      const existingSupplierIn = await Suppliers.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingSupplierIn){
                        existingSupplierIn.payment_In_Schema.supplierName=supplierName
                        await existingSupplierIn.save()
                      }

                      const existingSupplierOut = await Suppliers.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      })
                      if(existingSupplierOut){
                        existingSupplierOut.payment_Out_Schema.supplierName=supplierName
                        await existingSupplierOut.save()
                      }

                        //   Updating Candidates
                        const existingCandIn = await Candidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingCandIn){
                            existingCandIn.payment_In_Schema.supplierName=supplierName
                            await existingCandIn.save()
                          }
    
                          const existingCandOut = await Candidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingCandOut){
                            existingCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingCandOut.save()
                          }

                           //   Updating Azad Suppliers and Agents
                        const existingAzadSupIn = await AzadSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadSupIn){
                            existingAzadSupIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadSupIn.save()
                          }
    
                          const existingAzadSupOut = await AzadSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadSupOut){
                            existingAzadSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadSupOut.save()
                          }

                          const existingAzadAgentIn = await AzadAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadAgentIn){
                            existingAzadAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadAgentIn.save()
                          }
    
                          const existingAzadAgentOut = await AzadAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadAgentOut){
                            existingAzadAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadAgentOut.save()
                          }

                            //   Updating Ticket Suppliers and Agents
                        const existingTicketSupIn = await TicketSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketSupIn){
                            existingTicketSupIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketSupIn.save()
                          }
    
                          const existingTicketSupOut = await TicketSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketSupOut){
                            existingTicketSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketSupOut.save()
                          }

                          const existingTicketAgentIn = await TicketAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketAgentIn){
                            existingTicketAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketAgentIn.save()
                          }
    
                          const existingTicketAgentOut = await TicketAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketAgentOut){
                            existingTicketAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketAgentOut.save()
                          }
    
                           //   Updating Visit Suppliers and Agents
                        const existingVisitSupIn = await VisitSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitSupIn){
                            existingVisitSupIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitSupIn.save()
                          }
    
                          const existingVisitSupOut = await VisitSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitSupOut){
                            existingVisitSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitSupOut.save()
                          }

                          const existingVisitAgentIn = await VisitAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitAgentIn){
                            existingVisitAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitAgentIn.save()
                          }
    
                          const existingVisitAgentOut = await VisitAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitAgentOut){
                            existingVisitAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitAgentOut.save()
                          }

                        //   Updating Azad Candidate
                        const existingAzadCandIn = await AzadCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadCandIn){
                            existingAzadCandIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadCandIn.save()
                          }
    
                          const existingAzadCandOut = await AzadCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadCandOut){
                            existingAzadCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadCandOut.save()
                          }

                          //   Updating Ticket Candidate
                        const existingTicketCandIn = await TicketCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketCandIn){
                            existingTicketCandIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketCandIn.save()
                          }
    
                          const existingTicketCandOut = await TicketCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketCandOut){
                            existingTicketCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketCandOut.save()
                          }

                           //   Updating Visit Candidate
                        const existingVisitCandIn = await VisitCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitCandIn){
                            existingVisitCandIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitCandIn.save()
                          }
    
                          const existingVisitCandOut = await VisitCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitCandOut){
                            existingVisitCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitCandOut.save()
                          }

                                
                          const entries = await Entries.find();

                          for (const entry of entries) {
                              if (entry.reference_In_Name === existingSupplier.supplierName) {
                                  entry.reference_In_Name = supplierName;
                              }
                              if (entry.reference_Out_Name === existingSupplier.supplierName) {
                                  entry.reference_Out_Name = supplierName;
                              }
                              if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_In_Name = supplierName;
                              }
                              if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_Out_Name = supplierName;
                              }
                              if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_In_Name = supplierName;
                              }
                              if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_Out_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_In_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_Out_Name = supplierName;
                              }
                              await entry.save(); // Save the updated entry
                          }

                          let uploadImage
                          if(picture && !picture.startsWith("https://res.cloudinary.com")){
                              // uploading picture to cloudinary
                               uploadImage = await cloudinary.uploader.upload(picture, {
                                  upload_preset: 'rozgar'
                              })
                          }
                          existingSupplier.supplierName=supplierName
                          existingSupplier.supplierCompany=supplierCompany
                          existingSupplier.country=country
                          existingSupplier.contact=contact
                          existingSupplier.address=address
                          if (picture && uploadImage) {
                              existingSupplier.picture = uploadImage.secure_url;
                            }
      
                    await existingSupplier.save()
                    res.status(200).json({  message: `Supplier updated successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const deleteAVSP = async (req, res) => {
  try {
    const { supplierId } = req.body
    if (!supplierId) {
      return res.status(400).json({ message: "Supplier Id is required" })
    }

    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    if (user) {
      // Checking User Role 
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" })
      }

      if (user.role === "Admin") {
        // Check if a Supplier with the same name already exists

        const existingSupplier = await AVSP.findById(supplierId);
        if (!existingSupplier) {
          return res.status(400).json({ message: "Supplier not found!" });
        }
        if (existingSupplier) {

          //   Updating Agents
          const existingAgentIn = await Agents.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentIn) {

            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentIn.payment_In_Schema = null
            await existingAgentIn.save()
          }

          const existingAgentOut = await Agents.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentOut) {
            
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentOut.payment_Out_Schema = null
            await existingAgentOut.save()
          }

          //   Updating Suppliers
          const existingSupplierIn = await Suppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingSupplierIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierIn.payment_In_Schema = null
            await existingSupplierIn.save()
          }

          const existingSupplierOut = await Suppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingSupplierOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierOut.payment_Out_Schema = null
            await existingSupplierOut.save()
          }

          //   Updating Candidates
          const existingCandIn = await Candidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandIn.payment_In_Schema = null
            await existingCandIn.save()
          }

          const existingCandOut = await Candidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandOut.payment_Out_Schema = null
            await existingCandOut.save()
          }

          //   Updating Azad Suppliers and Agents
          const existingAzadSupIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupIn.payment_In_Schema = null
            await existingAzadSupIn.save()
          }

          const existingAzadSupOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupOut.payment_Out_Schema = null
            await existingAzadSupOut.save()
          }

          const existingAzadAgentIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentIn.payment_In_Schema = null
            await existingAzadAgentIn.save()
          }

          const existingAzadAgentOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentOut.payment_Out_Schema = null
            await existingAzadAgentOut.save()
          }

          //   Updating Ticket Suppliers and Agents
          const existingTicketSupIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupIn.payment_In_Schema = null
            await existingTicketSupIn.save()
          }

          const existingTicketSupOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupOut.payment_Out_Schema = null
            await existingTicketSupOut.save()
          }

          const existingTicketAgentIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentIn.payment_In_Schema = null
            await existingTicketAgentIn.save()
          }

          const existingTicketAgentOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentOut.payment_Out_Schema = null
            await existingTicketAgentOut.save()
          }

          //   Updating Visit Suppliers and Agents
          const existingVisitSupIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupIn.payment_In_Schema = null
            await existingVisitSupIn.save()
          }

          const existingVisitSupOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupOut.payment_Out_Schema = null
            await existingVisitSupOut.save()
          }

          const existingVisitAgentIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentIn.payment_In_Schema = null
            await existingVisitAgentIn.save()
          }

          const existingVisitAgentOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentOut.payment_Out_Schema = null
            await existingVisitAgentOut.save()
          }

          //   Updating Azad Candidate
          const existingAzadCandIn = await AzadCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandIn.payment_In_Schema = null
            await existingAzadCandIn.save()
          }

          const existingAzadCandOut = await AzadCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandOut.payment_Out_Schema = null
            await existingAzadCandOut.save()
          }

          //   Updating Ticket Candidate
          const existingTicketCandIn = await TicketCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandIn.payment_In_Schema = null
            await existingTicketCandIn.save()
          }

          const existingTicketCandOut = await TicketCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandOut.payment_Out_Schema = null
            await existingTicketCandOut.save()
          }

          //   Updating Visit Candidate
          const existingVisitCandIn = await VisitCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandIn.payment_In_Schema = null
            await existingVisitCandIn.save()
          }

          const existingVisitCandOut = await VisitCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandOut.payment_Out_Schema = null
            await existingVisitCandOut.save()
          }


          const entries = await Entries.find();

          for (const entry of entries) {
            if (entry.reference_In_Name === existingSupplier.supplierName) {
              entry.reference_In_Name = "";
            }
            if (entry.reference_Out_Name === existingSupplier.supplierName) {
              entry.reference_Out_Name = "";
            }
            if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
              entry.visit_Reference_In_Name = "";
            }
            if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
              entry.visit_Reference_Out_Name = "";
            }
            if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_In_Name = "";
            }
            if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_Out_Name = "";
            }
            if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_In_Name = "";
            }
            if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_Out_Name = "";
            }
            await entry.save(); // Save the updated entry
          }

          const deleteSupplier = await AVSP.findByIdAndDelete(supplierId);

          res.status(200).json({ message: `Supplier deleted successfully` })
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// getting azad Visa Sales Parties
const getAVSP = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const azadVisaSalesParties = await AVSP.find({})
            res.status(200).json({ data: azadVisaSalesParties })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}



//6- Azad Visa Purchase Parties Controllers

//Adding a New Azad Visa Purchase Party 

const addAVPP = async (req, res) => {
    try {
        const { supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierName) {
            return res.status(400).json({ message: "Supplier Name is required" })
        }
        
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a Supplier with the same name already exists

                const existingSupplier = await AVPP.findOne({ supplierName });
                if (existingSupplier) {
                    return res.status(400).json({ message: "A Supplier with this Name already exists" });
                }

                if (!existingSupplier) {

                  let uploadImage 
                  if(picture){
                     // uploading picture to cloudinary
                    uploadImage = await cloudinary.uploader.upload(picture, {
                      upload_preset: 'rozgar'
                  })
                  }
                   

                    const newSupplier = new AVPP({
                        supplierName,
                        supplierCompany,
                        country,
                        contact,
                        address,
                        picture: uploadImage?.secure_url || ""
                    })

                    await newSupplier.save()
                    res.status(200).json({ data: newSupplier, message: `${supplierName} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const updateAVPP = async (req, res) => {
    try {
        const { supplierId,supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierId) {
            return res.status(400).json({ message: "Supplier Id is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {
                // Check if a Supplier with the same name already exists

                const existingSupplier = await AVPP.findById(supplierId);
                if (!existingSupplier) {
                    return res.status(400).json({ message: "Supplier not found!" });
                }
                if (existingSupplier) {
                    

                    //   Updating Agents
                      const existingAgentIn = await Agents.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentIn){
                        existingAgentIn.payment_In_Schema.supplierName=supplierName
                        await existingAgentIn.save()
                      }

                      const existingAgentOut = await Agents.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentOut){
                        existingAgentOut.payment_Out_Schema.supplierName=supplierName
                        await existingAgentOut.save()
                      }

                        //   Updating Suppliers
                      const existingSupplierIn = await Suppliers.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingSupplierIn){
                        existingSupplierIn.payment_In_Schema.supplierName=supplierName
                        await existingSupplierIn.save()
                      }

                      const existingSupplierOut = await Suppliers.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      })
                      if(existingSupplierOut){
                        existingSupplierOut.payment_Out_Schema.supplierName=supplierName
                        await existingSupplierOut.save()
                      }

                        //   Updating Candidates
                        const existingCandIn = await Candidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingCandIn){
                            existingCandIn.payment_In_Schema.supplierName=supplierName
                            await existingCandIn.save()
                          }
    
                          const existingCandOut = await Candidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingCandOut){
                            existingCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingCandOut.save()
                          }

                           //   Updating Azad Suppliers and Agents
                        const existingAzadSupIn = await AzadSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadSupIn){
                            existingAzadSupIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadSupIn.save()
                          }
    
                          const existingAzadSupOut = await AzadSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadSupOut){
                            existingAzadSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadSupOut.save()
                          }

                          const existingAzadAgentIn = await AzadAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadAgentIn){
                            existingAzadAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadAgentIn.save()
                          }
    
                          const existingAzadAgentOut = await AzadAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadAgentOut){
                            existingAzadAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadAgentOut.save()
                          }

                            //   Updating Ticket Suppliers and Agents
                        const existingTicketSupIn = await TicketSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketSupIn){
                            existingTicketSupIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketSupIn.save()
                          }
    
                          const existingTicketSupOut = await TicketSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketSupOut){
                            existingTicketSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketSupOut.save()
                          }

                          const existingTicketAgentIn = await TicketAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketAgentIn){
                            existingTicketAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketAgentIn.save()
                          }
    
                          const existingTicketAgentOut = await TicketAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketAgentOut){
                            existingTicketAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketAgentOut.save()
                          }
    
                           //   Updating Visit Suppliers and Agents
                        const existingVisitSupIn = await VisitSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitSupIn){
                            existingVisitSupIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitSupIn.save()
                          }
    
                          const existingVisitSupOut = await VisitSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitSupOut){
                            existingVisitSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitSupOut.save()
                          }

                          const existingVisitAgentIn = await VisitAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitAgentIn){
                            existingVisitAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitAgentIn.save()
                          }
    
                          const existingVisitAgentOut = await VisitAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitAgentOut){
                            existingVisitAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitAgentOut.save()
                          }

                        //   Updating Azad Candidate
                        const existingAzadCandIn = await AzadCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadCandIn){
                            existingAzadCandIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadCandIn.save()
                          }
    
                          const existingAzadCandOut = await AzadCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadCandOut){
                            existingAzadCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadCandOut.save()
                          }

                          //   Updating Ticket Candidate
                        const existingTicketCandIn = await TicketCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketCandIn){
                            existingTicketCandIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketCandIn.save()
                          }
    
                          const existingTicketCandOut = await TicketCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketCandOut){
                            existingTicketCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketCandOut.save()
                          }

                           //   Updating Visit Candidate
                        const existingVisitCandIn = await VisitCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitCandIn){
                            existingVisitCandIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitCandIn.save()
                          }
    
                          const existingVisitCandOut = await VisitCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitCandOut){
                            existingVisitCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitCandOut.save()
                          }

                              
                          const entries = await Entries.find();

                          for (const entry of entries) {
                              if (entry.reference_In_Name === existingSupplier.supplierName) {
                                  entry.reference_In_Name = supplierName;
                              }
                              if (entry.reference_Out_Name === existingSupplier.supplierName) {
                                  entry.reference_Out_Name = supplierName;
                              }
                              if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_In_Name = supplierName;
                              }
                              if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_Out_Name = supplierName;
                              }
                              if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_In_Name = supplierName;
                              }
                              if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_Out_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_In_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_Out_Name = supplierName;
                              }
                              await entry.save(); // Save the updated entry
                          }

                          let uploadImage
                          if(picture && !picture.startsWith("https://res.cloudinary.com")){
                              // uploading picture to cloudinary
                               uploadImage = await cloudinary.uploader.upload(picture, {
                                  upload_preset: 'rozgar'
                              })
                          }
                          existingSupplier.supplierName=supplierName
                          existingSupplier.supplierCompany=supplierCompany
                          existingSupplier.country=country
                          existingSupplier.contact=contact
                          existingSupplier.address=address
                          if (picture && uploadImage) {
                              existingSupplier.picture = uploadImage.secure_url;
                            }
      
                    await existingSupplier.save()
                    res.status(200).json({  message: `Supplier updated successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// updating Visa Sales Parties

const deleteAVPP = async (req, res) => {
  try {
    const { supplierId } = req.body
    if (!supplierId) {
      return res.status(400).json({ message: "Supplier Id is required" })
    }

    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    if (user) {
      // Checking User Role 
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" })
      }

      if (user.role === "Admin") {
        // Check if a Supplier with the same name already exists

        const existingSupplier = await AVPP.findById(supplierId);
        if (!existingSupplier) {
          return res.status(400).json({ message: "Supplier not found!" });
        }
        if (existingSupplier) {

          //   Updating Agents
          const existingAgentIn = await Agents.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentIn) {

            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentIn.payment_In_Schema = null
            await existingAgentIn.save()
          }

          const existingAgentOut = await Agents.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentOut) {
            
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentOut.payment_Out_Schema = null
            await existingAgentOut.save()
          }

          //   Updating Suppliers
          const existingSupplierIn = await Suppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingSupplierIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierIn.payment_In_Schema = null
            await existingSupplierIn.save()
          }

          const existingSupplierOut = await Suppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingSupplierOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierOut.payment_Out_Schema = null
            await existingSupplierOut.save()
          }

          //   Updating Candidates
          const existingCandIn = await Candidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandIn.payment_In_Schema = null
            await existingCandIn.save()
          }

          const existingCandOut = await Candidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandOut.payment_Out_Schema = null
            await existingCandOut.save()
          }

          //   Updating Azad Suppliers and Agents
          const existingAzadSupIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupIn.payment_In_Schema = null
            await existingAzadSupIn.save()
          }

          const existingAzadSupOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupOut.payment_Out_Schema = null
            await existingAzadSupOut.save()
          }

          const existingAzadAgentIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentIn.payment_In_Schema = null
            await existingAzadAgentIn.save()
          }

          const existingAzadAgentOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentOut.payment_Out_Schema = null
            await existingAzadAgentOut.save()
          }

          //   Updating Ticket Suppliers and Agents
          const existingTicketSupIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupIn.payment_In_Schema = null
            await existingTicketSupIn.save()
          }

          const existingTicketSupOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupOut.payment_Out_Schema = null
            await existingTicketSupOut.save()
          }

          const existingTicketAgentIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentIn.payment_In_Schema = null
            await existingTicketAgentIn.save()
          }

          const existingTicketAgentOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentOut.payment_Out_Schema = null
            await existingTicketAgentOut.save()
          }

          //   Updating Visit Suppliers and Agents
          const existingVisitSupIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupIn.payment_In_Schema = null
            await existingVisitSupIn.save()
          }

          const existingVisitSupOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupOut.payment_Out_Schema = null
            await existingVisitSupOut.save()
          }

          const existingVisitAgentIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentIn.payment_In_Schema = null
            await existingVisitAgentIn.save()
          }

          const existingVisitAgentOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentOut.payment_Out_Schema = null
            await existingVisitAgentOut.save()
          }

          //   Updating Azad Candidate
          const existingAzadCandIn = await AzadCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandIn.payment_In_Schema = null
            await existingAzadCandIn.save()
          }

          const existingAzadCandOut = await AzadCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandOut.payment_Out_Schema = null
            await existingAzadCandOut.save()
          }

          //   Updating Ticket Candidate
          const existingTicketCandIn = await TicketCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandIn.payment_In_Schema = null
            await existingTicketCandIn.save()
          }

          const existingTicketCandOut = await TicketCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandOut.payment_Out_Schema = null
            await existingTicketCandOut.save()
          }

          //   Updating Visit Candidate
          const existingVisitCandIn = await VisitCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandIn.payment_In_Schema = null
            await existingVisitCandIn.save()
          }

          const existingVisitCandOut = await VisitCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandOut.payment_Out_Schema = null
            await existingVisitCandOut.save()
          }


          const entries = await Entries.find();

          for (const entry of entries) {
            if (entry.reference_In_Name === existingSupplier.supplierName) {
              entry.reference_In_Name = "";
            }
            if (entry.reference_Out_Name === existingSupplier.supplierName) {
              entry.reference_Out_Name = "";
            }
            if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
              entry.visit_Reference_In_Name = "";
            }
            if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
              entry.visit_Reference_Out_Name = "";
            }
            if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_In_Name = "";
            }
            if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_Out_Name = "";
            }
            if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_In_Name = "";
            }
            if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_Out_Name = "";
            }
            await entry.save(); // Save the updated entry
          }

          const deleteSupplier = await AVPP.findByIdAndDelete(supplierId);

          res.status(200).json({ message: `Supplier deleted successfully` })
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// getting Azad Visa Purchase Party 

const getAVPP = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const azadVisaPurchaseParties = await AVPP.find({})
            res.status(200).json({ data: azadVisaPurchaseParties })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


//7- Visit Sales Parties Controllers

//Adding a New Visit Sales Party 

const addVISP = async (req, res) => {
    try {
        const { supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierName) {
            return res.status(400).json({ message: "Supplier Name is required" })
        }
        
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }


            if (user.role === "Admin") {

                // Check if a Supplier with the same name already exists

                const existingSupplier = await VISP.findOne({ supplierName });
                if (existingSupplier) {
                    return res.status(400).json({ message: "A Supplier with this Name already exists" });
                }

                if (!existingSupplier) {
                  let uploadImage 
                  if(picture){
                     // uploading picture to cloudinary
                    uploadImage = await cloudinary.uploader.upload(picture, {
                      upload_preset: 'rozgar'
                  })
                  }

                    const newSupplier = new VISP({
                        supplierName,
                        supplierCompany,
                        country,
                        contact,
                        address,
                        picture: uploadImage?.secure_url || ""
                    })

                    await newSupplier.save()
                    res.status(200).json({ data: newSupplier, message: `${supplierName} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const updateVISP = async (req, res) => {
    try {
        const { supplierId,supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierId) {
            return res.status(400).json({ message: "Supplier Id is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {
                // Check if a Supplier with the same name already exists

                const existingSupplier = await VISP.findById(supplierId);
                if (!existingSupplier) {
                    return res.status(400).json({ message: "Supplier not found!" });
                }
                if (existingSupplier) {
                   

                    //   Updating Agents
                      const existingAgentIn = await Agents.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentIn){
                        existingAgentIn.payment_In_Schema.supplierName=supplierName
                        await existingAgentIn.save()
                      }

                      const existingAgentOut = await Agents.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentOut){
                        existingAgentOut.payment_Out_Schema.supplierName=supplierName
                        await existingAgentOut.save()
                      }

                        //   Updating Suppliers
                      const existingSupplierIn = await Suppliers.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingSupplierIn){
                        existingSupplierIn.payment_In_Schema.supplierName=supplierName
                        await existingSupplierIn.save()
                      }

                      const existingSupplierOut = await Suppliers.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      })
                      if(existingSupplierOut){
                        existingSupplierOut.payment_Out_Schema.supplierName=supplierName
                        await existingSupplierOut.save()
                      }

                        //   Updating Candidates
                        const existingCandIn = await Candidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingCandIn){
                            existingCandIn.payment_In_Schema.supplierName=supplierName
                            await existingCandIn.save()
                          }
    
                          const existingCandOut = await Candidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingCandOut){
                            existingCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingCandOut.save()
                          }

                           //   Updating Azad Suppliers and Agents
                        const existingAzadSupIn = await AzadSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadSupIn){
                            existingAzadSupIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadSupIn.save()
                          }
    
                          const existingAzadSupOut = await AzadSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadSupOut){
                            existingAzadSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadSupOut.save()
                          }

                          const existingAzadAgentIn = await AzadAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadAgentIn){
                            existingAzadAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadAgentIn.save()
                          }
    
                          const existingAzadAgentOut = await AzadAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadAgentOut){
                            existingAzadAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadAgentOut.save()
                          }

                            //   Updating Ticket Suppliers and Agents
                        const existingTicketSupIn = await TicketSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketSupIn){
                            existingTicketSupIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketSupIn.save()
                          }
    
                          const existingTicketSupOut = await TicketSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketSupOut){
                            existingTicketSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketSupOut.save()
                          }

                          const existingTicketAgentIn = await TicketAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketAgentIn){
                            existingTicketAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketAgentIn.save()
                          }
    
                          const existingTicketAgentOut = await TicketAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketAgentOut){
                            existingTicketAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketAgentOut.save()
                          }
    
                           //   Updating Visit Suppliers and Agents
                        const existingVisitSupIn = await VisitSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitSupIn){
                            existingVisitSupIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitSupIn.save()
                          }
    
                          const existingVisitSupOut = await VisitSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitSupOut){
                            existingVisitSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitSupOut.save()
                          }

                          const existingVisitAgentIn = await VisitAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitAgentIn){
                            existingVisitAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitAgentIn.save()
                          }
    
                          const existingVisitAgentOut = await VisitAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitAgentOut){
                            existingVisitAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitAgentOut.save()
                          }

                        //   Updating Azad Candidate
                        const existingAzadCandIn = await AzadCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadCandIn){
                            existingAzadCandIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadCandIn.save()
                          }
    
                          const existingAzadCandOut = await AzadCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadCandOut){
                            existingAzadCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadCandOut.save()
                          }

                          //   Updating Ticket Candidate
                        const existingTicketCandIn = await TicketCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketCandIn){
                            existingTicketCandIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketCandIn.save()
                          }
    
                          const existingTicketCandOut = await TicketCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketCandOut){
                            existingTicketCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketCandOut.save()
                          }

                           //   Updating Visit Candidate
                        const existingVisitCandIn = await VisitCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitCandIn){
                            existingVisitCandIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitCandIn.save()
                          }
    
                          const existingVisitCandOut = await VisitCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitCandOut){
                            existingVisitCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitCandOut.save()
                          }

                           
                          const entries = await Entries.find();

                          for (const entry of entries) {
                              if (entry.reference_In_Name === existingSupplier.supplierName) {
                                  entry.reference_In_Name = supplierName;
                              }
                              if (entry.reference_Out_Name === existingSupplier.supplierName) {
                                  entry.reference_Out_Name = supplierName;
                              }
                              if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_In_Name = supplierName;
                              }
                              if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_Out_Name = supplierName;
                              }
                              if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_In_Name = supplierName;
                              }
                              if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_Out_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_In_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_Out_Name = supplierName;
                              }
                              await entry.save(); // Save the updated entry
                          }

                          let uploadImage
                          if(picture && !picture.startsWith("https://res.cloudinary.com")){
                              // uploading picture to cloudinary
                               uploadImage = await cloudinary.uploader.upload(picture, {
                                  upload_preset: 'rozgar'
                              })
                          }
                          existingSupplier.supplierName=supplierName
                          existingSupplier.supplierCompany=supplierCompany
                          existingSupplier.country=country
                          existingSupplier.contact=contact
                          existingSupplier.address=address
                          if (picture && uploadImage) {
                              existingSupplier.picture = uploadImage.secure_url;
                            }
      
                    await existingSupplier.save()
                    res.status(200).json({  message: `Supplier updated successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// updating Visa Sales Parties

const deleteVISP = async (req, res) => {
  try {
    const { supplierId } = req.body
    if (!supplierId) {
      return res.status(400).json({ message: "Supplier Id is required" })
    }

    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    if (user) {
      // Checking User Role 
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" })
      }

      if (user.role === "Admin") {
        // Check if a Supplier with the same name already exists

        const existingSupplier = await VISP.findById(supplierId);
        if (!existingSupplier) {
          return res.status(400).json({ message: "Supplier not found!" });
        }
        if (existingSupplier) {

          //   Updating Agents
          const existingAgentIn = await Agents.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentIn) {

            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentIn.payment_In_Schema = null
            await existingAgentIn.save()
          }

          const existingAgentOut = await Agents.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentOut) {
            
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentOut.payment_Out_Schema = null
            await existingAgentOut.save()
          }

          //   Updating Suppliers
          const existingSupplierIn = await Suppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingSupplierIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierIn.payment_In_Schema = null
            await existingSupplierIn.save()
          }

          const existingSupplierOut = await Suppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingSupplierOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierOut.payment_Out_Schema = null
            await existingSupplierOut.save()
          }

          //   Updating Candidates
          const existingCandIn = await Candidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandIn.payment_In_Schema = null
            await existingCandIn.save()
          }

          const existingCandOut = await Candidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandOut.payment_Out_Schema = null
            await existingCandOut.save()
          }

          //   Updating Azad Suppliers and Agents
          const existingAzadSupIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupIn.payment_In_Schema = null
            await existingAzadSupIn.save()
          }

          const existingAzadSupOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupOut.payment_Out_Schema = null
            await existingAzadSupOut.save()
          }

          const existingAzadAgentIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentIn.payment_In_Schema = null
            await existingAzadAgentIn.save()
          }

          const existingAzadAgentOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentOut.payment_Out_Schema = null
            await existingAzadAgentOut.save()
          }

          //   Updating Ticket Suppliers and Agents
          const existingTicketSupIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupIn.payment_In_Schema = null
            await existingTicketSupIn.save()
          }

          const existingTicketSupOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupOut.payment_Out_Schema = null
            await existingTicketSupOut.save()
          }

          const existingTicketAgentIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentIn.payment_In_Schema = null
            await existingTicketAgentIn.save()
          }

          const existingTicketAgentOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentOut.payment_Out_Schema = null
            await existingTicketAgentOut.save()
          }

          //   Updating Visit Suppliers and Agents
          const existingVisitSupIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupIn.payment_In_Schema = null
            await existingVisitSupIn.save()
          }

          const existingVisitSupOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupOut.payment_Out_Schema = null
            await existingVisitSupOut.save()
          }

          const existingVisitAgentIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentIn.payment_In_Schema = null
            await existingVisitAgentIn.save()
          }

          const existingVisitAgentOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentOut.payment_Out_Schema = null
            await existingVisitAgentOut.save()
          }

          //   Updating Azad Candidate
          const existingAzadCandIn = await AzadCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandIn.payment_In_Schema = null
            await existingAzadCandIn.save()
          }

          const existingAzadCandOut = await AzadCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandOut.payment_Out_Schema = null
            await existingAzadCandOut.save()
          }

          //   Updating Ticket Candidate
          const existingTicketCandIn = await TicketCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandIn.payment_In_Schema = null
            await existingTicketCandIn.save()
          }

          const existingTicketCandOut = await TicketCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandOut.payment_Out_Schema = null
            await existingTicketCandOut.save()
          }

          //   Updating Visit Candidate
          const existingVisitCandIn = await VisitCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandIn.payment_In_Schema = null
            await existingVisitCandIn.save()
          }

          const existingVisitCandOut = await VisitCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandOut.payment_Out_Schema = null
            await existingVisitCandOut.save()
          }


          const entries = await Entries.find();

          for (const entry of entries) {
            if (entry.reference_In_Name === existingSupplier.supplierName) {
              entry.reference_In_Name = "";
            }
            if (entry.reference_Out_Name === existingSupplier.supplierName) {
              entry.reference_Out_Name = "";
            }
            if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
              entry.visit_Reference_In_Name = "";
            }
            if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
              entry.visit_Reference_Out_Name = "";
            }
            if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_In_Name = "";
            }
            if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_Out_Name = "";
            }
            if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_In_Name = "";
            }
            if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_Out_Name = "";
            }
            await entry.save(); // Save the updated entry
          }

          const deleteSupplier = await VISP.findByIdAndDelete(supplierId);
          res.status(200).json({ message: `Supplier deleted successfully` })
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// getting Visit Sales Parties

const getVISP = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const visitSalesParties = await VISP.find({})
            res.status(200).json({ data: visitSalesParties })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


//8- Visit Purchase Parties Controllers

//Adding a New Visit Purchase Party 

const addVIPP = async (req, res) => {
    try {
        const { supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierName) {
            return res.status(400).json({ message: "Supplier Name is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }


            if (user.role === "Admin") {

                // Check if a Supplier with the same name already exists

                const existingSupplier = await VIPP.findOne({ supplierName });
                if (existingSupplier) {
                    return res.status(400).json({ message: "A Supplier with this Name already exists" });
                }

                if (!existingSupplier) {

                  let uploadImage 
                  if(picture){
                     // uploading picture to cloudinary
                    uploadImage = await cloudinary.uploader.upload(picture, {
                      upload_preset: 'rozgar'
                  })
                  }
                    const newSupplier = new VIPP({
                        supplierName,
                        supplierCompany,
                        country,
                        contact,
                        address,
                        picture: uploadImage?.secure_url || ""
                    })

                    await newSupplier.save()
                    res.status(200).json({ data: newSupplier, message: `${supplierName} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const updateVIPP = async (req, res) => {
    try {
        const { supplierId,supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierId) {
            return res.status(400).json({ message: "Supplier Id is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {
                // Check if a Supplier with the same name already exists

                const existingSupplier = await VIPP.findById(supplierId);
                if (!existingSupplier) {
                    return res.status(400).json({ message: "Supplier not found!" });
                }
                if (existingSupplier) {
                   
                    //   Updating Agents
                      const existingAgentIn = await Agents.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentIn){
                        existingAgentIn.payment_In_Schema.supplierName=supplierName
                        await existingAgentIn.save()
                      }

                      const existingAgentOut = await Agents.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingAgentOut){
                        existingAgentOut.payment_Out_Schema.supplierName=supplierName
                        await existingAgentOut.save()
                      }

                        //   Updating Suppliers
                      const existingSupplierIn = await Suppliers.findOne({
                        "payment_In_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingSupplierIn){
                        existingSupplierIn.payment_In_Schema.supplierName=supplierName
                        await existingSupplierIn.save()
                      }

                      const existingSupplierOut = await Suppliers.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      })
                      if(existingSupplierOut){
                        existingSupplierOut.payment_Out_Schema.supplierName=supplierName
                        await existingSupplierOut.save()
                      }

                        //   Updating Candidates
                        const existingCandIn = await Candidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingCandIn){
                            existingCandIn.payment_In_Schema.supplierName=supplierName
                            await existingCandIn.save()
                          }
    
                          const existingCandOut = await Candidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingCandOut){
                            existingCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingCandOut.save()
                          }

                           //   Updating Azad Suppliers and Agents
                        const existingAzadSupIn = await AzadSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadSupIn){
                            existingAzadSupIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadSupIn.save()
                          }
    
                          const existingAzadSupOut = await AzadSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadSupOut){
                            existingAzadSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadSupOut.save()
                          }

                          const existingAzadAgentIn = await AzadAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadAgentIn){
                            existingAzadAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadAgentIn.save()
                          }
    
                          const existingAzadAgentOut = await AzadAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadAgentOut){
                            existingAzadAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadAgentOut.save()
                          }

                            //   Updating Ticket Suppliers and Agents
                        const existingTicketSupIn = await TicketSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketSupIn){
                            existingTicketSupIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketSupIn.save()
                          }
    
                          const existingTicketSupOut = await TicketSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketSupOut){
                            existingTicketSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketSupOut.save()
                          }

                          const existingTicketAgentIn = await TicketAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketAgentIn){
                            existingTicketAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketAgentIn.save()
                          }
    
                          const existingTicketAgentOut = await TicketAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketAgentOut){
                            existingTicketAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketAgentOut.save()
                          }
    
                           //   Updating Visit Suppliers and Agents
                        const existingVisitSupIn = await VisitSuppliers.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitSupIn){
                            existingVisitSupIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitSupIn.save()
                          }
    
                          const existingVisitSupOut = await VisitSuppliers.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitSupOut){
                            existingVisitSupOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitSupOut.save()
                          }

                          const existingVisitAgentIn = await VisitAgents.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitAgentIn){
                            existingVisitAgentIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitAgentIn.save()
                          }
    
                          const existingVisitAgentOut = await VisitAgents.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitAgentOut){
                            existingVisitAgentOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitAgentOut.save()
                          }

                        //   Updating Azad Candidate
                        const existingAzadCandIn = await AzadCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingAzadCandIn){
                            existingAzadCandIn.payment_In_Schema.supplierName=supplierName
                            await existingAzadCandIn.save()
                          }
    
                          const existingAzadCandOut = await AzadCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingAzadCandOut){
                            existingAzadCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingAzadCandOut.save()
                          }

                          //   Updating Ticket Candidate
                        const existingTicketCandIn = await TicketCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingTicketCandIn){
                            existingTicketCandIn.payment_In_Schema.supplierName=supplierName
                            await existingTicketCandIn.save()
                          }
    
                          const existingTicketCandOut = await TicketCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingTicketCandOut){
                            existingTicketCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingTicketCandOut.save()
                          }

                           //   Updating Visit Candidate
                        const existingVisitCandIn = await VisitCandidates.findOne({
                            "payment_In_Schema.supplierName": existingSupplier.supplierName,
                          });
                          if(existingVisitCandIn){
                            existingVisitCandIn.payment_In_Schema.supplierName=supplierName
                            await existingVisitCandIn.save()
                          }
    
                          const existingVisitCandOut = await VisitCandidates.findOne({
                            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                          })
                          if(existingVisitCandOut){
                            existingVisitCandOut.payment_Out_Schema.supplierName=supplierName
                            await existingVisitCandOut.save()
                          }

                             
                          const entries = await Entries.find();

                          for (const entry of entries) {
                              if (entry.reference_In_Name === existingSupplier.supplierName) {
                                  entry.reference_In_Name = supplierName;
                              }
                              if (entry.reference_Out_Name === existingSupplier.supplierName) {
                                  entry.reference_Out_Name = supplierName;
                              }
                              if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_In_Name = supplierName;
                              }
                              if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.visit_Reference_Out_Name = supplierName;
                              }
                              if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_In_Name = supplierName;
                              }
                              if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.ticket_Reference_Out_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_In_Name = supplierName;
                              }
                              if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
                                  entry.azad_Visa_Reference_Out_Name = supplierName;
                              }
                              await entry.save(); // Save the updated entry
                          }

                        
                          let uploadImage
                          if(picture && !picture.startsWith("https://res.cloudinary.com")){
                              // uploading picture to cloudinary
                               uploadImage = await cloudinary.uploader.upload(picture, {
                                  upload_preset: 'rozgar'
                              })
                          }
                          existingSupplier.supplierName=supplierName
                          existingSupplier.supplierCompany=supplierCompany
                          existingSupplier.country=country
                          existingSupplier.contact=contact
                          existingSupplier.address=address
                          if (picture && uploadImage) {
                              existingSupplier.picture = uploadImage.secure_url;
                            }
      
      
                    await existingSupplier.save()
                    res.status(200).json({  message: `Supplier updated successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// updating Visa Sales Parties

const deleteVIPP = async (req, res) => {
  try {
    const { supplierId } = req.body
    if (!supplierId) {
      return res.status(400).json({ message: "Supplier Id is required" })
    }

    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    if (user) {
      // Checking User Role 
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" })
      }

      if (user.role === "Admin") {
        // Check if a Supplier with the same name already exists

        const existingSupplier = await VIPP.findById(supplierId);
        if (!existingSupplier) {
          return res.status(400).json({ message: "Supplier not found!" });
        }
        if (existingSupplier) {

          //   Updating Agents
          const existingAgentIn = await Agents.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentIn) {

            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentIn.payment_In_Schema = null
            await existingAgentIn.save()
          }

          const existingAgentOut = await Agents.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentOut) {
            
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentOut.payment_Out_Schema = null
            await existingAgentOut.save()
          }

          //   Updating Suppliers
          const existingSupplierIn = await Suppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingSupplierIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierIn.payment_In_Schema = null
            await existingSupplierIn.save()
          }

          const existingSupplierOut = await Suppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingSupplierOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingSupplierOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingSupplierOut.payment_Out_Schema = null
            await existingSupplierOut.save()
          }

          //   Updating Candidates
          const existingCandIn = await Candidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandIn.payment_In_Schema = null
            await existingCandIn.save()
          }

          const existingCandOut = await Candidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingCandOut.payment_Out_Schema = null
            await existingCandOut.save()
          }

          //   Updating Azad Suppliers and Agents
          const existingAzadSupIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupIn.payment_In_Schema = null
            await existingAzadSupIn.save()
          }

          const existingAzadSupOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadSupOut.payment_Out_Schema = null
            await existingAzadSupOut.save()
          }

          const existingAzadAgentIn = await AzadSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentIn.payment_In_Schema = null
            await existingAzadAgentIn.save()
          }

          const existingAzadAgentOut = await AzadSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadAgentOut.payment_Out_Schema = null
            await existingAzadAgentOut.save()
          }

          //   Updating Ticket Suppliers and Agents
          const existingTicketSupIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupIn.payment_In_Schema = null
            await existingTicketSupIn.save()
          }

          const existingTicketSupOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketSupOut.payment_Out_Schema = null
            await existingTicketSupOut.save()
          }

          const existingTicketAgentIn = await TicketSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentIn.payment_In_Schema = null
            await existingTicketAgentIn.save()
          }

          const existingTicketAgentOut = await TicketSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketAgentOut.payment_Out_Schema = null
            await existingTicketAgentOut.save()
          }

          //   Updating Visit Suppliers and Agents
          const existingVisitSupIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitSupIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupIn.payment_In_Schema = null
            await existingVisitSupIn.save()
          }

          const existingVisitSupOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitSupOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitSupOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitSupOut.payment_Out_Schema = null
            await existingVisitSupOut.save()
          }

          const existingVisitAgentIn = await VisitSuppliers.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitAgentIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentIn.payment_In_Schema = null
            await existingVisitAgentIn.save()
          }

          const existingVisitAgentOut = await VisitSuppliers.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitAgentOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitAgentOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitAgentOut.payment_Out_Schema = null
            await existingVisitAgentOut.save()
          }

          //   Updating Azad Candidate
          const existingAzadCandIn = await AzadCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAzadCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandIn.payment_In_Schema = null
            await existingAzadCandIn.save()
          }

          const existingAzadCandOut = await AzadCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingAzadCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAzadCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAzadCandOut.payment_Out_Schema = null
            await existingAzadCandOut.save()
          }

          //   Updating Ticket Candidate
          const existingTicketCandIn = await TicketCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingTicketCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandIn.payment_In_Schema = null
            await existingTicketCandIn.save()
          }

          const existingTicketCandOut = await TicketCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingTicketCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingTicketCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingTicketCandOut.payment_Out_Schema = null
            await existingTicketCandOut.save()
          }

          //   Updating Visit Candidate
          const existingVisitCandIn = await VisitCandidates.findOne({
            "payment_In_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingVisitCandIn) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandIn.payment_In_Schema = null
            await existingVisitCandIn.save()
          }

          const existingVisitCandOut = await VisitCandidates.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          })
          if (existingVisitCandOut) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingVisitCandOut.payment_Out_Schema.total_Payment_Out

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingVisitCandOut.payment_Out_Schema = null
            await existingVisitCandOut.save()
          }


          const entries = await Entries.find();

          for (const entry of entries) {
            if (entry.reference_In_Name === existingSupplier.supplierName) {
              entry.reference_In_Name = "";
            }
            if (entry.reference_Out_Name === existingSupplier.supplierName) {
              entry.reference_Out_Name = "";
            }
            if (entry.visit_Reference_In_Name === existingSupplier.supplierName) {
              entry.visit_Reference_In_Name = "";
            }
            if (entry.visit_Reference_Out_Name === existingSupplier.supplierName) {
              entry.visit_Reference_Out_Name = "";
            }
            if (entry.ticket_Reference_In_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_In_Name = "";
            }
            if (entry.ticket_Reference_Out_Name === existingSupplier.supplierName) {
              entry.ticket_Reference_Out_Name = "";
            }
            if (entry.azad_Visa_Reference_In_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_In_Name = "";
            }
            if (entry.azad_Visa_Reference_Out_Name === existingSupplier.supplierName) {
              entry.azad_Visa_Reference_Out_Name = "";
            }
            await entry.save(); // Save the updated entry
          }
          const deleteSupplier = await VIPP.findByIdAndDelete(supplierId);

          res.status(200).json({ message: `Supplier deleted successfully` })
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// getting Visit Purchase Parties

const getVIPP = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const visitPurchaseParties = await VIPP.find({})
            res.status(200).json({ data: visitPurchaseParties })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


//9- Companies Controllers

//Adding a New Company

const addCompany = async (req, res) => {
    try {
        const { company } = req.body
        if (!company) {
            return res.status(400).json({ message: "Company Name is required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a Company with the same name already exists

                const existingCompany = await Companies.findOne({ company });
                if (existingCompany) {
                    return res.status(400).json({ message: "A Company with this Name already exists" });
                }

                if (!existingCompany) {

                    const newCompany = new Companies({
                        company
                    })


                    await newCompany.save()
                    res.status(200).json({ data: newCompany, message: `${company} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



const updateCompany = async (req, res) => {
  try {
      const { myId,company } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await Companies.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Company not found!" });
              }
              if (existingSupplier) {
                
        const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
        const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=company
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.company===existingSupplier.company){
                candidate.payment_In_Schema.company=company
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.company===existingSupplier.company){
              candidate.payment_Out_Schema.company=company
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.company===existingSupplier.company){
                azadCandidate.payment_In_Schema.company=company
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.company===existingSupplier.company){
              azadCandidate.payment_Out_Schema.company=company
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.company===existingSupplier.company){
                ticketCandidate.payment_In_Schema.company=company
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.company===existingSupplier.company){
              ticketCandidate.payment_Out_Schema.company=company
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.company===existingSupplier.company){
                visitCandidate.payment_In_Schema.company=company
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.company===existingSupplier.company){
              visitCandidate.payment_Out_Schema.company=company
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find();

                        for (const entry of entries) {
                            if (entry.company === existingSupplier.company) {
                                entry.company = company;
                            }
                            
                            await entry.save(); // Save the updated entry
                        }

                      
                  existingSupplier.company=company

                  await existingSupplier.save()
                  res.status(200).json({  message: `Company updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}


const deleteCompany = async (req, res) => {
  try {
      const { myId } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await Companies.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Company not found!" });
              }
              if (existingSupplier) {      
        const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.company===existingSupplier.company){
                person.company=""
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.company===existingSupplier.company){
                candidate.payment_In_Schema.company=""
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.company===existingSupplier.company){
              candidate.payment_Out_Schema.company=""
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.company===existingSupplier.company){
                azadCandidate.payment_In_Schema.company=""
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.company===existingSupplier.company){
              azadCandidate.payment_Out_Schema.company=""
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.company===existingSupplier.company){
                ticketCandidate.payment_In_Schema.company=""
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.company===existingSupplier.company){
              ticketCandidate.payment_Out_Schema.company=""
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.company===existingSupplier.company){
                visitCandidate.payment_In_Schema.company=""
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.company===existingSupplier.company){
              visitCandidate.payment_Out_Schema.company=""
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find();

                        for (const entry of entries) {
                            if (entry.company === existingSupplier.company) {
                                entry.company = "";
                            }
                            
                            await entry.save(); // Save the updated entry
                        }

                  const deleteCompany=await Companies.findByIdAndDelete(myId)

                  res.status(200).json({  message: `Company deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}


// getting Companies

const getCompany = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const companies = await Companies.find({})
            res.status(200).json({ data: companies })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

//10- Trades Controllers

//Adding a New Trade

const addTrade = async (req, res) => {
    try {
        const { trade } = req.body
        if (!trade) {
            return res.status(400).json({ message: "Trade Name is required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a Company with the same name already exists

                const existingTrade = await Trades.findOne({ trade });
                if (existingTrade) {
                    return res.status(400).json({ message: "A Trade with this Name already exists" });
                }

                if (!existingTrade) {

                    const newTrade = new Trades({
                        trade
                    })


                    await newTrade.save()
                    res.status(200).json({ data: newTrade, message: `${trade} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}




const updateTrade = async (req, res) => {
  try {
      const { myId,trade } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await Trades.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Trade not found!" });
              }
              if (existingSupplier) {        
        const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=trade
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.trade===existingSupplier.trade){
                candidate.payment_In_Schema.trade=trade
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.trade===existingSupplier.trade){
              candidate.payment_Out_Schema.trade=trade
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.trade===existingSupplier.trade){
                azadCandidate.payment_In_Schema.trade=trade
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.trade===existingSupplier.company){
              azadCandidate.payment_Out_Schema.trade=trade
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.trade===existingSupplier.trade){
                ticketCandidate.payment_In_Schema.trade=trade
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.trade===existingSupplier.trade){
              ticketCandidate.payment_Out_Schema.trade=trade
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.trade===existingSupplier.trade){
                visitCandidate.payment_In_Schema.trade=trade
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.trade===existingSupplier.trade){
              visitCandidate.payment_Out_Schema.trade=trade
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find();
                        for (const entry of entries) {
                            if (entry.trade === existingSupplier.trade) {
                                entry.trade = trade;
                                console.log("Yes",entry.trade,existingSupplier.trade)
                            }
                            console.log("No",entry.trade,existingSupplier.trade)

                            
                            await entry.save(); // Save the updated entry
                        }


                    existingSupplier.trade=trade
                  await existingSupplier.save()
                  res.status(200).json({  message: `Trade updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}



const deleteTrade = async (req, res) => {
  try {
      const { myId } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await Trades.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Trade not found!" });
              }
              if (existingSupplier) {        
        const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.trade===existingSupplier.trade){
                person.trade=""
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.trade===existingSupplier.trade){
                candidate.payment_In_Schema.trade=""
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.trade===existingSupplier.trade){
              candidate.payment_Out_Schema.trade=""
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.trade===existingSupplier.trade){
                azadCandidate.payment_In_Schema.trade=""
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.trade===existingSupplier.trade){
              azadCandidate.payment_Out_Schema.trade=""
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.trade===existingSupplier.trade){
                ticketCandidate.payment_In_Schema.trade=""
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.trade===existingSupplier.trade){
              ticketCandidate.payment_Out_Schema.trade=""
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.trade===existingSupplier.trade){
                visitCandidate.payment_In_Schema.trade=""
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.trade===existingSupplier.trade){
              visitCandidate.payment_Out_Schema.trade=""
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find({});

                        for (const entry of entries) {
                            if (entry.trade === existingSupplier.trade) {
                                entry.trade = "";
                            }
                            
                            await entry.save(); // Save the updated entry
                        }

                      
                  const deleteTrade=await Trades.findByIdAndDelete(myId)

                  
                  res.status(200).json({  message: `Trade deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}

// getting Trades

const getTrade = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const trades = await Trades.find({})
            res.status(200).json({ data: trades })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

//11- Currency Countries Controllers

//Adding a New Currency Country

const addCurrCountry = async (req, res) => {
    try {
        const { currCountry } = req.body
        if (!currCountry) {
            return res.status(400).json({ message: "Currency Country Name is required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a  Currency Country with the same name already exists

                const existingCurrCountry = await CurrCountries.findOne({ currCountry });
                if (existingCurrCountry) {
                    return res.status(400).json({ message: "A Currency Country with this Name already exists" });
                }

                if (!existingCurrCountry) {

                    const newCurrCountry = new CurrCountries({
                        currCountry
                    })


                    await newCurrCountry.save()
                    res.status(200).json({ data: newCurrCountry, message: `${currCountry} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}




const updateCurrCountry = async (req, res) => {
  try {
      const { myId,currCountry } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await CurrCountries.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "CurrCountry not found!" });
              }
              if (existingSupplier) {
        const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()
        const expenses=await Expenses.find()
        const cdwcs= await CDWC.find()
        const cdwocs= await CDWOC.find()
        const employees=await Employees.find()
        
        for (const cdwc of cdwcs){
          if(cdwc.payment_In_Schema && cdwc.payment_In_Schema.payment){
            const payments=cdwc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currCountry){
                payment.payment_In_Curr=currCountry
              }
            }
            await cdwc.save()
          }
        }

        for (const cdwoc of cdwocs){
          if(cdwoc.payment_In_Schema && cdwoc.payment_In_Schema.payment){
            const payments=cdwoc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currCountry){
                payment.payment_In_Curr=currCountry
              }
            }
            await cdwoc.save()
          }
        }
        for (const employee of employees){
          if(employee.payment){
            const payments=employee.payment
            for (const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currCountry){
                payment.payment_Out_Curr=currCountry
              }
            }
            await employee.save()
          }
        }

        for(const expense of expenses){
          if (expense.curr_Country===existingSupplier.currCountry){
            expense.curr_Country=currCountry
          }
          await expense.save()
        }

        for(const agent of agents){
          if(agent.payment_In_Schema ){
              if(agent.payment_In_Schema && agent.payment_In_Schema){
                  if(agent.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                    agent.payment_In_Schema.curr_Country=currCountry
                  }
                }
          }

          if(agent.payment_Out_Schema ){
            if(agent.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
              agent.payment_Out_Schema.curr_Country=currCountry
            }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema ){
              if(supplier.payment_In_Schema ){
                  if(supplier.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                      supplier.payment_In_Schema.curr_Country=currCountry
                  }
                }
          }

          if(supplier.payment_Out_Schema ){
            if(supplier.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
              supplier.payment_Out_Schema.curr_Country=currCountry
            }
          }
          await supplier.save()

        }
       

        for(const protector of protectors){
       

          if(protector.payment_Out_Schema ){
              if(protector.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  protector.payment_Out_Schema.curr_Country=currCountry
              }
            }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema ){
              if(azadAgent.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                  azadAgent.payment_In_Schema.curr_Country=currCountry
              }
          
          }

          if(azadAgent.payment_Out_Schema ){
            
              if(azadAgent.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  azadAgent.payment_Out_Schema.curr_Country=currCountry
              }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema){
           
           if(azadSupplier.payment_In_Schema.curr_Country===existingSupplier.currCountry){
              azadSupplier.payment_In_Schema.curr_Country=currCountry
          }
          }

          if(azadSupplier.payment_Out_Schema ){
              if(azadSupplier.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  azadSupplier.payment_Out_Schema.curr_Country=currCountry
              }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema ){
              if(ticketAgent.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                  ticketAgent.payment_In_Schema.curr_Country=currCountry
              }
          }

          if(ticketAgent.payment_Out_Schema ){
              if(ticketAgent.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  ticketAgent.payment_Out_Schema.curr_Country=currCountry
              }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema ){
              if(ticketSupplier.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                  ticketSupplier.payment_In_Schema.curr_Country=currCountry
              }
          }

          if(ticketSupplier.payment_Out_Schema){
              if(ticketSupplier.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  ticketSupplier.payment_Out_Schema.curr_Country=currCountry
              }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema ){
              if(visitAgent.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                  visitAgent.payment_In_Schema.curr_Country=currCountry
              }
          }

          if(visitAgent.payment_Out_Schema ){
              if(visitAgent.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  visitAgent.payment_Out_Schema.curr_Country=existingSupplier.currCountry
              }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema){
             
              if(visitSupplier.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                  visitSupplier.payment_In_Schema.curr_Country=currCountry
              }
          }

          if(visitSupplier.payment_Out_Schema){
              if(visitSupplier.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  visitSupplier.payment_Out_Schema.curr_Country=currCountry
              }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.curr_Country===existingSupplier.existingSupplier.currCountry){
                candidate.payment_In_Schema.curr_Country=currCountry
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
              candidate.payment_Out_Schema.curr_Country=currCountry
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                azadCandidate.payment_In_Schema.curr_Country=currCountry
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.curr_Country===existingSupplier.company){
              azadCandidate.payment_Out_Schema.curr_Country=currCountry
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                ticketCandidate.payment_In_Schema.curr_Country=currCountry
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
              ticketCandidate.payment_Out_Schema.curr_Country=currCountry
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                visitCandidate.payment_In_Schema.curr_Country=currCountry
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
              visitCandidate.payment_Out_Schema.curr_Country=currCountry
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find();

                        for (const entry of entries) {
                            if (entry.cur_Country_One === existingSupplier.currCountry) {
                                entry.cur_Country_One = currCountry;
                            }
                            if (entry.cur_Country_Two === existingSupplier.currCountry) {
                              entry.cur_Country_Two = currCountry;
                          }
                            
                            await entry.save(); // Save the updated entry
                        }

                        existingSupplier.currCountry=currCountry
                      
                  await existingSupplier.save()
                  res.status(200).json({  message: `CurCountry updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}



const deleteCurrCountry = async (req, res) => {
  try {
      const { myId } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await CurrCountries.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Curr Country not found!" });
              }
              if (existingSupplier) {
        
        const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()
        const expenses=await Expenses.find()
        const cdwcs= await CDWC.find()
        const cdwocs= await CDWOC.find()
        const employees=await Employees.find()
        
        for (const cdwc of cdwcs){
          if(cdwc.payment_In_Schema && cdwc.payment_In_Schema.payment){
            const payments=cdwc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currCountry){
                payment.payment_In_Curr=""
              }
            }
            await cdwc.save()
          }
        }

        for (const cdwoc of cdwocs){
          if(cdwoc.payment_In_Schema && cdwoc.payment_In_Schema.payment){
            const payments=cdwoc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currCountry){
                payment.payment_In_Curr=""
              }
            }
            await cdwoc.save()
          }
        }
        for (const employee of employees){
          if(employee.payment){
            const payments=employee.payment
            for (const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currCountry){
                payment.payment_Out_Curr=""
              }
            }
            await employee.save()
          }
        }

        for(const expense of expenses){
          if (expense.curr_Country===existingSupplier.currCountry){
            expense.curr_Country=""
          }
          await expense.save()
        }

        for(const agent of agents){
          if(agent.payment_In_Schema ){
              if(agent.payment_In_Schema && agent.payment_In_Schema){
                  if(agent.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                    agent.payment_In_Schema.curr_Country=""
                  }
                }
          }

          if(agent.payment_Out_Schema ){
            if(agent.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
              agent.payment_Out_Schema.curr_Country=""
            }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema ){
              if(supplier.payment_In_Schema ){
                  if(supplier.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                      supplier.payment_In_Schema.curr_Country=""
                  }
                }
          }

          if(supplier.payment_Out_Schema ){
            if(supplier.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
              supplier.payment_Out_Schema.curr_Country=""
            }
          }
          await supplier.save()

        }
       

        for(const protector of protectors){
       

          if(protector.payment_Out_Schema ){
              if(protector.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  protector.payment_Out_Schema.curr_Country=""
              }
            }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema ){
              if(azadAgent.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                  azadAgent.payment_In_Schema.curr_Country=""
              }
          
          }

          if(azadAgent.payment_Out_Schema ){
            
              if(azadAgent.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  azadAgent.payment_Out_Schema.curr_Country=""
              }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema){
           
           if(azadSupplier.payment_In_Schema.curr_Country===existingSupplier.currCountry){
              azadSupplier.payment_In_Schema.curr_Country=""
          }
          }

          if(azadSupplier.payment_Out_Schema ){
              if(azadSupplier.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  azadSupplier.payment_Out_Schema.curr_Country=""
              }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema ){
              if(ticketAgent.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                  ticketAgent.payment_In_Schema.curr_Country=""
              }
          }

          if(ticketAgent.payment_Out_Schema ){
              if(ticketAgent.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  ticketAgent.payment_Out_Schema.curr_Country=""
              }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema ){
              if(ticketSupplier.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                  ticketSupplier.payment_In_Schema.curr_Country=""
              }
          }

          if(ticketSupplier.payment_Out_Schema){
              if(ticketSupplier.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  ticketSupplier.payment_Out_Schema.curr_Country=""
              }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema ){
              if(visitAgent.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                  visitAgent.payment_In_Schema.curr_Country=""
              }
          }

          if(visitAgent.payment_Out_Schema ){
              if(visitAgent.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  visitAgent.payment_Out_Schema.curr_Country=existingSupplier.currCountry
              }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema){
             
              if(visitSupplier.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                  visitSupplier.payment_In_Schema.curr_Country=""
              }
          }

          if(visitSupplier.payment_Out_Schema){
              if(visitSupplier.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
                  visitSupplier.payment_Out_Schema.curr_Country=""
              }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.curr_Country===existingSupplier.existingSupplier.currCountry){
                candidate.payment_In_Schema.curr_Country=""
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
              candidate.payment_Out_Schema.curr_Country=""
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                azadCandidate.payment_In_Schema.curr_Country=""
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.curr_Country===existingSupplier.company){
              azadCandidate.payment_Out_Schema.curr_Country=""
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                ticketCandidate.payment_In_Schema.curr_Country=""
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
              ticketCandidate.payment_Out_Schema.curr_Country=""
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.curr_Country===existingSupplier.currCountry){
                visitCandidate.payment_In_Schema.curr_Country=""
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.curr_Country===existingSupplier.currCountry){
              visitCandidate.payment_Out_Schema.curr_Country=""
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find();

                        for (const entry of entries) {
                            if (entry.cur_Country_One === existingSupplier.currCountry) {
                                entry.cur_Country_One ="";
                            }
                            if (entry.cur_Country_Two === existingSupplier.currCountry) {
                              entry.cur_Country_Two ="";
                          }
                            
                            await entry.save(); // Save the updated entry
                        }

              const deleteCurCountry = await CurrCountries.findByIdAndDelete(myId);
                      
                  
                  res.status(200).json({  message: `CurCountry deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}


// getting Currency Countries

const getCurrCountry = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const currCountries = await CurrCountries.find({})
            res.status(200).json({ data: currCountries })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


//12- Payment Via Controllers

//Adding a New Payment Via

const addPaymentVia = async (req, res) => {
    try {
        const { payment_Via } = req.body
        if (!payment_Via) {
            return res.status(400).json({ message: "payment_Via Name is required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a payment Via with the same name already exists

                const existingPaymentVia = await PaymentVia.findOne({ payment_Via });
                if (existingPaymentVia) {
                    return res.status(400).json({ message: "A Payment_Via with this Name already exists" });
                }

                if (!existingPaymentVia) {

                    const newPaymentVia = new PaymentVia({
                        payment_Via
                    })


                    await newPaymentVia.save()
                    res.status(200).json({ data: newPaymentVia, message: `${payment_Via} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



const updatePaymentVia = async (req, res) => {
  try {
      const { myId,payment_Via } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await PaymentVia.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "PaymentVia not found!" });
              }
              if (existingSupplier) {                
          const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()
        const expenses=await Expenses.find()
        const cdwcs= await CDWC.find()
        const cdwocs= await CDWOC.find()
        const employees=await Employees.find()
        const cashInHands=await CashInHand.find()

        for (const cashInHand  of cashInHands){
          if(cashInHand.payment){
            const payments=cashInHand.payment
            for (const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
              }
            }
            await cdwc.save()
          }
        }
        
        for (const cdwc of cdwcs){
          if(cdwc.payment_In_Schema && cdwc.payment_In_Schema.payment){
            const payments=cdwc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
              }
            }
            await cdwc.save()
          }
        }

        for (const cdwoc of cdwocs){
          if(cdwoc.payment_In_Schema && cdwoc.payment_In_Schema.payment){
            const payments=cdwoc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
              }
            }
            await cdwoc.save()
          }
        }
        for (const employee of employees){
          if(employee.payment){
            const payments=employee.payment
            for (const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
              }
            }
            await employee.save()
          }
        }

        for(const expense of expenses){
          if (expense.payment_Via===existingSupplier.payment_Via){
            expense.payment_Via=payment_Via
          }
          await expense.save()
        }



        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.payment){
            const payments=agent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.company=company
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.payment){
            const payments=agent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.company=company
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.payment){
            const payments=supplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.payment){
            const payments=supplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.payment){
            const payments=protector.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.payment){
            const payments=azadAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.payment){
            const payments=azadAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.payment){
            const payments=azadSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.payment){
            const payments=azadSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.payment){
            const payments=ticketAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.payment){
            const payments=ticketAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.payment){
            const payments=ticketSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.payment){
            const payments=ticketSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.payment){
            const payments=visitAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.payment){
            const payments=visitAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.payment){
            const payments=visitSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.payment){
            const payments=visitSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=payment_Via
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema && candidate.payment_In_Schema.payment){
            const payments=candidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=payment_Via
                
               }
             }
           }
          }
          

          if(candidate.payment_Out_Schema && candidate.payment_Out_Schema.payment){
           
            const payments=candidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=payment_Via
                
               }
             }
           }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema && azadCandidate.payment_In_Schema.payment){
           
         
            const payments=azadCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=payment_Via
                
               }
             }
           }
          
          }
          

          if(azadCandidate.payment_Out_Schema && azadCandidate.payment_Out_Schema.payment){
            const payments=azadCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=payment_Via
                
               }
             }
           }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema && ticketCandidate.payment_In_Schema.payment){
            const payments=ticketCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=payment_Via
                
               }
             }
           }
          
          }
          

          if(ticketCandidate.payment_Out_Schema && ticketCandidate.payment_Out_Schema.payment){
            const payments=ticketCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=payment_Via
                
               }
             }
           }
          
          }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=payment_Via
                
               }
             }
           }
          
          }
          

          if(visitCandidate.payment_Out_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=payment_Via
                
               }
             }
           }
        
        }
          await visitCandidate.save()

        }
                  
                  existingSupplier.payment_Via=payment_Via
                      
                  await existingSupplier.save()
                  res.status(200).json({  message: `Payment Via updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}



const deletePaymentVia = async (req, res) => {
  try {
      const { myId } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await PaymentVia.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "PaymentVia not found!" });
              }
              if (existingSupplier) {        
        const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()
        const expenses=await Expenses.find()
        const cdwcs= await CDWC.find()
        const cdwocs= await CDWOC.find()
        const employees=await Employees.find()
        const cashInHands=await CashInHand.find()

        for (const cashInHand  of cashInHands){
          if(cashInHand.payment){
            const payments=cashInHand.payment
            for (const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
              }
            }
            await cdwc.save()
          }
        }
        
        for (const cdwc of cdwcs){
          if(cdwc.payment_In_Schema && cdwc.payment_In_Schema.payment){
            const payments=cdwc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
              }
            }
            await cdwc.save()
          }
        }

        for (const cdwoc of cdwocs){
          if(cdwoc.payment_In_Schema && cdwoc.payment_In_Schema.payment){
            const payments=cdwoc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
              }
            }
            await cdwoc.save()
          }
        }
        for (const employee of employees){
          if(employee.payment){
            const payments=employee.payment
            for (const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
              }
            }
            await employee.save()
          }
        }

        for(const expense of expenses){
          if (expense.payment_Via===existingSupplier.payment_Via){
            expense.payment_Via=""
          }
          await expense.save()
        }



        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.payment){
            const payments=agent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.company=company
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.payment){
            const payments=agent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.company=company
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.payment){
            const payments=supplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.payment){
            const payments=supplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.payment){
            const payments=protector.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.payment){
            const payments=azadAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.payment){
            const payments=azadAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.payment){
            const payments=azadSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.payment){
            const payments=azadSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.payment){
            const payments=ticketAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.payment){
            const payments=ticketAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.payment){
            const payments=ticketSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.payment){
            const payments=ticketSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.payment){
            const payments=visitAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.payment){
            const payments=visitAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.payment){
            const payments=visitSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.payment){
            const payments=visitSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Via===existingSupplier.payment_Via){
                payment.payment_Via=""
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema && candidate.payment_In_Schema.payment){
            const payments=candidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=""
                
               }
             }
           }
          }
          

          if(candidate.payment_Out_Schema && candidate.payment_Out_Schema.payment){
           
            const payments=candidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=""
                
               }
             }
           }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema && azadCandidate.payment_In_Schema.payment){
           
         
            const payments=azadCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=""
                
               }
             }
           }
          
          }
          

          if(azadCandidate.payment_Out_Schema && azadCandidate.payment_Out_Schema.payment){
            const payments=azadCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=""
                
               }
             }
           }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema && ticketCandidate.payment_In_Schema.payment){
            const payments=ticketCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=""
                
               }
             }
           }
          
          }
          

          if(ticketCandidate.payment_Out_Schema && ticketCandidate.payment_Out_Schema.payment){
            const payments=ticketCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=""
                
               }
             }
           }
          
          }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=""
                
               }
             }
           }
          
          }
          

          if(visitCandidate.payment_Out_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Via===existingSupplier.payment_Via){
                 payment.payment_Via=""
                
               }
             }
           }
        
        }
          await visitCandidate.save()

        }
              const deletePaymentVia = await PaymentVia.findByIdAndDelete(myId);
                
                  res.status(200).json({  message: `Payment Via deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}

// getting Payment Via

const getPaymentVia = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const paymentVia = await PaymentVia.find({})
            res.status(200).json({ data: paymentVia })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


//13- Payment Type Controllers

//Adding a New Payment Type

const addPaymentType = async (req, res) => {
    try {
        const { payment_Type } = req.body
        if (!payment_Type) {
            return res.status(400).json({ message: "payment_Type Name is required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a Payment Type with the same name already exists

                const existingPaymentType = await PaymentType.findOne({ payment_Type });
                if (existingPaymentType) {
                    return res.status(400).json({ message: "A Payment_Type with this Name already exists" });
                }

                if (!existingPaymentType) {

                    const newPaymentType = new PaymentType({
                        payment_Type
                    })


                    await newPaymentType.save()
                    res.status(200).json({ data: newPaymentType, message: `${payment_Type} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const updatePaymentType= async (req, res) => {
  try {
      const { myId,payment_Type } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await PaymentType.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Payment_Type not found!" });
              }
              if (existingSupplier) {

                  const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()
        const expenses=await Expenses.find()
        const cdwcs= await CDWC.find()
        const cdwocs= await CDWOC.find()
        const employees=await Employees.find()
        const cashInHands=await CashInHand.find()

        for (const cashInHand  of cashInHands){
          if(cashInHand.payment){
            const payments=cashInHand.payment
            for (const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
              }
            }
            await cdwc.save()
          }
        }
        
        for (const cdwc of cdwcs){
          if(cdwc.payment_In_Schema && cdwc.payment_In_Schema.payment){
            const payments=cdwc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
              }
            }
            await cdwc.save()
          }
        }

        for (const cdwoc of cdwocs){
          if(cdwoc.payment_In_Schema && cdwoc.payment_In_Schema.payment){
            const payments=cdwoc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
              }
            }
            await cdwoc.save()
          }
        }
        for (const employee of employees){
          if(employee.payment){
            const payments=employee.payment
            for (const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
              }
            }
            await employee.save()
          }
        }

        for(const expense of expenses){
          if (expense.payment_Type===existingSupplier.payment_Type){
            expense.payment_Type=payment_Type
          }
          await expense.save()
        }






        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.payment){
            const payments=agent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.payment){
            const payments=agent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.payment){
            const payments=supplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.payment){
            const payments=supplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.payment){
            const payments=protector.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.payment){
            const payments=azadAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.payment){
            const payments=azadAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.payment){
            const payments=azadSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.payment){
            const payments=azadSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.payment){
            const payments=ticketAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.payment){
            const payments=ticketAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.payment){
            const payments=ticketSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.payment){
            const payments=ticketSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.payment){
            const payments=visitAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.payment){
            const payments=visitAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.payment){
            const payments=visitSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.payment){
            const payments=visitSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=payment_Type
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema && candidate.payment_In_Schema.payment){
            const payments=candidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=payment_Type
                
               }
             }
           }
          }
          

          if(candidate.payment_Out_Schema && candidate.payment_Out_Schema.payment){
           
            const payments=candidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=payment_Type
                
               }
             }
           }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema && azadCandidate.payment_In_Schema.payment){
           
         
            const payments=azadCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=payment_Type
                
               }
             }
           }
          
          }
          

          if(azadCandidate.payment_Out_Schema && azadCandidate.payment_Out_Schema.payment){
            const payments=azadCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=payment_Type
                
               }
             }
           }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema && ticketCandidate.payment_In_Schema.payment){
            const payments=ticketCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=payment_Type
                
               }
             }
           }
          
          }
          

          if(ticketCandidate.payment_Out_Schema && ticketCandidate.payment_Out_Schema.payment){
            const payments=ticketCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=payment_Type
                
               }
             }
           }
          
          }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=payment_Type
                
               }
             }
           }
          
          }
          

          if(visitCandidate.payment_Out_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=payment_Type
                
               }
             }
           }
        
        }
          await visitCandidate.save()

        }
        existingSupplier.payment_Type=payment_Type
                  
                      
                  await existingSupplier.save()
                  res.status(200).json({  message: `Payment Type updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}



const deletePaymentType = async (req, res) => {
  try {
      const { myId } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await PaymentType.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "PaymentType not found!" });
              }
              if (existingSupplier) {
                
                  

                
                  const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()
        const expenses=await Expenses.find()
        const cdwcs= await CDWC.find()
        const cdwocs= await CDWOC.find()
        const employees=await Employees.find()
        const cashInHands=await CashInHand.find()

        for (const cashInHand  of cashInHands){
          if(cashInHand.payment){
            const payments=cashInHand.payment
            for (const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
              }
            }
            await cdwc.save()
          }
        }
        
        for (const cdwc of cdwcs){
          if(cdwc.payment_In_Schema && cdwc.payment_In_Schema.payment){
            const payments=cdwc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
              }
            }
            await cdwc.save()
          }
        }

        for (const cdwoc of cdwocs){
          if(cdwoc.payment_In_Schema && cdwoc.payment_In_Schema.payment){
            const payments=cdwoc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
              }
            }
            await cdwoc.save()
          }
        }
        for (const employee of employees){
          if(employee.payment){
            const payments=employee.payment
            for (const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
              }
            }
            await employee.save()
          }
        }

        for(const expense of expenses){
          if (expense.payment_Type===existingSupplier.payment_Type){
            expense.payment_Type=""
          }
          await expense.save()
        }



        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.payment){
            const payments=agent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.payment){
            const payments=agent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.payment){
            const payments=supplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.payment){
            const payments=supplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.payment){
            const payments=protector.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.payment){
            const payments=azadAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.payment){
            const payments=azadAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.payment){
            const payments=azadSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.payment){
            const payments=azadSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.payment){
            const payments=ticketAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.payment){
            const payments=ticketAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.payment){
            const payments=ticketSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.payment){
            const payments=ticketSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.payment){
            const payments=visitAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.payment){
            const payments=visitAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.payment){
            const payments=visitSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.payment){
            const payments=visitSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Type===existingSupplier.payment_Type){
                payment.payment_Type=""
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema && candidate.payment_In_Schema.payment){
            const payments=candidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=""
                
               }
             }
           }
          }
          

          if(candidate.payment_Out_Schema && candidate.payment_Out_Schema.payment){
           
            const payments=candidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=""
                
               }
             }
           }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema && azadCandidate.payment_In_Schema.payment){
           
         
            const payments=azadCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=""
                
               }
             }
           }
          
          }
          

          if(azadCandidate.payment_Out_Schema && azadCandidate.payment_Out_Schema.payment){
            const payments=azadCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=""
                
               }
             }
           }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema && ticketCandidate.payment_In_Schema.payment){
            const payments=ticketCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=""
                
               }
             }
           }
          
          }
          

          if(ticketCandidate.payment_Out_Schema && ticketCandidate.payment_Out_Schema.payment){
            const payments=ticketCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=""
                
               }
             }
           }
          
          }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=""
                
               }
             }
           }
          
          }
          

          if(visitCandidate.payment_Out_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Type===existingSupplier.payment_Type){
                 payment.payment_Type=""
                
               }
             }
           }
        
        }
          await visitCandidate.save()

        }
                  
                      
              const deletePaymentType = await PaymentType.findByIdAndDelete(myId);

                  res.status(200).json({  message: `Payment_Type deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}

// getting Payment Type

const getPaymentType = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const paymentType = await PaymentType.find({})
            res.status(200).json({ data: paymentType })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

//14- Entry Mode Controllers
//Adding a New Entry Mode

const addEntryMode = async (req, res) => {
    try {
        const { entry_Mode } = req.body
        if (!entry_Mode) {
            return res.status(400).json({ message: "entry_Mode Name is required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a entry Mode with the same name already exists

                const existingEntryMode = await EntryMode.findOne({ entry_Mode });
                if (existingEntryMode) {
                    return res.status(400).json({ message: "An Entry Mode with this Name already exists" });
                }

                if (!existingEntryMode) {

                    const newEntryMode = new EntryMode({
                        entry_Mode
                    })


                    await newEntryMode.save()
                    res.status(200).json({ data: newEntryMode, message: `${entry_Mode} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const updateEntryMode = async (req, res) => {
  try {
      const { myId,entry_Mode } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await EntryMode.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "EntryMode not found!" });
              }
              if (existingSupplier) {
                
        const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=entry_Mode
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.entry_Mode===existingSupplier.entry_Mode){
                candidate.payment_In_Schema.entry_Mode=entry_Mode
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.entry_Mode===existingSupplier.entry_Mode){
              candidate.payment_Out_Schema.entry_Mode=entry_Mode
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.entry_Mode===existingSupplier.entry_Mode){
                azadCandidate.payment_In_Schema.entry_Mode=entry_Mode
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.entry_Mode===existingSupplier.company){
              azadCandidate.payment_Out_Schema.entry_Mode=entry_Mode
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.entry_Mode===existingSupplier.entry_Mode){
                ticketCandidate.payment_In_Schema.entry_Mode=entry_Mode
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.entry_Mode===existingSupplier.entry_Mode){
              ticketCandidate.payment_Out_Schema.entry_Mode=entry_Mode
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.entry_Mode===existingSupplier.entry_Mode){
                visitCandidate.payment_In_Schema.entry_Mode=entry_Mode
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.entry_Mode===existingSupplier.entry_Mode){
              visitCandidate.payment_Out_Schema.entry_Mode=entry_Mode
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find();

                        for (const entry of entries) {
                            if (entry.entry_Mode === existingSupplier.entry_Mode) {
                                entry.entry_Mode = entry_Mode;
                            }
                            
                            await entry.save(); // Save the updated entry
                        }

                  existingSupplier.entry_Mode=entry_Mode
  
                  await existingSupplier.save()
                  res.status(200).json({  message: `EntryMode updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}



const deleteEntryMode = async (req, res) => {
  try {
      const { myId } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await EntryMode.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "EntryMode not found!" });
              }
              if (existingSupplier) {
                

                
                  const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.entry_Mode===existingSupplier.entry_Mode){
                person.entry_Mode=""
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.entry_Mode===existingSupplier.entry_Mode){
                candidate.payment_In_Schema.entry_Mode=""
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.entry_Mode===existingSupplier.entry_Mode){
              candidate.payment_Out_Schema.entry_Mode=""
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.entry_Mode===existingSupplier.entry_Mode){
                azadCandidate.payment_In_Schema.entry_Mode=""
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.entry_Mode===existingSupplier.company){
              azadCandidate.payment_Out_Schema.entry_Mode=""
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.entry_Mode===existingSupplier.entry_Mode){
                ticketCandidate.payment_In_Schema.entry_Mode=""
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.entry_Mode===existingSupplier.entry_Mode){
              ticketCandidate.payment_Out_Schema.entry_Mode=""
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.entry_Mode===existingSupplier.entry_Mode){
                visitCandidate.payment_In_Schema.entry_Mode=""
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.entry_Mode===existingSupplier.entry_Mode){
              visitCandidate.payment_Out_Schema.entry_Mode=""
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find();

                        for (const entry of entries) {
                            if (entry.entry_Mode === existingSupplier.entry_Mode) {
                                entry.entry_Mode = "";
                            }
                            
                            await entry.save(); // Save the updated entry
                        }

                const deleteEntryMode=await EntryMode.findByIdAndDelete(myId);
                
                  res.status(200).json({  message: `EntryMode deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}



// getting Entry Modes

const getEntryMode = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const entryMode = await EntryMode.find({})
            res.status(200).json({ data: entryMode })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}



//15- Final Status Controllers

//Adding a New Final Status

const addFinalStatus = async (req, res) => {
    try {
        const { final_Status } = req.body
        if (!final_Status) {
            return res.status(400).json({ message: "final_Status Name is required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a entry Mode with the same name already exists

                const existingFinalStatus = await FinalStatus.findOne({ final_Status });
                if (existingFinalStatus) {
                    return res.status(400).json({ message: "A Final_Status with this Name already exists" });
                }

                if (!existingFinalStatus) {

                    const newFinalStatus = new FinalStatus({
                        final_Status
                    })


                    await newFinalStatus.save()
                    res.status(200).json({ data: newFinalStatus, message: `${final_Status} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



const updateFinalStatus = async (req, res) => {
  try {
      const { myId,final_Status } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await FinalStatus.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Final Status not found!" });
              }
              if (existingSupplier) {        
        const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=final_Status
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.final_Status===existingSupplier.final_Status){
                candidate.payment_In_Schema.final_Status=final_Status
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.final_Status===existingSupplier.final_Status){
              candidate.payment_Out_Schema.final_Status=final_Status
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.final_Status===existingSupplier.final_Status){
                azadCandidate.payment_In_Schema.final_Status=final_Status
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.final_Status===existingSupplier.company){
              azadCandidate.payment_Out_Schema.final_Status=final_Status
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.final_Status===existingSupplier.final_Status){
                ticketCandidate.payment_In_Schema.final_Status=final_Status
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.final_Status===existingSupplier.final_Status){
              ticketCandidate.payment_Out_Schema.final_Status=final_Status
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.final_Status===existingSupplier.final_Status){
                visitCandidate.payment_In_Schema.final_Status=final_Status
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.final_Status===existingSupplier.final_Status){
              visitCandidate.payment_Out_Schema.final_Status=final_Status
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find();

                        for (const entry of entries) {
                            if (entry.final_Status === existingSupplier.final_Status) {
                                entry.final_Status = final_Status;
                            }
                            
                            await entry.save(); // Save the updated entry
                        }

                      
                  existingSupplier.final_Status=final_Status
                  await existingSupplier.save()
                  res.status(200).json({  message: `Final Status updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}



const deleteFinalStatus = async (req, res) => {
  try {
      const { myId,final_Status } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await FinalStatus.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Final Status not found!" });
              }
              if (existingSupplier) {
                
              
                
                  const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.final_Status===existingSupplier.final_Status){
                person.final_Status=""
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.final_Status===existingSupplier.final_Status){
                candidate.payment_In_Schema.final_Status=""
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.final_Status===existingSupplier.final_Status){
              candidate.payment_Out_Schema.final_Status=""
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.final_Status===existingSupplier.final_Status){
                azadCandidate.payment_In_Schema.final_Status=""
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.final_Status===existingSupplier.company){
              azadCandidate.payment_Out_Schema.final_Status=""
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.final_Status===existingSupplier.final_Status){
                ticketCandidate.payment_In_Schema.final_Status=""
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.final_Status===existingSupplier.final_Status){
              ticketCandidate.payment_Out_Schema.final_Status=""
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.final_Status===existingSupplier.final_Status){
                visitCandidate.payment_In_Schema.final_Status=""
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.final_Status===existingSupplier.final_Status){
              visitCandidate.payment_Out_Schema.final_Status=""
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find();

                        for (const entry of entries) {
                            if (entry.final_Status === existingSupplier.final_Status) {
                                entry.final_Status = "";
                            }
                            
                            await entry.save(); // Save the updated entry
                        }

              const deleteFinalStatus = await FinalStatus.findByIdAndDelete(myId);
                      
                 
                  res.status(200).json({  message: `Final Status deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}

// getting Final Status

const getFinalStatus = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const finalStatus = await FinalStatus.find({})
            res.status(200).json({ data: finalStatus })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


//16- Countries Controllers

//Adding a New Country

const addCountry = async (req, res) => {
    try {
        const { country } = req.body
        if (!country) {
            return res.status(400).json({ message: "Country Name is required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a country with the same name already exists

                const existingCountry = await Countries.findOne({ country });
                if (existingCountry) {
                    return res.status(400).json({ message: "A Country with this Name already exists" });
                }

                if (!existingCountry) {

                    const newCountry = new Countries({
                        country
                    })


                    await newCountry.save()
                    res.status(200).json({ data: newCountry, message: `${country} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



const updateCountry = async (req, res) => {
  try {
      const { myId,country } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await Countries.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Country not found!" });
              }
              if (existingSupplier) {                
                  const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=country
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.country===existingSupplier.country){
                candidate.payment_In_Schema.country=country
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.country===existingSupplier.country){
              candidate.payment_Out_Schema.country=country
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.country===existingSupplier.country){
                azadCandidate.payment_In_Schema.country=country
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.country===existingSupplier.company){
              azadCandidate.payment_Out_Schema.country=country
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.country===existingSupplier.country){
                ticketCandidate.payment_In_Schema.country=country
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.country===existingSupplier.country){
              ticketCandidate.payment_Out_Schema.country=country
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.country===existingSupplier.country){
                visitCandidate.payment_In_Schema.country=country
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.country===existingSupplier.country){
              visitCandidate.payment_Out_Schema.country=country
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find();

                        for (const entry of entries) {
                            if (entry.country === existingSupplier.country) {
                                entry.country = country;
                            }
                            
                            await entry.save(); // Save the updated entry
                        }

                      
                  existingSupplier.country=country
                  await existingSupplier.save()
                  res.status(200).json({  message: `Country updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}



const deleteCountry = async (req, res) => {
  try {
      const { myId,country } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await Countries.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Country not found!" });
              }
              if (existingSupplier) {
              
                
                  const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.country===existingSupplier.country){
                person.country=""
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.country===existingSupplier.country){
                candidate.payment_In_Schema.country=""
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.country===existingSupplier.country){
              candidate.payment_Out_Schema.country=""
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.country===existingSupplier.country){
                azadCandidate.payment_In_Schema.country=""
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.country===existingSupplier.company){
              azadCandidate.payment_Out_Schema.country=""
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.country===existingSupplier.country){
                ticketCandidate.payment_In_Schema.country=""
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.country===existingSupplier.country){
              ticketCandidate.payment_Out_Schema.country=""
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.country===existingSupplier.country){
                visitCandidate.payment_In_Schema.country=""
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.country===existingSupplier.country){
              visitCandidate.payment_Out_Schema.country=""
           
            }
        
        }
          await visitCandidate.save()

        }
                        const entries = await Entries.find();

                        for (const entry of entries) {
                            if (entry.country === existingSupplier.country) {
                                entry.country = "";
                            }
                            
                            await entry.save(); // Save the updated entry
                        }

                        const deleteCountry = await Countries.findByIdAndDelete(myId);
    
                  res.status(200).json({  message: `Country deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}

// getting Countries

const getCountry = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const countries = await Countries.find({})
            res.status(200).json({ data: countries })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}



//17- Categories Controllers

//Adding a New Category

const addCategory = async (req, res) => {
    try {
        const { category } = req.body
        if (!category) {
            return res.status(400).json({ message: "Category Name is required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a Category with the same name already exists

                const existingCategory = await Categories.findOne({ category });
                if (existingCategory) {
                    return res.status(400).json({ message: "A Category with this Name already exists" });
                }

                if (!existingCategory) {

                    const newCategory = new Categories({
                        category
                    })


                    await newCategory.save()
                    res.status(200).json({ data: newCategory, message: `${category} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const updateCategory = async (req, res) => {
  try {
      const { myId,category } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await Categories.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Category not found!" });
              }
              if (existingSupplier) {
                

                
                  const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()
        const cdwcs= await CDWC.find()
        const cdwocs= await CDWOC.find()
        const employees=await Employees.find()
        const cashInHands=await CashInHand.find()

        for (const cashInHand  of cashInHands){
          if(cashInHand.payment){
            const payments=cashInHand.payment
            for (const payment of payments){
              if(payment.category===existingSupplier.category){
                payment.category=category
              }
            }
            await cdwc.save()
          }
        }
        
        for (const cdwc of cdwcs){
          if(cdwc.payment_In_Schema && cdwc.payment_In_Schema.payment){
            const payments=cdwc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.category===existingSupplier.category){
                payment.category=category
              }
            }
            await cdwc.save()
          }
        }

        for (const cdwoc of cdwocs){
          if(cdwoc.payment_In_Schema && cdwoc.payment_In_Schema.payment){
            const payments=cdwoc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.category===existingSupplier.category){
                payment.category=category
              }
            }
            await cdwoc.save()
          }
        }
        for (const employee of employees){
          if(employee.payment){
            const payments=employee.payment
            for (const payment of payments){
              if(payment.category===existingSupplier.category){
                payment.category=category
              }
            }
            await employee.save()
          }
        }



        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=category
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.category===existingSupplier.category){
                candidate.payment_In_Schema.category=category
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.category===existingSupplier.category){
              candidate.payment_Out_Schema.category=category
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.category===existingSupplier.category){
                azadCandidate.payment_In_Schema.category=category
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.category===existingSupplier.company){
              azadCandidate.payment_Out_Schema.category=category
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.category===existingSupplier.category){
                ticketCandidate.payment_In_Schema.category=category
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.category===existingSupplier.category){
              ticketCandidate.payment_Out_Schema.category=category
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.category===existingSupplier.category){
                visitCandidate.payment_In_Schema.category=category
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.category===existingSupplier.category){
              visitCandidate.payment_Out_Schema.category=category
           
            }
        
        }
          await visitCandidate.save()

        }
                  existingSupplier.category=category
                       
                      
                  await existingSupplier.save()
                  res.status(200).json({  message: `Category updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}



const deleteCategory = async (req, res) => {
  try {
      const { myId,category } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await Categories.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Category not found!" });
              }
              if (existingSupplier) {
                


                
                  const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()
        const cdwcs= await CDWC.find()
        const cdwocs= await CDWOC.find()
        const employees=await Employees.find()
        const cashInHands=await CashInHand.find()

        for (const cashInHand  of cashInHands){
          if(cashInHand.payment){
            const payments=cashInHand.payment
            for (const payment of payments){
              if(payment.category===existingSupplier.category){
                payment.category=""
              }
            }
            await cdwc.save()
          }
        }
        
        for (const cdwc of cdwcs){
          if(cdwc.payment_In_Schema && cdwc.payment_In_Schema.payment){
            const payments=cdwc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.category===existingSupplier.category){
                payment.category=""
              }
            }
            await cdwc.save()
          }
        }

        for (const cdwoc of cdwocs){
          if(cdwoc.payment_In_Schema && cdwoc.payment_In_Schema.payment){
            const payments=cdwoc.payment_In_Schema.payment
            for (const payment of payments){
              if(payment.category===existingSupplier.category){
                payment.category=""
              }
            }
            await cdwoc.save()
          }
        }
        for (const employee of employees){
          if(employee.payment){
            const payments=employee.payment
            for (const payment of payments){
              if(payment.category===existingSupplier.category){
                payment.category=""
              }
            }
            await employee.save()
          }
        }



        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            const persons=agent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            const persons=agent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            const persons=supplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            const persons=supplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
            const persons=protector.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
            const persons=azadAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
            const persons=azadAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
            const persons=azadSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
            const persons=azadSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
            const persons=ticketAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
            const persons=ticketAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
            const persons=ticketSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
            const persons=ticketSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
            const persons=visitAgent.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
            const persons=visitAgent.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
            const persons=visitSupplier.payment_In_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
            const persons=visitSupplier.payment_Out_Schema.persons
           if(persons){
            for(const person of persons){
              if(person.category===existingSupplier.category){
                person.category=""
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema ){
           
         
              if(candidate.payment_In_Schema.category===existingSupplier.category){
                candidate.payment_In_Schema.category=""
             
              }
          
          }
          

          if(candidate.payment_Out_Schema ){
           
         
            if(candidate.payment_Out_Schema.category===existingSupplier.category){
              candidate.payment_Out_Schema.category=""
           
            }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema ){
           
         
              if(azadCandidate.payment_In_Schema.category===existingSupplier.category){
                azadCandidate.payment_In_Schema.category=""
             
              }
          
          }
          

          if(azadCandidate.payment_Out_Schema ){
           
         
            if(azadCandidate.payment_Out_Schema.category===existingSupplier.company){
              azadCandidate.payment_Out_Schema.category=""
           
            }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema ){
           
         
              if(ticketCandidate.payment_In_Schema.category===existingSupplier.category){
                ticketCandidate.payment_In_Schema.category=""
             
              }
          
          }
          

          if(ticketCandidate.payment_Out_Schema ){
           
         
            if(ticketCandidate.payment_Out_Schema.category===existingSupplier.category){
              ticketCandidate.payment_Out_Schema.category=""
           
            }
        
        }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema ){
           
         
              if(visitCandidate.payment_In_Schema.category===existingSupplier.category){
                visitCandidate.payment_In_Schema.category=""
             
              }
          
          }
          

          if(visitCandidate.payment_Out_Schema ){
           
         
            if(visitCandidate.payment_Out_Schema.category===existingSupplier.category){
              visitCandidate.payment_Out_Schema.category=""
           
            }
        
        }
          await visitCandidate.save()

        }
                       
                      
                const deleteCategory = await Categories.findByIdAndDelete(myId);
                  
                  res.status(200).json({  message: `Category deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}


// getting Categories

const getCategory = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const categories = await Categories.find({})
            res.status(200).json({ data: categories })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}




//18- Expense Categories Controllers

//Adding a New Expense Category

const addExpeCategory = async (req, res) => {
    try {
        const { category } = req.body
        if (!category) {
            return res.status(400).json({ message: "Category Name is required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a expense Category with the same name already exists

                const existingExpeCategory = await ExpenseCategories.findOne({ category });
                if (existingExpeCategory) {
                    return res.status(400).json({ message: "A Expense Category with this Name already exists" });
                }

                if (!existingExpeCategory) {

                    const newExpeCategory = new ExpenseCategories({
                        category
                    })


                    await newExpeCategory.save()
                    res.status(200).json({ data: newExpeCategory, message: `${category} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



const updateExpenseCategory = async (req, res) => {
  try {
      const { myId,category } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await ExpenseCategories.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Expense Category not found!" });
              }
              if (existingSupplier) {
                

                
                  const expenses = await Expenses.find();
     
        for(const expense of expenses){
          if(expense.expCategory ===category){
              expense.expCategory =category
          }
          await expense.save()

        }

                  existingSupplier.category=category
                      
                  await existingSupplier.save()
                  res.status(200).json({  message: `Expense Category updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}



const deleteExpenseCategory = async (req, res) => {
  try {
      const { myId,category } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await ExpenseCategories.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Expense Category not found!" });
              }
              if (existingSupplier) {
                


                
                  const expenses = await Expenses.find();
     
        for(const expense of expenses){
          if(expense.expCategory ===category){
              expense.expCategory =""
          }
          await expense.save()

        }

                const deleteExpCategory = await ExpenseCategories.findById(myId);
                    
                  res.status(200).json({  message: `Expense Category deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}


// getting Expense Categories

const getExpeCategory = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const expenseCategories = await ExpenseCategories.find({})
            res.status(200).json({ data: expenseCategories })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}



//19- Currencies Controllers

//Adding a New Currency

const addCurrency = async (req, res) => {
    try {
        const { currency } = req.body
        if (!currency) {
            return res.status(400).json({ message: "Currency Name is required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {

                // Check if a expense currency with the same name already exists

                const existingCurrency = await Currencies.findOne({ currency });
                if (existingCurrency) {
                    return res.status(400).json({ message: "A Currency with this Name already exists" });
                }

                if (!existingCurrency) {

                    const newCurrency = new Currencies({
                        currency
                    })


                    await newCurrency.save()
                    res.status(200).json({ data: newCurrency, message: `${currency} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const updateCurrency = async (req, res) => {
  try {
      const { myId,currency } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await Currencies.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Currency not found!" });
              }
              if (existingSupplier) {
                

                
                  const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.payment){
            const payments=agent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=currency
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.payment){
            const payments=agent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=currency
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.payment){
            const payments=supplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=currency
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.payment){
            const payments=supplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=currency
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.payment){
            const payments=protector.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=currency
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.payment){
            const payments=azadAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=currency
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.payment){
            const payments=azadAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=currency
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.payment){
            const payments=azadSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=currency
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.payment){
            const payments=azadSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=currency
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.payment){
            const payments=ticketAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=currency
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.payment){
            const payments=ticketAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=currency
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.payment){
            const payments=ticketSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=currency
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.payment){
            const payments=ticketSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=currency
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.payment){
            const payments=visitAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=currency
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.payment){
            const payments=visitAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=currency
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.payment){
            const payments=visitSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=currency
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.payment){
            const payments=visitSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=currency
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema && candidate.payment_In_Schema.payment){
            const payments=candidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_In_Curr===existingSupplier.currency){
                 payment.payment_In_Curr=currency
                
               }
             }
           }
          }
          

          if(candidate.payment_Out_Schema && candidate.payment_Out_Schema.payment){
           
            const payments=candidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Out_Curr===existingSupplier.currency){
                 payment.payment_Out_Curr=currency
                
               }
             }
           }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema && azadCandidate.payment_In_Schema.payment){
           
         
            const payments=azadCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_In_Curr===existingSupplier.currency){
                 payment.payment_In_Curr=currency
                
               }
             }
           }
          
          }
          

          if(azadCandidate.payment_Out_Schema && azadCandidate.payment_Out_Schema.payment){
            const payments=azadCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Out_Curr===existingSupplier.currency){
                 payment.payment_Out_Curr=currency
                
               }
             }
           }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema && ticketCandidate.payment_In_Schema.payment){
            const payments=ticketCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_In_Curr===existingSupplier.currency){
                 payment.payment_In_Curr=currency
                
               }
             }
           }
          
          }
          

          if(ticketCandidate.payment_Out_Schema && ticketCandidate.payment_Out_Schema.payment){
            const payments=ticketCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Out_Curr===existingSupplier.currency){
                 payment.payment_Out_Curr=currency
                
               }
             }
           }
          
          }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_In_Curr===existingSupplier.currency){
                 payment.payment_In_Curr=currency
                
               }
             }
           }
          
          }
          

          if(visitCandidate.payment_Out_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Out_Curr===existingSupplier.currency){
                 payment.payment_Out_Curr=currency
                
               }
             }
           }
        
        }
          await visitCandidate.save()

        }
              
                   
                  existingSupplier.currency=currency
                      
                  await existingSupplier.save()
                  res.status(200).json({  message: `Currency updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}


const deleteCurrency = async (req, res) => {
  try {
      const { myId,currency } = req.body
      if (!myId) {
          return res.status(400).json({ message: "Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await Currencies.findById(myId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Currency not found!" });
              }
              if (existingSupplier) {
                


                
                  const agents = await Agents.find();
        const suppliers = await Suppliers.find()
        const candidates = await Candidates.find()
         const azadAgents = await AzadAgents.find()
        const azadSuppliers = await AzadSuppliers.find()
        const ticketAgents = await TicketAgents.find()
        const ticketSuppliers = await TicketSuppliers.find()
        const visitAgents = await VisitAgents.find()
        const visitSuppliers = await VisitSuppliers.find()
        const azadCandidates = await AzadCandidates.find()
        const ticketCandidates = await TicketCandidates.find()
        const visitCandidates = await VisitCandidates.find()
        const protectors=await Protector.find()

        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.payment){
            const payments=agent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=""
             
              }
            }
          }
          }

          if(agent.payment_Out_Schema && agent.payment_Out_Schema.payment){
            const payments=agent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=""
               
              }
            }
          }
          }
          await agent.save()

        }

        for(const supplier of suppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.payment){
            const payments=supplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=""
             
              }
            }
          }

          }

          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.payment){
            const payments=supplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=""
               
              }
            }
          }
          }
          await supplier.save()

        }


        for(const protector of protectors){
       

          if(protector.payment_Out_Schema && protector.payment_Out_Schema.payment){
            const payments=protector.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=""
               
              }
            }
          }
          }
          await protector.save()

        }

        for(const azadAgent of azadAgents){
          if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.payment){
            const payments=azadAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=""
             
              }
            }
          }
          }

          if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.payment){
            const payments=azadAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=""
               
              }
            }
          }
          }
          await azadAgent.save()

        }

        
        for(const azadSupplier of azadSuppliers){
          if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.payment){
            const payments=azadSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=""
             
              }
            }
          }
          }

          if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.payment){
            const payments=azadSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=""
               
              }
            }
          }
          }
          await azadSupplier.save()

        }

        
        for(const ticketAgent of ticketAgents){
          if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.payment){
            const payments=ticketAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=""
             
              }
            }
          }
          }

          if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.payment){
            const payments=ticketAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=""
               
              }
            }
          }
          }
          await ticketAgent.save()

        }

        
        for(const ticketSupplier of ticketSuppliers){
          if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.payment){
            const payments=ticketSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=""
             
              }
            }
          }
          }

          if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.payment){
            const payments=ticketSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=""
               
              }
            }
          }
          }
          await ticketSupplier.save()

        }
          
        for(const visitAgent of visitAgents){
          if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.payment){
            const payments=visitAgent.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=""
             
              }
            }
          }
          }

          if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.payment){
            const payments=visitAgent.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=""
               
              }
            }
          }
          }
          await visitAgent.save()

        }

        
        for(const visitSupplier of visitSuppliers){
          if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.payment){
            const payments=visitSupplier.payment_In_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_In_Curr===existingSupplier.currency){
                payment.payment_In_Curr=""
             
              }
            }
          }
          }

          if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.payment){
            const payments=visitSupplier.payment_Out_Schema.payment
           if(payments){
            for(const payment of payments){
              if(payment.payment_Out_Curr===existingSupplier.currency){
                payment.payment_Out_Curr=""
               
              }
            }
          }
          }
          await visitSupplier.save()

        }

        for(const candidate of candidates){
          if(candidate.payment_In_Schema && candidate.payment_In_Schema.payment){
            const payments=candidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_In_Curr===existingSupplier.currency){
                 payment.payment_In_Curr=""
                
               }
             }
           }
          }
          

          if(candidate.payment_Out_Schema && candidate.payment_Out_Schema.payment){
           
            const payments=candidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Out_Curr===existingSupplier.currency){
                 payment.payment_Out_Curr=""
                
               }
             }
           }
        }
          await candidate.save()

        }

        for(const azadCandidate of azadCandidates){
          if(azadCandidate.payment_In_Schema && azadCandidate.payment_In_Schema.payment){
           
         
            const payments=azadCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_In_Curr===existingSupplier.currency){
                 payment.payment_In_Curr=""
                
               }
             }
           }
          
          }
          

          if(azadCandidate.payment_Out_Schema && azadCandidate.payment_Out_Schema.payment){
            const payments=azadCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Out_Curr===existingSupplier.currency){
                 payment.payment_Out_Curr=""
                
               }
             }
           }
        
        }
          await azadCandidate.save()

        }

        for(const ticketCandidate of ticketCandidates){
          if(ticketCandidate.payment_In_Schema && ticketCandidate.payment_In_Schema.payment){
            const payments=ticketCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_In_Curr===existingSupplier.currency){
                 payment.payment_In_Curr=""
                
               }
             }
           }
          
          }
          

          if(ticketCandidate.payment_Out_Schema && ticketCandidate.payment_Out_Schema.payment){
            const payments=ticketCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Out_Curr===existingSupplier.currency){
                 payment.payment_Out_Curr=""
                
               }
             }
           }
          
          }
          await ticketCandidate.save()

        }

        for(const visitCandidate of visitCandidates){
          if(visitCandidate.payment_In_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_In_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_In_Curr===existingSupplier.currency){
                 payment.payment_In_Curr=""
                
               }
             }
           }
          
          }
          

          if(visitCandidate.payment_Out_Schema && visitCandidate.payment_Out_Schema.payment){
            const payments=visitCandidate.payment_Out_Schema.payment
            if(payments){
             for(const payment of payments){
               if(payment.payment_Out_Curr===existingSupplier.currency){
                 payment.payment_Out_Curr=""
                
               }
             }
           }
        
        }
          await visitCandidate.save()

        }
              
                   
        const deleteCurrency = await Currencies.findByIdAndDelete(myId);
              
                  res.status(200).json({  message: `Currency deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}

// getting Currencies

const getCurrency = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const currencies = await Currencies.find({})
            res.status(200).json({ data: currencies })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

// 20- Crediter Purchase Parties Controllers

//Adding a New Crediter Purchase Party 

const addCPP = async (req, res) => {
    try {
        const { supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierName) {
            return res.status(400).json({ message: "Supplier Name is required" })
        }
      
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }


            if (user.role === "Admin") {

                // Check if a Supplier with the same name already exists

                const existingSupplier = await CPP.findOne({ supplierName });
                if (existingSupplier) {
                    return res.status(400).json({ message: "A Supplier with this Name already exists" });
                }

                if (!existingSupplier) {

                  let uploadImage 
                  if(picture){
                     // uploading picture to cloudinary
                    uploadImage = await cloudinary.uploader.upload(picture, {
                      upload_preset: 'rozgar'
                  })
                  }

                    const newSupplier = new CPP({
                        supplierName,
                        supplierCompany,
                        country,
                        contact,
                        address,

                        picture: uploadImage?.secure_url || ""
                    })

                    await newSupplier.save()
                    res.status(200).json({ data: newSupplier, message: `${supplierName} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const updateCPP = async (req, res) => {
  try {
      const { supplierId,supplierName, supplierCompany, country, contact, address, picture } = req.body
      if (!supplierId) {
          return res.status(400).json({ message: "Supplier Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await CPP.findById(supplierId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Supplier not found!" });
              }
              if (existingSupplier) {
                  
                    const cdwc=await CDWC.findOne({
                      "payment_In_Schema.supplierName": existingSupplier.supplierName,
                    })
                    if(cdwc){
                      cdwc.payment_In_Schema.supplierName=supplierName
                      await cdwc.save()
                    }

                    const cdwoc=await CDWOC.findOne({
                      "payment_In_Schema.supplierName": existingSupplier.supplierName,
                    })
                    if(cdwoc){
                      cdwoc.payment_In_Schema.supplierName=supplierName
                      await cdwoc.save()
                    }

                    let uploadImage
                    if(picture && !picture.startsWith("https://res.cloudinary.com")){
                        // uploading picture to cloudinary
                         uploadImage = await cloudinary.uploader.upload(picture, {
                            upload_preset: 'rozgar'
                        })
                    }
                    existingSupplier.supplierName=supplierName
                    existingSupplier.supplierCompany=supplierCompany
                    existingSupplier.country=country
                    existingSupplier.contact=contact
                    existingSupplier.address=address
                    if (picture && uploadImage) {
                        existingSupplier.picture = uploadImage.secure_url;
                      }      
  
                  await existingSupplier.save()
                  res.status(200).json({  message: `Supplier updated successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}


const deleteCPP = async (req, res) => {
  try {
      const { supplierId } = req.body
      if (!supplierId) {
          return res.status(400).json({ message: "Supplier Id is required" })
      }
     
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }

          if (user.role === "Admin") {
              // Check if a Supplier with the same name already exists

              const existingSupplier = await CPP.findById(supplierId);
              if (!existingSupplier) {
                  return res.status(400).json({ message: "Supplier not found!" });
              }
              if (existingSupplier) {
                    const cdwc=await CDWC.findOne({
                      "payment_In_Schema.supplierName": existingSupplier.supplierName,
                    })
                    if(cdwc){
                      cdwc.payment_In_Schema=null
                      await cdwc.save()
                    }

                    const cdwoc=await CDWOC.findOne({
                      "payment_In_Schema.supplierName": existingSupplier.supplierName,
                    })
                    if(cdwoc){
                      cdwoc.payment_In_Schema=null
                      await cdwoc.save()
                    }

                const deleteSupplier=await CPP.findByIdAndDelete(supplierId)

                  res.status(200).json({  message: `Supplier deleted successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}

// getting Crediter Purchase Parties

const getCPP = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const crediterPurchaseParties = await CPP.find({})
            res.status(200).json({ data: crediterPurchaseParties })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

// 21- Protector Parties Controllers

//Adding a New Protector Party 

const addProtector = async (req, res) => {
    try {
        const { supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierName) {
            return res.status(400).json({ message: "Supplier Name is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }


            if (user.role === "Admin") {

                // Check if a Supplier with the same name already exists

                const existingSupplier = await ProtectorParties.findOne({ supplierName });
                if (existingSupplier) {
                    return res.status(400).json({ message: "A Supplier with this Name already exists" });
                }

                if (!existingSupplier) {

                  let uploadImage 
                  if(picture){
                     // uploading picture to cloudinary
                    uploadImage = await cloudinary.uploader.upload(picture, {
                      upload_preset: 'rozgar'
                  })
                  }

                    const newSupplier = new ProtectorParties({
                        supplierName,
                        supplierCompany,
                        country,
                        contact,
                        address,
                        picture: uploadImage?.secure_url || ""
                    })

                    await newSupplier.save()
                    res.status(200).json({ data: newSupplier, message: `${supplierName} added successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// updating Visa Sales Parties

const updateProtector = async (req, res) => {
    try {
        const { supplierId,supplierName, supplierCompany, country, contact, address, picture } = req.body
        if (!supplierId) {
            return res.status(400).json({ message: "Supplier Id is required" })
        }
       
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {
            // Checking User Role 
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }

            if (user.role === "Admin") {
                // Check if a Supplier with the same name already exists

                const existingSupplier = await ProtectorParties.findById(supplierId);
                if (!existingSupplier) {
                    return res.status(400).json({ message: "Protector Supplier not found!" });
                }
                if (existingSupplier) {
                  
                    //   Updating Protectors
                    
                      const existingProtectorOut = await Protector.findOne({
                        "payment_Out_Schema.supplierName": existingSupplier.supplierName,
                      });
                      if(existingProtectorOut){
                        existingProtectorOut.payment_Out_Schema.supplierName=supplierName
                        await existingProtectorOut.save()
                      }

                     
                          // Updating Enteries
                       const entries=await Entries.find()
                      
                       for(const entry of entries){
                        if(entry.protector_Reference_In_Name===existingSupplier.supplierName){
                          entry.protector_Reference_In_Name=supplierName
                        }
                        await entry.save()
                       }

                       let uploadImage
                       if(picture && !picture.startsWith("https://res.cloudinary.com")){
                           // uploading picture to cloudinary
                            uploadImage = await cloudinary.uploader.upload(picture, {
                               upload_preset: 'rozgar'
                           })
                       }
                       existingSupplier.supplierName=supplierName
                       existingSupplier.supplierCompany=supplierCompany
                       existingSupplier.country=country
                       existingSupplier.contact=contact
                       existingSupplier.address=address
                       if (picture && uploadImage) {
                           existingSupplier.picture = uploadImage.secure_url;
                         }
   
   
                    await existingSupplier.save()
                    res.status(200).json({  message: `Protector Supplier updated successfully` })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// updating Visa Sales Parties

const deleteProtector = async (req, res) => {
  try {
    const { supplierId } = req.body
    if (!supplierId) {
      return res.status(400).json({ message: "Protector Id is required" })
    }

    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    if (user) {
      // Checking User Role 
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" })
      }

      if (user.role === "Admin") {
        // Check if a Supplier with the same name already exists

        const existingSupplier = await ProtectorParties.findById(supplierId);
        if (!existingSupplier) {
          return res.status(400).json({ message: "Protector not found!" });
        }
        if (existingSupplier) {

          //   Updating Agents
          const existingAgentIn = await Protector.findOne({
            "payment_Out_Schema.supplierName": existingSupplier.supplierName,
          });
          if (existingAgentIn) {

            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
              $inc: {}
            };


            cashInHandUpdate.$inc.total_Cash = -existingAgentIn.payment_In_Schema.total_Payment_In

            await CashInHand.updateOne({}, cashInHandUpdate);

            existingAgentIn.payment_Out_Schema = null
            await existingAgentIn.save()
          }


          const entries=await Entries.find()
                      
                       for(const entry of entries){
                        if(entry.protector_Reference_In_Name===existingSupplier.supplierName){
                          entry.protector_Reference_In_Name=""
                        }
                        await entry.save()
                       }

          const deleteSupplier = await ProtectorParties.findByIdAndDelete(supplierId);

          res.status(200).json({ message: `Protector deleted successfully` })
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// getting Protector Parties

const getProtector = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user) {

            const crediterPurchaseParties = await ProtectorParties.find({})
            res.status(200).json({ data: crediterPurchaseParties })

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


// 23- Assets Controllers

//Adding a New Assets 

const addAssets = async (req, res) => {
  try {
      const { assetName, picture } = req.body
      console.log(assetName)
      if (!assetName) {
          return res.status(400).json({ message: "Asset Name is required" })
      }
      // if (!supplierCompany) {
      //     return res.status(400).json({ message: "Supplier Company is required" })
      // }
      // if (!country) {
      //     return res.status(400).json({ message: "Country Name is required" })
      // }
      // if (!contact) {
      //     return res.status(400).json({ message: "Contact Number is required" })
      // }
      // if (!address) {
      //     return res.status(400).json({ message: "Address is required" })
      // }
      // if (!picture) {
      //     return res.status(400).json({ message: "Supplier Picture required" })
      // }
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {
          // Checking User Role 
          if (user.role !== "Admin") {
              res.status(404).json({ message: "Only Admin is allowed!" })
          }


          if (user.role === "Admin") {

              // Check if a Supplier with the same name already exists

              const existingSupplier = await MyAssets.findOne({ assetName });
              if (existingSupplier) {
                  return res.status(400).json({ message: "An Asset with this Name already exists" });
              }

              if (!existingSupplier) {

                let uploadImage 
                if(picture){
                   // uploading picture to cloudinary
                  uploadImage = await cloudinary.uploader.upload(picture, {
                    upload_preset: 'rozgar'
                })
                }

                  const newAsset = new MyAssets({
                       assetName,
                      // supplierCompany,
                      // country,
                      // contact,
                      // address,
                      picture: uploadImage?.secure_url || ""
                  })
                  await newAsset.save()
                  res.status(200).json({  message: `New Asset: ${assetName} added successfully` })
              }
          }
      }
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
}


const updateAssets = async (req, res) => {
try {
    const { assetId,assetName, picture } = req.body
    if (!assetId) {
        return res.status(400).json({ message: "Asset Id is required" })
    }
   
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
        res.status(404).json({ message: "User not found" })
    }

    if (user) {
        // Checking User Role 
        if (user.role !== "Admin") {
            res.status(404).json({ message: "Only Admin is allowed!" })
        }

        if (user.role === "Admin") {
            // Check if a Supplier with the same name already exists

            const existingSupplier = await MyAssets.findById(assetId);
            if (!existingSupplier) {
                return res.status(400).json({ message: "Asset not found!" });
            }
            if (existingSupplier) {
                
                  const asset=await Assets.findOne({
                    "payment_In_Schema.assetName": existingSupplier.supplierName,
                  })
                  if(asset){
                    asset.payment_In_Schema.assetName=assetName
                    await asset.save()
                  }

                  let uploadImage
                  if(picture && !picture.startsWith("https://res.cloudinary.com")){
                      // uploading picture to cloudinary
                       uploadImage = await cloudinary.uploader.upload(picture, {
                          upload_preset: 'rozgar'
                      })
                  }
                  existingSupplier.assetName=assetName
                  // existingSupplier.supplierCompany=supplierCompany
                  // existingSupplier.country=country
                  // existingSupplier.contact=contact
                  // existingSupplier.address=address
                  if (picture && uploadImage) {
                      existingSupplier.picture = uploadImage.secure_url;
                    }      

                await existingSupplier.save()
                res.status(200).json({  message: `Asset updated successfully` })
            }
        }
    }
} catch (error) {
    res.status(500).json({ message: error.message })
}
}


const deleteAssets = async (req, res) => {
try {
    const { assetId } = req.body
    if (!assetId) {
        return res.status(400).json({ message: "Asset Id is required" })
    }
   
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
        res.status(404).json({ message: "User not found" })
    }

    if (user) {
        // Checking User Role 
        if (user.role !== "Admin") {
            res.status(404).json({ message: "Only Admin is allowed!" })
        }

        if (user.role === "Admin") {
            // Check if a Supplier with the same name already exists

            const existingSupplier = await MyAssets.findById(assetId);
            if (!existingSupplier) {
                return res.status(400).json({ message: "Asset not found!" });
            }
            if (existingSupplier) {
                  const asset=await Assets.findOne({
                    "payment_In_Schema.assetName": existingSupplier.assetName,
                  })
                  if(asset){
                    asset.payment_In_Schema=null
                    await asset.save()
                  }
                const deleteAsset=await MyAssets.findByIdAndDelete(assetId)

                res.status(200).json({  message: `Asset deleted successfully` })
            }
        }
    }
} catch (error) {
    res.status(500).json({ message: error.message })
}
}

// getting Crediter Purchase Parties

const getAssets = async (req, res) => {
  try {
      const userId = req.user._id

      const user = await User.findById(userId)
      if (!user) {
          res.status(404).json({ message: "User not found" })
      }

      if (user) {

          const assets = await MyAssets.find({})
          res.status(200).json({ data: assets })

      }

  } catch (error) {
      res.status(500).json({ message: error.message })

  }
}


module.exports = {addVSP,updateVSP,deleteVSP, getVSP, addVPP,updateVPP,deleteVPP, getVPP, addTSP,updateTSP,deleteTSP, getTSP, addTPP,updateTPP,deleteTPP, getTPP, addAVSP,updateAVSP,deleteAVSP, getAVSP, addAVPP,updateAVPP,deleteAVPP, getAVPP, addVISP,updateVISP,deleteVISP, getVISP, addVIPP,updateVIPP,deleteVIPP, getVIPP, addCompany,updateCompany,deleteCompany, getCompany, addTrade,updateTrade,deleteTrade, getTrade, addCurrCountry,updateCurrCountry,deleteCurrCountry, getCurrCountry, addPaymentVia,updatePaymentVia,deletePaymentVia, getPaymentVia, addPaymentType,updatePaymentType,deletePaymentType, getPaymentType, addEntryMode,updateEntryMode,deleteEntryMode, getEntryMode, addFinalStatus,updateFinalStatus,deleteFinalStatus, getFinalStatus, addCountry,updateCountry,deleteCountry, getCountry, addCategory,updateCategory,deleteCategory, getCategory, addExpeCategory,updateExpenseCategory,deleteExpenseCategory, getExpeCategory, addCurrency,updateCurrency,deleteCurrency, getCurrency, addCPP,updateCPP,deleteCPP, getCPP,addProtector,updateProtector,deleteProtector,getProtector,addAssets,updateAssets,deleteAssets,getAssets }