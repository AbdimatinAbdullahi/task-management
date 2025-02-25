import React, {useEffect, useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './Style.module.css'

function VerifyPage() {

  const location = useLocation()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const { email, from } = location.state
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')


  // Request to handle Verifiying code
  const handleVerification = async ()=>{
    setMessage("")
    setLoading(true)
    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/verify-code", {email, code})
      console.log(response)
      if(response.status == 200){
        navigate('/projects')
        setMessage(response.data.message)
      }
    } catch (error) {
      setMessage(error.response.data.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }


 //Function to handle Request verification code 
  const HandleReuestCode = async ()=>{
    setMessage("")
    try {
      setLoading(true)
      const response = await axios.post("http://127.0.0.1:5000/auth/send-verification", {email})
      console.log(response)
      setMessage(response.data.message)
      setLoading(false)
    } catch (error) {
      console.error(error)
    } 
  }


  return (
    <div className={styles.verifyContainer} >
      {message && <h2 style={{"color": "red"}} >{message}</h2>}
          <h2>Verification needed. Enter the verifaction code sent {email}</h2>
        <div className={styles.inputContainer}>
            <input type="text" value={code} onChange={e => setCode(e.target.value)} />
            <button onClick={handleVerification} disabled={loading} > {loading ? "Loading..." : "Verify"} </button>
        </div>
        <h4 onClick={HandleReuestCode}>Request another code</h4>
    </div>
  )
}

export default VerifyPage