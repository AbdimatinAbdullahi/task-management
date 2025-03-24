import React, { useEffect, useState } from 'react'
import axios from 'axios'
import style from './project.module.css'
import {Calendar, SquareKanban} from 'lucide-react'
import KanbanView from '../Views/Kanban/KanbanView'
import CalenderView from '../Views/CalenderView/CalenderView'




function Projects({project}) {

  const [selectedView, setSelectedView] = useState("Kanban")

  return (
    <div className={style.projectContainer}>

      <div className={style.projectView}>
          <div className={`${style.kanban} ${selectedView === "Kanban" ? style.currentView: ""} `} onClick={() => setSelectedView("Kanban")} >
          <SquareKanban size={32} color="#e68fde" />
            Board
          </div>

          <div className={`${style.calender} ${selectedView === "Calender" ? style.currentView: ""} `} onClick={()=> setSelectedView("Calender")} >
            <Calendar color="#e68fde" size={32} />
            calender
          </div>
      </div>


      <div className={style.projectViewContainer}>
        <div className={style.projectDisplay}>
         {selectedView === "Kanban" && <KanbanView projectId={project._id.$oid} />}
         {selectedView === "Calender" && <CalenderView project={project} />}
        </div>

      </div>
    </div>
  )
}

export default Projects
