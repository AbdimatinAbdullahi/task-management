import React, {useEffect, useState} from 'react'
import {FolderPlus, BookmarkX} from 'lucide-react'
import axios from 'axios'
import style from '../../Styles/mainpage.module.css'
function CreateProjectModal({ onClose }) {

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
        <div className={style.modalContainer} onClick={(e)=> e.stopPropagation()} >

            {/* Header */}
            <div className={style.modalHeader}>
                Create Project
            </div>

            {/* Project name */}
            <div className={style.provisions}>
                <input type="text" placeholder='Enter project name' value={projectName} onChange={(e)=> handleChange(e)} />
                {errorMessage && <div className={style.error} >{errorMessage}</div>} 
                <textarea placeholder='Enter the task description...' /> 
            </div>


            <div className={style.modalButtons}>
                <div className={style.createButton} > Create <FolderPlus size={32} /> </div>
                <div className={style.closeButton} onClick={onClose} > close <BookmarkX size={32} /> </div>
            </div>


        </div>
    </div>
  )
}


export default CreateProjectModal
