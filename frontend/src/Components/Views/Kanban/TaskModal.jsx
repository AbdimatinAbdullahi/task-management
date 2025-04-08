import React, { useState, useEffect } from "react";
import style from '../../../Styles/kanban.module.css';
import { X, FlagTriangleRight, Badge, Users, Calendar, Turtle } from 'lucide-react';
import axios from "axios";

function TaskModal({ onClose, task, formattedDate, projectName, projectId, updateTaskStatus, updateTask }) {
  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent click from reaching parent elements
  };

  const handleOverlayClick = () => {
    onClose(); // Close when clicking outside the modal
  };

  const [loading, setLoading] = useState(false);
  const [taskName, setTaskName] = useState(task.task_name);
  const [taskDescription, setTaskDescription] = useState(task.task_notes);
  const [status, setStatus] = useState(task.status);
  const [startDate, setStartDate] = useState(task.started_at);
  const [dueDate, setDueDate] = useState(task.due_date);
  const [error, setError] = useState("");
  const [priority, setPriority] = useState(task.priority);

  const updateTaskName = async () => {
    if (taskName.trim() === "" || taskName === task.task_name) return; // prevent empty updates
    setLoading(true);
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/update_task_name/${task._id.$oid}`, { task_name: taskName });
      if (response.status === 200) {
        const updatedTask = { ...task, task_name: taskName };
        updateTask(updatedTask);
        onClose();
      }
    } catch (error) {
      console.error("Error updating the task", error);
      setError("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskDates = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/update_task_dates/${task._id.$oid}`, { newStartDate: startDate, newDueDate: dueDate });
      if (response.status === 200) {
        const updatedTask = { ...task, started_at: startDate, due_date: dueDate };
        updateTask(updatedTask);
        onClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskPriority = async (newPriority) => {
    if (task.priority === newPriority) return;
    setLoading(true);
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/update_task_priority/${task._id.$oid}`, { priority: newPriority, projectId: projectId });
      if (response.status === 200) {
        const updatedTask = { ...task, priority: newPriority };
        updateTask(updatedTask);
        onClose();
      }
    } catch (error) {
      console.error("Error updating priority", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskNotes = async () => {
    if (task.task_notes === taskDescription) return;
    setLoading(true);
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/update_task_description/${task._id.$oid}`, { description: taskDescription });
      if (response.status === 200) {
        const updatedTask = { ...task, task_notes: taskDescription };
        updateTask(updatedTask);
        // onClose();
        alert("Changed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "To-do":
        return style.toDo;
      case "In Progress":
        return style.inProgress;
      case "In Review":
        return style.inReview;
      case 'Complete':
        return style.complete;
      default:
        return "";
    }
  };

  const getColoPriority = (priority) => {
    switch (priority) {
      case "Medium":
        return style.medium;
      case "Normal":
        return style.normal;
      case "High":
        return style.high;
      default:
        return "";
    }
  };

  return (
    <div className={style.modalOverlay} onClick={handleOverlayClick}>
      <div className={style.modalTaskContainer} onClick={handleModalClick}>
        <X color='#ba3bf3' size={50} strokeWidth={3.75} className={style.close} onClick={(e) => onClose()} />
        <div className={style.modalTaskName}>
          <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} onBlur={updateTaskName} />
        </div>
        <div className={style.modalTaskDescription}>
          <input type="text" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} className={style.task_description} onBlur={updateTaskNotes} />
        </div>
        <div className={style.taskModalPrir}>
          {/* Task Status Container */}
          <div className={style.itemGrids}>
            <div className={style.icons}> <Badge color='gray' size={40} /> </div>
            <div className={style.headerName}> <h3>Status</h3> </div>
            <div className={`${style.status} ${getStatusColor(status)}`}>
              <select className={`${style.customSelect}`} value={status} onChange={(e) => {
                const newStatus = e.target.value;
                setStatus(newStatus);
                updateTaskStatus(task, newStatus, task._id.$oid, onClose);
              }}>
                {["To-do", "In Progress", "In Review", "Complete"].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Assignees Container */}
          <div className={style.itemGrids}>
            <div className={style.icons}> <Users color='gray' size={40} /> </div>
            <div className={style.headerName}> <h3>Assignees</h3> </div>
            <div className={style.assignees}> Coming Soon! </div>
          </div>
          {/* Date Container */}
          <div className={style.itemGrids}>
            <div className={style.icons}> <Calendar color='gray' size={40} /> </div>
            <div className={style.headerName}> <h3>Dates</h3> </div>
            <div className={style.datesContainer}>
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
          <div className={style.itemGrids}>
            <div className={style.icons}> <FlagTriangleRight color='gray' size={40} /> </div>
            <div className={style.headerName}> <h3>Priority</h3> </div>
            <div className={style.status}>
              <select className={`${style.customSelect} ${getColoPriority(priority)}`} value={priority} onChange={(e) => {
                const newPriority = e.target.value;
                setPriority(newPriority);
                updateTaskPriority(newPriority);
              }}>
                {["High", "Normal", "Medium"].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;