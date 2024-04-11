import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/userHooks/UserAuthHook";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import CategoryHook from "../hooks/settingHooks/CategoryHook";
import PaymentViaHook from "../hooks/settingHooks/PaymentViaHook";
import PaymentTypeHook from "../hooks/settingHooks/PaymentTypeHook";
import CurrCountryHook from "../hooks/settingHooks/CurrCountryHook";
import AgentHook from '../hooks/agentHooks/AgentHook';
import AzadVisaHook from '../hooks/azadVisaHooks/AzadVisaHooks'
import CandidateHook from '../hooks/candidateHooks/CandidateHook'
import SupplierHook from '../hooks/supplierHooks/SupplierHook'
import TicketHook from '../hooks/ticketHooks/TicketHook'
import VisitHook from '../hooks/visitsHooks/VisitHook'
import CashInHandHook from '../hooks/cashInHandHooks/CashInHandHook'

// import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function DirectPaymentOut() {
  const dispatch = useDispatch();
  // getting data from redux store
  const currCountries = useSelector((state) => state.setting.currCountries);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);


  const agent_Payments_Out = useSelector((state) => state.agents.agent_Payments_Out);
  const supp_Payments_Out = useSelector((state) => state.suppliers.supp_Payments_Out);
  const candidate_Payments_Out = useSelector((state) => state.candidates.candidate_Payments_Out);

//   AzadVisa
  const azadAgent_Payments_Out = useSelector((state) => state.azadVisa.azadAgent_Payments_Out);
  const azadSupplier_Payments_Out = useSelector((state) => state.azadVisa.azadSupplier_Payments_Out);
  const azadCand_Payments_Out = useSelector((state) => state.azadVisa.azadCand_Payments_Out);

//   Ticket Visa
const ticketAgent_Payments_Out = useSelector((state) => state.tickets.ticketAgent_Payments_Out);
const ticketSupplier_Payments_Out = useSelector((state) => state.tickets.ticketSupplier_Payments_Out);
const ticketCand_Payments_Out = useSelector((state) => state.tickets.ticketCand_Payments_Out);

// Visit Visa
const visitAgent_Payments_Out = useSelector((state) => state.visits.visitAgent_Payments_Out);
const visitSupplier_Payments_Out = useSelector((state) => state.visits.visitSupplier_Payments_Out);
const visitCand_Payments_Out = useSelector((state) => state.visits.visitCand_Payments_Out);


const { getCurrCountryData } = CurrCountryHook();
const { getCategoryData } = CategoryHook();
const { getPaymentViaData } = PaymentViaHook();
const { getPaymentTypeData } = PaymentTypeHook();

const { getPaymentsOut } = AgentHook();
const { getAzadAgentPaymentsOut,getAzadSupplierPaymentsOut,getAzadCandPaymentsOut } = AzadVisaHook();
const {getCandPaymentsOut } = CandidateHook();
const { getSupplierPaymentsOut } = SupplierHook();
const { getTicketAgentPaymentsOut,getTicketSupplierPaymentsOut,getTicketCandPaymentsOut } = TicketHook();
const { getVisitAgentPaymentsOut,getVisitSupplierPaymentsOut,getVisitCandPaymentsOut } = VisitHook()

const { getOverAllPayments, overAllPayments } = CashInHandHook()

const [option, setOption] = useState(false);
// Form input States
const [ref, setRef] = useState("");

const [supplierName, setSupplierName] = useState("");
const [category, setCategory] = useState("");
const [payment_Via, setPayment_Via] = useState("");
const [payment_Type, setPayment_Type] = useState("");
const [slip_No, setSlip_No] = useState("");
const [payment_Out, setPayment_Out] = useState();
const [slip_Pic, setSlip_Pic] = useState("");
const [details, setDetails] = useState("");
const [curr_Country, setCurr_Country] = useState("");
const [curr_Rate, setCurr_Rate] = useState();
// const [open, setOpen] = useState(true);
// const [close, setClose] = useState(false);
const [cand_Name, setCand_Name] = useState("");
const [date, setDate] = useState("");
let curr_Amount = payment_Out / curr_Rate;

const [selectedSupplier, setSelectedSupplier] = useState("");
const [supplierNames, setSupplierNames] = useState([]);
const [selectedPersonDetails, setSelectedPersonDetails] = useState({});
// getting Data from DB
const { user } = useAuthContext();
const fetchData = async () => {
  try {
    // Use Promise.all to execute all promises concurrently
    await Promise.all([
      getOverAllPayments(),
      getCurrCountryData(),
      getCategoryData(),
      getPaymentViaData(),
      getPaymentTypeData(),
      getPaymentsOut(),
      getAzadAgentPaymentsOut(),
      getAzadSupplierPaymentsOut(),
      getAzadCandPaymentsOut(),
      getCandPaymentsOut(),
      getSupplierPaymentsOut(),
      getTicketAgentPaymentsOut(),
      getTicketSupplierPaymentsOut(),
      getTicketCandPaymentsOut(),
      getVisitAgentPaymentsOut(),
      getVisitSupplierPaymentsOut(),
      getVisitCandPaymentsOut()

    ]);
  } catch (error) { }
};

useEffect(() => {
  fetchData();
}, [user, dispatch,selectedSupplier,supplierNames,selectedPersonDetails,cand_Name]);

useEffect(() => {
  // Reset the cand_Name state when the ref value changes
  setCand_Name("");
}, [ref]);

  const printPersonsTable = () => {
    // Convert JSX to HTML string
    const printContentString = `
    <table class='print-table'>
      <thead>
        <tr>
        <th>Date</th>
        <th>Name</th>
        <th>PP#</th>
        <th>Entry_Mode</th>
        <th>Company</th>
        <th>Trade</th>
        <th>Country</th>
        <th>Final tatus</th>
        <th>Flight Date</th>
        <th>VPI PKR</th>
        <th>Total In PKR</th>
        <th>Remaining PKR</th>
        <th>VPI Oth Curr</th>
        <th>Remaining Curr</th>
        
        </tr>
      </thead>
      <tbody>
     
          <tr>
            <td>${String(selectedPersonDetails?.entry_Date)}</td>
            <td>${String(selectedPersonDetails?.name)}</td>
            <td>${String(selectedPersonDetails?.pp_No)}</td>
            <td>${String(selectedPersonDetails?.entry_Mode)}</td>
            <td>${String(selectedPersonDetails?.company)}</td>
            <td>${String(selectedPersonDetails?.trade)}</td>
            <td>${String(selectedPersonDetails?.country)}</td>
            <td>${String(selectedPersonDetails?.final_Status)}</td>
            <td>${String(selectedPersonDetails?.flight_Date)}</td>
            <td>${String(selectedPersonDetails?.visa_Price_In_PKR)}</td>
            <td>${String(selectedPersonDetails?.total_In)}</td>
            <td>${String(
      (selectedPersonDetails?.visa_Price_In_PKR - selectedPersonDetails?.total_In) +
      selectedPersonDetails?.cash_Out
    )}</td>
            <td>${String(selectedPersonDetails?.visa_Price_In_Curr)}</td>
            <td>${String(selectedPersonDetails?.remaining_Curr)}</td>

          </tr>
      
    
    </tbody>
    </table>
    <style>
      /* Add your custom print styles here */
      body {
        background-color: #fff;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .print-table th, .print-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .print-table th {
        background-color: #f2f2f2;
      }
    </style>
  `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Write the print content to the new window
      printWindow.document.write(`
      <html>
        <head>
          <title>${selectedPersonDetails.name} Details</title>
        </head>
        <body class='bg-dark'>${printContentString}</body>
      </html>
    `);

      // Trigger print dialog
      printWindow.print();
      // Close the new window after printing
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    } else {
      // Handle if the new window cannot be opened
      alert('Could not open print window. Please check your browser settings.');
    }
  }
  const handleOpen = () => {
    setOption(!option);
  };

  const [section, setSection] = useState(false);

  const handleSection = () => {
    setSection(!section);
    setCurr_Country("");
    setCurr_Rate("");
  };

  // handle Picture

  const handleImage = (e) => {
    const file = e.target.files[0];
    TransformFile(file);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds the 5MB limit. Please select a smaller file.");
      } else {
        TransformFile(file);
      }
    } else {
      alert("No file selected.");
    }
  };

  const TransformFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSlip_Pic(reader.result);
      };
    } else {
      setSlip_Pic("");
    }
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  // Submitting Form Data
  const [loading, setLoading] = useState(null);
  const [, setNewMessage] = useState("");
  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/direct/payment_out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ref,
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_Out,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          date,
          cand_Name,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading(false);
      }
      if (response.ok) {
      getOverAllPayments()
        setNewMessage(toast.success(json.message));
        getPaymentsOut();
        setLoading(false);
        setSupplierName("");
        setCategory("");
        setPayment_Via("");
        setPayment_Type("");
        setSlip_No("");
        setPayment_Out("");
        setSlip_Pic("");
        setDetails("");
        setCurr_Country("");
        setCurr_Rate("");
        setDate("");
        setCand_Name("");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setNewMessage(toast.error("Server is not Responding..."));
      setLoading(false);
    }
  };

  // Update the state when the cand_Name value changes
  const handlePersonChange = (selectedPersonName) => {
    // Find the selected person in the persons array of the selected supplier
    if(ref==="Agent Cand-Vise"){
      const selectedAgentData = agent_Payments_Out.find(
        (data) => data.supplierName === selectedSupplier
      )
      
      if (selectedAgentData) {
        const selectedPerson = selectedAgentData.persons.find(
          (person) => person.name === selectedPersonName
        )
        // Update the state with the details of the selected person
        setSelectedPersonDetails(selectedPerson || {});
      } 
      else {
        // If selectedSupplierData is not found, reset the person details state
        setSelectedPersonDetails({});
      }
    }
    if(ref==="Supplier Cand-Vise"){
      const selectedSupplierData = supp_Payments_Out.find(
        (data) => data.supplierName === selectedSupplier
      )
      
      if (selectedSupplierData) {
        const selectedPerson = selectedSupplierData.persons.find(
          (person) => person.name === selectedPersonName
        )
        // Update the state with the details of the selected person
        setSelectedPersonDetails(selectedPerson || {});
      } 
      else {
        // If selectedSupplierData is not found, reset the person details state
        setSelectedPersonDetails({});
      }
    }
  }

  const currentDate = new Date().toISOString().split('T')[0];


  const collapsed = useSelector((state) => state.collapsed.collapsed);
  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>

    <div className='container-fluid payment_form' >
<div className='row payment_details'>
<Paper className="col-md-12 py-3 mb-1 px-2 detail_table">
        {!option && (
         
         <form className="py-3 px-2" onSubmit={handleForm}>
              <div className="d-flex justify-content-between">
                <div className="left">
                  <h4>Direct Payment OUT</h4>
                </div>
                <div className="right ">
                  <div className="text-end ">
                  <span className="btn submit_btn m-1 py-2 px-3 bg-danger border-0">Today : <i className="fas fa-arrow-up me-1 ms-2"></i>{overAllPayments &&  overAllPayments.length > 0 &&
                              overAllPayments
                                .filter(entry => entry.date===currentDate)
                                .reduce((total, entry) => {
                                  return total + (entry.payment_Out || 0);
                                }, 0)}</span>
                <button className="btn submit_btn m-1" disabled={loading}>
                  {loading ? "Adding..." : "Add Payment"}
                </button>
              </div>
                </div>
              </div>
              <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="label border">Reference_Type</TableCell>
                    <TableCell className="label border">Name</TableCell>
                    <TableCell className="label border">Category</TableCell>
                    <TableCell className="label border">Payment_Via</TableCell>
                    <TableCell className="label border">Payment_Type</TableCell>
                    <TableCell className="label border">Slip_No</TableCell>
                    <TableCell className="label border">Payment_Out </TableCell>
                    <TableCell className="label border">Date</TableCell>
                    {(ref==="Agent Cand-Vise" || ref==="Supplier Cand-Vise") &&  <TableCell className="label border">Candidate</TableCell>}
                    <TableCell className="label border">Details</TableCell>
                    <TableCell className="label border">Curr_Country</TableCell>
                    <TableCell className="label border">Curr_Rate</TableCell>
                    <TableCell className="label border">Curr_Amount</TableCell>
                    <TableCell className="label border">Upload_Slip</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className="border data_td p-1">
                      <select name="" id="" value={ref} onChange={(e)=>setRef(e.target.value)}>
                        <option value="">Select Reference</option>
                        <option value="Agent">Agent</option>
                        <option value="Agent Cand-Vise">Agent Cand-Vise</option>
                        <option value="Supplier">Supplier</option>
                        <option value="Supplier Cand-Vise">Supplier Cand-Vise</option>
                        <option value="Candidate">Candidate</option>
                        <option value="Ticket Supplier">Ticket Supplier</option>
                        <option value="Ticket Agent">Ticket Agent</option>
                        <option value="Ticket Candidate">Ticket Candidate</option>
                        <option value="Visit Supplier">Visit Supplier</option>
                        <option value="Visit Agent">Visit Agent</option>
                        <option value="Visit Candidate">Visit Candidate</option>
                        <option value="Azad Supplier">Azad Supplier</option>
                        <option value="Azad Agent">Azad Agent</option>
                        <option value="Azad Candidate">Azad Candidate</option>

                      </select>
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <select
                    required
                    value={supplierName}

                    onChange={(e) => {
                      const selectedSupplierValue = e.target.value;

                      if (selectedSupplierValue === "") {
                        // User selected "Choose Supplier", reset both values
                        setSelectedSupplier("");
                        setSupplierName("");
                        setSupplierNames([]); // Reset the names of persons array
                      } else {
                        // User selected an actual supplier
                        setSelectedSupplier(selectedSupplierValue);
                        setSupplierName(selectedSupplierValue);

                       if(ref==="Agent Cand-Vise"){
                         
                        const selectedAgentData = agent_Payments_Out.find(
                          (data) => data.supplierName === selectedSupplierValue
                        );

                        // Update the supplierNames state with the names of persons array of the selected supplier
                        if (selectedAgentData) {
                          const namesOfPersons =
                          selectedAgentData.persons || [];
                          setSupplierNames(namesOfPersons);
                        }
                       }
                       if(ref==="Supplier Cand-Vise"){
                         
                        const selectedSupplierData = supp_Payments_Out.find(
                          (data) => data.supplierName === selectedSupplierValue
                        );

                        // Update the supplierNames state with the names of persons array of the selected supplier
                        if (selectedSupplierData) {
                          const namesOfPersons =
                          selectedSupplierData.persons || [];
                          setSupplierNames(namesOfPersons);
                        }
                       }
                      }
                    }}
                  >
                   {(ref==="Agent" || ref==="Agent Cand-Vise") && <>
                   <option value="">Choose Agent</option>
                    {agent_Payments_Out &&
                      agent_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}
                   {(ref==="Supplier" || ref==="Supplier Cand-Vise") && <>
                   <option value="">Choose Supplier</option>
                    {supp_Payments_Out &&
                      supp_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}
                   {(ref==="Candidate") && <>
                   <option value="">Choose Candidate</option>
                    {candidate_Payments_Out &&
                      candidate_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}
                   {(ref==="Ticket Supplier") && <>
                   <option value="">Choose Ticket Supplier</option>
                    {ticketSupplier_Payments_Out &&
                      ticketSupplier_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}
                   {(ref==="Ticket Agent") && <>
                   <option value="">Choose Ticket Agent</option>
                    {ticketAgent_Payments_Out &&
                      ticketAgent_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}
                   {(ref==="Ticket Candidate") && <>
                   <option value="">Choose Ticket Candidate</option>
                    {ticketCand_Payments_Out &&
                      ticketCand_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}

                   {(ref==="Visit Supplier") && <>
                   <option value="">Choose Visit Supplier</option>
                    {visitSupplier_Payments_Out &&
                      visitSupplier_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}
                   {(ref==="Visit Agent") && <>
                   <option value="">Choose Visit Agent</option>
                    {visitAgent_Payments_Out &&
                      visitAgent_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}
                   {(ref==="Visit Candidate") && <>
                   <option value="">Choose Visit Candidate</option>
                    {visitCand_Payments_Out &&
                      visitCand_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}

                   {(ref==="Azad Supplier") && <>
                   <option value="">Choose Azad Supplier</option>
                    {azadSupplier_Payments_Out &&
                      azadSupplier_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}
                   {(ref==="Azad Agent") && <>
                   <option value="">Choose Azad Agent</option>
                    {azadAgent_Payments_Out &&
                      azadAgent_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}
                   {(ref==="Azad Candidate") && <>
                   <option value="">Choose Azad Candidate</option>
                    {azadCand_Payments_Out &&
                      azadCand_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                   </>}
                   
                  </select>
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Choose</option>
                    {categories &&
                      categories.map((data) => (
                        <option key={data._id} value={data.category}>
                          {data.category}
                        </option>
                      ))}
                  </select>
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <select
                    value={payment_Via}
                    onChange={(e) => setPayment_Via(e.target.value)}
                    required
                  >
                    <option value="">Choose</option>
                    {paymentVia &&
                      paymentVia.map((data) => (
                        <option key={data._id} value={data.payment_Via}>
                          {data.payment_Via}
                        </option>
                      ))}
                  </select>
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <select
                    value={payment_Type}
                    onChange={(e) => setPayment_Type(e.target.value)}
                    required
                  >
                    <option value="">Choose</option>
                    {paymentType &&
                      paymentType.map((data) => (
                        <option key={data._id} value={data.payment_Type}>
                          {data.payment_Type}
                        </option>
                      ))}
                  </select>
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <input
                    type="text"
                    value={slip_No}
                    onChange={(e) => setSlip_No(e.target.value)}
                  />
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <input
                    type="number"
                    min="0"
                    value={payment_Out}
                    onChange={(e) => setPayment_Out(e.target.value)}
                    required
                  />
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                    </TableCell>
                    {(ref==="Agent Cand-Vise" || ref==="Supplier Cand-Vise") && <>
                    <TableCell className="border data_td p-1">
                    <select
                    value={cand_Name}
                    onChange={(e) => {
                      const selectedPersonName = e.target.value;
                      setCand_Name(selectedPersonName);
                      // If the selected option is "Choose," reset selectedPersonDetails and supplierNames
                      if (selectedPersonName === "") {
                        setSelectedPersonDetails({});
                      } else {
                        handlePersonChange(selectedPersonName);
                      }
                    }}
                    required
                  >
                    <option value="">Choose</option>
                    {supplierNames.map((person) => (
                      <option key={person.name} value={person.name}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                    </TableCell>
                   
                    </>}
                    <TableCell className="border data_td p-1">
                    <textarea
                    className="pt-2"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <select
                      value={curr_Country}
                      onChange={(e) => setCurr_Country(e.target.value)}
                    >
                      <option value="">choose</option>
                      {currCountries &&
                        currCountries.map((data) => (
                          <option key={data._id} value={data.currCountry}>
                            {data.currCountry}
                          </option>
                        ))}
                    </select>
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <input
                      type="number"
                      min="0"
                      value={curr_Rate}
                      onChange={(e) => setCurr_Rate(e.target.value)}
                    />
                    </TableCell>
                    <TableCell className="border data_td p-1">
                    <input type="number" value={curr_Amount} readOnly />
                    </TableCell>
                    <TableCell className="border data_td p-1">
                  <input type="file" accept="image/*" onChange={handleImage} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </TableContainer>
              <div className="row p-0 m-0 my-1">
                {slip_Pic && (
                  <div className="col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                    <div className="image">
                      <img src={slip_Pic} alt="" className="rounded" />
                    </div>
                  </div>
                )}
              </div>
             
            </form>
          
        )}
      </Paper>
</div>
    </div>
     </div>
      
    </>
  );
}
