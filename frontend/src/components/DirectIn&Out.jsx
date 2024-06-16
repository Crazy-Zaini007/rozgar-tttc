import React, { useState, useEffect,useRef } from "react";
import { useSelector } from "react-redux";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DirectPaymentIn from './DirectPaymentIn';
import DirectPaymentOut from './DirectPaymentOut';
import CashInHandHook from '../hooks/cashInHandHooks/CashInHandHook'
import { useAuthContext } from "../hooks/userHooks/UserAuthHook";

export default function DirectInOut() {
  const { user } = useAuthContext();

  const cashInHand = useSelector((state) => state.cashInHand.cashInHand);
  const myDate = new Date(); myDate .setHours(0, 0, 0, 0);const currentDate = myDate.toLocaleDateString('en-CA');

  const[banks,setBanks]=useState('')
  const[total,setTotal]=useState()

  const abortCont = useRef(new AbortController());
  
const apiUrl = process.env.REACT_APP_API_URL;
const getBankCash = async () => {
  try {
    const response = await fetch(`${apiUrl}/auth/reports/get/all/today/payments`, {

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    })

    const json = await response.json();
    if (response.ok) {
     setBanks(json.data)
     setTotal(json.bank_Cash)
    }
  }
  catch (error) {
 
  }
}

const { getCashInHandData } = CashInHandHook()

 useEffect(() => {
    getCashInHandData();
    getBankCash();
    return () => {
        if (abortCont.current) {
          abortCont.current.abort(); 
        }
      }
  }, [user]);
  const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <div className={`${collapsed ? "collapsed" : "main"}`}>
    <div className="py-2 direct_payment px-0">
        <div className="d-flex payment_form p-0 m-0">
          
            <div className="d-flex overflow-x-auto">
                <div className="flex-grow-1 p-0 m-0">
                    <DirectPaymentIn />
                </div>
                <div className="flex-grow-1 p-0 m-0">
                    <DirectPaymentOut />
                </div>
            </div>
            <div className="col-md-2 col-sm-12 p-0 m-0 total_cash">
                <h6 className="bg-dark text-white py-2 text-center my-0">Total Cash In hand</h6>
                <h6 className="bg-success text-white py-2 text-center my-0">{Math.round((total ? total : 0))}</h6>
                <div className="details">
                    <h6 className="text-center my-0 bg-info text-white py-2 my-0">Cash Details</h6>
                    <TableContainer className='detail_table'>
                        <Table stickyHeader>
                            <TableHead className="thead">
                                <TableRow>
                                    <TableCell className='label border text-center' style={{ width: '50%' }}>Source</TableCell>
                                    <TableCell className='label border text-center' style={{ width: '50%' }}>Payment</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {banks && banks.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell className='border data_td text-center' style={{ width: '50%' }}>{data.payment_Via}</TableCell>
                                        <TableCell className='border data_td text-center' style={{ width: '50%' }}>{Math.round(data.total_payment)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell className='border data_td text-center bg-dark text-white' style={{ width: '50%' }}>Total</TableCell>
                                    <TableCell className='border data_td text-center bg-warning text-white' style={{ width: '50%' }}>{Math.round(total && total||0)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    </div>
</div>


  )
}
