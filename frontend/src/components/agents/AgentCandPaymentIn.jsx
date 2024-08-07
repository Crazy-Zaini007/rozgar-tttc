import React, { useState, useEffect } from 'react'
import Paper from '@mui/material/Paper';
import AgentCandSinglePaymentIn from './AgentCandSinglePaymentIn';
import Entry1 from '../candDoubleEntry/Entry1'
 import Entry2 from '../candDoubleEntry/Entry2'
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook';
import { useSelector } from 'react-redux';

export default function AgentCandPaymentIn() {
  const { user } = useAuthContext();
  const [single, setSingle] = useState(0)
  const [, setNewMessage] = useState('')
  const apiUrl = process.env.REACT_APP_API_URL;

  const setEntry = (index) => {
    setSingle(index)

  }

  const [multiplePayment, setMultiplePayment] = useState([{date:'',supplierName: '', category: '', payment_Via: '', payment_Type: '', slip_No: '', payment_In: 0, details: '', curr_Country: '', curr_Rate: 0, curr_Amount: 0, cand_Name:''}])
  const [triggerEffect, setTriggerEffect] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Check if the file type is either Excel or CSV
    if (
      file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      file.type !== 'text/csv'
    ) {
      alert('Please upload a valid Excel or CSV file.');
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = e.target.result;
      const dataArray = parseExcelData(data);
      setMultiplePayment(dataArray);
      setTriggerEffect(true); // Trigger the useEffect when multiplePayment changes
    };

    fileReader.readAsBinaryString(file);

    // Clear the file input value
    e.target.value = null;
  };

 
  const parseExcelData = (data) => {
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dataArray = XLSX.utils.sheet_to_json(sheet);
    
    // Modify the dataArray to ensure missing fields are initialized with undefined
    const updatedDataArray = dataArray.map((entry, rowIndex) => {
      // Map over each entry and replace empty strings with undefined
      return Object.fromEntries(
        Object.entries(entry).map(([key, value]) => {
          const trimmedValue = typeof value === 'string' ? value.trim() : value; // Check if the value is a string before trimming
  
          // Convert the flight_Date value if the key is 'flight_Date'
          if (key === 'date') {
            if (!isNaN(trimmedValue) && trimmedValue !== '') {
              // Parse the numeric value as a date without time component
              const dateValue = new Date((trimmedValue - 25569) * 86400 * 1000 + new Date().getTimezoneOffset() * 60000); // Adjust for timezone offset
  
              if (!isNaN(dateValue.getTime())) {
                return [key, dateValue.toISOString().split('T')[0]]; // Format the date as 'YYYY-MM-DD' if the date is valid
              } else {
                console.error(`Row ${rowIndex + 2}, Column "${key}" has an invalid date value.`);
                return [key, undefined];
              }
            } 
          }
  
          return [key, trimmedValue === '' ? undefined : trimmedValue];
        })
      );
    });
  
    return updatedDataArray;

  }

  const handleInputChange = (rowIndex, key, value) => {
    const updatedData = [...multiplePayment];
    updatedData[rowIndex][key] = value;
    setMultiplePayment(updatedData);
  };

  
  const [loading, setLoading] = useState(false)
  const handleUploadList =async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const response = await fetch(`${apiUrl}/auth/agents/add/multiple/payment_in`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(multiplePayment)
      });

      const json = await response.json();
      if (response.ok) {
        setMultiplePayment('')
        setNewMessage(toast.success(json.message))
        setLoading(false)
      }
      if (!response.ok) {
        setLoading(false)
        setNewMessage(toast.error(json.message))
      }
    } catch (error) {
      setLoading(false)
      setNewMessage(toast.error("Server is not Reponding..."))


    }

  };

  useEffect(() => {
    if (triggerEffect) {
      setTriggerEffect(false);
    }
  }, [triggerEffect, multiplePayment]);

  const collapsed = useSelector((state) => state.collapsed.collapsed);

  
  return (
    <>
      <div  className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid payment_form">
          <div className="row">

            <div className="col-md-12">
              <Paper className='py-3 mb-1 px-2'>
                <h4>Cand-Vise Agents Payment IN</h4>
                <button className='btn m-1  btn-sm entry_btn' onClick={() => setEntry(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Single Payment-In</button>
                
                <button className='btn m-1 btn-sm entry_btn bg-danger border-0 text-white' onClick={() => setEntry(2)} style={single === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Double Entry</button>
              </Paper>
            </div>

            {/* Single payment Entry */}
            {single === 0 &&
              <AgentCandSinglePaymentIn></AgentCandSinglePaymentIn>
            }

            {single===2 && 
            <Entry1></Entry1>
            }
            {single===2 && 
            <Entry2></Entry2>
            }
          </div>
        </div>
      </div>

    </>
  )
}
