import React, {useState} from 'react'
import style from '../Modals/modals.module.css'
import axios from 'axios'

function InviteModal({onClose, project_id, workspaceId, userId}) {

    const [userDetails, setuserDetails] = useState({ fullname: "", email: ""})
    const [loading, setloading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    
    const handleInvite = async ()=>{

        try {
            setloading(true)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userDetails.email)) {
                alert("Please enter a valid email address.");
                return;
            }
    
            if (!userDetails.email || !userDetails.fullname){
                alert("Please provide both email and user fullanme")
                return
            }
         
            const response = await axios.post(`http://127.0.0.1:5000/api/invites_users`, { email: userDetails.email, username: userDetails.fullname, workspaceId, userId })
            if(response.status === 200){
                alert("User Invited!")
                onClose()
            }

        } catch (error) {
            console.error(error)
        } finally {
            setloading(false)
        }

    }
  return (
    <div className={style.overlay} >
        <div className={style.modalInviteContainer}>

            <div className={style.inviteHeader}>
                <div className={style.headerOne}>
                    Invite user to a Workspace
                </div>
            </div>

            <div className={style.invitesInputs}>
                <input type="text" placeholder='Fullname: e.g John Mbadi' value={userDetails.fullname} onChange={(e)=>setuserDetails({...userDetails, fullname: e.target.value})} />
                <input type="email" placeholder='Email: e.g John@tasks.com' value={userDetails.email} onChange={(e)=> setuserDetails({...userDetails, email: e.target.value})} />
            </div>

            <div className={style.invitesDiv}>
                <div onClick={onClose} className={style.cancleInvite} >Cancel</div>
                <div className={style.inviteOkay} onClick={handleInvite}> {loading ? "Inviting..." : "Invite"}</div>
            </div>


            <div className={style.invitesWarning}> <strong>Note</strong> Users can create tasks within a project and assign them to other members.
            </div>
        </div>
    </div>
  )
}

export default InviteModal