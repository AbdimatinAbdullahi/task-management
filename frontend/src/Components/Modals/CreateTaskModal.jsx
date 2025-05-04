import React, {useEffect, useState, } from "react"
import style from '../../Styles/kanban.module.css'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import {X} from 'lucide-react'
import { label } from "framer-motion/client"
import axios from "axios"



const animatedComponents = makeAnimated();


function CreateTaskModal({onClose, members, project, status, workspaceName}){


    const [newTask, setNewTask] = useState({
      task_name: "",
      prioity: "Low",
      description: "",
      start_date: null,
      due_date: null,
      status: status,
      assignees: []
    });

    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const project_name = ""

    const memberOptions = members.map((member)=>({
      value: member.id,
      label: member.fullname
    }));
    const priorityOptions = [
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "High", label: "High" }
    ]
  
    // Function to send the task to backend and create new one
    const handleCreateTask = async () => {
      // Validate input before setting loading state
      if (newTask.task_name === "" || newTask.description === "") {
        setErrorMessage("Provide both task name and task description");
        return;
      }

      try {
        const ctResponse = await axios.post('http://127.0.0.1:5000/api/create-task', { newTask, "project_id": project.id })
        console.log(ctResponse)
      } catch (error) {
        console.log(error)
      }
    };
    
    useEffect(()=>{
      console.log("Members from create task modal", members)
    }, [members])
  
    // Function to handle the task change
    const handleTaskChang = (e) => {
      setErrorMessage("")
      const { name, value } = e.target;
      setNewTask((prevTask) => ({
        ...prevTask,
        [name]: value,
      }));
    };    

    const handleTaskAssigneChange = (selectedOptions)=>{
      const assigneeIds = selectedOptions.map((option) => option.value);
      setNewTask((prevTask)=>({
        ...prevTask,
        assignees: assigneeIds
      }))
    };


    const handlePriortyChange = (selectedOption) => {
      setNewTask((prevTask) => ({
        ...prevTask,
        prioity: selectedOption.value, 
      }));
    };
    
  
    return (
      <div className={style.overlay}>
        <div className={style.modalContainer}>
            <div className={style.displayer}>
              <div className={style.taskOwner}> {workspaceName} / {project.name} / {status} </div>
              <X size={32} color="gray" onClick={onClose} className={style.Xf}/>
            </div>

            <div className={style.taskNameAndDescription}>
              <input type="text" value={newTask.task_name} name="task_name" onChange={handleTaskChang} placeholder="Task Name ..."/>
              <textarea value={newTask.description} name="description" onChange={handleTaskChang}  placeholder="Give more information and details of the task"/>
            </div>

            <div className={style.datesPriorityAndStatus}>
              <div className={style.startDate}>
                <label htmlFor="date">Start Date:</label>
                <input type="date" value={newTask.start_date || "" } onChange={handleTaskChang} name="start_date" />
              </div>

              <div className={style.endDate}>
                <label htmlFor="date">Start Date:</label>
                <input type="date" value={newTask.due_date || ""} onChange={handleTaskChang} name="due_date"/>
              </div>
              <div className={style.priorityCheck}>
              <label htmlFor="">Priority</label>
              <Select options={priorityOptions}
                    value={priorityOptions.find(opt => opt.value === newTask.prioity)} // Ensure the selected value is in sync
                    onChange={handlePriortyChange} // Handle the change
                    placeholder="Select priority"
                    styles={customStyles} // Use custom styles for consistency
                    components={animatedComponents} // Smooth animations
                    />
              </div>
            </div>

            <div className={style.assignessSelection}>
              <Select options={memberOptions} isMulti onChange={handleTaskAssigneChange} placeholder="Assign Team Members ..." components={animatedComponents} styles={customStyles}/>
            </div>

            <div className={style.frget}>
              <div onClick={handleCreateTask} >Create Task</div>
            </div>
            {errorMessage && <span className={style.error}> {errorMessage} </span>}
        </div>
      </div>
    )
  }

  const selectedColor = "rgb(227, 129, 240)"; // teal background
  const removeHoverColor = "#ff4d4f"; // red hover on remove
  const fontFamily = "'Fira Sans"; // change to any custom font
  
  const customStyles = {
    multiValue: (base) => ({
      ...base,
      backgroundColor: selectedColor,
      borderRadius: "6px",
      padding: "2px 6px",
      borderColor: "rgb(227, 129, 240)",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
      fontWeight: "600",
      fontFamily: fontFamily,
      fontSize: "0.85rem",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      cursor: "pointer",
      ":hover": {
        backgroundColor: removeHoverColor,
        color: "white",
      },
    }),
  };
    
export default CreateTaskModal  