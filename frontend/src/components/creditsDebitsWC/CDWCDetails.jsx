import React, { useState } from 'react'
import { Paper } from '@mui/material'
import PaymentInDetails from './details/PaymentInDetails'
import { useSelector } from 'react-redux';

export default function CDWCDetails() {
  const [option, setOption] = useState(0)

  const collapsed = useSelector((state) => state.collapsed.collapsed);
  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid py-2 payment_details">
          <div className="row">
            <div className='col-md-12 p-0 '>
             
            </div>
            {option === 0 &&
              <PaymentInDetails></PaymentInDetails>
            }
         
          </div>
        </div>
      </div>
    </>
  )
}
