import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import ExpeCategoryHook from '../../hooks/settingHooks/ExpeCategoryHook'
import PaymentViaHook from '../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../hooks/settingHooks/PaymentTypeHook'
import CurrCountryHook from '../../hooks/settingHooks/CurrCountryHook'
import { addExpense } from '../../redux/reducers/expenseSlice';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function AddExpense() {
    const dispatch = useDispatch();
    // getting data from redux store 
    const currCountries = useSelector((state) => state.setting.currCountries);
    const paymentVia = useSelector((state) => state.setting.paymentVia);
    const paymentType = useSelector((state) => state.setting.paymentType);
    const expenseCategories = useSelector((state) => state.setting.expenseCategories);
    
    const { getCurrCountryData } = CurrCountryHook()
    const { getExpenseCategoryData } = ExpeCategoryHook()
    const { getPaymentViaData } = PaymentViaHook()
    const { getPaymentTypeData } = PaymentTypeHook()


    // getting Data from DB
    const { user } = useAuthContext()
    const fetchData = async () => {
        try {
            // Use Promise.all to execute all promises concurrently
            await Promise.all([

                getCurrCountryData(),
                getExpenseCategoryData(),
                getPaymentViaData(),
                getPaymentTypeData(),


            ]);

        } catch (error) {
        }
    };

    useEffect(() => {
        fetchData()
    }, [user, dispatch])

    // Form input States
    const [date, setDate] = useState('')
    const [expCategory, setExpCategory] = useState('')
    const [name, setName] = useState('')
    const [payment_Out, setPayment_Out] = useState('')
    const [payment_Via, setPayment_Via] = useState('')
    const [payment_Type, setPayment_Type] = useState('')
    const [slip_No, setSlip_No] = useState('')
    const [slip_Pic, setSlip_Pic] = useState('')
    const [details, setDetails] = useState('')
    const [curr_Country, setCurr_Country] = useState('')
    const [curr_Rate, setCurr_Rate] = useState()
    let curr_Amount = Math.round(payment_Out / curr_Rate);


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
        setName('')
        setExpCategory('');
        setPayment_Via('');
        setPayment_Type('');
        setSlip_No('');
        setSlip_Pic('');
        setDetails('');
        setCurr_Country('');
        setCurr_Rate('');
        setDate('')
        try {
            const response = await fetch(`${apiUrl}/auth/expenses/add/expense`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    name,
                    expCategory,
                    payment_Out,
                    payment_Via,
                    payment_Type,
                    slip_No,
                    slip_Pic,
                    details,
                    curr_Country,
                    curr_Rate,
                    curr_Amount,
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
                dispatch(addExpense(json.data))
                setLoading(false);
                setName('')
                setExpCategory('');
                setPayment_Via('');
                setPayment_Type('');
                setSlip_No('');
                setSlip_Pic('');
                setDetails('');
                setCurr_Country('');
                setCurr_Rate('');
                setDate('')

            }

        } catch (error) {

            setNewMessage(toast.error('Server is not Responding...'));
            setLoading(false);
        }
    };



    const collapsed = useSelector((state) => state.collapsed.collapsed);
    return (
      <>
      <div className={`${collapsed ?"collapsed":"main"}`}>
                <div className="container-fluid payment_form">
                    <div className="row">
                        <div className="col-md-12">
                            <Paper className='py-3 mb-1 px-2'>
                                <h4>Adding Expenses</h4>
                            </Paper>
                        </div>
                        <div className="col-md-12 ">
                            <TableContainer component={Paper}>
                                <form className='py-3 px-2' onSubmit={handleForm}>
                                    <div className="text-end ">
                                        <button className='btn btn-sm  submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Expense"}</button>
                                        {/* <span className='btn btn-sm  submit_btn m-1 bg-primary border-0'><AddRoundedIcon fontSize='small'/></span> */}
                                    </div>
                                    <div className="row p-0 m-0 my-1">
                                        <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                                            <label >Date </label>
                                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}  />
                                        </div>

                                        <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                                            <label >Expense Category </label>
                                            <select value={expCategory} onChange={(e) => setExpCategory(e.target.value)} required>
                                                <option value="">Choose</option>
                                                {expenseCategories && expenseCategories.map((data) => (
                                                    <option key={data._id} value={data.category}>{data.category}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                                            <label >Expense Person </label>
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </div>
                                        <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                                            <label >Expense Amount </label>
                                            <input type="number" value={payment_Out} onChange={(e) => setPayment_Out(e.target.value)} required />
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
                                            <label >Upload Slip </label>
                                            <input type="file" accept='image/*' onChange={handleImage} />
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
                                                <input type="number" min="0" value={curr_Rate} onChange={(e) => setCurr_Rate(e.target.value)} />
                                            </div>
                                            <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 p-1 my-1">
                                                <label >Currency Amount </label>
                                                <input type="number" value={curr_Amount} readOnly />
                                            </div>
                                        </div>}
                                </form>
                            </TableContainer>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
