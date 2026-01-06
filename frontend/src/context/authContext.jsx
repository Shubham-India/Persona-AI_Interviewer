import React , { createContext , useState , useContext , useEffect } from "react";
import { useNavigate  } from "react-router-dom" ;
import baseApi from "../services/apiService" ;

export const AuthContext = createContext()   // AUthContext mera storage Box

export const AuthProvider = ( {children}) => {
    const [user , setUser] = useState ( null ) ;
    const [ loading_auth , setLoading_auth ] = useState ( true ) ;
   

    const navigate = useNavigate()
    const login = (userData)=>{
        setUser ( userData ) ;
    }

    const logout = () => {
        setUser ( null ) ;
        localStorage.removeItem ( "token" ) ;
        localStorage.removeItem("refreshToken");
        navigate ( "/" ) ;
    }



useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setLoading_auth(false); 
      return;
    }

    try {
      const res = await baseApi.get('/users/me'); 
      
      
      if (res) {
        setUser(res);
      }
    } catch (err) {
      console.error("Refresh Auth Failed:", err);
     
    } finally {
    
      setLoading_auth(false);
    }
  };

  initAuth();
}, []);

    return (
    <AuthContext.Provider value={{ user, login , logout, loading_auth }}>
      {children}
    </AuthContext.Provider>
    )

}



export const useAuth = () => {
    const context = useContext ( AuthContext ) ;
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context ;
}
