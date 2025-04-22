import React, {useState, } from "react"
// import style from '../Kanban/kanban.module.css'
import style from '../../../Styles/kanban.module.css'

import {CheckCheck, CircleX} from 'lucide-react'
function CreateTaskModal({onclose}){

    const [taskName, settaskName] = useState('')
    const [selectedCategory, setSelectedCategory] = useState("Low")
    const [taskDescription, setTaskDescription] = useState("")
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const project_name = ""
  
    const categories = ["Low", "Medium", "High"]
  
    // Function to handle Select category
    const handleSelectedChange = (e) =>{
      setSelectedCategory(e.target.value)
    }
  
    // Function to send the task to backend and create new one
    const handleCreateTask = async () => {
      // Validate input before setting loading state
      if (taskName === "" || taskDescription === "") {
        setErrorMessage("Provide both task name and task description");
        return;
      }
    
      setLoading(true); // Set loading after validation
    
      try {
        const response = await axios.post("http://127.0.0.1:5000/api/create-task", {
          taskName,
          taskDescription,
          startDate,
          endDate,
          selectedCategory,
        });
        
        console.log(response.data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false); // Ensure loading is turned off after request completes
      }
    };
    
  
    // Function to handle the task change
    const handleTaskNameChange = (e)=>{
      settaskName(e.target.value)
      setErrorMessage("")
    }
  
  
    return (
      <div className={style.overlay}>
        <div className={style.modalContainer}>
            {errorMessage && <p className={style.error} >{errorMessage}</p>}
  
            {/* Input container */}
            <div className={style.inputContainer}>
              <input type="text" placeholder='Enter the task name'  value={taskName} onChange={handleTaskNameChange}/>
            </div>
  
  
            {/* Category selection */}
            <div className={style.selectCategory}>
              <select value={selectedCategory} onChange={handleSelectedChange} >
                {categories.map((category)=>(
                  <option value={category} key={category} >{category}</option>
                ))}
              </select>
            </div>
            
  
            {/* Task Description */}
            <div className={style.taskDescription}>
              <textarea onChange={(e)=> setTaskDescription(e.target.value)} placeholder='Enter description of task' ></textarea>
            </div>
  
  
  
            {/* Date picker */}
            <div className={style.datePicker}>
              <div className={style.startDate}>
                select start date
                <input type="date" onChange={(e)=> setStartDate(e.target.value)} value={startDate} />
              </div>
              <div className={style.endDate}>
              select End date
              <input type="date" onChange={(e)=> setEndDate(e.target.value)} value={endDate} />
  
              </div>
            </div>
  
  
  
            {/* Buttons */}
            <div className={style.buttons}>
              <div className={style.createButton} onClick={handleCreateTask} >
                {loading ? (
                  <>
                    <Loader size={32} color='#c328b3' />  CreatingTask...                
                  </>
                ) : (
                  <>
                    <CheckCheck color='#c328b3' size={32}  /> Create Task
                  </>
                )}
                </div>
              <div className={style.closeButton} onClick={onclose}>
                 <CircleX size={32} color="#c328b3" /> 
                 close
                 </div>
            </div>
  
  
        </div>
      </div>
    )
  }
  
export default CreateTaskModal  