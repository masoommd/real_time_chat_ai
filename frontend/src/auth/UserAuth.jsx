import React, {useContext,useEffect,useState } from 'react'
import { UserContext } from '../context/user_context'
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios'

const UserAuth = ({children}) => {
    const {user, setUser} = useContext(UserContext);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    

   

    useEffect(() => {
    
    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    
    if (user) {
      setLoading(false);
      return;
    }

    
    const restoreUser = async () => {
      try {
        
        const res = await axios.get("/users/profile");
        if (res.data) {
            setUser(res.data.user); 
            console.log("user auth 38",res.data.user);
        };

        
        
      } catch (err) {
        
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, [token, user, navigate, setUser]);

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