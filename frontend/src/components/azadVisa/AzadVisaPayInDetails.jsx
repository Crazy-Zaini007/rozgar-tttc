import React, { useState } from 'react'
import { Paper } from '@mui/material'
import AzadVisaAgentPayInDetails from './azadVisaAgents/details/AzadVisaAgentPayInDetails'
import AzadVisaSupPayInDetails from './azadVisaSuppliers/details/AzadVisaSupPayInDetails'
import AzadVisaCandPayInDetails from './azadVisaCandidates/details/AzadVisaCandPayInDetails'
export default function AzadVisaPayInDetails() {

  const [option, setOption] = useState(0)

  return (
    <>

      <div className='col-md-12 '>
        <Paper className='py-3 mb-2 px-2 '>

          <button className='btn m-1 show_btn btn-sm' style={option === 0 ? { background: 'var(--accent-stonger-blue)', color: 'var(--white' } : {}} onClick={() => setOption(0)}>Agents Payment In Details</button>
          <button className='btn m-1 show_btn btn-sm' style={option === 1 ? { background: 'var(--accent-stonger-blue)', color: 'var(--white' } : {}} onClick={() => setOption(1)}>Suppliers Payment In Details</button>
          <button className='btn m-1 show_btn btn-sm' style={option === 2 ? { background: 'var(--accent-stonger-blue)', color: 'var(--white' } : {}} onClick={() => setOption(2)}>Candidates Payment In Details</button>




        </Paper >
      </div >
      {option === 0 &&
        <AzadVisaAgentPayInDetails></AzadVisaAgentPayInDetails>
      }

      {
        option === 1 &&
        <AzadVisaSupPayInDetails></AzadVisaSupPayInDetails>
      }

      {
        option === 2 &&
        <AzadVisaCandPayInDetails></AzadVisaCandPayInDetails>
      }




    </>
  )
}
