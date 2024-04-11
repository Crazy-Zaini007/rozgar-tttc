import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
import AzadVisaAgentSinglePayIn from './azadVisaAgents/AzadVisaAgentSinglePayIn';
import AzadVisaSupSinglePayIn from './azadVisaSuppliers/AzadVisaSupSinglePayIn';
import AzadVisaCandSinglePayIn from './azadVisaCandidates/AzadVisaCandSinglePayIn';
import { useSelector } from 'react-redux';

export default function AzadVisaPayIn() {

  const [single, setSingle] = useState(0)

  const setEntry = (index) => {
    setSingle(index)

  }
  const collapsed = useSelector((state) => state.collapsed.collapsed);


  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid payment_form">
          <div className="row">

            <div className="col-md-12">
              <Paper className='py-3 mb-1 px-2'>
                <h4>AzadVisa Section Payment IN</h4>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Agent Payment-In</button>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(1)} style={single === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Supplier Payment-In</button>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(2)} style={single === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Candidate Payment-In</button>
              </Paper>
                      </div>
                      {single === 0 &&
                          <AzadVisaAgentSinglePayIn></AzadVisaAgentSinglePayIn>
                      }
                      {single === 1 &&
                          <AzadVisaSupSinglePayIn></AzadVisaSupSinglePayIn>
                      }
                       {single === 2 &&
                          <AzadVisaCandSinglePayIn></AzadVisaCandSinglePayIn>
                      }
          </div>


        </div>
      </div>

    </>
  )
}
