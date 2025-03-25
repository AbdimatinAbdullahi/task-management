import React, {useState, useEffect} from "react";
import { useDrag } from "react-dnd";
import {Flag} from 'lucide-react'



import style from '../Kanban/kanban.module.css'
import TaskModal from './TaskModal'


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
        
        {taskModalOpen && <TaskModal
          onClose={handleModalClose}
          task={task} 
          formattedDate={formattedDate}
          projectName={projectName}
          />
        }


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

export default TaskItem