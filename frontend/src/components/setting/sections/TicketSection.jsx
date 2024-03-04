import React, { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
// Entry Setting pages
import TSP from '../entrySetting/TSP'
import TPP from '../entrySetting/TPP'
export default function TicketSection() {

  const [value, setValue] = useState(0)

  const handleClick = (index) => {
    setValue(index)
  }

  useEffect(() => {
    console.log(value);
  }, [value])


  return (
    <>
      <div className="main">
        <div className="container-fluid py-2 entry_setting">
          <div className="row justify-content-start">
            <div className="col-md-12 ">
              <Paper className='py-3 mb-2 px-2' >
                <h4>Manage Ticket Sections</h4>
              </Paper>
            </div>
            {/* Tabs */}
            <div className='col-md-12 my-2 p-0'>
              <ul className='px-2'>
                <li onClick={() => handleClick(0)} className='mx-1'><button style={value === 0 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Ticket Sales Parties</button></li>
                <li onClick={() => handleClick(1)} className='mx-1'><button style={value === 1 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Ticket Purchase Parties</button></li>
               
              </ul>
            </div>

            {/* All Entry Pages */}

            {value===0 &&
            <TSP></TSP>
            }

            {value===1 &&
            <TPP></TPP>
            }

          </div>
        </div>
      </div>

    </>
  )
}
