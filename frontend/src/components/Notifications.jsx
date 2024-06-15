import React,{useState,useEffect,useRef} from 'react'
import NotifyHook from '../hooks/notifyHooks/NotifyHook'
import { useAuthContext } from '../hooks/userHooks/UserAuthHook';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { toast } from 'react-toastify';
import reminderIcon from './reminderGif.gif' 
import notfound from './notfound.jpg'
import { useSelector } from 'react-redux';

export default function Notifications() {
  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

    const [search,setSearch]=useState('')
    const {getNotifications,reminders}=NotifyHook()
  const abortCont = useRef(new AbortController());

    useEffect(() => {
        getNotifications()
        return () => {
          if (abortCont.current) {
            abortCont.current.abort(); 
          }
        }
    }, [])

    const filteredReminders=reminders && reminders.filter(data=>{
      return(
        data.type.toLowerCase().includes(search.toLowerCase())
      )
    })

    
  const [, setNewMessage] = useState('')

  const deletReminder = async (reminder) => {

    const notifyId = reminder._id
    try {
      const response = await fetch(`${apiUrl}/auth/notifications/delete/notification`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ notifyId })
      })

      const json = await response.json()


      if (!response.ok) {
        setNewMessage(toast.error(json.message));
      }
      if (response.ok) {
        getNotifications()
        setNewMessage(toast.success(json.message));


      }
    }
    catch (error) {
      setNewMessage(toast.error('Server is not responding...'))
    }
  };

  const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <div className={`${collapsed ?"collapsed":"main"}`}>
      <div className="container-fluid reminders mt-3">
        <div className="row">
        <div className="col-md-12 p-0 border-0 border-bottom">
        <div className='py-2 mb-2 px-2 d-flex justify-content-between'>
                <div className="left d-flex">
                <h4>Notifications</h4>

                </div>
                
              </div>
          </div>
        </div>
        <div className="col-md-3 my-3 p-1">
            <select name="" id="" value={search} onChange={(e)=>setSearch(e.target.value)}>
                <option value="">Select Notification Type</option>
                {[...new Set(reminders && reminders.map(data => data.type))]
                                    .map(dateValue => (
                                        <option value={dateValue} key={dateValue}>{dateValue}</option>
                                    ))}
            </select>
        </div>
        <div className="col-md-8 pb-2 m-0 px-2">
          {filteredReminders && filteredReminders.length>0 ? filteredReminders.map((data)=>(
            <div className="rounded border-0 my-1 shadow" key={data._id}>
                          <div className="toast-header d-flex justify-content-between">
                           
                              <div className="left">
                              <img src={reminderIcon} className="rounded me-2" alt="..." />
                            <h6 className='text-primary'>
                             {data.type}
                            </h6>
                              </div>
                              <div className="right">
                              <small>
                              {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
                            </small>
                            <button type="button" className="btn-close btn-sm" onClick={() => deletReminder(data)} aria-label="Close" />
                              </div>
                            
                            
                            
                          </div>
                          <div className="toast-body pb-1">
                            <p> {data.content} on <span className='text-white text-bold border p-1 rounded bg-success text-white'>{data.date}</span></p>
                          </div>
                        </div>
          )):<img src={notfound} alt="" />}
        </div>
      </div>
    </div>
  )
}
