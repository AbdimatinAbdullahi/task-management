import {createContext, useContext, useState, useEffect} from 'react'
import axios from 'axios'


const TaskAndProjectContext = createContext()

export const TaskContext = ({Children}) =>{

    const [project, setProject] = useState([]) // know managed in Mainpage.jsx
    const [projectName, setProjectName] = useState("") // Manged in CreateProjectModal
    
    const [error, setError] = useState("")

    // This function will be used in Mainpage.jsx
    const fetchProject = async (user_id) => {
        const response = axios.get(`http://127.0.0.1:5000/api/projects/${user_id}`)
        .then((response)=>{
            setProject(response.data.projects)
        })
        .catch((error)=>{
            setError(error.message)
        })
        .finally(
            setLoading(false)
        )
    }

    return (
        <TaskAndProjectContext.Provider value={{project}}>

        </TaskAndProjectContext.Provider>
    )

}

