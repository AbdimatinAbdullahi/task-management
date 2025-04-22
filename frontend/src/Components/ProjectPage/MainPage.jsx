import React, { useEffect, useState } from 'react'
import { House, Mail, BadgePlus, UserPlus, Plus } from 'lucide-react'
import style from '../../Styles/mainpage.module.css'
import { useSearchParams } from 'react-router-dom'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { getProjectTasks, getUserWorkspace, getWorkspaceMembers, getWorkspaceProjects, projects, tasks } from '../../SampleAPI/projectandTasks'
import axios from 'axios'
import { div } from 'framer-motion/client'

function MainPage() {
  const [searchParams] = useSearchParams()
  const user_id = searchParams.get("id")

  const [workspace, setWorkspace] = useState(null)
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (user_id) {
        try {
          const wsRes = await getUserWorkspace(user_id)
          setWorkspace(wsRes)

          if (wsRes) {
            const wsProjects = await getWorkspaceProjects(wsRes.id)
            setProjects(wsProjects)

            // Set the first project as the selected one by default
            if (wsProjects && wsProjects.length > 0) {
              setSelectedProject(wsProjects[0])
            }
          }
        } catch (error) {
          console.error("Error fetching workspace or projects:", error)
        }
      }
    }

    fetchWorkspaceData()
  }, [user_id])


  return (
    <div className={style.mainPageContainer}>
      <div className={style.leftBar}>
        <Bar projects={projects} workspace={workspace} setSelectedProject={setSelectedProject} />
      </div>

      <div className={style.mainBarContainer}>
        <ProjectContainer selectedProject={selectedProject} workspace={workspace}/>
      </div>
    </div>
  )
}

function Bar({ projects, workspace, setSelectedProject }) {
  return (
    <div className={style.barContainer}>
      <div className={style.logoContainer}>
        <div className={style.logo}></div>
        <div className={style.companyName}>SIMPLIFY</div>
      </div>

      <div className={style.companyDashboard}>
        <div className={style.workspaceName}>
          {workspace ? workspace.name : "Loading Workspace..."}
        </div>

        <div className={style.workspaceItems}>
          <div className={style.dashboard}>
            <House size={34} /> Dashboard
          </div>
          <div className={style.inbox}>
            <Mail size={34} /> Inbox
          </div>
        </div>

        <div className={style.projectsItems}>
          <div className={style.headerName}>Projects</div>
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                className={style.project}
                onClick={() => setSelectedProject(project)} // Click to select project
              >
                {project.name}
              </div>
            ))
          ) : (
            <div>No projects available</div>
          )}
          <div className={style.createProject}>
            <BadgePlus /> Create Project
          </div>
          <div className={style.deleteProject}>Delete Project</div>
        </div>
      </div>
    </div>
  )
}

function ProjectContainer({ selectedProject, workspace }) {
  const [tasks, setTasks] = useState([])
  useEffect(() => {
    const fetchTasks = async ()=>{
      try {
        const tskRes = await getProjectTasks(selectedProject.id)
        if(tskRes){
          setTasks(tskRes)
        }

      } catch (error) {
        
      }
    }
    fetchTasks()
  }, [selectedProject])

  return (
    <div className={style.projectManager}>
      {selectedProject ? (
        <>
            <div className={style.projectDetails}>
              <div className={style.projectHeader}> {workspace.name} / {selectedProject.name} </div>
              <div className={style.projectDescription}> {selectedProject.description} </div>
              <div className={style.projectAddsOn}>
                <div className={style.projectStartDate}> Created On: <strong style={{color: "black"}}>May 26, 2025</strong> </div>
                <div className={style.projectStatus}> status: <div className={style.status}>In Progress</div> </div>
              </div>
              <div className={style.inviteUserToWorkspace}> <UserPlus /> Invite </div>
            </div>

            <div className={style.taskView}>
            <div className={style.kanbanBoard}>
                <DndProvider backend={HTML5Backend}>
                  {
                    ["To-do", "In Progress", "Done"].map((status)=>(
                      <DropZone  
                        key={status}
                        status={status}
                        projectId={selectedProject.id}
                        tasks={tasks.filter((task) => task.status === status)}
                      />
                    ))
                  }
                </DndProvider>
              </div>
            </div>
        </>
      ) : (
        <p>No project selected.</p>
      )}
    </div>
  )
}


function DropZone({status, tasks, projectId}){

  const [{isOver}, drop] = useDrop(()=>({
    accept: "TASK",
    drop: (item)=>{
        console.log(item)
    },
    collect: (monitor)=>({
      isOver: !!monitor.isOver()
    }),
  }))

  useEffect(()=>{
    console.log(tasks)
  },[])
  
  return (
    <div ref={drop} className={style.taskBoard}>
      <div className={style.taskBoardsHeader}>
          {status}
          <Plus size={32} color='gray' cursor="pointer"/>
      </div>
      {tasks.map((task)=> (
        <TaskItem 
          key={task.id}
          task={task}
          projectId={task.project_id}
        />
      ))}
    </div>
  )
}

function TaskItem({ task, projectId }){

  const [{isDragging}, drag] = useDrag(()=>({
    type: "TASK",
    item: {...tasks},
    collect: (monitor)=>({
      isDragging: !!monitor.isDragging()
    })
  }));

  return(
    <div className={style.taskItems} key={drag} >
          {task.name}
    </div>
  )
}

export default MainPage
