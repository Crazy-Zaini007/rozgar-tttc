import React, { useState } from 'react'
import AssetsPaymentsDetails from './details/AssetsPaymentsDetails'
import { useSelector } from 'react-redux';

export default function CDWCDetails() {
  const [option, setOption] = useState(0)

  const collapsed = useSelector((state) => state.collapsed.collapsed);


  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid payment_details">
          <div className="row">
            <div className='col-md-12 p-0 border-0 border-bottom'>
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
