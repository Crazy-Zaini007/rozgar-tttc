import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import SingleEntry from './SingleEntry';
import * as XLSX from 'xlsx';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook';
import { addMulEnteries } from '../../redux/reducers/entrySlice'
import { useDispatch,useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function NewEntry() {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false)

  const [single, setSingle] = useState(0)
  const setEntry = (index) => {
    setSingle(index)
  }

  const [entries, setEntries] = useState([{ name: '', pp_No: '', trade: '', company: '', contact: '', country: '', flight_Date: '', final_Status: '', remarks: '', entry_Mode: '', reference_Out: '', reference_Out_Name: '', visa_Sales_Rate_PKR: '', visa_Sale_Rate_Oth_Cur: '', cur_Country_One: '', reference_In: '', reference_In_Name: '', visa_Purchase_Rate_PKR: '', visa_Purchase_Rate_Oth_Cur: '', cur_Country_Two: '', visit_Reference_Out: '', visit_Reference_Out_Name: '', visit_Sales_PKR: '', visit_Sales_Rate_Oth_Curr: '', visit_Sales_Cur: '', visit_Reference_In: '', visit_Reference_In_Name: '', visit_Purchase_Rate_PKR: '', visit_Purchase_Rate_Oth_Cur: '', visit_Purchase_Cur: '', ticket_Reference_Out: '', ticket_Reference_Out_Name: '', ticket_Sales_PKR: '', ticket_Sales_Rate_Oth_Cur: '', ticket_Sales_Cur: '', ticket_Reference_In: '', ticket_Reference_In_Name: '', ticket_Purchase_PKR: '', ticket_Purchase_Rate_Oth_Cur: '', ticket_Purchase_Cur: '', azad_Visa_Reference_Out: '', azad_Visa_Reference_Out_Name: '', azad_Visa_Sales_PKR: '', azad_Visa_Sales_Rate_Oth_Cur: '', azad_Visa_Sales_Cur: '', azad_Visa_Reference_In: '', azad_Visa_Reference_In_Name: '', azad_Visa_Purchase_PKR: '', azad_Visa_Purchase_Rate_Oth_Cur: '', azad_Visa_Purchase_Cur: '', protector_Price_In: '',protector_Price_In_Oth_Cur:'', protector_Price_Out: '',protector_Reference_In:'',protector_Reference_In_Name:''  }])
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

      setEntries(dataArray);
      setTriggerEffect(true); // Trigger the useEffect when formData changes
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
          if (key === 'flight_Date') {
            if (!isNaN(trimmedValue) && trimmedValue !== '') {
              // Parse the numeric value as a date without time component
              const dateValue = new Date((trimmedValue - 25569) * 86400 * 1000 + new Date().getTimezoneOffset() * 60000); // Adjust for timezone offset
  
              if (!isNaN(dateValue.getTime())) {
                return [key, dateValue.toISOString().split('T')[0]]; // Format the date as 'YYYY-MM-DD' if the date is valid
              } else {
                console.error(`Row ${rowIndex + 2}, Column "${key}" has an invalid date value.`);
                return [key, undefined];
              }
            } else if (['Not Fly', 'Fly'].includes(trimmedValue)) {
              return [key, trimmedValue]; // Keep special strings as they are
            }
          }
  
          return [key, trimmedValue === '' ? undefined : trimmedValue];
        })
      );
    });
  
    return updatedDataArray;
  };
  
  

  

  const handleInputChange = (rowIndex, key, value) => {
    const updatedData = [...entries];
    updatedData[rowIndex][key] = value;
    setEntries(updatedData);
  };


  useEffect(() => {
    if (triggerEffect) {
      setTriggerEffect(false);
    }
  }, [triggerEffect, entries]);

  const [, setNewMessage] = useState('')
  const apiUrl = process.env.REACT_APP_API_URL;

  //Adding Multiple entries 
  const [uploadProgress, setUploadProgress] = useState(0);
  const addMultipleentries = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const response = await fetch(`${apiUrl}/auth/entries/add/multiple_enteries`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ entries })
      });

      const json = await response.json();
      if (response.ok) {
        setEntries('')
        setNewMessage(toast.success(json.message))
        setLoading(false)
        dispatch(addMulEnteries(json.data)); // Dispatch the action with received data
      }
      if (!response.ok) {
        setLoading(false)
        setNewMessage(toast.error(json.message))
      }
    } catch (error) {
      setLoading(false)
      setNewMessage(toast.error("Server is not Reponding..."))


    }

  }

  const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <div className={`${collapsed ?"collapsed":"main"}`}>
      <div className="container-fluid new_entry">
        <div className="row">
          <div className="col-md-12 ">
            <Paper className='py-3 mb-1 px-2' >
              <h4>Add New Entry</h4>
              <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Single Entry</button>
              <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(1)} style={single === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Multiple Entries</button>

              {single === 1 && <label className="btn m-1 py-2 btn-sm upload_btn">
                Upload New List
                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>}
            </Paper>
          </div>
          {/* Single Entry */}
          {single === 0 &&
            <SingleEntry></SingleEntry>}

          {/* Multiple  Entries */}

          {single === 1 &&
            <>
              <div className="col-md-12 multiple_form">

                <Paper>
                  <form className='py-0 px-2' onSubmit={addMultipleentries} >
                    <div className="text-end">
                      {entries && <button className='btn submit_btn m-1' disabled={loading}>{loading ? "Uploading..." : "Add Entries"}{uploadProgress>0 && uploadProgress}</button>}
                    </div>
                    <div className="table-responsive">
                      <table className='table table-borderless table-striped'>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>PP_No</th>
                            <th>Trade </th>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Country </th>
                            <th>Flight_Date </th>
                            <th>Final_Status</th>
                            <th>Remarks </th>
                            <th>Entry_Mode</th>

                            <th>Reference_Out</th>
                            <th>Reference_Out_Name</th>
                            <th>Visa_Sales_Rate_PKR </th>
                            <th>Visa_Sales_Rate(Oth_Cur)</th>
                            <th>Cur_Country</th>

                            <th>Reference_In </th>
                            <th>Reference_In_Name </th>
                            <th>Visa_Purchase_Rate_PKR</th>
                            <th>Visa_Purch_Rate(Oth_Cur) </th>
                            <th>Cur_Country </th>


                            <th>Visit_Reference_Out</th>
                            <th>Visit_Reference_Out_Name</th>
                            <th>Visit_Sales_PKR</th>
                            <th>visit_Sales_Rate_Oth_Curr</th>
                            <th>visit_Sales_Cur</th>

                            <th>Visit_Reference_In</th>
                            <th>Visit_Reference_In_Name</th>
                            <th>Visit_Purchase_Rate_PKR </th>
                            <th>Visit_Purch_Rate_Oth_Cur</th>
                            <th>Visit_Purchase_Cur </th>

                            <th>Ticket_Reference_Out</th>
                            <th>ticket_Reference_Out_Name</th>
                            <th>ticket_Sales_PKR</th>
                            <th>ticket_Sales_Rate_Oth_Cur</th>
                            <th>ticket_Sales_Cur</th>

                            <th>Ticket_Reference_In </th>
                            <th>Ticket_Reference_In_Name</th>
                            <th>Ticket_Purchase_PKR</th>
                            <th>ticket_Purch_Rate_Oth_Cur </th>
                            <th>ticket_Purchase_Cur</th>

                            <th>Azad_Visa_Reference_Out </th>
                            <th>Azad_Visa_Reference_Out_Name</th>
                            <th>Azad_Visa_Sales_PKR</th>
                            <th>Azad_Visa_Sales_Rate_Oth_Cur </th>
                            <th>Azad_Visa_Sales_Cur</th>

                            <th>Azad_Visa_Reference_In</th>
                            <th>Azad_Visa_Reference_In_Name</th>
                            <th>Azad_Visa_Purchase_PKR</th>
                            <th>azad_Visa_Purch_Rate_Oth_Cur</th>
                            <th>azad_Visa_Purchase_Cur</th>

                            <th>Protector_Price_In</th>
                            <th>Protector_Price_In_Oth_Cur</th>
                            <th>Protector_Price_Out</th>
                            <th>Protector_Reference_In</th>
                            <th>Protector_Reference_In_Name</th>

                          </tr>
                        </thead>
                        <tbody className='p-0 m-0'>
                          {entries && entries.map((rowData, rowIndex) => (
                            <tr key={rowIndex} className='p-0 m-0'>
                              {Object.entries(rowData).map(([key, value], colIndex) => (
                                <td key={colIndex} className='p-0 m-0'>
                                  <input
                                    type="text"
                                    className='m-0'
                                    value={value || ""}
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
                </Paper>

              </div>
            </>
          }


        </div>
      </div>
    </div>
  );
}