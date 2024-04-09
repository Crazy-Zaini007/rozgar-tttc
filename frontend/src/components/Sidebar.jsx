import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { useAuthContext } from '../hooks/userHooks/UserAuthHook'

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState(1);
  const [option1, setOption1] = useState(false)
  const [option2, setOption2] = useState(false)
  const [option3, setOption3] = useState(false)
  const [option4, setOption4] = useState(false)
  const [option5, setOption5] = useState(false)
  const [option6, setOption6] = useState(false)
  const [option7, setOption7] = useState(false)
  const [option8, setOption8] = useState(false)
  const [option9, setOption9] = useState(false)
  const [option10,setOption10] = useState(false)
  const [option11,setOption11] = useState(false)
  const [option12,setOption12] = useState(false)
  const [option13,setOption13] = useState(false)
  const [option14,setOption14] = useState(false)
  const [option15,setOption15] = useState(false)
  const [option16,setOption16] = useState(false)


  const handleOption1 = () => {
    setOption1(true)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)



  }
  const handleOption2 = () => {
    setOption1(false)
    setOption2(true)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)



  }
  const handleOption3 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(true)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)


  }
  const handleOption4 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(true)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)


  }
  const handleOption5 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(true)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)


  }
  const handleOption6 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(true)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)


  }
  const handleOption7 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(true)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)


  }
  const handleOption8 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(true)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)


  }
  const handleOption9 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(true)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)


  }
  const handleOption10 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(true)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)


  }
  const handleOption11 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(true)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)


  }
  const handleOption12 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(true)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(false)

  }
  const handleOption13 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(true)
    setOption14(false)
    setOption15(false)
    setOption16(false)


  }
  const handleOption14 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(true)
    setOption15(false)
    setOption16(false)

  }

  const handleOption15 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(true)
    setOption16(false)

  }
  const handleOption16 = () => {
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption4(false)
    setOption5(false)
    setOption6(false)
    setOption7(false)
    setOption8(false)
    setOption9(false)
    setOption10(false)
    setOption11(false)
    setOption12(false)
    setOption13(false)
    setOption14(false)
    setOption15(false)
    setOption16(true)

  }

  const navigate = useNavigate()
  const location = useLocation();

  // Function to handle click event and set active item
  const handleItemClick = (index, route) => {

    setActiveItem(index);
    navigate(route)
  };


  // Listen for changes in the location (URL)
  useEffect(() => {
    // Update the active item based on the current route
    const updateActiveItem = () => {
      const route = location.pathname;
      // console.log('Current Route:', route);
      switch (route) {
        case '/':
          setActiveItem(1);
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)
          


          break;
        case '/rozgar/cash_in_hand':
          setActiveItem(2);
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)


          break;
        case '/rozgar/bank_cash':
          setActiveItem(90);
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
          case '/rozgar/direct/payment_in':
            setActiveItem(114);
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(false)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(false)
  
            break;
            case '/rozgar/direct/payment_out':
              setActiveItem(115);
              setOption1(false)
              setOption2(false)
              setOption3(false)
              setOption4(false)
              setOption5(false)
              setOption6(false)
              setOption7(false)
              setOption8(false)
              setOption9(false)
              setOption10(false)
              setOption11(false)
              setOption12(false)
              setOption13(false)
              setOption14(false)
              setOption15(false)
              setOption16(false)
    
              break;
        case '/rozgar/reminders':
          setActiveItem(91);
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
          case '/rozgar/notifications':
            setActiveItem(109);
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(false)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(false)
  
            break;
            case '/rozgar/recyclebin':
            setActiveItem(110);
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(false)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(false)
  
            break;
        case '/rozgar/notes':
          setActiveItem(92);
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/backup':
          setActiveItem(93);
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/enteries/add_new_entry':
          setActiveItem(3);
          setOption1(true)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/enteries/entry_details':
          setActiveItem(4)
          setOption1(true)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/enteries/reports_details':
          setActiveItem(5)
          setOption1(true)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)


          break;
        case '/rozgar/supplier/payment_in':
          setActiveItem(7)
          setOption1(false)
          setOption2(true)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/supplier/payment_out':
          setActiveItem(8)
          setOption1(false)
          setOption2(true)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/supplier/payment_return':
          setActiveItem(9)
          setOption1(false)
          setOption2(true)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/supplier/details':
          setActiveItem(10)

          setOption1(false)
          setOption2(true)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/supplier/cand_vise_payment_in':
          setActiveItem(11)
          setOption1(false)
          setOption2(true)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/supplier/cand_vise_payment_out':
          setActiveItem(49)
          setOption1(false)
          setOption2(true)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/supplier/cand_vise_payment_return':
          setActiveItem(50)
          setOption1(false)
          setOption2(true)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/supplier/cand_vise_payment_details':
          setActiveItem(51)
          setOption1(false)
          setOption2(true)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/setting/visa_section':
          setActiveItem(13)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(true)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/setting/ticket_section':
          setActiveItem(14)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(true)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)


          break;
        case '/rozgar/setting/visit_section':
          setActiveItem(15)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(true)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/setting/azad_section':
          setActiveItem(16)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(true)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/setting/crediter_debiter_section':
          setActiveItem(17)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(true)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/setting/protector_section':
          setActiveItem(66)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(true)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
          case '/rozgar/setting/assets_section':
            setActiveItem(107)
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(true)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(false)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(false)
  
            break;
        case '/rozgar/setting/other_section':
          setActiveItem(18)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(true)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/agents/payment_in':
          setActiveItem(19)
          setOption1(false)
          setOption2(false)
          setOption3(true)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/agents/payment_out':
          setActiveItem(20)
          setOption1(false)
          setOption2(false)
          setOption3(true)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/agents/payment_return':
          setActiveItem(21)
          setOption1(false)
          setOption2(false)
          setOption3(true)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/agents/details':
          setActiveItem(22)
          setOption1(false)
          setOption2(false)
          setOption3(true)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/agents/cand_vise_payment_in':
          setActiveItem(23)
          setOption1(false)
          setOption2(false)
          setOption3(true)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/agents/cand_vise_payment_out':
          setActiveItem(52)
          setOption1(false)
          setOption2(false)
          setOption3(true)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/agents/cand_vise_payment_return':
          setActiveItem(53)
          setOption1(false)
          setOption2(false)
          setOption3(true)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/agents/cand_vise_payment_details':
          setActiveItem(54)
          setOption1(false)
          setOption2(false)
          setOption3(true)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/candidates/payment_in':
          setActiveItem(25)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(true)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/candidates/payment_out':
          setActiveItem(26)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(true)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/candidates/payment_return':
          setActiveItem(27)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(true)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/candidates/details':
          setActiveItem(28)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(true)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/candidates/cand_vise_payment_in':
          setActiveItem(29)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(true)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/candidates/cand_vise_payment_out':
          setActiveItem(55)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(true)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/candidates/cand_vise_payment_return':
          setActiveItem(56)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(true)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/candidates/cand_vise_payment_details':
          setActiveItem(57)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(true)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/tickets/payment_in':
          setActiveItem(31)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(true)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/tickets/payment_out':
          setActiveItem(32)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(true)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/tickets/payment_return':
          setActiveItem(33)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(true)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/tickets/details':
          setActiveItem(34)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(true)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/visits/payment_in':
          setActiveItem(37)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(true)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/visits/payment_out':
          setActiveItem(38)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(true)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)


          break;

        case '/rozgar/visits/payment_return':
          setActiveItem(39)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(true)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)


          break;
        case '/rozgar/visits/details':
          setActiveItem(40)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(true)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/azad/payment_in':
          setActiveItem(43)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(true)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)


          break;
        case '/rozgar/azad/payment_out':
          setActiveItem(44)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(true)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/azad/payment_return':
          setActiveItem(45)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(true)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/azad/details':
          setActiveItem(46)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(true)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/expenses/add_new_expense':
          setActiveItem(47)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(true)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/expenses/add/mul_expense':
          setActiveItem(89)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(true)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/expenses/expenses_details':
          setActiveItem(48)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(true)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/credites&debits/payment_in/with_cash_in_hand':
          setActiveItem(58)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(true)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/credites&debits/payment_out/with_cash_in_hand':
          setActiveItem(59)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(true)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/credites&debits/details/with_cash_in_hand':
          setActiveItem(61)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(true)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/credites&debits/payment_in/without_cash_in_hand':
          setActiveItem(62)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(true)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/credites&debits/payment_out/without_cash_in_hand':
          setActiveItem(63)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(true)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/credites&debits/details/without_cash_in_hand':
          setActiveItem(65)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(true)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

          case '/rozgar/assets/payment_in':
            setActiveItem(103)
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(false)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(true)
  
            break;
          case '/rozgar/assets/payment_out':
            setActiveItem(104)
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(false)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(true)
  
            break;
  
          case '/rozgar/assets/details':
            setActiveItem(105)
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(false)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(true)
  
            break;

        case '/rozgar/reports/invoice':
          setActiveItem(67)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/reports/day_book':
          setActiveItem(68)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/reports/cash_in_hand/with_out_expenses':
          setActiveItem(69)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/reports/cash_in_hand':
          setActiveItem(70)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/reports/overall_visa_wise':
          setActiveItem(71)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/reports/overall_payment_visa_wise':
          setActiveItem(72)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/reports/receivable_reports':
          setActiveItem(73)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/reports/payable_reports':
          setActiveItem(74)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
          case '/rozgar/reports/normal_payments':
            setActiveItem(97)
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(true)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(false)
  
            break;
            case '/rozgar/reports/advance_payments':
              setActiveItem(98)
              setOption1(false)
              setOption2(false)
              setOption3(false)
              setOption4(false)
              setOption5(false)
              setOption6(false)
              setOption7(false)
              setOption8(false)
              setOption9(false)
              setOption10(false)
              setOption11(false)
              setOption12(true)
              setOption13(false)
              setOption14(false)
              setOption15(false)
              setOption16(false)
    
              break;

        case '/rozgar/reports/summerize_profit_lose':
          setActiveItem(75)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
          case '/rozgar/reports/profit_lose_report':
            setActiveItem(94)
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(true)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(false)
  
            break;
            case '/rozgar/reports/profit_report':
              setActiveItem(95)
              setOption1(false)
              setOption2(false)
              setOption3(false)
              setOption4(false)
              setOption5(false)
              setOption6(false)
              setOption7(false)
              setOption8(false)
              setOption9(false)
              setOption10(false)
              setOption11(false)
              setOption12(true)
              setOption13(false)
              setOption14(false)
              setOption15(false)
              setOption16(false)
    
              break;
              case '/rozgar/reports/lose_report':
                setActiveItem(96)
                setOption1(false)
                setOption2(false)
                setOption3(false)
                setOption4(false)
                setOption5(false)
                setOption6(false)
                setOption7(false)
                setOption8(false)
                setOption9(false)
                setOption10(false)
                setOption11(false)
                setOption12(true)
                setOption13(false)
                setOption14(false)
                setOption15(false)
                setOption16(false)
      
                break;

        case '/rozgar/reports/expenses_reports':
          setActiveItem(76)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/reports/candidates_reports':
          setActiveItem(77)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/reports/agents_reports':
          setActiveItem(78)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/reports/suppliers_reports':
          setActiveItem(79)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
          case '/rozgar/reports/ticket_reports':
            setActiveItem(100)
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(true)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(false)
  
            break;
            case '/rozgar/reports/azadVisa_reports':
              setActiveItem(101)
              setOption1(false)
              setOption2(false)
              setOption3(false)
              setOption4(false)
              setOption5(false)
              setOption6(false)
              setOption7(false)
              setOption8(false)
              setOption9(false)
              setOption10(false)
              setOption11(false)
              setOption12(true)
              setOption13(false)
              setOption14(false)
              setOption15(false)
              setOption16(false)
    
              break;
              case '/rozgar/reports/visitVisa_reports':
                setActiveItem(102)
                setOption1(false)
                setOption2(false)
                setOption3(false)
                setOption4(false)
                setOption5(false)
                setOption6(false)
                setOption7(false)
                setOption8(false)
                setOption9(false)
                setOption10(false)
                setOption11(false)
                setOption12(true)
                setOption13(false)
                setOption14(false)
                setOption15(false)
                setOption16(false)
      
                break;

        case '/rozgar/reports/payroll_reports':
          setActiveItem(80)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(true)
          setOption13(false)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
          case '/rozgar/reports/net_visa_reports':
            setActiveItem(107)
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(true)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(false)
  
            break;
            case '/rozgar/reports/overall_visa_profit_reports':
            setActiveItem(111)
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(true)
            setOption13(false)
            setOption14(false)
            setOption15(false)
            setOption16(false)
  
            break;
            case '/rozgar/reports/cand_visa_payment_reports':
              setActiveItem(112)
              setOption1(false)
              setOption2(false)
              setOption3(false)
              setOption4(false)
              setOption5(false)
              setOption6(false)
              setOption7(false)
              setOption8(false)
              setOption9(false)
              setOption10(false)
              setOption11(false)
              setOption12(true)
              setOption13(false)
              setOption14(false)
              setOption15(false)
              setOption16(false)
    
              break;
              case '/rozgar/reports/overall_system_payment_reports':
              setActiveItem(113)
              setOption1(false)
              setOption2(false)
              setOption3(false)
              setOption4(false)
              setOption5(false)
              setOption6(false)
              setOption7(false)
              setOption8(false)
              setOption9(false)
              setOption10(false)
              setOption11(false)
              setOption12(true)
              setOption13(false)
              setOption14(false)
              setOption15(false)
              setOption16(false)
    
              break;

        case '/rozgar/protector/payment_out':
          setActiveItem(81)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(true)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;
        case '/rozgar/protector/payment_return':
          setActiveItem(82)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(true)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/protector/details':
          setActiveItem(83)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(true)
          setOption14(false)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/user/account':
          setActiveItem(84)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(true)
          setOption15(false)
          setOption16(false)

          break;

        case '/rozgar/employees/add':
          setActiveItem(85)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(true)
          setOption16(false)

          break;
          case '/rozgar/employees/salary_month':
            setActiveItem(99)
            setOption1(false)
            setOption2(false)
            setOption3(false)
            setOption4(false)
            setOption5(false)
            setOption6(false)
            setOption7(false)
            setOption8(false)
            setOption9(false)
            setOption10(false)
            setOption11(false)
            setOption12(false)
            setOption13(false)
            setOption14(false)
            setOption15(true)
          setOption16(false)

            break;
        case '/rozgar/employees/add_payment':
          setActiveItem(86)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(true)
          setOption16(false)

          break;

        case '/rozgar/employees/add_leave':
          setActiveItem(87)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(true)
          setOption16(false)

          break;

        case '/rozgar/employees/employees_details':
          setActiveItem(88)
          setOption1(false)
          setOption2(false)
          setOption3(false)
          setOption4(false)
          setOption5(false)
          setOption6(false)
          setOption7(false)
          setOption8(false)
          setOption9(false)
          setOption10(false)
          setOption11(false)
          setOption12(false)
          setOption13(false)
          setOption14(false)
          setOption15(true)
          setOption16(false)

          break;
        default:
          setActiveItem(1)
          break;
      }
    };
    updateActiveItem()
  }, [location.pathname]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Added state for sidebar collapse

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Logout 

  const { dispatch, user } = useAuthContext()


  const handleLogout = () => {
    if (window.confirm('Are you sure you want to Logout from your Account?')) {
      if (user) {
        setTimeout(() => {
          navigate("/rozgar/login")
          localStorage.removeItem('user')
        }, 10);
        dispatch({ type: "USER_LOGOUT" });
      }
    }

  }

  return (
    <>
      <Paper>
        <div className="top_btn">
          {/* <button className='toggle_btn btn' onClick={toggleSidebar}><Avatar  sx={{ width: 28, height: 28 }}>{!isSidebarCollapsed ?<ChevronLeftIcon></ChevronLeftIcon>:<ChevronRightIcon></ChevronRightIcon>}</Avatar></button> */}
        </div>
        <div className={`sidenav ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="welcome text-center pt-4">
            <h4>Rozgar TTTC Finance</h4>
            {/* <div className='text-center image mx-auto '><img className='mx-auto' src={logo} alt="" /></div> */}
          </div>
          <ul className="pt-2 mt-2">
            <li className=' my-2' style={activeItem === 1 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(1, `/`)}><i className="fas fa-chart-line me-2"></i>Dashboard</li>
            <li className=' my-2' style={activeItem === 2 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(2, `/rozgar/cash_in_hand`)}><i className="fas fa-hand-holding-usd me-2"></i>Cash in Hand </li>
            <li className=' my-2' style={activeItem === 90 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(90, `/rozgar/bank_cash`)}><i className="fas fa-university me-2"></i>Banks Cash </li>
            <li className=' my-2' style={activeItem === 114 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(114, `/rozgar/direct/payment_in`)}><i className="fas fa-arrow-down me-2"></i>Direct Payment IN </li>
            <li className=' my-2' style={activeItem === 115 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(115, `/rozgar/direct/payment_out`)}><i className="fas fa-arrow-up me-2"></i>Direct Payment OUT </li>
          </ul>
          <Divider className='mx-4'></Divider>
          <ul className='pt-2 mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption1} style={option1 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa-solid fa-pen-to-square mx-2"></i>Enteries {option1 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>

            </div>
            {option1 &&
              <>
                <li className=' my-2' style={activeItem === 3 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(3, `/rozgar/enteries/add_new_entry`)}><i className="fas fa-plus me-2"></i>Add New Entry</li>
                <li className=' my-2' style={activeItem === 4 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(4, `/rozgar/enteries/entry_details`)}><i className="fas fa-info-circle me-2"></i>Entery Details</li>
                <li className=' my-2' style={activeItem === 5 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(5, `/rozgar/enteries/reports_details`)}><i className="far fa-file-alt me-2"></i>Details Reports</li>
              </>
            }
          </ul>
          {option1 &&
            <Divider className='mx-4'></Divider>
          }
          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption2} style={option2 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa-solid fa-users mx-2"></i>Suppliers {option2 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>

            </div>
            {option2 &&
              <>
                <li className=' my-2' style={activeItem === 7 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(7, `/rozgar/supplier/payment_in`)}><i className="fas fa-arrow-down me-2"></i>Payment IN </li>
                <li className=' my-2' style={activeItem === 8 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(8, `/rozgar/supplier/payment_out`)}><i className="fas fa-arrow-up me-2"></i>Payment OUT </li>
                <li className=' my-2' style={activeItem === 9 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(9, `/rozgar/supplier/payment_return`)}><i className="fas fa-exchange-alt me-2"></i>Payment Return </li>
                <li className=' my-2' style={activeItem === 10 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(10, `/rozgar/supplier/details`)}><i className="far fa-file-alt me-2"></i>Details Reports </li>
                <li className=' my-2' style={activeItem === 11 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(11, `/rozgar/supplier/cand_vise_payment_in`)}><i className="fas fa-arrow-down me-2"></i>C-V Payment IN</li>
                <li className=' my-2' style={activeItem === 49 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(49, `/rozgar/supplier/cand_vise_payment_out`)}><i className="fas fa-arrow-up me-2"></i>C-V Payment OUT</li>
                <li className=' my-2' style={activeItem === 50 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(50, `/rozgar/supplier/cand_vise_payment_return`)}><i className="fas fa-exchange-alt me-2"></i>C-V Payment Return</li>
                <li className=' my-2' style={activeItem === 51 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(51, `/rozgar/supplier/cand_vise_payment_details`)}><i className="far fa-file-alt me-2"></i>C-V Details Reports</li>



              </>
            }
          </ul>
          {option2 &&
            <Divider className='mx-4'></Divider>
          }
          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption3} style={option3 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa-solid fa-users-line mx-2"></i>Agents {option3 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>
            </div>
            {option3 &&
              <>
                <li className=' my-2' style={activeItem === 19 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(19, `/rozgar/agents/payment_in`)}><i className="fas fa-arrow-down me-2"></i>Payment IN </li>
                <li className=' my-2' style={activeItem === 20 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(20, `/rozgar/agents/payment_out`)}><i className="fas fa-arrow-up me-2"></i>Payment OUT </li>
                <li className=' my-2' style={activeItem === 21 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(21, `/rozgar/agents/payment_return`)}><i className="fas fa-exchange-alt me-2"></i>Payment Return </li>
                <li className=' my-2' style={activeItem === 22 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(22, `/rozgar/agents/details`)}><i className="far fa-file-alt me-2"></i>Details Reports </li>
                <li className=' my-2' style={activeItem === 23 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(23, `/rozgar/agents/cand_vise_payment_in`)}><i className="fas fa-arrow-down me-2"></i>C-V Payment IN</li>
                <li className=' my-2' style={activeItem === 52 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(52, `/rozgar/agents/cand_vise_payment_out`)}><i className="fas fa-arrow-up me-2"></i>C-V Payment OUT</li>
                <li className=' my-2' style={activeItem === 53 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(53, `/rozgar/agents/cand_vise_payment_return`)}><i className="fas fa-exchange-alt me-2"></i>C-V Payment Return</li>
                <li className=' my-2' style={activeItem === 54 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(54, `/rozgar/agents/cand_vise_payment_details`)}><i className="far fa-file-alt me-2"></i>C-V Details Reports</li>

              </>
            }
          </ul>
          {option3 &&
            <Divider className='mx-4'></Divider>
          }
          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption5} style={option5 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa-solid fa-user mx-2"></i>Candidates{option5 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>
            </div>
            {option5 &&
              <>
                <li className=' my-2' style={activeItem === 25 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(25, `/rozgar/candidates/payment_in`)}><i className="fas fa-arrow-down me-2"></i>Payment IN </li>
                <li className=' my-2' style={activeItem === 26 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(26, `/rozgar/candidates/payment_out`)}><i className="fas fa-arrow-up me-2"></i>Payment OUT </li>
                <li className=' my-2' style={activeItem === 27 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(27, `/rozgar/candidates/payment_return`)}><i className="fas fa-exchange-alt me-2"></i>Payment Return </li>
                <li className=' my-2' style={activeItem === 28 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(28, `/rozgar/candidates/details`)}><i className="far fa-file-alt me-2"></i>Details Reports</li>


              </>
            }
          </ul>
          {option5 &&
            <Divider className='mx-4'></Divider>
          }

          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption6} style={option6 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa-solid fa-ticket mx-2"></i>Tickets {option6 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>
            </div>
            {option6 &&
              <>
                <li className=' my-2' style={activeItem === 31 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(31, `/rozgar/tickets/payment_in`)}><i className="fas fa-arrow-down me-2"></i>Payment IN </li>
                <li className=' my-2' style={activeItem === 32 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(32, `/rozgar/tickets/payment_out`)}><i className="fas fa-arrow-up me-2"></i>Payment OUT </li>
                <li className=' my-2' style={activeItem === 33 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(33, `/rozgar/tickets/payment_return`)}><i className="fas fa-exchange-alt me-2"></i>Payment Return </li>
                <li className=' my-2' style={activeItem === 34 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(34, `/rozgar/tickets/details`)}><i className="far fa-file-alt me-2"></i>Details Reports </li>

              </>
            }
          </ul>
          {option6 &&
            <Divider className='mx-4'></Divider>
          }
          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption7} style={option7 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa-solid fa-braille mx-2"></i>Visits {option7 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>
            </div>
            {option7 &&
              <>
                <li className=' my-2' style={activeItem === 37 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(37, `/rozgar/visits/payment_in`)}><i className="fas fa-arrow-down me-2"></i>Payment IN </li>
                <li className=' my-2' style={activeItem === 38 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(38, `/rozgar/visits/payment_out`)}><i className="fas fa-arrow-up me-2"></i>Payment OUT </li>
                <li className=' my-2' style={activeItem === 39 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(39, `/rozgar/visits/payment_return`)}><i className="fas fa-exchange-alt me-2"></i>Payment Return </li>
                <li className=' my-2' style={activeItem === 40 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(40, `/rozgar/visits/details`)}><i className="far fa-file-alt me-2"></i>Details Reports </li>

              </>
            }
          </ul>
          {option7 &&
            <Divider className='mx-4'></Divider>
          }

          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption8} style={option8 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa-solid fa-flag mx-2"></i>Azad  {option8 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>
            </div>
            {option8 &&
              <>
                <li className=' my-2' style={activeItem === 43 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(34, `/rozgar/azad/payment_in`)}><i className="fas fa-arrow-down me-2"></i>Payment IN </li>
                <li className=' my-2' style={activeItem === 44 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(44, `/rozgar/azad/payment_out`)}><i className="fas fa-arrow-up me-2"></i>Payment OUT </li>
                <li className=' my-2' style={activeItem === 45 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(45, `/rozgar/azad/payment_return`)}><i className="fas fa-exchange-alt me-2"></i>Payment Return </li>
                <li className=' my-2' style={activeItem === 46 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(46, `/rozgar/azad/details`)}><i className="far fa-file-alt me-2"></i>Details Reports </li>

              </>
            }
          </ul>
          {option8 &&
            <Divider className='mx-4'></Divider>
          }
          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption13} style={option13 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa fa-shield mx-2"></i>Protector  {option13 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>
            </div>
            {option13 &&
              <>

                <li className=' my-2' style={activeItem === 81 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(81, `/rozgar/protector/payment_out`)}><i className="fas fa-arrow-up me-2"></i>Payment OUT </li>
                {/* <li className=' my-2' style={activeItem === 82 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(82, `/rozgar/protector/payment_return`)}><i className="fas fa-exchange-alt me-2"></i>Payment Return </li> */}
                <li className=' my-2' style={activeItem === 83 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(83, `/rozgar/protector/details`)}><i className="far fa-file-alt me-2"></i>Details Reports </li>

              </>
            }
          </ul>
          {option13 &&
            <Divider className='mx-4'></Divider>
          }
          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption10} style={option10 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa-solid fa-credit-card mx-2"></i>Credits/Debits{option10 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>
            </div>
            {option10 &&
              <>
                <li className=' my-2' style={activeItem === 58 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(58, `/rozgar/credites&debits/payment_in/with_cash_in_hand`)}><i className="fas fa-arrow-down me-2"></i>Payment IN </li>
                <li className=' my-2' style={activeItem === 59 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(59, `/rozgar/credites&debits/payment_out/with_cash_in_hand`)}><i className="fas fa-arrow-up me-2"></i>Payment OUT </li>
                <li className=' my-2' style={activeItem === 61 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(61, `/rozgar/credites&debits/details/with_cash_in_hand`)}><i className="far fa-file-alt me-2"></i>Details Reports </li>

              </>
            }
          </ul>
          {option10 &&
            <Divider className='mx-4'></Divider>
          }

          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption11} style={option11 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa-regular fa-credit-card mx-2"></i>C/D(WOCIH){option11 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>
            </div>
            {option11 &&
              <>
                <li className=' my-2' style={activeItem === 62 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(62, `/rozgar/credites&debits/payment_in/without_cash_in_hand`)}><i className="fas fa-arrow-down me-2"></i>Payment IN </li>
                <li className=' my-2' style={activeItem === 63 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(63, `/rozgar/credites&debits/payment_out/without_cash_in_hand`)}><i className="fas fa-arrow-up me-2"></i>Payment OUT </li>
                <li className=' my-2' style={activeItem === 65 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(65, `/rozgar/credites&debits/details/without_cash_in_hand`)}><i className="far fa-file-alt me-2"></i>Details Reports </li>

              </>
            }
          </ul>
          {option11 &&
            <Divider className='mx-4'></Divider>
          }

             <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption16} style={option16 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fas fa-shopping-basket mx-2"></i>Assets{option16 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>
            </div>
            {option16 &&
              <>
                <li className=' my-2' style={activeItem === 103 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(103, `/rozgar/assets/payment_in`)}><i className="fas fa-arrow-down me-2"></i>Payment IN </li>
                <li className=' my-2' style={activeItem === 104 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(104, `/rozgar/assets/payment_out`)}><i className="fas fa-arrow-up me-2"></i>Payment OUT </li>
                <li className=' my-2' style={activeItem === 105 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(105, `/rozgar/assets/details`)}><i className="far fa-file-alt me-2"></i>Details Reports </li>
              </>
            }
          </ul>
          {option16 &&
            <Divider className='mx-4'></Divider>
          }
          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption9} style={option9 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fas fa-usd mx-2"></i>Expenses {option9 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>

            </div>
            {option9 &&
              <>
                <li className=' my-2' style={activeItem === 47 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(47, `/rozgar/expenses/add_new_expense`)}><i className="fas fa-plus me-2"></i>Add Expense</li>
                <li className=' my-2' style={activeItem === 89 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(89, `/rozgar/expenses/add/mul_expense`)}><i className="fas fa-plus me-2"></i>Add Mutiple Expense</li>
                <li className=' my-2' style={activeItem === 48 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(48, `/rozgar/expenses/expenses_details`)}><i className="fas fa-info-circle me-2"></i>Expenses Details</li>

              </>
            }
          </ul>
          {option9 &&
            <Divider className='mx-4'></Divider>
          }
          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption15} style={option15 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa-solid fa-users mx-2"></i>HR PayRolls {option15 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>

            </div>
            {option15 &&
              <>
                <li className=' my-2' style={activeItem === 85 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(85, `/rozgar/employees/add`)}><i className="fas fa-plus me-2"></i>Add Employee</li>
                <li className=' my-2' style={activeItem === 99 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(99, `/rozgar/employees/salary_month`)}><i className="fas fa-money-check-alt me-2"></i>Add Salary Month</li>
                <li className=' my-2' style={activeItem === 86 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(86, `/rozgar/employees/add_payment`)}><i className="fa-solid fa-money-check me-2"></i>Add Payment</li>
                <li className=' my-2' style={activeItem === 87 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(87, `/rozgar/employees/add_leave`)}><i className="fa-solid fa-person-walking-arrow-right me-2"></i>Add Vacation</li>
                <li className=' my-2' style={activeItem === 88 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(88, `/rozgar/employees/employees_details`)}><i className="fas fa-info-circle me-2"></i>Employees Details</li>
              </>
            }
          </ul>
          {option15 &&
            <Divider className='mx-4'></Divider>
          }
          <ul className="mt-2">
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption4} style={option4 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa-solid fa-gear mx-2"></i>Setting {option4 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>

            </div>
            {option4 &&
              <>
                <li className=' my-2' style={activeItem === 13 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(13, `/rozgar/setting/visa_section`)}><i className="fa-solid fa-circle-dot mx-2"></i>Visa Section</li>
                <li className=' my-2' style={activeItem === 14 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(14, `/rozgar/setting/ticket_section`)}><i className="fa-solid fa-circle-dot mx-2"></i>Ticket Section</li>
                <li className=' my-2' style={activeItem === 15 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(15, `/rozgar/setting/visit_section`)}><i className="fa-solid fa-circle-dot mx-2"></i>Visit Section</li>
                <li className=' my-2' style={activeItem === 16 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(16, `/rozgar/setting/azad_section`)}><i className="fa-solid fa-circle-dot mx-2"></i>Azad Section</li>
                <li className=' my-2' style={activeItem === 17 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(17, `/rozgar/setting/crediter_debiter_section`)}><i className="fa-solid fa-circle-dot mx-2"></i>Crediter/Debiter Section</li>
                <li className=' my-2' style={activeItem === 66 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(66, `/rozgar/setting/protector_section`)}><i className="fa-solid fa-circle-dot mx-2"></i>Protector Section</li>
                <li className=' my-2' style={activeItem === 107 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(107, `/rozgar/setting/assets_section`)}><i className="fa-solid fa-circle-dot mx-2"></i>Assets Section</li>
                <li className=' my-2' style={activeItem === 18 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(18, `/rozgar/setting/other_section`)}><i className="fa-solid fa-circle-dot mx-2"></i>Other Section</li>
              </>
            }

          </ul>
          {option4 && <Divider className='mx-4'></Divider>}
          <ul className="mt-2">
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption12} style={option12 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="far fa-file-alt mx-2"></i>All Reports {option12 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>

            </div>
            {option12 &&
              <>
                <li className=' my-2' style={activeItem === 67 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(67, `/rozgar/reports/invoice`)}><i className="fa-solid fa-circle-dot mx-2"></i>Search Invoice</li>
                <li className=' my-2' style={activeItem === 68 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(68, `/rozgar/reports/day_book`)}><i className="fa-solid fa-circle-dot mx-2"></i>Day Book</li>
                <li className=' my-2' style={activeItem === 69 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(69, `/rozgar/reports/cash_in_hand/with_out_expenses`)}><i className="fa-solid fa-circle-dot mx-2"></i>Cash in hand <br /> <span className='ms-4'> without expenses</span></li>
                <li className=' my-2' style={activeItem === 71 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(71, `/rozgar/reports/overall_visa_wise`)}><i className="fa-solid fa-circle-dot mx-2"></i>Overall Visa-Wise</li>
                <li className=' my-2' style={activeItem === 72 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(72, `/rozgar/reports/overall_payment_visa_wise`)}><i className="fa-solid fa-circle-dot mx-2"></i>Overall Payment <br /> <span className='ms-4'> Visa Wise</span></li>
                <li className=' my-2' style={activeItem === 106 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(106, `/rozgar/reports/net_visa_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>Net Visa Reports</li>
                <li className=' my-2' style={activeItem === 111 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(111, `/rozgar/reports/overall_visa_profit_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>Overall Visa  <br /> <span className='ms-4'> Profit Reports</span></li>
                <li className=' my-2' style={activeItem === 112 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(112, `/rozgar/reports/cand_visa_payment_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>Candidate Visa  <br /> <span className='ms-4'> Payments Reports</span></li>
                <li className=' my-2' style={activeItem === 113 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(113, `/rozgar/reports/overall_system_payment_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>Overall System  <br /> <span className='ms-4'> Payments Reports</span></li>
                <li className=' my-2' style={activeItem === 77 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(77, `/rozgar/reports/candidates_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>Candidate Reports</li>
                <li className=' my-2' style={activeItem === 78 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(78, `/rozgar/reports/agents_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>Agents Reports</li>
                <li className=' my-2' style={activeItem === 79 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(79, `/rozgar/reports/suppliers_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>Suppliers Reports</li>
                <li className=' my-2' style={activeItem === 100 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(100, `/rozgar/reports/ticket_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>Ticket Reports</li>
                <li className=' my-2' style={activeItem === 101 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(101, `/rozgar/reports/azadVisa_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>AzadVisa Reports</li>
                <li className=' my-2' style={activeItem === 102 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(102, `/rozgar/reports/visitVisa_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>VisitVisa Reports</li>
                <li className=' my-2' style={activeItem === 73 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(73, `/rozgar/reports/receivable_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>Receivable Reports</li>
                <li className=' my-2' style={activeItem === 74 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(74, `/rozgar/reports/payable_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>Payable Reports</li>
                <li className=' my-2' style={activeItem === 97 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(97, `/rozgar/reports/normal_payments`)}><i className="fa-solid fa-circle-dot mx-2"></i>Normal Payments</li>
                <li className=' my-2' style={activeItem === 98 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(98, `/rozgar/reports/advance_payments`)}><i className="fa-solid fa-circle-dot mx-2"></i>Advance Payments</li>
                <li className=' my-2' style={activeItem === 95 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(95, `/rozgar/reports/profit_report`)}><i className="fa-solid fa-circle-dot mx-2"></i>Profit Reports</li>
                <li className=' my-2' style={activeItem === 96 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(96, `/rozgar/reports/lose_report`)}><i className="fa-solid fa-circle-dot mx-2"></i>Loss Reports</li>
                <li className=' my-2' style={activeItem === 94 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(94, `/rozgar/reports/profit_lose_report`)}><i className="fa-solid fa-circle-dot mx-2"></i>Proft Loss <br /> <span className='ms-4'> Reports</span></li>
                <li className=' my-2' style={activeItem === 75 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(75, `/rozgar/reports/summerize_profit_lose`)}><i className="fa-solid fa-circle-dot mx-2"></i>Summarize Profit <br /> <span className='ms-4'> & Losses</span></li>
                <li className=' my-2' style={activeItem === 76 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(76, `/rozgar/reports/expenses_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>Expenses Reports</li>
                <li className=' my-2' style={activeItem === 80 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(80, `/rozgar/reports/payroll_reports`)}><i className="fa-solid fa-circle-dot mx-2"></i>HR Payrolls Reports</li>

              </>
            }

          </ul>
          {option12 && <Divider className='mx-4'></Divider>}

          <ul className='mt-2'>
            <div className="dropdown">
              <button className="btn text-start" onClick={handleOption14} style={option14 === true ? { backgroundColor: 'var(--cool-Green)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}}>
                <i className="fa fa-user-circle mx-2"></i>Account {option14 ? <i className="fa-solid fa-chevron-up ms-2"></i> : <i className="fa-solid fa-chevron-down ms-2"></i>}
              </button>

            </div>
            {option14 &&
              <>

                <li className=' my-2' style={activeItem === 84 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(84, `/rozgar/user/account`)}><i className="fa fa-user mx-2"></i>Manage Account</li>
              </>
            }
          </ul>
          {option14 &&
            <Divider className='mx-4'></Divider>
          }
          <ul className=" mt-2">
            <li className=' my-2' style={activeItem === 91 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(91, `/rozgar/reminders`)}><i className="fas fa-business-time me-2"></i>Reminders</li>
            <li className=' my-2' style={activeItem === 109 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(109, `/rozgar/notifications`)}><i className="fas fa-bell me-2"></i>Notifications</li>
            <li className=' my-2' style={activeItem === 110 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(110, `/rozgar/recyclebin`)}><i className="fas fa-recycle me-2"></i>RecycleBin</li>
            <li className=' my-2' style={activeItem === 92 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(92, `/rozgar/notes`)}><i className="fas fa-sticky-note me-2"></i>Notes</li>
            <li className=' my-2' style={activeItem === 93 ? { backgroundColor: 'var(--accent-stonger-blue)', border: '0px', borderRadius: '4px', fontWeight: '600', color: 'var(--white)', transition: 'background-color 0.3s', transform: '0.3s' } : {}} onClick={() => handleItemClick(93, `/rozgar/backup`)}><i className="fas fa-database me-2"></i>Backup</li>

          </ul>
          <ul className='mt-4'>
            <li className=' my-2' onClick={handleLogout}><i className=" me-2"><LogoutRoundedIcon fontSize='small'></LogoutRoundedIcon></i> Logout</li>
          </ul>
        </div>
      </Paper >


    </>
  )
}
