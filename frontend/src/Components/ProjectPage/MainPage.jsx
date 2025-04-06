import React, { useState, useEffect } from 'react'
// import style from '../../Style/mainpage.module.css'
import style from '../../Styles/mainpage.module.css'
import { LayoutDashboard, FolderPlus, BadgePlus, BookmarkX } from  'lucide-react'


import Projects from './Projects'
import Dashboard from '../Forms/Dashboard/Dashboard'
import axios from 'axios'

const user_id = 8


function MainPage() {

    const [projects, setProjects] = useState([])
    const [activeComponent, setActiveComponent] = useState('dashboard')
    const [activeProject, setActiveProject] = useState(null)


    const [createModal, setCreateModal] = useState(false)
    const [loading, setLoading] = useState(false)


    useEffect(()=>{


        setLoading(true)
        const response = axios.get(`http://127.0.0.1:5000/api/projects/${user_id}`)
        .then((response)=>{
            setProjects(response.data.projects)
            console.log(response.data.projects)
        })
        .catch((error)=>{
            setError(error.message)
        })
        .finally(
            setLoading(false)
        )
    }, [])

    // Function to toggle between Projects and Dasboard Component
    const handleItemClick = (component) =>{
        setActiveComponent(component)

    }


    const handleProjectClick = (project)=>{
        setActiveProject(project)
        setActiveComponent("projects")
    }


    // If the component is changed to dashboard, the activeProject is set to null for purpose of styling
    useEffect(() => {
        if (activeComponent === "dashboard") {
            setActiveProject(null);
        }
    }, [activeComponent]); 



    const handleCreateProject = ()=>{
            setCreateModal(true)
    }

    const closeModal = ()=>{
        setCreateModal(false)
    }



  return (
    <div className={style.mainContainer} >

        {/* Container for bar */}
        <div className={style.barContainer}>
            <div className={style.barContainerHeader}>
                <h2>Simplify</h2>
            </div>

            {/* Simplify features container */}
            <div className={style.taskFeatures}>
                    <div  className={`${style.featureDashboard} ${activeComponent == "dashboard" && style.active}`}   onClick={() => handleItemClick("dashboard")} >
                        <LayoutDashboard color='#e68fde' />
                        Dashboard
                    </div>


                    <div  className={`${style.featureProjects}`} >
                                {/* Header for projects */}
                                <h4>Projects</h4>

                                {
                                projects.map((project) => (
                                    <div 
                                        className={`${style.projectTasks} ${activeProject?.project_id === project.project_id && style.active}`} 
                                        key={project.id} // Handle both cases (string or object)
                                        onClick={() => handleProjectClick(project)}
                                    >
                                        <div>{project.name}</div>
                                    </div>
                                ))
                            }
                    </div>

                    {/* Button to create project */}
                    <div className={style.createProject}  onClick={handleCreateProject}  >                    
                            <BadgePlus color="#e68fde" />
                            Create Project
                    </div>


            </div>

        </div>


        {/* Container to hold projects and Dashboard dynamicaly */}
        <div className={style.DashboardAndProjectsHolder}>
            {activeComponent == "projects" ? <Projects project={activeProject}/> : <Dashboard/> }
        </div>



    {
        createModal && <CreateProjectModal onClose={closeModal} projectLength={projects.length} user_id={user_id} />
    }

    </div>
  )



}



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



















export default MainPage