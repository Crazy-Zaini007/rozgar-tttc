import React, { useState, } from 'react'
import { Paper } from '@mui/material'
import VisitSupPayOutReturn from './visitSuppliers/VisitSupPayOutReturn'
import VisitAgentPayOutReturn from './visitAgents/VisitAgentPayOutReturn'
import VisitCandPayOutReturn from './visitCandidates/VisitCandPayOutReturn'

export default function VisitPayOutReturn() {

  const [section, setSection] = useState(0)


  return (
    <>
    
      <div className="col-md-12 ">
         <Paper className='py-3 mb-1 px-2'>
                <h4>VisitVisa Section Payment Out Return</h4>
                <button className='btn m-1 btn-sm entry_btn' onClick={() => setSection(0)} style={section === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Supplier PayOut Return</button>
                <button className='btn m-1 btn-sm entry_btn' onClick={() => setSection(1)} style={section === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Agent PayOut Return</button>
                <button className='btn m-1 btn-sm entry_btn' onClick={() => setSection(2)} style={section === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Candidate PayOut Return</button>
              </Paper>
      </div>

          {section === 0 &&
              <VisitSupPayOutReturn></VisitSupPayOutReturn>
          }
           {section === 1 &&
              <VisitAgentPayOutReturn></VisitAgentPayOutReturn>
          }
           {section === 2 &&
              <VisitCandPayOutReturn></VisitCandPayOutReturn>
          }
    </>
  )
}
