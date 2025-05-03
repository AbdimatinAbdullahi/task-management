import React from 'react'
import style from '../Modals/modals.module.css'
function DeleteProjectModal({projectId, projectName, onClose}) {
  return (
    <div className={style.overlay}>
        <div className={style.modalContainer} onClick={(e) => e.stopPropagation()} >

          <div className={style.modalDeleteHeader}>
            Customer Research
          </div>

          <div className={style.deleteWarning}>
            <div className={style.warningHeader}>Warning</div>
            <div className={style.warningText}>Deleting <strong>{projectName}</strong> is a permanent action and cannot be undone. You will lose all progress associated with the project. All tasks, their properties, and related data will be permanently removed. All users associated with the project will lose access, and any project-specific settings will be deleted.</div>
          </div>

          <div className={style.actionButton}>
            <button id={style.cancel} onClick={onClose}>Cancel</button>
            <button>Delete</button>
          </div>
        </div>
    </div>
  )
}

export default DeleteProjectModal