import React, { useState, useEffect,useRef } from "react";
import { useAuthContext } from "../../../hooks/userHooks/UserAuthHook";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import CategoryHook from "../../../hooks/settingHooks/CategoryHook";
import PaymentViaHook from "../../../hooks/settingHooks/PaymentViaHook";
import PaymentTypeHook from "../../../hooks/settingHooks/PaymentTypeHook";
import CurrCountryHook from "../../../hooks/settingHooks/CurrCountryHook";
import AgentHook from '../../../hooks/agentHooks/AgentHook';
import SupplierHook from '../../../hooks/supplierHooks/SupplierHook';

export default function Entry2() {
  const dispatch = useDispatch();

  const currCountries = useSelector((state) => state.setting.currCountries);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const agent_Payments_Out = useSelector(
    (state) => state.agents.agent_Payments_Out
  );
  const supp_Payments_Out = useSelector((state) => state.suppliers.supp_Payments_Out)

  const abortCont = useRef(new AbortController());

  const { getCurrCountryData } = CurrCountryHook();
  const { getCategoryData } = CategoryHook();
  const { getPaymentViaData } = PaymentViaHook();
  const { getPaymentTypeData } = PaymentTypeHook();
  const { getPaymentsOut } = AgentHook();
  const { getSupplierPaymentsOut } = SupplierHook()

  // getting Data from DB
  const { user } = useAuthContext();
  const fetchData = async () => {
    try {
      // Use Promise.all to execute all promises concurrently
        getCurrCountryData()
        getCategoryData()
        getPaymentViaData()
        getPaymentTypeData()
        getPaymentsOut()
        getSupplierPaymentsOut()
    
    } catch (error) { }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (abortCont.current) {
        abortCont.current.abort(); 
      }
    }
  }, [user, dispatch]);

  const [option, setOption] = useState(false);
  // Form input States
  const [type, setType] = useState('');
  const [supplierName, setSupplierName] = useState("");
  const [category, setCategory] = useState("");
  const [payment_Via, setPayment_Via] = useState("");
  const [payment_Type, setPayment_Type] = useState("");
  const [slip_No, setSlip_No] = useState("");
  const [slip_Pic, setSlip_Pic] = useState("");
  const [details, setDetails] = useState("");
  const [curr_Country, setCurr_Country] = useState("");
  const [date, setDate] = useState("");

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [supplierNames, setSupplierNames] = useState([]);

  useEffect(() => {

  }, [type])

  const [candData, setCandData] = useState([]);
  const [selectedPersonDetails, setSelectedPersonDetails] = useState([]);
  let totalVisaPriceInPKR = selectedPersonDetails.reduce((total, person) => {
    return total + person?.visa_Price_Out_PKR;
}, 0);

let totalPastPaidPKR = selectedPersonDetails.reduce((total, person) => {
  return total + person?.total_In;
}, 0);
let totalPastRemainingPKR = selectedPersonDetails.reduce((total, person) => {
  return total + person?.remaining_Price;
}, 0);

  // Function to handle the "Add More" button click
  const handleAddMore = () => {
    setCandData([...candData, { cand_Name: "", payment_Out: 0, curr_Amount: 0,curr_Rate:0 }]);
    setSelectedPersonDetails([...selectedPersonDetails, {}]);
  };

  // Function to handle changes in the additional form fields
  const handleCandChange = (index, fieldName, value) => {
    const updatedCandData = [...candData];
    updatedCandData[index][fieldName] = value;
    setCandData(updatedCandData);
  };

  // Function to remove an additional form
  const handleRemove = (index) => {
    const updatedCandData = [...candData];
    updatedCandData.splice(index, 1);
    setCandData(updatedCandData);
    setSelectedPersonDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails.splice(index, 1);
      return newDetails;
    });
  }

  const printPersonsTable = (selectedPersonDetails) => {
     // Convert JSX to HTML string
     const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
    const formattedDate = formatDate(new Date());
      const printContentString = `
    <div class="print-header">
      <p class="invoice">Agent: ${selectedSupplier}</p>
        <h1 class="title">ROZGAR TTTC</h1>
        <p class="date">Date: ${formattedDate}</p>
      </div>
      <div class="print-header">
        <h1 class="title"> Candidate Payments Details</h1>
      </div>
      <hr/>
    <table class='print-table'>
      <thead>
        <tr>
        <th>Date</th>
        <th>Name</th>
        <th>PP#</th>
        <th>Entry Mode</th>
        <th>Company</th>
        <th>Trade</th>
        <th>Country</th>
        <th>Final Status</th>
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
            <td>${String(selectedPersonDetails?.visa_Price_Out_PKR)}</td>
            <td>${String(selectedPersonDetails?.total_In)}</td>
            <td>${String(
      (selectedPersonDetails?.visa_Price_Out_PKR - selectedPersonDetails?.total_In) +
      selectedPersonDetails?.cash_Out
    )}</td>
            <td>${String(selectedPersonDetails?.visa_Price_Out_Curr)}</td>
            <td>${String(selectedPersonDetails?.remaining_Curr)}</td>

          </tr>
      
    
    </tbody>
    </table>
    <style>
      /* Add your custom print styles here */
      body {
        background-color: #fff;
      }
      .print-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .title {
        flex-grow: 1;
        text-align: center;
        margin: 0;
        font-size: 24px;
      }
      .date {
        flex-grow: 0;
        text-align: right;
        font-size: 20px;
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

  
  const[totalPayments,setTotalPayments]=useState(0)
  const[totalCurrRate,setTotalCurrRate]=useState(0)
let totalCurrency=(totalPayments/totalCurrRate).toFixed(2)

  // Submitting Form Data
  const [loading, setLoading] = useState(null);
  const [, setNewMessage] = useState("");
 


  const handlePersonChange = (selectedPersonName, index) => {
    const selectedSupplierData = (type==="Agent" ?agent_Payments_Out:type==="Supplier"&&supp_Payments_Out).find(
      (data) => data.supplierName === selectedSupplier
    );
  
    if (selectedSupplierData) {
      const selectedPerson = selectedSupplierData.persons.find(
        (person) => person.name === selectedPersonName
      );
  
      const updatedCandData = [...candData];
      updatedCandData[index] = {
        ...updatedCandData[index],
        cand_Name: selectedPersonName,
      };
      setCandData(updatedCandData);
  
      setSelectedPersonDetails((prevDetails) => {
        const newDetails = [...prevDetails];
        newDetails[index] = selectedPerson || {};
        return newDetails;
      });
    }
  };
  


  const sumPaymentIn = (data) => {
    return data.reduce((acc, curr) => acc + Number(curr.payment_Out), 0);
  };
  const sumCurrency = (data) => {
    return data.reduce((acc, curr) => acc + Number(curr.curr_Rate), 0);
  };

  const disableAddMore = totalPayments <= sumPaymentIn(candData);

  const handleChangePaymentIn = (index, value) => {
    const newCandData = [...candData];
    newCandData[index].payment_Out = Math.min(value, totalPayments - sumPaymentIn(newCandData) + newCandData[index].payment_Out);
    setCandData(newCandData);
  };
  const handleChangeCurrency = (index, value) => {
    const newCandData = [...candData];
    newCandData[index].curr_Rate = Math.min(value, totalCurrency - sumCurrency(newCandData) + newCandData[index].curr_Rate);
    setCandData(newCandData);
  };


  const handleAgentForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName("");
    setCategory("");
    setPayment_Via("");
    setPayment_Type("");
    setSlip_No("");
    setSlip_Pic("");
    setDetails("");
    setCurr_Country("");
    setDate("");
    setTotalCurrRate('')
    try {
      const response = await fetch(`${apiUrl}/auth/agents/add/cand_vise/payment_out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          slip_Pic,
          details,
          curr_Country,
          date,
          totalCurrRate,
          payments:candData
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading(false);
      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getPaymentsOut();
        setLoading(false);
        setSupplierName("");
        setCategory("");
        setPayment_Via("");
        setPayment_Type("");
        setSlip_No("");
        setSlip_Pic("");
        setDetails("");
        setCurr_Country("");
        setDate("");
        setTotalCurrRate('')

      }
    } catch (error) {
    
      setNewMessage(toast.error("Server is not Responding..."));
      setLoading(false);
    }
  };

  const handleSupplierForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSupplierName("");
    setCategory("");
    setPayment_Via("");
    setPayment_Type("");
    setSlip_No("");
    setSlip_Pic("");
    setDetails("");
    setCurr_Country("");
    setDate("");
    setTotalCurrRate('')
    try {
      const response = await fetch(`${apiUrl}/auth/suppliers/add/cand_vise/payment_out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          slip_Pic,
          details,
          curr_Country,
          date,
          totalCurrRate,
          payments:candData
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading(false);
      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getSupplierPaymentsOut();
        setLoading(false);
        setSupplierName("");
        setCategory("");
        setPayment_Via("");
        setPayment_Type("");
        setSlip_No("");
        setSlip_Pic("");
        setDetails("");
        setCurr_Country("");
        setDate("");
        setTotalCurrRate('')
      }
    } catch (error) {
    
      setNewMessage(toast.error("Server is not Responding..."));
      setLoading(false);
    }
  };

  return (
   <>
    <TableContainer component={Paper} className="mt-1">
      <div className="col-md-12 ">
        {!option && (
          <>
            <form className="py-3 px-2" onSubmit={(type==='Agent'?handleAgentForm:type==="Supplier"&& handleSupplierForm)}>
              <div className="text-end ">
                <button className="btn btn-sm submit_btn m-1" disabled={loading || !disableAddMore}>
                  {loading ? "Adding..." : "Add Payment"}
                </button>
              </div>
              
              <div className="row p-0 m-0 my-1">
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label>Reference</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="">Choose</option>
                   <option value="Agent">Agent</option>
                   <option value="Supplier">Supplier</option>
                  </select>
                </div>

                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label>Name</label>
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

                        // Filter supp_Payments_Out based on the selected supplier
                        const selectedSupplierData = (type==="Agent"?agent_Payments_Out :type==="Supplier"&&supp_Payments_Out).find(
                          (data) => data.supplierName === selectedSupplierValue
                        );

                        // Update the supplierNames state with the names of persons array of the selected supplier
                        if (selectedSupplierData) {
                          const namesOfPersons =
                            selectedSupplierData.persons || [];
                          setSupplierNames(namesOfPersons);
                        }
                      }
                    }}
                  >
                    {type==="Agent" &&
                    <>
                     <option value="">Choose Agent</option>
                    {agent_Payments_Out &&
                      agent_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                    </>
                    }
                      {type==="Supplier" &&
                    <>
                     <option value="">Choose Supplier</option>
                    {supp_Payments_Out &&
                      supp_Payments_Out.map((data) => (
                        <option key={data._id} value={data.supplierName}>
                          {data.supplierName}
                        </option>
                      ))}
                    </>
                    }
                  </select>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label>Category </label>
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
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label>Payment Via </label>
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
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label>Payment Type </label>
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
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label>Slip No </label>
                  <input
                    type="text"
                    value={slip_No}
                    onChange={(e) => setSlip_No(e.target.value)}
                  />
                </div>

                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label>Upload Slip </label>
                  <input type="file" accept="image/*" onChange={handleImage} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label>Date </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    
                  />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >Curr Country </label>
                  <select value={curr_Country} onChange={(e) => setCurr_Country(e.target.value)}>
                    <option value="">choose</option>
                    {currCountries && currCountries.map((data) => (
                      <option key={data._id} value={data.currCountry}>{data.currCountry}</option>
                    ))}
                  </select>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >Total Payments </label>
                 <input type="number" min='0' value={totalPayments} onChange={(e)=>setTotalPayments(e.target.value)} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >Curr Rate </label>
                 <input type="number" min='0' value={totalCurrRate} onChange={(e)=>setTotalCurrRate(e.target.value)} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >Total Currency </label>
                 <input type="number" min='0' value={totalCurrency} disabled />
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                  <label>Details </label>
                  <textarea
                    className="pt-2"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>
                {slip_Pic && (
                  <div className="col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                    <div className="image">
                      <img src={slip_Pic} alt="" className="rounded" />
                    </div>
                  </div>
                )}
              </div>
              
            </form>
          </>
        )}
      </div>     
      <div className="row payment_details mt-0">
        <div className="col-md-12 my-2">
          <div className="justify-content-between d-flex">
          <div className="left">
            {selectedSupplier && (
            <button className="btn detail_btn" onClick={handleOpen}>
              {option ? "Hide Details" : "Show Details"}
            </button>
          )}
            </div>
            <div className="right">
           {!option && 
            <button  disabled={disableAddMore } onClick={() => handleAddMore()} className={`btn shadow btn-sm text-white text-bold ms-1 bg-success`}>
            <i className="fas fa-plus"></i> 
          </button>
           }
            </div>
          </div>
        </div>
        {option && (
          <div className="col-md-12 detail_table">
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead className="thead">
                  <TableRow>
                    <TableCell className="label border">Date</TableCell>
                    <TableCell className="label border">Category</TableCell>
                    <TableCell className="label border">Payment_Via</TableCell>
                    <TableCell className="label border">Payment_Type</TableCell>
                    <TableCell className="label border">Slip_No</TableCell>
                    <TableCell className="label border">Details</TableCell>
                    <TableCell className="label border">Payment_In</TableCell>
                    <TableCell className="label border">Cash_Out</TableCell>
                    <TableCell className="label border">Invoice</TableCell>
                    <TableCell className="label border">
                      Payment_In_Curr
                    </TableCell>
                    <TableCell className="label border">CUR_Rate</TableCell>
                    <TableCell className="label border">CUR_Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(type === "Agent" ? agent_Payments_Out : type === "Supplier"&& supp_Payments_Out: [])
                    .filter((data) => data.supplierName === selectedSupplier)
                    .map((filteredData) => (
                      // Map through the payment array
                      <>
                        {filteredData.candPayments &&
                          filteredData.candPayments
                            .filter(
                              (paymentItem) =>
                                paymentItem.cand_Name !== undefined
                            )
                            .map((paymentItem, index) => (
                              <TableRow
                                key={paymentItem?._id}
                                className={
                                  index % 2 === 0 ? "bg_white" : "bg_dark"
                                }
                              >
                                <TableCell className="border data_td text-center">
                                  {paymentItem?.date}
                                </TableCell>
                                <TableCell className="border data_td text-center">
                                  {paymentItem?.category}
                                </TableCell>
                                <TableCell className="border data_td text-center">
                                  {paymentItem?.payment_Via}
                                </TableCell>
                                <TableCell className="border data_td text-center">
                                  {paymentItem?.payment_Type}
                                </TableCell>
                                <TableCell className="border data_td text-center">
                                  {paymentItem?.slip_No}
                                </TableCell>
                                <TableCell className="border data_td text-center">
                                  {paymentItem?.details}
                                </TableCell>
                                <TableCell className="border data_td text-center">
                                  <i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>
                                  {paymentItem?.payment_Out}
                                </TableCell>
                                <TableCell className="border data_td text-center">
                                  <i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>
                                  {paymentItem?.cash_Out}
                                </TableCell>
                                <TableCell className="border data_td text-center">
                                  {paymentItem?.invoice}
                                </TableCell>
                                <TableCell className="border data_td text-center">
                                  {paymentItem?.payment_Out_Curr}
                                </TableCell>
                                <TableCell className="border data_td text-center">
                                  {paymentItem?.curr_Rate}
                                </TableCell>
                                <TableCell className="border data_td text-center">
                                  {paymentItem?.curr_Amount}
                                </TableCell>
                              </TableRow>
                            ))}
                        {/* Move these cells inside the innermost map loop */}

                        <TableRow>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
       
                                 <TableCell className='label border'>Total_Payment_In</TableCell>
                                 <TableCell className=' data_td text-center  bg-info text-white text-bold'>{filteredData.total_Payment_Out}</TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell className='label border'>Total_Payment_In_Curr</TableCell>
                                 <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Payment_Out_Curr}</TableCell>
                               </TableRow>
                               <TableRow>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
       
                                 <TableCell className='label border'>Total_Visa_Price_In_PKR</TableCell>
                                 <TableCell className=' data_td text-center  bg-info text-white text-bold'>{filteredData.total_Visa_Price_Out_PKR}</TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell className='label border'>Total_Visa_Price_In_Curr</TableCell>
                                 <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Visa_Price_Out_Curr}</TableCell>
                               </TableRow>
                               <TableRow>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell className='label border'>Remaining PKR</TableCell>
                                 <TableCell className=' data_td text-center  bg-success text-white text-bold'>{filteredData.total_Visa_Price_Out_PKR-filteredData.total_Payment_Out+filteredData.total_Cash_Out}</TableCell>
                                 <TableCell></TableCell>
                                 <TableCell></TableCell>
                                 <TableCell className='label border'>Remaining Total_Payment_In_Curr</TableCell>
                                 <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Visa_Price_Out_Curr-filteredData.total_Payment_Out_Curr}</TableCell>
                               </TableRow>
                      </>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
      <hr />
      {candData && candData.map((cand, index) => (
        <>
         <div key={index} className="py-3 px-2">
            <div className="row p-0 m-0 my-1">
            <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
              <label htmlFor="" className="text-sm text-muted  mb-1">Candidate</label>
        <select
          value={cand.cand_Name}
          onChange={(e) => handlePersonChange(e.target.value, index)}
          required
        >
          <option value="">Choose Candidate</option>
          {supplierNames.map((person) => (
            <option key={person.name} value={person.name}>
              {person.name}
            </option>
          ))}
        </select>
      </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
              <label htmlFor="" className="text-sm text-muted mb-1">Payment Out</label>
                {/* Payment_In */}
                <input
                  type="number"
                  required
                  min="1"
                  value={cand.payment_Out}
                  onChange={(e) => handleChangePaymentIn(index, e.target.value)}
                  placeholder="Payment Out"
                />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
              <label htmlFor=""  className="text-sm text-muted mb-1">Currency Amount</label>
                <input
                  type="number"
                  min="0"
                  disabled
                  value={(cand.payment_Out/totalCurrRate).toFixed(2)}
                  placeholder="Currency Amount"
                />
              </div>
             
              {/* Button to remove this additional form */}
              <div className="col-md-12 text-end">
              <button onClick={() => handleRemove(index)} className={`btn shadow btn-sm text-white text-bold ms-1 bg-danger`}>
                <i className="fas fa-trash"></i> 
              </button>
               
              </div>
            </div>
          
        </div>
          {/* Render details for the selected candidate */}
    {selectedPersonDetails[index] && (
     <>
      <form>
       <div className="row p-0 m-0 mt-2">
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Candidate Name</label>
                    <input disabled
                      type="text"
                      value={selectedPersonDetails[index].name}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>PP#</label>
                    <input disabled
                      type="text"
                      value={selectedPersonDetails[index].pp_No}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Entry Mode</label>
                    <input disabled
                      type="text"
                      value={selectedPersonDetails[index].entry_Mode}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Country</label>
                    <input disabled
                      type="text"
                      value={selectedPersonDetails[index].country}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Final Status</label>
                    <input disabled
                      type="text"
                      value={selectedPersonDetails[index].final_Status}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Flight Date</label>
                    <input disabled
                      type="text"
                      value={selectedPersonDetails[index].flight_Date}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Company</label>
                    <input disabled
                      type="text"
                      value={selectedPersonDetails[index].company}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Visa Price In PKR</label>
                    <input disabled
                      type="text"
                      value={selectedPersonDetails[index].visa_Price_Out_PKR}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >Total In PKR</label>
                  <input type="text" disabled value={selectedPersonDetails[index].total_In} readOnly />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >New Total In PKR</label>
                  <input type="text" disabled  value={parseFloat(selectedPersonDetails[index].total_In) + parseFloat(candData[candData.length - 1].payment_Out)}  readOnly />
                </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Remaining PKR</label>
                    <input 
                    disabled
                      type="text"
                      value={selectedPersonDetails[index].remaining_Price}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>New Remaining PKR</label>
                    <input
                    disabled
                      type="text"
                      value={parseFloat(selectedPersonDetails[index].remaining_Price) - parseFloat(candData[candData.length - 1].payment_Out)}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Visa Price In Curr</label>
                    <input
                    disabled
                      type="text"
                      value={selectedPersonDetails[index].visa_Price_Out_PKR}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Total Paid Curr</label>
                    <input
                    disabled
                      type="text"
                      value={(parseFloat(selectedPersonDetails[index].visa_Price_Out_PKR) - parseFloat(selectedPersonDetails[index].remaining_Curr)).toFixed(2)}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>New Total Paid Curr</label>
                    <input
                    disabled
                      type="text"
                      value={parseFloat(selectedPersonDetails[index].visa_Price_Out_PKR -selectedPersonDetails[index].remaining_Curr) + parseFloat(candData[candData.length - 1].curr_Amount)}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Remaining Curr</label>
                    <input
                    disabled
                      type="text"
                      value={selectedPersonDetails[index].remaining_Curr}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>New Remaining Curr</label>
                    <input
                    disabled
                      type="text"
                      value={parseFloat(selectedPersonDetails[index].remaining_Curr) - parseFloat(candData[candData.length - 1].curr_Amount)}
                      readOnly
                    />
                  </div>
                </div>
      </form>
      <div className="row p-0 m-0 mt-2 justify-content-center">
                <div className="col-md-2 col-sm-12">
                <button className='btn btn-sm  shadow bg-success text-white'  onClick={() => printPersonsTable(selectedPersonDetails[index])}>Print</button>
                </div>
              </div>
     </>
    )}
      <hr />


        </>
      ))}

<hr/>
<div className="col-md-12">
<h4 className="text-center">Payment Summary</h4>
<form className="py-3 px-2" >
  <div className="row  p-0 m-0 my-1">
  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                  <label>Total Candidates </label>
                  <input type="text" value={candData.length} disabled/>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                  <label>Total Visa Amount PKR </label>
                  <input type="text" value={totalVisaPriceInPKR} disabled/>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                  <label>Total Past Paid PKR </label>
                  <input type="text" value={totalPastPaidPKR} disabled/>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                  <label>Total Past Remaining PKR </label>
                  <input type="text" value={totalPastRemainingPKR} disabled/>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                  <label>Total New Payment PKR </label>
                  <input type="text" value={totalPayments} disabled/>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                  <label>New Payment In Curr </label>
                  <input type="text" value={totalCurrency} disabled/>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                  <label>Total New Remaining PKR </label>
                  <input type="text" value={totalPastRemainingPKR-totalPayments} disabled/>
                </div>
  </div>
</form>
</div>
    </TableContainer>

   </>
  )
}
