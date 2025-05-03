import React, {useEffect, useState} from 'react'
import {FolderPlus, BookmarkX} from 'lucide-react'
import axios from 'axios'
import style from '../../Styles/mainpage.module.css'
import { projects } from '../../SampleAPI/projectandTasks'
function CreateProjectModal({ onClose, workspace_id }) {

    const [projectsData, setProjectsData] = useState({
        project_name : "",
        description: ""
    })
    const [errorMessage, seterrorMessage] = useState('')


    const handleCreate = (projectName)=>{
        if(projectsData.project_name === '' || projectsData.description === ""){
            seterrorMessage("Provide the project name  and description!")
            return
        }

        axios.post('http://127.0.0.1:5000/api/create-new-project', {"name": projectsData.project_name, "description": projectsData.description, "workspace_id":workspace_id})
        .then(response => console.log(response.data))
        .catch(error => console.log(error))
        .finally(() => onClose())
    }


    const handleChange = (e)=>{
        const {name, value} = e.target;
        setProjectsData((prevProjects)=>({
            ...prevProjects,
            [name] : value
        }))
    }

  return (
    <div className={style.modalOverlay}>
        <div className={style.modalContainer} onClick={(e)=> e.stopPropagation()} >
            {errorMessage && <div className={style.error} >{errorMessage}</div>}           
            {/* Header */}
            <div className={style.modalHeader}>
                Create Project
            </div>

            {/* Project name */}
            <div className={style.provisions}>
                <input type="text" placeholder='Enter project name' name='project_name' value={projectsData.project_name} onChange={handleChange} />
                <textarea placeholder='Enter the task description...' name='description' onChange={handleChange} value={projectsData.description}/> 
            </div>


            <div className={style.modalButtons}>
                <div className={style.createButton} onClick={handleCreate} > Create <FolderPlus size={32} /> </div>
                <div className={style.closeButton} onClick={onClose} > close <BookmarkX size={32} /> </div>
            </div>


        </div>
    </div>
  )
}


export default CreateProjectModal
