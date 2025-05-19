import React, {useEffect, useState} from 'react'
import {FolderPlus, BookmarkX} from 'lucide-react'
import axios from 'axios'
import style from '../../Styles/mainpage.module.css'
import Toastify from './toastify'

function CreateProjectModal({ onClose, workspace_id, user, updateAddedProject }) {

    const [projectsData, setProjectsData] = useState({
        project_name : "",
        description: ""
    })
    const [errorMessage, seterrorMessage] = useState('')
    const [message, setMessage] = useState({
        message: "",
        borderColor: "",
        backgroundColor: ""
    });
    const [toastifyOpen, setToastifyOpen] = useState(false)

    const handleCreate = async () => {
        if(projectsData.project_name === '' || projectsData.description === ""){
            seterrorMessage("Provide the project name  and description!")
            return
        }
        try {
            const pcrRs = await axios.post('http://127.0.0.1:5000/api/create-new-project', 
                {"name": projectsData.project_name, "description": projectsData.description, "workspace_id":workspace_id},
                { headers: 
                    {
                    "Authorization" : `Bearer ${user.token}`
                    }
                }
             )

            if(pcrRs.status == 200){
                updateAddedProject(pcrRs.data.project)
                onClose()
            }
        } catch (error) {
            if(error.status == 403){
                setMessage({message: `You dont have permission to create a project!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
                setToastifyOpen(true)
            }
            setMessage({message: `Project creation failed!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
            setToastifyOpen(true)
            console.log(error)
        }
    }


    const handleChange = (e)=>{
        const {name, value} = e.target;
        setProjectsData((prevProjects)=>({
            ...prevProjects,
            [name] : value
        }))
    };

    const handleCloseToast = ()=>{
        setMessage({message: "", borderColor: "", backgroundColor: ""})
        setToastifyOpen(false)
    }

  return (
    <div className={style.modalOverlay}>
        <div className={style.modalContainer} onClick={(e)=> e.stopPropagation()} >
            {toastifyOpen && <Toastify handleCloseToast={handleCloseToast} message={message} />}
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
