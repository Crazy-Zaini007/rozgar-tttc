import React from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { toggleCollapse } from '../redux/reducers/collpaseSlice'

export default function Navbar() {

    const myDispatch = useDispatch();

    const toggleSidebar = () => {
      myDispatch(toggleCollapse())
  
    }
const collapsed = useSelector((state) => state.collapsed.collapsed);

  return (
    <div className={`${collapsed ?"collapsed":"main"}`}>
      <div className="container-fluid p-0 m-0">
        <div className="row p-0 m-0 ">
      <input type="checkbox" id='mycheck'/>
            <div className="col-md-12 p-0 m-0 my_Navbar">
                <div className="d-flex justify-content-between border-bottom border-0 py-3">
                    <div className="left">
      <label htmlFor="mycheck" onClick={()=>toggleSidebar()}>
    <span className='fas fa-times my_span ' id='times'></span>
    <span className='fas fa-bars my_span' id='bars'></span>
  </label>
                    </div>
                    <div className="right d-flex">
                    <i className="fa-regular fa-user mx-4 "></i>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
