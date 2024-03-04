import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CPPHook from '../../../hooks/settingHooks/CPPHook';
import { useAuthContext } from '../../../hooks/userHooks/UserAuthHook'
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { addCrediterPurchaseParty } from '../../../redux/reducers/settingSlice';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
export default function CPP() {

  const [supplierName, setSupplerName] = useState('')
  const [supplierCompany, setSupplierCompany] = useState('')
  const [country, setCountry] = useState('')
  const [contact, setContact] = useState('')
  const [address, setAddress] = useState('')
  const [picture, setPicture] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const [, setNewMessage] = useState('');
  const { user } = useAuthContext()
  const dispatch = useDispatch();
  const { getCPPData } = CPPHook()

  const fetchData = async () => {
    await getCPPData();
  };
  // Getting Data 
  useEffect(() => {
  
    // Only fetch data if user and dispatch are available
    if (user && dispatch) {
      fetchData();
    }
  }, [dispatch]);

  // getting data from redux store
  const crediterPurchaseParties = useSelector((state) => state.setting.crediterPurchaseParties);


  // Submitting form 

  // a- adding a new Visa Supplier Purchase Parties
  const addSuppliers = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    try {
      const response = await fetch('/auth/setting/entry/add_cpp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ supplierName, supplierCompany, country, contact, address, picture }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setNewMessage(toast.error(json.message));
      }
      if (response.ok) {
        setIsLoading(false);
        setNewMessage(toast.success(json.message));
        dispatch(addCrediterPurchaseParty(json.data)); // Dispatch the action with received data
        setSupplerName('')
        setSupplierCompany('')
        setContact('')
        setCountry('')
        setAddress('')
        setPicture('')
      }
    } catch (error) {
      setNewMessage(toast.error('Server Error'));
      setIsLoading(false);
    }
  };



  const handleImage = (e) => {
    const file = e.target.files[0];
    TransformFile(file)
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit. Please select a smaller file.');
      } else {
        TransformFile(file);
      }
    } else {
      alert('No file selected.');
    }
  };

  const TransformFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPicture(reader.result);
      };
    } else {
      setPicture('');
    }
  };


  
   // Editing Mode 
   const [editMode, setEditMode] = useState(false);
   const [editedEntry, setEditedEntry] = useState({});
   const [editedRowIndex, setEditedRowIndex] = useState(null);
 
   const handleEditClick = (expense, index) => {
     setEditMode(!editMode);
     setEditedEntry(expense);
     setEditedRowIndex(index); // Set the index of the row being edited
   };
 
 
   const handleInputChange = (e, field) => {
     setEditedEntry({
       ...editedEntry,
       [field]: e.target.value,
     });
 
   };
 
   const handleImageChange = (e, field) => {
     if (field === 'picture') {
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
 

  
// Submitting Form Data
const [loading, setLoading] = useState(null)

const handleUpdate = async () => {
  setLoading(true)

  let supplierId = editedEntry._id
  try {
    const response = await fetch(`/auth/setting/entry/update_cpp`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${user.token}`,
      },
      body: JSON.stringify({ supplierId, supplierName: editedEntry.supplierName, supplierCompany: editedEntry.supplierCompany, country: editedEntry.country, contact: editedEntry.contact, address: editedEntry.address, picture: editedEntry.picture })
    })

    const json = await response.json()

    if (!response.ok) {
      setNewMessage(toast.error(json.message));
      setLoading(false)
    }
    if (response.ok) {
      fetchData()
      setNewMessage(toast.success(json.message));
      setLoading(null)
      setEditMode(!editMode)
    }
  }
  catch (error) {
    setNewMessage(toast.error('Server is not responding...'))
    setLoading(false)
  }
};


const deleteSupplier = async (data) => {
  if (window.confirm('Are you sure you want to delete this record?')){
    setLoading(true)
  
    let supplierId = data._id
    try {
      const response = await fetch(`/auth/setting/entry/delete_cpp`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ supplierId })
      })
  
      const json = await response.json()
  
      if (!response.ok) {
        setNewMessage(toast.error(json.message));
    setLoading(false)
  
      }
      if (response.ok) {
        fetchData()
        setNewMessage(toast.success(json.message));
      }
    }
    catch (error) {
    setLoading(false)
  
      setNewMessage(toast.error('Server is not responding...'))
  
    }
  }
 
}



  return (
    <>
      <div className="col-md-12 adding_form">
        
        <form className='px-2 py-3 rounded' onSubmit={addSuppliers}>
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Supplier Name</label>
              <input type="text" value={supplierName} onChange={(e) => setSupplerName(e.target.value)} required />

            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Supplier Company</label>
              <input type="text" value={supplierCompany} onChange={(e) => setSupplierCompany(e.target.value)} required />

            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)}  />

            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Contact</label>
              <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}  />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Picture</label>
              <input accept='image/*' onChange={handleImage} type="file"  />
            </div>
            {picture && <div className="col-lg-3 col-md-12 col-sm-12 mb-3">
              <div className="image">
                <img src={picture} alt="" className='rounded' />
              </div>
            </div>}
          </div>
          <button className='btn submit_btn' disabled={isLoading}>{isLoading ? 'Adding' : 'Add New'}</button>
        </form>
      </div>

      {/* Details table */}

      <div className="col-md-12 details_table mt-4">
        <h5>Details Table</h5>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='label text-center'>#</TableCell>
                <TableCell className='label text-center'>Supplier Name</TableCell>
                <TableCell className='label text-center'>Supplier Company</TableCell>
                <TableCell className='label text-center'>Country</TableCell>
                <TableCell className='label text-center'>Address</TableCell>
                <TableCell className='label text-center'>Picture</TableCell>
                <TableCell className='label text-center'>Action</TableCell>


              </TableRow>
            </TableHead>

            <TableBody>
              {crediterPurchaseParties && crediterPurchaseParties.length > 0 ? crediterPurchaseParties.map((data,index)=>(
                <React.Fragment key={index}>
                  <TableRow key={data?._id}>
                    {editMode && editedRowIndex === index ? (
                      <>
                       <TableCell className='border data_td p-1 '>
                                  <input type='number' value={index + 1} readOnly />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.supplierName} onChange={(e) => handleInputChange(e, 'supplierName')} required/>
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.supplierCompany} onChange={(e) => handleInputChange(e, 'supplierCompany')} required/>
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.country} onChange={(e) => handleInputChange(e, 'country')} required/>
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.address} onChange={(e) => handleInputChange(e, 'address')} required/>
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='file' accept='image/*'  onChange={(e) => handleImageChange(e, 'picture')} />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                  <button className='btn edit_btn p-1  shadow' onClick={() => setEditMode(!editMode)}><CloseIcon fontSize='small'></CloseIcon></button>
                                  <button className='btn delete_btn p-1  shadow' onClick={() => handleUpdate()} disabled={loading}><CheckIcon fontSize='small'></CheckIcon></button>
                                  </div>
                                
                                </TableCell>
                      </>
                    ):(
                      <>
                    <TableCell className='data_td text-center'>{index + 1}</TableCell>
                  <TableCell className='data_td text-center'>{data.supplierName}</TableCell>
                  <TableCell className='data_td text-center'>{data.supplierCompany}</TableCell>
                  <TableCell className='data_td text-center'>{data.country}</TableCell>
                  <TableCell className='data_td text-center'>{data.address}</TableCell>
                  <TableCell className='data_td text-center'><img src={data.picture} alt="" className='rounded' /></TableCell>
                  <TableCell className='data_td text-center'>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button className='btn edit_btn p-1  shadow' onClick={() => handleEditClick(data,index)} ><EditIcon fontSize='small'></EditIcon></button>
                    <button className='btn delete_btn p-1  shadow' onClick={() => deleteSupplier(data)}><DeleteIcon fontSize='small'  disabled={loading}></DeleteIcon></button>
                    </div>
                    

                       
                  </TableCell>
                      </>
                    )}
                  </TableRow>
                </React.Fragment>
              )):(
                <>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className='data_td text-center'>No Record Found</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
             
                </>
              )}
             

            </TableBody>
          </Table>
        </TableContainer>

      </div>

    </>
  )
}
