import React, { useState } from 'react'
import AssetsPaymentsDetails from './details/AssetsPaymentsDetails'
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
              <AssetsPaymentsDetails></AssetsPaymentsDetails>
            }
          </div>
        </div>
      </div>
    </>
  )
}
