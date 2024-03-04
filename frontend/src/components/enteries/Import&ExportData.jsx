import React, { useState } from 'react';
import { Paper, Button } from '@mui/material';
import * as XLSX from 'xlsx';

export default function ImportExportData() {
  const [formData, setFormData] = useState({
    // Initialize form data fields
    Name: '',
    FatherName: '',
    PP_NO: '',
    DOB: '',
    PP_Exp: '',
    Trade: '',
    Company: '',
    Remarks: '',
    Contact: '',
    Final_Status: '',
    Flight_Date: '',
    PP_SR_Number: '',
    Passport_Send_Date: '',
    Purchase_Party: '',
    Address: '',
    Visa_Number: '',
    Visa_Expiry: '',
    Age: '',
    Country: '',
    Visa_Sale_Rate_PKR: '',
    // Add other fields as needed
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const importExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const importedData = XLSX.utils.sheet_to_json(sheet);

      // Merge imported data with existing form data
      if (importedData.length > 0) {
        setFormData((prevFormData) => ({ ...prevFormData, ...importedData[0] }));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      importExcel(file);
    }
  };

  return (
    <div className="main">
      <div className="container-fluid new_entry py-2">
        <div className="row">
          <div className="col-md-12">
            <h4>Import/Export Data</h4>

            <Paper className="py-3 px-2">
              <form className="py-3 px-2">
                {Object.entries(formData).map(([fieldName, fieldValue]) => (
                  <div key={fieldName} className="mb-3">
                    <label htmlFor={fieldName} className="form-label">
                      {fieldName}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={fieldName}
                      name={fieldName}
                      value={fieldValue}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}

                {/* File input and trigger button */}
                <div className="mb-3">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-input"
                  />
                  <label htmlFor="file-input">
                    <Button variant="contained" component="span" color="primary">
                      Import Excel
                    </Button>
                  </label>
                </div>

                {/* Example Button to trigger export */}
                <Button variant="contained" color="primary">
                  Export as Excel
                </Button>
              </form>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}
