import React, { useState, } from 'react'
import { Paper } from '@mui/material'
import VisitSupPayInReturn from './visitSuppliers/VisitSupPayInReturn'
import VisitAgentPayInReturn from './visitAgents/VisitAgentPayInReturn'
import VisitCandPayInReturn from './visitCandidates/VisitCandPayInReturn'

export default function VisitPayInReturn() {

  const [section, setSection] = useState(0)


  return (
    <>
    
      <div className="col-md-12 ">
         <Paper className='py-3 mb-1 px-2'>
                <h4>VisitVisa Section Payment In Return</h4>
                <button className='btn m-1  btn-sm entry_btn' onClick={() => setSection(0)} style={section === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Supplier PayIn Return</button>
                <button className='btn m-1  btn-sm entry_btn' onClick={() => setSection(1)} style={section === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Agent PayIn Return</button>
                <button className='btn m-1 btn-sm entry_btn' onClick={() => setSection(2)} style={section === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Candidate PayIn Return</button>
              </Paper>
      </div>

          {section === 0 &&
              <VisitSupPayInReturn></VisitSupPayInReturn>
          }
           {section === 1 &&
              <VisitAgentPayInReturn></VisitAgentPayInReturn>
          }
           {section === 2 &&
              <VisitCandPayInReturn></VisitCandPayInReturn>
          }
    </>
  )
}
