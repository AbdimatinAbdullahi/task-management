import React, {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'


const AuthContext = createContext()

export const AuthProvider = ({children})=>{

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [errorMesage, setErrorMesage] = useState('')


    const login = async (email, password) =>{
        try {
            console.log("Email and password: ", email, password)
            const response = await axios.post("http://127.0.0.1:5000/auth/login", {email, password})
            localStorage.setItem("token", response.data.token)
            setUser({"firstname": response.data.fullname, "email" : response.data.email})
            navigate('/projects')
        } catch (error) {
            console.error('Login failed : ',error)
            console.log(error.response.data.error)
            setErrorMesage(error.response?.data?.error || 'Login Failed!')   
        }
    }



    const logout = ()=>{
        localStorage.removeItem("token")
        setUser(null)
        navigate("/")
    }

    
    const signup = async (fullname, email, password)=>{
        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/signup", {fullname, email, password})
            if (response.status == 200){
                navigate('/verify-email', {state: {email}})
            }
        } catch (error) {
            console.error(error)
            setErrorMesage(error.response?.data?.message)
        }
    }


    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);  // Debugging
    
        if (!token) {
            setErrorMesage("No token found!");
            return;
        }
    
        axios.get("http://127.0.0.1:5000/auth/protected", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        .then(response => {
            setUser({ firstname: response.data.fullname, email: response.data.email });
            console.log("Response:", response.data);
        })
        .catch(error => {
            console.error("Error:", error.response?.data || error);
            setErrorMesage(error.response?.data?.message || "Authentication failed");
        });
        
    }, []);
    

    return (
        <AuthContext.Provider value={{user, login, signup, errorMesage}} >
            {children}
        </AuthContext.Provider>
    )

};

export const useAuth = () => useContext(AuthContext)