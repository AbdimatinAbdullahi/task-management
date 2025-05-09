import  {Link, useNavigate, useLocation} from 'react-router-dom'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'

import styles from '../../Styles/Style.module.css'
import { useAuth } from '../../Contexts/AuthContext'
function Login() {

  const navigate = useNavigate()
  const location = useLocation()
  const {register, handleSubmit, formState: {errors}} = useForm()
  const [serverErrors, setServerErrors] = useState('')
  const [loading, setLoading] = useState(false)
  const {login, errorMesage} = useAuth()



  const onSubmit = async (data) =>{
      setLoading(true)
      login(data.email, data.password)
      setServerErrors(errorMesage)
      setLoading(false)
  }


  return (
    <div className={styles.loginContainer}>
      <form className={styles.formcontainer} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formHeader}>
          <h2>Sign In</h2>
        </div>
        
        {serverErrors && <p className={styles.formErrors}> {serverErrors} </p>}

        <div className={styles.emailcontainer}>
            <input type="email"
              placeholder='Enter your email'
              {...register("email", 
                {
                  required: "Email required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid Email format"
                    }
                }
              )}
            />
            {errors.email && <p className={styles.formErrors}> {errors.email.message} </p>}
        </div>


        <div className={styles.passwordcontainer }>
          <input type="password"
            placeholder='Enter your password'
            {...register("password",
              {
                required: "Password required for login"
              }
            )}
          />
          {errors.password && <p className={styles.formErrors}> {errors.password.message} </p>}
        </div>


        <button type='submit' disabled={loading ? true : false}  style={{ "background" : loading && "gray"}} >{loading ? "Loading..." : "Login"}</button>


          <p className={styles.navsForms} >Don't Have an account? <Link to='/signup' >Create Account</Link></p>
          <p className={styles.navsForms} >Forget Password? <Link to='/reset-password' >Click to Reset</Link></p>


      </form>
    </div>
  )
}

export default Login