import React, {useState } from 'react'
import VisitSuppReports from './VisitSuppReports'
import VisitAgentReports from './VisitAgentReports'
import VisitCandReports from './VisitCandReports'
import { Paper } from '@mui/material'
import { useSelector } from 'react-redux';

export default function VisitReoprts() {
const [option,setOption]=useState(0)
const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <div>
         <div className={`${collapsed ?"collapsed":"main"}`}>

        <div className="container-fluid mt-3 payment_details">
            <div className="row">
            <div className='col-md-12 p-0 border-0 border-bottom'>
              <div className='py-2 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                  <button className='btn btn-sm  m-1 show_btn' style={option===0 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(0)}>Agents</button>
                  <button className='btn btn-sm  m-1 show_btn' style={option===1 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(1)}>Suppliers</button>
                  <button className='btn btn-sm  m-1 show_btn' style={option===2 ? {background:'var(--accent-stonger-blue)', color:'var(--white'}:{}} onClick={()=>setOption(2)}>Candidates</button>
                </div>
              </div>
            </div>
            {option === 0 && 
              <VisitAgentReports></VisitAgentReports>
            }
            {option === 1 &&
              <VisitSuppReports></VisitSuppReports>
            }
            {option === 2 &&
              <VisitCandReports></VisitCandReports>
            }
            </div>
        </div>
      </div>
    </div>
  )
}
