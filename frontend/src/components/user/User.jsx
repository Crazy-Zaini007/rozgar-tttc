import React,{useState,useEffect} from 'react'
import { useAuthContext } from '../../hooks/userHooks/UserAuthHook'
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { toast } from 'react-toastify';

export default function User() {
    const {user}=useAuthContext()
    const [loading1,setLoading1]=useState(false)
    const [loading2,setLoading2]=useState(false)
    const [users,setUsers]=useState()
    const [, setNewMessage] = useState('')
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchUsers=async()=>{
        try {
            const response = await fetch(`${apiUrl}/auth/user/get/users`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                setUsers(json.data); // Dispatch the action with received data
            }
            if (!response.ok) {
                console.log(json.message)
            }
        } catch (error) {
            console.log(error)

        }
    }
    const fetchData=async ()=>{
        try{
      setLoading1(true);
      fetchUsers()
      setLoading1(false);

        }
        catch(error){
      setLoading1(false);

        }
    }

    useEffect(() => {
          fetchData();
      })
  // Editing for single Payment In 
  const [editMode, setEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState({});
  const [editedRowIndex, setEditedRowIndex] = useState(null);

  const handleEditClick = (user, index) => {
    setEditMode(!editMode);
    setEditedEntry(user);
    setEditedRowIndex(index); // Set the index of the row being edited
  };


  const handleInputChange = (e, field) => {
    setEditedEntry({
      ...editedEntry,
      [field]: e.target.value,
    });

  };

  
  const handleUpdate = async () => {
    setLoading2(true)

   
    try {
      const response = await fetch(`${apiUrl}/auth/user/update/users`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({  userName: editedEntry.userName, role: editedEntry.role, originalPassword: editedEntry.originalPassword})
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading2(false)
      }
      if (response.ok) {
       fetchData()
        setNewMessage(toast.success(json.message));
        setLoading2(null)
        setEditMode(!editMode)
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setLoading2(false)
    }
  };


  const collapsed = useSelector((state) => state.collapsed.collapsed);
  return (
    <>
    <div className={`${collapsed ?"collapsed":"main"}`}>
        <div className="container-fluid py-2 payment_details">
            <div className="row">
            <div className='col-md-12 '>
            <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
              <div className="left d-flex">
                <h4>Manage Account</h4>
              </div>
            </Paper>
          </div>
          <div className="col-md-12 detail_table my-2">

<TableContainer component={Paper}>
  <Table>
    <TableHead className="thead">
      <TableRow>
        <TableCell className='label border text-center'>SN</TableCell>
        <TableCell className='label border text-center'>Username</TableCell>
        <TableCell className='label border text-center'>Role</TableCell>
        <TableCell className='label border text-center'>Password</TableCell>  
        <TableCell align='left' className='edw_label border text-center' colSpan={1}>
          Actions
        </TableCell>

      </TableRow>
    </TableHead>
    <TableBody>
      {users &&
          // Map through the payment array
          
            <TableRow key={users?._id} className= 'bg_white' >
              {editMode ? (
                // Edit Mode
                <>
                  <TableCell className='border data_td p-1 '>
                    <input type='number' value={ 1} readOnly />
                  </TableCell>
                  <TableCell className='border data_td p-1 '>
                    <input type='text' value={editedEntry.userName} onChange={(e) => handleInputChange(e, 'userName')} />
                  </TableCell>
                  <TableCell className='border data_td p-1 '>
                    <input type='text' value={editedEntry.role} onChange={(e) => handleInputChange(e, 'role')} readonly />
                  </TableCell>
                  <TableCell className='border data_td p-1 '>
                    <input type='password' value={editedEntry.originalPassword} onChange={(e) => handleInputChange(e, 'originalPassword')} required />
                  </TableCell>  
                  <TableCell className='border data_td p-1 '>



                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                      <button onClick={() => setEditMode(!editMode)} className='btn delete_btn'>Cancel</button>
                      <button onClick={() => handleUpdate()} className='btn save_btn' disabled={loading2}>{loading2 ? "Saving..." : "Save"}</button>

                    </div>

                  </TableCell>
                </>
              ) : (
                // Non-Edit Mode
                <>
                  <TableCell className='border data_td text-center'>{1}</TableCell>
                  <TableCell className='border data_td text-center'>{users.userName}</TableCell>
                  <TableCell className='border data_td text-center'>{users.role}</TableCell>
                  <TableCell className='border data_td text-center'>{users.originalPassword}</TableCell>
                 
                  <TableCell className='border data_td text-center'>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                      <button onClick={() => handleEditClick(users)} className='btn edit_btn'>Edit</button>
                     
                    </div>
                    
                  </TableCell>
                </>
              )}
            </TableRow>
        }
           
    </TableBody>
  </Table>
</TableContainer>

</div>
          
            </div>
        </div>
    </div>
      
    </>
  )
}
