import React, {useState } from 'react'
import AzadSuppReports from './AzadSuppReports'
import AzadAgentReports from './AzadAgentReports'
import AzadCandReports from './AzadCandReports'
import { Paper } from '@mui/material'

export default function AzadReoprts() {
const [option,setOption]=useState(0)

  return (
    <div>
      <div className="main">
        <div className="container-fluid py-2 payment_details">
            <div className="row">
            <div className='col-md-12 '>
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <button className='btn m-1 show_btn' style={option===0 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(0)}>Agents</button>
                  <button className='btn m-1 show_btn' style={option===1 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(1)}>Suppliers</button>
                  <button className='btn m-1 show_btn' style={option===2 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(2)}>Candidates</button>
                </div>
              </Paper>
            </div>
            {option === 0 && 
              <AzadAgentReports></AzadAgentReports>
            }
            {option === 1 &&
              <AzadSuppReports></AzadSuppReports>
            }
            {option === 2 &&
              <AzadCandReports></AzadCandReports>
            }
            </div>
        </div>
      </div>
    </div>
  )
}