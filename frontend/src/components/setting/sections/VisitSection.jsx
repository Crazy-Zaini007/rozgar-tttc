import React, { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
// Entry Setting pages
import VISP from '../entrySetting/VISP'
import VIPP from '../entrySetting/VIPP'
import { useSelector } from 'react-redux';

export default function VisitSection() {

  const [value, setValue] = useState(0)

  const handleClick = (index) => {
    setValue(index)
  }

  useEffect(() => {
   
  }, [value])


  const collapsed = useSelector((state) => state.collapsed.collapsed);
  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid py-2 entry_setting">
          <div className="row justify-content-start">
            <div className="col-md-12 ">
              <Paper className='py-3 mb-2 px-2' >
                <h4>Manage Visit Sections</h4>
              </Paper>
            </div>
            {/* Tabs */}
            <div className='col-md-12 my-2 p-0'>
              <ul className='px-2'>
                <li onClick={() => handleClick(0)} className='mx-1'><button style={value === 0 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Visit Sales Parties</button></li>
                <li onClick={() => handleClick(1)} className='mx-1'><button style={value === 1 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Visit Purchase Parties</button></li>
               
              </ul>
            </div>

            {/* All Entry Pages */}

            {value===0 &&
            <VISP></VISP>
            }

            {value===1 &&
            <VIPP></VIPP>
            }

          </div>
        </div>
      </div>

    </>
  )
}
