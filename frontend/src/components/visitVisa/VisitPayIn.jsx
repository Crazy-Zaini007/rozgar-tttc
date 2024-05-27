import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
import VisitAgentSinglePayIn from './visitAgents/VisitAgentSinglePayIn';
import VisitSupSinglePayIn from './visitSuppliers/VisitSupSinglePayIn';
import VisitCandSinglePayIn from './visitCandidates/VisitCandSinglePayIn';
import { useSelector } from 'react-redux';

export default function VisitPayIn() {

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
                <h4>VisitVisa Section Payment IN</h4>
                <button className='btn m-1 btn-sm entry_btn' onClick={() => setEntry(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Agent Payment-In</button>
                <button className='btn m-1 btn-sm entry_btn' onClick={() => setEntry(1)} style={single === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Supplier Payment-In</button>
                <button className='btn m-1 btn-sm entry_btn' onClick={() => setEntry(2)} style={single === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Candidate Payment-In</button>
              </Paper>
                      </div>
                      {single === 0 &&
                          <VisitAgentSinglePayIn></VisitAgentSinglePayIn>
                      }
                      {single === 1 &&
                          <VisitSupSinglePayIn></VisitSupSinglePayIn>
                      }
                       {single === 2 &&
                          <VisitCandSinglePayIn></VisitCandSinglePayIn>
                      }
          </div>


        </div>
      </div>

    </>
  )
}
