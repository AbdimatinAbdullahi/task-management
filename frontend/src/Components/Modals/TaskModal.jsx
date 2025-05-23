import React, { useState, useEffect } from "react";
import style from '../../Styles/kanban.module.css'
import {UserPen, UserCheck} from 'lucide-react'
import Toastify from "./toastify";
import Select from 'react-select'
import axios from "axios";
import { useAuth } from "../../Contexts/AuthContext";


function TaskModal({ onClose, task, members, allUsers, updateDeleteTask, updateTask}) {

  // Function to return the date to the frmat that is expected by input date field
  function formatDate(dateObj) {
    if (!dateObj) return "";
    const date = new Date(dateObj?.$date || dateObj);
    if (isNaN(date)) return "";
    return date.toISOString().split("T")[0];
  }

  const {user} = useAuth()
  const [taskDetails, settaskDetails] = useState({
    task_name: task.task_name,
    status: task.status,
    due_date: formatDate(task.due_date) || "",
    start_date: formatDate(task.started_at) || "",
    priority: task.priority,
    description: task.task_notes,
    creation_date: task.created_at
  });
  const [loading, setloading] = useState(false)
  const [toggleSelect, setToggleSelect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [originalAssigned, setOriginalAssigned] = useState(
  Array.isArray(task.assigned_users) ? task.assigned_users : []
  );
  const [selectedMembers, setSelectedMembers] = useState(
  Array.isArray(task.assigned_users) ? task.assigned_users : []
  );
  const [toastifyOpen, setToastifyOpen] = useState(false)
  const [message, setMessage] = useState({
    message: "",
    borderColor: "",
    backgroundColor: ""
  })

  const originalMemberIds = Array.isArray(members)
    ? members.map((m) => m.id)
    : [];


  const hasChanged =
  selectedMembers.length !== originalAssigned.length ||
  !selectedMembers.every((id) => originalAssigned.includes(id));

  const displayMembers = members.slice(0, 2);
  const remainingMemlen = members.length - 2;

  const allUserOptions = allUsers.map((member)=>({
        value: member.id,
        label: member.fullname
  }));

  const updateTaskAssignes = async () => {
    const removedMembers = originalAssigned.filter(
      (id) => !selectedMembers.includes(id)
    );
    const addedMembers = selectedMembers.filter(
      (id) => !originalAssigned.includes(id)
    );

    setloading(true);
    setErrorMessage("");

    try {
      const addMemRs = await axios.patch(
        `http://127.0.0.1:5000/api/update_task_members/${task._id.$oid}`,
        { addedMembers, removedMembers }
      );

      if (addMemRs.status === 200) {
        // Update local state to match new server state
        setToggleSelect(false);
        setMessage({message: `Task members updated!`, borderColor: "green", backgroundColor: "rgb(69, 255, 91, 0.11)"})
        setToastifyOpen(true)
        
      } 
    } catch (error) {
      setMessage({message: `Members change failed!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
      setToastifyOpen(true)
      console.log("Error updating members : ", error);
    } finally {
      setloading(false);
    }
  };



  const handleTaskChange = (e) =>{
    const {name, value} = e.target;
    settaskDetails((prevTaskDetails)=>({
      ...prevTaskDetails,
      [name] : value
    }))
  }

  const tgSlct = ()=>{
    setToggleSelect(!toggleSelect)
    setSelectedMembers(members.map((m) => m.id))
  }

  const isPastDueDate = new Date(taskDetails.due_date) < new Date()
  const creationDate = task?.created_at
  ? new Date(task.created_at?.$date || task.created_at).toLocaleDateString(
      "en-US",
      { month: "long", day: "numeric" }
    )
  : "";



  // Function to change the name of Task:
  const handleTasknameChange = async (e) =>{
    if(taskDetails.task_name === task.task_name){
      return;
    }
    try {
      const tncRs = await axios.patch(`http://127.0.0.1:5000/api/update_task_name/${task._id.$oid}`, {"name" : taskDetails.task_name})
      if(tncRs.status === 200){
        setMessage({message: `Task name changed`, borderColor: "green", backgroundColor: "rgb(69, 255, 91, 0.11)"})
        setToastifyOpen(true)
        updateTask({...task, task_name: taskDetails.task_name})
      }
      else{
      setMessage({message: `Task name changed failed!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
      setToastifyOpen(true)
      }
    } catch (error) {
      setMessage({message: `Task name changed failed!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
      setToastifyOpen(true)
      console.log("Error while changing the task name: ", error)
    }
  };

  const handleTaskDescriptionChange = async(e) => {
    if(taskDetails.description == task.task_notes){
      return
    };

    try {
      const tdcRs = await axios.patch(`http://127.0.0.1:5000/api/update_task_description/${task._id.$oid}`, {"description" : taskDetails.description});
      if(tdcRs.status === 200){
        setMessage({message: "Task note changed successfully", borderColor: "green", backgroundColor: "rgb(69, 255, 91, 0.11)"})
        setToastifyOpen(true)
        updateTask({...task, task_notes: taskDetails.description})
      } else{
        setMessage({message: `Task description changed failed!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
        setToastifyOpen(true)
      }
    } catch (error) {
      setMessage({message: `Task description changed failed!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
      setToastifyOpen(true)
      console.log("Error while changing the task description: ", error)
    }
  };


  const handleTaskStatusChange = async(e) => {
    settaskDetails({...taskDetails, status: e.target.value})
    try {
      const tdcRs = await axios.patch(`http://127.0.0.1:5000/api/update_task_status/${task._id.$oid}`, {"status" : e.target.value});
      if(tdcRs.status === 200){
        setMessage({message: `Task status changed to ${e.target.value}`, borderColor: "green", backgroundColor: "rgb(69, 255, 91, 0.11)"})
        setToastifyOpen(true)
        updateTask((prev) => ({ ...prev, status: newStatus }));
      }
      else{
      setMessage({message: `Task status changed failed!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
      setToastifyOpen(true)
      }
    } catch (error) {
      setMessage({message: `Task status changed failed!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
      setToastifyOpen(true)
      console.log("Error while changing the task status: ", error)
    }
  };

  
  const handleTaskDatesChange = async(e) => {
    
    const { name, value} = e.target

    settaskDetails({...taskDetails, [name] : value})

    const updateFields = {};


    if(name === "start_date" && formatDate(value) !== formatDate(task.started_at) ){
      updateFields.start_date = new Date(value).getTime();
    };

    if(name === "due_date" && formatDate(value) !== formatDate(task.due_date)){
      updateFields.due_date = new Date(value).getTime();
    }

    if(Object.keys(updateFields).length === 0){
      return
    }

    console.log(updateFields)

    try {
      const tdtcRs = await axios.patch(`http://127.0.0.1:5000/api/update_task_date/${task._id.$oid}`, 
        updateFields,
        {headers: {
          "Authorization": `Bearer ${User.token}`
        }}
      );
      if(tdtcRs.status === 200){
        updateTask({
          ...task,
          due_date: name === "due_date" && value,
          started_at: name === "start_date" && value,
        })
        setMessage({message: `Task ${name} changed to ${value}`, borderColor: "green", backgroundColor: "rgb(69, 255, 91, 0.11)"})
        setToastifyOpen(true)
          }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setMessage({
          message: `You don't have permission to change the task dates!`,
          borderColor: "red",
          backgroundColor: "rgb(255, 200, 200)"
        });
        setToastifyOpen(true);
      } else {
        setMessage({
          message: `Failed to change task date.`,
          borderColor: "red",
          backgroundColor: "rgb(255, 200, 200)"
        });
        setToastifyOpen(true);
        console.log("Error while changing the task date: ", error);
      }
    }

  }

  const handleTaskDelete = async ()=>{
    setloading(true)
    try {
      const dtRs = await axios.put(`http://127.0.0.1:5000/api/delete_task/${task._id.$oid}`)
      if(dtRs.status == 200){
        alert(dtRs.data.task_id)
        updateDeleteTask(dtRs.data.task_id)
      }
    } catch (error) {
      if(error.status == 403){
        setMessage({message: `You dont have a permission to delete task!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
        setToastifyOpen(true)
      }
      setMessage({message: `Task deletion failed!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
      console.log("Error while deleting the task!", error)
    } finally{
      setloading(false)
    }
  }


  const handleCloseToast = () => {
    setMessage({message: "", borderColor: "", backgroundColor: ""})
    setToastifyOpen(false);
  };


  return (
    <div className={style.modalOverlay}>
      <div className={style.modalTaskContainer}>
        {toastifyOpen && <Toastify handleCloseToast={handleCloseToast} message={message} />}
          {errorMessage && <p className={style.error}> {errorMessage} </p>}
        {/* Task Name and Status Conatiner */}
        <div className={style.taskNameAndStatus}>
          <input type="text" name="task_name" value={taskDetails.task_name} onChange={handleTaskChange} onBlur={handleTasknameChange}/>
          <div className={style.taskStatus}>
            <select value={taskDetails.status} onChange={handleTaskStatusChange}>
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
                    name="start_date"
                    value={taskDetails.start_date ? taskDetails.start_date: ""} 
                    onChange={handleTaskDatesChange}
                  />
            </div>
            </div>

            {/* Due Date */}
            <div className={style.dueDate}>
              <div className={style.dueHeader}> Due Date</div>
              <div className={style.dueD}>
                <input 
                    type="date" 
                    name="due_date"
                    value={taskDetails.due_date ? taskDetails.due_date: ""} 
                    onChange={handleTaskDatesChange}
                    style={{color: isPastDueDate ? "red" : ""}}
                  />
            </div>
            </div>
          </div>
        </div>


        <div className={style.descriptionContainer}>
          <h2>Description</h2>
          <textarea
          name="description"
          type="text" value={taskDetails.description}
          onChange={handleTaskChange}
          onBlur={handleTaskDescriptionChange}
          />
        </div>

        <div className={style.assignesContainer}>
            {displayMembers.map((member)=> (
              <div className={style.assignedMember} title={member.fullname} >
                {member.fullname.slice(0,1).toUpperCase()}
              </div>
            ))}
            {remainingMemlen > 0 && (
              <div className={style.remainingMembersCount}>+{remainingMemlen}</div>
            )}

            {members.length < 6 && (
            <div className={style.addMemOrRemv}>
              <div className={style.closeSelect} onClick={tgSlct} >
                <UserPen /> <p> {toggleSelect ? "Close" : "Edit Users"} </p>
              </div>
              {
                hasChanged && (
                  <div className={style.updateTask} onClick={updateTaskAssignes} >
                      <UserCheck /> <p>Update Users</p>
                  </div>
                )
              }
            </div>
            )}

          {toggleSelect && (
            <Select
              options={allUserOptions}
              value={allUserOptions.filter(option => selectedMembers.includes(option.value))}
              onChange={selectedOptions => setSelectedMembers(selectedOptions.map(option => option.value))}
              isMulti
              className={style.selectAndDeselectUser}
            />
          )}
        </div>


        <div className={style.deleteTask} >
          <div className={style.closeModal}  onClick={onClose} > Close Modal </div>
          <div className={style.delete} onClick={handleTaskDelete} style={{ backgroundColor: loading ? "gray" :  "" }}>{loading ? "Deleting ..." : "Delete Task"}</div>
        </div>

      </div>
    </div>
  );
}

export default TaskModal;