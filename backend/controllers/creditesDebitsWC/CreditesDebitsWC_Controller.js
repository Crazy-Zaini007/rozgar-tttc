const CDWC = require('../../database/creditsDebitsWC/CDWCSchema')
const cloudinary = require('../cloudinary')
const User = require('../../database/userdb/UserSchema')
const InvoiceNumber = require('../../database/invoiceNumber/InvoiceNumberSchema')
const CashInHand = require('../../database/cashInHand/CashInHandSchema')
const Notifications=require('../../database/notifications/NotifyModel.js')
const RecycleBin=require('../../database/recyclebin/RecycleBinModel.js')

const PaymentVia=require('../../database/setting/Paymeny_Via_Schema.js')
const PaymentType=require('../../database/setting/Payment_Type_Schema.js')
const Categories=require('../../database/setting/Category_Schema.js')
const mongoose = require('mongoose')
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
        } = req.body;

        let uploadImage;
        if(slip_Pic){
             uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                upload_preset: 'rozgar'
            });
        }


const newPaymentIn=Number(payment_In)
const newPaymentOut=Number(payment_Out)

        // Check if the supplier already exists
        const existingSupplier = await CDWC.findOne({
            'payment_In_Schema.supplierName': supplierName,
            'payment_In_Schema.status': 'Open'

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
                date:date?date:new Date().toISOString().split("T")[0],
                curr_Country,
                curr_Rate,
                invoice: nextInvoiceNumber,
                curr_Amount,
            });
            existingSupplier.payment_In_Schema.total_Payment_In += newPaymentIn ? newPaymentIn : 0;
            existingSupplier.payment_In_Schema.total_Payment_Out += newPaymentOut ? newPaymentOut : 0;
            existingSupplier.payment_In_Schema.balance += newPaymentIn ? newPaymentIn : -newPaymentOut;
           
            const cashInHandDoc = await CashInHand.findOne({});
            if (!cashInHandDoc) {
                const newCashInHandDoc = new CashInHand();
                await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
                $inc: {}
            };

            if (payment_Via.toLowerCase() === "cash") {
                cashInHandUpdate.$inc.cash = newPaymentIn ? newPaymentIn : -newPaymentOut
                cashInHandUpdate.$inc.total_Cash = newPaymentIn ? newPaymentIn : -newPaymentOut
            }
            else  {
                cashInHandUpdate.$inc.bank_Cash = newPaymentIn ? newPaymentIn : -newPaymentOut
                cashInHandUpdate.$inc.total_Cash = newPaymentIn ? newPaymentIn : -newPaymentOut
            } 

            await CashInHand.updateOne({}, cashInHandUpdate);

            const newNotification=new Notifications({
                type:`CDWC Payment ${payment_In? "In":"Out"}`,
                content:`${user.userName} added ${payment_In? "Payment_In":"Payment_Out"}: ${payment_In?payment_In :payment_Out} of CDWC Supplier: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()

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
            )
            if (updatedInvoiceNumber) {
                nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
            }

            // If the supplier does not exist, create a new entry
            const newSupplierEntry = new CDWC({
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
                        date:date?date:new Date().toISOString().split("T")[0],
                        curr_Country,
                        slip_Pic : uploadImage?.secure_url??'',
                        curr_Rate,
                        curr_Amount,
                        invoice: nextInvoiceNumber
                    }],
                    total_Payment_In: payment_In,
                    status: 'Open',
                    total_Payment_Out: payment_Out,
                    balance: payment_In ? payment_In : -payment_Out
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
             if (payment_Via.toLowerCase() === "cash") {
                cashInHandUpdate.$inc.cash = payment_In ? payment_In : -payment_Out
                cashInHandUpdate.$inc.total_Cash = payment_In ? payment_In : -payment_Out
            }
            else {
                cashInHandUpdate.$inc.bank_Cash = payment_In ? payment_In : -payment_Out
                cashInHandUpdate.$inc.total_Cash = payment_In ? payment_In : -payment_Out
            } 
            await CashInHand.updateOne({}, cashInHandUpdate);
            const newNotification=new Notifications({
                type:`CDWC Payment ${payment_In? "In":"Out"}`,
                content:`${user.userName} added ${payment_In? "Payment_In":"Payment_Out"}: ${payment_In?payment_In :payment_Out} of CDWC Supplier: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()
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
    const multiplePayment = req.body;
    let updatedPayments = [];
    let unsavedPayments= [];

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
       
    } = payment
    const newPaymentIn=Number(payment_In)
    const newPaymentOut=Number(payment_Out)
      

        const agents=await CDWC.find({})
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

       for (const agent of agents){
        if(agent.payment_In_Schema){
          if(agent.payment_In_Schema.supplierName.toLowerCase()===supplierName.toLowerCase() && agent.payment_In_Schema.status.toLowerCase()==='open' ){
            existingSupplier = agent;
            break
          }
        }
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

            // If the supplier exists, update the existing entry
            existingSupplier.payment_In_Schema.payment.push({
                category,
                payment_Via,
                payment_Type,
                slip_No,
                payment_In,
                payment_Out,
                details,
                date:date?date:new Date().toISOString().split("T")[0],
                curr_Country,
                curr_Rate,
                invoice: nextInvoiceNumber,
                curr_Amount,
            });
            existingSupplier.payment_In_Schema.total_Payment_In += newPaymentIn ? newPaymentIn : 0;
            existingSupplier.payment_In_Schema.total_Payment_Out += newPaymentOut ? newPaymentOut : 0;
            existingSupplier.payment_In_Schema.balance += newPaymentIn ? newPaymentIn : -newPaymentOut;

            updatedPayments.push(payment);

            const cashInHandDoc = await CashInHand.findOne({});
            if (!cashInHandDoc) {
                const newCashInHandDoc = new CashInHand();
                await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
                $inc: {}
            };
            if (payment_Via.toLowerCase() === "cash") {
                cashInHandUpdate.$inc.cash = newPaymentIn ? newPaymentIn : -newPaymentOut
                cashInHandUpdate.$inc.total_Cash = newPaymentIn ? newPaymentIn : -newPaymentOut
            }
            else {
                cashInHandUpdate.$inc.bank_Cash = newPaymentIn ? newPaymentIn : -newPaymentOut
                cashInHandUpdate.$inc.total_Cash = newPaymentIn ? newPaymentIn : -newPaymentOut
            } 

            await CashInHand.updateOne({}, cashInHandUpdate);

            const newNotification=new Notifications({
                type:`CDWC Payment ${payment_In? "In":"Out"}`,
                content:`${user.userName} added ${payment_In? "Payment_In":"Payment_Out"}: ${payment_In?payment_In :payment_Out} of CDWC Supplier: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()

            await existingSupplier.save();

        }

}
        
      } catch (error) {
        console.error(err);
        res.status(500).json({ message:error.message});
      }
      res.status(200).json({ 
        data:unsavedPayments,
        message: `${updatedPayments.length} Payments In added Successfully` });
       

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

        const { paymentId,newStatus, payment_In, payment_Out, payment_Via, supplierName } = req.body

        const existingSupplier = await CDWC.findOne({ 
            'payment_In_Schema.supplierName': supplierName ,
            'payment_In_Schema._id': newStatus ,

        })
        if (!existingSupplier) {
            res.status(404).json({
                message: "Supplier not Found"
            });
        }
        const newPayment = payment_In - payment_Out

        try {

            let paymentToDelete=existingSupplier.payment_In_Schema.payment.find((p)=>p._id.toString()===paymentId.toString())
            const newRecycle=new RecycleBin({
              name:supplierName,
              type:"CDWC Payment",
              category:paymentToDelete.category,
              payment_Via:paymentToDelete.payment_Via,
              payment_Type:paymentToDelete.payment_Type,
              slip_No:paymentToDelete.slip_No,
              payment_In:paymentToDelete.payment_In,
              payment_Out:paymentToDelete.payment_Out,
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
                    'payment_In_Schema.total_Payment_In':payment_In? -newPayment:0,
                    'payment_In_Schema.total_Payment_Out': payment_Out?-newPayment:0,
                    'payment_In_Schema.balance': -newPayment,
                },

                $pull: {
                    'payment_In_Schema.payment': { _id: paymentId }

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

            if (payment_Via.toLowerCase() === "cash") {
                cashInHandUpdate.$inc.cash = -newPayment
                cashInHandUpdate.$inc.total_Cash = -newPayment
            }
            else {
                cashInHandUpdate.$inc.bank_Cash = -newPayment
                cashInHandUpdate.$inc.total_Cash = -newPayment
            }   
         

            await CashInHand.updateOne({}, cashInHandUpdate);
            const newNotification=new Notifications({
                type:`CDWC Payment ${payment_In? "In":"Out"} deleted`,
                content:`${user.userName} deleted ${payment_In? "Payment_In":"Payment_Out"}: ${payment_In?payment_In :payment_Out} of CDWC Supplier: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()
            res.status(200).json({ message: `Payment with ID ${paymentId} deleted successfully from ${supplierName}` })


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
            const { supplierName,newStatus, paymentId, category, payment_Via, payment_Type, slip_No, details, payment_In, payment_Out, curr_Country, curr_Rate, curr_Amount, slip_Pic, date } = req.body;


            const existingSupplier = await CDWC.findOne({
                'payment_In_Schema.supplierName': supplierName ,
                'payment_In_Schema._id': newStatus
            

            });
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
            );
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
                const newCashInHandDoc = new CashInHand();
                await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
                $inc: {}
            };
            
            if (payment_Via.toLowerCase() === "cash") {
                cashInHandUpdate.$inc.cash = -newBalance
                cashInHandUpdate.$inc.total_Cash = -newBalance
              
            }
            else {
                cashInHandUpdate.$inc.bank_Cash = -newBalance
                cashInHandUpdate.$inc.total_Cash = -newBalance
            }  
           

            await CashInHand.updateOne({}, cashInHandUpdate);


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

          
            const newNotification=new Notifications({
                type:`CDWC Payment ${payment_In? "In":"Out"} updated`,
                content:`${user.userName} updated ${payment_In? "Payment_In":"Payment_Out"}: ${payment_In?payment_In :payment_Out} of CDWC Supplier: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()
            res.status(200).json({ message: "Payment details updated successfully" });
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
            const { supplierName,newStatus, paymentId, category, payment_Via, payment_Type, slip_No, details, payment_In, payment_Out, curr_Country, curr_Rate, curr_Amount, slip_Pic, date } = req.body;


            const existingSupplier = await CDWC.findOne({
                'payment_In_Schema.supplierName': supplierName ,
                'payment_In_Schema._id': newStatus ,

            });
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
                        'payment_In_Schema.total_Payment_Out': -updatedPaymentOut,
                        'payment_In_Schema.balance': -newBalance,
                    }
                }
            );
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
                const newCashInHandDoc = new CashInHand();
                await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
                $inc: {}
            };

            if (payment_Via.toLowerCase() === "cash") {
                cashInHandUpdate.$inc.cash = -newBalance
                cashInHandUpdate.$inc.total_Cash = -newBalance
            }
            else {
                cashInHandUpdate.$inc.bank_Cash = -newBalance
                cashInHandUpdate.$inc.total_Cash = -newBalance
            }  
          

            await CashInHand.updateOne({}, cashInHandUpdate);


            // Update the payment details
            paymentToUpdate.category = category;
            paymentToUpdate.payment_Via = payment_Via;
            paymentToUpdate.payment_Type = payment_Type;
            paymentToUpdate.slip_No = slip_No;
            paymentToUpdate.details = details;
            paymentToUpdate.payment_In = payment_In;
            paymentToUpdate.payment_Out = payment_Out;
            paymentToUpdate.slip_Pic = uploadImage?.secure_url || "";
            paymentToUpdate.payment_In_Curr = curr_Country;
            paymentToUpdate.curr_Rate = curr_Rate ? curr_Rate : 0;
            paymentToUpdate.curr_Amount = curr_Amount ? curr_Amount : 0;
            paymentToUpdate.date = date;


            // Save the updated supplier

            await existingSupplier.save();
            const newNotification=new Notifications({
                type:`CDWC Payment ${payment_In? "In":"Out"} updated`,
                content:`${user.userName} updated ${payment_In? "Payment_In":"Payment_Out"}: ${payment_In?payment_In :payment_Out} of CDWC Supplier: ${supplierName}`,
                date: new Date().toISOString().split("T")[0]
      
              })
              await newNotification.save()
            
            res.status(200).json({ message: "Payment details updated successfully" });
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
            const { supplierName,newStatus, total_Payment_In, total_Payment_Out } = req.body;

            const newToatlPaymentIn = parseInt(total_Payment_In, 10);
            const newTotalPaymentOut = parseInt(total_Payment_Out, 10);


            const existingSupplier = await CDWC.findOne({
                'payment_In_Schema.supplierName': supplierName ,
                'payment_In_Schema._id': newStatus ,

            });
            if (!existingSupplier) {
                res.status(404).json({ message: "Supplier not found" });
                return;
            }
            // Update the payment details
            const updatedTotalPaymentOut = existingSupplier.payment_In_Schema.total_Payment_Out - newTotalPaymentOut;
            const updatedTotalPaymentIn = existingSupplier.payment_In_Schema.total_Payment_In - newToatlPaymentIn;

            const newBalance = updatedTotalPaymentOut - updatedTotalPaymentIn
            // Update the payment details
            existingSupplier.payment_In_Schema.total_Payment_Out = -updatedTotalPaymentOut;
            existingSupplier.payment_In_Schema.total_Payment_In = -updatedTotalPaymentIn;
            existingSupplier.payment_In_Schema.balance = -newBalance
            // Save the updated supplier
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

            await existingSupplier.save();

            
            res.status(200).json({ message: "Payment In details updated successfully" });
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
        const { supplierId } = req.body

        const existingSupplier = await CDWC.findOne({
            'payment_In_Schema._id': supplierId,

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

          cashInHandUpdate.$inc.total_Cash = -existingSupplier.payment_In_Schema.total_Payment_In,
          cashInHandUpdate.$inc.total_Cash = existingSupplier.payment_In_Schema.total_Payment_Out,

            await CashInHand.updateOne({}, cashInHandUpdate);

        // Delete the payment_In_Schema
        existingSupplier.payment_In_Schema = undefined;


        // Save the updated supplier without payment_In_Schema
        await existingSupplier.save();
        res.status(200).json({
            message: `${supplierName} deleted successfully`
        });
    } catch (error) {
        console.error('Error deleting payment_In_Schema:', error);
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
            const supplierPayments = await CDWC.find({}).sort({ createdAt: -1 });
            const formattedDetails = supplierPayments
                .filter(supplier => supplier.payment_In_Schema) // Filter out entries with empty payment_In_Schema
                .map(supplier => {
                    const paymentInSchema = supplier.payment_In_Schema;
                    return {
                        supplierName: paymentInSchema.supplierName,
                        _id: paymentInSchema._id,
                        total_Payment_In: paymentInSchema.total_Payment_In,
                        total_Payment_Out: paymentInSchema.total_Payment_Out,
                        balance: paymentInSchema.balance,
                        payment: paymentInSchema.payment || [],
                        opening: paymentInSchema.opening,
                        closing: paymentInSchema.closing,
                        status: paymentInSchema.status,
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


// changing Status 
const changePaymentInStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const{supplierName,newStatus,convert}=req.body
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(supplierName,newStatus)
        
        const existingSupplier = await CDWC.findOne({
            "payment_In_Schema.supplierName": supplierName,
            "payment_In_Schema._id": newStatus,
        });
  
        if (!existingSupplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
  
      
        if (existingSupplier.payment_In_Schema.status==="Open") {
          existingSupplier.payment_In_Schema.closing=existingSupplier.payment_In_Schema.balance
         
      }
        // Toggle the status of the payment in schema
        existingSupplier.payment_In_Schema.status = 'Closed';
  
        // Save changes to the database
        await existingSupplier.save();
  
        const newSupplier=new CDWC({
          payment_In_Schema:{
            supplier_Id: new mongoose.Types.ObjectId(),
            supplierName:existingSupplier.payment_In_Schema.supplierName,
            total_Payment_In:0,
            total_Payment_Out:0,
            balance:convert.toLowerCase()==='yes'?(existingSupplier.balance):0,
            closing:0,
            status:'Open',
            opening:convert.toLowerCase()==='yes'?(existingSupplier.payment_In_Schema.balance):0,
            
          }
        })
        await newSupplier.save()
        // Prepare response message based on the updated status
        let responseMessage;
         
            responseMessage = `Khata Closed with ${supplierName} and new Khata created Successfully!`;
            const newNotification=new Notifications({
              type:"Khata Closed of Credit Debits WCH Payment In",
              content:`${user.userName} Closed Khata with Supplier:${supplierName} and new Khata created successfully`,
              date: new Date().toISOString().split("T")[0]
    
            })
            await newNotification.save()
        
  
        return res.status(200).json({ message: responseMessage });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
  }

module.exports = { addPaymentIn,addMultiplePaymentIn, deleteSinglePaymentIn, updateSinglePaymentIn, updateAgentTotalPaymentIn, deleteAgentPaymentInSchema, getAllPaymentsIn, updateSinglePaymentOut,changePaymentInStatus }