const CDWOC = require('../../database/creditsDebitsWOC/CDWOCSchema')
const cloudinary = require('../cloudinary')
const User = require('../../database/userdb/UserSchema')
const InvoiceNumber = require('../../database/invoiceNumber/InvoiceNumberSchema')
const moment = require('moment');

const addPaymentIn = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user || user.role !== "Admin") {
            res.status(403).json({ message: "Only Admin is allowed!" });
            return;
        }

        const {
            supplierName,
            category,
            payment_Via,
            payment_Type,
            slip_No,
            payment_In,
            payment_Out,
            slip_Pic,
            details,
            curr_Country,
            curr_Rate,
            curr_Amount,
            date,
            open,
            close
        } = req.body;

      
        let uploadImage;
        if(slip_Pic){
             uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                upload_preset: 'rozgar'
            });
        }

        // Validate input data here

        // Check if the supplier already exists
        const existingSupplier = await CDWOC.findOne({
            'payment_In_Schema.supplierName': supplierName
        })


        if (existingSupplier) {
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
            // If the supplier exists, update the existing entry
            existingSupplier.payment_In_Schema.payment.push({
                category,
                payment_Via,
                payment_Type,
                slip_No,
                payment_In,
                payment_Out,
                slip_Pic : uploadImage?.secure_url??'',
                details,
                date,
                curr_Country,
                curr_Rate,
                invoice: nextInvoiceNumber,
                curr_Amount,
            });
            existingSupplier.payment_In_Schema.total_Payment_In += payment_In ? payment_In : 0;
            existingSupplier.payment_In_Schema.total_Payment_Out += payment_Out ? payment_Out : 0;
            existingSupplier.payment_In_Schema.balance += payment_In ? payment_In : -payment_Out;
            existingSupplier.payment_In_Schema.open = open;
            existingSupplier.payment_In_Schema.close = close;

            await existingSupplier.save();

            res.status(200).json({
                message: `Payment added to ${supplierName}`
            })
        } else {

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
            // If the supplier does not exist, create a new entry
            const newSupplierEntry = new CDWOC({
                payment_In_Schema: {
                    supplierName,
                    payment: [{
                        category,
                        payment_Via,
                        payment_Type,
                        slip_No,
                        payment_In,
                        payment_Out,
                        details,
                        date,
                        curr_Country,
                        slip_Pic : uploadImage?.secure_url??'',
                        curr_Rate,
                        curr_Amount,
                        invoice: nextInvoiceNumber
                    }],
                    total_Payment_In: payment_In,
                    total_Payment_Out: payment_Out,
                    balance: payment_In ? payment_In : -payment_Out
                }
            })

            await newSupplierEntry.save();

            res.status(200).json({ message: `Payment added to ${supplierName}` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


const addMultiplePaymentIn = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user || user.role !== "Admin") {
            res.status(403).json({ message: "Only Admin is allowed!" });
            return;
        }
    const multiplePayment = req.body.multiplePayment;

    if (!Array.isArray(multiplePayment) || multiplePayment.length === 0) {
        res.status(400).json({ message: "Invalid request payload" });
        return;
      }

      try {

for(const payment of multiplePayment){
    const {
        supplierName,
        category,
        payment_Via,
        payment_Type,
        slip_No,
        payment_In,
        payment_Out,
        details,
        curr_Country,
        curr_Rate,
        curr_Amount,
        date,
        open,
        close
    } = payment


        // Check if the supplier already exists
        const existingSupplier = await CDWOC.findOne({
            'payment_In_Schema.supplierName': supplierName
        })


        if (existingSupplier) {
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

            // If the supplier exists, update the existing entry
            existingSupplier.payment_In_Schema.payment.push({
                category,
                payment_Via,
                payment_Type,
                slip_No,
                payment_In,
                payment_Out,
                details,
                date,
                curr_Country,
                curr_Rate,
                invoice: nextInvoiceNumber,
                curr_Amount,
            });
            existingSupplier.payment_In_Schema.total_Payment_In += payment_In ? payment_In : 0;
            existingSupplier.payment_In_Schema.total_Payment_Out += payment_Out ? payment_Out : 0;
            existingSupplier.payment_In_Schema.balance += payment_In ? payment_In : -payment_Out;
            existingSupplier.payment_In_Schema.open = open;
            existingSupplier.payment_In_Schema.close = close;

            await existingSupplier.save();

        } else {
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
            )
            if (updatedInvoiceNumber) {
                nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
            }

            // If the supplier does not exist, create a new entry
            const newSupplierEntry = new CDWOC({
                payment_In_Schema: {
                    supplierName,
                    payment: [{
                        category,
                        payment_Via,
                        payment_Type,
                        slip_No,
                        payment_In,
                        payment_Out,
                        details,
                        date,
                        curr_Country,
                        curr_Rate,
                        curr_Amount,
                        invoice: nextInvoiceNumber
                    }],
                    total_Payment_In: payment_In,
                    total_Payment_Out: payment_Out,
                    balance: payment_In ? payment_In : -payment_Out
                }
            })

         
            await newSupplierEntry.save();

        }

}
        
      } catch (error) {
        
      }
      res.status(200).json({ message: `${multiplePayment.length} Payments In added Successfully` });
       

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Deleting a single Payment In
const deleteSinglePaymentIn = async (req, res) => {

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

        const { paymentId, payment_In, payment_Out, supplierName } = req.body

        const existingSupplier = await CDWOC.findOne({ 'payment_In_Schema.supplierName': supplierName })
        if (!existingSupplier) {
            res.status(404).json({
                message: "Supplier not Found"
            });
        }
        const newPayment = payment_In - payment_Out

        try {

            // Add this line for logging

            await existingSupplier.updateOne({
                $inc: {
                    'payment_In_Schema.total_Payment_In':payment_In? -newPayment:0,
                    'payment_In_Schema.total_Payment_Out': payment_Out?-newPayment:0,
                    'payment_In_Schema.balance': -newPayment,
                },

                $pull: {
                    'payment_In_Schema.payment': { _id: paymentId }

                }

            });

            res.status(200).json({ message: `Payment In with ID ${paymentId} deleted successfully from ${supplierName}` })


        } catch (error) {
            console.error('Error updating values:', error);
            res.status(500).json({ message: 'Error updating values', error: error.message });
        }


    }
}


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
            const { supplierName, paymentId, category, payment_Via, payment_Type, slip_No, details, payment_In, payment_Out, curr_Country, curr_Rate, curr_Amount, slip_Pic, date } = req.body;
            const existingSupplier = await CDWOC.findOne({ 'payment_In_Schema.supplierName': supplierName });
            if (!existingSupplier) {
                res.status(404).json({ message: "Supplier not found" });
                return;
            }

            // Find the payment within the payment array using paymentId
            const paymentToUpdate = existingSupplier.payment_In_Schema.payment.find(payment => payment._id.toString() === paymentId);

            if (!paymentToUpdate) {
                res.status(404).json({ message: "Payment not found" });
                return;
            }

            const updatedPaymentIn = paymentToUpdate.payment_In - payment_In
            const updatedPaymentOut=paymentToUpdate.payment_Out - payment_Out
            const newBalance = updatedPaymentIn-updatedPaymentOut

            let uploadImage;

            if (slip_Pic) {
                uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                    upload_preset: 'rozgar'
                });
            }

            await existingSupplier.updateOne(
                {
                    $inc: {
                        'payment_In_Schema.total_Payment_In': -updatedPaymentIn,
                        'payment_In_Schema.total_Payment_Out': -updatedPaymentOut,
                        'payment_In_Schema.balance': -newBalance,
                    }
                }
            )
            // Update the payment details
            paymentToUpdate.category = category;
            paymentToUpdate.payment_Via = payment_Via;
            paymentToUpdate.payment_Type = payment_Type;
            paymentToUpdate.slip_No = slip_No;
            paymentToUpdate.details = details;
            paymentToUpdate.payment_In = payment_In?payment_In:0;
            paymentToUpdate.payment_Out = payment_Out?payment_Out:0;
            if(slip_Pic && uploadImage){
                paymentToUpdate.slip_Pic = uploadImage?.secure_url;

            }
            paymentToUpdate.payment_In_Curr = curr_Country;
            paymentToUpdate.curr_Rate = curr_Rate ? curr_Rate : 0;
            paymentToUpdate.curr_Amount = curr_Amount ? curr_Amount : 0;
            paymentToUpdate.date = date;


            // Save the updated supplier

            await existingSupplier.save();

            const updatedSupplier = await CDWOC.findById(existingSupplier._id);
            console.log(updatedSupplier)
            res.status(200).json({ message: "Payment In details updated successfully", data: updatedSupplier });
        } catch (error) {
            console.error('Error updating payment details:', error);
            res.status(500).json({ message: 'Error updating payment details', error: error.message });
        }
    }
};


// Updating a single Payment In Details
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

        try {
            const { supplierName, paymentId, category, payment_Via, payment_Type, slip_No, details, payment_In, payment_Out, curr_Country, curr_Rate, curr_Amount, slip_Pic, date } = req.body;



            const existingSupplier = await CDWOC.findOne({ 'payment_In_Schema.supplierName': supplierName });
            if (!existingSupplier) {
                res.status(404).json({ message: "Supplier not found" });
                return;
            }

            // Find the payment within the payment array using paymentId
            const paymentToUpdate = existingSupplier.payment_In_Schema.payment.find(payment => payment._id.toString() === paymentId);

            if (!paymentToUpdate) {
                res.status(404).json({ message: "Payment not found" });
                return;
            }
            const updatedPaymentOut = paymentToUpdate.payment_Out - payment_Out
            const newBalance = updatedPaymentOut

            let uploadImage;

            if (slip_Pic) {
                uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                    upload_preset: 'rozgar'
                });
            }

            await existingSupplier.updateOne(
                {
                    $inc: {
                        'payment_In_Schema.total_Payment_Out': -newBalance,
                        'payment_In_Schema.balance': newBalance,
                    }
                }
            )
            // Update the payment details
            paymentToUpdate.category = category;
            paymentToUpdate.payment_Via = payment_Via;
            paymentToUpdate.payment_Type = payment_Type;
            paymentToUpdate.slip_No = slip_No;
            paymentToUpdate.details = details;
            paymentToUpdate.payment_In = payment_In;
            paymentToUpdate.payment_Out = payment_Out;
            if(slip_Pic && uploadImage){
                paymentToUpdate.slip_Pic = uploadImage?.secure_url;

            }
            paymentToUpdate.payment_In_Curr = curr_Country;
            paymentToUpdate.curr_Rate = curr_Rate ? curr_Rate : 0;
            paymentToUpdate.curr_Amount = curr_Amount ? curr_Amount : 0;
            paymentToUpdate.date = date;


            // Save the updated supplier

            await existingSupplier.save();

            const updatedSupplier = await CDWOC.findById(existingSupplier._id);
            console.log(updatedSupplier)
            res.status(200).json({ message: "Payment In details updated successfully", data: updatedSupplier });
        } catch (error) {
            console.error('Error updating payment details:', error);
            res.status(500).json({ message: 'Error updating payment details', error: error.message });
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
            const { supplierName, total_Payment_In, total_Payment_Out } = req.body;

            const newToatlPaymentIn = parseInt(total_Payment_In, 10);
            const newTotalPaymentOut = parseInt(total_Payment_Out, 10);


            const existingSupplier = await CDWOC.findOne({ 'payment_In_Schema.supplierName': supplierName });
            if (!existingSupplier) {
                res.status(404).json({ message: "Supplier not found" });
                return;
            }

            // Update the payment details
            const updatedTotalPaymentOut = existingSupplier.payment_In_Schema.total_Payment_Out - newTotalPaymentOut;
            const updatedTotalPaymentIn = existingSupplier.payment_In_Schema.total_Payment_In - newToatlPaymentIn;

            const newBalance = updatedTotalPaymentOut - updatedTotalPaymentIn
            // Update the payment details
            existingSupplier.payment_In_Schema.total_Payment_Out = updatedTotalPaymentOut;
            existingSupplier.payment_In_Schema.total_Payment_In = updatedTotalPaymentIn;
            existingSupplier.payment_In_Schema.balance = newBalance;
            // Save the updated supplier
            await existingSupplier.save();
            res.status(200).json({ message: "Payment details updated successfully", data: updatedSupplier });
        } catch (error) {
            console.error('Error updating payment details:', error);
            res.status(500).json({ message: 'Error updating payment details', error: error.message });
        }
    }
};


//deleting the Agent payment_In_Schema
const deleteAgentPaymentInSchema = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return
    }

    if (user.role !== "Admin") {
        res.status(403).json({ message: "Only Admin is allowed!" });
        return
    }

    try {
        const { supplierName } = req.body;

        const existingSupplier = await CDWOC.findOne({ 'payment_In_Schema.supplierName': supplierName });

        if (!existingSupplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }

        // Delete the payment_In_Schema
        existingSupplier.payment_In_Schema = undefined;

        // Save the updated supplier without payment_In_Schema
        await existingSupplier.save();
        res.status(200).json({
            message: `${supplierName} deleted successfully`
        });
    } catch (error) {
        console.error('Error deleting payment_Schema:', error);
        res.status(500).json({ message: 'Error deleting payment_In_Schema', error: error.message });
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

        if (user && user.role === "Admin") {
            const supplierPayments = await CDWOC.find({}).sort({ createdAt: -1 });
            const formattedDetails = supplierPayments
                .filter(supplier => supplier.payment_In_Schema) // Filter out entries with empty payment_In_Schema
                .map(supplier => {
                    const paymentInSchema = supplier.payment_In_Schema;
                    return {
                        supplierName: paymentInSchema.supplierName,
                        total_Payment_In: paymentInSchema.total_Payment_In,
                        total_Payment_Out: paymentInSchema.total_Payment_Out,
                        balance: paymentInSchema.balance,
                        payment: paymentInSchema.payment || [],
                        open: paymentInSchema.open || false,
                        close: paymentInSchema.close || false,
                        createdAt: moment(paymentInSchema.createdAt).format('YYYY-MM-DD'),
                        updatedAt: moment(paymentInSchema.updatedAt).format('YYYY-MM-DD'),
                    };
                })

            res.status(200).json({ data: formattedDetails });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = { addPaymentIn,addMultiplePaymentIn, deleteSinglePaymentIn, updateSinglePaymentIn, updateSinglePaymentOut, updateAgentTotalPaymentIn, deleteAgentPaymentInSchema, getAllPaymentsIn }