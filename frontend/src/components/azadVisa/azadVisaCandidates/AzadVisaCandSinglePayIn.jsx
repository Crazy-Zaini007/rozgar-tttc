import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../../hooks/userHooks/UserAuthHook'
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
import CategoryHook from '../../../hooks/settingHooks/CategoryHook'
import PaymentViaHook from '../../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../../hooks/settingHooks/PaymentTypeHook'
import CurrCountryHook from '../../../hooks/settingHooks/CurrCountryHook'
import AzadVisaHook from '../../../hooks/azadVisaHooks/AzadVisaHooks';
import Entry1 from './doubleEnrty/Entry1';
import * as XLSX from 'xlsx';

// import AddRoundedIcon from '@mui/icons-material/AddRounded';


const allKeys = [
  'date', 'supplierName','pp_No', 'category', 'payment_Via', 'payment_Type', 'slip_No',
  'payment_In', 'details', 'curr_Country', 'curr_Rate', 'curr_Amount'
];

const defaultValues = {
  'date': '',
  'supplierName': '',
  'pp_No':'',
  'category': '',
  'payment_Via': '',
  'payment_Type': '',
  'slip_No': '',
  'payment_In': 0,
  'details': '',
  'curr_Country': '',
  'curr_Rate': 0,
  'curr_Amount': 0
};

const errorKeys = [
  'paymentViaError', 'paymentTypeError', 'paymentCategoryError', 'nameError'
];

const initializeMissingFields = (entry) => {
  const initializedEntry = { ...entry };
  allKeys.forEach(key => {
    if (!initializedEntry.hasOwnProperty(key)) {
      initializedEntry[key] = defaultValues[key];
    } else if (typeof defaultValues[key] === 'number') {
      initializedEntry[key] = parseFloat(initializedEntry[key]);
    }
  });
  return initializedEntry;
};


export default function AzadVisaCandSinglePayIn() {
  const dispatch = useDispatch();
  // getting data from redux store 

  const currCountries = useSelector((state) => state.setting.currCountries);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const azadCand_Payments_In = useSelector((state) => state.azadVisa.azadCand_Payments_In)
  const [selectedSupplier, setSelectedSupplier] = useState('');

  const { getCurrCountryData } = CurrCountryHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const { getAzadCandPaymentsIn } = AzadVisaHook()

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
        getAzadCandPaymentsIn()

      ]);


    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData()
  }, [user, dispatch])


  const [option, setOption] = useState(false)
  const[isDownload,setIsdownload]=useState(false)
  // Form input States
  const [supplierName, setSupplierName] = useState('')
  const [pp_No, setPPNo] = useState('');
  const [category, setCategory] = useState('')
  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')
  const [slip_No, setSlip_No] = useState('')
  const [payment_In, setPayment_In] = useState()
  const [slip_Pic, setSlip_Pic] = useState('')
  const [details, setDetails] = useState('')
  const [curr_Country, setCurr_Country] = useState('')
  const [curr_Rate, setCurr_Rate] = useState(0)
  // const [open, setOpen] = useState(true)
  const [close, setClose] = useState(false)
  const [date, setDate] = useState('')
  let curr_Amount = (payment_In / curr_Rate).toFixed(2)


  const [single, setSingle] = useState(0)

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
    e.preventDefault();
    setLoading(true);
    setSupplierName('')
    setPPNo('')
    setCategory('');
    setPayment_Via('');
    setPayment_Type('');
    setSlip_No('');
    setPayment_In('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/azadVisa/candidates/add/payment_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierName,
          pp_No,
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_In,
          slip_Pic,
          details,
          curr_Country,
          curr_Rate,
          curr_Amount,
          // open,
          close,
          date
        }),
      });

      const json = await response.json();
      if (!response.ok) {

        setNewMessage(toast.error(json.message));
        setLoading(false)

      }
      if (response.ok) {
        setNewMessage(toast.success(json.message));
        getAzadCandPaymentsIn();
        setLoading(false);
        setSupplierName('')
        setPPNo('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setPayment_In('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };

  const [multiplePayment, setMultiplePayment] = useState([initializeMissingFields({})]);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (!file) {
      return;
    }
  
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
      setTriggerEffect(true);
    };
  
    fileReader.readAsBinaryString(file);
    e.target.value = null;
  };
  
  const parseExcelData = (data) => {
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dataArray = XLSX.utils.sheet_to_json(sheet);
  
    return dataArray.map((entry) => {
      const filteredEntry = Object.fromEntries(
        Object.entries(entry).filter(([key]) => !errorKeys.includes(key))
      );
  
      if (filteredEntry.date && !isNaN(filteredEntry.date)) {
        const excelDate = parseFloat(filteredEntry.date);
        const jsDate = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
        const formattedDate = `${jsDate.getFullYear()}-${String(jsDate.getMonth() + 1).padStart(2, '0')}-${String(jsDate.getDate()).padStart(2, '0')}`;
        filteredEntry.date = formattedDate;
      }
  
      return initializeMissingFields(filteredEntry);
    });
  };
  
  
  const handleInputChange = (rowIndex, key, value) => {
    const updatedData = [...multiplePayment];
    if (typeof defaultValues[key] === 'number') {
      updatedData[rowIndex][key] = parseFloat(value) || defaultValues[key];
    } else {
      updatedData[rowIndex][key] = value;
    }
    setMultiplePayment(updatedData);
  };


  // Downloading Errors
  const downloadErrorsDetails = (payments) => {
    const data = [];
    // Flatten the array of objects to get an array of individual payment
    // Iterate over individual payments and push all fields
    payments.forEach((payment) => {
      const rowData = {
        date: payment.date,
        supplierName:payment.supplierName,
        nameError:payment.nameError,
        pp_No:payment.pp_No,
        category: payment.category,
        paymentCategoryError:payment.paymentCategoryError,
        payment_Via: payment.payment_Via,
        paymentViaError:payment.paymentViaError,
        payment_Type: payment.payment_Type,
        paymentTypeError:payment.paymentTypeError,
        slip_No: payment.slip_No,
        details: payment.details,
        payment_In: payment.payment_In,
        curr_Country: payment.curr_Country,
        curr_Rate: payment.curr_Rate,
        curr_Amount: payment.curr_Amount
      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Payments Errors Details.xlsx`);
  }



  const handleUploadList =async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const response = await fetch(`${apiUrl}/auth/azadVisa/candidates/add/multiple/payment_in`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(multiplePayment)
      });

      const json = await response.json();
      if (response.ok) {
        const existingEntries = json.data;
        if(existingEntries.length>0){
          downloadErrorsDetails(existingEntries)
          setMultiplePayment(existingEntries)
        }else{
          setMultiplePayment('')

        }
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


  const handlePPNOInputChange = (e) => {
    const selectedValue = e.target.value;
    const [supplierNamePart, ppNoPart] = selectedValue.split('/').map(part => part.trim());
    setSupplierName(supplierNamePart);
    setSelectedSupplier(supplierNamePart)
    setPPNo(ppNoPart);
  };



  return (
    <>
      <div className="col-md-12">
        <Paper className='py-3 mb-1 px-2'>
          <h4>Candidate Payment In</h4>
          <button className='btn btn-sm  m-1 entry_btn' onClick={() => setSingle(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Single Payment-In</button>
          <button className='btn btn-sm  m-1 entry_btn' onClick={() => setSingle(1)} style={single === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Multiple Payment-In</button>
          {single === 1 && 
                <>
                <label className="btn m-1 btn-sm upload_btn">
                  Upload List
                  <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
             
                </>
                }
          <button className='btn btn-sm  m-1  entry_btn bg-danger border-0 text-white' onClick={() => setSingle(2)} style={single === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Double Entry</button>

        </Paper>
      </div>
      {single === 0 &&
        <div className="col-md-12 ">
          {!option &&
            <TableContainer component={Paper}>
              <form className='py-3 px-2' onSubmit={handleForm}>
                <div className="text-end ">
                <label htmlFor="">
                  Close
                  <input type="checkbox" value={close} onClick={() => setClose(!close)} />
                </label>

                  <button className='btn btn-sm submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Payment"}</button>
                  {/* <span className='btn btn-sm  submit_btn m-1 bg-primary border-0'><AddRoundedIcon fontSize='small'/></span> */}
                </div>
                <div className="row p-0 m-0 my-1">
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
              <label>Name</label>
              <input 
        list="name" 
        required 
        value={supplierName} 
        onChange={handlePPNOInputChange} 
      />
      <datalist id="name">
        {azadCand_Payments_In && 
          azadCand_Payments_In.map((data) => (
            <option key={data._id} value={`${data.supplierName}/${data.pp_No}`}>
              {`${data.supplierName}/${data.pp_No}`}
            </option>
          ))
        }
      </datalist>
      
              </div>
                 
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                <label >PP# </label>
                <input type="text" value={pp_No} disabled />
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
                    <label >Payment In </label>
                    <input type="number" min="0" value={payment_In} onChange={(e) => setPayment_In(e.target.value)} required />
                  </div>

                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label >Upload Slip </label>
                    <input type="file" accept='image/*' onChange={handleImage} />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label >Date </label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}  />
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
                      <input type="number"  value={curr_Rate} onChange={(e) => setCurr_Rate(parseFloat(e.target.value))} />
                    </div>
                    <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                      <label >Currency Amount </label>
                      <input type="number" value={curr_Amount} readOnly />
                    </div>
                  </div>}
              </form>
            </TableContainer>
          }
        </div>
      }

      {/* Details */}
      {single === 0 &&
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
                      <TableCell className='label border'>Date</TableCell>
                      <TableCell className='label border'>Category</TableCell>
                      <TableCell className='label border'>Payment_Via</TableCell>
                      <TableCell className='label border'>Payment_Type</TableCell>
                      <TableCell className='label border'>Slip_No</TableCell>
                      <TableCell className='label border'>Details</TableCell>
                      <TableCell className='label border'>Payment_In</TableCell>
                      <TableCell className='label border'>Cash_Out</TableCell>
                      <TableCell className='label border'>Invoice</TableCell>
                      <TableCell className='label border'>Payment_In_Curr</TableCell>
                      <TableCell className='label border'>CUR_Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {azadCand_Payments_In
                      .filter((data) => data.supplierName === selectedSupplier)
                      .map((filteredData) => (
                        // Map through the payment array
                        <>
                          {filteredData.payment && filteredData.payment?.map((paymentItem, index) => (
                            <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                              <TableCell className='border data_td text-center'>{paymentItem?.date}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.category}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.payment_Via}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.payment_Type}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.slip_No}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.details}</TableCell>
                              <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{paymentItem?.payment_In}</TableCell>
                              <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.cash_Out}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.invoice}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.payment_In_Curr}</TableCell>
                              <TableCell className='border data_td text-center'>{paymentItem?.curr_Amount}</TableCell>

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
                          <TableCell className=' data_td text-center  bg-info text-white text-bold'>{filteredData.total_Payment_In}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border'>Total_Payment_In_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Payment_In_Curr}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell className='label border'>Total_AzadVisa_Price_In_PKR</TableCell>
                          <TableCell className=' data_td text-center  bg-info text-white text-bold'>{filteredData.total_Visa_Price_In_PKR}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border'>Total_AzadVisa_Price_In_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Visa_Price_In_Curr}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border'>Remaining PKR</TableCell>
                          <TableCell className=' data_td text-center  bg-success text-white text-bold'>{filteredData.remaining_Balance}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border'>Remaining Total_Payment_In_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.remaining_Curr}</TableCell>
                        </TableRow>
                        </>
                      ))}

                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}

        </div>
      }

      {/* Multiple Entry */}
      {single === 1 &&
        <>
          <div className="col-md-12 multiple_form">

          <Paper>
                  <form className='py-0 px-2' onSubmit={handleUploadList}>
                    <div className="text-end">
                      <button className='btn submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Payment"}</button>
                    </div>
                    <div className="table-responsive">
                      <table className='table table-borderless table-striped'>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>PP#</th>
                            <th>Category</th>
                            <th>Payment Via</th>
                            <th>Payment Type</th>
                            <th>Slip No</th>
                            <th>Payment In</th>
                            <th>Details</th>
                            <th>Currency Country</th>
                            <th>Currency Rate</th>
                            <th>Currency Amount</th>
                          </tr>
                        </thead>
                        <tbody className='p-0 m-0'>
                        {multiplePayment && multiplePayment.map((rowData, rowIndex) => (
                              <tr key={rowIndex}>
                                {allKeys.map((key, colIndex) => (
                                  <td key={colIndex}>
                                    <input className='p-1'
                                      type="text"
                                      value={rowData[key] || ""}
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

      {single === 2 &&
        <Entry1></Entry1>
      }
    </>
  )
}
