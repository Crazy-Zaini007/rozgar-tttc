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

  const myDate = new Date(); myDate .setHours(0, 0, 0, 0);const currentDate = myDate.toLocaleDateString('en-CA');

  const[banks,setBanks]=useState('')
  const[total,setTotal]=useState()

  const abortCont = useRef(new AbortController());

const {getOverAllPayments,overAllPayments}=CashInHandHook()

 useEffect(() => {
    getOverAllPayments();
    return () => {
        if (abortCont.current) {
          abortCont.current.abort(); 
        }
      }
  }, [user]);


  const aggregatedPayments = {};
  let totalPaymentIn = 0;
  let totalCashOutIn = 0;
  let totalPaymentOut = 0;
  let totalCashOutOut = 0;
    // Iterate through all payments
  overAllPayments.forEach(payment => {
    const paymentVia = payment.payment_Via;
  
    // Initialize the entry for this payment_Via if it doesn't exist
    if (!aggregatedPayments[paymentVia]) {
      aggregatedPayments[paymentVia] = {
        totalPaymentIn: 0,
        totalCashOutIn: 0,
        totalPaymentOut: 0,
        totalCashOutOut: 0,
       
      };
    }
  
    // Update the sums based on payment type
    if (payment.payment_In > 0 || payment.type.toLowerCase().includes('in')) {
      aggregatedPayments[paymentVia].totalPaymentIn += payment.payment_In || 0;
      aggregatedPayments[paymentVia].totalCashOutIn += payment.cash_Out || 0;
  
      totalPaymentIn += payment.payment_In || 0;
      totalCashOutIn += payment.cash_Out || 0;
    }  
    if (payment.payment_Out > 0 || payment.type.toLowerCase().includes('out')) {
      aggregatedPayments[paymentVia].totalPaymentOut += payment.payment_Out || 0;
      aggregatedPayments[paymentVia].totalCashOutOut += payment.cash_Out || 0;
  
      totalPaymentOut += payment.payment_Out || 0;
      totalCashOutOut += payment.cash_Out || 0;
    }
  
    
  });
  
  // Calculate the combined total for each payment_Via
const paymentViaTotals = Object.entries(aggregatedPayments).map(([paymentVia, totals]) => {
  return {
    paymentVia,
    total: (totals.totalPaymentIn + totals.totalCashOutIn) - (totals.totalPaymentOut + totals.totalCashOutOut),
  };
});


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
                <h6 className="bg-success text-white py-2 text-center my-0">{Math.round(paymentViaTotals ? paymentViaTotals.reduce((total, data) => total + data.total, 0) : 0)}</h6>
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
                                {paymentViaTotals && paymentViaTotals.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell className='border data_td text-center' style={{ width: '50%' }}>{data.paymentVia}</TableCell>
                                        <TableCell className='border data_td text-center' style={{ width: '50%' }}>{Math.round(data.total)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell className='border data_td text-center bg-dark text-white' style={{ width: '50%' }}>Total</TableCell>
                                    <TableCell className='border data_td text-center bg-warning text-white' style={{ width: '50%' }}>{Math.round(paymentViaTotals ? paymentViaTotals.reduce((total, data) => total + data.total, 0) : 0)}</TableCell>
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
