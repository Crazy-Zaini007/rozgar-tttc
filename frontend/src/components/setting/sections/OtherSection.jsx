import React, { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
// Entry Setting pages
import Companies from '../entrySetting/Companies'
import Trade from '../entrySetting/Trade'
import CurrCountry from '../entrySetting/CurrCountry'
import PaymentVia from '../entrySetting/PaymentVia'
import PaymentType from '../entrySetting/PaymentType'
import EntryMode from '../entrySetting/EntryMode'
import FinalStaus from '../entrySetting/FinalStatus'
import Countries from '../entrySetting/Countries'
import Categories from '../entrySetting/Categories'
import ExpeCategories from '../entrySetting/ExpeCategories'
import Currencies from '../entrySetting/Currencies'
import { useSelector } from 'react-redux';

export default function OtherSection() {

  const [value, setValue] = useState(1)

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
                <h4>Manage Other Sections</h4>
              </div>
            </div>
            {/* Tabs */}
            <div className='col-md-12 my-2 p-0'>
              <ul className='px-2'>
                <li onClick={() => handleClick(1)} className='mx-1'><button style={value === 1 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Companies</button></li>
                <li onClick={() => handleClick(2)} className='mx-1'><button style={value === 2 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Trade</button></li>
                <li onClick={() => handleClick(3)} className="mx-1"><button style={value === 3 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Cur Country</button></li>
                <li onClick={() => handleClick(4)} className="mx-1"><button style={value === 4 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Payment Via</button></li>
                <li onClick={() => handleClick(5)} className="mx-1"><button style={value === 5 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Payment Type</button></li>
                <li onClick={() => handleClick(6)} className="mx-1"><button style={value === 6 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Entry Mode</button></li>
                <li onClick={() => handleClick(7)} className="mx-1"><button style={value === 7 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Final Status</button></li>
                <li onClick={() => handleClick(8)} className="mx-1"><button style={value === 8 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Countries</button></li>
                <li onClick={() => handleClick(9)} className="mx-1"><button style={value === 9 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Categories</button></li>
                <li onClick={() => handleClick(10)} className="mx-1"><button style={value === 10 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Expense Categories</button></li>
                <li onClick={() => handleClick(11)} className="mx-1"><button style={value === 11 ? { backgroundColor: 'var(--accent-stonger-blue)', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s', border: '1px solid var(--accent-stonger-blue)' } : {}} className='btn border'>Currency</button></li>

              </ul>
            </div>

            {/* All Entry Pages */}

            {value===1 &&
            <Companies></Companies>
            }
            {value===2 && 
            <Trade></Trade>
            }

            {value===3 && 
            <CurrCountry></CurrCountry>
            }
            {value===4 &&
            <PaymentVia></PaymentVia>
            }
            {value===5 &&
            <PaymentType></PaymentType>
            }

            {value===6 &&
            <EntryMode></EntryMode>
            }
            {value===7 &&
            <FinalStaus></FinalStaus>
            }

            {value===8 &&
            <Countries></Countries>
            }

            {value===9 &&
            <Categories></Categories>
            }

            {value===10 &&
            <ExpeCategories></ExpeCategories>
            }
            {value===11 &&
            <Currencies></Currencies>
            }
          </div>
        </div>
      </div>

    </>
  )
}
