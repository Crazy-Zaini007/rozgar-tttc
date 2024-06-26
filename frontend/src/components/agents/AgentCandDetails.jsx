import React, {useState } from 'react'
import { Paper } from '@mui/material'
import AgentCandPaymentInDetails from './candDetails/AgentCandPaymentInDetails'
import AgentCandPaymentOutDetails from './candDetails/AgentCandPaymentOutDetails'
import { useSelector } from 'react-redux';

export default function AgentCandDetails() {
 
  const [option,setOption]=useState(0)

  const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <>
      <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid py-2 payment_details">
          <div className="row">
          
             <div className='col-md-12 '>
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <button className='btn btn-sm  m-1 show_btn' style={option===0 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(0)}>Payment In Details</button>
                  <button className='btn btn-sm  m-1 show_btn' style={option===1 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(1)}>Payment Out Details</button>

                </div>
                
              </Paper>
            </div>
            {option === 0 && 
              <AgentCandPaymentInDetails></AgentCandPaymentInDetails>
            }
            {option === 1 &&
              <AgentCandPaymentOutDetails></AgentCandPaymentOutDetails>
            }




          
          </div>
        </div>
      </div>
    </>
  )
}
