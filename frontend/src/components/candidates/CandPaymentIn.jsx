import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import SinglePaymentIn from './SinglePaymentIn';
import SupplierEntry1 from '../doubleEntry/SupplierEntry1';
import SupplierEntry2 from '../doubleEntry/SupplierEntry2';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook';
import { useSelector } from 'react-redux';

const allKeys = [
  'date', 'supplierName', 'pp_No', 'category', 'payment_Via', 'payment_Type', 'slip_No',
  'payment_In', 'details', 'curr_Country', 'curr_Rate', 'curr_Amount'
];

const defaultValues = {
  'date': '',
  'supplierName': '',
  'pp_No': '',
  'category': '',
  'payment_Via': '',
  'payment_Type': '',
  'slip_No': '',
  'payment_In': 0,
  'details': '',
  'curr_Country': '',
  'curr_Rate': 0,
  'curr_Amount': 0
};

const initializeMissingFields = (entry) => {
  const initializedEntry = { ...entry };
  allKeys.forEach(key => {
    if (!initializedEntry.hasOwnProperty(key)) {
      initializedEntry[key] = defaultValues[key];
    } else if (typeof defaultValues[key] === 'number') {
      initializedEntry[key] = parseFloat(initializedEntry[key]);
    }
  });
  return initializedEntry;
};

export default function CandPaymentIn() {
  const { user } = useAuthContext();
  const [single, setSingle] = useState(0);
  const [, setNewMessage] = useState('');
  const setEntry = (index) => {
    setSingle(index);
  };

  const [multiplePayment, setMultiplePayment] = useState([initializeMissingFields({})]);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setMultiplePayment(dataArray);
      setTriggerEffect(true);
    };

    fileReader.readAsBinaryString(file);
    e.target.value = null;
  };

  const parseExcelData = (data) => {
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dataArray = XLSX.utils.sheet_to_json(sheet);

    return dataArray.map((entry, rowIndex) => {
      return initializeMissingFields(
        Object.fromEntries(
          Object.entries(entry).map(([key, value]) => {
            const trimmedValue = typeof value === 'string' ? value.trim() : value;

            if (key === 'date' && !isNaN(trimmedValue) && trimmedValue !== '') {
              const dateValue = new Date((trimmedValue - 25569) * 86400 * 1000 + new Date().getTimezoneOffset() * 60000);
              return [key, !isNaN(dateValue.getTime()) ? dateValue.toISOString().split('T')[0] : undefined];
            }

            return [key, trimmedValue === '' ? undefined : trimmedValue];
          })
        )
      );
    });
  };

  const handleInputChange = (rowIndex, key, value) => {
    const updatedData = [...multiplePayment];
    if (typeof defaultValues[key] === 'number') {
      updatedData[rowIndex][key] = parseFloat(value) || defaultValues[key];
    } else {
      updatedData[rowIndex][key] = value;
    }
    setMultiplePayment(updatedData);
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleUploadList = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/auth/candidates/add/multiple/payment_in`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(multiplePayment)
      });

      const json = await response.json();
      if (response.ok) {
        setMultiplePayment([initializeMissingFields({})]);
        setNewMessage(toast.success(json.message));
        setLoading(false);
      } else {
        setLoading(false);
        setNewMessage(toast.error(json.message));
      }
    } catch (error) {
      setLoading(false);
      setNewMessage(toast.error("Server is not Responding..."));
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
      <div className={`${collapsed ? "collapsed" : "main"}`}>
        <div className="container-fluid payment_form">
          <div className="row">
            <div className="col-md-12">
              <Paper className='py-3 mb-1 px-2'>
                <h4>Candidates Payment In</h4>
                <button className='btn m-1 btn-sm entry_btn' onClick={() => setEntry(0)} style={single === 0 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Single Payment-In</button>
                <button className='btn m-1 btn-sm entry_btn' onClick={() => setEntry(1)} style={single === 1 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Multiple Payment-In</button>
                {single === 1 && <label className="btn m-1 btn-sm upload_btn">
                  Upload New List
                  <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>}
                <button className='btn m-1 btn-sm entry_btn bg-danger border-0 text-white' onClick={() => setEntry(2)} style={single === 2 ? { backgroundColor: 'var(--accent-lighter-blue)', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>Double Entry</button>
              </Paper>
            </div>

            {single === 0 && <SinglePaymentIn />}

            {single === 1 && (
              <div className="col-md-12 multiple_form">
                <Paper>
                  <form className='py-0 px-2' onSubmit={handleUploadList}>
                    <div className="text-end">
                      <button className='btn submit_btn m-1' disabled={loading}>{loading ? "Adding..." : "Add Payment"}</button>
                    </div>
                    <div className="table-responsive">
                      <table className='table table-borderless table-striped'>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>PP#</th>
                            <th>Category</th>
                            <th>Payment Via</th>
                            <th>Payment Type</th>
                            <th>Slip No</th>
                            <th>Payment In</th>
                            <th>Details</th>
                            <th>Currency Country</th>
                            <th>Currency Rate</th>
                            <th>Currency Amount</th>
                          </tr>
                        </thead>
                        <tbody className='p-0 m-0'>
                          {multiplePayment.length > 0 && multiplePayment.map((rowData, rowIndex) => (
                            <tr key={rowIndex} className='p-0 m-0'>
                              {allKeys.map((key, colIndex) => (
                                <td key={colIndex} className='p-0 m-0'>
                                  <input
                                    type={typeof defaultValues[key] === 'number' ? 'number' : 'text'}
                                    className='m-0'
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
                </Paper>
              </div>
            )}

            {single === 2 && (
              <>
                <SupplierEntry1 />
                <SupplierEntry2 />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
