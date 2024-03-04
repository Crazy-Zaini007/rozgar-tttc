const cloudinary = require("../cloudinary");
const User = require("../../database/userdb/UserSchema");
const InvoiceNumber = require("../../database/invoiceNumber/InvoiceNumberSchema");
const CashInHand = require("../../database/cashInHand/CashInHandSchema");
const mongoose = require("mongoose");
const moment = require("moment");

// adding cashin
const addCash = async (req, res) => {

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

    const {
      category,
      payment_Via,
      payment_Type,
      slip_No,
      payment_In,
      payment_Out,
      slip_Pic,
      details,
      date,

    } = req.body;

    let uploadImage;
    if (slip_Pic) {
      uploadImage = await cloudinary.uploader.upload(slip_Pic, {
        upload_preset: "rozgar",
      });
    }
    // Create a new payment object
    const newPayment = {
      category,
      payment_Via,
      payment_Type,
      slip_No,
      payment_In: payment_In ? payment_In : 0,
      payment_Out: payment_Out ? payment_Out : 0,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      date: date,
      invoice: nextInvoiceNumber, // Convert date to a valid Date object
    };


    const cashInHand = await CashInHand.findOneAndUpdate(
      {},
      {
        $push: { payment: newPayment },
        $inc: {
          total_Cash: payment_In ? payment_In : -payment_Out,
          ...(payment_Via.toLowerCase() === 'cash' ? { cash: payment_In ? payment_In : -payment_Out } : { bank_Cash: payment_In ? payment_In : -payment_Out }),
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Cash added successfully", cashInHand });


  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }

}

const getCash = async (req, res) => {

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

    const cashInHand = await CashInHand.findOne().sort({ createdAt: -1 });

    if (!cashInHand) {
      return res.status(404).json({ message: "CashInHand not found" });
    }

    res.status(200).json({ data: cashInHand });

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }

}

const delCash = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "Admin") {
      return res.status(404).json({ message: "Only Admin is allowed!" });
    }

    const { cashId, payment_In, payment_Out, payment_Via } = req.body;
    // Validate if cashId is provided
    if (!cashId) {
      return res.status(400).json({ message: "Cash ID is required for deletion." });
    }
    const myCash = await CashInHand.findOne({})
    const paymentToUpdate = myCash.payment.find((payment) => payment._id.toString() === cashId.toString())
    if (!paymentToUpdate) {
      res.status(404).json({ message: "Cash Id no found" });

    }

    else {
      const cashInHand = await CashInHand.findOneAndUpdate(
        {},
        {
          $pull: { payment: { _id: cashId } }, // Remove the payment with the specified _id
          $inc: {
            total_Cash: payment_In ? -payment_In : payment_Out, // Adjust total_Cash based on the deleted transaction
            ...(payment_Via.toLowerCase() === 'cash' ? { cash: payment_In ? -payment_In : payment_Out } : { bank_Cash: payment_In ? -payment_In : payment_Out }),
          },
        },
        { new: true }
      );

      res.status(200).json({ message: "Cash transaction deleted successfully", cashInHand });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Updating the expense details
const updateCash = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role !== "Admin") {
      return res.status(400).json({ message: 'Only Admin is allowed' });

    }
    if (user && user.role === "Admin") {
      const { cashId, name, category, payment_Via, payment_Type, payment_In, payment_Out, slip_No, slip_Pic, details, date } = req.body

      if (!mongoose.Types.ObjectId.isValid(cashId)) {
        return res.status(400).json({ message: 'Invalid cashId' });
      }

      // Validate if cashId is provided
      if (!cashId) {
        return res.status(400).json({ message: "Cash ID is required for deletion." });
      }
      const myCash = await CashInHand.findOne({})
      const cashToUpdate = myCash.payment.find((payment) => payment._id.toString() === cashId.toString())
      if (!cashToUpdate) {
        res.status(404).json({ message: "Cash Id no found" });

      }

      if (cashToUpdate) {

        const newCashIn = payment_In ? payment_In - cashToUpdate.payment_In : 0;
        const newCashOut = payment_Out ? payment_Out - cashToUpdate.payment_Out : 0;
        let uploadImage;
        if (slip_Pic) {
          uploadImage = await cloudinary.uploader.upload(slip_Pic, {
            upload_preset: "rozgar",
          })
        }

        const cashInHand = await CashInHand.findOneAndUpdate(
          {},
          {
            $inc: {
              total_Cash: newCashIn ? newCashIn : -newCashOut, // Adjust total_Cash based on the deleted transaction
              ...(payment_Via.toLowerCase() === 'cash' ? { cash: newCashIn ? newCashIn : -newCashOut } : { bank_Cash: newCashIn ? newCashIn : -newCashOut }),
            },
          },
          { new: true }
        );

        // Update Expense fields
        cashToUpdate.category = category
        cashToUpdate.payment_Via = payment_Via
        cashToUpdate.payment_Type = payment_Type
        cashToUpdate.payment_In = payment_In
        cashToUpdate.payment_Out = payment_Out
        if (slip_No) {
          cashToUpdate.slip_No = slip_No

        }
        if (details) {
          cashToUpdate.details = details
        }
        if (slip_Pic && uploadImage) {
          cashToUpdate.slip_Pic = uploadImage.secure_url

        };
        if (date) {
          cashToUpdate.date = date

        }
        await myCash.save()

        res.status(200).json({ data: cashToUpdate, message: 'Cash updated successfully' });


      }
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}


module.exports = { addCash, getCash, delCash,updateCash }