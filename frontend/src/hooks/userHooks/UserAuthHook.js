import { AuthSlice } from "../../redux/reducers/authSlice";
import { useContext } from "react";

export const useAuthContext=()=>{
    const context=useContext(AuthSlice)

    if(!context){
        throw Error('useAuthContext must be used inside an PostContextProvider')
    }
    return context
}