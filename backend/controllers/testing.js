// deleting an Entry
const delEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { entryId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return res.status(400).json({ message: "Invalid Entry ID" });
    }
    const entryToDelete = await Entries.findById(entryId);
    if (!entryToDelete) {
      res.status(404).json({ message: "Entry not found" });
    }
    if (entryToDelete) {
      let {
        reference_Out,
        reference_In,
        name,
        pp_No,
        trade,
        company,
        contact,
        country,
        flight_Date,
        final_Status,
        remarks,
        entry_Mode,
        reference_Out_Name,
        visa_Sales_Rate_PKR,
        visa_Sale_Rate_Oth_Cur,
        cur_Country_One,
        reference_In_Name,
        visa_Purchase_Rate_PKR,
        visa_Purchase_Rate_Oth_Cur,
        cur_Country_Two,
        picture,
        visit_Sales_PKR,
        visit_Sales_Cur,
        visit_Purchase_Rate_PKR,
        visit_Purchase_Cur,
        visit_Reference_In_Name,
        visit_Reference_Out_Name,
        visit_Section_Picture,
        ticket_Sales_PKR,
        ticket_Sales_Cur,
        ticket_Purchase_PKR,
        ticket_Purchase_Cur,
        ticket_Reference_In_Name,
        ticket_Reference_Out_Name,
        ticket_Section_Picture,
        azad_Visa_Sales_PKR,
        azad_Visa_Sales_Cur,
        azad_Visa_Purchase_PKR,
        azad_Visa_Purchase_Cur,
        azad_Visa_Reference_In_Name,
        azad_Visa_Reference_Out_Name,
        azad_Visa_Section_Picture,
        protector_Price_In,
        protector_Price_In_Oth_Cur,
        protector_Reference_In_Name,
        protector_Reference_In,
        protector_Price_Out,
        visit_Reference_In,
        visit_Reference_Out,
        ticket_Reference_In,
        ticket_Reference_Out,
        azad_Visa_Reference_In,
        azad_Visa_Reference_Out,
        visit_Sales_Rate_Oth_Curr,
        visit_Purchase_Rate_Oth_Cur,
        ticket_Sales_Rate_Oth_Cur,
        ticket_Purchase_Rate_Oth_Cur,
        azad_Visa_Sales_Rate_Oth_Cur,
        azad_Visa_Purchase_Rate_Oth_Cur,
      } = entryToDelete;



      // check for if payments are made in Agents/Suppliers regarding the candidate to be deleted
      const agents=await Agents.find({})
      const suppliers=await Suppliers.find({})
      const azadSuppliers=await AzadSupplier.find({})
      const azadAgents=await AzadAgents.find({})
      const ticketSuppliers=await TicketSuppliers.find({})
      const ticketAgents=await TicketAgents.find({})
      const visitSuppliers=await VisitSuppliers.find({})
      const visitAgents=await VisitAgents.find({})
      const protectors=await Protector.find({})

      
      //  For Agents

      for (const agent of agents){
        if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
         let allCandPayments=agent.payment_In_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/agents/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

       for (const agent of agents){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/agents/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

      //  For Suppliers

       for (const agent of suppliers){
        if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
         let allCandPayments=agent.payment_In_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/supplier/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }
       for (const agent of suppliers){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return  res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/supplier/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

       //  For Azad Agents

      for (const agent of azadAgents){
        if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
         let allCandPayments=agent.payment_In_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return  res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Azad Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

       for (const agent of azadAgents){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Azad Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

      //  For Azad Suppliers

       for (const agent of azadSuppliers){
        if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
         let allCandPayments=agent.payment_In_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Azad Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }
       for (const agent of azadSuppliers){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Azad Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }


         //  For Ticket Agents

      for (const agent of ticketAgents){
        if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
         let allCandPayments=agent.payment_In_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Ticket Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

       for (const agent of ticketAgents){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return  res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Ticket Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

      //  For Ticket Suppliers

       for (const agent of ticketSuppliers){
        if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
         let allCandPayments=agent.payment_In_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Ticket Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }
       for (const agent of ticketSuppliers){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Ticket Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }


         //  For Visit Agents

      for (const agent of visitAgents){
        if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
         let allCandPayments=agent.payment_In_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Visit Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

       for (const agent of visitAgents){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return  res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Visit Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

      //  For Visit Suppliers

       for (const agent of visitSuppliers){
        if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
         let allCandPayments=agent.payment_In_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return  res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Visit Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }
       for (const agent of visitSuppliers){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
              return  res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Visit Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

        //  For Protectors

      
         for (const agent of protectors){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToDelete.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToDelete.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with Protector :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/protector/details'})
                break;
              }
            }
           }
          }
         }


      await Entries.findByIdAndDelete(entryId);

      // Calculate new values
      const newVisaSalesRatePKR =
        visa_Sales_Rate_PKR !== undefined && visa_Sales_Rate_PKR !== null
          ? -visa_Sales_Rate_PKR
          : 0;
      const newVisaSaleRateOthCur =
        -visa_Sale_Rate_Oth_Cur !== undefined && visa_Sale_Rate_Oth_Cur !== null
          ? -visa_Sale_Rate_Oth_Cur
          : 0;
      const newVisaPurchaseRatePKR =
        visa_Purchase_Rate_PKR !== undefined && visa_Purchase_Rate_PKR !== null
          ? -visa_Purchase_Rate_PKR
          : 0;
      const newVisaPurchaseRateOthCur =
        visa_Purchase_Rate_Oth_Cur !== undefined &&
          visa_Purchase_Rate_Oth_Cur !== null
          ? -visa_Purchase_Rate_Oth_Cur
          : 0;

      const newAzad_Visa_Sales_PKR =
        azad_Visa_Sales_PKR !== undefined && azad_Visa_Sales_PKR !== null
          ? -azad_Visa_Sales_PKR
          : 0;
      const newAzad_Visa_Sales_Rate_Oth_Cur =
        azad_Visa_Sales_Rate_Oth_Cur !== undefined &&
          azad_Visa_Sales_Rate_Oth_Cur !== null
          ? -azad_Visa_Sales_Rate_Oth_Cur
          : 0;
      const newAzad_Visa_Purchase_PKR =
        azad_Visa_Purchase_PKR !== undefined && azad_Visa_Purchase_PKR !== null
          ? -azad_Visa_Purchase_PKR
          : 0;
      const newAzad_Visa_Purchase_Rate_Oth_Cur =
        azad_Visa_Purchase_Rate_Oth_Cur !== undefined &&
          azad_Visa_Purchase_Rate_Oth_Cur !== null
          ? -azad_Visa_Purchase_Rate_Oth_Cur
          : 0;

      const newTicket_Sales_PKR =
        ticket_Sales_PKR !== undefined && ticket_Sales_PKR !== null
          ? -ticket_Sales_PKR
          : 0;
      const newTicket_Sales_Rate_Oth_Cur =
        ticket_Sales_Rate_Oth_Cur !== undefined &&
          ticket_Sales_Rate_Oth_Cur !== null
          ? -ticket_Sales_Rate_Oth_Cur
          : 0;
      const newTicket_Purchase_PKR =
        ticket_Purchase_PKR !== undefined && ticket_Purchase_PKR !== null
          ? -ticket_Purchase_PKR
          : 0;
      const newTicket_Purchase_Rate_Oth_Cur =
        ticket_Purchase_Rate_Oth_Cur !== undefined &&
          ticket_Purchase_Rate_Oth_Cur !== null
          ? -ticket_Purchase_Rate_Oth_Cur
          : 0;

      const newVisit_Sales_PKR =
        visit_Sales_PKR !== undefined && visit_Sales_PKR !== null
          ? -visit_Sales_PKR
          : 0;
      const newVisit_Sales_Rate_Oth_Curr =
        visit_Sales_Rate_Oth_Curr !== undefined &&
          visit_Sales_Rate_Oth_Curr !== null
          ? -visit_Sales_Rate_Oth_Curr
          : 0;
      const newVisit_Purchase_PKR =
        visit_Purchase_Rate_PKR !== undefined &&
          visit_Purchase_Rate_PKR !== null
          ? -visit_Purchase_Rate_PKR
          : 0;
      const newVisit_Purchase_Rate_Oth_Cur =
        visit_Purchase_Rate_Oth_Cur !== undefined &&
          visit_Purchase_Rate_Oth_Cur !== null
          ? -visit_Purchase_Rate_Oth_Cur
          : 0;

      const newProtectorPriceIn =
        protector_Price_In !== undefined && protector_Price_In !== null
          ? -protector_Price_In
          : 0;
      const newProtector_Price_In_Oth_Cur =
        protector_Price_In_Oth_Cur !== undefined &&
          protector_Price_In_Oth_Cur !== null
          ? -protector_Price_In_Oth_Cur
          : 0;

      // Suppliers Sections

      // Update the Supplierd With PaymentIn by removing the person from the persons array
      if(reference_In_Name !== undefined &&
        reference_In_Name !== null &&
        reference_In_Name !== "" && ( reference_In.toLowerCase()==='supplier' || reference_In.toLowerCase()==='suppliers')){
          for (const supplier of suppliers){
            if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
              let supplierOutPersonIndex;
              
            supplierOutPersonIndex =
            supplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            )
             // If the person is found, remove it from the persons array
          if (supplierOutPersonIndex !== -1) {
    
            supplier?.payment_Out_Schema?.persons.splice(
              supplierOutPersonIndex,
              1
            );
            supplier.payment_Out_Schema.total_Visa_Price_Out_PKR +=
              newVisaPurchaseRatePKR /* Adjust based on your needs */;
              supplier.payment_Out_Schema.total_Visa_Price_Out_Curr +=
              newVisaPurchaseRateOthCur /* Adjust based on your needs */;
              supplier.payment_Out_Schema.remaining_Curr +=
              newVisaPurchaseRateOthCur /* Adjust based on your needs */;
              supplier.payment_Out_Schema.remaining_Balance +=
              newVisaPurchaseRatePKR /* Adjust based on your needs */;
            await supplier.save();
            break
          }

            }
          }
         
        }
     
        if(reference_Out_Name !== undefined &&
          reference_Out_Name !== null &&
          reference_Out_Name !== "" && ( reference_Out.toLowerCase()==='supplier' || reference_Out.toLowerCase()==='suppliers')){

            for (const supplier of suppliers){
              if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
                let supplierInPersonIndex;
                supplierInPersonIndex =
                supplier?.payment_In_Schema?.persons.findIndex(
                    (person) =>
                      person.name === name &&
                      person.entry_Mode === entry_Mode &&
                      person.pp_No === pp_No
                  );
                // If the person is found, remove it from the persons array
                if (supplierInPersonIndex !== -1) {
                  supplier.payment_In_Schema.persons.splice(
                    supplierInPersonIndex,
                    1
                  );
                  supplier.payment_In_Schema.total_Visa_Price_In_PKR +=
                    newVisaSalesRatePKR /* Adjust based on your needs */;
                    supplier.payment_In_Schema.total_Visa_Price_In_Curr +=
                    newVisaSaleRateOthCur /* Adjust based on your needs */;
                    supplier.payment_In_Schema.remaining_Curr +=
                    newVisaSaleRateOthCur /* Adjust based on your needs */;
                    supplier.payment_In_Schema.remaining_Balance +=
                    newVisaSalesRatePKR /* Adjust based on your needs */;
                  await supplier.save();
                  break
                }
              }
            }
          }
     
      // Agnets Sections

      if(reference_In_Name !== undefined &&
        reference_In_Name !== null &&
        reference_In_Name !== "" && ( reference_In.toLowerCase()==='agent' || reference_In.toLowerCase()==='agents')){

          for (const agent of agents){
            if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
              let agentOutPersonIndex;
              // Find the index of the person in the persons array
              agentOutPersonIndex =
              agent?.payment_Out_Schema?.persons.findIndex(
                  (person) =>
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                );
              // If the person is found, remove it from the persons array
              if (agentOutPersonIndex !== -1) {
                agent.payment_Out_Schema.persons.splice(
                  agentOutPersonIndex,
                  1
                );
                agent.payment_Out_Schema.total_Visa_Price_Out_PKR +=
                  newVisaPurchaseRatePKR /* Adjust based on your needs */;
                  agent.payment_Out_Schema.total_Visa_Price_Out_Curr +=
                  newVisaPurchaseRateOthCur /* Adjust based on your needs */;
                  agent.payment_Out_Schema.remaining_Curr +=
                  newVisaPurchaseRateOthCur /* Adjust based on your needs */;
                  agent.payment_Out_Schema.remaining_Balance +=
                  newVisaPurchaseRatePKR /* Adjust based on your needs */;
                await agent.save();
                break
              }
            }
          }

        }
      

        if(reference_Out_Name !== undefined &&
          reference_Out_Name !== null &&
          reference_Out_Name !== "" && ( reference_Out.toLowerCase()==='agent' || reference_Out.toLowerCase()==='agents')){
            for (const agent of agents){
              if(agent.payment_In_Schema &&agent.payment_In_Schema.persons){
                let agentInPersonIndex;
                agentInPersonIndex =
                agent?.payment_In_Schema?.persons.findIndex(
                    (person) =>
                      person.name === name &&
                      person.entry_Mode === entry_Mode &&
                      person.pp_No === pp_No
                  );
              
                // If the person is found, remove it from the persons array
                if (agentInPersonIndex !== -1) {
                  agent.payment_In_Schema.persons.splice(
                    agentInPersonIndex,
                    1
                  );
                  agent.payment_In_Schema.total_Visa_Price_In_PKR +=
                    newVisaSalesRatePKR /* Adjust based on your needs */;
                    agent.payment_In_Schema.total_Visa_Price_In_Curr +=
                    newVisaSaleRateOthCur /* Adjust based on your needs */;
                    agent.payment_In_Schema.remaining_Curr +=
                    newVisaSaleRateOthCur /* Adjust based on your needs */;
                    agent.payment_In_Schema.remaining_Balance +=
                    newVisaSalesRatePKR /* Adjust based on your needs */;
                  await agent.save();
                  break
                }
              }
            }
          }
      

      // Deleting From Candidates

      try {
        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInCandidate = await Candidate.findOne({
          "payment_In_Schema.supplierName": name,
          "payment_In_Schema.entry_Mode": entry_Mode,
          "payment_In_Schema.pp_No": pp_No,
        });

        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_In_Schema = null;
          await existingPaymentInCandidate.save();
        }
      } catch (error) {
        console.log(error);
      }

      try {
        // Check if the supplier with the given name and entry mode exists
        const existingPaymentOutCandidate = await Candidate.findOne({
          "payment_Out_Schema.supplierName": name,
          "payment_Out_Schema.entry_Mode": entry_Mode,
          "payment_Out_Schema.pp_No": pp_No,
        });

        if (existingPaymentOutCandidate) {
          console.log(
            "existingPaymentOutCandidate",
            existingPaymentOutCandidate
          );
          existingPaymentOutCandidate.payment_Out_Schema = null;
          await existingPaymentOutCandidate.save();
        }
      } catch (error) {
        console.log(error);
      }

      // Azad Suppliers/Agents Sections

      if (
        azad_Visa_Reference_In_Name !== undefined &&
        azad_Visa_Reference_In_Name !== null &&
        azad_Visa_Reference_In_Name !== ""
      ) {
       
        for(const supplier of azadSuppliers){
          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            let azadSupplierOutPersonIndex;
            // Find the index of the person in the persons array
            azadSupplierOutPersonIndex =
            supplier?.payment_Out_Schema?.persons.findIndex(
                (person) =>
                  person.name === name &&
                  person.entry_Mode === entry_Mode &&
                  person.pp_No === pp_No
              );
  
            // If the person is found, remove it from the persons array
            if (azadSupplierOutPersonIndex !== -1) {
              supplier?.payment_Out_Schema?.persons.splice(
                azadSupplierOutPersonIndex,
                1
              );
              supplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                newAzad_Visa_Purchase_PKR /* Adjust based on your needs */;
                supplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                newAzad_Visa_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
                supplier.payment_Out_Schema.remaining_Curr +=
                newAzad_Visa_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
                supplier.payment_Out_Schema.remaining_Balance +=
                newAzad_Visa_Purchase_PKR /* Adjust based on your needs */;
              await supplier.save();
              break
            }
          }
        }
       
      }

      if (
        azad_Visa_Reference_Out_Name !== undefined &&
        azad_Visa_Reference_Out_Name !== null &&
        azad_Visa_Reference_Out_Name !== ""
      ) {
        
        for (const supplier of azadSuppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            let azadSupplierInPersonIndex;

          azadSupplierInPersonIndex =
          supplier?.payment_In_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );

          // If the person is found, remove it from the persons array
          if (azadSupplierInPersonIndex !== -1) {
            supplier?.payment_In_Schema?.persons.splice(
              azadSupplierInPersonIndex,
              1
            );
            supplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              newAzad_Visa_Sales_PKR /* Adjust based on your needs */;
              supplier.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
              newAzad_Visa_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
              supplier.payment_In_Schema.remaining_Curr +=
              newAzad_Visa_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
              supplier.payment_In_Schema.remaining_Balance +=
              newAzad_Visa_Sales_PKR /* Adjust based on your needs */;
            await supplier.save();
            break
          }
          }
        }

      }

      if (
        azad_Visa_Reference_In_Name !== undefined &&
        azad_Visa_Reference_In_Name !== null &&
        azad_Visa_Reference_In_Name !== ""
      ) {
       
        for(const agent of azadAgents){
          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            let azadAgentOutPersonIndex;

            // Find the index of the person in the persons array
            azadAgentOutPersonIndex =
            agent?.payment_Out_Schema?.persons.findIndex(
                (person) =>
                  person.name === name &&
                  person.entry_Mode === entry_Mode &&
                  person.pp_No === pp_No
              );
            // If the person is found, remove it from the persons array
            if (azadAgentOutPersonIndex !== -1) {
              agent?.payment_Out_Schema?.persons.splice(
                azadAgentOutPersonIndex,
                1
              );
              agent.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                newAzad_Visa_Purchase_PKR /* Adjust based on your needs */;
                agent.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                newAzad_Visa_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
                agent.payment_Out_Schema.remaining_Curr +=
                newAzad_Visa_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
                agent.payment_Out_Schema.remaining_Balance +=
                newAzad_Visa_Purchase_PKR /* Adjust based on your needs */;
              await agent.save();
              break
            }
          }
        }
      
      }

      if (
        azad_Visa_Reference_Out_Name !== undefined &&
        azad_Visa_Reference_Out_Name !== null &&
        azad_Visa_Reference_Out_Name !== ""
      ) {
       
        for (const agent of  azadAgents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            let azadAgentInPersonIndex;

            azadAgentInPersonIndex =
            agent?.payment_In_Schema?.persons.findIndex(
                (person) =>
                  person.name === name &&
                  person.entry_Mode === entry_Mode &&
                  person.pp_No === pp_No
              );
            // If the person is found, remove it from the persons array
            if (azadAgentInPersonIndex !== -1) {
              agent?.payment_In_Schema?.persons.splice(
                azadAgentInPersonIndex,
                1
              );
              agent.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                newAzad_Visa_Sales_PKR /* Adjust based on your needs */;
                agent.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                newAzad_Visa_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
                agent.payment_In_Schema.remaining_Curr +=
                newAzad_Visa_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
                agent.payment_In_Schema.remaining_Balance +=
                newAzad_Visa_Sales_PKR /* Adjust based on your needs */;
              await agent.save();
              break
            }
          }
        }
       
      }

      // Deleting Azad Candidates
      try {
        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInTicketCandidate = await AzadCandidate.findOne({
          "payment_In_Schema.supplierName": name,
          "payment_In_Schema.entry_Mode": entry_Mode,
          "payment_In_Schema.pp_No": pp_No,
        });

        if (existingPaymentInTicketCandidate) {
          existingPaymentInTicketCandidate.payment_In_Schema = null;
          await existingPaymentInTicketCandidate.save();
        }
      } catch (error) {
        console.log(error);
      }

      try {
        // Check if the supplier with the given name and entry mode exists
        const existingPaymentOutTicketCandidate = await AzadCandidate.findOne({
          "payment_Out_Schema.supplierName": name,
          "payment_Out_Schema.entry_Mode": entry_Mode,
          "payment_Out_Schema.pp_No": pp_No,
        });

        if (existingPaymentOutTicketCandidate) {
          existingPaymentOutTicketCandidate.payment_Out_Schema = null;
          await existingPaymentOutTicketCandidate.save();
        }
      } catch (error) {
        console.log(error);
      }

      // Ticket Suppliers Sections

      // Update the Supplierd With PaymentIn by removing the person from the persons array
      if (
        ticket_Reference_In_Name !== undefined &&
        ticket_Reference_In_Name !== null &&
        ticket_Reference_In_Name !== ""
      ) {

        for (const supplier of ticketSuppliers){
          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            let ticketSupplierOutPersonIndex;

            ticketSupplierOutPersonIndex =
            supplier?.payment_Out_Schema?.persons.findIndex(
                (person) =>
                  person.name === name &&
                  person.entry_Mode === entry_Mode &&
                  person.pp_No === pp_No
              );
  
            // If the person is found, remove it from the persons array
            if (ticketSupplierOutPersonIndex !== -1) {
              supplier?.payment_Out_Schema?.persons.splice(
                ticketSupplierOutPersonIndex,
                1
              );
              supplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                newTicket_Purchase_PKR /* Adjust based on your needs */;
                supplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                newTicket_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
                supplier.payment_Out_Schema.remaining_Curr +=
                newTicket_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
                supplier.payment_Out_Schema.remaining_Balance +=
                newTicket_Purchase_PKR /* Adjust based on your needs */;
              await supplier.save();
              break
            }
          }
        }

      }

      if (
        ticket_Reference_Out_Name !== undefined &&
        ticket_Reference_Out_Name !== null &&
        ticket_Reference_Out_Name !== ""
      ) {
       
        for(const supplier of ticketSuppliers){
          if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
            let ticketSupplierInPersonIndex;

            ticketSupplierInPersonIndex =
            supplier?.payment_In_Schema?.persons.findIndex(
                (person) =>
                  person.name === name &&
                  person.entry_Mode === entry_Mode &&
                  person.pp_No === pp_No
              );
  
            // If the person is found, remove it from the persons array
            if (ticketSupplierInPersonIndex !== -1) {
              supplier?.payment_In_Schema?.persons.splice(
                ticketSupplierInPersonIndex,
                1
              );
              supplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                newTicket_Sales_PKR /* Adjust based on your needs */;
                supplier.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                newTicket_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
                supplier.payment_In_Schema.remaining_Curr +=
                newTicket_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
                supplier.payment_In_Schema.remaining_Balance +=
                newTicket_Sales_PKR /* Adjust based on your needs */;
              await supplier.save();
              break
            }
          }
        }
       
      }

      if (
        ticket_Reference_In_Name !== undefined &&
        ticket_Reference_In_Name !== null &&
        ticket_Reference_In_Name !== ""
      ) {
       for(const agent of ticketAgents){
        if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
          let ticketAgentOutPersonIndex;

          ticketAgentOutPersonIndex =
          agent?.payment_Out_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );

          // If the person is found, remove it from the persons array
          if (ticketAgentOutPersonIndex !== -1) {
            agent?.payment_Out_Schema?.persons.splice(
              ticketAgentOutPersonIndex,
              1
            );
            agent.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              newTicket_Purchase_PKR /* Adjust based on your needs */;
              agent.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              newTicket_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
              agent.payment_Out_Schema.remaining_Curr +=
              newTicket_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
              agent.payment_Out_Schema.remaining_Balance +=
              newTicket_Purchase_PKR /* Adjust based on your needs */;
            await agent.save();
            break
          }
        }
       }
      
      }

      if (
        ticket_Reference_Out_Name !== undefined &&
        ticket_Reference_Out_Name !== null &&
        ticket_Reference_Out_Name !== ""
      ) {
        for(const agent of ticketAgents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            let ticketAgentInPersonIndex;

            ticketAgentInPersonIndex =
            agent?.payment_In_Schema?.persons.findIndex(
                (person) =>
                  person.name === name &&
                  person.entry_Mode === entry_Mode &&
                  person.pp_No === pp_No
              );
  
            // If the person is found, remove it from the persons array
            if (ticketAgentInPersonIndex !== -1) {
              agent?.payment_In_Schema?.persons.splice(
                ticketAgentInPersonIndex,
                1
              );
              agent.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                newTicket_Sales_PKR /* Adjust based on your needs */;
                agent.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                newTicket_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
                agent.payment_In_Schema.remaining_Curr +=
                newTicket_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
                agent.payment_In_Schema.remaining_Balance +=
                newTicket_Sales_PKR /* Adjust based on your needs */;
              await agent.save();
              break
            }
          }
        }
     
      }

      //  Ticket Candidate Payment In/Out Schema Updation

      // Deleting Ticket Candidates

      try {
        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInTicketCandidate = await TicketCandidate.findOne({
          "payment_In_Schema.supplierName": name,
          "payment_In_Schema.entry_Mode": entry_Mode,
          "payment_In_Schema.pp_No": pp_No,
        });

        if (existingPaymentInTicketCandidate) {
          existingPaymentInTicketCandidate.payment_In_Schema = null;
          await existingPaymentInTicketCandidate.save();
        }
      } catch (error) {
        console.log(error);
      }

      try {
        // Check if the supplier with the given name and entry mode exists
        const existingPaymentOutTicketCandidate = await TicketCandidate.findOne(
          {
            "payment_Out_Schema.supplierName": name,
            "payment_Out_Schema.entry_Mode": entry_Mode,
            "payment_Out_Schema.pp_No": pp_No,
          }
        );

        if (existingPaymentOutTicketCandidate) {
          existingPaymentOutTicketCandidate.payment_Out_Schema = null;
          await existingPaymentOutTicketCandidate.save();
        }
      } catch (error) {
        console.log(error);
      }

      // Visit Suppliers  Sections

      // Update the Supplierd With PaymentIn by removing the person from the persons array
      if (
        visit_Reference_In_Name !== undefined &&
        visit_Reference_In_Name !== null &&
        visit_Reference_In_Name !== ""
      ) {

        for(const supplier of visitSuppliers){
          if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.persons){
            let visitSupplierOutPersonIndex;

            visitSupplierOutPersonIndex =
            supplier?.payment_Out_Schema?.persons.findIndex(
                (person) =>
                  person.name === name &&
                  person.entry_Mode === entry_Mode &&
                  person.pp_No === pp_No
              );
            // If the person is found, remove it from the persons array
            if (visitSupplierOutPersonIndex !== -1) {
              supplier?.payment_Out_Schema?.persons.splice(
                visitSupplierOutPersonIndex,
                1
              );
              supplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                newVisit_Purchase_PKR /* Adjust based on your needs */;
                supplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                newVisit_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
                supplier.payment_Out_Schema.remaining_Curr +=
                newVisit_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
                supplier.payment_Out_Schema.remaining_Balance +=
                newVisit_Purchase_PKR /* Adjust based on your needs */;
              await supplier.save();
              break
            }
          }
        }
       
      }

      if (
        visit_Reference_Out_Name !== undefined &&
        visit_Reference_Out_Name !== null &&
        visit_Reference_Out_Name !== ""
      ) {
       for(const supplier of visitSuppliers){
        if(supplier.payment_In_Schema && supplier.payment_In_Schema.persons){
          let visitSupplierInPersonIndex;

          visitSupplierInPersonIndex =
          supplier?.payment_In_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );

          // If the person is found, remove it from the persons array
          if (visitSupplierInPersonIndex !== -1) {
            supplier?.payment_In_Schema?.persons.splice(
              visitSupplierInPersonIndex,
              1
            );
            supplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              newVisit_Sales_PKR /* Adjust based on your needs */;
              supplier.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
              newVisit_Sales_Rate_Oth_Curr /* Adjust based on your needs */;
              supplier.payment_In_Schema.remaining_Curr +=
              newVisit_Sales_Rate_Oth_Curr /* Adjust based on your needs */;
              supplier.payment_In_Schema.remaining_Balance +=
              newVisit_Sales_PKR /* Adjust based on your needs */;
            await supplier.save();
            break
          }
        }
       }
       
      }

      if (
        visit_Reference_In_Name !== undefined &&
        visit_Reference_In_Name !== null &&
        visit_Reference_In_Name !== ""
      ) {
        
        for(const agent of visitAgents){
          if(agent.payment_Out_Schema && agent.payment_Out_Schema.persons){
            let visitAgentOutPersonIndex;

            visitAgentOutPersonIndex =
            agent?.payment_Out_Schema?.persons.findIndex(
                (person) =>
                  person.name === name &&
                  person.entry_Mode === entry_Mode &&
                  person.pp_No === pp_No
              );
  
            // If the person is found, remove it from the persons array
            if (visitAgentOutPersonIndex !== -1) {
              agent?.payment_Out_Schema?.persons.splice(
                visitAgentOutPersonIndex,
                1
              );
              agent.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                newVisit_Purchase_PKR /* Adjust based on your needs */;
                agent.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                newVisit_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
                agent.payment_Out_Schema.remaining_Curr +=
                newVisit_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
                agent.payment_Out_Schema.remaining_Balance +=
                newVisit_Purchase_PKR /* Adjust based on your needs */;
              await agent.save();
              break
            }
          }
        }
        
      }

      if (
        visit_Reference_Out_Name !== undefined &&
        visit_Reference_Out_Name !== null &&
        visit_Reference_Out_Name !== ""
      ) {
        
        for(const agent of visitAgents){
          if(agent.payment_In_Schema && agent.payment_In_Schema.persons){
            let visitAgentInPersonIndex;

            visitAgentInPersonIndex =
            agent?.payment_In_Schema?.persons.findIndex(
                (person) =>
                  person.name === name &&
                  person.entry_Mode === entry_Mode &&
                  person.pp_No === pp_No
              );
            // If the person is found, remove it from the persons array
            if (visitAgentInPersonIndex !== -1) {
              agent?.payment_In_Schema?.persons.splice(
                visitAgentInPersonIndex,
                1
              );
              agent.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                newVisit_Sales_PKR /* Adjust based on your needs */;
                agent.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                newVisit_Sales_Rate_Oth_Curr /* Adjust based on your needs */;
                agent.payment_In_Schema.remaining_Curr +=
                newVisit_Sales_Rate_Oth_Curr /* Adjust based on your needs */;
                agent.payment_In_Schema.remaining_Balance +=
                newVisit_Sales_PKR /* Adjust based on your needs */;
              await agent.save();
              break
            }
          }
        }
      
      }

      // Deleting Ticket Candidates

      try {
        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInVisitCandidate = await VisitCandidate.findOne({
          "payment_In_Schema.supplierName": name,
          "payment_In_Schema.entry_Mode": entry_Mode,
          "payment_In_Schema.pp_No": pp_No,
        });

        if (existingPaymentInVisitCandidate) {
          existingPaymentInVisitCandidate.payment_In_Schema = null;
          await existingPaymentInVisitCandidate.save();
        }
      } catch (error) {
        console.log(error);
      }

      try {
        // Check if the supplier with the given name and entry mode exists
        const existingPaymentOutVisitCandidate = await VisitCandidate.findOne({
          "payment_Out_Schema.supplierName": name,
          "payment_Out_Schema.entry_Mode": entry_Mode,
          "payment_Out_Schema.pp_No": pp_No,
        });

        if (existingPaymentOutVisitCandidate) {
          existingPaymentOutVisitCandidate.payment_Out_Schema = null;
          await existingPaymentOutVisitCandidate.save();
        }
      } catch (error) {
        console.log(error);
      }

      // Protector Section
      
    for(const protector of protectors){
      if (protector.payment_Out_Schema &&protector.payment_Out_Schema.persons){
        let protectorOutPersonIndex;

        protectorOutPersonIndex =
        protector?.payment_Out_Schema?.persons.findIndex(
            (person) =>
              person.name === name &&
              person.entry_Mode === entry_Mode &&
              person.pp_No === pp_No
          );
        // If the person is found, remove it from the persons array
        if (protectorOutPersonIndex !== -1) {
          protector?.payment_Out_Schema?.persons.splice(
            protectorOutPersonIndex,
            1
          );
          protector.payment_Out_Schema.total_Protector_Price_Out_PKR +=
            newProtectorPriceIn /* Adjust based on your needs */;
            protector.payment_Out_Schema.total_Protector_Price_Out_Curr +=
            newProtector_Price_In_Oth_Cur /* Adjust based on your needs */;
            protector.payment_Out_Schema.remaining_Curr +=
            newProtector_Price_In_Oth_Cur /* Adjust based on your needs */;
            protector.payment_Out_Schema.remaining_Balance +=
            newProtectorPriceIn /* Adjust based on your needs */;
          await protector.save();
          break
        }
      }
    }
      

      res
        .status(200)
        .json({
          data: entryToDelete,
          message: `${name}'s Record deleted Successfully`,
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}
