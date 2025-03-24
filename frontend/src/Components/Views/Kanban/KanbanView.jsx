import React, { useEffect, useState } from 'react'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {DndProvider, useDrag, useDrop} from 'react-dnd'
import {Plus, Flag, X} from 'lucide-react'


import style from '../Kanban/kanban.module.css'
import CreateTaskModal from './CreateTaskModal';
import axios from 'axios'


function KanbanView({projectId}) {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [project, setProject] = useState(null)

    useEffect(()=>{
      setLoading(true)
          const response = axios.get(`http://127.0.0.1:5000/api/get_project/${projectId}`)
          .then((response) => {
            setProject(response.data.project)
            console.log(response.data.project)
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

    console.log(project)

  return (
    <div className={style.kanbanContainer}>

      {isModalOpen && <CreateTaskModal onclose={handleCloseModal}  />}

      <DndProvider backend={HTML5Backend} >
        {["To-do", "In Progress", "In Review", "Complete"].map((status)=>(
          <DropZone key={status} status={status} projectId={projectId} tasks={project.tasks.filter((task)=> task.status === status)} projectName={project.name} />
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

      {tasks.map((task)=>(<TaskItem task={task} projectName={projectName}/>))}

    </div>
  )
}






const TaskItem = ({task, projectName})=>{

  const [taskModalOpen, setTaskModalOpen] = useState(false)

  const [{isDragging}, drag] = useDrag(()=>({
      type: "TASK",
      item: {taskName: task.task_name},
      collect: (monitor)=>({
        isDragging: !!monitor.isDragging()
      }),
  }));


    const formattedDate = (dateObj) => {
      if (!dateObj || !dateObj.$date) {
          return "";
      }
  
      const date = new Date(dateObj.$date);
      return isNaN(date.getTime()) ? "INVALID FORMAT" : date.toLocaleDateString();
  };
  

    const getPriorityColor = (priority)=>{
      switch(priority.toLowerCase()){
        case 'normal':
          return "#11c229";
        case 'medium':
          return '#e9e613';
        case "high":
          return 'red';
        default:
          return "gray";
      }
    }


    const handleTaskClick = () =>{
      setTaskModalOpen(true)
    }

    const handleModalClose = ()=>{
      setTaskModalOpen(false)
    }


    return (
      <div ref={drag} className={style.taskItem} onClick={handleTaskClick} >
        {taskModalOpen && <TaskModal onClose={handleModalClose} task={task} formattedDate={formattedDate} />}
        <div className={style.taskProject}>
          {projectName}
        </div>
        

        <div className={style.taskName}>
          {task.task_name}
        </div>

        <div className={style.taskNote}>
          {task.task_notes}
        </div>

      <div className={style.taskProperty}>
          <div className={style.taskDates}>{formattedDate(task.started_at)}- {formattedDate(task.due_date)}</div>
          <div className={style.taskPriority}> <Flag color={getPriorityColor(task.priority)} absoluteStrokeWidth /> {task.priority} </div>
      </div>

      </div>
    )

}



function TaskModal({ onClose, task, formattedDate }) {


  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent click from reaching parent elements
  };

  const handleOverlayClick = () => {
    onClose(); // Close when clicking outside the modal
  };

  useEffect(()=>{
    console.log(task)
  },[])

  const [taskName, setTaskName] = useState(task.task_name)
  const [taskDescription, setTaskDescription] = useState(task.task_notes)
  const [status, setStatus] = useState(task.status)

  return (
    <div className={style.modalOverlay} onClick={handleOverlayClick}>
      <div className={style.modalTaskContainer} onClick={handleModalClick}>
        <X color='purple' size={40} strokeWidth={5.75} className={style.close} onClick={(e) => onClose()} />
        <input type="text" value={task.task_name} onChange={(e) => setTaskName(e.target.value)}  className={style.modalTaskName} />
        <input type="text" value={task.task_notes} onChange={(e)=> setTaskDescription(e.target.value)} className={style.task_description} />

      <div className={style.taskModalPrir}>
        <div className={style.status} > {task.status} </div>
        <div className={style.assigne}> Coming soon! </div>
        <div className={style.dates}> {formattedDate(task.started_at)} - {formattedDate(task.due_date)} </div>

      </div>

      </div>
    </div>
  );
}



export default KanbanView