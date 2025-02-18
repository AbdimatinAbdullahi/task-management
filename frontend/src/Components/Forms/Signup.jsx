import React from 'react'
import { useForm } from 'react-hook-form'
import {useNavigate, Link} from 'react-router-dom'

import styles from '../Forms/Style.module.css'

function Signup() {

    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors }} = useForm() // Destructure some methods from useForm Hook
    
    const onSubmit = (data) =>{
        alert("Form data: ", data)
    }

    return (
    <div className={styles.signupcontainer}>
        <form className={styles.formcontainer} onSubmit={handleSubmit(onSubmit)}>


            <div className={styles.formHeader}>
                <h2>Create Account</h2>
            </div>

            {/* Fullname */}
            <div className={styles.fullname}>
                <input type="text"  placeholder='Enter your fullname'
                    {
                        ...register("fullName",

                        {
                            required: "Full name is required"
                        }
                    )}
                />

                {errors.fullName && <p className={styles.formErrors}> {errors.fullName.message} </p>}

            </div>

            
            {/* Email Container */}
            <div className={styles.emailcontainer} >
                <input type="email" placeholder='Enter your email'
                    {
                        ...register("email", 
                        {
                            required: "Email required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Invalid Email format"
                                }
                    }
                )}
                />
                {errors.email && <p className={styles.formErrors} > {errors.email.message} </p>}
            </div>

            {/* Password Container */}
            <div className={styles.passwordcontainer}>
                <input type="password" placeholder='Create password'
                    {...register("password",  
                        {
                            required: "Password Field required",
                            minLength: {
                                value: 8,
                                message: "Password Must be 8 characters long"
                            }
                        }
                    )}
                />
            {errors.password && <p className={styles.formErrors}> {errors.password.message} </p>}
            </div>


            <button type='submit'>Create Account</button>
            <p className={styles.navsForms} > Already Have an account? <Link to='/login' >Login</Link></p>
        </form>
    </div>
  )
}

export default Signup