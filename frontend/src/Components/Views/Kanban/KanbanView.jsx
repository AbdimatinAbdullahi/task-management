import React, { useEffect, useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend, getEmptyImage } from 'react-dnd-html5-backend';
import style from '../../../Styles/kanban.module.css';
import CreateTaskModal from '../../Modals/CreateTaskModal';
import TaskItem from '../../ProjectPage/TaskItem';
import axios from 'axios';




function KanbanView({ projectId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]); // ← renamed
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("")
    axios.get(`http://127.0.0.1:5000/api/get_tasks/${projectId}`)
      .then((response) => {
        if (response.status === 200) {
          setTasks(response.data.tasks); // ← renamed
          console.log(response.data.tasks);
        } else if (response.status === 404) {
          setTasks([])
          setError(response?.message || "No tasks Found!");
        } else {
          setTasks([])
          setError("Something went wrong!");
        }
      })
      .catch((error) => {
        setTasks([]); // ← Also clear on request failure
        console.error("Error fetching tasks", error);
        setError(error.response.data.message || "No tasks Found");
      })
      .finally(() => setLoading(false));
  }, [projectId]);



  if (loading) return <p>Loading...</p>;
  if (error !== "") return <p>{error}</p>;
  if (!tasks || tasks.length === 0) return <p>No tasks found.</p>; // ← renamed


  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const updateTask = (updateTask) => {
    setTasks(prevTasks =>
      prevTasks.map((task) =>
        task._id.$oid === updateTask._id.$oid ? updateTask : task
      )
    );
  };

  const addNewTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]); // ← renamed
  };

  const removeDeletedTaskFromUI = (removedTask_id) => {
    setTasks(prevTasks =>
      prevTasks.filter((task) => task._id.$oid !== removedTask_id)
    );
  };

  return (
    <div className={style.kanbanContainer}>
      {isModalOpen && <CreateTaskModal onClose={handleCloseModal} projectId={projectId} />}
      <DndProvider backend={HTML5Backend}>
        {["To-do", "In Progress", "In Review", "Complete"].map((status) => (
          <DropZone
            key={status}
            status={status}
            projectId={projectId}
            tasks={tasks.filter((task) => task.status === status)} // ← renamed
            projectName={tasks[0]?.project_name} // ← renamed
            updateTask={updateTask}
            addNewTask={addNewTask}
            removeDeletedTaskFromUI={removeDeletedTaskFromUI}
          />
        ))}
      </DndProvider>
    </div>
  );
}


const DropZone = ({ status, tasks, projectId, projectName, updateTask, addNewTask, removeDeletedTaskFromUI }) => {
 
  const updateTaskStatus = async (task, newTaskStatus, taskId) => {
    if (task.status === newTaskStatus) return;
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/update_task_status/${taskId}`, { status: newTaskStatus });
      if (response.status === 200) {
        const updatedTask = { ...task, status: newTaskStatus };
        updateTask(updatedTask);
      }
    } catch (error) {
      console.error("Error while updating status", error);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => {
      updateTaskStatus(item, status, item._id.$oid);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));


  const [createTaskModal, setCreateTaskModal] = useState(false)

return (
    <div ref={drop} className={style.taskBoard} >
      <div className={style.addItem}>{status}</div>
      {tasks.map((task) => (
        <TaskItem 
          key={task._id.$oid} 
          task={task} 
          projectName={projectName} 
          projectId={projectId} 
          updateTaskStatus={updateTaskStatus} 
          updateTask={updateTask}
          removeDeletedTaskFromUI={removeDeletedTaskFromUI}
        />
      ))}
      <div className={style.createTask} onClick={()=> setCreateTaskModal(true)} >Add Task</div>

      {createTaskModal && 
        <CreateTask 
        onClose={()=>setCreateTaskModal(false)} 
        projectId={projectId} 
        initialStatus={status} 
        projectName={projectName}
        addNewTask={addNewTask}
        />
      }

    </div>
  );
};



function CreateTask({onClose, projectId, initialStatus, projectName, addNewTask}) {

  const [task, setTask] = useState({
    taskName: "",
    taskNotes: "",
    dueDate: null,
    startDate: null,
    priority: "Normal",
    status: initialStatus || "To-do"
  })
  const [error, setError] = useState("")

  // Handle input changes
  const handleTaskChange = (e) => {
    setError("")
    const { name, value } = e.target;
    // Update the task state based on the input name
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value, // Update the correct field in the task state
    }));
  };


  // Add task to the backend
  const addTask = async () => {
    setError("")
    if (task.taskName === "" || task.taskNotes === "") {
      setError("Task name and task notes cannot be empty");
      return;
    }

    try {
      const response = await axios.post(`http://127.0.0.1:5000/api/create_task`, { ...task, projectName, projectId});
      if(response.status == 200){
        console.log(response.data.task)
        addNewTask(response.data.task)
        alert("The task was added! 🎉")
        onClose()
      }
    } catch (error) {
      console.log(error);
      setError("Failed to create task, please try again.");
    }
  };

  return (
    <div className={style.overlay} >
      <div className={style.modalContainer}>
          <input type="text" value={task.taskName} name='taskName' onChange={handleTaskChange} placeholder='Enter the task name'/>
          {error && <p className={style.error}>{error}</p> }
          <textarea value={task.taskNotes} name='taskNotes' onChange={handleTaskChange} placeholder='Enter the task notes' />
          <input type="date" value={task.startDate} name='startDate' onChange={handleTaskChange} />
          <input type="date" value={task.dueDate} name='dueDate' onChange={handleTaskChange} />
          <select name='priority' value={task.priority}  onChange={handleTaskChange}>
            {["Normal", "High", "Medium"].map((priority)=>(
              <option value={priority}>{priority}</option>
            ))}
          </select>


          <select name="status" value={task.status} onChange={handleTaskChange} >
            {["In Progress", "In Review", "Complete", "To-do"].map((status)=>(
              <option value={status}> {status} </option>
            ))}
          </select>

        <button onClick={onClose} >Close the button</button>

        <button onClick={addTask}> Add Task </button>
      </div>
    </div>
  )
}




export default KanbanView;