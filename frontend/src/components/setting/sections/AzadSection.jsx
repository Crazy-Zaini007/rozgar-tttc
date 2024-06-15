import React, { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
import { useSelector } from 'react-redux';
// Entry Setting pages
import AVSP from '../entrySetting/AVSP'
import AVPP from '../entrySetting/AVPP'
export default function AzadSection() {

  const [value, setValue] = useState(0)

  const handleClick = (index) => {
    setValue(index)
  }

  useEffect(() => {
    console.log(value);
  }, [value])


  const collapsed = useSelector((state) => state.collapsed.collapsed);
  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid py-2 entry_setting">
          <div className="row justify-content-start">
            <div className="col-md-12 p-0 border-0 border-bottom">
              <div className='py-3 mb-2 px-2' >
                <h4>Manage Azad Sections</h4>
              </div>
            </div>
            {/* Tabs */}
            <div className='col-md-12 my-2 p-0'>
              <ul className='px-2'>
                <li onClick={() => handleClick(0)} className='mx-1'><button style={value === 0 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Azad Sales Parties</button></li>
                <li onClick={() => handleClick(1)} className='mx-1'><button style={value === 1 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Azad Purchase Parties</button></li>
               
              </ul>
            </div>

            {/* All Entry Pages */}

            {value===0 &&
            <AVSP></AVSP>
            }

            {value===1 &&
            <AVPP></AVPP>
            }

          </div>
        </div>
      </div>

    </>
  )
}
