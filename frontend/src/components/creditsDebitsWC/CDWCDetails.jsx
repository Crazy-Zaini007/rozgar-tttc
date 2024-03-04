import React, { useState } from 'react'
import { Paper } from '@mui/material'
import PaymentInDetails from './details/PaymentInDetails'
import PaymentOutDetails from './details/PaymentOutDetails'
export default function CDWCDetails() {
  const [option, setOption] = useState(0)

  return (
    <>
      <div className="main">
        <div className="container-fluid py-2 payment_details">
          <div className="row">
            <div className='col-md-12 '>
             
            </div>
            {option === 0 &&
              <PaymentInDetails></PaymentInDetails>
            }
            {option === 1 &&
              <PaymentOutDetails></PaymentOutDetails>
            }
          </div>
        </div>
      </div>
    </>
  )
}
