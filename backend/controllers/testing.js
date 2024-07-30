const addMultipleEnteries = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user) {
      const entries = req.body.entries;

      const addedEntries = [];
      const paymentInfo = {};

      for (const entryData of entries) {
        let final_Status = entryData.final_Status
        let name=entryData.name
        entryData.flight_Date =
          entryData.flight_Date !== undefined && entryData.flight_Date !== ""
            ? entryData.flight_Date
            : "No Fly";
            if (entryData.reference_Out &&(entryData.reference_Out.trim().toLowerCase().includes('candidate')||entryData.reference_Out.trim().toLowerCase().includes('direct'))) {
              entryData.reference_Out_Name = entryData.name;
            }
            if (entryData.reference_In&&(entryData.reference_In.trim().toLowerCase().includes('candidate')||entryData.reference_In.trim().toLowerCase().includes('direct')) ) {
              entryData.reference_In_Name = entryData.name;
            }
            
              if (entryData.visit_Reference_In&&(entryData.visit_Reference_In.trim().toLowerCase().includes('candidate')|| entryData.visit_Reference_In.trim().toLowerCase().includes('direct'))) {
                entryData.visit_Reference_In_Name = entryData.name;
              
              if (entryData.visit_Reference_Out&&(entryData.visit_Reference_Out.trim().toLowerCase().includes('candidate')||entryData.visit_Reference_Out.trim().toLowerCase().includes('direct'))) {
                entryData.visit_Reference_Out_Name = entryData.name;
              }
            }
            

              if (entryData.ticket_Reference_In&&(entryData.ticket_Reference_In.trim().toLowerCase().includes('candidate')||entryData.ticket_Reference_In.trim().toLowerCase().includes('direct'))) {
                entryData.ticket_Reference_In_Name = entryData.name;
              }
              if (entryData.ticket_Reference_Out&&(entryData.ticket_Reference_Out.trim().toLowerCase().includes('candidate')||entryData.ticket_Reference_Out.trim().toLowerCase().includes('direct'))) {
                entryData.ticket_Reference_Out_Name = entryData.name;
              }
            
       
              if (entryData.azad_Visa_Reference_In&&(entryData.azad_Visa_Reference_In.trim().toLowerCase().includes('candidate')||entryData.azad_Visa_Reference_In.trim().toLowerCase().includes('direct'))) {
                entryData.azad_Visa_Reference_In_Name = entryData.name;
              }
              if (entryData.azad_Visa_Reference_Out&&(entryData.azad_Visa_Reference_Out.trim().toLowerCase().includes('candidate')||entryData.azad_Visa_Reference_Out.trim().toLowerCase().includes('direct'))) {
                entryData.azad_Visa_Reference_Out_Name = entryData.name;
              }
            
        if (!entryData.entry_Date) {
          entryData.entry_Date = new Date().toISOString().split("T")[0]
        }

        let unSavedEntries=[]

        const existingPPNO = await Entries.findOne({
          pp_No: new RegExp(`^${entryData.pp_No}$`, 'i')
        });
        if(existingPPNO){
          unSavedEntries.push(entryData)
          continue
        }       
      if(entryData.company){
        const companies=await Companies.find({})
       const existCompany=companies.find(data=>data.company.trim().toLowerCase()===entryData.company.trim().toLowerCase())
        if (!existCompany){
          unSavedEntries.push(entryData)
          continue
        } 
      }
      if(entryData.trade){
     const trades=await Trades.find({})
     const existingTrade=trades.find(data=>data.trade.trim().toLowerCase()===entryData.trade.trim().toLowerCase())
     if (!existingTrade){
      unSavedEntries.push(entryData)
      continue
     };
     
      }
      if(entryData.entry_Mode){
        const entryModes=await EntryMode.find({})
        const  existingEntryMode=entryModes.find(data=>data.entry_Mode.trim().toLowerCase()===entryData.entry_Mode.trim().toLowerCase())
       
     if (!existingEntryMode){
      unSavedEntries.push(entryData)
      continue
    } 

        
      }
      if(entryData.final_Status){
        const finalStatuses=await FinalStatus.find({})
        const  existingFinalStatus=finalStatuses.find(data=>data.final_Status.trim().toLowerCase()===entryData.final_Status.trim().toLowerCase())
     if (!existingFinalStatus) {
      unSavedEntries.push(entryData)
      continue
     };
       
      }
      if(entryData.reference_Out_Name && (entryData.reference_Out.toLowerCase().includes('agent')||entryData.reference_Out.toLowerCase().includes('supplier'))){
        const allOutVisas=await VSP.find({})
        const visaReference_Out=allOutVisas.find(data=>data.supplierName.trim().toLowerCase()===entryData.reference_Out_Name.trim().toLowerCase())
     

     if (!visaReference_Out) {
      unSavedEntries.push(entryData)
      continue
     };

      }

      if(entryData.reference_In_Name && (entryData.reference_In.toLowerCase().includes('agent')||entryData.reference_In.toLowerCase().includes('supplier'))){
        const allInVisas=await VPP.find({})
        const visaReference_In=allInVisas.find(data=>data.supplierName.trim().toLowerCase()===entryData.reference_In_Name.trim().toLowerCase())
  
     if (!visaReference_In) {
      unSavedEntries.push(entryData)
      continue
     };

      }

      if(entryData.azad_Visa_Reference_Out_Name && (entryData.azad_Visa_Reference_Out.toLowerCase().includes('agent')||entryData.azad_Visa_Reference_Out.toLowerCase().includes('supplier'))){
        const allOutAzasVisas=await AVPP.find({})
        const azadVisaReference_Out=allOutAzasVisas.find(data=>data.supplierName.trim().toLowerCase()===entryData.azad_Visa_Reference_Out_Name.trim().toLowerCase())
        
     if (!azadVisaReference_Out) {
      unSavedEntries.push(entryData)
      continue
     };

      }

      if(entryData.azad_Visa_Reference_In_Name && (entryData.azad_Visa_Reference_In.toLowerCase().includes('agent')||entryData.azad_Visa_Reference_In.toLowerCase().includes('supplier'))){
        const allInAzasVisas=await AVSP.find({})
        const azadVisaReference_In=allInAzasVisas.find(data=>data.supplierName.trim().toLowerCase()===entryData.azad_Visa_Reference_In_Name.trim().toLowerCase())
     if (!azadVisaReference_In) {
      unSavedEntries.push(entryData)
      continue
     }

      }

      
      if(entryData.ticket_Reference_Out_Name && (entryData.ticket_Reference_Out.toLowerCase().includes('agent')||entryData.ticket_Reference_Out.toLowerCase().includes('supplier'))){
        const allOutTickets=await TPP.find({})
        const  ticketReference_Out=allOutTickets.find(data=>data.supplierName.trim().toLowerCase()===entryData.ticket_Reference_Out_Name.trim().toLowerCase())
     if (!ticketReference_Out){
      unSavedEntries.push(entryData)
      continue
     }

      }

      if(entryData.ticket_Reference_In_Name && (entryData.ticket_Reference_In.toLowerCase().includes('agent')||entryData.ticket_Reference_In.toLowerCase().includes('supplier'))){
        const allInTickets=await TSP.find({})
        const ticketReference_In=allInTickets.find(data=>data.supplierName.trim().toLowerCase()===entryData.ticket_Reference_In_Name.trim().toLowerCase())
     if (!ticketReference_In){
      unSavedEntries.push(entryData)
      continue
     }

      }
      if(entryData.visit_Reference_Out_Name && (entryData.visit_Reference_Out.toLowerCase().includes('agent')||entryData.visit_Reference_Out.toLowerCase().includes('supplier'))){
        
        const allOutVisits=await VISP.find({})
        const visitReference_Out=allOutVisits.find(data=>data.supplierName.trim().toLowerCase()===entryData.visit_Reference_Out_Name.trim().toLowerCase())
     if (!visitReference_Out){
      unSavedEntries.push(entryData)
      continue
     }

      }

      if(entryData.visit_Reference_In_Name && (entryData.visit_Reference_In.toLowerCase().includes('agent')||entryData.visit_Reference_In.toLowerCase().includes('supplier'))){
       
        const allInVisits=await VIPP.find({})
        const visitReference_In=allInVisits.find(data=>data.supplierName.trim().toLowerCase()===entryData.visit_Reference_In_Name.trim().toLowerCase())
     if (!visitReference_In){
      unSavedEntries.push(entryData)
      continue
     }

      }

      if(entryData.protector_Reference_In_Name){
        const protectors=await ProtectorParties.find({})
        const  protectorReference_Out=protectors.find(data=>data.supplierName.trim().toLowerCase()===entryData.protector_Reference_In_Name.trim().toLowerCase())
     if (!protectorReference_Out){
      unSavedEntries.push(entryData)
      continue
     }

      }

        if (!existingPPNO) {
          if (entryData.final_Status&&(entryData.final_Status.trim().toLowerCase() === 'offer letter' || entryData.final_Status.trim().toLowerCase() === 'offer latter')) {
            const newReminder = new Reminders({
              type: "Offer Letter",
              content: `${name}'s Final Status is updated to Offer Letter.`,
              date: new Date().toISOString().split("T")[0]
            });
            await newReminder.save();
          }
          
          if (entryData.final_Status&&(entryData.final_Status.trim().toLowerCase() === 'e number' || entryData.final_Status.trim().toLowerCase() === 'e_number')) {
    
            const newReminder = new Reminders({
              type: "E Number",
              content: `${name}'s Final Status is updated to E Number.`,
              date: new Date().toISOString().split("T")[0]
            });
            await newReminder.save();
          }
          
          if (entryData.final_Status&&(entryData.final_Status.trim().toLowerCase() === 'qvc' || entryData.final_Status.trim().toLowerCase() === 'q_v_c')) {
            const newReminder = new Reminders({
              type: "QVC",
              content: `${name}'s Final Status is updated to QVC.`,
              date: new Date().toISOString().split("T")[0]
            });
            await newReminder.save();
          }
          
          if (entryData.final_Status&&(entryData.final_Status.trim().toLowerCase() === 'visa issued' || entryData.final_Status.trim().toLowerCase() === 'visa_issued' || entryData.final_Status.trim().toLowerCase() === 'vissa issued' || entryData.final_Status.trim().toLowerCase() === 'vissa_issued')) {
            const newReminder = new Reminders({
              type: "Visa Issued",
              content: `${name}'s Final Status is updated to Visa Issued.`,
              date: new Date().toISOString().split("T")[0]
            });
            await newReminder.save();
          }
          
          if (entryData.final_Status&&(entryData.final_Status.trim().toLowerCase() === 'ptn' || entryData.final_Status.trim().toLowerCase() === 'p_t_n')) {
            const newReminder = new Reminders({
              type: "PTN",
              content: `${name}'s Final Status is updated to PTN.`,
              date: new Date().toISOString().split("T")[0]
            });
            await newReminder.save();
          }
          
          if (entryData.final_Status&&(entryData.final_Status.trim().toLowerCase() === 'ticket' || final_Status.trim().toLowerCase() === 'tiket')) {
            const newReminder = new Reminders({
              type: "Ticket",
              content: `${name}'s Final Status is updated to Ticket.`,
              date: new Date().toISOString().split("T")[0]
            });
            await newReminder.save();
          }

          const newEntry = new Entries(entryData);
          const suppliers=await Suppliers.find({})

          if (
            entryData.reference_Out === "SUPPLIERS" ||
            entryData.reference_Out === "SUPPLIER" ||
            entryData.reference_Out === "suppliers" ||
            entryData.reference_Out === "supplier" ||
            entryData.reference_Out === "Suppliers" ||
            entryData.reference_Out === "Supplier"
          ) {
            let existingPaymentInSupplier;
            // Check if the supplier with the given name exists
            for(const supplier of suppliers){
              if(supplier.payment_In_Schema){
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.reference_Out_Name.toLowerCase()&& supplier.payment_In_Schema.status.toLowerCase()==='open'){
                  existingPaymentInSupplier=supplier
                  break
                }
              }
             
            }
        
            if (!existingPaymentInSupplier) {
              const newPaymentInSupplier = new Suppliers({
                payment_In_Schema: {
                  supplier_Id: newEntry._id,
                  supplierName: entryData.reference_Out_Name,
                  total_Visa_Price_In_PKR: entryData?.visa_Sales_Rate_PKR ?? 0,
                  remaining_Balance: entryData?.visa_Sales_Rate_PKR ?? 0,

                  total_Visa_Price_In_Curr:
                  entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                  remaining_Curr: entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                  curr_Country: entryData.cur_Country_One,
                  opening:0??0,
                  closing:0,
                  persons: [
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      visa_Price_In_PKR: entryData?.visa_Sales_Rate_PKR ?? 0,
                      remaining_Price: entryData?.visa_Sales_Rate_PKR ?? 0,

                      visa_Price_In_Curr:
                        entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                      remaining_Curr: entryData?.visa_Sale_Rate_Oth_Cur ?? 0,

                      company: entryData.company,
                      country: entryData.country,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    },
                  ],
                },
              });
              await newPaymentInSupplier.save();
           
              paymentInfo.newPaymentInSupplier = newPaymentInSupplier;
            } else {
              const existingPersonIndex =
                existingPaymentInSupplier.payment_In_Schema.persons.findIndex(
                  (person) =>
                    person.pp_No === entryData.pp_No &&
                    person.entry_Mode === entryData.entry_Mode &&
                    person.name === entryData.name
                );
              if (existingPersonIndex !== -1) {
                existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_PKR +=
                  entryData?.visa_Sales_Rate_PKR ?? 0;
                existingPaymentInSupplier.payment_In_Schema.remaining_Balance +=
                  entryData?.visa_Sales_Rate_PKR ?? 0;

                existingPaymentInSupplier.payment_In_Schema.total_Visa_Price_In_Curr +=
                  entryData?.visa_Sale_Rate_Oth_Cur ?? 0;
                existingPaymentInSupplier.payment_In_Schema.remaining_Curr +=
                  entryData?.visa_Sale_Rate_Oth_Cur ?? 0;
              } else {
                existingPaymentInSupplier.payment_In_Schema.persons.push({
                  name: entryData.name,
                  pp_No: entryData.pp_No,
                  entry_Mode: entryData.entry_Mode,
                  trade: entryData.trade,
                  contact: entryData.contact,
                  country: entryData.country,
                  visa_Price_In_PKR: entryData?.visa_Sales_Rate_PKR ?? 0,
                  remaining_Price: entryData?.visa_Sales_Rate_PKR ?? 0,

                  visa_Price_In_Curr: entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                  remaining_Curr: entryData?.visa_Sale_Rate_Oth_Cur ?? 0,

                  company: entryData.company,
                  final_Status: entryData.final_Status,
                  flight_Date: entryData.flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                });

                await existingPaymentInSupplier.updateOne({
                  $inc: {
                    "payment_In_Schema.total_Visa_Price_In_PKR":
                      entryData?.visa_Sales_Rate_PKR ?? 0,
                    "payment_In_Schema.remaining_Balance":
                      entryData?.visa_Sales_Rate_PKR ?? 0,
                    "payment_In_Schema.total_Visa_Price_In_Curr":
                      entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                    "payment_In_Schema.remaining_Curr":
                      entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                     
                  },
                 
                });
              }

              await existingPaymentInSupplier.save();
              paymentInfo.existingPaymentInSupplier = existingPaymentInSupplier;
            }
          }

          if (
            entryData.reference_In === "SUPPLIERS" ||
            entryData.reference_In === "SUPPLIER" ||
            entryData.reference_In === "suppliers" ||
            entryData.reference_In === "supplier" ||
            entryData.reference_In === "Suppliers" ||
            entryData.reference_In === "Supplier"
          ) {
            let existingPaymentOutSupplier;
            for(const supplier of suppliers){
              if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.reference_In_Name.toLowerCase()&& supplier.payment_Out_Schema.status.toLowerCase()==='open'){
                existingPaymentOutSupplier=supplier
                break
              }
            }

            if (!existingPaymentOutSupplier) {
              const newPaymentOutSupplier = new Suppliers({
                payment_Out_Schema: {
                  supplier_Id: newEntry._id,
                  supplierName: entryData.reference_In_Name,
                  total_Visa_Price_Out_PKR:
                    entryData?.visa_Purchase_Rate_PKR ?? 0,
                  remaining_Balance: entryData?.visa_Purchase_Rate_PKR ?? 0,

                  total_Visa_Price_Out_Curr:
                    entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,
                  remaining_Curr: entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,

                  curr_Country: entryData.cur_Country_Two,
                  opening:0,
                  closing:0,
                  persons: [
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      visa_Price_Out_PKR:
                        entryData?.visa_Purchase_Rate_PKR ?? 0,
                      remaining_Price: entryData?.visa_Purchase_Rate_PKR ?? 0,

                      visa_Price_Out_Curr:
                        entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,
                      remaining_Curr:
                        entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,

                      company: entryData.company,
                      country: entryData.country,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
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
                    person.pp_No === entryData.pp_No &&
                    person.entry_Mode === entryData.entry_Mode
                );

              if (existingPersonIndex !== -1) {
                existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_PKR +=
                  entryData?.visa_Purchase_Rate_PKR ?? 0;
                existingPaymentOutSupplier.payment_Out_Schema.remaining_Balance +=
                  entryData?.visa_Purchase_Rate_PKR ?? 0;

                existingPaymentOutSupplier.payment_Out_Schema.total_Visa_Price_Out_Curr +=
                  entryData?.visa_Purchase_Rate_Oth_Cur ?? 0;
                existingPaymentOutSupplier.payment_Out_Schema.remaining_Curr +=
                  entryData?.visa_Purchase_Rate_Oth_Cur ?? 0;
              } else {
                existingPaymentOutSupplier.payment_Out_Schema.persons.push({
                  name: entryData.name,
                  pp_No: entryData.pp_No,
                  entry_Mode: entryData.entry_Mode,
                  trade: entryData.trade,
                  contact: entryData.contact,
                  visa_Price_Out_PKR: entryData?.visa_Purchase_Rate_PKR ?? 0,
                  remaining_Price: entryData?.visa_Purchase_Rate_PKR ?? 0,

                  visa_Price_Out_Curr:
                    entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,
                  remaining_Curr: entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,

                  company: entryData.company,
                  country: entryData.country,
                  final_Status: entryData.final_Status,
                  flight_Date: entryData.flight_Date,
                  entry_Date: new Date().toISOString().split("T")[0],
                });


                const newStatus = existingPaymentOutSupplier.payment_Out_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentOutSupplier.payment_Out_Schema.status;
                const isStatusClosed = existingPaymentOutSupplier.payment_Out_Schema.status.toLowerCase() === 'closed';

                await existingPaymentOutSupplier.updateOne({
                  $inc: {
                    "payment_Out_Schema.total_Visa_Price_Out_PKR":
                      entryData?.visa_Purchase_Rate_PKR ?? 0,
                    "payment_Out_Schema.remaining_Balance":
                      entryData?.visa_Purchase_Rate_PKR ?? 0,

                    "payment_Out_Schema.total_Visa_Price_Out_Curr":
                      entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,
                    "payment_Out_Schema.remaining_Curr":
                      entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,
                      
                  },
                 
                });
              }

              await existingPaymentOutSupplier.save();
              paymentInfo.existingPaymentOutSupplier =
                existingPaymentOutSupplier;
            }
          }

        const agents=await Agents.find({})
          //Saving the Entry Details to the Agents Payment In Section if reference_Out==="Agents"
          if (
            entryData.reference_Out === "AGENTS" ||
            entryData.reference_Out === "AGENT" ||
            entryData.reference_Out === "agents" ||
            entryData.reference_Out === "agent" ||
            entryData.reference_Out === "Agents" ||
            entryData.reference_Out === "Agent"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentInAgent;
            for(const agent of agents){
              if(agent.payment_In_Schema && agent.payment_In_Schema.supplierName.toLowerCase()===entryData.reference_Out_Name.toLowerCase()&& agent.payment_In_Schema.status.toLowerCase()==='open'){
                existingPaymentInAgent=agent
                break
              }
            }

              if (!existingPaymentInAgent) {
                // If the supplier does not exist, create a new one
                const newPaymentInAgent = new Agents({
                  payment_In_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.reference_Out_Name,
                    total_Visa_Price_In_PKR:
                      entryData?.visa_Sales_Rate_PKR ?? 0,
                    remaining_Price: entryData?.visa_Sales_Rate_PKR ?? 0,
                    total_Visa_Price_In_Curr:
                      entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                    curr_Country: entryData.cur_Country_One,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        contact: entryData.contact,
                        country: entryData.country,
                        visa_Price_In_PKR: entryData?.visa_Sales_Rate_PKR ?? 0,
                        remaining_Price: entryData?.visa_Sales_Rate_PKR ?? 0,
                        visa_Price_In_Curr:
                          entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                        remaining_Curr: entryData?.visa_Sale_Rate_Oth_Cur ?? 0,

                        company: entryData.company,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentInAgent.save();
                paymentInfo.newPaymentInAgent = newPaymentInAgent;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentInAgent.payment_In_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentInAgent.payment_In_Schema.total_Visa_Price_In_PKR +=
                    entryData?.visa_Sales_Rate_PKR ?? 0;
                  existingPaymentInAgent.payment_In_Schema.remaining_Balance +=
                    entryData?.visa_Sales_Rate_PKR ?? 0;

                  existingPaymentInAgent.payment_In_Schema.total_Visa_Price_In_Curr +=
                    entryData?.visa_Sale_Rate_Oth_Cur ?? 0;
                  existingPaymentInAgent.payment_In_Schema.remaining_Curr +=
                    entryData?.visa_Sale_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentInAgent.payment_In_Schema.persons.push({
                    name: entryData.name,
                    pp_No: entryData.pp_No,
                    entry_Mode: entryData.entry_Mode,
                    trade: entryData.trade,
                    contact: entryData.contact,
                    country: entryData.country,
                    visa_Price_In_PKR: entryData?.visa_Sales_Rate_PKR ?? 0,
                    remaining_Price: entryData?.visa_Sales_Rate_PKR ?? 0,

                    visa_Price_In_Curr: entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.visa_Sale_Rate_Oth_Cur ?? 0,

                    company: entryData.company,
                    final_Status: entryData.final_Status,
                    flight_Date: entryData.flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  });

                  const newStatus = existingPaymentInAgent.payment_In_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentInAgent.payment_In_Schema.status;
                const isStatusClosed = existingPaymentInAgent.payment_In_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentInAgent.updateOne({
                    $inc: {
                      "payment_In_Schema.total_Visa_Price_In_PKR":
                        entryData?.visa_Sales_Rate_PKR ?? 0,
                      "payment_In_Schema.remaining_Balance":
                        entryData?.visa_Sales_Rate_PKR ?? 0,

                      "payment_In_Schema.total_Visa_Price_In_Curr":
                        entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                      "payment_In_Schema.remaining_Curr":
                        entryData?.visa_Sale_Rate_Oth_Cur ?? 0,           
                      

                    },
                   
                  });
                }

                await existingPaymentInAgent.save();
                paymentInfo.existingPaymentInAgent = existingPaymentInAgent;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Agents Payment Out Section if reference_In==="Agents"
          if (
            entryData.reference_In === "AGENTS" ||
            entryData.reference_In === "AGENT" ||
            entryData.reference_In === "agents" ||
            entryData.reference_In === "agent" ||
            entryData.reference_In === "Agents" ||
            entryData.reference_In === "Agent"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentOutAgent
            for(const agent of agents){
              if(agent.payment_Out_Schema && agent.payment_Out_Schema.supplierName.toLowerCase()===entryData.reference_In_Name.toLowerCase()&& agent.payment_Out_Schema.status.toLowerCase()==='open'){
                existingPaymentOutAgent=agent
                break
              }
            }

              if (!existingPaymentOutAgent) {
                // If the supplier does not exist, create a new one
                const newPaymentOutAgent = new Agents({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.reference_In_Name,
                    total_Visa_Price_Out_PKR:
                      entryData?.visa_Purchase_Rate_PKR ?? 0,
                    remaining_Balance: entryData?.visa_Purchase_Rate_PKR ?? 0,

                    total_Visa_Price_Out_Curr:
                      entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_Two,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        contact: entryData.contact,
                        country: entryData.country,
                        visa_Price_Out_PKR:
                          entryData?.visa_Purchase_Rate_PKR ?? 0,
                        remaining_Price: entryData?.visa_Purchase_Rate_PKR ?? 0,
                        visa_Price_Out_Curr:
                          entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,
                        remaining_Curr:
                          entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,

                        company: entryData.company,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentOutAgent.save();
                paymentInfo.newPaymentOutAgent = newPaymentOutAgent;
              } else {
                const existingPersonIndex =
                  existingPaymentOutAgent.payment_Out_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  existingPaymentOutAgent.payment_Out_Schema.total_Visa_Price_Out_PKR +=
                    entryData?.visa_Purchase_Rate_PKR ?? 0;
                  existingPaymentOutAgent.payment_Out_Schema.remaining_Balance +=
                    entryData?.visa_Purchase_Rate_PKR ?? 0;

                  existingPaymentOutAgent.payment_Out_Schema.total_Visa_Price_Out_Curr +=
                    entryData?.visa_Purchase_Rate_Oth_Cur ?? 0;
                  existingPaymentOutAgent.payment_Out_Schema.remaining_Curr +=
                    entryData?.visa_Purchase_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentOutAgent.payment_Out_Schema.persons.push({
                    name: entryData.name,
                    pp_No: entryData.pp_No,
                    entry_Mode: entryData.entry_Mode,
                    trade: entryData.trade,
                    contact: entryData.contact,
                    country: entryData.country,
                    visa_Price_Out_PKR: entryData?.visa_Purchase_Rate_PKR ?? 0,
                    remaining_Price: entryData?.visa_Purchase_Rate_PKR ?? 0,

                    visa_Price_Out_Curr:
                      entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,

                    company: entryData.company,
                    final_Status: entryData.final_Status,
                    flight_Date: entryData.flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  });

                  const newStatus = existingPaymentOutAgent.payment_Out_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentOutAgent.payment_Out_Schema.status;
                  const isStatusClosed = existingPaymentOutAgent.payment_Out_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_In_Price_PKR and other fields using $inc
                  await existingPaymentOutAgent.updateOne({
                    $inc: {
                      "payment_Out_Schema.total_Visa_Price_Out_PKR":
                        entryData?.visa_Purchase_Rate_PKR ?? 0,
                      "payment_Out_Schema.remaining_Balance":
                        entryData?.visa_Purchase_Rate_PKR ?? 0,

                      "payment_Out_Schema.total_Visa_Price_Out_Curr":
                        entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,
                      "payment_Out_Schema.remaining_Curr":
                        entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,
                        
                    },
                   
                  });
                }

                await existingPaymentOutAgent.save();
                paymentInfo.existingPaymentOutAgent = existingPaymentOutAgent;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }

          //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
          if (
            entryData.reference_Out === "CANDIDATES" ||
            entryData.reference_Out === "CANDIDATE" ||
            entryData.reference_Out === "candidates" ||
            entryData.reference_Out === "candidate" ||
            entryData.reference_Out === "Candidates" ||
            entryData.reference_Out === "Candidate" ||
            entryData.reference_Out === "DIRECTS" ||
            entryData.reference_Out === "DIRECT" ||
            entryData.reference_Out === "directs" ||
            entryData.reference_Out === "direct" ||
            entryData.reference_Out === "Directs" ||
            entryData.reference_Out === "Direct"
          ) {
          
            try {
              // Check if the supplier with the given name and entry mode exists
              const existingPaymentInCandidate = await Candidate.findOne({
                "payment_In_Schema.supplierName": entryData.name,
                "payment_In_Schema.entry_Mode": entryData.entry_Mode,
                "payment_In_Schema.pp_No": entryData.pp_No,
              });

              if (!existingPaymentInCandidate) {
                // If the supplier does not exist with the same entry mode, create a new one
                const newPaymentInCandidate = new Candidate({
                  payment_In_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.name,
                    total_Visa_Price_In_PKR:
                      entryData?.visa_Sales_Rate_PKR ?? 0,
                    remaining_Balance: entryData?.visa_Sales_Rate_PKR ?? 0,

                    total_Visa_Price_In_Curr:
                      entryData?.visa_Sale_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.visa_Sale_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_One,
                    pp_No: entryData.pp_No,
                    entry_Mode: entryData.entry_Mode,
                    trade: entryData.trade,
                    country: entryData.country,
                    contact: entryData.contact,
                    company: entryData.company,
                    final_Status: entryData.final_Status,
                    flight_Date: entryData.flight_Date,
                  },
                });

                await newPaymentInCandidate.save();
                paymentInfo.newPaymentInCandidate = newPaymentInCandidate;
              } else {
                // If the supplier exists with the same entry mode, handle accordingly (e.g., update, do nothing)
                // You may choose to update or do nothing based on your specific requirements
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }

          //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
          if (
            entryData.reference_In === "CANDIDATES" ||
            entryData.reference_In === "CANDIDATE" ||
            entryData.reference_In === "candidates" ||
            entryData.reference_In === "candidate" ||
            entryData.reference_In === "Candidates" ||
            entryData.reference_In === "Candidate" ||
            entryData.reference_In === "DIRECTS" ||
            entryData.reference_In === "DIRECT" ||
            entryData.reference_In === "directs" ||
            entryData.reference_In === "direct" ||
            entryData.reference_In === "Directs" ||
            entryData.reference_In === "Direct"
          ) {
           

            try {
              // Check if the supplier with the given name exists
              const existingPaymentOutCandidate = await Candidate.findOne({
                "payment_Out_Schema.supplierName": entryData.name,
                "payment_Out_Schema.entry_Mode": entryData.entry_Mode,
                "payment_Out_Schema.pp_No": entryData.pp_No,
              });

              if (!existingPaymentOutCandidate) {
                // If the supplier does not exist, create a new one
                const newPaymentOutCandidate = new Candidate({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.name,
                    total_Visa_Price_Out_PKR:
                      entryData?.visa_Purchase_Rate_PKR ?? 0,
                    remaining_Balance: entryData?.visa_Purchase_Rate_PKR ?? 0,

                    total_Visa_Price_Out_Curr:
                      entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.visa_Purchase_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_Two,
                    pp_No: entryData.pp_No,
                    entry_Mode: entryData.entry_Mode,
                    company: entryData.company,
                    trade: entryData.trade,
                    country: entryData.country,
                    contact: entryData.contact,
                    final_Status: entryData.final_Status,
                    flight_Date: entryData.flight_Date,
                  },
                });

                await newPaymentOutCandidate.save();
                paymentInfo.newPaymentOutCandidate = newPaymentOutCandidate;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }

          //Handling Azad Visa Suppliers
          const azadSuppliers= await AzadSupplier.find({})
          const azadAgents= await AzadAgents.find({})


          //Saving the Entry Details to the Azad Visa Payment In Section if azad_Visa_Reference_Out_Name is Supplier
          if (
            entryData.azad_Visa_Reference_Out === "SUPPLIERS" ||
            entryData.azad_Visa_Reference_Out === "SUPPLIER" ||
            entryData.azad_Visa_Reference_Out === "suppliers" ||
            entryData.azad_Visa_Reference_Out === "supplier" ||
            entryData.azad_Visa_Reference_Out === "Suppliers" ||
            entryData.azad_Visa_Reference_Out === "Supplier"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentInAzadSupplier
              for (const supplier of azadSuppliers){
                if(supplier.payment_In_Schema){
                  if(supplier.payment_In_Schema && supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.azad_Visa_Reference_Out_Name.toLowerCase()&& supplier.payment_In_Schema.status.toLowerCase()==='open'){
                    existingPaymentInAzadSupplier = supplier;
                    break
                  }
                }
               }

              if (!existingPaymentInAzadSupplier) {
                // If the supplier does not exist, create a new one
                const newPaymentInAzadSupplier = new AzadSupplier({
                  payment_In_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.azad_Visa_Reference_Out_Name,
                    total_Azad_Visa_Price_In_PKR:
                      entryData?.azad_Visa_Sales_PKR ?? 0,
                    remaining_Balance: entryData?.azad_Visa_Sales_PKR ?? 0,

                    total_Azad_Visa_Price_In_Curr:
                      entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,
                    remaining_Curr:
                      entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_One,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        contact: entryData.contact,
                        azad_Visa_Price_In_PKR:
                          entryData?.azad_Visa_Sales_PKR ?? 0,
                        azad_Visa_Price_In_Curr:
                          entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,
                        company: entryData.company,
                        country: entryData.country,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentInAzadSupplier.save();
                paymentInfo.newPaymentInAzadSupplier = newPaymentInAzadSupplier;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentInAzadSupplier.payment_In_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentInAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                    entryData?.azad_Visa_Sales_PKR ?? 0;
                  existingPaymentInAzadSupplier.payment_In_Schema.remaining_Balance +=
                    entryData?.azad_Visa_Sales_PKR ?? 0;

                  existingPaymentInAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                    entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0;
                  existingPaymentInAzadSupplier.payment_In_Schema.remaining_Curr +=
                    entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentInAzadSupplier.payment_In_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      azad_Visa_Price_In_PKR:
                        entryData?.azad_Visa_Sales_PKR ?? 0,
                      azad_Visa_Price_In_Curr:
                        entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,
                      company: entryData.company,
                      country: entryData.country,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    }
                  );

                  const newStatus = existingPaymentInAzadSupplier.payment_In_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentInAzadSupplier.payment_In_Schema.status;
                const isStatusClosed = existingPaymentInAzadSupplier.payment_In_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentInAzadSupplier.updateOne({
                    $inc: {
                      "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                        entryData?.azad_Visa_Sales_PKR ?? 0,
                      "payment_In_Schema.remaining_Balance":
                        entryData?.azad_Visa_Sales_PKR ?? 0,

                      "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
                        entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,
                      "payment_In_Schema.remaining_Curr":
                        entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,
                        
                    },
                   
                  });
                }

                await existingPaymentInAzadSupplier.save();
                paymentInfo.existingPaymentInAzadSupplier =
                  existingPaymentInAzadSupplier;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
          if (
            entryData.azad_Visa_Reference_In === "SUPPLIERS" ||
            entryData.azad_Visa_Reference_In === "SUPPLIER" ||
            entryData.azad_Visa_Reference_In === "suppliers" ||
            entryData.azad_Visa_Reference_In === "supplier" ||
            entryData.azad_Visa_Reference_In === "Suppliers" ||
            entryData.azad_Visa_Reference_In === "Supplier"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentOutAzadSupplier
            for (const supplier of azadSuppliers){
              if(supplier.payment_Out_Schema){
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.azad_Visa_Reference_In_Name.toLowerCase()&& supplier.payment_Out_Schema.status.toLowerCase()==='open'){
                  existingPaymentOutAzadSupplier = supplier;
                  break
                }
              }
             }

              if (!existingPaymentOutAzadSupplier) {
                // If the supplier does not exist, create a new one
                const newPaymentOutAzadSupplier = new AzadSupplier({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.azad_Visa_Reference_In_Name,
                    total_Azad_Visa_Price_Out_PKR:
                      entryData?.azad_Visa_Purchase_PKR ?? 0,
                    remaining_Balance: entryData?.azad_Visa_Purchase_PKR ?? 0,

                    total_Azad_Visa_Price_Out_Curr:
                      entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr:
                      entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_Two,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        contact: entryData.contact,
                        azad_Visa_Price_Out_PKR:
                          entryData.azad_Visa_Purchase_PKR,
                        azad_Visa_Price_Out_Curr:
                          entryData.azad_Visa_Purchase_Rate_Oth_Cur,
                        company: entryData.company,
                        country: entryData.country,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentOutAzadSupplier.save();
                paymentInfo.newPaymentOutAzadSupplier =
                  newPaymentOutAzadSupplier;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentOutAzadSupplier.payment_Out_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                    entryData?.azad_Visa_Purchase_PKR ?? 0;
                  existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Balance +=
                    entryData?.azad_Visa_Purchase_PKR ?? 0;

                  existingPaymentOutAzadSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                    entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0;
                  existingPaymentOutAzadSupplier.payment_Out_Schema.remaining_Curr +=
                    entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentOutAzadSupplier.payment_Out_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      azad_Visa_Price_Out_PKR:
                        entryData?.azad_Visa_Purchase_PKR ?? 0,
                      azad_Visa_Price_Out_Curr:
                        entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,
                      company: entryData.company,
                      country: entryData.country,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    }
                  );

                  const newStatus = existingPaymentOutAzadSupplier.payment_Out_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentOutAzadSupplier.payment_Out_Schema.status;
                  const isStatusClosed = existingPaymentOutAzadSupplier.payment_Out_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentOutAzadSupplier.updateOne({
                    $inc: {
                      "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                        entryData?.azad_Visa_Purchase_PKR ?? 0,
                      "payment_Out_Schema.remaining_Balance":
                        entryData?.azad_Visa_Purchase_PKR ?? 0,

                      "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                        entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,
                      "payment_Out_Schema.remaining_Curr":
                        entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,
                        
                    
                    },
                   
                  });
                }

                await existingPaymentOutAzadSupplier.save();
                paymentInfo.existingPaymentOutAzadSupplier =
                  existingPaymentOutAzadSupplier;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Azad Visa Payment In Section if azad_Visa_Reference_Out_Name is Agent
          if (
            entryData.azad_Visa_Reference_Out === "AGENTS" ||
            entryData.azad_Visa_Reference_Out === "AGENT" ||
            entryData.azad_Visa_Reference_Out === "agents" ||
            entryData.azad_Visa_Reference_Out === "agent" ||
            entryData.azad_Visa_Reference_Out === "Agents" ||
            entryData.azad_Visa_Reference_Out === "Agent"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentInAzadAgent
            for (const supplier of azadAgents){
              if(supplier.payment_In_Schema){
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.azad_Visa_Reference_Out_Name.toLowerCase()&& supplier.payment_In_Schema.status.toLowerCase()==='open'){
                  existingPaymentInAzadAgent = supplier;
                  break
                }
              }
             }

              if (!existingPaymentInAzadAgent) {
                // If the supplier does not exist, create a new one
                const newPaymentInAzadAgent = new AzadAgents({
                  payment_In_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.azad_Visa_Reference_Out_Name,
                    total_Azad_Visa_Price_In_PKR:
                      entryData?.azad_Visa_Sales_PKR ?? 0,
                    remaining_Balance: entryData?.azad_Visa_Sales_PKR ?? 0,

                    total_Azad_Visa_Price_In_Curr:
                      entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,
                    remaining_Curr:
                      entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_One,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        contact: entryData.contact,
                        azad_Visa_Price_In_PKR:
                          entryData?.azad_Visa_Sales_PKR ?? 0,
                        azad_Visa_Price_In_Curr:
                          entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,
                        company: company,
                        country: entryData.country,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentInAzadAgent.save();
                paymentInfo.newPaymentInAzadAgent = newPaymentInAzadAgent;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentInAzadAgent.payment_In_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentInAzadAgent.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                    entryData?.azad_Visa_Sales_PKR ?? 0;
                  existingPaymentInAzadAgent.payment_In_Schema.remaining_Balance +=
                    entryData?.azad_Visa_Sales_PKR ?? 0;

                  existingPaymentInAzadAgent.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                    entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0;
                  existingPaymentInAzadAgent.payment_In_Schema.remaining_Curr +=
                    entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentInAzadAgent.payment_In_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      country: entryData.country,
                      azad_Visa_Price_In_PKR:
                        entryData?.azad_Visa_Sales_PKR ?? 0,
                      azad_Visa_Price_In_Curr:
                        entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,
                      company: entryData.company,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    }
                  );

                  const newStatus = existingPaymentInAzadAgent.payment_In_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentInAzadAgent.payment_In_Schema.status;
                const isStatusClosed = existingPaymentInAzadAgent.payment_In_Schema.status.toLowerCase() === 'closed';
                // Update total_Visa_Price_In_PKR and other fields using $inc
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentInAzadAgent.updateOne({
                    $inc: {
                      "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                        entryData?.azad_Visa_Sales_PKR ?? 0,
                      "payment_In_Schema.remaining_Balance":
                        entryData?.azad_Visa_Sales_PKR ?? 0,

                      "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
                        entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,
                      "payment_In_Schema.remaining_Curr":
                        entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,
                       
                    },
                   
                  });
                }

                await existingPaymentInAzadAgent.save();
                paymentInfo.existingPaymentInAzadAgent =
                  existingPaymentInAzadAgent;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
          if (
            entryData.azad_Visa_Reference_In === "AGENTS" ||
            entryData.azad_Visa_Reference_In === "AGENT" ||
            entryData.azad_Visa_Reference_In === "agents" ||
            entryData.azad_Visa_Reference_In === "agent" ||
            entryData.azad_Visa_Reference_In === "Agents" ||
            entryData.azad_Visa_Reference_In === "Agent"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentOutAzadAgent
            for (const supplier of azadAgents){
              if(supplier.payment_Out_Schema){
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.azad_Visa_Reference_In_Name.toLowerCase()&& supplier.payment_Out_Schema.status.toLowerCase()==='open'){
                  existingPaymentOutAzadAgent = supplier;
                  break
                }
              }
             }

              if (!existingPaymentOutAzadAgent) {
                // If the supplier does not exist, create a new one
                const newPaymentOutAzadAgent = new AzadAgents({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.azad_Visa_Reference_In_Name,
                    total_Azad_Visa_Price_Out_PKR:
                      entryData?.azad_Visa_Purchase_PKR ?? 0,
                    remaining_Balance: entryData?.azad_Visa_Purchase_PKR ?? 0,

                    total_Azad_Visa_Price_Out_Curr:
                      entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr:
                      entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_Two,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        country: entryData.country,
                        contact: entryData.contact,
                        azad_Visa_Price_Out_PKR:
                          entryData?.azad_Visa_Purchase_PKR ?? 0,
                        azad_Visa_Price_Out_Curr:
                          entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,
                        company: entryData.company,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentOutAzadAgent.save();
                paymentInfo.newPaymentOutAzadAgent = newPaymentOutAzadAgent;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentOutAzadAgent.payment_Out_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentOutAzadAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                    entryData?.azad_Visa_Purchase_PKR ?? 0;
                  existingPaymentOutAzadAgent.payment_Out_Schema.remaining_Balance +=
                    entryData?.azad_Visa_Purchase_PKR ?? 0;

                  existingPaymentOutAzadAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                    entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0;
                  existingPaymentOutAzadAgent.payment_Out_Schema.remaining_Curr +=
                    entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentOutAzadAgent.payment_Out_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      azad_Visa_Price_Out_PKR:
                        entryData?.azad_Visa_Purchase_PKR ?? 0,
                      azad_Visa_Price_Out_Curr:
                        entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,
                      company: entryData.company,
                      country: entryData.country,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    }
                  );

                  
                const newStatus = existingPaymentOutAzadAgent.payment_Out_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentOutAzadAgent.payment_Out_Schema.status;
                const isStatusClosed = existingPaymentOutAzadAgent.payment_Out_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentOutAzadAgent.updateOne({
                    $inc: {
                      "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                        entryData?.azad_Visa_Purchase_PKR ?? 0,
                      "payment_Out_Schema.remaining_Balance":
                        entryData?.azad_Visa_Purchase_PKR ?? 0,

                      "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                        entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,
                      "payment_Out_Schema.remaining_Curr":
                        entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,
                       
                    },
                   
                  });
                }

                await existingPaymentOutAzadAgent.save();
                paymentInfo.existingPaymentOutAzadAgent =
                  existingPaymentOutAzadAgent;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
          if (
            entryData.azad_Visa_Reference_Out === "CANDIDATES" ||
            entryData.azad_Visa_Reference_Out === "CANDIDATE" ||
            entryData.azad_Visa_Reference_Out === "candidates" ||
            entryData.azad_Visa_Reference_Out === "candidate" ||
            entryData.azad_Visa_Reference_Out === "Candidates" ||
            entryData.azad_Visa_Reference_Out === "Candidate" ||
            entryData.azad_Visa_Reference_Out === "DIRECTS" ||
            entryData.azad_Visa_Reference_Out === "DIRECT" ||
            entryData.azad_Visa_Reference_Out === "directs" ||
            entryData.azad_Visa_Reference_Out === "direct" ||
            entryData.azad_Visa_Reference_Out === "Directs" ||
            entryData.azad_Visa_Reference_Out === "Direct"
          ) {
            try {
              // Check if the supplier with the given name and entry mode exists
              const existingPaymentInAzadCandidate =
                await AzadCandidate.findOne({
                  "payment_In_Schema.supplierName": entryData.name,
                  "payment_In_Schema.entry_Mode":
                    entryData.entry_Mode,
                  "payment_In_Schema.pp_No": entryData.pp_No,
                });

              if (!existingPaymentInAzadCandidate) {
                // If the supplier does not exist with the same entry mode, create a new one
                const newPaymentInAzadCandidate = new AzadCandidate({
                  payment_In_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.name,
                    total_Visa_Price_In_PKR:
                      entryData?.azad_Visa_Sales_PKR ?? 0,
                    remaining_Balance: entryData?.azad_Visa_Sales_PKR ?? 0,

                    total_Visa_Price_In_Curr:
                      entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,
                    remaining_Curr:
                      entryData?.azad_Visa_Sales_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_One,
                    pp_No: entryData.pp_No,
                    country: entryData.country,
                    entry_Mode: entryData.entry_Mode,
                    company: entryData.company,
                    trade: entryData.trade,
                    contact: entryData.contact,
                    final_Status: entryData.final_Status,
                    flight_Date: entryData.flight_Date,
                  },
                });

                await newPaymentInAzadCandidate.save();
                paymentInfo.newPaymentInAzadCandidate =
                  newPaymentInAzadCandidate;
              } else {
                // If the supplier exists with the same entry mode, handle accordingly (e.g., update, do nothing)
                // You may choose to update or do nothing based on your specific requirements
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }

          //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
          if (
            entryData.azad_Visa_Reference_In === "CANDIDATES" ||
            entryData.azad_Visa_Reference_In === "CANDIDATE" ||
            entryData.azad_Visa_Reference_In === "candidates" ||
            entryData.azad_Visa_Reference_In === "candidate" ||
            entryData.azad_Visa_Reference_In === "Candidates" ||
            entryData.azad_Visa_Reference_In === "Candidate"||
            entryData.azad_Visa_Reference_In === "DIRECTS" ||
            entryData.azad_Visa_Reference_In === "DIRECT" ||
            entryData.azad_Visa_Reference_In === "directs" ||
            entryData.azad_Visa_Reference_In === "direct" ||
            entryData.azad_Visa_Reference_In === "Directs" ||
            entryData.azad_Visa_Reference_In === "Direct"
          ) {
            try {
              // Check if the supplier with the given name exists
              const existingPaymentOutAzadCandidate =
                await AzadCandidate.findOne({
                  "payment_Out_Schema.supplierName":
                    entryData.azad_Visa_Reference_In_Name,
                  "payment_Out_Schema.entry_Mode":
                    entryData.entry_Mode,
                  "payment_Out_Schema.pp_No": entryData.pp_No,
                });

              if (!existingPaymentOutAzadCandidate) {
                // If the supplier does not exist, create a new one
                const newPaymentOutAzadCandidate = new AzadCandidate({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.name,
                    total_Visa_Price_Out_PKR:
                      entryData?.azad_Visa_Purchase_PKR ?? 0,
                    remaining_Balance: entryData?.azad_Visa_Purchase_PKR ?? 0,

                    total_Visa_Price_Out_Curr:
                      entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr:
                      entryData?.azad_Visa_Purchase_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_Two,
                    pp_No: entryData.pp_No,
                    entry_Mode: entryData.entry_Mode,
                    company: entryData.company,
                    trade: entryData.trade,
                    country: entryData.country,
                    contact: entryData.contact,
                    final_Status: entryData.final_Status,
                    flight_Date: entryData.flight_Date,
                  },
                });

                await newPaymentOutAzadCandidate.save();
                paymentInfo.newPaymentOutAzadCandidate =
                  newPaymentOutAzadCandidate;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }

          //Handling Ticket Suppliers
          const ticketSuppliers=await TicketSuppliers.find({})
          const ticketAgents=await TicketAgents.find({})


          //Saving the Entry Details to the Ticket Payment In Section if azad_Visa_Reference_Out_Name is Supplier
          if (
            entryData.ticket_Reference_Out === "SUPPLIERS" ||
            entryData.ticket_Reference_Out === "SUPPLIER" ||
            entryData.ticket_Reference_Out === "suppliers" ||
            entryData.ticket_Reference_Out === "supplier" ||
            entryData.ticket_Reference_Out === "Suppliers" ||
            entryData.ticket_Reference_Out === "Supplier"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentInTicketSupplier
              for (const supplier of ticketSuppliers){
                if(supplier.payment_In_Schema){
                  if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.ticket_Reference_Out_Name.toLowerCase()&& supplier.payment_In_Schema.status.toLowerCase()==='open'){
                    existingPaymentInTicketSupplier = supplier;
                    break
                  }
                }
               }

              if (!existingPaymentInTicketSupplier) {
                // If the supplier does not exist, create a new one
                const newPaymentInTicketSupplier = new TicketSuppliers({
                  payment_In_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.ticket_Reference_Out_Name,
                    total_Azad_Visa_Price_In_PKR:
                      entryData?.ticket_Sales_PKR ?? 0,
                    remaining_Balance: entryData?.ticket_Sales_PKR ?? 0,

                    total_Azad_Visa_Price_In_Curr:
                      entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_One,
                    opening:0,
                  closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        contact: entryData.contact,
                        azad_Visa_Price_In_PKR:
                          entryData?.ticket_Sales_PKR ?? 0,
                        azad_Visa_Price_In_Curr:
                          entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,
                        company: entryData.company,
                        country: entryData.country,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentInTicketSupplier.save();
                paymentInfo.newPaymentInTicketSupplier =
                  newPaymentInTicketSupplier;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentInTicketSupplier.payment_In_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentInTicketSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                    entryData?.ticket_Sales_PKR ?? 0;
                  existingPaymentInTicketSupplier.payment_In_Schema.remaining_Balance +=
                    entryData?.ticket_Sales_PKR ?? 0;

                  existingPaymentInTicketSupplier.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                    entryData?.ticket_Sales_Rate_Oth_Cur ?? 0;
                  existingPaymentInTicketSupplier.payment_In_Schema.remaining_Curr +=
                    entryData?.ticket_Sales_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentInTicketSupplier.payment_In_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      country: entryData.country,
                      azad_Visa_Price_In_PKR: entryData?.ticket_Sales_PKR ?? 0,
                      azad_Visa_Price_In_Curr:
                        entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,
                      company: entryData.company,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    }
                  );

                  const newStatus = existingPaymentInTicketSupplier.payment_In_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentInTicketSupplier.payment_In_Schema.status;
                  const isStatusClosed = existingPaymentInTicketSupplier.payment_In_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentInTicketSupplier.updateOne({
                    $inc: {
                      "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                        entryData?.ticket_Sales_PKR ?? 0,
                      "payment_In_Schema.remaining_Balance":
                        entryData?.ticket_Sales_PKR ?? 0,

                      "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
                        entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,
                      "payment_In_Schema.remaining_Curr":
                        entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,
                      
                    },
                   
                  });
                }

                await existingPaymentInTicketSupplier.save();
                paymentInfo.existingPaymentInTicketSupplier =
                  existingPaymentInTicketSupplier;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
          if (
            entryData.ticket_Reference_In === "SUPPLIERS" ||
            entryData.ticket_Reference_In === "SUPPLIER" ||
            entryData.ticket_Reference_In === "suppliers" ||
            entryData.ticket_Reference_In === "supplier" ||
            entryData.ticket_Reference_In === "Suppliers" ||
            entryData.ticket_Reference_In === "Supplier"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentOutTicketSupplier
              for (const supplier of ticketSuppliers){
                if(supplier.payment_Out_Schema){
                  if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.ticket_Reference_In_Name.toLowerCase()&& supplier.payment_Out_Schema.status.toLowerCase()==='open'){
                    existingPaymentOutTicketSupplier = supplier;
                    break
                  }
                }
               }

              if (!existingPaymentOutTicketSupplier) {
                // If the supplier does not exist, create a new one
                const newPaymentOutTicketSupplier = new TicketSuppliers({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.ticket_Reference_In_Name,
                    total_Azad_Visa_Price_Out_PKR:
                      entryData?.ticket_Purchase_PKR ?? 0,
                    remaining_Balance: entryData?.ticket_Purchase_PKR ?? 0,

                    total_Azad_Visa_Price_Out_Curr:
                      entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr:
                      entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_Two,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        country: entryData.country,
                        contact: entryData.contact,
                        azad_Visa_Price_Out_PKR:
                          entryData?.ticket_Purchase_PKR ?? 0,
                        azad_Visa_Price_Out_Curr:
                          entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,
                        company: entryData.company,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentOutTicketSupplier.save();
                paymentInfo.newPaymentOutTicketSupplier =
                  newPaymentOutTicketSupplier;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentOutTicketSupplier.payment_Out_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentOutTicketSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                    entryData?.ticket_Purchase_PKR ?? 0;
                  existingPaymentOutTicketSupplier.payment_Out_Schema.remaining_Balance +=
                    entryData?.ticket_Purchase_PKR ?? 0;

                  existingPaymentOutTicketSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                    entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0;
                  existingPaymentOutTicketSupplier.payment_Out_Schema.remaining_Curr +=
                    entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentOutTicketSupplier.payment_Out_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      country: entryData.country,
                      azad_Visa_Price_Out_PKR:
                        entryData?.ticket_Purchase_PKR ?? 0,
                      azad_Visa_Price_Out_Curr:
                        entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,
                      company: entryData.company,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    }
                  );

                  const newStatus = existingPaymentOutTicketSupplier.payment_Out_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentOutTicketSupplier.payment_Out_Schema.status;
                  const isStatusClosed = existingPaymentOutTicketSupplier.payment_Out_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentOutTicketSupplier.updateOne({
                    $inc: {
                      "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                        entryData?.ticket_Purchase_PKR ?? 0,
                      "payment_Out_Schema.remaining_Balance":
                        entryData?.ticket_Purchase_PKR ?? 0,

                      "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                        entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,
                      "payment_Out_Schema.remaining_Curr":
                        entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,
                        
                    },
                 
                  });
                }

                await existingPaymentOutTicketSupplier.save();
                paymentInfo.existingPaymentOutTicketSupplier =
                  existingPaymentOutTicketSupplier;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Azad Visa Payment In Section if azad_Visa_Reference_Out_Name is Agent
          if (
            entryData.ticket_Reference_Out === "AGENTS" ||
            entryData.ticket_Reference_Out === "AGENT" ||
            entryData.ticket_Reference_Out === "agents" ||
            entryData.ticket_Reference_Out === "agent" ||
            entryData.ticket_Reference_Out === "Agents" ||
            entryData.ticket_Reference_Out === "Agent"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentInTicketAgent
              for (const supplier of ticketAgents){
                if(supplier.payment_In_Schema){
                  if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.ticket_Reference_Out_Name.toLowerCase()&& supplier.payment_In_Schema.status.toLowerCase()==='open'){
                    existingPaymentInTicketAgent = supplier;
                    break
                  }
                }
               }

              if (!existingPaymentInTicketAgent) {
                // If the supplier does not exist, create a new one
                const newPaymentInTicketAgent = new TicketAgents({
                  payment_In_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.ticket_Reference_Out_Name,
                    total_Azad_Visa_Price_In_PKR:
                      entryData?.ticket_Sales_PKR ?? 0,
                    remaining_Balance: entryData?.ticket_Sales_PKR ?? 0,

                    total_Azad_Visa_Price_In_Curr:
                      entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_One,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        country: entryData.country,
                        contact: entryData.contact,
                        azad_Visa_Price_In_PKR:
                          entryData?.ticket_Sales_PKR ?? 0,
                        azad_Visa_Price_In_Curr:
                          entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,
                        company: entryData.company,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentInTicketAgent.save();
                paymentInfo.newPaymentInTicketAgent = newPaymentInTicketAgent;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentInTicketAgent.payment_In_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentInTicketAgent.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                    entryData?.ticket_Sales_PKR ?? 0;
                  existingPaymentInTicketAgent.payment_In_Schema.remaining_Balance +=
                    entryData?.ticket_Sales_PKR ?? 0;

                  existingPaymentInTicketAgent.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                    entryData?.ticket_Sales_Rate_Oth_Cur ?? 0;
                  existingPaymentInTicketAgent.payment_In_Schema.remaining_Curr +=
                    entryData?.ticket_Sales_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentInTicketAgent.payment_In_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      country: entryData.country,
                      contact: entryData.contact,
                      azad_Visa_Price_In_PKR: entryData?.ticket_Sales_PKR ?? 0,
                      azad_Visa_Price_In_Curr:
                        entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,
                      company: entryData.company,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    }
                  );


                  const newStatus = existingPaymentInTicketAgent.payment_In_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentInTicketAgent.payment_In_Schema.status;
                  const isStatusClosed = existingPaymentInTicketAgent.payment_In_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentInTicketAgent.updateOne({
                    $inc: {
                      "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                        entryData?.ticket_Sales_PKR ?? 0,
                      "payment_In_Schema.remaining_Balance":
                        entryData?.ticket_Sales_PKR ?? 0,

                      "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
                        entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,
                      "payment_In_Schema.remaining_Curr":
                        entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,
                        
                    },
                 
                  });
                }

                await existingPaymentInTicketAgent.save();
                paymentInfo.existingPaymentInTicketAgent =
                  existingPaymentInTicketAgent;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
          if (
            entryData.ticket_Reference_In === "AGENTS" ||
            entryData.ticket_Reference_In === "AGENT" ||
            entryData.ticket_Reference_In === "agents" ||
            entryData.ticket_Reference_In === "agent" ||
            entryData.ticket_Reference_In === "Agents" ||
            entryData.ticket_Reference_In === "Agent"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentOutTicketAgent
            for (const supplier of ticketAgents){
              if(supplier.payment_Out_Schema){
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.ticket_Reference_In_Name.toLowerCase()&& supplier.payment_Out_Schema.status.toLowerCase()==='open'){
                  existingPaymentOutTicketAgent = supplier;
                  break
                }
              }
             }

              if (!existingPaymentOutTicketAgent) {
                // If the supplier does not exist, create a new one
                const newPaymentOutTicketAgent = new TicketAgents({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.ticket_Reference_In_Name,
                    total_Azad_Visa_Price_Out_PKR:
                      entryData?.ticket_Purchase_PKR ?? 0,
                    remaining_Balance: entryData?.ticket_Purchase_PKR ?? 0,

                    total_Azad_Visa_Price_Out_Curr:
                      entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr:
                      entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_Two,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        contact: entryData.contact,
                        country: entryData.country,
                        azad_Visa_Price_Out_PKR:
                          entryData?.ticket_Purchase_PKR ?? 0,
                        azad_Visa_Price_Out_Curr:
                          entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,
                        company: entryData.company,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentOutTicketAgent.save();
                paymentInfo.newPaymentOutTicketAgent = newPaymentOutTicketAgent;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentOutTicketAgent.payment_Out_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentOutTicketAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                    entryData?.ticket_Purchase_PKR ?? 0;
                  existingPaymentOutTicketAgent.payment_Out_Schema.remaining_Balance +=
                    entryData?.ticket_Purchase_PKR ?? 0;

                  existingPaymentOutTicketAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                    entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0;
                  existingPaymentOutTicketAgent.payment_Out_Schema.remaining_Curr +=
                    entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentOutTicketAgent.payment_Out_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      country: entryData.country,
                      azad_Visa_Price_Out_PKR:
                        entryData?.ticket_Purchase_PKR ?? 0,
                      azad_Visa_Price_Out_Curr:
                        entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,
                      company: entryData.company,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    }
                  );

                  const newStatus = existingPaymentOutTicketAgent.payment_Out_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentOutTicketAgent.payment_Out_Schema.status;
                const isStatusClosed = existingPaymentOutTicketAgent.payment_Out_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentOutTicketAgent.updateOne({
                    $inc: {
                      "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                        entryData?.ticket_Purchase_PKR ?? 0,
                      "payment_Out_Schema.remaining_Balance":
                        entryData?.ticket_Purchase_PKR ?? 0,

                      "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                        entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,
                      "payment_Out_Schema.remaining_Curr":
                        entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,
                        
                    },
                   
                  });
                }

                await existingPaymentOutTicketAgent.save();
                paymentInfo.existingPaymentOutTicketAgent =
                  existingPaymentOutTicketAgent;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
          if (
            entryData.ticket_Reference_Out === "CANDIDATES" ||
            entryData.ticket_Reference_Out === "CANDIDATE" ||
            entryData.ticket_Reference_Out === "candidates" ||
            entryData.ticket_Reference_Out === "candidate" ||
            entryData.ticket_Reference_Out === "Candidates" ||
            entryData.ticket_Reference_Out === "Candidate"||
            entryData.ticket_Reference_Out === "DIRECTS" ||
            entryData.ticket_Reference_Out === "DIRECT" ||
            entryData.ticket_Reference_Out === "directs" ||
            entryData.ticket_Reference_Out === "direct" ||
            entryData.ticket_Reference_Out === "Directs" ||
            entryData.ticket_Reference_Out === "Direct"
          ) {
            try {
              // Check if the supplier with the given name and entry mode exists
              const existingPaymentInTicketCandidate =
                await TicketCandidate.findOne({
                  "payment_In_Schema.supplierName": entryData.name,
                  "payment_In_Schema.entry_Mode":
                    entryData.entry_Mode,
                  "payment_In_Schema.pp_No": entryData.pp_No,
                });

              if (!existingPaymentInTicketCandidate) {
                // If the supplier does not exist with the same entry mode, create a new one
                const newPaymentInTicketCandidate = new TicketCandidate({
                  payment_In_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.name,
                    total_Visa_Price_In_PKR: entryData?.ticket_Sales_PKR ?? 0,
                    remaining_Balance: entryData?.ticket_Sales_PKR ?? 0,

                    total_Visa_Price_In_Curr:
                      entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.ticket_Sales_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_One,
                    pp_No: entryData.pp_No,
                    entry_Mode: entryData.entry_Mode,
                    company: entryData.company,
                    trade: entryData.trade,
                    country: entryData.country,
                    contact: entryData.contact,
                    final_Status: entryData.final_Status,
                    flight_Date: entryData.flight_Date,
                  },
                });

                await newPaymentInTicketCandidate.save();
                paymentInfo.newPaymentInTicketCandidate =
                  newPaymentInTicketCandidate;
              } else {
                // If the supplier exists with the same entry mode, handle accordingly (e.g., update, do nothing)
                // You may choose to update or do nothing based on your specific requirements
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }

          //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
          if (
            entryData.ticket_Reference_In === "CANDIDATES" ||
            entryData.ticket_Reference_In === "CANDIDATE" ||
            entryData.ticket_Reference_In === "candidates" ||
            entryData.ticket_Reference_In === "candidate" ||
            entryData.ticket_Reference_In === "Candidates" ||
            entryData.ticket_Reference_In === "Candidate"||
            entryData.ticket_Reference_In === "DIRECTS" ||
            entryData.ticket_Reference_In === "DIRECT" ||
            entryData.ticket_Reference_In === "directs" ||
            entryData.ticket_Reference_In === "direct" ||
            entryData.ticket_Reference_In === "Directs" ||
            entryData.ticket_Reference_In === "Direct"
          ) {
            try {
              // Check if the supplier with the given name exists
              const existingPaymentOutTicketCandidate =
                await TicketCandidate.findOne({
                  "payment_Out_Schema.supplierName": entryData.name,
                  "payment_Out_Schema.entry_Mode":
                    entryData.entry_Mode,
                  "payment_Out_Schema.pp_No": entryData.pp_No,
                });

              if (!existingPaymentOutTicketCandidate) {
                // If the supplier does not exist, create a new one
                const newPaymentOutTicketCandidate = new TicketCandidate({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.name,
                    total_Visa_Price_Out_PKR:
                      entryData?.ticket_Purchase_PKR ?? 0,
                    remaining_Balance: entryData?.ticket_Purchase_PKR ?? 0,

                    total_Visa_Price_Out_Curr:
                      entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr:
                      entryData?.ticket_Purchase_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_Two,
                    pp_No: entryData.pp_No,
                    entry_Mode: entryData.entry_Mode,
                    company: entryData.company,
                    trade: entryData.trade,
                    country: entryData.country,
                    contact: entryData.contact,
                    final_Status: entryData.final_Status,
                    flight_Date: entryData.flight_Date,
                  },
                });

                await newPaymentOutTicketCandidate.save();
                paymentInfo.newPaymentOutTicketCandidate =
                  newPaymentOutTicketCandidate;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }

          // Handling Visit Suppliers
          const visitSuppliers=await VisitSuppliers.find({})
          const visitAgents=await VisitAgents.find({})

          //Saving the Entry Details to the Ticket Payment In Section if azad_Visa_Reference_Out_Name is Supplier
          if (
            entryData.visit_Reference_Out === "SUPPLIERS" ||
            entryData.visit_Reference_Out === "SUPPLIER" ||
            entryData.visit_Reference_Out === "suppliers" ||
            entryData.visit_Reference_Out === "supplier" ||
            entryData.visit_Reference_Out === "Suppliers" ||
            entryData.visit_Reference_Out === "Supplier"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentInVisitSupplier
              for (const supplier of visitSuppliers){
                if(supplier.payment_In_Schema){
                  if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.visit_Reference_Out_Name.toLowerCase()&& supplier.payment_In_Schema.status.toLowerCase()==='open'){
                    existingPaymentInVisitSupplier = supplier;
                    break
                  }
                }
               }

              if (!existingPaymentInVisitSupplier) {
                // If the supplier does not exist, create a new one
                const newPaymentInVisitSupplier = new VisitSuppliers({
                  payment_In_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.visit_Reference_Out_Name,
                    total_Azad_Visa_Price_In_PKR:
                      entryData?.visit_Sales_PKR ?? 0,
                    remaining_Balance: entryData?.visit_Sales_PKR ?? 0,

                    total_Azad_Visa_Price_In_Curr:
                      entryData?.visit_Sales_Rate_Oth_Curr ?? 0,
                    remaining_Curr: entryData?.visit_Sales_Rate_Oth_Curr ?? 0,

                    curr_Country: entryData.cur_Country_One,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        contact: entryData.contact,
                        azad_Visa_Price_In_PKR: entryData?.visit_Sales_PKR ?? 0,
                        azad_Visa_Price_In_Curr:
                          entryData?.visit_Sales_Rate_Oth_Curr ?? 0,
                        company: entryData.company,
                        country: entryData.country,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentInVisitSupplier.save();
                paymentInfo.newPaymentInVisitSupplier =
                  newPaymentInVisitSupplier;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentInVisitSupplier.payment_In_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentInVisitSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                    entryData?.visit_Sales_PKR ?? 0;
                  existingPaymentInVisitSupplier.payment_In_Schema.remaining_Balance +=
                    entryData?.visit_Sales_PKR ?? 0;

                  existingPaymentInVisitSupplier.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                    entryData?.visit_Sales_Rate_Oth_Curr ?? 0;
                  existingPaymentInVisitSupplier.payment_In_Schema.remaining_Curr +=
                    entryData?.visit_Sales_Rate_Oth_Curr ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentInVisitSupplier.payment_In_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      azad_Visa_Price_In_PKR: entryData?.visit_Sales_PKR ?? 0,
                      azad_Visa_Price_In_Curr:
                        entryData?.visit_Sales_Rate_Oth_Curr ?? 0,
                      company: entryData.company,
                      country: entryData.country,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    }
                  );

                  const newStatus = existingPaymentInVisitSupplier.payment_In_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentInVisitSupplier.payment_In_Schema.status;
                const isStatusClosed = existingPaymentInVisitSupplier.payment_In_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentInVisitSupplier.updateOne({
                    $inc: {
                      "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                        entryData?.visit_Sales_PKR ?? 0,
                      "payment_In_Schema.remaining_Balance":
                        entryData?.visit_Sales_PKR ?? 0,

                      "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
                        entryData?.visit_Sales_Rate_Oth_Curr ?? 0,
                      "payment_In_Schema.remaining_Curr":
                        entryData?.visit_Sales_Rate_Oth_Curr ?? 0,
                        
                    },
                   
                  });
                }

                await existingPaymentInVisitSupplier.save();
                paymentInfo.existingPaymentInVisitSupplier =
                  existingPaymentInVisitSupplier;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
          if (
            entryData.visit_Reference_In === "SUPPLIERS" ||
            entryData.visit_Reference_In === "SUPPLIER" ||
            entryData.visit_Reference_In === "suppliers" ||
            entryData.visit_Reference_In === "supplier" ||
            entryData.visit_Reference_In === "Suppliers" ||
            entryData.visit_Reference_In === "Supplier"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentOutVisitSupplier
              for (const supplier of visitSuppliers){
                if(supplier.payment_Out_Schema){
                  if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.visit_Reference_In_Name.toLowerCase()&& supplier.payment_Out_Schema.status.toLowerCase()==='open'){
                    existingPaymentOutVisitSupplier = supplier;
                    break
                  }
                }
               }

              if (!existingPaymentOutVisitSupplier) {
                // If the supplier does not exist, create a new one
                const newPaymentOutVisitSupplier = new VisitSuppliers({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.visit_Reference_In_Name,
                    total_Azad_Visa_Price_Out_PKR:
                      entryData?.visit_Purchase_Rate_PKR ?? 0,
                    remaining_Balance: entryData?.visit_Purchase_Rate_PKR ?? 0,

                    total_Azad_Visa_Price_Out_Curr:
                      entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                    curr_Country: entryData.cur_Country_Two,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        contact: entryData.contact,
                        country: entryData.country,
                        azad_Visa_Price_Out_PKR:
                          entryData?.visit_Purchase_Rate_PKR ?? 0,
                        azad_Visa_Price_Out_Curr:
                          entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                        company: entryData.company,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentOutVisitSupplier.save();
                paymentInfo.newPaymentOutVisitSupplier =
                  newPaymentOutVisitSupplier;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentOutVisitSupplier.payment_Out_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentOutVisitSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                    entryData?.visit_Purchase_Rate_PKR ?? 0;
                  existingPaymentOutVisitSupplier.payment_Out_Schema.remaining_Balance +=
                    entryData?.visit_Purchase_Rate_PKR ?? 0;

                  existingPaymentOutVisitSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                    entryData?.visit_Purchase_Rate_Oth_Cur ?? 0;
                  existingPaymentOutVisitSupplier.payment_Out_Schema.remaining_Curr +=
                    entryData?.visit_Purchase_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentOutVisitSupplier.payment_Out_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      azad_Visa_Price_Out_PKR:
                        entryData?.visit_Purchase_Rate_PKR ?? 0,
                      azad_Visa_Price_Out_Curr:
                        entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                      company: entryData.company,
                      country: entryData.country,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    }
                  );

                  const newStatus = existingPaymentOutVisitSupplier.payment_Out_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentOutVisitSupplier.payment_Out_Schema.status;
                const isStatusClosed = existingPaymentOutVisitSupplier.payment_Out_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentOutVisitSupplier.updateOne({
                    $inc: {
                      "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                        entryData?.visit_Purchase_Rate_PKR ?? 0,
                      "payment_Out_Schema.remaining_Balance":
                        entryData?.visit_Purchase_Rate_PKR ?? 0,

                      "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                        entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                      "payment_Out_Schema.remaining_Curr":
                        entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                       
                    },
                    
                  });
                }

                await existingPaymentOutVisitSupplier.save();
                paymentInfo.existingPaymentOutVisitSupplier =
                  existingPaymentOutVisitSupplier;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Azad Visa Payment In Section if azad_Visa_Reference_Out_Name is Agent
          if (
            entryData.visit_Reference_Out === "AGENTS" ||
            entryData.visit_Reference_Out === "AGENT" ||
            entryData.visit_Reference_Out === "agents" ||
            entryData.visit_Reference_Out === "agent" ||
            entryData.visit_Reference_Out === "Agents" ||
            entryData.visit_Reference_Out === "Agent"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentInVisitAgent
            for (const supplier of visitAgents){
              if(supplier.payment_In_Schema){
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.visit_Reference_Out_Name.toLowerCase()&& supplier.payment_In_Schema.status.toLowerCase()==='open'){
                  existingPaymentInVisitAgent = supplier;
                  break
                }
              }
             }

              if (!existingPaymentInVisitAgent) {
                // If the supplier does not exist, create a new one
                const newPaymentInVisitAgent = new VisitAgents({
                  payment_In_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.visit_Reference_Out_Name,
                    total_Azad_Visa_Price_In_PKR:
                      entryData?.visit_Sales_PKR ?? 0,
                    remaining_Balance: entryData?.visit_Sales_PKR ?? 0,

                    total_Azad_Visa_Price_In_Curr:
                      entryData?.visit_Sales_Rate_Oth_Curr ?? 0,
                    remaining_Curr: entryData?.visit_Sales_Rate_Oth_Curr ?? 0,

                    curr_Country: entryData.cur_Country_One,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        contact: entryData.contact,
                        country: entryData.country,
                        azad_Visa_Price_In_PKR: entryData?.visit_Sales_PKR ?? 0,
                        azad_Visa_Price_In_Curr:
                          entryData?.visit_Sales_Rate_Oth_Curr ?? 0,
                        company: entryData.company,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentInVisitAgent.save();
                paymentInfo.newPaymentInVisitAgent = newPaymentInVisitAgent;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentInVisitAgent.payment_In_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentInVisitAgent.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                    entryData?.visit_Sales_PKR ?? 0;
                  existingPaymentInVisitAgent.payment_In_Schema.remaining_Balance +=
                    entryData?.visit_Sales_PKR ?? 0;

                  existingPaymentInVisitAgent.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                    entryData?.visit_Sales_Rate_Oth_Curr ?? 0;
                  existingPaymentInVisitAgent.payment_In_Schema.remaining_Curr +=
                    entryData?.visit_Sales_Rate_Oth_Curr ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentInVisitAgent.payment_In_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      country: entryData.country,
                      azad_Visa_Price_In_PKR: entryData?.visit_Sales_PKR ?? 0,
                      azad_Visa_Price_In_Curr:
                        entryData?.visit_Sales_Rate_Oth_Curr ?? 0,
                      company: entryData.company,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date(),
                    }
                  );

                  const newStatus = existingPaymentInVisitAgent.payment_In_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentInVisitAgent.payment_In_Schema.status;
                const isStatusClosed = existingPaymentInVisitAgent.payment_In_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentInVisitAgent.updateOne({
                    $inc: {
                      "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                        entryData?.visit_Sales_PKR ?? 0,
                      "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
                        entryData?.visit_Sales_Rate_Oth_Curr ?? 0,
                      "payment_In_Schema.remaining_Balance":
                        entryData?.visit_Sales_PKR ?? 0,
                     
                      
                    },
                  
                  });
                }

                await existingPaymentInVisitAgent.save();
                paymentInfo.existingPaymentInVisitAgent =
                  existingPaymentInVisitAgent;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
          if (
            entryData.visit_Reference_In === "AGENTS" ||
            entryData.visit_Reference_In === "AGENT" ||
            entryData.visit_Reference_In === "agents" ||
            entryData.visit_Reference_In === "agent" ||
            entryData.visit_Reference_In === "Agents" ||
            entryData.visit_Reference_In === "Agent"
          ) {
            try {
              // Check if the supplier with the given name exists
              let existingPaymentOutVisitAgent
              for (const supplier of visitAgents){
                if(supplier.payment_Out_Schema){
                  if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.visit_Reference_In_Name.toLowerCase()&& supplier.payment_Out_Schema.status.toLowerCase()==='open'){
                    existingPaymentOutVisitAgent = supplier;
                    break
                  }
                }
               }

              if (!existingPaymentOutVisitAgent) {
                // If the supplier does not exist, create a new one
                const newPaymentOutVisitAgent = new VisitAgents({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.visit_Reference_In_Name,
                    total_Azad_Visa_Price_Out_PKR:
                      entryData?.visit_Purchase_Rate_PKR ?? 0,
                    remaining_Balance: entryData?.visit_Purchase_Rate_PKR ?? 0,

                    total_Azad_Visa_Price_Out_Curr:
                      entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_Two,
                    opening:0,
                    closing:0,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        trade: entryData.trade,
                        country: entryData.country,
                        contact: entryData.contact,
                        azad_Visa_Price_Out_PKR:
                          entryData?.visit_Purchase_Rate_PKR ?? 0,
                        azad_Visa_Price_Out_Curr:
                          entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                        company: entryData.company,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentOutVisitAgent.save();
                paymentInfo.newPaymentOutVisitAgent = newPaymentOutVisitAgent;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentOutVisitAgent.payment_Out_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentOutVisitAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                    entryData?.visit_Purchase_Rate_PKR ?? 0;
                  existingPaymentOutVisitAgent.payment_Out_Schema.remaining_Balance +=
                    entryData?.visit_Purchase_Rate_PKR ?? 0;

                  existingPaymentOutVisitAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                    entryData?.visit_Purchase_Rate_Oth_Cur ?? 0;
                  existingPaymentOutVisitAgent.payment_Out_Schema.remaining_Curr +=
                    entryData?.visit_Purchase_Rate_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentOutVisitAgent.payment_Out_Schema.persons.push(
                    {
                      name: entryData.name,
                      pp_No: entryData.pp_No,
                      entry_Mode: entryData.entry_Mode,
                      trade: entryData.trade,
                      contact: entryData.contact,
                      country: entryData.country,
                      azad_Visa_Price_Out_PKR:
                        entryData?.visit_Purchase_Rate_PKR ?? 0,
                      azad_Visa_Price_Out_Curr:
                        entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                      company: entryData.company,
                      final_Status: entryData.final_Status,
                      flight_Date: entryData.flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    }
                  );

                  const newStatus = existingPaymentOutVisitAgent.payment_Out_Schema.status.toLowerCase() === 'closed' ? "Open" : existingPaymentOutVisitAgent.payment_Out_Schema.status;
                const isStatusClosed = existingPaymentOutVisitAgent.payment_Out_Schema.status.toLowerCase() === 'closed';
                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentOutVisitAgent.updateOne({
                    $inc: {
                      "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                        entryData?.visit_Purchase_Rate_PKR ?? 0,
                      "payment_Out_Schema.remaining_Balance":
                        entryData?.visit_Purchase_Rate_PKR ?? 0,

                      "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                        entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                      "payment_Out_Schema.remaining_Curr":
                        entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                      
                      
                    },
                   
                  });
                }

                await existingPaymentOutVisitAgent.save();
                paymentInfo.existingPaymentOutVisitAgent =
                  existingPaymentOutVisitAgent;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }
          //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
          if (
            entryData.visit_Reference_Out === "CANDIDATES" ||
            entryData.visit_Reference_Out === "CANDIDATE" ||
            entryData.visit_Reference_Out === "candidates" ||
            entryData.visit_Reference_Out === "candidate" ||
            entryData.visit_Reference_Out === "Candidates" ||
            entryData.visit_Reference_Out === "Candidate"||
            entryData.visit_Reference_Out === "DIRECTS" ||
            entryData.visit_Reference_Out === "DIRECT" ||
            entryData.visit_Reference_Out === "directs" ||
            entryData.visit_Reference_Out === "direct" ||
            entryData.visit_Reference_Out === "Directs" ||
            entryData.visit_Reference_Out === "Direct"
          ) {
            try {
              // Check if the supplier with the given name and entry mode exists
              const existingPaymentInVisitCandidate =
                await VisitCandidate.findOne({
                  "payment_In_Schema.supplierName": entryData.name,
                  "payment_In_Schema.entry_Mode":
                    entryData.entry_Mode,
                  "payment_In_Schema.pp_No": entryData.pp_No,
                });

              if (!existingPaymentInVisitCandidate) {
                // If the supplier does not exist with the same entry mode, create a new one
                const newPaymentInVisitCandidate = new VisitCandidate({
                  payment_In_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.name,
                    total_Visa_Price_In_PKR: entryData?.visit_Sales_PKR ?? 0,
                    remaining_Balance: entryData?.visit_Sales_PKR ?? 0,

                    total_Visa_Price_In_Curr:
                      entryData?.visit_Sales_Rate_Oth_Curr ?? 0,
                    remaining_Curr: entryData?.visit_Sales_Rate_Oth_Curr ?? 0,

                    curr_Country: entryData.cur_Country_One,
                    pp_No: entryData.pp_No,
                    entry_Mode: entryData.entry_Mode,
                    company: entryData.company,
                    trade: entryData.trade,
                    country: entryData.country,
                    contact: entryData.contact,
                    final_Status: entryData.final_Status,
                    flight_Date: entryData.flight_Date,
                  },
                });

                await newPaymentInVisitCandidate.save();
                paymentInfo.newPaymentInVisitCandidate =
                  newPaymentInVisitCandidate;
              } else {
                // If the supplier exists with the same entry mode, handle accordingly (e.g., update, do nothing)
                // You may choose to update or do nothing based on your specific requirements
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }

          //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
          if (
            entryData.visit_Reference_In === "CANDIDATES" ||
            entryData.visit_Reference_In === "CANDIDATE" ||
            entryData.visit_Reference_In === "candidate" ||
            entryData.visit_Reference_In === "candidates" ||
            entryData.visit_Reference_In === "Candidate" ||
            entryData.visit_Reference_In === "Candidates"||
            entryData.visit_Reference_Out === "DIRECTS" ||
            entryData.visit_Reference_In === "DIRECT" ||
            entryData.visit_Reference_In === "directs" ||
            entryData.visit_Reference_In === "direct" ||
            entryData.visit_Reference_In === "Directs" ||
            entryData.visit_Reference_In === "Direct"
          ) {
            try {
              // Check if the supplier with the given name exists
              const existingPaymentOutVisitCandidate =
                await VisitCandidate.findOne({
                  "payment_Out_Schema.supplierName": entryData.name,
                  "payment_Out_Schema.entry_Mode":
                    entryData.entry_Mode,
                  "payment_Out_Schema.pp_No": entryData.pp_No,
                });

              if (!existingPaymentOutVisitCandidate) {
                // If the supplier does not exist, create a new one
                const newPaymentOutVisitCandidate = new VisitCandidate({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.name,
                    total_Visa_Price_Out_PKR:
                      entryData?.visit_Purchase_Rate_PKR ?? 0,
                    remaining_Balance: entryData?.visit_Purchase_Rate_PKR ?? 0,

                    total_Visa_Price_Out_Curr:
                      entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.visit_Purchase_Rate_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_Two,
                    pp_No: entryData.pp_No,
                    entry_Mode: entryData.entry_Mode,
                    company: entryData.company,
                    trade: entryData.trade,
                    country: entryData.country,
                    contact: entryData.contact,
                    final_Status: entryData.final_Status,
                    flight_Date: entryData.flight_Date,
                  },
                });

                await newPaymentOutVisitCandidate.save();
                paymentInfo.newPaymentOutVisitCandidate =
                  newPaymentOutVisitCandidate;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }




          const protectors=await Protector.find({})

          if (
            (entryData.protector_Reference_In === "PRPTECTORS" ||
            entryData.protector_Reference_In === "PRPTECTOR" ||
            entryData.protector_Reference_In === "Protectors" ||
            entryData.protector_Reference_In === "Protector" ||
            entryData.protector_Reference_In === "protectors" ||
            entryData.protector_Reference_In === "protector") && entryData.protector_Reference_In_Name
          ) {
            try {
              let existingPaymentOutProtector
            for(const protector of protectors){
              if(protector.payment_Out_Schema){
                if(protector.payment_Out_Schema.supplierName.toLowerCase()===entryData.protector_Reference_In_Name.toLowerCase()&& protector.payment_Out_Schema.status.toLowerCase()==='open'){
                  existingPaymentOutProtector=protector
                }
              }
            }

              if (!existingPaymentOutProtector) {
                // If the supplier does not exist, create a new one
                const newPaymentOutProtector = new Protector({
                  payment_Out_Schema: {
                    supplier_Id: newEntry._id,
                    supplierName: entryData.protector_Reference_In_Name,
                    total_Protector_Price_Out_PKR:
                      entryData?.protector_Price_In ?? 0,
                    remaining_Balance: entryData?.protector_Price_Out ?? 0,

                    total_Protector_Price_Out_Curr:
                      entryData?.protector_Price_In_Oth_Cur ?? 0,
                    remaining_Curr: entryData?.protector_Price_In_Oth_Cur ?? 0,

                    curr_Country: entryData.cur_Country_One,
                    persons: [
                      {
                        name: entryData.name,
                        pp_No: entryData.pp_No,
                        entry_Mode: entryData.entry_Mode,
                        protector_Out_PKR: entryData?.protector_Price_In ?? 0,
                        protector_Out_Curr:
                          entryData?.protector_Price_In_Oth_Cur ?? 0,
                        company: entryData.company,
                        trade: entryData.trade,
                        contact: entryData.contact,
                        country: entryData.country,
                        final_Status: entryData.final_Status,
                        flight_Date: entryData.flight_Date,
                        entry_Date: new Date().toISOString().split("T")[0],
                      },
                    ],
                  },
                });

                await newPaymentOutProtector.save();
                paymentInfo.newPaymentOutProtector = newPaymentOutProtector;
              } else {
                // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
                const existingPersonIndex =
                  existingPaymentOutProtector.payment_Out_Schema.persons.findIndex(
                    (person) =>
                      person.pp_No === entryData.pp_No &&
                      person.entry_Mode === entryData.entry_Mode &&
                      person.name === entryData.name
                  );

                if (existingPersonIndex !== -1) {
                  // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                  existingPaymentOutProtector.payment_Out_Schema.total_Protector_Price_Out_PKR +=
                    entryData?.protector_Price_In ?? 0;
                  existingPaymentOutProtector.payment_Out_Schema.remaining_Balance +=
                    entryData?.protector_Price_In ?? 0;

                  existingPaymentOutProtector.payment_Out_Schema.total_Protector_Price_Out_Curr +=
                    entryData?.protector_Price_In_Oth_Cur ?? 0;
                  existingPaymentOutProtector.payment_Out_Schema.remaining_Curr +=
                    entryData?.protector_Price_In_Oth_Cur ?? 0;
                } else {
                  // If the person does not exist, add them to the persons array
                  existingPaymentOutProtector.payment_Out_Schema.persons.push({
                    name: entryData.name,
                    pp_No: entryData.pp_No,
                    entry_Mode: entryData.entry_Mode,
                    trade: entryData.trade,
                    contact: entryData.contact,
                    country: entryData.country,
                    protector_Out_PKR: entryData?.protector_Price_In ?? 0,
                    protector_Out_Curr:
                      entryData?.protector_Price_In_Oth_Cur ?? 0,
                    company: entryData.company,
                    final_Status: entryData.final_Status,
                    flight_Date: entryData.flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  });

                  // Update total_Visa_Price_In_PKR and other fields using $inc
                  await existingPaymentOutProtector.updateOne({
                    $inc: {
                      "payment_Out_Schema.total_Protector_Price_Out_PKR":
                        entryData?.protector_Price_In ?? 0,
                      "payment_Out_Schema.remaining_Balance":
                        entryData?.protector_Price_In ?? 0,

                      "payment_Out_Schema.total_Protector_Price_Out_Curr":
                        entryData?.protector_Price_In_Oth_Cur ?? 0,
                      "payment_Out_Schema.remaining_Curr":
                        entryData?.protector_Price_In_Oth_Cur ?? 0,
                    },
                  });
                }

                await existingPaymentOutProtector.save();
                paymentInfo.existingPaymentOutProtector =
                  existingPaymentOutProtector;
              }
            } catch (saveError) {
              console.error(saveError);
              res
                .status(500)
                .json({ message:saveError });
            }
          }

          await newEntry.save();
          addedEntries.push(newEntry);
        }
      }
      const responsePayload = {
        data: unSavedEntries,
        message: `${addedEntries.length} Entries added successfully`,
        paymentInfo: paymentInfo,
      };

      res.status(200).json(responsePayload);
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};


