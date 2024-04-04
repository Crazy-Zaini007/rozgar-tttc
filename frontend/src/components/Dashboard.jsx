import {React,useState,useEffect} from 'react'
import { useAuthContext } from '../hooks/userHooks/UserAuthHook'
import EntryHook from '../hooks/entryHooks/EntryHook';
import { useSelector } from 'react-redux';
import CashInHandHook from '../hooks/cashInHandHooks/CashInHandHook'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CircularProgress from '@mui/material/CircularProgress';
import { green, pink,deepOrange,purple,red   } from '@mui/material/colors';
import { Link } from 'react-router-dom';
export default function AdminDashboard() {

  const { user } = useAuthContext()
  const { getEntries } = EntryHook()

  const {getCashInHandData,getOverAllPayments,overAllPayments}=CashInHandHook()

  const enteries = useSelector((state) => state.enteries.enteries);
  const cashInHand = useSelector((state) => state.cashInHand.cashInHand);

  const[totalAdvancePaymentIn,setTotalAdvancePaymentIn]=useState()
  const[totalAdvancePaymentOut,setTotalAdvancePaymentOut]=useState()
  const[todayAdvancePaymentIn,setTodayAdvancePaymentIn]=useState()
  const[todayAdvancePaymentOut,setTodayAdvancePaymentOut]=useState()
  const[todayTotalCashIn,setTodayTotalCashIn]=useState()
  const[todayTotalCashOut,setTodayTotalCashOut]=useState()
const[loading1,setLoading1]=useState(false)
const[loading2,setLoading2]=useState(false)
const[loading3,setLoading3]=useState(false)
const[loading4,setLoading4]=useState(false)

const apiUrl = process.env.REACT_APP_API_URL;


  const getCash = async () => {
  
    try {
      const response = await fetch(`${apiUrl}/auth/reports/get/all/advance_payments`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      })

      const json = await response.json();
     
      if (response.ok) {
        setTotalAdvancePaymentIn(json.totalAdvancePaymentIn)
        setTotalAdvancePaymentOut(json.totalAdvancePaymentOut)
        setTodayAdvancePaymentIn(json.todayAdvancePaymentIn)
        setTodayAdvancePaymentOut(json.todayAdvancePaymentOut)
        setTodayTotalCashIn(json.todayCashIn)
        setTodayTotalCashOut(json.todayCashOut)
        
      }
    }
    catch (error) {
      console.error('Fetch error:', error);
      
    }
  }


// fteching Data from DB
const fetchData = async () => {
  try {
    setLoading1(true)
    setLoading2(true)
    setLoading3(true)
    setLoading4(true)
    await getEntries();
    setLoading1(false)
    await getCashInHandData();
    setLoading2(false)
    await getOverAllPayments();
    setLoading3(false)

    await getCash()
    setLoading4(false)

    
  } catch (error) {
    setLoading1(false)
    setLoading2(false)
    setLoading3(false)
    setLoading4(false)
  }
};


useEffect(() => {

    fetchData()
  
}, []);


const currentDate = new Date().toISOString().split('T')[0];

// Filter payments based on the current date
const todayPayments =overAllPayments && overAllPayments.filter(payment => payment.date === currentDate);


  return (
    <div className="main">
    <div className="container-fluid admin-dashboard mt-3">
     <div className="row px-3 ">
      <h4>Admin Dashboard</h4>
        <div className="col-md-12 admin-main p-0">
          <div className="row p-0 ">
            <div className="col-sm-6 col-sm-12 col-md-4 my-1 p-1   rounded">
             <Paper className="data p-3 rounded border m-0 ">
           <Link to='/rozgar/enteries/reports_details'>
           <div className="d-flex justify-content-between pt-2 pb-1 mt-2">
            <div className=" ">
              <div className="side">
                <Avatar   sx={{ width: 40, height: 40, bgcolor: green[400]  }}><ConfirmationNumberIcon/></Avatar>
              
              </div>
            </div>
            <div className="side text-end">
            {loading1 ? <CircularProgress  sx={{ width: 25, height: 25  }}  disableShrink />:<h5>{enteries ? enteries.filter(entry => (entry.final_Status.toLowerCase() === "visa issued") ||(entry.final_Status.toLowerCase() === "visa issue") ).length:0 }</h5> }
                
                <h6 className='ml-2'>Total Visa Issued</h6>
            
            </div>
          </div> 
           </Link>
        
             </Paper>
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-1 p-1  ">
            <Paper className="data p-3 rounded border ">
            <Link to='/rozgar/enteries/reports_details'>
            <div className="d-flex justify-content-between pt-2 pb-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{ width: 40, height: 40, bgcolor: purple [400]  }}><AirplaneTicketIcon/></Avatar>
             
              </div>
            </div>
            <div className="side text-end ">
            {loading1 ? <CircularProgress  sx={{ width: 25, height: 25  }}  disableShrink />:<h5>{enteries ? enteries.filter(entry => !(entry.flight_Date.toLowerCase() === "no fly" || entry.flight_Date.toLowerCase() === "not fly")).length:0 }</h5> }
                <h6 className='ml-2'>Total Fly <br /> </h6>
            </div>
          </div> 
            </Link>
          
            </Paper>
           
            </div>
            <div className="col-sm-6 col-sm-12 col-md-4 my-1 p-1 ">
           
            <Paper className="data p-3 border rounded">
            <Link to='/rozgar/cash_in_hand'>
            <div className="d-flex justify-content-between pt-2 pb-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{ width: 40, height: 40, bgcolor: green [500]  }}><MonetizationOnIcon/></Avatar>
           
              </div>
            </div>
            <div className="side text-end">
            {loading2 ? <CircularProgress  sx={{ width: 25, height: 25  }}  disableShrink />:<h5>{ cashInHand && cashInHand.total_Cash ? cashInHand.total_Cash:0}</h5> }
            <h6 className='ml-2'>Cash In Hand</h6>
            </div>
          </div> 
            </Link>
          
            </Paper>
            </div>
            <div className="col-sm-6 col-sm-12 col-md-4 my-1 p-1">          
            <Paper className="data p-3 rounded border">
            <div className="d-flex justify-content-between pt-2 pb-1 mt-2">
            <div className=" ">
              <div className="side">
              <Avatar   sx={{ width: 40, height: 40, bgcolor: green [500]  }}><AddCardIcon/></Avatar>

            
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <CircularProgress  sx={{ width: 25, height: 25  }}  disableShrink />:<h5>{ todayTotalCashIn && todayTotalCashIn>0 ?todayTotalCashIn :0}</h5> }

<h6 className='ml-2'>Today Cash In</h6>
            </div>
          </div> 
          
            </Paper>
            </div>
         
            <div className="col-sm-6 col-sm-12 col-md-4 my-1 p-1">
             <Paper className="data p-3 rounded border">
             <div className="d-flex justify-content-between pt-2 pb-1 mt-2">
            <div className=" ">
              <div className="side">
              <Avatar   sx={{ width: 40, height: 40, bgcolor: red [500]  }}><CreditCardIcon/></Avatar>
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <CircularProgress  sx={{ width: 25, height: 25  }}  disableShrink />:<h5>{ todayTotalCashOut && todayTotalCashOut>0 ? todayTotalCashOut:0}</h5> }

                <h6 className='ml-2'>Today Cash Out</h6>
            </div>
          </div> 
          

             </Paper>
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-1 p-1 ">
            <Paper className="data p-3 rounded border">
            <div className="d-flex justify-content-between pt-2 pb-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{ width: 40, height: 40, bgcolor: green [500]  }}><ArrowDownwardIcon/></Avatar>

             
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <CircularProgress  sx={{ width: 25, height: 25  }}  disableShrink />:<h5>{ todayAdvancePaymentIn && todayAdvancePaymentIn>0 ?todayAdvancePaymentIn:0}</h5> }
                
                <h6 className='ml-2'>Today Advance In</h6>
            </div>
          </div> 
          

            </Paper>


            </div>
            <div className="col-sm-6 col-sm-12 col-md-4 my-1 p-1 ">
           
            <Paper className="data p-3 rounded border">
            <div className="d-flex justify-content-between pt-2 pb-1 mt-2">
            <div className=" ">
              <div className="side ">
              <Avatar   sx={{ width: 40, height: 40, bgcolor: red [500]  }}><ArrowUpwardIcon/></Avatar>

              
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <CircularProgress  sx={{ width: 25, height: 25  }}  disableShrink />:<h5>{ todayAdvancePaymentOut && todayAdvancePaymentOut>0 ?todayAdvancePaymentOut :0}</h5> }

<h6 className='ml-2'>Today Advance Out</h6>
            
            </div>
          </div> 
          
            </Paper>
            </div>
            <div className="col-sm-6 col-sm-12 col-md-4 my-1 p-1 ">          
            <Paper className="data p-3 rounded border">
            <div className="d-flex justify-content-between pt-2 pb-1 mt-2">
            <div className=" ">
              <div className="side">
              <Avatar   sx={{ width: 40, height: 40, bgcolor: green [500]  }}><CreditScoreIcon/></Avatar>

              
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <CircularProgress  sx={{ width: 25, height: 25  }}  disableShrink />:<h5>{ totalAdvancePaymentIn && totalAdvancePaymentIn>0?totalAdvancePaymentIn:0}</h5> }
                <h6 className='ml-2'>Total Advance In</h6>
            
            </div>
          </div> 
          
            </Paper>
            </div>

            <div className="col-sm-6 col-sm-12 col-md-4 my-1 p-1 ">          
            <Paper className="data p-3 rounded border">
            <div className="d-flex justify-content-between pt-2 pb-1 mt-2">
            <div className=" ">
              <div className="side">
              <Avatar   sx={{ width: 40, height: 40, bgcolor: red [500]  }}><TrendingDownIcon/></Avatar>

              
              </div>
            </div>
            <div className="side text-end">
            {loading4 ? <CircularProgress  sx={{ width: 25, height: 25  }}  disableShrink />:<h5>{ totalAdvancePaymentOut && totalAdvancePaymentOut>0 ? totalAdvancePaymentOut:0}</h5> }
                
                <h6 className='ml-2'>Total Advance Out</h6>
            
            </div>
          </div> 
          
            </Paper>
            </div>
          </div>
        </div>

        <div className="col-md-12 payment_details p-0 my-3">
          <h3 className="text-center my-2"><strong>Day Book</strong> </h3>
         {loading3 && 
          <div className="image text-center">
<CircularProgress  sx={{ width: 25, height: 25  }}  disableShrink />
          </div>
         }
                      {!loading3 &&
                      <TableContainer className='detail_table' component={Paper}>
                      <Table stickyHeader  sx={{ maxHeight: 100 }}>
                        <TableHead className="thead" >
                          <TableRow>
                            <TableCell className='label border'>SN</TableCell>
                            <TableCell className='label border'>Date</TableCell>
                            <TableCell className='label border'>Supp/Agent/Cand</TableCell>
                            <TableCell className='label border'>Reference_Type</TableCell>
                            <TableCell className='label border'>Category</TableCell>
                            <TableCell className='label border'>Payment_Via</TableCell>
                            <TableCell className='label border'>Payment_Type</TableCell>
                            <TableCell className='label border'>Slip_No</TableCell>
                            <TableCell className='label border'>Cash_In</TableCell>
                            <TableCell className='label border'>Cash_Out</TableCell>
                            <TableCell className='label border'>Cash_Return</TableCell>
                            <TableCell className='label border'>Details</TableCell>
                            <TableCell className='label border'>Invoice</TableCell>
                            <TableCell className='label border'>Slip_Pic</TableCell>
                        
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {todayPayments && todayPayments.length>0 ? todayPayments.map((cash, outerIndex) => (
                              // Map through the payment array
                             
                               <>
                                <TableRow key={cash?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >  
                                    <>
                                      <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash.date}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash.supplierName}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash.type}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash.category}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash.payment_Via}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash.payment_Type}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash?.slip_No}</TableCell>
                                      <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{cash.payment_In}</TableCell>
                                      <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{cash.payment_Out}</TableCell>
                                      <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up text-warning text-bold"></i><i className="fa-solid fa-arrow-down me-2 text-warning text-bold"></i>{cash.cash_Out}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash?.details}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash?.invoice}</TableCell>
                                      <TableCell className='border data_td text-center'>{cash.slip_Pic ? <img src={cash.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>
                                      
                                    </>
                                  
                                </TableRow>
                                

                               </>
                            
                            )):<TableRow>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell className='data_td text-center'>Not_found</TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                            </TableRow>}

                            <TableRow>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell className='border data_td text-center bg-secondary text-white'>Total</TableCell>
                                  <TableCell className='border data_td text-center bg-success text-white'>
    {/* Calculate the total sum of payment_In */}
    {todayPayments && todayPayments.length > 0 && todayPayments.reduce((total, entry) => {
      return total + (entry.payment_In || 0); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-danger text-white'>
    {/* Calculate the total sum of payment_Out */}
    {todayPayments && todayPayments.length > 0 && todayPayments.reduce((total, entry) => {
      return total + (entry.payment_Out || 0); // Use proper conditional check
    }, 0)}
  </TableCell>
  <TableCell className='border data_td text-center bg-warning text-white'>
    {/* Calculate the total sum of cash_Out */}
    {todayPayments && todayPayments.length > 0 && todayPayments.reduce((total, entry) => {
      return total + (entry.cash_Out || 0); // Use proper conditional check
    }, 0)}
  </TableCell>
                                  
                                  
                                </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                      }
                     
                    </div>
     </div>
    </div>


    </div>
  )
}
