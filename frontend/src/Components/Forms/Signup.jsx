import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import {useNavigate, Link} from 'react-router-dom'

// import styles from '../../Styles/Style.module.css'
// import styles from '../../Styles/Style.module.css'
import styles from '../.././Styles/Style.module.css'
import { useAuth } from '../../Contexts/AuthContext'

function Signup() {

    const navigate = useNavigate()
    const {signup, errorMesage } = useAuth()
    const [loading, setLoading] = useState(false)
    const [errorMessage, seterrorMessage] = useState('')
    const {register, handleSubmit, formState: {errors }} = useForm() // Destructure some methods from useForm Hook
    
    const onSubmit = async (data) =>{
        setLoading(true)
        await signup(data.fullName, data.email, data.password)
        seterrorMessage(errorMesage)
        setLoading(false)
    }

    return (
    <div className={styles.signupcontainer}>
        <form className={styles.formcontainer} onSubmit={handleSubmit(onSubmit)}>


            <div className={styles.formHeader}>
                <h2>Create Account</h2>
                {errorMessage && <span style={{color: "red"}} > {errorMessage} </span>}
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


            <button type='submit'  style={loading ? {background: "gray"} : {background :"black"}}disabled={loading} > {loading ? 'Creating...': "Create Account"}</button>
            <p className={styles.navsForms} > Already Have an account? <Link to='/login' >Login</Link></p>
        </form>
    </div>
  )
}

export default Signup