import React, {useState, useEffect} from "react";
import style from './kanban.module.css'


import {X, FlagTriangleRight, Badge, Users, Calendar, Turtle} from 'lucide-react'
import axios from "axios";



function TaskModal({ onClose, task, formattedDate, projectName, projectId }) {

    const handleModalClick = (e) => {
      e.stopPropagation(); // Prevent click from reaching parent elements
    };
  
    const handleOverlayClick = () => {
      onClose(); // Close when clicking outside the modal
    };
  

    const [taskName, setTaskName] = useState(task.task_name)
    const [taskDescription, setTaskDescription] = useState(task.task_notes)
    const [status, setStatus] = useState(task.status)
    const [startDate, setStartDate] = useState(
        task.started_at ? new Date(task.started_at.$date).toISOString().split("T")[0] : ""
      );
    const [dueDate, setDueDate] = useState(
        task.due_date ? new Date(task.due_date.$date).toISOString().split("T")[0] : ""
      );

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [priority, setPriority] = useState(task.priority)

    const updateTaskName = async () => {
        if (taskName.trim() === "" || taskName === task.task_name) return // prevent empty updates
        
        setLoading(true)

        try {
            const response = await axios.put(`http://127.0.0.1:5000/api/update_task_name/${task._id.$oid}`, {task_name: taskName, projectId: projectId});

            if(response.status === 200){
                onClose()
            }

        } catch (error) {
            console.error("Error upate the task", error)
            setError("Update Failed")   
        } finally {
            setLoading(false)
        }
    }


    const updateTaskStatus = async (e) => {
        if(task.status === status) return

        setLoading(true)
        try {
            const response = await axios.put(`http://127.0.0.1:5000/api/update_task_status/${task._id.$oid}`, {status: status,  projectId: projectId});
            if(response.status === 200){
                onClose()
            }

        } catch (error) {
            setError("Update Failed")
            console.error("Error while updating status", error)
        } finally {
            setLoading(false)
        }

    }


    const updateTaskDates = async(e)=>{


      if ((!startDate || startDate === (task.started_at ? new Date(task.started_at.$date).toISOString().split("T")[0] : "")) &&
      (!dueDate || dueDate === (task.due_date ? new Date(task.due_date.$date).toISOString().split("T")[0] : ""))) {
      return;
      }

      const payload = {
        startDate: startDate || null,
        dueDate: dueDate || null,
        projectId: projectId
      }

      setLoading(true)
      try {
        const response = await axios.put(`http://127.0.0.1:5000/api/update_task_dates/${task._id.$oid}`, {payload})
        if(response.status === 200){
          onClose()
        }
      } catch (error) {
        
      } finally {
        setLoading(false)
      }

    }

    const updateTaskPriority = async (e)=>{
      if(task.priority == priority) return

      setLoading(true)
      try {
        const response = await axios.put(`http://127.0.0.1:5000/api/update_task_priority/${task._id.$oid}`, {priority: priority, projectId: projectId})
        if(response.status === 200){
          onClose()
        }
      } catch (error) {
        
      } finally {
        setLoading(false)
      }
    }



  
    return (
      <div className={style.modalOverlay} onClick={handleOverlayClick}>
        <div className={style.modalTaskContainer} onClick={handleModalClick}>
            
            <X color='#ba3bf3' size={50} strokeWidth={3.75} className={style.close} onClick={(e) => onClose()} />
  
            <div className={style.modalTaskName}>
              <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} onBlur={updateTaskName}  />
            </div>
  
            <div className={style.modalTaskDescription}>
              <input type="text" value={taskDescription} onChange={(e)=> setTaskDescription(e.target.value)} className={style.task_description} />
            </div>
  
        <div className={style.taskModalPrir}>
  

           {/* Task Status Container  */}
          <div className={style.itemGrids} >
            <div className={style.icons}> <Badge color='gray' size={40} /> </div>
            <div className={style.headerName}> <h3>Status</h3>   </div>
            <div className={style.status}>
                   <select className={style.status}  value={status} onChange={(e) => setStatus(e.target.value)} onBlur={updateTaskStatus} >
                        {["To-do", "In Progress", "In Review", "Complete"].map((option) => (  <option key={option} value={option}> {option} </option>))}
                    </select>
                </div>
          </div>
  
          
          {/* Assignees Container */}
          <div className={style.itemGrids}>
            <div className={style.icons}> <Users color='gray' size={40}/></div>
            <div className={style.headerName}> <h3>Assinees</h3> </div>
            <div className={style.assignees}> Coming Soon!</div>
          </div>
  

        {/* Date Container */}
          <div className={style.itemGrids}>
            <div className={style.icons}> <Calendar color='gray'  size={40}/></div>
            <div className={style.headerName}> <h3>Dates</h3>   </div>
            <div className={style.format}> 
              <input
                type="date"
                className={style.datePicker}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onBlur={updateTaskDates}
              />
              -
              <input
                type="date"
                className={style.datePicker}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onBlur={updateTaskDates}
              />
            </div>
          </div>
  
        {/* Priority Container */}
          <div className={style.itemGrids} > 
            <div className={style.icons}> <FlagTriangleRight color='gray' size={40} /></div>
            <div className={style.headerName}> <h3>Priority</h3>   </div>
            <div className={style.format}>                    
                <select className={style.priority}  value={priority} onChange={(e) => setPriority(e.target.value)} onBlur={updateTaskPriority}>
                        {["High", "Normal", "Medium"].map((option) => (  <option key={option} value={option}> {option} </option>))}
                </select>
                </div>
          </div>
          
        </div>
  
        </div>
      </div>
    );
  }

export default TaskModal