import React, { useState } from 'react'
import  {Link, useNavigate} from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import styles from '../Forms/Style.module.css'

function Login() {

  const navigate = useNavigate()
  const {register, handleSubmit, formState: {errors}} = useForm()
  const [serverErrors, setserverErrors] = useState('')
  const [loading, setLoading] = useState(false)




  const onSubmit = async (data) =>{
    setserverErrors("")
    try {
      setLoading(true)

      const response = await axios.post('http://127.0.0.1:5000/auth/login', data)
      console.log('Response from Server', response)


      if (response.status == 200 & response.data.verified === true){
        navigate('/projects')
      }

      else if (response.status == 200 & response.data.verified === false){
        navigate('/verify-email', { state: { "email" : data.email }})
      }

      setLoading(false)
      



    } catch (error) {
      const errorMessage = error.response?.data?.error || "Something Went wrong"
      setserverErrors(error.response.data.error)
      setLoading(false)
    }
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


        <div className={styles.passwordcontainer}>
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