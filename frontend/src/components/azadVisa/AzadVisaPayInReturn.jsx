import React, { useState, } from 'react'
import { Paper } from '@mui/material'
import AzadVisaSupPayInReturn from './azadVisaSuppliers/AzadVisaSupPayInReturn'
import AzadVisaAgentPayInReturn from './azadVisaAgents/AzadVisaAgentPayInReturn'
import AzadVisaCandPayInReturn from './azadVisaCandidates/AzadVisaCandPayInReturn'

export default function AzadVisaPayInReturn() {

  const [section, setSection] = useState(0)


  return (
    <>
    
      <div className="col-md-12 ">
         <Paper className='py-3 mb-1 px-2'>
                <h4>AzadVisa Section Payment In Return</h4>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setSection(0)} style={section === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Supplier PayIn Return</button>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setSection(1)} style={section === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Agent PayIn Return</button>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setSection(2)} style={section === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Candidate PayIn Return</button>
              </Paper>
      </div>

          {section === 0 &&
              <AzadVisaSupPayInReturn></AzadVisaSupPayInReturn>
          }
           {section === 1 &&
              <AzadVisaAgentPayInReturn></AzadVisaAgentPayInReturn>
          }
           {section === 2 &&
              <AzadVisaCandPayInReturn></AzadVisaCandPayInReturn>
          }
    </>
  )
}
