import React, {useState, useEffect} from "react";
import style from './kanban.module.css'


import {X, FlagTriangleRight, Badge, Users, Calendar} from 'lucide-react'



function TaskModal({ onClose, task, formattedDate, projectName }) {

    const handleModalClick = (e) => {
      e.stopPropagation(); // Prevent click from reaching parent elements
    };
  
    const handleOverlayClick = () => {
      onClose(); // Close when clicking outside the modal
    };
  
  
    const [taskName, setTaskName] = useState(task.task_name)
    const [taskDescription, setTaskDescription] = useState(task.task_notes)
    const [status, setStatus] = useState(task.status)
  
  
    return (
      <div className={style.modalOverlay} onClick={handleOverlayClick}>
        <div className={style.modalTaskContainer} onClick={handleModalClick}>
            
            <X color='#ba3bf3' size={50} strokeWidth={3.75} className={style.close} onClick={(e) => onClose()} />
  
            <div className={style.modalTaskName}>
              <input type="text" value={task.task_name} onChange={(e)=> setTaskName(e.target.value)} />
            </div>
  
            <div className={style.modalTaskDescription}>
              <input type="text" value={task.task_notes} onChange={(e)=> setTaskDescription(e.target.value)} className={style.task_description} />
            </div>
  
        <div className={style.taskModalPrir}>
  
  
          <div className={style.itemGrids} >
            <div className={style.icons}> <Badge color='gray' size={40} /> </div>
            <div className={style.headerName}> <h3>Status</h3>   </div>
            <div className={style.status}> {task.status} </div>
          </div>
  
          
          <div className={style.itemGrids}>
            <div className={style.icons}> <Users color='gray' size={40}/></div>
            <div className={style.headerName}> <h3>Assinees</h3> </div>
            <div className={style.assignees}> Coming Soon!</div>
          </div>
  
          <div className={style.itemGrids}>
            <div className={style.icons}> <Calendar color='gray'  size={40}/></div>
            <div className={style.headerName}> <h3>Dates</h3>   </div>
            <div className={style.format}> {formattedDate(task.started_at)} - {formattedDate(task.due_date)}</div>
          </div>
  
          <div className={style.itemGrids} > 
            <div className={style.icons}> <FlagTriangleRight color='gray' size={40} /></div>
            <div className={style.headerName}> <h3>Priority</h3>   </div>
            <div className={style.format}> {task.priority}</div>
          </div>
          
        </div>
  
        </div>
      </div>
    );
  }

export default TaskModal