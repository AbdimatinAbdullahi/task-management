import React, { useEffect, useState } from 'react'
import {DndProvider,  useDrop} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'



import style from '../../../Styles/kanban.module.css'

import CreateTaskModal from './CreateTaskModal';
import TaskItem from './TaskItem'

import axios from 'axios'


function KanbanView({projectId}) {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [project, setProject] = useState(null)

    useEffect(()=>{
      console.log(projectId)
      setLoading(true)
          const response = axios.get(`http://127.0.0.1:5000/api/get_tasks/${projectId}`)
          .then((response) => {
            setProject(response.data.project)
            console.log(response.data)
          }
          )
          .catch((error)=> ( console.error("Error fetching project", error)))
          .finally(()=>  setLoading(false))
    }, [projectId])



    if (loading) return <p>Loading...</p>;
    if (!project) return <p>No project found.</p>;

    const handleModalOpen = () =>{
      setIsModalOpen(true)
    }

    const handleCloseModal = ()=>{
      setIsModalOpen(false)
    }


  return (
    <div className={style.kanbanContainer}>

      {isModalOpen && <CreateTaskModal onclose={handleCloseModal}  />}

      <DndProvider backend={HTML5Backend} >
        {["To-do", "In Progress", "In Review", "Complete"].map((status, index)=>(
          <DropZone key={status} status={status} projectId={projectId} tasks={project.filter((task)=> task.status === status)} projectName={project[0].project_name} />
        ))}
      </DndProvider>

    </div>
  )
}






const DropZone = ({status, tasks, projectId, projectName})=>{
  
  const [{isOver}, drop] = useDrop(()=>({
    accept: "TASK",
    drop: (item) => console.log(`Task ${item.task_name} moved to ${status}`),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={style.taskBoard} style={{ width: "25%", height: "100%", overflowY: "scroll"}}>

      <div className={style.addItem}>{status} </div>

      {tasks.map((task)=>(<TaskItem task={task} projectName={projectName} projectId={projectId}/>))}

    </div>
  )
}



export default KanbanView