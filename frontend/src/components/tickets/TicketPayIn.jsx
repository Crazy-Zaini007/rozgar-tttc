import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
import TicketAgentSinglePayIn from './ticketAgents/TicketAgentSinglePayIn';
import TicketSupSinglePayIn from './ticketSuppliers/TicketSupSinglePayIn';
import TicketCandSinglePayIn from './ticketCandidates/TicketCandSinglePayIn'
export default function TicketPayIn() {

  const [single, setSingle] = useState(0)

  const setEntry = (index) => {
    setSingle(index)

  }
  
  return (
    <>
      <div className="main">
        <div className="container-fluid payment_form">
          <div className="row">

            <div className="col-md-12">
              <Paper className='py-3 mb-1 px-2'>
                <h4>Ticket Section Payment IN</h4>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Agent Payment-In</button>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(1)} style={single === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Supplier Payment-In</button>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(2)} style={single === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Candidate Payment-In</button>
              </Paper>
                      </div>
                      {single === 0 &&
                          <TicketAgentSinglePayIn></TicketAgentSinglePayIn>
                      }
                      {single === 1 &&
                          <TicketSupSinglePayIn></TicketSupSinglePayIn>
                      }
                       {single === 2 &&
                          <TicketCandSinglePayIn></TicketCandSinglePayIn>
                      }
          </div>


        </div>
      </div>

    </>
  )
}
