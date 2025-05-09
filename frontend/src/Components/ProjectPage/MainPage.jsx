import React, { useEffect, useState } from 'react'
import { House, Mail, BadgePlus, UserPlus, Plus, Calendar } from 'lucide-react'
import style from '../../Styles/mainpage.module.css'
import { useSearchParams } from 'react-router-dom'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider, useDrag, useDrop } from 'react-dnd'

import CreateProjectModal from '../Modals/CreateProjectModal'
import CreateTaskModal from '../Modals/CreateTaskModal' //Add Task Modal
import DeleteProjectModal from '../Modals/DeleteProjectModal'
import InviteModal from '../Modals/InviteModal'
import TaskModal from '../Modals/TaskModal'

import { getProjectTasks, getUserWorkspace, getWorkspaceMembers, getWorkspaceProjects, projects, tasks } from '../../SampleAPI/projectandTasks'
import axios from 'axios'
import { useAuth } from '../../Contexts/AuthContext'


function MainPage() {
  const [searchParams] = useSearchParams()
  const user_id = searchParams.get("id")

  const [workspace, setWorkspace] = useState(null)
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [workspaceMembers, setWorkspaceMembers] = useState([])
  const { user, logout } = useAuth()
  useEffect(() => {
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

  useEffect(()=>{
    console.log("Workspace: ", workspace)
    console.log("Workspace projects: ", projects)
  },[workspace, workspaceMembers, projects])


  return (
    <div className={style.mainPageContainer}>
      <div className={style.leftBar}>
        <Bar projects={projects} workspace={workspace} setSelectedProject={setSelectedProject} user={user} />
      </div>

      <div className={style.mainBarContainer}>
        <ProjectContainer selectedProject={selectedProject} workspace={workspace} members={workspaceMembers} userId={user_id} />
      </div>
    </div>
  )
}

function Bar({ projects, workspace, setSelectedProject, user }) {
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
          <div className={style.createProject} onClick={()=> setCreateProjectModalOpen(true)} >
            <BadgePlus /> Create Project
          </div>
          {createProjectModalOpen && <CreateProjectModal onClose={()=> setCreateProjectModalOpen(false)} workspace_id={workspace.id} user={user}/>}
          <div className={style.deleteProject} onClick={()=>setDeleteProjectModalOpen(true)} >
            Delete Project
          </div>
          {deleteProjectModalOpen && <DeleteProjectModal onClose={()=> setDeleteProjectModalOpen(false)} />}

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


function DropZone({status, tasks, members, selectedProject, workspace_name}){

  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false)


  const [{isOver}, drop] = useDrop(()=>({
    accept: "TASK",
    drop: (item)=>{
        console.log(item)
    },
    collect: (monitor)=>({
      isOver: !!monitor.isOver()
    }),
  }))
  
  return (
    <div ref={drop} className={style.taskBoard}>
      <div className={style.taskBoardsHeader}>
          {status}
          <Plus size={32} color='gray' cursor="pointer" onClick={()=> setAddTaskModalOpen(true)}/>
      </div>
      {addTaskModalOpen && <CreateTaskModal onClose={()=> setAddTaskModalOpen(false)} members={members} project={selectedProject} status={status} workspaceName={workspace_name}/>}
      {tasks.map((task)=> (
        <TaskItem 
          key={task.id}
          task={task}
          projectId={task.project_id}
          members={members}
        />
      ))}
    </div>
  )
}

function TaskItem({ task, projectId, members }){

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskMemebers, setTaskMemebers] = useState([])

  const [{isDragging}, drag] = useDrag(()=>({
    type: "TASK",
    item: {...tasks},
    collect: (monitor)=>({
      isDragging: !!monitor.isDragging()
    })
  }));


  useEffect(() => {
    if (task.assigned_users) {
      const assigned = members.filter((member) => task.assigned_users.includes(member.id));
      setTaskMemebers(assigned);
    }
  }, [task, members]);


  useEffect(()=>{
    console.log("Task Memebers: ", taskMemebers)

  },[taskMemebers])

  const isPastDate = new Date(task.due_date) < new Date()
  const taskDueDate = task ? new Date(task.due_date.$date || task.due_date).toLocaleDateString("en-US", { month: "long", day: "numeric" }) : ""
  

  return(
    <>
    <div className={style.taskItems} key={drag} onClick={()=> setTaskModalOpen(true)} >
          <div className={style.tasksDetails}>
            <div className={style.priority}>{task.priority}</div>
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
    {taskModalOpen && <TaskModal task={task} onClose={()=> setTaskModalOpen(false)} members={taskMemebers} allUsers={members}/>}
    </>
  )
}

export default MainPage
