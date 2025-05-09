import React, {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'


const AuthContext = createContext()

export const AuthProvider = ({children})=>{

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [errorMesage, setErrorMesage] = useState('')


    useEffect(() => {
        setErrorMesage("")
        const token = localStorage.getItem("token");    
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
            setUser({ firstname: response.data.fullname, email: response.data.email, token: response.data.token});
            navigate(`/workspace?id=${response.data.id}`)
        })
        .catch(error => {
            navigate('/')
        });
        
    }, []);

    const login = async (email, password) =>{
        setErrorMesage("")
        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/login", {email, password})
            if (response.data.has_workspace === false) {
                navigate(`/create-workspace?owner_id=${response.data.owner_id}`);
            } else {
                setUser({
                    firstname: response.data.fullname,
                    email: response.data.email,
                    token: response.data.token
                });
                localStorage.setItem("token", response.data.token)
                navigate(`/workspace?id=${response.data.id}`);
            }            
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
        setErrorMesage("")
        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/signup", {fullname, email, password})
            if (response.status == 200){
                navigate(`/create-workspace?owner_id=${response.data.owner_id}`);
            }
        } catch (error) {
            console.error(error)
            setErrorMesage(error.response?.data?.message)
        }
    }
    

    return (
        <AuthContext.Provider value={{user, login, signup, errorMesage, logout}} >
            {children}
        </AuthContext.Provider>
    )

};

export const useAuth = () => useContext(AuthContext)