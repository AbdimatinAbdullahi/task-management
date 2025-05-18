import React, { useEffect, useState } from 'react'
import { House, BadgePlus, UserPlus, Plus, Calendar, SquareX, TrainFrontTunnel} from 'lucide-react'
import style from '../../Styles/mainpage.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider, useDrag, useDrop } from 'react-dnd'

import CreateProjectModal from '../Modals/CreateProjectModal'
import DeleteProjectModal from '../Modals/DeleteProjectModal'
import CreateTaskModal from '../Modals/CreateTaskModal' //Add Task Modal
import { useAuth } from '../../Contexts/AuthContext'
import InviteModal from '../Modals/InviteModal'
import TaskModal from '../Modals/TaskModal'
import axios from 'axios'
import Dashboard from './Dashboard'


function MainPage() {
  const [searchParams] = useSearchParams()
  const user_id = searchParams.get("id")

  const [workspace, setWorkspace] = useState(null)
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [workspaceMembers, setWorkspaceMembers] = useState([])
  const [dashboardOpen, setDashboardOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()


  useEffect(() => {
    // Fetch the workspace Data When user logins: Using the user to fetch => Workspace and 
    // in return using workspace to fetch the projects that belongs to workspace
    const fetchWorkspaceData = async () => {
      if (user_id) {
        try {
          const wsRes = await axios.get(`http://127.0.0.1:5000/api/get_workspace_data/${user_id}`)
          setWorkspace(wsRes.data.workspace_data)
          
            const wsmRs = await axios.get(`http://127.0.0.1:5000/api/get-workspace_members`, {
              params: { id: wsRes.data.workspace_data.id }
            })
            setWorkspaceMembers(wsmRs.data.members)
          const fetchedProjects = wsRes.data.projects
          setProjects(fetchedProjects)
            // Set the first project as the selected one by default
          if (fetchedProjects && fetchedProjects.length > 0) {
              setSelectedProject(fetchedProjects[0])
          }
        } catch (error) {
          console.error("Error fetching workspace or projects:", error)
        }
      }
    }
    fetchWorkspaceData()
  }, [user_id])

  const updateAddedProject = (project) => {
    setProjects(prevProjects => {
      const updated = [...prevProjects, project]
      if (prevProjects.length === 0) {
        setSelectedProject(project)
      }
      return updated
    })
  }


  const updateDeletedProject = (id) =>{
    const filteredProjects = projects.filter((project) => project.id !== id)
    setProjects(filteredProjects)
    if(selectedProject?.id === id){
      if(filteredProjects.length > 0){
        setSelectedProject(filteredProjects[0])
      } else{
        setSelectedProject(null)
      }
    }
  }


  const handleDashboardOpenAndClose = ()=>{
    setDashboardOpen(!dashboardOpen)
  }

  return (
    <div className={style.mainPageContainer}>
      <div className={style.leftBar}>
        <Bar 
        projects={projects} 
        workspace={workspace} 
        setSelectedProject={setSelectedProject} 
        user={user} 
        updateAddedProject={updateAddedProject} 
        updateDeletedProject={updateDeletedProject}  
        project={selectedProject} 
        setDashboardOpen={setDashboardOpen}
        handleDashboardOpenAndClose={handleDashboardOpenAndClose}
        />
      </div>

      <div className={style.mainBarContainer}>
          { dashboardOpen ? 
                  <Dashboard/> 
                  : 
                  <ProjectContainer 
                    selectedProject={selectedProject}
                    workspace={workspace} 
                    members={workspaceMembers}
                    userId={user_id}
                    />}
      </div>
    </div>
  )
}

function Bar({ projects, workspace, setSelectedProject, user, updateAddedProject, updateDeletedProject, project, setDashboardOpen, handleDashboardOpenAndClose}) {
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false)
  const [deleteProjectModalOpen, setDeleteProjectModalOpen] = useState(false)
  const { logout } = useAuth()
  return (
    <div className={style.barContainer}>
        <div className={style.logout} onClick={logout}>Logout</div>
      <div className={style.logoContainer}>
        <div className={style.logo}></div>
        <div className={style.companyName}>SIMPLIFY</div>
      </div>

      <div className={style.companyDashboard}>
        <div className={style.workspaceName}>
          {workspace ? workspace.name : "Loading Workspace..."}
        </div>

        <div className={style.workspaceItems}>
          <div className={style.dashboard} onClick={handleDashboardOpenAndClose} >
            <House size={34} /> Dashboard
          </div>
        </div>

        <div className={style.projectsItems}>
          <div className={style.headerName}>Projects</div>
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                className={style.project}
                onClick={() =>{ 
                  setSelectedProject(project)
                  setDashboardOpen(false)
                }} // Click to select project
              >
                {project.name}
              </div>
            ))
          ) : (
            <div className={style.noProjAvail} >No projects available</div>
          )}
          <div className={style.createProject} onClick={()=> setCreateProjectModalOpen(true)} >
            <BadgePlus /> Create Project
          </div>
          {createProjectModalOpen &&
            <CreateProjectModal 
                onClose={()=> setCreateProjectModalOpen(false)} 
                workspace_id={workspace.id}
                user={user}
                updateAddedProject={updateAddedProject}
                />}

          <div className={style.deleteProject} onClick={()=>setDeleteProjectModalOpen(true)} >
            Delete Project
          </div>
          {deleteProjectModalOpen && projects.length > 0 && 
                <DeleteProjectModal 
                onClose={()=> setDeleteProjectModalOpen(false)}
                project={project}
                updateDeletedProject={updateDeletedProject}
                />
          }

        </div>
      </div>
    </div>
  )
}

function ProjectContainer({ selectedProject, workspace, members, userId }) {
  const [tasks, setTasks] = useState([])
  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false)
  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedProject || !selectedProject.id) {
        console.warn("Selected project is undefined or missing ID")
        return
      }
  
      try {  
        const tskRes = await axios.get(`http://127.0.0.1:5000/api/get_tasks/${selectedProject.id}`)
        setTasks(tskRes.data.tasks)
      } catch (error) {
        console.error("Failed to fetch project tasks:", error)
      }
    }
  
    fetchTasks()
  }, [selectedProject])

  const formatedDate = selectedProject ? 
    new Date(selectedProject.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

    const updateAddTask = (task)=>{
      setTasks(prevTasks => [...prevTasks, task])
    }

    const updateDeleteTask = (task_id) =>{
      setTasks(prevTasks => prevTasks.filter((task) => task.id !== task_id))
    }

    
    const updateTask = (updatedTask) => {
      setTasks(prevTasks =>
        prevTasks.map((tsk) =>
          tsk._id === updatedTask._id ? { ...tsk, ...updatedTask } : tsk
        )
      );
    };

  return (
    <div className={style.projectManager}>
      {selectedProject ? (
        <>
            <div className={style.projectDetails}>
              <div className={style.projectHeader}> {workspace.name} / {selectedProject.name} </div>
              <div className={style.projectDescription}> {selectedProject.description} </div>
              <div className={style.projectAddsOn}>
                <div className={style.projectStartDate}> Created On: <strong style={{color: "black"}}>{formatedDate}</strong> </div>
                <div className={style.projectStatus}> <div className={style.status}>In Progress</div> </div>
                <div className={style.inviteUserToWorkspace} onClick={()=> setInviteUserModalOpen(true)} > <UserPlus /> Invite </div>
              </div>
            </div>

            {inviteUserModalOpen && <InviteModal onClose={()=> setInviteUserModalOpen(false)} userId={userId} workspace={workspace} />}

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
                        members={members}
                        selectedProject={selectedProject}
                        workspace_name={workspace.name}
                        updateAddTask={updateAddTask}
                        updateDeleteTask={updateDeleteTask}
                        updateTask={updateTask}
                      />
                    ))
                  }
                </DndProvider>
              </div>
            </div>
        </>
      ) : (
        <div className={style.noProjAvailMain} >
          <div className={style.notAvail}>
            <SquareX size={50} />
            <p>No Project Available</p>
          </div>
        </div>
      )}
    </div>
  )
}


function DropZone({status, tasks, members, selectedProject, workspace_name, updateAddTask, updateDeleteTask, updateTask}){

  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false)


  const [{isOver}, drop] = useDrop(()=>({
    accept: "TASK",
    drop: (item)=>{
        console.log("Dropped item:", item);
        updateTask({...item, status:status})
    },
    collect: (monitor)=>({
      isOver: !!monitor.isOver()
    }),
  }))

  const getColor = (status) => {
    switch (status) {
      case "In Progress":
        return "#AF2BC1";
      case "To-do":
        return "red";
      case "Done":
        return "#2bc133";
      default:
        return "gray";
    }
  };

  return (
    <div ref={drop} className={style.taskBoard}>
      <div className={style.taskBoardsHeader} style={{ color: getColor(status), borderBottomColor: getColor(status) }} >
          {status}
          <Plus size={32} color={getColor(status)} cursor="pointer" onClick={()=> setAddTaskModalOpen(true)} />
      </div>
      {addTaskModalOpen && <CreateTaskModal onClose={()=> setAddTaskModalOpen(false)} members={members} project={selectedProject} status={status} workspaceName={workspace_name} updateAddTask={updateAddTask}/>}
      {tasks.map((task)=> (
        <TaskItem 
          key={task.id}
          task={task}
          projectId={task.project_id}
          members={members}
          updateDeleteTask={updateDeleteTask}
          updateAddTask={updateAddTask}
          updateTask={updateTask}
          getColor={getColor}
        />
      ))}
    </div>
  )
}

function TaskItem({ task, projectId, members, updateDeleteTask, updateTask, getColor}){

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskMemebers, setTaskMemebers] = useState([])

  const [{isDragging}, drag] = useDrag(()=>({
    type: "TASK",
    item: {...task},
    collect: (monitor)=>({
      isDragging: !!monitor.isDragging()
    })
  }));


  useEffect(() => {
    if (Array.isArray(task.assigned_users)) {
      const assigned = members.filter((member) => task.assigned_users.includes(member.id));
      setTaskMemebers(assigned);
    } else {
      setTaskMemebers([]);
    }
  }, [task, members]);

  let taskDueDate = ''
  let isPastDate = false

  if (task.due_date) {
    const rawDate = task.due_date?.$date || task.due_date
    const parsedDate = new Date(rawDate)
    taskDueDate = parsedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    isPastDate = parsedDate < new Date()
  }


  const getPriorityColor = (priority)=>{
    switch (priority) {
      case "High":
        return "#fc2c4e"
      case "Low":
        return "#cff3a1"
      case "Medium":
        return "#f28dee"    
      default:
        return ""
    }
  }

  return(
    <>
    <div className={style.taskItems} ref={drag} onClick={()=> setTaskModalOpen(true)} style={{borderColor: getColor(task.status)}} >
          <div className={style.tasksDetails}>
            <div className={style.priority} style={{backgroundColor: getPriorityColor(task.priority)}} >{task.priority}</div>
            <div className={style.taskName}> {task.task_name} </div>
            <div className={style.taskNote}>{task.task_notes}</div>
          </div>
          <div className={style.membersPlusDate}>
            <div className={style.members}>
                {taskMemebers.map((member) => <div className={style.member} key={member.id} title={member.fullname} > 
                  {member.fullname.slice(0, 1).toUpperCase()}
                </div> )}
            </div>
            <div className={style.dueDate} title='Due Date' style={{ color: isPastDate ? "red" : "" }} >
                  <Calendar />
                  {taskDueDate}
            </div>
          </div>
    </div>
    {taskModalOpen && <TaskModal 
      task={task} 
      onClose={()=> setTaskModalOpen(false)} 
      members={taskMemebers} 
      allUsers={members} 
      updateDeleteTask={updateDeleteTask}
      updateTask={updateTask}
      />}
    </>
  )
}

export default MainPage
