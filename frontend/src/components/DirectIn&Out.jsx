import React, {useState }  from 'react'
import { useSelector } from "react-redux";
import {Paper } from '@mui/material';
import DirectPaymentIn from './DirectPaymentIn';
import DirectPaymentOut from './DirectPaymentOut';

export default function DirectInOut() {
    const [option,setOption]=useState(0)

  const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid py-2 payment_details">
            <div className="row payment_form">
            <div className='col-md-12 '>
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <button className='btn m-1 show_btn' style={option===0 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(0)}>Payment IN</button>
                  <button className='btn m-1 show_btn' style={option===1 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(1)}>Payment OUT</button>
                </div>
              </Paper>
            </div>
            {option===0 &&
            <DirectPaymentIn/>
            }
             {option===1 &&
            <DirectPaymentOut/>
            }

            </div>
        </div>
    </div>
  )
}
