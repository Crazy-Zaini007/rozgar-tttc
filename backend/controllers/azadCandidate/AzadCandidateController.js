const cloudinary = require('../cloudinary')
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
const Notifications=require('../../database/notifications/NotificationModel.js')

const InvoiceNumber = require('../../database/invoiceNumber/InvoiceNumberSchema')
const CashInHand = require('../../database/cashInHand/CashInHandSchema')
const mongoose = require('mongoose')
const moment = require('moment');
// Azad Candidate Section

// Addding a New Payment In
const addAzadCandPaymentIn = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user) {
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }
            if (user.role === "Admin") {
                const { supplierName, category, payment_Via, payment_Type, slip_No, payment_In, slip_Pic, details, curr_Country, curr_Rate, curr_Amount, open, close, date, cand_Name } = req.body
                if (!supplierName) {
                    return res.status(400).json({ message: "supplier Name is required" })
                }
                if (!category) {
                    return res.status(400).json({ message: "Category is required" })
                }
                if (!payment_Via) {
                    return res.status(400).json({ message: "Payment Via is required" })
                }
                if (!payment_Type) {
                    return res.status(400).json({ message: "Payment Type is required" })
                }

                if (!payment_In) {
                    return res.status(400).json({ message: "Payment In is required" })
                }

                if (!date) {
                    return res.status(400).json({ message: "Date is required" })
                }

                const newPaymentIn = parseInt(payment_In, 10);
                const newCurrAmount = parseInt(curr_Amount, 10);


                const existingSupplier = await AzadCandidate.findOne({ 'Candidate_Payment_In_Schema.supplierName': supplierName });
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
                            "Candidate_Payment_In_Schema.open": open,
                            "Candidate_Payment_In_Schema.close": close,// Make sure close is defined
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




                    const updatedSupplier = await AzadCandidate.findById(existingSupplier._id);

                    res.status(200).json({ data: updatedSupplier, message: `Payment In: ${payment_In} added Successfully to ${updatedSupplier.Candidate_Payment_In_Schema.supplierName}'s Record` });

                } catch (error) {
                    console.error('Error updating values:', error);
                    res.status(500).json({ message: 'Error updating values', error: error.message });
                }

            }
        }



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const addAzadCandMultiplePaymentsIn = async (req, res) => {
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


            const updatedPayments = [];

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
                    date,
                   
                    open, close
                } = payment;

                const newPaymentIn = parseInt(payment_In, 10);
                const newCurrAmount = parseInt(curr_Amount, 10);
                const suppliers=await AzadCandidate.find({})
                let existingSupplier
        
               for (const supplier of suppliers){
                if(supplier.Candidate_Payment_In_Schema){
                  if(supplier.Candidate_Payment_In_Schema.supplierName.toLowerCase()===supplierName.toLowerCase()){
                    existingSupplier = supplier;
                    break
                  }
                }
               }
                

                if (!existingSupplier) {
                    res.status(404).json({
                        message: `${supplierName} not found`
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



                const newPayment = {
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

                updatedPayments.push(newPayment)

                await existingSupplier.updateOne({
                    $inc: {
                        "Candidate_Payment_In_Schema.total_Payment_In": payment_In,
                        "Candidate_Payment_In_Schema.remaining_Balance": -payment_In,
                        "Candidate_Payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,
                        "Candidate_Payment_In_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,

                    },
                    $set: {
                        "Candidate_Payment_In_Schema.open": open, // Set to true if you always want to open
                        "Candidate_Payment_In_Schema.close": close, // Set to false if you always want to close
                    },
                    $push: {
                        "Candidate_Payment_In_Schema.payment": newPayment,
                    },
                })

                const cashInHandDoc = await CashInHand.findOne({});

                if (!cashInHandDoc) {
                    const newCashInHandDoc = new CashInHand();
                    await newCashInHandDoc.save();
                }

                const cashInHandUpdate = {
                    $inc: {}
                };
                // Assuming payment_Via should be checked for each payment individually
                if (payment_Via.toLowerCase() === "cash" ) {
                    cashInHandUpdate.$inc.cash = newPaymentIn;
                    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
                  }
                  else{
                    cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
                    cashInHandUpdate.$inc.total_Cash = newPaymentIn;
                  }


                await CashInHand.updateOne({}, cashInHandUpdate);

            }




            res.status(200).json({
                message: `${updatedPayments.length} Payments In added Successfully to ${updatedSupplier.Candidate_Payment_In_Schema.supplierName}'s Record`
            });
        } catch (error) {
            console.error('Error updating values:', error);
            res.status(500).json({
                message: 'Error updating values',
                error: error.message
            });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Addding a New Payment In Cash Out
const addAzadCandPaymentInReturn = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user) {
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }
            if (user.role === "Admin") {
                const { supplierName, category, payment_Via, payment_Type, slip_No, cash_Out, slip_Pic, details, curr_Country, curr_Rate, curr_Amount, open, close, date, cand_Name } = req.body
                if (!supplierName) {
                    return res.status(400).json({ message: "supplier Name is required" })
                }
                if (!category) {
                    return res.status(400).json({ message: "Category is required" })
                }
                if (!payment_Via) {
                    return res.status(400).json({ message: "Payment Via is required" })
                }
                if (!payment_Type) {
                    return res.status(400).json({ message: "Payment Type is required" })
                }

                if (!cash_Out) {
                    return res.status(400).json({ message: "Cash Out is required" })
                }

                if (!date) {
                    return res.status(400).json({ message: "Date is required" })
                }

                const newCashOut = parseInt(cash_Out, 10);
                const newCurrAmount = parseInt(curr_Amount, 10);


                const existingSupplier = await AzadCandidate.findOne({ 'Candidate_Payment_In_Schema.supplierName': supplierName });
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
                    date,
                    invoice: nextInvoiceNumber,
                    cand_Name,
                };

                try {

                    // Update total_Visa_Price_In_PKR and other fields using $inc
                    await existingSupplier.updateOne({
                        $inc: {
                            
                            'Candidate_Payment_In_Schema.total_Cash_Out': newCashOut,
                            'Candidate_Payment_In_Schema.remaining_Balance': newCashOut,
                            "Candidate_Payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? -newCurrAmount : 0,
                            "Candidate_Payment_In_Schema.remaining_Curr": newCurrAmount ? newCurrAmount : 0,


                        },
                        $set: {
                            "Candidate_Payment_In_Schema.open": open,
                            "Candidate_Payment_In_Schema.close": close, // Make sure close is defined
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
                        cashInHandUpdate.$inc.cash = -newCashOut;
                        cashInHandUpdate.$inc.total_Cash = -newCashOut;
                      }
                      else{
                        cashInHandUpdate.$inc.bank_Cash = -newCashOut;
                        cashInHandUpdate.$inc.total_Cash = -newCashOut;
                      }

                    await CashInHand.updateOne({}, cashInHandUpdate);


                    const updatedSupplier = await AzadCandidate.findById(existingSupplier._id);

                    res.status(200).json({ data: updatedSupplier, message: `Cash Out: ${cash_Out} added Successfully to ${updatedSupplier.Candidate_Payment_In_Schema.supplierName}'s Record` });

                } catch (error) {
                    console.error('Error updating values:', error);
                    res.status(500).json({ message: 'Error updating values', error: error.message });
                }

            }
        }



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Deleting a single Payment In

const deleteSingleAzadCandPaymentIn = async (req, res) => {

  
    const userId = req.user._id
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

        const { paymentId, payment_In, cash_Out, curr_Amount, supplierName, payment_Via } = req.body

        const existingSupplier = await AzadCandidate.findOne({ 'Candidate_Payment_In_Schema.supplierName': supplierName })
        if (!existingSupplier) {
            res.status(404).json({
                message: "Supplier not Found"
            });
        }
        const newPaymentIn = payment_In - cash_Out

        try {


            // Add this line for logging

            await existingSupplier.updateOne({
                $inc: {
                    'Candidate_Payment_In_Schema.total_Payment_In': -newPaymentIn,
                    'Candidate_Payment_In_Schema.total_Cash_Out': -cash_Out,
                    'Candidate_Payment_In_Schema.remaining_Balance': newPaymentIn,
                    "Candidate_Payment_In_Schema.total_Payment_In_Curr": curr_Amount ? -curr_Amount : 0,
                    "Candidate_Payment_In_Schema.remaining_Curr": curr_Amount ? curr_Amount : 0,

                },

                $pull: {
                    'Candidate_Payment_In_Schema.payment': { _id: paymentId }

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
                cashInHandUpdate.$inc.cash = -newPaymentIn;
                cashInHandUpdate.$inc.total_Cash = -newPaymentIn;
              }
              else{
                cashInHandUpdate.$inc.bank_Cash = -newPaymentIn;
                cashInHandUpdate.$inc.total_Cash = -newPaymentIn;
              }

            await CashInHand.updateOne({}, cashInHandUpdate);
            const updatedSupplier = await AzadCandidate.findById(existingSupplier._id);
            res.status(200).json({ message: `Payment In with ID ${paymentId} deleted successfully from ${supplierName}` })


        } catch (error) {
            console.error('Error updating values:', error);
            res.status(500).json({ message: 'Error updating values', error: error.message });
        }


    }
}


// Updating a single Payment In Details
const updateSingleAzadCandPaymentIn = async (req, res) => {
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
            const { supplierName, paymentId, category, payment_Via, payment_Type, slip_No, details, payment_In, cash_Out, curr_Country, curr_Rate, curr_Amount, slip_Pic, date, cand_Name } = req.body;

            const newPaymentIn = parseInt(payment_In, 10);
            const newCashOut = parseInt(cash_Out, 10);
            const newCurrAmount = parseInt(curr_Amount, 10);

            const existingSupplier = await AzadCandidate.findOne({ 'Candidate_Payment_In_Schema.supplierName': supplierName });
            if (!existingSupplier) {
                res.status(404).json({ message: "Supplier not found" });
                return;
            }

            // Find the payment within the payment array using paymentId
            const paymentToUpdate = existingSupplier.Candidate_Payment_In_Schema.payment.find(payment => payment._id.toString() === paymentId);

            if (!paymentToUpdate) {
                res.status(404).json({ message: "Payment not found" });
                return;
            }

            const updatedCashout = paymentToUpdate.cash_Out - newCashOut
            const updatedPaymentIn = paymentToUpdate.payment_In - payment_In
            const updateCurr_Amount = newCurrAmount - paymentToUpdate.curr_Amount
            const newBalance = updatedCashout - updatedPaymentIn

            let uploadImage;

            if (slip_Pic) {
                uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                    upload_preset: 'rozgar'
                });
            }

            await existingSupplier.updateOne(
                {
                    $inc: {
                        'Candidate_Payment_In_Schema.total_Payment_In': -updatedPaymentIn,
                        'Candidate_Payment_In_Schema.total_Cash_Out': -updatedCashout,
                        'Candidate_Payment_In_Schema.remaining_Balance': -newBalance,
                        "Candidate_Payment_In_Schema.total_Payment_In_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
                        "Candidate_Payment_In_Schema.remaining_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
                    }
                }
            )
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
                const newCashInHandDoc = new CashInHand();
                await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
                $inc: {}
            };

             if (payment_Via.toLowerCase() === "cash") {
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
            paymentToUpdate.slip_Pic = uploadImage?.secure_url || "";
            paymentToUpdate.payment_In_Curr = curr_Country;
            paymentToUpdate.curr_Rate = curr_Rate;
            paymentToUpdate.curr_Amount = newCurrAmount;
            paymentToUpdate.date = date;
            paymentToUpdate.cand_Name = cand_Name


            // Save the updated supplier

            await existingSupplier.save();

            const updatedSupplier = await AzadCandidate.findById(existingSupplier._id);
            console.log(updatedSupplier)
            res.status(200).json({ message: "Payment In details updated successfully", data: updatedSupplier });
        } catch (error) {
            console.error('Error updating payment details:', error);
            res.status(500).json({ message: 'Error updating payment details', error: error.message });
        }
    }
};



//deleting the Agent Candidate_Payment_In_Schema
const deleteAzadCandPaymentInSchema = async (req, res) => {
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

        const existingSupplier = await AzadCandidate.findOne({
            "Candidate_Payment_In_Schema.supplierName": supplierName,
        });

        if (!existingSupplier) {
            res.status(404).json({ message: "Supplier not found" });
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


        cashInHandUpdate.$inc.total_Cash = -existingSupplier.Candidate_Payment_In_Schema.total_Payment_In
        cashInHandUpdate.$inc.total_Cash =  existingSupplier.Candidate_Payment_In_Schema.total_Cash_Out


        await CashInHand.updateOne({}, cashInHandUpdate);

        // Delete the Candidate_Payment_In_Schema
        existingSupplier.Candidate_Payment_In_Schema = undefined;

        // Save the updated supplier without Candidate_Payment_In_Schema
        await existingSupplier.save();

        const updatedSupplier = await AzadCandidate.findById(existingSupplier._id);
        res.status(200).json({
            message: `${supplierName} deleted successfully`,
            data: updatedSupplier,
        });
    } catch (error) {
        console.error("Error deleting Candidate_Payment_In_Schema:", error);
        res.status(500).json({
            message: "Error deleting Candidate_Payment_In_Schema",
            error: error.message,
        });
    }
}


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
  
        const {name,pp_No,contact,company,country,entry_Mode,final_Status,trade,flight_Date} =
        req.body;
       
        let entryMode
  
        const azadCandidateIn=await AzadCandidate.findOne({
            "Candidate_Payment_In_Schema.supplierName": name,
            "Candidate_Payment_In_Schema.contact": contact,
            "Candidate_Payment_In_Schema.pp_No": pp_No,
          })
          if(azadCandidateIn){
            
        if(final_Status.toLowerCase()==='offer letter' || final_Status.toLowerCase()==='offer_letter'){
            const newNotification=new Notifications({
              type:"Offer Letter",
              content:`${name}'s Final Status is updated to Offer Letter.`,
              date:new Date().toISOString().split("T")[0]
            })
            await newNotification.save()
          }
          if(final_Status.toLowerCase()==='e number' || final_Status.toLowerCase()==='e_number'){
            const newNotification=new Notifications({
              type:"E Number",
              content:`${name}'s Final Status is updated to E Number.`,
              date:new Date().toISOString().split("T")[0]
  
            })
            await newNotification.save()
          }
  
          if(final_Status.toLowerCase()==='qvc' || final_Status.toLowerCase()==='q_v_c'){
            const newNotification=new Notifications({
              type:"QVC",
              content:`${name}'s Final Status is updated to QVC.`,
              date:new Date().toISOString().split("T")[0]
  
            })
            await newNotification.save()
          }
          if(final_Status.toLowerCase()==='visa issued' || final_Status.toLowerCase()==='visa_issued' || final_Status.toLowerCase()==='vissa issued'  || final_Status.toLowerCase()==='vissa_issued'){
            const newNotification=new Notifications({
              type:"Visa Issued",
              content:`${name}'s Final Status is updated to Visa Issued.`,
              date:new Date().toISOString().split("T")[0]
  
            })
            await newNotification.save()
          }
          if(final_Status.toLowerCase()==='ptn' || final_Status.toLowerCase()==='p_t_n'){
            const newNotification=new Notifications({
              type:"PTN",
              content:`${name}'s Final Status is updated to PTN.`,
              date:new Date().toISOString().split("T")[0]
            })
            await newNotification.save()
          }
  
          if(final_Status.toLowerCase()==='ticket' || final_Status.toLowerCase()==='tiket'){
            const newNotification=new Notifications({
              type:"Ticket",
              content:`${name}'s Final Status is updated to Ticket.`,
              date:new Date().toISOString().split("T")[0]
            })
            await newNotification.save()
          }
         
            entryMode=azadCandidateIn.Candidate_Payment_In_Schema.entry_Mode
            azadCandidateIn.Candidate_Payment_In_Schema.company=company
            azadCandidateIn.Candidate_Payment_In_Schema.country=country
            azadCandidateIn.Candidate_Payment_In_Schema.entry_Mode=entry_Mode
            azadCandidateIn.Candidate_Payment_In_Schema.final_Status=final_Status
            azadCandidateIn.Candidate_Payment_In_Schema.trade=trade
            azadCandidateIn.Candidate_Payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
            await azadCandidateIn.save()
          
          }
          
          const azadCandidateOut=await AzadCandidate.findOne({
            "Candidate_Payment_Out_Schema.supplierName": name,
            "Candidate_Payment_Out_Schema.entry_Mode": entryMode,
            "Candidate_Payment_Out_Schema.pp_No": pp_No,
          })
          if(azadCandidateOut){
            azadCandidateOut.Candidate_Payment_Out_Schema.company=company
            azadCandidateOut.Candidate_Payment_Out_Schema.country=country
            azadCandidateOut.Candidate_Payment_Out_Schema.entry_Mode=entry_Mode
            azadCandidateOut.Candidate_Payment_Out_Schema.final_Status=final_Status
            azadCandidateOut.Candidate_Payment_Out_Schema.trade=trade
            azadCandidateOut.Candidate_Payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
            await azadCandidateOut.save()
          
          }
  
       
         // Updating in Agents both Schema
         const agents=await Agents.find({})
  
        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons)
  {
    const personIn= agent.payment_In_Schema.persons.find(person=> person.name ===name.toString() && person.pp_No===pp_No.toString() && person.entry_Mode===entryMode.toString())
         if(personIn){
          personIn.company=company
          personIn.country=country
          personIn.entry_Mode=entry_Mode
          personIn.final_Status=final_Status
          personIn.trade=trade
          personIn.flight_Date=flight_Date?flight_Date:'Not Fly'
          await agent.save()
         }
  }
  
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
          
          if(ticketSupplier.Supplier_Payment_In_Schema && ticketSupplier.Supplier_Payment_In_Schema.persons){
            const SupPersonIn= ticketSupplier.Supplier_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
  
          if(ticketSupplier.Supplier_Payment_Out_Schema && ticketSupplier.Supplier_Payment_Out_Schema.persons){
            const SupPersonOut= ticketSupplier.Supplier_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
        
   
         
  
    
  
          if(ticketSupplier.Agent_Payment_In_Schema && ticketSupplier.Agent_Payment_In_Schema.persons){
            const AgentPersonIn= ticketSupplier.Agent_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonIn){
              AgentPersonIn.company=company
              AgentPersonIn.country=country
              AgentPersonIn.entry_Mode=entry_Mode
              AgentPersonIn.final_Status=final_Status
              AgentPersonIn.trade=trade
              AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
             await ticketSupplier.save()
  
            }
          }
         
          if(ticketSupplier.Agent_Payment_Out_Schema && ticketSupplier.Agent_Payment_Out_Schema.persons){
            const AgentPersonOut= ticketSupplier.Agent_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonOut){
              AgentPersonOut.company=company
              AgentPersonOut.country=country
              AgentPersonOut.entry_Mode=entry_Mode
              AgentPersonOut.final_Status=final_Status
              AgentPersonOut.trade=trade
              AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
             await ticketSupplier.save()
  
            }
          }
   
       
         }
         
  
  
  
  
         const visitSuppliers=await VisitSuppliers.find({})
         for(const visitSupplier of visitSuppliers){
   
          if(visitSupplier.Supplier_Payment_In_Schema && visitSupplier.Supplier_Payment_In_Schema.persons){
            const SupPersonIn= visitSupplier.Supplier_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
  
          if(visitSupplier.Supplier_Payment_Out_Schema && visitSupplier.Supplier_Payment_Out_Schema.persons){
            const SupPersonOut= visitSupplier.Supplier_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
        
     
          if(visitSupplier.Agent_Payment_In_Schema && visitSupplier.Agent_Payment_In_Schema.persons){
            const AgentPersonIn= visitSupplier.Agent_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonIn){
              AgentPersonIn.company=company
              AgentPersonIn.country=country
              AgentPersonIn.entry_Mode=entry_Mode
              AgentPersonIn.final_Status=final_Status
              AgentPersonIn.trade=trade
              AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
             await visitSupplier.save()
  
            }
          }
         
          if(visitSupplier.Agent_Payment_Out_Schema && visitSupplier.Agent_Payment_Out_Schema.persons){
            const AgentPersonOut= visitSupplier.Agent_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonOut){
              AgentPersonOut.company=company
              AgentPersonOut.country=country
              AgentPersonOut.entry_Mode=entry_Mode
              AgentPersonOut.final_Status=final_Status
              AgentPersonOut.trade=trade
              AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
             await visitSupplier.save()
  
            }
          }
         }
  
  
         const azadSuppliers=await AzadSupplier.find({})
         for(const azadSupplier of azadSuppliers){
          if(azadSupplier.Supplier_Payment_In_Schema && azadSupplier.Supplier_Payment_In_Schema.persons){
            const SupPersonIn= azadSupplier.Supplier_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
        
   
          if(azadSupplier.Supplier_Payment_Out_Schema && azadSupplier.Supplier_Payment_Out_Schema.persons){
            const SupPersonOut= azadSupplier.Supplier_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
        
  
  
          if(azadSupplier.Agent_Payment_In_Schema && azadSupplier.Agent_Payment_In_Schema.persons){
            const AgentPersonIn= azadSupplier.Agent_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonIn){
              AgentPersonIn.company=company
              AgentPersonIn.country=country
              AgentPersonIn.entry_Mode=entry_Mode
              AgentPersonIn.final_Status=final_Status
              AgentPersonIn.trade=trade
              AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
             await azadSupplier.save()
  
            }
          }
         
          if(azadSupplier.Agent_Payment_Out_Schema && azadSupplier.Agent_Payment_Out_Schema.persons){
            const AgentPersonOut= azadSupplier.Agent_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonOut){
              AgentPersonOut.company=company
              AgentPersonOut.country=country
              AgentPersonOut.entry_Mode=entry_Mode
              AgentPersonOut.final_Status=final_Status
              AgentPersonOut.trade=trade
              AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
             await azadSupplier.save()
              
            }
          }
        
         }
       
  
  
  
     const ticketCandidateIn=await TicketCandidate.findOne({
      "Candidate_Payment_In_Schema.supplierName": name,
      "Candidate_Payment_In_Schema.entry_Mode": entryMode,
      "Candidate_Payment_In_Schema.pp_No": pp_No,
    })
    if(ticketCandidateIn){
      ticketCandidateIn.Candidate_Payment_In_Schema.company=company
      ticketCandidateIn.Candidate_Payment_In_Schema.country=country
      ticketCandidateIn.Candidate_Payment_In_Schema.entry_Mode=entry_Mode
      ticketCandidateIn.Candidate_Payment_In_Schema.final_Status=final_Status
      ticketCandidateIn.Candidate_Payment_In_Schema.trade=trade
      ticketCandidateIn.Candidate_Payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
      await ticketCandidateIn.save()
  
    }
    
    const ticketCandidateOut=await TicketCandidate.findOne({
      "Candidate_Payment_Out_Schema.supplierName": name,
      "Candidate_Payment_Out_Schema.entry_Mode": entryMode,
      "Candidate_Payment_Out_Schema.pp_No": pp_No,
    })
    if(ticketCandidateOut){
      ticketCandidateOut.Candidate_Payment_Out_Schema.company=company
      ticketCandidateOut.Candidate_Payment_Out_Schema.country=country
      ticketCandidateOut.Candidate_Payment_Out_Schema.entry_Mode=entry_Mode
      ticketCandidateOut.Candidate_Payment_Out_Schema.final_Status=final_Status
      ticketCandidateOut.Candidate_Payment_Out_Schema.trade=trade
      ticketCandidateOut.Candidate_Payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
      await ticketCandidateOut.save()
  
    }
    
  
     const visitCandidateIn=await VisitCandidate.findOne({
      "Candidate_Payment_In_Schema.supplierName": name,
      "Candidate_Payment_In_Schema.entry_Mode": entryMode,
      "Candidate_Payment_In_Schema.pp_No": pp_No,
    })
    if(visitCandidateIn){
      visitCandidateIn.Candidate_Payment_In_Schema.company=company
      visitCandidateIn.Candidate_Payment_In_Schema.country=country
      visitCandidateIn.Candidate_Payment_In_Schema.entry_Mode=entry_Mode
      visitCandidateIn.Candidate_Payment_In_Schema.final_Status=final_Status
      visitCandidateIn.Candidate_Payment_In_Schema.trade=trade
      visitCandidateIn.Candidate_Payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
      await visitCandidateIn.save()
  
    }
    
    const visitCandidateOut=await VisitCandidate.findOne({
      "Candidate_Payment_Out_Schema.supplierName": name,
      "Candidate_Payment_Out_Schema.entry_Mode": entryMode,
      "Candidate_Payment_Out_Schema.pp_No": pp_No,
    })
    if(visitCandidateOut){
      visitCandidateOut.Candidate_Payment_Out_Schema.company=company
      visitCandidateOut.Candidate_Payment_Out_Schema.country=country
      visitCandidateOut.Candidate_Payment_Out_Schema.entry_Mode=entry_Mode
      visitCandidateOut.Candidate_Payment_Out_Schema.final_Status=final_Status
      visitCandidateOut.Candidate_Payment_Out_Schema.trade=trade
      visitCandidateOut.Candidate_Payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
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
    entry.flight_Date=flight_Date?flight_Date:'Not Fly'
    await entry.save()
  
  }
  
  
      res.status(200).json({message:`${name} updated successfully!`})
     
    
      } catch (error) {
        
      res.status(500).json({ message: error });
        
      }
      
  
    }
  
  
  }
  


// Getting All Supplier Payments In
const getAzadCandAllPaymentsIn = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.role === "Admin") {
            const supplierPayments = await AzadCandidate.find({}).sort({ createdAt: -1 });
            const formattedDetails = supplierPayments
                .filter(candidate => candidate.Candidate_Payment_In_Schema)
                .map(candidate => {
                    const paymentInSchema = candidate.Candidate_Payment_In_Schema
                    return {
                        supplier_Id: paymentInSchema.supplier_Id,
                        supplierName: paymentInSchema.supplierName,
                        pp_No: paymentInSchema.pp_No,
                        entry_Mode: paymentInSchema.entry_Mode,
                        company: paymentInSchema.company,
                        country: paymentInSchema.country,
                        trade: paymentInSchema.trade,
                        final_Status: paymentInSchema.final_Status,
                        flight_Date: paymentInSchema.flight_Date,
                        total_Visa_Price_In_Curr: paymentInSchema.total_Visa_Price_In_Curr,
                        total_Payment_In_Curr: paymentInSchema.total_Payment_In_Curr,
                        remaining_Curr: paymentInSchema.remaining_Curr,
                        total_Visa_Price_In_PKR: paymentInSchema.total_Visa_Price_In_PKR,
                        total_Payment_In: paymentInSchema.total_Payment_In,
                        total_Cash_Out: paymentInSchema.total_Cash_Out,
                        remaining_Balance: paymentInSchema.remaining_Balance,
                        curr_Country: paymentInSchema.curr_Country,
                        payment: paymentInSchema.payment || [],
                        open: paymentInSchema.open || false,
                        close: paymentInSchema.close || false,
                        createdAt: moment(paymentInSchema.createdAt).format('YYYY-MM-DD'),
                        updatedAt: moment(paymentInSchema.updatedAt).format('YYYY-MM-DD'),
                    }
                })
            res.status(200).json({ data: formattedDetails });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Adding a new Payment Out
const addAzadCandPaymentOut = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user) {
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }
            if (user.role === "Admin") {
                const { supplierName, category, payment_Via, payment_Type, slip_No, payment_Out, slip_Pic, details, curr_Country, curr_Rate, curr_Amount, open, close, date, cand_Name } = req.body
                if (!supplierName) {
                    return res.status(400).json({ message: "supplier Name is required" })
                }
                if (!category) {
                    return res.status(400).json({ message: "Category is required" })
                }
                if (!payment_Via) {
                    return res.status(400).json({ message: "Payment Via is required" })
                }
                if (!payment_Type) {
                    return res.status(400).json({ message: "Payment Type is required" })
                }

                if (!payment_Out) {
                    return res.status(400).json({ message: "Payment Out is required" })
                }

                if (!date) {
                    return res.status(400).json({ message: "Date is required" })
                }


                const newPaymentOut = parseInt(payment_Out, 10);
                const newCurrAmount = parseInt(curr_Amount, 10);
                // Fetch the current invoice number and increment it by 1 atomically

                const existingSupplier = await AzadCandidate.findOne({ 'Candidate_Payment_Out_Schema.supplierName': supplierName });
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
                    cand_Name,
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
                            "Candidate_Payment_Out_Schema.open": open,
                            "Candidate_Payment_Out_Schema.close": close
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

                    const updatedSupplier = await AzadCandidate.findById(existingSupplier._id);

                    res.status(200).json({ data: updatedSupplier, message: `Payment Out: ${payment_Out} added Successfully to ${supplierName}'s Record` });

                } catch (error) {
                    console.error('Error updating values:', error);
                    res.status(500).json({ message: 'Error updating values', error: error.message });
                }

            }
        }



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Adding a new Payment Out Return
const addAzadCandPaymentOutReturn = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user) {
            if (user.role !== "Admin") {
                res.status(404).json({ message: "Only Admin is allowed!" })
            }
            if (user.role === "Admin") {
                const { supplierName, category, payment_Via, payment_Type, slip_No, cash_Out, slip_Pic, details, curr_Country, curr_Rate, curr_Amount, open, close, date, cand_Name } = req.body
                if (!supplierName) {
                    return res.status(400).json({ message: "supplier Name is required" })
                }
                if (!category) {
                    return res.status(400).json({ message: "Category is required" })
                }
                if (!payment_Via) {
                    return res.status(400).json({ message: "Payment Via is required" })
                }
                if (!payment_Type) {
                    return res.status(400).json({ message: "Payment Type is required" })
                }

                if (!cash_Out) {
                    return res.status(400).json({ message: "Cash Out is required" })
                }

                if (!date) {
                    return res.status(400).json({ message: "Date is required" })
                }


                const newCashOut = parseInt(cash_Out, 10);
                const newCurrAmount = parseInt(curr_Amount, 10);
                // Fetch the current invoice number and increment it by 1 atomically

                const existingSupplier = await AzadCandidate.findOne({ 'Candidate_Payment_Out_Schema.supplierName': supplierName });
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
                    cash_Out: newCashOut,
                    slip_Pic: uploadImage?.secure_url || '',
                    details,
                    payment_Out_Curr: curr_Country ? curr_Country : 0,
                    curr_Rate: curr_Rate ? curr_Rate : 0,
                    curr_Amount: newCurrAmount ? newCurrAmount : 0,
                    date,
                    invoice: nextInvoiceNumber,
                    cand_Name,
                };


                try {

                    // Update total_Visa_Price_In_PKR and other fields using $inc
                    await existingSupplier.updateOne({
                        $inc: {
                           
                            'Candidate_Payment_Out_Schema.total_Cash_Out': newCashOut,
                            'Candidate_Payment_Out_Schema.remaining_Balance': newCashOut,
                            "Candidate_Payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? -newCurrAmount : 0,
                            "Candidate_Payment_Out_Schema.remaining_Curr": newCurrAmount ? newCurrAmount : 0,


                        },
                        $set: {
                            "Candidate_Payment_Out_Schema.open": open,
                            "Candidate_Payment_Out_Schema.close": close
                        },
                        $push: {
                            'Candidate_Payment_Out_Schema.payment': payment
                        }
                    })
                    const cashInHandDoc = await CashInHand.findOne({});

                    if (!cashInHandDoc) {
                        const newCashInHandDoc = new CashInHand();
                        await newCashInHandDoc.save();
                    }

                    const cashInHandUpdate = {
                        $inc: {}
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



                    const updatedSupplier = await AzadCandidate.findById(existingSupplier._id);

                    res.status(200).json({ data: updatedSupplier, message: `Cash Out: ${cash_Out} added Successfully to ${supplierName}'s Record` });

                } catch (error) {
                    console.error('Error updating values:', error);
                    res.status(500).json({ message: 'Error updating values', error: error.message });
                }

            }
        }



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



// Deleting a single Payment Out

const deleteAzadCandSinglePaymentOut = async (req, res) => {

   
    const userId = req.user._id
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


        const { paymentId, payment_Out, supplierName, cash_Out, curr_Amount, payment_Via } = req.body

        const existingSupplier = await AzadCandidate.findOne({ 'Candidate_Payment_Out_Schema.supplierName': supplierName })
        if (!existingSupplier) {
            res.status(404).json({
                message: "Supplier not Found"
            });
        }
        const newPaymentOut = payment_Out - cash_Out

        try {


            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingSupplier.updateOne({
                $inc: {
                    'Candidate_Payment_Out_Schema.total_Payment_Out': -newPaymentOut,
                    'Candidate_Payment_Out_Schema.total_Cash_Out': -cash_Out,
                    'Candidate_Payment_Out_Schema.remaining_Balance': newPaymentOut,
                    "Candidate_Payment_Out_Schema.total_Payment_Out_Curr": curr_Amount ? -curr_Amount : 0,
                    "Candidate_Payment_Out_Schema.remaining_Curr": curr_Amount ? curr_Amount : 0,


                },

                $pull: {
                    'Candidate_Payment_Out_Schema.payment': { _id: paymentId }

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
                cashInHandUpdate.$inc.cash = newPaymentOut;
                cashInHandUpdate.$inc.total_Cash = newPaymentOut;
              }
              else{
                cashInHandUpdate.$inc.bank_Cash = newPaymentOut;
                cashInHandUpdate.$inc.total_Cash = newPaymentOut;
              }

            await CashInHand.updateOne({}, cashInHandUpdate);

            const updatedSupplier = await AzadCandidate.findById(existingSupplier._id);
            res.status(200).json({ message: `Payment Out deleted sucessfully from ${supplierName}` })


        } catch (error) {
            console.error('Error updating values:', error);
            res.status(500).json({ message: 'Error updating values', error: error.message });
        }


    }
}

// Updating a single Payment Out Details
const updateAzadCandSinglePaymentOut = async (req, res) => {
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
        const { supplierName, paymentId, category, payment_Via, payment_Type, slip_No, details, payment_Out, curr_Country, curr_Rate, curr_Amount, slip_Pic, date, cash_Out, cand_Name } = req.body;
        const newPaymentOut = parseInt(payment_Out, 10);
        const newCashOut = parseInt(cash_Out, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);

        try {
            const existingSupplier = await AzadCandidate.findOne({ 'Candidate_Payment_Out_Schema.supplierName': supplierName });

            if (!existingSupplier) {
                res.status(404).json({ message: "Supplier not found" });
                return;
            }
            // Find the payment within the payment array using paymentId
            const paymentToUpdate = existingSupplier.Candidate_Payment_Out_Schema.payment.find(payment => payment._id.toString() === paymentId);

            if (!paymentToUpdate) {
                res.status(404).json({ message: "Payment not found" });
                return;
            }

            const updatedCashout = paymentToUpdate.cash_Out - newCashOut
            const updatedPaymentOut = paymentToUpdate.payment_Out - payment_Out
            const updateCurr_Amount = newCurrAmount - paymentToUpdate.curr_Amount
            const newBalance = updatedCashout - updatedPaymentOut

            let uploadImage;

            if (slip_Pic) {
                uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                    upload_preset: 'rozgar'
                });
            }


            await existingSupplier.updateOne(
                {
                    $inc: {
                        'Candidate_Payment_Out_Schema.total_Payment_Out': -updatedPaymentOut,
                        'Candidate_Payment_Out_Schema.total_Cash_Out': -updatedCashout,
                        'Candidate_Payment_Out_Schema.remaining_Balance': -newBalance,
                        "Candidate_Payment_Out_Schema.total_Payment_Out_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
                        "Candidate_Payment_Out_Schema.remaining_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
                    }
                }
            )
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
                const newCashInHandDoc = new CashInHand();
                await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
                $inc: {}
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
            paymentToUpdate.cash_Out = newCashOut,
                paymentToUpdate.slip_Pic = uploadImage?.secure_url || "";
            paymentToUpdate.payment_Out_Curr = curr_Country;
            paymentToUpdate.curr_Rate = curr_Rate;
            paymentToUpdate.curr_Amount = curr_Amount;
            paymentToUpdate.date = date;
            paymentToUpdate.cand_Name = cand_Name
            // Save the updated supplier
            await existingSupplier.save();

            const updatedSupplier = await AzadCandidate.findById(existingSupplier._id);


            res.status(200).json({ message: "Payment Out details updated successfully", data: updatedSupplier });
        } catch (error) {
            console.error('Error updating payment details:', error);
            res.status(500).json({ message: 'Error updating payment details', error: error.message });
        }
    }
};



// Adding multiple Payment Out
const addAzadCandMultiplePaymentsOut = async (req, res) => {
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
            const updatedPayments = [];

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
                    open,
                    close
                } = payment;

                if (!supplierName) {
                    res.status(400).json({ message: "Supplier Name is required" });
                    return;
                }

                const newPaymentOut = parseInt(payment_Out, 10);
                const newCurrAmount = parseInt(curr_Amount, 10);
                const suppliers=await AzadCandidate.find({})
                let existingSupplier
        
               for (const supplier of suppliers){
                if(supplier.Candidate_Payment_Out_Schema){
                  if(supplier.Candidate_Payment_Out_Schema.supplierName.toLowerCase()===supplierName.toLowerCase()){
                    existingSupplier = supplier;
                    break
                  }
                }
               }
                
                if (!existingSupplier) {
                    res.status(404).json({
                        message: `${supplierName} not found`
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
                    })
                }

                // Use the correct variable name, e.g., existingSupplier instead of existingPayment
                const newPayment = {
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
                }
                updatedPayments.push(newPayment);


                await existingSupplier.updateOne({
                    $inc: {
                        "Candidate_Payment_Out_Schema.total_Payment_Out": payment_Out,
                        "Candidate_Payment_Out_Schema.remaining_Balance": -payment_Out,
                        "Candidate_Payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,
                        "Candidate_Payment_Out_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,

                    },
                    $set: {
                        "Candidate_Payment_Out_Schema.open": open, // Set to true if you always want to open
                        "Candidate_Payment_Out_Schema.close": close, // Set to true if you always want to open
                        // Set to false if you always want to close
                    },
                    $push: {
                        "Candidate_Payment_Out_Schema.payment": newPayment
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

                if (payment_Via.toLowerCase() === "cash" || payment_Via==='cash') {
                    cashInHandUpdate.$inc.cash = -newPaymentOut;
                    cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
                }
                else{
                    cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
                    cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
                }
                await CashInHand.updateOne({}, cashInHandUpdate);

            }


            res.status(200).json({ message: `${multiplePayment.length} Payments Out added Successfully` });
        } catch (error) {
            console.error('Error updating values:', error);
            res.status(500).json({ message: 'Error updating values', error: error.message });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//deleting the Agent Candidate_Payment_Out_Schema
const deleteAzadCandPaymentOutSchema = async (req, res) => {
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

        const existingSupplier = await AzadCandidate.findOne({
            "Candidate_Payment_Out_Schema.supplierName": supplierName,
        });

        if (!existingSupplier) {
            res.status(404).json({ message: "Supplier not found" });
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


        cashInHandUpdate.$inc.total_Cash = existingSupplier.Candidate_Payment_Out_Schema.total_Payment_Out
        cashInHandUpdate.$inc.total_Cash = -existingSupplier.Candidate_Payment_Out_Schema.total_Cash_Out


        await CashInHand.updateOne({}, cashInHandUpdate);

        // Delete the payment_In_Schema
        existingSupplier.Candidate_Payment_Out_Schema = undefined;

        // Save the updated supplier without payment_In_Schema
        await existingSupplier.save();

        const updatedSupplier = await AzadCandidate.findById(existingSupplier._id);
        res.status(200).json({
            message: `${supplierName} deleted successfully`,
            data: updatedSupplier,
        });
    } catch (error) {
        console.error("Error deleting Candidate_Payment_Out_Schema:", error);
        res.status(500).json({
            message: "Error deleting Candidate_Payment_Out_Schema",
            error: error.message,
        });
    }
};

// Updating a single Agent Total Payment In Details
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
  
        const {name,pp_No,contact,company,country,entry_Mode,final_Status,trade,flight_Date} =
        req.body;
       
        let entryMode
  
        const azadCandidateIn=await AzadCandidate.findOne({
            "Candidate_Payment_Out_Schema.supplierName": name,
            "Candidate_Payment_Out_Schema.contact": contact,
            "Candidate_Payment_Out_Schema.pp_No": pp_No,
          })
          if(azadCandidateIn){
            
        if(final_Status.toLowerCase()==='offer letter' || final_Status.toLowerCase()==='offer_letter'){
            const newNotification=new Notifications({
              type:"Offer Letter",
              content:`${name}'s Final Status is updated to Offer Letter.`,
              date:new Date().toISOString().split("T")[0]
            })
            await newNotification.save()
          }
          if(final_Status.toLowerCase()==='e number' || final_Status.toLowerCase()==='e_number'){
            const newNotification=new Notifications({
              type:"E Number",
              content:`${name}'s Final Status is updated to E Number.`,
              date:new Date().toISOString().split("T")[0]
  
            })
            await newNotification.save()
          }
  
          if(final_Status.toLowerCase()==='qvc' || final_Status.toLowerCase()==='q_v_c'){
            const newNotification=new Notifications({
              type:"QVC",
              content:`${name}'s Final Status is updated to QVC.`,
              date:new Date().toISOString().split("T")[0]
  
            })
            await newNotification.save()
          }
          if(final_Status.toLowerCase()==='visa issued' || final_Status.toLowerCase()==='visa_issued' || final_Status.toLowerCase()==='vissa issued'  || final_Status.toLowerCase()==='vissa_issued'){
            const newNotification=new Notifications({
              type:"Visa Issued",
              content:`${name}'s Final Status is updated to Visa Issued.`,
              date:new Date().toISOString().split("T")[0]
  
            })
            await newNotification.save()
          }
          if(final_Status.toLowerCase()==='ptn' || final_Status.toLowerCase()==='p_t_n'){
            const newNotification=new Notifications({
              type:"PTN",
              content:`${name}'s Final Status is updated to PTN.`,
              date:new Date().toISOString().split("T")[0]
            })
            await newNotification.save()
          }
  
          if(final_Status.toLowerCase()==='ticket' || final_Status.toLowerCase()==='tiket'){
            const newNotification=new Notifications({
              type:"Ticket",
              content:`${name}'s Final Status is updated to Ticket.`,
              date:new Date().toISOString().split("T")[0]
            })
            await newNotification.save()
          }
          
            entryMode=azadCandidateIn.Candidate_Payment_In_Schema.entry_Mode
            azadCandidateIn.Candidate_Payment_Out_Schema.company=company
            azadCandidateIn.Candidate_Payment_Out_Schema.country=country
            azadCandidateIn.Candidate_Payment_Out_Schema.entry_Mode=entry_Mode
            azadCandidateIn.Candidate_Payment_Out_Schema.final_Status=final_Status
            azadCandidateIn.Candidate_Payment_Out_Schema.trade=trade
            azadCandidateIn.Candidate_Payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
            await azadCandidateIn.save()
          
          }
          
          const azadCandidateOut=await AzadCandidate.findOne({
            "Candidate_Payment_In_Schema.supplierName": name,
            "Candidate_Payment_In_Schema.entry_Mode": entryMode,
            "Candidate_Payment_In_Schema.pp_No": pp_No,
          })
          if(azadCandidateOut){
            azadCandidateOut.Candidate_Payment_In_Schema.company=company
            azadCandidateOut.Candidate_Payment_In_Schema.country=country
            azadCandidateOut.Candidate_Payment_In_Schema.entry_Mode=entry_Mode
            azadCandidateOut.Candidate_Payment_In_Schema.final_Status=final_Status
            azadCandidateOut.Candidate_Payment_In_Schema.trade=trade
            azadCandidateOut.Candidate_Payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
            await azadCandidateOut.save()
          
          }
  
       
         // Updating in Agents both Schema
         const agents=await Agents.find({})
  
        for(const agent of agents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons)
  {
    const personIn= agent.payment_In_Schema.persons.find(person=> person.name ===name.toString() && person.pp_No===pp_No.toString() && person.entry_Mode===entryMode.toString())
         if(personIn){
          personIn.company=company
          personIn.country=country
          personIn.entry_Mode=entry_Mode
          personIn.final_Status=final_Status
          personIn.trade=trade
          personIn.flight_Date=flight_Date?flight_Date:'Not Fly'
          await agent.save()
         }
  }
  
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
          
          if(ticketSupplier.Supplier_Payment_In_Schema && ticketSupplier.Supplier_Payment_In_Schema.persons){
            const SupPersonIn= ticketSupplier.Supplier_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
  
          if(ticketSupplier.Supplier_Payment_Out_Schema && ticketSupplier.Supplier_Payment_Out_Schema.persons){
            const SupPersonOut= ticketSupplier.Supplier_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
        
   
         
  
    
  
          if(ticketSupplier.Agent_Payment_In_Schema && ticketSupplier.Agent_Payment_In_Schema.persons){
            const AgentPersonIn= ticketSupplier.Agent_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonIn){
              AgentPersonIn.company=company
              AgentPersonIn.country=country
              AgentPersonIn.entry_Mode=entry_Mode
              AgentPersonIn.final_Status=final_Status
              AgentPersonIn.trade=trade
              AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
             await ticketSupplier.save()
  
            }
          }
         
          if(ticketSupplier.Agent_Payment_Out_Schema && ticketSupplier.Agent_Payment_Out_Schema.persons){
            const AgentPersonOut= ticketSupplier.Agent_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonOut){
              AgentPersonOut.company=company
              AgentPersonOut.country=country
              AgentPersonOut.entry_Mode=entry_Mode
              AgentPersonOut.final_Status=final_Status
              AgentPersonOut.trade=trade
              AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
             await ticketSupplier.save()
  
            }
          }
   
       
         }
         
  
  
  
  
         const visitSuppliers=await VisitSuppliers.find({})
         for(const visitSupplier of visitSuppliers){
   
          if(visitSupplier.Supplier_Payment_In_Schema && visitSupplier.Supplier_Payment_In_Schema.persons){
            const SupPersonIn= visitSupplier.Supplier_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
  
          if(visitSupplier.Supplier_Payment_Out_Schema && visitSupplier.Supplier_Payment_Out_Schema.persons){
            const SupPersonOut= visitSupplier.Supplier_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
        
     
          if(visitSupplier.Agent_Payment_In_Schema && visitSupplier.Agent_Payment_In_Schema.persons){
            const AgentPersonIn= visitSupplier.Agent_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonIn){
              AgentPersonIn.company=company
              AgentPersonIn.country=country
              AgentPersonIn.entry_Mode=entry_Mode
              AgentPersonIn.final_Status=final_Status
              AgentPersonIn.trade=trade
              AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
             await visitSupplier.save()
  
            }
          }
         
          if(visitSupplier.Agent_Payment_Out_Schema && visitSupplier.Agent_Payment_Out_Schema.persons){
            const AgentPersonOut= visitSupplier.Agent_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonOut){
              AgentPersonOut.company=company
              AgentPersonOut.country=country
              AgentPersonOut.entry_Mode=entry_Mode
              AgentPersonOut.final_Status=final_Status
              AgentPersonOut.trade=trade
              AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
             await visitSupplier.save()
  
            }
          }
         }
  
  
         const azadSuppliers=await AzadSupplier.find({})
         for(const azadSupplier of azadSuppliers){
          if(azadSupplier.Supplier_Payment_In_Schema && azadSupplier.Supplier_Payment_In_Schema.persons){
            const SupPersonIn= azadSupplier.Supplier_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
        
   
          if(azadSupplier.Supplier_Payment_Out_Schema && azadSupplier.Supplier_Payment_Out_Schema.persons){
            const SupPersonOut= azadSupplier.Supplier_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
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
        
  
  
          if(azadSupplier.Agent_Payment_In_Schema && azadSupplier.Agent_Payment_In_Schema.persons){
            const AgentPersonIn= azadSupplier.Agent_Payment_In_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonIn){
              AgentPersonIn.company=company
              AgentPersonIn.country=country
              AgentPersonIn.entry_Mode=entry_Mode
              AgentPersonIn.final_Status=final_Status
              AgentPersonIn.trade=trade
              AgentPersonIn.flight_Date=flight_Date?flight_Date:'Not Fly'
             await azadSupplier.save()
  
            }
          }
         
          if(azadSupplier.Agent_Payment_Out_Schema && azadSupplier.Agent_Payment_Out_Schema.persons){
            const AgentPersonOut= azadSupplier.Agent_Payment_Out_Schema.persons.find(person=> person.name.toString ===name.toString() && person.pp_No.toString()===pp_No.toString() && person.entry_Mode.toString()===entryMode.toString())
            if(AgentPersonOut){
              AgentPersonOut.company=company
              AgentPersonOut.country=country
              AgentPersonOut.entry_Mode=entry_Mode
              AgentPersonOut.final_Status=final_Status
              AgentPersonOut.trade=trade
              AgentPersonOut.flight_Date=flight_Date?flight_Date:'Not Fly'
             await azadSupplier.save()
              
            }
          }
        
         }
       
  
  
  
     const ticketCandidateIn=await TicketCandidate.findOne({
      "Candidate_Payment_In_Schema.supplierName": name,
      "Candidate_Payment_In_Schema.entry_Mode": entryMode,
      "Candidate_Payment_In_Schema.pp_No": pp_No,
    })
    if(ticketCandidateIn){
      ticketCandidateIn.Candidate_Payment_In_Schema.company=company
      ticketCandidateIn.Candidate_Payment_In_Schema.country=country
      ticketCandidateIn.Candidate_Payment_In_Schema.entry_Mode=entry_Mode
      ticketCandidateIn.Candidate_Payment_In_Schema.final_Status=final_Status
      ticketCandidateIn.Candidate_Payment_In_Schema.trade=trade
      ticketCandidateIn.Candidate_Payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
      await ticketCandidateIn.save()
  
    }
    
    const ticketCandidateOut=await TicketCandidate.findOne({
      "Candidate_Payment_Out_Schema.supplierName": name,
      "Candidate_Payment_Out_Schema.entry_Mode": entryMode,
      "Candidate_Payment_Out_Schema.pp_No": pp_No,
    })
    if(ticketCandidateOut){
      ticketCandidateOut.Candidate_Payment_Out_Schema.company=company
      ticketCandidateOut.Candidate_Payment_Out_Schema.country=country
      ticketCandidateOut.Candidate_Payment_Out_Schema.entry_Mode=entry_Mode
      ticketCandidateOut.Candidate_Payment_Out_Schema.final_Status=final_Status
      ticketCandidateOut.Candidate_Payment_Out_Schema.trade=trade
      ticketCandidateOut.Candidate_Payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
      await ticketCandidateOut.save()
  
    }
    
  
     const visitCandidateIn=await VisitCandidate.findOne({
      "Candidate_Payment_In_Schema.supplierName": name,
      "Candidate_Payment_In_Schema.entry_Mode": entryMode,
      "Candidate_Payment_In_Schema.pp_No": pp_No,
    })
    if(visitCandidateIn){
      visitCandidateIn.Candidate_Payment_In_Schema.company=company
      visitCandidateIn.Candidate_Payment_In_Schema.country=country
      visitCandidateIn.Candidate_Payment_In_Schema.entry_Mode=entry_Mode
      visitCandidateIn.Candidate_Payment_In_Schema.final_Status=final_Status
      visitCandidateIn.Candidate_Payment_In_Schema.trade=trade
      visitCandidateIn.Candidate_Payment_In_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
      await visitCandidateIn.save()
  
    }
    
    const visitCandidateOut=await VisitCandidate.findOne({
      "Candidate_Payment_Out_Schema.supplierName": name,
      "Candidate_Payment_Out_Schema.entry_Mode": entryMode,
      "Candidate_Payment_Out_Schema.pp_No": pp_No,
    })
    if(visitCandidateOut){
      visitCandidateOut.Candidate_Payment_Out_Schema.company=company
      visitCandidateOut.Candidate_Payment_Out_Schema.country=country
      visitCandidateOut.Candidate_Payment_Out_Schema.entry_Mode=entry_Mode
      visitCandidateOut.Candidate_Payment_Out_Schema.final_Status=final_Status
      visitCandidateOut.Candidate_Payment_Out_Schema.trade=trade
      visitCandidateOut.Candidate_Payment_Out_Schema.flight_Date=flight_Date?flight_Date:'Not Fly'
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
    entry.flight_Date=flight_Date?flight_Date:'Not Fly'
    await entry.save()
  
  }
  
  
      res.status(200).json({message:`${name} updated successfully!`})
     
    
      } catch (error) {
        
      res.status(500).json({ message: error });
        
      }
      
  
    }
  
  
  }
  
  
  

// Getting All Supplier Payments Out
const getAzadCandAllPaymentsOut = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.role === "Admin") {
            const supplierPayments = await AzadAzadCandidate.find({}).sort({ createdAt: -1 });
            const formattedDetails = supplierPayments
                .filter(candidate => candidate.Candidate_Payment_Out_Schema)
                .map(candidate => {
                    const paymentOutSchema = candidate.Candidate_Payment_Out_Schema
                    return {
                        supplier_Id: paymentOutSchema.supplier_Id,
                        supplierName: paymentOutSchema.supplierName,
                        pp_No: paymentOutSchema.pp_No,
                        entry_Mode: paymentOutSchema.entry_Mode,
                        company: paymentOutSchema.company,
                        final_Status: paymentOutSchema.final_Status,
                        flight_Date: paymentOutSchema.flight_Date,
                        total_Visa_Price_Out_PKR: paymentOutSchema.total_Visa_Price_Out_PKR,
                        total_Visa_Price_Out_Curr: paymentOutSchema.total_Visa_Price_Out_Curr,
                        total_Payment_Out: paymentOutSchema.total_Payment_Out,
                        remaining_Balance: paymentOutSchema.remaining_Balance,
                        curr_Country: paymentOutSchema.curr_Country,
                        payment: paymentOutSchema.payment || [],
                        open: paymentOutSchema.open || false,
                        close: paymentOutSchema.close || false,
                        createdAt: moment(paymentOutSchema.createdAt).format('YYYY-MM-DD'),
                        updatedAt: moment(paymentOutSchema.updatedAt).format('YYYY-MM-DD'),
                    }
                })


            res.status(200).json({ data: formattedDetails });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { addAzadCandPaymentIn, addAzadCandMultiplePaymentsIn, addAzadCandPaymentInReturn, deleteSingleAzadCandPaymentIn, updateSingleAzadCandPaymentIn,deleteAzadCandPaymentInSchema,updateAgentTotalPaymentIn, getAzadCandAllPaymentsIn, addAzadCandPaymentOut, addAzadCandPaymentOutReturn, deleteAzadCandSinglePaymentOut, updateAzadCandSinglePaymentOut, addAzadCandMultiplePaymentsOut,deleteAzadCandPaymentOutSchema,updateAgentTotalPaymentOut, getAzadCandAllPaymentsOut }
