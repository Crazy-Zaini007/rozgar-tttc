import React, { useState,useEffect } from 'react'
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
const allKeys = [
  'date', 'supplierName', 'expCategory', 'payment_Via', 'payment_Type', 'slip_No',
  'payment_Out', 'details', 'curr_Country', 'curr_Rate', 'curr_Amount'
];

const defaultValues = {
  'date': '',
  'supplierName': '',
  'expCategory': '',
  'payment_Via': '',
  'payment_Type': '',
  'slip_No': '',
  'payment_Out': 0,
  'details': '',
  'curr_Country': '',
  'curr_Rate': 0,
  'curr_Amount': 0
};

const errorKeys = [
  'paymentViaError', 'paymentTypeError', 'expenseCategoryError', 'nameError'
];

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

export default function AddMulExpenses() {
    const { user } = useAuthContext()

  const[isDownload,setIsdownload]=useState(false)
  
  const [multiplePayment, setMultiplePayment] = useState([initializeMissingFields({})]);
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

    return dataArray.map((entry) => {
      const filteredEntry = Object.fromEntries(
        Object.entries(entry).filter(([key]) => !errorKeys.includes(key))
      );
      return initializeMissingFields(filteredEntry);
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


  // Downloading Errors
  const downloadErrorsDetails = (payments) => {
    const data = [];
    // Flatten the array of objects to get an array of individual payment
    // Iterate over individual payments and push all fields
    payments.forEach((payment) => {
      const rowData = {
        date: payment.date,
        supplierName: payment.supplierName,
        expCategory: payment.expCategory,
        expenseCategoryError: payment.expenseCategoryError,
        payment_Via: payment.payment_Via,
        paymentViaError: payment.paymentViaError,
        payment_Type: payment.payment_Type,
        paymentTypeError: payment.paymentTypeError,
        slip_No: payment.slip_No,
        details: payment.details,
        payment_Out: payment.payment_Out,
        curr_Country: payment.curr_Country,
        curr_Rate: payment.curr_Rate,
        curr_Amount: payment.curr_Amount
      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Payments Errors Details.xlsx`);
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
              const existingEntries = json.data;
              if (existingEntries.length > 0) {
                downloadErrorsDetails(existingEntries)
              }
              setNewMessage(toast.success(json.message))
              setLoading(false)
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
                  Upload List 
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
        {multiplePayment && multiplePayment.map((rowData, rowIndex) => (
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
            </div>
        </div>
    </div>
      
    </>
  )
}
