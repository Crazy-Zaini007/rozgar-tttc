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
import VisitHook from '../../../hooks/visitsHooks/VisitHook';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function VisitCandPayOutReturn() {
  const dispatch = useDispatch();
  // getting data from redux store 

  const currCountries = useSelector((state) => state.setting.currCountries);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const visitCand_Payments_Out = useSelector((state) => state.visits.visitCand_Payments_Out)
  const [selectedSupplier, setSelectedSupplier] = useState('');

  const { getCurrCountryData } = CurrCountryHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const { getVisitCandPaymentsOut } = VisitHook()

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
        getVisitCandPaymentsOut()

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
  const [pp_No, setPPNo] = useState('');
  const [category, setCategory] = useState('')
  const [payment_Via, setPayment_Via] = useState('')
  const [payment_Type, setPayment_Type] = useState('')
  const [slip_No, setSlip_No] = useState('')
  const [cash_Out, setCash_Out] = useState()
  const [slip_Pic, setSlip_Pic] = useState('')
  const [details, setDetails] = useState('')
  const [curr_Country, setCurr_Country] = useState('')
  const [curr_Rate, setCurr_Rate] = useState(0)
  // const [open, setOpen] = useState(true)
  const [close, setClose] = useState(false)
  const [date, setDate] = useState('')
  let curr_Amount = (cash_Out / curr_Rate).toFixed(2)
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
    setCash_Out('');
    setSlip_Pic('');
    setDetails('');
    setCurr_Country('');
    setCurr_Rate('');
    setDate('')
    try {
      const response = await fetch(`${apiUrl}/auth/visit/candidates/payment_in/cash_out`, {
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
          cash_Out,
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
        getVisitCandPaymentsOut();
        setNewMessage(toast.success(json.message));
        setLoading(false);
        setSupplierName('')
        setPPNo('')
        setCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setCash_Out('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setSelectedSupplier('')
        setCurr_Rate('');
        setClose(false);
        setDate('')
      }

    } catch (error) {

      setNewMessage(toast.error('Server is not Responding...'));
      setLoading(false);
    }
  };


  const handlePPNOInputChange = (e) => {
    const selectedValue = e.target.value;
    const [supplierNamePart, ppNoPart] = selectedValue.split('/').map(part => part.trim());
    setSupplierName(supplierNamePart);
    setSelectedSupplier(supplierNamePart)
    setPPNo(ppNoPart);
  };
  return (
    <>
      <div className="col-md-12 ">
        {!option && <TableContainer component={Paper}>
          <form className='py-3 px-2' onSubmit={handleForm}>
            <div className="text-end ">
            <label htmlFor="">
                  Close
                  <input type="checkbox" value={close} onClick={() => setClose(!close)} />
                </label>

              <button className='btn btn-sm  submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Payment"}</button>
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
        {visitCand_Payments_Out && 
          visitCand_Payments_Out.map((data) => (
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
          {selectedSupplier && <button className='btn btn-sm  detail_btn' onClick={handleOpen}>{option ? 'Hide Details' : "Show Details"}</button>}
        </div>
        {option && (
         <>
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
                    <TableCell className='label border'>Payment_Out</TableCell>
                    <TableCell className='label border'>Cash_Out</TableCell>
                    <TableCell className='label border'>Invoice</TableCell>
                    <TableCell className='label border'>Payment_Out_Curr</TableCell>
                    <TableCell className='label border'>CUR_Amount</TableCell>


                  </TableRow>
                </TableHead>
                <TableBody>
                  {visitCand_Payments_Out
                    .filter((data) => data.supplierName === selectedSupplier)
                    .map((filteredData) => (
                      // Map through the payment array
                      <>
                        {filteredData.payment.map((paymentItem, index) => (
                          <TableRow key={paymentItem._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                            <TableCell className='border data_td text-center'>{paymentItem.date}</TableCell>
                            <TableCell className='border data_td text-center'>{paymentItem.category}</TableCell>
                            <TableCell className='border data_td text-center'>{paymentItem.payment_Via}</TableCell>
                            <TableCell className='border data_td text-center'>{paymentItem.payment_Type}</TableCell>
                            <TableCell className='border data_td text-center'>{paymentItem.slip_No}</TableCell>
                            <TableCell className='border data_td text-center'>{paymentItem.details}</TableCell>
                            <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{paymentItem?.payment_Out}</TableCell>
                            <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.cash_Out}</TableCell>
                            <TableCell className='border data_td text-center'>{paymentItem?.invoice}</TableCell>
                            <TableCell className='border data_td text-center'>{paymentItem.payment_Out_Curr}</TableCell>
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

                          <TableCell className='label border'>Total_AzadVisa_Price_Out_PKR</TableCell>
                          <TableCell className=' data_td text-center  bg-info text-white text-bold'>{filteredData.total_Visa_Price_Out_PKR}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className='label border'>Total_AzadVisa_Price_Out_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.total_Visa_Price_Out_Curr}</TableCell>
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
                          <TableCell className='label border'>Remaining Total_Payment_Out_Curr</TableCell>
                          <TableCell className=' data_td text-center  bg-danger text-white text-bold'>{filteredData.remaining_Curr}</TableCell>
                        </TableRow>
                      </>
                    ))}

                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="col-md-12 detail_table my-2">
              <h6>Persons Details</h6>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead className="thead">
                    <TableRow>
                      <TableCell className='label border'>SN</TableCell>
                      <TableCell className='label border'>Date</TableCell>
                      <TableCell className='label border'>Name</TableCell>
                      <TableCell className='label border'>PP#</TableCell>
                      <TableCell className='label border'>Entry_Mode</TableCell>
                      <TableCell className='label border'>Company</TableCell>
                      <TableCell className='label border'>Final_Status</TableCell>
                      <TableCell className='label border'>Flight_Date</TableCell>
                      <TableCell className='label border'>VPI_PKR</TableCell>
                      <TableCell className='label border'>VPI_Oth_Curr</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visitCand_Payments_Out
                      .filter(data => data.supplierName === selectedSupplier&&data.pp_No === pp_No)
                      .map((person, index) => (
                        <TableRow key={person._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                          <TableCell className='border data_td text-center'>{index + 1}</TableCell>
                          <TableCell className='border data_td text-center'>{person?.createdAt}</TableCell>
                          <TableCell className='border data_td text-center'>{person?.supplierName}</TableCell>
                          <TableCell className='border data_td text-center'>{person?.pp_No}</TableCell>
                          <TableCell className='border data_td text-center'>{person?.entry_Mode}</TableCell>
                          <TableCell className='border data_td text-center'>{person?.company}</TableCell>
                          <TableCell className='border data_td text-center'>{person?.final_Status}</TableCell>
                          <TableCell className='border data_td text-center'>{person?.flight_Date}</TableCell>
                          <TableCell className='border data_td text-center'>{person?.total_Visa_Price_Out_PKR}</TableCell>
                          <TableCell className='border data_td text-center'>{person?.total_Visa_Price_Out_Curr}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>

                </Table>
              </TableContainer>
              <hr className='my-2 ' />

            </div>
         </>
        )}

{visitCand_Payments_Out
          .filter(data => data.supplierName === selectedSupplier&&data.pp_No === pp_No)
          .map((person, index) => (
            <>
              <form>
                <div className="row p-0 m-0 mt-2">
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Candidate Name</label>
                    <input disabled
                      type="text"
                      value={person.supplierName}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>PP#</label>
                    <input disabled
                      type="text"
                      value={person.pp_No}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Entry Mode</label>
                    <input disabled
                      type="text"
                      value={person.entry_Mode}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Country</label>
                    <input disabled
                      type="text"
                      value={person.country}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Final Status</label>
                    <input disabled
                      type="text"
                      value={person.final_Status}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Flight Date</label>
                    <input disabled
                      type="text"
                      value={person.flight_Date}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Company</label>
                    <input disabled
                      type="text"
                      value={person.company}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Visa Price In PKR</label>
                    <input disabled
                      type="text"
                      value={Math.round(person.total_Visa_Price_Out_PKR)}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label >Total In PKR</label>
                    <input type="text" disabled value={Math.round(person.total_Payment_Out)} readOnly />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label >New Total In PKR</label>
                    <input type="text" disabled value={
                      person.total_Payment_Out - parseInt(cash_Out, 10)
                    } readOnly />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Remaining PKR</label>
                    <input
                      disabled
                      type="text"
                      value={Math.round(person.remaining_Balance)}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>New Remaining PKR</label>
                    <input
                      disabled
                      type="text"
                      value={Math.round(person.remaining_Balance)+Math.round(cash_Out)}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Visa Price In Curr</label>
                    <input
                      disabled
                      type="text"
                      value={Math.round(person.total_Visa_Price_Out_Curr)}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Total Paid Curr</label>
                    <input
                      disabled
                      type="text"
                      value={Math.round(person.total_Payment_Out_Curr)}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>New Total Paid Curr</label>
                    <input
                      disabled
                      type="text"
                      value={Math.round(person.total_Payment_Out_Curr - curr_Amount)}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>Remaining Curr</label>
                    <input
                      disabled
                      type="text"
                      value={person.remaining_Curr}
                      readOnly
                    />
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                    <label>New Remaining Curr</label>
                    <input
                      disabled
                      type="text"
                      value={Math.round(person.remaining_Curr + curr_Amount)}
                      readOnly
                    />
                  </div>
                </div>
              </form>
              {/* <div className="row p-0 m-0 mt-2 justify-content-center">
                <div className="col-md-2 col-sm-12">
                <button className='btn btn-sm  shadow bg-success text-white'  onClick={() => printPersonsTable(person)}>Print</button>
                </div>
              </div> */}


            </>
          ))}
      </div>
    </>
  )
}
