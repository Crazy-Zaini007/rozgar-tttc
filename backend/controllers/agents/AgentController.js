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

const InvoiceNumber = require("../../database/invoiceNumber/InvoiceNumberSchema");
const CashInHand = require("../../database/cashInHand/CashInHandSchema");
const mongoose = require("mongoose");
const moment = require("moment");
// Addding a New Payment In
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
      open,
      close,
      date,
      cand_Name,
    } = req.body;

    const newPaymentIn = parseInt(payment_In, 10);
    const newCurrAmount = parseInt(curr_Amount, 10);

    const existingSupplier = await Agents.findOne({
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
          $set: {
            "payment_In_Schema.open": open,
            "payment_In_Schema.close": close,
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

        await existingSupplier.save();
        const updatedSupplier = await Agents.findById(existingSupplier._id);
        res.status(200).json({
          message: `Payment In: ${payment_In} added Successfully to ${updatedSupplier.payment_In_Schema.supplierName}'s Record`,
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
          $set: {
            "payment_In_Schema.open": open,
            "payment_In_Schema.close": close,
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

        if (payment_Via.toLowerCase() === "cash") {
          cashInHandUpdate.$inc.cash = newPaymentIn;
          cashInHandUpdate.$inc.total_Cash = newPaymentIn;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
          cashInHandUpdate.$inc.total_Cash = newPaymentIn;
        }
        await CashInHand.updateOne({}, cashInHandUpdate);

        await existingSupplier.save();

        const updatedSupplier = await Agents.findById(existingSupplier._id);
        res.status(200).json({
          message: `Payment In: ${payment_In} added Successfully to ${updatedSupplier.payment_In_Schema.supplierName}'s Record`,
        })
      }

    } catch (error) {
      console.error("Error updating values:", error);
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
          cand_Name,
          open,
          close
        } = payment;

        const newPaymentIn = parseInt(payment_In, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);
       
        const agents=await Agents.find({})
        let existingSupplier

       for (const agent of agents){
        if(agent.payment_In_Schema){
          if(agent.payment_In_Schema.supplierName.toLowerCase()===supplierName.toLowerCase()){
            existingSupplier = agent;
            break
          }
        }
       }

        if (!existingSupplier) {
          res.status(404).json({
            message: `${supplierName} not found`,
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
          payment_In_Curr: curr_Country ? curr_Country : '',
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date,
          invoice: nextInvoiceNumber,
          cand_Name,
        };

        updatedPayments.push(newPayment);

        try {
          if (cand_Name) {
            const existPerson = existingSupplier.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
            if (existPerson) {
              existPerson.remaining_Price += -payment_In,
             existPerson.total_In += payment_In,
                existPerson.remaining_Curr += newCurrAmount ? newCurrAmount : 0


            }


            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Payment_In": payment_In,
                "payment_In_Schema.remaining_Balance": -payment_In,
                "payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,
                "payment_In_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
              },
              $set: {
                "payment_In_Schema.open": open,
                "payment_In_Schema.close": close
              },
              $push: {
                "payment_In_Schema.payment": newPayment,
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
              cashInHandUpdate.$inc.cash = newPaymentIn;
              cashInHandUpdate.$inc.total_Cash = newPaymentIn;
            }
            else{
              cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
              cashInHandUpdate.$inc.total_Cash = newPaymentIn;
            }

            await CashInHand.updateOne({}, cashInHandUpdate);

            await existingSupplier.save();
           
          }

          else {

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Payment_In": payment_In,
                "payment_In_Schema.remaining_Balance": -payment_In,
                "payment_In_Schema.total_Payment_In_Curr": newCurrAmount ? newCurrAmount : 0,
                "payment_In_Schema.remaining_Curr": newCurrAmount ? -newCurrAmount : 0,
              },
              $set: {
                "payment_In_Schema.open": open,
                "payment_In_Schema.close": close
              },
              $push: {
                "payment_In_Schema.payment": newPayment,
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
              cashInHandUpdate.$inc.cash = newPaymentIn;
              cashInHandUpdate.$inc.total_Cash = newPaymentIn;
            }
            else{
              cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
              cashInHandUpdate.$inc.total_Cash = newPaymentIn;
            }

            await CashInHand.updateOne({}, cashInHandUpdate);
            
            await existingSupplier.save();

          }

        }
        catch (error) {
          console.error("Error updating values:", error);
          res
            .status(500)
            .json({ message: "Error updating values", error: error.message });
        }

      }

      res.status(200).json({
        message: `${multiplePayment.length} Payments In added Successfully`,
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
          open,
          close,
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
          return res.status(400).json({ message: "Cash Out is required" });
        }

        if (!date) {
          return res.status(400).json({ message: "Date is required" });
        }

        const newCashOut = parseInt(cash_Out, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);

        const existingSupplier = await Agents.findOne({
          "payment_In_Schema.supplierName": supplierName,
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
          date,
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
              $set: {
                "payment_In_Schema.open": open,
                "payment_In_Schema.close": close, // Make sure close is defined
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
            await existingSupplier.save();

            const updatedSupplier = await Agents.findById(existingSupplier._id);

            res.status(200).json({
              data: updatedSupplier,
              message: `Cash Out: ${cash_Out} added Successfully to ${updatedSupplier.payment_In_Schema.supplierName}'s Record`,
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
              $set: {
                "payment_In_Schema.open": open,
                "payment_In_Schema.close": close, // Make sure close is defined
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
            await existingSupplier.save();

            const updatedSupplier = await Agents.findById(existingSupplier._id);
            await existingSupplier.save()

            res.status(200).json({
              data: updatedSupplier,
              message: `Cash Out: ${cash_Out} added Successfully to ${updatedSupplier.payment_In_Schema.supplierName}'s Record`,
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
      cand_Name
    } = req.body;

    const existingSupplier = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Supplier not Found",
      });
    }
    const newPaymentIn = payment_In - cash_Out;

    try {
      if (cand_Name) {
        // If cand_Name is provided, find the corresponding person in the persons array and update it
        const existPerson = existingSupplier.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
        if (existPerson) {
          existPerson.remaining_Price += payment_In,
            existPerson.remaining_Curr += curr_Amount ? curr_Amount : 0
            existPerson.total_In += -payment_In,
            existPerson.cash_Out += cash_Out ? -cash_Out : 0


        }
        // Add this line for logging

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
        const updatedSupplier = await Agents.findById(existingSupplier._id);
        res.status(200).json({
          message: `Payment In with ID ${paymentId} deleted successfully from ${supplierName}`,
        });

      }

      else {
        // Add this line for logging
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
        const updatedSupplier = await Agents.findById(existingSupplier._id);
        res.status(200).json({
          message: `Payment In with ID ${paymentId} deleted successfully from ${supplierName}`,
        });
      }


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
        cand_Name,
      } = req.body;

      const newPaymentIn = parseInt(payment_In, 10);
      const newCashOut = parseInt(cash_Out, 10);
      const newCurrAmount = parseInt(curr_Amount, 10);

      const existingSupplier = await Agents.findOne({
        "payment_In_Schema.supplierName": supplierName,
      });
      if (!existingSupplier) {
        res.status(404).json({ message: "Supplier not found" });
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
      if (cand_Name) {
        // If cand_Name is provided, find the corresponding person in the persons array and update it
        const existPerson = existingSupplier.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
        if (existPerson) {
          existPerson.remaining_Price += -updatedPaymentIn,
          existPerson.total_In += -updatedPaymentIn,
            existPerson.remaining_Curr += updateCurr_Amount ? -updateCurr_Amount : 0
            existPerson.cash_Out += updatedCashout ? -updatedCashout : 0

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
        paymentToUpdate.cand_Name = cand_Name;
  
        // Save the updated supplier
  
        await existingSupplier.save();
  
        const updatedSupplier = await Agents.findById(existingSupplier._id);
        res.status(200).json({
          message: "Payment In details updated successfully",
          data: updatedSupplier,
        });
      }
      else{
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
        paymentToUpdate.cand_Name = cand_Name;
  
        // Save the updated supplier
  
        await existingSupplier.save();
  
        const updatedSupplier = await Agents.findById(existingSupplier._id);
       
        res.status(200).json({
          message: "Payment In details updated successfully",
          data: updatedSupplier,
        });
      }
      
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
        res.status(404).json({ message: "Supplier not found" });
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

      const updatedSupplier = await Agents.findById(existingSupplier._id);
      console.log(updatedSupplier);
      res.status(200).json({
        message: "Payment In details updated successfully",
        data: updatedSupplier,
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


    cashInHandUpdate.$inc.total_Cash = -existingSupplier.payment_In_Schema.total_Payment_In
    cashInHandUpdate.$inc.total_Cash =  existingSupplier.payment_In_Schema.total_Cash_Out

    await CashInHand.updateOne({}, cashInHandUpdate);

    // Delete the payment_In_Schema
    existingSupplier.payment_In_Schema = undefined;

    // Save the updated supplier without payment_In_Schema
    await existingSupplier.save();

    const updatedSupplier = await Agents.findById(existingSupplier._id);
    res.status(200).json({
      message: `${supplierName} deleted successfully`,
      data: updatedSupplier,
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
    const { personId, supplierName, visa_Price_In_PKR, visa_Price_In_Curr } =
      req.body;

    const existingSupplier = await Agents.findOne({
      "payment_In_Schema.supplierName": supplierName,
    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Supplier not Found",
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

      const updatedSupplier = await Agents.findById(existingSupplier._id)
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

      const {supplierName,personId,name,pp_No,contact,company,country,entry_Mode,final_Status,trade,flight_Date} =
      req.body;
     
      let entryMode
     
      const existingSupplier = await Agents.findOne({
        "payment_In_Schema.supplierName": supplierName,
      });
    
      if(existingSupplier){
        const personIn = existingSupplier.payment_In_Schema.persons.find(person => person._id.toString() === personId.toString());
        if (personIn) {
          entryMode=personIn.entry_Mode
            personIn.company = company;
            personIn.country = country;
            personIn.entry_Mode = entry_Mode;
            personIn.final_Status = final_Status;
            personIn.trade = trade;
            personIn.flight_Date = flight_Date?flight_Date:'Not Fly';
            await existingSupplier.save()
        } else {
         
            res.status(404).json({message:`person with ID: ${personId} not found`})
            return;
        }
      }

     
       // Updating in Agents both Schema
       const agents=await Agents.find({})

      for(const agent of agents){

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
     
const azadCandidateIn=await AzadCandidate.findOne({
  "Candidate_Payment_In_Schema.supplierName": name,
  "Candidate_Payment_In_Schema.entry_Mode": entryMode,
  "Candidate_Payment_In_Schema.pp_No": pp_No,
})
if(azadCandidateIn){
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
console.log('entry Found')
  entry.company=company
  entry.country=country
  entry.entry_Mode=entry_Mode
  entry.final_Status=final_Status
  entry.trade=trade
  entry.flight_Date=flight_Date?flight_Date:'Not Fly'
  await entry.save()

}


    res.status(200).json({message:`${name} updated successfully!`})
console.log('updated successfully!')
   
  
    } catch (error) {
      console.error('Error:', error);
    res.status(500).json({ message: error });
      
    }
    

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
            open: paymentInSchema.open || false,
            close: paymentInSchema.close || false,
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
          open,
          close,
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

        if (!payment_Out) {
          return res.status(400).json({ message: "Payment Out is required" });
        }

        if (!date) {
          return res.status(400).json({ message: "Date is required" });
        }

        const newPaymentOut = parseInt(payment_Out, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);
        // Fetch the current invoice number and increment it by 1 atomically

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
              $set: {
                "payment_Out_Schema.open": open,
                "payment_Out_Schema.close": close
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
            const updatedSupplier = await Agents.findById(existingSupplier._id);

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
              $set: {
                "payment_Out_Schema.open": open,
                "payment_Out_Schema.close": close
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
            const updatedSupplier = await Agents.findById(existingSupplier._id);

            res.status(200).json({
              data: updatedSupplier,
              message: `Payment Out: ${payment_Out} added Successfully to ${updatedSupplier.payment_Out_Schema.supplierName}'s Record`,
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
          cand_Name,
          open,
          close
        } = payment;

        if (!supplierName) {
          res.status(400).json({ message: "Supplier Name is required" });
          return;
        }

        const newPaymentOut = parseInt(payment_Out, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);
       
        const agents=await Agents.find({})
        let existingSupplier

       for (const agent of agents){
        if(agent.payment_Out_Schema){
          if(agent.payment_Out_Schema.supplierName.toLowerCase()===supplierName.toLowerCase()){
            existingSupplier = agent;
            break
          }
        }
       }

        if (!existingSupplier) {
          res.status(404).json({
            message: `${supplierName} not found`,
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
        };

        updatedPayments.push(newPayment);

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
              $set: {
                "payment_Out_Schema.open": open,
                "payment_Out_Schema.close": close
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

            await existingSupplier.save();
            const updatedSupplier = await Agents.findById(existingSupplier._id);
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
              $set: {
                "payment_Out_Schema.open": open,
                "payment_Out_Schema.close": close
              },
              $push: {
                "payment_Out_Schema.payment": newPayment,
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
              cashInHandUpdate.$inc.cash = -newPaymentOut;
              cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
            }
            else{
              cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
              cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
            }

            await CashInHand.updateOne({}, cashInHandUpdate);

            await existingSupplier.save();
            const updatedSupplier = await Agents.findById(existingSupplier._id);


          }

        }
        catch (error) {
          console.error("Error updating values:", error);
          res
            .status(500)
            .json({ message: "Error updating values", error: error.message });
        }
      }
      res.status(200).json({
        message: `${multiplePayment.length} Payments Out added Successfully`,
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
          open,
          close,
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
          return res.status(400).json({ message: "Cash Out is required" });
        }

        if (!date) {
          return res.status(400).json({ message: "Date is required" });
        }

        const newCashOut = parseInt(cash_Out, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);
        // Fetch the current invoice number and increment it by 1 atomically

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
          date,
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
            $set: {
              "payment_Out_Schema.open": open,
              "payment_Out_Schema.close": close,
              // Make sure close is defined
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
          await existingSupplier.save();

          const updatedSupplier = await Agents.findById(existingSupplier._id);

          res.status(200).json({
            data: updatedSupplier,
            message: `Cash Out: ${cash_Out} added Successfully to ${updatedSupplier.payment_Out_Schema.supplierName}'s Record`,
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
            $set: {
              "payment_Out_Schema.open": open,
              "payment_Out_Schema.close": close,
              // Make sure close is defined
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

          const updatedSupplier = await Agents.findById(existingSupplier._id);
          await existingSupplier.save();

          res.status(200).json({
            data: updatedSupplier,
            message: `Cash Out: ${cash_Out} added Successfully to ${updatedSupplier.payment_Out_Schema.supplierName}'s Record`,
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
      cand_Name
    } = req.body;


    const existingSupplier = await Agents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Supplier not Found",
      });
    }

    const newPaymentOut = payment_Out - cash_Out;

    try {
      if (cand_Name) {
        // If cand_Name is provided, find the corresponding person in the persons array and update it
        const existPerson = existingSupplier.payment_Out_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
        if (existPerson) {
          existPerson.remaining_Price += payment_Out,
          existPerson.total_In += -payment_Out,
          existPerson.remaining_Curr += curr_Amount ? curr_Amount : 0
          existPerson.cash_Out += cash_Out ? -cash_Out : 0


        }
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

      const updatedSupplier = await Agents.findById(existingSupplier._id);
      res.status(200).json({
        message: `Payment Out deleted sucessfully from ${supplierName}`,
      });
    }
    else{
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

      if(payment_Via.toLowerCase() === "cash"){
        cashInHandUpdate.$inc.cash = newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = newPaymentOut;

      }
    else{
        cashInHandUpdate.$inc.bank_Cash = newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = newPaymentOut;

      } 

      await CashInHand.updateOne({}, cashInHandUpdate);
      await existingSupplier.save()

      const updatedSupplier = await Agents.findById(existingSupplier._id);
      res.status(200).json({
        message: `Payment Out deleted sucessfully from ${supplierName}`,
      });
    }
      
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
      cand_Name,
    } = req.body;
    const newPaymentOut = parseInt(payment_Out, 10);
    const newCashOut = parseInt(cash_Out, 10);
    const newCurrAmount = parseInt(curr_Amount, 10);

    try {
      const existingSupplier = await Agents.findOne({
        "payment_Out_Schema.supplierName": supplierName,
      });

      if (!existingSupplier) {
        res.status(404).json({ message: "Supplier not found" });
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
      if (cand_Name) {
        // If cand_Name is provided, find the corresponding person in the persons array and update it
        const existPerson = existingSupplier.payment_Out_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
        if (existPerson) {
          existPerson.remaining_Price += -updatedPaymentOut,
           existPerson.total_In += updatedPaymentOut,
            existPerson.remaining_Curr += updateCurr_Amount ? -updateCurr_Amount : 0
            existPerson.cash_Out += updatedCashout ? -updatedCashout : 0

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
      paymentToUpdate.cand_Name = cand_Name;
      // Save the updated supplier
      await existingSupplier.save();

      const updatedSupplier = await Agents.findById(existingSupplier._id);
      await existingSupplier.save();

      res.status(200).json({
        message: "Payment Out details updated successfully",
        data: updatedSupplier,
      });

      }
      else{
        
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
      paymentToUpdate.cand_Name = cand_Name;
      // Save the updated supplier
      await existingSupplier.save();

      const updatedSupplier = await Agents.findById(existingSupplier._id);
      await existingSupplier.save();

      res.status(200).json({
        message: "Payment Out details updated successfully",
        data: updatedSupplier,
      });
      }

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
    const { personId, supplierName, visa_Price_Out_PKR, visa_Price_Out_Curr } =
      req.body;
    // console.log(personId, supplierName, visa_Price_Out_PKR);
    const newVisa_Price_Out_PKR = parseInt(visa_Price_Out_PKR, 10);
    const newVisa_Price_Out_Curr = parseInt(visa_Price_Out_Curr, 10);
    const existingSupplier = await Agents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Supplier not Found",
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

      const updatedSupplier = await Agents.findById(existingSupplier._id);
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
        res.status(404).json({ message: "Supplier not found" });
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

      const updatedSupplier = await Agents.findById(existingSupplier._id);
      console.log(updatedSupplier);
      res.status(200).json({
        message: "Payment In details updated successfully",
        data: updatedSupplier,
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


    cashInHandUpdate.$inc.total_Cash = existingSupplier.payment_Out_Schema.total_Payment_Out
    cashInHandUpdate.$inc.total_Cash = -existingSupplier.payment_Out_Schema.total_Cash_Out


    await CashInHand.updateOne({}, cashInHandUpdate);

    // Delete the payment_In_Schema
    existingSupplier.payment_Out_Schema = undefined;

    // Save the updated supplier without payment_In_Schema
    await existingSupplier.save();

    const updatedSupplier = await Agents.findById(existingSupplier._id);
    res.status(200).json({
      message: `${supplierName} deleted successfully`,
      data: updatedSupplier,
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

      const {supplierName,personId,name,pp_No,contact,company,country,entry_Mode,final_Status,trade,flight_Date} =
      req.body;
     
      let entryMode
     
      const existingSupplier = await Agents.findOne({
        "payment_Out_Schema.supplierName": supplierName,
      });
    
      if(existingSupplier){
        const personIn = existingSupplier.payment_Out_Schema.persons.find(person => person._id.toString() === personId.toString());
        if (personIn) {
          entryMode=personIn.entry_Mode
            personIn.company = company;
            personIn.country = country;
            personIn.entry_Mode = entry_Mode;
            personIn.final_Status = final_Status;
            personIn.trade = trade;
            personIn.flight_Date = flight_Date?flight_Date:'Not Fly';
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
     
const azadCandidateIn=await AzadCandidate.findOne({
  "Candidate_Payment_In_Schema.supplierName": name,
  "Candidate_Payment_In_Schema.entry_Mode": entryMode,
  "Candidate_Payment_In_Schema.pp_No": pp_No,
})
if(azadCandidateIn){
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
console.log('entry Found')
  entry.company=company
  entry.country=country
  entry.entry_Mode=entry_Mode
  entry.final_Status=final_Status
  entry.trade=trade
  entry.flight_Date=flight_Date?flight_Date:'Not Fly'
  await entry.save()

}


    res.status(200).json({message:`${name} updated successfully!`})
console.log('updated successfully!')
   
  
    } catch (error) {
      console.error('Error:', error);
    res.status(500).json({ message: error });
      
    }
    

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
            open: paymentOutSchema.open || false,
            close: paymentOutSchema.close || false,
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
  getAllPaymentsOut
};
