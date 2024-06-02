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
const Reminders = require("../../database/reminders/RemindersModel");
const Backup = require("../../database/backup/BackupModel.js");
const Notifications = require("../../database/notifications/NotifyModel.js");
const RecycleBin = require("../../database/recyclebin/RecycleBinModel.js");
const AzadAgents = require("../../database/azadAgent/AzadAgentSchema");
const TicketAgents = require("../../database/ticketAgent/TicketAgentSchema");
const VisitAgents = require("../../database/visitAgent/VisitAgentSchema");

const InvoiceNumber = require("../../database/invoiceNumber/InvoiceNumberSchema");
const CashInHand = require("../../database/cashInHand/CashInHandSchema");
const mongoose = require("mongoose");
const moment = require("moment");

// Azad Supplier Section
// Addding a New addAzadSupplier PaymentIn
const addAzadSupplierPaymentIn = async (req, res) => {
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

      date,
    } = req.body;
    const newPaymentIn = parseInt(payment_In, 10);
    const newCurrAmount = parseInt(curr_Amount, 10);

    const existingSupplier = await AzadSuppliers.findOne({
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
      slip_No: slip_No ? slip_No : "",
      payment_In: newPaymentIn,
      slip_Pic: uploadImage?.secure_url || "",
      details,
      payment_In_Curr: curr_Country ? curr_Country : "",
      curr_Rate: curr_Rate ? curr_Rate : 0,
      curr_Amount: newCurrAmount ? newCurrAmount : 0,
      date:date?date:new Date().toISOString().split("T")[0],
      invoice: nextInvoiceNumber,
    };

    try {
      await existingSupplier.updateOne({
        $inc: {
          "payment_In_Schema.total_Payment_In": payment_In,
          "payment_In_Schema.remaining_Balance": -payment_In,
          "payment_In_Schema.total_Payment_In_Curr": newCurrAmount
            ? newCurrAmount
            : 0,
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
      if (payment_Via.toLowerCase() === "cash") {
        cashInHandUpdate.$inc.cash = newPaymentIn;
        cashInHandUpdate.$inc.total_Cash = newPaymentIn;
      } else {
        cashInHandUpdate.$inc.bank_Cash = newPaymentIn;
        cashInHandUpdate.$inc.total_Cash = newPaymentIn;
      }
      await CashInHand.updateOne({}, cashInHandUpdate);

      const newBackup = new Backup({
        name: supplierName,
        category: category,
        payment_Via: payment_Via,
        payment_Type: payment_Type,
        slip_No: slip_No ? slip_No : "",
        payment_In: newPaymentIn,
        slip_Pic: uploadImage?.secure_url || "",
        details: details,
        payment_In_Curr: curr_Country ? curr_Country : "",
        curr_Rate: curr_Rate ? curr_Rate : 0,
        curr_Amount: newCurrAmount ? newCurrAmount : 0,
        date: new Date().toISOString().split("T")[0],
        invoice: nextInvoiceNumber,
      });
      await newBackup.save();

      await existingSupplier.save();

      const newNotification = new Notifications({
        type: "Azad Supplier Payment In",
        content: `${user.userName} added Payment_In: ${payment_In} of Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();

      const updatedSupplier = await AzadSuppliers.findById(
        existingSupplier._id
      );

      res.status(200).json({
        message: `Payment In: ${payment_In} added Successfully to ${supplierName}'s Record`,
      });
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

//Adding AzadSupplier Multiple PaymentsIn
const addAzadSupplierMultiplePaymentsIn = async (req, res) => {
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
        } = payment;
        if(!payment_Via){
          res.status(400).json({message:"Payment Via is required"})
          break;
        }
        const newPaymentIn = parseInt(payment_In, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);

        const suppliers = await AzadSuppliers.find({});
        let existingSupplier;

        for (const supplier of suppliers) {
          if (supplier.payment_In_Schema) {
            if (
              supplier.payment_In_Schema.supplierName.toLowerCase() ===
              supplierName.toLowerCase()
            ) {
              existingSupplier = supplier;
              break;
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
          slip_No: slip_No ? slip_No : "",
          payment_In: newPaymentIn,
          slip_Pic: uploadImage?.secure_url || "",
          details,
          payment_In_Curr: curr_Country ? curr_Country : "",
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date:date?date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
        };

        updatedPayments.push(newPayment);

        await existingSupplier.updateOne({
          $inc: {
            "payment_In_Schema.total_Payment_In": payment_In,
            "payment_In_Schema.remaining_Balance": -payment_In,
            "payment_In_Schema.total_Payment_In_Curr": newCurrAmount
              ? newCurrAmount
              : 0,
          },
          $push: {
            "payment_In_Schema.payment": newPayment,
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
        const newBackup = new Backup({
          name: supplierName,
          category: category,
          payment_Via: payment_Via,
          payment_Type: payment_Type,
          slip_No: slip_No ? slip_No : "",
          payment_In: newPaymentIn,
          slip_Pic: uploadImage?.secure_url || "",
          details: details,
          payment_In_Curr: curr_Country ? curr_Country : "",
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date: new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
        });
        await newBackup.save();

        await existingSupplier.save();

        const newNotification = new Notifications({
          type: "Azad Supplier Payment In",
          content: `${user.userName} added Payment_In: ${payment_In} of Azad Supplier: ${supplierName}`,
          date: new Date().toISOString().split("T")[0],
        });
        await newNotification.save();
      }

      res.status(200).json({
        message: `${multiplePayment.length} Payments Out added Successfully `,
      });
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

// Addding a New AzadSupplier Payment In Cash Out
const addAzadSupplierPaymentInReturn = async (req, res) => {
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

        const existingSupplier = await AzadSuppliers.findOne({
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
        // Use the correct variable name, e.g., existingSupplier instead of existingPayment
        const payment = {
          name: supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No: slip_No ? slip_No : "",
          cash_Out: newCashOut,
          slip_Pic: uploadImage?.secure_url || "",
          details,
          payment_Out_Curr: curr_Country ? curr_Country : 0,
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date:date?date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
        };

        try {
          // Update total_Azad_Visa_Price_In_PKR and other fields using $inc
          await existingSupplier.updateOne({
            $inc: {
              "payment_In_Schema.total_Cash_Out": newCashOut,
              "payment_In_Schema.remaining_Balance": newCashOut,
              "payment_In_Schema.total_Payment_In_Curr": newCurrAmount
                ? -newCurrAmount
                : 0,
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

          if (payment_Via.toLowerCase() === "cash") {
            cashInHandUpdate.$inc.cash = -newCashOut;
            cashInHandUpdate.$inc.total_Cash = -newCashOut;
          } else {
            cashInHandUpdate.$inc.bank_Cash = -newCashOut;
            cashInHandUpdate.$inc.total_Cash = -newCashOut;
          }

          await CashInHand.updateOne({}, cashInHandUpdate);
          const newBackup = new Backup({
            name: supplierName,
            category: category,
            payment_Via: payment_Via,
            payment_Type: payment_Type,
            slip_No: slip_No ? slip_No : "",
            cash_Out: newCashOut,
            slip_Pic: uploadImage?.secure_url || "",
            details: details,
            payment_In_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date: new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
          });
          await newBackup.save();
          const newNotification = new Notifications({
            type: "Azad Supplier Payment In Return",
            content: `${user.userName} added Payment_Return: ${cash_Out} of Azad Supplier: ${supplierName}`,
            date: new Date().toISOString().split("T")[0],
          });
          await newNotification.save();
          const updatedSupplier = await AzadSuppliers.findById(
            existingSupplier._id
          );

          res
            .status(200)
            .json({
              message: `Cash Out: ${cash_Out} added Successfully to ${supplierName}'s Record`,
            });
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

// Deleting a single AzadSupplier Payment In

const deleteSingleAzadSupplierPaymentIn = async (req, res) => {
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
    } = req.body;

    const existingSupplier = await AzadSuppliers.findOne({
      "payment_In_Schema.supplierName": supplierName,
    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Supplier not Found",
      });
    }
    const newPaymentIn = payment_In - cash_Out;

    try {
      let paymentToDelete = existingSupplier.payment_In_Schema.payment.find(
        (p) => p._id.toString() === paymentId.toString()
      );
      const newRecycle = new RecycleBin({
        name: supplierName,
        type: "Azad Supplier Payment In",
        category: paymentToDelete.category,
        payment_Via: paymentToDelete.payment_Via,
        payment_Type: paymentToDelete.payment_Type,
        slip_No: paymentToDelete.slip_No,
        payment_In: paymentToDelete.payment_In,
        cash_Out: paymentToDelete.cash_Out,
        payment_In_Curr: paymentToDelete.payment_In_Curr,
        slip_Pic: paymentToDelete.slip_Pic,
        date: paymentToDelete.date,
        curr_Rate: paymentToDelete.curr_Rate,
        curr_Amount: paymentToDelete.curr_Amount,
        invoice: paymentToDelete.invoice,
      });
      await newRecycle.save();
      // Add this line for logging

      await existingSupplier.updateOne({
        $inc: {
          "payment_In_Schema.total_Payment_In": -payment_In,
          "payment_In_Schema.total_Cash_Out": -cash_Out,
          "payment_In_Schema.remaining_Balance": newPaymentIn,
          "payment_In_Schema.total_Payment_In_Curr": curr_Amount
            ? -curr_Amount
            : 0,
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

      if (payment_Via.toLowerCase() === "cash") {
        cashInHandUpdate.$inc.cash = -newPaymentIn;
        cashInHandUpdate.$inc.total_Cash = -newPaymentIn;
      } else {
        cashInHandUpdate.$inc.bank_Cash = -newPaymentIn;
        cashInHandUpdate.$inc.total_Cash = -newPaymentIn;
      }
      await CashInHand.updateOne({}, cashInHandUpdate);
      const newNotification = new Notifications({
        type: "Azad Supplier Payment In Deleted",
        content: `${user.userName} deleted ${
          payment_In ? "Payment_In" : "Cash_Retrun"
        }: ${
          payment_In ? payment_In : cash_Out
        } of Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();
      const updatedSupplier = await AzadSuppliers.findById(
        existingSupplier._id
      );
      res
        .status(200)
        .json({
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

// Updating a single AzadSupplier Payment In Details
const updateSingleAzadSupplierPaymentIn = async (req, res) => {
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
      } = req.body;

      const newPaymentIn = parseInt(payment_In, 10);
      const newCashOut = parseInt(cash_Out, 10);
      const newCurrAmount = parseInt(curr_Amount, 10);

      const existingSupplier = await AzadSuppliers.findOne({
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
        });
      }

      await existingSupplier.updateOne({
        $inc: {
          "payment_In_Schema.total_Payment_In": -updatedPaymentIn,
          "payment_In_Schema.total_Cash_Out": -updatedCashout,
          "payment_In_Schema.remaining_Balance": -newBalance,
          "payment_In_Schema.total_Payment_In_Curr": updateCurr_Amount
            ? -updateCurr_Amount
            : 0,
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
        cashInHandUpdate.$inc.cash = newBalance;
        cashInHandUpdate.$inc.total_Cash = newBalance;
      } else {
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
      }
      paymentToUpdate.payment_In_Curr = curr_Country;
      paymentToUpdate.curr_Rate = curr_Rate;
      paymentToUpdate.curr_Amount = newCurrAmount;
      paymentToUpdate.date = date;

      // Save the updated supplier

      await existingSupplier.save();
      const newNotification = new Notifications({
        type: "Azad Supplier Payment In Updated",
        content: `${user.userName} updated Payment_In: ${payment_In} of Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();

      const updatedSupplier = await AzadSuppliers.findById(
        existingSupplier._id
      );
      console.log(updatedSupplier);
      res
        .status(200)
        .json({
          message: "Payment In details updated successfully",
          data: updatedSupplier,
        });
    } catch (error) {
      console.error("Error updating payment details:", error);
      res
        .status(500)
        .json({
          message: "Error updating payment details",
          error: error.message,
        });
    }
  }
};

//deleting the Azad Supplier payment_In_Schema
const deleteAzadSupplierPaymentInSchema = async (req, res) => {
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

    const existingSupplier = await AzadSuppliers.findOne({
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
      $inc: {},
    };
    cashInHandUpdate.$inc.total_Cash =
      -existingSupplier.payment_In_Schema.total_Payment_In;
    cashInHandUpdate.$inc.total_Cash =
      existingSupplier.payment_In_Schema.total_Cash_Out;

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
};

// Deleting a PaymentIn Person

const deleteAzadSupplierPaymentInPerson = async (req, res) => {
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
      personId,
      supplierName,
      azad_Visa_Price_In_PKR,
      azad_Visa_Price_In_Curr,
    } = req.body;

    const existingSupplier = await AzadSuppliers.findOne({
      "payment_In_Schema.supplierName": supplierName,
    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Supplier not Found",
      });
    }

    try {
      await existingSupplier.updateOne({
        $inc: {
          "payment_In_Schema.remaining_Balance": -azad_Visa_Price_In_PKR,
          "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
            -azad_Visa_Price_In_PKR,
          "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
            azad_Visa_Price_In_Curr ? -azad_Visa_Price_In_Curr : 0,
        },

        $pull: {
          "payment_In_Schema.persons": { _id: personId },
        },
      });
      const newNotification = new Notifications({
        type: "Azad Supplier Payment In Person Deleted",
        content: `${user.userName} deleted Person having Visa Price In PKR: ${azad_Visa_Price_In_PKR} of Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();

      res
        .status(200)
        .json({
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

// Updating Payments in Person

const updateSupPaymentInPerson = async (req, res) => {
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
        personId,
        name,
        pp_No,
        status,
        company,
        country,
        entry_Mode,
        final_Status,
        trade,
        flight_Date,
      } = req.body;

      let entryMode;

      const existingSupplier = await AzadSuppliers.findOne({
        "payment_In_Schema.supplierName": supplierName,
      });

      if (existingSupplier) {
        const personIn = existingSupplier.payment_In_Schema.persons.find(
          (person) => person._id.toString() === personId.toString()
        );
        if (personIn) {
          if (
            final_Status.toLowerCase() === "offer letter" ||
            final_Status.toLowerCase() === "offer_letter"
          ) {
            const newReminder = new Reminders({
              type: "Offer Letter",
              content: `${name}'s Final Status is updated to Offer Letter.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }
          if (
            final_Status.toLowerCase() === "e number" ||
            final_Status.toLowerCase() === "e_number"
          ) {
            const newReminder = new Reminders({
              type: "E Number",
              content: `${name}'s Final Status is updated to E Number.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }

          if (
            final_Status.toLowerCase() === "qvc" ||
            final_Status.toLowerCase() === "q_v_c"
          ) {
            const newReminder = new Reminders({
              type: "QVC",
              content: `${name}'s Final Status is updated to QVC.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }
          if (
            final_Status.toLowerCase() === "visa issued" ||
            final_Status.toLowerCase() === "visa_issued" ||
            final_Status.toLowerCase() === "vissa issued" ||
            final_Status.toLowerCase() === "vissa_issued"
          ) {
            const newReminder = new Reminders({
              type: "Visa Issued",
              content: `${name}'s Final Status is updated to Visa Issued.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }
          if (
            final_Status.toLowerCase() === "ptn" ||
            final_Status.toLowerCase() === "p_t_n"
          ) {
            const newReminder = new Reminders({
              type: "PTN",
              content: `${name}'s Final Status is updated to PTN.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }

          if (
            final_Status.toLowerCase() === "ticket" ||
            final_Status.toLowerCase() === "tiket"
          ) {
            const newReminder = new Reminders({
              type: "Ticket",
              content: `${name}'s Final Status is updated to Ticket.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }
          entryMode = personIn.entry_Mode;
          personIn.company = company;
          personIn.country = country;
          personIn.entry_Mode = entry_Mode;
          personIn.final_Status = final_Status;
          personIn.trade = trade;
          personIn.status = status;
          personIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
          await existingSupplier.save();
        } else {
          res
            .status(404)
            .json({ message: `person with ID: ${personId} not found` });
          return;
        }
      }

      // Updating in Agents both Schema
      const agents = await AzadSuppliers.find({});

      for (const agent of agents) {
        if (agent.payment_Out_Schema && agent.payment_Out_Schema.persons) {
          const personOut = agent.payment_Out_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personOut) {
            personOut.company = company;
            personOut.country = country;
            personOut.entry_Mode = entry_Mode;
            personOut.final_Status = final_Status;
            personOut.trade = trade;
            personOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await agent.save();
          }
        }
      }

      const newAgents = await Agents.find({});
      for (const newAgent of newAgents) {
        if (newAgent.payment_In_Schema && newAgent.payment_In_Schema.persons) {
          const personIn = newAgent.payment_In_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personIn) {
            personIn.company = company;
            personIn.country = country;
            personIn.entry_Mode = entry_Mode;
            personIn.final_Status = final_Status;
            personIn.trade = trade;
            personIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await newAgent.save();
          }
        }

        if (
          newAgent.payment_Out_Schema &&
          newAgent.payment_Out_Schema.persons
        ) {
          const personOut = newAgent.payment_Out_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personOut) {
            personOut.company = company;
            personOut.country = country;
            personOut.entry_Mode = entry_Mode;
            personOut.final_Status = final_Status;
            personOut.trade = trade;
            personOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await newAgent.save();
          }
        }
      }

      const suppliers = await Suppliers.find({});
      for (const supplier of suppliers) {
        if (supplier.payment_In_Schema && supplier.payment_In_Schema.persons) {
          const personIn = supplier.payment_In_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personIn) {
            personIn.company = company;
            personIn.country = country;
            personIn.entry_Mode = entry_Mode;
            personIn.final_Status = final_Status;
            personIn.trade = trade;
            personIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await supplier.save();
          }
        }

        if (
          supplier.payment_Out_Schema &&
          supplier.payment_Out_Schema.persons
        ) {
          const personOut = supplier.payment_Out_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personOut) {
            personOut.company = company;
            personOut.country = country;
            personOut.entry_Mode = entry_Mode;
            personOut.final_Status = final_Status;
            personOut.trade = trade;
            personOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await supplier.save();
          }
        }
      }

      const candidateIn = await Candidate.findOne({
        "payment_In_Schema.supplierName": name.toString(),
        "payment_In_Schema.entry_Mode": entryMode.toString(),
        "payment_In_Schema.pp_No": pp_No.toString(),
      });
      if (candidateIn) {
        candidateIn.payment_In_Schema.company = company;
        candidateIn.payment_In_Schema.country = country;
        candidateIn.payment_In_Schema.entry_Mode = entry_Mode;
        candidateIn.payment_In_Schema.final_Status = final_Status;
        candidateIn.payment_In_Schema.trade = trade;
        candidateIn.payment_In_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await candidateIn.save();
      }

      const candidateOut = await Candidate.findOne({
        "payment_Out_Schema.supplierName": name.toString(),
        "payment_Out_Schema.entry_Mode": entryMode.toString(),
        "payment_Out_Schema.pp_No": pp_No.toString(),
      });
      if (candidateOut) {
        candidateOut.payment_Out_Schema.company = company;
        candidateOut.payment_Out_Schema.country = country;
        candidateOut.payment_Out_Schema.entry_Mode = entry_Mode;
        candidateOut.payment_Out_Schema.final_Status = final_Status;
        candidateOut.payment_Out_Schema.trade = trade;
        candidateOut.payment_Out_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await candidateOut.save();
      }

      const ticketSuppliers = await TicketSuppliers.find({});
      for (const ticketSupplier of ticketSuppliers) {
        if (
          ticketSupplier.payment_In_Schema &&
          ticketSupplier.payment_In_Schema.persons
        ) {
          const SupPersonIn = ticketSupplier.payment_In_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (SupPersonIn) {
            SupPersonIn.company = company;
            SupPersonIn.country = country;
            SupPersonIn.entry_Mode = entry_Mode;
            SupPersonIn.final_Status = final_Status;
            SupPersonIn.trade = trade;
            SupPersonIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await ticketSupplier.save();
          }
        }

        if (
          ticketSupplier.payment_Out_Schema &&
          ticketSupplier.payment_Out_Schema.persons
        ) {
          const SupPersonOut = ticketSupplier.payment_Out_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (SupPersonOut) {
            SupPersonOut.company = company;
            SupPersonOut.country = country;
            SupPersonOut.entry_Mode = entry_Mode;
            SupPersonOut.final_Status = final_Status;
            SupPersonOut.trade = trade;
            SupPersonOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await ticketSupplier.save();
          }
        }
      }

      const ticketAgents = await TicketAgents.find({});
      for (const ticketAgent of ticketAgents) {
        if (
          ticketAgent.payment_In_Schema &&
          ticketAgent.payment_In_Schema.persons
        ) {
          const AgentPersonIn = ticketAgent.payment_In_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonIn) {
            AgentPersonIn.company = company;
            AgentPersonIn.country = country;
            AgentPersonIn.entry_Mode = entry_Mode;
            AgentPersonIn.final_Status = final_Status;
            AgentPersonIn.trade = trade;
            AgentPersonIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await ticketAgent.save();
          }
        }

        if (
          ticketAgent.payment_Out_Schema &&
          ticketAgent.payment_Out_Schema.persons
        ) {
          const AgentPersonOut = ticketAgent.payment_Out_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonOut) {
            AgentPersonOut.company = company;
            AgentPersonOut.country = country;
            AgentPersonOut.entry_Mode = entry_Mode;
            AgentPersonOut.final_Status = final_Status;
            AgentPersonOut.trade = trade;
            AgentPersonOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await ticketAgent.save();
          }
        }
      }

      const visitSuppliers = await VisitSuppliers.find({});
      for (const visitSupplier of visitSuppliers) {
        if (
          visitSupplier.payment_In_Schema &&
          visitSupplier.payment_In_Schema.persons
        ) {
          const SupPersonIn = visitSupplier.payment_In_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (SupPersonIn) {
            SupPersonIn.company = company;
            SupPersonIn.country = country;
            SupPersonIn.entry_Mode = entry_Mode;
            SupPersonIn.final_Status = final_Status;
            SupPersonIn.trade = trade;
            SupPersonIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await visitSupplier.save();
          }
        }

        if (
          visitSupplier.payment_Out_Schema &&
          visitSupplier.payment_Out_Schema.persons
        ) {
          const SupPersonOut = visitSupplier.payment_Out_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (SupPersonOut) {
            SupPersonOut.company = company;
            SupPersonOut.country = country;
            SupPersonOut.entry_Mode = entry_Mode;
            SupPersonOut.final_Status = final_Status;
            SupPersonOut.trade = trade;
            SupPersonOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await visitSupplier.save();
          }
        }
      }

      const visitAgents = await VisitAgents.find({});

      for (const visitAgent of visitAgents) {
        if (
          visitAgent.payment_In_Schema &&
          visitAgent.payment_In_Schema.persons
        ) {
          const AgentPersonIn = visitAgent.payment_In_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonIn) {
            AgentPersonIn.company = company;
            AgentPersonIn.country = country;
            AgentPersonIn.entry_Mode = entry_Mode;
            AgentPersonIn.final_Status = final_Status;
            AgentPersonIn.trade = trade;
            AgentPersonIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await visitAgent.save();
          }
        }

        if (
          visitAgent.payment_Out_Schema &&
          visitAgent.payment_Out_Schema.persons
        ) {
          const AgentPersonOut = visitAgent.payment_Out_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonOut) {
            AgentPersonOut.company = company;
            AgentPersonOut.country = country;
            AgentPersonOut.entry_Mode = entry_Mode;
            AgentPersonOut.final_Status = final_Status;
            AgentPersonOut.trade = trade;
            AgentPersonOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await visitAgent.save();
          }
        }
      }
      const azadAgents = await AzadAgents.find({});
      for (const azadAgent of azadAgents) {
        if (
          azadAgent.payment_In_Schema &&
          azadAgent.payment_In_Schema.persons
        ) {
          const AgentPersonIn = azadAgent.payment_In_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonIn) {
            AgentPersonIn.company = company;
            AgentPersonIn.country = country;
            AgentPersonIn.entry_Mode = entry_Mode;
            AgentPersonIn.final_Status = final_Status;
            AgentPersonIn.trade = trade;
            AgentPersonIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await azadAgent.save();
          }
        }

        if (
          azadAgent.payment_Out_Schema &&
          azadAgent.payment_Out_Schema.persons
        ) {
          const AgentPersonOut = azadAgent.payment_Out_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonOut) {
            AgentPersonOut.company = company;
            AgentPersonOut.country = country;
            AgentPersonOut.entry_Mode = entry_Mode;
            AgentPersonOut.final_Status = final_Status;
            AgentPersonOut.trade = trade;
            AgentPersonOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await azadAgent.save();
          }
        }
      }

      const azadCandidateIn = await AzadCandidate.findOne({
        "payment_In_Schema.supplierName": name,
        "payment_In_Schema.entry_Mode": entryMode,
        "payment_In_Schema.pp_No": pp_No,
      });
      if (azadCandidateIn) {
        azadCandidateIn.payment_In_Schema.company = company;
        azadCandidateIn.payment_In_Schema.country = country;
        azadCandidateIn.payment_In_Schema.entry_Mode = entry_Mode;
        azadCandidateIn.payment_In_Schema.final_Status = final_Status;
        azadCandidateIn.payment_In_Schema.trade = trade;
        azadCandidateIn.payment_In_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await azadCandidateIn.save();
      }

      const azadCandidateOut = await AzadCandidate.findOne({
        "payment_Out_Schema.supplierName": name,
        "payment_Out_Schema.entry_Mode": entryMode,
        "payment_Out_Schema.pp_No": pp_No,
      });
      if (azadCandidateOut) {
        azadCandidateOut.payment_Out_Schema.company = company;
        azadCandidateOut.payment_Out_Schema.country = country;
        azadCandidateOut.payment_Out_Schema.entry_Mode = entry_Mode;
        azadCandidateOut.payment_Out_Schema.final_Status = final_Status;
        azadCandidateOut.payment_Out_Schema.trade = trade;
        azadCandidateOut.payment_Out_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await azadCandidateOut.save();
      }

      const ticketCandidateIn = await TicketCandidate.findOne({
        "payment_In_Schema.supplierName": name,
        "payment_In_Schema.entry_Mode": entryMode,
        "payment_In_Schema.pp_No": pp_No,
      });
      if (ticketCandidateIn) {
        ticketCandidateIn.payment_In_Schema.company = company;
        ticketCandidateIn.payment_In_Schema.country = country;
        ticketCandidateIn.payment_In_Schema.entry_Mode = entry_Mode;
        ticketCandidateIn.payment_In_Schema.final_Status = final_Status;
        ticketCandidateIn.payment_In_Schema.trade = trade;
        ticketCandidateIn.payment_In_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await ticketCandidateIn.save();
      }

      const ticketCandidateOut = await TicketCandidate.findOne({
        "payment_Out_Schema.supplierName": name,
        "payment_Out_Schema.entry_Mode": entryMode,
        "payment_Out_Schema.pp_No": pp_No,
      });
      if (ticketCandidateOut) {
        ticketCandidateOut.payment_Out_Schema.company = company;
        ticketCandidateOut.payment_Out_Schema.country = country;
        ticketCandidateOut.payment_Out_Schema.entry_Mode = entry_Mode;
        ticketCandidateOut.payment_Out_Schema.final_Status = final_Status;
        ticketCandidateOut.payment_Out_Schema.trade = trade;
        ticketCandidateOut.payment_Out_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await ticketCandidateOut.save();
      }

      const visitCandidateIn = await VisitCandidate.findOne({
        "payment_In_Schema.supplierName": name,
        "payment_In_Schema.entry_Mode": entryMode,
        "payment_In_Schema.pp_No": pp_No,
      });
      if (visitCandidateIn) {
        visitCandidateIn.payment_In_Schema.company = company;
        visitCandidateIn.payment_In_Schema.country = country;
        visitCandidateIn.payment_In_Schema.entry_Mode = entry_Mode;
        visitCandidateIn.payment_In_Schema.final_Status = final_Status;
        visitCandidateIn.payment_In_Schema.trade = trade;
        visitCandidateIn.payment_In_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await visitCandidateIn.save();
      }

      const visitCandidateOut = await VisitCandidate.findOne({
        "payment_Out_Schema.supplierName": name,
        "payment_Out_Schema.entry_Mode": entryMode,
        "payment_Out_Schema.pp_No": pp_No,
      });
      if (visitCandidateOut) {
        visitCandidateOut.payment_Out_Schema.company = company;
        visitCandidateOut.payment_Out_Schema.country = country;
        visitCandidateOut.payment_Out_Schema.entry_Mode = entry_Mode;
        visitCandidateOut.payment_Out_Schema.final_Status = final_Status;
        visitCandidateOut.payment_Out_Schema.trade = trade;
        visitCandidateOut.payment_Out_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await visitCandidateOut.save();
      }

      const protectors = await Protector.find({});
      for (const protector of protectors) {
        if (
          protector.payment_Out_Schema &&
          protector.payment_Out_Schema.persons
        ) {
          const personOut = protector.payment_Out_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personOut) {
            personOut.company = company;
            personOut.country = country;
            personOut.entry_Mode = entry_Mode;
            personOut.final_Status = final_Status;
            personOut.trade = trade;
            personOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await protector.save();
          }
        }
      }

      const entry = await Entries.findOne({
        name,
        pp_No,
        entry_Mode: entryMode,
      });

      if (entry) {
        entry.company = company;
        entry.country = country;
        entry.entry_Mode = entry_Mode;
        entry.final_Status = final_Status;
        entry.trade = trade;
        entry.flight_Date = flight_Date ? flight_Date : "Not Fly";
        await entry.save();
      }
      const newNotification = new Notifications({
        type: "Azad Supplier Payment In Person Updated",
        content: `${user.userName} updated Person :${name} of Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();

      res.status(200).json({ message: `${name} updated successfully!` });
      console.log("updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: error });
    }
  }
};

// Getting All Azad Supplier Payments In
const getAllAzadSupplierPaymentsIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role === "Admin") {
      const supplierPayments = await AzadSuppliers.find({}).sort({
        createdAt: -1,
      });
      const formattedDetails = supplierPayments
        .filter((supplier) => supplier.payment_In_Schema) // Filter out entries with empty payment_In_Schema
        .map((supplier) => {
          const paymentInSchema = supplier.payment_In_Schema;

          return {
            supplier_Id: paymentInSchema.supplier_Id,
            supplierName: paymentInSchema.supplierName,
            total_Azad_Visa_Price_In_PKR:
              paymentInSchema.total_Azad_Visa_Price_In_PKR,
            total_Azad_Visa_Price_In_Curr:
              paymentInSchema.total_Azad_Visa_Price_In_Curr,
            total_Payment_In_Curr: paymentInSchema.total_Payment_In_Curr,
            total_Payment_In: paymentInSchema.total_Payment_In,
            total_Cash_Out: paymentInSchema.total_Cash_Out,
            remaining_Balance: paymentInSchema.remaining_Balance,
            curr_Country: paymentInSchema.curr_Country,
            persons: paymentInSchema.persons || [],
            payment: paymentInSchema.payment || [],
            status: paymentInSchema.status,
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

// Azaz Supplier Payments Out Sections
// Adding a new Payment Out
const addAzadSupplierPaymentOut = async (req, res) => {
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

        const existingSupplier = await AzadSuppliers.findOne({
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
          date:date?date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
        };

        try {
          // Update total_Azad_Visa_Price_In_PKR and other fields using $inc
          await existingSupplier.updateOne({
            $inc: {
              "payment_Out_Schema.total_Payment_Out": payment_Out,
              "payment_Out_Schema.remaining_Balance": -payment_Out,
              "payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount
                ? newCurrAmount
                : 0,
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

          if (payment_Via.toLowerCase() === "cash") {
            cashInHandUpdate.$inc.cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          } else {
            cashInHandUpdate.$inc.bank_Cash = -newPaymentOut;
            cashInHandUpdate.$inc.total_Cash = -newPaymentOut;
          }

          await CashInHand.updateOne({}, cashInHandUpdate);

          const newBackup = new Backup({
            name: supplierName,
            category: category,
            payment_Via: payment_Via,
            payment_Type: payment_Type,
            slip_No: slip_No ? slip_No : "",
            payment_Out: newPaymentOut,
            slip_Pic: uploadImage?.secure_url || "",
            details: details,
            payment_Out_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date: new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
          });
          await newBackup.save();
          const newNotification = new Notifications({
            type: "Azad Supplier Payment Out",
            content: `${user.userName} added Payment_Out: ${payment_Out} of Azad Supplier: ${supplierName}`,
            date: new Date().toISOString().split("T")[0],
          });
          await newNotification.save();

          res
            .status(200)
            .json({
              message: `Payment Out: ${payment_Out} added Successfully to ${supplierName}'s Record`,
            });
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

// Adding multiple Payment Out
const addAzadSupplierMultiplePaymentsOut = async (req, res) => {
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
        } = payment;
        if(!payment_Via){
          res.status(400).json({message:"Payment Via is required"})
          break;
        }
        if (!supplierName) {
          res.status(400).json({ message: "Supplier Name is required" });
          return;
        }

        const newPaymentOut = parseInt(payment_Out, 10);
        const newCurrAmount = parseInt(curr_Amount, 10);

        const suppliers = await AzadSuppliers.find({});
        let existingSupplier;

        for (const supplier of suppliers) {
          if (supplier.payment_Out_Schema) {
            if (
              supplier.payment_Out_Schema.supplierName.toLowerCase() ===
              supplierName.toLowerCase()
            ) {
              existingSupplier = supplier;
              break;
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

        const uploadImage = await cloudinary.uploader.upload(slip_Pic, {
          upload_preset: "rozgar",
        });

        const newPayment = {
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
          date:date?date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
        };

        updatedPayments.push(newPayment);

        await existingSupplier.updateOne({
          $inc: {
            "payment_Out_Schema.total_Payment_Out": payment_Out,
            "payment_Out_Schema.remaining_Balance": -payment_Out,
            "payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount
              ? newCurrAmount
              : 0,
          },

          $push: {
            "payment_Out_Schema.payment": newPayment,
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
        const newBackup = new Backup({
          name: supplierName,
          category: category,
          payment_Via: payment_Via,
          payment_Type: payment_Type,
          slip_No: slip_No ? slip_No : "",
          payment_Out: newPaymentOut,
          slip_Pic: uploadImage?.secure_url || "",
          details: details,
          payment_Out_Curr: curr_Country ? curr_Country : "",
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date: new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
        });
        await newBackup.save();
        const newNotification = new Notifications({
          type: "Azad Supplier Payment Out",
          content: `${user.userName} added Payment_Out: ${payment_Out} of Azad Supplier: ${supplierName}`,
          date: new Date().toISOString().split("T")[0],
        });
        await newNotification.save();
      }
      res
        .status(200)
        .json({
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
};

// Adding a new Payment Out Return
const addAzadSupplierPaymentOutReturn = async (req, res) => {
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

        const existingSupplier = await AzadSuppliers.findOne({
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
          });
        }
        // Use the correct variable name, e.g., existingSupplier instead of existingPayment
        const payment = {
          name: supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No: slip_No ? slip_No : "",
          cash_Out: newCashOut,
          slip_Pic: uploadImage?.secure_url || "",
          details,
          payment_Out_Curr: curr_Country ? curr_Country : 0,
          curr_Rate: curr_Rate ? curr_Rate : 0,
          curr_Amount: newCurrAmount ? newCurrAmount : 0,
          date:date?date:new Date().toISOString().split("T")[0],
          invoice: nextInvoiceNumber,
        };

        try {
          // Update total_Azad_Visa_Price_In_PKR and other fields using $inc
          await existingSupplier.updateOne({
            $inc: {
              "payment_Out_Schema.total_Cash_Out": newCashOut,
              "payment_Out_Schema.remaining_Balance": newCashOut,
              "payment_Out_Schema.total_Payment_Out_Curr": newCurrAmount
                ? -newCurrAmount
                : 0,
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

          if (payment_Via.toLowerCase() === "cash") {
            cashInHandUpdate.$inc.cash = newCashOut;
            cashInHandUpdate.$inc.total_Cash = newCashOut;
          } else {
            cashInHandUpdate.$inc.bank_Cash = newCashOut;
            cashInHandUpdate.$inc.total_Cash = newCashOut;
          }

          await CashInHand.updateOne({}, cashInHandUpdate);

          const newBackup = new Backup({
            name: supplierName,
            category: category,
            payment_Via: payment_Via,
            payment_Type: payment_Type,
            slip_No: slip_No ? slip_No : "",
            cash_Out: newCashOut,
            slip_Pic: uploadImage?.secure_url || "",
            details: details,
            payment_Out_Curr: curr_Country ? curr_Country : "",
            curr_Rate: curr_Rate ? curr_Rate : 0,
            curr_Amount: newCurrAmount ? newCurrAmount : 0,
            date: new Date().toISOString().split("T")[0],
            invoice: nextInvoiceNumber,
          });
          await newBackup.save();

          await existingSupplier.save();
          const newNotification = new Notifications({
            type: "Azad Supplier Payment Out Return",
            content: `${user.userName} added Payment_Return: ${cash_Out} of Azad Supplier: ${supplierName}`,
            date: new Date().toISOString().split("T")[0],
          });
          await newNotification.save();
          const updatedSupplier = await AzadSuppliers.findById(
            existingSupplier._id
          );

          res
            .status(200)
            .json({
              message: `Cash Out: ${cash_Out} added Successfully to ${supplierName}'s Record`,
            });
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

// Deleting a single AzadSupplier Payment Out

const deleteAzadSupplierSinglePaymentOut = async (req, res) => {
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
    } = req.body;
    // console.log(paymentId, payment_Out, curr_Amount, supplierName, cash_Out, payment_Via)
    const existingSupplier = await AzadSuppliers.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Supplier not Found",
      });
    }
    const newPaymentOut = payment_Out - cash_Out;

    try {
      let paymentToDelete = existingSupplier.payment_Out_Schema.payment.find(
        (p) => p._id.toString() === paymentId.toString()
      );
      const newRecycle = new RecycleBin({
        name: supplierName,
        type: "Azad Supplier Payment Out",
        category: paymentToDelete.category,
        payment_Via: paymentToDelete.payment_Via,
        payment_Type: paymentToDelete.payment_Type,
        slip_No: paymentToDelete.slip_No,
        payment_Out: paymentToDelete.payment_Out,
        cash_Out: paymentToDelete.cash_Out,
        payment_Out_Curr: paymentToDelete.payment_Out_Curr,
        slip_Pic: paymentToDelete.slip_Pic,
        date: paymentToDelete.date,
        curr_Rate: paymentToDelete.curr_Rate,
        curr_Amount: paymentToDelete.curr_Amount,
        invoice: paymentToDelete.invoice,
      });
      await newRecycle.save();
      // Update total_Azad_Visa_Price_In_PKR and other fields using $inc
      await existingSupplier.updateOne({
        $inc: {
          "payment_Out_Schema.total_Payment_Out": -payment_Out,
          "payment_Out_Schema.total_Cash_Out": -cash_Out,
          "payment_Out_Schema.remaining_Balance": newPaymentOut,
          "payment_Out_Schema.total_Payment_Out_Curr": curr_Amount
            ? -curr_Amount
            : 0,
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

      if (payment_Via.toLowerCase() === "cash") {
        cashInHandUpdate.$inc.cash = newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = newPaymentOut;
      } else {
        cashInHandUpdate.$inc.bank_Cash = newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = newPaymentOut;
      }

      await CashInHand.updateOne({}, cashInHandUpdate);

      const newNotification = new Notifications({
        type: "Azad Supplier Payment Out Deleted",
        content: `${user.userName} deleted ${
          payment_Out ? "Payment_Out" : "Cash_Retrun"
        }: ${
          payment_Out ? payment_Out : cash_Out
        } of Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();

      res
        .status(200)
        .json({
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

// Updating a single AzadSupplier Payment Out Details
const updateAzadSupplierSinglePaymentOut = async (req, res) => {
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
    } = req.body;
    const newPaymentOut = parseInt(payment_Out, 10);
    const newCashOut = parseInt(cash_Out, 10);
    const newCurrAmount = parseInt(curr_Amount, 10);

    try {
      const existingSupplier = await AzadSuppliers.findOne({
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
        });
      }

      await existingSupplier.updateOne({
        $inc: {
          "payment_Out_Schema.total_Payment_Out": -updatedPaymentOut,
          "payment_Out_Schema.total_Cash_Out": -updatedCashout,
          "payment_Out_Schema.remaining_Balance": -newBalance,
          "payment_Out_Schema.total_Payment_Out_Curr": updateCurr_Amount
            ? -updateCurr_Amount
            : 0,
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
        cashInHandUpdate.$inc.cash = -newBalance;
        cashInHandUpdate.$inc.total_Cash = -newBalance;
      } else {
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
      }
      paymentToUpdate.payment_Out_Curr = curr_Country;
      paymentToUpdate.curr_Rate = curr_Rate;
      paymentToUpdate.curr_Amount = curr_Amount;
      paymentToUpdate.date = date;
      // Save the updated supplier
      await existingSupplier.save();
      const newNotification = new Notifications({
        type: "Azad Supplier Payment Out Updated",
        content: `${user.userName} updated Payment_Out: ${payment_Out} of Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();

      res
        .status(200)
        .json({ message: "Payment Out details updated successfully" });
    } catch (error) {
      console.error("Error updating payment details:", error);
      res
        .status(500)
        .json({
          message: "Error updating payment details",
          error: error.message,
        });
    }
  }
};

const deleteAzadSupplierPaymentOutPerson = async (req, res) => {
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
      personId,
      supplierName,
      azad_visa_Price_Out_PKR,
      azad_Visa_Price_Out_Curr,
    } = req.body;
    // console.log(personId, supplierName, azad_visa_Price_Out_PKR,)
    const newVisa_Price_Out_PKR = parseInt(azad_Visa_Price_Out_Curr, 10);
    const newVisa_Price_Out_Curr = parseInt(azad_visa_Price_Out_PKR, 10);
    const existingSupplier = await AzadSuppliers.findOne({
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
          "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
            -newVisa_Price_Out_PKR,
          "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
            -newVisa_Price_Out_Curr,
        },

        $pull: {
          "payment_Out_Schema.persons": { _id: personId },
        },
      });
      const newNotification = new Notifications({
        type: "Azad Supplier Payment Out Person Deleted",
        content: `${user.userName} deleted Person having Visa Price In PKR: ${azad_visa_Price_Out_PKR} of Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();
      // const updatedSupplier = await AzadSuppliers.findById(existingSupplier._id);
      res
        .status(200)
        .json({
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

// Updating Payments in Person

const updateSupPaymentOutPerson = async (req, res) => {
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
        personId,
        name,
        pp_No,
        status,
        company,
        country,
        entry_Mode,
        final_Status,
        trade,
        flight_Date,
      } = req.body;

      let entryMode;

      const existingSupplier = await AzadSuppliers.findOne({
        "payment_Out_Schema.supplierName": supplierName,
      });

      if (existingSupplier) {
        const personIn = existingSupplier.payment_Out_Schema.persons.find(
          (person) => person._id.toString() === personId.toString()
        );
        if (personIn) {
          if (
            final_Status.toLowerCase() === "offer letter" ||
            final_Status.toLowerCase() === "offer_letter"
          ) {
            const newReminder = new Reminders({
              type: "Offer Letter",
              content: `${name}'s Final Status is updated to Offer Letter.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }
          if (
            final_Status.toLowerCase() === "e number" ||
            final_Status.toLowerCase() === "e_number"
          ) {
            const newReminder = new Reminders({
              type: "E Number",
              content: `${name}'s Final Status is updated to E Number.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }

          if (
            final_Status.toLowerCase() === "qvc" ||
            final_Status.toLowerCase() === "q_v_c"
          ) {
            const newReminder = new Reminders({
              type: "QVC",
              content: `${name}'s Final Status is updated to QVC.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }
          if (
            final_Status.toLowerCase() === "visa issued" ||
            final_Status.toLowerCase() === "visa_issued" ||
            final_Status.toLowerCase() === "vissa issued" ||
            final_Status.toLowerCase() === "vissa_issued"
          ) {
            const newReminder = new Reminders({
              type: "Visa Issued",
              content: `${name}'s Final Status is updated to Visa Issued.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }
          if (
            final_Status.toLowerCase() === "ptn" ||
            final_Status.toLowerCase() === "p_t_n"
          ) {
            const newReminder = new Reminders({
              type: "PTN",
              content: `${name}'s Final Status is updated to PTN.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }

          if (
            final_Status.toLowerCase() === "ticket" ||
            final_Status.toLowerCase() === "tiket"
          ) {
            const newReminder = new Reminders({
              type: "Ticket",
              content: `${name}'s Final Status is updated to Ticket.`,
              date: new Date().toISOString().split("T")[0],
            });
            await newReminder.save();
          }

          entryMode = personIn.entry_Mode;
          personIn.company = company;
          personIn.country = country;
          personIn.entry_Mode = entry_Mode;
          personIn.final_Status = final_Status;
          personIn.trade = trade;
          personIn.status = status;
          personIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
          await existingSupplier.save();
        } else {
          res
            .status(404)
            .json({ message: `person with ID: ${personId} not found` });
          return;
        }
      }

      // Updating in Agents both Schema
      const agents = await AzadSuppliers.find({});

      for (const agent of agents) {
        if (agent.payment_In_Schema && agent.payment_In_Schema.persons) {
          const personOut = agent.payment_In_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personOut) {
            personOut.company = company;
            personOut.country = country;
            personOut.entry_Mode = entry_Mode;
            personOut.final_Status = final_Status;
            personOut.trade = trade;
            personOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await agent.save();
          }
        }
      }

      const newAgents = await Agents.find({});
      for (const newAgent of newAgents) {
        if (newAgent.payment_In_Schema && newAgent.payment_In_Schema.persons) {
          const personIn = newAgent.payment_In_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personIn) {
            personIn.company = company;
            personIn.country = country;
            personIn.entry_Mode = entry_Mode;
            personIn.final_Status = final_Status;
            personIn.trade = trade;
            personIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await newAgent.save();
          }
        }

        if (
          newAgent.payment_Out_Schema &&
          newAgent.payment_Out_Schema.persons
        ) {
          const personOut = newAgent.payment_Out_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personOut) {
            personOut.company = company;
            personOut.country = country;
            personOut.entry_Mode = entry_Mode;
            personOut.final_Status = final_Status;
            personOut.trade = trade;
            personOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await newAgent.save();
          }
        }
      }

      const suppliers = await Suppliers.find({});
      for (const supplier of suppliers) {
        if (supplier.payment_In_Schema && supplier.payment_In_Schema.persons) {
          const personIn = supplier.payment_In_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personIn) {
            personIn.company = company;
            personIn.country = country;
            personIn.entry_Mode = entry_Mode;
            personIn.final_Status = final_Status;
            personIn.trade = trade;
            personIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await supplier.save();
          }
        }

        if (
          supplier.payment_Out_Schema &&
          supplier.payment_Out_Schema.persons
        ) {
          const personOut = supplier.payment_Out_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personOut) {
            personOut.company = company;
            personOut.country = country;
            personOut.entry_Mode = entry_Mode;
            personOut.final_Status = final_Status;
            personOut.trade = trade;
            personOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await supplier.save();
          }
        }
      }

      const candidateIn = await Candidate.findOne({
        "payment_In_Schema.supplierName": name.toString(),
        "payment_In_Schema.entry_Mode": entryMode.toString(),
        "payment_In_Schema.pp_No": pp_No.toString(),
      });
      if (candidateIn) {
        candidateIn.payment_In_Schema.company = company;
        candidateIn.payment_In_Schema.country = country;
        candidateIn.payment_In_Schema.entry_Mode = entry_Mode;
        candidateIn.payment_In_Schema.final_Status = final_Status;
        candidateIn.payment_In_Schema.trade = trade;
        candidateIn.payment_In_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await candidateIn.save();
      }

      const candidateOut = await Candidate.findOne({
        "payment_Out_Schema.supplierName": name.toString(),
        "payment_Out_Schema.entry_Mode": entryMode.toString(),
        "payment_Out_Schema.pp_No": pp_No.toString(),
      });
      if (candidateOut) {
        candidateOut.payment_Out_Schema.company = company;
        candidateOut.payment_Out_Schema.country = country;
        candidateOut.payment_Out_Schema.entry_Mode = entry_Mode;
        candidateOut.payment_Out_Schema.final_Status = final_Status;
        candidateOut.payment_Out_Schema.trade = trade;
        candidateOut.payment_Out_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await candidateOut.save();
      }

      const ticketSuppliers = await TicketSuppliers.find({});
      for (const ticketSupplier of ticketSuppliers) {
        if (
          ticketSupplier.payment_In_Schema &&
          ticketSupplier.payment_In_Schema.persons
        ) {
          const SupPersonIn = ticketSupplier.payment_In_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (SupPersonIn) {
            SupPersonIn.company = company;
            SupPersonIn.country = country;
            SupPersonIn.entry_Mode = entry_Mode;
            SupPersonIn.final_Status = final_Status;
            SupPersonIn.trade = trade;
            SupPersonIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await ticketSupplier.save();
          }
        }

        if (
          ticketSupplier.payment_Out_Schema &&
          ticketSupplier.payment_Out_Schema.persons
        ) {
          const SupPersonOut = ticketSupplier.payment_Out_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (SupPersonOut) {
            SupPersonOut.company = company;
            SupPersonOut.country = country;
            SupPersonOut.entry_Mode = entry_Mode;
            SupPersonOut.final_Status = final_Status;
            SupPersonOut.trade = trade;
            SupPersonOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await ticketSupplier.save();
          }
        }
      }

      const ticketAgents = await TicketAgents.find({});
      for (const ticketAgent of ticketAgents) {
        if (
          ticketAgent.payment_In_Schema &&
          ticketAgent.payment_In_Schema.persons
        ) {
          const AgentPersonIn = ticketAgent.payment_In_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonIn) {
            AgentPersonIn.company = company;
            AgentPersonIn.country = country;
            AgentPersonIn.entry_Mode = entry_Mode;
            AgentPersonIn.final_Status = final_Status;
            AgentPersonIn.trade = trade;
            AgentPersonIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await ticketAgent.save();
          }
        }

        if (
          ticketAgent.payment_Out_Schema &&
          ticketAgent.payment_Out_Schema.persons
        ) {
          const AgentPersonOut = ticketAgent.payment_Out_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonOut) {
            AgentPersonOut.company = company;
            AgentPersonOut.country = country;
            AgentPersonOut.entry_Mode = entry_Mode;
            AgentPersonOut.final_Status = final_Status;
            AgentPersonOut.trade = trade;
            AgentPersonOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await ticketAgent.save();
          }
        }
      }

      const visitSuppliers = await VisitSuppliers.find({});
      for (const visitSupplier of visitSuppliers) {
        if (
          visitSupplier.payment_In_Schema &&
          visitSupplier.payment_In_Schema.persons
        ) {
          const SupPersonIn = visitSupplier.payment_In_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (SupPersonIn) {
            SupPersonIn.company = company;
            SupPersonIn.country = country;
            SupPersonIn.entry_Mode = entry_Mode;
            SupPersonIn.final_Status = final_Status;
            SupPersonIn.trade = trade;
            SupPersonIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await visitSupplier.save();
          }
        }

        if (
          visitSupplier.payment_Out_Schema &&
          visitSupplier.payment_Out_Schema.persons
        ) {
          const SupPersonOut = visitSupplier.payment_Out_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (SupPersonOut) {
            SupPersonOut.company = company;
            SupPersonOut.country = country;
            SupPersonOut.entry_Mode = entry_Mode;
            SupPersonOut.final_Status = final_Status;
            SupPersonOut.trade = trade;
            SupPersonOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await visitSupplier.save();
          }
        }
      }

      const visitAgents = await VisitAgents.find({});

      for (const visitAgent of visitAgents) {
        if (
          visitAgent.payment_In_Schema &&
          visitAgent.payment_In_Schema.persons
        ) {
          const AgentPersonIn = visitAgent.payment_In_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonIn) {
            AgentPersonIn.company = company;
            AgentPersonIn.country = country;
            AgentPersonIn.entry_Mode = entry_Mode;
            AgentPersonIn.final_Status = final_Status;
            AgentPersonIn.trade = trade;
            AgentPersonIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await visitAgent.save();
          }
        }

        if (
          visitAgent.payment_Out_Schema &&
          visitAgent.payment_Out_Schema.persons
        ) {
          const AgentPersonOut = visitAgent.payment_Out_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonOut) {
            AgentPersonOut.company = company;
            AgentPersonOut.country = country;
            AgentPersonOut.entry_Mode = entry_Mode;
            AgentPersonOut.final_Status = final_Status;
            AgentPersonOut.trade = trade;
            AgentPersonOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await visitAgent.save();
          }
        }
      }

      const azadAgents = await AzadAgents.find({});
      for (const azadAgent of azadAgents) {
        if (
          azadAgent.payment_In_Schema &&
          azadAgent.payment_In_Schema.persons
        ) {
          const AgentPersonIn = azadAgent.payment_In_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonIn) {
            AgentPersonIn.company = company;
            AgentPersonIn.country = country;
            AgentPersonIn.entry_Mode = entry_Mode;
            AgentPersonIn.final_Status = final_Status;
            AgentPersonIn.trade = trade;
            AgentPersonIn.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await azadAgent.save();
          }
        }

        if (
          azadAgent.payment_Out_Schema &&
          azadAgent.payment_Out_Schema.persons
        ) {
          const AgentPersonOut = azadAgent.payment_Out_Schema.persons.find(
            (person) =>
              person.name.toString === name.toString() &&
              person.pp_No.toString() === pp_No.toString() &&
              person.entry_Mode.toString() === entryMode.toString()
          );
          if (AgentPersonOut) {
            AgentPersonOut.company = company;
            AgentPersonOut.country = country;
            AgentPersonOut.entry_Mode = entry_Mode;
            AgentPersonOut.final_Status = final_Status;
            AgentPersonOut.trade = trade;
            AgentPersonOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await azadAgent.save();
          }
        }
      }

      const azadCandidateIn = await AzadCandidate.findOne({
        "payment_In_Schema.supplierName": name,
        "payment_In_Schema.entry_Mode": entryMode,
        "payment_In_Schema.pp_No": pp_No,
      });
      if (azadCandidateIn) {
        azadCandidateIn.payment_In_Schema.company = company;
        azadCandidateIn.payment_In_Schema.country = country;
        azadCandidateIn.payment_In_Schema.entry_Mode = entry_Mode;
        azadCandidateIn.payment_In_Schema.final_Status = final_Status;
        azadCandidateIn.payment_In_Schema.trade = trade;
        azadCandidateIn.payment_In_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await azadCandidateIn.save();
      }

      const azadCandidateOut = await AzadCandidate.findOne({
        "payment_Out_Schema.supplierName": name,
        "payment_Out_Schema.entry_Mode": entryMode,
        "payment_Out_Schema.pp_No": pp_No,
      });
      if (azadCandidateOut) {
        azadCandidateOut.payment_Out_Schema.company = company;
        azadCandidateOut.payment_Out_Schema.country = country;
        azadCandidateOut.payment_Out_Schema.entry_Mode = entry_Mode;
        azadCandidateOut.payment_Out_Schema.final_Status = final_Status;
        azadCandidateOut.payment_Out_Schema.trade = trade;
        azadCandidateOut.payment_Out_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await azadCandidateOut.save();
      }

      const ticketCandidateIn = await TicketCandidate.findOne({
        "payment_In_Schema.supplierName": name,
        "payment_In_Schema.entry_Mode": entryMode,
        "payment_In_Schema.pp_No": pp_No,
      });
      if (ticketCandidateIn) {
        ticketCandidateIn.payment_In_Schema.company = company;
        ticketCandidateIn.payment_In_Schema.country = country;
        ticketCandidateIn.payment_In_Schema.entry_Mode = entry_Mode;
        ticketCandidateIn.payment_In_Schema.final_Status = final_Status;
        ticketCandidateIn.payment_In_Schema.trade = trade;
        ticketCandidateIn.payment_In_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await ticketCandidateIn.save();
      }

      const ticketCandidateOut = await TicketCandidate.findOne({
        "payment_Out_Schema.supplierName": name,
        "payment_Out_Schema.entry_Mode": entryMode,
        "payment_Out_Schema.pp_No": pp_No,
      });
      if (ticketCandidateOut) {
        ticketCandidateOut.payment_Out_Schema.company = company;
        ticketCandidateOut.payment_Out_Schema.country = country;
        ticketCandidateOut.payment_Out_Schema.entry_Mode = entry_Mode;
        ticketCandidateOut.payment_Out_Schema.final_Status = final_Status;
        ticketCandidateOut.payment_Out_Schema.trade = trade;
        ticketCandidateOut.payment_Out_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await ticketCandidateOut.save();
      }

      const visitCandidateIn = await VisitCandidate.findOne({
        "payment_In_Schema.supplierName": name,
        "payment_In_Schema.entry_Mode": entryMode,
        "payment_In_Schema.pp_No": pp_No,
      });
      if (visitCandidateIn) {
        visitCandidateIn.payment_In_Schema.company = company;
        visitCandidateIn.payment_In_Schema.country = country;
        visitCandidateIn.payment_In_Schema.entry_Mode = entry_Mode;
        visitCandidateIn.payment_In_Schema.final_Status = final_Status;
        visitCandidateIn.payment_In_Schema.trade = trade;
        visitCandidateIn.payment_In_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await visitCandidateIn.save();
      }

      const visitCandidateOut = await VisitCandidate.findOne({
        "payment_Out_Schema.supplierName": name,
        "payment_Out_Schema.entry_Mode": entryMode,
        "payment_Out_Schema.pp_No": pp_No,
      });
      if (visitCandidateOut) {
        visitCandidateOut.payment_Out_Schema.company = company;
        visitCandidateOut.payment_Out_Schema.country = country;
        visitCandidateOut.payment_Out_Schema.entry_Mode = entry_Mode;
        visitCandidateOut.payment_Out_Schema.final_Status = final_Status;
        visitCandidateOut.payment_Out_Schema.trade = trade;
        visitCandidateOut.payment_Out_Schema.flight_Date = flight_Date
          ? flight_Date
          : "Not Fly";
        await visitCandidateOut.save();
      }

      const protectors = await Protector.find({});
      for (const protector of protectors) {
        if (
          protector.payment_Out_Schema &&
          protector.payment_Out_Schema.persons
        ) {
          const personOut = protector.payment_Out_Schema.persons.find(
            (person) =>
              person.name === name.toString() &&
              person.pp_No === pp_No.toString() &&
              person.entry_Mode === entryMode.toString()
          );
          if (personOut) {
            personOut.company = company;
            personOut.country = country;
            personOut.entry_Mode = entry_Mode;
            personOut.final_Status = final_Status;
            personOut.trade = trade;
            personOut.flight_Date = flight_Date ? flight_Date : "Not Fly";
            await protector.save();
          }
        }
      }

      const entry = await Entries.findOne({
        name,
        pp_No,
        entry_Mode: entryMode,
      });

      if (entry) {
        entry.company = company;
        entry.country = country;
        entry.entry_Mode = entry_Mode;
        entry.final_Status = final_Status;
        entry.trade = trade;
        entry.flight_Date = flight_Date ? flight_Date : "Not Fly";
        await entry.save();
      }

      const newNotification = new Notifications({
        type: "Azad Supplier Payment Out Person Updated",
        content: `${user.userName} updated Person :${name} of Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();

      res.status(200).json({ message: `${name} updated successfully!` });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: error });
    }
  }
};

//deleting the Azad Supplier payment_In_Schema
const deleteAzadSupplierPaymentOutSchema = async (req, res) => {
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

    const existingSupplier = await AzadSuppliers.findOne({
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
      $inc: {},
    };
    cashInHandUpdate.$inc.total_Cash =
      existingSupplier.payment_Out_Schema.total_Payment_Out;
    cashInHandUpdate.$inc.total_Cash =
      -existingSupplier.payment_Out_Schema.total_Cash_Out;

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

// Getting All Azad Supplier Payments Out
const getAllAzadSupplierPaymentsOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role === "Admin") {
      const supplierPayments = await AzadSuppliers.find({}).sort({
        createdAt: -1,
      });
      const formattedDetails = supplierPayments
        .filter((supplier) => supplier.payment_Out_Schema) // Filter out entries with empty payment_Out_Schema
        .map((supplier) => {
          const paymentOutSchema = supplier.payment_Out_Schema;

          return {
            supplier_Id: paymentOutSchema.supplier_Id,
            supplierName: paymentOutSchema.supplierName,
            total_Azad_Visa_Price_Out_PKR:
              paymentOutSchema.total_Azad_Visa_Price_Out_PKR,
            total_Azad_Visa_Price_Out_Curr:
              paymentOutSchema.total_Azad_Visa_Price_Out_Curr,
            total_Payment_Out_Curr: paymentOutSchema.total_Payment_Out_Curr,
            total_Payment_Out: paymentOutSchema.total_Payment_Out,
            total_Cash_Out: paymentOutSchema.total_Cash_Out,
            remaining_Balance: paymentOutSchema.remaining_Balance,
            curr_Country: paymentOutSchema.curr_Country,
            persons: paymentOutSchema.persons || [],
            payment: paymentOutSchema.payment || [],
            status: paymentOutSchema.status,
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

// changing Status
const changeSupplierPaymentInStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const { supplierName, newStatus } = req.body;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingSupplier = await AzadSuppliers.findOne({
      "payment_In_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Update status of all persons to false
    if (
      existingSupplier.payment_In_Schema &&
      existingSupplier.payment_In_Schema.persons
    ) {
      existingSupplier.payment_In_Schema.persons.forEach((person) => {
        if (
          existingSupplier.payment_In_Schema.status.toLowerCase() === "open" &&
          newStatus.toLowerCase() === "closed"
        ) {
          person.status = "Closed";
        }
      });
    }

    // Toggle the status of the payment in schema
    existingSupplier.payment_In_Schema.status = newStatus;

    // Save changes to the database
    await existingSupplier.save();

    // Prepare response message based on the updated status
    let responseMessage;
    if (existingSupplier.payment_In_Schema.status === "Open") {
      responseMessage = "Azad Supplier Status updated to Open Successfully!";
      const newNotification = new Notifications({
        type: "Khata Open of Azad Supplier Payment In",
        content: `${user.userName} Opened Khata with Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();
    } else {
      responseMessage = "Azad Supplier Status updated to Closed Successfully!";
      const newNotification = new Notifications({
        type: "Khata Closed of Azad Supplier Payment In",
        content: `${user.userName} Closed Khata with Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();
    }

    return res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// changing Status
const changeSupplierPaymentOutStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const { supplierName, newStatus } = req.body;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingSupplier = await AzadSuppliers.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Update status of all persons to false
    if (
      existingSupplier.payment_Out_Schema &&
      existingSupplier.payment_Out_Schema.persons
    ) {
      existingSupplier.payment_Out_Schema.persons.forEach((person) => {
        if (
          existingSupplier.payment_Out_Schema.status.toLowerCase() === "open" &&
          newStatus.toLowerCase() === "closed"
        ) {
          person.status = "Closed";
        }
      });
    }

    // Toggle the status of the payment in schema
    existingSupplier.payment_Out_Schema.status = newStatus;

    // Save changes to the database
    await existingSupplier.save();

    // Prepare response message based on the updated status
    let responseMessage;
    if (existingSupplier.payment_Out_Schema.status === "Open") {
      responseMessage = "Azad Supplier Status updated to Open Successfully!";
      const newNotification = new Notifications({
        type: "Khata Open of Azad Supplier Payment Out",
        content: `${user.userName} Opened Khata with Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();
    } else {
      responseMessage = "Azad Supplier Status updated to Closed Successfully!";
      const newNotification = new Notifications({
        type: "Khata Closed of Azad Supplier Payment Out",
        content: `${user.userName} Closed Khata with Azad Supplier: ${supplierName}`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();
    }

    return res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Candidate Wise Payments In
const addCandVisePaymentIn = async (req, res) => {
  try {
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
      payments,
    } = req.body;

    let allPayments = [];
    let new_Payment_In = 0;
    let new_Curr_Amount = 0;

    const existingSupplier = await AzadSuppliers.findOne({
      "payment_In_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      res.status(404).json({
        message: "Azad Supplier not Found",
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

    for (const payment of payments) {
      const { cand_Name, payment_In, curr_Amount } = payment;
      const newPaymentIn = parseInt(payment_In, 10);
      const newCurrAmount = parseInt(curr_Amount, 10);

      const existPerson = existingSupplier.payment_In_Schema.persons.find(
        (person) => person.name.toLowerCase() === cand_Name.toLowerCase()
      );

      if (existPerson) {
        let cand_Name,
          pp_No,
          entry_Mode,
          company,
          trade,
          final_Status,
          flight_Date,
          visa_Amount_PKR,
          new_Payment,
          past_Paid_PKR,
          past_Remain_PKR,
          new_Remain_PKR,
          visa_Curr_Amount,
          new_Curr_Payment,
          past_Paid_Curr,
          past_Remain_Curr,
          new_Remain_Curr,
          curr_Rate;
        (cand_Name = existPerson.name),
          (past_Paid_PKR = existPerson.total_In),
          (pp_No = existPerson.pp_No),
          (entry_Mode = existPerson.entry_Mode),
          (company = existPerson.company),
          (trade = existPerson.trade),
          (final_Status = existPerson.final_Status),
          (flight_Date = existPerson.flight_Date),
          (entry_Mode = existPerson.entry_Mode),
          (visa_Amount_PKR = existPerson.visa_Price_In_PKR);
        (past_Paid_PKR = existPerson.total_In),
          (past_Remain_PKR =
            existPerson.visa_Price_In_PKR - existPerson.total_In),
          (new_Remain_PKR =
            existPerson.visa_Price_In_PKR -
            existPerson.total_In -
            newPaymentIn),
          (visa_Curr_Amount = existPerson.visa_Price_In_Curr),
          (past_Paid_Curr =
            existPerson.visa_Price_In_Curr - existPerson.remaining_Curr),
          (past_Remain_Curr = existPerson.remaining_Curr),
          (new_Remain_Curr = existPerson.remaining_Curr - newCurrAmount),
          (new_Payment = newPaymentIn),
          (new_Curr_Payment = newCurrAmount ? newCurrAmount : 0),
          (existPerson.remaining_Price += -newPaymentIn),
          (existPerson.total_In += newPaymentIn),
          (existPerson.remaining_Curr += newCurrAmount ? -newCurrAmount : 0);
        new_Payment_In += newPaymentIn;
        new_Curr_Amount += newCurrAmount;
        curr_Rate = newPaymentIn / newCurrAmount;

        let myNewPayment = {
          _id: new mongoose.Types.ObjectId(),
          cand_Name,
          pp_No,
          entry_Mode,
          company,
          trade,
          final_Status,
          flight_Date,
          visa_Amount_PKR,
          new_Payment,
          past_Paid_PKR,
          past_Remain_PKR,
          new_Remain_PKR,
          visa_Curr_Amount,
          new_Curr_Payment,
          past_Paid_Curr,
          past_Remain_Curr,
          new_Remain_Curr,
          curr_Rate,
        };
        allPayments.push(myNewPayment);
      }
    }

    const candPayments = {
      category,
      payment_Via,
      payment_Type,
      slip_No,
      payment_In: new_Payment_In,
      curr_Amount: new_Curr_Amount,
      payment_In_Curr: curr_Country,
      slip_Pic: uploadImage?.secure_url || "",
      details,
      date:date?date:new Date().toISOString().split("T")[0],
      invoice: nextInvoiceNumber,
      payments: allPayments,
    };
    await existingSupplier.updateOne({
      $inc: {
        "payment_In_Schema.total_Payment_In": new_Payment_In,
        "payment_In_Schema.remaining_Balance": -new_Payment_In,
        "payment_In_Schema.total_Payment_In_Curr": new_Curr_Amount
          ? new_Curr_Amount
          : 0,
        "payment_In_Schema.remaining_Curr": new_Curr_Amount
          ? -new_Curr_Amount
          : 0,
      },
      $push: {
        "payment_In_Schema.candPayments": candPayments,
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
      cashInHandUpdate.$inc.cash = new_Payment_In;
      cashInHandUpdate.$inc.total_Cash = new_Payment_In;
    } else {
      cashInHandUpdate.$inc.bank_Cash = new_Payment_In;
      cashInHandUpdate.$inc.total_Cash = new_Payment_In;
    }

    await CashInHand.updateOne({}, cashInHandUpdate);

    const newNotification = new Notifications({
      type: "Azad Supplier Cand-Wise Payment In",
      content: `${user.userName} added Candidate Wise Payment_In: ${new_Payment_In} to ${payments.length} Candidates of Azad Supplier:${supplierName}`,
      date: new Date().toISOString().split("T")[0],
    });
    await newNotification.save();

    await existingSupplier.save();
    res.status(200).json({
      message: `Payment In: ${new_Payment_In} added Successfully for to ${payments.length} Candidates to Azad Supplier:${supplierName}'s Record`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deleting a CandWise Payment IN
const deleteCandVisePaymentIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { supplierName, paymentId } = req.body;
    const existingSupplier = await AzadSuppliers.findOne({
      "payment_In_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      res.status(404).json({
        message: "Azad Supplier not Found",
      });
      return;
    }

    const paymentToDelete =
      existingSupplier.payment_In_Schema.candPayments.find(
        (p) => p._id.toString() === paymentId.toString()
      );

    if (!paymentToDelete) {
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if (paymentToDelete) {
      const allPayments = paymentToDelete.payments;
      const allPersons = existingSupplier.payment_In_Schema.persons;
      for (const payment of allPayments) {
        for (const person of allPersons) {
          if (payment.cand_Name.toLowerCase() === person.name.toLowerCase()) {
            person.total_In -= payment.new_Payment;
            person.remaining_Price += payment.new_Payment;
            person.remaining_Curr += payment.new_Curr_Payment;
          }
        }
      }
      await existingSupplier.updateOne({
        $inc: {
          "payment_In_Schema.total_Payment_In": -paymentToDelete.payment_In,
          "payment_In_Schema.remaining_Balance": paymentToDelete.payment_In,
          "payment_In_Schema.total_Payment_In_Curr": paymentToDelete.curr_Amount
            ? -paymentToDelete.curr_Amount
            : 0,
          "payment_In_Schema.remaining_Curr": paymentToDelete.curr_Amount
            ? paymentToDelete.curr_Amount
            : 0,
        },
        $pull: {
          "payment_In_Schema.candPayments": { _id: paymentId },
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
      if (paymentToDelete.payment_Via.toLowerCase() === "cash") {
        cashInHandUpdate.$inc.cash = -paymentToDelete.payment_In;
        cashInHandUpdate.$inc.total_Cash = -paymentToDelete.payment_In;
      } else {
        cashInHandUpdate.$inc.bank_Cash = -paymentToDelete.payment_In;
        cashInHandUpdate.$inc.total_Cash = -paymentToDelete.payment_In;
      }

      await CashInHand.updateOne({}, cashInHandUpdate);
      await existingSupplier.save();
      const newNotification = new Notifications({
        type: "Azad Suppliers Cand-Wise Payment In Deleted",
        content: `${user.userName} deleted Cand-Wise Payment_In: ${paymentToDelete.payment_In} of ${paymentToDelete.payments.length} Candidates from  Suppliers: ${supplierName}'s Record`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();

      res.status(200).json({
        message: `Payment In with ID ${paymentId} deleted successfully of ${paymentToDelete.payments.length} Candidates from  Suppliers: ${supplierName}'s Record`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Cand-Wise Payment In
const updateCandVisePaymentIn = async (req, res) => {
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
  } = req.body;

  const existingSupplier = await AzadSuppliers.findOne({
    "payment_In_Schema.supplierName": supplierName,
  });
  if (!existingSupplier) {
    res.status(404).json({ message: "Azad Supplier not found" });
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
    });
  }

  paymentToUpdate.category = category;
  paymentToUpdate.payment_Via = payment_Via;
  paymentToUpdate.payment_Type = payment_Type;
  paymentToUpdate.slip_No = slip_No;
  paymentToUpdate.details = details;
  if (slip_Pic && uploadImage) {
    paymentToUpdate.slip_Pic = uploadImage.secure_url;
  }
  paymentToUpdate.payment_In_Curr = curr_Country;
  paymentToUpdate.date = date;
  // Save the updated supplier

  await existingSupplier.save();
  res.status(200).json({
    message: "Payment details updated successfully",
  });
};

// Deleting a Single CandWise Payment IN
const deleteSingleCandVisePaymentIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { supplierName, paymentId, myPaymentId } = req.body;
    const existingSupplier = await AzadSuppliers.findOne({
      "payment_In_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      res.status(404).json({
        message: "Azad Supplier not Found",
      });
      return;
    }

    const paymentToFind = existingSupplier.payment_In_Schema.candPayments.find(
      (p) => p._id.toString() === paymentId.toString()
    );

    if (!paymentToFind) {
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if (paymentToFind) {
      const allPersons = existingSupplier.payment_In_Schema.persons;
      const candPayment = paymentToFind.payments.find(
        (p) => p._id.toString() === myPaymentId.toString()
      );
      if (!candPayment) {
        res.status(404).json({
          message: "Candidate Payment not Found",
        });
      }
      if (candPayment) {
        const personToUpdate = allPersons.find(
          (p) => p.name.toString() === candPayment.cand_Name.toString()
        );
        if (personToUpdate) {
          personToUpdate.total_In -= candPayment.new_Payment;
          personToUpdate.remaining_Price += candPayment.new_Payment;
          personToUpdate.remaining_Curr += candPayment.new_Curr_Payment;
        }
        paymentToFind.payment_In -= candPayment.new_Payment;
        paymentToFind.curr_Amount -= candPayment.new_Curr_Payment;
        await existingSupplier.updateOne({
          $inc: {
            "payment_In_Schema.total_Payment_In": -candPayment.new_Payment,
            "payment_In_Schema.remaining_Balance": candPayment.new_Payment,
            "payment_In_Schema.total_Payment_In_Curr":
              candPayment.new_Curr_Payment ? -candPayment.new_Curr_Payment : 0,
            "payment_In_Schema.remaining_Curr": candPayment.new_Curr_Payment
              ? candPayment.new_Curr_Payment
              : 0,
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
        if (paymentToFind.payment_Via.toLowerCase() === "cash") {
          cashInHandUpdate.$inc.cash = -candPayment.new_Payment;
          cashInHandUpdate.$inc.total_Cash = -candPayment.new_Payment;
        } else {
          cashInHandUpdate.$inc.bank_Cash = -candPayment.new_Payment;
          cashInHandUpdate.$inc.total_Cash = -candPayment.new_Payment;
        }

        await CashInHand.updateOne({}, cashInHandUpdate);
        const newNotification = new Notifications({
          type: "Azad Supplier Cand-Wise Payment In Deleted",
          content: `${user.userName} deleted Cand-Wise Payment_In: ${candPayment.new_Payment} of Candidate ${candPayment.cand_Name} from  Azad Supplier:${supplierName}'s Record`,
          date: new Date().toISOString().split("T")[0],
        });
        await newNotification.save();
        const candPaymentToDelete = paymentToFind.payments.filter(
          (p) => p._id.toString() !== myPaymentId.toString()
        );
        await existingSupplier.save();
        if (candPaymentToDelete.length === 0) {
          await existingSupplier.updateOne({
            $pull: {
              "payment_In_Schema.candPayments": { _id: paymentId },
            },
          });
          await existingSupplier.save();
        } else {
          // Otherwise, save changes
          await existingSupplier.save();
        }

        res.status(200).json({
          message: `Successfuly, deleted Cand-Wise Payment_In: ${candPayment.new_Payment} of Candidate ${candPayment.cand_Name} from  Azad Supplier:${supplierName}'s Record`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deleting a Single CandWise Payment IN
const updateSingleCandVisePaymentIn = async (req, res) => {
  try {
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
      new_Payment,
      new_Curr_Payment,
    } = req.body;
    const existingSupplier = await AzadSuppliers.findOne({
      "payment_In_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      res.status(404).json({
        message: "Azad Supplier not Found",
      });
      return;
    }

    const paymentToFind = existingSupplier.payment_In_Schema.candPayments.find(
      (p) => p._id.toString() === paymentId.toString()
    );

    if (!paymentToFind) {
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if (paymentToFind) {
      const allPersons = existingSupplier.payment_In_Schema.persons;
      const candPayment = paymentToFind.payments.find(
        (p) => p._id.toString() === myPaymentId.toString()
      );
      if (!candPayment) {
        res.status(404).json({
          message: "Candidate Payment not Found",
        });
      }
      if (candPayment) {
        const newPaymentIn = parseInt(new_Payment, 10);
        const newCurrAmount = parseInt(new_Curr_Payment, 10);
        const updatedPaymentIn = candPayment.new_Payment - newPaymentIn;
        const updateCurr_Amount = candPayment.new_Curr_Payment - newCurrAmount;

        // Updating The Cand payment

        candPayment.new_Remain_PKR += updatedPaymentIn;
        candPayment.new_Payment += -updatedPaymentIn;
        candPayment.new_Remain_Curr += updateCurr_Amount;
        candPayment.new_Curr_Payment += -updateCurr_Amount;
        candPayment.curr_Rate = updatedPaymentIn / updateCurr_Amount;

        // updating Person total_In and remainig pkr and curr as well
        const personToUpdate = allPersons.find(
          (p) => p.name.toString() === candPayment.cand_Name.toString()
        );
        if (personToUpdate) {
          personToUpdate.total_In += -updatedPaymentIn;
          personToUpdate.remaining_Price += -updatedPaymentIn;
          personToUpdate.remaining_Curr += -newCurrAmount;
        }

        // uodating parent payment
        paymentToFind.payment_In += -updatedPaymentIn;
        paymentToFind.curr_Amount += -updateCurr_Amount;
        await existingSupplier.updateOne({
          $inc: {
            "payment_In_Schema.total_Payment_In": -updatedPaymentIn,
            "payment_In_Schema.remaining_Balance": updatedPaymentIn,
            "payment_In_Schema.total_Payment_In_Curr": updateCurr_Amount
              ? -updateCurr_Amount
              : 0,
            "payment_In_Schema.remaining_Curr": updateCurr_Amount
              ? -updateCurr_Amount
              : 0,
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
        if (paymentToFind.payment_Via.toLowerCase() === "cash") {
          cashInHandUpdate.$inc.cash = -updatedPaymentIn;
          cashInHandUpdate.$inc.total_Cash = -updatedPaymentIn;
        } else {
          cashInHandUpdate.$inc.bank_Cash = -updatedPaymentIn;
          cashInHandUpdate.$inc.total_Cash = -updatedPaymentIn;
        }

        await CashInHand.updateOne({}, cashInHandUpdate);
        const newNotification = new Notifications({
          type: "Azad Supplier Cand-Wise Payment In Updated",
          content: `${user.userName} updated Cand-Wise Payment_In ${new_Payment} of Candidate ${candPayment.cand_Name} of Azad Supplier:${supplierName}'s Record`,
          date: new Date().toISOString().split("T")[0],
        });
        await newNotification.save();
        await existingSupplier.save();

        res.status(200).json({
          message: `Successfuly, updated Cand-Wise Payment_In ${new_Payment} of Candidate ${candPayment.cand_Name} of Azad Supplier: ${supplierName}'s Record`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Candidate Wise Payments Out
const addCandVisePaymentOut = async (req, res) => {
  try {
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
      payments,
    } = req.body;

    let allPayments = [];
    let new_Payment_Out = 0;
    let new_Curr_Amount = 0;

    const existingSupplier = await AzadSuppliers.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      res.status(404).json({
        message: "Azad Supplier not Found",
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

    for (const payment of payments) {
      const { cand_Name, payment_Out, curr_Amount } = payment;
      const newPaymentOut = parseInt(payment_Out, 10);
      const newCurrAmount = parseInt(curr_Amount, 10);

      const existPerson = existingSupplier.payment_Out_Schema.persons.find(
        (person) => person.name.toLowerCase() === cand_Name.toLowerCase()
      );

      if (existPerson) {
        let cand_Name,
          pp_No,
          entry_Mode,
          company,
          trade,
          final_Status,
          flight_Date,
          visa_Amount_PKR,
          new_Payment,
          past_Paid_PKR,
          past_Remain_PKR,
          new_Remain_PKR,
          visa_Curr_Amount,
          new_Curr_Payment,
          past_Paid_Curr,
          past_Remain_Curr,
          new_Remain_Curr,
          curr_Rate;
        (cand_Name = existPerson.name),
          (past_Paid_PKR = existPerson.total_In),
          (pp_No = existPerson.pp_No),
          (entry_Mode = existPerson.entry_Mode),
          (company = existPerson.company),
          (trade = existPerson.trade),
          (final_Status = existPerson.final_Status),
          (flight_Date = existPerson.flight_Date),
          (entry_Mode = existPerson.entry_Mode),
          (visa_Amount_PKR = existPerson.visa_Price_Out_PKR);
        (past_Paid_PKR = existPerson.total_In),
          (past_Remain_PKR =
            existPerson.visa_Price_Out_PKR - existPerson.total_In),
          (new_Remain_PKR =
            existPerson.visa_Price_Out_PKR -
            existPerson.total_In -
            newPaymentOut),
          (visa_Curr_Amount = existPerson.visa_Price_Out_Curr),
          (past_Paid_Curr =
            existPerson.visa_Price_Out_Curr - existPerson.remaining_Curr),
          (past_Remain_Curr = existPerson.remaining_Curr),
          (new_Remain_Curr = existPerson.remaining_Curr - newCurrAmount),
          (new_Payment = newPaymentOut),
          (new_Curr_Payment = newCurrAmount ? newCurrAmount : 0),
          (existPerson.remaining_Price += -newPaymentOut),
          (existPerson.total_In += newPaymentOut),
          (existPerson.remaining_Curr += newCurrAmount ? -newCurrAmount : 0);
        new_Payment_Out += newPaymentOut;
        new_Curr_Amount += newCurrAmount;
        curr_Rate = newPaymentOut / newCurrAmount;

        let myNewPayment = {
          _id: new mongoose.Types.ObjectId(),
          cand_Name,
          pp_No,
          entry_Mode,
          company,
          trade,
          final_Status,
          flight_Date,
          visa_Amount_PKR,
          new_Payment,
          past_Paid_PKR,
          past_Remain_PKR,
          new_Remain_PKR,
          visa_Curr_Amount,
          new_Curr_Payment,
          past_Paid_Curr,
          past_Remain_Curr,
          new_Remain_Curr,
          curr_Rate,
        };
        allPayments.push(myNewPayment);
      }
    }

    const candPayments = {
      category,
      payment_Via,
      payment_Type,
      slip_No,
      payment_Out: new_Payment_Out,
      curr_Amount: new_Curr_Amount,
      payment_Out_Curr: curr_Country,
      slip_Pic: uploadImage?.secure_url || "",
      details,
      date:date?date:new Date().toISOString().split("T")[0],
      invoice: nextInvoiceNumber,
      payments: allPayments,
    };
    await existingSupplier.updateOne({
      $inc: {
        "payment_Out_Schema.total_Payment_Out": new_Payment_Out,
        "payment_Out_Schema.remaining_Balance": -new_Payment_Out,
        "payment_Out_Schema.total_Payment_Out_Curr": new_Curr_Amount
          ? new_Curr_Amount
          : 0,
        "payment_Out_Schema.remaining_Curr": new_Curr_Amount
          ? -new_Curr_Amount
          : 0,
      },
      $push: {
        "payment_Out_Schema.candPayments": candPayments,
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
      cashInHandUpdate.$inc.cash = -new_Payment_Out;
      cashInHandUpdate.$inc.total_Cash = -new_Payment_Out;
    } else {
      cashInHandUpdate.$inc.bank_Cash = -new_Payment_Out;
      cashInHandUpdate.$inc.total_Cash = -new_Payment_Out;
    }

    await CashInHand.updateOne({}, cashInHandUpdate);

    const newNotification = new Notifications({
      type: "Azad Supplier Cand-Wise Payment Out",
      content: `${user.userName} added Candidate Wise Payment_Ou: ${new_Payment_Out} to ${payments.length} Candidates of Azad Supplier:${supplierName}`,
      date: new Date().toISOString().split("T")[0],
    });
    await newNotification.save();

    await existingSupplier.save();
    res.status(200).json({
      message: `Payment Out: ${new_Payment_Out} added Successfully for to ${payments.length} Candidates to Azad Supplier:${supplierName}'s Record`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deleting a CandWise Payment Out
const deleteCandVisePaymentOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { supplierName, paymentId } = req.body;
    const existingSupplier = await AzadSuppliers.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      res.status(404).json({
        message: "Azad Supplier not Found",
      });
      return;
    }

    const paymentToDelete =
      existingSupplier.payment_Out_Schema.candPayments.find(
        (p) => p._id.toString() === paymentId.toString()
      );

    if (!paymentToDelete) {
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if (paymentToDelete) {
      const allPayments = paymentToDelete.payments;
      const allPersons = existingSupplier.payment_Out_Schema.persons;
      for (const payment of allPayments) {
        for (const person of allPersons) {
          if (payment.cand_Name.toLowerCase() === person.name.toLowerCase()) {
            person.total_In -= payment.new_Payment;
            person.remaining_Price += payment.new_Payment;
            person.remaining_Curr += payment.new_Curr_Payment;
          }
        }
      }
      await existingSupplier.updateOne({
        $inc: {
          "payment_Out_Schema.total_Payment_Out": -paymentToDelete.payment_Out,
          "payment_Out_Schema.remaining_Balance": paymentToDelete.payment_Out,
          "payment_Out_Schema.total_Payment_Out_Curr":
            paymentToDelete.curr_Amount ? -paymentToDelete.curr_Amount : 0,
          "payment_Out_Schema.remaining_Curr": paymentToDelete.curr_Amount
            ? paymentToDelete.curr_Amount
            : 0,
        },
        $pull: {
          "payment_Out_Schema.candPayments": { _id: paymentId },
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
      if (paymentToDelete.payment_Via.toLowerCase() === "cash") {
        cashInHandUpdate.$inc.cash = paymentToDelete.payment_Out;
        cashInHandUpdate.$inc.total_Cash = paymentToDelete.payment_Out;
      } else {
        cashInHandUpdate.$inc.bank_Cash = paymentToDelete.payment_Out;
        cashInHandUpdate.$inc.total_Cash = paymentToDelete.payment_Out;
      }

      await CashInHand.updateOne({}, cashInHandUpdate);
      await existingSupplier.save();
      const newNotification = new Notifications({
        type: "Azad Supplier Cand-Wise Payment Out Deleted",
        content: `${user.userName} deleted Cand-Wise Payment_Out: ${paymentToDelete.payment_Out} of ${paymentToDelete.payments.length} Candidates from  Azad Supplier:${supplierName}'s Record`,
        date: new Date().toISOString().split("T")[0],
      });
      await newNotification.save();

      res.status(200).json({
        message: `Payment Out with ID ${paymentId} deleted successfully of ${paymentToDelete.payments.length} Candidates from  Azad Supplier:${supplierName}'s Record`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Cand-Wise Payment Out
const updateCandVisePaymentOut = async (req, res) => {
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
  } = req.body;

  const existingSupplier = await AzadSuppliers.findOne({
    "payment_Out_Schema.supplierName": supplierName,
  });
  if (!existingSupplier) {
    res.status(404).json({ message: "Azad Supplier not found" });
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
    });
  }

  paymentToUpdate.category = category;
  paymentToUpdate.payment_Via = payment_Via;
  paymentToUpdate.payment_Type = payment_Type;
  paymentToUpdate.slip_No = slip_No;
  paymentToUpdate.details = details;
  if (slip_Pic && uploadImage) {
    paymentToUpdate.slip_Pic = uploadImage.secure_url;
  }
  paymentToUpdate.payment_Out_Curr = curr_Country;
  paymentToUpdate.date = date;
  // Save the updated supplier

  await existingSupplier.save();
  res.status(200).json({
    message: "Payment details updated successfully",
  });
};

// Deleting a Single CandWise Payment Out
const deleteSingleCandVisePaymentOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { supplierName, paymentId, myPaymentId } = req.body;
    const existingSupplier = await AzadSuppliers.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      res.status(404).json({
        message: "Azad Supplier not Found",
      });
      return;
    }

    const paymentToFind = existingSupplier.payment_Out_Schema.candPayments.find(
      (p) => p._id.toString() === paymentId.toString()
    );

    if (!paymentToFind) {
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if (paymentToFind) {
      const allPersons = existingSupplier.payment_Out_Schema.persons;
      const candPayment = paymentToFind.payments.find(
        (p) => p._id.toString() === myPaymentId.toString()
      );
      if (!candPayment) {
        res.status(404).json({
          message: "Candidate Payment not Found",
        });
      }
      if (candPayment) {
        const personToUpdate = allPersons.find(
          (p) => p.name.toString() === candPayment.cand_Name.toString()
        );
        if (personToUpdate) {
          personToUpdate.total_In -= candPayment.new_Payment;
          personToUpdate.remaining_Price += candPayment.new_Payment;
          personToUpdate.remaining_Curr += candPayment.new_Curr_Payment;
        }
        paymentToFind.payment_Out -= candPayment.new_Payment;
        paymentToFind.curr_Amount -= candPayment.new_Curr_Payment;
        await existingSupplier.updateOne({
          $inc: {
            "payment_Out_Schema.total_Payment_Out": -candPayment.new_Payment,
            "payment_Out_Schema.remaining_Balance": candPayment.new_Payment,
            "payment_Out_Schema.total_Payment_Out_Curr":
              candPayment.new_Curr_Payment ? -candPayment.new_Curr_Payment : 0,
            "payment_Out_Schema.remaining_Curr": candPayment.new_Curr_Payment
              ? candPayment.new_Curr_Payment
              : 0,
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
        if (paymentToFind.payment_Via.toLowerCase() === "cash") {
          cashInHandUpdate.$inc.cash = candPayment.new_Payment;
          cashInHandUpdate.$inc.total_Cash = candPayment.new_Payment;
        } else {
          cashInHandUpdate.$inc.bank_Cash = candPayment.new_Payment;
          cashInHandUpdate.$inc.total_Cash = candPayment.new_Payment;
        }

        await CashInHand.updateOne({}, cashInHandUpdate);
        const newNotification = new Notifications({
          type: "Azad Supplier Cand-Wise Payment Out Deleted",
          content: `${user.userName} deleted Cand-Wise Payment_Out: ${candPayment.new_Payment} of Candidate ${candPayment.cand_Name} from  Azad Supplier:${supplierName}'s Record`,
          date: new Date().toISOString().split("T")[0],
        });
        await newNotification.save();
        const candPaymentToDelete = paymentToFind.payments.filter(
          (p) => p._id.toString() !== myPaymentId.toString()
        );
        await existingSupplier.save();
        if (candPaymentToDelete.length === 0) {
          await existingSupplier.updateOne({
            $pull: {
              "payment_Out_Schema.candPayments": { _id: paymentId },
            },
          });
          await existingSupplier.save();
        } else {
          // Otherwise, save changes
          await existingSupplier.save();
        }

        res.status(200).json({
          message: `Successfuly, deleted Cand-Wise Payment_Out: ${candPayment.new_Payment} of Candidate ${candPayment.cand_Name} from  Azad Supplier:${supplierName}'s Record`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deleting a Single CandWise Payment Out
const updateSingleCandVisePaymentOut = async (req, res) => {
  try {
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
      new_Payment,
      new_Curr_Payment,
    } = req.body;
    const existingSupplier = await AzadSuppliers.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    });

    if (!existingSupplier) {
      res.status(404).json({
        message: "Azad Supplier not Found",
      });
      return;
    }

    const paymentToFind = existingSupplier.payment_Out_Schema.candPayments.find(
      (p) => p._id.toString() === paymentId.toString()
    );

    if (!paymentToFind) {
      res.status(404).json({
        message: "Payment not Found",
      });
    }

    if (paymentToFind) {
      const allPersons = existingSupplier.payment_Out_Schema.persons;
      const candPayment = paymentToFind.payments.find(
        (p) => p._id.toString() === myPaymentId.toString()
      );
      if (!candPayment) {
        res.status(404).json({
          message: "Candidate Payment not Found",
        });
      }
      if (candPayment) {
        const newPaymentOut = parseInt(new_Payment, 10);
        const newCurrAmount = parseInt(new_Curr_Payment, 10);
        const updatedPaymentOut = candPayment.new_Payment - newPaymentOut;
        const updateCurr_Amount = candPayment.new_Curr_Payment - newCurrAmount;

        // Updating The Cand payment

        candPayment.new_Remain_PKR += updatedPaymentOut;
        candPayment.new_Payment -= updatedPaymentOut;
        candPayment.new_Remain_Curr += updateCurr_Amount;
        candPayment.new_Curr_Payment += -updateCurr_Amount;

        // updating Person total_In and remainig pkr and curr as well
        const personToUpdate = allPersons.find(
          (p) => p.name.toString() === candPayment.cand_Name.toString()
        );
        if (personToUpdate) {
          personToUpdate.total_In += -updatedPaymentOut;
          personToUpdate.remaining_Price += -updatedPaymentOut;
          personToUpdate.remaining_Curr += -newCurrAmount;
        }

        // uodating parent payment
        paymentToFind.payment_Out += -updatedPaymentOut;
        paymentToFind.curr_Amount += -updateCurr_Amount;
        await existingSupplier.updateOne({
          $inc: {
            "payment_Out_Schema.total_Payment_Out": -updatedPaymentOut,
            "payment_Out_Schema.remaining_Balance": updatedPaymentOut,
            "payment_Out_Schema.total_Payment_Out_Curr": updateCurr_Amount
              ? -updateCurr_Amount
              : 0,
            "payment_Out_Schema.remaining_Curr": updateCurr_Amount
              ? -updateCurr_Amount
              : 0,
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
        if (paymentToFind.payment_Via.toLowerCase() === "cash") {
          cashInHandUpdate.$inc.cash = -updatedPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -updatedPaymentOut;
        } else {
          cashInHandUpdate.$inc.bank_Cash = -updatedPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -updatedPaymentOut;
        }

        await CashInHand.updateOne({}, cashInHandUpdate);
        const newNotification = new Notifications({
          type: "Azad Supplier Cand-Wise Payment Out Updated",
          content: `${user.userName} updated Cand-Wise Payment_Out: ${new_Payment} of Candidate ${candPayment.cand_Name} of Azad Supplier:${supplierName}'s Record`,
          date: new Date().toISOString().split("T")[0],
        });
        await newNotification.save();
        await existingSupplier.save();

        res.status(200).json({
          message: `Successfuly, updated Cand-Wise Payment_Out ${new_Payment} of Candidate ${candPayment.cand_Name} of Azad Supplier:${supplierName}'s Record`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addAzadSupplierPaymentIn,
  addAzadSupplierMultiplePaymentsIn,
  addAzadSupplierPaymentInReturn,
  deleteSingleAzadSupplierPaymentIn,
  updateSingleAzadSupplierPaymentIn,
  deleteAzadSupplierPaymentInPerson,
  updateSupPaymentInPerson,
  deleteAzadSupplierPaymentInSchema,
  getAllAzadSupplierPaymentsIn,
  addAzadSupplierPaymentOut,
  addAzadSupplierMultiplePaymentsOut,
  addAzadSupplierPaymentOutReturn,
  deleteAzadSupplierSinglePaymentOut,
  updateAzadSupplierSinglePaymentOut,
  deleteAzadSupplierPaymentOutPerson,
  updateSupPaymentOutPerson,
  deleteAzadSupplierPaymentOutSchema,
  getAllAzadSupplierPaymentsOut,
  changeSupplierPaymentInStatus,
  changeSupplierPaymentOutStatus,
  addCandVisePaymentIn,
  deleteCandVisePaymentIn,
  deleteSingleCandVisePaymentIn,
  updateSingleCandVisePaymentIn,
  addCandVisePaymentOut,
  deleteCandVisePaymentOut,
  deleteSingleCandVisePaymentOut,
  updateSingleCandVisePaymentOut,
  updateCandVisePaymentIn,
  updateCandVisePaymentOut,
};
