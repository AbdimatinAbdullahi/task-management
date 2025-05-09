import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../Styles/Style.module.css'


function LandingPage() {

  const navigate = useNavigate()
  

  return (
    <div className={styles.container} >
        <nav className={styles.navcontainer}>
            <div className={styles.logo}>
                Simplify.com
            </div>

            <div className={styles.navbuttons}>
                <button onClick={() => navigate('/login')} style={{"background": "white", color: "black", border: "1px solid #AF2BC1"}} >Login</button>
                <button onClick={() => navigate('/signup')} >Get Started</button>
            </div>
        </nav>
    </div>
  )
}

export default LandingPage