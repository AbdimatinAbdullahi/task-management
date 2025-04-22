import React, {useEffect, useState} from 'react'
import axios from 'axios'

function CreateProjectModal({ onClose, projectLength, user_id}) {

    const [projectName, setProjectName] = useState('')
    const [errorMessage, seterrorMessage] = useState('')


    const handleCreate = (projectName)=>{
        if(projectName === ''){
            seterrorMessage("Provide the project name")
            return
        }

        if(projectLength == 3){
            seterrorMessage("You can only create a maximum of 3 projects")
            return
        }

        axios.post('http://127.0.0.1:5000/api/create-new-project', {"name": projectName, "user_id": user_id})
        .then(response => console.log(response.data))
        .catch(error => console.log(error))
        .finally(() => onClose())
        
    }


    const handleChange = (e)=>{
        seterrorMessage("")
        setProjectName(e.target.value)
    }

  return (
    <div className={style.modalOverlay}>
        <div className={style.modalContainer}>

            {/* Header */}
            <div className={style.modalHeader}>
                Create Project
            </div>

            {/* Project name */}
            <div className={style.projectName}>
                <input type="text" placeholder='Enter project name' value={projectName} onChange={(e)=> handleChange(e)} />
                {errorMessage && <div className={style.error} >{errorMessage}</div>}  
            </div>


            <div className={style.buttons}>
                <div className={style.createButton} onClick={()=> handleCreate(projectName)} > Create <FolderPlus size={32} color="#af2bc1f3" /> </div>
                <div className={style.closeButton} onClick={onClose} > close <BookmarkX size={32} color="#af2bc1f3" /> </div>
            </div>


        </div>
    </div>
  )
}


export default CreateProjectModal
