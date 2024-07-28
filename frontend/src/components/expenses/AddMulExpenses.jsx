import React, { useState,useEffect } from 'react'
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';



const allKeys = [
  'date', 'name', 'expCategory', 'payment_Via', 'payment_Type', 'slip_No', 
  'payment_Out', 'details', 'curr_Country', 'curr_Rate', 'curr_Amount'
]
const defaultValues = {
  'date': '',
  'name': '',
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
}

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
  
    return dataArray.map((entry, rowIndex) => {
      return initializeMissingFields(
        Object.fromEntries(
          Object.entries(entry).map(([key, value]) => {
            const trimmedValue = typeof value === 'string' ? value.trim() : value;
  
            if (key === 'date' && !isNaN(trimmedValue) && trimmedValue !== '') {
              const dateValue = new Date(Math.round((trimmedValue - 25569) * 86400 * 1000));
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
              // Assuming each entry has a unique identifier, e.g., 'id'
              const existingEntryIds = new Set(existingEntries.map(entry => (entry.date&&entry.supplierName&&entry.category&&entry.payment_Via&&entry.payment_Type&&entry.slip_No&&entry.payment_In )));
              const filteredEntries = multiplePayment.filter(entry => !existingEntryIds.has(entry.date&&entry.supplierName&&entry.category&&entry.payment_Via&&entry.payment_Type&&entry.slip_No&&entry.payment_In ));
              setMultiplePayment(filteredEntries);
              setTimeout(() => {
                if(filteredEntries.length>0){
                  setIsdownload(true)
                }
              }, 1000);
              
              setNewMessage(toast.success(json.message))
              setLoading(false)
            }

        } catch (error) {

            setNewMessage(toast.error('Server is not Responding...'));
            setLoading(false);
        }
    };
    
    const collapsed = useSelector((state) => state.collapsed.collapsed);
    
  const downloadIndividualPayments = () => {
    const data = [];
    multiplePayment.forEach((payment) => {
      const rowData = {
        date: payment.date,
        name: payment.name,
        expCategory: payment.expCategory,
        payment_Via: payment.payment_Via,
        payment_Type: payment.payment_Type,
        Details: payment.details,
        slip_No: payment.slip_No,
        payment_Out: payment.payment_Out,
        details: payment.details,
        curr_Country: payment.curr_Country,
        curr_Rate: payment.curr_Rate,
        curr_Amount: payment.curr_Amount
      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Remaining Payments.xlsx`);
  }
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
              <button className='btn m-1  btn-sm upload_btn text-sm' onClick={() => downloadIndividualPayments()} disabled={multiplePayment.length<1}>Download</button>

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
</div>

</div>
            </div>
        </div>
    </div>
      
    </>
  )
}
