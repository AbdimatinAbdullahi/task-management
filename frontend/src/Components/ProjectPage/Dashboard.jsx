import React, { startTransition, useEffect , useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import {useAuth} from '../../Contexts/AuthContext'
// import {Dot} from 'lucide-react'
import axios from 'axios'


import style from './dashboard.module.css'
import {Trash2 } from 'lucide-react'

function Dashboard() {

    const  { user } = useAuth()
    const [searchParams] = useSearchParams()
    const user_id = searchParams.get("id")
    const [loading, setloading] = useState(false)
    const [dashboardData, setDashboardData] = useState(null)

    useEffect(()=>{
        const fetchDashboardData = async ()=>{
            setloading(true)
            try {
                const dshRs = await axios.get(`http://127.0.0.1:5000/api/dashboard`, {
                    params: {user_id}
                })
                if(dshRs.status !== 200){
                    alert("Something went wrong! ")
                }else{
                    console.log(dshRs.data)
                    setDashboardData(dshRs.data)
                }
            } catch (error) {
                console.log("Error from dashboard :" , error)
            } finally{
                setloading(false)
            }
        }
        fetchDashboardData()
    }, [user_id])


    useEffect(()=>{
        console.log("Dashboard data:", dashboardData)
    }, [dashboardData])

    // <span> {dashboardData.data.project_summary.in_progress_tasks_numbers} | {(dashboardData.data.project_summary.in_progress_tasks_numbers / dashboardData.data.project_summary.total_number_of_tasks ) * 100 } %</span>




        const toDoPercent = (dashboardData?.data?.project_summary?.to_do_tasks_numbers / dashboardData?.data?.project_summary.total_number_of_tasks) * 100
        const inProgressPercent = (dashboardData?.data?.project_summary?.in_progress_tasks_numbers / dashboardData?.data?.project_summary.total_number_of_tasks) * 100
        const donePercent = (dashboardData?.data?.project_summary?.done_task_numbers / dashboardData?.data?.project_summary.total_number_of_tasks) * 100
        console.log("To do : ", toDoPercent)
        console.log("Inprogress : ",  inProgressPercent)
        console.log(" Done : ", donePercent)
    
  return (
    <div className={style.dashboardContainer}>
        <div className={style.threeQuaterContainer}>
            <div className={style.rdQrt}>
                <div className={style.allProjectsData}>
                    <div className={style.unassignedTasks}>
                        <div className={style.headerrsrdR}>
                            <div className={style.dot} />
                            <span>Unassigned</span>
                        </div>
                        <div className={style.dataTwo}>
                            <p>{dashboardData?.data?.project_summary?.unassigned_tasks_numbers ?? 0}</p> <span>Tasks</span>
                        </div>
                    </div>
                    <div className={style.inProgressData}>
                        <div className={style.headerrsrdR}>
                            <div className={style.dot} />
                            <span>In Progress</span>
                        </div>
                        <div className={style.dataTwo}>
                            <p>{dashboardData?.data?.project_summary?.in_progress_tasks_numbers ?? 0}</p> <span>Tasks</span>
                        </div>                        
                    </div>
                    <div className={style.doneData}> 
                        <div className={style.headerrsrdR}>
                           <div className={style.dot} />
                            <span>Complete</span>
                        </div>
                        <div className={style.dataTwo}>
                            <p>{dashboardData?.data?.project_summary?.done_task_numbers ?? 0}</p> <span>Tasks</span>
                        </div>   
                    </div>
                </div>
                <div className={style.assignesByTaskAndAllAddignes}>
                    <div className={style.assignessByTask}>
                        <div className={style.headerTwoAssAndMem}>
                            Tasks by Assignees
                        </div>
                        <div className={style.tasksByAssignees}>
                            {dashboardData?.data?.members.map((member)=>(
                                <div className={style.tasksByMem}>
                                    <div className={style.tasksMem}>
                                        {member.fullname}
                                    </div>
                                    <div className={style.taskNum}>
                                    { dashboardData?.data?.tasks.filter((task) => task.assigned_users.includes(member.member_id)).length}
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                    </div>
                    <div className={style.allAssigness}>
                        <div className={style.headerTwoAssAndMem}>
                            Workspace Members
                        </div>
                        <div className={style.allAssigneesForWorkspace}>
                            {dashboardData?.data?.members.map((member)=>(
                                <div className={style.memberDiv}>
                                    <div className={style.MemberNameAndIcon}>
                                        <div className={style.nameF}>{member?.fullname}</div>
                                    </div>
                                    <div className={style.deleteIcon}>
                                        <Trash2 size={40} />
                                    </div>
                                    <div className={style.acceptanceStatus}>
                                        {member.email}
                                    </div>
                                    <div className={style.joinedAtMem}>
                                        {new Date(member.joined_at).toLocaleDateString("en-US", {month: "long", day:"numeric", year:"numeric"})}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            <div className={style.weekDataAndWorkLoadSts}>
                <div className={style.weekCompletion}>
                    <div className={style.completedThisWeek}>
                        Completed This Week
                    </div>
                </div>

                <div className={style.workLoadStatus}>

                    <div className={style.workLStatus}>Work load status</div>

                    <div className={style.workLstatusD}>
                        <div className={style.toDoData}>
                            <div className={style.typeName}>
                                <span>To-Do</span>
                                <span> {dashboardData?.data?.project_summary.to_do_tasks_numbers ?? "Loading..."} | {toDoPercent} %</span>
                            </div>

                            <div className={style.workloadDataToDo}>
                                <div className={style.barOne}>
                                    <div className={style.barTwo} style={{width: `${toDoPercent}%`, backgroundColor: "red", height:"100%"}} ></div>
                                </div>
                            </div>
                        </div>
                        <div className={style.inprogressData2}>
                            <div className={style.typeName}>
                                <span>In Progress</span>
                                <span> {dashboardData?.data?.project_summary.in_progress_tasks_numbers ?? "Loading..."} | {inProgressPercent} %</span>

                            </div>

                            <div className={style.workloadDataToDo}>
                                <div className={style.barOne}>
                                    <div className={style.barTwo} style={{width: `${inProgressPercent}%`, backgroundColor: "#af2bc1", height:"100%"}} ></div>
                                </div>
                            </div>
                        </div>
                        <div className={style.completeData2}>
                            <div className={style.typeName}>
                                <span>Complete</span>
                                <span> {dashboardData?.data?.project_summary.done_task_numbers ?? "Loading..."} | {donePercent} %</span>
                            </div>

                            <div className={style.workloadDataToDo}>
                                <div className={style.barOne}>
                                    <div className={style.barTwo} style={{width: `${donePercent}%`, backgroundColor: "green", height:"100%"}} ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>

        <div className={style.myTasks}>

        </div>
    </div>
  )
}

export default Dashboard