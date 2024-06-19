import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import CategoryHook from '../../hooks/settingHooks/CategoryHook'
import PaymentViaHook from '../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../hooks/settingHooks/PaymentTypeHook'
import CurrCountryHook from '../../hooks/settingHooks/CurrCountryHook'
import AgentHook from '../../hooks/agentHooks/AgentHook';


// import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function AzadAgentCandPaymentInReturn() {
  const dispatch = useDispatch();
  // getting data from redux store 

  const currCountries = useSelector((state) => state.setting.currCountries);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const agent_Payments_In = useSelector((state) => state.agents.agent_Payments_In)

  const { getCurrCountryData } = CurrCountryHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const { getPaymentsIn } = AgentHook()

  // getting Data from DB
  const { user } = useAuthContext()
  const fetchData = async () => {
    try {
      // Use Promise.all to execute all promises concurrently
      await Promise.all([

        getCurrCountryData(),
        getCategoryData(),
        getPaymentViaData(),
        getPaymentTypeData(),
        getPaymentsIn()

      ]);


    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData()
  }, [user, dispatch])


  const [option, setOption] = useState(false)

  // Form input States
  const [supplierName, setSupplierName] = useState('')
  const [category, setCategory] = useState('')
  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')
  const [slip_No, setSlip_No] = useState('')
  const [cash_Out, setCash_Out] = useState()
  const [slip_Pic, setSlip_Pic] = useState('')
  const [details, setDetails] = useState('')
  const [curr_Country, setCurr_Country] = useState('')
  const [curr_Rate, setCurr_Rate] = useState('')
  // const [open, setOpen] = useState(true)
  // const [close, setClose] = useState(false)
  const [cand_Name, setCand_Name] = useState('')
  const [date, setDate] = useState('')
  let curr_Amount = Math.round(cash_Out / curr_Rate);


  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [supplierNames, setSupplierNames] = useState([]);
  const [selectedPersonDetails, setSelectedPersonDetails] = useState({});

  
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
        <th>Total Cash Out</th>
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
            <td>${String(selectedPersonDetails?.cash_Out)}</td>
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
    setOption(!option)
  }

  const [section, setSection] = useState(false)


  const handleSection = () => {
    setSection(!section)
    setCurr_Country('')
    setCurr_Rate('')

  }

  // handle Picture 


  const handleImage = (e) => {
    const file = e.target.files[0];
    TransformFile(file)
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit. Please select a smaller file.');
      } else {
        TransformFile(file);
      }
    } else {
      alert('No file selected.');
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
      setSlip_Pic('');
    }
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  // Submitting Form Data
  const [loading, setLoading] = useState(null)
  const [, setNewMessage] = useState('')
  const handleForm = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/auth/agents/payment_in/cash_out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          cash_Out,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          // open,
          // close,
          date,
          cand_Name
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setCash_Out('')
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
        setCand_Name('')
        // setOpen(true)
        // setClose(false);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };


  // Update the state when the cand_Name value changes
  const handlePersonChange = (selectedPersonName) => {
    // Find the selected person in the persons array of the selected supplier
    const selectedSupplierData = agent_Payments_In.find(
      (data) => data.supplierName === selectedSupplier
    );

    if (selectedSupplierData) {
      const selectedPerson = selectedSupplierData.persons.find(
        (person) => person.name === selectedPersonName
      );

      // Update the state with the details of the selected person
      setSelectedPersonDetails(selectedPerson || {});
    } else {
      // If selectedSupplierData is not found, reset the person details state
      setSelectedPersonDetails({});
    }
  };


  return (
    <>
      <div className="col-md-12 ">
        {!option && <TableContainer component={Paper}>
          <form className='py-3 px-2' onSubmit={handleForm}>
            <div className="text-end ">
              {/* {close === false &&
                <label htmlFor="">
                  Open
                  <input type="checkbox" value={open} onClick={() => setOpen(!open)} />
                </label>
              }
              {open === true &&
                <label htmlFor="">
                  Close
                  <input type="checkbox" value={close} onClick={() => setClose(!close)} />
                </label>
              } */}

              <button className='btn btn-sm  submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Payment"}</button>
              {/* <span className='btn btn-sm  submit_btn m-1 bg-primary border-0'><AddRoundedIcon fontSize='small'/></span> */}
            </div>
            <div className="row p-0 m-0 my-1">

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Name</label>
                <select required value={supplierName}
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
                      const selectedSupplierData = agent_Payments_In.find(
                        (data) => data.supplierName === selectedSupplierValue
                      );

                      // Update the supplierNames state with the names of persons array of the selected supplier
                      if (selectedSupplierData) {
                        const namesOfPersons = selectedSupplierData.persons || [];
                        setSupplierNames(namesOfPersons);
                      }
                    }
                  }}

                >
                  <option value="">Choose Agent</option>
                  {agent_Payments_In &&
                    agent_Payments_In.map((data) => (
                      <option key={data._id} value={data.supplierName}>
                        {data.supplierName}
                      </option>
                    ))
                  }
                </select>

              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Category </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Choose</option>
                  {categories && categories.map((data) => (
                    <option key={data._id} value={data.category}>{data.category}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Payment Via </label>
                <select value={payment_Via} onChange={(e) => setPayment_Via(e.target.value)} required>
                  <option value="">Choose</option>
                  {paymentVia && paymentVia.map((data) => (
                    <option key={data._id} value={data.payment_Via}>{data.payment_Via}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Payment Type </label>
                <select value={payment_Type} onChange={(e) => setPayment_Type(e.target.value)} required>
                  <option value="">Choose</option>
                  {paymentType && paymentType.map((data) => (
                    <option key={data._id} value={data.payment_Type}>{data.payment_Type}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Slip No </label>
                <input type="text" value={slip_No} onChange={(e) => setSlip_No(e.target.value)} />
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Cash Out </label>
                <input type="number" min="0" value={cash_Out} onChange={(e) => setCash_Out(e.target.value)} required />
              </div>

              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Upload Slip </label>
                <input type="file" accept='image/*' onChange={handleImage} />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Date </label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}  />
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >Candidate </label>
                <select value={cand_Name}
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
                  required>
                  <option value="">Choose</option>
                  {supplierNames.map((person) => (
                    <option key={person.name} value={person.name}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                <label >Details </label>
                <textarea className='pt-2' value={details} onChange={(e) => setDetails(e.target.value)} />
              </div>
              {slip_Pic && <div className="col-lg-4 col-md-6 col-sm-12 p-1 my-1">
                <div className="image">
                  <img src={slip_Pic} alt="" className='rounded' />
                </div>
              </div>}
            </div>
            <span className='btn btn-sm  add_section_btn' style={!section ? { backgroundColor: 'var(--accent-lighter-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={handleSection}>{!section ? <AddIcon fontSize='small'></AddIcon> : <RemoveIcon fontSize='small'></RemoveIcon>}{!section ? "Add Currency" : "Remove"}</span>
            {/* Add Crrency section */}
            {section &&
              <div className="row p-0 m-0 mt-5">
                <hr />
                <div className="col-xl-1 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >CUR Country </label>
                  <select value={curr_Country} onChange={(e) => setCurr_Country(e.target.value)}>
                    <option value="">choose</option>
                    {currCountries && currCountries.map((data) => (
                      <option key={data._id} value={data.currCountry}>{data.currCountry}</option>
                    ))}
                  </select>
                </div>
                <div className="col-xl-1 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >CUR Rate </label>
                  <input type="text"  value={curr_Rate} onChange={(e) => setCurr_Rate(e.target.value)} />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                  <label >Currency Amount </label>
                  <input type="number" value={curr_Amount} readOnly />
                </div>
              </div>}

            {cand_Name &&
               <>
               <div className="row p-0 m-0 mt-2">
                 <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                   <label >Candidate Name</label>
                   <input type="text" value={selectedPersonDetails.name} readOnly />
                 </div>
                 <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                   <label >PP#</label>
                   <input type="text" value={selectedPersonDetails.pp_No} readOnly />
                 </div>
                 <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                   <label >Entry Mode</label>
                   <input type="text" value={selectedPersonDetails.entry_Mode} readOnly />
                 </div>
                 <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                   <label >Visa Price In PKR</label>
                   <input type="text" value={selectedPersonDetails.visa_Price_In_PKR} readOnly />
                 </div>
                 <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                   <label >Total In PKR</label>
                   <input type="text" value={selectedPersonDetails.total_In} readOnly />
                 </div>
                 <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                   <label >Total Cash Out</label>
                   <input type="text" value={selectedPersonDetails.cash_Out} readOnly />
                 </div>
                 <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                   <label >Remaining PKR</label>
                   <input type="text" value={selectedPersonDetails.remaining_Price} readOnly />
                 </div>
                 <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                   <label >Visa Price In Curr</label>
                   <input type="text" value={selectedPersonDetails.Visa_Price_In_Curr} readOnly />
                 </div>
                 <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                   <label >Remaining Curr</label>
                   <input type="text" value={selectedPersonDetails.remaining_Curr} readOnly />
                 </div>
               </div>
               <div className="row p-0 m-0 mt-2 justify-content-center">
                 <div className="col-md-2 col-sm-12">
                 <button className='btn btn-sm  shadow bg-success text-white' onClick={printPersonsTable}>Print</button>
 
                 </div>
               </div>
              </>

            }
          </form>
        </TableContainer>}
      </div>


      {/* Details */}
      <div className="row payment_details mt-0">
        <div className="col-md-12 my-2">
          {selectedSupplier && <button className='btn btn-sm  detail_btn' onClick={handleOpen}>{option ? 'Hide Details' : "Show Details"}</button>}
        </div>
        {option && (
          <div className="col-md-12 detail_table">
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead className="thead">
                  <TableRow>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Date</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Category</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Via</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_Type</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Slip_No</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Details</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_In</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Cash_Out</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Candidate</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Invoice</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>Payment_In_Curr</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>CUR_Rate</TableCell>
                    <TableCell className='label border' style={{ width: '18.28%' }}>CUR_Amount</TableCell>


                  </TableRow>
                </TableHead>
                <TableBody>
                  {agent_Payments_In
                    .filter((data) => data.supplierName === selectedSupplier)
                    .map((filteredData) => (
                      // Map through the payment array
                      <>
                        {filteredData.payment && filteredData.payment
                          .filter((paymentItem) => paymentItem.cand_Name !== undefined)
                          .map((paymentItem, index) => (
                            <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.date}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.category}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_Via}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_Type}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.slip_No}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.details}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{paymentItem?.payment_In}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.cash_Out}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.cand_Name}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.invoice}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.payment_In_Curr}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.curr_Rate}</TableCell>
                              <TableCell className='border data_td text-center' style={{ width: '18.28%' }}>{paymentItem?.curr_Amount}</TableCell>

                            </TableRow>
                          ))}
                        {/* Move these cells inside the innermost map loop */}
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Payment_In</TableCell>
                          <TableCell className=' data_td text-center  bg-info text-white text-bold'>{filteredData.total_Payment_In}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Payment_In_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Payment_In_Curr}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Visa_Price_In_PKR</TableCell>
                          <TableCell className=' data_td text-center  bg-info text-white text-bold'>{filteredData.total_Visa_Price_In_PKR}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Total_Visa_Price_In_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Visa_Price_In_Curr}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Remaining PKR</TableCell>
                          <TableCell className=' data_td text-center  bg-success text-white text-bold'>{filteredData.total_Visa_Price_In_PKR-filteredData.total_Payment_In+filteredData.total_Cash_Out}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border' style={{ width: '18.28%' }}>Remaining Total_Payment_In_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Visa_Price_In_Curr-filteredData.total_Payment_In_Curr}</TableCell>
                        </TableRow>
                      </>
                    ))}

                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

      </div>
    </>
  )
}
