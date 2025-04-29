import React, {useEffect, useState, } from "react"
import style from '../../Styles/kanban.module.css'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import {X} from 'lucide-react'
import { label } from "framer-motion/client"



const animatedComponents = makeAnimated();


function CreateTaskModal({onClose, members}){


    const [newTask, setNewTask] = useState({
      name: "",
      prioity: "Low",
      description: "",
      start_date: null,
      due_date: null,
      assignees: []
    });

    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const project_name = ""
  
    const priorities = ["Low", "Medium", "High"]


    const memberOptions = members.map((member)=>({
      value: member.id,
      label: member.fullname
    }));

    const priorityOptions = [
      { value: "Low", label: "Low" },
      { value: "Urgent", label: "Urgent" },
      { value: "Normal", label: "Normal" }
    ]
  
    // Function to send the task to backend and create new one
    const handleCreateTask = async () => {
      // Validate input before setting loading state
      if (newTask.name === "" || newTask.description === "") {
        setErrorMessage("Provide both task name and task description");
        return;
      }
    };
    
    useEffect(()=>{
      console.log("Members from create task modal", members)
    }, [members])
  
    // Function to handle the task change
    const handleTaskChang = (e)=>{
      const { name, value } = e.target;
      setTask((prevTask) => ({
        ...prevTask,
        [name]: value,
      }));
    }

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
              <div className={style.taskOwner}> ACME Inc. / Customer Reserach / In Progress </div>
              <X size={32} color="gray" onClick={onClose}/>
            </div>

            <div className={style.taskNameAndDescription}>
              <input type="text" value={newTask.name} onChange={handleTaskChang} />
              <textarea value={newTask.description}  onChange={handleTaskChang}  />
            </div>

            <div className={style.datesPriorityAndStatus}>
              <input type="date" value={newTask.start_date || "" } onChange={handleTaskChang}  />
              <input type="date" value={newTask.due_date || ""} onChange={handleTaskChang} />
              <Select options={priorityOptions}
                    value={priorityOptions.find(opt => opt.value === newTask.prioity)} // Ensure the selected value is in sync
                    onChange={handlePriortyChange} // Handle the change
                    placeholder="Select priority"
                    styles={customStyles} // Use custom styles for consistency
                    components={animatedComponents} // Smooth animations
                    />
            </div>

            <div className={style.assignessSelection}>
              <Select options={memberOptions} isMulti onChange={handleTaskAssigneChange} placeholder="Assign Team Members ..." components={animatedComponents} styles={customStyles}/>
            </div>

            <div className={style.createTaskButton}>
              <button>Create Task</button>
            </div>

            

        </div>
      </div>
    )
  }
  



  const selectedColor = "rgb(227, 129, 240)"; // teal background
  const removeHoverColor = "#ff4d4f"; // red hover on remove
  const fontFamily = "'Fira Sans, sans-serif"; // change to any custom font
  
  const customStyles = {
    multiValue: (base) => ({
      ...base,
      backgroundColor: selectedColor,
      borderRadius: "6px",
      padding: "2px 6px",
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