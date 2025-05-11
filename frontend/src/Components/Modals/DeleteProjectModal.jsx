import React, {useState} from 'react'
import style from '../Modals/modals.module.css'
import axios from 'axios'
function DeleteProjectModal({project, onClose, updateDeletedProject}) {

  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleDeleteProject = async ()=>{
    setErrorMessage("")
    setLoading(true)
    try {
      const dtpRes = await axios.delete(`http://127.0.0.1:5000/api/delete-project/${project.id}`)
      if(dtpRes.status == 200){
        updateDeletedProject(dtpRes.data.id)
        onClose()
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Something went wrong while deleting project");
      console.error(error);
    } finally{
      setLoading(false)
    }
  }

  return (
    <div className={style.overlay}>
        <div className={style.modalContainer} onClick={(e) => e.stopPropagation()} >

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