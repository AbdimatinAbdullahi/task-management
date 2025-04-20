import React, {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import style from '../../Styles/style.module.css'


function Invitation() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
      const acceptInvitation = async () => {
        const queryParams = new URLSearchParams(location.search);
        const invited_user_id = queryParams.get("user_id");
        const code = queryParams.get("code");
        const email = queryParams.get("email");
    
        try {
          const response = await axios.post("http://127.0.0.1:5000/api/accept-invitations", {
            email,
            code,
            invited_user_id,
          });
    
          if (response.status === 200) {
            navigate(`/task/user?email=${email}&user_id=${invited_user_id}`);
          }
        } catch (error) {
          console.error("Error accepting invitation:", error);
        }
      };
    
      acceptInvitation();
    }, []);
    
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="payment-status-container"
    >
      <motion.div
        className="loading-spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <h2>Checking payment status...</h2>
    </motion.div>
  )
}

export default Invitation