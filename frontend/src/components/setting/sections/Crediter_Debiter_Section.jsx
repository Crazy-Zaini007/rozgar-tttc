import React, { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
import { useSelector } from 'react-redux';

// Entry Setting pages
import CPP from '../entrySetting/CPP'
export default function CrediterDebiterSection() {

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
            <div className="col-md-12 ">
              <Paper className='py-3 mb-2 px-2' >
                <h4>Manage Crediter Debiter </h4>
              </Paper>
            </div>
            {value===0 &&
            <CPP></CPP>
            }
          </div>
        </div>
      </div>

    </>
  )
}
