import React, {useState } from 'react'
import { Paper } from '@mui/material'
import ProtectorPaymentOutDetails from './details/ProtectorPaymentOutDetails'
import { useSelector } from 'react-redux';

export default function SupDetails() {
 
  const [option,setOption]=useState(0)

  const collapsed = useSelector((state) => state.collapsed.collapsed);
  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid payment_details">
          <div className="row">
            {option === 0 && 
              <ProtectorPaymentOutDetails></ProtectorPaymentOutDetails>
            }
           
          </div>
        </div>
      </div>
    </>
  )
}
