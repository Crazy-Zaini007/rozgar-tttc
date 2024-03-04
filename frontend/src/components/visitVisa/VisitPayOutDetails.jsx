import React, { useState } from 'react'
import { Paper } from '@mui/material'
import VisitAgentPayOutDetails from './visitAgents/details/VisitAgentPayOutDetails'
import VisitSupPayOutDetails from './visitSuppliers/details/VisitSupPayOutDetails'
import VisitCandPayOutDetails from './visitCandidates/details/VisitCandPayOutDetails'
export default function VisitPayOutDetails() {

  const [option, setOption] = useState(0)

  return (
    <>

      <div className='col-md-12 '>
        <Paper className='py-3 mb-2 px-2'>

          <button className='btn m-1 show_btn btn-sm' style={option === 0 ? { background: 'var(--accent-stonger-blue)', color: 'var(--white' } : {}} onClick={() => setOption(0)}>Agents Payment Out Details</button>
          <button className='btn m-1 show_btn btn-sm' style={option === 1 ? { background: 'var(--accent-stonger-blue)', color: 'var(--white' } : {}} onClick={() => setOption(1)}>Suppliers Payment Out Details</button>
          <button className='btn m-1 show_btn btn-sm' style={option === 2 ? { background: 'var(--accent-stonger-blue)', color: 'var(--white' } : {}} onClick={() => setOption(2)}>Candidates Payment Out Details</button>


        </Paper >
      </div >
      {option === 0 &&
        <VisitAgentPayOutDetails></VisitAgentPayOutDetails>
      }

      {
        option === 1 &&
        <VisitSupPayOutDetails></VisitSupPayOutDetails>
      }

      {
        option === 2 &&
        <VisitCandPayOutDetails></VisitCandPayOutDetails>
      }








    </>
  )
}
