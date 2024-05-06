
// Candidate Wise Payments In
const addAgentCandVisePaymentIn=async(req,res)=>{
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
      payments
    } = req.body;

    let allPayments=[]
    let new_Payment_In=0
    let new_Curr_Amount=0

    const existingSupplier = await VisitAgents.findOne({
      "payment_In_Schema.supplierName": supplierName,
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Visit Agent not Found",
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
      let cand_Name, pp_No,entry_Mode, company,trade,final_Status,flight_Date,visa_Amount_PKR,new_Payment,past_Paid_PKR,past_Remain_PKR,new_Remain_PKR,visa_Curr_Amount,new_Curr_Payment,past_Paid_Curr,past_Remain_Curr,new_Remain_Curr,curr_Rate
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
      new_Curr_Payment=newCurrAmount?newCurrAmount:0,
      existPerson.remaining_Price += -newPaymentIn,
      existPerson.total_In += newPaymentIn,
      existPerson.remaining_Curr += newCurrAmount ? -newCurrAmount : 0
      new_Payment_In+=newPaymentIn
      new_Curr_Amount+=newCurrAmount
      curr_Rate=newPaymentIn/newCurrAmount

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
      curr_Amount:new_Curr_Amount,
      payment_In_Curr:curr_Country,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      date,
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
      type:"Visit Agent Cand-Wise Payment In",
      content:`${user.userName} added Candidate Wise Payment_In: ${new_Payment_In} to ${payments.length} Candidates of Agent:${supplierName}`,
      date: new Date().toISOString().split("T")[0]

    })
    await newNotification.save()

    await existingSupplier.save();
    res.status(200).json({
      message: `Payment In: ${new_Payment_In} added Successfully for to ${payments.length} Candidates to Agent:${supplierName}'s Record`,
    })

  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}


// Deleting a CandWise Payment IN
const deleteAgentCandVisePaymentIn=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const {
      supplierName,
      paymentId
    } = req.body;
    const existingSupplier = await VisitAgents.findOne({
      "payment_In_Schema.supplierName": supplierName,
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Visit Agent not Found",
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
      const allPayments=paymentToDelete.payments
      const allPersons=existingSupplier.payment_In_Schema.persons
      for (const payment of allPayments){
      for (const person of allPersons){
        if(payment.cand_Name.toLowerCase()===person.name.toLowerCase()){
          person.total_In-=payment.new_Payment
          person.remaining_Price+=payment.new_Payment
          person.remaining_Curr+=payment.new_Curr_Payment
        }
      }
      }
      await existingSupplier.updateOne({
        $inc: {
          "payment_In_Schema.total_Payment_In": -paymentToDelete.payment_In,
          "payment_In_Schema.remaining_Balance": paymentToDelete.payment_In,
          "payment_In_Schema.total_Payment_In_Curr": paymentToDelete.curr_Amount ? -paymentToDelete.curr_Amount : 0,
          "payment_In_Schema.remaining_Curr": paymentToDelete.curr_Amount ? paymentToDelete.curr_Amount : 0,
        },
        $pull: {
          "payment_In_Schema.candPayments": { _id: paymentId },
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
      if (paymentToDelete.payment_Via.toLowerCase() === "cash" ) {
        cashInHandUpdate.$inc.cash = -paymentToDelete.payment_In;
        cashInHandUpdate.$inc.total_Cash = -paymentToDelete.payment_In;
      }
      else{
        cashInHandUpdate.$inc.bank_Cash = -paymentToDelete.payment_In;
        cashInHandUpdate.$inc.total_Cash = -paymentToDelete.payment_In;
      }
      
      await CashInHand.updateOne({}, cashInHandUpdate);
      await existingSupplier.save()
      const newNotification=new Notifications({
        type:"Visit Agents Cand-Wise Payment In Deleted",
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
const updateAgentCandVisePaymentIn=async(req,res)=>{
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

  
  const existingSupplier = await VisitAgents.findOne({
    "payment_In_Schema.supplierName": supplierName,
  });
  if (!existingSupplier) {
    res.status(404).json({ message: "Visit Agent not found" });
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
const deleteSingleAgentCandVisePaymentIn=async(req,res)=>{
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
      myPaymentId
    } = req.body;
    const existingSupplier = await VisitAgents.findOne({
      "payment_In_Schema.supplierName": supplierName,
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Visit Agent not Found",
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
          personToUpdate.remaining_Price+=candPayment.new_Payment
          personToUpdate.remaining_Curr+=candPayment.new_Curr_Payment
        }
        paymentToFind.payment_In-=candPayment.new_Payment
        paymentToFind.curr_Amount-=candPayment.new_Curr_Payment
        await existingSupplier.updateOne({
          $inc: {
            "payment_In_Schema.total_Payment_In": -candPayment.new_Payment,
            "payment_In_Schema.remaining_Balance": candPayment.new_Payment,
            "payment_In_Schema.total_Payment_In_Curr": candPayment.new_Curr_Payment ? -candPayment.new_Curr_Payment : 0,
            "payment_In_Schema.remaining_Curr": candPayment.new_Curr_Payment ? candPayment.new_Curr_Payment : 0,
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
        if (paymentToFind.payment_Via.toLowerCase() === "cash" ) {
          cashInHandUpdate.$inc.cash = -candPayment.new_Payment;
          cashInHandUpdate.$inc.total_Cash = -candPayment.new_Payment;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = -candPayment.new_Payment;
          cashInHandUpdate.$inc.total_Cash = -candPayment.new_Payment;
        }
        
        await CashInHand.updateOne({}, cashInHandUpdate);
        const newNotification=new Notifications({
          type:"Visit Agent Cand-Wise Payment In Deleted",
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
    res.status(500).json({message:error.message})
  }
}



// Deleting a Single CandWise Payment IN
const updateSingleAgentCandVisePaymentIn=async(req,res)=>{
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
      new_Payment,
      new_Curr_Payment
    } = req.body;
    const existingSupplier = await VisitAgents.findOne({
      "payment_In_Schema.supplierName": supplierName,
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Visit Agent not Found",
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
        const newPaymentIn = parseInt(new_Payment, 10);
        const newCurrAmount = parseInt(new_Curr_Payment, 10);
        const updatedPaymentIn = candPayment.new_Payment - newPaymentIn;
      const updateCurr_Amount = candPayment.new_Curr_Payment - newCurrAmount;

// Updating The Cand payment

candPayment.new_Remain_PKR+=updatedPaymentIn
candPayment.new_Payment+=-updatedPaymentIn
candPayment.new_Remain_Curr+=updateCurr_Amount
candPayment.new_Curr_Payment+=-updateCurr_Amount
candPayment.curr_Rate=updatedPaymentIn/updateCurr_Amount


// updating Person total_In and remainig pkr and curr as well
        const personToUpdate=allPersons.find(p=>p.name.toString()===candPayment.cand_Name.toString())
        if(personToUpdate){
          personToUpdate.total_In+=-updatedPaymentIn
          personToUpdate.remaining_Price+=-updatedPaymentIn
          personToUpdate.remaining_Curr+=-newCurrAmount
        }

        // uodating parent payment
        paymentToFind.payment_In+=-updatedPaymentIn
        paymentToFind.curr_Amount+=-updateCurr_Amount
        await existingSupplier.updateOne({
          $inc: {
            "payment_In_Schema.total_Payment_In": -updatedPaymentIn,
            "payment_In_Schema.remaining_Balance": updatedPaymentIn,
            "payment_In_Schema.total_Payment_In_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
            "payment_In_Schema.remaining_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
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
        if (paymentToFind.payment_Via.toLowerCase() === "cash" ) {
          cashInHandUpdate.$inc.cash = -updatedPaymentIn;
          cashInHandUpdate.$inc.total_Cash = -updatedPaymentIn;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = -updatedPaymentIn;
          cashInHandUpdate.$inc.total_Cash = -updatedPaymentIn;
        }
        
        await CashInHand.updateOne({}, cashInHandUpdate);
        const newNotification=new Notifications({
          type:"Visit Agent Cand-Wise Payment In Updated",
          content:`${user.userName} updated Cand-Wise Payment_In ${new_Payment} of Candidate ${candPayment.cand_Name} of Agent:${supplierName}'s Record`,
          date: new Date().toISOString().split("T")[0]
  
        })
        await newNotification.save()
        await existingSupplier.save()

        res.status(200).json({
          message: `Successfuly, updated Cand-Wise Payment_In ${new_Payment} of Candidate ${candPayment.cand_Name} of Agent: ${supplierName}'s Record`,
        });
      }
    }
   

  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}






// Candidate Wise Payments Out
const addAgentCandVisePaymentOut=async(req,res)=>{
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
      payments
    } = req.body;

    let allPayments=[]
    let new_Payment_Out=0
    let new_Curr_Amount=0

    const existingSupplier = await VisitAgents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Visit Agent not Found",
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
      let cand_Name, pp_No,entry_Mode, company,trade,final_Status,flight_Date,visa_Amount_PKR,new_Payment,past_Paid_PKR,past_Remain_PKR,new_Remain_PKR,visa_Curr_Amount,new_Curr_Payment,past_Paid_Curr,past_Remain_Curr,new_Remain_Curr,curr_Rate
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
      new_Curr_Payment=newCurrAmount?newCurrAmount:0,
      existPerson.remaining_Price += -newPaymentOut,
      existPerson.total_In += newPaymentOut,
      existPerson.remaining_Curr += newCurrAmount ? -newCurrAmount : 0
      new_Payment_Out+=newPaymentOut
      new_Curr_Amount+=newCurrAmount
      curr_Rate=newPaymentOut/newCurrAmount

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
      curr_Amount:new_Curr_Amount,
      payment_Out_Curr:curr_Country,
      slip_Pic: uploadImage?.secure_url || '',
      details,
      date,
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
      type:"Visit Agent Cand-Wise Payment Out",
      content:`${user.userName} added Candidate Wise Payment_Ou: ${new_Payment_Out} to ${payments.length} Candidates of Agent:${supplierName}`,
      date: new Date().toISOString().split("T")[0]

    })
    await newNotification.save()

    await existingSupplier.save();
    res.status(200).json({
      message: `Payment Out: ${new_Payment_Out} added Successfully for to ${payments.length} Candidates to Agent:${supplierName}'s Record`,
    })

  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}


// Deleting a CandWise Payment Out
const deleteAgentCandVisePaymentOut=async(req,res)=>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const {
      supplierName,
      paymentId
    } = req.body;
    const existingSupplier = await VisitAgents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Visit Agent not Found",
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
      const allPayments=paymentToDelete.payments
      const allPersons=existingSupplier.payment_Out_Schema.persons
      for (const payment of allPayments){
      for (const person of allPersons){
        if(payment.cand_Name.toLowerCase()===person.name.toLowerCase()){
          person.total_In-=payment.new_Payment
          person.remaining_Price+=payment.new_Payment
          person.remaining_Curr+=payment.new_Curr_Payment
        }
      }
      }
      await existingSupplier.updateOne({
        $inc: {
          "payment_Out_Schema.total_Payment_Out": -paymentToDelete.payment_Out,
          "payment_Out_Schema.remaining_Balance": paymentToDelete.payment_Out,
          "payment_Out_Schema.total_Payment_Out_Curr": paymentToDelete.curr_Amount ? -paymentToDelete.curr_Amount : 0,
          "payment_Out_Schema.remaining_Curr": paymentToDelete.curr_Amount ? paymentToDelete.curr_Amount : 0,
        },
        $pull: {
          "payment_Out_Schema.candPayments": { _id: paymentId },
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
      if (paymentToDelete.payment_Via.toLowerCase() === "cash" ) {
        cashInHandUpdate.$inc.cash = paymentToDelete.payment_Out;
        cashInHandUpdate.$inc.total_Cash = paymentToDelete.payment_Out;
      }
      else{
        cashInHandUpdate.$inc.bank_Cash = paymentToDelete.payment_Out;
        cashInHandUpdate.$inc.total_Cash = paymentToDelete.payment_Out;
      }
      
      await CashInHand.updateOne({}, cashInHandUpdate);
      await existingSupplier.save()
      const newNotification=new Notifications({
        type:"Visit Agent Cand-Wise Payment Out Deleted",
        content:`${user.userName} deleted Cand-Wise Payment_Out: ${paymentToDelete.payment_Out } of ${paymentToDelete.payments.length} Candidates from  Agent:${supplierName}'s Record`,
        date: new Date().toISOString().split("T")[0]

      })
      await newNotification.save()
    
      res.status(200).json({
        message: `Payment Out with ID ${paymentId} deleted successfully of ${paymentToDelete.payments.length} Candidates from  Agent:${supplierName}'s Record`,
      });

    }
   

  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}




// Update Cand-Wise Payment Out
const updateAgentCandVisePaymentOut=async(req,res)=>{
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

  
  const existingSupplier = await VisitAgents.findOne({
    "payment_Out_Schema.supplierName": supplierName,
  });
  if (!existingSupplier) {
    res.status(404).json({ message: "Visit Agent not found" });
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
const deleteSingleAgentCandVisePaymentOut=async(req,res)=>{
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
      myPaymentId
    } = req.body;
    const existingSupplier = await VisitAgents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Visit Agent not Found",
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
          personToUpdate.remaining_Price+=candPayment.new_Payment
          personToUpdate.remaining_Curr+=candPayment.new_Curr_Payment
        }
        paymentToFind.payment_Out-=candPayment.new_Payment
        paymentToFind.curr_Amount-=candPayment.new_Curr_Payment
        await existingSupplier.updateOne({
          $inc: {
            "payment_Out_Schema.total_Payment_Out": -candPayment.new_Payment,
            "payment_Out_Schema.remaining_Balance": candPayment.new_Payment,
            "payment_Out_Schema.total_Payment_Out_Curr": candPayment.new_Curr_Payment ? -candPayment.new_Curr_Payment : 0,
            "payment_Out_Schema.remaining_Curr": candPayment.new_Curr_Payment ? candPayment.new_Curr_Payment : 0,
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
        if (paymentToFind.payment_Via.toLowerCase() === "cash" ) {
          cashInHandUpdate.$inc.cash = candPayment.new_Payment;
          cashInHandUpdate.$inc.total_Cash = candPayment.new_Payment;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = candPayment.new_Payment;
          cashInHandUpdate.$inc.total_Cash = candPayment.new_Payment;
        }
        
        await CashInHand.updateOne({}, cashInHandUpdate);
        const newNotification=new Notifications({
          type:"Visit Agent Cand-Wise Payment Out Deleted",
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
    res.status(500).json({message:error.message})
  }
}



// Deleting a Single CandWise Payment Out
const updateSingleAgentCandVisePaymentOut=async(req,res)=>{
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
      new_Payment,
      new_Curr_Payment
    } = req.body;
    const existingSupplier = await VisitAgents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Visit Agent not Found",
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
        const newPaymentOut = parseInt(new_Payment, 10);
        const newCurrAmount = parseInt(new_Curr_Payment, 10);
        const updatedPaymentOut = candPayment.new_Payment - newPaymentOut;
      const updateCurr_Amount = candPayment.new_Curr_Payment - newCurrAmount;

// Updating The Cand payment

candPayment.new_Remain_PKR+=updatedPaymentOut
candPayment.new_Payment-=updatedPaymentOut
candPayment.new_Remain_Curr+=updateCurr_Amount
candPayment.new_Curr_Payment+=-updateCurr_Amount


// updating Person total_In and remainig pkr and curr as well
        const personToUpdate=allPersons.find(p=>p.name.toString()===candPayment.cand_Name.toString())
        if(personToUpdate){
          personToUpdate.total_In+=-updatedPaymentOut
          personToUpdate.remaining_Price+=-updatedPaymentOut
          personToUpdate.remaining_Curr+=-newCurrAmount
        }

        // uodating parent payment
        paymentToFind.payment_Out+=-updatedPaymentOut
        paymentToFind.curr_Amount+=-updateCurr_Amount
        await existingSupplier.updateOne({
          $inc: {
            "payment_Out_Schema.total_Payment_Out": -updatedPaymentOut,
            "payment_Out_Schema.remaining_Balance": updatedPaymentOut,
            "payment_Out_Schema.total_Payment_Out_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
            "payment_Out_Schema.remaining_Curr": updateCurr_Amount ? -updateCurr_Amount : 0,
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
        if (paymentToFind.payment_Via.toLowerCase() === "cash" ) {
          cashInHandUpdate.$inc.cash = -updatedPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -updatedPaymentOut;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = -updatedPaymentOut;
          cashInHandUpdate.$inc.total_Cash = -updatedPaymentOut;
        }
        
        await CashInHand.updateOne({}, cashInHandUpdate);
        const newNotification=new Notifications({
          type:"Visit Agent Cand-Wise Payment Out Updated",
          content:`${user.userName} updated Cand-Wise Payment_Out: ${new_Payment} of Candidate ${candPayment.cand_Name} of Agent:${supplierName}'s Record`,
          date: new Date().toISOString().split("T")[0]
  
        })
        await newNotification.save()
        await existingSupplier.save()

        res.status(200).json({
          message: `Successfuly, updated Cand-Wise Payment_Out ${new_Payment} of Candidate ${candPayment.cand_Name} of Agent:${supplierName}'s Record`,
        });
      }
    }
   

  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}
