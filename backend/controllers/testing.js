const updateSingleCandVisePaymentIn=async(req,res)=>{
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

    let newPaymentIn = parseInt(new_Payment, 10);
    let newCurrAmount = parseInt(new_Curr_Payment, 10);
    let newCurrRate=parseInt(curr_Rate,10)
    newCurrAmount=newPaymentIn/newCurrRate

    const existingSupplier = await Suppliers.findOne({
      "payment_In_Schema.supplierName": supplierName,
    })

    if (!existingSupplier) {
      res.status(404).json({
        message: "Supplier not Found",
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
        let updatedPaymentIn = candPayment.new_Payment - newPaymentIn;
        let updateCurr_Amount = candPayment.new_Curr_Payment?candPayment.new_Curr_Payment:0- newCurrAmount;


if(candPayment.cand_Name.toLowerCase()!==cand_Name.toLowerCase()){
  const existingPaymentPerson = existingSupplier.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === candPayment.cand_Name.toLowerCase())
  if(existingPaymentPerson){
    existingPaymentPerson.remaining_Price+=candPayment?.new_Payment||0
    existingPaymentPerson.total_In-=candPayment?.new_Payment||0
    existingPaymentPerson.remaining_Curr+=candPayment?.visa_Curr_Amount||0
  const existingNewPaymentPerson = existingSupplier.payment_In_Schema.persons.find((person) => person.name.toLowerCase() === cand_Name.toLowerCase())
if(existingNewPaymentPerson){
  existingNewPaymentPerson.remaining_Price -= newPaymentIn
  existingNewPaymentPerson.total_In += newPaymentIn
  existingNewPaymentPerson.remaining_Curr -= newCurrAmount

  candPayment.cand_Name=existingNewPaymentPerson.name
  candPayment.pp_No=existingNewPaymentPerson.pp_No
  candPayment.entry_Mode=existingNewPaymentPerson.entry_Mode
  candPayment.company=existingNewPaymentPerson.company
  candPayment.country=existingNewPaymentPerson.country
  candPayment.trade=existingNewPaymentPerson.trade
  candPayment.final_Status=existingNewPaymentPerson.final_Status
  candPayment.flight_Date=existingNewPaymentPerson.flight_Date
  candPayment.visa_Amount_PKR=existingNewPaymentPerson.visa_Price_In_PKR
  candPayment.past_Paid_PKR=existingNewPaymentPerson.total_In
  candPayment.past_Remain_PKR=existingNewPaymentPerson.visa_Price_In_PKR-existingNewPaymentPerson.total_In
  candPayment.new_Remain_PKR=existingNewPaymentPerson.visa_Price_In_PKR-existingNewPaymentPerson.total_In-newPaymentIn
  candPayment.visa_Curr_Amount=existingNewPaymentPerson.visa_Price_In_Curr
  candPayment.past_Paid_Curr=existingNewPaymentPerson.visa_Price_In_Curr-existingNewPaymentPerson.remaining_Curr?existingNewPaymentPerson.remaining_Curr:0
  candPayment.new_Remain_Curr=existingNewPaymentPerson.visa_Price_In_Curr-newCurrAmount
  candPayment.new_Payment=newPaymentIn
  candPayment.new_Curr_Payment=newPaymentIn/newCurrRate
  candPayment.curr_Rate=newCurrRate
  }

  paymentToFind.payment_In+=-updatedPaymentIn
  paymentToFind.curr_Amount+=- newCurrRate>0 ?updatedPaymentIn/newCurrRate:0
  paymentToFind.curr_Rate+=-newCurrRate


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
    type:"Supplier Cand-Wise Payment In Updated",
    content:`${user.userName} updated Cand-Wise Payment_In ${newPaymentIn} of Candidate ${cand_Name} of Supplier:${supplierName}'s Record`,
    date: new Date().toISOString().split("T")[0]

  })
  await newNotification.save()
  await existingSupplier.save()

  res.status(200).json({
    message: `Successfuly, updated Cand-Wise Payment_In ${newPaymentIn} of Candidate ${cand_Name} of Supplier: ${supplierName}'s Record`,
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
    type:"Supplier Cand-Wise Payment In Updated",
    content:`${user.userName} updated Cand-Wise Payment_In ${new_Payment} of Candidate ${candPayment.cand_Name} of Supplier:${supplierName}'s Record`,
    date: new Date().toISOString().split("T")[0]

  })
  await newNotification.save()
  await existingSupplier.save()

  res.status(200).json({
    message: `Successfuly, updated Cand-Wise Payment_In ${new_Payment} of Candidate ${candPayment.cand_Name} of Supplier: ${supplierName}'s Record`,
  });
}
}
      }
    }
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:error.message})
  }
}