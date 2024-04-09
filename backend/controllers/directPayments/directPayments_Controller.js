const cloudinary = require("../cloudinary");
const User = require("../../database/userdb/UserSchema");
const Suppliers = require("../../database/suppliers/SupplierSchema");
const Agents = require("../../database/agents/AgentSchema");
const Candidate = require("../../database/candidate/CandidateSchema");
const AzadSuppliers = require("../../database/azadSuppliers/AzadSupplierSchema");
const AzadCandidate = require("../../database/azadCandidates/AzadCandidateSchema");
const TicketSuppliers = require("../../database/ticketSuppliers/TicketSupplierSchema");
const TicketCandidate = require("../../database/ticketCandidates/TicketCandidateSchema");
const VisitSuppliers = require("../../database/visitSuppliers/VisitSupplierSchema");
const VisitCandidate = require("../../database/visitCandidates/VisitCandidateSchema");
const Protector = require("../../database/protector/ProtectorSchema");
const Entries = require("../../database/enteries/EntrySchema");
const Backup=require('../../database/backup/BackupModel.js')
const Notifications=require('../../database/notifications/NotifyModel.js')
const InvoiceNumber = require("../../database/invoiceNumber/InvoiceNumberSchema");
const CashInHand = require("../../database/cashInHand/CashInHandSchema");
const mongoose = require("mongoose");
const moment = require("moment");

// Payment In
const directPaymentIn=async(req,res)=>{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    
    const {
        ref,
        supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No,
        payment_In,
        slip_Pic,
        details,
        curr_Country,
        curr_Rate,
        curr_Amount,
        date,
        cand_Name,
      } = req.body;
      const newPaymentIn = parseInt(payment_In, 10);
      const newCurrAmount = parseInt(curr_Amount, 10);

      if(ref.toLowerCase()==="agent" || ref.toLowerCase()==="agent cand-vise"){

    const existingSupplier = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Supplier not Found",
      });
      return;
    }

    let nextInvoiceNumber = 0;
    const currentInvoiceNumber = await InvoiceNumber.findOne({});

    if (!currentInvoiceNumber) {
      const newInvoiceNumberDoc = new InvoiceNumber();
      await newInvoiceNumberDoc.save();
    }

    const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
      {},
      { $inc: { invoice_Number: 1 } },
      { new: true, upsert: true }
    );

    if (updatedInvoiceNumber) {
      nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
    }
    let uploadImage;
    if (slip_Pic) {
      uploadImage = await cloudinary.uploader.upload(slip_Pic, {
        upload_preset: "rozgar",
      });
    }
    const payment = {
      name: supplierName,
      category,
      payment_Via,
      payment_Type,
      slip_No: slip_No ? slip_No : '',
      payment_In: newPaymentIn,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      payment_In_Curr: curr_Country ? curr_Country : "",
      curr_Rate: curr_Rate ? curr_Rate : 0,
      curr_Amount: newCurrAmount ? newCurrAmount : 0,
      date,
      invoice: nextInvoiceNumber,
      cand_Name,
    }
    const myPayment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_In: newPaymentIn,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_In_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber,
        
      }
    try {
        if (cand_Name) {
          // If cand_Name is provided, find the corresponding person in the persons array and update it
          const existPerson = existingSupplier.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
          if (existPerson) {
            existPerson.remaining_Price += -payment_In,
            existPerson.total_In += payment_In,
            existPerson.remaining_Curr += newCurrAmount ? -newCurrAmount : 0
  
          }
  
          await existingSupplier.updateOne({
            $inc: {
              "payment_In_Schema.total_Payment_In": payment_In,
              "payment_In_Schema.remaining_Balance": -payment_In,
              "payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,
              "payment_In_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
  
            },
            $push: {
              "payment_In_Schema.payment": payment,
            },
          })
  
  
  
          const cashInHandDoc = await CashInHand.findOne({})
  
          if (!cashInHandDoc) {
            const newCashInHandDoc = new CashInHand();
            await newCashInHandDoc.save();
          }
  
          const cashInHandUpdate = {
            $inc: {},
          };
  
           if (payment_Via.toLowerCase() === "cash" ) {
            cashInHandUpdate.$inc.cash = newPaymentIn;
            cashInHandUpdate.$inc.total_Cash = newPaymentIn;
          }
          else{
            cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
            cashInHandUpdate.$inc.total_Cash = newPaymentIn;
          }
  
          await CashInHand.updateOne({}, cashInHandUpdate);
        const newBackup=new Backup({
        name: supplierName,
        category:category,
        payment_Via:payment_Via,
        payment_Type:payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_In: newPaymentIn,
        slip_Pic: uploadImage?.secure_url || '',
        details:details,
        payment_In_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date:new Date().toISOString().split("T")[0],
        invoice: nextInvoiceNumber,
        cand_Name:cand_Name,
          })
          await newBackup.save()
  
          const newNotification=new Notifications({
            type:"Agent Payment In",
            content:`${user.userName} added Payment_In: ${payment_In} to Candidate: ${cand_Name} of Agent: ${supplierName}`,
            date: new Date().toISOString().split("T")[0]
  
          })
          await newNotification.save()
  
          await existingSupplier.save();
          const updatedSupplier = await Agents.findById(existingSupplier._id);
          res.status(200).json({
            message: `Payment In: ${payment_In} added Successfully to Agent: ${supplierName}'s Record`,
          })
  
  
        }
  
        else {
  
          await existingSupplier.updateOne({
            $inc: {
              "payment_In_Schema.total_Payment_In": payment_In,
              "payment_In_Schema.remaining_Balance": -payment_In,
              "payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,
              "payment_In_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
  
            },
            $push: {
              "payment_In_Schema.payment": myPayment,
            },
          })
  
  
  
          const cashInHandDoc = await CashInHand.findOne({})
  
          if (!cashInHandDoc) {
            const newCashInHandDoc = new CashInHand();
            await newCashInHandDoc.save();
          }
  
          const cashInHandUpdate = {
            $inc: {},
          };
  
          if (payment_Via.toLowerCase() === "cash") {
            cashInHandUpdate.$inc.cash = newPaymentIn;
            cashInHandUpdate.$inc.total_Cash = newPaymentIn;
          }
          else{
            cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
            cashInHandUpdate.$inc.total_Cash = newPaymentIn;
          }
          await CashInHand.updateOne({}, cashInHandUpdate);
  
          const newBackup=new Backup({
            name: supplierName,
            category:category,
            payment_Via:payment_Via,
            payment_Type:payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_In: newPaymentIn,
            slip_Pic: uploadImage?.secure_url || '',
            details:details,
            payment_In_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date:new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
              })
              await newBackup.save()
  
          await existingSupplier.save()
  
          const newNotification=new Notifications({
            type:"Agent Payment In",
            content:`${user.userName} added Payment_In: ${payment_In} of Agent: ${supplierName}`,
            date: new Date().toISOString().split("T")[0]
  
          })
          await newNotification.save()
          res.status(200).json({
            message: `Payment In: ${payment_In} added Successfully to Agent :${supplierName}'s Record`,
          })
        }
  
      } catch (error) {
        console.error("Error updating values:", error);
        res.status(500).json({
          message: "Error updating values",
          error: error.message,
        });
      }

      }

    //   For Suppliers
      if(ref.toLowerCase()==="supplier" || ref.toLowerCase()==="supplier cand-vise"){
        const existingSupplier = await Suppliers.findOne({
            "payment_In_Schema.supplierName": supplierName,
          });
      
          if (!existingSupplier) {
            res.status(404).json({
              message: "Supplier not Found",
            });
            return;
          }
      
          let nextInvoiceNumber = 0;
          const currentInvoiceNumber = await InvoiceNumber.findOne({});
      
          if (!currentInvoiceNumber) {
            const newInvoiceNumberDoc = new InvoiceNumber();
            await newInvoiceNumberDoc.save();
          }
      
          const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
            {},
            { $inc: { invoice_Number: 1 } },
            { new: true, upsert: true }
          );
      
          if (updatedInvoiceNumber) {
            nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
          }
          let uploadImage;
          if (slip_Pic) {
            uploadImage = await cloudinary.uploader.upload(slip_Pic, {
              upload_preset: "rozgar",
            });
          }
      
      
          const payment = {
            name: supplierName,
            category,
            payment_Via,
            payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_In: newPaymentIn,
            slip_Pic: uploadImage?.secure_url || '',
            details,
            payment_In_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date,
            invoice: nextInvoiceNumber,
            cand_Name,
          };
          const myPayment = {
            name: supplierName,
            category,
            payment_Via,
            payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_In: newPaymentIn,
            slip_Pic: uploadImage?.secure_url || '',
            details,
            payment_In_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date,
            invoice: nextInvoiceNumber,
            
          }

          try {
            if (cand_Name) {
              // If cand_Name is provided, find the corresponding person in the persons array and update it
              const existPerson = existingSupplier.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
              if (existPerson) {
                existPerson.remaining_Price += -payment_In,
                existPerson.total_In += payment_In,
                existPerson.remaining_Curr += newCurrAmount ? -newCurrAmount : 0
      
              }
      
              await existingSupplier.updateOne({
                $inc: {
                  "payment_In_Schema.total_Payment_In": payment_In,
                  "payment_In_Schema.remaining_Balance": -payment_In,
                  "payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,
                  "payment_In_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
      
                },
         
                $push: {
                  "payment_In_Schema.payment": payment,
                },
              })
      
      
      
              const cashInHandDoc = await CashInHand.findOne({})
      
              if (!cashInHandDoc) {
                const newCashInHandDoc = new CashInHand();
                await newCashInHandDoc.save();
              }
      
              const cashInHandUpdate = {
                $inc: {},
              };
      
               if (payment_Via.toLowerCase() === "cash" ) {
                cashInHandUpdate.$inc.cash = newPaymentIn;
                cashInHandUpdate.$inc.total_Cash = newPaymentIn;
              }
              else{
                cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
                cashInHandUpdate.$inc.total_Cash = newPaymentIn;
              }
      
              await CashInHand.updateOne({}, cashInHandUpdate);
      
              const newBackup=new Backup({
                name: supplierName,
                category:category,
                payment_Via:payment_Via,
                payment_Type:payment_Type,
                slip_No: slip_No ? slip_No : '',
                payment_In: newPaymentIn,
                slip_Pic: uploadImage?.secure_url || '',
                details:details,
                payment_In_Curr: curr_Country ? curr_Country : "",
                curr_Rate: curr_Rate ? curr_Rate : 0,
                curr_Amount: newCurrAmount ? newCurrAmount : 0,
                date:new Date().toISOString().split("T")[0],
                invoice: nextInvoiceNumber,
                cand_Name,
                  })
                  await newBackup.save()
              await existingSupplier.save();
              const newNotification=new Notifications({
                type:"Supplier Payment In",
                content:`${user.userName} added Payment_In: ${payment_In} to Candidate: ${cand_Name} of Supplier: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()
              const updatedSupplier = await Suppliers.findById(existingSupplier._id);
              res.status(200).json({
                message: `Payment In: ${payment_In} added Successfully to Supplier: ${supplierName}'s Record`,
              })
      
      
            }
      
            else {
      
              await existingSupplier.updateOne({
                $inc: {
                  "payment_In_Schema.total_Payment_In": payment_In,
                  "payment_In_Schema.remaining_Balance": -payment_In,
                  "payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,
                  "payment_In_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
      
                },
      
                $push: {
                  "payment_In_Schema.payment": myPayment,
                },
              })
      
      
      
              const cashInHandDoc = await CashInHand.findOne({})
      
              if (!cashInHandDoc) {
                const newCashInHandDoc = new CashInHand();
                await newCashInHandDoc.save();
              }
      
              const cashInHandUpdate = {
                $inc: {},
              };
      
              if (payment_Via.toLowerCase() === "cash"|| payment_Via === "cash") {
                cashInHandUpdate.$inc.cash = newPaymentIn;
                cashInHandUpdate.$inc.total_Cash = newPaymentIn;
              }
              else{
                cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
                cashInHandUpdate.$inc.total_Cash = newPaymentIn;
              }
              await CashInHand.updateOne({}, cashInHandUpdate);
      
              const newBackup=new Backup({
                name: supplierName,
                category:category,
                payment_Via:payment_Via,
                payment_Type:payment_Type,
                slip_No: slip_No ? slip_No : '',
                payment_In: newPaymentIn,
                slip_Pic: uploadImage?.secure_url || '',
                details:details,
                payment_In_Curr: curr_Country ? curr_Country : "",
                curr_Rate: curr_Rate ? curr_Rate : 0,
                curr_Amount: newCurrAmount ? newCurrAmount : 0,
                date:new Date().toISOString().split("T")[0],
                invoice: nextInvoiceNumber,
             
                  })
                  await newBackup.save()
              await existingSupplier.save();
      
              const newNotification=new Notifications({
                type:"Supplier Payment In",
                content:`${user.userName} added Payment_In: ${payment_In} of Supplier: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()
            
              res.status(200).json({
                message: `Payment In: ${payment_In} added Successfully to Supplier: ${supplierName}'s Record`,
              })
            }
      
          } catch (error) {
            console.error("Error updating values:", error);
            res.status(500).json({
              message: "Error updating values",
              error: error.message,
            });
          }
      }

    //   For Candidates

    if(ref.toLowerCase()==="candidate"){
        const candidates=await Candidate.find({})
        let existingSupplier
        for (const candidate of candidates){
            if(candidate.payment_In_Schema){
              if(candidate.payment_In_Schema.supplierName.toLowerCase()===supplierName.toLowerCase()){
                existingSupplier = candidate;
                break
              }
            }
           }
            
            if (!existingSupplier) {
                res.status(404).json({
                    message: `${supplierName} not Found`
                });
            }


            let nextInvoiceNumber = 0;

            // Check if InvoiceNumber document exists
            const currentInvoiceNumber = await InvoiceNumber.findOne({});

            if (!currentInvoiceNumber) {
                // If not, create a new one
                const newInvoiceNumberDoc = new InvoiceNumber();
                await newInvoiceNumberDoc.save();
            }

            // Get the updated invoice number
            const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
                {},
                { $inc: { invoice_Number: 1 } },
                { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
            );

            if (updatedInvoiceNumber) {
                nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
            }

            let uploadImage;
            if (slip_Pic) {
                uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                    upload_preset: "rozgar",
                });
            }
            const payment = {
                name: supplierName,
                category,
                payment_Via,
                payment_Type,
                slip_No: slip_No ? slip_No : '',
                payment_In: newPaymentIn,
                slip_Pic: uploadImage?.secure_url || '',
                details,
                payment_In_Curr: curr_Country ? curr_Country : "",
                curr_Rate: curr_Rate ? curr_Rate : 0,
                curr_Amount: newCurrAmount ? newCurrAmount : 0,
                date,
                invoice: nextInvoiceNumber,
            };
            try {

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingSupplier.updateOne({
                    $inc: {
                        'payment_In_Schema.total_Payment_In': payment_In,
                        'payment_In_Schema.remaining_Balance': -payment_In,
                        "payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,
                        "payment_In_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
                    },
                    $set: {
                        
                        "payment_In_Schema.status": close?"Closed":"Open"
                    },
                    $push: {
                        'payment_In_Schema.payment': payment
                    }
                });
                const cashInHandDoc = await CashInHand.findOne({});

                if (!cashInHandDoc) {
                    const newCashInHandDoc = new CashInHand();
                    await newCashInHandDoc.save();
                }

                const cashInHandUpdate = {
                    $inc: {}
                };

                if (payment_Via.toLowerCase() === "cash" ) {
                    cashInHandUpdate.$inc.cash = newPaymentIn;
                    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
                  }
                  else{
                    cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
                    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
                  }

                await CashInHand.updateOne({}, cashInHandUpdate);

                const newBackup=new Backup({
                    name: supplierName,
                    category:category,
                    payment_Via:payment_Via,
                    payment_Type:payment_Type,
                    slip_No: slip_No ? slip_No : '',
                    payment_In: newPaymentIn,
                    slip_Pic: uploadImage?.secure_url || '',
                    details:details,
                    payment_In_Curr: curr_Country ? curr_Country : "",
                    curr_Rate: curr_Rate ? curr_Rate : 0,
                    curr_Amount: newCurrAmount ? newCurrAmount : 0,
                    date:new Date().toISOString().split("T")[0],
                    invoice: nextInvoiceNumber,
                      })
                      await newBackup.save()
                      const newNotification=new Notifications({
                        type:"Candidate Payment In",
                        content:`${user.userName} added Payment_In: ${payment_In} of Candidate: ${supplierName}`,
                        date: new Date().toISOString().split("T")[0]
              
                      })
                      await newNotification.save()
                      await existingSupplier.save()

                res.status(200).json({ message: `Payment In: ${payment_In} added Successfully to Candidate:  ${supplierName}'s Record` });

            } catch (error) {
                console.error('Error updating values:', error);
                res.status(500).json({ message: 'Error updating values', error: error.message });
            }

    }

    // For Ticket Supplier
    if(ref.toLowerCase()==='ticket supplier'){
        const existingSupplier = await TicketSuppliers.findOne({
            'Supplier_Payment_In_Schema.supplierName': supplierName
        });

        if (!existingSupplier) {
            res.status(404).json({
                message: "Supplier not Found"
            });
            return;
        }

        let nextInvoiceNumber = 0;

        const currentInvoiceNumber = await InvoiceNumber.findOne({});

        if (!currentInvoiceNumber) {
            const newInvoiceNumberDoc = new InvoiceNumber();
            await newInvoiceNumberDoc.save();
        }

        const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
            {},
            { $inc: { invoice_Number: 1 } },
            { new: true, upsert: true }
        );

        if (updatedInvoiceNumber) {
            nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
        }

        let uploadImage;
        if (slip_Pic) {
          uploadImage = await cloudinary.uploader.upload(slip_Pic, {
            upload_preset: "rozgar",
          });
        }
        const payment = {
            name: supplierName,
            category,
            payment_Via,
            payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_In: newPaymentIn,
            slip_Pic: uploadImage?.secure_url || '',
            details,
            payment_In_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date,
            invoice: nextInvoiceNumber
        };
        try {
           
            await existingSupplier.updateOne({
                $inc: {
                    'Supplier_Payment_In_Schema.total_Payment_In': payment_In,
                    'Supplier_Payment_In_Schema.remaining_Balance': -payment_In,
                    "Supplier_Payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,

                },
           
                $push: {
                    'Supplier_Payment_In_Schema.payment': payment
                }
            });

      const cashInHandDoc = await CashInHand.findOne({});

      if (!cashInHandDoc) {
        const newCashInHandDoc = new CashInHand();
        await newCashInHandDoc.save();
      }

      const cashInHandUpdate = {
        $inc: {},
      };
      if (payment_Via.toLowerCase() === "cash" ) {
        cashInHandUpdate.$inc.cash = newPaymentIn;
        cashInHandUpdate.$inc.total_Cash = newPaymentIn;
      }
      else{
        cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
        cashInHandUpdate.$inc.total_Cash = newPaymentIn;
      }
      await CashInHand.updateOne({}, cashInHandUpdate);

      const newBackup=new Backup({
        name: supplierName,
        category:category,
        payment_Via:payment_Via,
        payment_Type:payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_In: newPaymentIn,
        slip_Pic: uploadImage?.secure_url || '',
        details:details,
        payment_In_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date:new Date().toISOString().split("T")[0],
        invoice: nextInvoiceNumber,
          })
          await newBackup.save()

      await existingSupplier.save()

      const newNotification=new Notifications({
        type:"Ticket Supplier Payment In",
        content:`${user.userName} added Payment_In: ${payment_In} of Ticket Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0]

      })
      await newNotification.save()
            res.status(200).json({
                
                message: `Payment In: ${payment_In} added Successfully to Ticket Supplier: ${supplierName}'s Record`
            });
        } catch (error) {
            console.error('Error updating values:', error);
            res.status(500).json({
                message: 'Error updating values',
                error: error.message
            });
        }

    }

    // Ticket Agent
    if(ref.toLowerCase()==='ticket agent'){
        const existingSupplier = await TicketSuppliers.findOne({
            'Agent_Payment_In_Schema.supplierName': supplierName
        });

        if (!existingSupplier) {
            res.status(404).json({
                message: "Supplier not Found"
            });
            return;
        }

        let nextInvoiceNumber = 0;

        const currentInvoiceNumber = await InvoiceNumber.findOne({});

        if (!currentInvoiceNumber) {
            const newInvoiceNumberDoc = new InvoiceNumber();
            await newInvoiceNumberDoc.save();
        }

        const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
            {},
            { $inc: { invoice_Number: 1 } },
            { new: true, upsert: true }
        );

        if (updatedInvoiceNumber) {
            nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
        }

        let uploadImage;
        if (slip_Pic) {
          uploadImage = await cloudinary.uploader.upload(slip_Pic, {
            upload_preset: "rozgar",
          });
        }
        const payment = {
            name: supplierName,
            category,
            payment_Via,
            payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_In: newPaymentIn,
            slip_Pic: uploadImage?.secure_url || '',
            details,
            payment_In_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date,
            invoice: nextInvoiceNumber
        };

        try {
           
            await existingSupplier.updateOne({
                $inc: {
                    'Agent_Payment_In_Schema.total_Payment_In': payment_In,
                    'Agent_Payment_In_Schema.remaining_Balance': -payment_In,
                    "Agent_Payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,

                },
              
                $push: {
                    'Agent_Payment_In_Schema.payment': payment
                }
            });

         const cashInHandDoc = await CashInHand.findOne({});

      if (!cashInHandDoc) {
        const newCashInHandDoc = new CashInHand();
        await newCashInHandDoc.save();
      }

      const cashInHandUpdate = {
        $inc: {},
      };

      if (payment_Via.toLowerCase() === "cash" ) {
        cashInHandUpdate.$inc.cash = newPaymentIn;
        cashInHandUpdate.$inc.total_Cash = newPaymentIn;
      }
      else{
        cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
        cashInHandUpdate.$inc.total_Cash = newPaymentIn;
      }

      await CashInHand.updateOne({}, cashInHandUpdate);

           
        const newBackup=new Backup({
          name: supplierName,
          category:category,
          payment_Via:payment_Via,
          payment_Type:payment_Type,
          slip_No: slip_No ? slip_No : '',
          payment_In: newPaymentIn,
          slip_Pic: uploadImage?.secure_url || '',
          details:details,
          payment_In_Curr: curr_Country ? curr_Country : "",
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
       
            })
            await newBackup.save()
        await existingSupplier.save();

        const newNotification=new Notifications({
          type:"Ticket Agent Payment In",
          content:`${user.userName} added Payment_In: ${payment_In} of Ticket Agent: ${supplierName}`,
          date: new Date().toISOString().split("T")[0]

        })
        await newNotification.save()

            res.status(200).json({
                
                message: `Payment In: ${payment_In} added Successfully to ${supplierName}'s Record`
            });
        } catch (error) {
            console.error('Error updating values:', error);
            res.status(500).json({
                message: 'Error updating values',
                error: error.message
            });
        }
    }


    // Ticket Candidate
if(ref.toLowerCase()==='ticket candidate'){
    const existingSupplier = await TicketCandidate.findOne({ 'Candidate_Payment_In_Schema.supplierName': supplierName });
    if (!existingSupplier) {
        res.status(404).json({
            message: "Candidate not Found"
        });
    }


    let nextInvoiceNumber = 0;

    // Check if InvoiceNumber document exists
    const currentInvoiceNumber = await InvoiceNumber.findOne({});

    if (!currentInvoiceNumber) {
        // If not, create a new one
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
    }

    // Get the updated invoice number
    const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
    );

    if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
    }

    let uploadImage;
    if (slip_Pic) {
        uploadImage = await cloudinary.uploader.upload(slip_Pic, {
            upload_preset: "rozgar",
        });
    }
    const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_In: newPaymentIn,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_In_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber,
  
    };
    try {

        // Update total_Visa_Price_In_PKR and other fields using $inc
        await existingSupplier.updateOne({
            $inc: {
                'Candidate_Payment_In_Schema.total_Payment_In': payment_In,
                'Candidate_Payment_In_Schema.remaining_Balance': -payment_In,
                "Candidate_Payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,
                "Candidate_Payment_In_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
            },
            $set: {
               
                "Candidate_Payment_In_Schema.status": close ? "Closed" : "Open"
            },
            $push: {
                'Candidate_Payment_In_Schema.payment': payment
            }
        });
        const cashInHandDoc = await CashInHand.findOne({});

        if (!cashInHandDoc) {
            const newCashInHandDoc = new CashInHand();
            await newCashInHandDoc.save();
        }

        const cashInHandUpdate = {
            $inc: {}
        };

        if (payment_Via.toLowerCase() === "cash" ) {
            cashInHandUpdate.$inc.cash = newPaymentIn;
            cashInHandUpdate.$inc.total_Cash = newPaymentIn;
          }
          else{
            cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
            cashInHandUpdate.$inc.total_Cash = newPaymentIn;
          }

        await CashInHand.updateOne({}, cashInHandUpdate);
        const newBackup=new Backup({
            name: supplierName,
            category:category,
            payment_Via:payment_Via,
            payment_Type:payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_In: newPaymentIn,
            slip_Pic: uploadImage?.secure_url || '',
            details:details,
            payment_In_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date:new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
              })
              await newBackup.save()
              const newNotification=new Notifications({
                type:"Ticket Candidate Payment In",
                content:`${user.userName} added Payment_In: ${payment_In} of Ticket Candidate: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()
        await existingSupplier.save()

        const updatedSupplier = await TicketCandidate.findById(existingSupplier._id);

        res.status(200).json({ data: updatedSupplier, message: `Payment In: ${payment_In} added Successfully to Ticket Candidate: ${supplierName}'s Record` });

    } catch (error) {
        console.error('Error updating values:', error);
        res.status(500).json({ message: 'Error updating values', error: error.message });
    }
}

// Visit Supplier
if(ref.toLowerCase()==='visit supplier'){
    const existingSupplier = await VisitSuppliers.findOne({
        'Supplier_Payment_In_Schema.supplierName': supplierName
    });

    if (!existingSupplier) {
        res.status(404).json({
            message: "Supplier not Found"
        });
        return;
    }

    let nextInvoiceNumber = 0;

    const currentInvoiceNumber = await InvoiceNumber.findOne({});

    if (!currentInvoiceNumber) {
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
    }

    const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true }
    );

    if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
    }

    let uploadImage;
    if (slip_Pic) {
      uploadImage = await cloudinary.uploader.upload(slip_Pic, {
        upload_preset: "rozgar",
      });
    }
    const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_In: newPaymentIn,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_In_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber
    };

    try {
       
        await existingSupplier.updateOne({
            $inc: {
                'Supplier_Payment_In_Schema.total_Payment_In': payment_In,
                'Supplier_Payment_In_Schema.remaining_Balance': -payment_In,
                "Supplier_Payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,

            },
       
            $push: {
                'Supplier_Payment_In_Schema.payment': payment
            }
        });

const cashInHandDoc = await CashInHand.findOne({});

  if (!cashInHandDoc) {
    const newCashInHandDoc = new CashInHand();
    await newCashInHandDoc.save();
  }

  const cashInHandUpdate = {
    $inc: {},
  };
  if (payment_Via.toLowerCase() === "cash" ) {
    cashInHandUpdate.$inc.cash = newPaymentIn;
    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
  }
  else{
    cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
  }
  await CashInHand.updateOne({}, cashInHandUpdate);

  const newBackup=new Backup({
    name: supplierName,
    category:category,
    payment_Via:payment_Via,
    payment_Type:payment_Type,
    slip_No: slip_No ? slip_No : '',
    payment_In: newPaymentIn,
    slip_Pic: uploadImage?.secure_url || '',
    details:details,
    payment_In_Curr: curr_Country ? curr_Country : "",
    curr_Rate: curr_Rate ? curr_Rate : 0,
    curr_Amount: newCurrAmount ? newCurrAmount : 0,
    date:new Date().toISOString().split("T")[0],
    invoice: nextInvoiceNumber,
      })
      await newBackup.save()

  await existingSupplier.save()

  const newNotification=new Notifications({
    type:"Visit Supplier Payment In",
    content:`${user.userName} added Payment_In: ${payment_In} of Visit Supplier: ${supplierName}`,
    date: new Date().toISOString().split("T")[0]

  })
  await newNotification.save()

        const updatedSupplier = await VisitSuppliers.findById(existingSupplier._id);

        res.status(200).json({
            
            message: `Payment In: ${payment_In} added Successfully to Visit Supplier: ${supplierName}'s Record`
        });
    } catch (error) {
        console.error('Error updating values:', error);
        res.status(500).json({
            message: 'Error updating values',
            error: error.message
        });
    }
}

// Visit Agent
if(ref.toLowerCase()==='visit agent'){
    const existingSupplier = await VisitSuppliers.findOne({
        'Agent_Payment_In_Schema.supplierName': supplierName
    });

    if (!existingSupplier) {
        res.status(404).json({
            message: "Supplier not Found"
        });
        return;
    }

    let nextInvoiceNumber = 0;

    const currentInvoiceNumber = await InvoiceNumber.findOne({});

    if (!currentInvoiceNumber) {
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
    }

    const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true }
    );

    if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
    }

    let uploadImage;
    if (slip_Pic) {
      uploadImage = await cloudinary.uploader.upload(slip_Pic, {
        upload_preset: "rozgar",
      });
    }
    const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_In: newPaymentIn,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_In_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber
    };

    try {
       
        await existingSupplier.updateOne({
            $inc: {
                'Agent_Payment_In_Schema.total_Payment_In': payment_In,
                'Agent_Payment_In_Schema.remaining_Balance': -payment_In,
                "Agent_Payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,

            },
          
            $push: {
                'Agent_Payment_In_Schema.payment': payment
            }
        });

     const cashInHandDoc = await CashInHand.findOne({});

  if (!cashInHandDoc) {
    const newCashInHandDoc = new CashInHand();
    await newCashInHandDoc.save();
  }

  const cashInHandUpdate = {
    $inc: {},
  };

  if (payment_Via.toLowerCase() === "cash" ) {
    cashInHandUpdate.$inc.cash = newPaymentIn;
    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
  }
  else{
    cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
  }

  await CashInHand.updateOne({}, cashInHandUpdate);

       
    const newBackup=new Backup({
      name: supplierName,
      category:category,
      payment_Via:payment_Via,
      payment_Type:payment_Type,
      slip_No: slip_No ? slip_No : '',
      payment_In: newPaymentIn,
      slip_Pic: uploadImage?.secure_url || '',
      details:details,
      payment_In_Curr: curr_Country ? curr_Country : "",
      curr_Rate: curr_Rate ? curr_Rate : 0,
      curr_Amount: newCurrAmount ? newCurrAmount : 0,
      date:new Date().toISOString().split("T")[0],
      invoice: nextInvoiceNumber,
   
        })
        await newBackup.save()
    await existingSupplier.save();

    const newNotification=new Notifications({
      type:"Visit Agent Payment In",
      content:`${user.userName} added Payment_In: ${payment_In} of Visit Agent: ${supplierName}`,
      date: new Date().toISOString().split("T")[0]

    })
    await newNotification.save()

        res.status(200).json({
            
            message: `Payment In: ${payment_In} added Successfully to Visit Agent: ${supplierName}'s Record`
        });
    } catch (error) {
        console.error('Error updating values:', error);
        res.status(500).json({
            message: 'Error updating values',
            error: error.message
        });
    }
}

// Visit Candidate
if(ref.toLowerCase()==='visit candidate'){
    const existingSupplier = await VisitCandidate.findOne({ 'Candidate_Payment_In_Schema.supplierName': supplierName });
    if (!existingSupplier) {
        res.status(404).json({
            message: "Candidate not Found"
        });
    }


    let nextInvoiceNumber = 0;

    // Check if InvoiceNumber document exists
    const currentInvoiceNumber = await InvoiceNumber.findOne({});

    if (!currentInvoiceNumber) {
        // If not, create a new one
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
    }

    // Get the updated invoice number
    const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
    );

    if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
    }

    let uploadImage;
    if (slip_Pic) {
        uploadImage = await cloudinary.uploader.upload(slip_Pic, {
            upload_preset: "rozgar",
        });
    }
    const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_In: newPaymentIn,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_In_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber,
       
    };

    try {

        // Update total_Visa_Price_In_PKR and other fields using $inc
        await existingSupplier.updateOne({
            $inc: {
                'Candidate_Payment_In_Schema.total_Payment_In': payment_In,
                'Candidate_Payment_In_Schema.remaining_Balance': -payment_In,
                "Candidate_Payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,
                "Candidate_Payment_In_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
            },
            $set: {
                
                "Candidate_Payment_In_Schema.status": close ? "Closed" : "Open",
            },
            $push: {
                'Candidate_Payment_In_Schema.payment': payment
            }
        });
        const cashInHandDoc = await CashInHand.findOne({});

        if (!cashInHandDoc) {
            const newCashInHandDoc = new CashInHand();
            await newCashInHandDoc.save();
        }

        const cashInHandUpdate = {
            $inc: {}
        };

        if (payment_Via.toLowerCase() === "cash" ) {
            cashInHandUpdate.$inc.cash = newPaymentIn;
            cashInHandUpdate.$inc.total_Cash = newPaymentIn;
          }
          else{
            cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
            cashInHandUpdate.$inc.total_Cash = newPaymentIn;
          }

        await CashInHand.updateOne({}, cashInHandUpdate);
        const newBackup=new Backup({
            name: supplierName,
            category:category,
            payment_Via:payment_Via,
            payment_Type:payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_In: newPaymentIn,
            slip_Pic: uploadImage?.secure_url || '',
            details:details,
            payment_In_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date:new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
              })
              await newBackup.save()
              const newNotification=new Notifications({
                type:"Visit Candidate Payment In",
                content:`${user.userName} added Payment_In: ${payment_In} of Visit Candidate: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()
              await existingSupplier.save()

        const updatedSupplier = await VisitCandidate.findById(existingSupplier._id);

        res.status(200).json({ data: updatedSupplier, message: `Payment In: ${payment_In} added Successfully to Visit Candidate: ${supplierName}'s Record` });

    } catch (error) {
        console.error('Error updating values:', error);
        res.status(500).json({ message: 'Error updating values', error: error.message });
    }
}

// Azad Section
if(ref.toLowerCase()==='azad supplier'){
    const existingSupplier = await AzadSuppliers.findOne({
        'Supplier_Payment_In_Schema.supplierName': supplierName
    });

    if (!existingSupplier) {
        res.status(404).json({
            message: "Supplier not Found"
        });
        return;
    }

    let nextInvoiceNumber = 0;

    const currentInvoiceNumber = await InvoiceNumber.findOne({});

    if (!currentInvoiceNumber) {
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
    }

    const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true }
    );

    if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
    }

    let uploadImage;
    if (slip_Pic) {
      uploadImage = await cloudinary.uploader.upload(slip_Pic, {
        upload_preset: "rozgar",
      });
    }
    const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_In: newPaymentIn,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_In_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber
    };

    try {
       
        await existingSupplier.updateOne({
            $inc: {
                'Supplier_Payment_In_Schema.total_Payment_In': payment_In,
                'Supplier_Payment_In_Schema.remaining_Balance': -payment_In,
                "Supplier_Payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,

            },
       
            $push: {
                'Supplier_Payment_In_Schema.payment': payment
            }
        });

const cashInHandDoc = await CashInHand.findOne({});

  if (!cashInHandDoc) {
    const newCashInHandDoc = new CashInHand();
    await newCashInHandDoc.save();
  }

  const cashInHandUpdate = {
    $inc: {},
  };
  if (payment_Via.toLowerCase() === "cash" ) {
    cashInHandUpdate.$inc.cash = newPaymentIn;
    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
  }
  else{
    cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
  }
  await CashInHand.updateOne({}, cashInHandUpdate);

  const newBackup=new Backup({
    name: supplierName,
    category:category,
    payment_Via:payment_Via,
    payment_Type:payment_Type,
    slip_No: slip_No ? slip_No : '',
    payment_In: newPaymentIn,
    slip_Pic: uploadImage?.secure_url || '',
    details:details,
    payment_In_Curr: curr_Country ? curr_Country : "",
    curr_Rate: curr_Rate ? curr_Rate : 0,
    curr_Amount: newCurrAmount ? newCurrAmount : 0,
    date:new Date().toISOString().split("T")[0],
    invoice: nextInvoiceNumber,
      })
      await newBackup.save()

  await existingSupplier.save()

  const newNotification=new Notifications({
    type:"Azad Supplier Payment In",
    content:`${user.userName} added Payment_In: ${payment_In} of Azad Supplier: ${supplierName}`,
    date: new Date().toISOString().split("T")[0]

  })
  await newNotification.save()

        const updatedSupplier = await AzadSuppliers.findById(existingSupplier._id);

        res.status(200).json({
            
            message: `Payment In: ${payment_In} added Successfully to Azad Supplier: ${supplierName}'s Record`
        });
    } catch (error) {
        console.error('Error updating values:', error);
        res.status(500).json({
            message: 'Error updating values',
            error: error.message
        });
    }
}


// Azad Agent
if(ref.toLowerCase()==='azad agent'){
    const existingSupplier = await AzadSuppliers.findOne({
        'Agent_Payment_In_Schema.supplierName': supplierName
    });

    if (!existingSupplier) {
        res.status(404).json({
            message: "Supplier not Found"
        });
        return;
    }

    let nextInvoiceNumber = 0;

    const currentInvoiceNumber = await InvoiceNumber.findOne({});

    if (!currentInvoiceNumber) {
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
    }

    const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true }
    );

    if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
    }

    let uploadImage;
    if (slip_Pic) {
      uploadImage = await cloudinary.uploader.upload(slip_Pic, {
        upload_preset: "rozgar",
      });
    }
    const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_In: newPaymentIn,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_In_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber
    };

    try {
       
        await existingSupplier.updateOne({
            $inc: {
                'Agent_Payment_In_Schema.total_Payment_In': payment_In,
                'Agent_Payment_In_Schema.remaining_Balance': -payment_In,
                "Agent_Payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,

            },
          
            $push: {
                'Agent_Payment_In_Schema.payment': payment
            }
        });

     const cashInHandDoc = await CashInHand.findOne({});

  if (!cashInHandDoc) {
    const newCashInHandDoc = new CashInHand();
    await newCashInHandDoc.save();
  }

  const cashInHandUpdate = {
    $inc: {},
  };

  if (payment_Via.toLowerCase() === "cash" ) {
    cashInHandUpdate.$inc.cash = newPaymentIn;
    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
  }
  else{
    cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
  }

  await CashInHand.updateOne({}, cashInHandUpdate);

       
    const newBackup=new Backup({
      name: supplierName,
      category:category,
      payment_Via:payment_Via,
      payment_Type:payment_Type,
      slip_No: slip_No ? slip_No : '',
      payment_In: newPaymentIn,
      slip_Pic: uploadImage?.secure_url || '',
      details:details,
      payment_In_Curr: curr_Country ? curr_Country : "",
      curr_Rate: curr_Rate ? curr_Rate : 0,
      curr_Amount: newCurrAmount ? newCurrAmount : 0,
      date:new Date().toISOString().split("T")[0],
      invoice: nextInvoiceNumber,
   
        })
        await newBackup.save()
    await existingSupplier.save();

    const newNotification=new Notifications({
      type:"Azad Agent Payment In",
      content:`${user.userName} added Payment_In: ${payment_In} of Azad Agent: ${supplierName}`,
      date: new Date().toISOString().split("T")[0]

    })
    await newNotification.save()

        res.status(200).json({
            
            message: `Payment In: ${payment_In} added Successfully to Azad Agent: ${supplierName}'s Record`
        });
    } catch (error) {
        console.error('Error updating values:', error);
        res.status(500).json({
            message: 'Error updating values',
            error: error.message
        });
    }
}

// Azad Candidate
if(ref.toLowerCase()==='azad candidate'){
    const existingSupplier = await AzadCandidate.findOne({
        "Candidate_Payment_In_Schema.supplierName": supplierName,
      });
      if (!existingSupplier) {
        res.status(404).json({
          message: "Supplier not Found",
        });
      }

      let nextInvoiceNumber = 0;

      // Check if InvoiceNumber document exists
      const currentInvoiceNumber = await InvoiceNumber.findOne({});

      if (!currentInvoiceNumber) {
        // If not, create a new one
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
      }

      // Get the updated invoice number
      const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
      );

      if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
      }

      let uploadImage;
      if (slip_Pic) {
        uploadImage = await cloudinary.uploader.upload(slip_Pic, {
          upload_preset: "rozgar",
        });
      }
      const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : "",
        payment_In: newPaymentIn,
        slip_Pic: uploadImage?.secure_url || "",
        details,
        payment_In_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber,
      };

      try {
        // Update total_Visa_Price_In_PKR and other fields using $inc
        await existingSupplier.updateOne({
          $inc: {
            "Candidate_Payment_In_Schema.total_Payment_In": payment_In,
            "Candidate_Payment_In_Schema.remaining_Balance": -payment_In,
            "Candidate_Payment_In_Schema.total_Payment_In_Curr": newCurrAmount
              ? newCurrAmount
              : 0,
            "Candidate_Payment_In_Schema.remaining_Curr": newCurrAmount
              ? -newCurrAmount
              : 0,
          },
          $set: {
            "Candidate_Payment_In_Schema.status": close ? "Closed" : "Open",
          },
          $push: {
            "Candidate_Payment_In_Schema.payment": payment,
          },
        });
        const cashInHandDoc = await CashInHand.findOne({});

        if (!cashInHandDoc) {
          const newCashInHandDoc = new CashInHand();
          await newCashInHandDoc.save();
        }

        const cashInHandUpdate = {
          $inc: {},
        };

        if (payment_Via.toLowerCase() === "cash") {
          cashInHandUpdate.$inc.cash = newPaymentIn;
          cashInHandUpdate.$inc.total_Cash = newPaymentIn;
        } else {
          cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
          cashInHandUpdate.$inc.total_Cash = newPaymentIn;
        }

        await CashInHand.updateOne({}, cashInHandUpdate);
        const newBackup=new Backup({
          name: supplierName,
          category:category,
          payment_Via:payment_Via,
          payment_Type:payment_Type,
          slip_No: slip_No ? slip_No : '',
          payment_In: newPaymentIn,
          slip_Pic: uploadImage?.secure_url || '',
          details:details,
          payment_In_Curr: curr_Country ? curr_Country : "",
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
            })
            await newBackup.save()
            const newNotification=new Notifications({
              type:"Azad Candidate Payment In",
              content:`${user.userName} added Payment_In: ${payment_In} of Azad Candidate: ${supplierName}`,
              date: new Date().toISOString().split("T")[0]
    
            })
            await newNotification.save()
    
            await existingSupplier.save()

        res
          .status(200)
          .json({
            
            message: `Payment In: ${payment_In} added Successfully to Azad Candidate: ${supplierName}'s Record`,
          });
      } catch (error) {
        console.error("Error updating values:", error);
        res
          .status(500)
          .json({ message: "Error updating values", error: error.message });
      }
}
}




// Payment Out
const directPaymentOut=async(req,res)=>{
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  
  const {
      ref,
      supplierName,
      category,
      payment_Via,
      payment_Type,
      slip_No,
      payment_Out,
      slip_Pic,
      details,
      curr_Country,
      curr_Rate,
      curr_Amount,
      date,
      cand_Name,
    } = req.body;
    const newPaymentOut = parseInt(payment_Out, 10);
    const newCurrAmount = parseInt(curr_Amount, 10);

    if(ref.toLowerCase()==="agent" || ref.toLowerCase()==="agent cand-vise"){
      const existingSupplier = await Agents.findOne({
        "payment_Out_Schema.supplierName": supplierName,
      });
      if (!existingSupplier) {
        res.status(404).json({
          message: "Supplier not Found",
        });
      }

      let nextInvoiceNumber = 0;

      // Check if InvoiceNumber document exists
      const currentInvoiceNumber = await InvoiceNumber.findOne({});

      if (!currentInvoiceNumber) {
        // If not, create a new one
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
      }

      // Get the updated invoice number
      const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
      );

      if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
      }
      let uploadImage;

      if (slip_Pic) {
        uploadImage = await cloudinary.uploader.upload(slip_Pic, {
          upload_preset: "rozgar",
        })
      }

      // Use the correct variable name, e.g., existingSupplier instead of existingPayment
      const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_Out: newPaymentOut,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_Out_Curr: curr_Country ? curr_Country : '',
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber,
        cand_Name,
      };
      const myPayment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_Out: newPaymentOut,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_Out_Curr: curr_Country ? curr_Country : '',
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber,
      
      };

      try {
        if (cand_Name) {
          const existPerson = existingSupplier.payment_Out_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
          if (existPerson) {
            existPerson.remaining_Price += -payment_Out,
           existPerson.total_In += payment_Out,
              existPerson.remaining_Curr += newCurrAmount ? newCurrAmount : 0


          }


          // Update total_Visa_Price_In_PKR and other fields using $inc
          await existingSupplier.updateOne({
            $inc: {
              "payment_Out_Schema.total_Payment_Out": payment_Out,
              "payment_Out_Schema.remaining_Balance": -payment_Out,
              "payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,
              "payment_Out_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
            },
            $push: {
              "payment_Out_Schema.payment": payment,
            },
          })
          const cashInHandDoc = await CashInHand.findOne({});

          if (!cashInHandDoc) {
            const newCashInHandDoc = new CashInHand();
            await newCashInHandDoc.save();
          }

          const cashInHandUpdate = {
            $inc: {},
          };

         
      if (payment_Via.toLowerCase() === "cash" ) {
        cashInHandUpdate.$inc.cash = -newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
      }
      else{
        cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
      }

          await CashInHand.updateOne({}, cashInHandUpdate);
          const newBackup=new Backup({
            name: supplierName,
            category:category,
            payment_Via:payment_Via,
            payment_Type:payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_Out: newPaymentOut,
            slip_Pic: uploadImage?.secure_url || '',
            details:details,
            payment_Out_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date:new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
            cand_Name:cand_Name,
              })
              await newBackup.save()
          await existingSupplier.save();
          const updatedSupplier = await Agents.findById(existingSupplier._id);

          const newNotification=new Notifications({
            type:"Agent Payment Out",
            content:`${user.userName} added Payment_Out: ${payment_Out} to Candidate: ${cand_Name} of Agent: ${supplierName}`,
            date: new Date().toISOString().split("T")[0]
  
          })
          await newNotification.save()
          res.status(200).json({
            data: updatedSupplier,
            message: `Payment Out: ${payment_Out} added Successfully to ${updatedSupplier.payment_Out_Schema.supplierName}'s Record`,
          })


        }

        else {

          // Update total_Visa_Price_In_PKR and other fields using $inc
          await existingSupplier.updateOne({
            $inc: {
              "payment_Out_Schema.total_Payment_Out": payment_Out,
              "payment_Out_Schema.remaining_Balance": -payment_Out,
              "payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,
              "payment_Out_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
            },
           
            $push: {
              "payment_Out_Schema.payment": myPayment,
            },
          })
          const cashInHandDoc = await CashInHand.findOne({});

          if (!cashInHandDoc) {
            const newCashInHandDoc = new CashInHand();
            await newCashInHandDoc.save();
          }

          const cashInHandUpdate = {
            $inc: {},
          };

          if (payment_Via.toLowerCase() === "cash" ) {
            cashInHandUpdate.$inc.cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          }
          else{
            cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          }

          await CashInHand.updateOne({}, cashInHandUpdate);

          const newBackup=new Backup({
            name: supplierName,
            category:category,
            payment_Via:payment_Via,
            payment_Type:payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_Out: newPaymentOut,
            slip_Pic: uploadImage?.secure_url || '',
            details:details,
            payment_Out_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date:new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
              })
              await newBackup.save()

        

          const newNotification=new Notifications({
            type:"Agent Payment Out",
            content:`${user.userName} added Payment_Out: ${payment_Out} of Agent: ${supplierName}`,
            date: new Date().toISOString().split("T")[0]
  
          })
          await newNotification.save()

          await existingSupplier.save();
          const updatedSupplier = await Agents.findById(existingSupplier._id);
          res.status(200).json({
            data: updatedSupplier,
            message: `Payment Out: ${payment_Out} added Successfully to Agent: ${updatedSupplier.payment_Out_Schema.supplierName}'s Record`,
          });
        }

      }
      catch (error) {
        console.error("Error updating values:", error);
        res
          .status(500)
          .json({ message: "Error updating values", error: error.message });
      }

    }


  //   For Suppliers
    if(ref.toLowerCase()==="supplier" || ref.toLowerCase()==="supplier cand-vise"){
      const existingSupplier = await Suppliers.findOne({
        "payment_Out_Schema.supplierName": supplierName,
      });
      if (!existingSupplier) {
        res.status(404).json({
          message: "Supplier not Found",
        });
      }

      let nextInvoiceNumber = 0;

      // Check if InvoiceNumber document exists
      const currentInvoiceNumber = await InvoiceNumber.findOne({});

      if (!currentInvoiceNumber) {
        // If not, create a new one
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
      }

      // Get the updated invoice number
      const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
      );

      if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
      }
      let uploadImage;

      if (slip_Pic) {
        uploadImage = await cloudinary.uploader.upload(slip_Pic, {
          upload_preset: "rozgar",
        })
      }

      // Use the correct variable name, e.g., existingSupplier instead of existingPayment
      const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_Out: newPaymentOut,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_Out_Curr: curr_Country ? curr_Country : '',
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber,
        cand_Name,
      };
      const myPayment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_Out: newPaymentOut,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_Out_Curr: curr_Country ? curr_Country : '',
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber,
      
      };

      try {
        if (cand_Name) {
          const existPerson = existingSupplier.payment_Out_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
          if (existPerson) {
            existPerson.remaining_Price += -payment_Out,
           existPerson.total_In += payment_Out,
              existPerson.remaining_Curr += newCurrAmount ? newCurrAmount : 0


          }


          // Update total_Visa_Price_In_PKR and other fields using $inc
          await existingSupplier.updateOne({
            $inc: {
              "payment_Out_Schema.total_Payment_Out": payment_Out,
              "payment_Out_Schema.remaining_Balance": -payment_Out,
              "payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,
              "payment_Out_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
            },
            $push: {
              "payment_Out_Schema.payment": payment,
            },
          })
          const cashInHandDoc = await CashInHand.findOne({});

          if (!cashInHandDoc) {
            const newCashInHandDoc = new CashInHand();
            await newCashInHandDoc.save();
          }

          const cashInHandUpdate = {
            $inc: {},
          };

         
      if (payment_Via.toLowerCase() === "cash" ) {
        cashInHandUpdate.$inc.cash = -newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
      }
      else{
        cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
      }

          await CashInHand.updateOne({}, cashInHandUpdate);

          const newBackup=new Backup({
            name: supplierName,
            category:category,
            payment_Via:payment_Via,
            payment_Type:payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_Out: newPaymentOut,
            slip_Pic: uploadImage?.secure_url || '',
            details:details,
            payment_Out_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date:new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
            cand_Name:cand_Name,
              })
              await newBackup.save()
          await existingSupplier.save();
          const updatedSupplier = await Suppliers.findById(existingSupplier._id);

          const newNotification=new Notifications({
            type:"Supplier Payment Out",
            content:`${user.userName} added Payment_Out: ${payment_Out} to Candidate: ${cand_Name} of Supplier: ${supplierName}`,
            date: new Date().toISOString().split("T")[0]
  
          })
          await newNotification.save()

          res.status(200).json({
            data: updatedSupplier,
            message: `Payment Out: ${payment_Out} added Successfully to ${updatedSupplier.payment_Out_Schema.supplierName}'s Record`,
          })


        }

        else {

          // Update total_Visa_Price_In_PKR and other fields using $inc
          await existingSupplier.updateOne({
            $inc: {
              "payment_Out_Schema.total_Payment_Out": payment_Out,
              "payment_Out_Schema.remaining_Balance": -payment_Out,
              "payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,
              "payment_Out_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
            },
         
            $push: {
              "payment_Out_Schema.payment": myPayment,
            },
          })
          const cashInHandDoc = await CashInHand.findOne({});

          if (!cashInHandDoc) {
            const newCashInHandDoc = new CashInHand();
            await newCashInHandDoc.save();
          }

          const cashInHandUpdate = {
            $inc: {},
          };

          if (payment_Via.toLowerCase() === "cash" ) {
            cashInHandUpdate.$inc.cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          }
          else{
            cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          }

          await CashInHand.updateOne({}, cashInHandUpdate);

          await existingSupplier.save();
          const updatedSupplier = await Suppliers.findById(existingSupplier._id);
          const newBackup=new Backup({
            name: supplierName,
            category:category,
            payment_Via:payment_Via,
            payment_Type:payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_Out: newPaymentOut,
            slip_Pic: uploadImage?.secure_url || '',
            details:details,
            payment_Out_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date:new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
              })
              await newBackup.save()
              const newNotification=new Notifications({
                type:"Supplier Payment Out",
                content:`${user.userName} added Payment_Out: ${payment_Out} of Supplier: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()
            res.status(200).json({
            data: updatedSupplier,
            message: `Payment Out: ${payment_Out} added Successfully to Supplier: ${updatedSupplier.payment_Out_Schema.supplierName}'s Record`,
          });
        }

      }
      catch (error) {
        console.error("Error updating values:", error);
        res
          .status(500)
          .json({ message: "Error updating values", error: error.message });
      }
    }

  //   For Candidates

  if(ref.toLowerCase()==="candidate"){
    const existingSupplier = await Candidate.findOne({ 'payment_Out_Schema.supplierName': supplierName });
    if (!existingSupplier) {
        res.status(404).json({
            message: "Supplier not Found"
        });
    }

    let nextInvoiceNumber = 0;

    // Check if InvoiceNumber document exists
    const currentInvoiceNumber = await InvoiceNumber.findOne({});

    if (!currentInvoiceNumber) {
        // If not, create a new one
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
    }

    // Get the updated invoice number
    const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
    );

    if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
    }


    let uploadImage;

    if (slip_Pic) {
        uploadImage = await cloudinary.uploader.upload(slip_Pic, {
            upload_preset: "rozgar",
        })
    }

    // Use the correct variable name, e.g., existingSupplier instead of existingPayment
    const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_Out: newPaymentOut,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_Out_Curr: curr_Country ? curr_Country : '',
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber,
      
    }

    try {

        // Update total_Visa_Price_In_PKR and other fields using $inc
        await existingSupplier.updateOne({
            $inc: {
                'payment_Out_Schema.total_Payment_Out': payment_Out,
                'payment_Out_Schema.remaining_Balance': -payment_Out,
                "payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,
                "payment_Out_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
            },
            $set: {
                "payment_Out_Schema.status": close?"Closed":"Open"
            },
            $push: {
                'payment_Out_Schema.payment': payment
            }
        });

        const cashInHandDoc = await CashInHand.findOne({});

        if (!cashInHandDoc) {
            const newCashInHandDoc = new CashInHand();
            await newCashInHandDoc.save();
        }

        const cashInHandUpdate = {
            $inc: {}
        };
        if (payment_Via.toLowerCase() === "cash" ) {
            cashInHandUpdate.$inc.cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          }
          else{
            cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          }

        await CashInHand.updateOne({}, cashInHandUpdate);
        const newBackup=new Backup({
            name: supplierName,
            category:category,
            payment_Via:payment_Via,
            payment_Type:payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_Out: newPaymentOut,
            slip_Pic: uploadImage?.secure_url || '',
            details:details,
            payment_Out_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date:new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
              })
              await newBackup.save()
              const newNotification=new Notifications({
                type:"Candidate Payment Out",
                content:`${user.userName} added Payment_Out: ${payment_Out} of Candidate: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()
            await existingSupplier.save()

        res.status(200).json({  message: `Payment Out: ${payment_Out} added Successfully to Candidate: ${supplierName}'s Record` });

    } catch (error) {
        console.error('Error updating values:', error);
        res.status(500).json({ message: 'Error updating values', error: error.message });
    }
  }

  // For Ticket Supplier
  if(ref.toLowerCase()==='ticket supplier'){
    const existingSupplier = await TicketSuppliers.findOne({ 'Supplier_Payment_Out_Schema.supplierName': supplierName });
    if (!existingSupplier) {
        res.status(404).json({
            message: "Supplier not Found"
        });
    }

    let nextInvoiceNumber = 0;

    // Check if InvoiceNumber document exists
    const currentInvoiceNumber = await InvoiceNumber.findOne({});

    if (!currentInvoiceNumber) {
        // If not, create a new one
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
    }

    // Get the updated invoice number
    const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
    );

    if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
    }


    // uploading image to cloudinary
    let uploadImage;

    if (slip_Pic) {
      uploadImage = await cloudinary.uploader.upload(slip_Pic, {
        upload_preset: "rozgar",
      })
    }
    // Use the correct variable name, e.g., existingSupplier instead of existingPayment
    const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_Out: newPaymentOut,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_Out_Curr: curr_Country ? curr_Country : '',
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber
    };

    try {
        
        // Update total_Azad_Visa_Price_In_PKR and other fields using $inc
        await existingSupplier.updateOne({
            $inc: {
                'Supplier_Payment_Out_Schema.total_Payment_Out': payment_Out,
                'Supplier_Payment_Out_Schema.remaining_Balance': -payment_Out,
                 "Supplier_Payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,

                
            },

            $push: {
                'Supplier_Payment_Out_Schema.payment': payment
            }
        });

        const cashInHandDoc = await CashInHand.findOne({});

        if (!cashInHandDoc) {
          const newCashInHandDoc = new CashInHand();
          await newCashInHandDoc.save();
        }

        const cashInHandUpdate = {
          $inc: {},
        };

        if (payment_Via.toLowerCase() === "cash" ) {
            cashInHandUpdate.$inc.cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          }
          else{
            cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          }

        await CashInHand.updateOne({}, cashInHandUpdate);
        
        const newBackup=new Backup({
          name: supplierName,
          category:category,
          payment_Via:payment_Via,
          payment_Type:payment_Type,
          slip_No: slip_No ? slip_No : '',
          payment_Out: newPaymentOut,
          slip_Pic: uploadImage?.secure_url || '',
          details:details,
          payment_Out_Curr: curr_Country ? curr_Country : "",
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
            })
            await newBackup.save()
            const newNotification=new Notifications({
              type:"Ticket Supplier Payment Out",
              content:`${user.userName} added Payment_Out: ${payment_Out} of Ticket Supplier: ${supplierName}`,
              date: new Date().toISOString().split("T")[0]
    
            })
            await newNotification.save()
        
        res.status(200).json({  message: `Payment Out: ${payment_Out} added Successfully to Ticket Supplier: ${supplierName}'s Record` });

    } catch (error) {
        console.error('Error updating values:', error);
        res.status(500).json({ message: 'Error updating values', error: error.message });
    }

  }

  // Ticket Agent
  if(ref.toLowerCase()==='ticket agent'){
    const existingSupplier = await TicketSuppliers.findOne({ 'Agent_Payment_Out_Schema.supplierName': supplierName });
    if (!existingSupplier) {
        res.status(404).json({
            message: "Supplier not Found"
        });
    }

    let nextInvoiceNumber = 0;

    // Check if InvoiceNumber document exists
    const currentInvoiceNumber = await InvoiceNumber.findOne({});

    if (!currentInvoiceNumber) {
        // If not, create a new one
        const newInvoiceNumberDoc = new InvoiceNumber();
        await newInvoiceNumberDoc.save();
    }

    // Get the updated invoice number
    const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        { $inc: { invoice_Number: 1 } },
        { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
    );

    if (updatedInvoiceNumber) {
        nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
    }


    // uploading image to cloudinary
    let uploadImage;

    if (slip_Pic) {
      uploadImage = await cloudinary.uploader.upload(slip_Pic, {
        upload_preset: "rozgar",
      })
    }
    // Use the correct variable name, e.g., existingSupplier instead of existingPayment
    const payment = {
        name: supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_Out: newPaymentOut,
        slip_Pic: uploadImage?.secure_url || '',
        details,
        payment_Out_Curr: curr_Country ? curr_Country : '',
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date,
        invoice: nextInvoiceNumber
    };

    try {
        
        // Update total_Azad_Visa_Price_In_PKR and other fields using $inc
        await existingSupplier.updateOne({
            $inc: {
                'Agent_Payment_Out_Schema.total_Payment_Out': payment_Out,
                'Agent_Payment_Out_Schema.remaining_Balance': -payment_Out,
                 "Agent_Payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,

                
            },
          
            $push: {
                'Agent_Payment_Out_Schema.payment': payment
            }
        });

        const cashInHandDoc = await CashInHand.findOne({});

        if (!cashInHandDoc) {
          const newCashInHandDoc = new CashInHand();
          await newCashInHandDoc.save();
        }

        const cashInHandUpdate = {
          $inc: {},
        };

        if (payment_Via.toLowerCase() === "cash" ) {
            cashInHandUpdate.$inc.cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          }
          else{
            cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          }

        await CashInHand.updateOne({}, cashInHandUpdate);
        
        const newBackup=new Backup({
          name: supplierName,
          category:category,
          payment_Via:payment_Via,
          payment_Type:payment_Type,
          slip_No: slip_No ? slip_No : '',
          payment_Out: newPaymentOut,
          slip_Pic: uploadImage?.secure_url || '',
          details:details,
          payment_Out_Curr: curr_Country ? curr_Country : "",
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
            })
            await newBackup.save()

      

        const newNotification=new Notifications({
          type:"Ticket Agent Payment Out",
          content:`${user.userName} added Payment_Out: ${payment_Out} of Ticket Agent: ${supplierName}`,
          date: new Date().toISOString().split("T")[0]

        })
        await newNotification.save()

        res.status(200).json({  message: `Payment Out: ${payment_Out} added Successfully to Ticket Agent: ${supplierName}'s Record` });

    } catch (error) {
        console.error('Error updating values:', error);
        res.status(500).json({ message: 'Error updating values', error: error.message });
    }
  }


  // Ticket Candidate
if(ref.toLowerCase()==='ticket candidate'){
  const existingSupplier = await TicketCandidate.findOne({ 'Candidate_Payment_Out_Schema.supplierName': supplierName });
                if (!existingSupplier) {
                    res.status(404).json({
                        message: "Supplier not Found"
                    });
                }

                let nextInvoiceNumber = 0;

                // Check if InvoiceNumber document exists
                const currentInvoiceNumber = await InvoiceNumber.findOne({});

                if (!currentInvoiceNumber) {
                    // If not, create a new one
                    const newInvoiceNumberDoc = new InvoiceNumber();
                    await newInvoiceNumberDoc.save();
                }

                // Get the updated invoice number
                const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
                    {},
                    { $inc: { invoice_Number: 1 } },
                    { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
                );

                if (updatedInvoiceNumber) {
                    nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
                }


                let uploadImage;

                if (slip_Pic) {
                    uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                        upload_preset: "rozgar",
                    })
                }

                // Use the correct variable name, e.g., existingSupplier instead of existingPayment
                const payment = {
                    name: supplierName,
                    category,
                    payment_Via,
                    payment_Type,
                    slip_No: slip_No ? slip_No : '',
                    payment_Out: newPaymentOut,
                    slip_Pic: uploadImage?.secure_url || '',
                    details,
                    payment_Out_Curr: curr_Country ? curr_Country : '',
                    curr_Rate: curr_Rate ? curr_Rate : 0,
                    curr_Amount: newCurrAmount ? newCurrAmount : 0,
                    date,
                    invoice: nextInvoiceNumber,
                 
                }

                try {

                    // Update total_Visa_Price_In_PKR and other fields using $inc
                    await existingSupplier.updateOne({
                        $inc: {
                            'Candidate_Payment_Out_Schema.total_Payment_Out': payment_Out,
                            'Candidate_Payment_Out_Schema.remaining_Balance': -payment_Out,
                            "Candidate_Payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,
                            "Candidate_Payment_Out_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
                        },
                        $set: {
                            
                            "Candidate_Payment_Out_Schema.status": close ? "Closed" : "Open",
                        },
                        $push: {
                            'Candidate_Payment_Out_Schema.payment': payment
                        }
                    });

                    const cashInHandDoc = await CashInHand.findOne({});

                    if (!cashInHandDoc) {
                        const newCashInHandDoc = new CashInHand();
                        await newCashInHandDoc.save();
                    }

                    const cashInHandUpdate = {
                        $inc: {}
                    };

                    if (payment_Via.toLowerCase() === "cash" ) {
                        cashInHandUpdate.$inc.cash = -newPaymentOut;
                        cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
                      }
                      else{
                        cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
                        cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
                      }

                    await CashInHand.updateOne({}, cashInHandUpdate);

                    const updatedSupplier = await TicketCandidate.findById(existingSupplier._id);

                    const newBackup=new Backup({
                        name: supplierName,
                        category:category,
                        payment_Via:payment_Via,
                        payment_Type:payment_Type,
                        slip_No: slip_No ? slip_No : '',
                        payment_Out: newPaymentOut,
                        slip_Pic: uploadImage?.secure_url || '',
                        details:details,
                        payment_Out_Curr: curr_Country ? curr_Country : "",
                        curr_Rate: curr_Rate ? curr_Rate : 0,
                        curr_Amount: newCurrAmount ? newCurrAmount : 0,
                        date:new Date().toISOString().split("T")[0],
                        invoice: nextInvoiceNumber,
                          })
                          await newBackup.save()
                          const newNotification=new Notifications({
                            type:"Ticket Candidate Payment Out",
                            content:`${user.userName} added Payment_Out: ${payment_Out} of Ticket Candidate: ${supplierName}`,
                            date: new Date().toISOString().split("T")[0]
                  
                          })
                          await newNotification.save()
                          await existingSupplier.save()

                    res.status(200).json({ data: updatedSupplier, message: `Payment Out: ${payment_Out} added Successfully to Ticket Candidate: ${supplierName}'s Record` });

                } catch (error) {
                    console.error('Error updating values:', error);
                    res.status(500).json({ message: 'Error updating values', error: error.message });
                }
}

// Visit Supplier
if(ref.toLowerCase()==='visit supplier'){
  const existingSupplier = await VisitSuppliers.findOne({ 'Supplier_Payment_Out_Schema.supplierName': supplierName });
                if (!existingSupplier) {
                    res.status(404).json({
                        message: "Supplier not Found"
                    });
                }

                let nextInvoiceNumber = 0;

                // Check if InvoiceNumber document exists
                const currentInvoiceNumber = await InvoiceNumber.findOne({});

                if (!currentInvoiceNumber) {
                    // If not, create a new one
                    const newInvoiceNumberDoc = new InvoiceNumber();
                    await newInvoiceNumberDoc.save();
                }

                // Get the updated invoice number
                const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
                    {},
                    { $inc: { invoice_Number: 1 } },
                    { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
                );

                if (updatedInvoiceNumber) {
                    nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
                }


                // uploading image to cloudinary
                let uploadImage;

                if (slip_Pic) {
                  uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                    upload_preset: "rozgar",
                  })
                }
                // Use the correct variable name, e.g., existingSupplier instead of existingPayment
                const payment = {
                    name: supplierName,
                    category,
                    payment_Via,
                    payment_Type,
                    slip_No: slip_No ? slip_No : '',
                    payment_Out: newPaymentOut,
                    slip_Pic: uploadImage?.secure_url || '',
                    details,
                    payment_Out_Curr: curr_Country ? curr_Country : '',
                    curr_Rate: curr_Rate ? curr_Rate : 0,
                    curr_Amount: newCurrAmount ? newCurrAmount : 0,
                    date,
                    invoice: nextInvoiceNumber
                };

                try {
                    
                    // Update total_Azad_Visa_Price_In_PKR and other fields using $inc
                    await existingSupplier.updateOne({
                        $inc: {
                            'Supplier_Payment_Out_Schema.total_Payment_Out': payment_Out,
                            'Supplier_Payment_Out_Schema.remaining_Balance': -payment_Out,
                             "Supplier_Payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,

                            
                        },

                        $push: {
                            'Supplier_Payment_Out_Schema.payment': payment
                        }
                    });

                    const cashInHandDoc = await CashInHand.findOne({});

                    if (!cashInHandDoc) {
                      const newCashInHandDoc = new CashInHand();
                      await newCashInHandDoc.save();
                    }
          
                    const cashInHandUpdate = {
                      $inc: {},
                    };
          
                    if (payment_Via.toLowerCase() === "cash" ) {
                        cashInHandUpdate.$inc.cash = -newPaymentOut;
                        cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
                      }
                      else{
                        cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
                        cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
                      }
          
                    await CashInHand.updateOne({}, cashInHandUpdate);
                    
                    const newBackup=new Backup({
                      name: supplierName,
                      category:category,
                      payment_Via:payment_Via,
                      payment_Type:payment_Type,
                      slip_No: slip_No ? slip_No : '',
                      payment_Out: newPaymentOut,
                      slip_Pic: uploadImage?.secure_url || '',
                      details:details,
                      payment_Out_Curr: curr_Country ? curr_Country : "",
                      curr_Rate: curr_Rate ? curr_Rate : 0,
                      curr_Amount: newCurrAmount ? newCurrAmount : 0,
                      date:new Date().toISOString().split("T")[0],
                      invoice: nextInvoiceNumber,
                        })
                        await newBackup.save()
                        const newNotification=new Notifications({
                          type:"Visit Supplier Payment Out",
                          content:`${user.userName} added Payment_Out: ${payment_Out} of Visit Supplier: ${supplierName}`,
                          date: new Date().toISOString().split("T")[0]
                
                        })
                        await newNotification.save()
                    
                    res.status(200).json({  message: `Payment Out: ${payment_Out} added Successfully to Visit Supplier: ${supplierName}'s Record` });

                } catch (error) {
                    console.error('Error updating values:', error);
                    res.status(500).json({ message: 'Error updating values', error: error.message });
                }
}

// Visit Agent
if(ref.toLowerCase()==='visit agent'){
  
  const existingSupplier = await VisitSuppliers.findOne({ 'Agent_Payment_Out_Schema.supplierName': supplierName });
  if (!existingSupplier) {
      res.status(404).json({
          message: "Supplier not Found"
      });
  }

  let nextInvoiceNumber = 0;

  // Check if InvoiceNumber document exists
  const currentInvoiceNumber = await InvoiceNumber.findOne({});

  if (!currentInvoiceNumber) {
      // If not, create a new one
      const newInvoiceNumberDoc = new InvoiceNumber();
      await newInvoiceNumberDoc.save();
  }

  // Get the updated invoice number
  const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
      {},
      { $inc: { invoice_Number: 1 } },
      { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
  );

  if (updatedInvoiceNumber) {
      nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
  }


  // uploading image to cloudinary
  let uploadImage;

  if (slip_Pic) {
    uploadImage = await cloudinary.uploader.upload(slip_Pic, {
      upload_preset: "rozgar",
    })
  }
  // Use the correct variable name, e.g., existingSupplier instead of existingPayment
  const payment = {
      name: supplierName,
      category,
      payment_Via,
      payment_Type,
      slip_No: slip_No ? slip_No : '',
      payment_Out: newPaymentOut,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      payment_Out_Curr: curr_Country ? curr_Country : '',
      curr_Rate: curr_Rate ? curr_Rate : 0,
      curr_Amount: newCurrAmount ? newCurrAmount : 0,
      date,
      invoice: nextInvoiceNumber
  };

  try {
      
      // Update total_Azad_Visa_Price_In_PKR and other fields using $inc
      await existingSupplier.updateOne({
          $inc: {
              'Agent_Payment_Out_Schema.total_Payment_Out': payment_Out,
              'Agent_Payment_Out_Schema.remaining_Balance': -payment_Out,
               "Agent_Payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,

              
          },
        
          $push: {
              'Agent_Payment_Out_Schema.payment': payment
          }
      });

      const cashInHandDoc = await CashInHand.findOne({});

      if (!cashInHandDoc) {
        const newCashInHandDoc = new CashInHand();
        await newCashInHandDoc.save();
      }

      const cashInHandUpdate = {
        $inc: {},
      };

      if (payment_Via.toLowerCase() === "cash" ) {
          cashInHandUpdate.$inc.cash = -newPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
        }

      await CashInHand.updateOne({}, cashInHandUpdate);
      
      const newBackup=new Backup({
        name: supplierName,
        category:category,
        payment_Via:payment_Via,
        payment_Type:payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_Out: newPaymentOut,
        slip_Pic: uploadImage?.secure_url || '',
        details:details,
        payment_Out_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date:new Date().toISOString().split("T")[0],
        invoice: nextInvoiceNumber,
          })
          await newBackup.save()

    

      const newNotification=new Notifications({
        type:"Visit Agent Payment Out",
        content:`${user.userName} added Payment_Out: ${payment_Out} of Visit Agent: ${supplierName}`,
        date: new Date().toISOString().split("T")[0]

      })
      await newNotification.save()

      res.status(200).json({  message: `Payment Out: ${payment_Out} added Successfully to Visit Agent: ${supplierName}'s Record` });

  } catch (error) {
      console.error('Error updating values:', error);
      res.status(500).json({ message: 'Error updating values', error: error.message });
  }
}

// Visit Candidate
if(ref.toLowerCase()==='visit candidate'){
  const existingSupplier = await VisitCandidate.findOne({ 'Candidate_Payment_Out_Schema.supplierName': supplierName });
  if (!existingSupplier) {
      res.status(404).json({
          message: "Supplier not Found"
      });
  }

  let nextInvoiceNumber = 0;

  // Check if InvoiceNumber document exists
  const currentInvoiceNumber = await InvoiceNumber.findOne({});

  if (!currentInvoiceNumber) {
      // If not, create a new one
      const newInvoiceNumberDoc = new InvoiceNumber();
      await newInvoiceNumberDoc.save();
  }

  // Get the updated invoice number
  const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
      {},
      { $inc: { invoice_Number: 1 } },
      { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
  );

  if (updatedInvoiceNumber) {
      nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
  }


  let uploadImage;

  if (slip_Pic) {
      uploadImage = await cloudinary.uploader.upload(slip_Pic, {
          upload_preset: "rozgar",
      })
  }

  // Use the correct variable name, e.g., existingSupplier instead of existingPayment
  const payment = {
      name: supplierName,
      category,
      payment_Via,
      payment_Type,
      slip_No: slip_No ? slip_No : '',
      payment_Out: newPaymentOut,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      payment_Out_Curr: curr_Country ? curr_Country : '',
      curr_Rate: curr_Rate ? curr_Rate : 0,
      curr_Amount: newCurrAmount ? newCurrAmount : 0,
      date,
      invoice: nextInvoiceNumber,
     
  }

  try {

      // Update total_Visa_Price_In_PKR and other fields using $inc
      await existingSupplier.updateOne({
          $inc: {
              'Candidate_Payment_Out_Schema.total_Payment_Out': payment_Out,
              'Candidate_Payment_Out_Schema.remaining_Balance': -payment_Out,
              "Candidate_Payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,
              "Candidate_Payment_Out_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
          },
          $set: {
             
              "Candidate_Payment_Out_Schema.status": close ? "Closed" : "Open",
          },
          $push: {
              'Candidate_Payment_Out_Schema.payment': payment
          }
      });

      const cashInHandDoc = await CashInHand.findOne({});

      if (!cashInHandDoc) {
          const newCashInHandDoc = new CashInHand();
          await newCashInHandDoc.save();
      }

      const cashInHandUpdate = {
          $inc: {}
      };

      if (payment_Via.toLowerCase() === "cash" ) {
          cashInHandUpdate.$inc.cash = -newPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
        }

      await CashInHand.updateOne({}, cashInHandUpdate);

      const newBackup=new Backup({
          name: supplierName,
          category:category,
          payment_Via:payment_Via,
          payment_Type:payment_Type,
          slip_No: slip_No ? slip_No : '',
          payment_Out: newPaymentOut,
          slip_Pic: uploadImage?.secure_url || '',
          details:details,
          payment_Out_Curr: curr_Country ? curr_Country : "",
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
            })
            await newBackup.save()
            const newNotification=new Notifications({
              type:"Visit Candidate Payment Out",
              content:`${user.userName} added Payment_Out: ${payment_Out} of Visit Candidate: ${supplierName}`,
              date: new Date().toISOString().split("T")[0]
    
            })
            await newNotification.save()
      await existingSupplier.save()


      res.status(200).json({message: `Payment Out: ${payment_Out} added Successfully to Visit Candidate: ${supplierName}'s Record` });

  } catch (error) {
      console.error('Error updating values:', error);
      res.status(500).json({ message: 'Error updating values', error: error.message });
  }
}

// Azad Section
if(ref.toLowerCase()==='azad supplier'){
  const existingSupplier = await AzadSuppliers.findOne({ 'Supplier_Payment_Out_Schema.supplierName': supplierName });
  if (!existingSupplier) {
      res.status(404).json({
          message: "Supplier not Found"
      });
  }

  let nextInvoiceNumber = 0;

  // Check if InvoiceNumber document exists
  const currentInvoiceNumber = await InvoiceNumber.findOne({});

  if (!currentInvoiceNumber) {
      // If not, create a new one
      const newInvoiceNumberDoc = new InvoiceNumber();
      await newInvoiceNumberDoc.save();
  }

  // Get the updated invoice number
  const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
      {},
      { $inc: { invoice_Number: 1 } },
      { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
  );

  if (updatedInvoiceNumber) {
      nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
  }


  // uploading image to cloudinary
  let uploadImage;

  if (slip_Pic) {
    uploadImage = await cloudinary.uploader.upload(slip_Pic, {
      upload_preset: "rozgar",
    })
  }
  // Use the correct variable name, e.g., existingSupplier instead of existingPayment
  const payment = {
      name: supplierName,
      category,
      payment_Via,
      payment_Type,
      slip_No: slip_No ? slip_No : '',
      payment_Out: newPaymentOut,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      payment_Out_Curr: curr_Country ? curr_Country : '',
      curr_Rate: curr_Rate ? curr_Rate : 0,
      curr_Amount: newCurrAmount ? newCurrAmount : 0,
      date,
      invoice: nextInvoiceNumber
  };

  try {
      
      // Update total_Azad_Visa_Price_In_PKR and other fields using $inc
      await existingSupplier.updateOne({
          $inc: {
              'Supplier_Payment_Out_Schema.total_Payment_Out': payment_Out,
              'Supplier_Payment_Out_Schema.remaining_Balance': -payment_Out,
               "Supplier_Payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,

              
          },

          $push: {
              'Supplier_Payment_Out_Schema.payment': payment
          }
      });

      const cashInHandDoc = await CashInHand.findOne({});

      if (!cashInHandDoc) {
        const newCashInHandDoc = new CashInHand();
        await newCashInHandDoc.save();
      }

      const cashInHandUpdate = {
        $inc: {},
      };

      if (payment_Via.toLowerCase() === "cash" ) {
          cashInHandUpdate.$inc.cash = -newPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
        }

      await CashInHand.updateOne({}, cashInHandUpdate);
      
      const newBackup=new Backup({
        name: supplierName,
        category:category,
        payment_Via:payment_Via,
        payment_Type:payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_Out: newPaymentOut,
        slip_Pic: uploadImage?.secure_url || '',
        details:details,
        payment_Out_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date:new Date().toISOString().split("T")[0],
        invoice: nextInvoiceNumber,
          })
          await newBackup.save()
          const newNotification=new Notifications({
            type:"Azad Supplier Payment Out",
            content:`${user.userName} added Payment_Out: ${payment_Out} of Azad Supplier: ${supplierName}`,
            date: new Date().toISOString().split("T")[0]
  
          })
          await newNotification.save()
      
      res.status(200).json({  message: `Payment Out: ${payment_Out} added Successfully to Azad Supplier: ${supplierName}'s Record` });

  } catch (error) {
      console.error('Error updating values:', error);
      res.status(500).json({ message: 'Error updating values', error: error.message });
  }

}


// Azad Agent
if(ref.toLowerCase()==='azad agent'){
  const existingSupplier = await AzadSuppliers.findOne({ 'Agent_Payment_Out_Schema.supplierName': supplierName });
  if (!existingSupplier) {
      res.status(404).json({
          message: "Supplier not Found"
      });
  }

  let nextInvoiceNumber = 0;

  // Check if InvoiceNumber document exists
  const currentInvoiceNumber = await InvoiceNumber.findOne({});

  if (!currentInvoiceNumber) {
      // If not, create a new one
      const newInvoiceNumberDoc = new InvoiceNumber();
      await newInvoiceNumberDoc.save();
  }

  // Get the updated invoice number
  const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
      {},
      { $inc: { invoice_Number: 1 } },
      { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
  );

  if (updatedInvoiceNumber) {
      nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
  }


  // uploading image to cloudinary
  let uploadImage;

  if (slip_Pic) {
    uploadImage = await cloudinary.uploader.upload(slip_Pic, {
      upload_preset: "rozgar",
    })
  }
  // Use the correct variable name, e.g., existingSupplier instead of existingPayment
  const payment = {
      name: supplierName,
      category,
      payment_Via,
      payment_Type,
      slip_No: slip_No ? slip_No : '',
      payment_Out: newPaymentOut,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      payment_Out_Curr: curr_Country ? curr_Country : '',
      curr_Rate: curr_Rate ? curr_Rate : 0,
      curr_Amount: newCurrAmount ? newCurrAmount : 0,
      date,
      invoice: nextInvoiceNumber
  };

  try {
      
      // Update total_Azad_Visa_Price_In_PKR and other fields using $inc
      await existingSupplier.updateOne({
          $inc: {
              'Agent_Payment_Out_Schema.total_Payment_Out': payment_Out,
              'Agent_Payment_Out_Schema.remaining_Balance': -payment_Out,
               "Agent_Payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,

              
          },
        
          $push: {
              'Agent_Payment_Out_Schema.payment': payment
          }
      });

      const cashInHandDoc = await CashInHand.findOne({});

      if (!cashInHandDoc) {
        const newCashInHandDoc = new CashInHand();
        await newCashInHandDoc.save();
      }

      const cashInHandUpdate = {
        $inc: {},
      };

      if (payment_Via.toLowerCase() === "cash" ) {
          cashInHandUpdate.$inc.cash = -newPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
        }

      await CashInHand.updateOne({}, cashInHandUpdate);
      
      const newBackup=new Backup({
        name: supplierName,
        category:category,
        payment_Via:payment_Via,
        payment_Type:payment_Type,
        slip_No: slip_No ? slip_No : '',
        payment_Out: newPaymentOut,
        slip_Pic: uploadImage?.secure_url || '',
        details:details,
        payment_Out_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date:new Date().toISOString().split("T")[0],
        invoice: nextInvoiceNumber,
          })
          await newBackup.save()

    

      const newNotification=new Notifications({
        type:"Azad Agent Payment Out",
        content:`${user.userName} added Payment_Out: ${payment_Out} of Azad Agent: ${supplierName}`,
        date: new Date().toISOString().split("T")[0]

      })
      await newNotification.save()

      res.status(200).json({  message: `Payment Out: ${payment_Out} added Successfully to ${supplierName}'s Record` });

  } catch (error) {
      console.error('Error updating values:', error);
      res.status(500).json({ message: 'Error updating values', error: error.message });
  }
}

// Azad Candidate
if(ref.toLowerCase()==='azad candidate'){
  const existingSupplier = await AzadCandidate.findOne({
    "Candidate_Payment_Out_Schema.supplierName": supplierName,
  });
  if (!existingSupplier) {
    res.status(404).json({
      message: "Supplier not Found",
    });
  }

  let nextInvoiceNumber = 0;

  // Check if InvoiceNumber document exists
  const currentInvoiceNumber = await InvoiceNumber.findOne({});

  if (!currentInvoiceNumber) {
    // If not, create a new one
    const newInvoiceNumberDoc = new InvoiceNumber();
    await newInvoiceNumberDoc.save();
  }

  // Get the updated invoice number
  const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
    {},
    { $inc: { invoice_Number: 1 } },
    { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
  );

  if (updatedInvoiceNumber) {
    nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
  }

  let uploadImage;

  if (slip_Pic) {
    uploadImage = await cloudinary.uploader.upload(slip_Pic, {
      upload_preset: "rozgar",
    });
  }

  // Use the correct variable name, e.g., existingSupplier instead of existingPayment
  const payment = {
    name: supplierName,
    category,
    payment_Via,
    payment_Type,
    slip_No: slip_No ? slip_No : "",
    payment_Out: newPaymentOut,
    slip_Pic: uploadImage?.secure_url || "",
    details,
    payment_Out_Curr: curr_Country ? curr_Country : "",
    curr_Rate: curr_Rate ? curr_Rate : 0,
    curr_Amount: newCurrAmount ? newCurrAmount : 0,
    date,
    invoice: nextInvoiceNumber,
  };

  try {
    // Update total_Visa_Price_In_PKR and other fields using $inc
    await existingSupplier.updateOne({
      $inc: {
        "Candidate_Payment_Out_Schema.total_Payment_Out": payment_Out,
        "Candidate_Payment_Out_Schema.remaining_Balance": -payment_Out,
        "Candidate_Payment_Out_Schema.total_Payment_Out_Curr":
          newCurrAmount ? newCurrAmount : 0,
        "Candidate_Payment_Out_Schema.remaining_Curr": newCurrAmount
          ? -newCurrAmount
          : 0,
      },
      $set: {
        "Candidate_Payment_Out_Schema.status": close ? "Closed" : "Open",
      },
      $push: {
        "Candidate_Payment_Out_Schema.payment": payment,
      },
    });

    const cashInHandDoc = await CashInHand.findOne({});

    if (!cashInHandDoc) {
      const newCashInHandDoc = new CashInHand();
      await newCashInHandDoc.save();
    }

    const cashInHandUpdate = {
      $inc: {},
    };

    if (payment_Via.toLowerCase() === "cash") {
      cashInHandUpdate.$inc.cash = -newPaymentOut;
      cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
    } else {
      cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
      cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
    }

    await CashInHand.updateOne({}, cashInHandUpdate);

    const updatedSupplier = await AzadCandidate.findById(
      existingSupplier._id
    );
    const newBackup=new Backup({
      name: supplierName,
      category:category,
      payment_Via:payment_Via,
      payment_Type:payment_Type,
      slip_No: slip_No ? slip_No : '',
      payment_Out: newPaymentOut,
      slip_Pic: uploadImage?.secure_url || '',
      details:details,
      payment_Out_Curr: curr_Country ? curr_Country : "",
      curr_Rate: curr_Rate ? curr_Rate : 0,
      curr_Amount: newCurrAmount ? newCurrAmount : 0,
      date:new Date().toISOString().split("T")[0],
      invoice: nextInvoiceNumber,
        })
        await newBackup.save()
        const newNotification=new Notifications({
          type:"Azad Candidate Payment Out",
          content:`${user.userName} added Payment_Out: ${payment_Out} of Azad Candidate: ${supplierName}`,
          date: new Date().toISOString().split("T")[0]

        })
        await newNotification.save()
        await existingSupplier.save()

    res
      .status(200)
      .json({
        data: updatedSupplier,
        message: `Payment Out: ${payment_Out} added Successfully to Azad Candidate: ${supplierName}'s Record`,
      });
  } catch (error) {
    console.error("Error updating values:", error);
    res
      .status(500)
      .json({ message: "Error updating values", error: error.message });
  }
}
}
module.exports={directPaymentIn,directPaymentOut}