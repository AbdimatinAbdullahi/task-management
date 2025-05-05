import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom"
import style from '../../Styles/Style.module.css' 
import axios from 'axios'
function InvitationAcceptance() {

    const [searchParams] = useSearchParams()
    const user_id = searchParams.get("user_id")
    const email = searchParams.get("email")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleAcceptInvitation = async (e) =>{
        e.preventDefault()
        if(password === ""){
            alert("Enter password please!")
            return;
        }

        try {
            const accepInRs = await axios.post(`http://127.0.0.1:5000/api/accept-invitations/${user_id}`, {email, password})
            if(accepInRs.status == 200){
                alert("Password set!")
                navigate('/login')
            }
        } catch (error) {
            console.log("Error while creating password from invited user: ", error)       
        }
    }

  return (
    <div className={style.acc_pg}>
        <form className={style.form_acc_pg} onSubmit={handleAcceptInvitation} >
            <p>Accept Workspace Invitation</p>
            <div className={style.email_acc_pg}>
                <label htmlFor="email">Email</label>
                <input type="email" value={email}/>
            </div>
            <div className={style.password_acc_pg}>
                <label htmlFor="password">Create Password</label>
                <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder='Create Password' />
            </div>
            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default InvitationAcceptance