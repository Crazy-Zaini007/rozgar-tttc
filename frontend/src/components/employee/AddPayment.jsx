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
import EmployeeHook from '../../hooks/employeeHooks/EmployeeHook';
import AddPaymentReturn from './AddPaymentReturn.jsx';

// import AddRoundedIcon from '@mui/icons-material/AddRounded';
import * as XLSX from 'xlsx';



const allKeys = [
  'date', 'employeeName', 'category', 'payment_Via', 'payment_Type', 'slip_No', 
  'payment_Out', 'details', 'curr_Country', 'curr_Rate', 'curr_Amount'
];

const defaultValues = {
  'date': '',
  'employeeName': '',
  'category': '',
  'payment_Via': '',
  'payment_Type': '',
  'slip_No': '',
  'payment_Out': 0,
  'details': '',
  'curr_Country': '',
  'curr_Rate': 0,
  'curr_Amount': 0
};

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
}

export default function AddPayment() {
  const dispatch = useDispatch();
  // getting data from redux store 

  const currCountries = useSelector((state) => state.setting.currCountries);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const employees = useSelector((state) => state.employees.employees)
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const { getCurrCountryData } = CurrCountryHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const { getEmployees } = EmployeeHook()

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
        getEmployees()

      ]);


    } catch (error) {
    }
  };
  
  const [option, setOption] = useState(false)
  const[isDownload,setIsdownload]=useState(false)
  // Form input States
  const [employeeName, setEmployeeName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [category, setCategory] = useState('')
  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')
  const [slip_No, setSlip_No] = useState('')
  const [payment_Out, setPayment_Out] = useState()
  const [slip_Pic, setSlip_Pic] = useState('')
  const [details, setDetails] = useState('')
  const [curr_Country, setCurr_Country] = useState('')
  const [curr_Rate, setCurr_Rate] = useState(0)
  const [open, setOpen] = useState(true)
  const [close, setClose] = useState(false)
  const [date, setDate] = useState('')

  let curr_Amount = (payment_Out / curr_Rate).toFixed(2)
  const handleOpen = () => {
    setOption(!option)
  }

  const [section, setSection] = useState(false)


  const handleSection = () => {
    setSection(!section)
    setCurr_Country('')
    setCurr_Rate('')

  }

  useEffect(() => {
    fetchData()
    // handle employeeId
    if (employeeName) {
      const employee = employees.find(emp => emp.employeeName === employeeName); // Find the employee object based on the selected name
      if (employee) {
        setEmployeeId(employee._id); // Set the employeeId as the _id of the selected employee
       
      }
    }
  }, [user, dispatch, employeeName])

  const apiUrl = process.env.REACT_APP_API_URL;


  // Submitting Form Data
  const [loading, setLoading] = useState(null)
  const [, setNewMessage] = useState('')
  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    try {
      const response = await fetch(`${apiUrl}/auth/employees/add/employee/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          employeeId,
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
        getEmployees();
        setLoading(false);
        setEmployeeId('')
        setEmployeeName('')
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
        setOpen(true)
        setClose(false);
      }

    } catch (error) {
   
      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };

  const [single, setSingle] = useState(0)

  const setEntry = (index) => {
    setSingle(index)
  }

  const [multiplePayment, setMultiplePayment] = useState([initializeMissingFields({})]);
  const [triggerEffect, setTriggerEffect] = useState(false);

  
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
  
    return dataArray.map((entry, rowIndex) => {
      return initializeMissingFields(
        Object.fromEntries(
          Object.entries(entry).map(([key, value]) => {
            const trimmedValue = typeof value === 'string' ? value.trim() : value;
  
            if (key === 'date' && !isNaN(trimmedValue) && trimmedValue !== '') {
              const dateValue = new Date(Math.round((trimmedValue - 25569) * 86400 * 1000));
              return [key, !isNaN(dateValue.getTime()) ? dateValue.toISOString().split('T')[0] : undefined];
            }
  
            return [key, trimmedValue === '' ? undefined : trimmedValue];
          })
        )
      );
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

  const handleUploadList =async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const response = await fetch(`${apiUrl}/auth/employees/add/employee/multiple/payment`, {
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
        // Assuming each entry has a unique identifier, e.g., 'id'
        const existingEntryIds = new Set(existingEntries.map(entry => (entry.date&&entry.supplierName&&entry.category&&entry.payment_Via&&entry.payment_Type&&entry.slip_No&&entry.payment_In )));
        const filteredEntries = multiplePayment.filter(entry => !existingEntryIds.has(entry.date&&entry.supplierName&&entry.category&&entry.payment_Via&&entry.payment_Type&&entry.slip_No&&entry.payment_In ));
        setMultiplePayment(filteredEntries);
        setTimeout(() => {
          if(filteredEntries.length>0){
            setIsdownload(true)
          }
        }, 1000);
        
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


  
  const downloadIndividualPayments = () => {
    const data = [];
    // Flatten the array of objects to get an array of individual payments
    // Iterate over individual payments and push all fields
    multiplePayment.forEach((payment) => {
      const rowData = {
        date: payment.date,
        employeeName: payment.employeeName,
        category: payment.category,
        payment_Via: payment.payment_Via,
        payment_Type: payment.payment_Type,
        Details: payment.details,
        slip_No: payment.slip_No,
        payment_Out: payment.payment_Out,
        details: payment.details,
        curr_Country: payment.curr_Country,
        curr_Rate: payment.curr_Rate,
        curr_Amount: payment.curr_Amount
      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Remaining Payments.xlsx`);
  }

  const collapsed = useSelector((state) => state.collapsed.collapsed);
  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid payment_form">
          <div className="row">
            <div className="col-md-12 p-0 border-0 border-bottom">
              <div className='py-3 mb-1 px-2'>
                <h4>Employee Payment</h4>
                <button className='btn m-1  btn-sm entry_btn' onClick={() => setEntry(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Single Payment</button>
                <button className='btn m-1 btn-sm entry_btn' onClick={() => setEntry(1)} style={single === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Multiple Payment</button>
                <button className='btn m-1 btn-sm entry_btn' onClick={() => setEntry(2)} style={single === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Payment Return</button>
                {single === 1 && 
                <>
                <label className="btn m-1 btn-sm upload_btn">
                  Upload New List
                  <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              <button className='btn m-1  btn-sm upload_btn text-sm' onClick={() => downloadIndividualPayments()} disabled={multiplePayment.length<1}>Download</button>
                </>
                }
              </div>
            </div>
            {single === 1 &&
              <>
                <div className="col-md-12 multiple_form p-0">

                  <div>
                    <form className='py-0 px-2' onSubmit={handleUploadList} >
                      <div className="text-end">
                      <button className='btn btn-sm  submit_btn m-1' disabled={loading}>{loading?"Adding...":"Add Payment"}</button>
                      </div>
                      <div className="table-responsive">
                        <table className='table table-borderless table-striped'>
                          <thead >
                            <tr >
                              <th >Date</th>
                              <th >Employee Name</th>
                              <th >Category</th>
                              <th >Payment_Via </th>
                              <th >Payment_Type</th>
                              <th >Slip_No</th>
                              <th >Payment_Out </th>
                              <th >Details</th>
                              <th >CUR_Country </th>
                              <th >CUR_Rate</th>
                              <th >Currency_Amount</th>

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
                  </div>

                </div>
              </>
            }
            {single===0 &&
            <>
            <div className="col-md-12 p-0">
              {!option && <TableContainer >
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

                    <button className='btn btn-sm  submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Payment"}</button>
                    {/* <span className='btn btn-sm  submit_btn m-1 bg-primary border-0'><AddRoundedIcon fontSize='small'/></span> */}
                  </div>
                  <div className="row p-0 m-0 my-1">

                    <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                      <label>Name</label>
                      <select required value={employeeName} onChange={(e) => {
                        setEmployeeName(e.target.value)
                        setSelectedEmployee(e.target.value)
                      }}>
                        <option value="">Choose Employee</option>
                        {employees &&
                          employees.map((data) => (
                            <option key={data._id} value={data.employeeName}>
                              {data.employeeName}
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
                        <input type="number" value={curr_Rate} onChange={(e) => setCurr_Rate(parseFloat(e.target.value))} />
                      </div>
                      <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                        <label >Currency Amount </label>
                        <input type="number" value={curr_Amount} readOnly />
                      </div>
                    </div>}
                </form>
              </TableContainer>}
            </div>


            {/* Details */}
            <div className="row payment_details mt-0">
              <div className="col-md-12 my-2">
                {selectedEmployee && <button className='btn btn-sm  detail_btn' onClick={handleOpen}>{option ? 'Hide Details' : "Show Details"}</button>}
              </div>
              {option && (
                <div className="col-md-12 detail_table p-0">
                  <TableContainer>
                    <Table aria-label="customized table">
                      <TableHead className="thead">
                        <TableRow>
                          <TableCell className='label border' >Date</TableCell>
                          <TableCell className='label border' >Category</TableCell>
                          <TableCell className='label border' >Payment_Via</TableCell>
                          <TableCell className='label border' >Payment_Type</TableCell>
                          <TableCell className='label border' >Slip_No</TableCell>
                          <TableCell className='label border' >Details</TableCell>
                          <TableCell className='label border' >Payment_Out</TableCell>
                          <TableCell className='label border' >Cash_Return</TableCell>
                          <TableCell className='label border' >Invoice</TableCell>
                          <TableCell className='label border' >Payment_In_Curr</TableCell>
                          <TableCell className='label border' >CUR_Rate</TableCell>
                          <TableCell className='label border' >CUR_Amount</TableCell>


                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employees
                          .filter((data) => data.employeeName === selectedEmployee)
                          .map((filteredData) => (
                            // Map through the payment array
                            <>
                              {filteredData.employeePayments && filteredData.employeePayments?.map((paymentItem, index) => (
                                <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                                  <TableCell className='border data_td text-center' >{paymentItem?.date}</TableCell>
                                  <TableCell className='border data_td text-center' >{paymentItem?.category}</TableCell>
                                  <TableCell className='border data_td text-center' >{paymentItem?.payment_Via}</TableCell>
                                  <TableCell className='border data_td text-center' >{paymentItem?.payment_Type}</TableCell>
                                  <TableCell className='border data_td text-center' >{paymentItem?.slip_No}</TableCell>
                                  <TableCell className='border data_td text-center' >{paymentItem?.details}</TableCell>
                                  <TableCell className='border data_td text-center' ><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.payment_Out}</TableCell>
                                  <TableCell className='border data_td text-center' ><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{paymentItem?.cash_Out}</TableCell>
                                  <TableCell className='border data_td text-center' >{paymentItem?.invoice}</TableCell>
                                  <TableCell className='border data_td text-center' >{paymentItem?.payment_Out_Curr}</TableCell>
                                  <TableCell className='border data_td text-center' >{paymentItem?.curr_Rate}</TableCell>
                                  <TableCell className='border data_td text-center' >{paymentItem?.curr_Amount}</TableCell>

                                </TableRow>
                              ))}



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

            {single==2 &&
            <AddPaymentReturn></AddPaymentReturn>
            }
          </div>
        </div>
      </div>

    </>
  )
}
