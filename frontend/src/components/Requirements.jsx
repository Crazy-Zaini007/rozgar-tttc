import React,{useState,useEffect,useRef} from 'react'
import {Link} from 'react-router-dom'
import RequirementHook from '../hooks/requirements/RequirementHook'
import { useAuthContext } from '../hooks/userHooks/UserAuthHook';
import { toast } from 'react-toastify';
import {Paper} from'@mui/material' 
import notfound from './norequirements.png'
import requesticon from './request_icon.png'
import pendinggif from './pending.gif'
import workinggif from './working.gif'
import completedgif from './completed.png'
import nomessage from './no_message.jpg'

import "react-chat-elements/dist/main.css"
import { MessageBox,ChatList  } from "react-chat-elements"

import { useSelector } from 'react-redux';

export default function Requirements() {
  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

  const[loading1,setLoading1]=useState(false)
  const[loading2,setLoading2]=useState(false)
  const[loading3,setLoading3]=useState(false)

  const[option,setOption]=useState(0)
    const [myTitle,setMyTitle]=useState('')
    const {getRequirement,requirements}=RequirementHook()
const[reqId,setReqId]=useState('')

  const abortCont = useRef(new AbortController());

    useEffect(() => {
      getRequirement()
        return () => {
          if (abortCont.current) {
            abortCont.current.abort(); 
          }
        }
    }, [])


  

    const filteredRequirements = requirements && requirements.filter(note => {
    
      return (
        note.title?.trim().toLowerCase().startsWith(myTitle.trim().toLowerCase()) 
      );
    })

  const [, setNewMessage] = useState('')

const[title,setTitle]=useState('')
const[content,setContent]=useState('')
const[picture,setPicture]=useState('')


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


const handleSubmit=async(e)=>{
  e.preventDefault()
  setLoading1(true)
  try {
    const response = await fetch(`${apiUrl}/auth/requirements/add/requirement`, {
      method:"POST",
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
        },
        body:JSON.stringify({title,content,picture})
    })

    const json = await response.json();
    if(!response.ok){
      setNewMessage(toast.error(json.message))
  setLoading1(false)


    }
    if (response.ok) {
      setNewMessage(toast.success(json.message))
      getRequirement()
      setTitle('')
      setContent('')
  setLoading1(false)

    }
} catch (error) {
  setNewMessage(toast.success(error))
  setLoading1(false)
}
}



  const deleteRequirement = async (requirement) => {
    if (window.confirm('Are you sure you want to delete the requirement?')){
      const reqId = requirement._id
      setLoading2(true)
    
        try {
          const response = await fetch(`${apiUrl}/auth/requirements/delete/requirement`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${user.token}`,
            },
            body: JSON.stringify({ reqId })
          })
    
          const json = await response.json()
    
    
          if (!response.ok) {
      setLoading2(false)
    
            setNewMessage(toast.error(json.message));
          }
          if (response.ok) {
            setReqId('')
            setOption(0)
              setLoading2(false)
             
            getRequirement()
            setNewMessage(toast.success(json.message));
    
    
          }
        }
        catch (error) {
          setNewMessage(toast.error('Server is not responding...'))
        }
    }
    
  };

  const [editedEntry, setEditedEntry] = useState({});

  const handleInputChange = (e, field) => {
    setEditedEntry({
      ...editedEntry,
      [field]: e.target.value,
    });
  };

  const handleUpdate= async () => {
    setLoading3(true)
    try {
      const response = await fetch(`${apiUrl}/auth/requirements/update/requirement`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ reqId:editedEntry._id,title:editedEntry.title,content:editedEntry.content,status:editedEntry.status})
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
        setLoading3(false)

      }
      if (response.ok) {
        getRequirement()
        setNewMessage(toast.success(json.message));
        setLoading3(false)
        setEditedEntry('')
      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
      setLoading3(false)
    }
  };


  // Handle Open
  const handleOpen=(data)=>{
    setReqId(data._id)
    setOption(1)
  }



  
const[type,setType]=useState('')
const[image,setImage]=useState('')
const[description,setDescripion]=useState('')
const[commentBy,setCommentBy]=useState('')



const handleCommentImage = (e) => {
  const file = e.target.files[0];
  TransformCommentFile(file)
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

const TransformCommentFile = (file) => {
  const reader = new FileReader();
  if (file) {
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  } else {
    setImage('');
  }
};


const handleComment=async(e)=>{
  e.preventDefault()
  setLoading1(true)
  try {
    const response = await fetch(`${apiUrl}/auth/requirements/add/requirement/comment`, {
      method:"POST",
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
        },
        body:JSON.stringify({reqId,image,description,commentBy})
    })

    const json = await response.json();
    if(!response.ok){
      setNewMessage(toast.error(json.message))
  setLoading1(false)


    }
    if (response.ok) {
      setNewMessage(toast.success(json.message))
      getRequirement()
      setType('')
      setImage('')
      setDescripion('')
      setCommentBy('')
       setLoading1(false)

    }
} catch (error) {
  setNewMessage(toast.success(error))
  setLoading1(false)
}
}


  const handleImageClick = (url) => {
    window.open(url, '_blank');
  
  }
  const collapsed = useSelector((state) => state.collapsed.collapsed);
  return (
    <div className={`${collapsed ?"collapsed":"main"}`}>
      <div className="container-fluid requirements mt-3">
        <div className="row">
        
        <div className='col-md-12 p-0 border-bottom border-0'>
              <div className='py-2 mb-2 px-2 d-flex justify-content-between'>
                <div className="left">
            <h4>System Requirements</h4>
                </div>
                <div className="right d-flex">
                  <button className='btn btn-sm m-1 add_btn' data-bs-toggle="modal" data-bs-target="#staticBackdrop" disabled={loading1}>Add New</button>
                </div>
              </div>
            </div>
            {
  option === 0 && (
    <>
      <div className="col-md-12 filters">
        <div className="py-1 mb-2">
          <div className="row">
            <div className="col-4 my-2 p-1">
              <label htmlFor="">Search here:</label><br />
              <input type="search" value={myTitle} onChange={(e) => setMyTitle(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        {filteredRequirements && filteredRequirements.length > 0 ? filteredRequirements.map((data) => (
          <div className="col-lg-3 col-md-6 col-sm-12 p-2" key={data._id}>
            <div className="card shadow ">
              <div className="card-body mt-0 pt-4 pb-3">
                <div className="image mx-auto text-center">
                  <img src={requesticon} alt="" />
                </div>
                <h2 className='mt-3 text-center'>{data.title.length > 10 ? data.title.slice(0, 9) + '...' : data.title}</h2>
                <p className="mt-3 px-md-2 text-center">{data.content.length > 40 ? data.content.slice(0, 40) + '...' : data.content}</p>
                <p className="mt-3 text-center">
                  {data.status === 'Pending' ? <img src={pendinggif} alt="" /> : data.status === 'Working' ? <img src={workinggif} alt="" /> : <img src={completedgif} alt="" />}
                </p>
                <div className="text-end mt-4 buttons">
                  <Link className='btn m-1 edit_btn btn-sm' data-bs-toggle="modal" data-bs-target="#edit_Modal" onClick={()=>setEditedEntry(data)}>Edit</Link>
                  <Link className='btn m-1 view_btn btn-sm' onClick={() => handleOpen(data)}>View</Link>
                </div>
              </div>
            </div>
          </div>
        )) : <img src={notfound} alt="" />}
      </div>
    </>
  )
}

{
  option === 1 && (
    <>
      <div className="col-md-12 ">
        <div className="row justify-content-center">
          <div className="col-md-9 border rounded mt-2 px-0 comments">
            {requirements && requirements.filter(data => data._id === reqId).map(data => (
              <div key={data._id}>
                <div className="top d-flex justify-content-between border-0 border-bottom intro bg-white">
                  <div className="left">
                    <ChatList
                      className="chat-list border-0"
                      dataSource={[
                        {
                          avatar: `${data.picture}`,
                          alt: `${data.title}`,
                          title: `${data.title}`,
                          subtitle: `${data.content}`,
                          date:data.date
                        }
                      ]}
                    />
                  </div>
                  <div className="right my-auto">
                  <div class="dropdown dropstart">
  <button className="btn" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
  <i class="fa-solid fa-ellipsis"></i>
  </button>
  <ul class="dropdown-menu shadow border-0" aria-labelledby="dropdownMenuButton1">
    <li><Link class="dropdown-item close_btn"  onClick={()=>{setReqId('');setOption(0)}}>Close</Link></li>
    <li><Link class="dropdown-item del_btn" onClick={()=>deleteRequirement(data)}>Delete</Link></li>
    <li><Link class="dropdown-item add_btn bg-none" data-bs-toggle="modal" data-bs-target="#comment_Modal">Add Comment</Link></li>
  
  </ul>
</div>
                  </div>
                </div>
                <div className="data mt-2">
      {data.comments && data.comments.length > 0 ? (
        data.comments.map((comment, index) => (
          <MessageBox
            key={index}  // Use a unique key for each comment
            position={comment.commentBy.toLowerCase() === 'zain' ? 'left' : 'right'}
            title={comment.commentBy}
            type={comment.image ? 'photo' : 'text'}
            text={comment.description}
            date={comment.createdAt}
            data={comment.image ? { uri: comment.image,width:'90px' } : {}}
            onClick={comment.image ? () => handleImageClick(comment.image) : null}
          >
          
          </MessageBox>
        ))
      ) : (
        <div className='no_message text-center'>
          <img src={nomessage} alt="" />
        </div>
      )}
    </div>
                

              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

      </div>
     

      </div>

      {/* New Comment Modal */}
<div className="modal fade add_Modal" id="comment_Modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header pb-1 mb-0">
        <h2>Add a new comment</h2>
        
      </div>
      <div className="modal-body  pt-1 mb-0">
      <form onSubmit={handleComment}>
        <div className="row">
          <div className="my-1">
            <label htmlFor="">
            Comment Type:
            </label>
            <select name="" id="" required value={type} onChange={(e)=>setType(e.target.value)}>
            <option value="">Choose</option>
              <option value="Image">Image</option>
              <option value="Text">Text</option>
            </select>
           
          </div>
          {type==='Text' &&
          <div className="my-1">
          <label htmlFor="">
        
            Comment Description:
            </label>
            <textarea name="" required value={description} onChange={(e)=>setDescripion(e.target.value)} id=""></textarea>
          </div>
          }
           {type==='Image' &&
          <div className="my-1">
          <label htmlFor="">
            Image:
            </label>
            <input type="file" required accept='image/*'  onChange={handleCommentImage}/>
          </div>
          }
          <div className="my-1">
          <label htmlFor="">
            Comment By:
            </label>
            <select name="" id="" required value={commentBy} onChange={(e)=>setCommentBy(e.target.value)}>
            <option value="">Choose</option>
              <option value="Zain">Zain</option>
              <option value="Qadir">Qadir</option>
            </select>
          </div>

          <div className="text-end">
          <Link className="btn cancel_btn m-1 btn-sm" data-bs-dismiss="modal" disabled={loading1}>Cancel</Link>
          <button type="submit" className="btn save_btn m-1 btn-sm"disabled={loading1} >Add Comment</button>
          </div>
        </div>
      </form>
      </div>
     
    </div>
  </div>
</div>

   {/* New Requirement Modal */}
   <div className="modal fade add_Modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header pb-1 mb-0">
        <h2>Add new Requirement</h2>
        
      </div>
      <div className="modal-body  pt-1 mb-0">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="my-1">
            <label htmlFor="">
            Requirement Title:
            </label>
            <input type="text" required value={title} onChange={(e)=>setTitle(e.target.value)} />
          </div>
          <div className="my-1">
          <label htmlFor="">
            Requirement description:
            </label>
            <textarea name="" required value={content} onChange={(e)=>setContent(e.target.value)} id=""></textarea>
          </div>
          <div className="my-1">
          <label htmlFor="">
            Requirement Thumbnail:
            </label>
            <input type="file" accept='image/*'  onChange={handleImage}/>
          </div>

          <div className="text-end">
          <Link className="btn cancel_btn m-1 btn-sm" data-bs-dismiss="modal" disabled={loading1}>Cancel</Link>
          <button type="submit" className="btn save_btn m-1 btn-sm"disabled={loading1} >Add</button>
          </div>
        </div>
      </form>
      </div>
     
    </div>
  </div>
</div>


{/* New Requirement Modal */}
<div className="modal fade add_Modal" id="edit_Modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header pb-1 mb-0">
        <h2>Update the Requirement</h2>
      </div>
      <div className="modal-body  pt-1 mb-0">

        <div className="row">
          <div className="my-1">
            <label htmlFor="">
            Title:
            </label>
            <input type="text" required value={editedEntry.title} onChange={(e)=>handleInputChange(e,'title')} />
          </div>
          <div className="my-1">
          <label htmlFor="">
            Description:
            </label>
            <textarea name="" required value={editedEntry.content} onChange={(e)=>handleInputChange(e,'content')} ></textarea>
          </div>
         
          <div className="my-1">
          <label htmlFor="">
            Requirement Status:
            </label>
          <select name="" id="" value={editedEntry.status} onChange={(e)=>handleInputChange(e,'status')}>
            <option value="Working">Working</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          </div>
          <div className="text-end">
          <Link className="btn cancel_btn m-1 btn-sm" data-bs-dismiss="modal" disabled={loading1} onClick={()=>setEditedEntry('')}>Cancel</Link>
          <button type="submit" className="btn save_btn m-1 btn-sm"disabled={loading1} onClick={()=>handleUpdate()}>Update</button>
          </div>
        </div>
    
      </div>
     
    </div>
  </div>
</div>
    </div>
  )
}
