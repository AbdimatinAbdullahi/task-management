import React, { useEffect } from 'react'
import style from '../../Styles/toastify.module.css'
import {X} from 'lucide-react'
function Toastify({message, handleCloseToast}) {
    
    useEffect(() => {
    const timer = setTimeout(() => {
        handleCloseToast(); // triggers the closure
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // cleanup if component unmounts early
    }, [handleCloseToast]);


  return (
    <div className={style.taostContainer} style={{backgroundColor: `${message.backgroundColor}`, borderColor: `${message.borderColor}`, color:`${message.borderColor}`}} >
        <div className={style.tmessage}>{message.message}</div>
        <div className={style.closeIc} onClick={handleCloseToast}> <X size={32}/> </div>
    </div>
  )
}

export default Toastify