import React, { useEffect } from 'react'
import style from './project.module.css'




function Projects({project}) {


  return (
    <div className={style.projectContainer}  >

    {/* 😂 Given names to this div containers is harder than even the Coding */}
      <div className={style.projectsAddsOn}>

        <div className={style.projectUserExperienceImprover}>Hello</div>

        <div className={style.projectTracker}> Hello</div>

      </div>

    {/* 🎉 Features for this project - (Kanban View) => Later will isolate it!*/} 
      <div className={style.projectViewContainer}>
        <div className={style.projectView}>
          Project View Container
        </div>
        <div className={style.projectDisplay}>
          Project Displays
        </div>
      </div>


    </div>
  )
}

export default Projects
