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
import SupplierHook from '../../hooks/supplierHooks/SupplierHook';
import * as XLSX from 'xlsx';

export default function SupCandPaymentOut() {
  const dispatch = useDispatch();
  // getting data from redux store 

  const currCountries = useSelector((state) => state.setting.currCountries);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const supp_Payments_Out = useSelector((state) => state.suppliers.supp_Payments_Out)

  const { getCurrCountryData } = CurrCountryHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const { getPaymentsOut } = SupplierHook()

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
        getPaymentsOut()

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
  const [payment_Out, setPayment_Out] = useState()
  const [slip_Pic, setSlip_Pic] = useState('')
  const [details, setDetails] = useState('')
  const [curr_Country, setCurr_Country] = useState('')
  const [curr_Rate, setCurr_Rate] = useState()

  const [open, setOpen] = useState(true)
  const [close, setClose] = useState(false)
  const [date, setDate] = useState('');
  const [cand_Name, setCand_Name] = useState('')
  let curr_Amount = payment_Out / curr_Rate

  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [supplierNames, setSupplierNames] = useState([]);
  const [selectedPersonDetails, setSelectedPersonDetails] = useState({});

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


  // Submitting Form Data
  const [loading, setLoading] = useState(null)
  const [, setNewMessage] = useState('')
  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/suppliers/add/payment_out', {
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
          payment_Out,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          open,
          close,
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
        getPaymentsOut();
        setLoading(false);
        setSupplierName('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_Out('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
        setCand_Name('')
        setOpen(true)
        setClose(false);

      }


    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  }


  const [single, setSingle] = useState(0)

  const setEntry = (index) => {
    setSingle(index)
  }

  const [multiplePayment, setMultiplePayment] = useState([{date:'',supplierName: '', category: '', payment_Via: '', payment_Type: '', slip_No: '', payment_In: '', details: '', curr_Country: '', curr_Rate: 0, curr_Amount: 0,cand_Name:''}])
  const [triggerEffect, setTriggerEffect] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Check if the file type is either Excel or CSV
    if (
      file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      file.type !== 'text/csv'
    ) {
      alert('Please upload a valid Excel or CSV file.');
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = e.target.result;
      const dataArray = parseExcelData(data);
      setMultiplePayment(dataArray);
      setTriggerEffect(true); // Trigger the useEffect when multiplePayment changes
    };

    fileReader.readAsBinaryString(file);

    // Clear the file input value
    e.target.value = null;
  }

  const parseExcelData = (data) => {
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dataArray = XLSX.utils.sheet_to_json(sheet);
    return dataArray;
  };

  const handleInputChange = (rowIndex, key, value) => {
    const updatedData = [...multiplePayment];
    updatedData[rowIndex][key] = value;
    setMultiplePayment(updatedData);
  }

  const handleUploadList =async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const response = await fetch('https://api-rozgar-tttc.onrender.com/auth/suppliers/add/multiple/payment_out', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ multiplePayment })
      });

      const json = await response.json();
      if (response.ok) {
        setMultiplePayment('')
        setNewMessage(toast.success(json.message))
        setLoading(false)
      }
      if (!response.ok) {
        setLoading(false)
        setNewMessage(toast.error(json.message))
      }
    } catch (error) {
      setLoading(false)
      setNewMessage(toast.error("Server is not Reponding..."))


    }

  };

  useEffect(() => {
    if (triggerEffect) {
      setTriggerEffect(false);
    }
  }, [triggerEffect, multiplePayment]);




  // Update the state when the cand_Name value changes
  const handlePersonChange = (selectedPersonName) => {
    // Find the selected person in the persons array of the selected supplier
    const selectedSupplierData = supp_Payments_Out.find(
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
      <div className="main">
        <div className="container-fluid payment_form">
          <div className="row">
            <div className="col-md-12">
              <Paper className='py-3 mb-1 px-2'>
                <h4>Cand-Vise Supplier Payment Out</h4>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Single Payment-Out</button>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(1)} style={single === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Multiple Payment-Out</button>
                {single === 1 && <label className="btn m-1 py-2 btn-sm upload_btn">
                  Upload New List
                  <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>}
              </Paper>
            </div>
            {single === 1 &&
              <>
                <div className="col-md-12 multiple_form">

                  <Paper>
                    <form className='py-0 px-2' onSubmit={handleUploadList} >
                      <div className="text-end">
                      <button className='btn submit_btn m-1' disabled={loading}>{loading?"Adding...":"Add Payment"}</button>
                      </div>
                      <div className="table-responsive">
                        <table className='table table-borderless table-striped'>
                          <thead >
                            <tr>
                            <th >Date</th>
                              <th >Name</th>
                              <th >Category</th>
                              <th >Payment_Via </th>
                              <th >Payment_Type</th>
                              <th >Slip_No</th>
                              <th >Payment_Out </th>
                              <th >Details</th>
                              <th >CUR_Country </th>
                              <th >CUR_Rate</th>
                              <th >Currency_Amount</th>
                              <th >Candidate</th>

                            </tr>
                          </thead>
                          <tbody className='p-0 m-0'>
                            {multiplePayment.length > 0 && multiplePayment.map((rowData, rowIndex) => (
                              <tr key={rowIndex} className='p-0 m-0'>
                                {Object.entries(rowData).map(([key, value], colIndex) => (
                                  <td key={colIndex} className='p-0 m-0'>
                                    <input
                                      type="text"
                                      className='m-0'
                                      value={value}
                                      onChange={(e) => handleInputChange(rowIndex, key, e.target.value)}
                                    />

                                  </td>
                                ))}
                              </tr>
                            ))}


                          </tbody>

                        </table>
                      </div>

                    </form>
                  </Paper>

                </div>
              </>
            }


            {single === 0 &&
              <>
                <div className="col-md-12 ">
                  {!option && <TableContainer component={Paper}>
                    <form className='py-3 px-2' onSubmit={handleForm}>
                      <div className="text-end ">
                        {close === false &&
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
                        }
                        <button className='btn submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Payment"}</button>
                        {/* <span className='btn submit_btn m-1 bg-primary border-0'><AddRoundedIcon fontSize='small'/></span> */}
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
                                const selectedSupplierData = supp_Payments_Out.find(
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
                            <option value="">Choose Supplier</option>
                            {supp_Payments_Out &&
                              supp_Payments_Out.map((data) => (
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
                          <label >Payment Out </label>
                          <input type="number" min="0" value={payment_Out} onChange={(e) => setPayment_Out(e.target.value)} required />
                        </div>

                        <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                          <label >Upload Slip </label>
                          <input type="file" accept='image/*' onChange={handleImage} />
                        </div>
                        <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                          <label >Date </label>
                          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
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
                      <span className='btn add_section_btn' style={!section ? { backgroundColor: 'var(--accent-lighter-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={handleSection}>{!section ? <AddIcon fontSize='small'></AddIcon> : <RemoveIcon fontSize='small'></RemoveIcon>}{!section ? "Add Currency" : "Remove"}</span>
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
                            <input type="number" min="0" value={curr_Rate} onChange={(e) => setCurr_Rate(e.target.value)} />
                          </div>
                          <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                            <label >Currency Amount </label>
                            <input type="number" value={curr_Amount} readOnly />
                          </div>
                        </div>}
                      {cand_Name &&
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
                            <input type="text" value={selectedPersonDetails.visa_Price_Out_PKR} readOnly />
                          </div>
                          <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                            <label >Remaining PKR</label>
                            <input type="text" value={selectedPersonDetails.remaining_Price} readOnly />
                          </div>
                          <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                            <label >Visa Price In Curr</label>
                            <input type="text" value={selectedPersonDetails.Visa_Price_Out_Curr} readOnly />
                          </div>
                          <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                            <label >Remaining Curr</label>
                            <input type="text" value={selectedPersonDetails.remaining_Curr} readOnly />
                          </div>
                        </div>

                      }

                    </form>
                  </TableContainer>}
                </div>


                {/* Details */}
                <div className="row payment_details mt-0">
                  <div className="col-md-12 my-2">
                    {selectedSupplier && <button className='btn detail_btn' onClick={handleOpen}>{option ? 'Hide Details' : "Show Details"}</button>}
                  </div>
                  {option && (
                    <div className="col-md-12 detail_table">
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead className="thead">
                            <TableRow>
                              <TableCell className='label border'>Date</TableCell>
                              <TableCell className='label border'>Category</TableCell>
                              <TableCell className='label border'>Payment_Via</TableCell>
                              <TableCell className='label border'>Payment_Type</TableCell>
                              <TableCell className='label border'>Slip_No</TableCell>
                              <TableCell className='label border'>Details</TableCell>
                              <TableCell className='label border'>Payment_Out</TableCell>
                              <TableCell className='label border'>Cash_Out</TableCell>
                              <TableCell className='label border'>Candidate</TableCell>
                              <TableCell className='label border'>Invoice</TableCell>
                              <TableCell className='label border'>Payment_Out_Curr</TableCell>
                              <TableCell className='label border'>CUR_Rate</TableCell>
                              <TableCell className='label border'>CUR_Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {supp_Payments_Out
                              .filter((data) => data.supplierName === selectedSupplier)
                              .map((filteredData) => (
                                // Map through the payment array
                                <>
                                  {filteredData.payment && filteredData.payment
                                    .filter((paymentItem) => paymentItem.cand_Name !== undefined)
                                    .map((paymentItem, index) => (
                                      <TableRow key={paymentItem._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                                        <TableCell className='border data_td text-center'>{paymentItem.date}</TableCell>
                                        <TableCell className='border data_td text-center'>{paymentItem.category}</TableCell>
                                        <TableCell className='border data_td text-center'>{paymentItem.payment_Via}</TableCell>
                                        <TableCell className='border data_td text-center'>{paymentItem.payment_Type}</TableCell>
                                        <TableCell className='border data_td text-center'>{paymentItem.slip_No}</TableCell>
                                        <TableCell className='border data_td text-center'>{paymentItem.details}</TableCell>
                                        <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{paymentItem?.payment_Out}</TableCell>
                                        <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.cash_Out}</TableCell>
                                        <TableCell className='border data_td text-center'>{paymentItem?.cand_Name}</TableCell>
                                        <TableCell className='border data_td text-center'>{paymentItem?.invoice}</TableCell>
                                        <TableCell className='border data_td text-center'>{paymentItem.payment_Out_Curr}</TableCell>
                                        <TableCell className='border data_td text-center'>{paymentItem?.curr_Rate}</TableCell>
                                        <TableCell className='border data_td text-center'>{paymentItem.curr_Amount}</TableCell>

                                      </TableRow>
                                    ))}
                                  {/* Move these cells inside the innermost map loop */}

                          <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell className='label border'>Total_Payment_Out</TableCell>
                          <TableCell className=' data_td text-center  bg-info text-white text-bold'>{filteredData.total_Payment_Out}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border'>Total_Payment_Out_Curr</TableCell>
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
                          <TableCell className='label border'>Remaining Total_Payment_Out_Curr</TableCell>
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
              </>
            }


          </div>
        </div>
      </div>
    </>
  )
}
