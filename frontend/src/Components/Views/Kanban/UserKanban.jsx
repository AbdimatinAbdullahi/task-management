import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import style from '../../../Styles/userkanban.module.css'

function UserKanban() {
    const location = useLocation()
    useEffect(()=>{
        const queryParams = new URLSearchParams(location.search)
        const email = queryParams.get("email")
        alert(email)
        console.log(email)
    }, [])

  return (
    <div className={style.UserKanban}>
        Hello user 
    </div>
  )
}

export default UserKanban