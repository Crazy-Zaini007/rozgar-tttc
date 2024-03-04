import React, {useState } from 'react'
import { Paper } from '@mui/material'
import CandVisePaymentInReturn from './CandVisePaymentInReturn'
import CandVisePaymentOutReturn from './CandVisePaymentOutReturn'
export default function CandVisePayReturn() {
 
  const [option,setOption]=useState(0)

  return (
    <>
      <div className="main">
        <div className="container-fluid py-2 payment_form">
          <div className="row">
          
             <div className='col-md-12 '>
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <button className='btn m-1 show_btn' style={option===0 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(0)}>Payment In Return</button>
                  <button className='btn m-1 show_btn' style={option===1 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(1)}>Payment Out Return</button>
                </div>
              </Paper>
            </div>
            {option === 0 && 
              <CandVisePaymentInReturn></CandVisePaymentInReturn>
            }
            {option === 1 &&
              <CandVisePaymentOutReturn></CandVisePaymentOutReturn>
            }

          </div>
        </div>
      </div>
    </>
  )
}
