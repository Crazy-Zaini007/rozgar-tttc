const cloudinary = require("../cloudinary");
const User = require("../../database/userdb/UserSchema");
const Entries = require("../../database/enteries/EntrySchema");
const Suppliers = require("../../database/suppliers/SupplierSchema");
const Agents = require("../../database/agents/AgentSchema");
const Candidate = require("../../database/candidate/CandidateSchema");
const AzadSupplier = require("../../database/azadSuppliers/AzadSupplierSchema");
const AzadAgents = require("../../database/azadAgent/AzadAgentSchema");
const AzadCandidate = require("../../database/azadCandidates/AzadCandidateSchema");

const TicketSuppliers = require("../../database/ticketSuppliers/TicketSupplierSchema");
const TicketAgents = require("../../database/ticketAgent/TicketAgentSchema");
const TicketCandidate = require("../../database/ticketCandidates/TicketCandidateSchema");

const VisitSuppliers = require("../../database/visitSuppliers/VisitSupplierSchema");
const VisitAgents = require("../../database/visitAgent/VisitAgentSchema");
const VisitCandidate = require("../../database/visitCandidates/VisitCandidateSchema");

const Protector = require("../../database/protector/ProtectorSchema");
const Reminders = require('../../database/reminders/RemindersModel')
const mongoose = require("mongoose");
const moment = require("moment");
// Adding a new Single Entry Controller
const addEntry = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    if (user) {
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
        section1,
        section2,
        section3,
      } = req.body;

      // Ensure flight_Date is set to "No Fly" when it's an empty string or undefined
      flight_Date =
        flight_Date !== undefined && flight_Date !== ""
          ? flight_Date
          : "No Fly";

      if (reference_Out_Name === "") {
        reference_Out_Name = name;
      }
      if (reference_In_Name === "") {
        reference_In_Name = name;
      }
      if (section1 === 1) {
        if (visit_Reference_In_Name === "") {
          visit_Reference_In_Name = name;
        }
        if (visit_Reference_Out_Name === "") {
          visit_Reference_Out_Name = name;
        }
      }
      if (section2 === 1) {
        if (ticket_Reference_In_Name === "") {
          ticket_Reference_In_Name = name;
        }
        if (ticket_Reference_Out_Name === "") {
          ticket_Reference_Out_Name = name;
        }
      }
      if (section3 === 1) {
        if (azad_Visa_Reference_In_Name === "") {
          azad_Visa_Reference_In_Name = name;
        }
        if (azad_Visa_Reference_Out_Name === "") {
          azad_Visa_Reference_Out_Name = name;
        }
      }

      let sendResponse = true;
      const existingPPNO = await Entries.findOne({ pp_No, entry_Mode });

      if (existingPPNO) {
        res
          .status(404)
          .json({
            message:
              "Entry with the same Passport Number and Entry Mode already exists",
          });
        sendResponse = false;
      }
      if (!existingPPNO) {

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

        // uploading image to cloudinary
        // Uploading main Picture
        if (picture) {
          try {
            const uploadPicture = await cloudinary.uploader.upload(picture, {
              upload_preset: "rozgar",
            });

            if (!uploadPicture) {
              res
                .status(500)
                .json({ message: "Error uploading the main picture" });
              return;
            }

            picture = uploadPicture.secure_url;
          } catch (uploadError) {
            console.error(uploadError);
            res
              .status(500)
              .json({ message: "Error uploading the main picture" });
            return;
          }
        }

        // Uploading Visit Section Picture
        if (visit_Section_Picture) {
          try {
            const uploadPicture = await cloudinary.uploader.upload(
              visit_Section_Picture,
              {
                upload_preset: "rozgar",
              }
            );

            if (!uploadPicture) {
              res
                .status(500)
                .json({ message: "Error uploading Visit Section Picture" });
              return;
            }

            visit_Section_Picture = uploadPicture.secure_url;
          } catch (uploadError) {
            console.error(uploadError);
            res
              .status(500)
              .json({ message: "Error uploading Visit Section Picture" });
            return;
          }
        }

        // Uploading Ticket Section Picture
        if (ticket_Section_Picture) {
          try {
            const uploadPicture = await cloudinary.uploader.upload(
              ticket_Section_Picture,
              {
                upload_preset: "rozgar",
              }
            );

            if (!uploadPicture) {
              res
                .status(500)
                .json({ message: "Error uploading Ticket Section Picture" });
              return;
            }

            ticket_Section_Picture = uploadPicture.secure_url;
          } catch (uploadError) {
            console.error(uploadError);
            res
              .status(500)
              .json({ message: "Error uploading Ticket Section Picture" });
            return;
          }
        }

        // Uploading Azad Visa Section Picture
        if (azad_Visa_Section_Picture) {
          try {
            const uploadPicture = await cloudinary.uploader.upload(
              azad_Visa_Section_Picture,
              {
                upload_preset: "rozgar",
              }
            );

            if (!uploadPicture) {
              res
                .status(500)
                .json({ message: "Error uploading Azad Visa Section picture" });
              return;
            }

            azad_Visa_Section_Picture = uploadPicture.secure_url;
          } catch (uploadError) {
            console.error(uploadError);
            res
              .status(500)
              .json({ message: "Error uploading Azad Visa Section picture" });
            return;
          }
        }

        const newEntry = new Entries({
          entry_Date: new Date().toISOString().split("T")[0],
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
        });

        let paymentInfo = {};

        //Handling Suppliers
        const suppliers=await Suppliers.find({})
        //Saving the Entry Details to the Suppliers Payment In Section if reference_Out==="Supplier"
        if (
          reference_Out === "SUPPLIERS" ||
          reference_Out === "SUPPLIER" ||
          reference_Out === "Suppliers" ||
          reference_Out === "suppliers" ||
          reference_Out === "Supplier" ||
          reference_Out === "supplier"
        ) {
          try {
            let existingPaymentInSupplier;
            // Check if the supplier with the given name exists
            for(const supplier of suppliers){
              if(supplier.payment_In_Schema){
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===reference_Out_Name.toLowerCase()){
                  existingPaymentInSupplier=supplier
                  break
                }
              }
             
            }
           
            if (!existingPaymentInSupplier) {
              // If the supplier does not exist, create a new one
              const newPaymentInSupplier = new Suppliers({
                payment_In_Schema: {
                  supplier_Id: newEntry._id,
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
                  persons: [
                    {
                      name,
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
              paymentInfo.newPaymentInSupplier = newPaymentInSupplier;
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
              paymentInfo.existingPaymentInSupplier = existingPaymentInSupplier;
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }
        //Saving the Entry Details to the Suppliers Payment Out Section if reference_In==="Supplier"
        if (
          reference_In === "SUPPLIERS" ||
          reference_In === "SUPPLIER" ||
          reference_In === "Suppliers" ||
          reference_In === "suppliers" ||
          reference_In === "Supplier" ||
          reference_In === "supplier"
        ) {
          try {
            let existingPaymentOutSupplier;
            for(const supplier of suppliers){
              if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.supplierName.toLowerCase()===reference_In_Name.toLowerCase()){
                existingPaymentOutSupplier=supplier
                break
              }
            }
           

            if (!existingPaymentOutSupplier) {
              // If the supplier does not exist, create a new one
              const newPaymentOutSupplier = new Suppliers({
                payment_Out_Schema: {
                  supplier_Id: newEntry._id,
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
                  persons: [
                    {
                      name,
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
                    "payment_Out_Schema.remaining_Balance":
                      visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0,

                    "payment_Out_Schema.total_Visa_Price_Out_Curr":
                      visa_Purchase_Rate_Oth_Cur
                        ? visa_Purchase_Rate_Oth_Cur
                        : 0,
                    "payment_Out_Schema.remaining_Curr":
                      visa_Purchase_Rate_Oth_Cur
                        ? visa_Purchase_Rate_Oth_Cur
                        : 0,
                  },
                });
              }

              await existingPaymentOutSupplier.save();
              paymentInfo.existingPaymentOutSupplier =
                existingPaymentOutSupplier;
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Handling Agents
        const agents=await Agents.find({})
        //Saving the Entry Details to the Agents Payment In Section if reference_Out==="Agents"
        if (
          reference_Out === "AGENTS" ||
          reference_Out === "AGENT" ||
          reference_Out === "Agents" ||
          reference_Out === "agents" ||
          reference_Out === "Agent" ||
          reference_Out === "agent"
        ) {
          try {
            let existingPaymentInAgent;
            for(const agent of agents){
              if(agent.payment_In_Schema && agent.payment_In_Schema.supplierName.toLowerCase()===reference_Out_Name.toLowerCase()){
                existingPaymentInAgent=agent
                break
              }
            }
           

            if (!existingPaymentInAgent) {
              // If the supplier does not exist, create a new one
              const newPaymentInAgent = new Agents({
                payment_In_Schema: {
                  supplier_Id: newEntry._id,
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
                  persons: [
                    {
                      name,
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

              await newPaymentInAgent.save();
              paymentInfo.newPaymentInAgent = newPaymentInAgent;
            } else {
              // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
              const existingPersonIndex =
                existingPaymentInAgent.payment_In_Schema.persons.findIndex(
                  (person) =>
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentInAgent.payment_In_Schema.total_Visa_Price_In_PKR +=
                  visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;
                existingPaymentInAgent.payment_In_Schema.remaining_Balance +=
                  visa_Sales_Rate_PKR ? visa_Sales_Rate_PKR : 0;

                existingPaymentInAgent.payment_In_Schema.total_Visa_Price_In_Curr +=
                  visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
                existingPaymentInAgent.payment_In_Schema.remaining_Curr +=
                  visa_Sale_Rate_Oth_Cur ? visa_Sale_Rate_Oth_Cur : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentInAgent.payment_In_Schema.persons.push({
                  name,
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
                await existingPaymentInAgent.updateOne({
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

              await existingPaymentInAgent.save();
              paymentInfo.existingPaymentInAgent = existingPaymentInAgent;
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }
        //Saving the Entry Details to the Agents Payment Out Section if reference_In==="Agents"
        if (
          reference_In === "AGENTS" ||
          reference_In === "AGENT" ||
          reference_In === "Agents" ||
          reference_In === "agents" ||
          reference_In === "agents" ||
          reference_In === "agent"
        ) {
          try {
            let existingPaymentOutAgent
            for(const agent of agents){
              if(agent.payment_Out_Schema && agent.payment_Out_Schema.supplierName.toLowerCase()===reference_In_Name.toLowerCase()){
                existingPaymentOutAgent=agent
                break
              }
            }
      

            if (!existingPaymentOutAgent) {
              // If the supplier does not exist, create a new one
              const newPaymentOutAgent = new Agents({
                payment_Out_Schema: {
                  supplier_Id: newEntry._id,
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
                  persons: [
                    {
                      name,
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

              await newPaymentOutAgent.save();
              paymentInfo.newPaymentOutAgent = newPaymentOutAgent;
            } else {
              const existingPersonIndex =
                existingPaymentOutAgent.payment_Out_Schema.persons.findIndex(
                  (person) =>
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                existingPaymentOutAgent.payment_Out_Schema.total_Visa_Price_Out_PKR +=
                  visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;
                existingPaymentOutAgent.payment_Out_Schema.remaining_Balance +=
                  visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0;

                existingPaymentOutAgent.payment_Out_Schema.total_Visa_Price_Out_Curr +=
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
                existingPaymentOutAgent.payment_Out_Schema.remaining_Curr +=
                  visa_Purchase_Rate_Oth_Cur ? visa_Purchase_Rate_Oth_Cur : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentOutAgent.payment_Out_Schema.persons.push({
                  name,
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
                await existingPaymentOutAgent.updateOne({
                  $inc: {
                    "payment_Out_Schema.total_Visa_Price_Out_PKR":
                      visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0,
                    "payment_Out_Schema.remaining_Balance":
                      visa_Purchase_Rate_PKR ? visa_Purchase_Rate_PKR : 0,

                    "payment_Out_Schema.total_Visa_Price_Out_Curr":
                      visa_Purchase_Rate_Oth_Cur
                        ? visa_Purchase_Rate_Oth_Cur
                        : 0,
                    "payment_Out_Schema.remaining_Curr":
                      visa_Purchase_Rate_Oth_Cur
                        ? visa_Purchase_Rate_Oth_Cur
                        : 0,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Handling Candidates

        //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
        if (
          reference_Out === "CANDIDATES" ||
          reference_Out === "CANDIDATE" ||
          reference_Out === "Candidates" ||
          reference_Out === "candidates" ||
          reference_Out === "Candidate" ||
          reference_Out === "candidate"
        ) {
          try {
            // Check if the supplier with the given name and entry mode exists
            const existingPaymentInCandidate = await Candidate.findOne({
              "payment_In_Schema.supplierName": name,
              "payment_In_Schema.entry_Mode": entry_Mode,
              "payment_In_Schema.pp_No": pp_No,
            });

            if (!existingPaymentInCandidate) {
              // If the supplier does not exist with the same entry mode, create a new one
              const newPaymentInCandidate = new Candidate({
                payment_In_Schema: {
                  supplier_Id: newEntry._id,
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
              paymentInfo.newPaymentInCandidate = newPaymentInCandidate;
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
        if (
          reference_In === "CANDIDATES" ||
          reference_In === "CANDIDATE" ||
          reference_In === "Candidates" ||
          reference_In === "Candidate" ||
          reference_In === "candidate" ||
          reference_In === "candidates"
        ) {
          try {
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
                  supplier_Id: newEntry._id,
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
              paymentInfo.newPaymentOutCandidate = newPaymentOutCandidate;
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Handling Azad Visa Suppliers
        const azadSuppliers= await AzadSupplier.find({})
        const azadAgents= await AzadAgents.find({})

        //Saving the Entry Details to the Azad Visa Payment In Section if azad_Visa_Reference_Out_Name is Supplier
        if (
          azad_Visa_Reference_Out === "SUPPLIERS" ||
          azad_Visa_Reference_Out === "SUPPLIER" ||
          azad_Visa_Reference_Out === "Supplier" ||
          azad_Visa_Reference_Out === "supplier" ||
          azad_Visa_Reference_Out === "Suppliers" ||
          azad_Visa_Reference_Out === "suppliers"
        ) {
          try {
            let existingPaymentInAzadSupplier
            for (const supplier of azadSuppliers){
              if(supplier.payment_In_Schema){
                if(supplier.payment_In_Schema && supplier.payment_In_Schema.supplierName.toLowerCase()===azad_Visa_Reference_Out_Name.toLowerCase()){
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
                  supplierName: azad_Visa_Reference_Out_Name,
                  total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  remaining_Balance: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,

                  total_Azad_Visa_Price_In_Curr: azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,

                  curr_Country: cur_Country_One,
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      contact,
                      country,
                      azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                        ? azad_Visa_Sales_PKR
                        : 0,
                      azad_Visa_Price_In_Curr: azad_Visa_Sales_Rate_Oth_Cur
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

              await newPaymentInAzadSupplier.save();
              paymentInfo.newPaymentInAzadSupplier = newPaymentInAzadSupplier;
            } else {
              // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
              const existingPersonIndex =
                existingPaymentInAzadSupplier.payment_In_Schema.persons.findIndex(
                  (person) =>
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentInAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
                existingPaymentInAzadSupplier.payment_In_Schema.remaining_Balance +=
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

                existingPaymentInAzadSupplier.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0;
                existingPaymentInAzadSupplier.payment_In_Schema.remaining_Curr +=
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentInAzadSupplier.payment_In_Schema.persons.push(
                  {
                    name,
                    pp_No,
                    entry_Mode,
                    trade,
                    country,
                    contact,
                    azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                      ? azad_Visa_Sales_PKR
                      : 0,
                    azad_Visa_Price_In_Curr: azad_Visa_Sales_Cur
                      ? azad_Visa_Sales_Cur
                      : 0,
                    company: company,
                    final_Status: final_Status,
                    flight_Date: flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  }
                );

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingPaymentInAzadSupplier.updateOne({
                  $inc: {
                    "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                      azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                    "payment_In_Schema.remaining_Balance":
                      azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                    "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
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

              await existingPaymentInAzadSupplier.save();
              paymentInfo.existingPaymentInAzadSupplier =
                existingPaymentInAzadSupplier;
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
        if (
          azad_Visa_Reference_In === "SUPPLIERS" ||
          azad_Visa_Reference_In === "SUPPLIER" ||
          azad_Visa_Reference_In === "Supplier" ||
          azad_Visa_Reference_In === "supplier" ||
          azad_Visa_Reference_In === "Suppliers" ||
          azad_Visa_Reference_In === "suppliers"
        ) {
          try {
            let existingPaymentOutAzadSupplier
            for (const supplier of azadSuppliers){
              if(supplier.payment_Out_Schema){
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===azad_Visa_Reference_In_Name.toLowerCase()){
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
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      contact,
                      country,
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
                    },
                  ],
                },
              });

              await newPaymentOutAzadSupplier.save();
              paymentInfo.newPaymentOutAzadSupplier = newPaymentOutAzadSupplier;
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
              paymentInfo.existingPaymentOutAzadSupplier =
                existingPaymentOutAzadSupplier;
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Saving the Entry Details to the Azad Visa Payment In Section if azad_Visa_Reference_Out_Name is Agent
        if (
          azad_Visa_Reference_Out === "AGENTS" ||
          azad_Visa_Reference_Out === "AGENT" ||
          azad_Visa_Reference_Out === "Agents" ||
          azad_Visa_Reference_Out === "agent" ||
          azad_Visa_Reference_Out === "Agent" ||
          azad_Visa_Reference_Out === "agents"
        ) {
          try {
            let existingPaymentInAzadAgent
            for (const supplier of azadAgents){
              if(supplier.payment_In_Schema){
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===azad_Visa_Reference_Out_Name.toLowerCase()){
                  existingPaymentInAzadAgent = supplier;
                  break
                }
              }
             }
            // Check if the supplier with the given name exists
          
            if (!existingPaymentInAzadAgent) {
              // If the supplier does not exist, create a new one
              const newPaymentInAzadAgent = new AzadAgents({
                payment_In_Schema: {
                  supplier_Id: newEntry._id,
                  supplierName: azad_Visa_Reference_Out_Name,
                  total_Azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,
                  remaining_Balance: azad_Visa_Sales_PKR
                    ? azad_Visa_Sales_PKR
                    : 0,

                  total_Azad_Visa_Price_In_Curr: azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0,

                  curr_Country: cur_Country_One,
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      contact,
                      country,
                      azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                        ? azad_Visa_Sales_PKR
                        : 0,
                      azad_Visa_Price_In_Curr: azad_Visa_Sales_Rate_Oth_Cur
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

              await newPaymentInAzadAgent.save();
              paymentInfo.newPaymentInAzadAgent = newPaymentInAzadAgent;
            } else {
              // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
              const existingPersonIndex =
                existingPaymentInAzadAgent.payment_In_Schema.persons.findIndex(
                  (person) =>
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentInAzadAgent.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;
                existingPaymentInAzadAgent.payment_In_Schema.remaining_Balance +=
                  azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0;

                existingPaymentInAzadAgent.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0;
                existingPaymentInAzadAgent.payment_In_Schema.remaining_Curr +=
                  azad_Visa_Sales_Rate_Oth_Cur
                    ? azad_Visa_Sales_Rate_Oth_Cur
                    : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentInAzadAgent.payment_In_Schema.persons.push(
                  {
                    name,
                    pp_No,
                    entry_Mode,
                    trade,
                    country,
                    contact,
                    azad_Visa_Price_In_PKR: azad_Visa_Sales_PKR
                      ? azad_Visa_Sales_PKR
                      : 0,
                    azad_Visa_Price_In_Curr: azad_Visa_Sales_Cur
                      ? azad_Visa_Sales_Cur
                      : 0,
                    company: company,
                    final_Status: final_Status,
                    flight_Date: flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  }
                );

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingPaymentInAzadAgent.updateOne({
                  $inc: {
                    "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                      azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,
                    "payment_In_Schema.remaining_Balance":
                      azad_Visa_Sales_PKR ? azad_Visa_Sales_PKR : 0,

                    "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
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

              await existingPaymentInAzadAgent.save();
              paymentInfo.existingPaymentInAzadAgent =
                existingPaymentInAzadAgent;
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
        if (
          azad_Visa_Reference_In === "AGENTS" ||
          azad_Visa_Reference_In === "AGENT" ||
          azad_Visa_Reference_In === "Agent" ||
          azad_Visa_Reference_In === "agent" ||
          azad_Visa_Reference_In === "Agents" ||
          azad_Visa_Reference_In === "agents"
        ) {
          try {
            let existingPaymentOutAzadAgent
            for (const supplier of azadAgents){
              if(supplier.payment_Out_Schema){
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===azad_Visa_Reference_In_Name.toLowerCase()){
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
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      contact,
                      country,
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
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentOutAzadAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;
                existingPaymentOutAzadAgent.payment_Out_Schema.remaining_Balance +=
                  azad_Visa_Purchase_PKR ? azad_Visa_Purchase_PKR : 0;

                existingPaymentOutAzadAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0;
                existingPaymentOutAzadAgent.payment_Out_Schema.remaining_Curr +=
                  azad_Visa_Purchase_Rate_Oth_Cur
                    ? azad_Visa_Purchase_Rate_Oth_Cur
                    : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentOutAzadAgent.payment_Out_Schema.persons.push(
                  {
                    name,
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
                await existingPaymentOutAzadAgent.updateOne({
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

              await existingPaymentOutAzadAgent.save();
              paymentInfo.existingPaymentOutAzadAgent =
                existingPaymentOutAzadAgent;
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
        if (
          azad_Visa_Reference_Out === "CANDIDATES" ||
          azad_Visa_Reference_Out === "CANDIDATE" ||
          azad_Visa_Reference_Out === "Candidates" ||
          azad_Visa_Reference_Out === "candidates" ||
          azad_Visa_Reference_Out === "Candidate" ||
          azad_Visa_Reference_Out === "candidate"
        ) {
          try {
            // Check if the supplier with the given name and entry mode exists
            const existingPaymentInAzadCandidate = await AzadCandidate.findOne({
              "payment_In_Schema.supplierName": name,
              "payment_In_Schema.entry_Mode": entry_Mode,
              "payment_In_Schema.pp_No": pp_No,
            });

            if (!existingPaymentInAzadCandidate) {
              // If the supplier does not exist with the same entry mode, create a new one
              const newPaymentInAzadCandidate = new AzadCandidate({
                payment_In_Schema: {
                  supplier_Id: newEntry._id,
                  supplierName: name,
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

                  curr_Country: cur_Country_One,
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

              await newPaymentInAzadCandidate.save();
              paymentInfo.newPaymentInAzadCandidate = newPaymentInAzadCandidate;
            } else {
              // If the supplier exists with the same entry mode, handle accordingly (e.g., update, do nothing)
              // You may choose to update or do nothing based on your specific requirements
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
        if (
          azad_Visa_Reference_In === "CANDIDATES" ||
          azad_Visa_Reference_In === "CANDIDATE" ||
          azad_Visa_Reference_In === "Candidates" ||
          azad_Visa_Reference_In === "Candidate" ||
          azad_Visa_Reference_In === "candidate" ||
          azad_Visa_Reference_In === "candidates"
        ) {
          try {
            // Check if the supplier with the given name exists
            const existingPaymentOutAzadCandidate = await AzadCandidate.findOne(
              {
                "payment_Out_Schema.supplierName": name,
                "payment_Out_Schema.entry_Mode": entry_Mode,
                "payment_Out_Schema.pp_No": pp_No,
              }
            );

            if (!existingPaymentOutAzadCandidate) {
              // If the supplier does not exist, create a new one
              const newPaymentOutAzadCandidate = new AzadCandidate({
                payment_Out_Schema: {
                  supplier_Id: newEntry._id,
                  supplierName: name,
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
              paymentInfo.newPaymentOutAzadCandidate =
                newPaymentOutAzadCandidate;
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Handling Ticket Suppliers
        const ticketSuppliers=await TicketSuppliers.find({})
        const ticketAgents=await TicketAgents.find({})

        //Saving the Entry Details to the Ticket Payment In Section if azad_Visa_Reference_Out_Name is Supplier
        if (
          ticket_Reference_Out === "SUPPLIERS" ||
          ticket_Reference_Out === "SUPPLIER" ||
          ticket_Reference_Out === "Supplier" ||
          ticket_Reference_Out === "supplier" ||
          ticket_Reference_Out === "Suppliers" ||
          ticket_Reference_Out === "suppliers"
        ) {
          try {
            let existingPaymentInTicketSupplier
            for (const supplier of ticketSuppliers){
              if(supplier.payment_In_Schema){
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===ticket_Reference_Out_Name.toLowerCase()){
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
                  supplierName: ticket_Reference_Out_Name,
                  total_Azad_Visa_Price_In_PKR: ticket_Sales_PKR
                    ? ticket_Sales_PKR
                    : 0,
                  remaining_Balance: ticket_Sales_PKR ? ticket_Sales_PKR : 0,

                  total_Azad_Visa_Price_In_Curr: ticket_Sales_Rate_Oth_Cur
                    ? ticket_Sales_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: ticket_Sales_Rate_Oth_Cur
                    ? ticket_Sales_Rate_Oth_Cur
                    : 0,

                  curr_Country: cur_Country_One,
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      country,
                      contact,
                      azad_Visa_Price_In_PKR: ticket_Sales_PKR
                        ? ticket_Sales_PKR
                        : 0,
                      azad_Visa_Price_In_Curr: ticket_Sales_Rate_Oth_Cur
                        ? ticket_Sales_Rate_Oth_Cur
                        : 0,
                      company: company,
                      final_Status: final_Status,
                      flight_Date: flight_Date,
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
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentInTicketSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                  ticket_Sales_PKR ? ticket_Sales_PKR : 0;
                existingPaymentInTicketSupplier.payment_In_Schema.remaining_Balance +=
                  ticket_Sales_PKR ? ticket_Sales_PKR : 0;

                existingPaymentInTicketSupplier.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                  ticket_Sales_Rate_Oth_Cur ? ticket_Sales_Rate_Oth_Cur : 0;
                existingPaymentInTicketSupplier.payment_In_Schema.remaining_Curr +=
                  ticket_Sales_Rate_Oth_Cur ? ticket_Sales_Rate_Oth_Cur : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentInTicketSupplier.payment_In_Schema.persons.push(
                  {
                    name,
                    pp_No,
                    entry_Mode,
                    trade,
                    contact,
                    country,
                    azad_Visa_Price_In_PKR: ticket_Sales_PKR
                      ? ticket_Sales_PKR
                      : 0,
                    azad_Visa_Price_In_Curr: ticket_Sales_Rate_Oth_Cur
                      ? ticket_Sales_Rate_Oth_Cur
                      : 0,
                    company: company,
                    final_Status: final_Status,
                    flight_Date: flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  }
                );

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingPaymentInTicketSupplier.updateOne({
                  $inc: {
                    "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                      ticket_Sales_PKR ? ticket_Sales_PKR : 0,
                    "payment_In_Schema.remaining_Balance":
                      ticket_Sales_PKR ? ticket_Sales_PKR : 0,

                    "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
                      ticket_Sales_Rate_Oth_Cur ? ticket_Sales_Rate_Oth_Cur : 0,
                    "payment_In_Schema.remaining_Curr":
                      ticket_Sales_Rate_Oth_Cur ? ticket_Sales_Rate_Oth_Cur : 0,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }
        //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
        if (
          ticket_Reference_In === "SUPPLIERS" ||
          ticket_Reference_In === "SUPPLIER" ||
          ticket_Reference_In === "Supplier" ||
          ticket_Reference_In === "supplier" ||
          ticket_Reference_In === "Suppliers" ||
          ticket_Reference_In === "suppliers"
        ) {
          try {
            let existingPaymentOutTicketSupplier
            for (const supplier of ticketSuppliers){
              if(supplier.payment_Out_Schema){
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===ticket_Reference_In_Name.toLowerCase()){
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
                  supplierName: ticket_Reference_In_Name,
                  total_Azad_Visa_Price_Out_PKR: ticket_Purchase_PKR
                    ? ticket_Purchase_PKR
                    : 0,
                  remaining_Balance: ticket_Purchase_PKR
                    ? ticket_Purchase_PKR
                    : 0,

                  total_Azad_Visa_Price_Out_Curr: ticket_Purchase_Rate_Oth_Cur
                    ? ticket_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: ticket_Purchase_Rate_Oth_Cur
                    ? ticket_Purchase_Rate_Oth_Cur
                    : 0,

                  curr_Country: cur_Country_One,
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      contact,
                      country,
                      azad_Visa_Price_Out_PKR: ticket_Purchase_PKR
                        ? ticket_Purchase_PKR
                        : 0,
                      azad_Visa_Price_Out_Curr: ticket_Purchase_Rate_Oth_Cur
                        ? ticket_Purchase_Rate_Oth_Cur
                        : 0,
                      company: company,
                      final_Status: final_Status,
                      flight_Date: flight_Date,
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
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentOutTicketSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                  ticket_Purchase_PKR ? ticket_Purchase_PKR : 0;
                existingPaymentOutTicketSupplier.payment_Out_Schema.remaining_Balance +=
                  ticket_Purchase_PKR ? ticket_Purchase_PKR : 0;

                existingPaymentOutTicketSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                  ticket_Purchase_Rate_Oth_Cur
                    ? ticket_Purchase_Rate_Oth_Cur
                    : 0;
                existingPaymentOutTicketSupplier.payment_Out_Schema.remaining_Curr +=
                  ticket_Purchase_Rate_Oth_Cur
                    ? ticket_Purchase_Rate_Oth_Cur
                    : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentOutTicketSupplier.payment_Out_Schema.persons.push(
                  {
                    name,
                    pp_No,
                    entry_Mode,
                    trade,
                    contact,
                    country,
                    azad_Visa_Price_Out_PKR: ticket_Purchase_PKR
                      ? ticket_Purchase_PKR
                      : 0,
                    azad_Visa_Price_Out_Curr: ticket_Purchase_Rate_Oth_Cur
                      ? ticket_Purchase_Rate_Oth_Cur
                      : 0,
                    company: company,
                    final_Status: final_Status,
                    flight_Date: flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  }
                );

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingPaymentOutTicketSupplier.updateOne({
                  $inc: {
                    "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                      ticket_Purchase_PKR ? ticket_Purchase_PKR : 0,
                    "payment_Out_Schema.remaining_Balance":
                      ticket_Purchase_PKR ? ticket_Purchase_PKR : 0,

                    "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                      ticket_Purchase_Rate_Oth_Cur
                        ? ticket_Purchase_Rate_Oth_Cur
                        : 0,
                    "payment_Out_Schema.remaining_Curr":
                      ticket_Purchase_Rate_Oth_Cur
                        ? ticket_Purchase_Rate_Oth_Cur
                        : 0,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }
        //Saving the Entry Details to the Azad Visa Payment In Section if azad_Visa_Reference_Out_Name is Agent
        if (
          ticket_Reference_Out === "AGENTS" ||
          ticket_Reference_Out === "AGENT" ||
          ticket_Reference_Out === "Agents" ||
          ticket_Reference_Out === "agent" ||
          ticket_Reference_Out === "Agent" ||
          ticket_Reference_Out === "agents"
        ) {
          try {
            let existingPaymentInTicketAgent
            for (const supplier of ticketAgents){
              if(supplier.payment_In_Schema){
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===ticket_Reference_Out_Name.toLowerCase()){
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
                  supplierName: ticket_Reference_Out_Name,
                  total_Azad_Visa_Price_In_PKR: ticket_Sales_PKR
                    ? ticket_Sales_PKR
                    : 0,
                  remaining_Balance: ticket_Sales_PKR ? ticket_Sales_PKR : 0,

                  total_Azad_Visa_Price_In_Curr: ticket_Sales_Rate_Oth_Cur
                    ? ticket_Sales_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: ticket_Sales_Rate_Oth_Cur
                    ? ticket_Sales_Rate_Oth_Cur
                    : 0,

                  curr_Country: cur_Country_One,
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      contact,
                      country,
                      azad_Visa_Price_In_PKR: ticket_Sales_PKR
                        ? ticket_Sales_PKR
                        : 0,
                      azad_Visa_Price_In_Curr: ticket_Sales_Rate_Oth_Cur
                        ? ticket_Sales_Rate_Oth_Cur
                        : 0,
                      company: company,
                      final_Status: final_Status,
                      flight_Date: flight_Date,
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
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentInTicketAgent.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                  ticket_Sales_PKR ? ticket_Sales_PKR : 0;
                existingPaymentInTicketAgent.payment_In_Schema.remaining_Balance +=
                  ticket_Sales_PKR ? ticket_Sales_PKR : 0;

                existingPaymentInTicketAgent.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                  ticket_Sales_Rate_Oth_Cur ? ticket_Sales_Rate_Oth_Cur : 0;
                existingPaymentInTicketAgent.payment_In_Schema.remaining_Curr +=
                  ticket_Sales_Rate_Oth_Cur ? ticket_Sales_Rate_Oth_Cur : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentInTicketAgent.payment_In_Schema.persons.push(
                  {
                    name,
                    pp_No,
                    entry_Mode,
                    trade,
                    contact,
                    country,
                    azad_Visa_Price_In_PKR: ticket_Sales_PKR
                      ? ticket_Sales_PKR
                      : 0,
                    azad_Visa_Price_In_Curr: ticket_Sales_Rate_Oth_Cur
                      ? ticket_Sales_Rate_Oth_Cur
                      : 0,
                    company: company,
                    final_Status: final_Status,
                    flight_Date: flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  }
                );

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingPaymentInTicketAgent.updateOne({
                  $inc: {
                    "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                      ticket_Sales_PKR ? ticket_Sales_PKR : 0,
                    "payment_In_Schema.remaining_Balance":
                      ticket_Sales_PKR ? ticket_Sales_PKR : 0,

                    "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
                      ticket_Sales_Rate_Oth_Cur ? ticket_Sales_Rate_Oth_Cur : 0,
                    "payment_In_Schema.remaining_Curr":
                      ticket_Sales_Rate_Oth_Cur ? ticket_Sales_Rate_Oth_Cur : 0,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }
        //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
        if (
          ticket_Reference_In === "AGENTS" ||
          ticket_Reference_In === "AGENT" ||
          ticket_Reference_In === "Agent" ||
          ticket_Reference_In === "agent" ||
          ticket_Reference_In === "Agents" ||
          ticket_Reference_In === "agents"
        ) {
          try {

            let existingPaymentOutTicketAgent
            for (const supplier of ticketAgents){
              if(supplier.payment_Out_Schema){
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===ticket_Reference_In_Name.toLowerCase()){
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
                  supplierName: ticket_Reference_In_Name,
                  total_Azad_Visa_Price_Out_PKR: ticket_Purchase_PKR
                    ? ticket_Purchase_PKR
                    : 0,
                  remaining_Balance: ticket_Purchase_PKR
                    ? ticket_Purchase_PKR
                    : 0,

                  total_Azad_Visa_Price_Out_Curr: ticket_Purchase_Rate_Oth_Cur
                    ? ticket_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: ticket_Purchase_Rate_Oth_Cur
                    ? ticket_Purchase_Rate_Oth_Cur
                    : 0,

                  curr_Country: cur_Country_One,
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      contact,
                      country,
                      azad_Visa_Price_Out_PKR: ticket_Purchase_PKR
                        ? ticket_Purchase_PKR
                        : 0,
                      azad_Visa_Price_Out_Curr: ticket_Purchase_Rate_Oth_Cur
                        ? ticket_Purchase_Rate_Oth_Cur
                        : 0,
                      company: company,
                      final_Status: final_Status,
                      flight_Date: flight_Date,
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
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentOutTicketAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                  ticket_Purchase_PKR ? ticket_Purchase_PKR : 0;
                existingPaymentOutTicketAgent.payment_Out_Schema.remaining_Balance +=
                  ticket_Purchase_PKR ? ticket_Purchase_PKR : 0;

                existingPaymentOutTicketAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                  ticket_Purchase_Rate_Oth_Cur
                    ? ticket_Purchase_Rate_Oth_Cur
                    : 0;
                existingPaymentOutTicketAgent.payment_Out_Schema.remaining_Curr +=
                  ticket_Purchase_Rate_Oth_Cur
                    ? ticket_Purchase_Rate_Oth_Cur
                    : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentOutTicketAgent.payment_Out_Schema.persons.push(
                  {
                    name,
                    pp_No,
                    entry_Mode,
                    trade,
                    contact,
                    country,
                    azad_Visa_Price_Out_PKR: ticket_Purchase_PKR
                      ? ticket_Purchase_PKR
                      : 0,
                    azad_Visa_Price_Out_Curr: ticket_Purchase_Rate_Oth_Cur
                      ? ticket_Purchase_Rate_Oth_Cur
                      : 0,
                    company: company,
                    final_Status: final_Status,
                    flight_Date: flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  }
                );

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingPaymentOutTicketAgent.updateOne({
                  $inc: {
                    "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                      ticket_Purchase_PKR ? ticket_Purchase_PKR : 0,
                    "payment_Out_Schema.remaining_Balance":
                      ticket_Purchase_PKR ? ticket_Purchase_PKR : 0,

                    "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                      ticket_Purchase_Rate_Oth_Cur
                        ? ticket_Purchase_Rate_Oth_Cur
                        : 0,
                    "payment_Out_Schema.remaining_Curr":
                      ticket_Purchase_Rate_Oth_Cur
                        ? ticket_Purchase_Rate_Oth_Cur
                        : 0,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }
        //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
        if (
          ticket_Reference_Out === "CANDIDATES" ||
          ticket_Reference_Out === "CANDIDATE" ||
          ticket_Reference_Out === "Candidates" ||
          ticket_Reference_Out === "candidates" ||
          ticket_Reference_Out === "Candidate" ||
          ticket_Reference_Out === "candidate"
        ) {
          try {
            // Check if the supplier with the given name and entry mode exists
            const existingPaymentInTicketCandidate =
              await TicketCandidate.findOne({
                "payment_In_Schema.supplierName": name,
                "payment_In_Schema.entry_Mode": entry_Mode,
                "payment_In_Schema.pp_No": pp_No,
              });

            if (!existingPaymentInTicketCandidate) {
              // If the supplier does not exist with the same entry mode, create a new one
              const newPaymentInTicketCandidate = new TicketCandidate({
                payment_In_Schema: {
                  supplier_Id: newEntry._id,
                  supplierName: name,
                  total_Visa_Price_In_PKR: ticket_Sales_PKR
                    ? ticket_Sales_PKR
                    : 0,
                  remaining_Balance: ticket_Sales_PKR ? ticket_Sales_PKR : 0,

                  total_Visa_Price_In_Curr: ticket_Sales_Rate_Oth_Cur
                    ? ticket_Sales_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: ticket_Sales_Rate_Oth_Cur
                    ? ticket_Sales_Rate_Oth_Cur
                    : 0,

                  curr_Country: cur_Country_One,
                  pp_No: pp_No,
                  entry_Mode: entry_Mode,
                  company: company,
                  trade: trade,
                  contact: contact,
                  country: country,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
        if (
          ticket_Reference_In === "CANDIDATES" ||
          ticket_Reference_In === "CANDIDATE" ||
          ticket_Reference_In === "Candidates" ||
          ticket_Reference_In === "Candidate" ||
          ticket_Reference_In === "candidate" ||
          ticket_Reference_In === "candidates"
        ) {
          try {
            // Check if the supplier with the given name exists
            const existingPaymentOutTicketCandidate =
              await TicketCandidate.findOne({
                "payment_Out_Schema.supplierName": name,
                "payment_Out_Schema.entry_Mode": entry_Mode,
                "payment_Out_Schema.pp_No": pp_No,
              });

            if (!existingPaymentOutTicketCandidate) {
              // If the supplier does not exist, create a new one
              const newPaymentOutTicketCandidate = new TicketCandidate({
                payment_Out_Schema: {
                  supplier_Id: newEntry._id,
                  supplierName: name,
                  total_Visa_Price_Out_PKR: ticket_Purchase_PKR
                    ? ticket_Purchase_PKR
                    : 0,
                  remaining_Balance: ticket_Purchase_PKR
                    ? ticket_Purchase_PKR
                    : 0,

                  total_Visa_Price_Out_Curr: ticket_Purchase_Rate_Oth_Cur
                    ? ticket_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: ticket_Purchase_Rate_Oth_Cur
                    ? ticket_Purchase_Rate_Oth_Cur
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
                  entry_Date: new Date().toISOString().split("T")[0],
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        // Handling Visit Suppliers
        const visitSuppliers=await VisitSuppliers.find({})
        const visitAgents=await VisitAgents.find({})

        //Saving the Entry Details to the Ticket Payment In Section if azad_Visa_Reference_Out_Name is Supplier
        if (
          visit_Reference_Out === "SUPPLIERS" ||
          visit_Reference_Out === "SUPPLIER" ||
          visit_Reference_Out === "Supplier" ||
          visit_Reference_Out === "supplier" ||
          visit_Reference_Out === "Suppliers" ||
          visit_Reference_Out === "suppliers"
        ) {
          try {
            let existingPaymentInVisitSupplier
            for (const supplier of visitSuppliers){
              if(supplier.payment_In_Schema){
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===visit_Reference_Out_Name.toLowerCase()){
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
                  supplierName: visit_Reference_Out_Name,
                  total_Azad_Visa_Price_In_PKR: visit_Sales_PKR
                    ? visit_Sales_PKR
                    : 0,
                  remaining_Balance: visit_Sales_PKR ? visit_Sales_PKR : 0,

                  total_Azad_Visa_Price_In_Curr: visit_Sales_Rate_Oth_Curr
                    ? visit_Sales_Rate_Oth_Curr
                    : 0,
                  remaining_Curr: visit_Sales_Rate_Oth_Curr
                    ? visit_Sales_Rate_Oth_Curr
                    : 0,

                  curr_Country: cur_Country_One,
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      contact,
                      country,
                      azad_Visa_Price_In_PKR: visit_Sales_PKR
                        ? visit_Sales_PKR
                        : 0,
                      azad_Visa_Price_In_Curr: visit_Sales_Rate_Oth_Curr
                        ? visit_Sales_Rate_Oth_Curr
                        : 0,
                      company: company,
                      final_Status: final_Status,
                      flight_Date: flight_Date,
                      entry_Date: new Date().toISOString().split("T")[0],
                    },
                  ],
                },
              });

              await newPaymentInVisitSupplier.save();
              paymentInfo.newPaymentInVisitSupplier = newPaymentInVisitSupplier;
            } else {
              // If the supplier exists, check if the person already exists in the persons array of payment_In_Schema
              const existingPersonIndex =
                existingPaymentInVisitSupplier.payment_In_Schema.persons.findIndex(
                  (person) =>
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentInVisitSupplier.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                  visit_Sales_PKR;
                existingPaymentInVisitSupplier.payment_In_Schema.remaining_Balance +=
                  visit_Sales_PKR;

                existingPaymentInVisitSupplier.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                  visit_Sales_Rate_Oth_Curr;
                existingPaymentInVisitSupplier.payment_In_Schema.remaining_Curr +=
                  visit_Sales_Rate_Oth_Curr;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentInVisitSupplier.payment_In_Schema.persons.push(
                  {
                    name,
                    pp_No,
                    entry_Mode,
                    trade,
                    contact,
                    country,
                    azad_Visa_Price_In_PKR: visit_Sales_PKR
                      ? visit_Sales_PKR
                      : 0,
                    azad_Visa_Price_In_Curr: visit_Sales_Rate_Oth_Curr
                      ? visit_Sales_Rate_Oth_Curr
                      : 0,
                    company: company,
                    final_Status: final_Status,
                    flight_Date: flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  }
                );

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingPaymentInVisitSupplier.updateOne({
                  $inc: {
                    "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                      visit_Sales_PKR ? visit_Sales_PKR : 0,
                    "payment_In_Schema.remaining_Balance":
                      visit_Sales_PKR ? visit_Sales_PKR : 0,

                    "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
                      visit_Sales_Rate_Oth_Curr ? visit_Sales_Rate_Oth_Curr : 0,
                    "payment_In_Schema.remaining_Curr":
                      visit_Sales_Rate_Oth_Curr ? visit_Sales_Rate_Oth_Curr : 0,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }
        //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
        if (
          visit_Reference_In === "SUPPLIERS" ||
          visit_Reference_In === "SUPPLIER" ||
          visit_Reference_In === "Supplier" ||
          visit_Reference_In === "supplier" ||
          visit_Reference_In === "Suppliers" ||
          visit_Reference_In === "suppliers"
        ) {
          try {

            let existingPaymentOutVisitSupplier
            for (const supplier of visitSuppliers){
              if(supplier.payment_Out_Schema){
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===visit_Reference_In_Name.toLowerCase()){
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
                  supplierName: visit_Reference_In_Name,
                  total_Azad_Visa_Price_Out_PKR: visit_Purchase_Rate_PKR
                    ? visit_Purchase_Rate_PKR
                    : 0,
                  remaining_Balance: visit_Purchase_Rate_PKR
                    ? visit_Purchase_Rate_PKR
                    : 0,

                  total_Azad_Visa_Price_Out_Curr: visit_Purchase_Rate_Oth_Cur
                    ? visit_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visit_Purchase_Rate_Oth_Cur
                    ? visit_Purchase_Rate_Oth_Cur
                    : 0,

                  curr_Country: cur_Country_One,
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      country,
                      contact,
                      azad_Visa_Price_Out_PKR: visit_Purchase_Rate_PKR
                        ? visit_Purchase_Rate_PKR
                        : 0,
                      azad_Visa_Price_Out_Curr: visit_Purchase_Rate_Oth_Cur
                        ? visit_Purchase_Rate_Oth_Cur
                        : 0,
                      company: company,
                      final_Status: final_Status,
                      flight_Date: flight_Date,
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
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentOutVisitSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                  visit_Purchase_Rate_PKR ? visit_Purchase_Rate_PKR : 0;
                existingPaymentOutVisitSupplier.payment_Out_Schema.remaining_Balance +=
                  visit_Purchase_Rate_PKR ? visit_Purchase_Rate_PKR : 0;

                existingPaymentOutVisitSupplier.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                  visit_Purchase_Rate_Oth_Cur ? visit_Purchase_Rate_Oth_Cur : 0;
                existingPaymentOutVisitSupplier.payment_Out_Schema.remaining_Curr +=
                  visit_Purchase_Rate_Oth_Cur ? visit_Purchase_Rate_Oth_Cur : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentOutVisitSupplier.payment_Out_Schema.persons.push(
                  {
                    name,
                    pp_No,
                    entry_Mode,
                    trade,
                    contact,
                    country,
                    azad_Visa_Price_Out_PKR: visit_Purchase_Rate_PKR
                      ? visit_Purchase_Rate_PKR
                      : 0,
                    azad_Visa_Price_Out_Curr: visit_Purchase_Rate_Oth_Cur
                      ? visit_Purchase_Rate_Oth_Cur
                      : 0,
                    company: company,
                    final_Status: final_Status,
                    flight_Date: flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  }
                );

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingPaymentOutVisitSupplier.updateOne({
                  $inc: {
                    "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                      visit_Purchase_Rate_PKR ? visit_Purchase_Rate_PKR : 0,
                    "payment_Out_Schema.remaining_Balance":
                      visit_Purchase_Rate_PKR ? visit_Purchase_Rate_PKR : 0,

                    "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                      visit_Purchase_Rate_Oth_Cur
                        ? visit_Purchase_Rate_Oth_Cur
                        : 0,
                    "payment_Out_Schema.remaining_Curr":
                      visit_Purchase_Rate_Oth_Cur
                        ? visit_Purchase_Rate_Oth_Cur
                        : 0,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }
        //Saving the Entry Details to the Azad Visa Payment In Section if azad_Visa_Reference_Out_Name is Agent
        if (
          visit_Reference_Out === "AGENTS" ||
          visit_Reference_Out === "AGENT" ||
          visit_Reference_Out === "Agents" ||
          visit_Reference_Out === "agent" ||
          visit_Reference_Out === "Agent" ||
          visit_Reference_Out === "agents"
        ) {
          try {

            let existingPaymentInVisitAgent
            for (const supplier of visitAgents){
              if(supplier.payment_In_Schema){
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===visit_Reference_Out_Name.toLowerCase()){
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
                  supplierName: visit_Reference_Out_Name,
                  total_Azad_Visa_Price_In_PKR: visit_Sales_PKR
                    ? visit_Sales_PKR
                    : 0,
                  remaining_Balance: visit_Sales_PKR ? visit_Sales_PKR : 0,

                  total_Azad_Visa_Price_In_Curr: visit_Sales_Rate_Oth_Curr
                    ? visit_Sales_Rate_Oth_Curr
                    : 0,
                  remaining_Curr: visit_Sales_Rate_Oth_Curr
                    ? visit_Sales_Rate_Oth_Curr
                    : 0,

                  curr_Country: cur_Country_One,
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      country,
                      contact,
                      azad_Visa_Price_In_PKR: visit_Sales_PKR
                        ? visit_Sales_PKR
                        : 0,
                      azad_Visa_Price_In_Curr: visit_Sales_Rate_Oth_Curr
                        ? visit_Sales_Rate_Oth_Curr
                        : 0,
                      company: company,
                      final_Status: final_Status,
                      flight_Date: flight_Date,
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
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentInVisitAgent.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
                  visit_Sales_PKR ? visit_Sales_PKR : 0;
                existingPaymentInVisitAgent.payment_In_Schema.remaining_Balance +=
                  visit_Sales_PKR ? visit_Sales_PKR : 0;

                existingPaymentInVisitAgent.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
                  visit_Sales_Rate_Oth_Curr ? visit_Sales_Rate_Oth_Curr : 0;
                existingPaymentInVisitAgent.payment_In_Schema.remaining_Curr +=
                  visit_Sales_Rate_Oth_Curr ? visit_Sales_Rate_Oth_Curr : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentInVisitAgent.payment_In_Schema.persons.push(
                  {
                    name,
                    pp_No,
                    entry_Mode,
                    trade,
                    contact,
                    country,
                    azad_Visa_Price_In_PKR: visit_Sales_PKR
                      ? visit_Sales_PKR
                      : 0,
                    azad_Visa_Price_In_Curr: visit_Sales_Rate_Oth_Curr
                      ? visit_Sales_Rate_Oth_Curr
                      : 0,
                    company: company,
                    final_Status: final_Status,
                    flight_Date: flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  }
                );

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingPaymentInVisitAgent.updateOne({
                  $inc: {
                    "payment_In_Schema.total_Azad_Visa_Price_In_PKR":
                      visit_Sales_PKR ? visit_Sales_PKR : 0,
                    "payment_In_Schema.remaining_Balance": visit_Sales_PKR
                      ? visit_Sales_PKR
                      : 0,

                    "payment_In_Schema.total_Azad_Visa_Price_In_Curr":
                      visit_Sales_Rate_Oth_Curr ? visit_Sales_Rate_Oth_Curr : 0,
                    "payment_In_Schema.remaining_Curr":
                      visit_Sales_Rate_Oth_Curr ? visit_Sales_Rate_Oth_Curr : 0,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }
        //Saving the Entry Details to the Azad Supplier Payment Out Section if azad_Visa_Reference_In_Name is avialable
        if (
          visit_Reference_In === "AGENTS" ||
          visit_Reference_In === "AGENT" ||
          visit_Reference_In === "Agents" ||
          visit_Reference_In === "agents" ||
          visit_Reference_In === "Agent" ||
          visit_Reference_In === "agent"
        ) {
          try {

            let existingPaymentOutVisitAgent
            for (const supplier of visitAgents){
              if(supplier.payment_Out_Schema){
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===visit_Reference_In_Name.toLowerCase()){
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
                  supplierName: visit_Reference_In_Name,
                  total_Azad_Visa_Price_Out_PKR: visit_Purchase_Rate_PKR
                    ? visit_Purchase_Rate_PKR
                    : 0,
                  remaining_Balance: visit_Purchase_Rate_PKR
                    ? visit_Purchase_Rate_PKR
                    : 0,

                  total_Azad_Visa_Price_Out_Curr: visit_Purchase_Rate_Oth_Cur
                    ? visit_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visit_Purchase_Rate_Oth_Cur
                    ? visit_Purchase_Rate_Oth_Cur
                    : 0,

                  curr_Country: cur_Country_One,
                  persons: [
                    {
                      name,
                      pp_No,
                      entry_Mode,
                      trade,
                      country,
                      contact,
                      azad_Visa_Price_Out_PKR: visit_Purchase_Rate_PKR
                        ? visit_Purchase_Rate_PKR
                        : 0,
                      azad_Visa_Price_Out_Curr: visit_Purchase_Rate_Oth_Cur
                        ? visit_Purchase_Rate_Oth_Cur
                        : 0,
                      company: company,
                      final_Status: final_Status,
                      flight_Date: flight_Date,
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
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentOutVisitAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
                  visit_Purchase_Rate_PKR ? visit_Purchase_Rate_PKR : 0;
                existingPaymentOutVisitAgent.payment_Out_Schema.remaining_Balance +=
                  visit_Purchase_Rate_PKR ? visit_Purchase_Rate_PKR : 0;

                existingPaymentOutVisitAgent.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
                  visit_Purchase_Rate_Oth_Cur ? visit_Purchase_Rate_Oth_Cur : 0;
                existingPaymentOutVisitAgent.payment_Out_Schema.remaining_Curr +=
                  visit_Purchase_Rate_Oth_Cur ? visit_Purchase_Rate_Oth_Cur : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentOutVisitAgent.payment_Out_Schema.persons.push(
                  {
                    name,
                    pp_No,
                    entry_Mode,
                    trade,
                    country,
                    contact,
                    azad_Visa_Price_Out_PKR: visit_Purchase_Rate_PKR
                      ? visit_Purchase_Rate_PKR
                      : 0,
                    azad_Visa_Price_Out_Curr: visit_Purchase_Rate_Oth_Cur
                      ? visit_Purchase_Rate_Oth_Cur
                      : 0,
                    company: company,
                    final_Status: final_Status,
                    flight_Date: flight_Date,
                    entry_Date: new Date().toISOString().split("T")[0],
                  }
                );

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingPaymentOutVisitAgent.updateOne({
                  $inc: {
                    "payment_Out_Schema.total_Azad_Visa_Price_Out_PKR":
                      visit_Purchase_Rate_PKR ? visit_Purchase_Rate_PKR : 0,
                    "payment_Out_Schema.remaining_Balance":
                      visit_Purchase_Rate_PKR ? visit_Purchase_Rate_PKR : 0,

                    "payment_Out_Schema.total_Azad_Visa_Price_Out_Curr":
                      visit_Purchase_Rate_Oth_Cur
                        ? visit_Purchase_Rate_Oth_Cur
                        : 0,
                    "payment_Out_Schema.remaining_Curr":
                      visit_Purchase_Rate_Oth_Cur
                        ? visit_Purchase_Rate_Oth_Cur
                        : 0,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }
        //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
        if (
          visit_Reference_Out === "CANDIDATES" ||
          visit_Reference_Out === "CANDIDATE" ||
          visit_Reference_Out === "Candidate" ||
          visit_Reference_Out === "candidate" ||
          visit_Reference_Out === "Candidates" ||
          visit_Reference_Out === "candidates"
        ) {
          try {
            // Check if the supplier with the given name and entry mode exists
            const existingPaymentInVisitCandidate =
              await VisitCandidate.findOne({
                "payment_In_Schema.supplierName": name,
                "payment_In_Schema.entry_Mode": entry_Mode,
                "payment_In_Schema.pp_No": pp_No,
              });

            if (!existingPaymentInVisitCandidate) {
              // If the supplier does not exist with the same entry mode, create a new one
              const newPaymentInVisitCandidate = new VisitCandidate({
                payment_In_Schema: {
                  supplier_Id: newEntry._id,
                  supplierName: name,
                  total_Visa_Price_In_PKR: visit_Sales_PKR
                    ? visit_Sales_PKR
                    : 0,
                  remaining_Balance: visit_Sales_PKR ? visit_Sales_PKR : 0,

                  total_Visa_Price_In_Curr: visit_Sales_Rate_Oth_Curr
                    ? visit_Sales_Rate_Oth_Curr
                    : 0,
                  remaining_Curr: visit_Sales_Rate_Oth_Curr
                    ? visit_Sales_Rate_Oth_Curr
                    : 0,

                  curr_Country: cur_Country_One,
                  pp_No: pp_No,
                  entry_Mode: entry_Mode,
                  company: company,
                  trade: trade,
                  country: country,
                  contact: trade,
                  final_Status: final_Status,
                  flight_Date: flight_Date,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
        if (
          visit_Reference_In === "CANDIDATES" ||
          visit_Reference_In === "CANDIDATE" ||
          visit_Reference_In === "Candidate" ||
          visit_Reference_In === "Candidates" ||
          visit_Reference_In === "candidate" ||
          visit_Reference_In === "candidates"
        ) {
          try {
            // Check if the supplier with the given name exists
            const existingPaymentOutVisitCandidate =
              await VisitCandidate.findOne({
                "payment_Out_Schema.supplierName": name,
                "payment_Out_Schema.entry_Mode": entry_Mode,
                "payment_Out_Schema.pp_No": pp_No,
              });

            if (!existingPaymentOutVisitCandidate) {
              // If the supplier does not exist, create a new one
              const newPaymentOutVisitCandidate = new VisitCandidate({
                payment_Out_Schema: {
                  supplier_Id: newEntry._id,
                  supplierName: name,
                  total_Visa_Price_Out_PKR: visit_Purchase_Rate_PKR
                    ? visit_Purchase_Rate_PKR
                    : 0,
                  remaining_Balance: visit_Purchase_Rate_PKR
                    ? visit_Purchase_Rate_PKR
                    : 0,

                  total_Visa_Price_Out_Curr: visit_Purchase_Rate_Oth_Cur
                    ? visit_Purchase_Rate_Oth_Cur
                    : 0,
                  remaining_Curr: visit_Purchase_Rate_Oth_Cur
                    ? visit_Purchase_Rate_Oth_Cur
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

              await newPaymentOutVisitCandidate.save();
              paymentInfo.newPaymentOutVisitCandidate =
                newPaymentOutVisitCandidate;
            }
          } catch (saveError) {
            console.error(saveError);
            res
              .status(500)
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        const protectors=await Protector.find({})
        if (
         ( protector_Reference_In === "PRPTECTORS" ||
          protector_Reference_In === "PRPTECTOR" ||
          protector_Reference_In === "Protectors" ||
          protector_Reference_In === "Protector" ||
          protector_Reference_In === "protectors" ||
          protector_Reference_In === "protector") && protector_Reference_In_Name
        ) {
          try {
            let existingPaymentOutProtector
            for(const protector of protectors){
              if(protector.payment_Out_Schema){
                if(protector.payment_Out_Schema.supplierName.toLowerCase()===protector_Reference_In_Name.toLowerCase()){
                  existingPaymentOutProtector=protector
                }
              }
            }
          

            if (!existingPaymentOutProtector) {
              // If the supplier does not exist, create a new one
              const newPaymentOutProtector = new Protector({
                payment_Out_Schema: {
                  supplier_Id: newEntry._id,
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

                  curr_Country: cur_Country_One,
                  persons: [
                    {
                      name,
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
                    person.pp_No === pp_No &&
                    person.entry_Mode === entry_Mode &&
                    person.name === name
                );

              if (existingPersonIndex !== -1) {
                // If the person already exists, update visa_Sales_Rate_PKR and total_Visa_Price_In_PKR
                existingPaymentOutProtector.payment_Out_Schema.total_Protector_Price_Out_PKR +=
                  protector_Price_In ? protector_Price_In : 0;
                existingPaymentOutProtector.payment_Out_Schema.remaining_Balance +=
                  protector_Price_In ? protector_Price_In : 0;

                existingPaymentOutProtector.payment_Out_Schema.total_Protector_Price_Out_Curr +=
                  protector_Price_In_Oth_Cur ? protector_Price_In_Oth_Cur : 0;
                existingPaymentOutProtector.payment_Out_Schema.remaining_Curr +=
                  protector_Price_In_Oth_Cur ? protector_Price_In_Oth_Cur : 0;
              } else {
                // If the person does not exist, add them to the persons array
                existingPaymentOutProtector.payment_Out_Schema.persons.push({
                  name,
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

                // Update total_Visa_Price_In_PKR and other fields using $inc
                await existingPaymentOutProtector.updateOne({
                  $inc: {
                    "payment_Out_Schema.total_Protector_Price_Out_PKR":
                      protector_Price_In ? protector_Price_In : 0,
                    "payment_Out_Schema.remaining_Balance": protector_Price_In
                      ? protector_Price_In
                      : 0,

                    "payment_Out_Schema.total_Protector_Price_Out_Curr":
                      protector_Price_In_Oth_Cur
                        ? protector_Price_In_Oth_Cur
                        : 0,
                    "payment_Out_Schema.remaining_Curr":
                      protector_Price_In_Oth_Cur
                        ? protector_Price_In_Oth_Cur
                        : 0,
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
              .json({ message: "Error Saving the Entry to the Database" });
          }
        }

        await newEntry.save();
        const responsePayload = {
          data: newEntry,
          message: `${name} with ${pp_No} added Successfully`,
          paymentInfo: paymentInfo, // Include payment information in the response
        };

        res.status(200).json(responsePayload);
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// adding multiple Entries
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
        if (!entryData.entry_Date) {
          entryData.entry_Date = new Date().toISOString().split("T")[0]
        }
        let sendResponse = true;

        const existingPPNO = await Entries.findOne({
          pp_No: entryData.pp_No,
          entry_Mode: entryData.entry_Mode,
        });

        if (existingPPNO) {
          res.status(400).json({
            message: `Entry with Passport Number ${entryData.pp_No} and Entry Mode ${entryData.entry_Mode} already exists`,
          });
          return;
        }
        if (!existingPPNO) {

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
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.reference_Out_Name.toLowerCase()){
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
              if(supplier.payment_Out_Schema && supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.reference_In_Name.toLowerCase()){
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
              if(agent.payment_In_Schema && agent.payment_In_Schema.supplierName.toLowerCase()===entryData.reference_Out_Name.toLowerCase()){
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
                .json({ message: "Error Saving the Entry to the Database" });
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
              if(agent.payment_Out_Schema && agent.payment_Out_Schema.supplierName.toLowerCase()===entryData.reference_In_Name.toLowerCase()){
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
                .json({ message: "Error Saving the Entry to the Database" });
            }
          }

          //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
          if (
            entryData.reference_Out === "CANDIDATES" ||
            entryData.reference_Out === "CANDIDATE" ||
            entryData.reference_Out === "candidates" ||
            entryData.reference_Out === "candidate" ||
            entryData.reference_Out === "Candidates" ||
            entryData.reference_Out === "Candidate"
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
                .json({ message: "Error Saving the Entry to the Database" });
            }
          }

          //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
          if (
            entryData.reference_In === "CANDIDATES" ||
            entryData.reference_In === "CANDIDATE" ||
            entryData.reference_In === "candidates" ||
            entryData.reference_In === "candidate" ||
            entryData.reference_In === "Candidates" ||
            entryData.reference_In === "Candidate"
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                  if(supplier.payment_In_Schema && supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.azad_Visa_Reference_Out_Name.toLowerCase()){
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.azad_Visa_Reference_In_Name.toLowerCase()){
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

                    curr_Country: entryData.cur_Country_One,
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.azad_Visa_Reference_Out_Name.toLowerCase()){
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.azad_Visa_Reference_In_Name.toLowerCase()){
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

                    curr_Country: entryData.cur_Country_One,
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
                .json({ message: "Error Saving the Entry to the Database" });
            }
          }
          //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
          if (
            entryData.azad_Visa_Reference_Out === "CANDIDATES" ||
            entryData.azad_Visa_Reference_Out === "CANDIDATE" ||
            entryData.azad_Visa_Reference_Out === "candidates" ||
            entryData.azad_Visa_Reference_Out === "candidate" ||
            entryData.azad_Visa_Reference_Out === "Candidates" ||
            entryData.azad_Visa_Reference_Out === "Candidate"
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
                .json({ message: "Error Saving the Entry to the Database" });
            }
          }

          //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
          if (
            entryData.azad_Visa_Reference_In === "CANDIDATES" ||
            entryData.azad_Visa_Reference_In === "CANDIDATE" ||
            entryData.azad_Visa_Reference_In === "candidates" ||
            entryData.azad_Visa_Reference_In === "candidate" ||
            entryData.azad_Visa_Reference_In === "Candidates" ||
            entryData.azad_Visa_Reference_In === "Candidate"
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                  if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.ticket_Reference_Out_Name.toLowerCase()){
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                  if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.ticket_Reference_In_Name.toLowerCase()){
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

                    curr_Country: entryData.cur_Country_One,
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                  if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.ticket_Reference_Out_Name.toLowerCase()){
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.ticket_Reference_In_Name.toLowerCase()){
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

                    curr_Country: entryData.cur_Country_One,
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
                .json({ message: "Error Saving the Entry to the Database" });
            }
          }
          //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
          if (
            entryData.ticket_Reference_Out === "CANDIDATES" ||
            entryData.ticket_Reference_Out === "CANDIDATE" ||
            entryData.ticket_Reference_Out === "candidates" ||
            entryData.ticket_Reference_Out === "candidate" ||
            entryData.ticket_Reference_Out === "Candidates" ||
            entryData.ticket_Reference_Out === "Candidate"
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
                .json({ message: "Error Saving the Entry to the Database" });
            }
          }

          //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
          if (
            entryData.ticket_Reference_In === "CANDIDATES" ||
            entryData.ticket_Reference_In === "CANDIDATE" ||
            entryData.ticket_Reference_In === "candidates" ||
            entryData.ticket_Reference_In === "candidate" ||
            entryData.ticket_Reference_In === "Candidates" ||
            entryData.ticket_Reference_In === "Candidate"
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                  if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.visit_Reference_Out_Name.toLowerCase()){
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                  if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.visit_Reference_In_Name.toLowerCase()){
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

                    curr_Country: entryData.cur_Country_One,
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                if(supplier.payment_In_Schema.supplierName.toLowerCase()===entryData.visit_Reference_Out_Name.toLowerCase()){
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                  if(supplier.payment_Out_Schema.supplierName.toLowerCase()===entryData.visit_Reference_In_Name.toLowerCase()){
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

                    curr_Country: entryData.cur_Country_One,
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
                .json({ message: "Error Saving the Entry to the Database" });
            }
          }
          //Saving the Entry Details to the Candidate Payment In Section if reference_Out==="Candidate"
          if (
            entryData.visit_Reference_Out === "CANDIDATES" ||
            entryData.visit_Reference_Out === "CANDIDATE" ||
            entryData.visit_Reference_Out === "candidates" ||
            entryData.visit_Reference_Out === "candidate" ||
            entryData.visit_Reference_Out === "Candidates" ||
            entryData.visit_Reference_Out === "Candidate"
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
                .json({ message: "Error Saving the Entry to the Database" });
            }
          }

          //Saving the Entry Details to the Candidate Payment Out Section if reference_In==="Candidate"
          if (
            entryData.visit_Reference_In === "CANDIDATES" ||
            entryData.visit_Reference_In === "CANDIDATE" ||
            entryData.visit_Reference_In === "candidate" ||
            entryData.visit_Reference_In === "candidates" ||
            entryData.visit_Reference_In === "Candidate" ||
            entryData.visit_Reference_In === "Candidates"
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
                .json({ message: "Error Saving the Entry to the Database" });
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
                if(protector.payment_Out_Schema.supplierName.toLowerCase()===entryData.protector_Reference_In_Name.toLowerCase()){
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
                .json({ message: "Error Saving the Entry to the Database" });
            }
          }

          await newEntry.save();
          addedEntries.push(newEntry);
        }
      }

      const responsePayload = {
        data: addedEntries,
        message: `${addedEntries.length} Entries added successfully`,
        paymentInfo: paymentInfo,
      };

      res.status(200).json(responsePayload);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// gettig all Enteries

const getEntry = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    if (user) {
      const entries = await Entries.find({}).sort({ createdAt: -1 });
      // Format createdAt dates using moment
      const formattedEntries = entries.map((entry) => ({

        ...entry._doc,

        createdAt: moment(entry.createdAt).format("YYYY-MM-DD"),
        updatedAt: moment(entry.updatedAt).format("YYYY-MM-DD"),
      }));
      res.status(200).json({ data: formattedEntries });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
          const existingSupplierPaymentOut = await Suppliers.findOne({
            "payment_Out_Schema.supplierName": reference_In_Name,
          });
          let supplierOutPersonIndex;
          if (existingSupplierPaymentOut) {
            // Find the index of the person in the persons array
            supplierOutPersonIndex =
              existingSupplierPaymentOut.payment_Out_Schema.persons.findIndex(
                (person) =>
                  person.name === name &&
                  person.entry_Mode === entry_Mode &&
                  person.pp_No === pp_No
              );
          }
    
          // If the person is found, remove it from the persons array
          if (supplierOutPersonIndex !== -1) {
    
            existingSupplierPaymentOut?.payment_Out_Schema?.persons.splice(
              supplierOutPersonIndex,
              1
            );
            existingSupplierPaymentOut.payment_Out_Schema.total_Visa_Price_Out_PKR +=
              newVisaPurchaseRatePKR /* Adjust based on your needs */;
            existingSupplierPaymentOut.payment_Out_Schema.total_Visa_Price_Out_Curr +=
              newVisaPurchaseRateOthCur /* Adjust based on your needs */;
            existingSupplierPaymentOut.payment_Out_Schema.remaining_Curr +=
              newVisaPurchaseRateOthCur /* Adjust based on your needs */;
            existingSupplierPaymentOut.payment_Out_Schema.remaining_Balance +=
              newVisaPurchaseRatePKR /* Adjust based on your needs */;
            await existingSupplierPaymentOut.save();
          }
        }
     
        if(reference_Out_Name !== undefined &&
          reference_Out_Name !== null &&
          reference_Out_Name !== "" && ( reference_Out.toLowerCase()==='supplier' || reference_Out.toLowerCase()==='suppliers')){
 // Update the Agent With PaymentIn by removing the person from the persons array
 const existingSupplierPaymentIn = await Suppliers.findOne({
  "payment_In_Schema.supplierName": reference_Out_Name,
});
// Find the index of the person in the persons array

if (existingSupplierPaymentIn) {
  let supplierInPersonIndex;
  supplierInPersonIndex =
    existingSupplierPaymentIn?.payment_In_Schema?.persons.findIndex(
      (person) =>
        person.name === name &&
        person.entry_Mode === entry_Mode &&
        person.pp_No === pp_No
    );
  // If the person is found, remove it from the persons array
  if (supplierInPersonIndex !== -1) {
    existingSupplierPaymentIn.payment_In_Schema.persons.splice(
      supplierInPersonIndex,
      1
    );
    existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_PKR +=
      newVisaSalesRatePKR /* Adjust based on your needs */;
    existingSupplierPaymentIn.payment_In_Schema.total_Visa_Price_In_Curr +=
      newVisaSaleRateOthCur /* Adjust based on your needs */;
    existingSupplierPaymentIn.payment_In_Schema.remaining_Curr +=
      newVisaSaleRateOthCur /* Adjust based on your needs */;
    existingSupplierPaymentIn.payment_In_Schema.remaining_Balance +=
      newVisaSalesRatePKR /* Adjust based on your needs */;
    await existingSupplierPaymentIn.save();
  }
}
          }
     
      // Agnets Sections

      if(reference_In_Name !== undefined &&
        reference_In_Name !== null &&
        reference_In_Name !== "" && ( reference_In.toLowerCase()==='agent' || reference_In.toLowerCase()==='agents')){
// Update the Agent With PaymentIn by removing the person from the persons array
const existingAgentPaymentOut = await Agents.findOne({
  "payment_Out_Schema.supplierName": reference_In_Name,
});
if (existingAgentPaymentOut) {
  let agentOutPersonIndex;
  // Find the index of the person in the persons array
  agentOutPersonIndex =
    existingAgentPaymentOut?.payment_Out_Schema?.persons.findIndex(
      (person) =>
        person.name === name &&
        person.entry_Mode === entry_Mode &&
        person.pp_No === pp_No
    );
  // If the person is found, remove it from the persons array
  if (agentOutPersonIndex !== -1) {
    existingAgentPaymentOut.payment_Out_Schema.persons.splice(
      agentOutPersonIndex,
      1
    );
    existingAgentPaymentOut.payment_Out_Schema.total_Visa_Price_Out_PKR +=
      newVisaPurchaseRatePKR /* Adjust based on your needs */;
    existingAgentPaymentOut.payment_Out_Schema.total_Visa_Price_Out_Curr +=
      newVisaPurchaseRateOthCur /* Adjust based on your needs */;
    existingAgentPaymentOut.payment_Out_Schema.remaining_Curr +=
      newVisaPurchaseRateOthCur /* Adjust based on your needs */;
    existingAgentPaymentOut.payment_Out_Schema.remaining_Balance +=
      newVisaPurchaseRatePKR /* Adjust based on your needs */;
    await existingAgentPaymentOut.save();
  }
}
        }
      

        if(reference_Out_Name !== undefined &&
          reference_Out_Name !== null &&
          reference_Out_Name !== "" && ( reference_Out.toLowerCase()==='agent' || reference_Out.toLowerCase()==='agents')){
// Update the Agent With PaymentIn by removing the person from the persons array
const existingAgentPaymentIn = await Agents.findOne({
  "payment_In_Schema.supplierName": reference_Out_Name,
});
// Find the index of the person in the persons array
if (existingAgentPaymentIn) {
  let agentInPersonIndex;
  agentInPersonIndex =
    existingAgentPaymentIn?.payment_In_Schema?.persons.findIndex(
      (person) =>
        person.name === name &&
        person.entry_Mode === entry_Mode &&
        person.pp_No === pp_No
    );

  // If the person is found, remove it from the persons array
  if (agentInPersonIndex !== -1) {
    existingAgentPaymentIn.payment_In_Schema.persons.splice(
      agentInPersonIndex,
      1
    );
    existingAgentPaymentIn.payment_In_Schema.total_Visa_Price_In_PKR +=
      newVisaSalesRatePKR /* Adjust based on your needs */;
    existingAgentPaymentIn.payment_In_Schema.total_Visa_Price_In_Curr +=
      newVisaSaleRateOthCur /* Adjust based on your needs */;
    existingAgentPaymentIn.payment_In_Schema.remaining_Curr +=
      newVisaSaleRateOthCur /* Adjust based on your needs */;
    existingAgentPaymentIn.payment_In_Schema.remaining_Balance +=
      newVisaSalesRatePKR /* Adjust based on your needs */;
    await existingAgentPaymentIn.save();
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
        // Update the Supplierd With PaymentIn by removing the person from the persons array
        const existingAzadSupplierPaymentOut = await AzadSupplier.findOne({
          "payment_Out_Schema.supplierName":
            azad_Visa_Reference_In_Name,
        });
        if (existingAzadSupplierPaymentOut) {
          let azadSupplierOutPersonIndex;
          // Find the index of the person in the persons array
          azadSupplierOutPersonIndex =
            existingAzadSupplierPaymentOut?.payment_Out_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );

          // If the person is found, remove it from the persons array
          if (azadSupplierOutPersonIndex !== -1) {
            existingAzadSupplierPaymentOut?.payment_Out_Schema?.persons.splice(
              azadSupplierOutPersonIndex,
              1
            );
            existingAzadSupplierPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              newAzad_Visa_Purchase_PKR /* Adjust based on your needs */;
            existingAzadSupplierPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              newAzad_Visa_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingAzadSupplierPaymentOut.payment_Out_Schema.remaining_Curr +=
              newAzad_Visa_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingAzadSupplierPaymentOut.payment_Out_Schema.remaining_Balance +=
              newAzad_Visa_Purchase_PKR /* Adjust based on your needs */;
            await existingAzadSupplierPaymentOut.save();
          }
        }
      }

      if (
        azad_Visa_Reference_Out_Name !== undefined &&
        azad_Visa_Reference_Out_Name !== null &&
        azad_Visa_Reference_Out_Name !== ""
      ) {
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingAzadSupplierPaymentIn = await AzadSupplier.findOne({
          "payment_In_Schema.supplierName":
            azad_Visa_Reference_Out_Name,
        });
        // Find the index of the person in the persons array
        if (existingAzadSupplierPaymentIn) {
          let azadSupplierInPersonIndex;

          azadSupplierInPersonIndex =
            existingAzadSupplierPaymentIn?.payment_In_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );

          // If the person is found, remove it from the persons array
          if (azadSupplierInPersonIndex !== -1) {
            existingAzadSupplierPaymentIn?.payment_In_Schema?.persons.splice(
              azadSupplierInPersonIndex,
              1
            );
            existingAzadSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              newAzad_Visa_Sales_PKR /* Adjust based on your needs */;
            existingAzadSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
              newAzad_Visa_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
            existingAzadSupplierPaymentIn.payment_In_Schema.remaining_Curr +=
              newAzad_Visa_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
            existingAzadSupplierPaymentIn.payment_In_Schema.remaining_Balance +=
              newAzad_Visa_Sales_PKR /* Adjust based on your needs */;
            await existingAzadSupplierPaymentIn.save();
          }
        }
      }

      if (
        azad_Visa_Reference_In_Name !== undefined &&
        azad_Visa_Reference_In_Name !== null &&
        azad_Visa_Reference_In_Name !== ""
      ) {
        // Update the Supplierd With PaymentIn by removing the person from the persons array
        const existingAzadAgentPaymentOut = await AzadAgents.findOne({
          "payment_Out_Schema.supplierName": azad_Visa_Reference_In_Name,
        });
        if (existingAzadAgentPaymentOut) {
          let azadAgentOutPersonIndex;

          // Find the index of the person in the persons array
          azadAgentOutPersonIndex =
            existingAzadAgentPaymentOut?.payment_Out_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          // If the person is found, remove it from the persons array
          if (azadAgentOutPersonIndex !== -1) {
            existingAzadAgentPaymentOut?.payment_Out_Schema?.persons.splice(
              azadAgentOutPersonIndex,
              1
            );
            existingAzadAgentPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              newAzad_Visa_Purchase_PKR /* Adjust based on your needs */;
            existingAzadAgentPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              newAzad_Visa_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingAzadAgentPaymentOut.payment_Out_Schema.remaining_Curr +=
              newAzad_Visa_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingAzadAgentPaymentOut.payment_Out_Schema.remaining_Balance +=
              newAzad_Visa_Purchase_PKR /* Adjust based on your needs */;
            await existingAzadAgentPaymentOut.save();
          }
        }
      }

      if (
        azad_Visa_Reference_Out_Name !== undefined &&
        azad_Visa_Reference_Out_Name !== null &&
        azad_Visa_Reference_Out_Name !== ""
      ) {
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingAzadAgentPaymentIn = await AzadAgents.findOne({
          "payment_In_Schema.supplierName": azad_Visa_Reference_Out_Name,
        });
        // Find the index of the person in the persons array
        if (existingAzadAgentPaymentIn) {
          let azadAgentInPersonIndex;

          azadAgentInPersonIndex =
            existingAzadAgentPaymentIn?.payment_In_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          // If the person is found, remove it from the persons array
          if (azadAgentInPersonIndex !== -1) {
            existingAzadAgentPaymentIn?.payment_In_Schema?.persons.splice(
              azadAgentInPersonIndex,
              1
            );
            existingAzadAgentPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              newAzad_Visa_Sales_PKR /* Adjust based on your needs */;
            existingAzadAgentPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
              newAzad_Visa_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
            existingAzadAgentPaymentIn.payment_In_Schema.remaining_Curr +=
              newAzad_Visa_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
            existingAzadAgentPaymentIn.payment_In_Schema.remaining_Balance +=
              newAzad_Visa_Sales_PKR /* Adjust based on your needs */;
            await existingAzadAgentPaymentIn.save();
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
        const existingTicketSupplierPaymentOut = await TicketSuppliers.findOne({
          "payment_Out_Schema.supplierName": ticket_Reference_In_Name,
        });

        // Find the index of the person in the persons array
        if (existingTicketSupplierPaymentOut) {
          let ticketSupplierOutPersonIndex;

          ticketSupplierOutPersonIndex =
            existingTicketSupplierPaymentOut?.payment_Out_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );

          // If the person is found, remove it from the persons array
          if (ticketSupplierOutPersonIndex !== -1) {
            existingTicketSupplierPaymentOut?.payment_Out_Schema?.persons.splice(
              ticketSupplierOutPersonIndex,
              1
            );
            existingTicketSupplierPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              newTicket_Purchase_PKR /* Adjust based on your needs */;
            existingTicketSupplierPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              newTicket_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingTicketSupplierPaymentOut.payment_Out_Schema.remaining_Curr +=
              newTicket_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingTicketSupplierPaymentOut.payment_Out_Schema.remaining_Balance +=
              newTicket_Purchase_PKR /* Adjust based on your needs */;
            await existingTicketSupplierPaymentOut.save();
          }
        }
      }

      if (
        ticket_Reference_Out_Name !== undefined &&
        ticket_Reference_Out_Name !== null &&
        ticket_Reference_Out_Name !== ""
      ) {
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingTicketSupplierPaymentIn = await TicketSuppliers.findOne({
          "payment_In_Schema.supplierName": ticket_Reference_Out_Name,
        });
        // Find the index of the person in the persons array
        if (existingTicketSupplierPaymentIn) {
          let ticketSupplierInPersonIndex;

          ticketSupplierInPersonIndex =
            existingTicketSupplierPaymentIn?.payment_In_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );

          // If the person is found, remove it from the persons array
          if (ticketSupplierInPersonIndex !== -1) {
            existingTicketSupplierPaymentIn?.payment_In_Schema?.persons.splice(
              ticketSupplierInPersonIndex,
              1
            );
            existingTicketSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              newTicket_Sales_PKR /* Adjust based on your needs */;
            existingTicketSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
              newTicket_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
            existingTicketSupplierPaymentIn.payment_In_Schema.remaining_Curr +=
              newTicket_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
            existingTicketSupplierPaymentIn.payment_In_Schema.remaining_Balance +=
              newTicket_Sales_PKR /* Adjust based on your needs */;
            await existingTicketSupplierPaymentIn.save();
          }
        }
      }

      if (
        ticket_Reference_In_Name !== undefined &&
        ticket_Reference_In_Name !== null &&
        ticket_Reference_In_Name !== ""
      ) {
        // Update the Supplierd With PaymentIn by removing the person from the persons array
        const existingTicketAgentPaymentOut = await TicketAgents.findOne({
          "payment_Out_Schema.supplierName": ticket_Reference_In_Name,
        });
        // Find the index of the person in the persons array
        if (existingTicketAgentPaymentOut) {
          let ticketAgentOutPersonIndex;

          ticketAgentOutPersonIndex =
            existingTicketAgentPaymentOut?.payment_Out_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );

          // If the person is found, remove it from the persons array
          if (ticketAgentOutPersonIndex !== -1) {
            existingTicketAgentPaymentOut?.payment_Out_Schema?.persons.splice(
              ticketAgentOutPersonIndex,
              1
            );
            existingTicketAgentPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              newTicket_Purchase_PKR /* Adjust based on your needs */;
            existingTicketAgentPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              newTicket_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingTicketAgentPaymentOut.payment_Out_Schema.remaining_Curr +=
              newTicket_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingTicketAgentPaymentOut.payment_Out_Schema.remaining_Balance +=
              newTicket_Purchase_PKR /* Adjust based on your needs */;
            await existingTicketAgentPaymentOut.save();
          }
        }
      }

      if (
        ticket_Reference_Out_Name !== undefined &&
        ticket_Reference_Out_Name !== null &&
        ticket_Reference_Out_Name !== ""
      ) {
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingTicketAgentPaymentIn = await TicketAgents.findOne({
          "payment_In_Schema.supplierName": ticket_Reference_Out_Name,
        });
        // Find the index of the person in the persons array
        if (existingTicketAgentPaymentIn) {
          let ticketAgentInPersonIndex;

          ticketAgentInPersonIndex =
            existingTicketAgentPaymentIn?.payment_In_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );

          // If the person is found, remove it from the persons array
          if (ticketAgentInPersonIndex !== -1) {
            existingTicketAgentPaymentIn?.payment_In_Schema?.persons.splice(
              ticketAgentInPersonIndex,
              1
            );
            existingTicketAgentPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              newTicket_Sales_PKR /* Adjust based on your needs */;
            existingTicketAgentPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
              newTicket_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
            existingTicketAgentPaymentIn.payment_In_Schema.remaining_Curr +=
              newTicket_Sales_Rate_Oth_Cur /* Adjust based on your needs */;
            existingTicketAgentPaymentIn.payment_In_Schema.remaining_Balance +=
              newTicket_Sales_PKR /* Adjust based on your needs */;
            await existingTicketAgentPaymentIn.save();
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
        const existingVisitSupplierPaymentOut = await VisitSuppliers.findOne({
          "payment_Out_Schema.supplierName": visit_Reference_In_Name,
        });

        // Find the index of the person in the persons array
        if (existingVisitSupplierPaymentOut) {
          let visitSupplierOutPersonIndex;

          visitSupplierOutPersonIndex =
            existingVisitSupplierPaymentOut?.payment_Out_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          // If the person is found, remove it from the persons array
          if (visitSupplierOutPersonIndex !== -1) {
            existingVisitSupplierPaymentOut?.payment_Out_Schema?.persons.splice(
              visitSupplierOutPersonIndex,
              1
            );
            existingVisitSupplierPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              newVisit_Purchase_PKR /* Adjust based on your needs */;
            existingVisitSupplierPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              newVisit_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingVisitSupplierPaymentOut.payment_Out_Schema.remaining_Curr +=
              newVisit_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingVisitSupplierPaymentOut.payment_Out_Schema.remaining_Balance +=
              newVisit_Purchase_PKR /* Adjust based on your needs */;
            await existingVisitSupplierPaymentOut.save();
          }
        }
      }

      if (
        visit_Reference_Out_Name !== undefined &&
        visit_Reference_Out_Name !== null &&
        visit_Reference_Out_Name !== ""
      ) {
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingVisitSupplierPaymentIn = await VisitSuppliers.findOne({
          "payment_In_Schema.supplierName": visit_Reference_Out_Name,
        });
        // Find the index of the person in the persons array
        if (existingVisitSupplierPaymentIn) {
          let visitSupplierInPersonIndex;

          visitSupplierInPersonIndex =
            existingVisitSupplierPaymentIn?.payment_In_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );

          // If the person is found, remove it from the persons array
          if (visitSupplierInPersonIndex !== -1) {
            existingVisitSupplierPaymentIn?.payment_In_Schema?.persons.splice(
              visitSupplierInPersonIndex,
              1
            );
            existingVisitSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              newVisit_Sales_PKR /* Adjust based on your needs */;
            existingVisitSupplierPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
              newVisit_Sales_Rate_Oth_Curr /* Adjust based on your needs */;
            existingVisitSupplierPaymentIn.payment_In_Schema.remaining_Curr +=
              newVisit_Sales_Rate_Oth_Curr /* Adjust based on your needs */;
            existingVisitSupplierPaymentIn.payment_In_Schema.remaining_Balance +=
              newVisit_Sales_PKR /* Adjust based on your needs */;
            await existingVisitSupplierPaymentIn.save();
          }
        }
      }

      if (
        visit_Reference_In_Name !== undefined &&
        visit_Reference_In_Name !== null &&
        visit_Reference_In_Name !== ""
      ) {
        // Update the Supplierd With PaymentIn by removing the person from the persons array
        const existingVisitAgentPaymentOut = await VisitAgents.findOne({
          "payment_Out_Schema.supplierName": visit_Reference_In_Name,
        });
        // Find the index of the person in the persons array
        if (existingVisitAgentPaymentOut) {
          let visitAgentOutPersonIndex;

          visitAgentOutPersonIndex =
            existingVisitAgentPaymentOut?.payment_Out_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );

          // If the person is found, remove it from the persons array
          if (visitAgentOutPersonIndex !== -1) {
            existingVisitAgentPaymentOut?.payment_Out_Schema?.persons.splice(
              visitAgentOutPersonIndex,
              1
            );
            existingVisitAgentPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_PKR +=
              newVisit_Purchase_PKR /* Adjust based on your needs */;
            existingVisitAgentPaymentOut.payment_Out_Schema.total_Azad_Visa_Price_Out_Curr +=
              newVisit_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingVisitAgentPaymentOut.payment_Out_Schema.remaining_Curr +=
              newVisit_Purchase_Rate_Oth_Cur /* Adjust based on your needs */;
            existingVisitAgentPaymentOut.payment_Out_Schema.remaining_Balance +=
              newVisit_Purchase_PKR /* Adjust based on your needs */;
            await existingVisitAgentPaymentOut.save();
          }
        }
      }

      if (
        visit_Reference_Out_Name !== undefined &&
        visit_Reference_Out_Name !== null &&
        visit_Reference_Out_Name !== ""
      ) {
        // Update the Agent With PaymentIn by removing the person from the persons array
        const existingVisitAgentPaymentIn = await VisitAgents.findOne({
          "payment_In_Schema.supplierName": visit_Reference_Out_Name,
        });
        // Find the index of the person in the persons array
        if (existingVisitAgentPaymentIn) {
          let visitAgentInPersonIndex;

          visitAgentInPersonIndex =
            existingVisitAgentPaymentIn?.payment_In_Schema?.persons.findIndex(
              (person) =>
                person.name === name &&
                person.entry_Mode === entry_Mode &&
                person.pp_No === pp_No
            );
          // If the person is found, remove it from the persons array
          if (visitAgentInPersonIndex !== -1) {
            existingVisitAgentPaymentIn?.payment_In_Schema?.persons.splice(
              visitAgentInPersonIndex,
              1
            );
            existingVisitAgentPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_PKR +=
              newVisit_Sales_PKR /* Adjust based on your needs */;
            existingVisitAgentPaymentIn.payment_In_Schema.total_Azad_Visa_Price_In_Curr +=
              newVisit_Sales_Rate_Oth_Curr /* Adjust based on your needs */;
            existingVisitAgentPaymentIn.payment_In_Schema.remaining_Curr +=
              newVisit_Sales_Rate_Oth_Curr /* Adjust based on your needs */;
            existingVisitAgentPaymentIn.payment_In_Schema.remaining_Balance +=
              newVisit_Sales_PKR /* Adjust based on your needs */;
            await existingVisitAgentPaymentIn.save();
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
      // Update the Agent With PaymentIn by removing the person from the persons array
      const existingProtectorPaymentOut = await Protector.findOne({
        "payment_Out_Schema.supplierName": reference_In_Name,
      });

      // Find the index of the person in the persons array
      if (existingProtectorPaymentOut) {
        let protectorOutPersonIndex;

        protectorOutPersonIndex =
          existingProtectorPaymentOut?.payment_Out_Schema?.persons.findIndex(
            (person) =>
              person.name === name &&
              person.entry_Mode === entry_Mode &&
              person.pp_No === pp_No
          );
        // If the person is found, remove it from the persons array
        if (protectorOutPersonIndex !== -1) {
          existingProtectorPaymentOut?.payment_Out_Schema?.persons.splice(
            protectorOutPersonIndex,
            1
          );
          existingProtectorPaymentOut.payment_Out_Schema.total_Protector_Price_Out_PKR +=
            newProtectorPriceIn /* Adjust based on your needs */;
          existingProtectorPaymentOut.payment_Out_Schema.total_Protector_Price_Out_Curr +=
            newProtector_Price_In_Oth_Cur /* Adjust based on your needs */;
          existingProtectorPaymentOut.payment_Out_Schema.remaining_Curr +=
            newProtector_Price_In_Oth_Cur /* Adjust based on your needs */;
          existingProtectorPaymentOut.payment_Out_Schema.remaining_Balance +=
            newProtectorPriceIn /* Adjust based on your needs */;
          await existingProtectorPaymentOut.save();
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
};

// Updating a single Entry
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
      const {
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
        console.log('Yes Ticket',final_Status)
        const newReminder = new Reminders({
          type: "Ticket",
          content: `${name}'s Final Status is updated to Ticket.`,
          date: new Date().toISOString().split("T")[0]
        });
        await newReminder.save();
      }

      if (picture) {
        try {
          const uploadPicture = await cloudinary.uploader.upload(picture, {
            upload_preset: "rozgar",
          });
          if (!uploadPicture) {
            return res
              .status(500)
              .json({ message: "Error uploading the main picture" });
          }
          entryToUpdate.picture = uploadPicture.secure_url;
        } catch (uploadError) {
          console.error(uploadError);
          return res
            .status(500)
            .json({ message: "Error uploading the main picture" });
        }
      }
      if (visit_Section_Picture) {
        try {
          const uploadPicture = await cloudinary.uploader.upload(
            visit_Section_Picture,
            {
              upload_preset: "rozgar",
            }
          );
          if (!uploadPicture) {
            return res
              .status(500)
              .json({ message: "Error uploading Visit Section Picture" });
          }
          entryToUpdate.visit_Section_Picture = uploadPicture.secure_url;
        } catch (uploadError) {
          console.error(uploadError);
          return res
            .status(500)
            .json({ message: "Error uploading Visit Section Picture" });
        }
      }
      if (ticket_Section_Picture) {
        try {
          const uploadPicture = await cloudinary.uploader.upload(
            ticket_Section_Picture,
            {
              upload_preset: "rozgar",
            }
          );
          if (!uploadPicture) {
            return res
              .status(500)
              .json({ message: "Error uploading Visit Section Picture" });
          }
          entryToUpdate.ticket_Section_Picture = uploadPicture.secure_url;
        } catch (uploadError) {
          console.error(uploadError);
          return res
            .status(500)
            .json({ message: "Error uploading Visit Section Picture" });
        }
      }
      if (azad_Visa_Section_Picture) {
        try {
          const uploadPicture = await cloudinary.uploader.upload(
            azad_Visa_Section_Picture,
            {
              upload_preset: "rozgar",
            }
          );
          if (!uploadPicture) {
            return res
              .status(500)
              .json({ message: "Error uploading Visit Section Picture" });
          }
          entryToUpdate.azad_Visa_Section_Picture = uploadPicture.secure_url;
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
              persons: [
                {
                  name,
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
        const existingPaymentOutSupplier = await Agents.findOne({
          "payment_Out_Schema.supplierName": reference_In_Name,
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
              persons: [
                {
                  name,
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


      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "supplier" && reference_In.toLowerCase() === "candidate") {

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
              persons: [
                {
                  name,
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
              persons: [
                {
                  name,
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


      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "agent" && reference_In.toLowerCase() === "candidate") {

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
      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "candidate" && reference_In.toLowerCase() === "candidate" && entryToUpdate.reference_In_Name === reference_In_Name) {

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

      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "candidate" && reference_In.toLowerCase() === "supplier") {
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
              persons: [
                {
                  name,
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


      if (entryToUpdate.reference_In && entryToUpdate.reference_In.toLowerCase() === "candidate" && reference_In.toLowerCase() === "agent") {
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
              persons: [
                {
                  name,
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
              persons: [
                {
                  name,
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
              persons: [
                {
                  name,
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


      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "supplier" && reference_Out.toLowerCase() === "candidate") {
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
              persons: [
                {
                  name,
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
              persons: [
                {
                  name,
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


      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "agent" && reference_Out.toLowerCase() === "candidate") {
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
      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "candidate" && reference_Out.toLowerCase() === "candidate" && entryToUpdate.reference_Out_Name === reference_Out_Name) {

        // Check if the supplier with the given name and entry mode exists
        const existingPaymentInCandidate = await Candidate.findOne({
          "payment_In_Schema.supplierName": entryToUpdate.name,
          "payment_In_Schema.entry_Mode": entryToUpdate.entry_Mode,
          "payment_In_Schema.pp_No": entryToUpdate.pp_No,
        });

        if (existingPaymentInCandidate) {
          existingPaymentInCandidate.payment_In_Schema.supplierName = name,
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


      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "candidate" && reference_Out.toLowerCase() === "supplier") {
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
              persons: [
                {
                  name,
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


      if (entryToUpdate.reference_Out && entryToUpdate.reference_Out.toLowerCase() === "candidate" && reference_Out.toLowerCase() === "agent") {
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
              persons: [
                {
                  name,
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

      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "supplier" && azad_Visa_Reference_In.toLowerCase() === "supplier" && entryToUpdate.azad_Visa_Reference_In !== azad_Visa_Reference_In) {

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
              entryToUpdate.azad_Visa_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.azad_Visa_Reference_In_Name,
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
              persons: [
                {
                  name,
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

      if (entryToUpdate.azad_Visa_Reference_In && entryToUpdate.azad_Visa_Reference_In.toLowerCase() === "agent" && azad_Visa_Reference_In.toLowerCase() === "agent" && entryToUpdate.azad_Visa_Reference_In !== azad_Visa_Reference_In) {

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
              entryToUpdate.azad_Visa_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.azad_Visa_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.azad_Visa_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.azad_Visa_Reference_In_Name,
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
              persons: [
                {
                  name,
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

      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "supplier" && azad_Visa_Reference_Out.toLowerCase() === "supplier" && entryToUpdate.azad_Visa_Reference_Out !== azad_Visa_Reference_Out) {

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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadSupplier.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.azad_Visa_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.azad_Visa_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

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

      if (entryToUpdate.azad_Visa_Reference_Out && entryToUpdate.azad_Visa_Reference_Out.toLowerCase() === "agent" && azad_Visa_Reference_Out.toLowerCase() === "agent" && entryToUpdate.azad_Visa_Reference_Out !== azad_Visa_Reference_Out) {

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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.azad_Visa_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await AzadSupplier.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.azad_Visa_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

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
              entryToUpdate.azad_Visa_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.azad_Visa_Reference_Out_Name,
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
              persons: [
                {
                  name,
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

      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "supplier" && ticket_Reference_In.toLowerCase() === "supplier" && entryToUpdate.ticket_Reference_In !== ticket_Reference_In) {

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
              entryToUpdate.ticket_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.ticket_Reference_In_Name,
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
              persons: [
                {
                  name,
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

      if (entryToUpdate.ticket_Reference_In && entryToUpdate.ticket_Reference_In.toLowerCase() === "agent" && ticket_Reference_In.toLowerCase() === "agent" && entryToUpdate.ticket_Reference_In !== ticket_Reference_In) {

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
              entryToUpdate.ticket_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.ticket_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.ticket_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.ticket_Reference_In_Name,
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
              persons: [
                {
                  name,
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

      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "supplier" && ticket_Reference_Out.toLowerCase() === "supplier" && entryToUpdate.ticket_Reference_Out !== ticket_Reference_Out) {

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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketSuppliers.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.ticket_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.ticket_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

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

      if (entryToUpdate.ticket_Reference_Out && entryToUpdate.ticket_Reference_Out.toLowerCase() === "agent" && ticket_Reference_Out.toLowerCase() === "agent" && entryToUpdate.ticket_Reference_Out !== ticket_Reference_Out) {

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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.ticket_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await TicketSuppliers.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.ticket_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

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
              entryToUpdate.ticket_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.ticket_Reference_Out_Name,
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
              persons: [
                {
                  name,
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

      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "supplier" && visit_Reference_In.toLowerCase() === "supplier" && entryToUpdate.visit_Reference_In !== visit_Reference_In) {

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
              entryToUpdate.visit_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.visit_Reference_In_Name,
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
              persons: [
                {
                  name,
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

      if (entryToUpdate.visit_Reference_In && entryToUpdate.visit_Reference_In.toLowerCase() === "agent" && visit_Reference_In.toLowerCase() === "agent" && entryToUpdate.visit_Reference_In !== visit_Reference_In) {

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
              entryToUpdate.visit_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.visit_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.visit_Reference_In_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.visit_Reference_In_Name,
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
              persons: [
                {
                  name,
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

      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "supplier" && visit_Reference_Out.toLowerCase() === "supplier" && entryToUpdate.visit_Reference_Out !== visit_Reference_Out) {

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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitSuppliers.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.visit_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.visit_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

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

      if (entryToUpdate.visit_Reference_Out && entryToUpdate.visit_Reference_Out.toLowerCase() === "agent" && visit_Reference_Out.toLowerCase() === "agent" && entryToUpdate.visit_Reference_Out !== visit_Reference_Out) {

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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }

        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitAgents.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.visit_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

            // Save the changes
            await existingSupplierPaymentIn.save();
          }
        }


        // Check if the supplier with the given name exists
        const existingPaymentOutAzadSupplier = await VisitSuppliers.findOne(
          {
            "payment_In_Schema.supplierName":
              entryToUpdate.visit_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              personToUpdate.azad_Visa_Price_Out_Curr || 0;
            existingSupplierPaymentIn.payment_In_Schema.remaining_Curr -=
              personToUpdate.azad_Visa_Price_Out_Curr || 0;

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
              entryToUpdate.visit_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
              entryToUpdate.visit_Reference_Out_Name,
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
              persons: [
                {
                  name,
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
            supplierInPersonIndex.contact = contact;

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

      if (entryToUpdate.protector_Reference_In && entryToUpdate.protector_Reference_In.toLowerCase() === "supplier" && protector_Reference_In.toLowerCase() === "supplier" && entryToUpdate.protector_Reference_In_Name !== protector_Reference_In_Name) {
        // Update the Agent With PaymentIn by removing the person from the persons array
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
              persons: [
                {
                  name,
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

module.exports = {
  addEntry,
  getEntry,
  delEntry,
  updateEntry,
  addMultipleEnteries,
}
