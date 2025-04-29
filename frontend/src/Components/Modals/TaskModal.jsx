import React, { useState, useEffect } from "react";
import {Calendar} from 'lucide-react'
import style from '../../Styles/kanban.module.css'


function TaskModal({ onClose, task, members }) {

  const [taskDetails, settaskDetails] = useState({
    task_name: task.task_name,
    status: task.status,
    due_date: task.due_date,
    start_date: task.started_at,
    priority: task.priority,
    description: task.task_notes,
    creation_date: task.created_at
  });

  const isPastDueDate = new Date(taskDetails.due_date) < new Date()
  const formattedDueDate = taskDetails ? new Date(task.due_date).toLocaleDateString('en-US', { month: "long", day: "numeric" }) : ""
  const formatedStartDate = taskDetails.start_date ? new Date(task.started_at).toLocaleDateString('en-US', {month: "long", day: "numeric"}): ""
  const creationDate = taskDetails ? new Date(task.created_at).toLocaleDateString('en-US', {month: "long", day: "numeric"}): ""



  return (
    <div className={style.modalOverlay}>
      <div className={style.modalTaskContainer}>

        {/* Task Name and Status Conatiner */}
        <div className={style.taskNameAndStatus}>
          <input type="text" value={taskDetails.task_name} onChange={(e)=> settaskDetails({...taskDetails, task_name: e.target.value})}/>
          <div className={style.taskStatus}>
            <select value={taskDetails.status} onChange={(e) => settaskDetails({...taskDetails, status: e.target.value})} >
              { ["To-do", "In Progress", "Done"].map((status)=> (
                <option value={status} key={status} > {status} </option>
              )) }
            </select>
          </div>
        </div>


        {/* Dates Details Box */}
        <div className={style.dateDetailBox}>
          <div className={style.detailHeader}>Details</div>
          <div className={style.boxDetails}>
            {/* Creation container */}
            <div className={style.creationDate}>
              <div className={style.creationHeader}> Created On</div>
              <div className={style.creationDateH}> {creationDate} </div>
            </div>

              {/* Status Container */}
            <div className={style.statusCont}>
              <div className={style.statHeader}> Status </div>
              <div className={style.statD}> {taskDetails.status} </div>
            </div>

            {/* Start Date */}
            <div className={style.dueDate}>
              <div className={style.dueHeader}> Start Date</div>
              <div className={style.dueD}>
                <input 
                    type="date" 
                    value={taskDetails.start_date ? taskDetails.start_date.substring(0, 10) : ""} 
                    onChange={(e) => settaskDetails({ ...taskDetails, start_date: e.target.value })} 
                    placeholder="Start Date"
                  />
            </div>
            </div>

            {/* Due Date */}
            <div className={style.dueDate}>
              <div className={style.dueHeader}> Due Date</div>
              <div className={style.dueD}>
                <input 
                    type="date" 
                    value={taskDetails.due_date ? taskDetails.due_date.substring(0, 10) : ""} 
                    onChange={(e) => settaskDetails({ ...taskDetails, due_date: e.target.value })} 
                    style={{color: isPastDueDate ? "red" : ""}}
                  />
            </div>
            </div>
          </div>
        </div>


        <div className={style.descriptionContainer}>
          <h2>Description</h2>
          <textarea type="text" value={taskDetails.description} onChange={(e) =>  settaskDetails({...taskDetails, description: e.target.value})} />
        </div>

        <div className={style.assignesContainer}>
            {members.map((member)=> (
              <div className={style.assignedMember} title={member.fullname} >
                {member.email.slice(0,1).toUpperCase()}
              </div>
            ))}
        </div>

        <div className={style.deleteTask} >
          <div className={style.closeModal}  onClick={onClose} > Close Modal </div>
          <div className={style.delete}>Delete Task</div>
        </div>

      </div>
    </div>
  );
}

export default TaskModal;