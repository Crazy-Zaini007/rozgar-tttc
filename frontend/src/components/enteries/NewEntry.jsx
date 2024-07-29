import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import SingleEntry from './SingleEntry';
import * as XLSX from 'xlsx';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook';
import { addMulEnteries } from '../../redux/reducers/entrySlice'
import { useDispatch,useSelector } from 'react-redux';
import { toast } from 'react-toastify';


const allKeys = [
  'name', 'pp_No', 'trade', 'company', 'contact', 'country', 'flight_Date', 'final_Status', 'remarks', 'entry_Mode', 
  'reference_Out', 'reference_Out_Name', 'visa_Sales_Rate_PKR', 'visa_Sale_Rate_Oth_Cur', 'cur_Country_One', 
  'reference_In', 'reference_In_Name', 'visa_Purchase_Rate_PKR', 'visa_Purchase_Rate_Oth_Cur', 'cur_Country_Two', 
  'visit_Reference_Out', 'visit_Reference_Out_Name', 'visit_Sales_PKR', 'visit_Sales_Rate_Oth_Curr', 'visit_Sales_Cur', 
  'visit_Reference_In', 'visit_Reference_In_Name', 'visit_Purchase_Rate_PKR', 'visit_Purchase_Rate_Oth_Cur', 
  'visit_Purchase_Cur', 'ticket_Reference_Out', 'ticket_Reference_Out_Name', 'ticket_Sales_PKR', 'ticket_Sales_Rate_Oth_Cur', 
  'ticket_Sales_Cur', 'ticket_Reference_In', 'ticket_Reference_In_Name', 'ticket_Purchase_PKR', 'ticket_Purchase_Rate_Oth_Cur', 
  'ticket_Purchase_Cur', 'azad_Visa_Reference_Out', 'azad_Visa_Reference_Out_Name', 'azad_Visa_Sales_PKR', 
  'azad_Visa_Sales_Rate_Oth_Cur', 'azad_Visa_Sales_Cur', 'azad_Visa_Reference_In', 'azad_Visa_Reference_In_Name', 
  'azad_Visa_Purchase_PKR', 'azad_Visa_Purchase_Rate_Oth_Cur', 'azad_Visa_Purchase_Cur', 'protector_Price_In', 
  'protector_Price_In_Oth_Cur', 'protector_Price_Out', 'protector_Reference_In', 'protector_Reference_In_Name'
];
const defaultValues = {
  'name': '',
  'pp_No': '',
  'trade': '',
  'company': '',
  'contact': '',
  'country': '',
  'flight_Date': '',
  'final_Status': '',
  'remarks': '',
  'entry_Mode': '',
  'reference_Out': '',
  'reference_Out_Name': '',
  'visa_Sales_Rate_PKR': 0,
  'visa_Sale_Rate_Oth_Cur': 0,
  'cur_Country_One': '',
  'reference_In': '',
  'reference_In_Name': '',
  'visa_Purchase_Rate_PKR': 0,
  'visa_Purchase_Rate_Oth_Cur': 0,
  'cur_Country_Two': '',
  'visit_Reference_Out': '',
  'visit_Reference_Out_Name': '',
  'visit_Sales_PKR': 0,
  'visit_Sales_Rate_Oth_Curr': 0,
  'visit_Sales_Cur': '',
  'visit_Reference_In': '',
  'visit_Reference_In_Name': '',
  'visit_Purchase_Rate_PKR': 0,
  'visit_Purchase_Rate_Oth_Cur': 0,
  'visit_Purchase_Cur': '',
  'ticket_Reference_Out': '',
  'ticket_Reference_Out_Name': '',
  'ticket_Sales_PKR': 0,
  'ticket_Sales_Rate_Oth_Cur': 0,
  'ticket_Sales_Cur': '',
  'ticket_Reference_In': '',
  'ticket_Reference_In_Name': '',
  'ticket_Purchase_PKR': 0,
  'ticket_Purchase_Rate_Oth_Cur': 0,
  'ticket_Purchase_Cur': '',
  'azad_Visa_Reference_Out': '',
  'azad_Visa_Reference_Out_Name': '',
  'azad_Visa_Sales_PKR': 0,
  'azad_Visa_Sales_Rate_Oth_Cur': 0,
  'azad_Visa_Sales_Cur': '',
  'azad_Visa_Reference_In': '',
  'azad_Visa_Reference_In_Name': '',
  'azad_Visa_Purchase_PKR': 0,
  'azad_Visa_Purchase_Rate_Oth_Cur': 0,
  'azad_Visa_Purchase_Cur': '',
  'protector_Price_In': 0,
  'protector_Price_In_Oth_Cur': 0,
  'protector_Price_Out': 0,
  'protector_Reference_In': '',
  'protector_Reference_In_Name': ''
};

const initializeMissingFields = (entry) => {
  const initializedEntry = { ...entry };
  allKeys.forEach(key => {
    if (!initializedEntry.hasOwnProperty(key)) {
      initializedEntry[key] = defaultValues[key]; // Initialize missing fields with default values
    } else if (typeof defaultValues[key] === 'number') {
      initializedEntry[key] = parseFloat(initializedEntry[key]); // Ensure numeric values are parsed as numbers
    }
  });
  return initializedEntry;
};


export default function NewEntry() {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false)
  const[isDownload,setIsdownload]=useState(false)
  const [single, setSingle] = useState(0)
  const setEntry = (index) => {
    setSingle(index)
  }

  const [entries, setEntries] = useState([initializeMissingFields({})]);
  const [triggerEffect, setTriggerEffect] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

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
    e.target.value = null;
  };

  const parseExcelData = (data) => {
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dataArray = XLSX.utils.sheet_to_json(sheet);
  
    const seenEntries = new Set();
  
    const updatedDataArray = dataArray.reduce((acc, entry, rowIndex) => {
      const uniqueKey = `${entry.name}-${entry.pp_No}`;
      if (!seenEntries.has(uniqueKey)) {
        seenEntries.add(uniqueKey);
  
        const updatedEntry = initializeMissingFields(
          Object.fromEntries(
            Object.entries(entry).map(([key, value]) => {
              const trimmedValue = typeof value === 'string' ? value.trim() : value;
  
              if (key === 'flight_Date') {
                if (!isNaN(trimmedValue) && trimmedValue !== '') {
                  const dateValue = new Date((trimmedValue - 25569) * 86400 * 1000);
  
                  if (!isNaN(dateValue.getTime())) {
                    return [key, dateValue.toISOString().split('T')[0]];
                  } else {
                    console.error(`Row ${rowIndex + 2}, Column "${key}" has an invalid date value.`);
                    return [key, undefined];
                  }
                } else if (['Not Fly', 'Fly'].includes(trimmedValue)) {
                  return [key, trimmedValue];
                }
              }
  
              return [key, trimmedValue === '' ? undefined : trimmedValue];
            })
          )
        );
  
        acc.push(updatedEntry);
      }
      return acc;
    }, []);
  
    return updatedDataArray;
  };
  



  const handleInputChange = (rowIndex, key, value) => {
    const updatedData = [...entries];
    if (typeof defaultValues[key] === 'number') {
      const parsedValue = parseFloat(value);
      updatedData[rowIndex][key] = isNaN(parsedValue) ? defaultValues[key] : parsedValue;
    } else {
      updatedData[rowIndex][key] = value;
    }
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

  const addMultipleEntries = async (e) => {
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
        const existingEntries = json.data;
        // Assuming each entry has a unique identifier, e.g., 'id'
        const existingEntryIds = new Set(existingEntries.map(entry => (entry.name &&entry.pp_No &&entry.entry_Mode )));
        const filteredEntries = entries.filter(entry => !existingEntryIds.has(entry.name &&entry.pp_No &&entry.entry_Mode ));
        setEntries(filteredEntries);
        setTimeout(() => {
          if(filteredEntries.length>0){
            setIsdownload(true)
          }
        }, 1000);
        setNewMessage(toast.success(json.message))
        setLoading(false)
        dispatch(addMulEnteries(json.data)); 
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


  
  const downloadExcel = () => {
    const data = [];

    // Iterate over entries and push all fields
    entries.forEach((entry, index) => {
      const rowData = {
        name: entry.name,
        pp_No: entry.pp_No,
        trade: entry.trade,
        company: entry.company,
        contact: entry.contact,
        country: entry.country,
        flight_Date: entry.flight_Date,
        final_Status: entry.final_Status,
        remarks: entry.remarks,
        entry_Mode: entry.entry_Mode,
        reference_Out: entry.reference_Out,
        reference_Out_Name: entry.reference_Out_Name,
        visa_Sales_Rate_PKR: entry.visa_Sales_Rate_PKR,
        visa_Sale_Rate_Oth_Cur: entry.visa_Sale_Rate_Oth_Cur,
        cur_Country_One: entry.cur_Country_One,
        reference_In: entry.reference_In,
        reference_In_Name: entry.reference_In_Name,
        visa_Purchase_Rate_PKR: entry.visa_Purchase_Rate_PKR,
        visa_Purchase_Rate_Oth_Cur: entry.visa_Purchase_Rate_Oth_Cur,
        cur_Country_Two: entry.cur_Country_Two,
        // Visit  Section 
        visit_Reference_Out: entry.visit_Reference_Out,
        visit_Reference_Out_Name: entry.visit_Reference_Out_Name,
        visit_Sales_PKR: entry.visit_Sales_PKR,
        visit_Sales_Rate_Oth_Curr: entry.visit_Sales_Rate_Oth_Curr,
        visit_Sales_Cur: entry.visit_Sales_Cur,
        visit_Reference_In: entry.visit_Reference_In,
        visit_Reference_In_Name: entry.visit_Reference_In_Name,
        visit_Purchase_Rate_PKR: entry.visit_Purchase_Rate_PKR,
        visit_Purchase_Rate_Oth_Cur: entry.visit_Purchase_Rate_Oth_Cur,
        visit_Purchase_Cur: entry.visit_Purchase_Cur,

        // Ticket Section
        ticket_Reference_Out: entry.ticket_Reference_Out,
        ticket_Reference_Out_Name: entry.ticket_Reference_Out_Name,
        ticket_Sales_PKR: entry.ticket_Sales_PKR,
        ticket_Sales_Rate_Oth_Cur: entry.ticket_Sales_Rate_Oth_Cur,
        ticket_Sales_Cur: entry.ticket_Sales_Cur,
        ticket_Reference_In: entry.ticket_Reference_In,
        ticket_Reference_In_Name: entry.ticket_Reference_In_Name,
        ticket_Purchase_PKR: entry.ticket_Purchase_PKR,
        ticket_Purchase_Rate_Oth_Cur: entry.ticket_Purchase_Rate_Oth_Cur,
        ticket_Purchase_Cur: entry.ticket_Purchase_Cur,


        // Azad Visa Section 
        azad_Visa_Reference_Out: entry.azad_Visa_Reference_Out,
        azad_Visa_Reference_Out_Name: entry.azad_Visa_Reference_Out_Name,
        azad_Visa_Sales_PKR: entry.azad_Visa_Sales_PKR,
        azad_Visa_Sales_Rate_Oth_Cur: entry.azad_Visa_Sales_Rate_Oth_Cur,
        azad_Visa_Sales_Cur: entry.azad_Visa_Sales_Cur,
        azad_Visa_Reference_In: entry.azad_Visa_Reference_In,
        azad_Visa_Reference_In_Name: entry.azad_Visa_Reference_In_Name,
        azad_Visa_Purchase_PKR: entry.azad_Visa_Purchase_PKR,
        azad_Visa_Purchase_Rate_Oth_Cur: entry.azad_Visa_Purchase_Rate_Oth_Cur,
        azad_Visa_Purchase_Cur: entry.azad_Visa_Purchase_Cur,

        // Add other fields for Section 3

        protector_Price_In: entry.protector_Price_In,
        protector_Price_In_Oth_Cur: entry.protector_Price_In_Oth_Cur,
        protector_Price_Out: entry.protector_Price_Out,
        protector_Reference_In: entry.protector_Reference_In,
        protector_Reference_In_Name: entry.protector_Reference_In_Name,

      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Entries.xlsx');
  }

  const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <div className={`${collapsed ?"collapsed":"main"}`}>
      <div className="container-fluid new_entry">
        <div className="row">
          <div className="col-md-12 p-0 border-0 border-bottom">
            <div className='py-3 mb-1 px-2' >
              <h4>Add New Entry</h4>
              <button className='btn m-1  btn-sm entry_btn text-sm' onClick={() => setEntry(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Single Entry</button>
              <button className='btn m-1  btn-sm entry_btn text-sm' onClick={() => setEntry(1)} style={single === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Multiple Entries</button>

              {single === 1 &&
              <>
               <label className="btn m-1  btn-sm upload_btn">
                Upload New List
                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
              <button className='btn m-1  btn-sm upload_btn text-sm' onClick={() => downloadExcel()} disabled={entries.length<1}>Download</button>

              </>
              }

            </div>
          </div>
          {/* Single Entry */}
          {single === 0 &&
            <SingleEntry></SingleEntry>}

        

          {single === 1 &&
            <>
              <div className="col-md-12 multiple_form p-0">

                <div>
                  <form className='py-0 px-2' onSubmit={addMultipleEntries} >
                    <div className="text-end">
                      {entries && <button className='btn submit_btn m-1 btn-sm' disabled={loading}>{loading ? "Uploading..." : "Add Entries"}</button>}
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
                        <tbody>
          {entries && entries.map((rowData, rowIndex) => (
            <tr key={rowIndex}>
              {allKeys.map((key, colIndex) => (
                <td key={colIndex}>
                  <input className='p-1'
                    type="text"
                    value={rowData[key] || ""}
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
            </>
          }


        </div>
      </div>
    </div>
  );
}