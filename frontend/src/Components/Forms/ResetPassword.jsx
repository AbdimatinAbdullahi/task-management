import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'


import styles from '../../Styles/Style.module.css'


function ResetPassword() {

  const {register, formState: {errors} , handleSubmit} = useForm()

  const onSubmit = (data) =>{
    alert(`Email: ${data.email}`)
  }

  return (
    <div className={styles.resetContainer} >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.resetForm} >
        
        
        <div className="resetHeader">
          <h2>Enter your Email to reset Password</h2>
        </div>

        {/* Email input */}

        <div className={styles.resetEmail}>
          <input type="email"
            placeholder='Enter your email'
            {
              ...register(
                "email",
                {
                  required: "Email required to reset password",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid Email format"
                    }
                }                 
              )
            }

          />

          {errors.email && <p className={styles.formErrors} > {errors.email.message}</p>}
        </div>
        

      {/* Button */}

      <button type='submit'>Reset Password</button>

      </form>
    </div>
  )
}

export default ResetPassword