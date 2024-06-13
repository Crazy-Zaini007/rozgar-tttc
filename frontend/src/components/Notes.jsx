import React,{useState,useEffect,useRef} from 'react'
import NoteHook from '../hooks/noteHooks/NoteHook'
import { useAuthContext } from '../hooks/userHooks/UserAuthHook';
import { toast } from 'react-toastify';
import {Paper} from'@mui/material' 
import notfound from './notfound.jpg'
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Notes() {
  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

  const[loading1,setLoading1]=useState(false)
  const[loading2,setLoading2]=useState(false)
  const[loading3,setLoading3]=useState(false)

  const[option,setOption]=useState(0)
    const [myTitle,setMyTitle]=useState('')
    const[dateFrom,setDateFrom]=useState('')
    const[dateTo,setDateTo]=useState('')
    const {getNotes,notes}=NoteHook()

  const abortCont = useRef(new AbortController());

    useEffect(() => {
        getNotes()
        return () => {
          if (abortCont.current) {
            abortCont.current.abort(); 
          }
        }
    }, [])

    const [view,setView]=useState('')
    const [open, setOpen] = React.useState(false);

    const handleView = (note) => {
      setOpen(true);
      setView(note)
    };
  
    const handleClose = () => {
      setOpen(false)
      setView('')

    };
  

    const filteredNotes = notes && notes.filter(note => {
      let isDateInRange = true;
    
      // Check if the expense date is within the selected date range
      if (dateFrom && dateTo) {
        isDateInRange = note.date >= dateFrom && note.date <= dateTo;
      }
      return (
        isDateInRange &&
        note.title.toLowerCase().includes(myTitle.toLowerCase()) 
      );
    })

  const [, setNewMessage] = useState('')

const[title,setTitle]=useState('')
const[content,setContent]=useState('')

const addNote=async(e)=>{
  e.preventDefault()
  setLoading1(true)
  try {
    const response = await fetch(`${apiUrl}/auth/notes/add/note`, {
      method:"POST",
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
        },
        body:JSON.stringify({title,content})
    })

    const json = await response.json();
    if(!response.ok){
      setNewMessage(toast.error(json.message))
  setLoading1(false)


    }
    if (response.ok) {
      setNewMessage(toast.success(json.message))
      getNotes()
      setTitle('')
      setContent('')
  setLoading1(false)

    }
} catch (error) {
  setNewMessage(toast.success(error))
  setLoading1(false)
}
}



  const deleteNote = async (note) => {
    if (window.confirm('Are you sure you want to delete this record?')){
      const noteId = note._id
      setLoading2(true)
    
        try {
          const response = await fetch(`${apiUrl}/auth/notes/delete/note`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${user.token}`,
            },
            body: JSON.stringify({ noteId })
          })
    
          const json = await response.json()
    
    
          if (!response.ok) {
      setLoading2(false)
    
            setNewMessage(toast.error(json.message));
          }
          if (response.ok) {
              setLoading2(false)
             setOpen(false)
             setView('')
            getNotes()
            setNewMessage(toast.success(json.message));
    
    
          }
        }
        catch (error) {
          setNewMessage(toast.error('Server is not responding...'))
        }
    }
    
  };

  const [editMode, setEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState({});

  const handleEditClick = (note, index) => {
    setEditMode(!editMode);
    setEditedEntry(note)
    
  };


  const handleInputChange = (e, field) => {
    setEditedEntry({
      ...editedEntry,
      [field]: e.target.value,
    });

  };

  const handleUpdate= async () => {
    setLoading3(true)
    try {
      const response = await fetch(`${apiUrl}/auth/notes/update/note`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ noteId:editedEntry._id,title:editedEntry.title,content:editedEntry.content})
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading3(false)

      }
      if (response.ok) {
        getNotes()
        setNewMessage(toast.success(json.message));
        setLoading3(false)
        setEditMode(!editMode)
         setOpen(false);

      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setLoading3(false)
    }
  };

  const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <div className={`${collapsed ?"collapsed":"main"}`}>
      <div className="container-fluid notes mt-3">
        <div className="row px-3">
        
        <div className='col-md-12 '>
              <Paper className='py-3 mb-2 px-2 d-flex justify-content-between'>
                <div className="left">
            <h4>Daily Notes</h4>
                </div>
                <div className="right d-flex">
                  <button className='btn btn-sm m-1 add_btn' onClick={()=>setOption(1)} disabled={loading1}>Add New</button>
                </div>
                
              </Paper>
            </div>
       {option===0 &&
       <>
       
       <div className=" col-md-12 filters">

<Paper className='py-1 mb-2 px-3'>
<div className="row">
<div className="col-auto my-2 p-1">
<label htmlFor="">Filter by Title:</label>
            <select name="" id="" value={myTitle} onChange={(e)=>setMyTitle(e.target.value)}>
                <option value="">Select note title</option>
                {[...new Set(notes && notes.map(data => data.title))]
                                    .map(dateValue => (
                                        <option value={dateValue} key={dateValue}>{dateValue}</option>
                                    ))}
            </select>
        </div>
        <div className="col-auto my-2 p-1">
          <label htmlFor="">Date From:</label>
            <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
        </div>
        <div className="col-auto my-2 p-1">
          <label htmlFor="">Date To:</label>
            <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
        </div>
</div>
</Paper>
         
        </div>
        
        <div className="row px-3">
          {filteredNotes && filteredNotes.length>0 ? filteredNotes.map((data)=>(
            <div className="col-lg-4 col-md-6 col-sm-12 p-1">
              <Paper className="note border rounded m-1 p-3">
                <div className="d-flex justify-content-between">
                  <div className="left">
                    <h6 className='mb-2'><i className="fas fa-sticky-note me-2"></i>{data.title}</h6> 
                    <small>{data.date}</small>
                  </div>
                  <div className="right">
                    <button className='btn btn-sm btn-sm mt-2' onClick={()=>handleView(data)}>View</button>
                  </div>
                </div>
              </Paper>
            </div>
          )):<img src={notfound} alt="" />}
        </div>
       </>
       }
      </div>
      {option===1 &&
      <div className='row justify-content-center'>
        <div className='col-lg-10 col-sm-12 border my-2 rounded'>
          <div className='d-flex justify-content-between'>
            <div className='left'>
            <h6 className='text-center mb-2 mt-3'>Add Daily Notes</h6>
            </div>
            <div className='right'>
            <button onClick={()=>setOption(0)} className=' mb-2 mt-3 btn-sm btn shadow bg-danger text-white rounded'><i className="fas fa-times"></i></button>
            </div>
          </div>
          <form className='px-2' onSubmit={addNote}>
            <div className='text-end pb-0'>
              <button className='btn btn-sm btn-sm shadow' disabled={loading1}>{loading1 ? "Adding..." :"Add Note"}</button>
            </div>
            <div className='my-3'>
              <label className='my-1'>Notes Title:</label>
              <input className='my-1' type='text' value={title} onChange={(e)=>setTitle(e.target.value)} required />
              <label className='my-1'>Notes Content:</label>
              <textarea className='my-1 pt-3'value={content} onChange={(e)=>setContent(e.target.value)}  required/>
            </div>
            <div className='my-3'>
              
              </div>
          </form>
        </div>

      </div>
      }

<div className='note_details px-md-4 px-2'>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              disabled={loading3 || loading2}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {view?.title}
            </Typography>
            <div className="btn-group" role="group" aria-label="Basic example">
  {!editMode && <><button type="button" className="btn text-white" onClick={()=>deleteNote(view)}  disabled={loading2}><i class="fas fa-trash-alt"></i></button>
  <button type="button" className="btn text-white" onClick={()=>handleEditClick(view)}> <i className="fas fa-edit"></i></button></>}
  {editMode && <>
  <button type="button" className="btn text-white"onClick={()=>setEditMode(!editMode)} disabled={loading3}><i className="fas fa-window-close"></i></button>
  <button type="button" className="btn text-white" onClick={()=>handleUpdate()} disabled={loading3}><i className="fas fa-check"></i></button>

  </>}
</div>
          </Toolbar>
        </AppBar>
       {!editMode && 
        <List>
        <ListItemButton>
          <ListItemText primary={view?.title} secondary={view?.date} />
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemText
            primary={view?.content}
            
          />
        </ListItemButton>
      </List>
       }
       {editMode &&
       <div className='px-md-4 px-2'>
      
         <input type='text' className='my-2' style={{width:"100%",  height:"45px",border: "1px solid var(--grays-dm-white)",borderRadius:"4px",fontSize:"14px",paddingLeft:"20px",color:"var(--accent-stong-blue)",outline:"none" }} required value={editedEntry.title} onChange={(e) => handleInputChange(e, 'title')} />
       <Divider />
        <textarea  className='my-2 pt-2' style={{width:"100%",  minHeight:"50vh",border: "1px solid var(--grays-dm-white)",borderRadius:"4px",fontSize:"14px",paddingLeft:"20px",color:"var(--accent-stong-blue)",outline:"none"  }} value={editedEntry.content} onChange={(e) => handleInputChange(e, 'content')} ></textarea>
     </div>
       }
      </Dialog>
    </div>
      </div>
    </div>
  )
}
