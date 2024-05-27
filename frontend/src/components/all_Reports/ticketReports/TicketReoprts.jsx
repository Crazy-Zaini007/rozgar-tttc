import React, {useState } from 'react'
import TicketSuppReports from './TicketSuppReports'
import TicketAgentReports from './TicketAgentReports'
import TicketCandReports from './TicketCandReports'
import { Paper } from '@mui/material'
import { useSelector } from 'react-redux';

export default function TicketReoprts() {
const [option,setOption]=useState(0)
const collapsed = useSelector((state) => state.collapsed.collapsed);


  return (
    <div>
          <div className={`${collapsed ?"collapsed":"main"}`}>

        <div className="container-fluid py-2 payment_details">
            <div className="row">
            <div className='col-md-12 '>
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <button className='btn btn-sm  m-1 show_btn' style={option===0 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(0)}>Agents</button>
                  <button className='btn btn-sm  m-1 show_btn' style={option===1 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(1)}>Suppliers</button>
                  <button className='btn btn-sm  m-1 show_btn' style={option===2 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(2)}>Candidates</button>
                </div>
              </Paper>
            </div>
            {option === 0 && 
              <TicketAgentReports></TicketAgentReports>
            }
            {option === 1 &&
              <TicketSuppReports></TicketSuppReports>
            }
            {option === 2 &&
              <TicketCandReports></TicketCandReports>
            }
            </div>
        </div>
      </div>
    </div>
  )
}
