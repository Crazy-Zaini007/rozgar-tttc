import React,{useState,useEffect,useRef} from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import BackupHook from '../hooks/backupHooks/BackupHook'
import { useSelector } from 'react-redux';

export default function Backup() {
  const abortCont = useRef(new AbortController());

  const {getBackup,backup}=BackupHook()
  useEffect(() => {
    getBackup()
    return () => {
      if (abortCont.current) {
        abortCont.current.abort(); 
      }
    }
  }, [])
  const[dateFrom,setDateFrom]=useState('')
  const[dateTo,setDateTo]=useState('')

  const filteredBackup = backup && backup.filter(backup => {
    let isDateInRange = true;
  
    // Check if the expense date is within the selected date range
    if (dateFrom && dateTo) {
      isDateInRange = backup.date >= dateFrom && backup.date <= dateTo;
    }
    return (
      isDateInRange
    );
  })

  const downloadExcel = (backup) => {
    // Check if backups is an array
    if (Array.isArray(backup.backups)) {
        const data = [];
        // Iterate over entries and push all fields
        backup.backups.forEach((payments, index) => {
            const rowData = {
                SN: index + 1,
                Date: payments.date,
                Person_Name: payments.name,
                Category: payments.category,
                Payment_Via: payments.payment_Via,
                Payment_Type: payments.payment_Type,
                Payment_In: payments?.payment_In ?? 0,
                Payment_Out: payments?.payment_Out ?? 0,
                Cash_Return: payments?.cash_Out ?? 0,
                Payment_In_Curr: payments.payment_In_Curr ? payments.payment_In_Curr : payments.payment_Out_Curr,
                Curr_Rate: payments?.curr_Rate ?? 0,
                Curr_Amount: payments?.curr_Amount ?? 0,
                details: payments?.details ?? '',
                invoice: payments.invoice,
            }
            data.push(rowData);
        });
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${backup.date} Backup.xlsx`);
    } else {
        console.error('Backup data is not an array');
    }
}

const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <div className={`${collapsed ?"collapsed":"main"}`}>
      <div className="container-fluid backup payment_details">
        <div className="row">
        <div className='col-md-12 p-0 border-0 border-bottom'>
              <div className='py-2 mb-2 px-2 d-flex justify-content-between'>
                <div className="left">
               <h4>Download Daily Backup</h4>
                </div>
              </div>
            </div>
            <div className=" col-md-12 filters">

<div className='py-1 mb-2 '>
<div className="row">
        <div className="col-auto my-2 p-1">
          <label htmlFor="">Date From:</label>
            <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
        </div>
        <div className="col-auto my-2 p-1">
          <label htmlFor="">Date To:</label>
            <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
        </div>
</div>
</div>
         
        </div>
            <div className="col-md-12 detail_table my-2 p-0">
                <TableContainer >
                    <Table stickyHeader>
                        <TableHead className="thead">
                            <TableRow>
                                <TableCell className='label border text-center' style={{ width: '18.28%' }}>SN</TableCell>
                                <TableCell className='label border text-center' style={{ width: '18.28%' }}>Date</TableCell>
                                <TableCell className='label border text-center' style={{ width: '18.28%' }}>Backup</TableCell>
                                <TableCell className='label border text-center' style={{ width: '18.28%' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {filteredBackup && filteredBackup.length>0 ? filteredBackup.map((backupEntry, index) => (
                    <TableRow key={index}>
                      <TableCell className='border text-center'>{index + 1}</TableCell>
                      <TableCell className='border text-center'>{backupEntry.date}</TableCell>
                      <TableCell className='border text-center'>{backupEntry.date} Backup</TableCell>
                      <TableCell className='border text-center'><button className='btn btn-warning shadow text-white btn-sm' onClick={()=>downloadExcel(backupEntry)}>Download <i class="fa fa-download" aria-hidden="true"></i></button></TableCell>
                    </TableRow>
                  )):<>
                  <TableRow>
                    <TableCell className="text-center"></TableCell>
                    <TableCell className="text-center">No Backup</TableCell>
                    <TableCell className="text-center"></TableCell>
                    <TableCell className="text-center"></TableCell>
                    
                  </TableRow>
                  </>}

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
      </div>
    </div>
  )
}
