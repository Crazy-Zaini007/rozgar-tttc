const cloudinary = require("../cloudinary");
const User = require("../../database/userdb/UserSchema");
const Protector = require("../../database/protector/ProtectorSchema");
const InvoiceNumber = require("../../database/invoiceNumber/InvoiceNumberSchema");
const CashInHand = require("../../database/cashInHand/CashInHandSchema");
const mongoose = require("mongoose");
const moment = require("moment");

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

        const existingSupplier = await Protector.findOne({
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
         
        };

        try {
         
            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Payment_Out": payment_Out,
                "payment_Out_Schema.remaining_Balance": -payment_Out,
                "payment_Out_Schema.payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,
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
            const updatedSupplier = await Protector.findById(existingSupplier._id);

            res.status(200).json({
              data: updatedSupplier,
              message: `Payment Out: ${payment_Out} added Successfully to ${updatedSupplier.payment_Out_Schema.supplierName}'s Record`,
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

    const multiplePaymentOut = req.body.multiplePaymentOut;

    if (!Array.isArray(multiplePaymentOut) || multiplePaymentOut.length === 0) {
      res.status(400).json({ message: "Invalid request payload" });
      return;
    }

    try {

      const updatedPayments = [];

      for (const payment of multiplePaymentOut) {
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
        const existingSupplier = await Protector.findOne({
          "payment_Out_Schema.supplierName": supplierName,
        });

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
         
        };

        updatedPayments.push(newPayment);

        try {
        
            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Payment_Out": payment_Out,
                "payment_Out_Schema.remaining_Balance": -payment_Out,
                "payment_Out_Schema.payment_Out_Curr": newCurrAmount ? newCurrAmount : 0,
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
            const updatedSupplier = await Protector.findById(existingSupplier._id);


          

        }
        catch (error) {
          console.error("Error updating values:", error);
          res
            .status(500)
            .json({ message: "Error updating values", error: error.message });
        }
      }
      res.status(200).json({
        message: `${multiplePaymentOut.length} Payments Out added Successfully`,
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
      payment_Via,
    } = req.body;


    const existingSupplier = await Protector.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    });
    if (!existingSupplier) {
      res.status(404).json({
        message: "Supplier not Found",
      });
    }

    const newPaymentOut = payment_Out;

    try {
  
      // Update total_Visa_Price_In_PKR and other fields using $inc
      await existingSupplier.updateOne({
        $inc: {
          "payment_Out_Schema.total_Payment_Out": -payment_Out,
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

      if (payment_Via === "Bank") {
        cashInHandUpdate.$inc.bank_Cash = newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = newPaymentOut;

      } else if (payment_Via.toLowerCase() === "cash") {
        cashInHandUpdate.$inc.cash = newPaymentOut;
        cashInHandUpdate.$inc.total_Cash = newPaymentOut;

      }

      await CashInHand.updateOne({}, cashInHandUpdate);
      await existingSupplier.save()

      const updatedSupplier = await Protector.findById(existingSupplier._id);
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
     
    } = req.body;
    const newPaymentOut = parseInt(payment_Out, 10);

    const newCurrAmount = parseInt(curr_Amount, 10);

    try {
      const existingSupplier = await Protector.findOne({
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

      const updatedPaymentOut = paymentToUpdate.payment_Out - payment_Out;
      const updateCurr_Amount = newCurrAmount - paymentToUpdate.curr_Amount;
      const newBalance = updatedPaymentOut;

      let uploadImage;

      if (slip_Pic) {
        uploadImage = await cloudinary.uploader.upload(slip_Pic, {
          upload_preset: "rozgar",
        })
      }
     
     
        
      await existingSupplier.updateOne({
        $inc: {
          "payment_Out_Schema.total_Payment_Out": -updatedPaymentOut,
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
      if (slip_Pic && uploadImage) {
        paymentToUpdate.slip_Pic = uploadImage.secure_url;
      };
      paymentToUpdate.payment_Out_Curr = curr_Country;
      paymentToUpdate.curr_Rate = curr_Rate;
      paymentToUpdate.curr_Amount = curr_Amount;
      paymentToUpdate.date = date;
      // Save the updated supplier
      await existingSupplier.save();

      const updatedSupplier = await Protector.findById(existingSupplier._id);
      await existingSupplier.save();

      res.status(200).json({
        message: "Payment Out details updated successfully",
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
    const { personId, supplierName, protector_Out_PKR, protector_Out_Curr } =
      req.body;
    // console.log(personId, supplierName, visa_Price_Out_PKR);
    const newProtector_Price_Out_PKR = parseInt(protector_Out_PKR, 10);
    const newProtector_Price_Out_Curr = parseInt(protector_Out_Curr, 10);
    const existingSupplier = await Protector.findOne({
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
          "payment_Out_Schema.remaining_Balance": -newProtector_Price_Out_PKR,
          "payment_Out_Schema.total_Protector_Price_Out_PKR": -newProtector_Price_Out_PKR,
          'payment_Out_Schema.total_Protector_Price_Out_Curr': newProtector_Price_Out_Curr ? -newProtector_Price_Out_Curr : 0,
          'payment_Out_Schema.remaining_Curr': newProtector_Price_Out_Curr ? -newProtector_Price_Out_Curr : 0,
        },

        $pull: {
          "payment_Out_Schema.persons": { _id: personId },
        },
      });

      const updatedSupplier = await Protector.findById(existingSupplier._id);
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

    const existingSupplier = await Protector.findOne({
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


    await CashInHand.updateOne({}, cashInHandUpdate);

    // Delete the payment_In_Schema
    existingSupplier.payment_Out_Schema = undefined;

    // Save the updated supplier without payment_In_Schema
    await existingSupplier.save();

    const updatedSupplier = await Protector.findById(existingSupplier._id);
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
      const supplierPayments = await Protector.find({}).sort({ createdAt: -1 });
      const formattedDetails = supplierPayments
        .filter((supplier) => supplier.payment_Out_Schema) // Filter out entries with empty payment_Out_Schema
        .map((supplier) => {
          const paymentOutSchema = supplier.payment_Out_Schema;

          return {
            supplier_Id: paymentOutSchema.supplier_Id,
            supplierName: paymentOutSchema.supplierName,
            total_Protector_Price_Out_Curr: paymentOutSchema.total_Protector_Price_Out_Curr,
            total_Payment_Out_Curr: paymentOutSchema.total_Payment_Out_Curr,
            remaining_Curr: paymentOutSchema.remaining_Curr,
            
            total_Protector_Price_Out_PKR: paymentOutSchema.total_Protector_Price_Out_PKR,
            total_Payment_Out: paymentOutSchema.total_Payment_Out,
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
}
module.exports = {
  addPaymentOut,
  deleteSinglePaymentOut,
  updateSinglePaymentOut,
  addMultiplePaymentsOut,
  deletePaymentOutPerson,
  deleteAgentPaymentOutSchema,
  getAllPaymentsOut
};
