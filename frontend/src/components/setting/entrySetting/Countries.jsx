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
import { useAuthContext } from '../../../hooks/userHooks/UserAuthHook'
import CountryHook from '../../../hooks/settingHooks/CountryHook';
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { addCountry } from '../../../redux/reducers/settingSlice';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
export default function Countries() {
  const [country, setCountry] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const [, setNewMessage] = useState('');
  const { user } = useAuthContext()
  const dispatch = useDispatch();

  const { getCountryData } = CountryHook()

  const apiUrl = process.env.REACT_APP_API_URL;

  // Getting Data 
  const fetchData = async () => {
    await getCountryData();
  };
  useEffect(() => {
  
    // Only fetch data if user and dispatch are available
    if (user && dispatch) {
      fetchData();
    }
  }, [dispatch]);

  // getting data from redux store
  const countries = useSelector((state) => state.setting.countries);



  // Submitting form 
  const handleForm = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/add_country`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ country }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setNewMessage(toast.error(json.message));
      }
      if (response.ok) {
        setIsLoading(false);
        setNewMessage(toast.success(json.message));
        dispatch(addCountry(json.data)); // Dispatch the action with received data
        setCountry('')
      }
    } catch (error) {
      setNewMessage(toast.error('Server Error'));
      setIsLoading(false);
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

  let myId = editedEntry._id
  try {
    const response = await fetch(`${apiUrl}/auth/setting/entry/update_country`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${user.token}`,
      },
      body: JSON.stringify({ myId, country: editedEntry.country})
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
  
    let myId = data._id
    try {
      const response = await fetch(`${apiUrl}/auth/setting/entry/delete_country`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ myId })
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
        <h5>Countries</h5>
        <form className='px-2 py-3 rounded' onSubmit={handleForm}>
          <div className="row">
            <div class="col-lg-3 col-md-6 col-sm-12 mb-3">
              <label>Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />

            </div>

          </div>
          <button className='btn btn-sm  submit_btn' disabled={isLoading}>{isLoading ? 'Adding' : 'Add New'}</button>
        </form>
      </div>

      {/* Details table */}

      <div className="col-md-12  details_table mt-4 ">
        <h5>Details Table</h5>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='label text-center'>#</TableCell>
                <TableCell className='label text-center'>Country Name</TableCell>
                <TableCell className='label text-center'>Action</TableCell>


              </TableRow>
            </TableHead>

            <TableBody>
              {countries && countries.length > 0 ? countries.map((data,index)=>(
                <React.Fragment key={index}>
                  <TableRow key={data?._id}>
                    {editMode && editedRowIndex === index ? (
                      <>
                       <TableCell className='border data_td p-1 '>
                                  <input type='number' value={index + 1} readOnly />
                                </TableCell>
                                <TableCell className='border data_td p-1 '>
                                  <input type='text' value={editedEntry.country} onChange={(e) => handleInputChange(e, 'country')} required/>
                                </TableCell>
                                
                                <TableCell className='border data_td p-1 '>
                                  <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                  <button className='btn btn-sm  edit_btn p-1  shadow' onClick={() => setEditMode(!editMode)}><CloseIcon fontSize='small'></CloseIcon></button>
                                  <button className='btn btn-sm  delete_btn p-1  shadow' onClick={() => handleUpdate()} disabled={loading}><CheckIcon fontSize='small'></CheckIcon></button>
                                  </div>
                                
                                </TableCell>
                      </>
                    ):(
                      <>
                    <TableCell className='data_td text-center'>{index + 1}</TableCell>
                  <TableCell className='data_td text-center'>{data.country}</TableCell>
                 
                  <TableCell className='data_td text-center'>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button className='btn btn-sm  edit_btn p-1  shadow' onClick={() => handleEditClick(data,index)} ><EditIcon fontSize='small'></EditIcon></button>
                    <button className='btn btn-sm  delete_btn p-1  shadow' onClick={() => deleteSupplier(data)}><DeleteIcon fontSize='small'  disabled={loading}></DeleteIcon></button>
                    </div>
                    

                  </TableCell>
                      </>
                    )}
                  </TableRow>
                </React.Fragment>
              )):(
                <>
              
                <TableCell></TableCell>
                <TableCell className='data_td text-center'>No Record Found</TableCell>
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
