import React from 'react'
import { useLocation } from 'react-router-dom'

import styles from './Style.module.css'

function VerifyPage() {

  const location = useLocation()

  const { email } = location.state

  return (
    <div className={styles.verifyContainer} >
          <h2>Enter the code send to Your Email</h2>
        <div className={styles.inputContainer}>
            <input type="text" />
            <button>Verify</button>
        </div>

    </div>
  )
}

export default VerifyPage