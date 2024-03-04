import React, { useState, useEffect } from 'react'
import Paper from '@mui/material/Paper';
import CandViseSinglePaymentIn from './CandViseSinglePaymentIn';
import Entry1 from './candDoubleEntry/Entry1'
import * as XLSX from 'xlsx';

export default function CandVisePaymentIn() {

  const [single, setSingle] = useState(0)

  const setEntry = (index) => {
    setSingle(index)

  }

  const [formData, setFormData] = useState([{ Name: '', Category: '', Payment_Via: '', Payment_Type: '', Slip_No: '', Payment_In: '', Details: '', CUR_Country: '', CUR_Rate: '', Currency_Amount: '',cand_Name:'' }])
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
      setFormData(dataArray);
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
    return dataArray;
  };

  const handleInputChange = (rowIndex, key, value) => {
    const updatedData = [...formData];
    updatedData[rowIndex][key] = value;
    setFormData(updatedData);
  };

  const handleUploadList = (e) => {
    e.preventDefault();
    console.log([formData])
    setFormData([]);
    setSingle(1);
  };

  useEffect(() => {
    if (triggerEffect) {
      setTriggerEffect(false);
    }
  }, [triggerEffect, formData]);



  
  return (
    <>
      <div className="main">
        <div className="container-fluid payment_form">
          <div className="row">

            <div className="col-md-12">
              <Paper className='py-3 mb-1 px-2'>
                <h4>Cand-Vise Payment IN</h4>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Single Payment-In</button>
                <button className='btn m-1 py-2 btn-sm entry_btn' onClick={() => setEntry(1)} style={single === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Multiple Payment-In</button>
                {single === 1 && <label className="btn m-1 py-2 btn-sm upload_btn">
                  Upload New List
                  <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>}
                <button className='btn m-1 py-2 btn-sm entry_btn bg-danger border-0 text-white' onClick={() => setEntry(2)} style={single === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Double Entry</button>

              </Paper>
            </div>

            {/* Single payment Entry */}
            {single === 0 &&
              <CandViseSinglePaymentIn></CandViseSinglePaymentIn>
            }

            {/* Multiple  Entries */}
            {single === 1 &&
              <>
                <div className="col-md-12 multiple_form">

                  <Paper>
                    <form className='py-0 px-2' onSubmit={handleUploadList} >
                      <div className="text-end">
                        <button className='btn submit_btn m-1'>Add Payment</button>
                      </div>
                      <div className="table-responsive">
                        <table className='table table-borderless table-striped'>
                          <thead >
                            <tr >
                              <th >Candidate Name</th>
                              <th >Category</th>
                              <th >Payment_Via </th>
                              <th >Payment_Type</th>
                              <th >Slip_No</th>
                              <th >Payment_In </th>
                              <th >Details</th>
                              <th >CUR_Country </th>
                              <th >CUR_Rate</th>
                              <th >Currency_Amount</th>
                              <th >Candidate</th>

                            </tr>
                          </thead>
                          <tbody className='p-0 m-0'>
                            {formData.length > 0 && formData.map((rowData, rowIndex) => (
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
                  </Paper>

                </div>
              </>
            }

            {/* Double Entries */}

            {single===2 && 
            <Entry1></Entry1>
            }
          </div>


        </div>
      </div>

    </>
  )
}
