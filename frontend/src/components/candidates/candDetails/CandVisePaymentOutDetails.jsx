
import React, { useEffect, useState } from 'react'
import CandidateHook from '../../../hooks/candidateHooks/CandidateHook'
import { useSelector, useDispatch } from 'react-redux';
import { useAuthContext } from '../../../hooks/userHooks/UserAuthHook';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import CategoryHook from '../../../hooks/settingHooks/CategoryHook'
import PaymentViaHook from '../../../hooks/settingHooks/PaymentViaHook'
import PaymentTypeHook from '../../../hooks/settingHooks/PaymentTypeHook'
import CurrencyHook from '../../../hooks/settingHooks/CurrencyHook'
import CompanyHook from '../../../hooks/settingHooks/CompanyHook'
import CountryHook from '../../../hooks/settingHooks/CountryHook'
import EntryMoodHook from '../../../hooks/settingHooks/EntryMoodHook'
import FinalStatusHook from '../../../hooks/settingHooks/FinalStatusHook'
import TradeHook from '../../../hooks/settingHooks/TradeHook'
import { toast } from 'react-toastify';
import SyncLoader from 'react-spinners/SyncLoader'

export default function CandVisePaymentOutDetails() {
  const [isLoading, setIsLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const [loading5, setLoading5] = useState(false)

  const [, setNewMessage] = useState('')

  const { getCurrencyData } = CurrencyHook()
  const { getCategoryData } = CategoryHook()
  const { getPaymentViaData } = PaymentViaHook()
  const { getPaymentTypeData } = PaymentTypeHook()
  const { getComapnyData } = CompanyHook()
  const { getCountryData } = CountryHook()
  const { getEntryMoodData } = EntryMoodHook()
  const { getFinalStatusData } = FinalStatusHook()
  const { getTradeData } = TradeHook()

  const { getPaymentsOut } = CandidateHook()
  const { user } = useAuthContext()
  const dispatch = useDispatch()


  const fetchData = async () => {

    try {
      setIsLoading(true)
      await getPaymentsOut();
      setIsLoading(false);

      await Promise.all([
        getCategoryData(),
        getPaymentViaData(),
        getPaymentTypeData(),
        getCurrencyData(),
        getComapnyData(),
        getCountryData(),
        getEntryMoodData(),
        getFinalStatusData(),
        getTradeData()
      ])

    } catch (error) {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [])

  const currencies = useSelector((state) => state.setting.currencies);
  const paymentVia = useSelector((state) => state.setting.paymentVia);
  const paymentType = useSelector((state) => state.setting.paymentType);
  const categories = useSelector((state) => state.setting.categories);
  const companies = useSelector((state) => state.setting.companies);
  const countries = useSelector((state) => state.setting.countries);
  const entryMode = useSelector((state) => state.setting.entryMode);
  const finalStatus = useSelector((state) => state.setting.finalStatus);
  const trades = useSelector((state) => state.setting.trades);

  const candidate_Payments_Out = useSelector((state) => state.candidates.candidate_Payments_Out);
  const downloadExcel = () => {
    const data = [];
    // Iterate over entries and push all fields
    candidate_Payments_Out.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,

        // Add other fields for Section 4
      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Candidates_Payments_Details.xlsx');
  };


  const rowsPerPageOptions = [10, 15, 30];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const [option, setOption] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState('');

  const handleRowClick = (supplierName) => {
    setSelectedSupplier(supplierName);
    setOption(!option)
  };

  const handleOption = () => {
    setOption(!option)

  }


  // Editing for single Payment In 
  const [editMode, setEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState({});
  const [editedRowIndex, setEditedRowIndex] = useState(null);

  const handleEditClick = (paymentItem, index) => {
    setEditMode(!editMode);
    setEditedEntry(paymentItem);
    setEditedRowIndex(index); // Set the index of the row being edited
  };


  const handleInputChange = (e, field) => {
    setEditedEntry({
      ...editedEntry,
      [field]: e.target.value,
    });

  };

  const handleImageChange = (e, field) => {
    if (field === 'slip_Pic') {
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditedEntry({
            ...editedEntry,
            [field]: reader.result, // Use reader.result as the image data URL
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };


  const deletePaymentIn = async (payment) => {
    setLoading1(true)
    debugger
    let paymentId = payment._id
    try {
      const response = await fetch(`/auth/candidates/delete/single/payment_out`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ paymentId, supplierName: selectedSupplier, payment_Via: payment.payment_Via, payment_Out: payment.payment_Out, cash_Out: payment.cash_Out, curr_Amount: payment.curr_Amount })
      })

      const json = await response.json()

      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading1(false)
      }
      if (response.ok) {
        getPaymentsOut();
        setNewMessage(toast.success(json.message));
        setLoading1(false)
        setEditMode(!editMode)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setLoading1(false)
    }
  }


  //updating single payment in
  const handleUpdate = async () => {
    setLoading3(true)
    let paymentId = editedEntry._id
    try {
      const response = await fetch(`/auth/candidates/update/single/payment_out`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ paymentId, supplierName: selectedSupplier, category: editedEntry.category, payment_Via: editedEntry.payment_Via, payment_Type: editedEntry.payment_Type, slip_No: editedEntry.slip_No, details: editedEntry.details, payment_Out: editedEntry.payment_Out, cash_Out: editedEntry.cash_Out, curr_Country: editedEntry.payment_Out_Curr, curr_Amount: editedEntry.curr_Amount, slip_Pic: editedEntry.slip_Pic, date: editedEntry.date })
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading3(false)
      }
      if (response.ok) {

        setNewMessage(toast.success(json.message));
        setLoading3(null)
        setEditMode(!editMode)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setLoading3(false)
    }
  }

  //Editing for Agent Total Payment in
  const [editMode1, setEditMode1] = useState(false);
  const [editedEntry1, setEditedEntry1] = useState({});
  const [editedRowIndex1, setEditedRowIndex1] = useState(null);

  const handleTotalPaymentEditClick = (paymentItem, index) => {
    setEditMode1(!editMode1);
    setEditedEntry1(paymentItem);
    setEditedRowIndex1(index); // Set the index of the row being edited
  };


  const handleTotalPaymentInputChange = (e, field) => {
    setEditedEntry1({
      ...editedEntry1,
      [field]: e.target.value,
    });

  };


  const handleTotalPaymentUpdate = async () => {
    setLoading3(true)
    try {
      const response = await fetch(`/auth/candidates/update/all/payment_out`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ supplierName: editedEntry1.supplierName,pp_No:editedEntry1.pp_No,entry_Mode:editedEntry1.entry_Mode,company:editedEntry1.company,country:editedEntry1.country,trade:editedEntry1.trade,final_Status:editedEntry1.final_Status,flight_Date:editedEntry1.flight_Date,flight_Date:editedEntry1.flight_Date, total_Payment_Out: editedEntry1.total_Payment_Out, total_Cash_Out: editedEntry1.total_Cash_Out, total_Visa_Price_Out_Curr: editedEntry1.total_Visa_Price_Out_Curr, open: editedEntry1.open, close: editedEntry1.close  })
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading3(false)
      }
      if (response.ok) {
        getPaymentsOut();
        setNewMessage(toast.success(json.message));
        setLoading3(null)
        setEditMode1(!editMode1)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setLoading3(false)
    }
  }


  const deleteTotalpayment = async (person) => {
    setLoading5(true)
    debugger
    try {
      const response = await fetch(`/auth/candidates/delete/all/payment_out`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ supplierName: person.supplierName })
      })

      const json = await response.json()

      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading5(false)
      }
      if (response.ok) {
        getPaymentsOut();
        setNewMessage(toast.success(json.message));
        setLoading5(false)
        setEditMode1(!editMode1)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setLoading5(false)
    }
  }





  return (
    <>
      {!option &&
        <>
          <div className='col-md-12 '>
            <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
              <div className="left d-flex">
                <h4>PaymentOut Details</h4>
              </div>
              <div className="right d-flex">
                {candidate_Payments_Out.length > 0 &&
                  <>
                    {/* <button className='btn pdf_btn m-1 btn-sm' onClick={downloadPDF}><i className="fa-solid fa-file-pdf me-1 "></i>Download PDF </button> */}
                    <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}>Download </button>
                  </>
                }
              </div>
            </Paper>
          </div>
          {isLoading &&
            <div className='col-md-12 text-center my-4'>
              <SyncLoader color="#2C64C3" className='mx-auto' />
            </div>
          }

          {!isLoading &&
            <div className='col-md-12'>
              <Paper className='py-3 mb-1 px-2 detail_table'>
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>

                    <TableRow>
                      <TableCell className='label border'>SN</TableCell>
                      <TableCell className='label border'>Date</TableCell>
                      <TableCell className='label border'>Candidates</TableCell>
                      <TableCell className='label border'>PP#</TableCell>
                      <TableCell className='label border'>EM</TableCell>
                      <TableCell className='label border'>Company</TableCell>
                      <TableCell className='label border'>Country</TableCell>
                      <TableCell className='label border'>Trade</TableCell>
                      <TableCell className='label border'>FS</TableCell>
                      <TableCell className='label border'>FD</TableCell>
                      <TableCell className='label border'>TVPO_PKR</TableCell>
                      <TableCell className='label border'>TVPO_Oth_Curr</TableCell>
                      <TableCell className='label border'>TPO_PKR</TableCell>
                      <TableCell className='label border'>Total_Cash_Out</TableCell>
                      <TableCell className='label border'>RPO_PKR</TableCell>
                      <TableCell className='label border'>Close</TableCell>
                      <TableCell className='label border'>Open</TableCell>
                      <TableCell align='left' className='edw_label border' colSpan={1}>
                        Actions
                      </TableCell>
                    </TableRow>
                    </TableHead>

                    <TableBody>
                      {candidate_Payments_Out
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry, outerIndex) => (
                          // Map through the payment array
                          <React.Fragment key={outerIndex}>

                            <TableRow key={entry?._id} className={outerIndex % 2 === 0 ? 'bg_white' : 'bg_dark'} >
                              {editMode1 && editedRowIndex1 === outerIndex ? (
                                // Edit Mode
                                <>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='date' value={outerIndex + 1} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='date' value={editedEntry1.createdAt} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='date' value={editedEntry1.supplierName} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry1.pp_No} onChange={(e) => handleTotalPaymentInputChange(e, 'pp_No')} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <select value={editedEntry1.entry_Mode} onChange={(e) => handleTotalPaymentInputChange(e, 'entry_Mode')} required>
                                    <option value="">Choose</option>
                                    {entryMode && entryMode.map((data) => (
                                      <option key={data._id} value={data.entry_Mode}>{data.entry_Mode}</option>
                                    ))}
                                  </select>
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <select value={editedEntry1.company} onChange={(e) => handleTotalPaymentInputChange(e, 'company')} required>
                                    <option value="">Choose</option>
                                    {companies && companies.map((data) => (
                                      <option key={data._id} value={data.company}>{data.company}</option>
                                    ))}
                                  </select>
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <select value={editedEntry1.country} onChange={(e) => handleTotalPaymentInputChange(e, 'country')} required>
                                    <option value="">Choose</option>
                                    {countries && countries.map((data) => (
                                      <option key={data._id} value={data.country}>{data.country}</option>
                                    ))}
                                  </select>
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <select value={editedEntry1.trade} onChange={(e) => handleTotalPaymentInputChange(e, 'trade')} required>
                                    <option value="">Choose</option>
                                    {trades && trades.map((data) => (
                                      <option key={data._id} value={data.trade}>{data.trade}</option>
                                    ))}
                                  </select>
                                 
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <select value={editedEntry1.final_Status} onChange={(e) => handleTotalPaymentInputChange(e, 'final_Status')} required>
                                    <option value="">Choose</option>
                                    {finalStatus && finalStatus.map((data) => (
                                      <option key={data._id} value={data.final_Status}>{data.final_Status}</option>
                                    ))}
                                  </select>
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <input type='date' value={editedEntry1.flight_Date} onChange={(e) => handleTotalPaymentInputChange(e, 'flight_Date')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry1.total_Visa_Price_Out_PKR} onChange={(e) => handleTotalPaymentInputChange(e, 'total_Visa_Price_Out_PKR')} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry1.total_Visa_Price_Out_Curr} onChange={(e) => handleTotalPaymentInputChange(e, 'total_Visa_Price_Out_Curr')} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry1.total_Payment_Out} onChange={(e) => handleTotalPaymentInputChange(e, 'total_Payment_Out')} required />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' min='0' value={editedEntry1.total_Cash_Out} onChange={(e) => handleTotalPaymentInputChange(e, 'total_Cash_Out')} required />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='number' value={editedEntry1.remaining_Balance} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                  <input type='checkbox' value={editedEntry1.close}  onChange={(e) => handleTotalPaymentInputChange(e, 'close')}  />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='checkbox' value={editedEntry1.open}  onChange={(e) => handleTotalPaymentInputChange(e, 'open')}  />
                                </TableCell>
                                  {/* ... Other cells in edit mode */}
                                  <TableCell className='border data_td p-1 '>
                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                      <button onClick={() => setEditMode1(false)} className='btn delete_btn'>Cancel</button>
                                      <button onClick={() => handleTotalPaymentUpdate()} className='btn save_btn' disabled={loading3}>{loading3 ? "Saving..." : "Save"}</button>
                                    </div>
                                  </TableCell>
                                </>
                              ) : (
                                // Non-Edit Mode
                                <>
                                  <TableCell className='border data_td text-center'>{outerIndex + 1}</TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.createdAt}
                                  </TableCell>
                                  <TableCell className='border data_td text-center' onClick={() => handleRowClick(entry.supplierName)}>
                                    {entry.supplierName}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.pp_No}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.entry_Mode}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.company}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.country}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.trade}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.final_Status}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.flight_Date}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.total_Visa_Price_Out_PKR}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.total_Visa_Price_Out_Curr}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    <i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{entry.total_Payment_In}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    <i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{entry.total_Cash_Out}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.remaining_Balance}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    {entry.close === false ? "Not Closed" : "Closed"}
                                  </TableCell>
                                  <TableCell className='border data_td text-center'>
                                    <span>{entry.open === true ? "Opened" : "Not Opened"}</span>
                                  </TableCell>
                                  {/* ... Other cells in non-edit mode */}
                                  <TableCell className='border data_td p-1 '>
                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                      <button onClick={() => handleTotalPaymentEditClick(entry, outerIndex)} className='btn edit_btn'>Edit</button>
                                      <button className='btn delete_btn' data-bs-toggle="modal" data-bs-target="#deleteModal" disabled={loading5}>{loading5 ? "Deleting..." : "Delete"}</button>
                                    </div>
                                    <div className="modal fade delete_Modal p-0" data-bs-backdrop="static" id="deleteModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                      <div className="modal-dialog p-0">
                                        <div className="modal-content p-0">
                                          <div className="modal-header border-0">
                                            <h5 className="modal-title" id="exampleModalLabel">Attention!</h5>
                                            {/* <button type="button" className="btn-close shadow rounded" data-bs-dismiss="modal" aria-label="Close" /> */}
                                          </div>
                                          <div className="modal-body text-center p-0">

                                            <p>Do you want to Delete the Record?</p>
                                          </div>
                                          <div className="text-end m-2">
                                            <button type="button " className="btn rounded m-1 cancel_btn" data-bs-dismiss="modal" >Cancel</button>
                                            <button type="button" className="btn m-1 confirm_btn rounded" data-bs-dismiss="modal" onClick={() => deleteTotalpayment(entry)}>Confirm</button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </>
                              )}
                            </TableRow>

                          </React.Fragment>
                        ))}
                    </TableBody>

                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={rowsPerPageOptions}
                  component='div'
                  count={candidate_Payments_Out.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  style={{
                    color: 'blue',
                    fontSize: '14px',
                    fontWeight: '700',
                    textTransform: 'capitalize',
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </div>
          }
        </>
      }

      {option && selectedSupplier && (
        <>
          {/* Display Table for selectedSupplier's payment details array */}
          <div className="col-md-12 my-2">
            <div className="d-flex justify-content-between supplier_Name">
              <div className="left d-flex">
                <h4 className='d-inline '>Candidate Name: <span>{selectedSupplier}</span></h4>

              </div>
              <div className="right">
                {selectedSupplier && <button className='btn detail_btn' onClick={handleOption}><i className="fas fa-times"></i></button>}

              </div>
            </div>
          </div>
          <div className="col-md-12 detail_table my-2">
            <h6>Payment In Details</h6>
            <TableContainer component={Paper}>
              <Table>
                <TableHead className="thead">
                  <TableRow>
                    <TableCell className='label border'>Date</TableCell>
                    <TableCell className='label border'>Category</TableCell>
                    <TableCell className='label border'>Payment_Via</TableCell>
                    <TableCell className='label border'>Payment_Type</TableCell>
                    <TableCell className='label border'>Slip_No</TableCell>
                    <TableCell className='label border'>Details</TableCell>
                    <TableCell className='label border'>Payment_Out</TableCell>
                    <TableCell className='label border'>Cash_Out</TableCell>
                    <TableCell className='label border'>Candidate</TableCell>
                    <TableCell className='label border'>Invoice</TableCell>
                    <TableCell className='label border'>Payment_Out_Curr</TableCell>
                    <TableCell className='label border'>CUR_Amount</TableCell>
                    <TableCell className='label border'>Slip_Pic</TableCell>
                    <TableCell align='left' className='edw_label border' colSpan={1}>
                      Actions
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidate_Payments_Out
                    .filter((data) => data.supplierName === selectedSupplier)
                    .map((filteredData) => (
                      // Map through the payment array
                      <>
                        {filteredData.payment && filteredData.payment?.map((paymentItem, index) => (
                          <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                            {editMode && editedRowIndex === index ? (
                              <>
                                <TableCell className='border data_td p-1 '>
                                  <input type='date' value={editedEntry.date} onChange={(e) => handleInputChange(e, 'date')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <select value={editedEntry.category} onChange={(e) => handleInputChange(e, 'category')} required>
                                    <option value="">Choose</option>
                                    {categories && categories.map((data) => (
                                      <option key={data._id} value={data.category}>{data.category}</option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <select value={editedEntry.payment_Via} onChange={(e) => handleInputChange(e, 'payment_Via')} required>
                                    <option value="">Choose</option>
                                    {paymentVia && paymentVia.map((data) => (
                                      <option key={data._id} value={data.payment_Via}>{data.payment_Via}</option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <select value={editedEntry.payment_Type} onChange={(e) => handleInputChange(e, 'payment_Type')} required>
                                    <option value="">Choose</option>
                                    {paymentType && paymentType.map((data) => (
                                      <option key={data._id} value={data.payment_Type}>{data.payment_Type}</option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.slip_No} onChange={(e) => handleInputChange(e, 'slip_No')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.details} onChange={(e) => handleInputChange(e, 'details')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.payment_Out} onChange={(e) => handleInputChange(e, 'payment_Out')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.cash_Out} onChange={(e) => handleInputChange(e, 'cash_Out')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.cand_Name} onChange={(e) => handleInputChange(e, 'cand_Name')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.invoice} readonly />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <select required value={editedEntry.payment_Out_Curr} onChange={(e) => handleInputChange(e, 'payment_Out_Curr')}>
                                    <option className="my-1 py-2" value="">choose</option>
                                    {currencies && currencies.map((data) => (
                                      <option className="my-1 py-2" key={data._id} value={data.currency}>{data.currency}</option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.curr_Amount} onChange={(e) => handleInputChange(e, 'curr_Amount')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'slip_Pic')} />
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className='border data_td text-center'>{paymentItem?.date}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.category}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.payment_Via}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.payment_Type}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.slip_No}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.details}</TableCell>
                                <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-down me-2 text-success text-bold"></i>{paymentItem?.payment_Out}</TableCell>
                                <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.cash_Out}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.cand_Name}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.invoice}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.payment_Out_Curr}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem?.curr_Amount}</TableCell>
                                <TableCell className='border data_td text-center'>{paymentItem.slip_Pic ? <img src={paymentItem.slip_Pic} alt='Images' className='rounded' /> : "No Picture"}</TableCell>


                              </>
                            )}
                            <TableCell className='border data_td p-1 '>
                              {editMode && editedRowIndex === index ? (
                                // Render Save button when in edit mode for the specific row
                                <>
                                  <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button onClick={() => setEditMode(!editMode)} className='btn delete_btn'>Cancel</button>
                                    <button onClick={() => handleUpdate()} className='btn save_btn' disabled={loading3}>{loading3 ? "Saving..." : "Save"}</button>

                                  </div>

                                </>

                              ) : (
                                // Render Edit button when not in edit mode or for other rows
                                <>
                                  <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button onClick={() => handleEditClick(paymentItem, index)} className='btn edit_btn'>Edit</button>
                                    <button className='btn delete_btn' data-bs-toggle="modal" data-bs-target="#deleteModal" disabled={loading1}>{loading1 ? "Deleting..." : "Delete"}</button>
                                  </div>
                                  {/* Deleting Modal  */}
                                  <div className="modal fade delete_Modal p-0" data-bs-backdrop="static" id="deleteModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog p-0">
                                      <div className="modal-content p-0">
                                        <div className="modal-header border-0">
                                          <h5 className="modal-title" id="exampleModalLabel">Attention!</h5>
                                          {/* <button type="button" className="btn-close shadow rounded" data-bs-dismiss="modal" aria-label="Close" /> */}
                                        </div>
                                        <div className="modal-body text-center p-0">

                                          <p>Do you want to Delete the Record?</p>
                                        </div>
                                        <div className="text-end m-2">
                                          <button type="button " className="btn rounded m-1 cancel_btn" data-bs-dismiss="modal" >Cancel</button>
                                          <button type="button" className="btn m-1 confirm_btn rounded" data-bs-dismiss="modal" onClick={() => deletePaymentIn(paymentItem)}>Confirm</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}


                      </>
                    ))}
                </TableBody>

              </Table>
            </TableContainer>
          </div>

        </>
      )}

    </>
  )
}
