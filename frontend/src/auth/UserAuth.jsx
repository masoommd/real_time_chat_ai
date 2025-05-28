import React, {useContext,useEffect,useState } from 'react'
import { UserContext } from '../context/user_context'
import { useNavigate } from 'react-router-dom';

const UserAuth = ({children}) => {
    const {user} = useContext(UserContext);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    

   

    useEffect(() => {

        if(user){
        setLoading(false);
    }
        if(!token){
            navigate('/login');
        }
        if(!user){
            navigate('/login');
        }
    },[])

     if(loading){
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        )
    }
  return (
    <>
        {children}
    </>
  )
}

export default UserAuth