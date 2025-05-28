import React, { useContext } from "react";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/user_context";
import { UserContext } from "./context/user_context";

const App = () => {

  const {setUser} = useContext(UserContext);
   useEffect(() => {
    axios.get("/users/profile")
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
};

export default App;
