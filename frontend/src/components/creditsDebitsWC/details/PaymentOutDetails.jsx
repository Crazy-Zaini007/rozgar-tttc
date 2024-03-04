
import React, { useEffect, useState } from 'react'
import CDWCHook from '../../../hooks/creditsDebitsWCHooks/CDWCHook'
import { useSelector, useDispatch } from 'react-redux';
import { useAuthContext } from '../../../hooks/userHooks/UserAuthHook';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
export default function PaymentOutDetails() {
  const [isLoading, setIsLoading] = useState(false)
  const [, setNewMessage] = useState('')

  const { getPaymentsOut } = CDWCHook()
  const { user } = useAuthContext()
  const dispatch = useDispatch()
  useEffect(() => {
    if (user) {
      getPaymentsOut()
    }
  }, [user, dispatch])

  const CDWC_Payments_Out = useSelector((state) => state.creditsDebitsWC.CDWC_Payments_Out);
  const downloadExcel = () => {
    const data = [];
    // Iterate over entries and push all fields
    CDWC_Payments_Out.forEach((payments, index) => {
      const rowData = {
        SN: index + 1,

      };

      data.push(rowData);
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CDWC_Payments_Out.xlsx');
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


  // Editing Mode 
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
    if (window.confirm('Are you sure you want to delete this record?')){
      setIsLoading(true)
      let paymentId = payment._id
      try {
        const response = await fetch(`https://api-rozgar-tttc.onrender.com/auth/credits&debits/with_cash_in_hand/delete/single/payment_in`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`,
          },
          body: JSON.stringify({ paymentId, supplierName: selectedSupplier, payment_Via: payment.payment_Via, payment_In: payment.payment_In, cash_Out: payment.cash_Out, curr_Amount: payment.curr_Amount })
        })
  
        const json = await response.json()
  
        if (!response.ok) {
          setNewMessage(toast.error(json.message));
          setIsLoading(false)
        }
        if (response.ok) {
          getPaymentsOut();
          setNewMessage(toast.success(json.message));
          setIsLoading(false)
          setEditMode(!editMode)
        }
      }
      catch (error) {
        setNewMessage(toast.error('Server is not responding...'))
        setIsLoading(false)
      }
    }
    
  }




  const handleUpdate = async () => {
    setIsLoading(true)

    let paymentId = editedEntry._id
    try {
      const response = await fetch(`https://api-rozgar-tttc.onrender.com/auth/credits&debits/with_cash_in_hand/update/single/payment_out`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ paymentId, supplierName: selectedSupplier, category: editedEntry.category, payment_Via: editedEntry.payment_Via, payment_Type: editedEntry.payment_Type, slip_No: editedEntry.slip_No, details: editedEntry.details, payment_In: editedEntry.payment_In, payment_Out: editedEntry.payment_Out, curr_Country: editedEntry.payment_Out_Curr, curr_Amount: editedEntry.curr_Amount, slip_Pic: editedEntry.slip_Pic, date: editedEntry.date })
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setIsLoading(false)
      }
      if (response.ok) {

        setNewMessage(toast.success(json.message));
        setIsLoading(null)
        setEditMode(!editMode)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setIsLoading(false)
    }
  };

  return (
    <>
      {!option &&
        <>
          <div className='col-md-12 '>
            <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
              <div className="left d-flex">
                <h4>Payment Out Details</h4>
              </div>
              <div className="right d-flex">
                {CDWC_Payments_Out.length > 0 &&
                  <>
                    {/* <button className='btn pdf_btn m-1 btn-sm' onClick={downloadPDF}><i className="fa-solid fa-file-pdf me-1 "></i>Download PDF </button> */}
                    <button className='btn excel_btn m-1 btn-sm' onClick={downloadExcel}>Download </button>
                  </>
                }
              </div>
            </Paper>
          </div>
          <div className='col-md-12'>
            <Paper className='py-3 mb-1 px-2 detail_table'>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className='label border'>SN</TableCell>
                      <TableCell className='label border'>Date</TableCell>
                      <TableCell className='label border'>Suppliers</TableCell>
                      <TableCell className='label border'>TPO_PKR</TableCell>
                      <TableCell className='label border'>Balance</TableCell>
                      <TableCell className='label border'>Open</TableCell>
                      <TableCell className='label border'>Close</TableCell>
                      <TableCell align='left' className='edw_label border' colSpan={1}>
                          Actions
                        </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {CDWC_Payments_Out.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry, index) => (
                      <TableRow key={entry._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'} onClick={() => handleRowClick(entry.supplierName)}>
                        <TableCell className='border data_td text-center'>{index + 1}</TableCell>
                        <TableCell className='border data_td text-center'>
                          {entry.createdAt}
                        </TableCell>
                        <TableCell className='border data_td text-center'>
                          {entry.supplierName}
                        </TableCell>
                        <TableCell className='border data_td text-center'>
                          <i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{entry.total_Payment_Out}
                        </TableCell>
                        <TableCell className='border data_td text-center'>
                          {entry.balance}
                        </TableCell>
                        <TableCell className='border data_td text-center'>
                          <span>{entry.close === true ? "Opened" : "Not Opened"}</span>
                        </TableCell>
                        <TableCell className='border data_td text-center'>
                          {entry.close === false ? "Not Closed" : "Closed"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component='div'
                count={CDWC_Payments_Out.length}
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
        </>
      }

      {option && selectedSupplier && (
        <>
          {/* Display Table for selectedSupplier's payment details array */}
          <div className="col-md-12 my-2">
            <div className="d-flex justify-content-between supplier_Name">
              <div className="left d-flex">
                <h4 className='d-inline '>Supplier Name: <span>{selectedSupplier}</span></h4>

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
                  {CDWC_Payments_Out
                    .filter((data) => data.supplierName === selectedSupplier)
                    .map((filteredData) => (
                      // Map through the payment array
                      <>
                        {filteredData.payment && filteredData.payment
                          .filter((paymentItem) => paymentItem.payment_Out > 0)
                          .map((paymentItem, index) => (
                            <TableRow key={paymentItem?._id} className={index % 2 === 0 ? 'bg_white' : 'bg_dark'}>
                              {editMode && editedRowIndex === index ? (
                                <>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='date' value={editedEntry.date} onChange={(e) => handleInputChange(e, 'date')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='text' value={editedEntry.category} onChange={(e) => handleInputChange(e, 'category')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='text' value={editedEntry.payment_Via} onChange={(e) => handleInputChange(e, 'payment_Via')} />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='text' value={editedEntry.payment_Type} onChange={(e) => handleInputChange(e, 'payment_Type')} />
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
                                    <input type='text' value={editedEntry.invoice} readonly />
                                  </TableCell>
                                  <TableCell className='border data_td p-1 '>
                                    <input type='text' value={editedEntry.payment_Out_Curr} onChange={(e) => handleInputChange(e, 'payment_Out_Curr')} />
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
                                  <TableCell className='border data_td text-center'><i className="fa-solid fa-arrow-up me-2 text-danger text-bold"></i>{paymentItem?.payment_Out}</TableCell>
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
                                      <button onClick={() => handleUpdate()} className='btn save_btn' disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</button>

                                    </div>

                                  </>

                                ) : (
                                  // Render Edit button when not in edit mode or for other rows
                                  <>
                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                      <button onClick={() => handleEditClick(paymentItem, index)} className='btn edit_btn'>Edit</button>
                                      <button className='btn delete_btn' data-bs-toggle="modal" data-bs-target="#deleteModal" disabled={isLoading}>{isLoading ? "Deleting..." : "Delete"}</button>
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
                     <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className='border data_td text-center bg-success text-white'>Total</TableCell>
                            <TableCell className='border data_td text-center bg-warning text-white'>
          {/* Calculate the total sum of payment_In */}
          {CDWC_Payments_Out.reduce((total, filteredData) => {
            return total + filteredData.payment.reduce((sum, paymentItem) => {
              const paymentIn = parseFloat(paymentItem.payment_Out);
              return isNaN(paymentIn) ? sum : sum + paymentIn;
            }, 0);
          }, 0)}
        </TableCell>
        <TableCell className='border data_td text-center bg-info text-white'>
          {/* Calculate the total sum of cash_Out */}
          {CDWC_Payments_Out.reduce((total, filteredData) => {
            return total + filteredData.payment.reduce((sum, paymentItem) => {
              const cashOut = parseFloat(paymentItem.cash_Out);
              return isNaN(cashOut) ? sum : sum + cashOut;
            }, 0);
          }, 0)}
        </TableCell>
                            
                          </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}

    </>
  )
}
