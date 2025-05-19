import React, {useState} from 'react'
import style from '../Modals/modals.module.css'
import axios from 'axios'
import { useAuth } from '../../Contexts/AuthContext'
import Toastify from './toastify'
function DeleteProjectModal({project, onClose, updateDeletedProject}) {

  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [toastifyOpen, setToastifyOpen] = useState(false)
  const [message, setMessage] = useState({
    message: "",
    backgroundColor: "",
    borderColor: ""
  })
  const {user} = useAuth()

  const handleDeleteProject = async ()=>{
    setErrorMessage("")
    setLoading(true)
    try {
      const dtpRes = await axios.delete(`http://127.0.0.1:5000/api/delete-project/${project.id}`,
        {
          headers: {
            "Authorization" : `Bearer ${user.token}`
          }
        }
      )
      if(dtpRes.status == 200){
        updateDeletedProject(dtpRes.data.id)
        onClose()
      } else if(dtpRes.status === 403){
        setMessage({message: `You dont have a permission to delete project!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
        setToastifyOpen(true)
      }
    } catch (error) {

      if(error.status == 403){
        setMessage({message: `You dont have a permission to delete project!`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
        setToastifyOpen(true)
      } else{
        setMessage({message: `Something went wrong while deleting project`, borderColor: "red", backgroundColor: "rgb(255, 200, 200)"})
        setToastifyOpen(true)
      }
      console.error(error);
    } finally{
      setLoading(false)
    }
  }


  const handleCloseToast = ()=>{
    setToastifyOpen(false)
  }

  return (
    <div className={style.overlay}>
        <div className={style.modalContainer}>
            {toastifyOpen && <Toastify message={message} handleCloseToast={handleCloseToast}  />}
          <div className={style.modalDeleteHeader}>
            Customer Research
          </div>

          <div className={style.deleteWarning}>
            <div className={style.warningHeader}>Warning</div>
            <div className={style.warningText}>Deleting <strong>{project.name}</strong> is a permanent action and cannot be undone. You will lose all progress associated with the project. All tasks, their properties, and related data will be permanently removed. All users associated with the project will lose access, and any project-specific settings will be deleted.</div>
          </div>

          <div className={style.actionButton}>
            <button id={style.cancel} onClick={onClose} disabled={loading}>Cancel</button>
            <button onClick={handleDeleteProject} disabled={loading} style={{ backgroundColor: loading ? "gray" : "" }} >  
              {loading ? "Deleting ..." : "Delete" }
            </button>
          </div>
        </div>
    </div>
  )
}

export default DeleteProjectModal