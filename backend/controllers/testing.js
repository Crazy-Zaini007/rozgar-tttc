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
      new_Curr_Payment,
      curr_Rate
    } = req.body;
    new_Curr_Payment=new_Payment/curr_Rate
    const existingAgent = await Agents.findOne({
      "payment_Out_Schema.supplierName": supplierName,
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

        const newPaymentIn = parseInt(new_Payment, 10);
        const newCurrAmount = parseInt(new_Curr_Payment, 10);
        const updatedPaymentIn = candPayment.new_Payment - newPaymentIn;
       const updateCurr_Amount = candPayment.new_Curr_Payment - newCurrAmount;
if(candPayment.cand_Name.toLowerCase()!==cand_Name.toLowerCase()){
  const existingPaymentPerson = existingAgent.payment_Out_Schema.persons.find((person) => person.name.toLowerCase() === candPayment.cand_Name.toLowerCase())
  if(existingPaymentPerson){
    existingPaymentPerson.remaining_Price+=candPayment.new_Payment
    existingPaymentPerson.total_In-=candPayment.new_Payment
    existingPaymentPerson.remaining_Curr+=candPayment.visa_Curr_Amount
  const existingNewPaymentPerson = existingAgent.payment_Out_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
if(existingNewPaymentPerson){
  existingNewPaymentPerson.remaining_Price -= new_Payment
  existingNewPaymentPerson.total_In += newPaymentIn
  existingNewPaymentPerson.remaining_Curr -= new_Curr_Payment

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
  candPayment.new_Remain_PKR=existingNewPaymentPerson.visa_Price_Out_PKR-existingNewPaymentPerson.total_In-new_Payment
  candPayment.visa_Curr_Amount=existingNewPaymentPerson.visa_Price_Out_Curr
  candPayment.past_Paid_Curr=existingNewPaymentPerson.visa_Price_Out_Curr-existingNewPaymentPerson.remaining_Curr
  candPayment.new_Remain_Curr=existingNewPaymentPerson.visa_Price_Out_Curr-new_Curr_Payment
  candPayment.new_Payment=existingNewPaymentPerson.new_Payment
  candPayment.new_Curr_Payment=new_Payment/curr_Rate
  candPayment.curr_Rate=curr_Rate
  }

  paymentToFind.payment_In+=-updatedPaymentIn
  paymentToFind.curr_Amount+=-updatedPaymentIn/curr_Rate
  paymentToFind.curr_Rate+=-curr_Rate


  await existingAgent.updateOne({
    $inc: {
      "payment_Out_Schema.total_Payment_Out": -updatedPaymentIn,
      "payment_Out_Schema.remaining_Balance": updatedPaymentIn,
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
    cashInHandUpdate.$inc.cash = -updatedPaymentIn;
    cashInHandUpdate.$inc.total_Cash = -updatedPaymentIn;
  }
  else{
    cashInHandUpdate.$inc.bank_Cash = -updatedPaymentIn;
    cashInHandUpdate.$inc.total_Cash = -updatedPaymentIn;
  }
  
  await CashInHand.updateOne({}, cashInHandUpdate);
  const newNotification=new Notifications({
    type:"Agent Cand-Wise Payment Out Updated",
    content:`${user.userName} updated Cand-Wise Payment_Out ${new_Payment} of Candidate ${cand_Name} of Agent:${supplierName}'s Record`,
    date: new Date().toISOString().split("T")[0]

  })
  await newNotification.save()
  await existingAgent.save()

  res.status(200).json({
    message: `Successfuly, updated Cand-Wise Payment_Out ${new_Payment} of Candidate ${cand_Name} of Agent: ${supplierName}'s Record`,
  });

}
else{
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
  paymentToFind.curr_Amount+=-updatedPaymentIn/curr_Rate
  await existingAgent.updateOne({
    $inc: {
      "payment_Out_Schema.total_Payment_Out": -updatedPaymentIn,
      "payment_Out_Schema.remaining_Balance": updatedPaymentIn,
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
    cashInHandUpdate.$inc.cash = -updatedPaymentIn;
    cashInHandUpdate.$inc.total_Cash = -updatedPaymentIn;
  }
  else{
    cashInHandUpdate.$inc.bank_Cash = -updatedPaymentIn;
    cashInHandUpdate.$inc.total_Cash = -updatedPaymentIn;
  }
  
  await CashInHand.updateOne({}, cashInHandUpdate);
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
  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}