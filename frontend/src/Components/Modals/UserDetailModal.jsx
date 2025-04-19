import React from 'react'
import style from "./modals.module.css"
import { Info, UserRoundX, X, Trash } from 'lucide-react'

const tasks = [
    {
      id: 1,
      taskName: "Debug user authentication components",
      projectName: "E-commerce Website",
      startDate: "2024-10-27",
      dueDate: "2024-12-24",
    },
    {
      id: 2,
      taskName: "Implement product recommendation engine",
      projectName: "E-commerce Website",
      startDate: "2024-11-01",
      dueDate: "2024-12-10",
    },
    {
      id: 3,
      taskName: "Design chatbot onboarding flow",
      projectName: "AI Chatbot Development",
      startDate: "2024-11-15",
      dueDate: "2024-12-05",
    }
  ];
  



function UserDetailModal({onClose}) {
  return (
    <div className={style.overlay}>
        <div className={style.userDetailContainer}>
            <div className={style.infoIcon}><Info /></div>

                <div className={style.userInfo}>
                    <div className={style.avatarInfo}> <UserRoundX /> </div>
                    <div className={style.userNamesInfo}> Abdimatin Abdi </div>
                    <div className={style.emailInfo}> abdimatinhassan@gmail.com </div>
                    <div className={style.totalAssignedTask}>30</div>
                </div>


            <div className={style.closeIcon} onClick={onClose} > <X strokeWidth={3} color='#AF2BC1'/> </div>

                <div className={style.taskItems} >
                    {tasks.map((task)=>(
                        <div className={style.taskItemsTwo} >
                            <div className={style.taskName}>
                                {task.taskName}
                            </div>
                        
                            <div className={style.projectName}>
                                {task.projectName}
                            </div>
                            
                            <div className={style.dates}>
                                <div className={style.startDate}>{task.startDate}</div>
                                <div className={style.dueDate}>{task.dueDate}</div>
                            </div>

                            <div className={style.userDelete}>
                               <Trash /> 
                            </div>
                        </div>
                    ))}
                </div>

                <button className={style.deleteUser}>Remove User</button>
        </div>
    </div>
  )
}

export default UserDetailModal