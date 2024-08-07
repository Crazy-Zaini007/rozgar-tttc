const cloudinary = require('../cloudinary')
const User = require('../../database/userdb/UserSchema')
const Expenses = require('../../database/expenses/ExpenseSchema')
const InvoiceNumber = require('../../database/invoiceNumber/InvoiceNumberSchema')
const CashInHand = require('../../database/cashInHand/CashInHandSchema')
const RecycleBin=require('../../database/recyclebin/RecycleBinModel.js')

const PaymentVia=require('../../database/setting/Paymeny_Via_Schema.js')
const PaymentType=require('../../database/setting/Payment_Type_Schema.js')
const ExpenseCategories=require('../../database/setting/Expe_Category_Schema.js')

const mongoose = require('mongoose')
//Adding a new Expense
const addExpense = async (req, res) => {

    try {
        const {
            name,
            expCategory,
            payment_Out,
            payment_Via,
            payment_Type,
            slip_No,
            slip_Pic,
            details,
            curr_Country,
            curr_Rate,
            curr_Amount,
            date 
        } = req.body

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }
        if (user) {
           
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
        
            const newExpense = new Expenses({
                name,
                expCategory,
                payment_Out,
                payment_Via,
                payment_Type,
                slip_No,
                slip_Pic: uploadImage?.secure_url || '',
                details,
                curr_Country,
                curr_Rate,
                curr_Amount,
                date:date?date:new Date().toISOString().split("T")[0],
                invoice: nextInvoiceNumber
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
                cashInHandUpdate.$inc.cash = -payment_Out;
                cashInHandUpdate.$inc.total_Cash = -payment_Out;

            } else {
                cashInHandUpdate.$inc.bank_Cash = -payment_Out;
          cashInHandUpdate.$inc.total_Cash = -payment_Out;

            }
            
            await CashInHand.updateOne({}, cashInHandUpdate);
            await newExpense.save()
            res.status(200).json({ data: newExpense, message: `${payment_Out} added Successfully to ${name}` })
        }


    }
    catch (err) {
        res.status(500).json({ message: err.message })

    }

}

// adding multiple Expenses
const addMultipleExpense=async(req,res)=>{

    try {
        const multiplepayment=req.body

        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user && user.role === "Admin") {
            const updatedPayments = [];
            let unsavedPayments= [];

            for(const payment of multiplepayment){
                const {
                    name,
                    expCategory,
                    payment_Out,
                    payment_Via,
                    payment_Type,
                    slip_No,
                    slip_Pic,
                    details,
                    curr_Country,
                    curr_Rate,
                    curr_Amount,
                    date
                } = payment
                   
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
        
                if(expCategory){
                  const allCategories=await ExpenseCategories.find({})
                  const existingCategory=allCategories.find(p=>p.category.trim().toLowerCase()==expCategory.trim().toLowerCase())
                  if(!existingCategory){
                    payment.expenseCategoryError='Expense Category not found in setting'
                    confirmStatus=false
                  }
                }

                if(!confirmStatus){
                    unsavedPayments.push(payment)
                }
                  if(confirmStatus){
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
                
                    const newExpense = new Expenses({
                        name,
                        expCategory,
                        payment_Out,
                        payment_Via,
                        payment_Type,
                        slip_No,
                        slip_Pic: uploadImage?.secure_url || '',
                        details,
                        curr_Country,
                        curr_Rate,
                        curr_Amount,
                        date,
                        invoice: nextInvoiceNumber
                    })
                      updatedPayments.push(newExpense);
        
                    const cashInHandDoc = await CashInHand.findOne({});
        
                    if (!cashInHandDoc) {
                        const newCashInHandDoc = new CashInHand();
                        await newCashInHandDoc.save();
                    }
        
                    const cashInHandUpdate = {
                        $inc: {}
                    };
        
                    if (payment_Via.toLowerCase() === "cash") {
                        cashInHandUpdate.$inc.cash = -payment_Out;
                        cashInHandUpdate.$inc.total_Cash = -payment_Out;
        
                    } else {
                        cashInHandUpdate.$inc.bank_Cash = -payment_Out;
                  cashInHandUpdate.$inc.total_Cash = -payment_Out;
        
                    }
                    
                    await CashInHand.updateOne({}, cashInHandUpdate);
                    await newExpense.save()
                  }

            }
            res.status(200).json({ 
                data:unsavedPayments,
                message: `${updatedPayments.length} Expenses added Successfully` })

        }
        

    }
    catch (err) {
        res.status(500).json({ message: err.message })

    }


} 

// Getting All Expenses
const getExpenses = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }
        if (user) {
            const allExpenses = await Expenses.find({}).sort({ createdAt: -1 })
            res.status(200).json({ data: allExpenses })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

const delExpense = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { expenseId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(expenseId)) {
            return res.status(400).json({ message: 'Invalid Expense ID' });
        }

        const expenseToDelete = await Expenses.findById(expenseId);
        if (!expenseToDelete) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        if (expenseToDelete) {
            const cashInHandDoc = await CashInHand.findOne({});

            if (!cashInHandDoc) {
                const newCashInHandDoc = new CashInHand();
                await newCashInHandDoc.save();
            }

            const cashInHandUpdate = {
                $inc: {}
            };

            if (expenseToDelete.payment_Via.toLowerCase() === "cash") {
                cashInHandUpdate.$inc.cash = expenseToDelete.payment_Out;
                cashInHandUpdate.$inc.total_Cash = expenseToDelete.payment_Out;
            }
            else{
                cashInHandUpdate.$inc.bank_Cash = expenseToDelete.payment_Out;
                cashInHandUpdate.$inc.total_Cash = expenseToDelete.payment_Out;
            }


            await CashInHand.updateOne({}, cashInHandUpdate);

            const newRecycle=new RecycleBin({
                name:expenseToDelete.name,
                type:"Expenses Payment",
                category:expenseToDelete.expCategory,
                payment_Via:expenseToDelete.payment_Via,
                payment_Type:expenseToDelete.payment_Type,
                slip_No:expenseToDelete.slip_No,
                payment_Out:expenseToDelete.payment_Out,
                slip_Pic:expenseToDelete.slip_Pic,
                date:expenseToDelete.date,
                curr_Rate:expenseToDelete.curr_Rate,
                curr_Amount:expenseToDelete.curr_Amount,
                invoice:expenseToDelete.invoice
      
              })
              await newRecycle.save()

            await Expenses.findByIdAndDelete(expenseId)

            res.status(200).json({ data: expenseToDelete, message: `Expense deleted Successfully` });
        }


    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

// Updating the expense details
const updateExpense = async (req, res) => {
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
            const { expenseId, name, expCategory, payment_Out, payment_Via, payment_Type, slip_No, slip_Pic, details, curr_Country, curr_Rate, curr_Amount, date } = req.body

            if (!mongoose.Types.ObjectId.isValid(expenseId)) {
                return res.status(400).json({ message: 'Invalid Expense Id' });
            }

            const expenseToUpdate = await Expenses.findById(expenseId);
            if (!expenseToUpdate) {
                return res.status(404).json({ message: 'Expense not found' });
            }

            if (expenseToUpdate) {
                let uploadImage;

                if (slip_Pic) {
                  uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                    upload_preset: "rozgar",
                  })
                }
                
                    const cashInHandDoc = await CashInHand.findOne({});

                    if (!cashInHandDoc) {
                        const newCashInHandDoc = new CashInHand();
                        await newCashInHandDoc.save();
                    }

                    const cashInHandUpdate = {
                        $inc: {}
                    }

                    const newExpenseAmount = expenseToUpdate.payment_Out - payment_Out
                    console.log(newExpenseAmount)

                    if (expenseToUpdate.payment_Via.toLowerCase() === "cash") {
                        cashInHandUpdate.$inc.cash = newExpenseAmount;
                        cashInHandUpdate.$inc.total_Cash = newExpenseAmount;
                        
                    } else  {
                        cashInHandUpdate.$inc.bank_Cash = newExpenseAmount;
                         cashInHandUpdate.$inc.total_Cash = newExpenseAmount;
                    }

                    await CashInHand.updateOne({}, cashInHandUpdate);


                    // Update Expense fields
                    expenseToUpdate.name = name
                    expenseToUpdate.expCategory = expCategory
                    expenseToUpdate.payment_Out = payment_Out
                    expenseToUpdate.payment_Via = payment_Via
                    expenseToUpdate.payment_Type = payment_Type
                    if(slip_No){
                        expenseToUpdate.slip_No = slip_No

                    }
                    if(details){
                        expenseToUpdate.details = details
                    }
                    if (slip_Pic && uploadImage) {
                    expenseToUpdate.slip_Pic = uploadImage.secure_url
                       
                      };
                    if(curr_Country){
                        expenseToUpdate.curr_Country = curr_Country

                    }
                    if(curr_Amount){
                        expenseToUpdate.curr_Amount = curr_Amount

                    }
                    if(curr_Rate){
                        expenseToUpdate.curr_Rate = curr_Rate

                    }
                    if(date){
                        expenseToUpdate.date = date

                    }

                    await expenseToUpdate.save();

                    res.status(200).json({ data: expenseToUpdate, message: 'Expense updated successfully' });

                
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { addExpense,addMultipleExpense, getExpenses, delExpense, updateExpense }