import { createContext, useReducer, useEffect } from 'react'

export const AuthSlice = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        // Cases for User
        case 'USER_LOGIN':
            return {

                user: action.payload
            }
        case 'USER_LOGOUT':
            return {
                user: null
            }

        default:
            return {
                state: null
            }

    }
}
export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, {
        user: null,

    })
    useEffect(() => {

        const user = JSON.parse(localStorage.getItem('user'))

        if (user) {
            dispatch({ type: 'USER_LOGIN', payload: user })
        }


    }, [])

    return (
        <AuthSlice.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthSlice.Provider>
    )
}
