const cloudinary = require("../cloudinary");
const User = require("../../database/userdb/UserSchema");
const Suppliers = require("../../database/suppliers/SupplierSchema");
const Agents = require("../../database/agents/AgentSchema");
const Candidate = require("../../database/candidate/CandidateSchema");
const AzadSupplier = require("../../database/azadSuppliers/AzadSupplierSchema");
const AzadCandidate = require("../../database/azadCandidates/AzadCandidateSchema");
const TicketSuppliers = require("../../database/ticketSuppliers/TicketSupplierSchema");
const TicketCandidate = require("../../database/ticketCandidates/TicketCandidateSchema");
const VisitSuppliers = require("../../database/visitSuppliers/VisitSupplierSchema");
const VisitCandidate = require("../../database/visitCandidates/VisitCandidateSchema");
const Protector = require("../../database/protector/ProtectorSchema");
const Entries = require("../../database/enteries/EntrySchema");
const Reminders=require('../../database/reminders/RemindersModel.js')
const Backup=require('../../database/backup/BackupModel.js')
const InvoiceNumber = require("../../database/invoiceNumber/InvoiceNumberSchema");
const CashInHand = require("../../database/cashInHand/CashInHandSchema");
const Notifications=require('../../database/notifications/NotifyModel.js')
const RecycleBin=require('../../database/recyclebin/RecycleBinModel.js')

const AzadAgents = require("../../database/azadAgent/AzadAgentSchema");
const TicketAgents = require("../../database/ticketAgent/TicketAgentSchema");
const VisitAgents = require("../../database/visitAgent/VisitAgentSchema");


const PaymentVia=require('../../database/setting/Paymeny_Via_Schema.js')
const PaymentType=require('../../database/setting/Payment_Type_Schema.js')
const Categories=require('../../database/setting/Category_Schema.js')

const mongoose = require("mongoose");
const moment = require("moment");

const addPaymentIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role !== "Admin") {
      res.status(404).json({ message: "Only Admin is allowed!" });
      return;
    }

    const {
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
      date
    } = req.body;

    const newPaymentIn = parseInt(payment_In, 10);
    const newCurrAmount = parseInt(curr_Amount, 10);
    
    const existingSupplier = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
      "payment_In_Schema.status": 'Open',

    })
    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
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
      date:date?date:new Date().toISOString().split("T")[0],
      invoice: nextInvoiceNumber
    };

    try {
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
          type:"Agent Payment In",
          content:`${user.userName} added Payment_In: ${payment_In} of Agent:${supplierName}`,
          date: new Date().toISOString().split("T")[0]

        })
        await newNotification.save()
       
        res.status(200).json({
          message: `Payment In: ${payment_In} added Successfully to ${supplierName}'s Record`,
        })
      

    } catch (error) {
      res.status(500).json({
        message: "Error updating values",
        error: error.message,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}


//Adding Multiple Payment In
const addMultiplePaymentsIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role !== "Admin") {
      res.status(403).json({ message: "Only Admin is allowed!" });
      return;
    }

    const multiplePayment = req.body;

    if (!Array.isArray(multiplePayment) || multiplePayment.length === 0) {
      res.status(400).json({ message: "Invalid request payload" });
      return;
    }

    try {

      let updatedPayments = [];
      let unsavedPayments= [];

      for (const payment of multiplePayment) {
        let {
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
          date
        } = payment;

        const newPaymentIn = parseInt(payment_In, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);
        const suppliers=await Agents.find({})
        let existingSupplier
        let confirmStatus=true

        if(payment_Via){
          const allPaymetVia=await PaymentVia.find({})
          const existingPaymentVia=allPaymetVia.find(p=>p.payment_Via.trim().toLowerCase()==payment_Via.trim().toLowerCase())
          if(!existingPaymentVia){
            payment.paymentViaError='Payment Via not found in setting'
            confirmStatus=false
          }
        }

        if(payment_Type){
          const allPaymetTypes=await PaymentType.find({})
          const existingPaymentType=allPaymetTypes.find(p=>p.payment_Type.trim().toLowerCase()==payment_Type.trim().toLowerCase())
          if(!existingPaymentType){
            payment.paymentTypeError='Payment Type not found in setting'
            confirmStatus=false
          }
        }

        if(category){
          const allCategories=await Categories.find({})
          const existingCategory=allCategories.find(p=>p.category.trim().toLowerCase()==category.trim().toLowerCase())
          if(!existingCategory){
            payment.paymentCategoryError='Payment Category not found in setting'
            confirmStatus=false
          }
        }
        
       for (const supplier of suppliers){
        if(supplier.payment_In_Schema){
          if(supplier.payment_In_Schema.supplierName.toLowerCase()===supplierName.toLowerCase()&&supplier.payment_In_Schema.status.toLowerCase()==='open'){
            existingSupplier = supplier;
            break
          }
        }
       }
       if(!existingSupplier){
        payment.nameError='Agent name not found in Payments records'
        confirmStatus=false
       }

       if(!confirmStatus){
        unsavedPayments.push(payment)
       }

        if (existingSupplier && confirmStatus) {
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
          const newPayment = {
            name: supplierName,
            category,
            payment_Via,
            payment_Type,
            slip_No: slip_No ? slip_No : '',
            payment_In: newPaymentIn,
            slip_Pic: uploadImage?.secure_url || '',
            details,
            payment_In_Curr: curr_Country ? curr_Country : '',
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date:date?date:new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
          
          };
  
          updatedPayments.push(newPayment);
  
          try {
              // Update total_Visa_Price_In_PKR and other fields using $inc
              await existingSupplier.updateOne({
                $inc: {
                  "payment_In_Schema.total_Payment_In": payment_In,
                  "payment_In_Schema.remaining_Balance": -payment_In,
                  "payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,
                  "payment_In_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
                },
                $push: {
                  "payment_In_Schema.payment": newPayment,
                }
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
                    type:"Agent Payment In",
                    content:`${user.userName} added Payment_In: ${payment_In} of Agent:${supplierName}`,
                    date: new Date().toISOString().split("T")[0]
          
                  })
                  await newNotification.save()
              await existingSupplier.save();
              
          }
          catch (error) {
            console.error("Error updating values:", error);
            res
              .status(500)
              .json({ message: "Error updating values", error: error.message });
          }
        }

    
      }
      res.status(200).json({
        data:unsavedPayments,
        message: `${updatedPayments.length} Payments added Successfully`,
      })

    } catch (error) {
      console.error("Error updating values:", error);
      res.status(500).json({
        message: "Error updating values",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Addding a New Payment In Cash Out
const addPaymentInReturn = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user) {
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" });
      }
      if (user.role === "Admin") {
        const {
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          cash_Out,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          date,
          cand_Name,
        } = req.body;
        if (!supplierName) {
          return res.status(400).json({ message: "supplier Name is required" });
        }
        if (!category) {
          return res.status(400).json({ message: "Category is required" });
        }
        if (!payment_Via) {
          return res.status(400).json({ message: "Payment Via is required" });
        }
        if (!payment_Type) {
          return res.status(400).json({ message: "Payment Type is required" });
        }

        if (!cash_Out) {
          return res.status(400).json({ message: "Cash Return is required" });
        }

       

        const newCashOut = parseInt(cash_Out, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);

        const existingSupplier = await Agents.findOne({
          "payment_In_Schema.supplierName": supplierName,
          "payment_In_Schema.status": 'Open',

        });
        if (!existingSupplier) {
          res.status(404).json({
            message: "Agent not Found",
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
          });
        }



        const payment = {
          name: supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No: slip_No ? slip_No : '',
          cash_Out: newCashOut,
          slip_Pic: uploadImage?.secure_url || '',
          details,
          payment_Out_Curr: curr_Country ? curr_Country : 0,
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date:date?date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
          cand_Name,
        }

        try {

          if (cand_Name) {
            // If cand_Name is provided, find the corresponding person in the persons array and update it
            const existPerson = existingSupplier.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
            if (existPerson) {
                existPerson.remaining_Price += newCashOut,
                existPerson.remaining_Curr += newCurrAmount ? newCurrAmount : 0
                existPerson.cash_Out += newCashOut ? newCashOut : 0

            }
            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingSupplier.updateOne({
              $inc: {
                // "payment_In_Schema.total_Payment_In": -newCashOut,
                "payment_In_Schema.total_Cash_Out": newCashOut,
                "payment_In_Schema.remaining_Balance": newCashOut,
                "payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? -newCurrAmount : 0,
                "payment_In_Schema.remaining_Curr": newCurrAmount ? newCurrAmount : 0,
              },
              $push: {
                "payment_In_Schema.payment": payment,
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

            if (payment_Via.toLowerCase() === "cash" ) {
              cashInHandUpdate.$inc.cash = -newCashOut;
              cashInHandUpdate.$inc.total_Cash = -newCashOut;
            }
            else{
              cashInHandUpdate.$inc.bank_Cash = -newCashOut;
              cashInHandUpdate.$inc.total_Cash = -newCashOut;
            }


            await CashInHand.updateOne({}, cashInHandUpdate);
            const newBackup=new Backup({
              name: supplierName,
              category:category,
              payment_Via:payment_Via,
              payment_Type:payment_Type,
              slip_No: slip_No ? slip_No : '',
              cash_Out: newCashOut,
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
                  type:"Agent Payment In Return",
                  content:`${user.userName} added Payment_Return: ${cash_Out} to Candidate: ${cand_Name} of Agent:${supplierName}`,
                  date: new Date().toISOString().split("T")[0]
        
                })
                await newNotification.save()
            await existingSupplier.save();

        

            res.status(200).json({
             
              message: `Cash Out: ${cash_Out} added Successfully to ${supplierName}'s Record`,
            })

          }

          else {
            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingSupplier.updateOne({
              $inc: {
                // "payment_In_Schema.total_Payment_In": -newCashOut,
                "payment_In_Schema.total_Cash_Out": newCashOut,
                "payment_In_Schema.remaining_Balance": newCashOut,
                "payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? -newCurrAmount : 0,
                "payment_In_Schema.remaining_Curr": newCurrAmount ? newCurrAmount : 0,
              },
              $push: {
                "payment_In_Schema.payment": payment,
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

            if (payment_Via.toLowerCase() === "cash" ) {
              cashInHandUpdate.$inc.cash = -newCashOut;
              cashInHandUpdate.$inc.total_Cash = -newCashOut;
            }
            else{
              cashInHandUpdate.$inc.bank_Cash = -newCashOut;
              cashInHandUpdate.$inc.total_Cash = -newCashOut;
            }

            await CashInHand.updateOne({}, cashInHandUpdate);
            const newBackup=new Backup({
              name: supplierName,
              category:category,
              payment_Via:payment_Via,
              payment_Type:payment_Type,
              slip_No: slip_No ? slip_No : '',
              cash_Out: newCashOut,
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
                  type:"Agent Payment In Return",
                  content:`${user.userName} added Payment_Return: ${cash_Out} of Agent:${supplierName}`,
                  date: new Date().toISOString().split("T")[0]
        
                })
                await newNotification.save()
            await existingSupplier.save();

          
            res.status(200).json({
              
              message: `Cash Out: ${cash_Out} added Successfully to ${supplierName}'s Record`,
            })
          }

        } catch (error) {
          console.error("Error updating values:", error);
          res
            .status(500)
            .json({ message: "Error updating values", error: error.message });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Deleting a single Payment In
const deleteSinglePaymentIn = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }

  if (user && user.role === "Admin") {
    const {
      paymentId,
      payment_In,
      cash_Out,
      curr_Amount,
      supplierName,
      payment_Via,
      newStatus
    } = req.body;

    const existingSupplier = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
      "payment_In_Schema._id": newStatus,

    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
      });
    }
    const newPaymentIn = payment_In - cash_Out;

    try {
      
        // Add this line for logging
        let paymentToDelete=existingSupplier.payment_In_Schema.payment.find((p)=>p._id.toString()===paymentId.toString())
        const newRecycle=new RecycleBin({
          name:supplierName,
          type:"Agent Payment In",
          category:paymentToDelete.category,
          payment_Via:paymentToDelete.payment_Via,
          payment_Type:paymentToDelete.payment_Type,
          slip_No:paymentToDelete.slip_No,
          payment_In:paymentToDelete.payment_In,
          cash_Out:paymentToDelete.cash_Out,
          payment_In_Curr:paymentToDelete.payment_In_Curr,
          slip_Pic:paymentToDelete.slip_Pic,
          date:paymentToDelete.date,
          curr_Rate:paymentToDelete.curr_Rate,
          curr_Amount:paymentToDelete.curr_Amount,
          invoice:paymentToDelete.invoice

        })
        await newRecycle.save()
        await existingSupplier.updateOne({
          $inc: {
            "payment_In_Schema.total_Payment_In": -payment_In,
            "payment_In_Schema.total_Cash_Out": -cash_Out,
            "payment_In_Schema.remaining_Balance": newPaymentIn,
            "payment_In_Schema.total_Payment_In_Curr": curr_Amount ? -curr_Amount : 0,
            "payment_In_Schema.remaining_Curr": curr_Amount ? curr_Amount : 0,

          },

          $pull: {
            "payment_In_Schema.payment": { _id: paymentId },
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
      
        if (payment_Via.toLowerCase() === "cash" ) {
          cashInHandUpdate.$inc.cash = -newPaymentIn;
          cashInHandUpdate.$inc.total_Cash = -newPaymentIn;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = -newPaymentIn;
          cashInHandUpdate.$inc.total_Cash = -newPaymentIn;
        }
        
        await CashInHand.updateOne({}, cashInHandUpdate);
        await existingSupplier.save()
        const newNotification=new Notifications({
          type:"Agent Payment In Deleted",
          content:`${user.userName} deleted ${payment_In ? "Payment_In":"Cash_Retrun"}: ${payment_In ? payment_In :cash_Out} of Agent:${supplierName}`,
          date: new Date().toISOString().split("T")[0]

        })
        await newNotification.save()
     
        res.status(200).json({
          message: `Payment In with ID ${paymentId} deleted successfully from ${supplierName}`,
        });
      


    } catch (error) {
      console.error("Error updating values:", error);
      res
        .status(500)
        .json({ message: "Error updating values", error: error.message });
    }
  }
};

// Updating a single Payment In Details
const updateSinglePaymentIn = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }
  if (user && user.role === "Admin") {
    try {
      const {
        supplierName,
        paymentId,
        category,
        payment_Via,
        payment_Type,
        slip_No,
        details,
        payment_In,
        cash_Out,
        curr_Country,
        curr_Rate,
        curr_Amount,
        slip_Pic,
        date,
        newStatus
        
      } = req.body;

      const newPaymentIn = parseInt(payment_In, 10);
      const newCashOut = parseInt(cash_Out, 10);
      const newCurrAmount = parseInt(curr_Amount, 10);

      const existingSupplier = await Agents.findOne({
        "payment_In_Schema.supplierName": supplierName,
        "payment_In_Schema._id": newStatus,
      });
      if (!existingSupplier) {
        res.status(404).json({ message: "Agent not found" });
        return;
      }

      // Find the payment within the payment array using paymentId
      const paymentToUpdate = existingSupplier.payment_In_Schema.payment.find(
        (payment) => payment._id.toString() === paymentId
      );

      if (!paymentToUpdate) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }
      const updatedCashout = paymentToUpdate.cash_Out - newCashOut;
      const updatedPaymentIn = paymentToUpdate.payment_In - payment_In;
      const updateCurr_Amount = newCurrAmount - paymentToUpdate.curr_Amount;
      const newBalance = updatedCashout - updatedPaymentIn;

      let uploadImage;

      if (slip_Pic) {
        uploadImage = await cloudinary.uploader.upload(slip_Pic, {
          upload_preset: "rozgar",
        })
      }
    
        await existingSupplier.updateOne({
          $inc: {
            "payment_In_Schema.total_Payment_In": -updatedPaymentIn,
            "payment_In_Schema.total_Cash_Out": -updatedCashout,
            "payment_In_Schema.remaining_Balance": -newBalance,
            "payment_In_Schema.total_Payment_In_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
            "payment_In_Schema.remaining_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
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
  
       
        if (payment_Via.toLowerCase() === "cash" ) {
          
          cashInHandUpdate.$inc.cash = newBalance;
          cashInHandUpdate.$inc.total_Cash = newBalance;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = newBalance;
          cashInHandUpdate.$inc.total_Cash = newBalance;
        }
  
        await CashInHand.updateOne({}, cashInHandUpdate);
  
        // Update the payment details
        paymentToUpdate.category = category;
        paymentToUpdate.payment_Via = payment_Via;
        paymentToUpdate.payment_Type = payment_Type;
        paymentToUpdate.slip_No = slip_No;
        paymentToUpdate.details = details;
        paymentToUpdate.payment_In = newPaymentIn;
        paymentToUpdate.cash_Out = newCashOut;
        if (slip_Pic && uploadImage) {
          paymentToUpdate.slip_Pic = uploadImage.secure_url;
        };
        paymentToUpdate.payment_In_Curr = curr_Country;
        paymentToUpdate.curr_Rate = curr_Rate;
        paymentToUpdate.curr_Amount = newCurrAmount;
        paymentToUpdate.date = date;
        // Save the updated supplier
  
        await existingSupplier.save();
  
       
        const newNotification=new Notifications({
          type:"Agent Payment In Updated",
          content:`${user.userName} updated Payment_In: ${payment_In} of Agent:${supplierName}`,
          date: new Date().toISOString().split("T")[0]

        })
        await newNotification.save()
        res.status(200).json({
          message: "Payment In details updated successfully",
         
        });
      
      
    } catch (error) {
      console.error("Error updating payment details:", error);
      res.status(500).json({
        message: "Error updating payment details",
        error: error.message,
      });
    }
  }
};


// Updating a single Agent Total Payment In Details
const updateAgentTotalPaymentIn = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }
  if (user && user.role === "Admin") {
    try {
      const {
        supplierName,
        total_Payment_In,
        total_Cash_Out,
        total_Visa_Price_In_Curr,
        open, close
      } = req.body;

      const newToatlPaymentIn = parseInt(total_Payment_In, 10);
      const newTotalCashOut = parseInt(total_Cash_Out, 10);
      const newTotalVPIC = parseInt(total_Visa_Price_In_Curr, 10);

      const existingSupplier = await Agents.findOne({
        "payment_In_Schema.supplierName": supplierName,
      });
      if (!existingSupplier) {
        res.status(404).json({ message: "Agent not found" });
        return;
      }

      // Update the payment details
      const updatedTotalCashOut =
        existingSupplier.payment_In_Schema.total_Cash_Out - newTotalCashOut;
      const updatedTotalPaymentIn =
        existingSupplier.payment_In_Schema.total_Payment_In -
        newToatlPaymentIn
      const updatedTotalVPIC =
        existingSupplier.payment_In_Schema.total_Payment_In_Curr -
          newTotalVPIC ? newTotalVPIC : 0;
      const newBalance = updatedTotalCashOut - updatedTotalPaymentIn;

      // Update the payment details
      existingSupplier.payment_In_Schema.total_Cash_Out +=
        -updatedTotalCashOut;
      existingSupplier.payment_In_Schema.total_Payment_In +=
        -updatedTotalPaymentIn;
      existingSupplier.payment_In_Schema.total_Payment_In_Curr +=
        -updatedTotalVPIC;
      existingSupplier.payment_In_Schema.remaining_Curr +=
        -updatedTotalVPIC;
      existingSupplier.payment_In_Schema.remaining_Balance += -newBalance;
      existingSupplier.payment_In_Schema.open = open
      existingSupplier.payment_In_Schema.close = close
      const cashInHandDoc = await CashInHand.findOne({});

      if (!cashInHandDoc) {
        const newCashInHandDoc = new CashInHand();
        await newCashInHandDoc.save();
      }

      const cashInHandUpdate = {
        $inc: {}
      };
      cashInHandUpdate.$inc.total_Cash = -newBalance

      await CashInHand.updateOne({}, cashInHandUpdate);
      // Save the updated supplier
      await existingSupplier.save();

      
      res.status(200).json({
        message: "Payment In details updated successfully",
       
      });
    } catch (error) {
      console.error("Error updating payment details:", error);
      res.status(500).json({
        message: "Error updating payment details",
        error: error.message,
      });
    }
  }
}


//deleting the Agent payment_In_Schema
const deleteAgentPaymentInSchema = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }

  try {
    const { supplierName } = req.body;

    const existingSupplier = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      res.status(404).json({ message: "Agent not found" });
      return;
    }

    const cashInHandDoc = await CashInHand.findOne({});

    if (!cashInHandDoc) {
      const newCashInHandDoc = new CashInHand();
      await newCashInHandDoc.save();
    }

    const cashInHandUpdate = {
      $inc: {}
    };


    cashInHandUpdate.$inc.total_Cash = -existingSupplier.payment_In_Schema.total_Payment_In
    cashInHandUpdate.$inc.total_Cash = existingSupplier.payment_In_Schema.total_Cash_Out


    await CashInHand.updateOne({}, cashInHandUpdate);

    // Delete the payment_In_Schema
    existingSupplier.payment_In_Schema = undefined;

    // Save the updated supplier without payment_In_Schema
    await existingSupplier.save();

  
    res.status(200).json({
      message: `${supplierName} deleted successfully`,
      
    });
  } catch (error) {
    console.error("Error deleting payment_In_Schema:", error);
    res.status(500).json({
      message: "Error deleting payment_In_Schema",
      error: error.message,
    });
  }
}



// Deleting a PaymentIn Person

const deletePaymentInPerson = async (req, res) => {

  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }

  if (user && user.role === "Admin") {
    const { personId, supplierName, visa_Price_In_PKR, visa_Price_In_Curr,newStatus } =
      req.body;

    const existingSupplier = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
      "payment_In_Schema._id": newStatus,

    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
      });
    }

    try {
      // Add this line for logging

      await existingSupplier.updateOne({
        $inc: {
          "payment_In_Schema.remaining_Balance": -visa_Price_In_PKR,
          "payment_In_Schema.total_Visa_Price_In_PKR": -visa_Price_In_PKR,
          'payment_In_Schema.total_Visa_Price_In_Curr': visa_Price_In_Curr ? -visa_Price_In_Curr : 0,
          'payment_In_Schema.remaining_Curr': visa_Price_In_Curr ? -visa_Price_In_Curr : 0,

        },

        $pull: {
          "payment_In_Schema.persons": { _id: personId },
        },
      });
      const newNotification=new Notifications({
        type:"Agent Payment In Person Deleted",
        content:`${user.userName} deleted Person having Visa Price In PKR: ${visa_Price_In_PKR} of Agent:${supplierName}`,
        date: new Date().toISOString().split("T")[0]

      })
      await newNotification.save()
    
      res.status(200).json({
        message: `Person with ID ${personId} deleted successfully from ${supplierName}`,
      });
    } catch (error) {
      console.error("Error updating values:", error);
      res
        .status(500)
        .json({ message: "Error updating values", error: error.message });
    }
  }
}



// Updating Payments in Person

const updatePaymentInPerson=async(req,res)=>{
  
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }

  if (user && user.role === "Admin") {
    try {

      const {supplierName,newStatus,personId,name,pp_No,status,company,country,entry_Mode,final_Status,trade,flight_Date,visa_Price_In_PKR,visa_Price_In_Curr} =
      req.body;
     
      let entryMode
     
      const existingSupplier = await Agents.findOne({
        "payment_In_Schema.supplierName": supplierName,
        "payment_In_Schema._id": newStatus,

      });

      const new_Visa_Price_PKR=Number(visa_Price_In_PKR)
      const new_Visa_Price_Cur=Number(visa_Price_In_Curr)
      let visa_Price_PKR=0
      let visa_Price_Curr=0

      if(existingSupplier){
        const personIn = existingSupplier.payment_In_Schema.persons.find(person => person._id.toString() === personId.toString());
        if (personIn) {
          
        if(final_Status.toLowerCase()==='offer letter' || final_Status.toLowerCase()==='offer_letter'){
          const newReminder=new Reminders({
            type:"Offer Letter",
            content:`${name}'s Final Status is updated to Offer Letter.`,
            date:new Date().toISOString().split("T")[0]
          })
          await newReminder.save()
        }
        if(final_Status.toLowerCase()==='e number' || final_Status.toLowerCase()==='e_number'){
          const newReminder=new Reminders({
            type:"E Number",
            content:`${name}'s Final Status is updated to E Number.`,
            date:new Date().toISOString().split("T")[0]

          })
          await newReminder.save()
        }

        if(final_Status.toLowerCase()==='qvc' || final_Status.toLowerCase()==='q_v_c'){
          const newReminder=new Reminders({
            type:"QVC",
            content:`${name}'s Final Status is updated to QVC.`,
            date:new Date().toISOString().split("T")[0]

          })
          await newReminder.save()
        }
        if(final_Status.toLowerCase()==='visa issued' || final_Status.toLowerCase()==='visa_issued' || final_Status.toLowerCase()==='vissa issued'  || final_Status.toLowerCase()==='vissa_issued'){
          const newReminder=new Reminders({
            type:"Visa Issued",
            content:`${name}'s Final Status is updated to Visa Issued.`,
            date:new Date().toISOString().split("T")[0]

          })
          await newReminder.save()
        }
        if(final_Status.toLowerCase()==='ptn' || final_Status.toLowerCase()==='p_t_n'){
          const newReminder=new Reminders({
            type:"PTN",
            content:`${name}'s Final Status is updated to PTN.`,
            date:new Date().toISOString().split("T")[0]
          })
          await newReminder.save()
        }

        if(final_Status.toLowerCase()==='ticket' || final_Status.toLowerCase()==='tiket'){
          const newReminder=new Reminders({
            type:"Ticket",
            content:`${name}'s Final Status is updated to Ticket.`,
            date:new Date().toISOString().split("T")[0]
          })
          await newReminder.save()
        }
        
          entryMode=personIn.entry_Mode
          visa_Price_PKR=new_Visa_Price_PKR-personIn.visa_Price_In_PKR
          visa_Price_Curr=new_Visa_Price_Cur-personIn.visa_Price_In_Curr

            personIn.company = company;
            personIn.country = country;
            personIn.entry_Mode = entry_Mode;
            personIn.final_Status = final_Status;
            personIn.trade = trade;
            personIn.status = status;
            personIn.visa_Price_In_PKR = new_Visa_Price_PKR;
            personIn.visa_Price_In_Curr = visa_Price_Curr;
            personIn.remaining_Price += visa_Price_PKR;
            personIn.remaining_Curr += visa_Price_Curr;
            personIn.flight_Date = flight_Date?flight_Date:'Not Fly';

            // updating overall visa prices
            existingSupplier.payment_In_Schema.total_Visa_Price_In_PKR+=visa_Price_PKR
            existingSupplier.payment_In_Schema.remaining_Balance-=visa_Price_PKR

            existingSupplier.payment_In_Schema.total_Visa_Price_In_Curr+=visa_Price_Curr
            existingSupplier.payment_In_Schema.remaining_Curr-=visa_Price_Curr
            await existingSupplier.save()
        } else {
         
            res.status(404).json({message:`person with ID: ${personId} not found`})
            return;
        }
      }

       // Updating in Agents both Schema
       const suppliers=await Agents.find({})

      for(const agent of suppliers){

if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons)
{
  const personOut= agent.payment_Out_Schema.persons.find(person=> person.name ===name.toString() && person.pp_No===pp_No.toString() && person.entry_Mode===entryMode.toString())
       if(personOut){
        personOut.company=company
        personOut.country=country
        personOut.entry_Mode=entry_Mode
        personOut.final_Status=final_Status
        personOut.trade=trade
        personOut.flight_Date=flight_Date?flight_Date:'Not Fly'
        await agent.save()
       }
}
     
      }


const agents=await Suppliers.find({})
for(const supplier of agents){
  if (supplier.payment_In_Schema && supplier.payment_In_Schema.persons) {
    const personIn = supplier.payment_In_Schema.persons.find(person=> person.name ===name.toString() && person.pp_No===pp_No.toString() && person.entry_Mode===entryMode.toString());
    if (personIn) {
        personIn.company = company;
        personIn.country = country;
        personIn.entry_Mode = entry_Mode;
        personIn.final_Status = final_Status;
        personIn.trade = trade;
        personIn.flight_Date = flight_Date?flight_Date:'Not Fly';
        await supplier.save()

    } 
} 

if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons)
{
const personOut= supplier.payment_Out_Schema.persons.find(person=> person.name ===name.toString() && person.pp_No===pp_No.toString() && person.entry_Mode===entryMode.toString())
 if(personOut){
  personOut.company=company
  personOut.country=country
  personOut.entry_Mode=entry_Mode
  personOut.final_Status=final_Status
  personOut.trade=trade
  personOut.flight_Date=flight_Date?flight_Date:'Not Fly'
  await supplier.save()

 }
}

}


const candidateIn=await Candidate.findOne({
  "payment_In_Schema.supplierName": name.toString(),
  "payment_In_Schema.entry_Mode": entryMode.toString(),
  "payment_In_Schema.pp_No": pp_No.toString(),
})
if(candidateIn){
  candidateIn.payment_In_Schema.company=company
  candidateIn.payment_In_Schema.country=country
  candidateIn.payment_In_Schema.entry_Mode=entry_Mode
  candidateIn.payment_In_Schema.final_Status=final_Status
  candidateIn.payment_In_Schema.trade=trade
  candidateIn.payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
  await candidateIn.save()

}

const candidateOut=await Candidate.findOne({
  "payment_Out_Schema.supplierName": name.toString(),
  "payment_Out_Schema.entry_Mode": entryMode.toString(),
  "payment_Out_Schema.pp_No": pp_No.toString(),
})
if(candidateOut){
  candidateOut.payment_Out_Schema.company=company
  candidateOut.payment_Out_Schema.country=country
  candidateOut.payment_Out_Schema.entry_Mode=entry_Mode
  candidateOut.payment_Out_Schema.final_Status=final_Status
  candidateOut.payment_Out_Schema.trade=trade
  candidateOut.payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
  await candidateOut.save()

}

      
       const ticketSuppliers=await TicketSuppliers.find({})
       for(const ticketSupplier of ticketSuppliers){
        
        if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
          const SupPersonIn= ticketSupplier.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonIn){
            SupPersonIn.company=company
            SupPersonIn.country=country
            SupPersonIn.entry_Mode=entry_Mode
            SupPersonIn.final_Status=final_Status
            SupPersonIn.trade=trade
            SupPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
           await ticketSupplier.save()

          }
        }

        if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
          const SupPersonOut= ticketSupplier.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonOut){
            SupPersonOut.company=company
            SupPersonOut.country=country
            SupPersonOut.entry_Mode=entry_Mode
            SupPersonOut.final_Status=final_Status
            SupPersonOut.trade=trade
            SupPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
           await ticketSupplier.save()

          }
        }
       
       }
       
       const ticketAgents=await TicketAgents.find({})

       for (const ticketAgent of ticketAgents){
        if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
          const AgentPersonIn= ticketAgent.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(AgentPersonIn){
            AgentPersonIn.company=company
            AgentPersonIn.country=country
            AgentPersonIn.entry_Mode=entry_Mode
            AgentPersonIn.final_Status=final_Status
            AgentPersonIn.trade=trade
            AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
           await ticketAgent.save()

          }
        }
       
        if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
          const AgentPersonOut= ticketAgent.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(AgentPersonOut){
            AgentPersonOut.company=company
            AgentPersonOut.country=country
            AgentPersonOut.entry_Mode=entry_Mode
            AgentPersonOut.final_Status=final_Status
            AgentPersonOut.trade=trade
            AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
           await ticketAgent.save()

          }
        }
       }


       const visitSuppliers=await VisitSuppliers.find({})
       for(const visitSupplier of visitSuppliers){
 
        if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
          const SupPersonIn= visitSupplier.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonIn){
            SupPersonIn.company=company
            SupPersonIn.country=country
            SupPersonIn.entry_Mode=entry_Mode
            SupPersonIn.final_Status=final_Status
            SupPersonIn.trade=trade
            SupPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
           await visitSupplier.save()

          }
        }

        if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
          const SupPersonOut= visitSupplier.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonOut){
            SupPersonOut.company=company
            SupPersonOut.country=country
            SupPersonOut.entry_Mode=entry_Mode
            SupPersonOut.final_Status=final_Status
            SupPersonOut.trade=trade
            SupPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
           await visitSupplier.save()

          }
        }
      

       }

       const visitAgents=await VisitAgents.find({})
for (const visitAgent of visitAgents){
  if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
    const AgentPersonIn= visitAgent.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
    if(AgentPersonIn){
      AgentPersonIn.company=company
      AgentPersonIn.country=country
      AgentPersonIn.entry_Mode=entry_Mode
      AgentPersonIn.final_Status=final_Status
      AgentPersonIn.trade=trade
      AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
     await visitAgent.save()

    }
  }
 
  if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
    const AgentPersonOut= visitAgent.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
    if(AgentPersonOut){
      AgentPersonOut.company=company
      AgentPersonOut.country=country
      AgentPersonOut.entry_Mode=entry_Mode
      AgentPersonOut.final_Status=final_Status
      AgentPersonOut.trade=trade
      AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
     await visitAgent.save()

    }
  }
}

       const azadSuppliers=await AzadSupplier.find({})
       for(const azadSupplier of azadSuppliers){
        if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
          const SupPersonIn= azadSupplier.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonIn){
            SupPersonIn.company=company
            SupPersonIn.country=country
            SupPersonIn.entry_Mode=entry_Mode
            SupPersonIn.final_Status=final_Status
            SupPersonIn.trade=trade
            SupPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
           await azadSupplier.save()

          }
        }
      
 
        if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
          const SupPersonOut= azadSupplier.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonOut){
            SupPersonOut.company=company
            SupPersonOut.country=country
            SupPersonOut.entry_Mode=entry_Mode
            SupPersonOut.final_Status=final_Status
            SupPersonOut.trade=trade
            SupPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
           await azadSupplier.save()

          }
  
        }
       
      
       }


       const azadAgents=await AzadAgents.find({})
for (const azadAgent of azadAgents){
  if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
    const AgentPersonIn= azadAgent.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
    if(AgentPersonIn){
      AgentPersonIn.company=company
      AgentPersonIn.country=country
      AgentPersonIn.entry_Mode=entry_Mode
      AgentPersonIn.final_Status=final_Status
      AgentPersonIn.trade=trade
      AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
     await azadAgent.save()

    }
  }
 
  if(azadAgent.payment_Out_Schema && azadAgent.payment_Out_Schema.persons){
    const AgentPersonOut= azadAgent.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
    if(AgentPersonOut){
      AgentPersonOut.company=company
      AgentPersonOut.country=country
      AgentPersonOut.entry_Mode=entry_Mode
      AgentPersonOut.final_Status=final_Status
      AgentPersonOut.trade=trade
      AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
     await azadAgent.save()
      
    }
  }
}
     
const azadCandidateIn=await AzadCandidate.findOne({
  "payment_In_Schema.supplierName": name,
  "payment_In_Schema.entry_Mode": entryMode,
  "payment_In_Schema.pp_No": pp_No,
})
if(azadCandidateIn){
  azadCandidateIn.payment_In_Schema.company=company
  azadCandidateIn.payment_In_Schema.country=country
  azadCandidateIn.payment_In_Schema.entry_Mode=entry_Mode
  azadCandidateIn.payment_In_Schema.final_Status=final_Status
  azadCandidateIn.payment_In_Schema.trade=trade
  azadCandidateIn.payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
  await azadCandidateIn.save()

}

const azadCandidateOut=await AzadCandidate.findOne({
  "payment_Out_Schema.supplierName": name,
  "payment_Out_Schema.entry_Mode": entryMode,
  "payment_Out_Schema.pp_No": pp_No,
})
if(azadCandidateOut){
  azadCandidateOut.payment_Out_Schema.company=company
  azadCandidateOut.payment_Out_Schema.country=country
  azadCandidateOut.payment_Out_Schema.entry_Mode=entry_Mode
  azadCandidateOut.payment_Out_Schema.final_Status=final_Status
  azadCandidateOut.payment_Out_Schema.trade=trade
  azadCandidateOut.payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
  await azadCandidateOut.save()

}


   const ticketCandidateIn=await TicketCandidate.findOne({
    "payment_In_Schema.supplierName": name,
    "payment_In_Schema.entry_Mode": entryMode,
    "payment_In_Schema.pp_No": pp_No,
  })
  if(ticketCandidateIn){
    ticketCandidateIn.payment_In_Schema.company=company
    ticketCandidateIn.payment_In_Schema.country=country
    ticketCandidateIn.payment_In_Schema.entry_Mode=entry_Mode
    ticketCandidateIn.payment_In_Schema.final_Status=final_Status
    ticketCandidateIn.payment_In_Schema.trade=trade
    ticketCandidateIn.payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
    await ticketCandidateIn.save()

  }
  
  const ticketCandidateOut=await TicketCandidate.findOne({
    "payment_Out_Schema.supplierName": name,
    "payment_Out_Schema.entry_Mode": entryMode,
    "payment_Out_Schema.pp_No": pp_No,
  })
  if(ticketCandidateOut){
    ticketCandidateOut.payment_Out_Schema.company=company
    ticketCandidateOut.payment_Out_Schema.country=country
    ticketCandidateOut.payment_Out_Schema.entry_Mode=entry_Mode
    ticketCandidateOut.payment_Out_Schema.final_Status=final_Status
    ticketCandidateOut.payment_Out_Schema.trade=trade
    ticketCandidateOut.payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
    await ticketCandidateOut.save()

  }
  

   const visitCandidateIn=await VisitCandidate.findOne({
    "payment_In_Schema.supplierName": name,
    "payment_In_Schema.entry_Mode": entryMode,
    "payment_In_Schema.pp_No": pp_No,
  })
  if(visitCandidateIn){
    visitCandidateIn.payment_In_Schema.company=company
    visitCandidateIn.payment_In_Schema.country=country
    visitCandidateIn.payment_In_Schema.entry_Mode=entry_Mode
    visitCandidateIn.payment_In_Schema.final_Status=final_Status
    visitCandidateIn.payment_In_Schema.trade=trade
    visitCandidateIn.payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
    await visitCandidateIn.save()

  }
  
  const visitCandidateOut=await VisitCandidate.findOne({
    "payment_Out_Schema.supplierName": name,
    "payment_Out_Schema.entry_Mode": entryMode,
    "payment_Out_Schema.pp_No": pp_No,
  })
  if(visitCandidateOut){
    visitCandidateOut.payment_Out_Schema.company=company
    visitCandidateOut.payment_Out_Schema.country=country
    visitCandidateOut.payment_Out_Schema.entry_Mode=entry_Mode
    visitCandidateOut.payment_Out_Schema.final_Status=final_Status
    visitCandidateOut.payment_Out_Schema.trade=trade
    visitCandidateOut.payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
    await visitCandidateOut.save()
  }



   const protectors=await Protector.find({})
   for(const protector of protectors){
    if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
      const personOut= protector.payment_Out_Schema.persons.find(person=> person.name ===name.toString() && person.pp_No===pp_No.toString() && person.entry_Mode===entryMode.toString())
      if(personOut){
       personOut.company=company
       personOut.country=country
       personOut.entry_Mode=entry_Mode
       personOut.final_Status=final_Status
       personOut.trade=trade
       personOut.flight_Date=flight_Date?flight_Date:'Not Fly'
       await protector.save()

      }
    }
  }

const entry=await Entries.findOne({name,pp_No,entry_Mode:entryMode})

if(entry){
  entry.company=company
  entry.country=country
  entry.entry_Mode=entry_Mode
  entry.final_Status=final_Status
  entry.trade=trade
  entry.visa_Sales_Rate_PKR=new_Visa_Price_PKR
  entry.visa_Sale_Rate_Oth_Cur=new_Visa_Price_Cur
  entry.flight_Date=flight_Date?flight_Date:'Not Fly'
  await entry.save()

}
const newNotification=new Notifications({
  type:"Agent Payment In Person Updated",
  content:`${user.userName} updated Person :${name} of Agent:${supplierName}`,
  date: new Date().toISOString().split("T")[0]

})
await newNotification.save()


    res.status(200).json({message:`${name} updated successfully!`})
console.log('updated successfully!')
   
  
    } catch (error) {
      console.error('Error:', error);
    res.status(500).json({ message: error });
      
    }
    

  }


}


// changing Status 
const changePaymentInStatus = async (req, res) => {
  try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      const{supplierName,newStatus,multipleIds,convert}=req.body
      
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      
      const existingSupplier = await Agents.findOne({
          "payment_In_Schema.supplierName": supplierName,
          "payment_In_Schema._id": newStatus,
      });

      if (!existingSupplier) {
          return res.status(404).json({ message: "Agent not found" });
      }

      // Update status of all persons to false
      if (existingSupplier.payment_In_Schema && existingSupplier.payment_In_Schema.persons) {
        if(multipleIds.length>0){
          for(const myId of multipleIds){
            const allPersons=existingSupplier.payment_In_Schema.persons
            for (const person of allPersons){
              if(person._id.toString()===myId.toString() && person.status.toLowerCase()==='open'){
              person.status = "Closed"
              }
            }
          }
        }
        
      }
      if (existingSupplier.payment_In_Schema.status==="Open") {
        existingSupplier.payment_In_Schema.closing=existingSupplier.payment_In_Schema.total_Visa_Price_In_PKR-existingSupplier.payment_In_Schema.total_Payment_In+existingSupplier.payment_In_Schema.total_Cash_Out
       
    }
      // Toggle the status of the payment in schema
      existingSupplier.payment_In_Schema.status = 'Closed';

      // Save changes to the database
      await existingSupplier.save();

      const newSupplier=new Agents({
        payment_In_Schema:{
          supplier_Id: new mongoose.Types.ObjectId(),
          supplierName:existingSupplier.payment_In_Schema.supplierName,
          total_Visa_Price_In_PKR:0,
          remaining_Balance:convert.toLowerCase()==='yes'?(existingSupplier.remaining_Balance):0,
          total_Payment_In:0,
          total_Visa_Price_In_Curr:0,
          remaining_Curr:convert.toLowerCase()==='yes'?(existingSupplier.remaining_Curr):0,
          closing:0,
          opening:convert.toLowerCase()==='yes'?(existingSupplier.payment_In_Schema.remaining_Balance):0,
          curr_Country:existingSupplier.payment_In_Schema.curr_Country,
        }
      })
      await newSupplier.save()
      // Prepare response message based on the updated status
      let responseMessage;
       
          responseMessage = `Khata Closed with ${supplierName} and new Khata created Successfully!`;
          const newNotification=new Notifications({
            type:"Khata Closed of Agent Payment In",
            content:`${user.userName} Closed Khata with Agent:${supplierName} and new Khata created successfully`,
            date: new Date().toISOString().split("T")[0]
  
          })
          await newNotification.save()
      

      return res.status(200).json({ message: responseMessage });
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: "Internal server error" });
  }
}




// Getting All Supplier Payments In
const getAllPaymentsIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role === "Admin") {
      const supplierPayments = await Agents.find({}).sort({ createdAt: -1 });
      const formattedDetails = supplierPayments
        .filter((supplier) => supplier.payment_In_Schema) // Filter out entries with empty payment_In_Schema
        .map((supplier) => {
          const paymentInSchema = supplier.payment_In_Schema;

          return {
            supplier_Id: paymentInSchema.supplier_Id,
            _id: paymentInSchema._id,
            supplierName: paymentInSchema.supplierName,
            total_Visa_Price_In_Curr: paymentInSchema.total_Visa_Price_In_Curr,
            total_Payment_In_Curr: paymentInSchema.total_Payment_In_Curr,
            remaining_Curr: paymentInSchema.remaining_Curr,

            total_Visa_Price_In_PKR: paymentInSchema.total_Visa_Price_In_PKR,
            total_Payment_In: paymentInSchema.total_Payment_In,
            total_Cash_Out: paymentInSchema.total_Cash_Out,
            remaining_Balance: paymentInSchema.remaining_Balance,
            curr_Country: paymentInSchema.curr_Country,
            persons: paymentInSchema.persons || [],
            payment: paymentInSchema.payment || [],
            candPayments: paymentInSchema.candPayments || [],
            status: paymentInSchema.status ,
            opening: paymentInSchema.opening,
            closing: paymentInSchema.closing,
            createdAt: moment(paymentInSchema.createdAt).format("YYYY-MM-DD"),
            updatedAt: moment(paymentInSchema.updatedAt).format("YYYY-MM-DD"),
          };
        });

      res.status(200).json({ data: formattedDetails });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Adding a new Payment Out
const addPaymentOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user) {
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" });
      }
      if (user.role === "Admin") {
        const {
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
        } = req.body;
        if (!supplierName) {
          return res.status(400).json({ message: "supplier Name is required" });
        }
        if (!category) {
          return res.status(400).json({ message: "Category is required" });
        }
        if (!payment_Via) {
          return res.status(400).json({ message: "Payment Via is required" });
        }
        if (!payment_Type) {
          return res.status(400).json({ message: "Payment Type is required" });
        }

        if (!payment_Out) {
          return res.status(400).json({ message: "Payment Out is required" });
        }

       

        const newPaymentOut = parseInt(payment_Out, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);
        // Fetch the current invoice number and increment it by 1 atomically

        const existingSupplier = await Agents.findOne({
          "payment_Out_Schema.supplierName": supplierName,
          "payment_Out_Schema.status": 'Open',

        });
        if (!existingSupplier) {
          res.status(404).json({
            message: "Agent not Found",
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
          date:date?date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
      
        };

        try {
  
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

            await existingSupplier.save();
          
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
                  content:`${user.userName} added Payment_Out: ${payment_Out} of Agent:${supplierName}`,
                  date: new Date().toISOString().split("T")[0]
        
                })
                await newNotification.save()
              res.status(200).json({
             
              message: `Payment Out: ${payment_Out} added Successfully to ${supplierName}'s Record`,
            });
          
        }
        catch (error) {
          console.error("Error updating values:", error);
          res
            .status(500)
            .json({ message: "Error updating values", error: error.message });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Adding multiple Payment Out
const addMultiplePaymentsOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role !== "Admin") {
      res.status(403).json({ message: "Only Admin is allowed!" });
      return;
    }

    const multiplePayment = req.body;
    
    if (!Array.isArray(multiplePayment) || multiplePayment.length === 0) {
      res.status(400).json({ message: "Invalid request payload" });
      return;
    }

    try {

      let updatedPayments = [];
      let unsavedPayments= [];

      for (const payment of multiplePayment) {
        let {
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
        
        } = payment;
        const newPaymentOut = parseInt(payment_Out, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);
        const suppliers=await Agents.find({})
        let existingSupplier
        let confirmStatus=true


        if(payment_Via){
          const allPaymetVia=await PaymentVia.find({})
          const existingPaymentVia=allPaymetVia.find(p=>p.payment_Via.trim().toLowerCase()==payment_Via.trim().toLowerCase())
          if(!existingPaymentVia){
            payment.paymentViaError='Payment Via not found in setting'
            confirmStatus=false
          }
        }

        if(payment_Type){
          const allPaymetTypes=await PaymentType.find({})
          const existingPaymentType=allPaymetTypes.find(p=>p.payment_Type.trim().toLowerCase()==payment_Type.trim().toLowerCase())
          if(!existingPaymentType){
            payment.paymentTypeError='Payment Type not found in setting'
            confirmStatus=false
          }
        }

        if(category){
          const allCategories=await Categories.find({})
          const existingCategory=allCategories.find(p=>p.category.trim().toLowerCase()==category.trim().toLowerCase())
          if(!existingCategory){
            payment.paymentCategoryError='Payment Category not found in setting'
            confirmStatus=false
          }
        }
        
       for (const supplier of suppliers){
        if(supplier.payment_Out_Schema){
          if(supplier.payment_Out_Schema.supplierName.toLowerCase()===supplierName.toLowerCase()&&supplier.payment_Out_Schema.status.toLowerCase()==='open'){
            existingSupplier = supplier;
            break
          }
         
        }
       }

       if(!existingSupplier){
        payment.nameError='Agent name not found in Payments records'
        confirmStatus=false
       }
       
       if(!confirmStatus){
        unsavedPayments.push(payment)
       }

        if (existingSupplier&& confirmStatus) {
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
          })
        }

        // Use the correct variable name, e.g., existingSupplier instead of existingPayment
        const newPayment = {
          name: supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No: slip_No,
          payment_Out: newPaymentOut,
          slip_Pic: uploadImage?.secure_url || '',
          details,
          payment_Out_Curr: curr_Country ? curr_Country : '',
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date:date?date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,

        };

        updatedPayments.push(newPayment);

        try {
            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Payment_Out": payment_Out,
                "payment_Out_Schema.remaining_Balance": -payment_Out,
                "payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,
                "payment_Out_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
              },
       
              $push: {
                "payment_Out_Schema.payment": newPayment,
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
            await existingSupplier.save();
            
            const newNotification=new Notifications({
              type:"Agent Payment Out",
              content:`${user.userName} added Payment_Out: ${payment_Out} of Agent:${supplierName}`,
              date: new Date().toISOString().split("T")[0]
    
            })
            await newNotification.save()

        }
        catch (error) {
          console.error("Error updating values:", error);
          res
            .status(500)
            .json({ message: "Error updating values", error: error.message });
        }
        }

      
      }
      res.status(200).json({
        data:unsavedPayments,
        message: `${updatedPayments.length} Payments Out added Successfully`,
      });
    } catch (error) {
      console.error("Error updating values:", error);
      res
        .status(500)
        .json({ message: "Error updating values", error: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Adding a new Payment Out Return
const addPaymentOutReturn = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user) {
      if (user.role !== "Admin") {
        res.status(404).json({ message: "Only Admin is allowed!" });
      }
      if (user.role === "Admin") {
        const {
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          cash_Out,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          date,
          cand_Name,
        } = req.body;
        if (!supplierName) {
          return res.status(400).json({ message: "supplier Name is required" });
        }
        if (!category) {
          return res.status(400).json({ message: "Category is required" });
        }
        if (!payment_Via) {
          return res.status(400).json({ message: "Payment Via is required" });
        }
        if (!payment_Type) {
          return res.status(400).json({ message: "Payment Type is required" });
        }

        if (!cash_Out) {
          return res.status(400).json({ message: "Cash Return is required" });
        }

        
        const newCashOut = parseInt(cash_Out, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);
        // Fetch the current invoice number and increment it by 1 atomically

        const existingSupplier = await Agents.findOne({
          "payment_Out_Schema.supplierName": supplierName,
          "payment_Out_Schema.status": "Open",

        });
        if (!existingSupplier) {
          res.status(404).json({
            message: "Agent not Found",
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
          cash_Out: newCashOut,
          slip_Pic: uploadImage?.secure_url || '',
          details,
          payment_Out_Curr: curr_Country ? curr_Country : 0,
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date:date?date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
          cand_Name,
        };

        try {

          if(cand_Name){
            const existPerson = existingSupplier.payment_Out_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
            if (existPerson) {
              existPerson.remaining_Price += newCashOut,
                existPerson.remaining_Curr += newCurrAmount ? newCurrAmount : 0
                existPerson.cash_Out += newCashOut ? newCashOut : 0

            }
            
          // Update total_Visa_Price_In_PKR and other fields using $inc
          await existingSupplier.updateOne({
            $inc: {
              "payment_Out_Schema.total_Cash_Out": newCashOut,
              "payment_Out_Schema.remaining_Balance": newCashOut,
              "payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? -newCurrAmount : 0,
              "payment_Out_Schema.remaining_Curr": newCurrAmount ? newCurrAmount : 0,
            },
        
            $push: {
              "payment_Out_Schema.payment": payment,
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
          if (payment_Via.toLowerCase() === "cash" ) {
            cashInHandUpdate.$inc.cash = newCashOut;
            cashInHandUpdate.$inc.total_Cash = newCashOut;
          }
          else{
            cashInHandUpdate.$inc.bank_Cash = newCashOut;
            cashInHandUpdate.$inc.total_Cash = newCashOut;
          }

          await CashInHand.updateOne({}, cashInHandUpdate);
          const newBackup=new Backup({
            name: supplierName,
            category:category,
            payment_Via:payment_Via,
            payment_Type:payment_Type,
            slip_No: slip_No ? slip_No : '',
            cash_Out: newCashOut,
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

       

          const newNotification=new Notifications({
            type:"Agent Payment Out Return",
            content:`${user.userName} added Payment_Return: ${cash_Out} to Candidate: ${cand_Name} of Agent:${supplierName}`,
            date: new Date().toISOString().split("T")[0]
  
          })
          await newNotification.save()
          res.status(200).json({
            
            message: `Cash Out: ${cash_Out} added Successfully to ${supplierName}'s Record`,
          });

          }
          else{
            
          // Update total_Visa_Price_In_PKR and other fields using $inc
          await existingSupplier.updateOne({
            $inc: {
              
              "payment_Out_Schema.total_Cash_Out": newCashOut,
              "payment_Out_Schema.remaining_Balance": newCashOut,
              "payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? -newCurrAmount : 0,
              "payment_Out_Schema.remaining_Curr": newCurrAmount ? newCurrAmount : 0,
            },
            $push: {
              "payment_Out_Schema.payment": payment,
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

          if (payment_Via.toLowerCase() === "cash" ) {
            cashInHandUpdate.$inc.cash = newCashOut;
            cashInHandUpdate.$inc.total_Cash = newCashOut;
          }
          else{
            cashInHandUpdate.$inc.bank_Cash = newCashOut;
            cashInHandUpdate.$inc.total_Cash = newCashOut;
          }

          await CashInHand.updateOne({}, cashInHandUpdate);
          const newBackup=new Backup({
            name: supplierName,
            category:category,
            payment_Via:payment_Via,
            payment_Type:payment_Type,
            slip_No: slip_No ? slip_No : '',
            cash_Out: newCashOut,
            slip_Pic: uploadImage?.secure_url || '',
            details:details,
            payment_Out_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date:new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
              })
              await newBackup.save()
              
          await existingSupplier.save();
          const newNotification=new Notifications({
            type:"Agent Payment Out Return",
            content:`${user.userName} added Payment_Return: ${cash_Out} of Agent:${supplierName}`,
            date: new Date().toISOString().split("T")[0]
  
          })
          await newNotification.save()
          res.status(200).json({
           
            message: `Cash Out: ${cash_Out} added Successfully to ${supplierName}'s Record`,
          });
          }

        } catch (error) {
          console.error("Error updating values:", error);
          res
            .status(500)
            .json({ message: "Error updating values", error: error.message });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deleting a single Payment Out

const deleteSinglePaymentOut = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }

  if (user && user.role === "Admin") {
    const {
      paymentId,
      payment_Out,
      curr_Amount,
      supplierName,
      cash_Out,
      payment_Via,
      newStatus
    } = req.body;


    const existingSupplier = await Agents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
      "payment_Out_Schema._id": newStatus,
    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
      });
    }

    const newPaymentOut = payment_Out - cash_Out;

    try {
      let paymentToDelete=existingSupplier.payment_Out_Schema.payment.find((p)=>p._id.toString()===paymentId.toString())
      const newRecycle=new RecycleBin({
        name:supplierName,
        type:"Agent Payment Out",
        category:paymentToDelete.category,
        payment_Via:paymentToDelete.payment_Via,
        payment_Type:paymentToDelete.payment_Type,
        slip_No:paymentToDelete.slip_No,
        payment_Out:paymentToDelete.payment_Out,
        cash_Out:paymentToDelete.cash_Out,
        payment_Out_Curr:paymentToDelete.payment_Out_Curr,
        slip_Pic:paymentToDelete.slip_Pic,
        date:paymentToDelete.date,
        curr_Rate:paymentToDelete.curr_Rate,
        curr_Amount:paymentToDelete.curr_Amount,
        invoice:paymentToDelete.invoice

      })
      await newRecycle.save()
      // Update total_Visa_Price_In_PKR and other fields using $inc
      await existingSupplier.updateOne({
        $inc: {
          "payment_Out_Schema.total_Payment_Out": -payment_Out,
          "payment_Out_Schema.total_Cash_Out": -cash_Out,
          "payment_Out_Schema.remaining_Balance": newPaymentOut,
          "payment_Out_Schema.total_Payment_Out_Curr": curr_Amount ? -curr_Amount : 0,
          "payment_Out_Schema.remaining_Curr": curr_Amount ? curr_Amount : 0,
        },

        $pull: {
          "payment_Out_Schema.payment": { _id: paymentId },
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

    
      if (payment_Via.toLowerCase() === "cash" ) {
        cashInHandUpdate.$inc.cash = newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = newPaymentOut;
      }
      else{
        cashInHandUpdate.$inc.bank_Cash = newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = newPaymentOut;
      }

      await CashInHand.updateOne({}, cashInHandUpdate);
      await existingSupplier.save()

      const newNotification=new Notifications({
        type:"Agent Payment Out Deleted",
        content:`${user.userName} deleted ${payment_Out ? "Payment_Out":"Cash_Retrun"}: ${payment_Out ? payment_Out :cash_Out} of Agent:${supplierName}`,
        date: new Date().toISOString().split("T")[0]

      })
      await newNotification.save()
      
      res.status(200).json({
        message: `Payment Out deleted sucessfully from ${supplierName}`,
      });
    
      
    } catch (error) {
      console.error("Error updating values:", error);
      res
        .status(500)
        .json({ message: "Error updating values", error: error.message });
    }
  }
};

// Updating a single Payment Out Details
const updateSinglePaymentOut = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }
  if (user && user.role === "Admin") {
    const {
      supplierName,
      paymentId,
      category,
      payment_Via,
      payment_Type,
      slip_No,
      details,
      payment_Out,
      curr_Country,
      curr_Rate,
      curr_Amount,
      slip_Pic,
      date,
      cash_Out,
      newStatus
    } = req.body;
    const newPaymentOut = parseInt(payment_Out, 10);
    const newCashOut = parseInt(cash_Out, 10);
    const newCurrAmount = parseInt(curr_Amount, 10);

    try {
      const existingSupplier = await Agents.findOne({
        "payment_Out_Schema.supplierName": supplierName,
      "payment_Out_Schema._id": newStatus,

      });

      if (!existingSupplier) {
        res.status(404).json({ message: "Agent not found" });
        return;
      }

      // Find the payment within the payment array using paymentId
      const paymentToUpdate = existingSupplier.payment_Out_Schema.payment.find(
        (payment) => payment._id.toString() === paymentId
      );

      if (!paymentToUpdate) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }

      const updatedCashout = paymentToUpdate.cash_Out - newCashOut;
      const updatedPaymentOut = paymentToUpdate.payment_Out - payment_Out;
      const updateCurr_Amount = newCurrAmount - paymentToUpdate.curr_Amount;
      const newBalance = updatedCashout - updatedPaymentOut;

      let uploadImage;

      if (slip_Pic) {
        uploadImage = await cloudinary.uploader.upload(slip_Pic, {
          upload_preset: "rozgar",
        })
      }
        
      await existingSupplier.updateOne({
        $inc: {
          "payment_Out_Schema.total_Payment_Out": -updatedPaymentOut,
          "payment_Out_Schema.total_Cash_Out": -updatedCashout,
          "payment_Out_Schema.remaining_Balance": -newBalance,
          "payment_Out_Schema.total_Payment_Out_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
          "payment_Out_Schema.remaining_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,

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

     
      if (payment_Via.toLowerCase() === "cash" ) {
        cashInHandUpdate.$inc.cash = -newBalance;
        cashInHandUpdate.$inc.total_Cash = -newBalance;
      }
      else{
        cashInHandUpdate.$inc.bank_Cash = -newBalance;
        cashInHandUpdate.$inc.total_Cash = -newBalance;
      }

      await CashInHand.updateOne({}, cashInHandUpdate);

      // Adding a delay for demonstration purposes

      // Update the payment details
      paymentToUpdate.category = category;
      paymentToUpdate.payment_Via = payment_Via;
      paymentToUpdate.payment_Type = payment_Type;
      paymentToUpdate.slip_No = slip_No;
      paymentToUpdate.details = details;
      paymentToUpdate.payment_Out = newPaymentOut;
      paymentToUpdate.cash_Out = newCashOut;
      if (slip_Pic && uploadImage) {
        paymentToUpdate.slip_Pic = uploadImage.secure_url;
      };
      paymentToUpdate.payment_Out_Curr = curr_Country;
      paymentToUpdate.curr_Rate = curr_Rate;
      paymentToUpdate.curr_Amount = curr_Amount;
      paymentToUpdate.date = date;
      // Save the updated supplier
      await existingSupplier.save();

      const newNotification=new Notifications({
        type:"Agent Payment Out Updated",
        content:`${user.userName} updated Payment_Out: ${payment_Out} of Agent:${supplierName}`,
        date: new Date().toISOString().split("T")[0]

      })
      await newNotification.save()

      await existingSupplier.save();

      res.status(200).json({
        message: "Payment Out details updated successfully",
        
      });
      

    } catch (error) {
      console.error("Error updating payment details:", error);
      res.status(500).json({
        message: "Error updating payment details",
        error: error.message,
      });
    }
  }
};

const deletePaymentOutPerson = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }

  if (user && user.role === "Admin") {
    const { personId, supplierName, visa_Price_Out_PKR, visa_Price_Out_Curr,newStatus } =
      req.body;
    // console.log(personId, supplierName, visa_Price_Out_PKR);
    const newVisa_Price_Out_PKR = parseInt(visa_Price_Out_PKR, 10);
    const newVisa_Price_Out_Curr = parseInt(visa_Price_Out_Curr, 10);
    const existingSupplier = await Agents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
      "payment_Out_Schema._id": newStatus,

    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
      });
    }

    try {
      // Add this line for logging

      await existingSupplier.updateOne({
        $inc: {
          "payment_Out_Schema.remaining_Balance": -newVisa_Price_Out_PKR,
          "payment_Out_Schema.total_Visa_Price_Out_PKR": -newVisa_Price_Out_PKR,
          'payment_Out_Schema.total_Visa_Price_Out_Curr': newVisa_Price_Out_Curr ? -newVisa_Price_Out_Curr : 0,
          'payment_Out_Schema.remaining_Curr': newVisa_Price_Out_Curr ? -newVisa_Price_Out_Curr : 0,
        },

        $pull: {
          "payment_Out_Schema.persons": { _id: personId },
        },
      });

      const newNotification=new Notifications({
        type:"Agent Payment Out Person Deleted",
        content:`${user.userName} deleted Person having Visa Price In PKR: ${visa_Price_Out_PKR} of Agent:${supplierName}`,
        date: new Date().toISOString().split("T")[0]

      })
      await newNotification.save()

      res.status(200).json({
        message: `Person with ID ${personId} deleted successfully from ${supplierName}`,
      });
    } catch (error) {
      console.error("Error updating values:", error);
      res
        .status(500)
        .json({ message: "Error updating values", error: error.message });
    }
  }
};



// Updating a single Agent Total Payment Out Details
const updateAgentTotalPaymentOut = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }
  if (user && user.role === "Admin") {
    try {
      const {
        supplierName,
        total_Payment_Out,
        total_Cash_Out,
        total_Visa_Price_Out_Curr,
        open,
        close
      } = req.body;

      const newToatlPaymentOut = parseInt(total_Payment_Out, 10);
      const newTotalCashOut = parseInt(total_Cash_Out, 10);
      const newTotalVPOC = parseInt(total_Visa_Price_Out_Curr, 10);

      const existingSupplier = await Agents.findOne({
        "payment_Out_Schema.supplierName": supplierName,
      });
      if (!existingSupplier) {
        res.status(404).json({ message: "Agent not found" });
        return;
      }

      const updatedTotalCashout =
        existingSupplier.payment_Out_Schema.total_Cash_Out - newTotalCashOut;
      const updatedTotalPaymentOut =
        existingSupplier.payment_Out_Schema.total_Payment_Out - newToatlPaymentOut;
      const updatedTotalVPOC =
        existingSupplier.payment_Out_Schema.total_Payment_Out_Curr - newTotalVPOC ? newTotalVPOC : 0;
      const newBalance = updatedTotalCashout - updatedTotalPaymentOut;

      // Update the payment details
      existingSupplier.payment_Out_Schema.total_Cash_Out += - updatedTotalCashout;
      existingSupplier.payment_Out_Schema.total_Payment_Out += - updatedTotalPaymentOut;
      existingSupplier.payment_Out_Schema.total_Payment_Out_Curr +=
        -updatedTotalVPOC;
      existingSupplier.payment_Out_Schema.remaining_Curr +=
        -updatedTotalVPOC;
      existingSupplier.payment_Out_Schema.remaining_Balance += - newBalance;
      existingSupplier.payment_Out_Schema.open = open;
      existingSupplier.payment_Out_Schema.close = close;


      const cashInHandDoc = await CashInHand.findOne({});

      if (!cashInHandDoc) {
        const newCashInHandDoc = new CashInHand();
        await newCashInHandDoc.save();
      }

      const cashInHandUpdate = {
        $inc: {}
      };
      cashInHandUpdate.$inc.total_Cash = -newBalance

      await CashInHand.updateOne({}, cashInHandUpdate);
      // Save the updated supplier

      await existingSupplier.save();

      res.status(200).json({
        message: "Payment In details updated successfully",
      
      });
    } catch (error) {
      console.error("Error updating payment details:", error);
      res.status(500).json({
        message: "Error updating payment details",
        error: error.message,
      });
    }
  }
};




//deleting the Agent payment_Out_Schema
const deleteAgentPaymentOutSchema = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }

  try {
    const { supplierName } = req.body;

    const existingSupplier = await Agents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      res.status(404).json({ message: "Agent not found" });
      return;
    }

    const cashInHandDoc = await CashInHand.findOne({});

    if (!cashInHandDoc) {
      const newCashInHandDoc = new CashInHand();
      await newCashInHandDoc.save();
    }

    const cashInHandUpdate = {
      $inc: {}
    };


    cashInHandUpdate.$inc.total_Cash = existingSupplier.payment_Out_Schema.total_Payment_Out
    cashInHandUpdate.$inc.total_Cash = -existingSupplier.payment_Out_Schema.total_Cash_Out



    await CashInHand.updateOne({}, cashInHandUpdate);

    // Delete the payment_In_Schema
    existingSupplier.payment_Out_Schema = undefined;

    // Save the updated supplier without payment_In_Schema
    await existingSupplier.save();

    
    res.status(200).json({
      message: `${supplierName} deleted successfully`,
      
    });
  } catch (error) {
    console.error("Error deleting payment_Out_Schema:", error);
    res.status(500).json({
      message: "Error deleting payment_Out_Schema",
      error: error.message,
    });
  }
};

// Updating PaymentOut Person



  
const updatePaymentOutPerson=async(req,res)=>{
 
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.role !== "Admin") {
    res.status(403).json({ message: "Only Admin is allowed!" });
    return;
  }

  if (user && user.role === "Admin") {
    try {

      const {supplierName,newStatus,personId,name,pp_No,status,company,country,entry_Mode,final_Status,trade,flight_Date,visa_Price_Out_PKR,visa_Price_Out_Curr} =
      req.body;
     
      let entryMode
     
      const existingSupplier = await Agents.findOne({
        "payment_Out_Schema.supplierName": supplierName,
        "payment_Out_Schema._id": newStatus,
      });
      const new_Visa_Price_PKR=Number(visa_Price_Out_PKR)
      const new_Visa_Price_Cur=Number(visa_Price_Out_Curr)
      let visa_Price_PKR=0
      let visa_Price_Curr=0
      if(existingSupplier){
        const personIn = existingSupplier.payment_Out_Schema.persons.find(person => person._id.toString() === personId.toString());
        if (personIn) {
          
        if(final_Status.toLowerCase()==='offer letter' || final_Status.toLowerCase()==='offer_letter'){
          const newReminder=new Reminders({
            type:"Offer Letter",
            content:`${name}'s Final Status is updated to Offer Letter.`,
            date:new Date().toISOString().split("T")[0]
          })
          await newReminder.save()
        }
        if(final_Status.toLowerCase()==='e number' || final_Status.toLowerCase()==='e_number'){
          const newReminder=new Reminders({
            type:"E Number",
            content:`${name}'s Final Status is updated to E Number.`,
            date:new Date().toISOString().split("T")[0]

          })
          await newReminder.save()
        }

        if(final_Status.toLowerCase()==='qvc' || final_Status.toLowerCase()==='q_v_c'){
          const newReminder=new Reminders({
            type:"QVC",
            content:`${name}'s Final Status is updated to QVC.`,
            date:new Date().toISOString().split("T")[0]

          })
          await newReminder.save()
        }
        if(final_Status.toLowerCase()==='visa issued' || final_Status.toLowerCase()==='visa_issued' || final_Status.toLowerCase()==='vissa issued'  || final_Status.toLowerCase()==='vissa_issued'){
          const newReminder=new Reminders({
            type:"Visa Issued",
            content:`${name}'s Final Status is updated to Visa Issued.`,
            date:new Date().toISOString().split("T")[0]

          })
          await newReminder.save()
        }
        if(final_Status.toLowerCase()==='ptn' || final_Status.toLowerCase()==='p_t_n'){
          const newReminder=new Reminders({
            type:"PTN",
            content:`${name}'s Final Status is updated to PTN.`,
            date:new Date().toISOString().split("T")[0]
          })
          await newReminder.save()
        }

        if(final_Status.toLowerCase()==='ticket' || final_Status.toLowerCase()==='tiket'){
          const newReminder=new Reminders({
            type:"Ticket",
            content:`${name}'s Final Status is updated to Ticket.`,
            date:new Date().toISOString().split("T")[0]
          })
          await newReminder.save()
        }
        
          entryMode=personIn.entry_Mode

          visa_Price_PKR=new_Visa_Price_PKR-personIn.visa_Price_Out_PKR
          visa_Price_Curr=new_Visa_Price_Cur-personIn.visa_Price_Out_Curr

            personIn.company = company;
            personIn.country = country;
            personIn.entry_Mode = entry_Mode;
            personIn.final_Status = final_Status;
            personIn.trade = trade;
            personIn.status = status;
            personIn.visa_Price_Out_PKR = new_Visa_Price_PKR;
            personIn.visa_Price_Out_Curr = visa_Price_Curr;
            personIn.remaining_Price += visa_Price_PKR;
            personIn.remaining_Curr += visa_Price_Curr;

            personIn.flight_Date = flight_Date?flight_Date:'Not Fly';

             // updating overall visa prices
             existingSupplier.payment_Out_Schema.total_Visa_Price_Out_PKR+=visa_Price_PKR
             existingSupplier.payment_Out_Schema.remaining_Balance-=visa_Price_PKR
 
             existingSupplier.payment_Out_Schema.total_Visa_Price_Out_Curr+=visa_Price_Curr
             existingSupplier.payment_Out_Schema.remaining_Curr-=visa_Price_Curr

            await existingSupplier.save()
        } else {
         
            res.status(404).json({message:`person with ID: ${personId} not found`})
            return;
        }
      }

     
       // Updating in Agents both Schema
       const agents=await Agents.find({})

      for(const agent of agents){

if(agent.payment_In_Schema && agent.payment_In_Schema.persons)
{
  const personOut= agent.payment_In_Schema.persons.find(person=> person.name ===name.toString() && person.pp_No===pp_No.toString() && person.entry_Mode===entryMode.toString())
       if(personOut){
        personOut.company=company
        personOut.country=country
        personOut.entry_Mode=entry_Mode
        personOut.final_Status=final_Status
        personOut.trade=trade
        personOut.flight_Date=flight_Date?flight_Date:'Not Fly'
        await agent.save()
       }
}
     
      }

       
    

const suppliers=await Suppliers.find({})
for(const supplier of suppliers){
  if (supplier.payment_In_Schema && supplier.payment_In_Schema.persons) {
    const personIn = supplier.payment_In_Schema.persons.find(person=> person.name ===name.toString() && person.pp_No===pp_No.toString() && person.entry_Mode===entryMode.toString());
    if (personIn) {
        personIn.company = company;
        personIn.country = country;
        personIn.entry_Mode = entry_Mode;
        personIn.final_Status = final_Status;
        personIn.trade = trade;
        personIn.flight_Date = flight_Date?flight_Date:'Not Fly';
        await supplier.save()

    } 
} 

if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons)
{
const personOut= supplier.payment_Out_Schema.persons.find(person=> person.name ===name.toString() && person.pp_No===pp_No.toString() && person.entry_Mode===entryMode.toString())
 if(personOut){
  personOut.company=company
  personOut.country=country
  personOut.entry_Mode=entry_Mode
  personOut.final_Status=final_Status
  personOut.trade=trade
  personOut.flight_Date=flight_Date?flight_Date:'Not Fly'
  await supplier.save()

 }
}

}


const candidateIn=await Candidate.findOne({
  "payment_In_Schema.supplierName": name.toString(),
  "payment_In_Schema.entry_Mode": entryMode.toString(),
  "payment_In_Schema.pp_No": pp_No.toString(),
})
if(candidateIn){
  candidateIn.payment_In_Schema.company=company
  candidateIn.payment_In_Schema.country=country
  candidateIn.payment_In_Schema.entry_Mode=entry_Mode
  candidateIn.payment_In_Schema.final_Status=final_Status
  candidateIn.payment_In_Schema.trade=trade
  candidateIn.payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
  await candidateIn.save()

}

const candidateOut=await Candidate.findOne({
  "payment_Out_Schema.supplierName": name.toString(),
  "payment_Out_Schema.entry_Mode": entryMode.toString(),
  "payment_Out_Schema.pp_No": pp_No.toString(),
})
if(candidateOut){
  candidateOut.payment_Out_Schema.company=company
  candidateOut.payment_Out_Schema.country=country
  candidateOut.payment_Out_Schema.entry_Mode=entry_Mode
  candidateOut.payment_Out_Schema.final_Status=final_Status
  candidateOut.payment_Out_Schema.trade=trade
  candidateOut.payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
  await candidateOut.save()

}

      
       const ticketSuppliers=await TicketSuppliers.find({})
       for(const ticketSupplier of ticketSuppliers){
        
        if(ticketSupplier.payment_In_Schema && ticketSupplier.payment_In_Schema.persons){
          const SupPersonIn= ticketSupplier.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonIn){
            SupPersonIn.company=company
            SupPersonIn.country=country
            SupPersonIn.entry_Mode=entry_Mode
            SupPersonIn.final_Status=final_Status
            SupPersonIn.trade=trade
            SupPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
           await ticketSupplier.save()

          }
        }

        if(ticketSupplier.payment_Out_Schema && ticketSupplier.payment_Out_Schema.persons){
          const SupPersonOut= ticketSupplier.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonOut){
            SupPersonOut.company=company
            SupPersonOut.country=country
            SupPersonOut.entry_Mode=entry_Mode
            SupPersonOut.final_Status=final_Status
            SupPersonOut.trade=trade
            SupPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
           await ticketSupplier.save()

          }
        }
       
       }

       const ticketAgents=await TicketAgents.find({})

for (const ticketAgent of ticketAgents){
  if(ticketAgent.payment_In_Schema && ticketAgent.payment_In_Schema.persons){
    const AgentPersonIn= ticketAgent.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
    if(AgentPersonIn){
      AgentPersonIn.company=company
      AgentPersonIn.country=country
      AgentPersonIn.entry_Mode=entry_Mode
      AgentPersonIn.final_Status=final_Status
      AgentPersonIn.trade=trade
      AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
     await ticketAgent.save()

    }
  }
 
  if(ticketAgent.payment_Out_Schema && ticketAgent.payment_Out_Schema.persons){
    const AgentPersonOut= ticketAgent.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
    if(AgentPersonOut){
      AgentPersonOut.company=company
      AgentPersonOut.country=country
      AgentPersonOut.entry_Mode=entry_Mode
      AgentPersonOut.final_Status=final_Status
      AgentPersonOut.trade=trade
      AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
     await ticketAgent.save()

    }
  }
}
       
       const visitSuppliers=await VisitSuppliers.find({})
       for(const visitSupplier of visitSuppliers){
 
        if(visitSupplier.payment_In_Schema && visitSupplier.payment_In_Schema.persons){
          const SupPersonIn= visitSupplier.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonIn){
            SupPersonIn.company=company
            SupPersonIn.country=country
            SupPersonIn.entry_Mode=entry_Mode
            SupPersonIn.final_Status=final_Status
            SupPersonIn.trade=trade
            SupPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
           await visitSupplier.save()

          }
        }

        if(visitSupplier.payment_Out_Schema && visitSupplier.payment_Out_Schema.persons){
          const SupPersonOut= visitSupplier.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonOut){
            SupPersonOut.company=company
            SupPersonOut.country=country
            SupPersonOut.entry_Mode=entry_Mode
            SupPersonOut.final_Status=final_Status
            SupPersonOut.trade=trade
            SupPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
           await visitSupplier.save()

          }
        }
      
       }



       const visitAgents=await VisitAgents.find({})

for (const visitAgent of visitAgents){
  if(visitAgent.payment_In_Schema && visitAgent.payment_In_Schema.persons){
    const AgentPersonIn= visitAgent.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
    if(AgentPersonIn){
      AgentPersonIn.company=company
      AgentPersonIn.country=country
      AgentPersonIn.entry_Mode=entry_Mode
      AgentPersonIn.final_Status=final_Status
      AgentPersonIn.trade=trade
      AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
     await visitAgent.save()

    }
  }
 
  if(visitAgent.payment_Out_Schema && visitAgent.payment_Out_Schema.persons){
    const AgentPersonOut= visitAgent.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
    if(AgentPersonOut){
      AgentPersonOut.company=company
      AgentPersonOut.country=country
      AgentPersonOut.entry_Mode=entry_Mode
      AgentPersonOut.final_Status=final_Status
      AgentPersonOut.trade=trade
      AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
     await visitAgent.save()

    }
  }
}


       const azadSuppliers=await AzadSupplier.find({})
       for(const azadSupplier of azadSuppliers){
        if(azadSupplier.payment_In_Schema && azadSupplier.payment_In_Schema.persons){
          const SupPersonIn= azadSupplier.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonIn){
            SupPersonIn.company=company
            SupPersonIn.country=country
            SupPersonIn.entry_Mode=entry_Mode
            SupPersonIn.final_Status=final_Status
            SupPersonIn.trade=trade
            SupPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
           await azadSupplier.save()

          }
        }
      
 
        if(azadSupplier.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
          const SupPersonOut= azadSupplier.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(SupPersonOut){
            SupPersonOut.company=company
            SupPersonOut.country=country
            SupPersonOut.entry_Mode=entry_Mode
            SupPersonOut.final_Status=final_Status
            SupPersonOut.trade=trade
            SupPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
           await azadSupplier.save()

          }
        }
      
      
       }


       const azadAgents=await AzadAgents.find({})
       for (const azadAgent of azadAgents){
        if(azadAgent.payment_In_Schema && azadAgent.payment_In_Schema.persons){
          const AgentPersonIn= azadAgent.payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(AgentPersonIn){
            AgentPersonIn.company=company
            AgentPersonIn.country=country
            AgentPersonIn.entry_Mode=entry_Mode
            AgentPersonIn.final_Status=final_Status
            AgentPersonIn.trade=trade
            AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
           await azadAgent.save()

          }
        }
       
        if(azadAgent.payment_Out_Schema && azadSupplier.payment_Out_Schema.persons){
          const AgentPersonOut= azadAgent.payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
          if(AgentPersonOut){
            AgentPersonOut.company=company
            AgentPersonOut.country=country
            AgentPersonOut.entry_Mode=entry_Mode
            AgentPersonOut.final_Status=final_Status
            AgentPersonOut.trade=trade
            AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
           await azadAgent.save()
            
          }
        }
       }

const azadCandidateIn=await AzadCandidate.findOne({
  "payment_In_Schema.supplierName": name,
  "payment_In_Schema.entry_Mode": entryMode,
  "payment_In_Schema.pp_No": pp_No,
})
if(azadCandidateIn){
  azadCandidateIn.payment_In_Schema.company=company
  azadCandidateIn.payment_In_Schema.country=country
  azadCandidateIn.payment_In_Schema.entry_Mode=entry_Mode
  azadCandidateIn.payment_In_Schema.final_Status=final_Status
  azadCandidateIn.payment_In_Schema.trade=trade
  azadCandidateIn.payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
  await azadCandidateIn.save()

}

const azadCandidateOut=await AzadCandidate.findOne({
  "payment_Out_Schema.supplierName": name,
  "payment_Out_Schema.entry_Mode": entryMode,
  "payment_Out_Schema.pp_No": pp_No,
})
if(azadCandidateOut){
  azadCandidateOut.payment_Out_Schema.company=company
  azadCandidateOut.payment_Out_Schema.country=country
  azadCandidateOut.payment_Out_Schema.entry_Mode=entry_Mode
  azadCandidateOut.payment_Out_Schema.final_Status=final_Status
  azadCandidateOut.payment_Out_Schema.trade=trade
  azadCandidateOut.payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
  await azadCandidateOut.save()

}


   const ticketCandidateIn=await TicketCandidate.findOne({
    "payment_In_Schema.supplierName": name,
    "payment_In_Schema.entry_Mode": entryMode,
    "payment_In_Schema.pp_No": pp_No,
  })
  if(ticketCandidateIn){
    ticketCandidateIn.payment_In_Schema.company=company
    ticketCandidateIn.payment_In_Schema.country=country
    ticketCandidateIn.payment_In_Schema.entry_Mode=entry_Mode
    ticketCandidateIn.payment_In_Schema.final_Status=final_Status
    ticketCandidateIn.payment_In_Schema.trade=trade
    ticketCandidateIn.payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
    await ticketCandidateIn.save()

  }
  
  const ticketCandidateOut=await TicketCandidate.findOne({
    "payment_Out_Schema.supplierName": name,
    "payment_Out_Schema.entry_Mode": entryMode,
    "payment_Out_Schema.pp_No": pp_No,
  })
  if(ticketCandidateOut){
    ticketCandidateOut.payment_Out_Schema.company=company
    ticketCandidateOut.payment_Out_Schema.country=country
    ticketCandidateOut.payment_Out_Schema.entry_Mode=entry_Mode
    ticketCandidateOut.payment_Out_Schema.final_Status=final_Status
    ticketCandidateOut.payment_Out_Schema.trade=trade
    ticketCandidateOut.payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
    await ticketCandidateOut.save()

  }
  

   const visitCandidateIn=await VisitCandidate.findOne({
    "payment_In_Schema.supplierName": name,
    "payment_In_Schema.entry_Mode": entryMode,
    "payment_In_Schema.pp_No": pp_No,
  })
  if(visitCandidateIn){
    visitCandidateIn.payment_In_Schema.company=company
    visitCandidateIn.payment_In_Schema.country=country
    visitCandidateIn.payment_In_Schema.entry_Mode=entry_Mode
    visitCandidateIn.payment_In_Schema.final_Status=final_Status
    visitCandidateIn.payment_In_Schema.trade=trade
    visitCandidateIn.payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
    await visitCandidateIn.save()

  }
  
  const visitCandidateOut=await VisitCandidate.findOne({
    "payment_Out_Schema.supplierName": name,
    "payment_Out_Schema.entry_Mode": entryMode,
    "payment_Out_Schema.pp_No": pp_No,
  })
  if(visitCandidateOut){
    visitCandidateOut.payment_Out_Schema.company=company
    visitCandidateOut.payment_Out_Schema.country=country
    visitCandidateOut.payment_Out_Schema.entry_Mode=entry_Mode
    visitCandidateOut.payment_Out_Schema.final_Status=final_Status
    visitCandidateOut.payment_Out_Schema.trade=trade
    visitCandidateOut.payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
    await visitCandidateOut.save()
  }
   const protectors=await Protector.find({})
   for(const protector of protectors){
    if(protector.payment_Out_Schema && protector.payment_Out_Schema.persons){
      const personOut= protector.payment_Out_Schema.persons.find(person=> person.name ===name.toString() && person.pp_No===pp_No.toString() && person.entry_Mode===entryMode.toString())
      if(personOut){
       personOut.company=company
       personOut.country=country
       personOut.entry_Mode=entry_Mode
       personOut.final_Status=final_Status
       personOut.trade=trade
       personOut.flight_Date=flight_Date?flight_Date:'Not Fly'
       await protector.save()

      }
    }
  }

const entry=await Entries.findOne({name,pp_No,entry_Mode:entryMode})

if(entry){
  entry.company=company
  entry.country=country
  entry.entry_Mode=entry_Mode
  entry.final_Status=final_Status
  entry.trade=trade
  entry.visa_Purchase_Rate_PKR=new_Visa_Price_PKR
  entry.visa_Purchase_Rate_Oth_Cur=new_Visa_Price_Cur
  entry.flight_Date=flight_Date?flight_Date:'Not Fly'
  await entry.save()

}

const newNotification=new Notifications({
  type:"Agent Payment Out Person Updated",
  content:`${user.userName} updated Person :${name} of Agent:${supplierName}`,
  date: new Date().toISOString().split("T")[0]

})
await newNotification.save()
    res.status(200).json({message:`${name} updated successfully!`})

   
  
    } catch (error) {
      console.error('Error:', error);
    res.status(500).json({ message: error });
      
    }
    
  }


}



// changing Status 
const changePaymentOutStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const{supplierName,newStatus,multipleIds,convert}=req.body
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    
    const existingSupplier = await Agents.findOne({
        "payment_Out_Schema.supplierName": supplierName,
        "payment_Out_Schema._id": newStatus,
    });

    if (!existingSupplier) {
        return res.status(404).json({ message: "Agent not found" });
    }

    // Update status of all persons to false
    if (existingSupplier.payment_Out_Schema && existingSupplier.payment_Out_Schema.persons) {
      if(multipleIds.length>0){
        for(const myId of multipleIds){
          const allPersons=existingSupplier.payment_Out_Schema.persons
          for (const person of allPersons){
            if(person._id.toString()===myId.toString() && person.status.toLowerCase()==='open'){
            person.status = "Closed"
            }
          }
        }
      }
      
    }
    if (existingSupplier.payment_Out_Schema.status==="Open") {
      existingSupplier.payment_Out_Schema.closing=existingSupplier.payment_Out_Schema.total_Visa_Price_Out_PKR-existingSupplier.payment_Out_Schema.total_Payment_Out+existingSupplier.payment_Out_Schema.total_Cash_Out
     
  }
    // Toggle the status of the payment in schema
    existingSupplier.payment_Out_Schema.status = 'Closed';

    // Save changes to the database
    await existingSupplier.save();

    const newSupplier=new Agents({
      payment_Out_Schema:{
        supplier_Id: new mongoose.Types.ObjectId(),
        supplierName:existingSupplier.payment_Out_Schema.supplierName,
        total_Visa_Price_Out_PKR:0,
        remaining_Balance:convert.toLowerCase()==='yes'?(existingSupplier.remaining_Balance):0,
        total_Payment_Out:0,
        total_Visa_Price_Out_Curr:0,
        remaining_Curr:convert.toLowerCase()==='yes'?(existingSupplier.remaining_Curr):0,
        closing:0,
        opening:convert.toLowerCase()==='yes'?(existingSupplier.payment_Out_Schema.remaining_Balance):0,
        curr_Country:existingSupplier.payment_Out_Schema.curr_Country,
      }
    })
    await newSupplier.save()
    // Prepare response message based on the updated status
    let responseMessage;
     
        responseMessage = `Khata Closed with ${supplierName} and new Khata created Successfully!`;
        const newNotification=new Notifications({
          type:"Khata Closed of Agent Payment Out",
          content:`${user.userName} Closed Khata with Agent:${supplierName} and new Khata created successfully`,
          date: new Date().toISOString().split("T")[0]

        })
        await newNotification.save()
    

    return res.status(200).json({ message: responseMessage });
} catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: "Internal server error" });
  }
}

// Getting All Supplier Payments Out
const getAllPaymentsOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role === "Admin") {
      const supplierPayments = await Agents.find({}).sort({ createdAt: -1 });
      const formattedDetails = supplierPayments
        .filter((supplier) => supplier.payment_Out_Schema) // Filter out entries with empty payment_Out_Schema
        .map((supplier) => {
          const paymentOutSchema = supplier.payment_Out_Schema;

          return {
            supplier_Id: paymentOutSchema.supplier_Id,
            _id: paymentOutSchema._id,
            supplierName: paymentOutSchema.supplierName,
            total_Visa_Price_Out_Curr: paymentOutSchema.total_Visa_Price_Out_Curr,
            total_Payment_Out_Curr: paymentOutSchema.total_Payment_Out_Curr,
            remaining_Curr: paymentOutSchema.remaining_Curr,

            total_Visa_Price_Out_PKR: paymentOutSchema.total_Visa_Price_Out_PKR,
            total_Payment_Out: paymentOutSchema.total_Payment_Out,
            total_Cash_Out: paymentOutSchema.total_Cash_Out,
            remaining_Balance: paymentOutSchema.remaining_Balance,
            curr_Country: paymentOutSchema.curr_Country,
            persons: paymentOutSchema.persons || [],
            payment: paymentOutSchema.payment || [],
            candPayments: paymentOutSchema.candPayments || [],
            status: paymentOutSchema.status,
            opening: paymentOutSchema.opening,
            closing: paymentOutSchema.closing,
            createdAt: moment(paymentOutSchema.createdAt).format("YYYY-MM-DD"),
            updatedAt: moment(paymentOutSchema.updatedAt).format("YYYY-MM-DD"),
          };
        });

      res.status(200).json({ data: formattedDetails });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Candidate Wise Payments In
const addCandVisePaymentIn=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const {
      supplierName,
      category,
      payment_Via,
      payment_Type,
      slip_No,
      curr_Country,
      slip_Pic,
      details,
      date,
      totalCurrRate,
      payments
    } = req.body;

    let allPayments=[]
    let new_Payment_In=0
    let new_Curr_Amount=0

    const existingSupplier = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
      "payment_In_Schema.status": 'Open',
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
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

    for (const payment of payments){
      const {cand_Name,payment_In,curr_Amount,}=payment
      const newPaymentIn = parseInt(payment_In, 10);
      const newCurrAmount = parseInt(curr_Amount, 10);
      
      const existPerson = existingSupplier.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
    

      if (existPerson) {
      let cand_Name, pp_No,entry_Mode, company,trade,final_Status,flight_Date,visa_Amount_PKR,new_Payment,cash_Out,past_Paid_PKR,past_Remain_PKR,new_Remain_PKR,visa_Curr_Amount,new_Curr_Payment,past_Paid_Curr,past_Remain_Curr,new_Remain_Curr,curr_Rate
      cand_Name=existPerson.name,
      past_Paid_PKR=existPerson.total_In,
      pp_No=existPerson.pp_No,
      entry_Mode=existPerson.entry_Mode,
      company=existPerson.company,
      trade=existPerson.trade,
      final_Status=existPerson.final_Status,
      flight_Date=existPerson.flight_Date,
      entry_Mode=existPerson.entry_Mode,
      visa_Amount_PKR=existPerson.visa_Price_In_PKR
      past_Paid_PKR=existPerson.total_In,
      past_Remain_PKR=existPerson.visa_Price_In_PKR-existPerson.total_In,
      new_Remain_PKR=existPerson.visa_Price_In_PKR-existPerson.total_In-newPaymentIn,
      visa_Curr_Amount=existPerson.visa_Price_In_Curr,
      past_Paid_Curr=existPerson.visa_Price_In_Curr-existPerson.remaining_Curr,
      past_Remain_Curr=existPerson.remaining_Curr,
      new_Remain_Curr=existPerson.remaining_Curr-newCurrAmount,
      new_Payment=newPaymentIn,
      cash_Out=0,
      new_Curr_Payment=newCurrAmount?newCurrAmount:0,
      existPerson.remaining_Price += -newPaymentIn,
      existPerson.total_In += newPaymentIn,
      existPerson.remaining_Curr += newCurrAmount ? -newCurrAmount : 0
      new_Payment_In+=newPaymentIn
      new_Curr_Amount+=newCurrAmount
      curr_Rate=totalCurrRate

      let myNewPayment={
        _id:new mongoose.Types.ObjectId,
        cand_Name,
        pp_No,
        entry_Mode,
        company,
        trade,
        final_Status,
        flight_Date,
        visa_Amount_PKR,
        new_Payment,
        cash_Out:0,
        past_Paid_PKR,
        past_Remain_PKR,
        new_Remain_PKR,
        visa_Curr_Amount,
        new_Curr_Payment,
        past_Paid_Curr,
        past_Remain_Curr,
        new_Remain_Curr,
        curr_Rate
      }
      allPayments.push(myNewPayment)
      }
    }

    const candPayments={
      category,
      payment_Via,
      payment_Type,
      slip_No,
      payment_In:new_Payment_In,
      cash_Out:0,
      curr_Amount:new_Curr_Amount,
      payment_In_Curr:curr_Country,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      date:date?date:new Date().toISOString().split("T")[0],
      invoice: nextInvoiceNumber,
      payments:allPayments
    }
    await existingSupplier.updateOne({
      $inc: {
        "payment_In_Schema.total_Payment_In": new_Payment_In,
        "payment_In_Schema.remaining_Balance": -new_Payment_In,
        "payment_In_Schema.total_Payment_In_Curr": new_Curr_Amount ? new_Curr_Amount : 0,
        "payment_In_Schema.remaining_Curr": new_Curr_Amount ? -new_Curr_Amount : 0,
      },
      $push: {
        "payment_In_Schema.candPayments": candPayments,
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
      cashInHandUpdate.$inc.cash = new_Payment_In;
      cashInHandUpdate.$inc.total_Cash = new_Payment_In;
    }
    else{
      cashInHandUpdate.$inc.bank_Cash = new_Payment_In;
      cashInHandUpdate.$inc.total_Cash = new_Payment_In;
    }

    await CashInHand.updateOne({}, cashInHandUpdate);

    const newNotification=new Notifications({
      type:"Agent Cand-Wise Payment In",
      content:`${user.userName} added Candidate Wise Payment_In: ${new_Payment_In} to ${payments.length} Candidates of Agent:${supplierName}`,
      date: new Date().toISOString().split("T")[0]

    })
    await newNotification.save()

    await existingSupplier.save();
    res.status(200).json({ data:candPayments,
      message: `Payment In: ${new_Payment_In} added Successfully for to ${payments.length} Candidates to Agent:${supplierName}'s Record`,
    })

  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}


// Candidate Wise Payments In Retrun
const addCandVisePaymentInReturn=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const {
      supplierName,
      category,
      payment_Via,
      payment_Type,
      slip_No,
      curr_Country,
      slip_Pic,
      details,
      date,
      totalCurrRate,
      payments
    } = req.body;

    let allPayments=[]
    let newCash_Out=0
    let new_Curr_Amount=0
    
    const existingSupplier = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
      "payment_In_Schema.status": 'Open',

    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
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

    for (const payment of payments){
      const {cand_Name,cash_Out,curr_Amount,}=payment
      const newPaymentIn = parseInt(cash_Out, 10);
      const newCurrAmount = parseInt(curr_Amount, 10);
      
      const existPerson = existingSupplier.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
    

      if (existPerson) {
      let cand_Name, pp_No,entry_Mode, company,trade,final_Status,flight_Date,visa_Amount_PKR,new_Payment,cash_Out,past_Paid_PKR,past_Remain_PKR,new_Remain_PKR,visa_Curr_Amount,new_Curr_Payment,past_Paid_Curr,past_Remain_Curr,new_Remain_Curr,curr_Rate
      cand_Name=existPerson.name,
      past_Paid_PKR=existPerson.total_In,
      pp_No=existPerson.pp_No,
      entry_Mode=existPerson.entry_Mode,
      company=existPerson.company,
      trade=existPerson.trade,
      final_Status=existPerson.final_Status,
      flight_Date=existPerson.flight_Date,
      entry_Mode=existPerson.entry_Mode,
      visa_Amount_PKR=existPerson.visa_Price_In_PKR
      past_Paid_PKR=existPerson.total_In,
      past_Remain_PKR=existPerson.visa_Price_In_PKR-existPerson.total_In,
      new_Remain_PKR=existPerson.visa_Price_In_PKR-existPerson.total_In+newPaymentIn,
      visa_Curr_Amount=existPerson.visa_Price_In_Curr,
      past_Paid_Curr=existPerson.visa_Price_In_Curr-existPerson.remaining_Curr,
      past_Remain_Curr=existPerson.remaining_Curr,
      new_Remain_Curr=existPerson.remaining_Curr+newCurrAmount,
      cash_Out=newPaymentIn,
      new_Payment=0,
      new_Curr_Payment=newCurrAmount?newCurrAmount:0,
      existPerson.remaining_Price += newPaymentIn,
      existPerson.total_In -= newPaymentIn,
      existPerson.remaining_Curr -= newCurrAmount ? newCurrAmount : 0
      newCash_Out+=newPaymentIn
      new_Curr_Amount+=newCurrAmount
      curr_Rate=totalCurrRate

      let myNewPayment={
        _id:new mongoose.Types.ObjectId,
        cand_Name,
        pp_No,
        entry_Mode,
        company,
        trade,
        final_Status,
        flight_Date,
        visa_Amount_PKR,
        cash_Out,
       new_Payment:0,
        past_Paid_PKR,
        past_Remain_PKR,
        new_Remain_PKR,
        visa_Curr_Amount,
        new_Curr_Payment,
        past_Paid_Curr,
        past_Remain_Curr,
        new_Remain_Curr,
        curr_Rate
      }
      allPayments.push(myNewPayment)
      }
    }

    const candPayments={
      category,
      payment_Via,
      payment_Type,
      slip_No,
      payment_In:0,
      cash_Out:newCash_Out,
      curr_Amount:new_Curr_Amount,
      payment_In_Curr:curr_Country,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      date:date?date:new Date().toISOString().split("T")[0],
      invoice: nextInvoiceNumber,
      payments:allPayments
    }
    await existingSupplier.updateOne({
      $inc: {
        "payment_In_Schema.total_Payment_In": -newCash_Out,
        "payment_In_Schema.remaining_Balance": newCash_Out,
        "payment_In_Schema.total_Payment_In_Curr": new_Curr_Amount ? -new_Curr_Amount : 0,
        "payment_In_Schema.remaining_Curr": new_Curr_Amount ? new_Curr_Amount : 0,
      },
      $push: {
        "payment_In_Schema.candPayments": candPayments,
      },
    })
    

    const newNotification=new Notifications({
      type:"Agent Cand-Wise Payment In Return",
      content:`${user.userName} added Candidate Wise Payment In Return: ${newCash_Out} to ${payments.length} Candidates of Agent:${supplierName}`,
      date: new Date().toISOString().split("T")[0]

    })
    await newNotification.save()

    await existingSupplier.save();
    res.status(200).json({ data:candPayments,
      message: `Payment In Return: ${newCash_Out} added Successfully for to ${payments.length} Candidates to Agent:${supplierName}'s Record`,
    })

  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}


// Deleting a CandWise Payment IN
const deleteCandVisePaymentIn=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const {
      supplierName,
      paymentId,
      newStatus
    } = req.body;
    const existingSupplier = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
      "payment_In_Schema._id":newStatus ,

    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
      });
      return;
    }


    const paymentToDelete=existingSupplier.payment_In_Schema.candPayments.find(p=>p._id.toString()===paymentId.toString())

    if(!paymentToDelete){
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if(paymentToDelete){
      let combinePayment=paymentToDelete.cash_Out-paymentToDelete.payment_In
      const allPayments=paymentToDelete.payments
      const allPersons=existingSupplier.payment_In_Schema.persons
      for (const payment of allPayments){
      for (const person of allPersons){
        if(payment.cand_Name.toLowerCase()===person.name.toLowerCase()){
          person.total_In-=payment.new_Payment>0?payment.new_Payment:0
          person.cash_Out-=payment.cash_Out>0?payment.cash_Out:0
          person.remaining_Price+=payment.new_Payment>0?payment.new_Payment:-payment.cash_Out
          person.remaining_Curr+=payment.new_Payment>0?payment.new_Curr_Payment:-payment.new_Curr_Payment
        }
      }
      }
      await existingSupplier.updateOne({
        $inc: {
          "payment_In_Schema.total_Payment_In": -paymentToDelete.payment_In,
          "payment_In_Schema.total_Cash_Out": -paymentToDelete.cash_Out,
          "payment_In_Schema.remaining_Balance": paymentToDelete.payment_In>0?paymentToDelete.payment_In:-paymentToDelete.cash_Out,
          "payment_In_Schema.total_Payment_In_Curr": paymentToDelete.curr_Amount ? -paymentToDelete.curr_Amount : 0,
          "payment_In_Schema.remaining_Curr": paymentToDelete.curr_Amount ? paymentToDelete.curr_Amount : 0,
        },
        $pull: {
          "payment_In_Schema.candPayments": { _id: paymentId },
        },
      })
      
    
      await existingSupplier.save()
      const newNotification=new Notifications({
        type:"Agents Cand-Wise Payment In Deleted",
        content:`${user.userName} deleted Cand-Wise Payment_In: ${paymentToDelete.payment_In } of ${paymentToDelete.payments.length} Candidates from  Suppliers: ${supplierName}'s Record`,
        date: new Date().toISOString().split("T")[0]

      })
      await newNotification.save()
    
      res.status(200).json({
        message: `Payment In with ID ${paymentId} deleted successfully of ${paymentToDelete.payments.length} Candidates from  Suppliers: ${supplierName}'s Record`,
      });

    }
   

  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}


// Update Cand-Wise Payment In
const updateCandVisePaymentIn=async(req,res)=>{
  const {
    supplierName,
    paymentId,
    category,
    payment_Via,
    payment_Type,
    slip_No,
    details,
    curr_Country,
    slip_Pic,
    date,
    newStatus
  } = req.body;

  
  const existingSupplier = await Agents.findOne({
    "payment_In_Schema.supplierName": supplierName,
    "payment_In_Schema._id":newStatus

  });
  if (!existingSupplier) {
    res.status(404).json({ message: "Agent not found" });
    return;
  }

   // Find the payment within the payment array using paymentId
   const paymentToUpdate = existingSupplier.payment_In_Schema.candPayments.find(
    (payment) => payment._id.toString() === paymentId
  );
  if (!paymentToUpdate) {
    res.status(404).json({ message: "Payment not found" });
    return;
  }
  let uploadImage;

  if (slip_Pic) {
    uploadImage = await cloudinary.uploader.upload(slip_Pic, {
      upload_preset: "rozgar",
    })
  }

  paymentToUpdate.category = category;
  paymentToUpdate.payment_Via = payment_Via;
  paymentToUpdate.payment_Type = payment_Type;
  paymentToUpdate.slip_No = slip_No;
  paymentToUpdate.details = details;
  if (slip_Pic && uploadImage) {
    paymentToUpdate.slip_Pic = uploadImage.secure_url;
  };
  paymentToUpdate.payment_In_Curr = curr_Country;
  paymentToUpdate.date = date;
  // Save the updated supplier

  await existingSupplier.save();
  res.status(200).json({
    message: "Payment details updated successfully",

  });

}


// Deleting a Single CandWise Payment IN
const deleteSingleCandVisePaymentIn=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const {
      supplierName,
      paymentId,
      myPaymentId,
    newStatus

    } = req.body;
    const existingSupplier = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
    "payment_In_Schema._id":newStatus

    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
      });
      return;
    }


    const paymentToFind=existingSupplier.payment_In_Schema.candPayments.find(p=>p._id.toString()===paymentId.toString())

    if(!paymentToFind){
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if(paymentToFind){
      
      const allPersons=existingSupplier.payment_In_Schema.persons
      const candPayment=paymentToFind.payments.find(p=>p._id.toString()===myPaymentId.toString())
      if(!candPayment){
        res.status(404).json({
          message: "Candidate Payment not Found",
        });
      }
      if(candPayment){
        const personToUpdate=allPersons.find(p=>p.name.toString()===candPayment.cand_Name.toString())
        if(personToUpdate){
          personToUpdate.total_In-=candPayment.new_Payment
          personToUpdate.cash_Out-=candPayment.cash_Out
          personToUpdate.remaining_Price+=candPayment.new_Payment>0?candPayment.new_Payment:-candPayment.cash_Out
          personToUpdate.remaining_Curr+=candPayment.new_Payment>0?candPayment:-candPayment.new_Curr_Payment
        }
        paymentToFind.payment_In-=candPayment.new_Payment
        paymentToFind.cash_Out-=candPayment.cash_Out
        paymentToFind.curr_Amount-=candPayment.new_Curr_Payment
       

        await existingSupplier.updateOne({
          $inc: {
            "payment_In_Schema.total_Payment_In": -candPayment.new_Payment,
            "payment_In_Schema.total_Cash_Out": -candPayment.cash_Out,
            "payment_In_Schema.remaining_Balance": candPayment.new_Payment>0?candPayment.new_Payment:-candPayment.cash_Out,
            "payment_In_Schema.total_Payment_In_Curr": candPayment.new_Curr_Payment ? -candPayment.new_Curr_Payment : 0,
            "payment_In_Schema.remaining_Curr": candPayment.new_Curr_Payment ? candPayment.new_Curr_Payment : 0,
          },
        })

      
        const newNotification=new Notifications({
          type:"Agent Cand-Wise Payment In Deleted",
          content:`${user.userName} deleted Cand-Wise Payment_In: ${candPayment.new_Payment } of Candidate ${candPayment.cand_Name} from  Agent:${supplierName}'s Record`,
          date: new Date().toISOString().split("T")[0]
  
        })
        await newNotification.save()
        const candPaymentToDelete=paymentToFind.payments.filter(p=>p._id.toString() !==myPaymentId.toString())
        await existingSupplier.save()
        if (candPaymentToDelete.length === 0) {
        
          await existingSupplier.updateOne({
            $pull: {
              "payment_In_Schema.candPayments": { _id: paymentId }
            }
          })
          await existingSupplier.save();

        } else {
          // Otherwise, save changes
          await existingSupplier.save();
        }
  
      
        res.status(200).json({
          message: `Successfuly, deleted Cand-Wise Payment_In: ${candPayment.new_Payment } of Candidate ${candPayment.cand_Name} from  Agent:${supplierName}'s Record`,
        });
      }
    }
   

  }
  catch(error){
    console.log(error)
    res.status(500).json({message:error.message})
  }
}



// Updating a Single CandWise Payment IN
const updateSingleCandVisePaymentIn=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    let{
      supplierName,
      cand_Name,
      paymentId,
      myPaymentId,
      new_Payment,
      cash_Out,
      new_Curr_Payment,
      curr_Rate,
      newStatus
    } = req.body;

    let newPaymentIn = parseInt(new_Payment, 10);
    let newCashOut = parseInt(cash_Out, 10);

    let newCurrAmount = parseInt(new_Curr_Payment, 10);
    let newCurrRate=parseInt(curr_Rate,10)
    newCurrAmount=newPaymentIn>0?newPaymentIn:newCashOut/newCurrRate

    const existingAgent = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
      "payment_In_Schema._id":newStatus

    })

    if (!existingAgent) {
      res.status(404).json({
        message: "Agent not Found",
      });
      return;
    }

    const paymentToFind=existingAgent.payment_In_Schema.candPayments.find(p=>p._id.toString()===paymentId.toString())

    if(!paymentToFind){
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if(paymentToFind){
      
      const allPersons=existingAgent.payment_In_Schema.persons
      const candPayment=paymentToFind.payments.find(p=>p._id.toString()===myPaymentId.toString())
      if(!candPayment){
        res.status(404).json({
          message: "Candidate Payment not Found",
        });
      }
      if(candPayment){
        let updatedPaymentIn = candPayment.new_Payment - newPaymentIn;
        let updatedCashOut = candPayment.cash_Out - newCashOut;
        let combinePayment=updatedCashOut-updatedPaymentIn;
        let updateCurr_Amount = candPayment.new_Curr_Payment?candPayment.new_Curr_Payment:0- newCurrAmount;


if(candPayment.cand_Name.toLowerCase()!==cand_Name.toLowerCase()){
  const existingPaymentPerson = existingAgent.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === candPayment.cand_Name.toLowerCase())
  if(existingPaymentPerson){
    existingPaymentPerson.remaining_Price+=candPayment.new_Payment>0?candPayment.new_Payment:-candPayment.cash_Out
    existingPaymentPerson.total_In+=candPayment.new_Payment>0?-candPayment.new_Payment:candPayment.cash_Out
    existingPaymentPerson.remaining_Curr+=candPayment?.new_Curr_Payment||0
  const existingNewPaymentPerson = existingAgent.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
if(existingNewPaymentPerson){
  existingNewPaymentPerson.remaining_Price += newPaymentIn>0?-newPaymentIn:newCashOut
  existingNewPaymentPerson.total_In += newPaymentIn>0?newPaymentIn:-newCashOut
  existingNewPaymentPerson.remaining_Curr +=newPaymentIn>0?-newCurrAmount:newCurrAmount

  candPayment.cand_Name=existingNewPaymentPerson.name
  candPayment.pp_No=existingNewPaymentPerson.pp_No
  candPayment.entry_Mode=existingNewPaymentPerson.entry_Mode
  candPayment.company=existingNewPaymentPerson.company
  candPayment.country=existingNewPaymentPerson.country
  candPayment.trade=existingNewPaymentPerson.trade
  candPayment.final_Status=existingNewPaymentPerson.final_Status
  candPayment.flight_Date=existingNewPaymentPerson.flight_Date
  candPayment.visa_Amount_PKR=existingNewPaymentPerson.visa_Price_In_PKR
  candPayment.past_Paid_PKR=existingNewPaymentPerson.total_In
  candPayment.past_Remain_PKR=existingNewPaymentPerson.visa_Price_In_PKR-existingNewPaymentPerson.total_In
  candPayment.new_Remain_PKR=existingNewPaymentPerson.visa_Price_In_PKR-existingNewPaymentPerson.total_In+(newPaymentIn>0?-newPaymentIn:newCashOut)
  candPayment.visa_Curr_Amount=existingNewPaymentPerson.visa_Price_In_Curr
  candPayment.past_Paid_Curr=existingNewPaymentPerson.visa_Price_In_Curr-existingNewPaymentPerson.remaining_Curr?existingNewPaymentPerson.remaining_Curr:0
  candPayment.new_Remain_Curr=existingNewPaymentPerson.visa_Price_In_Curr+(newPaymentIn>0?-newCurrAmount:newCurrAmount)
  candPayment.new_Payment=newPaymentIn
  candPayment.cash_Out=newCashOut
  candPayment.new_Curr_Payment=newPaymentIn>0?newPaymentIn:newCashOut/newCurrRate
  candPayment.curr_Rate=newCurrRate
  }

  paymentToFind.payment_In+=-updatedPaymentIn
  paymentToFind.cash_Out+=-updatedCashOut
  paymentToFind.curr_Amount+=- newCurrRate>0 ?updatedPaymentIn/newCurrRate:0
  paymentToFind.curr_Rate+=-newCurrRate


  await existingAgent.updateOne({
    $inc: {
      "payment_In_Schema.total_Payment_In": -updatedPaymentIn,
      "payment_In_Schema.total_Cash_Out": -updatedCashOut,
      "payment_In_Schema.remaining_Balance": -combinePayment,
      "payment_In_Schema.total_Payment_In_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
      "payment_In_Schema.remaining_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
    },
  })
  
  const newNotification=new Notifications({
    type:"Agent Cand-Wise Payment In Updated",
    content:`${user.userName} updated Cand-Wise Payment_In ${newPaymentIn} of Candidate ${cand_Name} of Agent:${supplierName}'s Record`,
    date: new Date().toISOString().split("T")[0]

  })
  await newNotification.save()
  await existingAgent.save()

  res.status(200).json({
    message: `Successfuly, updated Cand-Wise Payment_In ${newPaymentIn} of Candidate ${cand_Name} of Agent: ${supplierName}'s Record`,
  });

}
}
else{
// Updating The Cand payment

candPayment.new_Remain_PKR+=updatedPaymentIn>0?updatedPaymentIn:-updatedCashOut
candPayment.new_Payment+=-updatedPaymentIn
candPayment.cash_Out+=-updatedCashOut
candPayment.new_Remain_Curr+=updateCurr_Amount
candPayment.new_Curr_Payment+=-updateCurr_Amount
candPayment.curr_Rate=updatedPaymentIn/updateCurr_Amount

// updating Person total_In and remainig pkr and curr as well
  const personToUpdate=allPersons.find(p=>p.name.toString()===candPayment.cand_Name.toString())
  if(personToUpdate){
    personToUpdate.total_In+=-updatedPaymentIn
    personToUpdate.cash_Out+=-updatedCashOut
    personToUpdate.remaining_Price+=updatedPaymentIn>0?-updatedPaymentIn:updatedCashOut
    personToUpdate.remaining_Curr+=-newCurrAmount
  }

  // uodating parent payment
  paymentToFind.payment_In+=-updatedPaymentIn
  paymentToFind.cash_Out+=-updatedCashOut
  paymentToFind.curr_Amount+=-updateCurr_Amount
  await existingAgent.updateOne({
    $inc: {
      "payment_In_Schema.total_Payment_In": -updatedPaymentIn,
      "payment_In_Schema.total_Cash_Out": -updatedCashOut,
      "payment_In_Schema.remaining_Balance": -combinePayment,
      "payment_In_Schema.total_Payment_In_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
      "payment_In_Schema.remaining_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
    },
  })

  const newNotification=new Notifications({
    type:"Agent Cand-Wise Payment In Updated",
    content:`${user.userName} updated Cand-Wise Payment_In ${new_Payment} of Candidate ${candPayment.cand_Name} of Agent:${supplierName}'s Record`,
    date: new Date().toISOString().split("T")[0]

  })
  await newNotification.save()
  await existingAgent.save()

  res.status(200).json({
    message: `Successfuly, updated Cand-Wise Payment_In ${new_Payment} of Candidate ${candPayment.cand_Name} of Agent: ${supplierName}'s Record`,
  });
}
      }
    }
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:error.message})
  }
}


// Candidate Wise Payments Out
const addCandVisePaymentOut=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const {
      supplierName,
      category,
      payment_Via,
      payment_Type,
      slip_No,
      curr_Country,
      slip_Pic,
      details,
      date,
      totalCurrRate,
      payments
    } = req.body;

    let allPayments=[]
    let new_Payment_Out=0
    let new_Curr_Amount=0

    const existingSupplier = await Agents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
      "payment_Out_Schema.status":"Open"

    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
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

    for (const payment of payments){
      const {cand_Name,payment_Out,curr_Amount,}=payment
      const newPaymentOut = parseInt(payment_Out, 10);
      const newCurrAmount = parseInt(curr_Amount, 10);
      
      const existPerson = existingSupplier.payment_Out_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
    

      if (existPerson) {
      let cand_Name, pp_No,entry_Mode, company,trade,final_Status,flight_Date,visa_Amount_PKR,new_Payment,cash_Out,past_Paid_PKR,past_Remain_PKR,new_Remain_PKR,visa_Curr_Amount,new_Curr_Payment,past_Paid_Curr,past_Remain_Curr,new_Remain_Curr,curr_Rate
      cand_Name=existPerson.name,
      past_Paid_PKR=existPerson.total_In,
      pp_No=existPerson.pp_No,
      entry_Mode=existPerson.entry_Mode,
      company=existPerson.company,
      trade=existPerson.trade,
      final_Status=existPerson.final_Status,
      flight_Date=existPerson.flight_Date,
      entry_Mode=existPerson.entry_Mode,
      visa_Amount_PKR=existPerson.visa_Price_Out_PKR
      past_Paid_PKR=existPerson.total_In,
      past_Remain_PKR=existPerson.visa_Price_Out_PKR-existPerson.total_In,
      new_Remain_PKR=existPerson.visa_Price_Out_PKR-existPerson.total_In-newPaymentOut,
      visa_Curr_Amount=existPerson.visa_Price_Out_Curr,
      past_Paid_Curr=existPerson.visa_Price_Out_Curr-existPerson.remaining_Curr,
      past_Remain_Curr=existPerson.remaining_Curr,
      new_Remain_Curr=existPerson.remaining_Curr-newCurrAmount,
      new_Payment=newPaymentOut,
      cash_Out=0,
      new_Curr_Payment=newCurrAmount?newCurrAmount:0,
      existPerson.remaining_Price += -newPaymentOut,
      existPerson.total_In += newPaymentOut,
      existPerson.remaining_Curr += newCurrAmount ? -newCurrAmount : 0
      new_Payment_Out+=newPaymentOut
      new_Curr_Amount+=newCurrAmount
      curr_Rate=totalCurrRate

      let myNewPayment={
        _id:new mongoose.Types.ObjectId,
        cand_Name,
        pp_No,
        entry_Mode,
        company,
        trade,
        final_Status,
        flight_Date,
        visa_Amount_PKR,
        new_Payment,
        cash_Out:0,
        past_Paid_PKR,
        past_Remain_PKR,
        new_Remain_PKR,
        visa_Curr_Amount,
        new_Curr_Payment,
        past_Paid_Curr,
        past_Remain_Curr,
        new_Remain_Curr,
        curr_Rate
      }
      allPayments.push(myNewPayment)
      }
    }

    const candPayments={
      category,
      payment_Via,
      payment_Type,
      slip_No,
      payment_Out:new_Payment_Out,
      cash_Out:0,
      curr_Amount:new_Curr_Amount,
      payment_Out_Curr:curr_Country,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      date:date?date:new Date().toISOString().split("T")[0],
      invoice: nextInvoiceNumber,
      payments:allPayments
    }
    await existingSupplier.updateOne({
      $inc: {
        "payment_Out_Schema.total_Payment_Out": new_Payment_Out,
        "payment_Out_Schema.remaining_Balance": -new_Payment_Out,
        "payment_Out_Schema.total_Payment_Out_Curr": new_Curr_Amount ? new_Curr_Amount : 0,
        "payment_Out_Schema.remaining_Curr": new_Curr_Amount ? -new_Curr_Amount : 0,
      },
      $push: {
        "payment_Out_Schema.candPayments": candPayments,
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
      cashInHandUpdate.$inc.cash = -new_Payment_Out;
      cashInHandUpdate.$inc.total_Cash = -new_Payment_Out;
    }
    else{
      cashInHandUpdate.$inc.bank_Cash = -new_Payment_Out;
      cashInHandUpdate.$inc.total_Cash = -new_Payment_Out;
    }

    await CashInHand.updateOne({}, cashInHandUpdate);

    const newNotification=new Notifications({
      type:"Agent Cand-Wise Payment Out",
      content:`${user.userName} added Candidate Wise Payment_Ou: ${new_Payment_Out} to ${payments.length} Candidates of Agent:${supplierName}`,
      date: new Date().toISOString().split("T")[0]

    })
    await newNotification.save()

    await existingSupplier.save();
    res.status(200).json({ data:candPayments,
      message: `Payment Out: ${new_Payment_Out} added Successfully for to ${payments.length} Candidates to Agent:${supplierName}'s Record`,
    })

  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}


const addCandVisePaymentOutReturn=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const {
      supplierName,
      category,
      payment_Via,
      payment_Type,
      slip_No,
      curr_Country,
      slip_Pic,
      details,
      date,
      totalCurrRate,
      payments
    } = req.body;

    let allPayments=[]
    let newCash_Out=0
    let new_Curr_Amount=0
    
    const existingSupplier = await Agents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
      "payment_Out_Schema.status":"Open"

    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
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

    for (const payment of payments){
      const {cand_Name,cash_Out,curr_Amount,}=payment
      const newPaymentOut = parseInt(cash_Out, 10);
      const newCurrAmount = parseInt(curr_Amount, 10);
      
      const existPerson = existingSupplier.payment_Out_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
    

      if (existPerson) {
      let cand_Name, pp_No,entry_Mode, company,trade,final_Status,flight_Date,visa_Amount_PKR,new_Payment,cash_Out,past_Paid_PKR,past_Remain_PKR,new_Remain_PKR,visa_Curr_Amount,new_Curr_Payment,past_Paid_Curr,past_Remain_Curr,new_Remain_Curr,curr_Rate
      cand_Name=existPerson.name,
      past_Paid_PKR=existPerson.total_In,
      pp_No=existPerson.pp_No,
      entry_Mode=existPerson.entry_Mode,
      company=existPerson.company,
      trade=existPerson.trade,
      final_Status=existPerson.final_Status,
      flight_Date=existPerson.flight_Date,
      entry_Mode=existPerson.entry_Mode,
      visa_Amount_PKR=existPerson.visa_Price_Out_PKR
      past_Paid_PKR=existPerson.total_In,
      past_Remain_PKR=existPerson.visa_Price_Out_PKR-existPerson.total_In,
      new_Remain_PKR=existPerson.visa_Price_Out_PKR-existPerson.total_In+newPaymentOut,
      visa_Curr_Amount=existPerson.visa_Price_Out_Curr,
      past_Paid_Curr=existPerson.visa_Price_Out_Curr-existPerson.remaining_Curr,
      past_Remain_Curr=existPerson.remaining_Curr,
      new_Remain_Curr=existPerson.remaining_Curr+newCurrAmount,
      cash_Out=newPaymentOut,
      new_Payment=0,
      new_Curr_Payment=newCurrAmount?newCurrAmount:0,
      existPerson.remaining_Price += newPaymentOut,
      existPerson.total_In -= newPaymentOut,
      existPerson.remaining_Curr -= newCurrAmount ? newCurrAmount : 0
      newCash_Out+=newPaymentOut
      new_Curr_Amount+=newCurrAmount
      curr_Rate=totalCurrRate

      let myNewPayment={
        _id:new mongoose.Types.ObjectId,
        cand_Name,
        pp_No,
        entry_Mode,
        company,
        trade,
        final_Status,
        flight_Date,
        visa_Amount_PKR,
        cash_Out,
        new_Payment:0,
        past_Paid_PKR,
        past_Remain_PKR,
        new_Remain_PKR,
        visa_Curr_Amount,
        new_Curr_Payment,
        past_Paid_Curr,
        past_Remain_Curr,
        new_Remain_Curr,
        curr_Rate
      }
      allPayments.push(myNewPayment)
      }
    }

    const candPayments={
      category,
      payment_Via,
      payment_Type,
      slip_No,
      payment_Out:0,
      cash_Out:newCash_Out,
      curr_Amount:new_Curr_Amount,
      payment_Out_Curr:curr_Country,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      date:date?date:new Date().toISOString().split("T")[0],
      invoice: nextInvoiceNumber,
      payments:allPayments
    }
    await existingSupplier.updateOne({
      $inc: {
        "payment_Out_Schema.total_Payment_Out": -newCash_Out,
        "payment_Out_Schema.remaining_Balance": newCash_Out,
        "payment_Out_Schema.total_Payment_Out_Curr": new_Curr_Amount ? -new_Curr_Amount : 0,
        "payment_Out_Schema.remaining_Curr": new_Curr_Amount ? new_Curr_Amount : 0,
      },
      $push: {
        "payment_Out_Schema.candPayments": candPayments,
      },
    })
    

    const newNotification=new Notifications({
      type:"Agent Cand-Wise Payment Out Return",
      content:`${user.userName} added Candidate Wise Payment Out Return: ${newCash_Out} to ${payments.length} Candidates of Agent:${supplierName}`,
      date: new Date().toISOString().split("T")[0]

    })
    await newNotification.save()

    await existingSupplier.save();
    res.status(200).json({ data:candPayments,
      message: `Payment Out Return: ${newCash_Out} added Successfully for to ${payments.length} Candidates to Agent:${supplierName}'s Record`,
    })

  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}


// Deleting a CandWise Payment Out
const deleteCandVisePaymentOut=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const {
      supplierName,
      paymentId,
      newStatus
    } = req.body;
    const existingSupplier = await Agents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
      "payment_Out_Schema._id":newStatus
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
      });
      return;
    }


    const paymentToDelete=existingSupplier.payment_Out_Schema.candPayments.find(p=>p._id.toString()===paymentId.toString())

    if(!paymentToDelete){
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if(paymentToDelete){
      let combinePayment=paymentToDelete.cash_Out-paymentToDelete.payment_Out
      const allPayments=paymentToDelete.payments
      const allPersons=existingSupplier.payment_Out_Schema.persons
      for (const payment of allPayments){
      for (const person of allPersons){
        if(payment.cand_Name.toLowerCase()===person.name.toLowerCase()){
          person.total_In-=payment.new_Payment>0?payment.new_Payment:0
          person.cash_Out-=payment.cash_Out>0?payment.cash_Out:0
          person.remaining_Price+=payment.new_Payment>0?payment.new_Payment:-payment.cash_Out
          person.remaining_Curr+=payment.new_Payment>0?payment.new_Curr_Payment:-payment.new_Curr_Payment
        }
      }
      }
      await existingSupplier.updateOne({
        $inc: {
          "payment_Out_Schema.total_Payment_Out": -paymentToDelete.payment_Out,
          "payment_Out_Schema.total_Cash_Out": -paymentToDelete.cash_Out,
          "payment_Out_Schema.remaining_Balance": paymentToDelete.payment_Out>0?paymentToDelete.payment_Out:-paymentToDelete.cash_Out,
          "payment_Out_Schema.total_Payment_Out_Curr": paymentToDelete.curr_Amount ? -paymentToDelete.curr_Amount : 0,
          "payment_Out_Schema.remaining_Curr": paymentToDelete.curr_Amount ? paymentToDelete.curr_Amount : 0,
        },
        $pull: {
          "payment_Out_Schema.candPayments": { _id: paymentId },
        },
      })
      
    
      await existingSupplier.save()
      const newNotification=new Notifications({
        type:"Agents Cand-Wise Payment Out Deleted",
        content:`${user.userName} deleted Cand-Wise Payment_Out: ${paymentToDelete.payment_Out } of ${paymentToDelete.payments.length} Candidates from  Suppliers: ${supplierName}'s Record`,
        date: new Date().toISOString().split("T")[0]

      })
      await newNotification.save()
    
      res.status(200).json({
        message: `Payment Out with ID ${paymentId} deleted successfully of ${paymentToDelete.payments.length} Candidates from  Suppliers: ${supplierName}'s Record`,
      });

    }
   

  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}


// Update Cand-Wise Payment Out
const updateCandVisePaymentOut=async(req,res)=>{
  const {
    supplierName,
    paymentId,
    category,
    payment_Via,
    payment_Type,
    slip_No,
    details,
    curr_Country,
    slip_Pic,
    date,
    newStatus
  } = req.body;

  
  const existingSupplier = await Agents.findOne({
    "payment_Out_Schema.supplierName": supplierName,
    "payment_Out_Schema._id":newStatus

  });
  if (!existingSupplier) {
    res.status(404).json({ message: "Agent not found" });
    return;
  }

   // Find the payment within the payment array using paymentId
   const paymentToUpdate = existingSupplier.payment_Out_Schema.candPayments.find(
    (payment) => payment._id.toString() === paymentId
  );
  if (!paymentToUpdate) {
    res.status(404).json({ message: "Payment not found" });
    return;
  }
  let uploadImage;

  if (slip_Pic) {
    uploadImage = await cloudinary.uploader.upload(slip_Pic, {
      upload_preset: "rozgar",
    })
  }

  paymentToUpdate.category = category;
  paymentToUpdate.payment_Via = payment_Via;
  paymentToUpdate.payment_Type = payment_Type;
  paymentToUpdate.slip_No = slip_No;
  paymentToUpdate.details = details;
  if (slip_Pic && uploadImage) {
    paymentToUpdate.slip_Pic = uploadImage.secure_url;
  };
  paymentToUpdate.payment_Out_Curr = curr_Country;
  paymentToUpdate.date = date;
  // Save the updated supplier

  await existingSupplier.save();
  res.status(200).json({
    message: "Payment details updated successfully",
 
  });

}



// Deleting a Single CandWise Payment Out
const deleteSingleCandVisePaymentOut=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const {
      supplierName,
      paymentId,
      myPaymentId,
      newStatus
    } = req.body;
    const existingSupplier = await Agents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
      "payment_Out_Schema._id":newStatus
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Agent not Found",
      });
      return;
    }


    const paymentToFind=existingSupplier.payment_Out_Schema.candPayments.find(p=>p._id.toString()===paymentId.toString())

    if(!paymentToFind){
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if(paymentToFind){
      
      const allPersons=existingSupplier.payment_Out_Schema.persons
      const candPayment=paymentToFind.payments.find(p=>p._id.toString()===myPaymentId.toString())
      if(!candPayment){
        res.status(404).json({
          message: "Candidate Payment not Found",
        });
      }
      if(candPayment){
        const personToUpdate=allPersons.find(p=>p.name.toString()===candPayment.cand_Name.toString())
        if(personToUpdate){
          personToUpdate.total_In-=candPayment.new_Payment
          personToUpdate.cash_Out-=candPayment.cash_Out
          personToUpdate.remaining_Price+=candPayment.new_Payment>0?candPayment.new_Payment:-candPayment.cash_Out
          personToUpdate.remaining_Curr+=candPayment.new_Payment>0?candPayment:-candPayment.new_Curr_Payment
        }
        paymentToFind.payment_Out-=candPayment.new_Payment
        paymentToFind.cash_Out-=candPayment.cash_Out
        paymentToFind.curr_Amount-=candPayment.new_Curr_Payment
       

        await existingSupplier.updateOne({
          $inc: {
            "payment_Out_Schema.total_Payment_Out": -candPayment.new_Payment,
            "payment_Out_Schema.total_Cash_Out": -candPayment.cash_Out,
            "payment_Out_Schema.remaining_Balance": candPayment.new_Payment>0?candPayment.new_Payment:-candPayment.cash_Out,
            "payment_Out_Schema.total_Payment_Out_Curr": candPayment.new_Curr_Payment ? -candPayment.new_Curr_Payment : 0,
            "payment_Out_Schema.remaining_Curr": candPayment.new_Curr_Payment ? candPayment.new_Curr_Payment : 0,
          },
        })

      
        const newNotification=new Notifications({
          type:"Agent Cand-Wise Payment Out Deleted",
          content:`${user.userName} deleted Cand-Wise Payment_Out: ${candPayment.new_Payment } of Candidate ${candPayment.cand_Name} from  Agent:${supplierName}'s Record`,
          date: new Date().toISOString().split("T")[0]
  
        })
        await newNotification.save()
        const candPaymentToDelete=paymentToFind.payments.filter(p=>p._id.toString() !==myPaymentId.toString())
        await existingSupplier.save()
        if (candPaymentToDelete.length === 0) {
        
          await existingSupplier.updateOne({
            $pull: {
              "payment_Out_Schema.candPayments": { _id: paymentId }
            }
          })
          await existingSupplier.save();

        } else {
          // Otherwise, save changes
          await existingSupplier.save();
        }
  
      
        res.status(200).json({
          message: `Successfuly, deleted Cand-Wise Payment_Out: ${candPayment.new_Payment } of Candidate ${candPayment.cand_Name} from  Agent:${supplierName}'s Record`,
        });
      }
    }
   

  }
  catch(error){
    console.log(error)
    res.status(500).json({message:error.message})
  }
}



// Updating a Single CandWise Payment Out
const updateSingleCandVisePaymentOut=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    let{
      supplierName,
      cand_Name,
      paymentId,
      myPaymentId,
      new_Payment,
      cash_Out,
      new_Curr_Payment,
      curr_Rate,
      newStatus
    } = req.body;

    let newPaymentOut = parseInt(new_Payment, 10);
    let newCashOut = parseInt(cash_Out, 10);

    let newCurrAmount = parseInt(new_Curr_Payment, 10);
    let newCurrRate=parseInt(curr_Rate,10)
    newCurrAmount=newPaymentOut>0?newPaymentOut:newCashOut/newCurrRate

    const existingAgent = await Agents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
      "payment_Out_Schema._id":newStatus

    })

    if (!existingAgent) {
      res.status(404).json({
        message: "Agent not Found",
      });
      return;
    }

    const paymentToFind=existingAgent.payment_Out_Schema.candPayments.find(p=>p._id.toString()===paymentId.toString())

    if(!paymentToFind){
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if(paymentToFind){
      
      const allPersons=existingAgent.payment_Out_Schema.persons
      const candPayment=paymentToFind.payments.find(p=>p._id.toString()===myPaymentId.toString())
      if(!candPayment){
        res.status(404).json({
          message: "Candidate Payment not Found",
        });
      }
      if(candPayment){
        let updatedPaymentOut = candPayment.new_Payment - newPaymentOut;
        let updatedCashOut = candPayment.cash_Out - newCashOut;
        let combinePayment=updatedCashOut-updatedPaymentOut;
        let updateCurr_Amount = candPayment.new_Curr_Payment?candPayment.new_Curr_Payment:0- newCurrAmount;


if(candPayment.cand_Name.toLowerCase()!==cand_Name.toLowerCase()){
  const existingPaymentPerson = existingAgent.payment_Out_Schema.persons.find((person) => person.name.toLowerCase() === candPayment.cand_Name.toLowerCase())
  if(existingPaymentPerson){
    existingPaymentPerson.remaining_Price+=candPayment.new_Payment>0?candPayment.new_Payment:-candPayment.cash_Out
    existingPaymentPerson.total_In+=candPayment.new_Payment>0?-candPayment.new_Payment:candPayment.cash_Out
    existingPaymentPerson.remaining_Curr+=candPayment?.new_Curr_Payment||0
  const existingNewPaymentPerson = existingAgent.payment_Out_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
if(existingNewPaymentPerson){
  existingNewPaymentPerson.remaining_Price += newPaymentOut>0?-newPaymentOut:newCashOut
  existingNewPaymentPerson.total_In += newPaymentOut>0?newPaymentOut:-newCashOut
  existingNewPaymentPerson.remaining_Curr +=newPaymentOut>0?-newCurrAmount:newCurrAmount

  candPayment.cand_Name=existingNewPaymentPerson.name
  candPayment.pp_No=existingNewPaymentPerson.pp_No
  candPayment.entry_Mode=existingNewPaymentPerson.entry_Mode
  candPayment.company=existingNewPaymentPerson.company
  candPayment.country=existingNewPaymentPerson.country
  candPayment.trade=existingNewPaymentPerson.trade
  candPayment.final_Status=existingNewPaymentPerson.final_Status
  candPayment.flight_Date=existingNewPaymentPerson.flight_Date
  candPayment.visa_Amount_PKR=existingNewPaymentPerson.visa_Price_Out_PKR
  candPayment.past_Paid_PKR=existingNewPaymentPerson.total_In
  candPayment.past_Remain_PKR=existingNewPaymentPerson.visa_Price_Out_PKR-existingNewPaymentPerson.total_In
  candPayment.new_Remain_PKR=existingNewPaymentPerson.visa_Price_Out_PKR-existingNewPaymentPerson.total_In+(newPaymentOut>0?-newPaymentOut:newCashOut)
  candPayment.visa_Curr_Amount=existingNewPaymentPerson.visa_Price_Out_Curr
  candPayment.past_Paid_Curr=existingNewPaymentPerson.visa_Price_Out_Curr-existingNewPaymentPerson.remaining_Curr?existingNewPaymentPerson.remaining_Curr:0
  candPayment.new_Remain_Curr=existingNewPaymentPerson.visa_Price_Out_Curr+(newPaymentOut>0?-newCurrAmount:newCurrAmount)
  candPayment.new_Payment=newPaymentOut
  candPayment.cash_Out=newCashOut
  candPayment.new_Curr_Payment=newPaymentOut>0?newPaymentOut:newCashOut/newCurrRate
  candPayment.curr_Rate=newCurrRate
  }

  paymentToFind.payment_Out+=-updatedPaymentOut
  paymentToFind.cash_Out+=-updatedCashOut
  paymentToFind.curr_Amount+=- newCurrRate>0 ?updatedPaymentOut/newCurrRate:0
  paymentToFind.curr_Rate+=-newCurrRate


  await existingAgent.updateOne({
    $inc: {
      "payment_Out_Schema.total_Payment_Out": -updatedPaymentOut,
      "payment_Out_Schema.total_Cash_Out": -updatedCashOut,
      "payment_Out_Schema.remaining_Balance": -combinePayment,
      "payment_Out_Schema.total_Payment_Out_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
      "payment_Out_Schema.remaining_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
    },
  })
  
  const newNotification=new Notifications({
    type:"Agent Cand-Wise Payment Out Updated",
    content:`${user.userName} updated Cand-Wise Payment_Out ${newPaymentOut} of Candidate ${cand_Name} of Agent:${supplierName}'s Record`,
    date: new Date().toISOString().split("T")[0]

  })
  await newNotification.save()
  await existingAgent.save()

  res.status(200).json({
    message: `Successfuly, updated Cand-Wise Payment_Out ${newPaymentOut} of Candidate ${cand_Name} of Agent: ${supplierName}'s Record`,
  });

}
}
else{
// Updating The Cand payment

candPayment.new_Remain_PKR+=updatedPaymentOut>0?updatedPaymentOut:-updatedCashOut
candPayment.new_Payment+=-updatedPaymentOut
candPayment.cash_Out+=-updatedCashOut
candPayment.new_Remain_Curr+=updateCurr_Amount
candPayment.new_Curr_Payment+=-updateCurr_Amount
candPayment.curr_Rate=updatedPaymentOut/updateCurr_Amount

// updating Person total_In and remainig pkr and curr as well
  const personToUpdate=allPersons.find(p=>p.name.toString()===candPayment.cand_Name.toString())
  if(personToUpdate){
    personToUpdate.total_In+=-updatedPaymentOut
    personToUpdate.cash_Out+=-updatedCashOut
    personToUpdate.remaining_Price+=updatedPaymentOut>0?-updatedPaymentOut:updatedCashOut
    personToUpdate.remaining_Curr+=-newCurrAmount
  }

  // uodating parent payment
  paymentToFind.payment_Out+=-updatedPaymentOut
  paymentToFind.cash_Out+=-updatedCashOut
  paymentToFind.curr_Amount+=-updateCurr_Amount
  await existingAgent.updateOne({
    $inc: {
      "payment_Out_Schema.total_Payment_Out": -updatedPaymentOut,
      "payment_Out_Schema.total_Cash_Out": -updatedCashOut,
      "payment_Out_Schema.remaining_Balance": -combinePayment,
      "payment_Out_Schema.total_Payment_Out_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
      "payment_Out_Schema.remaining_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
    },
  })

  const newNotification=new Notifications({
    type:"Agent Cand-Wise Payment Out Updated",
    content:`${user.userName} updated Cand-Wise Payment_Out ${new_Payment} of Candidate ${candPayment.cand_Name} of Agent:${supplierName}'s Record`,
    date: new Date().toISOString().split("T")[0]

  })
  await newNotification.save()
  await existingAgent.save()

  res.status(200).json({
    message: `Successfuly, updated Cand-Wise Payment_Out ${new_Payment} of Candidate ${candPayment.cand_Name} of Agent: ${supplierName}'s Record`,
  });
}

      }
    }
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:error.message})
  }
}


module.exports = {
  addPaymentIn,
  deleteSinglePaymentIn,
  addPaymentInReturn,
  updateSinglePaymentIn,
  updateAgentTotalPaymentIn,
  addMultiplePaymentsIn,
  deletePaymentInPerson,
  updatePaymentInPerson,
  deleteAgentPaymentInSchema,
  getAllPaymentsIn,
  addPaymentOut,
  addPaymentOutReturn,
  deleteSinglePaymentOut,
  updateSinglePaymentOut,
  addMultiplePaymentsOut,
  deletePaymentOutPerson,
  updatePaymentOutPerson,
  deleteAgentPaymentOutSchema,
  updateAgentTotalPaymentOut,
  getAllPaymentsOut,
  changePaymentInStatus,
  changePaymentOutStatus,
  addCandVisePaymentIn,
  addCandVisePaymentInReturn,
  deleteCandVisePaymentIn,
  deleteSingleCandVisePaymentIn,
  updateSingleCandVisePaymentIn,
  addCandVisePaymentOut,
  addCandVisePaymentOutReturn,
  deleteCandVisePaymentOut,
  deleteSingleCandVisePaymentOut,
  updateSingleCandVisePaymentOut,
  updateCandVisePaymentIn,
  updateCandVisePaymentOut
}