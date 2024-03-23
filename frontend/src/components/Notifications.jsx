import React,{useState,useEffect} from 'react'
import NotifyHook from '../hooks/notifyHooks/NotifyHook'
import { useAuthContext } from '../hooks/userHooks/UserAuthHook';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { toast } from 'react-toastify';
import reminderIcon from './reminderGif.gif' 
import notfound from './notfound.jpg'
export default function Notifications() {
  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

    const [search,setSearch]=useState('')
    const {getNotifications,notifications}=NotifyHook()
    useEffect(() => {
      getNotifications()
    }, [])

    const filteredNotifications=notifications && notifications.filter(data=>{
      return(
        data.type.toLowerCase().includes(search.toLowerCase())
      )
    })

    
  const [, setNewMessage] = useState('')

  const deleteNotification = async (notification) => {

    const notifyId = notification._id
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

  return (
    <div className='main'>
      <div className="container-fluid notifications mt-3">
        <div className="row px-3">
            <h4>Reminders</h4>
        </div>
        <div className="col-md-3 my-3 p-1">
            <select name="" id="" value={search} onChange={(e)=>setSearch(e.target.value)}>
                <option value="">Select Reminder type</option>
                {[...new Set(notifications && notifications.map(data => data.type))]
                                    .map(dateValue => (
                                        <option value={dateValue} key={dateValue}>{dateValue}</option>
                                    ))}
            </select>
        </div>
        <div className="col-md-8 pb-2 m-0 px-2">
          {filteredNotifications && filteredNotifications.length>0 ? filteredNotifications.map((data)=>(
            <div className="rounded border my-1" key={data._id}>
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
                            <button type="button" className="btn-close btn-sm" onClick={() => deleteNotification(data)} aria-label="Close" />
                              </div>
                            
                            
                            
                          </div>
                          <div className="toast-body pb-1">
                            <p> {data.content} on <span className='text-success text-bold border p-1 rounded bg-info text-white'>{data.date}</span></p>
                          </div>
                        </div>
          )):<img src={notfound} alt="" />}
        </div>
      </div>
    </div>
  )
}
