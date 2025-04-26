import React, { useState, useEffect } from "react";
// import style from '../../../Styles/kanban.module.css';
import { X, FlagTriangleRight, Badge, Users, Calendar, Trash2 } from 'lucide-react';

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
  })

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalTaskContainer}>

        {/* Close Icon */}

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
              <div className={style.creationDateH}> {taskDetails.creation_date} </div>
            </div>

              {/* Status Container */}
            <div className={style.statusCont}>
              <div className={style.statHeader}> Status </div>
              <div className={style.statD}> {taskDetails.status} </div>
            </div>

            {/* Start Date */}
            <div className={style.startDate}>
              <div className={style.startHeader}> Start Date</div>
              <div className={style.startD}> {taskDetails.start_date}</div>
            </div>

            {/* Due Date */}
            <div className={style.dueDate}>
              <div className={style.dueHeader}> Due Date</div>
              <div className={style.dueD}> {taskDetails.due_date}</div>
            </div>
          </div>
        </div>


        <div className={style.descriptionContainer}>
          <h2>Description</h2>
          <textarea type="text" value={taskDetails.description} onChange={(e) =>  settaskDetails({...taskDetails, description: e.target.value})} />
        </div>

        <div className={style.assignesContainer}>
            {members.map((member)=> (
              <div className={style.assignedMember}>
                {member.email.slice(0, 2).toUpperCase()}
              </div>
            ))}
        </div>

        <div className={style.deleteTask} onClick={onClose} >
          Delete Task
        </div>

      </div>
    </div>
  );
}

export default TaskModal;