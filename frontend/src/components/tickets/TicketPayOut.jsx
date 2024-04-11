import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
import TicketAgentSinglePayOut from './ticketAgents/TicketAgentSinglePayOut';
import TicketSupSinglePayOut from './ticketSuppliers/TicketSupSinlgePayOut';
import TicketCandSinglePayOut from './ticketCandidates/TicketCandSinglePayOut'
import { useSelector } from 'react-redux';

export default function TicketPayOut() {

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
                <h4>Ticket Section Payment Out</h4>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Agent Payment-Out</button>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(1)} style={single === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Supplier Payment-Out</button>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(2)} style={single === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Candidate Payment-Out</button>
              </Paper>
                      </div>
                      {single === 0 &&
                          <TicketAgentSinglePayOut></TicketAgentSinglePayOut>
                      }
                      {single === 1 &&
                          <TicketSupSinglePayOut></TicketSupSinglePayOut>
                      }
                       {single === 2 &&
                          <TicketCandSinglePayOut></TicketCandSinglePayOut>
                      }
          </div>


        </div>
      </div>

    </>
  )
}
