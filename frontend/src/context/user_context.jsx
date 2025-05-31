import React, {createContext,useState } from 'react'

export const UserContext = createContext();

export const UserProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);

    return (
        <UserContext.Provider value={{user, setUser, loggedInUser, setLoggedInUser}}>
            {children}
        </UserContext.Provider>
    )
}




