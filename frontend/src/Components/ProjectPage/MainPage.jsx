import React, { useState, useEffect } from 'react'
import style from './mainpage.module.css'
import { LayoutDashboard, FolderPlus, BadgePlus, BookmarkX } from  'lucide-react'


import Projects from './Projects'
import Dashboard from '../Dashboard/Dashboard'



// Mocking the projects collected from database
const projects = [
    {id: 1, name: "Customer Research"},
    {id: 2, name: "Application development"},
    {id: 3, name: "Website Design"}
]



function CreateProjectModal({ onClose }) {
    console.log('Opened')

    const [projectName, setProjectName] = useState('')
    const [errorMessage, seterrorMessage] = useState('')



    const handleCreate = (projectName)=>{
        if(projectName === ''){
            seterrorMessage("Provide the project name")
        }
        else{
            alert(projectName)
            onClose()
        }
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






function MainPage() {

    const [activeComponent, setActiveComponent] = useState('dashboard')
    const [activeProject, setActiveProject] = useState(null)
    const [createModal, setCreateModal] = useState(false)


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
                                    projects.map((project)=>(
                                        <div className={`${style.projectTasks} ${activeProject?.id == project.id && style.active} `} key={project.id} onClick={() => handleProjectClick(project)}>
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
        createModal && <CreateProjectModal onClose={closeModal} />
    }

    </div>
  )



}

export default MainPage