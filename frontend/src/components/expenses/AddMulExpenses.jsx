import React, { useState,useEffect } from 'react'
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';

export default function AddMulExpenses() {
    const { user } = useAuthContext()

    const [multiplePayment, setMultiplePayment] = useState([{date:'',name: '', expCategory: '', payment_Via: '', payment_Type: '', slip_No: '', payment_Out: 0, details: '', curr_Country: '', curr_Rate: 0, curr_Amount: 0}])
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
    }
  
   
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
    }
  
    
    useEffect(() => {
        if (triggerEffect) {
          setTriggerEffect(false);
        }
      }, [triggerEffect, multiplePayment]);

      
    // Submitting Form Data
    const [loading, setLoading] = useState(null)
    const [, setNewMessage] = useState('')
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleUploadList = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/auth/expenses/add/multiple/expense`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(multiplePayment),
            });

            const json = await response.json();
            if (!response.ok) {
                setNewMessage(toast.error(json.message));
                setLoading(false)

            }
            if (response.ok) {
                setNewMessage(toast.success(json.message));
                setMultiplePayment('')
            }

        } catch (error) {

            setNewMessage(toast.error('Server is not Responding...'));
            setLoading(false);
        }
    };
    
    const collapsed = useSelector((state) => state.collapsed.collapsed);
    return (
      <>
      <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid payment_form">
            <div className="row">
            <div className="col-md-12 p-0 border-0 border-bottom">
                            <div className='py-3 mb-1 px-2'>
                                <h4>Adding Multiple Expenses</h4>
                                <label className="btn m-1 py-2 btn-sm upload_btn">
                  Upload New List 
                  <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
                            </div>
                        </div>
                        <div className="col-md-12 multiple_form p-0">

<div>
  <form className='py-0 px-2' onSubmit={handleUploadList} >
    <div className="text-end">
      <button className='btn btn-sm  submit_btn m-1' disabled={loading}>{loading?"Adding...":"Add Expenses"}</button>
    </div>
    <div className="table-responsive">
      <table className='table table-borderless table-striped'>
        <thead >
          <tr >
            <th >Date</th>
            <th >Expense Person</th>
            <th >ExpCategory</th>
            <th >Payment_Via </th>
            <th >Payment_Type</th>
            <th >Slip_No</th>
            <th >Exp_Amount </th>
            <th >Details</th>
            <th >CUR_Country </th>
            <th >CUR_Rate</th>
            <th >Currency_Amount</th>

          </tr>
        </thead>
        <tbody className='p-0 m-0'>
          {multiplePayment.length > 0 && multiplePayment.map((rowData, rowIndex) => (
            <tr key={rowIndex} className='p-0 m-0'>
              {Object.entries(rowData).map(([key, value], colIndex) => (
                <td key={colIndex} className='p-0 m-0'>

                  <input
                    type="text"
                    className='m-0'
                    value={value}
                    onChange={(e) => handleInputChange(rowIndex, key, e.target.value)}
                  />

                </td>
              ))}
            </tr>
          ))}


        </tbody>

      </table>
    </div>

  </form>
</div>

</div>
            </div>
        </div>
    </div>
      
    </>
  )
}
