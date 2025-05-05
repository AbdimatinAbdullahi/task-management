import React, {useState} from 'react'
import style from '../Modals/modals.module.css'
import axios from 'axios'
import Select from 'react-select'

function InviteModal({onClose, project_id, workspace, userId}) {

    const [userDetails, setuserDetails] = useState({ fullname: "", email: "", role: "member"});
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
         
            const response = await axios.post(`http://127.0.0.1:5000/api/invites_users`, { email: userDetails.email, username: userDetails.fullname, userId, "wsId": workspace.id, "wsName": workspace.name })
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

    const role = [
        {label : "admin", value: "admin"},
        {label : "member", value: "member"}
    ]

    const handleRoleChange = (selectedOptions) =>{
        setuserDetails((prevDetails)=>({
            ...prevDetails,
            role: selectedOptions.value
        }))
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
                <Select
                options={role}
                value={role.find(opt => opt.value === userDetails.role)}
                onChange={handleRoleChange} 
                />
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