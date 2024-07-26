const [multiplePayment, setMultiplePayment] = useState([{date:'',name: '', expCategory: '', payment_Via: '', payment_Type: '', slip_No: '', payment_Out: 0, details: '', curr_Country: '', curr_Rate: 0, curr_Amount: 0}])
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
  
    