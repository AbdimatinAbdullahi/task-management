import React, {useEffect, useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import style from '../../Styles/Style.module.css'
import axios from 'axios'
function CreateWorkspace() {
    const location = useLocation()
    const navigate = useNavigate()
    const [workspaceName, setWorkspaceName] = useState("")
    const queryParams = new URLSearchParams(location.search)

    const owner_id = queryParams.get("owner_id")

    const createWorkspace = async()=>{
        alert(`${owner_id} ${workspaceName} `)
        try {
            const response = await axios.post(`http://127.0.0.1:5000/api/create-workspace`, {owner_id: owner_id, name: workspaceName })
            if (response.status == 200){
                navigate('/workspace')
            }
        } catch (error) {
            console.log(error.data.error)   
        }
    }

  return (
    <div className={style.createWorkspace} >
        <div className={style.createWorkspaceForm}>
            <label>Workspace Name</label>
            <input type="text" placeholder='Enter name of workspace' value={workspaceName} onChange={(e)=> setWorkspaceName(e.target.value)} />
            <button onClick={createWorkspace} >Create workspace</button>
        </div>
    </div>
  )
}

export default CreateWorkspace