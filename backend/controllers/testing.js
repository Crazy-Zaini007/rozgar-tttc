const updateEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { entryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return res.status(400).json({ message: "Invalid Entry ID" });
    }

    const entryToUpdate = await Entries.findById(entryId);

    if (!entryToUpdate) {
      return res.status(404).json({ message: "Entry not found" });
    }
    if (entryToUpdate) {
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
        protector_Reference_In,
        protector_Reference_In_Name,
        protector_Price_In,
        protector_Price_In_Oth_Cur,
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
      } = req.body;
      
      if(reference_Out && reference_Out.toLowerCase()==='candidate'){
        reference_Out_Name=name
      }
      if(reference_In && reference_In.toLowerCase()==='candidate'){
        reference_In_Name=name
      }

      if(visit_Reference_Out && visit_Reference_Out.toLowerCase()==='candidate'){
        visit_Reference_Out_Name=name
      }

      if(visit_Reference_In && visit_Reference_In.toLowerCase()==='candidate'){
        visit_Reference_In_Name=name
      }

      if(ticket_Reference_Out && ticket_Reference_Out.toLowerCase()==='candidate'){
        ticket_Reference_Out_Name=name
      }

      if(ticket_Reference_In && ticket_Reference_In.toLowerCase()==='candidate'){
        ticket_Reference_In_Name=name
      }
      if(azad_Visa_Reference_Out && azad_Visa_Reference_Out.toLowerCase()==='candidate'){
        azad_Visa_Reference_Out_Name=name
      }

      if(azad_Visa_Reference_In && azad_Visa_Reference_In.toLowerCase()==='candidate'){
        azad_Visa_Reference_In_Name=name
      }

      console.log('reference_In',reference_In)
      console.log('reference_In_Name',reference_In_Name)
      console.log('reference_Out',reference_Out)
      console.log('reference_Out_Name',reference_Out_Name)
      const agents=await Agents.find({})
      const suppliers=await Suppliers.find({})
      const azadSuppliers=await AzadSupplier.find({})
      const azadAgents=await AzadAgents.find({})
      const ticketSuppliers=await TicketSuppliers.find({})
      const ticketAgents=await TicketAgents.find({})
      const visitSuppliers=await VisitSuppliers.find({})
      const visitAgents=await VisitAgents.find({})
      const protectors=await Protector.find({})

      // Update pictures if provided
      if (final_Status.trim().toLowerCase() === 'offer letter' || final_Status.trim().toLowerCase() === 'offer latter') {
        const newReminder = new Reminders({
          type: "Offer Letter",
          content: `${name}'s Final Status is updated to Offer Letter.`,
          date: new Date().toISOString().split("T")[0]
        });
        await newReminder.save();
      }
      
      if (final_Status.trim().toLowerCase() === 'e number' || final_Status.trim().toLowerCase() === 'e_number') {

        const newReminder = new Reminders({
          type: "E Number",
          content: `${name}'s Final Status is updated to E Number.`,
          date: new Date().toISOString().split("T")[0]
        });
        await newReminder.save();
      }
      
      if (final_Status.trim().toLowerCase() === 'qvc' || final_Status.trim().toLowerCase() === 'q_v_c') {
        const newReminder = new Reminders({
          type: "QVC",
          content: `${name}'s Final Status is updated to QVC.`,
          date: new Date().toISOString().split("T")[0]
        });
        await newReminder.save();
      }
      
      if (final_Status.trim().toLowerCase() === 'visa issued' || final_Status.trim().toLowerCase() === 'visa_issued' || final_Status.trim().toLowerCase() === 'vissa issued' || final_Status.trim().toLowerCase() === 'vissa_issued') {
        const newReminder = new Reminders({
          type: "Visa Issued",
          content: `${name}'s Final Status is updated to Visa Issued.`,
          date: new Date().toISOString().split("T")[0]
        });
        await newReminder.save();
      }
      
      if (final_Status.trim().toLowerCase() === 'ptn' || final_Status.trim().toLowerCase() === 'p_t_n') {
        const newReminder = new Reminders({
          type: "PTN",
          content: `${name}'s Final Status is updated to PTN.`,
          date: new Date().toISOString().split("T")[0]
        });
        await newReminder.save();
      }
      
      if (final_Status.trim().toLowerCase() === 'ticket' || final_Status.trim().toLowerCase() === 'tiket') {
        
        const newReminder = new Reminders({
          type: "Ticket",
          content: `${name}'s Final Status is updated to Ticket.`,
          date: new Date().toISOString().split("T")[0]
        });
        await newReminder.save();
      }
let mainPicture
let visitPicture
let ticketPicture
let azadPicture



      if (picture) {
        try {
          mainPicture = await cloudinary.uploader.upload(picture, {
            upload_preset: "rozgar",
          });
          if (!mainPicture) {
            return res
              .status(500)
              .json({ message: "Error uploading the main picture" });
          }
          entryToUpdate.picture = mainPicture.secure_url;
        } catch (uploadError) {
          console.error(uploadError);
          return res
            .status(500)
            .json({ message: "Error uploading the main picture" });
        }
      }
      if (visit_Section_Picture) {
        try {
          visitPicture = await cloudinary.uploader.upload(
            visit_Section_Picture,
            {
              upload_preset: "rozgar",
            }
          );
          if (!visitPicture) {
            return res
              .status(500)
              .json({ message: "Error uploading Visit Section Picture" });
          }
          entryToUpdate.visit_Section_Picture = visitPicture.secure_url;
        } catch (uploadError) {
          console.error(uploadError);
          return res
            .status(500)
            .json({ message: "Error uploading Visit Section Picture" });
        }
      }
      if (ticket_Section_Picture) {
        try {
          ticketPicture = await cloudinary.uploader.upload(
            ticket_Section_Picture,
            {
              upload_preset: "rozgar",
            }
          );
          if (!ticketPicture) {
            return res
              .status(500)
              .json({ message: "Error uploading Visit Section Picture" });
          }
          entryToUpdate.ticket_Section_Picture = ticketPicture.secure_url;
        } catch (uploadError) {
          console.error(uploadError);
          return res
            .status(500)
            .json({ message: "Error uploading Visit Section Picture" });
        }
      }
      if (azad_Visa_Section_Picture) {
        try {
          azadPicture = await cloudinary.uploader.upload(
            azad_Visa_Section_Picture,
            {
              upload_preset: "rozgar",
            }
          );
          if (!azadPicture) {
            return res
              .status(500)
              .json({ message: "Error uploading Visit Section Picture" });
          }
          entryToUpdate.azad_Visa_Section_Picture = azadPicture.secure_url;
        } catch (uploadError) {
          console.error(uploadError);
          return res
            .status(500)
            .json({ message: "Error uploading Visit Section Picture" });
        }
      }

      // Updating the Entry values in all sections

      // For Suppliers Reference_In
      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "supplier" && reference_In.toLowerCase() === "supplier" && entryToUpdate.reference_In_Name === reference_In_Name) {
        //Reference In for Suppliers 
        const existingSupplierPaymentIn = await Suppliers.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.reference_In_Name,
        });
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {

          const supplierInPersonIndex =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {

            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = mainPicture?mainPicture.secure_url:supplierInPersonIndex.picture;


            // Calculate the differences
            const visa_Purchase_Rate_PKR_Diff = entryToUpdate.visa_Purchase_Rate_PKR - visa_Purchase_Rate_PKR
            const visa_Purchase_Rate_Oth_Cur_Diff = entryToUpdate.visa_Purchase_Rate_Oth_Cur - visa_Purchase_Rate_Oth_Cur
            supplierInPersonIndex.visa_Price_Out_PKR -= visa_Purchase_Rate_PKR_Diff
            supplierInPersonIndex.remaining_Price -= visa_Purchase_Rate_PKR_Diff
            supplierInPersonIndex.visa_Price_Out_Curr -= visa_Purchase_Rate_Oth_Cur_Diff
            supplierInPersonIndex.remaining_Curr -= visa_Purchase_Rate_Oth_Cur_Diff

            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_PKR -= visa_Purchase_Rate_PKR_Diff;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -= visa_Purchase_Rate_PKR_Diff;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_Curr -= visa_Purchase_Rate_Oth_Cur_Diff;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -= visa_Purchase_Rate_Oth_Cur_Diff;

            await existingSupplierPaymentIn.save()

          }

        }


      }

      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "supplier" && reference_In.toLowerCase() === "supplier" && entryToUpdate.reference_In_Name !== reference_In_Name) {

        for (const agent of suppliers){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/supplier/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await Suppliers.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.reference_In_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_PKR -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutSupplier = await Suppliers.findOne({
          "payment_Out_Schema.supplierName": reference_In_Name,
          "payment_Out_Schema.status": 'Open',
        });

        if (!existingPaymentOutSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutSupplier = new Suppliers({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_In_Name,
              total_Visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Balance: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              total_Visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              opening:visa_Purchase_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  trade,
                  country,
                  visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,
                  remaining_Price: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,
                  visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutSupplier.save();

        } else {
          const existingPersonIndex =
            existingPaymentOutSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_PKR +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Balance +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;

            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutSupplier.payment_Out_Schema.persons.push({
              name,
              picture : mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              trade,
              contact,
              country,
              visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Price: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });

            // Update total_Visa_In_Price_PKR and other fields using $inc
            await existingPaymentOutSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Visa_Price_Out_PKR":
                  visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0,
                "payment_Out_Schema.remaining_Balance": visa_Purchase_Rate_PKR
                  ? visa_Purchase_Rate_PKR
                  : 0,

                "payment_Out_Schema.total_Visa_Price_Out_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
                "payment_Out_Schema.remaining_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
              },
            });
          }

          await existingPaymentOutSupplier.save();

        }
      }

      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "supplier" && reference_In.toLowerCase() === "agent") {

 for (const agent of suppliers){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/supplier/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

        const existingSupplierPaymentIn = await Suppliers.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.reference_In_Name,
        })

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_PKR -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutSupplier = await Agents.findOne({
          "payment_Out_Schema.supplierName": reference_In_Name,
          "payment_Out_Schema.status": 'Open',
        });

        if (!existingPaymentOutSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutSupplier = new Agents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_In_Name,
              total_Visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Balance: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              total_Visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              curr_Country: cur_Country_Two,
              opening:visa_Purchase_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  trade,
                  country,
                  visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,
                  remaining_Price: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,

                  visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutSupplier.save();

        } else {
          const existingPersonIndex =
            existingPaymentOutSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_PKR +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Balance +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;

            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutSupplier.payment_Out_Schema.persons.push({
              name,
              picture : mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              trade,
              contact,
              country,
              visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Price: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });

            // Update total_Visa_In_Price_PKR and other fields using $inc
            await existingPaymentOutSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Visa_Price_Out_PKR":
                  visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0,
                "payment_Out_Schema.remaining_Balance": visa_Purchase_Rate_PKR
                  ? visa_Purchase_Rate_PKR
                  : 0,

                "payment_Out_Schema.total_Visa_Price_Out_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
                "payment_Out_Schema.remaining_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
              },
            });
          }

          await existingPaymentOutSupplier.save();

        }

      }


      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "supplier" && (reference_In.toLowerCase() === "candidate"||reference_In.toLowerCase() === "direct" )) {  
 for (const agent of suppliers){
  if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
   let allCandPayments=agent.payment_Out_Schema.candPayments
   for (const payment of allCandPayments){
    let allPayments=payment.payments
    for (const candidatePayment of allPayments){
      if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
        return  res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/supplier/cand_vise_payment_details'})
        break;
      }
    }
   }
  }
 }

        const existingSupplierPaymentIn = await Suppliers.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.reference_In_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_PKR -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }
        // Check if the supplier with the given name exists
        const existingPaymentOutCandidate = await Candidate.findOne({
          "payment_Out_Schema.supplierName": name,
          "payment_Out_Schema.entry_Mode": entry_Mode,
          "payment_Out_Schema.pp_No": pp_No,
        });

        if (!existingPaymentOutCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutCandidate = new Candidate({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : mainPicture?mainPicture.secure_url:picture,
              total_Visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Balance: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              total_Visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutCandidate.save();
        }
      }

      // For Agents Reference_In
      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "agent" && reference_In.toLowerCase() === "agent" && entryToUpdate.reference_In_Name === reference_In_Name) {
        //Reference In for Suppliers 
        const existingSupplierPaymentIn = await Agents.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.reference_In_Name,
        });
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {

          const supplierInPersonIndex =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {

            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = mainPicture?mainPicture.secure_url:supplierInPersonIndex.picture;

            // Calculate the differences
            const visa_Purchase_Rate_PKR_Diff = entryToUpdate.visa_Purchase_Rate_PKR - visa_Purchase_Rate_PKR
            const visa_Purchase_Rate_Oth_Cur_Diff = entryToUpdate.visa_Purchase_Rate_Oth_Cur - visa_Purchase_Rate_Oth_Cur
            supplierInPersonIndex.visa_Price_Out_PKR -= visa_Purchase_Rate_PKR_Diff
            supplierInPersonIndex.remaining_Price -= visa_Purchase_Rate_PKR_Diff
            supplierInPersonIndex.visa_Price_Out_Curr -= visa_Purchase_Rate_Oth_Cur_Diff
            supplierInPersonIndex.remaining_Curr -= visa_Purchase_Rate_Oth_Cur_Diff

            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_PKR -= visa_Purchase_Rate_PKR_Diff;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -= visa_Purchase_Rate_PKR_Diff;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_Curr -= visa_Purchase_Rate_Oth_Cur_Diff;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -= visa_Purchase_Rate_Oth_Cur_Diff;

            await existingSupplierPaymentIn.save()

          }

        }


      }

      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "agent" && reference_In.toLowerCase() === "agent" && entryToUpdate.reference_In_Name !== reference_In_Name) {
        
       for (const agent of agents){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/agents/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await Agents.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.reference_In_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_PKR -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutSupplier = await Agents.findOne({
          "payment_Out_Schema.supplierName": reference_In_Name,
          "payment_Out_Schema.status": 'Open',
        });

        if (!existingPaymentOutSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutSupplier = new Agents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_In_Name,
              total_Visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Balance: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              total_Visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              curr_Country: cur_Country_Two,
              opening:visa_Purchase_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  trade,
                  country,
                  visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,
                  remaining_Price: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,

                  visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutSupplier.save();

        } else {
          const existingPersonIndex =
            existingPaymentOutSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_PKR +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Balance +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;

            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutSupplier.payment_Out_Schema.persons.push({
              name,
              picture : mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              trade,
              contact,
              country,
              visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Price: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });

            // Update total_Visa_In_Price_PKR and other fields using $inc
            await existingPaymentOutSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Visa_Price_Out_PKR":
                  visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0,
                "payment_Out_Schema.remaining_Balance": visa_Purchase_Rate_PKR
                  ? visa_Purchase_Rate_PKR
                  : 0,

                "payment_Out_Schema.total_Visa_Price_Out_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
                "payment_Out_Schema.remaining_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
              },
            });
          }

          await existingPaymentOutSupplier.save();

        }
      }

      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "agent" && reference_In.toLowerCase() === "supplier") {

       for (const agent of agents){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/agents/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

        const existingSupplierPaymentIn = await Agents.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.reference_In_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_PKR -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutSupplier = await Suppliers.findOne({
          "payment_Out_Schema.supplierName": reference_In_Name,
          "payment_Out_Schema.status": "Open",
        });

        if (!existingPaymentOutSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutSupplier = new Suppliers({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_In_Name,
              total_Visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Balance: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              total_Visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              opening:visa_Purchase_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  trade,
                  country,
                  visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,
                  remaining_Price: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,

                  visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutSupplier.save();

        } else {
          const existingPersonIndex =
            existingPaymentOutSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_PKR +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Balance +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;

            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutSupplier.payment_Out_Schema.persons.push({
              name,
              picture : mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              trade,
              contact,
              country,
              visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Price: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });

            // Update total_Visa_In_Price_PKR and other fields using $inc
            await existingPaymentOutSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Visa_Price_Out_PKR":
                  visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0,
                "payment_Out_Schema.remaining_Balance": visa_Purchase_Rate_PKR
                  ? visa_Purchase_Rate_PKR
                  : 0,

                "payment_Out_Schema.total_Visa_Price_Out_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
                "payment_Out_Schema.remaining_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
              },
            });
          }

          await existingPaymentOutSupplier.save();

        }

      }


      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "agent" && (reference_In.toLowerCase() === "candidate"||reference_In.toLowerCase() === "direct" )) {

        
       for (const agent of agents){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/agents/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }

        const existingSupplierPaymentIn = await Agents.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.reference_In_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_PKR -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Visa_Price_Out_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }
        // Check if the supplier with the given name exists
        const existingPaymentOutCandidate = await Candidate.findOne({
          "payment_Out_Schema.supplierName": name,
          "payment_Out_Schema.entry_Mode": entry_Mode,
          "payment_Out_Schema.pp_No": pp_No,
        });

        if (!existingPaymentOutCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutCandidate = new Candidate({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              picture : mainPicture?mainPicture.secure_url:picture,
              supplierName: name,
              total_Visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Balance: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              total_Visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutCandidate.save();
        }
      }


      // For Candidates Reference_In
      if (entryToUpdate.reference_In && (entryToUpdate.reference_In.toLowerCase() === "candidate"||entryToUpdate.reference_In.toLowerCase() === "direct" ) && (reference_In.toLowerCase() === "candidate"||reference_In.toLowerCase() === "direct" ) && entryToUpdate.reference_In_Name === reference_In_Name) {

        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInCandidate = await Candidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });

        if (existingPaymentInCandidate) {
          (existingPaymentInCandidate.payment_Out_Schema.supplierName = name),
            (existingPaymentInCandidate.payment_Out_Schema.pp_No = pp_No),
            (existingPaymentInCandidate.payment_Out_Schema.entry_Mode =
              entry_Mode),
              (existingPaymentInCandidate.payment_Out_Schema.picture =
                mainPicture?mainPicture.secure_url:existingPaymentInCandidate.payment_Out_Schema.picture),
            (existingPaymentInCandidate.payment_Out_Schema.trade = trade),
            (existingPaymentInCandidate.payment_Out_Schema.country = country),
            (existingPaymentInCandidate.payment_Out_Schema.contact = contact),
            (existingPaymentInCandidate.payment_Out_Schema.company = company),
            (existingPaymentInCandidate.payment_Out_Schema.final_Status =
              final_Status),
            (existingPaymentInCandidate.payment_Out_Schema.flight_Date =
              flight_Date),
            (existingPaymentInCandidate.payment_Out_Schema.total_Visa_Price_Out_PKR -=
              entryToUpdate?.visa_Purchase_Rate_PKR ??
                0 - visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0);
          existingPaymentInCandidate.payment_Out_Schema.remaining_Balance -=
            entryToUpdate?.visa_Purchase_Rate_PKR ??
              0 - visa_Purchase_Rate_PKR
              ? visa_Purchase_Rate_PKR
              : 0;
          existingPaymentInCandidate.payment_Out_Schema.total_Visa_Price_Out_Curr -=
            entryToUpdate?.visa_Purchase_Rate_Oth_Cur ??
              0 - visa_Purchase_Rate_Oth_Cur
              ? visa_Purchase_Rate_Oth_Cur
              : 0;
          existingPaymentInCandidate.payment_Out_Schema.remaining_Curr -=
            entryToUpdate?.visa_Purchase_Rate_Oth_Cur ??
              0 - visa_Purchase_Rate_Oth_Cur
              ? visa_Purchase_Rate_Oth_Cur
              : 0;

          await existingPaymentInCandidate.save();
        }


      }

      if (entryToUpdate.reference_In && (entryToUpdate.reference_In.toLowerCase() === "candidate" ||entryToUpdate.reference_In.toLowerCase() === "direct") && reference_In.toLowerCase() === "supplier") {
        const existingPaymentInCandidate = await Candidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_Out_Schema = null
          await existingPaymentInCandidate.save()
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutSupplier = await Suppliers.findOne({
          "payment_Out_Schema.supplierName": reference_In_Name,
          "payment_Out_Schema.status": 'Open',
        });

        if (!existingPaymentOutSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutSupplier = new Suppliers({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_In_Name,
              total_Visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Balance: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              total_Visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              curr_Country: cur_Country_Two,
              opening:visa_Purchase_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  pp_No,
                  picture: mainPicture?mainPicture.secure_url:picture,
                  entry_Mode,
                  contact,
                  trade,
                  country,
                  visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,
                  remaining_Price: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,

                  visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutSupplier.save();

        } else {
          const existingPersonIndex =
            existingPaymentOutSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_PKR +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Balance +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;

            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutSupplier.payment_Out_Schema.persons.push({
              name,
              picture: mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              trade,
              contact,
              country,
              visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Price: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });

            // Update total_Visa_In_Price_PKR and other fields using $inc
            await existingPaymentOutSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Visa_Price_Out_PKR":
                  visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0,
                "payment_Out_Schema.remaining_Balance": visa_Purchase_Rate_PKR
                  ? visa_Purchase_Rate_PKR
                  : 0,

                "payment_Out_Schema.total_Visa_Price_Out_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
                "payment_Out_Schema.remaining_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
              },
            });
          }

          await existingPaymentOutSupplier.save();

        }

      }


      if (entryToUpdate.reference_In && (entryToUpdate.reference_In.toLowerCase() === "candidate" ||entryToUpdate.reference_In.toLowerCase() === "direct")  && reference_In.toLowerCase() === "agent") {
        const existingPaymentInCandidate = await Candidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_Out_Schema = null
          await existingPaymentInCandidate.save()
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutSupplier = await Agents.findOne({
          "payment_Out_Schema.supplierName": reference_In_Name,
          "payment_Out_Schema.status": 'Open',
        });

        if (!existingPaymentOutSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutSupplier = new Agents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_In_Name,
              total_Visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Balance: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              total_Visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              opening:visa_Purchase_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture: mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  trade,
                  country,
                  visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,
                  remaining_Price: visa_Purchase_Rate_PKR
                    ? visa_Purchase_Rate_PKR
                    : 0,

                  visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Purchase_Rate_Oth_Cur
                    ? visa_Purchase_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutSupplier.save();
          paymentInfo.newPaymentOutSupplier = newPaymentOutSupplier;
        } else {
          const existingPersonIndex =
            existingPaymentOutSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_PKR +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Balance +=
              visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;

            existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Curr +=
              visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutSupplier.payment_Out_Schema.persons.push({
              name,
              picture: mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              trade,
              contact,
              country,
              visa_Price_Out_PKR: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,
              remaining_Price: visa_Purchase_Rate_PKR
                ? visa_Purchase_Rate_PKR
                : 0,

              visa_Price_Out_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Purchase_Rate_Oth_Cur
                ? visa_Purchase_Rate_Oth_Cur
                : 0,
              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });

            // Update total_Visa_In_Price_PKR and other fields using $inc
            await existingPaymentOutSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Visa_Price_Out_PKR":
                  visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0,
                "payment_Out_Schema.remaining_Balance": visa_Purchase_Rate_PKR
                  ? visa_Purchase_Rate_PKR
                  : 0,

                "payment_Out_Schema.total_Visa_Price_Out_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
                "payment_Out_Schema.remaining_Curr":
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0,
              },
            });
          }

          await existingPaymentOutSupplier.save();
        }
      }


      // For Suppliers Reference_Out
      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "supplier" && reference_Out.toLowerCase() === "supplier" && entryToUpdate.reference_Out_Name === reference_Out_Name) {

        //Reference In for Suppliers 
        const existingSupplierPaymentIn = await Suppliers.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.reference_Out_Name,
        });
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {

          const supplierInPersonIndex =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {

            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = mainPicture?mainPicture.secure_url:supplierInPersonIndex.picture;

            // Calculate the differences
            const visa_Sale_Rate_PKR_Diff = entryToUpdate.visa_Sales_Rate_PKR - visa_Sales_Rate_PKR
            const visa_Sale_Rate_Oth_Cur_Diff = entryToUpdate.visa_Sale_Rate_Oth_Cur - visa_Sale_Rate_Oth_Cur
            supplierInPersonIndex.visa_Price_In_PKR -= visa_Sale_Rate_PKR_Diff
            supplierInPersonIndex.remaining_Price -= visa_Sale_Rate_PKR_Diff
            supplierInPersonIndex.visa_Price_In_Curr -= visa_Sale_Rate_Oth_Cur_Diff
            supplierInPersonIndex.remaining_Curr -= visa_Sale_Rate_Oth_Cur_Diff

            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_PKR -= visa_Sale_Rate_PKR_Diff;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -= visa_Sale_Rate_PKR_Diff;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_Curr -= visa_Sale_Rate_Oth_Cur_Diff;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -= visa_Sale_Rate_Oth_Cur_Diff;

            await existingSupplierPaymentIn.save()

          }
        }
      }

      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "supplier" && reference_Out.toLowerCase() === "supplier" && entryToUpdate.reference_Out_Name !== reference_Out_Name) {
        for (const agent of suppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return  res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/supplier/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await Suppliers.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.reference_Out_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_PKR -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentInSupplier = await Suppliers.findOne({
          "payment_In_Schema.supplierName": reference_Out_Name,
          "payment_In_Schema.supplierName": "Open",
        });

        if (!existingPaymentInSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentInSupplier = new Suppliers({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_Out_Name,
              total_Visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Balance: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,

              total_Visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              curr_Country: cur_Country_One,
              opening:visa_Sales_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  country,
                  trade,
                  visa_Price_In_PKR: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  remaining_Price: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentInSupplier.save();
         
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentInSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_PKR +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Balance +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentInSupplier.payment_In_Schema.persons.push({
              name,
              picture : mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              contact,
              country,
              trade,
              visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Price: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });
            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentInSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Visa_Price_In_PKR":
                  visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0,
                "payment_In_Schema.remaining_Balance": visa_Sales_Rate_PKR
                  ? visa_Sales_Rate_PKR
                  : 0,

                "payment_In_Schema.total_Visa_Price_In_Curr":
                  visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0,
                "payment_In_Schema.remaining_Curr": visa_Sale_Rate_Oth_Cur
                  ? visa_Sale_Rate_Oth_Cur
                  : 0,
              },
            });
          }

          await existingPaymentInSupplier.save();

        }
      }


      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "supplier" && reference_Out.toLowerCase() === "agent") {

        for (const agent of suppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return  res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/supplier/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await Suppliers.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.reference_Out_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_PKR -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentInSupplier = await Agents.findOne({
          "payment_In_Schema.supplierName": reference_Out_Name,
          "payment_In_Schema.status": 'Open',
        });

        if (!existingPaymentInSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentInSupplier = new Agents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_Out_Name,
              total_Visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Balance: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,

              total_Visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              curr_Country: cur_Country_One,
              opening:visa_Sales_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  country,
                  trade,
                  visa_Price_In_PKR: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  remaining_Price: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentInSupplier.save();
         
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentInSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_PKR +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Balance +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentInSupplier.payment_In_Schema.persons.push({
              name,
              picture : mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              contact,
              country,
              trade,
              visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Price: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });
            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentInSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Visa_Price_In_PKR":
                  visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0,
                "payment_In_Schema.remaining_Balance": visa_Sales_Rate_PKR
                  ? visa_Sales_Rate_PKR
                  : 0,

                "payment_In_Schema.total_Visa_Price_In_Curr":
                  visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0,
                "payment_In_Schema.remaining_Curr": visa_Sale_Rate_Oth_Cur
                  ? visa_Sale_Rate_Oth_Cur
                  : 0,
              },
            });
          }

          await existingPaymentInSupplier.save();

        }
      }


      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "supplier" && (reference_Out.toLowerCase() === "candidate" ||reference_Out.toLowerCase() === "direct") ) {
        
        for (const agent of suppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/supplier/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await Suppliers.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.reference_Out_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_PKR -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentInCandidate = await Candidate.findOne({
          "payment_In_Schema.supplierName": name,
          "payment_In_Schema.entry_Mode": entry_Mode,
          "payment_In_Schema.pp_No": pp_No,
        });

        if (!existingPaymentInCandidate) {
          // If the supplier does not exist with the same entry mode, create a new one
          const newPaymentInCandidate = new Candidate({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              picture : mainPicture?mainPicture.secure_url:picture,
              supplierName: name,
              total_Visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Balance: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,

              total_Visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              country: country,
              trade: trade,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            },
          });

          await newPaymentInCandidate.save();
        }
      }


      // For Agents Reference_Out
      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "agent" && reference_Out.toLowerCase() === "agent" && entryToUpdate.reference_Out_Name === reference_Out_Name) {

        //Reference In for Suppliers 
        const existingSupplierPaymentIn = await Agents.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.reference_Out_Name,
        });
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {

          const supplierInPersonIndex =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {

            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = mainPicture?mainPicture.secure_url:supplierInPersonIndex.picture;

            // Calculate the differences
            const visa_Sale_Rate_PKR_Diff = entryToUpdate.visa_Sales_Rate_PKR - visa_Sales_Rate_PKR
            const visa_Sale_Rate_Oth_Cur_Diff = entryToUpdate.visa_Sale_Rate_Oth_Cur - visa_Sale_Rate_Oth_Cur
            supplierInPersonIndex.visa_Price_In_PKR -= visa_Sale_Rate_PKR_Diff
            supplierInPersonIndex.remaining_Price -= visa_Sale_Rate_PKR_Diff
            supplierInPersonIndex.visa_Price_In_Curr -= visa_Sale_Rate_Oth_Cur_Diff
            supplierInPersonIndex.remaining_Curr -= visa_Sale_Rate_Oth_Cur_Diff

            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_PKR -= visa_Sale_Rate_PKR_Diff;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -= visa_Sale_Rate_PKR_Diff;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_Curr -= visa_Sale_Rate_Oth_Cur_Diff;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -= visa_Sale_Rate_Oth_Cur_Diff;

            await existingSupplierPaymentIn.save()

          }
        }
      }

      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "agent" && reference_Out.toLowerCase() === "agent" && entryToUpdate.reference_Out_Name !== reference_Out_Name) {

        for (const agent of agents){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/agents/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await Agents.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.reference_Out_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_PKR -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentInSupplier = await Agents.findOne({
          "payment_In_Schema.supplierName": reference_Out_Name,
          "payment_In_Schema.status": "Open",
        });

        if (!existingPaymentInSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentInSupplier = new Agents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_Out_Name,
              total_Visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Balance: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,

              total_Visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              curr_Country: cur_Country_One,
              opening:visa_Sales_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  country,
                  trade,
                  visa_Price_In_PKR: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  remaining_Price: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentInSupplier.save();
         
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentInSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_PKR +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Balance +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentInSupplier.payment_In_Schema.persons.push({
              name,
              picture : mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              contact,
              country,
              trade,
              visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Price: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });
            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentInSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Visa_Price_In_PKR":
                  visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0,
                "payment_In_Schema.remaining_Balance": visa_Sales_Rate_PKR
                  ? visa_Sales_Rate_PKR
                  : 0,

                "payment_In_Schema.total_Visa_Price_In_Curr":
                  visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0,
                "payment_In_Schema.remaining_Curr": visa_Sale_Rate_Oth_Cur
                  ? visa_Sale_Rate_Oth_Cur
                  : 0,
              },
            });
          }

          await existingPaymentInSupplier.save();

        }
      }


      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "agent" && reference_Out.toLowerCase() === "supplier") {

        for (const agent of agents){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/agents/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await Agents.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.reference_Out_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_PKR -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentInSupplier = await Suppliers.findOne({
          "payment_In_Schema.supplierName": reference_Out_Name,
          "payment_In_Schema.status": "Open",
        });

        if (!existingPaymentInSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentInSupplier = new Suppliers({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_Out_Name,
              total_Visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Balance: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,

              total_Visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              curr_Country: cur_Country_One,
              opening:visa_Sales_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  country,
                  trade,
                  visa_Price_In_PKR: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  remaining_Price: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentInSupplier.save();
       
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentInSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_PKR +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Balance +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentInSupplier.payment_In_Schema.persons.push({
              name,
              picture : mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              contact,
              country,
              trade,
              visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Price: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });
            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentInSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Visa_Price_In_PKR":
                  visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0,
                "payment_In_Schema.remaining_Balance": visa_Sales_Rate_PKR
                  ? visa_Sales_Rate_PKR
                  : 0,

                "payment_In_Schema.total_Visa_Price_In_Curr":
                  visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0,
                "payment_In_Schema.remaining_Curr": visa_Sale_Rate_Oth_Cur
                  ? visa_Sale_Rate_Oth_Cur
                  : 0,
              },
            });
          }

          await existingPaymentInSupplier.save();

        }
      }


      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "agent" &&(reference_Out.toLowerCase() === "candidate" ||reference_Out.toLowerCase() === "direct")) {
        for (const agent of agents){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return  res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/agents/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await Agents.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.reference_Out_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_PKR -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentInCandidate = await Candidate.findOne({
          "payment_In_Schema.supplierName": name,
          "payment_In_Schema.entry_Mode": entry_Mode,
          "payment_In_Schema.pp_No": pp_No,
        });

        if (!existingPaymentInCandidate) {
          // If the supplier does not exist with the same entry mode, create a new one
          const newPaymentInCandidate = new Candidate({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : mainPicture?mainPicture.secure_url:picture,
              total_Visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Balance: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,

              total_Visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              country: country,
              trade: trade,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            },
          });

          await newPaymentInCandidate.save();
        }
      }



      // For Candidate Reference_Out
      if (entryToUpdate.reference_Out && (entryToUpdate.reference_Out.toLowerCase() === "candidate" ||entryToUpdate.reference_Out.toLowerCase() === "direct") && (reference_Out.toLowerCase() === "candidate" ||reference_Out.toLowerCase() === "direct") && entryToUpdate.reference_Out_Name === reference_Out_Name) {

        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInCandidate = await Candidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });

        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_In_Schema.supplierName = name,
          existingPaymentInCandidate.payment_In_Schema.picture = mainPicture?mainPicture.secure_url:existingPaymentInCandidate.payment_In_Schema.picture,
            existingPaymentInCandidate.payment_In_Schema.pp_No = pp_No,
            existingPaymentInCandidate.payment_In_Schema.entry_Mode =
            entry_Mode,
            existingPaymentInCandidate.payment_In_Schema.trade = trade,
            existingPaymentInCandidate.payment_In_Schema.country = country,
            existingPaymentInCandidate.payment_In_Schema.contact = contact,
            existingPaymentInCandidate.payment_In_Schema.company = company,
            existingPaymentInCandidate.payment_In_Schema.final_Status =
            final_Status,
            existingPaymentInCandidate.payment_In_Schema.flight_Date =
            flight_Date,
            existingPaymentInCandidate.payment_In_Schema.total_Visa_Price_In_PKR -=
            entryToUpdate?.visa_Sales_Rate_PKR ?? 0 - visa_Sales_Rate_PKR
              ? visa_Sales_Rate_PKR
              : 0,
            existingPaymentInCandidate.payment_In_Schema.remaining_Balance -=
            entryToUpdate?.visa_Sales_Rate_PKR ?? 0 - visa_Sales_Rate_PKR
              ? visa_Sales_Rate_PKR
              : 0,
            existingPaymentInCandidate.payment_In_Schema.total_Visa_Price_In_Curr -=
            entryToUpdate?.visa_Sale_Rate_Oth_Cur ??
              0 - visa_Sale_Rate_Oth_Cur
              ? visa_Sale_Rate_Oth_Cur
              : 0,
            existingPaymentInCandidate.payment_In_Schema.remaining_Curr -=
            entryToUpdate?.visa_Sale_Rate_Oth_Cur ??
              0 - visa_Sale_Rate_Oth_Cur
              ? visa_Sale_Rate_Oth_Cur
              : 0,
            await existingPaymentInCandidate.save()
        }
      }


      if (entryToUpdate.reference_Out && (entryToUpdate.reference_Out.toLowerCase() === "candidate" ||entryToUpdate.reference_Out.toLowerCase() === "direct") && reference_Out.toLowerCase() === "supplier") {
        const existingPaymentInCandidate = await Candidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_In_Schema = null
          await existingPaymentInCandidate.save()
        }


        // Check if the supplier with the given name exists
        const existingPaymentInSupplier = await Suppliers.findOne({
          "payment_In_Schema.supplierName": reference_Out_Name,
          "payment_In_Schema.status": 'Open',
        });

        if (!existingPaymentInSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentInSupplier = new Suppliers({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_Out_Name,
              total_Visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Balance: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,

              total_Visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              curr_Country: cur_Country_One,
              opening:visa_Sales_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  country,
                  trade,
                  visa_Price_In_PKR: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  remaining_Price: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentInSupplier.save();
          
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentInSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_PKR +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Balance +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentInSupplier.payment_In_Schema.persons.push({
              name,
              picture : mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              contact,
              country,
              trade,
              visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Price: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });
            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentInSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Visa_Price_In_PKR":
                  visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0,
                "payment_In_Schema.remaining_Balance": visa_Sales_Rate_PKR
                  ? visa_Sales_Rate_PKR
                  : 0,

                "payment_In_Schema.total_Visa_Price_In_Curr":
                  visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0,
                "payment_In_Schema.remaining_Curr": visa_Sale_Rate_Oth_Cur
                  ? visa_Sale_Rate_Oth_Cur
                  : 0,
              },
            });
          }

          await existingPaymentInSupplier.save();

        }
      }


      if (entryToUpdate.reference_Out && (entryToUpdate.reference_Out.toLowerCase() === "candidate" ||entryToUpdate.reference_Out.toLowerCase() === "direct") && reference_Out.toLowerCase() === "agent") {
        const existingPaymentInCandidate = await Candidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_In_Schema = null
          await existingPaymentInCandidate.save()
        }


        // Check if the supplier with the given name exists
        const existingPaymentInSupplier = await Agents.findOne({
          "payment_In_Schema.supplierName": reference_Out_Name,
          "payment_In_Schema.status": 'Open',
        });

        if (!existingPaymentInSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentInSupplier = new Agents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: reference_Out_Name,
              total_Visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Balance: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,

              total_Visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              curr_Country: cur_Country_One,
              opening:visa_Sales_Rate_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  country,
                  trade,
                  visa_Price_In_PKR: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  remaining_Price: visa_Sales_Rate_PKR
                    ? visa_Sales_Rate_PKR
                    : 0,
                  visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visa_Sale_Rate_Oth_Cur
                    ? visa_Sale_Rate_Oth_Cur
                    : 0,

                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentInSupplier.save();
      
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentInSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_PKR +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Balance +=
              visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
            existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
            existingPaymentInSupplier.payment_In_Schema.remaining_Curr +=
              visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentInSupplier.payment_In_Schema.persons.push({
              name,
              picture : mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              contact,
              country,
              trade,
              visa_Price_In_PKR: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              remaining_Price: visa_Sales_Rate_PKR
                ? visa_Sales_Rate_PKR
                : 0,
              visa_Price_In_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,
              remaining_Curr: visa_Sale_Rate_Oth_Cur
                ? visa_Sale_Rate_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });
            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentInSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Visa_Price_In_PKR":
                  visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0,
                "payment_In_Schema.remaining_Balance": visa_Sales_Rate_PKR
                  ? visa_Sales_Rate_PKR
                  : 0,

                "payment_In_Schema.total_Visa_Price_In_Curr":
                  visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0,
                "payment_In_Schema.remaining_Curr": visa_Sale_Rate_Oth_Cur
                  ? visa_Sale_Rate_Oth_Cur
                  : 0,
              },
            });
          }

          await existingPaymentInSupplier.save();

        }
      }

      // For Azad Suppliers/Agents Reference_In

      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "supplier" && azad_Visa_Reference_In.toLowerCase() === "supplier" && entryToUpdate.azad_Visa_Reference_In_Name === azad_Visa_Reference_In_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await AzadSupplier.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_In_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = azadPicture?azadPicture.secure_url:supplierInPersonIndex.picture;

            supplierInPersonIndex.azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }

      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "supplier" && azad_Visa_Reference_In.toLowerCase() === "supplier" && entryToUpdate.azad_Visa_Reference_In_Name !== azad_Visa_Reference_In_Name) {

        for (const agent of azadSuppliers){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Azad Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }

        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadSupplier.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadSupplier.findOne(
          {
            "payment_Out_Schema.supplierName":
              azad_Visa_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
              
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadSupplier({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
         
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "supplier" && azad_Visa_Reference_In.toLowerCase() === "agent") {

        for (const agent of azadSuppliers){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Azad Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }

        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadSupplier.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadAgents.findOne(
          {
            "payment_Out_Schema.supplierName":
              azad_Visa_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadAgents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "supplier" && azad_Visa_Reference_In.toLowerCase() === "candidate") {

 for (const agent of azadSuppliers){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
              return  res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Azad Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadSupplier.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await AzadCandidate.findOne(
          {
            "payment_Out_Schema.supplierName": name,
            "payment_Out_Schema.entry_Mode": entry_Mode,
            "payment_Out_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new AzadCandidate({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
              total_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }



      // For Azad Agents Reference_In

      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "agent" && azad_Visa_Reference_In.toLowerCase() === "agent" && entryToUpdate.azad_Visa_Reference_In_Name === azad_Visa_Reference_In_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await AzadAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_In_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = azadPicture?azadPicture.secure_url:supplierInPersonIndex.picture;

            supplierInPersonIndex.azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }

      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "agent" && azad_Visa_Reference_In.toLowerCase() === "agent" && entryToUpdate.azad_Visa_Reference_In_Name !== azad_Visa_Reference_In_Name) {

        for (const agent of azadAgents){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Azad Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadAgents.findOne(
          {
            "payment_Out_Schema.supplierName":
              azad_Visa_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadAgents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
          
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : mainPicture?mainPicture.secure_url:picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "agent" && azad_Visa_Reference_In.toLowerCase() === "supplier") {

        for (const agent of azadAgents){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Azad Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }

        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadSupplier.findOne(
          {
            "payment_Out_Schema.supplierName":
              azad_Visa_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadSupplier({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              opening:azad_Visa_Purchase_PKR,
              closing:0,

              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : mainPicture?mainPicture.secure_url:picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "agent" && azad_Visa_Reference_In.toLowerCase() === "candidate") {

 for (const agent of azadAgents){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Azad Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await AzadCandidate.findOne(
          {
            "payment_Out_Schema.supplierName": name,
            "payment_Out_Schema.entry_Mode": entry_Mode,
            "payment_Out_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new AzadCandidate({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : mainPicture?mainPicture.secure_url:picture,
              total_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }

      // For Azad Candidate Reference_In 
      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "candidate" && azad_Visa_Reference_In.toLowerCase() === "candidate" && entryToUpdate.azad_Visa_Reference_In_Name === azad_Visa_Reference_In_Name) {

        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInCandidate = await AzadCandidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });

        if (existingPaymentInCandidate) {
          (existingPaymentInCandidate.payment_Out_Schema.supplierName = name),
            (existingPaymentInCandidate.payment_Out_Schema.pp_No = pp_No),
            (existingPaymentInCandidate.payment_Out_Schema.entry_Mode =
              entry_Mode),
              (existingPaymentInCandidate.payment_Out_Schema.picture =
                azadPicture?azadPicture.secure_url:existingPaymentInCandidate.payment_Out_Schema.picture),
            (existingPaymentInCandidate.payment_Out_Schema.trade = trade),
            (existingPaymentInCandidate.payment_Out_Schema.country = country),
            (existingPaymentInCandidate.payment_Out_Schema.contact = contact),
            (existingPaymentInCandidate.payment_Out_Schema.company = company),
            (existingPaymentInCandidate.payment_Out_Schema.final_Status =
              final_Status),
            (existingPaymentInCandidate.payment_Out_Schema.flight_Date =
              flight_Date),
            (existingPaymentInCandidate.payment_Out_Schema.total_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0);
          existingPaymentInCandidate.payment_Out_Schema.remaining_Balance -=
            entryToUpdate?.azad_Visa_Purchase_PKR ??
              0 - azad_Visa_Purchase_PKR
              ? azad_Visa_Purchase_PKR
              : 0;
          existingPaymentInCandidate.payment_Out_Schema.total_Visa_Price_Out_Curr -=
            entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
              0 - azad_Visa_Purchase_Rate_Oth_Cur
              ? azad_Visa_Purchase_Rate_Oth_Cur
              : 0;
          existingPaymentInCandidate.payment_Out_Schema.remaining_Curr -=
            entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
              0 - azad_Visa_Purchase_Rate_Oth_Cur
              ? azad_Visa_Purchase_Rate_Oth_Cur
              : 0;

          await existingPaymentInCandidate.save();
        }


      }

      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "candidate" && azad_Visa_Reference_In.toLowerCase() === "supplier") {
        const existingPaymentInCandidate = await AzadCandidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_Out_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadSupplier.findOne(
          {
            "payment_Out_Schema.supplierName":
              azad_Visa_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadSupplier({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }


      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "candidate" && azad_Visa_Reference_In.toLowerCase() === "agent") {
        const existingPaymentInCandidate = await AzadCandidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_Out_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadAgents.findOne(
          {
            "payment_Out_Schema.supplierName":
              azad_Visa_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadAgents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,
              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }
      }


      // For Azad Suppliers Reference_Out

      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "supplier" && azad_Visa_Reference_Out.toLowerCase() === "supplier" && entryToUpdate.azad_Visa_Reference_Out_Name === azad_Visa_Reference_Out_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await AzadSupplier.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_Out_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = azadPicture?azadPicture.secure_url:supplierInPersonIndex.picture;

            supplierInPersonIndex.azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }

      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "supplier" && azad_Visa_Reference_Out.toLowerCase() === "supplier" && entryToUpdate.azad_Visa_Reference_Out_Name !== azad_Visa_Reference_Out_Name) {

        for (const agent of azadSuppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Azad Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadSupplier.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadSupplier.findOne(
          {
            "payment_In_Schema.supplierName":
              azad_Visa_Reference_Out_Name,
              "payment_In_Schema.status":
              'Open',
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadSupplier({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
         
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "supplier" && azad_Visa_Reference_Out.toLowerCase() === "agent") {

        for (const agent of azadSuppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Azad Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadSupplier.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              azad_Visa_Reference_Out_Name,
              "payment_In_Schema.status":
              'Open',
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadAgents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "supplier" && azad_Visa_Reference_Out.toLowerCase() === "candidate") {


        for (const agent of azadSuppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Azad Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadSupplier.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await AzadCandidate.findOne(
          {
            "payment_In_Schema.supplierName": name,
            "payment_In_Schema.entry_Mode": entry_Mode,
            "payment_In_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new AzadCandidate({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
              total_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Visa_Price_In_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }



      // For Azad Agents Reference_Out

      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "agent" && azad_Visa_Reference_Out.toLowerCase() === "agent" && entryToUpdate.azad_Visa_Reference_Out_Name === azad_Visa_Reference_Out_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await AzadAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_Out_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = azadPicture?azadPicture.secure_url:supplierInPersonIndex.picture;

            supplierInPersonIndex.azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }



      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "agent" && azad_Visa_Reference_Out.toLowerCase() === "agent" && entryToUpdate.azad_Visa_Reference_Out_Name !== azad_Visa_Reference_Out_Name) {


        for (const agent of azadAgents){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Azad Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              azad_Visa_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadAgents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
        
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : mainPicture?mainPicture.secure_url:picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "agent" && azad_Visa_Reference_Out.toLowerCase() === "supplier") {
        for (const agent of azadAgents){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Azad Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }

        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadSupplier.findOne(
          {
            "payment_In_Schema.supplierName":
              azad_Visa_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadSupplier({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : mainPicture?mainPicture.secure_url:picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "agent" && azad_Visa_Reference_Out.toLowerCase() === "candidate") {


        for (const agent of azadAgents){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Azad Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/azad/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }

        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await AzadAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.azad_Visa_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await AzadCandidate.findOne(
          {
            "payment_In_Schema.supplierName": name,
            "payment_In_Schema.entry_Mode": entry_Mode,
            "payment_In_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new AzadCandidate({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : mainPicture?mainPicture.secure_url:picture,
              total_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Visa_Price_In_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }

      // For Azad Candidate Reference_Out
      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "candidate" && azad_Visa_Reference_Out.toLowerCase() === "candidate" && entryToUpdate.azad_Visa_Reference_Out_Name === azad_Visa_Reference_Out_Name) {

        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInCandidate = await AzadCandidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });

        if (existingPaymentInCandidate) {
          (existingPaymentInCandidate.payment_In_Schema.supplierName = name),
            (existingPaymentInCandidate.payment_In_Schema.pp_No = pp_No),
            (existingPaymentInCandidate.payment_Out_Schema.entry_Mode =
              entry_Mode),
              (existingPaymentInCandidate.payment_Out_Schema.picture =
                azadPicture?azadPicture.secure_url:existingPaymentInCandidate.payment_Out_Schema.picture),
            (existingPaymentInCandidate.payment_In_Schema.trade = trade),
            (existingPaymentInCandidate.payment_In_Schema.country = country),
            (existingPaymentInCandidate.payment_In_Schema.contact = contact),
            (existingPaymentInCandidate.payment_In_Schema.company = company),
            (existingPaymentInCandidate.payment_In_Schema.final_Status =
              final_Status),
            (existingPaymentInCandidate.payment_In_Schema.flight_Date =
              flight_Date),
            (existingPaymentInCandidate.payment_In_Schema.total_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0);
          existingPaymentInCandidate.payment_In_Schema.remaining_Balance -=
            entryToUpdate?.azad_Visa_Sales_PKR ??
              0 - azad_Visa_Sales_PKR
              ? azad_Visa_Sales_PKR
              : 0;
          existingPaymentInCandidate.payment_In_Schema.total_Visa_Price_In_Curr -=
            entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
              0 - azad_Visa_Sales_Rate_Oth_Cur
              ? azad_Visa_Sales_Rate_Oth_Cur
              : 0;
          existingPaymentInCandidate.payment_In_Schema.remaining_Curr -=
            entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
              0 - azad_Visa_Sales_Rate_Oth_Cur
              ? azad_Visa_Sales_Rate_Oth_Cur
              : 0;

          await existingPaymentInCandidate.save();
        }


      }

      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "candidate" && azad_Visa_Reference_Out.toLowerCase() === "supplier") {
        const existingPaymentInCandidate = await AzadCandidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_In_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadSupplier.findOne(
          {
            "payment_In_Schema.supplierName":
              azad_Visa_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadSupplier({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }


      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "candidate" && azad_Visa_Reference_Out.toLowerCase() === "agent") {
        const existingPaymentInCandidate = await AzadCandidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_In_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              azad_Visa_Reference_Out_Name,
            "payment_In_Schema.status":
            'Open',
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new AzadAgents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: azad_Visa_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : azadPicture?azadPicture.secure_url:azad_Visa_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }
      }



      // For Ticket Suppliers Reference_In

      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "supplier" && ticket_Reference_In.toLowerCase() === "supplier" && entryToUpdate.ticket_Reference_In_Name === ticket_Reference_In_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await TicketSuppliers.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.ticket_Reference_In_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = ticketPicture?ticketPicture.secure_url:supplierInPersonIndex.picture;

            supplierInPersonIndex.azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }

      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "supplier" && ticket_Reference_In.toLowerCase() === "supplier" && entryToUpdate.ticket_Reference_In_Name !== ticket_Reference_In_Name) {

        for (const agent of ticketSuppliers){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Ticket Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketSuppliers.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.ticket_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketSuppliers.findOne(
          {
            "payment_Out_Schema.supplierName":
              ticket_Reference_In_Name,
              "payment_Out_Schema.status":
              'Open',
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new TicketSuppliers({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
         
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "supplier" && ticket_Reference_In.toLowerCase() === "agent") {


        for (const agent of ticketSuppliers){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Ticket Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketSuppliers.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.ticket_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketAgents.findOne(
          {
            "payment_Out_Schema.supplierName":
             ticket_Reference_In_Name,
              "payment_Out_Schema.status":
             "Open"
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new TicketAgents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "supplier" && ticket_Reference_In.toLowerCase() === "candidate") {

        for (const agent of ticketSuppliers){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Ticket Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketSuppliers.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.ticket_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await TicketCandidate.findOne(
          {
            "payment_Out_Schema.supplierName": name,
            "payment_Out_Schema.entry_Mode": entry_Mode,
            "payment_Out_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new TicketCandidate({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
              total_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }



      // For Ticket Agents Reference_In

      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "agent" && ticket_Reference_In.toLowerCase() === "agent" && entryToUpdate.ticket_Reference_In_Name === ticket_Reference_In_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await TicketAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.ticket_Reference_In_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = ticketPicture?ticketPicture.secure_url:supplierInPersonIndex.picture;

            supplierInPersonIndex.azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }

      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "agent" && ticket_Reference_In.toLowerCase() === "agent" && entryToUpdate.ticket_Reference_In_Name !== ticket_Reference_In_Name) {

       for (const agent of ticketAgents){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Ticket Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.ticket_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketAgents.findOne(
          {
            "payment_Out_Schema.supplierName":
              ticket_Reference_In_Name,
              "payment_Out_Schema.status":
              'Open',
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new TicketAgents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
       
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "agent" && ticket_Reference_In.toLowerCase() === "supplier") {

        
       for (const agent of ticketAgents){
        if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
         let allCandPayments=agent.payment_Out_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Ticket Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.ticket_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketSuppliers.findOne(
          {
            "payment_Out_Schema.supplierName":
              ticket_Reference_In_Name,
              "payment_Out_Schema.status":
              'Open',
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          
          const newPaymentOutAzadSupplier = new TicketSuppliers({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:ticket_Reference_In_Name,
              closing:0,
              persons: [
                {
                  name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "agent" && ticket_Reference_In.toLowerCase() === "candidate") {


        for (const agent of ticketAgents){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Ticket Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.ticket_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await TicketCandidate.findOne(
          {
            "payment_Out_Schema.supplierName": name,
            "payment_Out_Schema.entry_Mode": entry_Mode,
            "payment_Out_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new TicketCandidate({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
              total_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }

      // For Ticket Candidate Reference_In 
      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "candidate" && ticket_Reference_In.toLowerCase() === "candidate" && entryToUpdate.ticket_Reference_In_Name === ticket_Reference_In_Name) {

        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInCandidate = await TicketCandidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });

        if (existingPaymentInCandidate) {
          (existingPaymentInCandidate.payment_Out_Schema.supplierName = name),
            (existingPaymentInCandidate.payment_Out_Schema.pp_No = pp_No),
            (existingPaymentInCandidate.payment_Out_Schema.entry_Mode =
              entry_Mode),
              (existingPaymentInCandidate.payment_Out_Schema.picture =
                ticketPicture?ticketPicture.secure_url:existingPaymentInCandidate.payment_Out_Schema.picture),
            (existingPaymentInCandidate.payment_Out_Schema.trade = trade),
            (existingPaymentInCandidate.payment_Out_Schema.country = country),
            (existingPaymentInCandidate.payment_Out_Schema.contact = contact),
            (existingPaymentInCandidate.payment_Out_Schema.company = company),
            (existingPaymentInCandidate.payment_Out_Schema.final_Status =
              final_Status),
            (existingPaymentInCandidate.payment_Out_Schema.flight_Date =
              flight_Date),
            (existingPaymentInCandidate.payment_Out_Schema.total_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0);
          existingPaymentInCandidate.payment_Out_Schema.remaining_Balance -=
            entryToUpdate?.azad_Visa_Purchase_PKR ??
              0 - azad_Visa_Purchase_PKR
              ? azad_Visa_Purchase_PKR
              : 0;
          existingPaymentInCandidate.payment_Out_Schema.total_Visa_Price_Out_Curr -=
            entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
              0 - azad_Visa_Purchase_Rate_Oth_Cur
              ? azad_Visa_Purchase_Rate_Oth_Cur
              : 0;
          existingPaymentInCandidate.payment_Out_Schema.remaining_Curr -=
            entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
              0 - azad_Visa_Purchase_Rate_Oth_Cur
              ? azad_Visa_Purchase_Rate_Oth_Cur
              : 0;

          await existingPaymentInCandidate.save();
        }


      }

      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "candidate" && ticket_Reference_In.toLowerCase() === "supplier") {
        const existingPaymentInCandidate = await TicketCandidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_Out_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketSuppliers.findOne(
          {
            "payment_Out_Schema.supplierName":
              ticket_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new TicketSuppliers({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }


      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "candidate" && ticket_Reference_In.toLowerCase() === "agent") {
        const existingPaymentInCandidate = await TicketCandidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_Out_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketAgents.findOne(
          {
            "payment_Out_Schema.supplierName":
              ticket_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new TicketAgents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }
      }


      // For Azad Suppliers Reference_Out

      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "supplier" && ticket_Reference_Out.toLowerCase() === "supplier" && entryToUpdate.ticket_Reference_Out_Name === ticket_Reference_Out_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await TicketSuppliers.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.ticket_Reference_Out_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = ticketPicture?ticketPicture.secure_url:supplierInPersonIndex.picture;

            supplierInPersonIndex.azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }

      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "supplier" && ticket_Reference_Out.toLowerCase() === "supplier" && entryToUpdate.ticket_Reference_Out_Name !== ticket_Reference_Out_Name) {

        for (const agent of ticketSuppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Ticket Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketSuppliers.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.ticket_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketSuppliers.findOne(
          {
            "payment_In_Schema.supplierName":
             ticket_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new TicketSuppliers({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
      
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "supplier" && ticket_Reference_Out.toLowerCase() === "agent") {

        for (const agent of ticketSuppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Ticket Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketSuppliers.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.ticket_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              ticket_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new TicketAgents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "supplier" && ticket_Reference_Out.toLowerCase() === "candidate") {

        for (const agent of ticketSuppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Ticket Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketSuppliers.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.ticket_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await TicketCandidate.findOne(
          {
            "payment_In_Schema.supplierName": name,
            "payment_In_Schema.entry_Mode": entry_Mode,
            "payment_In_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new TicketCandidate({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
              total_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Visa_Price_In_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }



      // For Azad Agents Reference_Out

      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "agent" && ticket_Reference_Out.toLowerCase() === "agent" && entryToUpdate.ticket_Reference_Out_Name === ticket_Reference_Out_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await TicketAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.ticket_Reference_Out_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = ticketPicture?ticketPicture.secure_url:supplierInPersonIndex.picture;


            supplierInPersonIndex.azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }

      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "agent" && ticket_Reference_Out.toLowerCase() === "agent" && entryToUpdate.ticket_Reference_Out_Name !== ticket_Reference_Out_Name) {


        for (const agent of ticketAgents){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Ticket Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.ticket_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              ticket_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new TicketAgents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
         
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "agent" && ticket_Reference_Out.toLowerCase() === "supplier") {

        for (const agent of ticketAgents){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Ticket Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.ticket_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketSuppliers.findOne(
          {
            "payment_In_Schema.supplierName":
              ticket_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new TicketSuppliers({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "agent" && ticket_Reference_Out.toLowerCase() === "candidate") {

        for (const agent of ticketAgents){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Ticket Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/tickets/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await TicketAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.ticket_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await TicketCandidate.findOne(
          {
            "payment_In_Schema.supplierName": name,
            "payment_In_Schema.entry_Mode": entry_Mode,
            "payment_In_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new TicketCandidate({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
              total_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Visa_Price_In_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }

      // For Azad Candidate Reference_Out
      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "candidate" && ticket_Reference_Out.toLowerCase() === "candidate" && entryToUpdate.ticket_Reference_Out_Name === ticket_Reference_Out_Name) {

        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInCandidate = await TicketCandidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });

        if (existingPaymentInCandidate) {
          (existingPaymentInCandidate.payment_In_Schema.supplierName = name),
            (existingPaymentInCandidate.payment_In_Schema.pp_No = pp_No),
            (existingPaymentInCandidate.payment_Out_Schema.entry_Mode =
              entry_Mode),
              (existingPaymentInCandidate.payment_Out_Schema.picture =
                ticketPicture?ticketPicture.secure_url:existingPaymentInCandidate.payment_Out_Schema.picture),
            (existingPaymentInCandidate.payment_In_Schema.trade = trade),
            (existingPaymentInCandidate.payment_In_Schema.country = country),
            (existingPaymentInCandidate.payment_In_Schema.contact = contact),
            (existingPaymentInCandidate.payment_In_Schema.company = company),
            (existingPaymentInCandidate.payment_In_Schema.final_Status =
              final_Status),
            (existingPaymentInCandidate.payment_In_Schema.flight_Date =
              flight_Date),
            (existingPaymentInCandidate.payment_In_Schema.total_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0);
          existingPaymentInCandidate.payment_In_Schema.remaining_Balance -=
            entryToUpdate?.azad_Visa_Sales_PKR ??
              0 - azad_Visa_Sales_PKR
              ? azad_Visa_Sales_PKR
              : 0;
          existingPaymentInCandidate.payment_In_Schema.total_Visa_Price_In_Curr -=
            entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
              0 - azad_Visa_Sales_Rate_Oth_Cur
              ? azad_Visa_Sales_Rate_Oth_Cur
              : 0;
          existingPaymentInCandidate.payment_In_Schema.remaining_Curr -=
            entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
              0 - azad_Visa_Sales_Rate_Oth_Cur
              ? azad_Visa_Sales_Rate_Oth_Cur
              : 0;

          await existingPaymentInCandidate.save();
        }


      }

      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "candidate" && ticket_Reference_Out.toLowerCase() === "supplier") {
        const existingPaymentInCandidate = await TicketCandidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_In_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketSuppliers.findOne(
          {
            "payment_In_Schema.supplierName":
              ticket_Reference_Out_Name,
              "payment_In_Schema.status":
              'Open',
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new TicketSuppliers({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }


      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "candidate" && ticket_Reference_Out.toLowerCase() === "agent") {
        const existingPaymentInCandidate = await TicketCandidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_In_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              ticket_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new TicketAgents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: ticket_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : ticketPicture?ticketPicture.secure_url:ticket_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }
      }


      // For Visit Suppliers Reference_In

      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "supplier" && visit_Reference_In.toLowerCase() === "supplier" && entryToUpdate.visit_Reference_In_Name === visit_Reference_In_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await VisitSuppliers.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.visit_Reference_In_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = ticketPicture?ticketPicture.secure_url:supplierInPersonIndex.picture;

            supplierInPersonIndex.azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }

      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "supplier" && visit_Reference_In.toLowerCase() === "supplier" && entryToUpdate.visit_Reference_In_Name !== visit_Reference_In_Name) {


        for (const agent of visitSuppliers){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Visit Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitSuppliers.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.visit_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitSuppliers.findOne(
          {
            "payment_Out_Schema.supplierName":
              visit_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitSuppliers({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,

                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
          
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "supplier" && visit_Reference_In.toLowerCase() === "agent") {

        for (const agent of visitSuppliers){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Visit Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitSuppliers.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.visit_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitAgents.findOne(
          {
            "payment_Out_Schema.supplierName":
              visit_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitAgents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "supplier" && visit_Reference_In.toLowerCase() === "candidate") {

        for (const agent of visitSuppliers){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Visit Supplier :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitSuppliers.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.visit_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await VisitCandidate.findOne(
          {
            "payment_Out_Schema.supplierName": name,
            "payment_Out_Schema.entry_Mode": entry_Mode,
            "payment_Out_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new VisitCandidate({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
              total_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }



      // For Visit Agents Reference_In

      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "agent" && visit_Reference_In.toLowerCase() === "agent" && entryToUpdate.visit_Reference_In_Name === visit_Reference_In_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await VisitAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.visit_Reference_In_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = visitPicture?visitPicture.secure_url:supplierInPersonIndex.picture;

            supplierInPersonIndex.azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
                0 - azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }

      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "agent" && visit_Reference_In.toLowerCase() === "agent" && entryToUpdate.visit_Reference_In_Name !== visit_Reference_In_Name) {

        for (const agent of visitAgents){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Visit Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.visit_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitAgents.findOne(
          {
            "payment_Out_Schema.supplierName":
              visit_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitAgents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
        
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "agent" && visit_Reference_In.toLowerCase() === "supplier") {

        for (const agent of visitAgents){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Visit Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.visit_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitSuppliers.findOne(
          {
            "payment_Out_Schema.supplierName":
              visit_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitSuppliers({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "agent" && visit_Reference_In.toLowerCase() === "candidate") {

        for (const agent of visitAgents){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentOut Visit Agent :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitAgents.findOne({
          "payment_Out_Schema.supplierName":
            entryToUpdate.visit_Reference_In_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await VisitCandidate.findOne(
          {
            "payment_Out_Schema.supplierName": name,
            "payment_Out_Schema.entry_Mode": entry_Mode,
            "payment_Out_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new VisitCandidate({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
              total_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }

      // For Visit Candidate Reference_In 
      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "candidate" && visit_Reference_In.toLowerCase() === "candidate" && entryToUpdate.visit_Reference_In_Name === visit_Reference_In_Name) {

        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInCandidate = await VisitCandidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });

        if (existingPaymentInCandidate) {
          (existingPaymentInCandidate.payment_Out_Schema.supplierName = name),
            (existingPaymentInCandidate.payment_Out_Schema.pp_No = pp_No),
            (existingPaymentInCandidate.payment_Out_Schema.entry_Mode =
              entry_Mode),
              (existingPaymentInCandidate.payment_Out_Schema.picture =
                visitPicture?visitPicture.secure_url:existingPaymentInCandidate.payment_Out_Schema.picture),
            (existingPaymentInCandidate.payment_Out_Schema.trade = trade),
            (existingPaymentInCandidate.payment_Out_Schema.country = country),
            (existingPaymentInCandidate.payment_Out_Schema.contact = contact),
            (existingPaymentInCandidate.payment_Out_Schema.company = company),
            (existingPaymentInCandidate.payment_Out_Schema.final_Status =
              final_Status),
            (existingPaymentInCandidate.payment_Out_Schema.flight_Date =
              flight_Date),
            (existingPaymentInCandidate.payment_Out_Schema.total_Visa_Price_Out_PKR -=
              entryToUpdate?.azad_Visa_Purchase_PKR ??
                0 - azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0);
          existingPaymentInCandidate.payment_Out_Schema.remaining_Balance -=
            entryToUpdate?.azad_Visa_Purchase_PKR ??
              0 - azad_Visa_Purchase_PKR
              ? azad_Visa_Purchase_PKR
              : 0;
          existingPaymentInCandidate.payment_Out_Schema.total_Visa_Price_Out_Curr -=
            entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
              0 - azad_Visa_Purchase_Rate_Oth_Cur
              ? azad_Visa_Purchase_Rate_Oth_Cur
              : 0;
          existingPaymentInCandidate.payment_Out_Schema.remaining_Curr -=
            entryToUpdate?.azad_Visa_Purchase_Rate_Oth_Cur ??
              0 - azad_Visa_Purchase_Rate_Oth_Cur
              ? azad_Visa_Purchase_Rate_Oth_Cur
              : 0;

          await existingPaymentInCandidate.save();
        }


      }

      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "candidate" && visit_Reference_In.toLowerCase() === "supplier") {
        const existingPaymentInCandidate = await VisitCandidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_Out_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitSuppliers.findOne(
          {
            "payment_Out_Schema.supplierName":
              visit_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitSuppliers({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }


      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "candidate" && visit_Reference_In.toLowerCase() === "agent") {
        const existingPaymentInCandidate = await VisitCandidate.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.name,
          "payment_Out_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_Out_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_Out_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitAgents.findOne(
          {
            "payment_Out_Schema.supplierName":
              visit_Reference_In_Name,
              "payment_Out_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitAgents({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_In_Name,
              total_Azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,
              remaining_Balance: azad_Visa_Purchase_PKR
                ? azad_Visa_Purchase_PKR
                : 0,

              total_Azad_Visa_Price_Out_Curr:
                azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Purchase_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                    ? azad_Visa_Purchase_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Purchase_Rate_Oth_Cur
                      ? azad_Visa_Purchase_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
              azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

            existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
              azad_Visa_Purchase_Rate_Oth_Cur
                ? azad_Visa_Purchase_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_Out_PKR: azad_Visa_Purchase_PKR
                  ? azad_Visa_Purchase_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Purchase_Rate_Oth_Cur
                  ? azad_Visa_Purchase_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,
                "payment_Out_Schema.remaining_Balance":
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0,

                "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
                "payment_Out_Schema.remaining_Curr":
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }
      }


      // For Visit Suppliers Reference_Out

      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "supplier" && visit_Reference_Out.toLowerCase() === "supplier" && entryToUpdate.visit_Reference_Out_Name === visit_Reference_Out_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await VisitSuppliers.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.visit_Reference_Out_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = visitPicture?visitPicture.secure_url:supplierInPersonIndex.picture;

            supplierInPersonIndex.azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }

      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "supplier" && visit_Reference_Out.toLowerCase() === "supplier" && entryToUpdate.visit_Reference_Out_Name !== visit_Reference_Out_Name) {

        for (const agent of visitSuppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Visit Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitSuppliers.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.visit_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitSuppliers.findOne(
          {
            "payment_In_Schema.supplierName":
              visit_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitSuppliers({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
     
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "supplier" && visit_Reference_Out.toLowerCase() === "agent") {

        for (const agent of visitSuppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Visit Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitSuppliers.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.visit_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              visit_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitAgents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,

                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "supplier" && visit_Reference_Out.toLowerCase() === "candidate") {

        for (const agent of visitSuppliers){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Visit Supplier :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitSuppliers.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.visit_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await VisitCandidate.findOne(
          {
            "payment_In_Schema.supplierName": name,
            "payment_In_Schema.entry_Mode": entry_Mode,
            "payment_In_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new VisitCandidate({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
              total_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Visa_Price_In_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }



      // For Visit Agents Reference_Out

      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "agent" && visit_Reference_Out.toLowerCase() === "agent" && entryToUpdate.visit_Reference_Out_Name === visit_Reference_Out_Name) {
        // Update the Agent,Supplier and candidate
        const existingSupplierPaymentIn = await VisitAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.visit_Reference_Out_Name,
        })
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {
          let supplierInPersonIndex;
          supplierInPersonIndex =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {
            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.contact = contact;
            supplierInPersonIndex.picture = visitPicture?visitPicture.secure_url:supplierInPersonIndex.picture;

            supplierInPersonIndex.azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Price -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.azad_Visa_Price_Out_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            supplierInPersonIndex.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;

            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
                0 - azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0 /* Adjust based on your needs */;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0 /* Adjust based on your needs */;
            await existingSupplierPaymentIn.save();
          }
        }
      }

      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "agent" && visit_Reference_Out.toLowerCase() === "agent" && entryToUpdate.visit_Reference_Out_Name !== visit_Reference_Out_Name) {

        for (const agent of visitAgents){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Visit Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.visit_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              visit_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitAgents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();
        
        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "agent" && visit_Reference_Out.toLowerCase() === "supplier") {


        for (const agent of visitAgents){
          if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
           let allCandPayments=agent.payment_In_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Visit Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
                break;
              }
            }
           }
          }
         }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.visit_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitSuppliers.findOne(
          {
            "payment_In_Schema.supplierName":
              visit_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitSuppliers({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }

      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "agent" && visit_Reference_Out.toLowerCase() === "candidate") {


         for (const agent of visitAgents){
        if(agent.payment_In_Schema&&agent.payment_In_Schema.candPayments){
         let allCandPayments=agent.payment_In_Schema.candPayments
         for (const payment of allCandPayments){
          let allPayments=payment.payments
          for (const candidatePayment of allPayments){
            if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
              return res.status(400).json({message:`You have made payments for this Candidate with PaymentIn Visit Agent :${agent.payment_In_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/visits/cand_vise_payment_details'})
              break;
            }
          }
         }
        }
       }
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingSupplierPaymentIn = await VisitAgents.findOne({
          "payment_In_Schema.supplierName":
            entryToUpdate.visit_Reference_Out_Name,
        });
        // Find the index of the person in the persons array

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_In_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_In_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_In_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Balance -=
              personToUpdate.azad_Visa_Price_In_PKR || 0;
            existingSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_In_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        const existingPaymentOutAzadCandidate = await VisitCandidate.findOne(
          {
            "payment_In_Schema.supplierName": name,
            "payment_In_Schema.entry_Mode": entry_Mode,
            "payment_In_Schema.pp_No": pp_No,
          }
        )

        if (!existingPaymentOutAzadCandidate) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadCandidate = new VisitCandidate({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: name,
              picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
              total_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Visa_Price_In_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              pp_No: pp_No,
              entry_Mode: entry_Mode,
              company: company,
              trade: trade,
              country: country,
              contact: contact,
              final_Status: final_Status,
              flight_Date: flight_Date,
            },
          });

          await newPaymentOutAzadCandidate.save();
        }
      }

      // For Azad Candidate Reference_Out
      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "candidate" && visit_Reference_Out.toLowerCase() === "candidate" && entryToUpdate.visit_Reference_Out_Name === visit_Reference_Out_Name) {

        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInCandidate = await VisitCandidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });

        if (existingPaymentInCandidate) {
          (existingPaymentInCandidate.payment_In_Schema.supplierName = name),
            (existingPaymentInCandidate.payment_In_Schema.pp_No = pp_No),
            (existingPaymentInCandidate.payment_Out_Schema.entry_Mode =
              entry_Mode),
              (existingPaymentInCandidate.payment_Out_Schema.picture =
                visitPicture?visitPicture.secure_url:existingPaymentInCandidate.payment_Out_Schema.picture),
            (existingPaymentInCandidate.payment_In_Schema.trade = trade),
            (existingPaymentInCandidate.payment_In_Schema.country = country),
            (existingPaymentInCandidate.payment_In_Schema.contact = contact),
            (existingPaymentInCandidate.payment_In_Schema.company = company),
            (existingPaymentInCandidate.payment_In_Schema.final_Status =
              final_Status),
            (existingPaymentInCandidate.payment_In_Schema.flight_Date =
              flight_Date),
            (existingPaymentInCandidate.payment_In_Schema.total_Visa_Price_In_PKR -=
              entryToUpdate?.azad_Visa_Sales_PKR ??
                0 - azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0);
          existingPaymentInCandidate.payment_In_Schema.remaining_Balance -=
            entryToUpdate?.azad_Visa_Sales_PKR ??
              0 - azad_Visa_Sales_PKR
              ? azad_Visa_Sales_PKR
              : 0;
          existingPaymentInCandidate.payment_In_Schema.total_Visa_Price_In_Curr -=
            entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
              0 - azad_Visa_Sales_Rate_Oth_Cur
              ? azad_Visa_Sales_Rate_Oth_Cur
              : 0;
          existingPaymentInCandidate.payment_In_Schema.remaining_Curr -=
            entryToUpdate?.azad_Visa_Sales_Rate_Oth_Cur ??
              0 - azad_Visa_Sales_Rate_Oth_Cur
              ? azad_Visa_Sales_Rate_Oth_Cur
              : 0;

          await existingPaymentInCandidate.save();
        }


      }

      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "candidate" && visit_Reference_Out.toLowerCase() === "supplier") {
        const existingPaymentInCandidate = await VisitCandidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_In_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitSuppliers.findOne(
          {
            "payment_In_Schema.supplierName":
              visit_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitSuppliers({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }

      }


      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "candidate" && visit_Reference_Out.toLowerCase() === "agent") {
        const existingPaymentInCandidate = await VisitCandidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });
        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_In_Schema = null
          await existingPaymentInCandidate.save()
        }



        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              visit_Reference_Out_Name,
              "payment_In_Schema.status":
              "Open",
          }
        );

        if (!existingPaymentOutAzadSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutAzadSupplier = new VisitAgents({
            payment_In_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: visit_Reference_Out_Name,
              total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,
              remaining_Balance: azad_Visa_Sales_PKR
                ? azad_Visa_Sales_PKR
                : 0,

              total_Azad_Visa_Price_In_PKR:
                azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
              remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0,

              curr_Country: cur_Country_One,
              opening:azad_Visa_Sales_PKR,
              closing:0,
              persons: [
                {
                  name,
                  picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                  pp_No,
                  entry_Mode,
                  trade,
                  contact,
                  country,
                  azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  azad_Visa_Price_Out_Curr:
                    azad_Visa_Sales_Rate_Oth_Cur
                      ? azad_Visa_Sales_Rate_Oth_Cur
                      : 0,
                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutAzadSupplier.save();

        } else {
          // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
          const existingPersonIndex =
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Balance +=
              azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

            existingPaymentOutAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
            existingPaymentOutAzadSupplier.payment_In_Schema.remaining_Curr +=
              azad_Visa_Sales_Rate_Oth_Cur
                ? azad_Visa_Sales_Rate_Oth_Cur
                : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutAzadSupplier.payment_In_Schema.persons.push(
              {
                name,
                picture : visitPicture?visitPicture.secure_url:visit_Section_Picture,
                pp_No,
                entry_Mode,
                trade,
                country,
                contact,
                azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                  ? azad_Visa_Sales_PKR
                  : 0,
                azad_Visa_Price_Out_Curr: azad_Visa_Sales_Rate_Oth_Cur
                  ? azad_Visa_Sales_Rate_Oth_Cur
                  : 0,
                company: company,
                final_Status: final_Status,
                flight_Date: flight_Date,
                entry_Date: new Date().toISOString().split("T")[0],
              }
            );

            // Update total_Visa_Price_In_PKR and other fields using $inc
            await existingPaymentOutAzadSupplier.updateOne({
              $inc: {
                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                "payment_In_Schema.remaining_Balance":
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                "payment_In_Schema.remaining_Curr":
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
              },
            });
          }

          await existingPaymentOutAzadSupplier.save();
        }
      }


      // For Protector Reference_In
      if (entryToUpdate.protector_Reference_In && entryToUpdate.protector_Reference_In.toLowerCase() === "supplier" && protector_Reference_In.toLowerCase() === "supplier" && entryToUpdate.protector_Reference_In_Name === protector_Reference_In_Name) {
        //Reference In for Suppliers 
        const existingSupplierPaymentIn = await Protector.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.protector_Reference_In_Name,
        });
        // Find the index of the person in the persons array
        if (existingSupplierPaymentIn) {

          const supplierInPersonIndex =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === entryToUpdate.name &&
                person.entry_Mode === entryToUpdate.entry_Mode &&
                person.pp_No === entryToUpdate.pp_No
            );
          // If the person is found, remove it from the persons array
          if (supplierInPersonIndex) {

            supplierInPersonIndex.name = name;
            supplierInPersonIndex.pp_No = pp_No;
            supplierInPersonIndex.entry_Mode = entry_Mode;
            supplierInPersonIndex.trade = trade;
            supplierInPersonIndex.country = country;
            supplierInPersonIndex.picture = mainPicture?mainPicture.secure_url:supplierInPersonIndex.picture;

            // Calculate the differences
            const protector_Price_In_Diff = entryToUpdate.protector_Price_In - protector_Price_In
            const protector_Price_In_Oth_Cur_Diff = entryToUpdate.protector_Price_In_Oth_Cur - protector_Price_In_Oth_Cur
            supplierInPersonIndex.protector_Out_PKR -= protector_Price_In_Diff
            supplierInPersonIndex.protector_Out_Curr -= protector_Price_In_Oth_Cur_Diff
            existingSupplierPaymentIn.payment_Out_Schema.total_Protector_Price_Out_PKR -= protector_Price_In_Diff;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -= protector_Price_In_Diff;
            existingSupplierPaymentIn.payment_Out_Schema.total_Protector_Price_Out_Curr -= protector_Price_In_Oth_Cur_Diff;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -= protector_Price_In_Oth_Cur_Diff;

            await existingSupplierPaymentIn.save()

          }

        }


      }

      if (entryToUpdate.protector_Reference_In && entryToUpdate.protector_Reference_In.toLowerCase() === "protector" && protector_Reference_In.toLowerCase() === "Protector" && entryToUpdate.protector_Reference_In_Name !== protector_Reference_In_Name) {
        for (const agent of protectors){
          if(agent.payment_Out_Schema&&agent.payment_Out_Schema.candPayments){
           let allCandPayments=agent.payment_Out_Schema.candPayments
           for (const payment of allCandPayments){
            let allPayments=payment.payments
            for (const candidatePayment of allPayments){
              if(candidatePayment.cand_Name.trim().toLowerCase()===entryToUpdate.name.trim().toLowerCase()&&candidatePayment.pp_No.trim().toLowerCase()===entryToUpdate.pp_No.trim().toLowerCase()){
                return res.status(400).json({message:`You have made payments for this Candidate with Protector :${agent.payment_Out_Schema.supplierName} having Invoice NO:${payment.invoice}`,redirect:'/rozgar/protector/details'})
                break;
              }
            }
           }
          }
         }
        const existingSupplierPaymentIn = await Protector.findOne({
          "payment_Out_Schema.supplierName": entryToUpdate.protector_Reference_In_Name,
        });

        if (existingSupplierPaymentIn) {
          const personToUpdate =
            existingSupplierPaymentIn.payment_Out_Schema.persons.find(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          if (personToUpdate) {
            const updatedPersons =
              existingSupplierPaymentIn.payment_Out_Schema.persons.filter(
                (person) =>
                  !(
                    person.name === name &&
                    person.entry_Mode === entry_Mode &&
                    person.pp_No === pp_No
                  )
              );

            existingSupplierPaymentIn.payment_Out_Schema.persons =
              updatedPersons;
            existingSupplierPaymentIn.payment_Out_Schema.total_Protector_Price_Out_PKR -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Balance -=
              personToUpdate.visa_Price_Out_PKR || 0;
            existingSupplierPaymentIn.payment_Out_Schema.total_Protector_Price_Out_Curr -=
              personToUpdate.protector_Out_Curr || 0;
            existingSupplierPaymentIn.payment_Out_Schema.remaining_Curr -=
              personToUpdate.protector_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutSupplier = await Protector.findOne({
          "payment_Out_Schema.supplierName": protector_Reference_In_Name,
          "payment_Out_Schema.status": "Open",
        });

        if (!existingPaymentOutSupplier) {
          // If the supplier does not exist, create a new one
          const newPaymentOutSupplier = new Protector({
            payment_Out_Schema: {
              supplier_Id: entryToUpdate._id,
              supplierName: protector_Reference_In_Name,
              total_Protector_Price_Out_PKR: protector_Price_In
                ? protector_Price_In
                : 0,
              remaining_Balance: protector_Price_In
                ? protector_Price_In
                : 0,

              total_Protector_Price_Out_Curr: protector_Price_In_Oth_Cur
                ? protector_Price_In_Oth_Cur
                : 0,
              remaining_Curr: protector_Price_In_Oth_Cur
                ? protector_Price_In_Oth_Cur
                : 0,

              curr_Country: cur_Country_Two,
              opening:protector_Price_In,
              closing:0,
              persons: [
                {
                  name,
                  picture: mainPicture?mainPicture.secure_url:picture,
                  pp_No,
                  entry_Mode,
                  contact,
                  trade,
                  country,
                  protector_Out_PKR: protector_Price_In
                    ? protector_Price_In
                    : 0,

                  protector_Out_Curr: protector_Price_In_Oth_Cur
                    ? protector_Price_In_Oth_Cur
                    : 0,


                  company: company,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                },
              ],
            },
          });

          await newPaymentOutSupplier.save();

        } else {
          const existingPersonIndex =
            existingPaymentOutSupplier.payment_Out_Schema.persons.findIndex(
              (person) =>
                person.pp_No === pp_No &&
                person.entry_Mode === entry_Mode &&
                person.name === name
            );

          if (existingPersonIndex !== -1) {
            existingPaymentOutSupplier.payment_Out_Schema.total_Protector_Price_Out_PKR +=
              protector_Price_In ? protector_Price_In : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Balance +=
              protector_Price_In ? protector_Price_In : 0;

            existingPaymentOutSupplier.payment_Out_Schema.total_Protector_Price_Out_Curr +=
              protector_Price_In_Oth_Cur ? protector_Price_In_Oth_Cur : 0;
            existingPaymentOutSupplier.payment_Out_Schema.remaining_Curr +=
              protector_Price_In_Oth_Cur ? protector_Price_In_Oth_Cur : 0;
          } else {
            // If the person does not exist, add them to the persons array
            existingPaymentOutSupplier.payment_Out_Schema.persons.push({
              name,
              picture: mainPicture?mainPicture.secure_url:picture,
              pp_No,
              entry_Mode,
              trade,
              contact,
              country,
              protector_Out_PKR: protector_Price_In
                ? protector_Price_In
                : 0,
              protector_Out_Curr: protector_Price_In_Oth_Cur
                ? protector_Price_In_Oth_Cur
                : 0,

              company: company,
              final_Status: final_Status,
              flight_Date: flight_Date,
              entry_Date: new Date().toISOString().split("T")[0],
            });

            // Update total_Visa_In_Price_PKR and other fields using $inc
            await existingPaymentOutSupplier.updateOne({
              $inc: {
                "payment_Out_Schema.total_Protector_Price_Out_PKR":
                  protector_Price_In ? protector_Price_In : 0,
                "payment_Out_Schema.remaining_Balance": protector_Price_In
                  ? protector_Price_In
                  : 0,

                "payment_Out_Schema.total_Protector_Price_Out_Curr":
                  protector_Price_In_Oth_Cur ? protector_Price_In_Oth_Cur : 0,
                "payment_Out_Schema.remaining_Curr":
                  protector_Price_In_Oth_Cur ? protector_Price_In_Oth_Cur : 0,
              },
            });
          }

          await existingPaymentOutSupplier.save();

        }
      }

      // 
      // Update entry fields
      entryToUpdate.reference_Out = reference_Out;
      entryToUpdate.reference_In = reference_In;
      entryToUpdate.name = name;
      entryToUpdate.pp_No = pp_No;
      entryToUpdate.trade = trade;
      entryToUpdate.company = company;
      entryToUpdate.contact = contact;
      entryToUpdate.country = country;
      entryToUpdate.flight_Date = flight_Date;
      entryToUpdate.final_Status = final_Status;
      entryToUpdate.remarks = remarks;
      entryToUpdate.entry_Mode = entry_Mode;
      entryToUpdate.reference_Out_Name = reference_Out_Name;
      entryToUpdate.visa_Sales_Rate_PKR = visa_Sales_Rate_PKR;
      entryToUpdate.visa_Sale_Rate_Oth_Cur = visa_Sale_Rate_Oth_Cur;
      entryToUpdate.cur_Country_One = cur_Country_One;
      entryToUpdate.reference_In_Name = reference_In_Name;
      entryToUpdate.visa_Purchase_Rate_PKR = visa_Purchase_Rate_PKR;
      entryToUpdate.visa_Purchase_Rate_Oth_Cur = visa_Purchase_Rate_Oth_Cur;
      entryToUpdate.cur_Country_Two = cur_Country_Two;

      entryToUpdate.picture = picture;

      entryToUpdate.visit_Reference_In = visit_Reference_In;
      entryToUpdate.visit_Reference_Out = visit_Reference_Out;
      entryToUpdate.visit_Reference_In_Name = visit_Reference_In_Name;
      entryToUpdate.visit_Reference_Out_Name = visit_Reference_Out_Name;
      entryToUpdate.visit_Sales_PKR = visit_Sales_PKR;
      entryToUpdate.visit_Sales_Cur = visit_Sales_Cur;
      entryToUpdate.visit_Purchase_Rate_PKR = visit_Purchase_Rate_PKR;
      entryToUpdate.visit_Purchase_Cur = visit_Purchase_Cur;
      entryToUpdate.visit_Sales_Rate_Oth_Curr = visit_Sales_Rate_Oth_Curr;
      entryToUpdate.visit_Purchase_Rate_Oth_Cur = visit_Purchase_Rate_Oth_Cur;
      entryToUpdate.visit_Section_Picture = visit_Section_Picture;

      entryToUpdate.ticket_Reference_In = ticket_Reference_In;
      entryToUpdate.ticket_Reference_Out = ticket_Reference_Out;
      entryToUpdate.ticket_Reference_In_Name = ticket_Reference_In_Name;
      entryToUpdate.ticket_Reference_Out_Name = ticket_Reference_Out_Name;
      entryToUpdate.ticket_Sales_PKR = ticket_Sales_PKR;
      entryToUpdate.ticket_Sales_Cur = ticket_Sales_Cur;
      entryToUpdate.ticket_Purchase_PKR = ticket_Purchase_PKR;
      entryToUpdate.ticket_Purchase_Cur = ticket_Purchase_Cur;
      entryToUpdate.ticket_Sales_Rate_Oth_Cur = ticket_Sales_Rate_Oth_Cur;
      entryToUpdate.ticket_Purchase_Rate_Oth_Cur = ticket_Purchase_Rate_Oth_Cur;
      entryToUpdate.ticket_Section_Picture = ticket_Section_Picture;

      entryToUpdate.azad_Visa_Reference_In = azad_Visa_Reference_In;
      entryToUpdate.azad_Visa_Reference_Out = azad_Visa_Reference_Out;
      entryToUpdate.azad_Visa_Reference_In_Name = azad_Visa_Reference_In_Name;
      entryToUpdate.azad_Visa_Reference_Out_Name = azad_Visa_Reference_Out_Name;
      entryToUpdate.azad_Visa_Sales_PKR = azad_Visa_Sales_PKR;
      entryToUpdate.azad_Visa_Sales_Cur = azad_Visa_Sales_Cur;
      entryToUpdate.azad_Visa_Purchase_PKR = azad_Visa_Purchase_PKR;
      entryToUpdate.azad_Visa_Purchase_Cur = azad_Visa_Purchase_Cur;
      entryToUpdate.azad_Visa_Sales_Rate_Oth_Cur = azad_Visa_Sales_Rate_Oth_Cur;
      entryToUpdate.azad_Visa_Purchase_Rate_Oth_Cur =
        azad_Visa_Purchase_Rate_Oth_Cur;
      entryToUpdate.azad_Visa_Section_Picture = azad_Visa_Section_Picture;
      entryToUpdate.protector_Price_In = protector_Price_In;
      entryToUpdate.protector_Price_In_Oth_Cur = protector_Price_In_Oth_Cur;
      entryToUpdate.protector_Reference_In = protector_Reference_In;
      entryToUpdate.protector_Reference_In_Name = protector_Reference_In_Name;
      entryToUpdate.protector_Price_Out = protector_Price_Out;

      // Save the updated entry to the database

      await entryToUpdate.save();
      res
        .status(200)
        .json({ data: entryToUpdate, message: "Entry updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}